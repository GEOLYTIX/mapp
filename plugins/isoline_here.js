export default (function () {

  mapp.utils.merge(mapp.dictionaries, {
    en: {
      couldNotMatchOrigin: 'It was not possible to generate HERE drivetimes in this location. Please try adding a new point in a nearby location.',
      here_set_origin: 'Set travel time origin',
      here_isoline: 'Travel Time',
      here_meta: 'Parameter for Travel Time catchments from HERE API',
      here_mode: 'Mode',
      here_mode_driving: 'Driving',
      here_mode_walking: 'Walking',
      here_range_minutes: 'Travel time in minutes',
      here_datetime_arrive: 'Arrive at',
      here_datetime_depart: 'Depart at',
      here_optimize_for: 'Optimize for',
      here_optimize_for_balanced: 'Balanced',
      here_optimize_for_quality: 'Quality',
      here_optimize_for_performance: 'Performance',
    },
    de: {
      here_isoline: 'Fahrzeit',
      here_meta: 'Parameter für Here API',
      here_mode: 'Modus',
      here_mode_driving: 'Kraftfahrzeug',
      here_mode_walking: 'zu Fuß',
      here_range_minutes: 'Fahrzeit in Minuten',
      here_datetime_arrive: 'Ankunft',
      here_datetime_depart: 'Abfahrt',
      here_optimize_for: 'Optimisierung',
      here_optimize_for_balanced: 'Ausgeglichen',
      here_optimize_for_quality: 'Qualität',
      here_optimize_for_performance: 'Leistung',
    },
    cn: {
      here_mode_driving: '机动车行',
      here_mode_walking: '步行',
      here_range_minutes: '以分钟计交通时间 ',
    },
    pl: {
      here_mode: 'Środek transportu',
      here_mode_driving: 'samochodem',
      here_mode_walking: 'piechotą',
      here_range_minutes: 'Czas podróży w minutach',
      here_datetime_arrive: 'Rozpocznij',
      here_datetime_depart: 'Osiągnij cel',
      here_optimize_for: 'Optymalizacja',
      here_optimize_for_balanced: 'zrównoważona',
      here_optimize_for_quality: 'jakość',
      here_optimize_for_performance: 'wydajność',
    },
    ko: {
      here_mode_driving: '운전',
      here_mode_walking: '도보',
      here_range_minutes: '여행시간(분) ',
    },
    fr: {
      here_mode: 'Type de transport',
      here_mode_driving: 'en voiture',
      here_mode_walking: 'à pied',
      here_range_minutes: 'Temps du trajet en minutes',
      here_datetime_depart: 'Partir à',
      here_datetime_arrive: 'Arriver à',
      here_optimize_for: 'Optimiser',
      here_optimize_for_balanced: 'l\'équilibre',
      here_optimize_for_quality: 'la qualité',
      here_optimize_for_performance: 'les performances',
    },
    ja: {
      here_mode_driving: 'ドライビング',
      here_mode_walking: 'ウォーキング',
      here_range_minutes: '移動時間 (分) ',
    }
  })

  mapp.ui.elements.drawing.isoline_here = layer => {

    layer.draw.isoline_here = Object.assign({
      layer,
      type: 'Point',
      'range[type]': 'time',
      range: 10,
      rangeMin: 5,
      rangeMax: 60,
      transportMode: 'car',
      optimizeFor: 'balanced',
      geometryFunction: coordinates => mapp.utils.here.geometryFunction(coordinates, layer),
    }, typeof layer.draw.isoline_here === 'object' && layer.draw.isoline_here || {})

    layer.draw.isoline_here.panel = mapp.ui.elements.isoline_here_panel(layer.draw.isoline_here)

    layer.draw.isoline_here.btn = mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${e=>{
  
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
      
        layer.draw.isoline_here.callback = feature => {

          if (layer.draw.isoline_here.default_fields) {

            // Assign the config value from layer.draw.isoline_here to defaults field.
            layer.draw.isoline_here.defaults = Object.assign(
              layer.draw.isoline_here.defaults || {},
              ...Object.entries(layer.draw.isoline_here.default_fields)
                .map(default_entry => ({ [default_entry[0]]: layer.draw.isoline_here[default_entry[1]] }))
            )
          }
    
          layer.draw.callback(feature, layer.draw.isoline_here)
      
          if (btn.classList.contains('active')) {
            btn.classList.remove('active')
            layer.mapview.interactions.highlight()
          }
        }
      
        layer.mapview.interactions.draw(layer.draw.isoline_here)
        
      }}>
      ${mapp.dictionary.here_set_origin}`

    if (layer.draw.isoline_here.panel) {

      // Return the config element in a drawer with the interaction toggle button as sibling.
      return mapp.utils.html.node`<div>
      ${mapp.ui.elements.drawer({
        header: mapp.utils.html`
          <h3>${mapp.dictionary.here_isoline}</h3>
          <div class="mask-icon expander"></div>`,
        content: layer.draw.isoline_here.panel
      })}
      ${layer.draw.isoline_here.btn}`

    }

    return layer.draw.isoline_here.btn
  }

  mapp.ui.locations.entries.isoline_here = entry => {

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

      // Assign entry params to defaults
      const params = Object.assign({
        'range[type]': 'time',
        minutes: 10,
        reverseDirection: false,
        transportMode: 'car',
        optimizeFor: 'balanced'
      }, entry.params)

    if (!params['range[values]']) params['range[values]'] = params.minutes * 60
    delete params.minutes

    params.origin = `${params.latlng[1]},${params.latlng[0]}`
    delete params.latlng

    mapp.utils
      .xhr(`https://isoline.router.hereapi.com/v8/isolines?${mapp.utils.paramString(params)}`)
      .then(response => {

        if (!entry.location.remove) return;

        if (!response.isolines) {

          alert('Failed to process request')

          entry.display = false

          entry.disabled = true

          // Update the location to process other entries.
          entry.location.view.dispatchEvent(new Event('updateInfo'))
          return;
        }

        // Decode outer here isoline.
        const decoded = mapp.utils.here.decodeIsoline(response.isolines[0].polygons[0].outer, true)

        // Assign feature geometry as new value.
        entry.newValue = {
          type: 'Polygon',
          coordinates: [decoded.polyline]
        }

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

  mapp.ui.elements.isoline_here_panel = params => {

    const entries_mode = [
      {
        title: [mapp.dictionary.here_mode_driving],
        option: 'car',
      },
      {
        title: [mapp.dictionary.here_mode_walking],
        option: 'pedestrian',
      },
    ]

    const modeDropDown = params.transportMode ? mapp.utils.html.node`
      <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
        <div style="grid-column: 1;">${mapp.dictionary.here_mode}</div>
        <div style="grid-column: 2;">
          ${mapp.ui.elements.dropdown({
      entries: entries_mode,
      placeholder: entries_mode.find(entry => entry.option === params.transportMode).title,
      callback: (e, entry) => {
        params.transportMode = entry.option;
      }
    })}` : undefined;

    const entries_optimization = [
      {
        title: [mapp.dictionary.here_optimize_for_balanced],
        option: 'balanced',
      },
      {
        title: [mapp.dictionary.here_optimize_for_quality],
        option: 'quality',
      },
      {
        title: [mapp.dictionary.here_optimize_for_performance],
        option: 'performance',
      },
    ]

    const optimisedForDropDown = params.optimizeFor ? mapp.utils.html.node`
      <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
        <div style="grid-column: 1;">${mapp.dictionary.here_optimize_for}</div>
        <div style="grid-column: 2;">
          ${mapp.ui.elements.dropdown({
      entries: entries_optimization,
      placeholder: entries_optimization.find(entry => entry.option === params.optimizeFor).title,
      callback: (e, entry) => {
        params.optimizeFor = entry.option;
      },
    })}` : undefined;

    let date_picker_label = params.dateISO ? mapp.utils.html.node`
      <span>${mapp.dictionary.here_datetime_depart}` : undefined;

    let dateSelect = params.dateISO ? mapp.utils.html.node`
      <input
        type="datetime-local"
        onchange=${e => {
        const reverseDirectionChk = paramsDrawer.querySelector('[data-id=reverse_direction] > input')

        if (e.target.value) {

          params.dateISO = new Date(e.target.value).toISOString()

          // reverse direction not valid in combination with a dateISO param.
          if (reverseDirectionChk) {
            params.reverseDirection = false
            reverseDirectionChk.checked = false
            reverseDirectionChk.disabled = true
          }

        } else {

          params.dateISO = undefined
          if (reverseDirectionChk) reverseDirectionChk.disabled = false
        }
      }}>` : undefined;

    const datePicker = mapp.utils.html.node`
      <div>
        ${date_picker_label}
        ${dateSelect}`

    const reverseDirectionChk = params.reverseDirection ? mapp.ui.elements.chkbox({
      label: 'Reverse Direction Isoline',
      data_id: 'reverse_direction',
      checked: !!params.reverseDirection,
      onchange: (checked) => {
        date_picker_label.textContent = checked && mapp.dictionary.here_datetime_arrive || mapp.dictionary.here_datetime_depart
        params.reverseDirection = checked
      }
    }) : undefined;

    const rangeSlider = params.range ? mapp.ui.elements.slider({
      label: mapp.dictionary.here_range_minutes,
      min: params.rangeMin,
      max: params.rangeMax,
      val: 10,
      callback: e => {
        params.range = parseInt(e.target.value)
      }
    }) : undefined;

    return mapp.utils.html.node`
    <div class="panel flex-col">
      <p>${mapp.dictionary.here_meta}</p>
      ${modeDropDown}
      ${optimisedForDropDown}
      ${datePicker}
      ${reverseDirectionChk}
      ${rangeSlider}`
  }

  // Assign here utils.
  mapp.utils.here = {
    decodeIsoline: decode,
    geometryFunction
  }

  function geometryFunction(coordinates, layer) {

    layer.draw.isoline_here.origin = ol.proj.transform(coordinates, `EPSG:${layer.mapview.srid}`, 'EPSG:4326')
    layer.draw.isoline_here.lng = layer.draw.isoline_here.origin[0]
    layer.draw.isoline_here.lat = layer.draw.isoline_here.origin[1]

    // Create params object for Here API call.
    const hereParams = {
      'range[type]': layer.draw.isoline_here['range[type]'],
      'range[values]': layer.draw.isoline_here.range * 60,
      transportMode: layer.draw.isoline_here.transportMode,
      optimizeFor: layer.draw.isoline_here.optimizeFor,
      origin: `${layer.draw.isoline_here.origin[1]},${layer.draw.isoline_here.origin[0]}`,
      apiKey: layer.draw.isoline_here.apiKey
    }

    if (layer.draw.isoline_here.dateISO) {
      hereParams[layer.draw.isoline_here.reverseDirection && 'arrivalTime' || 'departureTime'] = new Date(layer.draw.isoline_here.dateISO).toISOString()
    }

    mapp.utils
      .xhr(`https://isoline.router.hereapi.com/v8/isolines?${mapp.utils.paramString(hereParams)}`)
      .then(response => {

        if (!response.isolines) {
          console.log(response)
          return alert(mapp.dictionary[response.notices[0].code] || 'Query failed.')
        }

        // Decode outer here isoline.
        const decoded = mapp.utils.here.decodeIsoline(response.isolines[0].polygons[0].outer, true)

        const feature = layer.mapview.interaction.format.readFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [decoded.polyline]
          }
        }, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:' + layer.mapview.srid
        })

        layer.mapview.interaction.source.clear();

        layer.mapview.interaction.source.addFeature(feature);

      })

    return;
  }

  /*
 * Copyright (C) 2019 HERE Europe B.V.
 * Licensed under MIT, see full license in LICENSE
 * SPDX-License-Identifier: MIT
 * License-Filename: LICENSE
 */

  const DECODING_TABLE = [
    62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
  ];

  const FORMAT_VERSION = 1;

  const Num = typeof BigInt !== "undefined" ? BigInt : Number;

  function decode(encoded, reverse) {
    const decoder = decodeUnsignedValues(encoded);
    const header = decodeHeader(decoder[0], decoder[1]);

    const factorDegree = 10 ** header.precision;
    const factorZ = 10 ** header.thirdDimPrecision;
    const { thirdDim } = header;

    let lastLat = 0;
    let lastLng = 0;
    let lastZ = 0;
    const res = [];

    let i = 2;
    for (; i < decoder.length;) {
      const deltaLat = toSigned(decoder[i]) / factorDegree;
      const deltaLng = toSigned(decoder[i + 1]) / factorDegree;
      lastLat += deltaLat;
      lastLng += deltaLng;

      if (thirdDim) {
        const deltaZ = toSigned(decoder[i + 2]) / factorZ;
        lastZ += deltaZ;
        res.push([lastLat, lastLng, lastZ]);
        i += 3;
      } else {
        res.push([lastLat, lastLng]);
        i += 2;
      }
    }

    if (i !== decoder.length) {
      throw new Error('Invalid encoding. Premature ending reached');
    }

    return {
      ...header,
      polyline: reverse ? res.map(p => p.reverse()) : res
    };
  }

  function decodeChar(char) {
    const charCode = char.charCodeAt(0);
    return DECODING_TABLE[charCode - 45];
  }

  function decodeUnsignedValues(encoded) {
    let result = Num(0);
    let shift = Num(0);
    const resList = [];

    encoded.split('').forEach((char) => {
      const value = Num(decodeChar(char));
      result |= (value & Num(0x1F)) << shift;
      if ((value & Num(0x20)) === Num(0)) {
        resList.push(result);
        result = Num(0);
        shift = Num(0);
      } else {
        shift += Num(5);
      }
    });

    if (shift > 0) {
      throw new Error('Invalid encoding');
    }

    return resList;
  }

  function decodeHeader(version, encodedHeader) {
    if (+version.toString() !== FORMAT_VERSION) {
      throw new Error('Invalid format version');
    }
    const headerNumber = +encodedHeader.toString();
    const precision = headerNumber & 15;
    const thirdDim = (headerNumber >> 4) & 7;
    const thirdDimPrecision = (headerNumber >> 7) & 15;
    return { precision, thirdDim, thirdDimPrecision };
  }

  function toSigned(val) {
    // Decode the sign from an unsigned value
    let res = val;
    if (res & Num(1)) {
      res = ~res;
    }
    res >>= Num(1);
    return +res.toString();
  }

})()