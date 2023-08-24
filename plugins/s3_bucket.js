export default (function () {

    mapp.plugins.s3_bucket = (options, mapview) => {

        // The drawer class is required for disable to work.
        options.panel = mapp.utils.html.node`<div class="drawer" style="border: 1px solid #333">`

        // Append the plugin panel to layers list.
        document.getElementById("layers").append(options.panel)

        // Render the panel.
        list()

        async function list() {

            // Get list of files in bucket.
            let response = await mapp.utils.xhr(`${mapview.host}/api/provider/s3?` +
                mapp.utils.paramString({
                    command: 'list',
                    region: options.region,
                    bucket: options.bucket
                }))

            if (!response) {
                console.warn(`${mapview.host}/api/provider/s3 list command failed`)
                return;
            }

            // Render the region and title. This will clear existing content.
            mapp.utils.render(options.panel, mapp.utils.html.node`<div style="font-weight: bold;">${options.region}/${options.bucket}:`)

            // Add file records with delete button.
            response.Contents.forEach(entry => options.panel.append(mapp.utils.html.node`
                <div class="link-with-img">
                    <button
                        class="mask-icon trash no"
                        onclick=${() => trash(entry.Key)}>
                    </button>
                    <span class="hover" onclick=${() => getSignedURL({
                key: entry.Key,
                bucket: options.bucket,
                region: options.region
            })}>${entry.Key}`))

            // Append input to select files for upload.
            options.panel.append(mapp.utils.html.node`
                <input 
                    type=file class="flat bold wide primary-colour 
                    type="file" 
                    accept=".geojson,.json,.csv"
                    onchange=${upload}>`)

            options.panel.classList.remove('disabled');
        }

        async function trash(key) {

            options.panel.classList.add('disabled');

            const response = await mapp.utils.xhr(`${mapview.host}/api/provider/s3?` +
                mapp.utils.paramString({
                    command: 'trash',
                    key,
                    bucket: options.bucket,
                    region: options.region
                }))

            if (!response) {
                console.warn(`${mapview.host}/api/provider/s3 trash command failed`)
            }

            list()
        }

        async function getSignedURL(params) {

            const signedURL = await mapp.utils.xhr(`${mapview.host}/api/provider/s3?` +
                mapp.utils.paramString({
                    command: 'get',
                    key: params.key,
                    bucket: params.bucket,
                    region: params.region
                }))

            window.open(signedURL, '_blank')
        }

        async function upload(e) {

            options.panel.classList.add('disabled');

            let file = e.target.files[0]

            //Getting the file from the input and setting the size
            const blob = new Blob([file]);

            const signedURL = await mapp.utils.xhr(`${mapview.host}/api/provider/s3?` +
                mapp.utils.paramString({
                    command: 'put',
                    key: file.name,
                    bucket: options.bucket,
                    region: options.region
                }))

            if (!signedURL) {
                console.warn(`${mapview.host}/api/provider/s3 put command failed to sign URL`)
                list();
                return;
            }

            const response = await fetch(signedURL, {
                method: "PUT",
                headers: {
                    "Content-Length": blob.size,
                    'Content-Type': 'application/octet-stream'
                },
                body: blob,
            });

            console.log(response)

            list();
        }

    }
}
)()