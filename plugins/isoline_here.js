/**  
# Isoline HERE

The isoline_here plugin adds interfaces to request isoline geometries from the HERE API.

Isoline geometries can be requested from the mapview drawing interaction, location geometry, and layer entries.

A valid apiKey is required for requests to the HERE API. The API itself is documented on the HERE developer portal.

https://developer.here.com/documentation/isoline-routing-api/dev_guide/index.html

To create a new location with a HERE Isoline geometry the isoline_here{} object must be added to the layer.draw configuration.

``` json
'draw': {
  'isoline_here': {
    'apiKey': '***'
  }
}
```

### type:isoline_here

The isoline_here infoj entry will request a geometry from the HERE API and store the geometry in the location data field at rest. A location pin value (coordinate array) is required as origin for the traveltime request.

Without the 'field' and 'fieldfx' object entries isolines can still be requested from the HERE API and displayed in the mapview but the value will not be stored in the location data at rest.

The isoline_here entry is a type:geometry entry. The geometry can be modified or deleted through the edit config. Other drawing tools allow to replace the isoline geometry with a custom geometry.

Setting `display:true` will automatically generate [and store] the isoline geometry from the HERE API using the parameter.

Setting `class:'display-none'` will not display the entry in the location view but show the geometry in the mapview if the display is true.

Providing an empty style object or setting `style:null` will prevent the isoline geometry from being displayed in the mapview.

The location.view will be disabled while waiting for the API response with the `blocking:true` entry.

NOTE - you must provide `blocking: true` if the entry has an dependent fields that rely on the isoline geometry.

```json
{
  'label': 'HERE Catchment',
  'field': 'isoline',
  'fieldfx': 'ST_asGeoJson(isoline)',
  'type': 'isoline_here',
  'display': true,
  'edit': true,
  'blocking': true,
  'params': {
    'minutes': 10,
    'apiKey': '***',
    'panel': ['meta', 'minutes', 'rangeValues', 'transportMode', 'optimizeFor', 'datetime', 'shape']
  },
  'dependents': ['field'],
  'style': {
    'strokeColor': '#3E92CC',
    'fillColor': '#3E92CC',
    'fillOpacity': 0.3
  }
}
```

### type:geometry [edit.draw]

The isoline_here draw interaction can be configured for a type:geometry draw edit.

This allows to set the origin for isoline geometry through the drawing interaction.

```json
{
  'label': 'HERE Catchment',
  'field': 'isoline',
  'fieldfx': 'ST_asGeoJson(isoline)',
  'type': 'geometry',
  'display': true,
  'edit': {
    'draw': {
      'isoline_here': {
        'apiKey': '***',
        'panel': ['minutes']
      }
    }
  }
}
```

### layer:true

The isoline_here entry method extends a vector_layer type entry with the layer flag.

A field is not required since no data is loaded from the location.

`queryparams` with a table, geom[etry], and qID entries are required.

The location id field is defined as 'filterID'.

Geometries will be loaded through the 'geojson' format query template filtered for the location id.

```json
{
  'label': 'HERE Catchments Layer',
  'type': 'isoline_here',
  'layer': true,
  'edit': true,
  'filterID': 'location',
  'queryparams': {
    'table': 'isolines',
    'qID': 'id',
    'geom': 'geom'
  },
  'params': {
    'apiKey': '***',
    'panel': ['rangeValues'],
    'rangeValues': [600,900,1200]
  },
  'zIndex': 99,
  'style': {
    'default': {
      'strokeColor': '#8700AA',
      'strokeWidth': 2
    },
    'theme': {
      'type': 'graduated',
      'field': 'minutes',
      'cat_arr': [
        {
          'value': 0,
          'label': '0',
          'style': {
            'strokeColor': '#fed976'
          }
        },{
          'value': 10,
          'label': '10',
          'style': {
            'strokeColor': '#feb24c'
          }
        },{
          'value': 15,
          'label': '15',
          'style': {
            'strokeColor': '#fd8d3c'
          }
        },{
          'value': 20,
          'label': '20',
          'style': {
            'strokeColor': '#f03b20'
          }
        },{
          'value': 25,
          'label': '25',
          'style': {
            'strokeColor': '#bd0026'
          }
        }
      ]
    }
  }
}
```

### Parameters

The params provided in a location entry or isoline_here draw configuration are applied to the defaultParams object, this allowing to alter any of the default parameter.

#### apiKey[string]
Required for requests to the HERE API.

#### url['https://isoline.router.hereapi.com/v8/isolines']
The request URL for the HERE Isoline API.

#### minutes[10]
Range in minutes.

#### rangeValues[array]
An array of integer can be provided to request multiple travel time isolines in a single request.

#### transportMode['car']
'car', 'truck', 'pedestrian', 'taxi', 'bus', 'privateBus', 'scooter', 'bicycle'
Mode of transport to be used for the calculation of the isolines.

#### optimizeFor['balanced']
Specifies how isoline calculation is optimized.
- quality: calculation of isoline focuses on quality, that is, the graph used for isoline calculation has higher granularity generating an isoline that is more precise.
- performance: calculation of isoline is performance-centric, quality of isoline is reduced to provide better performance.
- balanced: calculation of isoline takes a balanced approach averaging between quality and performance.

#### shape[maxPoints]
Limits the number of points in the resulting isoline geometry. If the isoline consists of multiple components, the sum of points from all components is considered.

#### datetime[string]
Locale datetime string for the route calculation when an arrival or departure time is requested.

#### reverseDirection[boolean]
Whether a specific arrival or departure time should be taken into account for the travel time calculation.

#### dateISO[string]
A specific datetime ISO string eg. `'dateISO': '2024-06-05T23:39:00.000Z'` can be defined in the params to control the departure time at origin for the travel time calculation.

#### panel[['meta', 'minutes']]
['meta', 'minutes', 'rangeValues', 'transportMode', 'optimizeFor', 'datetime', 'shape']
Edit interface elements to modify the HERE API request parameter.
The minutesMin and minutesMax params are required for the minutes panel.
The panel entry value can be set to null to prevent any parameter interface to be returned from the isoline_here drawing element method.

#### label['Travel Time']
The header for the config drawer.
Defaults to mapp.dictionaries.travel_time

#### meta['Parameter for HERE API catchments']
The text shown in the meta panel element.
Defaults to mapp.dictionaries.here_meta

#### btn_label['Request travel time']
The call to action button for either location edit or drawing interaction.
Defaults to mapp.dictionaries.travel_time_request or mapp.dictionaries.travel_time_set_origin

### Content Security Policy (CSP)
The HERE API request url domain must be added to the `connect-source` directive.

@module isoline_here
*/

mapp.utils.versionCheck?.('4.13')
  ? console.log('isoline_here v4.13')
  : console.warn('isoline_here v4.13 exceeds mapp version.');

mapp.utils.merge(mapp.dictionaries, {
  en: {
    failed_to_generate_isoline: 'Isoline Generation Failed:',
    failed_to_generate_isoline_alert:
      'It was not possible to generate the isoline. Please try adding a new location nearby.',
    travel_time: 'Set Travel Time',
    here_meta: 'Parameter for HERE API catchments',
    travel_time_request: 'Request travel time',
    travel_time_set_origin: 'Set travel time origin',
    range_minutes: 'Range in minutes',
    here_shape: 'Max number of points in geometry shape',
    here_mode: 'Mode',
    here_mode_driving: 'Driving',
    here_mode_walking: 'Walking',
    here_mode_truck: 'Truck',
    here_mode_taxi: 'Taxi',
    here_mode_bus: 'Bus',
    here_mode_scooter: 'Scooter',
    here_mode_bicycle: 'Cycling',
    here_range_minutes: 'Travel time in minutes',
    here_datetime_arrive: 'Arrive at',
    here_datetime_depart: 'Depart at',
    here_optimize_for: 'Optimize for',
    here_optimize_for_balanced: 'Balanced',
    here_optimize_for_quality: 'Quality',
    here_optimize_for_performance: 'Performance',
  },
  de: {
    travel_time: 'Fahrzeit',
    here_meta: 'Parameter für Einzugsgebiete aus der HERE-API',
    travel_time_request: 'Reisezeit anfragen',
    travel_time_set_origin: 'Legen Sie den Ursprung der Reisezeit fest',
    here_mode: 'Modus',
    here_mode_driving: 'Kraftfahrzeug',
    here_mode_walking: 'zu Fuß',
    here_range_minutes: 'Fahrzeit in Minuten',
    here_datetime_arrive: 'Ankunft',
    here_datetime_depart: 'Abfahrt',
    here_optimize_for: 'Optimisierung',
    here_optimize_for_balanced: 'Ausgeglichen',
    here_optimize_for_quality: 'Qualität',
    here_optimize_for_performance: 'Leistung',
  },
  pl: {
    failed_to_generate_isoline: 'Nie udało się wygenerować izolinii:',
    failed_to_generate_isoline_alert:
      'Nie udało się wygenerować izolinii. Spróbuj dodać nową lokalizację w pobliżu.',
    travel_time: 'Ustaw czas podróży',
    here_meta: 'Parametr dla obszarów API HERE',
    travel_time_request: 'Zamów czas podróży',
    travel_time_set_origin: 'Ustaw punkt początkowy dla czasu podróży',
    range_minutes: 'Zakres w minutach',
    here_shape: 'Maksymalna liczba punktów w kształcie geometrycznym',
    here_mode: 'Tryb',
    here_mode_driving: 'Samochód',
    here_mode_walking: 'Pieszo',
    here_mode_truck: 'Ciężarówka',
    here_mode_taxi: 'Taksówka',
    here_mode_bus: 'Autobus',
    here_mode_scooter: 'Hulajnoga',
    here_mode_bicycle: 'Rower',
    here_range_minutes: 'Czas podróży w minutach',
    here_datetime_arrive: 'Przyjazd o',
    here_datetime_depart: 'Wyjazd o',
    here_optimize_for: 'Optymalizuj dla',
    here_optimize_for_balanced: 'Zrównoważony',
    here_optimize_for_quality: 'Jakość',
    here_optimize_for_performance: 'Wydajność',
  },
});

const defaultParams = {
  url: 'https://isoline.router.hereapi.com/v8/isolines',
  type: 'Point',
  minutes: 10,
  minutesMin: 5,
  minutesMax: 60,
  'range[type]': 'time',
  transportMode: 'car',
  optimizeFor: 'balanced',
  meta: mapp.dictionary.here_meta,
  helpDialog: {
    content: mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>`,
  },
  label: mapp.dictionary.travel_time,
  panel: ['meta', 'minutes'],
  drawend: null,
};

/**
@function isoline_here_draw_element

@description
The drawing element method returns a call to action button to initiate a drawing interaction with the HERE isoline geometryFunction.

A panel element with interfaces for HERE API request parameter will be returned for the panel parameter array elements which default to `panel:['meta', 'minutes']`.

The defaultParams for the HERE API Isoline request will be merged with the `layer.draw.isoline_here{}` params.

The drawing elements can be added to a layer or location view.

@param {Object} layer
The layer for the drawing interaction.

@param {Object} layer.draw.isoline_here
The parameter for the drawing interaction.

@returns {HTMLElement}
The interface elements for the drawing params.
*/

mapp.ui.elements.drawing.isoline_here = isoline_here_draw_element;

function isoline_here_draw_element(layer) {
  if (!mapp.ui.elements.drawing.drawOnclick) {
    console.warn(`mapp.ui.elements.drawing.drawOnclick() method not found!`);
    return;
  }

  // if null, return
  if (layer.draw.isoline_here === null) {
    return;
  }

  // if not an object, warn and return
  if (typeof layer.draw.isoline_here !== 'object') {
    console.warn(`layer.draw.isoline_here config must be of type object.`);
    return;
  }

  // if no apiKey, warn and return
  if (!layer.draw.isoline_here.apiKey) {
    console.warn(`layer.draw.isoline_here config requires an apiKey.`);
    return;
  }

  layer.draw.isoline_here = {
    layer,
    geometryFunction: (coordinates) =>
      mapp.utils.here.geometryFunction(coordinates, layer),
    btn_label: mapp.dictionary.travel_time_set_origin,
    ...defaultParams,
    ...layer.draw.isoline_here,
  };

  // Create the content for the config panel.
  layer.draw.isoline_here.content = layer.draw.isoline_here.panel.map((el) =>
    mapp.ui.elements.isoline_here[el](layer.draw.isoline_here),
  );

  // Create button to toggle draw interaction.
  layer.draw.isoline_here.btn = mapp.utils.html.node`
    <button
      data-id='${layer.key}-isoline-here'
      class='flat wide bold primary-colour'
      onclick=${(e) =>
        mapp.ui.elements.drawing.drawOnclick(
          e,
          layer,
          layer.draw.isoline_here,
        )}>
      ${layer.draw.isoline_here.btn_label}`;

  // Return a config panel as drawer with the button below.
  if (layer.draw.isoline_here.content.length) {
    const header = mapp.utils.html`
      <h3>${layer.draw.isoline_here.label}</h3>
      <div class='material-symbols-outlined notranslate caret'/>`;

    const content = mapp.utils.html.node`
      <div class='panel flex-col'>
      ${layer.draw.isoline_here.content}`;

    return mapp.utils.html.node`<div>
      ${mapp.ui.elements.drawer({
        data_id: `${layer.key}-drawer-isoline-here`,
        class: `drawer expandable ${
          layer.draw.isoline_here.groupClassList || ''
        }`,
        header,
        content,
      })}${layer.draw.isoline_here.btn}`;
  }

  // Return CTA button but now config panel.
  return layer.draw.isoline_here.btn;
}

/**
@function isoline_here_location_entry

@description
Extends the mapp.ui.locations.entries.geometry(entry) method by default.

The mapp.ui.locations.entries.vector_layer(entry) method will be extended with `layer:true` flag.

Interface elements for the HERE API parameter are added to the `entry.api_elements[]` array for editable entries.

The `entry_api()` method is assigned as entry.api before the geometry or vector_layer entry method is called.

@param {Object} entry
The location infoj entry

@param {Object} entry.params
The parameter for the HERE API request.

@returns {HTMLElement}
The elements for the location view.
*/

mapp.ui.locations.entries.isoline_here = isoline_here_location_entry;

function isoline_here_location_entry(entry) {
  entry.srid ??= entry?.location?.layer?.srid || '3857';

  entry.format ??= 'GeoJSON';

  if (typeof entry.params !== 'object') {
    console.warn(`entry.params must be of type object.`);
    return;
  }

  if (!entry.params.apiKey) {
    console.warn(`entry.params config requires an apiKey.`);
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
      data_id: 'isoline-here-edit-drawer',
      class: `drawer expandable ${entry.params.groupClassList || ''}`,
      header: mapp.utils.html`
        <h3>${entry.params.label}</h3>
        <div class='material-symbols-outlined notranslate caret'/>`,
      content: mapp.utils.html.node`
        <div class='panel flex-col'>
        ${entry.params.panel.map((el) =>
          mapp.ui.elements.isoline_here[el](entry.params),
        )}
        <button
          class='flat wide bold primary-colour'
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

  // // The API method should extend a layer type entry.
  // if (entry.layer) {
  //   entry.query ??= entry.format;

  //   if (entry.style.theme?.field) {
  //     entry.queryparams.fields = [entry.style.theme?.field];
  //   }

  //   entry.queryparams.sqlFilter = {
  //     [entry.filterID]: {
  //       eq: entry.location.id,
  //     },
  //   };

  //   return mapp.ui.locations.entries.vector_layer(entry);
  // } else {
  //   // The geometry entries method will be extended without the layer flag.
  //   return mapp.ui.locations.entries.geometry(entry);
  // }

  return mapp.ui.locations.entries.geometry(entry);
}

/**
@function entry_api

@description
The async entry_api function called from the entry.show() method will request polylines from the HERE API.

The location infoj array must contain a pin type entry with coordinate array value as origin for the HERE API isoline request.

The isoline geometry will be stored as a json entry.value.

Features will be created and assigned as entry.features with the entry.layer flag.

@param {Object} entry
The location infoj entry

@param {Object} entry.params
The parameter for the HERE API request.

@param {Boolean} entry.blocking
The location view will be disabled while requesting the HERE API.
*/

async function entry_api(entry = this) {
  // If the entry is disabled, return.
  if (entry.disabled) return;

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
    console.warn('No lnglat param for HERE isoline generation.');
    return;
  }

  entry.params.lng = entry.params.lnglat[0];
  entry.params.lat = entry.params.lnglat[1];

  // Disable location view while awaiting API response.
  entry.blocking && entry.location.view?.classList.add('disabled');

  // Filter params for the HERE API request.
  const params = filterParams(entry.params);

  await mapp.utils
    .xhr(`${entry.params.url}?${mapp.utils.paramString(params)}`)
    .then(async (response) => {
      // The location no longer exists.
      if (!entry.location.remove) return;

      if (response instanceof Error) {
        mapp.ui.elements.alert({
          title: mapp.dictionary.travel_time_request,
          text: mapp.dictionary.failed_to_generate_isoline_alert,
        });
        entry.disabled = true;
        return;
      }

      // No isoline could be created from the request parameter.
      if (!response.isolines?.length) {
        console.warn(response);

        entry.display = false;
        entry.disabled = true;

        // Update the label to say the isoline could not be created.
        entry.label = `${mapp.dictionary.failed_to_generate_isoline} ${entry.label}`;

        return;
      }

      // Create features for layer type entry
      if (entry.layer) {
        entry.features = response.isolines.map((isoline, i) => {
          const coordinates = decodePolylines([isoline], entry.srid);

          let minutes = entry.params.minutes;

          if (entry.params.rangeValues) {
            minutes = entry.params.rangeValues?.[i] / 60;
          }

          const jsonfeature = {
            id: i + 1,
            type: 'feature',
            geometry: {
              type: 'Polygon',
              coordinates,
            },
            properties: {
              minutes,
            },
          };
          return jsonfeature;
        });

        // Create geometry value
      } else {
        const coordinates = decodePolylines(response.isolines, entry.srid);

        if (coordinates.length > 1) {
          entry.value = {
            type: 'MultiPolygon',
            coordinates: [coordinates],
          };
        } else {
          entry.value = {
            type: 'Polygon',
            coordinates,
          };
        }

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
      }
    })
    .finally(async () => {
      if (entry.dependents) {
        await entry.location.syncFields(entry.dependents);
      }
      entry.blocking && entry.location.view.dispatchEvent(new Event('render'));
    });
}

mapp.ui.elements.isoline_here = {
  meta: (params) => mapp.utils.html`<p>${params.meta}`,
  transportMode,
  optimizeFor,
  datetime,
  minutes,
  shape,
  rangeValues,
};

/**
@function transportMode

@description
Creates a dropdown input element for the HERE API transportMode parameter.

@param {Object} params The params object.
@param {String} params.transportMode

@returns {HTMLElement}
Input elements for the transportMode param.
*/

function transportMode(params) {
  const entries_mode = [
    {
      title: [mapp.dictionary.here_mode_driving],
      option: 'car',
    },
    {
      title: [mapp.dictionary.here_mode_walking],
      option: 'pedestrian',
    },
    {
      title: [mapp.dictionary.here_mode_truck],
      option: 'truck',
    },
    {
      title: [mapp.dictionary.here_mode_taxi],
      option: 'taxi',
    },
    {
      title: [mapp.dictionary.here_mode_bus],
      option: 'bus',
    },
    {
      title: [mapp.dictionary.here_mode_scooter],
      option: 'scooter',
    },
    {
      title: [mapp.dictionary.here_mode_bicycle],
      option: 'bicycle',
    },
  ];

  return mapp.utils.html`<div 
    style='display: grid; grid-template-columns: 100px 1fr; align-items: center;'>
    <div style='grid-column: 1;'>${mapp.dictionary.here_mode}</div>
    <div style='grid-column: 2;'>
    ${mapp.ui.elements.dropdown({
      data_id: 'isoline-here-mode',
      entries: entries_mode,
      placeholder: entries_mode.find(
        (entry) => entry.option === params.transportMode,
      ).title,
      callback: (e, entry) => {
        params.transportMode = entry.option;
      },
    })}`;
}

/**
@function optimizeFor

@description
Creates a dropdown input element for the HERE API optimizeFor parameter.

@param {Object} params The params object.
@param {String} params.optimizeFor

@returns {HTMLElement} Input elements for the optimizeFor param.
*/

function optimizeFor(params) {
  const entries_optimization = [
    {
      title: [mapp.dictionary.here_optimize_for_balanced],
      option: 'balanced',
    },
    {
      title: [mapp.dictionary.here_optimize_for_quality],
      option: 'quality',
    },
    {
      title: [mapp.dictionary.here_optimize_for_performance],
      option: 'performance',
    },
  ];

  return mapp.utils.html`<div 
    style='display: grid; grid-template-columns: 100px 1fr; align-items: center;'>
    <div style='grid-column: 1;'>${mapp.dictionary.here_optimize_for}</div>
    <div style='grid-column: 2;'>
    ${mapp.ui.elements.dropdown({
      data_id: 'isoline-here-optimize',
      entries: entries_optimization,
      placeholder: entries_optimization.find(
        (entry) => entry.option === params.optimizeFor,
      ).title,
      callback: (e, entry) => {
        params.optimizeFor = entry.option;
      },
    })}`;
}

/**
@function datetime

@description
Creates a datetime input element for the HERE API datetime parameter.

@param {Object} params The params object.
@param {Object} params.datetime JS Date object.
@param {Boolean} params.reverseDirection
@param {String} params.dateISO

@returns {HTMLElement} Input elements for the datetime param.
*/

function datetime(params) {
  const date_picker_label = mapp.utils.html.node`
    <span>${
      params.reverseDirection
        ? mapp.dictionary.here_datetime_arrive
        : mapp.dictionary.here_datetime_depart
    }`;

  // Calculate UTC date string if not provided.
  let dateUTC = new Date();
  dateUTC.setMinutes(dateUTC.getMinutes() - dateUTC.getTimezoneOffset());
  dateUTC = dateUTC.toISOString();

  // If datetime is provided, set dateISO to the datetime value. Otherwise, set dateISO to the current date.
  params.dateISO ??= params.datetime
    ? new Date(params.datetime).toISOString()
    : dateUTC;

  // Remove milliseconds and 'Z' from ISO string if it exists
  params.datetime ??= params.dateISO.replace(/:\d{2}\.\d{3}Z$/, '');

  let reverseDirection;

  if (params.reverseDirection) {
    reverseDirection = mapp.ui.elements.chkbox({
      label: 'Reverse Direction Isoline',
      data_id: 'isoline-here-reverse_direction',
      checked: !!params.reverseDirection,
      onchange: (checked) => {
        date_picker_label.textContent = checked
          ? mapp.dictionary.here_datetime_arrive
          : mapp.dictionary.here_datetime_depart;
        params.reverseDirection = checked;
      },
    });
  }

  return mapp.utils.html`<div>
    ${date_picker_label}
    <input
      type='datetime-local'
      value=${params.datetime}
      onchange=${(e) => {
        // Check for reverse direction either in the params object or in the DOM.
        const reverseDirectionChk =
          document?.querySelector(
            '[data-id=isoline-here-reverse_direction] > input',
          ) || params.reverseDirection;

        if (e.target.value) {
          // Calculate UTC date string if not provided.
          let dateUTC = new Date(e.target.value);
          dateUTC.setMinutes(
            dateUTC.getMinutes() - dateUTC.getTimezoneOffset(),
          );
          dateUTC = dateUTC.toISOString();

          // If datetime is provided, set dateISO to the datetime value. Otherwise, set dateISO to the current date.
          params.dateISO = dateUTC;

          // Remove milliseconds and 'Z' from ISO string if it exists
          params.datetime ??= params.dateISO.replace(/:\d{2}\.\d{3}Z$/, '');

          // reverse direction not valid in combination with a dateISO param.
          if (reverseDirectionChk) {
            console.warn(
              'reverse direction not valid in combination with a dateISO param, reverse direction disabled',
            );
            params.reverseDirection = false;
            reverseDirectionChk.checked = false;
            reverseDirectionChk.disabled = true;
          }

          return;
        }

        params.dateISO = undefined;

        if (reverseDirectionChk) reverseDirectionChk.disabled = false;
      }}>${reverseDirection}`;
}

/**
@function minutes

@description
Creates a rangeslider input element for the HERE API minutes parameter.

minutesMax and minutesMin params are required to bind the range.

@param {Object} params The params object.
@param {Integer} params.minutes
@param {Integer} params.minutesMin
@param {Integer} params.minutesMax

@returns {HTMLElement}
Input elements for the minutes param.
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
    data_id: `${params.data_id}-isoline-here-minutes`,
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
@function shape

@description
Creates a rangeslider input element for the HERE API shape parameter.

shapeMax and shapeMin params are required to bind the range.

@param {Object} params The params object.
@param {Integer} params.shape
@param {Integer} params.shapeMin
@param {Integer} params.shapeMax

@returns {HTMLElement}
Input elements for the minutes param.
*/

function shape(params) {
  if (!params.shape) {
    console.warn('A default params.shape is required for the UI element.');
  }

  if (!params.shapeMin || params.shapeMin > params.shape) {
    console.warn(
      'A default params.shapeMin which is smaller than params.shape is required for the UI element.',
    );
  }

  if (!params.shapeMax || params.shapeMax < params.shape) {
    console.warn(
      'A default params.shapeMax which bigger than param.shape is required for the UI element.',
    );
  }

  return mapp.ui.elements.slider({
    data_id: 'isoline-here-shape',
    label: mapp.dictionary.here_shape,
    min: params.shapeMin,
    max: params.shapeMax,
    val: parseInt(params.shape),
    callback: (e) => {
      params.shape = parseInt(e);
    },
  });
}

/**
@function rangeValues

@description
Creates an array input element for the HERE API rangeValues parameter.

@param {Object} params The params object.
@param {Array} params.rangeValues

@returns {HTMLElement} Input elements for the rangeValues param.
*/

function rangeValues(params) {
  function arrInput(e) {
    params.rangeValues = e.target.value
      .split(',')
      .map((val) => parseInt(val) * 60);
  }

  return mapp.utils.html.node`<input oninput=${arrInput}>`;
}

/**
@function filterParams

@description
Returns a params object filtered for the HERE API request.

@param {Object} params The params object.

@returns {Object} Filtered params for the HERE API request.
*/

function filterParams(params) {
  // Filter out params accepted by the HERE API.
  const hereParams = {
    'range[type]': params['range[type]'],
    'range[values]': params.minutes * 60,
    transportMode: params.transportMode,
    optimizeFor: params.optimizeFor,
    origin: `${params.lat},${params.lng}`,
    apiKey: params.apiKey,
  };

  if (params.shape) {
    hereParams['shape[maxPoints]'] = params.shape;
  }

  if (Array.isArray(params.rangeValues)) {
    hereParams['range[values]'] = params.rangeValues.join(',');
  }

  if (params.dateISO) {
    if (params.reverseDirection) {
      hereParams.arrivalTime = params.dateISO;
      hereParams.destination = hereParams.origin;
      delete hereParams.origin;
    } else {
      hereParams.departureTime = params.dateISO;
    }
  }

  return hereParams;
}

// Assign here utils.
mapp.utils.here ??= {};
mapp.utils.here.geometryFunction = geometryFunction;
mapp.utils.here.decodeIsoline = decode;
mapp.utils.here.decodePolylines = decodePolylines;

/**
@function decodePolylines

@description
Returns a coordinates array for a decoded polyline from HERE API response.

@param {Array} isolines
An array of encoded polylines.
@param {String} srid
The coordinate SRID for the decoded coordinates array.
@returns {Array}
An array of decoded and transformed isoline coordinates.
*/

function decodePolylines(isolines, srid) {
  const coordinates = isolines.map((isoline) => {
    // Decode outer here isoline.
    const decoded = mapp.utils.here.decodeIsoline(
      isoline.polygons[0].outer,
      true,
    );

    if (srid === '4326') {
      return decoded.polyline;
    }

    return decoded.polyline.map((coord) =>
      ol.proj.transform(coord, `EPSG:4326`, `EPSG:${srid}`),
    );
  });

  return coordinates;
}

/**
@function geometryFunction

@description
mapp.utils.here.geometryFunction(coordinates, layer)

The geometryFunction will be conditionally called from a mapview [point] drawing interaction.

A HERE API isoline will be requested with the point feature coordinates and filtered `draw.isoline_here{}` params.

@param {Array} coordinates
Coordinates array for the isoline origin.

@param {Object} layer
The layer object for the drawing interaction.
*/

function geometryFunction(coordinates, layer) {
  layer.mapview.interaction.wait = true;
  layer.mapview.Map.getTargetElement().style.cursor = 'wait';

  layer.draw.isoline_here.origin = ol.proj.transform(
    coordinates,
    `EPSG:${layer.mapview.srid}`,
    'EPSG:4326',
  );

  layer.draw.isoline_here.lng = layer.draw.isoline_here.origin[0];
  layer.draw.isoline_here.lat = layer.draw.isoline_here.origin[1];

  // The HERE API expects the origin as a string latitude, longitude.
  layer.draw.isoline_here.origin = `${layer.draw.isoline_here.lat},${layer.draw.isoline_here.lng}`;

  // Create params object for Here API call.
  const params = filterParams(layer.draw.isoline_here);

  mapp.utils
    .xhr(`${layer.draw.isoline_here.url}?${mapp.utils.paramString(params)}`)
    .then((response) => {
      if (response instanceof Error) {
        mapp.ui.elements.alert({
          title: mapp.dictionary.travel_time_request,
          text: mapp.dictionary.failed_to_generate_isoline_alert,
        });
        layer.mapview.interaction.finish();
        return;
      }

      layer.mapview.Map.getTargetElement().style.cursor = 'crosshair';

      // If no response.isolines or response.isolines is empty array
      if (!response.isolines?.length) {
        console.warn(response);
        layer.mapview.interaction.finish();
        mapp.ui.elements.alert({
          title: mapp.dictionary.travel_time_request,
          text: mapp.dictionary.failed_to_generate_isoline_alert,
        });
        return;
      }

      const coordinates = decodePolylines(response.isolines, layer.srid);

      const feature = layer.mapview.interaction.format.readFeature(
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates,
          },
        },
        {
          dataProjection: `EPSG:${layer.srid}`,
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

/*
 * Copyright (C) 2019 HERE Europe B.V.
 * Licensed under MIT, see full license in LICENSE
 * SPDX-License-Identifier: MIT
 * License-Filename: LICENSE
 */

const DECODING_TABLE = [
  62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
  -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33,
  34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

const FORMAT_VERSION = 1;

const Num = typeof BigInt !== 'undefined' ? BigInt : Number;

function decode(encoded, reverse) {
  const decoder = decodeUnsignedValues(encoded);
  const header = decodeHeader(decoder[0], decoder[1]);

  const factorDegree = 10 ** header.precision;
  const factorZ = 10 ** header.thirdDimPrecision;
  const { thirdDim } = header;

  let lastLat = 0;
  let lastLng = 0;
  let lastZ = 0;
  const res = [];

  let i = 2;
  while (i < decoder.length) {
    const deltaLat = toSigned(decoder[i]) / factorDegree;
    const deltaLng = toSigned(decoder[i + 1]) / factorDegree;
    lastLat += deltaLat;
    lastLng += deltaLng;

    if (thirdDim) {
      const deltaZ = toSigned(decoder[i + 2]) / factorZ;
      lastZ += deltaZ;
      res.push([lastLat, lastLng, lastZ]);
      i += 3;
    } else {
      res.push([lastLat, lastLng]);
      i += 2;
    }
  }

  if (i !== decoder.length) {
    throw new Error('Invalid encoding. Premature ending reached');
  }

  if (reverse) res.forEach((p) => p.reverse());

  return {
    ...header,
    polyline: res,
  };
}

function decodeChar(char) {
  const charCode = char.charCodeAt(0);
  return DECODING_TABLE[charCode - 45];
}

function decodeUnsignedValues(encoded) {
  let result = Num(0);
  let shift = Num(0);
  const resList = [];

  encoded.split('').forEach((char) => {
    const value = Num(decodeChar(char));
    result |= (value & Num(0x1f)) << shift;
    if ((value & Num(0x20)) === Num(0)) {
      resList.push(result);
      result = Num(0);
      shift = Num(0);
    } else {
      shift += Num(5);
    }
  });

  if (shift > 0) {
    throw new Error('Invalid encoding');
  }

  return resList;
}

function decodeHeader(version, encodedHeader) {
  if (+version.toString() !== FORMAT_VERSION) {
    throw new Error('Invalid format version');
  }
  const headerNumber = +encodedHeader.toString();
  const precision = headerNumber & 15;
  const thirdDim = (headerNumber >> 4) & 7;
  const thirdDimPrecision = (headerNumber >> 7) & 15;
  return { precision, thirdDim, thirdDimPrecision };
}

function toSigned(val) {
  // Decode the sign from an unsigned value
  let res = val;
  if (res & Num(1)) {
    res = ~res;
  }
  res >>= Num(1);
  return +res.toString();
}
