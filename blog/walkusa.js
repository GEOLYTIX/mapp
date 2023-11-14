const params = {
    locale: "Walking America",
    layer: "Route",
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
        scrollWheelZoom: true,
        attribution: {
        target: document.querySelector('#Attribution > .attribution'),
        links: {
          [`XYZ v${_xyz.version}`]: 'https://geolytix.github.io/xyz',
          Openlayers: 'https://openlayers.org'
        }
      }
    });

    const layer = _xyz.layers.list[params.layer];

    _xyz.layers.list['Landmarks'].zoomToExtent();

    _xyz.locations.select({
        locale: params.locale,
        layer: layer,
        table: layer.table,
        id: params.id,
        callback: location => {

           if(location.view) return

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

              if(entry.type !== 'key' && entry.type !== 'geometry' && entry.value){

                info.appendChild(_xyz.utils.html.node`<div style="grid-column: 1; font-weight: 700;">${entry.title.toUpperCase()}`);
                info.appendChild(_xyz.utils.html.node`<div style="${'grid-column: 2; text-align: right; font-weight: 500; color: ' + (colours[entry.field] || '#000;')}">${entry.displayValue}`);
              }

            });

            let container = _xyz.utils.html.node`<div class="wrap" style="width: 300px;">
            <div><div style="height: 14px; width: 14px; border-radius: 50%; background-color: #04724D; display:inline-block;" class="_blinking">
            </div>
            <div style="display: inline-block;"><h2>WALKING AMERICA</h2></div></div>
            <div>${info}`;

            let _info = new ol.Overlay({
              element: container,
              position: proj([41.679, 105.025]),
              positioning: 'center-center',
              offset: [-20, 0]
            });

            _xyz.map.addOverlay(_info);

            location.geometries.map(l => l.setZIndex(3000));

            let currentMarker = _xyz.mapview.geoJSON({
              geometry: JSON.parse(current_location),
              style: new ol.style.Style({
                image: new ol.style.Circle({
                  fill: new ol.style.Fill({
                    color: '#04724D'//'#A4031F'
                  }),
                  stroke: new ol.style.Stroke({
                    color: '#04724D',//'#A4031F',
                  }),
                  radius: 8
                })
              }),
              zIndex: 3001,
              dataProjection: '4326',
              featureProjection: _xyz.mapview.srid
            });

            location.layer.show();

            // begin streetview 

            const lnglat = JSON.parse(current_location).coordinates

            /*const src = `${_xyz.host}/api/proxy?uri=`
            + `https://maps.googleapis.com/maps/api/streetview?`
            + `location=${lnglat[1]},${lnglat[0]}%26source=outdoor%26size=300x230&provider=GOOGLE`;*/

            const src = `${_xyz.host}/api/proxy?uri=`
            + `https://maps.googleapis.com/maps/api/streetview?`
            + `location=25.8054063,-80.1228217%26source=outdoor%26size=300x230&provider=GOOGLE`

            /*document.getElementById('current-sv').appendChild(_xyz.utils.html.node`
              <div style="background-color: rgba(0, 0, 0, 0.1); padding: 5px; border-radius: 2px;">
              <a target="_blank"
              href="${'https://www.google.com/maps?cbll=' + lnglat[1] + ',' + lnglat[0] + '&layer=c'}">
              <img src="${src}" style="border-radius: 2px;">`);*/

            document.getElementById('current-sv').appendChild(_xyz.utils.html.node`
              <div style="background-color: rgba(0, 0, 0, 0.1); padding: 5px; border-radius: 2px;">
              <a target="_blank"
               href="https://www.google.com/maps?cbll=25.8054063,-80.1228217,3a,75y,202.27h,84.14t&layer=c">
               <img src="${src}" style="border-radius: 2px;">`)

            // end streetview 

            location.layer.select = () => {  
              return
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