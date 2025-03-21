/**
# Tabulator

The tabulator plugin will supersede the `mapp.ui.utils.tabulator` dataview utilities.

The tabulator library will be imported in full from 'https://esm.sh/tabulator-tables@6.3.1'

A tabulator dataview can be created by providing a dataview object with `dataview: 'tabulator'`.

The dataview object must have a target element defined in which to render the dataview element.

The mapp.ui.Dataview() method will assign `getElementById(dataview.target)` as target if the target is defined as a string.

The `autoColumns:true` flag must be set in the table object config if no columns array has been defined.

An array of `data:[]` records can provided to be set as data during the creation of the dataview.

```json
const dataview = {
  target: 'dataview-table',
  dataview: 'tabulator',
  table: {
    autoColumns: true
  },
  data: [{id: 1, letter: 'A'},{id: 2, letter: 'B'}]
}
```

@module tabulator
*/

import {
  TabulatorFull as Tabulator,
  Module,
} from 'https://esm.sh/tabulator-tables@6.3.1';

document.head.append(mapp.utils.html.node`
  <link rel='stylesheet' href='https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_simple.min.css'/>`);

// Prepend the tabulator-edited style to the head.
document.head.prepend(mapp.utils.html.node`<style>
.tabulator-edited {
  background-color: var(--color-changed);
}

.header-filter-date > input {
  width: 48%;
}`);

mapp.utils.merge(mapp.dictionaries, {
  en: {
    fail_tabulator_load:
      'Failed to load Tabulator library. Please reload the browser.',
    download_csv: 'Download as CSV',
    tabulator_viewport: 'Show Data in Mapview',
    tabulator_layer_filter: 'Layer Filter',
    tabulator_export_json: 'Export as JSON',
    tabulator_clear_filter: 'Clear Filters',
    tabulator_save_edits: 'Save Edits',
    tabulator_type_to_edit: 'Type to edit',
    tabulator_clear_all: 'Clear All',
    apply: 'Apply',
  },
  de: {
    fail_tabulator_load: 'Laden des Tabulator Modules fehlgeschlagen.',
  },
  zh: {
    fail_tabulator_load: '无法加载制表符库。 请重新加载浏览器。',
  },
  zh_tw: {
    fail_tabulator_load: '無法載入定位字元庫。 請重新載入流覽器。',
  },
  pl: {
    fail_tabulator_load:
      'Nie udało się załadować biblioteki Tabulator. Otwórz ponownie przeglądarkę.',
    download_csv: 'Pobierz jako CSV',
  },
  fr: {
    fail_tabulator_load:
      'Erreur de chargement de la librairie Tabulator. Veuillez actualiser la page.',
  },
  ja: {
    fail_tabulator_load:
      'Tabulatorライブラリはロードに失敗しました。ブラウザをリロードしてください.',
  },
  es: {
    fail_tabulator_load:
      'No se pudo cargar la biblioteca Tabulator. Por favor actualice la página.',
  },
  tr: {
    fail_tabulator_load:
      'Tabulator kutuphanesi yuklenemedi. Lutfen sayfayi yenileyiniz.',
  },
  it: {
    fail_tabulator_load:
      'Errore nel caricare la libreria Tabulator. Per favore ricarica il browser',
  },
  th: {
    fail_tabulator_load:
      'ไม่สามารถโหลดไลบรารีแบบตารางได้ กรุณาโหลดเบราว์เซอร์อีกครั้ง',
  },
});

mapp.utils.versionCheck?.('4.13')
  ? console.log(`tabulator v4.13`)
  : console.warn(`Mapp version below v4.13. Please use the v4.8 tabulator plugin instead.`);

// It is possible that other modules are imported prior to the tabulator plugin module.
mapp.ui.utils.tabulator ??= {};

// Assign tabulator methods to the mapp.ui.utils.tabulator object.
Object.assign(mapp.ui.utils.tabulator, {
  create,
  setData,
  events,
  styleParams,
  select,
  columns,
});

// HeaderFilter may not be defined in the tabulator object.
mapp.ui.utils.tabulator.headerFilter ??= {};

// Assign headerFilter methods to the mapp.ui.utils.tabulator.headerFilter object.
Object.assign(mapp.ui.utils.tabulator.headerFilter, {
  like,
  numeric,
  set,
  date: dateFilter,
});

// Formatter may not be defined in the tabulator object.
mapp.ui.utils.tabulator.formatter ??= {};

// Assign formatter methods to the mapp.ui.utils.tabulator.formatter object.
Object.assign(mapp.ui.utils.tabulator.formatter, {
  toLocaleString,
  date,
  link,
  remove_row,
  select_row,
});

// Editor may not be defined in the tabulator object.
mapp.ui.utils.tabulator.editor ??= {};

// Assign editor methods to the mapp.ui.utils.tabulator.editor object.
Object.assign(mapp.ui.utils.tabulator.editor, {
  number,
  text,
  list,
});

// Toolbar may not be defined in the tabulator object.
mapp.ui.utils.tabulator.toolbar ??= {};

// Assign toolbar methods to the mapp.ui.utils.tabulator.toolbar object.
Object.assign(mapp.ui.utils.tabulator.toolbar, {
  download_csv,
  clear_table_filters,
  download_json,
  viewport,
  layerfilter,
  save_edits,
  clear_table,
  queryparams,
});

//Custom module for style column option
//TODO this needs a sample configuration and some documentation.
class StyleColumnsModule extends Module {
  static moduleName = 'styleColumns';

  constructor(table) {
    super(table);

    //Register new column options
    this.registerColumnOption('style', {});
    this.registerColumnOption('styleParams', {});
  }

  initialize() {
    //called when table is intialized, binds function to `cell-layout` event:
    //Cell with its contents is ready for aditional module bindings
    this.subscribe('cell-layout', this.initializeColumn.bind(this));
  }

  initializeColumn(cell) {
    if (typeof cell.column.definition.style === 'function') {
      //Calls style on the cell with the styleParams
      cell.column.definition.style(
        cell,
        cell.column.definition.styleParams || {}
      );
    }
  }
}

Tabulator.registerModule(StyleColumnsModule);

/**
@function create
@description
The create method will initialise a Tabulator object from a dataview object.
@param {Object} dataview The tabulator object
@returns {Promise} A promise that resolves when the Tabulator object has been created.
*/
async function create(dataview) {
  if (typeof dataview.table !== 'object') {
    console.warn(`Dataview object must have table object defined.`);
    return;
  }

  // Apply tabulator column methods
  mapp.ui.utils.tabulator.columns(dataview);

  // Await initialisation of Tabulator object.
  // TODO Document and/or removed commented options.
  dataview.Tabulator = new Tabulator(dataview.target, {
    //renderVertical: 'basic',
    //renderHorizontal: 'virtual',

    selectableRows: false,
    toolbar: {},
    //data: dataview.data,
    ...dataview.table,
  });

  // Check if the dataview.Tabulator has pagination:true but no paginationSize, set it to 100
  if (dataview.Tabulator.pagination && !dataview.Tabulator.paginationSize) {
    dataview.Tabulator.paginationSize = 100;
  }

  // Await for the Tabulator table instance to be built in Promise
  await new Promise((resolve) => dataview.Tabulator.on('tableBuilt', resolve));

  // TODO Document scrollHorizontal method. What does it do? Is this needed?
  dataview.Tabulator.on('scrollHorizontal', (left) => {
    const ul_parents =
      dataview.Tabulator.element.querySelectorAll('.ul-parent');

    // Get the table element bounds.
    const table_bounds = dataview.Tabulator.element.getBoundingClientRect();

    for (const ul_parent of ul_parents) {
      // Get the ul_parent bounds.
      const header_bounds = ul_parent.getBoundingClientRect();

      // Get ul element itself
      const ul = ul_parent.querySelector('ul');

      // The ul may not exist if populated from a query.
      if (ul) {
        // Set fixed element to be the difference of the parent and table bounds on scroll.
        ul.style.left = `${header_bounds.left - table_bounds.left}px`;
      }
    }
  });

  // Table will not automatically redraw on resize.
  if (dataview.table.autoResize === false) {
    let debounce = 0;

    // debounce resizeOberserver by 800.
    dataview.resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        dataview.target.offsetHeight > 9 && dataview.Tabulator.redraw();
      }, 800);
    });

    dataview.resizeObserver.observe(dataview.target);
  }

  // Assign tabulator events from object.
  mapp.ui.utils.tabulator.events(dataview);

  // Set Tabulator data.
  dataview.setData = mapp.ui.utils.tabulator.setData;

  // Set dataview.data if provided.
  dataview.data && dataview.setData(dataview.data);
}

/**
@function events
@description
The events method will assign events to the Tabulator object from the dataview object.
@param {Object} dataview The tabulator object
*/
// TODO The dataview.events property must be documented. Some sample configuration should be shown.
function events(dataview) {
  if (typeof dataview.events !== 'object') return;

  Object.entries(dataview.events).forEach((event) => {
    // Get event method from tabulator utils.
    if (
      typeof mapp.ui.utils.tabulator[event[1].util || event[1]] === 'function'
    ) {
      dataview.Tabulator.on(
        event[0],
        mapp.ui.utils.tabulator[event[1].util || event[1]](dataview, event[1])
      );
      return;
    }

    // Shortcircuit if events object value is not a function.
    if (typeof event[1] !== 'function') return;

    // Key is event name. Value is the event function.
    dataview.Tabulator.on(event[0], event[1]);
  });
}

/**
@function setData
@description
The setData method will set the data for the Tabulator object from the dataview object.
@param {Array} data The data array to be set in the Tabulator object.
*/
function setData(data) {
  if (this.noDataMask && !data) {
    this.noDataMask =
      typeof this.noDataMask === 'string' ? this.noDataMask : 'No Data';

    // Remove display from target
    this.target.style.display = 'none';

    // Create this.mask if undefined.
    this.mask ??= mapp.utils.html
      .node`<div class='dataview-mask'>${this.noDataMask}`;

    // Append this.mask to the target parent.
    this.target.parentElement?.append(this.mask);
  } else {
    // Remove this.mask from dom.
    this.mask?.remove();

    // Set dataview target to display as block.
    this.target.style.display = 'block';
  }

  // Set data as empty array if nullish.
  data ??= [];

  // Make an array of data if not already an array.
  data &&= Array.isArray(data) ? data : [data];

  // Set data to the tabulator object
  this.Tabulator.setData(data);

  this.data = data;

  // Execute setDataCallback method if defined as function.
  typeof this.setDataCallback === 'function' && this.setDataCallback(_this);
}

/** 
@function columns 
@description
The columns method will assign custom column methods to the Tabulator object from the dataview object.
*/
// TODO provide sample configuration, test cases, and documentation for the table.columns property.
function columns(_this) {
  if (!Array.isArray(_this.table.columns)) {
    _this.table.columns = [];
    return;
  }

  // Check for custom column methods.
  _this.table.columns.forEach((col) => chkCol(col));

  function chkCol(col) {
    // Column is an array of sub columns.
    if (Array.isArray(col.columns)) {
      col.columns.forEach((col) => chkCol(col));
      return;
    }

    // Check for custom headerFilter matched in the ui utils.
    if (Object.hasOwn(mapp.ui.utils.tabulator.headerFilter, col.headerFilter)) {
      // Assign custom headerFilter from ui utils.
      col.headerFilter =
        mapp.ui.utils.tabulator.headerFilter[col.headerFilter](_this);
    }

    // Check for custom formatter in the ui utils.
    if (Object.hasOwn(mapp.ui.utils.tabulator.formatter, col.formatter)) {
      // Assign custom formatter from ui utils.
      col.formatter = mapp.ui.utils.tabulator.formatter[col.formatter](_this);
    }

    // Check for custom style method in the ui utils.
    if (typeof col.styleParams === 'object') {
      // Assign custom style method from ui utils.
      col.style = mapp.ui.utils.tabulator.styleParams;
    }

    // Assign custom editor from ui utils
    if (Object.hasOwn(mapp.ui.utils.tabulator.editor, col.editor)) {
      if (_this.save_map) {
        col.editor =
          mapp.ui.utils.tabulator.editor[_this.save_map[col.title][type]](
            _this
          );
      } else {
        col.editor = mapp.ui.utils.tabulator.editor[col.editor](_this);
      }
    }
  }
}

/**
@function like 
@description
The like method will return a headerFilter method for the Tabulator object.
@param {Object} _this The tabulator object
@returns {HTMLElement} An Input element for the headerFilter, that will filter the data based on the input value.
*/
function like(_this) {
  return (cell, onRendered, success, cancel, headerFilterParams) => {
    const field = cell.getColumn().getField();

    function likeFilter(e) {
      // Set layer filter when layerFilter is true and headerFilterParams.layerFilter is true.
      if (headerFilterParams.layerFilter && _this.layerFilter) {
        if (e.target.value.length) {
          // Set filter
          _this.layer.filter.current[field] = {
            [headerFilterParams.type || 'like']: e.target.value,
          };
        } else {
          // Remove filter
          delete _this.layer.filter.current[field];
        }

        // Reload layer.
        _this.layer.reload();

        // Reload table.
        _this.update();

        return;
      }

      // Get filter for that field if exists
      const likeFilter = _this.Tabulator.getFilters().find(
        (f) => f.field === field && f.type == 'like'
      );

      // Remove existing like filter
      if (likeFilter) {
        _this.Tabulator.removeFilter(...Object.values(likeFilter));

        // Remove layer filter
        headerFilterParams.layerFilter &&
          delete _this.layer.filter.current[field];
      }

      const filters = _this.Tabulator.getFilters();

      if (e.target.value.length) {
        // add like filter to existing filters.
        filters.push({ field: field, type: 'like', value: e.target.value });
        // apply filters to table.
        _this.Tabulator.setFilter(filters);
      }
    }

    return mapp.utils.html.node`<span>
        <input
          data-id='tabulator-filter-like'
          type='text'
          placeholder=${mapp.dictionary.layer_filter_header}
          oninput=${likeFilter}
          onblur=${likeFilter}>`;
  };
}

/**
@function numeric
@description
The numeric method will return a headerFilter method for the Tabulator object.
@param {Object} _this The tabulator object
@returns {HTMLElement} An Input element for the headerFilter, that will filter the data based on the input value.
*/
function numeric(_this) {
  return (cell, onRendered, success, cancel, headerFilterParams) => {
    // Select the field
    const field = cell.getColumn().getField();

    // Create the minimum input element.
    const inputMin = mapp.utils.html`
    <input
      data-id='tabulator-filter-greater-than'
      style='text-align:end'
      type='text' 
      placeholder=${mapp.dictionary.layer_filter_greater_than}
      oninput=${(e) => NumericEvent(e, 'min', _this)}>`;

    // Create the maximum input element.
    const inputMax = mapp.utils.html`
    <input
      data-id='tabulator-filter-less-than'
      style='text-align:end'
      type='text' 
      placeholder=${mapp.dictionary.layer_filter_less_than}
      oninput=${(e) => NumericEvent(e, 'max', _this)}>`;

    // Function to filter the data.
    function NumericEvent(e, type, _this) {
      // If type is min, use >= filter, else use <= filter.
      const filterType = type === 'min' ? '>=' : '<=';
      const filterCurrent = type === 'min' ? 'gte' : 'lte';
      // Get filter for that field if exists
      const filter = _this.Tabulator.getFilters().find(
        (f) => f.field === field && f.type == `${filterType}`
      );

      // Remove existing filter if found or if no value passed
      if (filter || e.target.value === '') {
        _this.Tabulator.removeFilter(...Object.values(filter));

        // Remove layer filter
        headerFilterParams.layerFilter &&
          delete _this.layer.filter.current[field];
      }

      // Add filter for valid target value.
      if (Number(e.target.value)) {
        _this.Tabulator.addFilter(
          field,
          `${filterType}`,
          Number(e.target.value)
        );

        // Set layer filter when layerFilter is true and headerFilterParams.layerFilter is true.
        if (headerFilterParams.layerFilter && _this.layerFilter) {
          // Assign the filter to the layer filter.
          _this.layer.filter.current[field] = Object.assign(
            _this.layer.filter.current[field] || {},
            { [filterCurrent]: Number(e.target.value) }
          );
        }
      }

      // Reload the layer and update the table.
      if (_this.layerFilter) _this.layer.reload();
      _this.update();
    }

    // flex container must be encapsulated since tabulator will strip attribute from most senior item returned.
    return mapp.utils.html.node`
        <div><div style='display:flex;'>${inputMin}${inputMax}`;
  };
}

/**
@function dateFilter
@description
The dateFilter method will return a headerFilter method for the Tabulator object.
@param {Object} _this The tabulator object
@returns {HTMLElement} An Input element for the headerFilter, that will filter the data based on the input value.
*/
function dateFilter(_this) {
  return (cell, onRendered, success, cancel, headerFilterParams) => {
    // Select the field
    const field = cell.getColumn().getField();

    // Create the minimum input element.

    const inputMin = mapp.utils.html`
      <input
        data-id='tabulator-filter-date-min'
        type='date'
        onchange=${(e) => DateEvent(e, 'min')}>`;

    // Create the maximum input element.
    const inputMax = mapp.utils.html`
  <input
    data-id='tabulator-filter-date-max'
    type='date'
    onchange=${(e) => DateEvent(e, 'max')}>`;

    function DateEvent(e, type) {
      const val = new Date(e.target.value).getTime() / 1000;

      // If type is min, use >= filter, else use <= filter.
      const filterType = type === 'min' ? '>=' : '<=';
      const filterCurrent = type === 'min' ? 'gte' : 'lte';

      // Get filter for that field if exists
      const filter = _this.Tabulator.getFilters().find(
        (f) => f.field === field && f.type == filterType
      );

      // Remove existing filter
      if (filter) {
        _this.Tabulator.removeFilter(...Object.values(filter));

        // Remove layer filter
        headerFilterParams.layerFilter &&
          delete _this.layer.filter.current[field];
      }

      // Add filter for valid target value.
      if (val) {
        _this.Tabulator.addFilter(field, filterType, val);

        // Set layer filter when layerFilter is true and headerFilterParams.layerFilter is true.
        if (headerFilterParams.layerFilter && _this.layerFilter) {
          _this.layer.filter.current[field] = Object.assign(
            _this.layer.filter.current[field] || {},
            { [filterCurrent]: val }
          );
          _this.layer.reload();
          _this.update();
        }
      }
    }

    // flex container must be encapsulated since tabulator will strip attribute from most senior item returned.
    return mapp.utils.html.node`
        <div><div class='header-filter-date'>${inputMin}${inputMax}`;
  };
}

/**  
@function set
@description
The set method will return a headerFilter method for the Tabulator object.
@param {Object} _this The tabulator object
@returns {HTMLElement} An Input element for the headerFilter, that will filter the data based on the dropdowns selected.
*/
function set(dataview) {
  return (cell, onRendered, success, cancel, headerFilterParams) => {
    // Make 'in' the default type for set headerfilter
    headerFilterParams.type ??= 'in';

    const field = cell.getColumn().getField();

    // Create dropdown for render.
    const dropdown = mapp.utils.html.node`<div class='ul-parent'>`;

    if (!headerFilterParams.options) {
      //  Check if the dataview.layer.tableCurrent is not null
      if (dataview.layer.tableCurrent() !== null) {
        // Query distinct field values.
        mapp.utils
          .xhr(
            `${dataview.layer.mapview.host}/api/query?` +
              mapp.utils.paramString({
                template: 'distinct_values',
                layer: dataview.layer.key,
                locale: dataview.layer.mapview.locale.key,
                dbs: dataview.layer.dbs,
                table: dataview.layer.tableCurrent(),
                field,
              })
          )
          .then((response) => {
            if (response) {
              // If response is not an array, make it an array.
              if (!Array.isArray(response)) response = [response];

              // Render dropdown with distinct values from response.
              mapp.utils.render(
                dropdown,
                mapp.ui.elements.dropdown({
                  multi: true,
                  placeholder:
                    headerFilterParams.placeholder ||
                    `${mapp.dictionary.layer_filter_set_filter}`,
                  entries: response.map((row) => ({
                    title: row[field],
                    option: row[field],
                    //selected: chkSet.has(val)
                  })),
                  callback,
                })
              );
            } else {
              response = [{ field: mapp.dictionary.no_options_available }];

              mapp.utils.render(
                dropdown,
                mapp.ui.elements.dropdown({
                  multi: true,
                  placeholder:
                    headerFilterParams.placeholder ||
                    `${mapp.dictionary.layer_filter_set_filter}`,
                  entries: response.map((row) => ({
                    title: mapp.dictionary.no_options_available,
                    option: mapp.dictionary.no_options_available,
                    selected: false,
                    //selected: chkSet.has(val)
                  })),
                })
              );
            }
          });

        return dropdown;
      }
    } else if (Array.isArray(headerFilterParams.options)) {
      mapp.utils.render(
        dropdown,
        mapp.ui.elements.dropdown({
          multi: true,
          placeholder:
            headerFilterParams.placeholder ||
            `${mapp.dictionary.layer_filter_set_filter}`,
          entries: headerFilterParams.options.map((option) => ({
            title: option,
            option: option,
            //selected: chkSet.has(val)
          })),
          callback,
        })
      );
    }

    return dropdown;

    async function callback(e, options) {
      // Set layer filter when layerFilter is true and headerFilterParams.layerFilter is true.
      if (headerFilterParams.layerFilter && dataview.layerFilter) {
        // Create current filter for the layer.
        (options.length &&
          Object.assign(dataview.layer.filter.current, {
            [field]: { [headerFilterParams.type]: options },
          })) ||
          // Delete current filter for field if options is falsy.
          delete dataview.layer.filter.current[field];

        dataview.layer.reload();
        dataview.update();

        return;
      }

      // Get filter for that field if exists
      const filter = dataview.Tabulator.getFilters().find(
        (f) => f.field === field
      );

      // Remove existing filter
      if (filter) {
        dataview.Tabulator.removeFilter(...Object.values(filter));

        // Remove layer filter
        headerFilterParams.layerFilter &&
          delete dataview.layer.filter.current[field];
      }

      options.length && dataview.Tabulator.addFilter(field, 'in', options);
    }
  };
}

/**  
@function number
@description
The number method (cell editor) will return an input element for the Tabulator object on cell edit.
@param {Object} _this The tabulator object
@returns {HTMLElement} An Input element for the cell editor, that will edit the cell value.
*/
function number(_this) {
  return (cell, onRendered, success, cancel, editorParams) => {
    // Select the field
    const value = cell.getValue();
    const field = cell.getColumn().getField();

    const entry = _this.table.columns.find((column) => column.field === field);

    let saveBtn = document.querySelector(
      `#${_this.toolbar.save_edits?.save_id}`
    );
    saveBtn ??= _this.target.parentElement.querySelector(
      '[data-id=tabulator-save-editor]'
    );

    const cellStyle = cell.getElement().style;
    const useCellStyle = `height:${cellStyle.height};text-align:${
      entry.hozAlign || 'start'
    }`;

    const input = mapp.utils.html`
    <input
      data-id='tabulator-edit-number'
      style=${useCellStyle}
      type='number' 
      placeholder=${mapp.dictionary.tabulator_type_to_edit}
      value=${value || null}
      onClick=${(e) =>
        !saveBtn &&
        console.warn(
          'Editor requires save_edits in the toolbar to save the data'
        )}
      onInput=${(e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (saveBtn?.disabled) {
          saveBtn.disabled = false;
        }
        e.target.parentElement.classList.add('tabulator-edited');
      }}
      onChange=${(e) => cell.setValue(e.target.value, true)}
      >`;

    return mapp.utils.html.node`${input}`;
  };
}

/**  
@function text
@description
The text method (cell editor) will return an input element for the Tabulator object on cell edit.
@param {Object} _this The tabulator object
@returns {HTMLElement} An Input element for the cell editor, that will edit the cell value.
*/
function text(_this) {
  return (cell, onRendered, success, cancel, editorParams) => {
    // Select the field
    const value = cell.getValue();
    const field = cell.getColumn().getField();

    const entry = _this.table.columns.find((column) => column.field === field);

    let saveBtn = document.querySelector(
      `#${_this.toolbar.save_edits?.save_id}`
    );
    saveBtn ??= _this.target.parentElement.querySelector(
      '[data-id=tabulator-save-editor]'
    );

    const cellStyle = cell.getElement().style;
    const useCellStyle = `height:${cellStyle.height};text-align:${
      entry.hozAlign || 'start'
    }`;

    const input = mapp.utils.html`
    <input
      data-id='tabulator-edit-text'
      style=${useCellStyle}
      type='text' 
      placeholder=${mapp.dictionary.tabulator_type_to_edit}
      value=${value || null}
      onClick=${(e) =>
        !saveBtn &&
        console.warn(
          'Editor requires save_edits in the toolbar to save the data'
        )}
      onInput=${(e) => {
        if (saveBtn?.disabled) {
          saveBtn.disabled = false;
        }
        e.target.parentElement.classList.add('tabulator-edited');
      }}
     onChange=${(e) => cell.setValue(e.target.value, true)}>`;

    return mapp.utils.html.node`${input}`;
  };
}

/**
@function list
@description
The list method (cell editor) will return a dropdown element for the Tabulator object on cell edit.
This will allow the user to select a value from a list of options.
When changed, the cell value will be set to the selected option and the cell will be marked as edited.
The save button will be enabled if it is disabled.
@param {Object} _this The tabulator object
@returns {HTMLElement} A dropdown element for the cell editor, that will edit the cell value.
*/
function list(_this) {
  return (cell, onRendered, success, cancel, editorParams) => {
    const dropdown = mapp.utils.html.node`<div class='ul-parent'>
      ${mapp.ui.elements.dropdown({
        data_id: 'tabulator-edit-select',
        multi: false,
        placeholder:
          editorParams.placeholder || `${mapp.dictionary.select_placeholder}`,
        entries: editorParams.values.map((option) => ({
          title: option,
          option: option,
          selected: cell.getValue() === option,
        })),
        callback,
      })}`;

    // Re-render the dropdown on every click to avoid it disappearing
    onRendered(() => {
      // Ensure dropdown stays visible
      dropdown.style.display = 'block';

      // Focus on the dropdown if needed
      const selectElement = dropdown.querySelector('select');

      if (selectElement) {
        selectElement.focus();
      }
    });

    return dropdown;

    async function callback(e, selectedOption) {
      // Set the cell value to the selected option
      cell.setValue(selectedOption.title, true);

      _this.toolbar.save_edits.btn.disabled = false;

      cell.getElement().classList.add('tabulator-edited');
    }
  };
}

/**
@function toLocaleString
@description
The toLocaleString method will return a formatter method for the Tabulator object.
@param {Object} _this The tabulator object
@returns {function} A formatter method that will format the cell value to a locale string.
*/
function toLocaleString(_this) {
  return (cell, formatterParams, onRendered) => {
    const val = parseFloat(cell.getValue());

    if (isNaN(val)) return;

    return val.toLocaleString(
      formatterParams?.locale || navigator.language,
      formatterParams?.options
    );
  };
}

/**  
@function date
@description
The date method will return a formatter method for the Tabulator object.
@param {Object} _this The tabulator object
@returns {function} A formatter method that will format the cell value to a date.
*/
function date(_this) {
  return (cell, formatterParams, onRendered) => {
    const val = parseInt(cell.getValue());

    if (isNaN(val)) return;

    const str = new Date(val * 1000).toLocaleString(
      formatterParams?.locale || navigator.language,
      formatterParams?.options
    );

    return str;
  };
}

/**
@function styleParams

@description
The styleParams function returns the cell value after applying styling based on the column styleParams object.

@param {Object} cell The Tabulator cell to be styled.
@param {Object} styleParams Params object for the cell styling.
*/
function styleParams(cell, styleParams) {
  const cellValue = cell.getValue();
  const style = styleParams.style;

  Object.keys(style).forEach((attribute) => {
    const attr_value = style[attribute];

    //Check if a graduated style is being used
    if (attr_value instanceof Array) {
      //If no graduated break is specified assume equal
      if (!styleParams.graduated_breaks) {
        console.warn(
          'Tabulator: graduated style specified with no `graduated_break`. `equal` is assumed'
        );
        styleParams.graduated_breaks = 'equal';
      }

      //Used for string comparisons
      let graduated_breaks = {
        equal: (value) => (attr_value) => value === attr_value.value,
      };

      //If the value of the attribute is a number use the below
      if (Number(attr_value[0].value)) {
        graduated_breaks = {
          less_than: (value) => (attr_value) => value <= attr_value.value,
          greater_than: (value) => (attr_value) => value >= attr_value.value,
          ...graduated_breaks,
        };
      }

      //Find index of the value in the categories array
      const index = attr_value.findIndex(
        graduated_breaks[styleParams.graduated_breaks](cellValue)
      );

      //Get the style specified at that index
      const cat = attr_value.at(index);

      Object.keys(cat.style).forEach((attribute) => {
        setAttribute(cell, attribute, cat.style);
      });
    } else {
      setAttribute(cell, attribute, style);
    }
  });

  return cellValue;
}

/**
@function select 
@description 
The select method will return a select method for the Tabulator object, defined using selectable: true and a RowClick event.
@params {Object} _this The tabulator object
@params {Object} params The params object for the select method.
@returns {function} A select method that will select a row in the table and zoom to the location if the params flag is set.
*/
function select(_this, params = {}) {
  return (e, row) => {
    // Get the row data
    const rowData = row.getData();

    const layer = _this.layer?.mapview.layers[params.layer] || _this.layer;

    // Return without a layer to select from.
    if (!layer) return;

    // Return without the layer qID in rowData.
    if (!rowData[layer.qID]) return;

    // Get the location using the layer and qID which will select the location in the location panel
    mapp.location
      .get({
        layer: layer,
        id: rowData[layer.qID],
      })

      // Zoom to the location if the params flag is set.
      .then((location) => {
        // Deselection will return the location as undefined.
        if (!location) return;

        params.zoomToLocation && location.flyTo();
      });

    // Remove selection colour on row element.
    row.deselect();
  };
}

/**
@function link

@description
The link formatter method returns a link tag containing the wysiwyg mask icon.
The url value can is taken from the cell value or can be defined as formatterParams.url
The formatterParams.fields array is parsed to look up field values in the dataRow as URL parameter for the href.

@param {Object} _this The tabulator object
@returns {function} The link formatter method.
*/
function link(_this) {
  return (cell, formatterParams, onRendered) => {
    const val = cell.getValue();

    if (!formatterParams.url) return;

    let href = val || formatterParams.url;

    const rowData = cell.getRow().getData();

    if (Array.isArray(formatterParams.fields)) {
      const fields = formatterParams.fields.map(
        (field) => `${field}=${rowData[field]}`
      );

      href += fields.join('&');
    }

    return `<a target='_blank' href=${href}><span class='material-symbols-outlined'>wysiwyg</span></a>`;
  };
}

/**
@function remove_row

@description
The remove_row returns a formatter method which resolves to a button element.

The remove_row button element will remove the row from the tabulator table on click.

The `formatterParams` object takes two properties when providing a query to remove the row from the database.:
- `query` The query to execute to remove the row from the database.
- `id` The id of the row to remove, this must be a field in the row data, and will use the SQL query `WHERE id = %{id}` to remove the row.
```json
{
  'title': 'Remove',
  'formatter': 'remove_row',
  'hozAlign': 'center',
  'formatterParams': {
    'query': 'remove_row',
    'id': 'id'
  }
}
```

You can also provide a custom `formatterParams.on_remove` callback function to execute when the row is removed.
This is used in the `query_features.js` plugin for example to remove the feature from the map and the `queryparams.ids` array. 
``` js
remove_row.formatterParams.on_remove = (row) => {

      // Get the row from the mapview layers array using the row layer key.
      const layer = dataview.mapview.layers[row.layer];

      // Ensure the IDs array exists and filter the row ID
      if (Array.isArray(layer.query_features.queryparams.ids)) {

        // Filter the row ID from the query_features queryparams.ids array.
        layer.query_features.queryparams.ids = layer.query_features.queryparams.ids.filter(id => String(id) !== String(row.id));
      }

      // Do something else...
    };

```

@param {Object} _this The tabulator object
@returns {function} The remove_row formatter method.
*/
function remove_row(_this) {
  return (cell, formatterParams, onRendered) => {
    // Create the button element
    const button = mapp.utils.html
      .node`<button title='Remove' class='no'><span class='material-symbols-outlined'>delete`;

    // Attach click event listener
    button.addEventListener('click', (e) => {
      // Prevent the row click event from being triggered
      e.stopPropagation();
      const row = cell.getRow();
      const rowData = row.getData();

      // Execute the on_remove callback if defined.
      if (typeof formatterParams.on_remove === 'function') {
        formatterParams.on_remove(rowData);
      }

      // if a query is defined, run that query to delete the data
      if (formatterParams.query) {
        mapp.utils
          .xhr(
            `${_this.host}/api/query?` +
              mapp.utils.paramString({
                template: formatterParams.query,
                id: rowData[formatterParams.id],
              })
          )
          .then((response) => {
            // The query must execute successfully before the row is removed.
            if (response instanceof Error) {
              console.error(response);
              return;
            }

            // Remove the row from the table
            row.delete();

            // Reload the layer
            _this?.layer.reload();
          });
      } else {
        // Remove the row from the table
        row.delete();

        // Refresh the table
        _this.update();
      }
    });

    // Return the button element
    return button;
  };
}

/**
@function select_row

@description
The select_row formatter method returns a button element to select a row in the table and zoom to the location if the params flag is set. 
You can specify Material Icons icon name to the button by passing it in the formatterParams object, otherwise the default is touch_app, if formatterParams.zoomToLocation is true, the class will be search

@param {Object} _this The tabulator object
@property {Object} formatterParams The formatterParams object for the select_row method.
@property {Boolean} formatterParams.zoomToLocation The flag to zoom to the location when the row is selected. Default is false.
@returns {function} The select_row formatter method.
*/
function select_row(_this) {
  return (cell, formatterParams, onRendered) => {
    // You can pass your own icon name to the button by passing it in the formatterParams object
    // By default is touch_app, if formatterParams.zoomToLocation is true, the icon name will be search
    formatterParams.iconName ??= formatterParams.zoomToLocation
      ? 'search'
      : 'touch_app';

    // Create the button element
    const button = mapp.utils.html
      .node`<button title='Search'><span class='material-symbols-outlined'>${formatterParams.iconName}`;

    // Attach click event listener
    button.addEventListener('click', async (e) => {
      // Prevent the row click event from being triggered
      e.stopPropagation();
      // Get the row
      const row = cell.getRow();

      // Get the row data
      const rowData = row.getData();

      const layer =
        _this.layer?.mapview.layers[rowData.layer] ||
        _this.mapview?.layers[rowData.layer] ||
        _this.layer;

      // Return without a layer to select from.
      if (!layer) {
        console.warn(`No layer found for row data: ${JSON.stringify(rowData)}`);
        return;
      }

      // Return without the layer qID in rowData.
      if (!rowData[layer.qID]) {
        console.warn(
          `${layer.qID} not found in row data: ${JSON.stringify(rowData)}`
        );
        return;
      }

      // Assign potential custom getLocation to _ to avoid conflict with this.
      if (_this.mapview) {
        _this.mapview._interaction = _this.mapview.interaction;
        delete _this.mapview.interaction;
      }

      // Get the location using the layer and qID which will select the location in the location panel
      mapp.location
        .get({
          layer,
          id: rowData[layer.qID],
        })

        // Zoom to the location if the params flag is set.
        .then((location) => {
          // Deselection will return the location as undefined.
          if (!location) return;

          formatterParams.zoomToLocation && location.flyTo();
        });

      if (_this.mapview) {
        // Re-assign the interaction method.
        _this.mapview.interaction = _this.mapview._interaction;
        delete _this.mapview._interaction;
      }
    });

    // Return the button element
    return button;
  };
}

/**
@function download_csv

@description
The toolbar download_csv method returns a button element for the dataview toolbar.
The onclick method will trigger a csv file download from the dataview.
The native tabulator csv download will be triggered if defined as `download_csv: true`.
Defined as an object `download_csv: {}` the mapp.utils.csvDownload method will be executed with the dataview.data.

@param {Object} dataview The dataview object
@returns {HTMLElement} A button element for the dataview toolbar.
*/
function download_csv(dataview) {
  return mapp.utils.html`<button
    data-id='${dataview.title}-download-csv'
    class='flat'
    onclick=${() => {
      // The data array must have a length
      if (!dataview.data.length) return;

      // download_csv is an object with
      if (dataview.toolbar.download_csv instanceof Object) {
        mapp.utils.csvDownload(dataview.data, dataview.toolbar.download_csv);
        return;
      }

      // Use Tabulator download method
      dataview.Tabulator.download(
        'csv',
        `${dataview.title || dataview.label || 'table'}.csv`
      );
    }}>${mapp.dictionary.download_csv}`;
}

/**
@function download_json
@description
The download_json method returns a button element which will call the Tabulator.download() method requesting JSON as format.
The tabulator dataview must be provided as object argument.
The `dataview.title` will be used as default filename. In the save file dialog.
@param {Object} dataview The dataview object
@returns {HTMLElement} A button element to call the download json method.
*/
function download_json(dataview) {
  return mapp.utils.html`<button
    class='flat primary-colour'
    onclick=${() => {
      dataview.Tabulator.download('json', `${dataview.title || 'table'}.json`);
    }}>${mapp.dictionary.tabulator_export_json}`;
}

/**
@function queryparams

@description
The toolbar queryparams method returns a html element containing all the options for the query parameters and a apply button.
The onclick method on the apply button will re-run the query with the updated query parameters.
The callbacks on the options will update the query parameters when changed.
@param {Object} dataview The dataview object
@returns {HTMLElement} A div element containing the query parameters options and a apply button.
*/
function queryparams(dataview) {
  // Create a content array to store all the options for the query parameters
  const content = [];

  // Loop through the queryparams object
  for (const key in dataview.toolbar.queryparams) {
    // If type is numeric or integer, return a slider
    if (
      dataview.toolbar.queryparams[key].type === 'numeric' ||
      dataview.toolbar.queryparams[key].type === 'integer'
    ) {
      content.push(
        mapp.ui.elements.slider({
          data_id: `${dataview.title}-queryparams-slider`,
          label: dataview.toolbar.queryparams[key].label || key,
          min: dataview.toolbar.queryparams[key].min || 0,
          max: dataview.toolbar.queryparams[key].max || 100,
          val: dataview.queryparams[key],
          callback: (e) => {
            dataview.queryparams[key] = e;
          },
        })
      );
    }

    // If type is a dropdown, return a dropdown
    if (dataview.toolbar.queryparams[key].type === 'dropdown') {
      content.push(
        mapp.ui.elements.dropdown({
          data_id: `${dataview.title}-queryparams`,
          label: dataview.toolbar.queryparams[key].label || key,
          entries: dataview.toolbar.queryparams[key].options,
          // Use the current value or the first option if not set
          placeholder:
            dataview.toolbar.queryparams[dataview.queryparams[key]] ||
            dataview.toolbar.queryparams[key].options[0].title,
          callback: (e, entry) => {
            dataview.queryparams[key] = entry.option;
          },
        })
      );
    }
  }

  // Return a Apply button to apply the query parameters and re-run the query
  const applyBtn = mapp.utils.html.node`
    <button
      data-id='${dataview.title}-apply-queryparams'
      class='flat primary-colour'
      style='width:30%;'
      onclick=${() => {
        dataview.update();
      }}>${mapp.dictionary.apply}</button>`;

  return mapp.utils.html`
<div style='width: 65%;'>
<div style='display: flex; justify-content: space-between; align-items: center; width: 100%;'>
<b style='display: block; width: 100%;'>${
    dataview.toolbar.queryparams.description || ''
  }</b>
  ${content}
  ${applyBtn}
</div>
</div>
`;
}

/**
@function setAttribute
@description
The setAttribute method will set the style attribute of a cell element based on the attribute and style object.
@params {Object} cell The Tabulator cell to be styled.
@params {String} attribute The attribute to be styled.
@params {Object} style The style object to be applied to the cell.
@returns {HTMLElement} The cell element with the style attribute applied. 
*/
function setAttribute(cell, attribute, style) {
  //Map color to its opacity option
  const colorSettings = {
    backgroundColor: 'fillOpacity',
    color: 'textOpacity',
  };

  //Match the style attirbute to its opacity property
  const colorSetting = colorSettings[attribute];
  const colorSettingOpacity = style[colorSettings[attribute]];

  if (colorSetting && colorSettingOpacity) {
    //Convert opactiy to a hex value
    const hexOpacity = colorSettingOpacity
      ? Math.round(colorSettingOpacity * 255, 0)
          .toString(16)
          .toUpperCase()
      : '00';
    let color = style[attribute];

    // Standardise hex to 6-digit
    color = color.length === 5 ? color.substring(0, 4) : color;
    color =
      color.length === 4
        ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
        : color;

    //append opacity to the color
    cell.getElement().style[attribute] = `${color.substring(
      0,
      7
    )}${hexOpacity}`;
  }
  //Don't want to set fillOpacity as it is applied to the color
  else if (attribute !== 'fillOpacity') {
    cell.getElement().style[attribute] = style[attribute];
  }
}

/**
@function save_edits

@description
The save_edits method returns a button element which will call the a function save data to a database.

* ### Configuration
  - Passing a custom save query: 
  - Note that the query must be a module (.js) as it takes a body object. 
  - You can also pass custom query parameters in the save_edits object.
  - These will be added as parameters to the query, and are found from the dataview row data.
  ```json
     'save_edits': {
          'table': 'japan_model.jpn_ph_restrict_stores_candidates',
          'id': 'site_id',
          'query': 'jpn_site_update_store_candidates',
          'params': [
            'site_id',
            'store_code'
          ]
        }
  ```
  - Saving table edits to the same table as the layer
    - Simply specify save_edits:{}
  - Saving to a different table:
    - specify an id field and a table name in save_edits e.g.
      ```json
          save_edits:{
            'table': 'schema.name',
            'id': 'glx_id'
          }
      ```
    - The id field will also need to be in table columns
  - Saving Pivoted tables':
    - to save a pivoted table provide a `save_map` which describes how to map the fields back to the db e.g.
      ```json
          save_edits: {
            save_map:{
              'Nice Field Title':'field_in_table',
              ...
            }
            ...
          }
      ```
    - Pivotted tables can only be saved to the same table as is referenced in the layer.
  - Saving to a JSON field:
    - with in save_edits `save_json` should be supplied with a `field` and which `table_fields` in the table to save e.g.
      ```json
          save_edits: {
            ...
            save_json: {
              'field': 'json_field_in_table',
              'table_fields':['field_1','field_2']
            }
          }
      ```
  - Reloading layers after saving:
    - To reload layers after saving the data, specify the dependent layers in the save_edits object.
    - These can be layers on the mapview, or layers defined in an infoj entry.
      ```json
          save_edits: {
            ...
            dependents_layers: ['layer1','layer2']
          }
      ```
  - Custom Save Function:
    - within save edits `on_save` can be supplied to provide a custom save function. This is only possible in reports:
      ```js
          function saveFunction(){
            console.log('clicked')
          }

          table.toolbar.save_edits.on_save = saveFunction
      ```

@param {Object} dataview The dataview object
@returns {HTMLElement} A button element to call the save_edits method.
*/
function save_edits(_this) {
  const saveParams = _this.toolbar.save_edits;
  const saveTable = saveParams.table || _this.layer.table;

  //Check if `id` is supplied as the layer table is not being used.
  if (saveTable !== _this.layer.table && !saveParams.id) {
    console.warn(
      `Layer: ${_this.layer?.name}, Dataview: ${_this.label} should specify an ID field in save_edits object as the layer table is not being used`
    );
    return;
  }

  if ((saveParams.table || saveParams.id) && saveParams.save_map) {
    console.warn(
      `Layer: ${_this.layer?.name}, Dataview: ${_this.label} seems to be a pivot table (save_edits.save_map is specified), these may only be saved to the same table as the layer.`
    );
    return;
  }

  const save_on_click =
    typeof _this.toolbar.save_edits.on_save === 'function'
      ? _this.toolbar.save_edits.on_save
      : saveOnClick;

  // skip if no location id
  if (!_this.location?.id) return;

  _this.toolbar.save_edits.btn = mapp.utils.html.node`<button
    class='flat primary-colour'
    data-id='tabulator-save-editor'
    onclick=${(e) => save_on_click(e, _this)} disabled>
    ${mapp.dictionary.tabulator_save_edits}`;

  return _this.toolbar.save_edits.btn;
}

/** 
@function saveOnClick
@description
The saveOnClick method is called when the save button is clicked in the tabulator toolbar. 
The method will save the edited fields to the database.
@param {Event} e The click event
@param {Object} _this The dataview object
@property {Object} toolbar The toolbar object that contains the save_edits object.
@property {Object} toolbar.save_edits The save_edits object that contains the save parameters.
@property {Object} toolbar.save_edits.dependents_layers The dependent layers of the dataview, that should be reloaded after saving the data. These may be layers on the mapview, or layers defined in an infoj entry.
*/
function saveOnClick(e, _this) {
  const saveParams = _this.toolbar.save_edits;
  let saveTable = saveParams.table;
  saveTable ??= _this.layer.table;

  // Disable the save button
  e.target.disabled = true;

  const edited_fields = document.querySelectorAll('.tabulator-edited');

  //Deactivate save button if nothing was edited
  if (edited_fields.length === 0) {
    e.target.disabled = true;
    return;
  }

  let updateBody = {};
  for (const node of edited_fields) {
    //Build up body for storing pivotted data
    if (saveParams.save_map) {
      const rows = _this.Tabulator.getRows();

      const rowBody = {};
      rows.forEach((row) => {
        const rowData = row.getData();

        const keys = Object.keys(rowData);
        const headerKeys = keys[0];

        for (const key of keys) {
          if (
            key &&
            Object.keys(saveParams.save_map).includes(rowData[headerKeys])
          ) {
            const realField = saveParams.save_map[rowData[headerKeys]];

            //Build up body for if the pivoted table is from a json field
            if (saveParams.save_json?.table_fields.includes(realField)) {
              rowBody[saveParams.save_json.field] ??= {};
              rowBody[saveParams.save_json.field][realField] = rowData[key];
            } else {
              rowBody[realField] = rowData[key];
            }
          }
        }
      });

      updateBody[_this.location.id] ??= {};
      updateBody[_this.location.id] = rowBody;

      if (saveParams.save_json) {
        updateBody[_this.location.id] = {};
        updateBody[_this.location.id][saveParams.save_json.field] = {
          jsonb: rowBody,
        };
      }
    } else {
      //Save field to regular field in the db
      const column = _this.table.columns.find(
        (entry) => entry.field === node.attributes['tabulator-field'].value
      );

      _this.location ??= { id: mapp.hooks.current.id };
      if (saveTable !== _this.layer.table) {
        const id_field = _this.table.columns.find(
          (column) => column.field === saveParams.id
        ).field;
        _this.location.id = node.parentElement.querySelector(
          `[tabulator-field=${id_field}`
        ).innerHTML;
      }

      const value = undoFormatting(column, node.innerHTML);

      updateBody[_this.location.id] ??= {};
      updateBody[_this.location.id][column.field] = value;

      //Save Field to a json field in the db
      if (saveParams.save_json?.table_fields.includes(column.field)) {
        updateBody[_this.location.id] = Object.keys(
          updateBody[_this.location.id]
        )
          .filter((key) => key !== column.field)
          .reduce((obj, key) => {
            obj[key] = updateBody[_this.location.id][key];
            return obj;
          }, {});

        updateBody ??= {};
        updateBody[_this.location.id] ??= {};

        const field_key = saveParams.save_json.field;
        updateBody[_this.location.id][saveParams.save_json.field] ??= {
          jsonb: {},
        };

        updateBody[_this.location.id][saveParams.save_json.field]['jsonb'][
          field_key
        ] ??= {};

        updateBody[_this.location.id][saveParams.save_json.field]['jsonb'][
          field_key
        ][column.field] = value;
      }
    }
  }

  const promises = [];
  //Built up object looks like: `{<id>:<data>}` loop over this and make promises for each one.
  for (const id of Object.keys(updateBody)) {
    const body = updateBody[id];

    _this.layer.mapview ??= { locale: {} };
    _this.layer.mapview.locale.key ??= mapp.hooks.current.locale;
    _this.layer.key ??= mapp.hooks.current.layer;

    // Build the query string
    saveParams.query_params ??= {};

    saveParams.query_params.template ??= saveParams.query;

    saveParams.query_params.template ??= 'location_update';

    saveParams.params ??= [];

    saveParams?.params?.forEach((param) => {
      saveParams.query_params[param] = _this.data.find(
        (row) => row[saveParams.id].toString() === _this.location.id.toString()
      )[param];
    });

    // Build the query string
    saveParams.query_params = {
      ...{
        locale: _this.layer.mapview?.locale.key,
        layer: _this.layer.key,
        table: saveTable,
      },
      ...saveParams.query_params,
    };

    saveParams.query_params.id = id;

    const params = mapp.utils.paramString(saveParams.query_params);

    promises.push(
      mapp.utils.xhr({
        method: 'POST',
        url: `${mapp.host}/api/query?${params}`,
        body: JSON.stringify(body),
      })
    );
  }

  //Await promises and refresh the layer, location and table.
  Promise.all(promises).then(() => {
    typeof _this.layer.reload === 'function' && _this.layer.reload();

    // Its possible you have updated a row with a different ID to the location ID
    // (the table might be related to the location but not the same)
    // In this case we need to reload the layer with the location ID originally, not the ID from the row.
    const hook_id = _this.location.hook.replace(
      `${_this.location.layer.key}!`,
      ''
    );

    if (_this.location.id !== hook_id) {
      _this.location.id = hook_id;
    }

    _this?.location.view?.dispatchEvent(new Event('updateInfo'));

    if (Array.isArray(_this.toolbar.save_edits.dependents_layers)) {
      _this.toolbar.save_edits.dependents_layers.forEach((layer) => {
        const mapview_layer = _this.layer.mapview.layers[layer];

        if (mapview_layer) {
          mapview_layer.reload();
          return;
        }

        // It may be an infoj layer
        const infoj_layer = _this.layer.infoj.find(
          (entry) => entry.key === layer
        );

        // Return without a layer to reload.
        if (!infoj_layer) return;

        // Add the mapview to the infoj layer
        infoj_layer.mapview = _this.layer.mapview;

        // Ensure display true.
        infoj_layer.display = true;

        // Add the location to the infoj layer
        infoj_layer.location = _this.location;

        if (
          _this.layer.mapview.Map.getLayers().getArray().includes(infoj_layer.L)
        ) {
          // Remove the layer from the map
          _this.layer.mapview.Map.removeLayer(infoj_layer.L);
        }

        // If features are present, clear them and reload the layer
        if (infoj_layer.features) {
          delete infoj_layer.features;
        }

        // Rebuild the infoj location entry
        mapp.ui.locations.entries[infoj_layer.type](infoj_layer);

        // This is not good practice, we should remove it asap
        console.warn(
          `Reloading infoj layer: ${infoj_layer.key}. This method is deprecated in v4.12+.`
        );
      });
    }
    _this.update();
  });
}

/**
@function undoFormatting
@description
Remove integer field formatting on save edits.
@param {Object} entry The column the data is from
@returns {Integer} The unformatted version of the number displayed in the tbale
*/
function undoFormatting(entry, value) {
  if (!entry.formatter) return value;

  if (entry.formatter === 'money') {
    entry.formatterParams ??= {};
    entry.formatterParams.locale = 'GB';
  }

  return mapp.utils.unformatStringValue({
    ...entry,
    ...{ stringValue: value },
  });
}

/**
@function clear_table

@description
The clear_table method returns a button element for the tabulator dataview toolbar.

The table will be cleared and an existing tab will be removed the tabview.

@param {Object} dataview
@returns {Object} Toolbar button
*/
function clear_table(dataview) {
  return mapp.utils.html`<button class='flat primary-colour'
    onclick=${() => {
      // Clear data
      dataview.data = [];

      // If a function is defined in the toolbar, execute it.
      if (typeof dataview.toolbar.clear_table === 'function') {
        dataview.toolbar.clear_table();
      }

      // Remove tab.
      dataview.remove();
    }}>${mapp.dictionary.tabulator_clear_all}`;
}

/**
@function clear_table_filters
@description
The clear_table_filters method returns a button element which will call the Tabulator.clearFilter() method on dataview provided as argument.

@param {Object} dataview The dataview object
@returns {HTMLElement} A button element to call the clearFilter method.
*/
function clear_table_filters(dataview) {
  return mapp.utils.html`<button
    class='flat primary-colour'
    onclick=${() => {
      dataview.Tabulator.clearFilter(true);
    }}>${mapp.dictionary.tabulator_clear_filter}`;
}

/**
@function viewport
@description
The viewport method returns a button element which will toggle the boolean dataview.viewport flag.
The viewport of an associated dataview.mapview will be provided as param for requests to the dataview query.
Data returned from a query with the ${viewport} parameter should be limited to records where the geometry field intersects the viewport.
@param {Object} dataview The dataview object
@returns {HTMLElement} A button element to toggle the dataview.viewport value.
*/
function viewport(dataview) {
  const classList = ['flat', dataview.viewport ? 'active' : ''].join(' ');

  return mapp.utils.html`<button
    class=${classList}
    onclick=${(e) => {
      const toggle = e.target.classList.toggle('active');
      dataview.viewport = toggle;
      dataview.update();
    }}>${mapp.dictionary.tabulator_viewport}`;
}

/**
@function layerfilter
@description
The layerfilter method returns a button element which will toggle the boolean dataview.layerfilter flag.
The `layer.filter.current` will provided as parameter for the dataview query template.
@param {Object} dataview The dataview object
@returns {HTMLElement} A button element to toggle the dataview.layerFilter value.
*/
function layerfilter(dataview) {
  const classList = ['flat', dataview.queryparams.filter ? 'active' : ''].join(
    ' '
  );

  return mapp.utils.html`<button
    class=${classList}
    onclick=${(e) => {
      const toggle = e.target.classList.toggle('active');
      dataview.layerFilter = toggle;
      dataview.queryparams.filter = toggle;
      dataview.update();
    }}>${mapp.dictionary.tabulator_layer_filter}`;
}
