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

            console.log(response)

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

            let response = await mapp.utils.xhr(`${mapview.host}/api/provider/s3?` +
                mapp.utils.paramString({
                    command: 'trash',
                    key,
                    bucket: options.bucket,
                    region: options.region
                }))

            console.log(response)

            list()
        }

        async function getSignedURL(params) {

            let signedURL = await mapp.utils.xhr(`${mapview.host}/api/provider/s3?` +
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

            console.log(file)

            //Getting the file from the input and setting the size
            const blob = new Blob([file]);

            //We will need to use a multipart upload if the file is greater than 4.5mb
            if (blob.size <= 1024 * 1024 * 4.5) {

                await mapp.utils.xhr({
                    method: "POST",
                    url: `${mapview.host}/api/provider/s3?` +
                        mapp.utils.paramString({
                            command: 'upload',
                            key: file.name,
                            region: options.region,
                            bucket: options.bucket
                        }),
                    requestHeader: {
                        'Content-Type': 'application/octet-stream'
                    },
                    body: blob
                });

                list();

                return;
            }

            //Init the multipart upload. This will return an object with id from the api.
            const multipartUpload = await mapp.utils.xhr({
                method: "GET",
                url: `${mapview.host}/api/provider/s3?` +
                    mapp.utils.paramString({
                        command: 'getuploadID',
                        key: file.name,
                        region: options.region,
                        bucket: options.bucket
                    })
            });

            //Set the chunk size and determine the number of chunks by dividing the file size by the chunk size and then round up.
            const chunkSize = 1024 * 1024 * 5;
            const chunks = Math.ceil(blob.size / chunkSize, chunkSize);

            //Chunk has to start at 0, but when referenced in the part number we have to increment by 1.
            let chunk = 0;
            let uploadPartResults = []
            let uploadPromises = []
            let uploadCount = 0;

            //Push the chunks of data to a UploadPart promise
            while (chunk < chunks) {

                //Determine the offset of data per chunk
                let offset = chunk * chunkSize;

                //get the signedurl from the s3 provider
                //You need to provide what kind of method to the provider, 
                //the uploadid, key, and what part we are uploading.
                let signedURL = await mapp.utils.xhr({
                    method: "GET",
                    url: `${mapview.host}/api/provider/s3?` +
                        mapp.utils.paramString({
                            command: 'uploadpart',
                            uploadid: multipartUpload.UploadId,
                            key: file.name,
                            partnumber: chunk + 1,
                            region: options.region,
                            bucket: options.bucket
                        })
                });

                //Creating the promise to push into an array
                //This promise also need to resolve the entire target, so we can return the ETag header.
                let uploadPromise = mapp.utils.xhr({
                    method: "PUT",
                    url: signedURL,
                    body: blob.slice(offset, offset + chunkSize),
                    requestHeader: {
                        'Content-Type': 'application/octet-stream'
                    },
                    resolveTarget: true
                }).then((result) => {
                    uploadCount++;
                    console.log(`${Math.round(uploadCount / chunks * 100, 0)}%`)
                    return result;
                });

                //Push promise and increment the chunk counter.
                uploadPromises.push(uploadPromise);
                chunk++;
            }

            //Count for the part number when pushing upload results.
            let count = 1;

            //After all promises have been settled, then we will push the upload results
            //These results are required to complete the upload.
            Promise.allSettled(uploadPromises).
                then((results) => results.forEach((result) => {
                    uploadPartResults.push({
                        PartNumber: count,
                        ETag: result.value.getResponseHeader('ETag')
                    });
                    count++;
                }
                )).then(async () => {

                    //After all settled and pushed, we complete the Multipartupload.
                    let completeUploadRes = await mapp.utils.xhr({
                        method: "POST",
                        url: `${mapview.host}/api/provider/s3?` +
                            mapp.utils.paramString({
                                uploadid: multipartUpload.UploadId,
                                key: file.name,
                                command: 'completeUpload',
                                region: options.region,
                                bucket: options.bucket
                            }),
                        body: JSON.stringify(uploadPartResults)
                    });

                    list();

                });
        }

    }
}
)()