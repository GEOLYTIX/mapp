export default (function(){

  // Store multiple comparisons by key
  const comparisons = {}

  mapp.ui.locations.entries.add_to_comparison = entry => {

    const comparison = comparisons[entry.location.layer.compare_locations.key]

    entry.btn = mapp.utils.html.node`
      <button
        class="raised wide bold primary-colour"
        onclick=${e=>{

          // Location is already in comparison.
          if (comparison.data.findIndex(row => row.hook === entry.location.hook) >= 0) {
            remove_location(entry.location)
            entry.btn.textContent = 'Add to comparison'
            return;
          }

          // Add location to comparison
          add_location(entry.location)
          entry.btn.textContent = 'Remove from comparison'

        }}>
        ${comparison.data.findIndex(row => row.hook === entry.location.hook) >= 0 ? 'Remove from comparison' : 'Add to comparison'}`
  
    return entry.btn
  }

  mapp.ui.layers.panels.compare_locations = layer => {

    return mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${e=>{

        if (e.target.classList.contains('active')) {
          e.target.classList.remove('active')
          layer.mapview.interactions.highlight()
          return;
        }

        layer.show()

        e.target.classList.add('active')

        layer.mapview.interactions.highlight({
          layerFilter: (featureLayer) =>
            layer.L === featureLayer,
          getLocation: async location => {

            // Create location hook.
            location.hook = `${location.layer.key}!${location.id}`;

            // Return if hook exists in mapview.interaction.locations set.
            if (location.layer.mapview.interaction?.locations?.has(location.hook)) {

              remove_location(location)
              location.layer.mapview.interaction?.locations?.delete(location.hook)
              return;
            }

            // Add hook to mapview.interaction.locations set.
            location.layer.mapview.interaction?.locations?.add(location.hook)

            const response = await mapp.utils.xhr(
              `${location.layer.mapview.host}/api/location/get?` +
              mapp.utils.paramString({
                locale: location.layer.mapview.locale.key,
                layer: location.layer.key,
                table: location.table,
                id: location.id,
                fields: location.layer.infoj
                  .map(entry => entry.forComparison)
                  .filter(entry => typeof entry !== 'undefined')
              })
            );

            location.infoj = location.layer.infoj.map(_entry => {

              const entry = mapp.utils.clone(_entry)
          
              Object.assign(entry, {
                title: response[entry.field + '_label'] || entry.title,
                value: response[entry.field],
                location
              })
          
              return entry
            })

            add_location(location)

          }
        });
      }}>Select for comparison`
  }

  mapp.plugins.compare_locations = layer => {

    // Don't create a comparison tab and object.
    if (!layer.compare_locations.tabview) return;

    if (layer.compare_locations.mvtClone) {

      // Create clone VectorTile layer.
      layer.compare_locations.mvtClone.L = new ol.layer.VectorTile({
        source: layer.L.getSource(),
        renderBuffer: 200,
        zIndex: layer.compare_locations.mvtClone.zIndex,

        // Assign style from entry.style
        style: mapp.layer.Style(layer.compare_locations.mvtClone)
      });

      layer.compare_locations.mvtClone.featureLookup = []

      // Add the clone layer to the mvt layer clones.
      layer.clones.add(layer.compare_locations.mvtClone.L)

      // Add the clone layer to the mapview.Map.
      layer.mapview.Map.addLayer(layer.compare_locations.mvtClone.L)
    }  

    // Find tabview element from data-id attribute.
    const tabview = document.querySelector(`[data-id=${layer.compare_locations.tabview}]`)
    
    const comparison = Object.assign({
      data: [],
      target: mapp.utils.html.node`<div class="dataview-target">`
    }, layer.compare_locations)

    comparisons[layer.compare_locations.key] = comparison

    comparison.table.columns.push(                  {
      title: "Remove",
      field: "remove",
      headerSort: false,
      formatter: () =>
        '<span class="hover" style="color:red; font-weight:bold;">REMOVE</span>',
      cellClick: async (e, cell) => {
        const row = cell.getRow();

        const rowData = row.getData();
        
        // Splice row from comparison data.
        comparison.data.splice(comparison.data.findIndex(row => row.hook === rowData.hook),1)

        row.delete();

        // Remove panel if no rows left in comparison table.
        !comparison.data.length && comparison.remove()
      },
      resizable: false,
    },)

    mapp.ui.Dataview(comparison).then(async () => {

      // The dataview table must not have an update method.
      delete comparison.update

      // Create the tab with the dataview table.
      tabview.dispatchEvent(new CustomEvent('addTab', {
        detail: comparison
      }))
    })
  }

  mapp.plugins._compare_locations = {
    comparisons,
    add_location,
    remove_location
  }

  function add_location(location) {

    // Find comparison by key.
    const comparison = comparisons[location.layer.compare_locations.key]

    // Remove location if already in comparison data.
    if (comparison.data.findIndex(row => row.hook === location.hook) >= 0) {
      remove_location(location)
      return;
    }

    // Show the comparison panel in tabview.
    comparison.show()

    if (comparison.mvtClone) {

      // Add ID to mvtClone featureLookup 
      comparison.mvtClone.featureLookup.push({id: location.id})

      comparison.mvtClone.L.changed()
    }

    // Add hook for identification to location row.
    const row = {
      hook: location.hook
    }
    
    // Add forComparison entry value to location row.
    location.infoj
      .filter(entry => entry.forComparison)
      .forEach(entry => row[entry.forComparison] = entry.value)

    // Push location row into comparison data.
    comparison.data.push(row)

    // Set the data on comparison table.
    comparison.Tabulator.setData(comparison.data)
  }

  function remove_location(location) {

    // Find comparison by key.
    const comparison = comparisons[location.layer.compare_locations.key]

    if (comparison.mvtClone) {

      // Remove ID from mvtClone featureLookup 
      comparison.mvtClone.featureLookup.splice(comparison.data.findIndex(f => f.id === location.id),1)

      comparison.mvtClone.L.changed()
    }

    // Splice row from comparison data.
    comparison.data.splice(comparison.data.findIndex(row => row.hook === location.hook),1)

    // Set data after removing location row.
    comparison.Tabulator.setData(comparison.data)

    // Remove panel if no rows left in comparison table.
    !comparison.data.length && comparison.remove()
  }

})()
