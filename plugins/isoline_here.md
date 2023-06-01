The isoline_here plugin adds interfaces and utility methods for requests to the [Here Isoline API (v8)](https://developer.here.com/documentation/isoline-routing-api/dev_guide/index.html).

The required API key for calls to the Here API must be stored as KEY_HERE in the XYZ environment.

Calls to the API are proxied through the XYZ API which ammends the key from the environment to the request.

The plugin adds following MAPP methods.

### mapp.ui.elements.drawing.isoline_here(layer)

The drawing element method returns adds a config panel and button to the layer.draw.isoline_here object. A group of interface elements is returned.

Config parameter can be changed before or while the draw interaction is current. The Here API will be called with the current parameter in the geometry function which receives a point feature from the Openlayers draw interaction callback.

A `default_fields` fields object can be defined which will map any known config parameter to a field stored as defaults with a new location.

Config parameters are origin, lat, lng, range, optimizeFor, etc.

Defaults are:

```js
const params = Object.assign({
    'range[type]': 'time',
    minutes: 10,
    reverseDirection: false,
    transportMode: 'car',
    optimizeFor: 'balanced'
}, entry.params)
```

### mapp.ui.locations.entries.isoline_here(entry)

The isoline_here location view entry return a checkbox element for the location view. The location pin geometry is used as origin for the Here Isoline.

### mapp.ui.elements.isoline_here_panel(params)

Returns a group of interface elements to configure the Here Isoline request parameter. The draw.isoline_here config object must be provided as argument.

### mapp.utils.here.geometryFunction(coordinates, layer)

The geometryFunction receives the origin coordinates and layer object with an draw.isoline_here config object. A decoded isoline geometry will be returned after a call to the Here Isoline API.

### mapp.utils.here.decodeIsoline(encoded, reverse)

The decodeIsoline utility method receives a decoded isoline as first argument and returns an encoded polyline to create an isoline geometry. The optional reverse flag can be set to reverse the coordinates.

The decode algorithm is licensed under MIT Copyright (C) 2019 HERE Europe B.V.