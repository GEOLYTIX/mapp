/**
# routing_mapbox
Adds method mapp.utils.routing.mapbox() which returns a drawing condition for routing.

Must be loaded to enable Mapbox routing for measure_distance plugin.

Requires a valid Mapbox apiKey.

"esm.sh" must be anabled as CSP script-src

Defaults:
```json
{
  "provider": "mapbox",
  "access_token": "***",
  "profile": "mapbox/driving",
  "style": {
    "color": "#333",
    "opacity": 0.5,
    "width": 2,
  }
}
```

### 📝 Reviewed by
[@dbauszus-glx](https://github.com/dbauszus-glx) (28/02/2024)

@module routing_here
@author @dbauszus-glx 
*/

import mapboxPolyline from 'https://esm.sh/@mapbox/polyline@1.2.1';

console.log(`routing_mapbox v4.8`);

mapp.utils.routing ??= {};
mapp.utils.routing.mapbox ??= mapboxRouting;

function mapboxRouting(route, mapview) {
  if (!route.access_token) {
    console.warn(`mapp.utils.routing.mapbox() requires an access_token`);
    return;
  }

  route.profile ??= 'mapbox/driving';
  route.waypoints = [];
  delete route.val;

  return async (e) => {
    // Right click
    if (e.originalEvent.buttons === 2) {
      // Remove last vertex.
      route.waypoints.pop();
    } else {
      // Push waypoint from click into array.
      route.waypoints.push(
        ol.proj.toLonLat([e.coordinate[0], e.coordinate[1]], 'EPSG:3857'),
      );
    }

    // Remove existing routeLayer from map.
    route.L && mapview.Map.removeLayer(route.L);

    // Redraw route on each waypoint.
    if (route.waypoints.length < 2) {
      delete route.val;
      mapview.popup(null);
      return;
    }

    route.xhr?.abort();

    route.xhr = new XMLHttpRequest();

    route.xhr.open(
      'GET',
      `https://api.mapbox.com/directions/v5/${route.profile}/${route.waypoints.map((w) => w.join(',')).join(';')}.json?access_token=${route.access_token}`,
    );

    route.xhr.onload = async (e) => {
      const response = JSON.parse(e.target.response);

      if (!response.routes?.length) {
        console.warn('Unable to process Mapbox route.');
        return;
      }

      // Assign val string from converted route section distance.
      route.val = await mapp.utils.convert(response.routes[0].distance, route);

      // Add route duration to display value.
      if (route.duration) {
        // Convert route section duration into route.duration key-value.
        route.val += ` (${await mapp.utils.convert(response.routes[0].duration, { units: 'seconds', convertTo: route.duration })} ${route.duration})`;
      }

      // Redraw mapview popup.
      route.popup();

      // Create routeLayer with linestring geometry from polyline coordinates.
      route.L = mapview.geoJSON({
        zIndex: Infinity,
        geometry: mapboxPolyline.toGeoJSON(response.routes[0].geometry),
        dataProjection: '4326',

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

      return;
    };

    route.xhr.send();
  };
}
