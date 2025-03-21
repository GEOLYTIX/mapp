/**
# routing_here
Adds method mapp.utils.routing.here() which returns a drawing condition for routing.

Must be loaded to enable here routing for measure_distance plugin.

Requires a valid Here apiKey.

```json
Defaults:
{
  "provider": "here",
  "apiKey": "***",
  "transportMode": "car",
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

console.log(`routing_here v4.8`);

mapp.utils.here ??= {};
mapp.utils.here.decodeIsoline ??= decode;

mapp.utils.routing ??= {};
mapp.utils.routing.here = (route, mapview) => {
  if (!route.apiKey) {
    console.warn(`mapp.utils.routing.here() requires an apiKey`);
    return;
  }

  route.transportMode ??= 'car';
  route.waypoints = [];
  delete route.val;

  return (e) => {
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

    // Set params for here request.
    const params = {
      transportMode: route.transportMode,
      origin: `${route.waypoints[0][1]},${route.waypoints[0][0]}`,
      destination: `${route.waypoints[[route.waypoints.length - 1]][1]},${route.waypoints[[route.waypoints.length - 1]][0]}`,
      return: 'polyline,summary',
      apiKey: route.apiKey,
    };

    // Create intermediate waypoints for route.
    if (route.waypoints.length > 2) {
      const via = [];

      for (let i = 1; i < route.waypoints.length - 1; i++) {
        via.push(
          `${route.waypoints[i][1]},${route.waypoints[i][0]}!passThrough=true`,
        );
      }

      params.via = via.join('&via=');
    }

    route.xhr?.abort();

    route.xhr = new XMLHttpRequest();

    route.xhr.open(
      'GET',
      `https://router.hereapi.com/v8/routes?${mapp.utils.paramString(params)}`,
    );

    route.xhr.onload = async (e) => {
      const response = JSON.parse(e.target.response);

      if (!response.routes?.length) {
        console.warn('Unable to process Here route.');
        return;
      }

      // Assign val string from converted route section distance.
      route.val = await mapp.utils.convert(
        response.routes[0].sections[0].summary.length,
        route,
      );

      // Add route duration to display value.
      if (route.duration) {
        // Convert route section duration into route.duration key-value.
        route.val += ` (${await mapp.utils.convert(response.routes[0].sections[0].summary.duration, { units: 'seconds', convertTo: route.duration })} ${route.duration})`;
      }

      // Redraw mapview popup.
      route.popup();

      // Decode the section.polyline
      const decoded = mapp.utils.here.decodeIsoline(
        response.routes[0].sections[0].polyline,
      );

      // Reverse coordinate order in decoded polyline.
      decoded.polyline.forEach((p) => p.reverse());

      // Create routeLayer with linestring geometry from polyline coordinates.
      route.L = mapview.geoJSON({
        zIndex: Infinity,
        geometry: {
          type: 'LineString',
          coordinates: decoded.polyline,
        },
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
    };

    route.xhr.send();
  };
};

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
  for (; i < decoder.length; ) {
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

  return {
    ...header,
    polyline: reverse ? res.map((p) => p.reverse()) : res,
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
