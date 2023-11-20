/*
@dbauszus-glx

Adds the GCJ02 Mercator Projection to Openlayers 8.1+

Requires Mapp 4.7.3 with support for layer.source and layer.projection.

The esm.sh import must be allowed by the content security policies (CSP) for script.
*/

import { GCJ02 } from "https://esm.sh/ol-proj-ch";

export default (function () {

    console.log(`gcj_mercator v4.7.3`)

    const gcj02Mercator = new ol.proj.Projection({
        code: "gcj02",
        extent: ol.proj.get("EPSG:3857").getExtent(),
        units: "m"
    });

    const ll2merc = ol.proj.getTransform("EPSG:4326", "EPSG:3857");
    const merc2ll = ol.proj.getTransform("EPSG:3857", "EPSG:4326");

    ol.proj.addProjection(gcj02Mercator);

    ol.proj.addCoordinateTransforms(
        "EPSG:4326",
        gcj02Mercator,
        (x) => ll2merc(GCJ02.fromEPSG4326(x)),
        (x) => GCJ02.toEPSG4326(merc2ll(x))
    );

    ol.proj.addCoordinateTransforms(
        "EPSG:3857",
        gcj02Mercator,
        (x) => ll2merc(GCJ02.fromEPSG3857(x)),
        (x) => GCJ02.toEPSG3857(merc2ll(x))
    );

})()