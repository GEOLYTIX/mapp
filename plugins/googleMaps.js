export default (function () {

    // Logical nullish assignments
    window.google ??= {};

    google.maps ??= {};

    mapp.utils.google ??= {};

    mapp.plugins.googleMaps = async (options, mapview) => {

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

        google.maps.importLibrary
            ? console.warn("The Google Maps JavaScript API only loads once.")
            : (google.maps.importLibrary = (f, ...n) => libraries.add(f) && load().then(() => google.maps.importLibrary(f, ...n)));

        await google.maps.importLibrary("places");

        mapp.utils.google.attributionElement = mapp.utils.html.node`<div>`

        mapp.utils.google.PlacesService = new window.google.maps.places.PlacesService(mapp.utils.google.attributionElement);

        mapp.utils.google.AutocompleteService = new window.google.maps.places.AutocompleteService();
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

})()