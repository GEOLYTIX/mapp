/**
Adds the GCJ02 Mercator Projection to Openlayers 8.1+

The esm.sh import must be allowed by the content security policies (CSP) for script.

@module googleMaps
@author @dbauszus-glx
*/

import { GCJ02 } from "https://esm.sh/ol-proj-ch";

console.log(`gcj02_mercator v4.10`)

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
