#  WKT & Cluster

Mapp supports different layer formats.

Change the `format` of the scratch layer from `geojson` to `mvt`. And reload the mapview. You will notice that there are tile requests when the viewport changes. Geojson datasets are cached in the application and only requested if a filter or the dataset itself changes. The geojson format is limited to datasets which do not exceed the lambda payload.

MVT layer request vector tiles generated in the PostGIS data-layer. The benefit of MVT layer is that the dataset is not restricted.

To begin, we create a new table with a spatial index for a bars layer in the SQL editor.

```SQL
CREATE TABLE IF NOT EXISTS bars
(
   id SERIAL,
   name character varying,
   notes text,
   added integer,
   likes integer DEFAULT 0,
   images text[] DEFAULT '{}'::text[],
   geom_3857 geometry
);

CREATE INDEX IF NOT EXISTS bars_geom_3857
   ON bars USING gist (geom_3857);
```

The layer json for the bars[_admin] layer looks as follows. This will allow you to open the app and draw point features for new bar locations.
[Configuration Notes for WKT](https://github.com/GEOLYTIX/xyz/wiki/Configuration#wkt)

```json
{
    "format": "wkt",
    "dbs": "NEON",
    "table": "bars",
    "geom": "geom_3857",
    "srid": "3857",
    "qID": "id",
    "draw": {
        "point": true
    },
    "deleteLocation": true,
    "infoj": [
        {
            "type": "pin",
            "label": "ST_PointOnSurface",
            "field": "pin",
            "fieldfx": "ARRAY[ST_X(ST_PointOnSurface(geom_3857)),ST_Y(ST_PointOnSurface(geom_3857))]",
            "class": "display-none"
        },
        {
            "title": "Name",
            "field": "name",
            "inline": true,
            "edit": true
        },
        {
            "title": "Last Visit",
            "field": "added",
            "type": "datetime",
            "inline": true,
            "edit": true
        },
        {
            "title": "Likes",
            "field": "likes",
            "inline": true,
            "edit": true
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

We might not want everyone to add or delete locations. After all you are the admin. Let's add a role to this layer.

```json
"roles": {
    "editor": null
},
```

Now only a user logged in with the `editor` role will be able to see and interact with this layer.

Add a layer with the same table reference but without the draw config nor edit flags in the entries.

```json
{
    "display": true,
    "name": "Bars",
    "format": "wkt",
    "dbs": "NEON",
    "table": "bars",
    "geom": "geom_3857",
    "srid": "3857",
    "qID": "id",
    "cluster": {
        "distance": 10,
        "label": "name"
    },
    "infoj": [
        {
            "type": "pin",
            "label": "ST_PointOnSurface",
            "field": "pin",
            "fieldfx": "ARRAY[ST_X(ST_PointOnSurface(geom_3857)),ST_Y(ST_PointOnSurface(geom_3857))]",
            "class": "display-none"
        },
        {
            "title": "Name",
            "field": "name",
            "inline": true
        },
        {
            "title": "Last Visit",
            "field": "added",
            "type": "datetime",
            "inline": true
        },
        {
            "title": "Likes",
            "field": "likes",
            "inline": true
        },
        {
            "title": "Notes",
            "field": "notes",
            "type": "textarea",
            "skipNullValue": true
        }
    ]
}
```

We added a cluster config to this layer. If two point features are less than the distance in pixels apart they will be clustered together.

We can emphasize this by adding a cluster style. The icon for feature cluster is now drawn twice the original scale.
[Configuration Notes for Cluster Style](https://github.com/GEOLYTIX/xyz/wiki/Configuration#cluster-1)

```json
"style": {
    "cluster": {
        "scale": 2
    }
},
```

## Likes graduated theme

We can replace the style object to provide a graduated theme which will scale better liked bar icons higher.
[Configuration Notes for Graduated Theme](https://github.com/GEOLYTIX/xyz/wiki/Configuration#graduated-themes)

```json
"style": {
    "default": {
        "icon": {
            "svg": "https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg",
            "scale": 0.05
        }
    },
    "cluster": {
        "icon": {
            "svg": "https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg",
            "scale": 0.09
        }
    },
    "theme": {
        "title": "Likes",
        "field": "likes",
        "type": "graduated",
        "cat_arr": [
            {
                "value": 0,
                "label": "meh",
                "style": {
                    "icon": {
                        "svg": "https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg",
                        "scale": 0.05
                    }
                }
            },
            {
                "value": 5,
                "label": "ok",
                "style": {
                    "icon": {
                        "svg": "https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg",
                        "scale": 0.07
                    }
                }
            },
            {
                "value": 10,
                "label": "pretty good",
                "style": {
                    "icon": {
                        "svg": "https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg",
                        "scale": 0.09
                    }
                }
            },
            {
                "value": 50,
                "label": "top notch",
                "style": {
                    "icon": {
                        "svg": "https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg",
                        "scale": 0.11
                    }
                }
            }
        ]
    }
}
```
