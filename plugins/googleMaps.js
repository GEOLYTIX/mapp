export default (function () {

    // Logical nullish assignments
    window.google ??= {};

    google.maps ??= {};

    mapp.utils.google ??= {};

    mapp.plugins.googleMaps = async (options, mapview) => {

        if (!options.key) {

            console.warn(`A Google API key is required to load the GoogleMaps plugin.`)
            return;
        }

        mapp.utils.google.key = options.key;

        var
            promise,
            libraries = new Set(),
            load = () => promise
                || (promise = new Promise(async (resolve, reject) => {

                    let el = document.createElement("script")

                    let searchParams = new URLSearchParams()

                    searchParams.set("libraries", [...libraries] + "");

                    for (var key in options) searchParams.set(
                        key.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
                        options[key]
                    );

                    searchParams.set("callback", "google.maps.__ib__");

                    el.src = "https://maps.googleapis.com/maps/api/js?" + searchParams;

                    google.maps.__ib__ = resolve;
                    el.onerror = () => (h = reject(Error("The Google Maps JavaScript API could not load.")));
                    el.nonce = document.querySelector("script[nonce]")?.nonce || "";
                    document.head.append(el);
                    
                }));

        try {

            google.maps.importLibrary
                ? console.warn("The Google Maps JavaScript API only loads once.")
                : (google.maps.importLibrary = (f, ...n) => libraries.add(f) && load().then(() => google.maps.importLibrary(f, ...n)));

            await google.maps.importLibrary("places");

            mapp.utils.google.attributionElement = mapp.utils.html.node`<div>`

            mapp.utils.google.PlacesService = new window.google.maps.places.PlacesService(mapp.utils.google.attributionElement);

            mapp.utils.google.AutocompleteService = new window.google.maps.places.AutocompleteService();

        } catch (err) {
            console.error(err)
        }
    }

    mapp.utils.gazetteer.GOOGLE = (term, gazetteer) => {

        mapp.utils.google.AutocompleteService.getPlacePredictions(Object.assign(
            { input: term }, gazetteer.options)).then(response => {

                response.predictions.forEach(prediction => {

                    gazetteer.list.append(mapp.utils.html.node`
                        <li
                            onclick=${e => {

                            if (gazetteer.callback) return gazetteer.callback(prediction, gazetteer);

                            mapp.utils.google.PlacesService.getDetails({
                                placeId: prediction.place_id,
                                fields: ['geometry']
                            }, (place, status) => {

                                mapp.utils.gazetteer.getLocation({
                                    label: prediction.description,
                                    source: 'Google',
                                    lng: place.geometry.location.lng(),
                                    lat: place.geometry.location.lat()
                                }, gazetteer)
                            });

                        }}>
                            <span class="label">Google</span>
                            <span>${prediction.description}</span>`)

                })
            })

    }

    mapp.ui.locations.entries.streetview = entry => {

        const pin = entry.location.infoj.find(entry => entry.type === 'pin')

        if (!pin || !pin.value) {
            console.warn('You must provide a pin type entry in the infoj to use streetview')
            return;
        };

        const lnglat = ol.proj.toLonLat(
            pin.value,
            `EPSG:${pin.srid || entry.location.layer.mapview.srid}`,
            'EPSG:4326')

        const node = mapp.utils.html.node`
          <a
            target="_blank"
            href=${`https://www.google.com/maps?cbll=${lnglat[1]},${lnglat[0]}&layer=c`}>`

        mapp.utils.xhr({
            url: `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lnglat[1]},${lnglat[0]}&source=outdoor&key=${entry.key || mapp.utils.google.key}`,
            requestHeader: null
        }).then(response => {

            if (response.status !== 'OK') return;

            const src = `https://maps.googleapis.com/maps/api/streetview?location=${lnglat[1]},${lnglat[0]}&source=outdoor&size=300x230&key=${entry.key || mapp.utils.google.key}`

            node.append(mapp.utils.html.node`<img src=${src}>`)

        })

        return node
    }

    mapp.plugins.streetview = (plugin, mapview) => {

        mapview.interactions.streetview_popup = function (params = {}) {

            // Finish the current interaction.
            mapview.interaction?.finish()

            mapview.interaction = {
                finish,
                ...params
            }

            // Add click event for streetview popup.
            mapview.Map.on('click', click)

            function click(e) {

                const lnglat = ol.proj.toLonLat(e.coordinate);

                mapp.utils.xhr({
                    url: `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lnglat[1]},${lnglat[0]}&source=outdoor&key=${mapp.utils.google.key}`,
                    requestHeader: null
                }).then(response => {

                    if (response.status !== 'OK') return;

                    const content = mapp.utils.html.node`
                  <div>
                  <a
                    target="_blank"
                    href=${`https://www.google.com/maps?cbll=${lnglat[1]},${lnglat[0]}&layer=c`}>
                    <img src=${`https://maps.googleapis.com/maps/api/streetview?location=${lnglat[1]},${lnglat[0]}&source=outdoor&size=300x230&key=${mapp.utils.google.key}`}>`

                    mapview.popup({
                        content,
                        autoPan: true,
                    });

                })
            }

            function finish() {

                mapview.Map.un('click', click)

                // Execute callback if defined as function.
                if (mapview.interaction.callback instanceof Function) {

                    // Must be run delayed to prevent a callback loop.
                    const callback = mapview.interaction.callback
                    setTimeout(callback, 400)
                }

                delete mapview.interaction

            }

        }

        // Find the btnColumn element.
        const btnColumn = document.getElementById('mapButton');

        // Append the plugin btn to the btnColumn.
        btnColumn && btnColumn.append(mapp.utils.html.node`
        <button
          title="Streetview Popup"
          onclick=${streetview_popup}>
          <div style="background-image:url(https://upload.wikimedia.org/wikipedia/commons/e/e0/Google_Street_View_icon.svg)">`);

        function streetview_popup(e) {

            // Cancel streetview interaction if active.
            if (e.target.classList.contains('active')) return mapview.interactions.highlight()

            e.target.classList.add('active')

            mapview.interactions.streetview_popup({
                callback: () => {

                    e.target.classList.remove('active')

                }
            })

        }

    }

})()
