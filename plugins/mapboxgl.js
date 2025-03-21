/**
 * # Mapboxgl
 * ### 📝 Reviewed by
 * - [@RobAndrewHurst](https://github.com/RobAndrewHurst) (22/02/24)
 * ### Description
 * * Adds layer format mapboxgl to support mapbox studio styles v2++
 * 
 * - The plugin imports mapbox-gl@3.1.2 from esm.sh and adds the mapboxgl layer format.
 * - Mapboxgl layer require a valid mapbox accessKey.
 * - Mapboxgl layer support current 3.1.2 styles created with Mapbox Studio.

### Example
```json
"mapbox_street": {
  "format": "mapboxgl",
  "style": {
    "URL": "mapbox://styles/dbauszus/clsue74w300ge01pk7j5paw8w"
  },
  "accessToken": "pk.***",
  "attribution": {
    "© Mapbox": "https://www.mapbox.com/about/maps",
    "© OpenStreetMap": "http://www.openstreetmap.org/copyright"
  }
} 
 *@module mapboxgl
 *@author @dbauszus-glx 
 *
*/

import mapboxgl from 'https://esm.sh/mapbox-gl@3.1.2';

console.log('mapboxgl v3.1.2 for mapp v4.8.0');

/**
 * This function will execute for all mapboxgl layers.
 * @function mapboxgl
 * @param {Object} layer
 * @async
 * @returns {Object} canvas
 */
mapp.layer.formats.mapboxgl = async (layer) => {
  layer.container = mapp.utils.html.node`<div 
    class="mapboxgl" 
    style="visibility: hidden; position: absolute; width: 100%; height: 100%;">`;

  layer.mapview.Map.getTargetElement().prepend(layer.container);

  mapboxgl.accessToken = layer.accessToken;

  layer.Map = new mapboxgl.Map({
    container: layer.container,
    style: layer.style.URL,
    attributionControl: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragPan: false,
    dragRotate: false,
    interactive: false,
    keyboard: false,
    pitchWithRotate: false,
    scrollZoom: false,
    touchZoomRotate: false,
  });

  if (!layer.Map) return;

  // The Maplibre Map control must resize with mapview Map targetElement.
  layer.mapview.Map.getTargetElement().addEventListener('resize', () =>
    layer.Map.resize(),
  );

  layer.L = new ol.layer.Layer({
    zIndex: layer.zIndex || 0,
    render: (frameState) => {
      if (!layer.display) return;

      layer.container.style.visibility = 'visible';

      const canvas = layer.Map.getCanvas();

      canvas.style.position = 'absolute';

      // adjust view parameters in mapbox
      layer.Map.jumpTo({
        center: ol.proj.toLonLat(frameState.viewState.center),
        zoom: frameState.viewState.zoom - 1,
        bearing: (-frameState.viewState.rotation * 180) / Math.PI,
        animate: false,
      });

      if (layer.Map._frame) {
        layer.Map._frame.cancel();
        layer.Map._frame = null;
      }
      layer.Map._render();

      return canvas;
    },
  });
};
