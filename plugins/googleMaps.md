The googleMaps plugin appends a load and autocomplete gazetteer method to the mapp library.

## mapp.plugins.googleMaps(options, mapview)

The plugin method will be called with the options from the locale. The method uses [dynamic library import](https://developers.google.com/maps/documentation/javascript/load-maps-js-api) to load the Google Places library. A key for the API must be provided in the options argument.

```js
"plugins": [
 "${PLUGINS}/googleMaps.js"
],
"googleMaps": {
 "key": "***",
 "v": "weekly",
 "libraries": "places"
},
```

A PlaceService and AutocompleteService will be assigned to mapp.utils.google.

## mapp.utils.gazetteer.GOOGLE(term, gazetteer)

A gazetteer method will be assigned to the gazetteer utils.

The provider key for the locale gazetteer configuration is `GOOGLE`.

The maxZoom will limit the zoom for the flyto location method.

A streetview image can be added to the gazetteer location if provided with a Google key for the streetview API.

The options object can be used to refine the [AutocompletionRequest](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest).

```js
"gazetteer": {
 "provider": "GOOGLE",
 "maxZoom": 10,
 "streetview": {
  "key": "***"
 },
 "options": {
  "componentRestrictions": {
   "country": "UK"
  }
 }
}
```