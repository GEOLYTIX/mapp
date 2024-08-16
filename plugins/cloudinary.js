/**
 * # Cloudinary ☁️
 * ### 📝 Reviewed by
 * - [@dbauszus-glx](https://github.com/dbauszus-glx) (15/02/2024)
 * - [@AlexanderGeere](https://github.com/AlexanderGeere) (19/02/2024)
 * 
 * ### Description
 * - This allows the user to upload images and documents to Cloudinary.
 * - Any image format is accepted as well as a wide range of documents.
 * - A drawer is added to the layer panel.
 * - Uploads can also be deleted from cloudinary (trash icon in the infoj).
 * - Documents are deleted from the db but not Cloudinary.
 * - Three types are available: `images`, `documents`, and `image`.

### Required Parameters 
* 1. if `edit:true` then `cloudinary_folder` must be specified in the entry.
* 2. A `process.env.CLOUDINARY_URL` is required to sign requests for cloudinary.
* 3. `"CLOUDINARY_URL": "cloudinary://***:***g@geolytix"`
* 4. The `CLOUDINARY_URL` can be restrieved from the cloudinary dashboard.

### Database Fields
+ Multiple images can be tied to one location. An array field should be declared in the database e.g. `geom_images _text NULL DEFAULT '{}'::text[];`
+ Documents always require an array field in the db be available, similar to the above.
+ if only one image will be associated to the location, a text field is sufficient.

### Configuration
+ `edit:false` will result in images/documents being displayed. Upload/Delete will not be possible.
+ `expanded` true or false can be passed in to determine whether the dropdowns are expanded by default or not (default is true).
+ `label` will appear on the dropdown drawer. 

### Sample Configuration
* An example of the entry required to display an array of images associated to the location.
```Json
{
  "field": "char_field",
  "type": "image",
  "cloudinary_folder": "test",
  "edit": true,
  "drawer": "Drawer Header"
},
{
  "field": "images",
  "type": "images",
  "cloudinary_folder": "test",
  "edit": true
},
{
  "field": "documents",
  "type": "documents",
  "cloudinary_folder": "test",
  "edit": true
}
```


 * ### How to use 📌
 * - Add the plugin to the `plugins` array in the `workspace.json` file.
 * 
 * @module cloudinary
 * @author @AlexanderGeere
 */

console.log("Cloudinary v4.8")

mapp.ui.locations.entries.image = entry => image(entry)
mapp.ui.locations.entries.images = entry => images(entry)
mapp.ui.locations.entries.documents = entry => documents(entry)

/**
 * @typedef {Object} types
 * @property {Function} image
 * @property {Function} images
 * @property {Function} documents
 */
const types = {
  image,
  images,
  documents
}

const onload = {
  image: imageLoad,
  images: imageLoad,
  documents: docLoad
}

/**
 * This image function takes an entry object and generates HTML elements based on the value property of the entry. Here's an explanation of its functionality
 * @function image
 * @param {Object} entry 
 * @returns {HTML} image
 */
function image(entry) {

  let image

  if (entry.value) {

    // The trash button will only be created when entry is editable.
    const trashBtn = entry.edit && mapp.utils.html`
      <button 
        style="position: absolute; width: 2em; height: 2em; right: 0.5em; top: 0.5em;"
        class="mask-icon trash no"
        data-name=${entry.value.replace(/^.*\//, '').replace(/\.([\w-]{3})/, '')}
        data-src=${entry.value}
        onclick=${e => trash(e, entry)}>`

    image = mapp.utils.html.node`
      <div style="position: relative">
        <img
          style="width: 100%"
          src=${entry.value}
          onclick=${mapp.ui.utils.imagePreview}>
          ${trashBtn}`

  // Edit can only be available if no image is stored.
  } else if (entry.edit) {

    image = mapp.utils.html.node`
      <input 
        type=file class="flat bold wide primary-colour"
        accept="image/*"
        capture="camera"
        onchange=${e => upload(e, entry)}>`
  }

  if (typeof entry.drawer === 'string') {

    // Create a drawer with the entry.drawer value as header.
    return mapp.ui.elements.drawer({
      data_id: "upload-image-drawer",
      class: `raised ${entry.expanded? 'expanded' : ''}`,
      header: mapp.utils.html`
        <h3>${entry.drawer}</h3>
        <div class="mask-icon expander expanded raise"></div>`,
      content: image})

  } else {

    return image
  }
}

/**
 * This images function takes an entry object and generates HTML elements based on the value property of the entry. Here's an explanation of its functionality
 * @function images
 * @param {Object} entry 
 * @returns {HTML} imagesGrid
 */
function images(entry) {

  const images = entry.value?.map(image => {

    // The trash button will only be created when entry is editable.
    const trashBtn = entry.edit && mapp.utils.html`
      <button
        class="mask-icon trash no"
        data-name=${image.replace(/^.*\//, '').replace(/\.([\w-]{3})/, '')}
        data-src=${image}
        onclick=${e => trash(e, entry)}>`

    return mapp.utils.html`
      <div>
        <img 
          src=${image}
          onclick=${mapp.ui.utils.imagePreview}>
          ${trashBtn}`

  }) || []

  // Push upload input into images array.
  if (entry.edit) images.push(mapp.utils.html.node`
    <div class="mask-icon add-photo pos-center">
      <input
        type="file"
        accept="image/*"
        capture="camera"
        onchange=${e => upload(e, entry)}>`)

  if (!images.length) return;

  const imagesGrid = mapp.utils.html.node`
    <div class="images-grid">${images}`

  if (typeof entry.drawer === 'string') {

    return mapp.ui.elements.drawer({
      data_id: "upload-image-drawer",
      class: `raised ${entry.expanded? 'expanded' : ''}`,
      header: mapp.utils.html`
        <h3>${entry.drawer}</h3>
        <div class="mask-icon expander expanded raise"></div>`,
      content: imagesGrid
    })

  } else {

    return imagesGrid
  }
}

/**
 * This documents function takes an entry object and generates HTML elements based on the value property of the entry. Here's an explanation of its functionality
 * @function documents
 * @param {Object} entry 
 * @returns {HTML} docslist
 */
function documents(entry) {

  const docs = entry.value?.map(doc => {

    const trashBtn = entry.edit && mapp.utils.html`
      <button
        class="mask-icon trash no"
        data-name=${doc.replace(/^.*\//, '').replace(/\.([\w-]{3})/, '')}
        data-href=${doc}
        onclick=${e => trash(e, entry)}>`

    return mapp.utils.html`
      <div class="link-with-img">
        ${trashBtn}<a
          target="_blank"
          href=${doc}>${doc.replace(/^.*\//, '').replace(/\.([\w-]{3})/, '')}`

  }) || []

  entry.edit && docs.unshift(mapp.utils.html`<input 
    type=file class="flat bold wide primary-colour"
    accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document;"
    onchange=${e => upload(e, entry)}>`)

  if (!docs.length) return;

  const docsList = mapp.utils.html.node`<div>${docs}`

  if (typeof entry.drawer === 'string') {
    return mapp.ui.elements.drawer({
      data_id: "upload-document-drawer",
      class: `raised ${entry.expanded? 'expanded' : ''}`,
      header: mapp.utils.html`
        <h3>${entry.drawer}</h3>
        <div class="mask-icon expander expanded raise"></div>`,
      content: docsList
    })
  } else {

    return docsList
  }
}

/**
 * Function used to upload image/doc 
 * @function upload
 * @param {event} e 
 * @param {Object} entry  
 */
async function upload(e, entry) {

  // Location view must disabled while uploading resource.
  entry.location.view?.classList.add('disabled')

  const reader = new FileReader()

  if (!e.target.files[0]) return;

  entry.file = e.target.files[0]

  reader.onload = e => onload[entry.type](e, entry)

  reader.readAsDataURL(entry.file)
}

/**
 * The imageLoad function handles the loading and processing of an image file.
 * @function imageLoad
 * @param {event} e 
 * @param {Object} entry 
 */
function imageLoad(e, entry) {

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
    const public_id = entry.file.name.replace(/^.*\//, '').replace(/\.([\w-]{3})/, '') + entry.suffix_date ? `@${Date.now()}` : '';

    const signedUrl = await getSignedUrl(entry, public_id)

    const data = new FormData()
    data.append('file', dataURL)

    const response = await fetch(signedUrl, {
      method: 'post',
      body: data
    })

    if (!response || response.error) {
      const errorDetail = response?.error?.message? `Error: ${response.error.message}` : '';
      const errorMessage = `Cloudinary Image upload failed! ${errorDetail}`;
      alert(errorMessage);
      return;
    }

    const responseJson = await response.json()

    if (entry.type === 'image') {

      // Only a single image is supported by the entry.type.
      entry.value = responseJson.secure_url

    } else {

      // Add the secure_url to the entry values array and update the location.
      entry.value = Array.isArray(entry.value) ? entry.value.concat([responseJson.secure_url]) : [responseJson.secure_url]
    }

    postUpdate(entry)
  }

  img.src = e.target.result
}

/**
 * The docLoad function handles the loading and processing of an image file.
 * @function docLoad
 * @param {event} e 
 * @param {Object} entry 
 */
async function docLoad(e, entry) {

  const date = new Date();
  const stamp = `${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`
  const file_type = entry.file.name.substring(entry.file.name.lastIndexOf('.'))
  const public_id = `${entry.file.name.replace(file_type, '')}-${stamp}${file_type}`;

  const signedUrl = await getSignedUrl(entry, public_id)

  const data = new FormData()
  data.append('file', e.target.result.toString())

  const response = await fetch(signedUrl, {
    method: 'post',
    body: data
  })

  if (!response || response.error) {
    const errorDetail = response?.error?.message ? ` Error: ${response.error.message}` : '';
    const errorMessage = `Cloudinary document upload failed!${errorDetail}`;
    alert(errorMessage);
    return;
  }

  // Add the secure_url to the entry values array and update the location.
  const responseJson = await response.json()
  entry.value = Array.isArray(entry.value) ? entry.value.concat([responseJson.secure_url]) : [responseJson.secure_url]

  postUpdate(entry)
}

/**
 * The trash function handles the deletion an image file.
 * @function trash
 * @param {event} e 
 * @param {Object} entry 
 */
async function trash(e, entry) {

  if (!confirm('Remove item?')) return;
  const public_id = decodeURIComponent(e.target.dataset.name);
  const signedUrl = await getSignedUrl(entry, public_id, e)

  // Send request to cloudinary to destroy resource.
  await fetch(signedUrl, { method: 'post' })

  // Remove the resource link from the entry values array and update the location.
  const valueSet = new Set(entry.value)

  valueSet.delete(e.target.dataset.src || e.target.dataset.href)

  if (entry.type === 'image') {
    entry.value = null

  } else {
    entry.value = valueSet.size ? Array.from(valueSet) : null;
  }

  postUpdate(entry)
}

/**
 * The postUpdate function handles updating a location with the new image/doc.
 * @function postUpdate 
 * @param {Object} entry 
 */
async function postUpdate(entry) {

  entry.location.view?.classList.add('disabled')

  // Update the geometry field value.
  const updateBody = { [entry.field]: entry.value }
  
  await mapp.utils.xhr({
    method: 'POST',
    url:
      `${entry.location.layer.mapview.host}/api/query?` +
      mapp.utils.paramString({
        template: 'location_update',
        locale: entry.location.layer.mapview.locale.key,
        layer: entry.location.layer.key,
        table: entry.location.table,
        id: entry.location.id,
      }),
    body: JSON.stringify(updateBody),
  })

  //Keep the drawer open after upload or delete
  if(entry.drawer){
    entry.expanded = true
  }
  const content = types[entry.type](entry)

  mapp.utils.render(entry.node, content)

  entry.location.view?.classList.remove('disabled')
}

/**
 * Function to generate a signed URL for the CRUD of an Image/Doc
 * @param {Object} entry 
 * @param {String} public_id 
 * @param {event} e 
 * @returns {String} signedURL
 */
async function getSignedUrl(entry, public_id, e) {
  public_id = e ? decodeURIComponent(e.target.dataset.name) : public_id;
  const response = await fetch(`${entry.location.layer.mapview.host}/api/sign/cloudinary?${mapp.utils.paramString({
    destroy: e ? true : false,
    public_id: public_id,
    folder: entry.cloudinary_folder
  })}`);

  const respJson = await response.json();
  return respJson.signedUrl
}