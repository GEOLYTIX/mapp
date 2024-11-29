# Getting started

This workshop builds on the foundations of the [Getting started](https://github.com/GEOLYTIX/xyz/wiki/Getting-started) guide in the XYZ/wiki.

## Hello Belem!

Let's create a new table and spatial index in your NEON database.

```SQL
create table locations (
  id serial not null primary key,
  geom geometry,
  notes text
);

CREATE INDEX workshop_locations_geom
  ON locations
  USING GIST (geom);
```

Either create a new workspace or add JSON layer to your exsiting workspace. We use the WKT format for this layer which more compact.

We also add a cluster configuration to group point locations which are less than 30pixel apart in the mapview.

We add a default and highlight style for this layer and allow to draw point geometries manually or with help of the [locator](https://geolytix.github.io/xyz/mapp/mapview_locate.mjs.html) tool.

```json
"locations": {
    "dbs": "NEON",
    "display": true,
    "format": "wkt",
    "table": "locations",
    "geom": "geom",
    "srid": "4326",
    "qID": "id",
    "draw": {
        "point": true,
        "locator": true
    },
    "deleteLocation": true,
    "cluster": {
        "distance": 30
    },
    "style": {
        "default": {
            "icon": {
                "type": "dot"
            }
        },
        "highlight": {
            "scale": 1.5
        }
    },
    "infoj": [
        {
            "type": "geometry",
            "display": true,
            "field": "geom",
            "fieldfx": "ST_asGeoJSON(geom)",
            "dependents": [
                "pin"
            ],
            "edit": {
                "geometry": true
            }
        },
        {
            "type": "pin",
            "label": "ST_PointOnSurface",
            "field": "pin",
            "fieldfx": "ARRAY[ST_X(ST_PointOnSurface(geom)),ST_Y(ST_PointOnSurface(geom))]"
        },
        {
            "title": "Notes",
            "field": "notes",
            "type": "textarea",
            "edit": true
        }
    ]
}
```

## launch.json
Let's create a launch configuration for the Belem workspace.

```json
{
    "type": "node",
    "request": "launch",
    "name": "Bom dia Belem!",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "program": "express.js",
    "env": {
        "TITLE": "Bom dia Belem!",
        "WORKSPACE": "file:/public/belem.json",
        "DBS_NEON": "postgresql://dbauszus-glx:🤫@ep-curly-base-242741.eu-central-1.aws.neon.tech/workshop?sslmode=require"
    }
}
```
We should now be able to locate ourselves in the instance on localhost:3000

![image](https://github.com/user-attachments/assets/18a88b48-9449-43b9-a6f7-1e15d626fbc9)


