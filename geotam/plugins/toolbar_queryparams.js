
// This is a custom toolbar queryparams for the Tabulator component
// It is used to create a slider and a dropdown to select the number of days and the month
// The query parameters are saved and the query is re-run


mapp.ui.utils.tabulator ??= {
    toolbar: {},
    formatter: {}
}

Object.assign(mapp.ui.utils.tabulator.toolbar, {
    queryparams
})

function queryparams(dataview) {

    // Return a slider to select the number of days 
    const slider = mapp.ui.elements.slider({
        label: 'Select the Flood Duration in Days',
        min: 0,
        max: 31,
        val: parseInt(dataview.queryparams.days_selected),
        callback: (e) => {
            // Set the query parameter to the value of the selected days
            dataview.queryparams.days_selected = e
        }
    })

    // Return a dropdown to select the month 
    const dropdown = mapp.ui.elements.dropdown({
        label: 'Select the Month',
        entries: options,
        // Set the default value to the value of the query parameter (note jan = January, feb = February, etc.)
        placeholder: options.find(option => option.option === dataview.queryparams.month_selected).title,
        callback: (e, entry) => {
            // Set the query parameter to the value of the selected month
            dataview.queryparams.month_selected = entry.option;
            dataview.queryparams.month_selected_pretty = entry.title[0];
        }
    })
    // Return a Save button to save the query parameters and re-run the query
    const saveBtn = mapp.utils.html.node`
      <button
        class="flat wide bold primary-colour"
        onclick=${() => {
            dataview.update();
        }
        }>Save</button>`;

    return mapp.utils.html`
  <div style="width: 100%;">
  <b style="display: block; width: 100%;">Select the number of days and the month to estimate the impact of floods on the selected area. This will show you the number of affected locations, and the Total Estimated Impact across the duration of the flood event.</b>
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
    <div style="flex: 1; text-align: center; max-width: 33%;">${slider}</div>
    <div style="flex: 1; text-align: center; max-width: 33%;">${dropdown}</div>
    <div style="flex: 1; text-align: center; max-width: 33%;">${saveBtn}</div>
  </div>
</div>
`;
}

const options = [
    {
        title: ['January'],
        option: 'jan'
    },
    {
        title: ['February'],
        option: 'feb'
    },
    {
        title: ['March'],
        option: 'mar'
    },
    {
        title: ['April'],
        option: 'apr'
    },
    {
        title: ['May'],
        option: 'may'
    },
    {
        title: ['June'],
        option: 'jun'
    },
    {
        title: ['July'],
        option: 'jul'
    },
    {
        title: ['August'],
        option: 'aug'
    },
    {
        title: ['September'],
        option: 'sep'
    },
    {
        title: ['October'],
        option: 'oct'
    },
    {
        title: ['November'],
        option: 'nov'
    },
    {
        title: ['December'],
        option: 'dec'
    }
];