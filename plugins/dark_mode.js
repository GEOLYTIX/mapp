/**
 
# Dark Mode

* ### 📝 Reviewed by
* - [@dbauszus-glx](https://github.com/dbauszus-glx) (01/02/2024)

* ### Description
* This allows the configuration developer to add a plugin that will allow the user to toggle between dark and light mode.
* The users choice is stored in the `localStorage` object and is persistent across sessions.
* 
* ### How to use 📌

* Add the plugin to the `workspace.plugins` array.
```json 
"plugins":[
    "${PLUGINS}/dark_mode.js"
]

```
* Add the plugin to the `workspace.locale` or each locale object individually in the `workspace.locales` object.
```json
"dark_mode":{}
```
* 
* @module dark_mode
* @author @eo-uk
*/

console.log(`dark_mode v4.8`)

// Add darkmode styles to the document head.
document.head.append(mapp.utils.html.node`<style>
:root {
  --dm-accent: #E18335;
  --dm-medium: #555;
  --dm-dark-faded: #333;
  --dm-dark-neutral: #222;
  --dm-dark: #111;
  --dm-darker: #151515;
  --dm-light: #fff;
  --dm-light-darker: #d8d8d8;

  --lm-primary: #003D57;
  --lm-primary-light: #939faa;
  --lm-light: #E9E3DD;
  --lm-lighter: #D5E1E6;
  --lm-accent: #E18335;
  --lm-off-black: #3f3f3f;

  --icon-sun: url(https://raw.githubusercontent.com/GEOLYTIX/MapIcons/a847736bae014e3f2d34fd60ba2051bf23ea3329/plugins/dark_mode/sun.svg);
  --icon-moon: url(https://raw.githubusercontent.com/GEOLYTIX/MapIcons/a847736bae014e3f2d34fd60ba2051bf23ea3329/plugins/dark_mode/moon.svg);
}

::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-track {
  background: var(--lm-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--lm-accent);
}

::-webkit-scrollbar-corner {
  background: var(--lm-primary);
}

html.dark-mode ::-webkit-scrollbar-track {
  background: var(--dm-dark-faded);
}

html.dark-mode ::-webkit-scrollbar-thumb {
  background: var(--dm-accent);
}

html.dark-mode ::-webkit-scrollbar-corner {
  background: var(--dm-dark-faded);
}

* {
  transition: 0.2s ease-in-out;
  transition-property: background-color;
}

html.dark-mode .primary-colour {
  color: var(--dm-accent);
}

html.dark-mode .input-range.single::after,
html.dark-mode .input-range.multi::before {
  background: linear-gradient(0deg, transparent 0 45%, #fff 45% 55%, transparent 55% 100%);
}

html.dark-mode .drawer {
  background-color: var(--dm-dark-faded);
  color: var(--dm-light);
}

html.dark-mode .checkbox div {
  filter: invert(1);
}

html.dark-mode #ctrl-panel {
  background-color: var(--dm-dark-neutral);
}

html.dark-mode #ctrl-tabs {
  background-color: var(--dm-darker);
}

html.dark-mode .mask-icon.toggle {
  background-color: var(--dm-light);
}

html.dark-mode .mask-icon.toggle.on {
  background-color: var(--dm-accent);
}

html.dark-mode #mapButton {
  background-color: var(--dm-darker);
}

html.dark-mode #mapButton .mask-icon {
  background-color: var(--dm-light);
}

html.dark-mode button.wide.bold.primary-colour {
  color: var(--dm-light);
}

html.dark-mode .location-view-grid .layer-key>span {
  background-color: var(--dm-accent);
}

html.dark-mode .search.mask-icon,
html.dark-mode .edit.mask-icon,
html.dark-mode .done.mask-icon,
html.dark-mode .trash.mask-icon {
  background-color: var(--dm-light);
}

html.dark-mode #locations .header {
  border-bottom-color: var(--dm-accent) !important;
}

html.dark-mode .drawer.top-btn {
  color: white;
}

html.dark-mode .drawer .panel {
  background-color: var(--dm-dark-neutral);
}

html.dark-mode .tabview .panel {
  background-color: var(--dm-dark-neutral);
}

html.dark-mode .tabview .tabs,
html.dark-mode .tabview .tabulator-tableholder {
  background: var(--dm-darker);
}

html.dark-mode .tabview .tab .header {
  color: var(--dm-light);
  background-color: var(--dm-dark-faded);
}

html.dark-mode .tabview .tab.active .header {
  background-color: var(--dm-accent);
}

html.dark-mode .tabview .panel .btn-row {
  background-color: var(--dm-dark-neutral);
}

html.dark-mode .tabview .panel .btn-row button {
  font-weight: bold;
  color: var(--dm-accent);
  background: var(--dm-dark-faded);
}

html.dark-mode .tabview .tabulator-header {
  background: var(--dm-dark);
}

html.dark-mode .tabview .tabulator-col {
  background-color: var(--dm-dark-faded);
  color: var(--dm-light);
}

html.dark-mode .tabview .tabulator-row {
  color: var(--dm-light);
}

html.dark-mode .tabview .tabulator-row.tabulator-row-odd {
  background-color: var(--dm-dark-neutral);
}

html.dark-mode .tabview .tabulator-row.tabulator-row-even {
  background-color: var(--dm-medium);
}

html.dark-mode .tabview>.panel>.flex-col {
  background-color: var(--dm-dark-faded);
}

html.dark-mode .tabulator .tabulator-footer {
  background: var(--dm-dark);
}

html.dark-mode .tabulator .tabulator-footer .tabulator-page {
  color: var(--dm-light);
}

html.dark-mode .tabulator .tabulator-footer .tabulator-page.active {
  color: var(--dm-accent);
}

.btn-color-mode .mask-icon {
  -webkit-mask-image: var(--icon-moon);
  mask-image: var(--icon-moon);
}

html.dark-mode .btn-color-mode .mask-icon {
  -webkit-mask-image: var(--icon-sun);
  mask-image: var(--icon-sun);
}

html.dark-mode #mapButton .mask-icon.active {
  background-color: var(--dm-accent);
}

html.dark-mode input[type="number"],
html.dark-mode input[type="text"],
html.dark-mode input[type="search"],
html.dark-mode .dropdown ul>li,
html.dark-mode .dropdown .head {
  background: var(--dm-medium);
  color: var(--dm-light);
  border-color: var(--dm-dark-faded);
}

html.dark-mode input[type="search"]::placeholder {
  color: var(--dm-light-darker);
  opacity: 1;
  /* for Firefox */
}

html.dark-mode input[type="search"]::-ms-input-placeholder {
  color: var(--dm-light-darker);
}

html.dark-mode .dropdown.active .head {
  background: var(--dm-accent);
}

html.dark-mode .dropdown>ul>li:hover {
  background: var(--dm-dark-faded);
}

html.dark-mode #ctrls-divider,
html.dark-mode #tabview-divider {
  background-color: var(--dm-dark-faded);
}

html.dark-mode .location-view-grid .location canvas {
  filter: invert(1);
}

html.dark-mode .link-with-img a {
  color: var(--dm-accent);
}

html.dark-mode .meta>a {
  color: var(--color-primary-light);
}

html.dark-mode .dropdown>ul .label {
  background-color: var(--dm-dark-faded);
}

html.dark-mode .dropdown li.selected {
  background-color: var(--dm-dark-faded);
}

html.dark-mode #layers>.drawer.layer-group .drawer.layer-view {
  background-color: var(--dm-dark-faded);
  border-top: 2px solid var(--dm-medium);
}

html.dark-mode #layers>.layer-view>.drawer {
  background-color: var(--dm-dark-faded);
}

html.dark-mode #layers .drawer.layer-view .drawer {
  background-color: var(--dm-dark-neutral);
}

html.dark-mode .mask-icon.disabled {
  background-color: var(--dm-medium);
}

/* Plugin - Layer Search Box */
html.dark-mode .layer-search-msg .count {
  color: var(--dm-light-darker);
}

html.dark-mode .layer-search-input::-webkit-search-cancel-button {
  cursor: pointer;
  filter: hue-rotate(125deg);
}

/* Plugin - Sliding Sidepanel */
html.dark-mode #ctrls #ctrl-hide-btn {
  background-color: var(--dm-darker);
}

html.dark-mode #ctrls #ctrl-hide-btn:hover {
  background: var(--dm-dark-faded);
}

html.dark-mode #mapButton>#ctrl-show-btn {
  background: var(--dm-dark-faded);
}

html.dark-mode #mapButton>#ctrl-show-btn:hover {
  background: var(--dm-accent);
}

html.dark-mode #mapButton>#ctrl-show-btn:hover .mask-icon {
  background: var(--dm-dark-faded);
}

@media only screen and (max-width: 768px) {
  html.dark-mode #mapButton {
    background-color: unset;
  }

  html.dark-mode #mapButton>button,
  html.dark-mode #mapButton>a {
    background-color: var(--dm-dark-faded);
  }
}`)

/**
 * Function to set the local storage to if the user uses darkmode or not.
 * @function toggleDarkMode
 */
function toggleDarkMode() {
  const htmlEl = document.querySelector("html");
  localStorage.setItem("darkMode", htmlEl.classList.toggle("dark-mode"));
}

// Add dictionary definitions 
mapp.utils.merge(mapp.dictionaries, {
  en: {
    dark_mode: 'Color Mode'
  },
  pl: {
    dark_mode: ' Tryb Koloru'
  }
  });

mapp.plugins.dark_mode = (options) => {

  // Get the map button
  const mapButton = document.getElementById("mapButton");

  // If mapbutton doesn't exist, return (for custom views).
  if (!mapButton) return;  

  // localStorage stores boolean with their respective string values.
  options.darkMode ??= (localStorage.getItem("darkMode") === 'true');

  // toggle dark_mode if true.
  options.darkMode && toggleDarkMode()

  // If the button container exists, append the dark mode button.
  mapButton.append(mapp.utils.html.node`
    <button
      title=${mapp.dictionary.dark_mode}
      class="btn-color-mode"
      onclick=${toggleDarkMode}>
      <div class="mask-icon">`);
}