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

Either create a new workspace or add a JSON layer to your exsiting workspace. We use the WKT format for this layer which is more compact.

We also add a cluster configuration to the group point locations which are less than 30px apart in the mapview.

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


## locale view & extent

Let's use our location to define a view and extent for the locale.

```json
    "view": {
      "lat": -1.36,
      "lng": -48.47,
      "z": 10
    },
    "extent": {
      "north": -0.36,
      "south": -2.36,
      "east": -47.47,
      "west": -49.47,
      "mask": true
    },
```

# Deploy to Vercel

Following the guidelines in the [XYZ/wiki](https://github.com/GEOLYTIX/xyz/wiki/VERCEL) we copy the vercel.json into our local root directory.

We overwrite the vercel.json env with the process env from the launch.json.

Ensure that you have registered with Vercel. Then install the Vercel CLI and log into your account.

![image](https://github.com/user-attachments/assets/e17775fa-3082-4305-8131-07579ee8110c)

You are now able to deploy your instance to vercel with `vercel --force --prod`.

![image](https://github.com/user-attachments/assets/b142c6ea-1c21-4aa7-94d2-a3e29cb8f219)

You should now be able to inspect the project in the vercel dashboard.

![image](https://github.com/user-attachments/assets/762c7a84-d36d-4b2d-89c7-4f7d419ad8c0)

Let's visit your app to check it's running smoothly.

Your app should look like this: https://bom-belem.vercel.app/

![image](https://github.com/user-attachments/assets/59446777-2a65-4c1d-a6a5-d8cf752bfeec)
