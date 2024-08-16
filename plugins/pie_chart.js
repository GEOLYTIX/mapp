/**
# Pie Chart 📊

### 📝 Reviewed by
dbauszus-glx 2/8/24

### Description
* Adds two methods to the mapp object to create a pie chart theme and legend.
* The pie chart theme method creates a pie chart from a feature's properties (fields) and appends it to the feature's style.
* The pie chart legend method creates a legend for the pie chart theme.
* This method supports the use of the `icon_scaling` plugin.
* You provide a field, label and icon colour for each field in the pie chart.
* Your `fields` array must contain the fields you want to use for the pie chart.

### How to use 📌

Add the plugin to the `workspace.plugins` array.
```json 
"plugins":[
    "${PLUGINS}/pie_chart.js"
]
```
Define your theme in the `layer.style.themes` object.
```json
"themes": {
  "pie_chart": {
    "title": "PIE CHART",
    "type": "pie_chart",
    "meta": "This is a pie chart theme, it will display a pie chart based on the fields provided.",
    "fields": [
      "field_1",
      "field_2",
      "field_3",
      "field_4"
    ],
    "style": {
      "segments": [
        {
          "field": "field_1",
          "label": "Field 1",
          "fillColor": "#FF69B4"
        },
        {
          "field": "field_2",
          "label": "Field 2",
          "fillColor": "#FFD700"
        },
        {
          "field": "field_3",
          "label": "Field 3",
          "fillColor": "#FF4500"
        },
        {
          "field": "field_4",
          "label": "Field 4",
          "fillColor": "#00FF00"
        }
      ]
    }
  }
}
```

@module pie_chart
@author @simon-leech
*/

console.log("Pie Chart v4.8.0");

// Create the serializer
const xmlSerializer = new XMLSerializer();

/**
@function themes.pie_chart

@description
The themes.pie_chart method creates a pie chart from a feature's properties (fields) and appends it to the feature's style using svgs.

@param {Object} theme The theme object
@property {Object} theme.fields The fields to be used for the pie chart
@property {Object} theme.style.segments The cat array object holding the field, icon colour and label for the legend
@property {Object} feature The feature object
@returns {Object} The updated feature object with the updated style
*/
mapp.layer.themes.pie_chart = (theme, feature) => {

  // If its a cluster, average the properties of the features
  // This is so we can create a pie chart from the cluster
  if (feature.properties?.features?.length > 1) {

    feature.properties?.features.forEach(clusterFeature => {

      const clusterFeatureProperties = clusterFeature.getProperties().properties

      // For each property in the cluster feature, average this property across the cluster
      Object.keys(clusterFeatureProperties).forEach(key => {

        feature.properties[key] ??= 0

        feature.properties[key] += parseFloat(clusterFeatureProperties[key]) / feature.properties.features.length
      })
    })

    delete feature.properties.count
  }

  // Set the default values for the theme
  theme.backgroundColor ??= 'none'
  theme.StrokeColor ??= 'none'
  theme.strokeWidth ??= 1

  // Create the circle
  const icon = mapp.utils.svg.node`
    <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <circle cx=12 cy=12 r=12 
      fill=${theme.backgroundColor}
      stroke=${theme.StrokeColor}
      stroke-width=${theme.strokeWidth}>
    </circle>`

  let start = 0

  // For each field in the theme, create the % of the svg arc
  theme.fields.forEach((field) => {

    // Get the field data from the pie_chart array
    const cat = theme.segments.find((pie) => pie.field == field);

    // If no fillColor is provided, attempt to use the feature.style.icon.fillColor - otherwise use a default color
    // This is provided so vector_layers can use the locationStyle colour
    //fieldConfig.icon ??= {};
    //cat.fillColor ??= feature.style.icon.fillColor || '#f9f9f9f9';

    const sweep = parseFloat(feature.properties[field])

    // Create the arc
    const arc = createSvgArc([12, 12], 12, [start, sweep]);

    start += sweep

    // Append the arc to the icon
    icon.appendChild(mapp.utils.svg.node`<path d=${arc} fill=${cat.fillColor}/>`)

    const style = {
      icon: {
        svg: `data:image/svg+xml,${encodeURIComponent(xmlSerializer.serializeToString(icon))}`
      }
    }

    // Spread the icon to the feature (allows icon scaling to work)
    feature.style = {
      ...feature.style,
      ...style
    }
    
  });
}

/**
@function legends.pie_chart
@description
The legends.pie_chart method creates a legend for the pie chart theme, using the fields provided in the theme, and their corresponding icon colour and label.
@param {Object} layer // The layer object
@property {Object} layer.style.theme // The theme object
@property {Object} layer.style.theme.style.segments // The cat array object holding the field, icon colour and label for the legend
@property {Object} layer.style.theme.meta // The label for the legend
@returns {Object} // The legend object
*/
mapp.ui.layers.legends.pie_chart = (layer) => {

  const theme = layer.style.theme

  theme.legend ??= {}

  // If cat.icon is undefined, use the default fillColor (this occurs when you have an entry method and use the locationStyle)
  theme.segments.forEach(cat => {
    cat.fillColor ??= layer.style.default.icon.fillColor || '#f9f9f9f9'
  });

  theme.legend.node = mapp.utils.html.node`
    <div class="legend">
      <div class=${`contents-wrapper ${theme.legend?.layout || 'grid'} ${theme.legend?.nowrap ? 'nowrap' : ''}`}>
        ${theme.segments.map(cat => mapp.utils.html`
          <div data-id=${cat.field}
            class=${`contents ${theme.legend?.horizontal ? 'horizontal' : ''}`}>
              <div style="height: 24px; width: 24px; grid-column: 1;">
                ${mapp.ui.elements.legendIcon({
                  width: 24,
                  height: 24,
                  fillColor: cat.fillColor
                })}
              </div>
              <div class="label" style="grid-column: 2;">
                ${cat.label}
              </div>
          </div>`)}
      </div>
    </div>`

  if (layer.style.legend) mapp.utils.render(layer.style.legend, theme.legend.node)

  layer.style.legend ??= theme.legend.node

  return theme.legend.node;
};

/**
@function createSvgArc
@param {Array} [cx, cy] The center of the ellipse
@param {Number} r The radius
@param {Number} start The start of the angle
@param {Number} sweep The sweep of the angle
@param {Number} φ The rotation of the whole
@returns {String} The path of the arc
*/
function createSvgArc([cx, cy], r, [start, sweep], φ = -1.5708) {
  let t1 = start * 0.062831853071796;

  // if sweep is negative, set to 0
  if (sweep < 0) sweep = 0;
  // if sweep is 100, set to 99.999
  if (sweep >= 100) sweep = 99.999;

  let Δ = sweep * 0.062831853071796;

  /*
      cx,cy → center of ellipse
      r → radius
      t1 → start angle, in radian.
      Δ → angle to sweep, in radian. positive.
      φ → rotation on the whole, in radian
      URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
    */

  const cos = Math.cos;
  const sin = Math.sin;
  const π = Math.PI;

  const f_matrix_times = ([[a, b], [c, d]], [x, y]) => [
    a * x + b * y,
    c * x + d * y
  ];
  const f_rotate_matrix = (x) => [
    [cos(x), -sin(x)],
    [sin(x), cos(x)]
  ];
  const f_vec_add = ([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2];

  Δ = Δ % (2 * π);
  const rotMatrix = f_rotate_matrix(φ);
  const [sX, sY] = f_vec_add(
    f_matrix_times(rotMatrix, [r * cos(t1), r * sin(t1)]),
    [cx, cy]
  );
  const [eX, eY] = f_vec_add(
    f_matrix_times(rotMatrix, [r * cos(t1 + Δ), r * sin(t1 + Δ)]),
    [cx, cy]
  );
  const fA = Δ > π ? 1 : 0;
  const fS = Δ > 0 ? 1 : 0;

  return [
    "M",
    cx,
    cy,
    "L",
    sX,
    sY,
    "A",
    r,
    r,
    (φ / (2 * π)) * 360,
    fA,
    fS,
    eX,
    eY,
    "L",
    cx,
    cy
  ].join(" ");
}