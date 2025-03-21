/**
# measure_distance 📏
This plugin facilitates access to various measurement APIs from different providers within a unified system.

When loaded, the plugin enhances the default map view UI by adding a button. This button allows users to plot a start and endpoint on the map, enabling distance calculations.

As part of its functionality, the plugin introduces the `mapp.utils.routing.linestring()` method to the utility library.

The rubberband measurement feature is only enabled when a tooltip is provided.

Users have the flexibility to define either a single `route` or multiple `routes` within an array. Additionally, for seamless integration, tooltip keys for value conversion must be specified within the route configuration object.

### Sample Configuration
```json
"measure_distance": {
  "tooltip": {
    "convertTo": "km",
    "decimals": 1,
    "prefix": "GLX ",
    "suffix": " km"
  },
  "routes": [
    {
      "provider": "linestring", //default
      "convertTo": "km",
      "style": {
        "color": "#333",
        "opacity": 0.5,
        "width": 2
      }
    },{
      "provider": "here",
      "apiKey": "***",
      "style": {
        "color": "red"
      }
    },{
      "provider": "mapbox",
      "access_token": "***",
      "style": {
        "color": "blue"
      }
    }
  ]
}
```

@module measure_distance
@author @dbauszus-glx
*/

mapp.utils.versionCheck?.('4.13')
  ? console.log(`measure_distance v4.13`)
  : console.warn(
      `Mapp version below v4.13. Please use v4.8 measure_distance plugin.`,
    );

// Add dictionary definitions
mapp.utils.merge(mapp.dictionaries, {
  en: {
    measure_distance: 'Measure distance',
  },
  pl: {
    measure_distance: 'Mierz Odległość',
  },
});

/**
Measure distance function that will trigger on load.
@function measure_distance
@param {Object} plugin 
@param {Object} mapview 
*/
mapp.plugins.measure_distance = (plugin, mapview) => {
  // Find the btnColumn element.
  const btnColumn = document.getElementById('mapButton');

  // Append the plugin btn to the btnColumn.
  btnColumn?.append(mapp.utils.html.node`
    <button
      data-id="plugin-measure-distance"
      title=${mapp.dictionary.measure_distance} class="btn-measure-distance"
      onclick=${onclick}>
      <span class="material-symbols-outlined">straighten`);

  /**
   * @function onclick
   * @param {event} e
   */
  function onclick(e) {
    // Must be assign from e.target only if undefined.
    // Otherwise the escape [key] cancellation will assign key as target.
    plugin.btn ??= e.target;

    // Cancel draw interaction if active.
    if (plugin.btn.classList.contains('active'))
      return mapview.interactions.highlight();

    // Routing methods are conditions for the mapview drawing interaction.
    plugin.conditions = plugin.routes
      ?.map((route) => {
        // 'linestring' is the default routing
        route.provider ??= 'linestring';

        if (!Object.hasOwn(mapp.utils.routing, route.provider)) {
          console.warn(`No routing util for provider: ${route.provider}`);
          return;
        }

        // The default units for all routes is meter.
        route.units ??= 'meter';

        route.popup ??= plugin.popup;

        // Return routing method.
        return mapp.utils.routing[route.provider](route, mapview);
      })
      .filter((condition) => typeof condition === 'function');

    // Initiate drawing on mapview with config as interaction argument.
    mapview.interactions.draw(plugin);

    // Style plugin button as active.
    plugin.btn.classList.add('active');
  }

  // Assign route as routes array.
  if (plugin.route) {
    plugin.routes = [plugin.route];
  }

  Object.assign(plugin, {
    type: 'LineString',
    drawend: null, // prevent draw interaction contextmenu.
    finishCondition: null,
    callback,
    popup,
  });

  plugin.tooltip &&= {
    onChange,
    ...plugin.tooltip,
  };

  // Assign style for draw interaction geometry.
  plugin.style &&= new ol.style.Style({
    stroke: new ol.style.Stroke(plugin.style),
  });

  function callback() {
    // Remove routeLayer from map.
    plugin.routes?.forEach((route) => {
      // Abort running xhr.
      route.xhr?.abort();
      mapview.Map.removeLayer(route.L);
    });

    // Remove active class from button.
    plugin.btn.classList.remove('active');
  }

  /**
   * Function that will create a mapview popup
   * @function popup
   */
  function popup() {
    // Create mapview popup with routes results.
    mapview.popup({
      content: mapp.utils.html.node`
          <div style="padding: 5px">
            ${
              (plugin.tooltip &&
                mapp.utils
                  .html`<span style="white-space: nowrap;">${plugin.val}</span><br>`) ||
              ''
            }
            ${plugin.routes
              ?.filter((route) => route.val)
              .map(
                (route) => mapp.utils.html`
              <span style="white-space: nowrap;">${route.val}</span><br>`,
              )}`,
    });
  }

  /**
   * `onChange` event for draw interaction geometry.
   * @function onChange
   * @param {event} e
   */
  async function onChange(e) {
    // Assign length value for drawing geometry.
    plugin.val = await mapp.utils.convert(
      mapview.metrics.length(e.target),
      plugin.tooltip,
    );
    plugin.popup();
  }
};

mapp.utils.routing ??= {};
mapp.utils.routing.linestring = (route, mapview) => {
  route.waypoints = []; // Array for route waypoints.
  delete route.val; // Delete value on new route.

  // Return condition method for draw interaction.
  return async (e) => {
    // Right click
    if (e.originalEvent.buttons === 2) {
      // Remove last vertex.
      route.waypoints.pop();
    } else {
      // Push waypoint from click into array.
      route.waypoints.push(e.coordinate);
    }

    // Remove existing routeLayer from map.
    route.L && mapview.Map.removeLayer(route.L);

    // Linestring geometry must have at least 2 waypoints to measure length.
    if (route.waypoints.length < 2) {
      delete route.val;
      mapview.popup(null);
      return;
    }

    // Create routeLayer with linestring geometry from polyline coordinates.
    route.L = mapview.geoJSON({
      zIndex: Infinity,
      geometry: {
        type: 'LineString',
        coordinates: route.waypoints,
      },
      dataProjection: '3857',

      // Assign style from route entry.
      Style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#333',
          opacity: 0.5,
          width: 2,
          ...route.style,
        }),
      }),
    });

    const source = route.L.getSource();

    const features = source.getFeatures();

    const geometry = features[0].getGeometry();

    route.val = await mapp.utils.convert(ol.sphere.getLength(geometry), route);

    route.popup();
  };
};
