export default (function () {

    mapp.ui.locations.entries.image = entry => {

        // Create a new target if not provided with the entry.
        entry.target ??= mapp.utils.html.node`<div class="image-entry-target">`

        if (entry.value) {

          // Render image with src from cloudinary reference as value.
          mapp.utils.render(entry.target, mapp.utils.html.node`
          <div style="position: relative;">
            <img
              style="width: 100%"
              src=${entry.value}
              onclick=${mapp.ui.utils.imagePreview}>
              ${(entry.edit) && mapp.utils.html`
                <button style="
                  width: 30px;
                  height: 30px;
                  position: absolute;
                  right: 0;
                  top: 0;"
                  class="mask-icon trash no"
                  data-name=${entry.value.replace(/.*\//, '').replace(/\.([\w-]{3})/, '')}
                  data-src=${entry.value}
                  onclick=${e => remove(e)}>`}`)

        } else if (entry.edit) {

          // Render input element for image upload if entry can be edited without a value.
          mapp.utils.render(entry.target, uploadInput)
        }

      // Return the entry target.
      return entry.target;

      // Return input element for image upload.
      function uploadInput() {

        return mapp.utils.html.node`
        <div>
        <input
            type="file"
            accept="image/*;capture=camera"
            onchange=${upload}>`
      }
    
      // For upload input onchange event.
      async function upload(e) {
    
        // Disable the location view during upload.
        entry.location.view?.classList.add('disabled')
    
        const reader = new FileReader()
          
        const file = e.target.files[0]
      
        if (!file) return;
    
        reader.onload = readerOnload => {
    
          const img = new Image()
          
          img.onload = async () => {
            
            let
              canvas = mapp.utils.html.node`<canvas>`,
              max_size = 1024,
              width = img.width,
              height = img.height
    
            // resize
            if (width > height && width > max_size) {
              height *= max_size / width
              width = max_size
    
            } else if (height > max_size) {
              width *= max_size / height
              height = max_size
            }
    
            canvas.width = width
            canvas.height = height
    
            canvas.getContext('2d').drawImage(img, 0, 0, width, height)
    
            const dataURL = canvas.toDataURL('image/jpeg', 0.5)
    
            // Upload the image blob to cloudinary.
            const response = await mapp.utils.xhr({
              method: 'POST',
              requestHeader: {
                'Content-Type': 'application/octet-stream'
              },
              url: `${entry.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({
                public_id: file.name.replace(/.*\//, '').replace(/\.([\w-]{3})/, ''),
                resource_type: 'image',
                folder: entry.cloudinary_folder
              })}`,
              body: mapp.utils.dataURLtoBlob(dataURL)
            })

            // Set the location field value for the uploaded image reference.
            await mapp.utils.xhr({
                method: 'POST',
                url:
                  `${entry.location.layer.mapview.host}/api/location/update?` +
                  mapp.utils.paramString({
                    locale: entry.location.layer.mapview.locale.key,
                    layer: entry.location.layer.key,
                    table: entry.location.table,
                    id: entry.location.id,
                  }),
                body: JSON.stringify({ [entry.field] : response.secure_url }),
              })
    
            // Render the image into the target.
            mapp.utils.render(entry.target, mapp.utils.html.node`
              <div style="position: relative;">
                <img 
                  style="width: 100%"
                  src=${response.secure_url}
                  onclick=${mapp.ui.utils.imagePreview}>
                  <button
                    style="
                      width: 30px;
                      height: 30px;
                      position: absolute;
                      right: 0;
                      top: 0;"
                    class="mask-icon trash no"
                    data-name=${response.public_id}
                    data-src=${response.secure_url}
                    onclick=${e => remove(e)}>`)
    
            entry.location.view?.classList.remove('disabled')
          }
    
          img.src = readerOnload.target.result
        }
    
        reader.readAsDataURL(file)
    
        // Reset the input target value.
        e.target.value = ''
      }
    
      async function remove(e) {

        // Confirm whether image should be removed.
        if (!confirm('Remove image?')) return;

        // Remove image from cloudinary folder.
        mapp.utils.xhr(`${entry.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({
          destroy: true,
          public_id: e.target.dataset.name,
          folder: entry.cloudinary_folder
        })}`)

        // Set the location field value for the cloudinary image reference to null.
        await mapp.utils.xhr({
          method: 'POST',
          url:
            `${entry.location.layer.mapview.host}/api/location/update?` +
            mapp.utils.paramString({
              locale: entry.location.layer.mapview.locale.key,
              layer: entry.location.layer.key,
              table: entry.location.table,
              id: entry.location.id,
            }),
          body: JSON.stringify({ [entry.field]: null }),
        })

        // Render uploadInput into target to upload another image.
        mapp.utils.render(entry.target, uploadInput)
      }
    }

})()