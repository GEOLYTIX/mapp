The mapp.ui.layers.panels.cluster_panel method will be added by this plugin.

The panel method returns a drawer with control elements to configure cluster parameter.

The layer will be reloaded after a cluster parameter is changed. Geojson cluster layer do not have to be reloaded. Setting the distance on a geojson cluster layer to 0 will disable clustering.

Control elements will be added to the panel drawer dependent on flags in the config object.

```js
cluster_panel: {
  distance: true,
  kmeans: true,
  dbscan: true,
  resolution: true,
  hexgrid: true,
  icon_scale: true,
  log_scale: true
}
```

`distance` will only apply to geojson cluster. The distance is in pixel between features.

`kmeans` defines the minimum number of cluster to be created in the viewport.

`dbscan` defines the maximum distance between locations in the viewport.

kmeans and dbscan can be used together. the dbscan distance is applied after the kmeans clustering.

`resolution` defines the grid resolution for cluster requests. The resolution can only be set if neither kmeans nor dbscan are set.

`hexgrid` is a boolean which can be controlled with a check box in the panel. A hex grid will be used for the grid resolution cluster.

`icon_scale` defines the base cluster scale which is applied to cluster icons.

`log_scale` allows for logarithmic scaling of cluster features.
