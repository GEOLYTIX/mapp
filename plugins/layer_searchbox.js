/**
# Layer Searchbox

A search input is added to the layer list view in the default mapp view.
On input the layer view and group header will be parsed.
Layer views not matching the input value will be hidden.
Layer groups will be shown if at least one layer member is matched.
All layer within a group will be shown if the group key matches the search input.

### 📝 Reviewed by
[@dbauszus-glx](https://github.com/dbauszus-glx) (01/02/2024)
[@simon-leech](https://github.com/simon-leech)

@module layer_searchbox
@author @eo-uk
*/

console.log(`layer_searchbox v4.8`)

// Add dictionary definitions 
mapp.utils.merge(mapp.dictionaries, {
  en: {
    search_layer: 'Search for layer...'
  },
  pl: {
    search_layer: 'Szukaj warstwy...'
  }
});

/**
The plugins method will be called with matching key in the locale.
The method appends the layer-search-input to the #layers element in the _default view.
@function layer_searchbox
*/
mapp.plugins.layer_searchbox = () => {

  const layersEl = document.getElementById("layers");

  if (!layersEl) return;

  layersEl.append(mapp.utils.html.node`
    <input
      name="layer-search-input"
      type="search"
      placeholder="${mapp.dictionary.search_layer}"
      oninput=${oninput}
      autocomplete="off"/>`)

  /**
  The method hides layer views and groups not matching the search input string value.
  @function oninput
  @param {event} event input event argument  
  */
  function oninput(event) {

    const searchStr = event.target.value;

    // is not empty and regex matches a string that starts with a letter and followed 0 or more times by letters, & or space
    if (searchStr && !searchStr.match(/^[a-zA-Z][a-zA-Z& ]*$/)) {

      // remove last character typed
      event.target.value = searchStr.substring(0, searchStr.length - 1);
      return;
    }

    // Get all layerViews.
    const layerViews = document.querySelectorAll(".layer-view.drawer");

    // Hide all layerViews.
    for (const layerView of layerViews) {

      layerView.classList.add("display-none");
    }

    // Get all layerGroups.
    const layerGroups = document.querySelectorAll(".layer-group.drawer");

    for (const layerGroup of layerGroups) {

      // Hide layerGroup
      layerGroup.classList.add("display-none")

      // search the layer group itself
      const layerGroupHeader = layerGroup.querySelector(".header");

      if (layerGroupHeader.innerText.toLowerCase().includes(searchStr.toLowerCase())) {

        layerGroup.classList.remove("display-none")

        // Get all layer views in group.
        const layerGroupViews = layerGroup.querySelectorAll(".layer-view.drawer");

        for (const layerView of layerGroupViews) {

          // Show all layer views in group.
          layerView.classList.remove("display-none");
        }
      }
    }

    for (const layerView of layerViews) {

      const header = layerView.querySelector(".header");

      if (header.innerText.toLowerCase().includes(searchStr.toLowerCase())) {

        layerView.classList.remove("display-none")

        const parentGroup = layerView.closest(".layer-group.drawer")

        parentGroup?.classList.remove("display-none")
      }
    }
  }
}