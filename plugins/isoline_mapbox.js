export default (function () {

    mapp.utils.merge(mapp.dictionaries, {
      en: {
        mapbox_set_origin: 'Set travel time origin',
        mapbox_isoline: 'Travel Time',
        mapbox_meta: 'Parameter for catchments from Mapbox Isochrone API',
        mapbox_profile: 'Profile',
        mapbox_profile_driving: 'Driving',
        mapbox_profile_driving_traffic: 'Driving (Traffic)',
        mapbox_profile_walking: 'Walking',
        mapbox_profile_cycling: 'Cycling',
        minutes_minutes: 'Travel time in minutes'
      },
      de: {
        mapbox_set_origin: 'Startpunkt',
        mapbox_isoline: 'Fahrzeit',
        mapbox_meta: 'Parameter für Mapbox Isochrone API',
        mapbox_profile: 'Profil',
        mapbox_profile_driving: 'Fahrzeug',
        mapbox_profile_driving_traffic: 'Fahrzeug (Verkehr)',
        mapbox_profile_walking: 'zu Fuß',
        mapbox_profile_cycling: 'Fahrrad',
        minutes_minutes: 'Fahrzeit in Minuten'
      }
    })
  
    mapp.ui.elements.drawing.isoline_mapbox = layer => {
  
      layer.draw.isoline_mapbox = Object.assign({
        layer,
        type: 'Point',
        profile: 'driving',
        minutes: 10,
        minutesMin: 5,
        minutesMax: 60,
        geometryFunction: coordinates => mapp.utils.mapbox.geometryFunction(coordinates, layer),
      }, typeof layer.draw.isoline_mapbox === 'object' && layer.draw.isoline_mapbox || {})
  
      layer.draw.isoline_mapbox.panel = mapp.ui.elements.isoline_mapbox_panel(layer.draw.isoline_mapbox)
  
      layer.draw.isoline_mapbox.btn = mapp.utils.html.node`
          <button
          class="flat wide bold primary-colour"
          onclick=${e => {
  
          const btn = e.target
  
          if (btn.classList.contains('active')) {
            btn.classList.remove('active')
            layer.mapview.interactions.highlight()
            return;
          }
  
          // Expand the config drawer.
          btn.previousElementSibling.classList.add('expanded')
  
          btn.classList.add('active')
  
          layer.show()
  
          layer.draw.isoline_mapbox.callback = feature => {
  
            if (layer.draw.isoline_mapbox.default_fields) {
  
              // Assign the config value from layer.draw.isoline_mapbox to defaults field.
              layer.draw.isoline_mapbox.defaults = Object.assign(
                layer.draw.isoline_mapbox.defaults || {},
                ...Object.entries(layer.draw.isoline_mapbox.default_fields)
                  .map(default_entry => ({ [default_entry[0]]: layer.draw.isoline_mapbox[default_entry[1]] }))
              )
            }
  
            layer.draw.callback(feature, layer.draw.isoline_mapbox)
  
            if (btn.classList.contains('active')) {
              btn.classList.remove('active')
              layer.mapview.interactions.highlight()
            }
          }
  
          layer.mapview.interactions.draw(layer.draw.isoline_mapbox)
  
        }}>${mapp.dictionary.mapbox_set_origin}`
  
      if (layer.draw.isoline_mapbox.panel) {
  
        // Return the config element in a drawer with the interaction toggle button as sibling.
        return mapp.utils.html.node`<div>
            ${mapp.ui.elements.drawer({
          header: mapp.utils.html`
                <h3>${mapp.dictionary.mapbox_isoline}</h3>
                <div class="mask-icon expander"></div>`,
          content: layer.draw.isoline_mapbox.panel
        })}
            ${layer.draw.isoline_mapbox.btn}`
  
      }
  
      return layer.draw.isoline_mapbox.btn
    }
  
    mapp.ui.locations.entries.isoline_mapbox = entry => {
  
      entry.value = typeof entry.value === 'string'
        && JSON.parse(entry.value)
        || entry.value
  
  
      // Create OL style object
      // Assign Style if not already assigned.
      entry.Style = entry.Style
        || typeof entry.style === 'object' && mapp.utils.style(entry.style)
  
        // Assign style from location.
        || entry.location.Style
  
      const chkbox = mapp.ui.elements.chkbox({
        label: entry.label || 'Isoline',
        checked: !!entry.display,
        disabled: entry.disabled,
        onchange: (checked) => {
  
          // Show geometry of checked.
          if (checked) {
            entry.show()
  
          } else {
  
            // Remove the geometry layer from map.
            entry.display = false
            entry.L && entry.location.layer.mapview.Map.removeLayer(entry.L)
          }
        }
      })
  
      entry.show = () => {
  
        entry.display = true
  
        if (entry.L) {
  
          // Remove existing layer to prevent assertion error.
          entry.location.layer.mapview.Map.removeLayer(entry.L)
  
          // Add existing geometry layer to mapview
          entry.location.layer.mapview.Map.addLayer(entry.L)
          return;
        }
  
        if (entry.value) {
  
          entry.L = entry.location.layer.mapview.geoJSON({
            zIndex: entry.zIndex,
            geometry: entry.value,
            Style: entry.Style,
            dataProjection: '4326'
          })
  
          entry.location.Layers.push(entry.L)
          return;
        }
  
        const pin = entry.location.infoj.find(lookup => lookup.type === 'pin')
  
        entry.params.latlng = ol.proj.transform(pin.value,
          `EPSG:${pin.srid || '3857'}`,
          'EPSG:4326')
  
        entry.location.view?.classList.add('disabled')
  
        mapp.utils
        .xhr(`https://api.mapbox.com/isochrone/v1/mapbox/${entry.params.profile}/${entry.params.latlng.join(',')}?${mapp.utils.paramString({
            contours_minutes: entry.params.minutes,
            polygons: true,
            access_token: entry.params.access_token
        })}`)
        .then(response => {
   
          if (!response.features) return;
   
          // Assign feature geometry as new value.
          entry.newValue = response.features[0].geometry
  
          // Update the location in the database.
          // The location view will be updated through callback after the update method.
          entry.location.update()
        })
  
        return true;
      }
  
      // entry.show() returns true if location.update() is called.
      if (entry.display && entry.show()) return 'break';
  
      const icon = entry.style && mapp.utils.html`
      ${mapp.ui.elements.legendIcon(
        Object.assign({ width: 24, height: 24 }, entry.style)
      )}`;
  
      return mapp.utils.html.node`<div class="flex-spacer">${chkbox}${icon}`
    }
  
    mapp.ui.elements.isoline_mapbox_panel = params => {
  
      const entries_profile = [
        {
          title: [mapp.dictionary.mapbox_profile_driving],
          option: 'driving',
        },
        {
          title: [mapp.dictionary.mapbox_profile_driving_traffic],
          option: 'driving-traffic',
        },
        {
          title: [mapp.dictionary.mapbox_profile_walking],
          option: 'walking',
        },
        {
          title: [mapp.dictionary.mapbox_profile_cycling],
          option: 'cycling',
        }
      ]
  
      const profileDropDown = params.profile ? mapp.utils.html.node`
            <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
              <div style="grid-column: 1;">${mapp.dictionary.mapbox_profile}</div>
              <div style="grid-column: 2;">
                ${mapp.ui.elements.dropdown({
        entries: entries_profile,
        placeholder: entries_profile.find(entry => entry.option === params.profile).title,
        callback: (e, entry) => {
          params.profile = entry.option;
        }
      })}` : undefined;
  
      const minuteSlider = params.minutes ? mapp.ui.elements.slider({
        label: mapp.dictionary.mapbox_minutes,
        min: params.minuteMin,
        max: params.minuteMax,
        val: 10,
        callback: e => {
          params.minutes = parseInt(e.target.value)
        }
      }) : undefined;
  
      return mapp.utils.html.node`
          <div class="panel flex-col">
            <p>${mapp.dictionary.mapbox_meta}</p>
            ${profileDropDown}
            ${minuteSlider}`
    }
  
    // Assign mapbox utils.
    mapp.utils.mapbox = {
      geometryFunction
    }
  
    function geometryFunction(coordinates, layer) {
  
      layer.draw.isoline_mapbox.origin = ol.proj.transform(coordinates, `EPSG:${layer.mapview.srid}`, 'EPSG:4326')
      layer.draw.isoline_mapbox.lng = layer.draw.isoline_mapbox.origin[0]
      layer.draw.isoline_mapbox.lat = layer.draw.isoline_mapbox.origin[1]
  
      mapp.utils
      .xhr(`https://api.mapbox.com/isochrone/v1/mapbox/${layer.draw.isoline_mapbox.profile}/${layer.draw.isoline_mapbox.origin.join(',')}?${mapp.utils.paramString({
          contours_minutes: layer.draw.isoline_mapbox.minutes,
          polygons: true,
          access_token: layer.draw.isoline_mapbox.access_token
      })}`)
      .then(response => {
  
          if (!response.features) return;
  
          const feature = layer.mapview.interaction.format.readFeature({
              type: 'Feature',
              geometry: response.features[0].geometry
          }, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:' + layer.mapview.srid
          })
  
          layer.mapview.interaction.source.clear();
  
          layer.mapview.interaction.source.addFeature(feature);
  
      })
  
      return;
    }    
  
  })()