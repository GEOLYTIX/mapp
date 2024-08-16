/**
# Coordinates

 * ### 📝 Reviewed by
* [@RobAndrewHurst](https://github.com/RobAndrewHurst) (12/04/2024)
* [@dbauszus-glx](https://github.com/dbauszus-glx) (18/04/2024)

### Description
* Adds a button to the default mapp view which you can click
* Then click on the map to get the coordinates of the clicked point.
* On click you see a popup of both EPSG:3857 and EPSG:4326 coordinates.
* The coordinates can then be copied directly from the popup. 

* ### How to use 📌

* Add the plugin to the `workspace.plugins` array.
```json 
"plugins":[
    "${PLUGINS}/coordinates.js"
]

```
* Add the plugin to the `workspace.locale` or each locale object individually in the `workspace.locales` object.
```json
"coordinates":{}
```

@module coordinates
@author @simon-leech 
*/

console.log(`coordinates v4.8`)

mapp.utils.merge(mapp.dictionaries, {
  en: {
    coordinates_button_text: "Click on the map to get the coordinates of the clicked point.",
    coordinates_copy: "Copy to clipboard.",
    coordinates_title: "Coordinates",
  },
  de: {
    coordinates_button_text: "Klicken Sie auf die Karte, um die Koordinaten des angeklickten Punktes zu erhalten.",
    coordinates_copy: "In die Zwischenablage kopieren.",
    coordinates_title: "Koordinaten",
  },
  pl: {
    coordinates_button_text: "Kliknij na mapie aby dostać koordynaty miejsca",
    coordinates_copy: "Kopiuj do schowka.",
    coordinates_title: "Współrzędne",
  }
});

/**
Plugin function that will run on load
@function coordinates
@param {Object} options // The options object
@param {Object} mapview // The mapview object
@returns {html} // A button that when clicked will allow the user to click on the map and get the coordinates of the clicked point
*/
mapp.plugins.coordinates = (options, mapview) => {

  const btnColumn = document.getElementById('mapButton');

  // the btnColumn element only exists in the default mapp view.
  if (!btnColumn) return;

  /**  
  Function to get the coordinates of the clicked point
  @function clickEventListener
  @param {Object} //e -The event object
  @returns {button} // A popup with the coordinates of the clicked point
  */
  function clickEventListener(e) {

    const coord = mapview.Map.getEventCoordinate(e.originalEvent);

    const coord3857 = ol.proj.transform(coord, `EPSG:${mapview.srid}`, 'EPSG:3857');
    const coord4326 = ol.proj.transform(coord, `EPSG:${mapview.srid}`, 'EPSG:4326');

    // Round the coordinates to 6 decimal places
    const coord3857Rounded = coord3857.map(coord => coord.toFixed(6));
    const coord4326Rounded = coord4326.map(coord => coord.toFixed(6));

    // Reverse the order of the coordinates for EPSG:4326
    coord4326Rounded.reverse();

    const content = mapp.utils.html.node`
      <div style="padding: 20px; width: 13em;">
        <button
          style="height: 1em; width: 1em; position: absolute; right: 5px; top: 5px;"
          data-id=close
          class="mask-icon close"
          onclick=${toggleInteraction}/>
        <span>EPSG:3857</span>
        <button
          style="height: 1em; width: 1em;"
          class="mask-icon copy"
          title=${mapp.dictionary.coordinates_copy}
          onClick=${(e) => clipboardCopy(coord3857Rounded)}/>
        <p>X: ${coord3857Rounded[0]}</p>
        <p>Y: ${coord3857Rounded[1]}</p>
        <span>EPSG:4326</span>
        <button
          style="height: 1em; width: 1em;"
          class="mask-icon copy"
          title=${mapp.dictionary.coordinates_copy}
          onClick=${(e) => clipboardCopy(coord4326Rounded)}/>
        <p>Latitude: ${coord4326Rounded[0]}</p>
        <p>Longitude: ${coord4326Rounded[1]}</p>`;

    mapview.popup({
      content
    })
  }

  /** Function to copy the coordinates to the clipboard
  @function clipboardCopy
  @param {string} // The text to copy to the clipboard
  @returns {string} // The text copied to the clipboard
  */
  async function clipboardCopy(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          navigator.clipboard.writeText(text)
        }
      });
    }
  }

  /** Function to toggle the interaction on and off
  @function toggleInteraction
  @param {Object} e // The event object
  */
  function toggleInteraction(e) {

    mapview.popup(null)

    btn.querySelector('.mask-icon').classList.toggle('active') ?
      mapview.Map.on('click', clickEventListener) :
      mapview.Map.un('click', clickEventListener);
  }

  // Create the button
  const btn = mapp.utils.html.node`
    <button
      title=${mapp.dictionary.coordinates_button_text}
      onclick=${toggleInteraction}>
      <div class="mask-icon room">`

  // Append the button to the map button column
  btnColumn.append(btn)
};
