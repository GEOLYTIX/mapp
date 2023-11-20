Adds the GCJ02 Mercator Projection [gcj02] to Openlayers 8.1+

Requires Mapp 4.7.3 with support for layer.source and layer.projection.

The esm.sh must be allowed by the content security policies (CSP) for script.

Can be tested with the Autonavi/AMAP tiles.

```js
"autonavi": {
    "format": "tiles",
    "URI": "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    "source": "XYZ",
    "projection": "gcj02"
}
```