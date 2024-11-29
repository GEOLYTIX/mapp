# Query Templates

XYZ/Mapp allows for parameterized queries to be defined as templates to protect against SQL injection.

Let's add the scratch layer from the Getting Started excercise to the belem workspace layers.

We restrict drawing to areas for this layer and make this layer role restricted. Only user logged in user with the "scratch" role will see this layer.

```json
"scratch": {
  "roles": {
    "scratch": true
  },
  "dbs": "NEON",
  "display": true,
  "format": "geojson",
  "table": "scratch",
  "geom": "geom",
  "srid": "4326",
  "qID": "id",
  "draw": {
    "polygon": true,
    "circle_2pt": true,
    "rectangle": true
  },
  "deleteLocation": true,
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
        "geometry": true,
        "snap": true
      }
    },
    {
      "type": "pin",
      "label": "ST_PointOnSurface",
      "field": "pin",
      "fieldfx": "ARRAY[ST_X(ST_PointOnSurface(geom)),ST_Y(ST_PointOnSurface(geom))]"
    },
    {
      "title": "ID",
      "field": "id",
      "inline": true
    },
    {
      "title": "Notes",
      "field": "notes",
      "type": "textarea",
      "edit": true
    },
    {
      "title": "Likes",
      "field": "likes_sum",
      "inline": true,
      "queryparams": {
        "id": true
      },
      "template": {
        "key": "likes_sum",
        "template": "SELECT sum(likes) FROM locations, scratch WHERE ST_INTERSECTS(locations.geom, scratch.geom) AND scratch.id = %{id}",
        "value_only": true
      }
    }
  ]
}
```

We added a field entry for the "likes_sum" field to the infoj entries array. Only this field doesn't exist but should look up a query template which we define as a SQL template string.

```SQL
SELECT sum(likes) FROM locations, scratch WHERE ST_INTERSECTS(locations.geom, scratch.geom) AND scratch.id = %{id};
```

The id from the scratch layer will be provided as query param and substituted in the query template to return a sum of likes for all locations geometries intersecting with the scratch geometry.

![image](https://github.com/user-attachments/assets/8f4b0216-d381-4e08-b236-802e60cff3ae)

