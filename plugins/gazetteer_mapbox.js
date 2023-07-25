export default (function () {

    mapp.utils.gazetteer.MAPBOX = (term, gazetteer) => {

        // Abort current dataset query. Onload will not be called.
        gazetteer.xhr?.abort()

        gazetteer.xhr = new XMLHttpRequest()

        // Optional parameter for the geocoding request are referenced here:
        // https://docs.mapbox.com/api/search/geocoding/#forward-geocoding

        gazetteer.xhr.open('GET', `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?` +
            mapp.utils.paramString(gazetteer.options))

        gazetteer.xhr.setRequestHeader('Content-Type', 'application/json')
        gazetteer.xhr.responseType = 'json'
        gazetteer.xhr.onload = e => {

            // The gazetteer input may have been cleared prior to the onload event.
            if (!gazetteer.input.value.length) return;

            if (e.target.status >= 300) return;

            // No results
            if (!e.target.response?.features) {
                gazetteer.list.append(mapp.utils.html.node`
                    <li>
                        <span class="label">${gazetteer.title || gazetteer.provider}</span>
                        <span>${mapp.dictionary.no_results}</span>`)
                return;
            }

            // Ensure that response if a flat array.
            e.target.response.features.forEach(row => {

                gazetteer.list.append(mapp.utils.html.node`
                    <li onclick=${e => {
                        
                        if (gazetteer.callback) return gazetteer.callback(row, gazetteer);

                        mapp.utils.gazetteer.getLocation({
                            label: row.place_name,
                            source: 'Mapbox',
                            lng: row.center[0],
                            lat: row.center[1]
                        }, gazetteer)

                    }}>
                    <span class="label">${gazetteer.title || gazetteer.provider}</span>
                    <span>${row.place_name}</span>`)
            })

        }

        gazetteer.xhr.send()

    }

})()