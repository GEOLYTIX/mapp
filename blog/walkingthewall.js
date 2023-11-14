const params = {
    locale: "Walking The Great Wall of China",
    layer: "The Great Wall",
    id: 1
};

_xyz({
    host: document.head.dataset.dir,
    locale: params.locale,
    callback: init
});

function init(_xyz) {

    _xyz.mapview.create({
        scrollWheelZoom: true,
        target: document.getElementById('map'),
        attribution: {
        target: document.querySelector('#Attribution > .attribution'),
        links: {
          [`XYZ v${_xyz.version}`]: 'https://geolytix.github.io/xyz',
          Openlayers: 'https://openlayers.org'
        }
      }
    });

    const layer = _xyz.layers.list[params.layer];

    layer.zoomToExtent();

    _xyz.locations.select({
        locale: params.locale,
        layer: layer,
        table: layer.table,
        id: params.id,
        callback: location => {

            _xyz.locations.decorate(location);

            _xyz.locations.view.create(location);

            let current_location = location.infoj.filter(entry => entry.field === 'current_location')[0].value;

            let info = _xyz.utils.html.node`<div class="info wrap">`;

            let colours = {
              progress: "#43a047",
              current_steps: "#43a047",
              remaining_steps: "#A4031F"
            }
            
            location.infoj.forEach(entry => {

              if(entry.type !== 'key' && entry.type !== 'geometry'){

                info.appendChild(_xyz.utils.html.node`<div style="grid-column: 1; font-weight: 700;">${entry.title}`);
                info.appendChild(_xyz.utils.html.node`<div style="${'grid-column: 2; text-align: right; color: ' + (colours[entry.field] || '#000;')}">${entry.displayValue}`);
              }

            });

            let container = _xyz.utils.html.node`<div class="wrap"><h4>Walking the Great Wall of China${info}`;

            let _info = new ol.Overlay({
              element: container,
              position: proj([41.6795, 105.02577]),
              positioning: 'center-center',
              offset: [0, 0]
            });

            _xyz.map.addOverlay(_info);

            location.geometries.map(l => l.setZIndex(3000));

            let currentMarker = _xyz.mapview.geoJSON({
              geometry: JSON.parse(current_location),
              style: new ol.style.Style({
                image: new ol.style.Circle({
                  fill: new ol.style.Fill({
                    color: '#A4031F'
                  }),
                  stroke: new ol.style.Stroke({
                    color: '#A4031F',
                  }),
                  radius: 8
                })
              }),
              zIndex: 3001,
              dataProjection: '4326',
              featureProjection: _xyz.mapview.srid
            });

            location.layer.show();

            location.layer.select = () => {

              return

              //_infoOverlay ? _xyz.map.removeOverlay(_info) : _xyz.map.addOverlay(_info);
              //_infoOverlay = !_infoOverlay;
              
            }

            let overlay = pulsatingCircleAnimation(JSON.parse(current_location));
            _xyz.map.addOverlay(overlay);


        }
    });

    function proj(coordinates){

      let lng = parseFloat(coordinates[0]),
          lat = parseFloat(coordinates[1]);

      return ol.proj.transform([lng, lat], 'EPSG:4326', `EPSG:${_xyz.mapview.srid}`);
    }

    function pulsatingCircleAnimation(coordinates) {
     
        return new ol.Overlay({
            element: _xyz.utils.html.node`<div class="hello">`,
            position: proj(coordinates.coordinates),
            positioning: 'center-center',
            offset: [0, 0]
        });
    }
}