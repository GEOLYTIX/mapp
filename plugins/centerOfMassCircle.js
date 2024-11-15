console.log('centerOfMassCircle')

import * as turf from 'https://esm.sh/@turf/turf@7.1.0';

mapp.layer.featureFormats.centerOfMassCircle = centerOfMassCircle

function centerOfMassCircle(layer, features) {

  const formatGeojson = new ol.format.GeoJSON

  mapp.layer.featureFields.reset(layer);

  return features.map((feature) => {

    // Populate featureFields values array with feature property values.
    layer.params.fields?.forEach(field => {

      layer.featureFields[field].values.push(feature.properties[field]);
    })

    const center = turf.centerOfMass(feature.geometry)

    const area = turf.area(feature.geometry)

    const radius =  Math.sqrt(area/Math.PI) / 1000

    const circle = turf.circle(center, radius)

    return new ol.Feature({
      id: feature.id,
      geometry: formatGeojson.readGeometry(circle.geometry, {
        dataProjection: 'EPSG:' + layer.srid,
        featureProjection: 'EPSG:' + layer.mapview.srid,
      }),
      ...feature.properties
    })

  })
}
