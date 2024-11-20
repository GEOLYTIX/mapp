/**

# Graduated Theme Slider

Ammends the mapp.ui.layers.legends.graduated() legend method to check for the theme_slider:true flag.

The graduated theme legend will add slider controls for the layer transparency and to select a field from the fields[] array to theme.

A checkbox allows to toggle an automated loop through the fields.

```json
{
  "title": "By Hour",
  "type": "graduated",
  "theme_slider": true,
  "field": "hours_index_15",
  "fields": [
    "hours_index_00",
    "hours_index_01",
    "hours_index_02",
    "hours_index_03",
    "hours_index_04",
    "hours_index_05",
    "hours_index_06",
    "hours_index_07",
    "hours_index_08",
    "hours_index_09",
    "hours_index_10",
    "hours_index_11",
    "hours_index_12",
    "hours_index_13",
    "hours_index_14",
    "hours_index_15",
    "hours_index_16",
    "hours_index_17",
    "hours_index_18",
    "hours_index_19",
    "hours_index_20",
    "hours_index_21",
    "hours_index_22",
    "hours_index_23"
  ],
  "cat_arr": [
    {
      "value": "1",
      "label": "Lowest",
      "style": {
        "fillColor": "#ffffb2"
      }
    },
    {
      "value": "2",
      "label": "Low",
      "style": {
        "fillColor": "#fed976"
      }
    },
    {
      "value": "3",
      "label": "Medium Low",
      "style": {
        "fillColor": "#feb24c"
      }
    },
    {
      "value": "4",
      "label": "Medium",
      "style": {
        "fillColor": "#fd8d3c"
      }
    },
    {
      "value": "5",
      "label": "Medium High",
      "style": {
        "fillColor": "#fc4e2a"
      }
    },
    {
      "value": "6",
      "label": "High",
      "style": {
        "fillColor": "#e31a1c"
      }
    },
    {
      "value": "7",
      "label": "Highest",
      "style": {
        "fillColor": "#b10026"
      }
    }
  ]
}
```

### 📝 Reviewed by
[@dbauszus-glx](https://github.com/dbauszus-glx) (29/02/2024)
[@RobAndrewHurst](https://github.com/RobAndrewHurst) (27/02/2024)

@module graduated_theme_slider
@author @dbauszus-glx
*/

console.log(`graduated_theme_slider v4.8`)

// Create a clone of the original style method.
const graduatedStyleFunction = mapp.ui.layers.legends.graduated.bind({});

/**
mapp.ui.layers.legends.graduated(layer)

@function graduated
@param {Object} layer
The layer object with a graduated style theme.

@returns {element}
The legend element.
*/

// Add dictionary definitions 
mapp.utils.merge(mapp.dictionaries, {
  en: {
    transparency: "Transparency",
    hour_slider: "Hour",
    hour_slider_loop: "24 Hour Loop"
  },
  de: {
    transparency: "Opazität",
    hour_slider: "Stunde",
    hour_slider_loop: "24-Stunden-Schleife"
  },
  pl: {
    transparency: "Przezroczystość",
    hour_slider: "Godzina",
    hour_slider_loop: "Pętla 24-godzinna"
  }
});

mapp.ui.layers.legends.graduated = layer => {

  // Create the graduated theme layer.style.legend
  graduatedStyleFunction(layer)

  // Return the graduated theme legend without a slider control.
  if (!layer.style.theme.theme_slider) return layer.style.legend;

  if (!layer.style.theme.fields) {
    console.warn(`The graduated theme with theme_slider:true requires a theme.fields[] array.`)

    return layer.style.legend;
  }

  let loopInterval;

  let loop_chkbox = mapp.ui.elements.chkbox({
    label: `${mapp.dictionary.hour_slider_loop}`,
    onchange: (checked) => {

      if (checked) {

        let slider = hour_slider.querySelector('input')

        loopInterval = setInterval(() => {
          slider.value++
          if (slider.value == 24) slider.value = 0
          slider.dispatchEvent(new Event('input'))
        }, 800)

      } else {
        clearInterval(loopInterval)
      }
    }
  })

  let styleTimeout;

  let hour_slider = mapp.ui.elements.slider({
    label: `${mapp.dictionary.hour_slider}:`,
    min: 0,
    max: 23,
    // Val is Deprecated in v4.10.0 so including value too
    val: 0,
    value: 0,
    callback: e => {

      if (styleTimeout) clearTimeout(styleTimeout)

      // e.target.value deprecated in v4.10.0, so including e too
      layer.style.theme.field = layer.style.theme.fields[parseInt(e?.target?.value || e)]

      styleTimeout = setTimeout(() => {
        layer.L.changed()
      }, 300)
    }
  })

  let transparency_slider = mapp.ui.elements.slider({
    label: `${mapp.dictionary.transparency}:`,
    min: 0,
    max: 1,
    // Val is Deprecated in v4.10.0 so including value too
    val: 1,
    value: 1,
    step: 0.1,
    callback: e => {
      // e.target.value deprecated in v4.10.0, so including e too
      layer.L.setOpacity(parseFloat(e?.target?.value || e))
    }
  })

  // Re-render the layer.style.legend with the additional elements.
  layer.style.legend = mapp.utils.html.node`<div class="content">
    ${layer.style.legend}
    ${loop_chkbox}
    ${hour_slider}
    ${transparency_slider}`

  return layer.style.legend;
}
