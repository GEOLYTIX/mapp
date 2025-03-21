/**
# Screenshot 📷

The screenshot plugin adds a button to the mapview control of the mapp default view if the screenshot flag is set on the locale.

The [html-to-image](https://www.npmjs.com/package/html-to-image) module is imported from esm.sh to enable the generation of a blob mapview.Map parentNode.

ESM must be allowed as a script source in the CSP directive.

maplibre format layers must be flagged to "preserveDrawingBuffer" in the layer JSON.

@module screenshot
@author @cityremade 
*/

import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.13';

console.log('screenshot v4.13.0');

// Add dictionary definitions
mapp.utils.merge(mapp.dictionaries, {
  en: {
    screenshot: 'Create screenshot from map canvas',
  },
  pl: {
    screenshot: 'Utwórz zrzut ekranu z obszaru mapy',
  },
});

/**
mapp.plugins.screenshot() will append the screenshot button to the `#mapButton` element in the mapp _default view.
@function screenshot
@param {Object} options 
@param {Object} mapview  
*/
mapp.plugins.screenshot = (options, mapview) => {
  const btnColumn = document.getElementById('mapButton');

  if (!btnColumn) return;

  btnColumn.append(mapp.utils.html.node`
    <button
      data-id="plugin-screenshot"
      class="mobile-display-none"
      title=${mapp.dictionary.screenshot}
      onclick=${() => mapp.utils.screenshot(mapview)}>
    <span class="material-symbols-outlined">add_a_photo`);
};

/**
mapp.utils.screenshot(mapview) will create a screenshot from the mapview target element.
@function screenshot
@param {Object} mapview  
*/
mapp.utils.screenshot = (mapview) => {
  const node = mapview.Map.getTargetElement().parentNode;

  htmlToImage
    .toBlob(node, { skipFonts: true })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
};
