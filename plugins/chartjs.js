/**
# ChartJS

The chartjs plugin module has no exports and does not require to be initiated after being loaded.

Loading the plugin module will define the chartjs mapp.ui utils.

The chartjs create method will be called by the mapp.ui dataview methods for layer and locations.

```js
mapp.ui.utils.chartjs = {
  create,
  options: {
    scales,
    tooltip,
    datalabels
  },
  formatter: {
    abs,
    add,
    prefix,
    round,
    subtract,
    suffix
  }
}
```

The chartjs library and plugins will be imported from the esm.sh once the chartjs plugin is loaded through the mapp API.

import { Chart } from 'https://esm.sh/chart.js@4.4.3/auto'

https://www.chartjs.org/docs/latest/

import datalabels_plugin from 'https://esm.sh/chartjs-plugin-datalabels@2.2.0'

https://chartjs-plugin-datalabels.netlify.app/guide/

import annotation_plugin from 'https://esm.sh/chartjs-plugin-annotation@2.2.0'

https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/

import zoom_plugin from 'https://esm.sh/chartjs-plugin-zoom@2.0.1'

https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/

@module chartjs
@author @dbauszus-glx 
*/

mapp.utils.merge(mapp.dictionaries, {
  en: {
    fail_chartjs_load: 'Failed to load Chart.js library. Please reload the browser.',
  },
  de: {
    fail_chartjs_load: 'Laden des Chart.js Modules fehlgeschlagen.',
  },
  zh: {
    fail_chartjs_load: '无法加载 Chart.js 库。 请重新加载浏览器。',
  },
  zh_tw: {
    fail_chartjs_load: '無法載入 Chart.js 庫。 請重新載入流覽器。',
  },
  pl: {
    fail_chartjs_load: 'Nie udało się załadować biblioteki Chart.js. Otwórz ponownie przeglądarkę.',
  },
  fr: {
    fail_chartjs_load: 'Erreur de chargement de la librairie Chart.js. Veuillez actualiser la page.',
  },
  ja: {
    fail_chartjs_load: 'Chart.jsライブラリはロードに失敗しました。ブラウザをリロードしてください.',
  },
  es: {
    fail_chartjs_load: 'No se pudo cargar la biblioteca Chart.js. Por favor actualice la página.',
  },
  tr: {
    fail_chartjs_load: 'Chart.js kutuphanesi yuklenemedi. Lutfen sayfayi yenileyiniz.',
  },
  it: {
    fail_chartjs_load: 'Errore nel caricare la libreria Chart.js. Per favore ricarica il browser',
  },
  th: {
    fail_chartjs_load: 'ไม่สามารถโหลดไลบรารี Chart.js ได้ กรุณาโหลดเบราว์เซอร์อีกครั้ง',
  },
})

console.log(`chartjs v4.4.3 / v4.8`)

mapp.ui.utils.chartjs = {
  create,
  options: {
    scales,
    tooltip,
    datalabels
  },
  formatter: {
    abs,
    add,
    prefix,
    round,
    subtract,
    suffix
  }
}

import { Chart } from 'https://esm.sh/chart.js@4.4.3/auto'

import datalabels_plugin from 'https://esm.sh/chartjs-plugin-datalabels@2.2.0'

Chart.register(datalabels_plugin)

import annotation_plugin from 'https://esm.sh/chartjs-plugin-annotation@3.0.1'

Chart.register(annotation_plugin)

import zoom_plugin from 'https://esm.sh/chartjs-plugin-zoom@2.0.1'

Chart.register(zoom_plugin)

/**
### mapp.ui.utils.chartjs.create(_this)

The async Chartjs create() method receives a dataview object with options for the chartsjs creation.

A `target` HTMLElement must be provided. The create method will append a <canvas> element to the target in which the chart will be rendered.

The create method will iterate through the `chart.options` and execute matching utility methods from mapp.ui.utils.chartjs.options{}

Registered plugins can be configured in the `chart.options.plugins` config object.

The chartjs object returned from the chartjs library will be assigned as `_this.ChartJS` to the dataview object.

The create method will decorate the dataview with a setData() method if not provided.

A data object provided with the dataview will immediatelly be sent to the setData() method.

```json
"chart": {
  "type": "bar",
  "options": {
    "plugins": {
      "zoom": {
        "zoom": {
          "wheel": {
            "enabled": true
          }
        }
      },
      "legend": {
        "display": true,
        "position": "bottom"
      }
    },
    "aspectRatio": 2.2,
    "tooltip": {
      "prefix": "+",
      "suffix": "%",
      "add": 100
    },
    "scales": {
      "y": {
        "prefix": "+",
        "suffix": "%",
        "add": 100
      }
    }
  }
},
"data": {}
```

@function create
@param {Object} _this The dataview object.
@param {HTMLElement} _this.target The target element for the chart.
@param {Object} _this.chart The chartjs config object.
@param {Object} _this.chart.options The chartjs config options.
@param {Object} _this.data The data object for the chart.
@param {string} [_this.noDataMask] String to be displayed if no data is provided for the chart.
@param {Function} [_this.setData] Custom function to set the chart data.
@param {Function} [_this.setDataCallback] Callback method executed at the end of the default setData method.
*/

function create(_this) {

  // Apply chart.option methods
  if (_this.chart.options) {

    // Iterate through the chart.options.
    Object.entries(_this.chart.options).forEach(option => {

      // Check whether a matching utility method exists.
      if (!Object.hasOwn(mapp.ui.utils.chartjs.options, option[0])) return;

      // Execute chartjs options utility method.
      // Provide option value [1] and chart object as argument.
      mapp.ui.utils.chartjs.options[option[0]](option[1], _this.chart)
    })
  }

  // Charts most be rendered into a canvas type element.
  const canvas = mapp.utils.html.node`<canvas>`
  
  _this.target.replaceChildren(canvas);

  // Nullish coalescing operator to assign default values.
  _this.chart.options ??= {};
  _this.chart.options.plugins ??= {};
  _this.chart.options.plugins.legend ??= { display: false };
  _this.chart.options.plugins.datalabels ??= { display: false };

  // Set 'bar' as default type if undefined.
  _this.chart.type ??= 'bar'


  // Await initialisation of ChartJS object.
  _this.ChartJS = new Chart(canvas, _this.chart);

  _this.noDataMask = typeof this.noDataMask === 'string' ? this.noDataMask : 'No Data';

  // Assign setData method
  _this.setData ??= setData

  // Set _this.data if provided.
  _this.data && _this.setData(_this.data)
}

/**
### setData(data)

The dataview object is `this` in the setData method.

The `this.noDataMask` will be shown if no data has been provided.

The dataview.setDataCallback() method is called with the data object after the update of the ChartJS object.

```json
{
  "datasets": [
    {
      "label": "Estate Average",
      "type": "line",
      "borderColor": "#B455A0",
      "fill": false,
      "data": [
        20.8,
        10.35,
        26.74,
        19.22,
        22.89
      ]
    },
    {
      "label": "Site(10 min)",
      "type": "bar",
      "backgroundColor": "#5BC4BF",
      "data": [
        17.65,
        9.43,
        42.32,
        15.87,
        14.73
      ]
    }
  ],
  "labels": [
    "<18",
    "18-24",
    "25-44",
    "45-59",
    "60+"
  ]
}
```

@function setData
@param {Object} data The data object.
@param {Array} data.datasets Array of datasets for the chart.
@param {Array} data.labels Array of labels for the chart.
*/

function setData(data) {

  // A noDataMask has been defined.
  if (this.noDataMask) {

    // Apply the noDataMask
    if (!data) {

      // Remove display from target
      this.target.style.display = 'none';

      // Create this.mask if undefined.
      this.mask ??= mapp.utils.html.node`
        <div class="dataview-mask">${this.noDataMask}`

      // Append this.mask to the target parent.
      this.target.parentElement?.append(this.mask)

      // Remove the noDataMask
    } else {

      // Remove this.mask from dom.
      this.mask?.remove();

      // Set dataview target to display as block.
      this.target.style.display = 'block';
    }
  }

  if (data) {

    if (!data.datasets) {

      // Set data in datasets array if no datasets are defined in data.
      let _data = structuredClone(data)

      data = {
        datasets: [{ data: _data }]
      }
    }

    this.data = data;

    // Assign datasets from chart object to data.datasets.
    this.chart.datasets?.length && data.datasets.forEach((dataset, i) =>
      Object.assign(dataset, this.chart.datasets[i]));

    // Assign data.labels from chart if nullish.
    data.labels ??= this.chart.labels;

    // Set data to chartjs object.
    this.ChartJS.data = data;

    // Update the chartjs object.
    this.ChartJS.update();

  } else {

    delete this.ChartJS.data
  }

  // Execute setDataCallback method if defined as function.
  typeof this.setDataCallback === 'function'
    && this.setDataCallback(this);
};

function datalabels(key, chart) {

  const datalabel = {
    affluence: {
      align: _ => {
        return _.dataset.data[0] > 0 ? 'start' : 'end';
      },
      formatter: val => {
        return val + 100;
      },
      labels: {
        value: {
          backgroundColor: _ => {
            return _.dataset.data.backgroundColor;
          }
        }
      }
    }
  }

  if (Object.hasOwn(datalabel, key)) {

    mapp.utils.merge(chart.options.plugins.datalabels, datalabel[key])
  }
}

function scales(scales) {

  // Iterate through the scales.
  Object.entries(scales).forEach(scale => {

    // Iterate through the scale keys.
    Object.keys(scale[1]).forEach(key => {

      // A method matches the key.
      if (Object.hasOwn(mapp.ui.utils.chartjs.formatter, key)) {

        // The scale must have a ticks object.
        scale[1].ticks ??= {}

        // Create callback method from options.
        const callback = val => {

          // First callback will receive context as object.        
          return mapp.ui.utils.chartjs.formatter[key](val, scale[1])
        }

        // Compose callback method from previous methods.
        scale[1].ticks.callback = typeof scale[1].ticks.callback === 'function' ?
          mapp.utils.compose(callback, scale[1].ticks.callback.bind()) :
          callback;
      }
    })
  })
}

function tooltip(tooltip, chart) {

  // Iterate through the tooltip keys.
  Object.keys(tooltip).forEach(key => {

    // A method matches the key.
    if (Object.hasOwn(mapp.ui.utils.chartjs.formatter, key)) {

      chart.options.plugins ??= {}
      chart.options.plugins.tooltip ??= {}
      chart.options.plugins.tooltip.callbacks ??= {}

      // Create callback method from options.
      const callback = context => {

        // First callback will receive context as object.        
        return mapp.ui.utils.chartjs.formatter[key](context.raw || context, tooltip)
      }

      // Compose callback method from previous methods.
      chart.options.plugins.tooltip.callbacks.label =
        typeof chart.options.plugins.tooltip.callbacks.label === 'function' ?
          mapp.utils.compose(callback, chart.options.plugins.tooltip.callbacks.label.bind()) :
          callback
    }
  })
}

function abs(val, opt) {

  // val and opt.add must be numbers.
  if (isNaN(val)) return val;

  // Add number to value.
  return Math.abs(val)
}

function add(val, opt) {

  // val and opt.add must be numbers.
  if (isNaN(val) || isNaN(opt.add)) return val;

  // Add number to value.
  const value = val + opt.add;
  return value
}

function prefix(val, opt) {

  // Return with prefix prepended to string value.
  return `${opt.prefix}${val}`
}

function round(val, opt) {

  // val and opt.add must be numbers.
  if (isNaN(val) || isNaN(opt.round)) return val;

  // Return with val rounded.
  return parseFloat(val.toFixed(opt.round))
}

function subtract(val, opt) {

  // val and opt.subtract must be numbers.
  if (isNaN(val) || isNaN(opt.add)) return val;

  // Subtract number from value.
  const value = val - opt.subtract;
  return value
}

function suffix(val, opt) {

  // Return with suffix appended to string value.
  return `${val}${opt.suffix}`
}
