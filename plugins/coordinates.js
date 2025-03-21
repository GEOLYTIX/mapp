/**
# plugins.coordinates

The plugin will import the proj4 library from esm and define the OSGB epsg:27700 projection with transformations in Openlayers.

ESM must be allowed as a script source in the CSP directive.

A button will be added to the mapp default view if the coordinates object is defined in a locale.

```
"coordinates":{}
```

The button will toggle a mapview click interaction which transforms the click position into coordinates displayed in a popup.

``` 
"coordinates":{
  epsg3857: {
      srid: 3857,
      round: 6,
      labelX: 'X',
      labelY: 'Y',
  },
  epsg4326: {
    srid: 4326,
    round: 6,
    labelX: 'Longitude',
    labelY: 'Latitude',
  },
  epsg27700: {
    srid: 27700,
    round: 0,
    labelX: 'Easting',
    labelY: 'Northing',
  }          
} 
```

@module coordinates
@author @simon-leech
*/

// The style must be prepended in order to allow the specificity to be overridden in the mapp/ui css.
document.head.prepend(mapp.utils.html.node`<style>
  .popup > .padded {
    padding: 20px;

    & > * {
    white-space: nowrap;
    }
  }

  .popup button.close {
    font-size: 1.2em;
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .material-symbols-outlined.inline {
     vertical-align: middle;
     font-size: 1.2em;
  }
`);

mapp.utils.versionCheck?.('4.13')
  ? console.log(`coordinates v4.13`)
  : console.warn(
      `Mapp version below v4.13. Please use the v4.8 coordinates plugin instead.`,
    );

mapp.utils.merge(mapp.dictionaries, {
  en: {
    coordinates_button_text:
      'Click on the map to get the coordinates of the clicked point.',
    coordinates_copy: 'Copy to clipboard.',
    coordinates_title: 'Coordinates',
  },
  de: {
    coordinates_button_text:
      'Klicken Sie auf die Karte, um die Koordinaten des angeklickten Punktes zu erhalten.',
    coordinates_copy: 'In die Zwischenablage kopieren.',
    coordinates_title: 'Koordinaten',
  },
  pl: {
    coordinates_button_text: 'Kliknij na mapie aby dostać koordynaty miejsca',
    coordinates_copy: 'Kopiuj do schowka.',
    coordinates_title: 'Współrzędne',
  },
});

import proj4 from 'https://esm.sh/proj4@2.9.0';
proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
);

// Create and add the projection to OpenLayers
const epsg27700 = new ol.proj.Projection({
  code: 'EPSG:27700',
  extent: [0, 0, 700000, 1300000],
});

// Add the projection to the OpenLayers registry
ol.proj.addProjection(epsg27700);

// Register transformation functions
ol.proj.addCoordinateTransforms(
  'EPSG:3857',
  'EPSG:27700',
  (coord) => proj4('EPSG:3857', 'EPSG:27700', coord),
  (coord) => proj4('EPSG:27700', 'EPSG:3857', coord),
);

const projections = {
  epsg3857: {
    srid: '3857',
    round: 6,
    labelX: 'X',
    labelY: 'Y',
  },
  epsg4326: {
    srid: '4326',
    round: 6,
    labelX: 'Longitude',
    labelY: 'Latitude',
  },
  epsg27700: {
    srid: '27700',
    round: 6,
    labelX: 'Easting',
    labelY: 'Northing',
  },
};

/**
@function coordinates
The plugin method will add the coordinates button to the btnColumn in the default mapp view.
@param {Object} options
@param {Object} mapview The mapview object
*/
mapp.plugins.coordinates = (options, mapview) => {
  const btnColumn = document.getElementById('mapButton');

  // the btnColumn element only exists in the default mapp view.
  if (!btnColumn) return;

  // Assign default if coordinates is true or empty object.
  if (options === true || !Object.keys(options).length) {
    options = {
      epsg4326: projections.epsg4326,
      epsg3857: projections.epsg3857,
    };
  }

  // Iterate through the coordinates configuration.
  Object.keys(options).forEach((key) => {
    // Warn for unknown projection dcefinitions.
    if (!Object.hasOwn(projections, key)) {
      console.warn(`${key} projection not supported by coordinates plugin.`);
      delete options[key];
      return;
    }

    // Assign default projection params if projection is true.
    if (options[key] === true) {
      options[key] = projections[key];
    } else {
      // Spread default projection params into options[key]
      options[key] = { ...projections[key], ...options[key] };
    }
  });

  // Assign the options to the plugin object
  mapp.plugins.coordinates.options = options;

  const btn = mapp.utils.html.node`
    <button
      data-id='plugin-coordinates'
      title=${mapp.dictionary.coordinates_button_text}
      onclick=${toggleInteraction}>
      <div class='material-symbols-outlined'>distance`;

  btnColumn.append(btn);

  /**
  @function toggleInteraction
  Function to toggle the coordinate interaction on button click.
  @param {Object} e Button click event
  */
  function toggleInteraction(e) {
    mapview.popup(null);

    btn.querySelector('.material-symbols-outlined').classList.toggle('active')
      ? mapview.Map.on('click', clickEventListener)
      : mapview.Map.un('click', clickEventListener);
  }

  /**  
  @function clickEventListener
  Function will be called from mapview.Map click event. A popup will be shown on the location of the last click.
  @param {Object} e The mapview Map click event
  */
  function clickEventListener(e) {
    const coord = mapview.Map.getEventCoordinate(e.originalEvent);

    const CoordsContent = [];

    // Call the generateContent function for each projection in the options object
    Object.values(options).forEach((params) =>
      generateContent(coord, params, CoordsContent),
    );

    const content = mapp.utils.html.node`
      <div class="padded">
        <button
          data-id=close
          class='material-symbols-outlined close'
          onclick=${toggleInteraction}/>
        ${CoordsContent}
      </div>`;

    mapview.popup({
      content,
    });
  }

  /**
  @function generateContent
  Function to generate the content for the popup
  @param {Array} coord The coordinate array from the click event
  @param {Object} params The options object for the projection
  @param {Array} CoordsContent The array to push the content to
  @returns {Array} The array of content
  */
  function generateContent(coord, params, CoordsContent) {
    const coordsTransform = ol.proj.transform(
      coord,
      `EPSG:${mapview.srid}`,
      `EPSG:${params.srid}`,
    );

    const coordsRounded = coordsTransform.map((coord) =>
      coord.toFixed(params.round),
    );

    const coords =
      params.srid === 4326 ? coordsRounded.reverse() : coordsRounded;

    CoordsContent.push(mapp.utils.html.node`
      <button class='primary-colour bold'
        title=${mapp.dictionary.coordinates_copy}
        onClick=${(e) => mapp.utils.copyToClipboard(coords)}>EPSG:${params.srid}
        <span class='material-symbols-outlined inline'>content_copy</span>
      </button>
      <p>${params.labelX}: ${coords[0]}</p>
      <p>${params.labelY}: ${coords[1]}</p>`);
  }
};
