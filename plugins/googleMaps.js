/**
The module adds the googleMaps method to mapp.plugins to load the Google MAPS API scripty with keys defined in the plugin config.

The googleGazzetteer method is added to mapp.utils.gazetteer to provide a gazetteer interface to the Google Places service.

The mapp.ui.locations.entries.streetview method is added to provide a streetview in the location view.

A streetview plugin method mapp.plugins.streetview is added to provide a custom interaction for a streetview popup on map click.

### Updating the Content Security Policy
The Content Security Policy (CSP) of all deployed instances using this must be updated. 
1. Update the `connect-src` to include `maps.googleapis.com developers.google.com`.
2. Update the `script-src` to include `maps.googleapis.com`.
3. Update the `img-src` to include `maps.googleapis.com developers.google.com`.

@module googleMaps
@author @dbauszus-glx
*/

console.log('googleMaps v4.8')

mapp.utils.merge(mapp.dictionaries, {
  en: {
    googleMaps_no_streetview_found: 'No Google Streetview Found.',
    googleMaps_streetview_btn_title: 'Streetview (Google)'
  }
});

document.head.append(mapp.utils.html.node`<style>
.location-view-grid {
  & .streetview {
    & img {
      width: 100%;
    }
  }
}`)

// Logical nullish assignments
window.google ??= {};

google.maps ??= {};

mapp.utils.google ??= {};

/**
@function googleMaps

@description
### mapp.plugins.googleMaps(options, mapview)
The plugin method will be called with the options from the locale. The method uses [dynamic library import](https://developers.google.com/maps/documentation/javascript/load-maps-js-api) to load the Google Places library. A key for the API must be provided in the options argument.

```js
"plugins": [
 "${PLUGINS}/googleMaps.js"
],
"googleMaps": {
 "key": "***",
 "v": "weekly",
 "libraries": "places"
},
```
@param {Object} options 
@param {Object} mapview 
@property {string} options.key A valid Google API key.
*/
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

/**
@function googleGazetteer

@description
### mapp.utils.gazetteer.GOOGLE(term, gazetteer)
- A  **gazetteer** method will be assigned to the gazetteer utils.
- The provider key for the locale gazetteer configuration is `GOOGLE`.
- The maxZoom will limit the zoom for the flyto location method.
- A streetview image can be added to the gazetteer location if provided with a Google key for the streetview API.
- The options object can be used to refine the [AutocompletionRequest](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest).

```js
"gazetteer": {
 "provider": "GOOGLE",
 "maxZoom": 10,
 "streetview": {
  "key": "***"
 },
 "options": {
  "componentRestrictions": {
   "country": "UK"
  }
 }
}
```

@param {String} term 
@param {Object} gazetteer 
*/
mapp.utils.gazetteer.GOOGLE = googleGazetteer

function googleGazetteer(term, gazetteer) {

  mapp.utils.google.AutocompleteService.getPlacePredictions(Object.assign(
    { input: term }, gazetteer.options)).then(response => {

      response.predictions.forEach(prediction => {

        gazetteer.list.append(mapp.utils.html.node`<li
          onclick=${() => {

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
          <span class="label">
            <img style="height: 1em;" src="https://developers.google.com/static/maps/documentation/images/google_on_non_white.png">
          </span>
          <span>${prediction.description}</span>`)

      })
    })
}

/**
@function streetview_entry
@description
### mapp.ui.locations.entries.streetview(entry)
The `type:streetview` entry method will check whether a streetview image exists at the given location (from pin geometry) and creates a link for the streetview image.

- If no streetview data is found, a message is displayed indicating this. 
- An `entry.nullValue` can be supplied. This text will be used if no streetview data is returned.

@param {Object} entry 
@returns {HTMLElement} Returns a HTMLElement containing the streetview element.
*/
mapp.ui.locations.entries.streetview = streetview_entry

function streetview_entry(entry) {

  if (!entry.lnglat) {

    const pin = entry.location.infoj.find(entry => entry.type === 'pin')

    if (!pin || !pin.value) {
      console.warn('You must provide a pin type entry in the infoj to use streetview')
      return;
    };

    entry.lnglat = ol.proj.toLonLat(
      pin.value,
      `EPSG:${pin.srid || entry.location.layer.srid || entry.location.layer.mapview.srid}`,
      'EPSG:4326')
  }

  const node = mapp.utils.html.node`<div>`

  if (!entry.apiKey) {
    console.warn('entry type:streetview requires a entry.apiKey value.')
  }

  entry.apiKey ??= entry.key || mapp.utils.google.key

  mapp.utils.xhr({
    url: `https://maps.googleapis.com/maps/api/streetview/metadata?location=${entry.lnglat[1]},${entry.lnglat[0]}&source=outdoor&key=${entry.apiKey}`,
    requestHeader: null
  }).then(response => {

    if (response.status === 'ZERO_RESULTS') {

      node.innerHTML = entry.nullValue || mapp.dictionary.googleMaps_no_streetview_found

      return;
    }

    if (response.status !== 'OK') return;

    const src = `https://maps.googleapis.com/maps/api/streetview?location=${entry.lnglat[1]},${entry.lnglat[0]}&source=outdoor&size=300x230&key=${entry.apiKey}`

    node.replaceWith(mapp.utils.html.node`
    <a target="_blank"
    href=${`https://www.google.com/maps?cbll=${entry.lnglat[1]},${entry.lnglat[0]}&layer=c`}>
    <img src=${src}>`)
  })

  return node
}

/**
@function streetview

@description
### mapp.plugins.streetview
The streetview plugin adds a button to the btnColumn. 

When pressed activates a streetview interaction. Click on map opens a popup with the streetview if available.

@param {Object} plugin 
@param {Object} mapview
*/
mapp.plugins.streetview = streetview

function streetview(plugin, mapview) {

  const btnColumn = document.getElementById('mapButton');

  if (!btnColumn) return;

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

        if (response.status !== 'OK') {
          alert('No Streetview available at location.')
          return;
        }

        const content = mapp.utils.html.node`<div><a
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

      // Remove any current popup.
      mapview.popup(null)

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

  // Append the plugin btn to the btnColumn.
  btnColumn.append(mapp.utils.html.node`
    <button
      title=${mapp.dictionary.googleMaps_streetview_btn_title}
      onclick=${streetview_popup}>
      <div class="mask-icon" style="mask-image:url(https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/streetview/default/24px.svg)">`);

  function streetview_popup(e) {

    if (e.target.classList.toggle('active')) {

      // Begin streetview interaction. Finished current interaction.
      mapview.interactions.streetview_popup({
        callback: () => {

          e.target.classList.remove('active')
        }
      })

    } else {

      // Enable highlight interaction. Finishes the streetview interaction.
      mapview.interactions.highlight()
    }
  }
}
