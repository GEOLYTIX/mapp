#  Layer formats & Styles

Mapp supports different layer formats.

Change the `format` of the scratch layer from `geojson` to `mvt`. And reload the mapview. You will notice that there are tile requests when the viewport changes. Geojson datasets are cached in the application and only requested if a filter or the dataset itself changes. The geojson format is limited to datasets which do not exceed the lambda payload.

MVT layer request vector tiles generated in the PostGIS data-layer. The benefit of MVT layer is that the dataset is not restricted.

## WKT & Cluster