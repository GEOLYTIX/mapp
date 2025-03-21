/**
The plugin imports the Google Maps JS API loader from esm.

The googleMaps() method is added to the mapp.plugins{} to import the Google Places library through the Google Maps JS API Loader.

The GOOGLE() method is added to mapp.utils.gazetteer{} to provide a gazetteer interface to the Google Places service.

The locations.entries.streetview() method is added to the mapp.ui library.

The streetview() method is added to the mapp.plugins{} to add a button which toggles a mapview click interaction as interface to the Google Streetview service.

### Updating the Content Security Policy
ESM must be allowed as a script source in the CSP directive.

Update the `connect-src` to include `maps.googleapis.com developers.google.com`.
Update the `script-src` to include `maps.googleapis.com`.
Update the `img-src` to include `maps.googleapis.com developers.google.com`.

@module googleMaps
@author @dbauszus-glx
*/

import { Loader } from 'https://esm.sh/@googlemaps/js-api-loader';

mapp?.utils?.versionCheck('4.13')
  ? console.log(`googleMaps v4.13.0`)
  : console.warn(
      `Mapp version below v4.13.0. Please use the v4.8.0 googleMaps plugin instead.`,
    );

mapp.utils.merge(mapp.dictionaries, {
  en: {
    googleMaps_no_streetview_found: 'No Google Streetview Found.',
    googleMaps_streetview_btn_title: 'Streetview (Google)',
  },
});

document.head.append(mapp.utils.html.node`<style>
.location-view-grid {
  & .streetview {
    & img {
      width: 100%;
    }
  }
}`);

mapp.utils.google ??= {};

/**
@function googleMaps

@description
The googleMaps method will be called with the googleMaps config object from the locale.

The config object requires a valid google maps key for the Google Maps JS API Loader.

The loader will be used to import the places library.

The PlacesService, and AutocompleteService are assigned to the mapp.utils.google object.

```js
'googleMaps': {
 'key': '***'
},
```

@param {Object} options 
@param {Object} mapview 
@property {string} options.key A valid Google API key.
*/
mapp.plugins.googleMaps = async (googleMaps) => {
  if (!googleMaps.key) {
    console.warn(`A Google API key is required to load the GoogleMaps plugin.`);
    return;
  }

  mapp.utils.google.key = googleMaps.key;

  const loader = new Loader({
    apiKey: googleMaps.key,
    version: 'weekly',
  });

  await loader.importLibrary('places');

  mapp.utils.google.attributionElement = mapp.utils.html.node`<div>`;

  mapp.utils.google.PlacesService = new window.google.maps.places.PlacesService(
    mapp.utils.google.attributionElement,
  );

  mapp.utils.google.AutocompleteService =
    new window.google.maps.places.AutocompleteService();
};

mapp.utils.gazetteer.GOOGLE = googleGazetteer;

/**
@function googleGazetteer

@description
The method as mapp.utils.gazetteer.GOOGLE.

The gazetteer method forwards a search term to the Google Places AutocompleteService to get place predictions to pupolate the gazetteer dropdown element.

```js
'gazetteer': {
 'provider': 'GOOGLE',
 'maxZoom': 10,
 'streetview': {
  'key': '***'
 },
 'options': {
  'componentRestrictions': {
   'country': 'UK'
  }
 }
}
```

@param {String} term 
@param {Object} gazetteer 
*/
function googleGazetteer(term, gazetteer) {
  mapp.utils.google.AutocompleteService.getPlacePredictions({
    ...{ input: term },
    ...gazetteer.options,
  }).then((response) => {
    response.predictions.forEach((prediction) => {
      gazetteer.list.append(gazetteerListItem(gazetteer, prediction));
    });
  });
}

/**
@function gazetteerListItem

@description
This method is required by the googleGazetteer to populate the gazetteer dropdown with predictions from the AutocompleteService.

@param {Object} gazetteer configuration object
@param {Object} prediction - result returned by Google Place Predictions Service
*/
function gazetteerListItem(gazetteer, prediction) {
  return mapp.utils.html.node`<li onclick=${() => {
    if (gazetteer.callback) return gazetteer.callback(prediction, gazetteer);

    mapp.utils.google.PlacesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['geometry'],
      },
      (place, status) => {
        mapp.utils.gazetteer.getLocation(
          {
            label: prediction.description,
            source: 'Google',
            lng: place.geometry.location.lng(),
            lat: place.geometry.location.lat(),
          },
          gazetteer,
        );
      },
    );
  }}>
  <span class="label">
  <img style="height: 1em;" 
  src="https://developers.google.com/static/maps/documentation/images/google_on_non_white.png"/>
  </span>
  <span>${prediction.description}</span>`;
}

/**
@function streetview_entry
@description
The location view entry method requires a valid Google Maps API key in the entry config.

The googleMaps.key used for the Google Maps JS API Loader will be used as fallback if defined in the locale.

The method will use a location entry.pin latitude and longitude to request a streetview image from the Google Maps Streetview API.

A node with the embedded image will be returned to the location view infoj method.

@param {Object} entry 
@property {string} [options.apiKey] A valid Google API key.
@returns {HTMLElement} Returns a HTMLElement containing the streetview element.
*/
mapp.ui.locations.entries.streetview = streetview_entry;

function streetview_entry(entry) {
  if (!entry.lnglat) {
    const pin = entry.location.infoj.find((entry) => entry.type === 'pin');

    if (!pin?.value) {
      console.warn(
        'You must provide a pin type entry in the infoj to use streetview',
      );
      return;
    }

    entry.lnglat = ol.proj.toLonLat(
      pin.value,
      `EPSG:${
        pin.srid ||
        entry.location.layer.srid ||
        entry.location.layer.mapview.srid
      }`,
      'EPSG:4326',
    );
  }

  const node = mapp.utils.html.node`<div>`;

  if (!entry.apiKey) {
    console.warn('entry type:streetview requires a entry.apiKey value.');
  }

  entry.apiKey ??= entry.key || mapp.utils.google.key;

  mapp.utils
    .xhr({
      url: `https://maps.googleapis.com/maps/api/streetview/metadata?location=${entry.lnglat[1]},${entry.lnglat[0]}&source=outdoor&key=${entry.apiKey}`,
      requestHeader: null,
    })
    .then((response) => {
      if (response.status === 'ZERO_RESULTS') {
        node.innerHTML =
          entry.nullValue || mapp.dictionary.googleMaps_no_streetview_found;

        return;
      }

      if (response.status !== 'OK') return;

      const src = `https://maps.googleapis.com/maps/api/streetview?location=${entry.lnglat[1]},${entry.lnglat[0]}&source=outdoor&size=300x230&key=${entry.apiKey}`;

      node.replaceWith(mapp.utils.html.node`
    <a target='_blank'
    href=${`https://www.google.com/maps?cbll=${entry.lnglat[1]},${entry.lnglat[0]}&layer=c`}>
    <img src=${src} alt="Google Streetview for this location">`);
    });

  return node;
}

mapp.plugins.streetview = streetview;

/**
@function streetview

@description
The streetview plugin method will add a button to the mapp default view mapButton node.

The button will toggle a mapview.Map click interaction. The location from the click event will be passed to the Google Maps Streetview API to request a streetview image near the location.

The [plugin] streetview.apiKey will be used for request to the Streetview API as fallback if the Google Maps JS API Loader is not configured in the locale.

@param {Object} plugin 
@param {Object} mapview
@property {string} [plugin.apiKey] A valid Google API key.
*/
function streetview(plugin, mapview) {
  const btnColumn = document.getElementById('mapButton');

  if (!btnColumn) return;

  mapview.interactions.streetview_popup = function (params = {}) {
    // Finish the current interaction.
    mapview.interaction?.finish();

    mapview.interaction = {
      finish,
      ...params,
    };

    // Add click event for streetview popup.
    mapview.Map.on('click', click);

    function click(e) {
      const lnglat = ol.proj.toLonLat(e.coordinate);

      mapp.utils
        .xhr({
          url: `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lnglat[1]},${lnglat[0]}&source=outdoor&key=${mapp.utils.google.key || plugin.apiKey}`,
          requestHeader: null,
        })
        .then((response) => {
          if (response.status !== 'OK') {
            mapp.ui.elements.alert({
              text: 'No Streetview available at location.',
            });
            return;
          }

          const latlng = `${lnglat[1]},${lnglat[0]}`;

          const href = `https://www.google.com/maps?cbll=${latlng}&layer=c`;

          const src = `https://maps.googleapis.com/maps/api/streetview?location=${latlng}&source=outdoor&size=300x230&key=${mapp.utils.google.key || plugin.apiKey}`;

          const content = mapp.utils.html.node`<div><a
          target='_blank'
          href=${href}>
          <img src=${src}>`;

          mapview.popup({
            content,
            autoPan: true,
          });
        });
    }

    function finish() {
      // Remove any current popup.
      mapview.popup(null);

      mapview.Map.un('click', click);

      // Execute callback if defined as function.
      if (mapview.interaction.callback instanceof Function) {
        // Must be run delayed to prevent a callback loop.
        const callback = mapview.interaction.callback;
        setTimeout(callback, 400);
      }

      delete mapview.interaction;
    }
  };

  // Append the plugin btn to the btnColumn.
  btnColumn.append(mapp.utils.html.node`
    <button
      data-id='plugin-streetview'
      title=${mapp.dictionary.googleMaps_streetview_btn_title}
      onclick=${streetview_popup}>
    <span class='material-symbols-outlined'>streetview`);

  function streetview_popup(e) {
    if (e.target.classList.toggle('active')) {
      // Begin streetview interaction. Finished current interaction.
      mapview.interactions.streetview_popup({
        callback: () => {
          e.target.classList.remove('active');
        },
      });
    } else {
      // Enable highlight interaction. Finishes the streetview interaction.
      mapview.interactions.highlight();
    }
  }
}
