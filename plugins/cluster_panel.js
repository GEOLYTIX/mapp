/**
# Cluster Panel

Setting the layer `cluster.panel` flag will enable the cluster panel to be added to the layer view.
The cluster.panel flag will be set if the plugin is configured as `layer.cluster_panel{}`.
 
### Distance or resolution
A WKT/Geojson cluster layer can be configured with a pixel `distance` as integer.

Clustering in the browser through the Openlayers cluster source requires the whole dataset to be loaded and is therefore limited to point datasets which can be loaded as a whole.

A resolution can be defined to enable clustering in the database.

Clustering in the database allows to query huge datasets.

A resolution cluster is only available to cartographic projected point datasets (eg. 3857).

```js
"cluster": {
  "panel": true,
  "resolution": 0.1, // or distance in pixel [integer]
  "resolution_desc": "Resolution",
  "hexgrid": true, // only for resolution cluster
}
```

The `cluster_panel` plugin method could be called from a locale if misconfigured and shouldn't do anything but warn.

@module cluster_panel
@author @dbauszus-glx 
*/

console.log(`cluster_panel v4.8.0`)

mapp.utils.merge(mapp.dictionaries, {
  en: {
    cluster_panel: 'Cluster Panel',
    cluster_panel_distance: 'Distance in pixel between cluster locations.',
    cluster_panel_resolution: 'Resolution',
    cluster_panel_hexgrid: 'Use Hex Grid'
  }
});

mapp.plugins.cluster_panel = () => {

  console.warn(`The panel flag must be set in the layer.cluster config to add a cluster panel to the layer.view drawer.`)
}

mapp.ui.layers.panels.cluster = clusterPanel

/**
@function clusterPanel

@description
The panel flag must be set in the layer cluster configuration.

The panel method returns a drawer with interface elements to control the cluster distance or resolution.

@param {Object} layer Mapp layer object
@param {Object} layer.cluster
The layer default style.
@param {integer} [layer.cluster.distance]
Distance for clustering in the browser [Openlayers].
@param {string} [layer.cluster.panel.distance_desc]
Label for cluster distance slider.
@param {numeric} [layer.cluster.resolution]
Resolution for clustering in the database.
@param {string} [layer.cluster.panel.resolution_desc]
Label for cluster resolution slider.
@param {boolean} [layer.cluster.hexgrid]
Enable hexgrid for resolution cluster.
@param {string} [layer.cluster.panel.hexgrid_desc]
Label for hexgrid checkbox.
@returns {HTMLElement}
A drawer element with controls for cluster parameter.
*/

function clusterPanel(layer) {

  if (!layer.cluster.panel) return;

  // Initialize a timeout variable for delayed actions
  let timeout

  // Create an array to store UI elements
  const elements = []

  // Check if icon_scale is provided (outdated)
  if (layer.cluster.panel.icon_scale) {
    console.warn(`Layer ${layer.key} The layer.cluster_panel.icon_scale parameter is outdated. Please change this to layer.icon_scaling.clusterScale and use the icon_scaling plugin.`)
  }
  // Check if layer clustering settings have distance defined and cluster_panel distance is enabled
  if (layer.cluster.distance) {

    // Push a slider element for adjusting cluster distance
    elements.push(mapp.ui.elements.slider({
      label: layer.cluster.panel.distance_desc || mapp.dictionary.cluster_panel_distance,
      min: layer.cluster.minDistance || 0,
      max: layer.cluster.maxDistance || 100,
      val: parseInt(layer.cluster.distance),
      callback: e => {
        layer.cluster.distance = parseInt(e.target.value)
        clearTimeout(timeout)
        timeout = setTimeout(() => layer.reload(), 400)
      }
    }))
  }

  // Check if layer clustering settings have resolution defined and cluster_panel resolution is enabled
  if (layer.cluster.resolution) {

    // Push a slider element for adjusting cluster resolution
    elements.push(mapp.ui.elements.slider({
      label: layer.cluster.panel.resolution_desc || mapp.dictionary.cluster_panel_resolution,
      data_id: 'resolution',
      min: 1,
      max: 100,
      val: parseInt(1 / layer.cluster.resolution),
      callback: e => {

        layer.params.resolution = isFinite(1 / e.target.value) && (1 / e.target.value) || 0
        clearTimeout(timeout)
        timeout = setTimeout(() => layer.reload(), 400)
      }
    }))
  }

  // Check if layer clustering settings have hexgrid defined and cluster_panel hexgrid is enabled
  if (layer.cluster.hexgrid) {

    // Push a checkbox element for enabling hex grid
    elements.push(mapp.ui.elements.chkbox({
      label: layer.cluster.panel.hexgrid_desc || mapp.dictionary.cluster_panel_hexgrid,
      data_id: 'hexgrid',
      checked: layer.cluster.hexgrid,
      onchange: (checked) => {
        layer.cluster.hexgrid = checked
        layer.params.template = layer.cluster.hexgrid ? 'cluster_hex' : 'cluster';
        clearTimeout(timeout)
        timeout = setTimeout(() => layer.reload(), 400)
      }
    }));
  }

  if (!elements.length) return;

  // Create a drawer element to contain the UI elements
  const drawer = mapp.ui.elements.drawer({
    data_id: 'cluster-drawer',
    class: 'raised',
    header: mapp.utils.html`
        <h3>${mapp.dictionary.cluster_panel}</h3>
        <div class="mask-icon expander"></div>`,
    content: mapp.utils.html`${elements}`
  });

  // Return the created drawer element
  return drawer
}
