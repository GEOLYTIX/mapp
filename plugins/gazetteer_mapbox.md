The plugin allows for to define `"MAPBOX"`` as the `gazetteer.provider`

A valid access_token must be provided in the gazetteer options.

Additional options to restrict the forward geocoding are referenced in the [mapbox documentation](https://docs.mapbox.com/api/search/geocoding/#forward-geocoding).

```JSON
"gazetteer": {
    "provider": "MAPBOX",
    "options": {
        "country": "GB",
        "access_token": "pk.***"
    }
}
```