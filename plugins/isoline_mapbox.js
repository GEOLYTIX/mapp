/**  
# Isoline Mapbox

The isoline_mapbox plugin adds interfaces to request isoline geometries from Mapbox API.

Isoline geometries can be requested from the mapview drawing interaction, location geometry, and layer entries.

A valid access_token is required for requests to the Mapbox API.

A detailed API reference is provided by the Mapbox documentation portal.

https://docs.mapbox.com/api/navigation/isochrone/

The create a new location with a Mapbox Isoline geometry the isoline_mapbox{} object must be added to the layer.draw configuration.

``` json
"draw": {
  "isoline_mapbox": {
    "access_token": "***"
  }
}
```

### type:isoline_mapbox

The isoline_mapbox infoj entry will request a geometry from the GEOLYTIX API and store the geometry in the location data field at rest. A location pin value (coordinate array) is required as origin for the traveltime request.

Without the "field" and "fieldfx" object entries isolines can still be requested from the Mapbox API and displayed in the mapview but the value with not be stored in the location data at rest.

The isoline_mapbox entry is a type:geometry entry. The geometry can be modified or deleted through the edit config. Other drawing tools allow to replace the isoline geometry with a custom geometry.

Setting `display:true` will automatically generate [and store] the isoline geometry from the Mapbox API using the parameter.

Setting `class:"display-none"` will not display the entry in the location view but show the geometry in the mapview if the display is true.

Providing an empty style object or setting `style:null` will prevent the isoline geometry from being displayed in the mapview.

The location.view will be disabled while waiting for the API response with the `blocking:true` entry.

NOTE - you must provide `blocking: true` if the entry has an dependent fields that rely on the isoline geometry.
```json
{
  "label": "Mapbox Catchment",
  "field": "isoline",
  "fieldfx": "ST_asGeoJson(isoline)",
  "type": "isoline_mapbox",
  "display": true,
  "edit": true,
  "blocking": true,
  "params": {
    "minutes": 10,
    "access_token": "***",
    "panel": ["meta", "minutes"]
  },
  "dependents": ["field"],
  "style": {
    "strokeColor": "#3E92CC",
    "fillColor": "#3E92CC",
    "fillOpacity": 0.3
  }
}
```

### type:geometry [edit.draw]

The isoline_mapbox draw interaction can be configured for a type:geometry draw edit.

This allows to set the origin for isoline geometry through the drawing interaction.

```json
{
  "label": "Mapbox Catchment",
  "field": "isoline",
  "fieldfx": "ST_asGeoJson(isoline)",
  "type": "geometry",
  "display": true,
  "edit": {
    "draw": {
      "isoline_mapbox": {
        "access_token": "***",
        "panel": ["minutes"]
      }
    }
  }
}
```

### Parameters

The params provided in a location entry or isoline_glx draw configuration are applied to the defaultParams object, this allowing to alter any of the default parameter.

#### access_token[string]
Required for requests to the Mapbox API.

#### url['https://api.mapbox.com/isochrone/v1/mapbox']
The request URL for the Mapbox Isoline API.

#### minutes[10]
Range in minutes.

#### profile['driving']
'driving', 'driving-traffic', 'walking', 'cycling'
Travel profile for the isochrone calculation.

#### panel[["meta", "minutes"]]
["meta", "minutes", "profile"]
Edit interface elements to modify the Mapbox API request parameter.
The minutesMin and minutesMax params are required for the minutes panel.
The panel entry value can be set to null to prevent any parameter interface to be returned from the isoline_mapbox drawing element method.

#### label['Travel Time']
The header for the config drawer.
Defaults to mapp.dictionaries.travel_time

#### meta['Parameter for Mapbox API catchments']
The text shown in the meta panel element.
Defaults to mapp.dictionaries.mapbox_meta

#### btn_label['Request travel time']
The call to action button for either location edit or drawing interaction.
Defaults to mapp.dictionaries.travel_time_request or mapp.dictionaries.travel_time_set_origin

### Content Security Policy (CSP)
The Mapboix API request url domain must be added to the `connect-source` directive.

@module isoline_mapbox
*/

mapp.utils.versionCheck?.('4.13')
  ? console.log(`isoline_mapbox v4.13`)
  : console.warn(
      `Mapp version below v4.13. Please use v4.8 isoline_mapbox plugin.`,
    );

mapp.utils.merge(mapp.dictionaries, {
  en: {
    failed_to_generate_isoline: 'Isoline Generation Failed:',
    failed_to_generate_isoline_alert:
      'It was not possible to generate the isoline. Please try adding a new location nearby.',
    travel_time: 'Set Travel Time',
    mapbox_meta: 'Parameter for Mapbox API catchments',
    travel_time_request: 'Request travel time',
    travel_time_set_origin: 'Set travel time origin',
    range_minutes: 'Range in minutes',
    mapbox_mode: 'Profile',
    mapbox_mode_driving: 'Driving',
    mapbox_mode_driving_traffic: 'Driving (Traffic)',
    mapbox_mode_walking: 'Walking',
    mapbox_mode_cycling: 'Cycling',
  },
  de: {
    travel_time: 'Fahrzeit',
    mapbox_meta: 'Parameter für Einzugsgebiete aus der Mapbox-API',
    travel_time_request: 'Reisezeit anfragen',
    travel_time_set_origin: 'Legen Sie den Ursprung der Reisezeit fest',
    range_minutes: 'Fahrzeit in Minuten',
    mapbox_mode: 'Profil',
    mapbox_mode_driving: 'Kraftfahrzeug',
    mapbox_mode_driving_traffic: 'Kraftfahrzeug (Verkehr)',
    mapbox_mode_walking: 'zu Fuß',
    mapbox_mode_cycling: 'Fahrrad',
  },
});

const defaultParams = {
  url: 'https://api.mapbox.com/isochrone/v1/mapbox',
  type: 'Point',
  minutes: 10,
  minutesMin: 5,
  minutesMax: 60,
  profile: 'driving',
  meta: mapp.dictionary.mapbox_meta,
  helpDialog: {
    content: mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>`,
  },
  label: mapp.dictionary.travel_time,
  panel: ['meta', 'minutes'],
  drawend: null,
};

mapp.ui.elements.drawing.isoline_mapbox = isoline_mapbox_draw_element;

/**
@function isoline_mapbox_draw_element

@description
The drawing element method returns a call to action button to initiate a drawing interaction with the Mapboix isochrone geometryFunction.

A panel element with interfaces for Mapbox API request parameter will be returned for the panel parameter array elements which default to `panel:['meta', 'minutes']`.

The defaultParams for the Mapbox API Isoline request will be merged with the `layer.draw.isoline_mapbox{}` params.

The drawing elements can be added to a layer or location view.

@param {Object} layer The layer for the drawing interaction.
@property {Object} layer.draw.isoline_mapbox The parameter for the drawing interaction.
@returns {HTMLElement} The interface elements for the drawing params.
*/
function isoline_mapbox_draw_element(layer) {
  if (!mapp.ui.elements.drawing.drawOnclick) {
    console.warn(`mapp.ui.elements.drawing.drawOnclick() method not found!`);
    return;
  }

  if (typeof layer.draw.isoline_mapbox !== 'object') {
    console.warn(`layer.draw.isoline_mapbox config must be of type object.`);
    return;
  }

  if (!layer.draw.isoline_mapbox.access_token) {
    console.warn(`layer.draw.isoline_mapbox config requires an access_token.`);
    return;
  }

  layer.draw.isoline_mapbox = {
    layer,
    geometryFunction: (coordinates) =>
      mapp.utils.mapbox.geometryFunction(coordinates, layer),
    btn_label: mapp.dictionary.travel_time_set_origin,
    ...defaultParams,
    ...layer.draw.isoline_mapbox,
  };

  // Create the content for the config panel.
  layer.draw.isoline_mapbox.content = layer.draw.isoline_mapbox.panel?.map(
    (el) => mapp.ui.elements.isoline_mapbox[el](layer.draw.isoline_mapbox),
  );

  // Create button to toggle draw interaction.
  layer.draw.isoline_mapbox.btn = mapp.utils.html.node`
    <button
      data-id="${layer.key}-isoline-mapbox"
      class="flat wide bold primary-colour"
      onclick=${(e) =>
        mapp.ui.elements.drawing.drawOnclick(
          e,
          layer,
          layer.draw.isoline_mapbox,
        )}>
      ${layer.draw.isoline_mapbox.btn_label}`;

  // Return a config panel as drawer with the button below.
  if (layer.draw.isoline_mapbox.content?.length) {
    const header = mapp.utils.html`
      <h3>${layer.draw.isoline_mapbox.label}</h3>
      <div class="material-symbols-outlined caret"/>`;

    const content = mapp.utils.html.node`
      <div class="panel flex-col">
      ${layer.draw.isoline_mapbox.content}`;

    return mapp.utils.html.node`<div>
      ${mapp.ui.elements.drawer({
        data_id: `${layer.key}-drawer-isoline-mapbox`,
        class: `drawer expandable ${
          layer.draw.isoline_mapbox.groupClassList || ''
        }`,
        header,
        content,
      })}${layer.draw.isoline_mapbox.btn}`;
  }

  return layer.draw.isoline_mapbox.btn;
}

mapp.ui.locations.entries.isoline_mapbox = isoline_mapbox_location_entry;

/**
@function isoline_mapbox_location_entry

@description
Extends the mapp.ui.locations.entries.geometry(entry) method by default.

The mapp.ui.locations.entries.vector_layer(entry) method will be extended with `layer:true` flag.

Interface elements for the Mapbox API parameter are added to the `entry.api_elements[]` array for editable entries.

The `entry_api()` method is assigned as entry.api before the geometry or vector_layer entry method is called.

@param {Object} entry The location infoj entry
@property {Object} entry.params The parameter for the Mapbox API request.
@returns {HTMLElement} The elements for the location view.
*/
function isoline_mapbox_location_entry(entry) {
  entry.srid ??= entry?.location?.layer?.srid || '3857';

  entry.format ??= 'GeoJSON';

  if (typeof entry.params !== 'object') {
    console.warn(`entry.params must be of type object.`);
    return;
  }

  if (!entry.params.access_token) {
    console.warn(`entry.params config requires an access_token.`);
    return;
  }

  // Assign entry params to defaults
  entry.params = {
    btn_label: mapp.dictionary.travel_time_request,
    ...defaultParams,
    ...entry.params,
  };

  entry.api_elements = [];

  // No default panel are added to the params.
  if (entry.edit && entry.params.panel) {
    // The edit drawer will be created with the panel elements, and the button to request the isoline geometry.
    const editDrawer = mapp.ui.elements.drawer({
      data_id: `${entry.location.layer.key}-location-mapbox-isoline`,
      class: `drawer expandable ${entry.params.groupClassList || ''}`,
      header: mapp.utils.html`
        <h3>${entry.params.label}</h3>
        <div class="material-symbols-outlined caret"/>`,
      content: mapp.utils.html.node`
        <div class="panel flex-col">
        ${entry.params.panel.map((el) =>
          mapp.ui.elements.isoline_mapbox[el](entry.params),
        )}
      <button
        class="flat wide bold primary-colour"
        onclick=${() => {
          if (entry.L) {
            entry.location.layer.mapview.Map.removeLayer(entry.L);
            delete entry.L;
          }
          delete entry.value;
          entry.show();
        }}>${entry.params.btn_label}`,
    });

    entry.api_elements.push(editDrawer);
  }

  entry.api ??= entry_api;

  return mapp.ui.locations.entries.geometry(entry);
}

/**
@function entry_api

@description
The async entry_api function called from the entry.show() method will request polylines from the Mapbox API.

The location infoj array must contain a pin type entry with coordinate array value as origin for the Mapbox API isoline request.

The isoline geometry will be stored as a json entry.value.

Features will be created and assigned as entry.features with the entry.layer flag.

@param {Object} entry The location infoj entry
@property {Object} entry.params The parameter for the API request.
@property {Boolean} entry.blocking The location view will be disabled while requesting the API.
*/
async function entry_api(entry = this) {
  // Get pin entry for isoline origin.
  // A pin with value can also be assigned to the entry.
  entry.pin ??= entry.location.infoj.find((lookup) => lookup.type === 'pin');

  if (Array.isArray(entry.pin?.value)) {
    // Transform pin coordinates to latitude and longitude array.
    entry.params.lnglat = ol.proj.transform(
      entry.pin.value,
      `EPSG:${entry?.location?.layer?.srid || entry.pin.srid || '3857'}`,
      'EPSG:4326',
    );
  }

  if (!entry.params.lnglat) {
    console.warn('No lnglat param for Mapbox isoline generation.');
    return;
  }

  entry.params.lng = entry.params.lnglat[0];
  entry.params.lat = entry.params.lnglat[1];

  // Disable location view while awaiting API response.
  entry.blocking && entry.location.view?.classList.add('disabled');

  const params = filterParams(entry.params);

  await mapp.utils
    .xhr(
      `${entry.params.url}/${entry.params.profile}/${entry.params.lng},${
        entry.params.lat
      }?${mapp.utils.paramString(params)}`,
    )
    .then(async (response) => {
      // The location no longer exists.
      if (!entry.location.remove) return;

      if (response instanceof Error) {
        mapp.ui.elements.alert({
          text: mapp.dictionary.failed_to_generate_isoline_alert,
        });
        return;
      }

      // No isoline could be created from the request parameter.
      if (!response.features) {
        console.warn(response);
        entry.display = false;
        entry.disabled = true;

        // Update the label to say the isoline could not be created.
        entry.label = `${mapp.dictionary.failed_to_generate_isoline} ${entry.label}`;

        return;
      }

      const coords = response.features[0].geometry.coordinates[0].map((coord) =>
        ol.proj.transform(coord, `EPSG:4326`, `EPSG:${entry.srid}`),
      );

      // Assign feature geometry as new value.
      entry.value = {
        type: 'Polygon',
        coordinates: [coords],
      };

      entry.field &&
        (await mapp.utils.xhr({
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
          body: JSON.stringify({
            [entry.field]: entry.value,
          }),
        }));
    })
    .finally(async () => {
      if (entry.dependents) {
        await entry.location.syncFields(entry.dependents);
      }
      entry.blocking && entry.location.view.dispatchEvent(new Event('render'));
    });
}

mapp.ui.elements.isoline_mapbox = {
  meta: (params) => mapp.utils.html`<p>${params.meta}`,
  profile,
  minutes,
};

/**
@function profile

@description
Creates a dropdown input element for the Mapbox API profile parameter.

@param {Object} params The params object.
@property {String} params.profile The profile for the isoline API request.
@returns {HTMLElement} Input elements for the profile param.
*/
function profile(params) {
  const entries_mode = [
    {
      title: [mapp.dictionary.mapbox_mode_driving],
      option: 'driving',
    },
    {
      title: [mapp.dictionary.mapbox_mode_driving_traffic],
      option: 'driving-traffic',
    },
    {
      title: [mapp.dictionary.mapbox_mode_walking],
      option: 'walking',
    },
    {
      title: [mapp.dictionary.mapbox_mode_cycling],
      option: 'cycling',
    },
  ];

  return mapp.utils.html`<div 
    style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
      <div style="grid-column: 1;">${mapp.dictionary.mapbox_mode}</div>
      <div style="grid-column: 2;">
      ${mapp.ui.elements.dropdown({
        data_id: 'isoline-here-mode',
        entries: entries_mode,
        placeholder: entries_mode.find(
          (entry) => entry.option === params.profile,
        ).title,
        callback: (e, entry) => {
          params.profile = entry.option;
        },
      })}`;
}

/**
@function minutes

@description
Creates a rangeslider input element for the API minutes parameter.

minutesMax and minutesMin params are required to bind the range.

@param {Object} params The params object.
@property {Integer} params.minutes
@property {Integer} params.minutesMin
@property {Integer} params.minutesMax
@returns {HTMLElement} Input elements for the minutes param.
*/
function minutes(params) {
  if (!params.minutes) {
    console.warn('A default params.minutes is required for the UI element.');
  }

  if (!params.minutesMin || params.minutesMin > params.minutes) {
    console.warn(
      'A default params.shapeMin which is smaller than params.shape is required for the UI element.',
    );
  }

  if (!params.minutesMax || params.minutesMax < params.minutes) {
    console.warn(
      'A default params.minutesMax which bigger than param.minutes is required for the UI element.',
    );
  }

  params.data_id ??= 'slider';

  return mapp.ui.elements.slider({
    data_id: `${params.data_id}-isoline-mapbox-minutes`,
    label: mapp.dictionary.range_minutes,
    min: params.minutesMin,
    max: params.minutesMax,
    // Val is Deprecated in v4.10.0 so including value too
    val: parseInt(params.minutes),
    value: parseInt(params.minutes),
    callback: (e) => {
      // e.target.value deprecated in v4.10.0, so including e too
      params.minutes = parseInt(e?.target?.value || e);
    },
  });
}

/**
@function filterParams

@description
Returns a params object filtered for the Mapbox API request.

@param {Object} params The params object.
@returns {Object} Filtered params for the Mapbox API request.
*/
function filterParams(params) {
  // Filter out params accepted by the Mapbox API.
  const filterParams = {
    contours_minutes: params.minutes,
    polygons: true,
    access_token: params.access_token,
  };

  return filterParams;
}

// Assign mapbox utils.
mapp.utils.mapbox ??= {};
mapp.utils.mapbox.geometryFunction = geometryFunction;

/**
@function geometryFunction

@description
mapp.utils.mapbox.geometryFunction(coordinates, layer)

The geometryFunction will be conditionally called from a mapview [point] drawing interaction.

A Mapbox API isochrone will be requested with the point feature coordinates and filtered `draw.isoline_mapbox{}` params.

@param {Array} coordinates
Coordinates array for the isochrone origin.

@param {Object} layer
The layer object for the drawing interaction.
*/
function geometryFunction(coordinates, layer) {
  layer.mapview.interaction.wait = true;
  layer.mapview.Map.getTargetElement().style.cursor = 'wait';

  layer.draw.isoline_mapbox.origin = ol.proj.transform(
    coordinates,
    `EPSG:${layer.mapview.srid}`,
    'EPSG:4326',
  );

  layer.draw.isoline_mapbox.lng = layer.draw.isoline_mapbox.origin[0];
  layer.draw.isoline_mapbox.lat = layer.draw.isoline_mapbox.origin[1];

  // Create params object for API call.
  const params = filterParams(layer.draw.isoline_mapbox);

  mapp.utils
    .xhr(
      `${layer.draw.isoline_mapbox.url}/${
        layer.draw.isoline_mapbox.profile
      }/${layer.draw.isoline_mapbox.origin.join(',')}?${mapp.utils.paramString(
        params,
      )}`,
    )
    .then((response) => {
      if (response instanceof Error) {
        mapp.ui.elements.alert({
          text: mapp.dictionary.failed_to_generate_isoline_alert,
        });
        layer.mapview.interaction.finish();
        return;
      }

      if (!response.features) {
        console.log(response);
        layer.mapview.interaction.finish();
        mapp.ui.elements.alert({
          text: mapp.dictionary.failed_to_generate_isoline_alert,
        });
        return;
      }

      const feature = layer.mapview.interaction.format.readFeature(
        {
          type: 'Feature',
          geometry: response.features[0].geometry,
        },
        {
          dataProjection: `EPSG:4326`,
          featureProjection: `EPSG:${layer.mapview.srid}`,
        },
      );

      layer.mapview.interaction.source.clear();
      layer.mapview.interaction.source.addFeature(feature);

      const menu = [];

      menu.push(mapp.utils.html`
        <li
          onclick=${() =>
            layer.mapview.interaction.finish(
              layer.mapview.interaction.getFeature(),
            )}>
          ${mapp.dictionary.save}`);

      menu.push(mapp.utils.html`
        <li
          onclick=${() => layer.mapview.interaction.finish()}>
          ${mapp.dictionary.cancel}`);

      // Set timeout to for the drawend popup to appear after async onchange event popup.
      setTimeout(
        () =>
          layer.mapview.popup({
            coords:
              layer.mapview.interaction.vertices[
                layer.mapview.interaction.vertices.length - 1
              ],
            content: mapp.utils.html.node`<ul>${menu}`,
            autoPan: true,
          }),
        100,
      );
    });
}
