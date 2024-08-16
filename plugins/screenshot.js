/**
# Screenshot 📷

### 📝 Reviewed by
- [@dbauszus-glx](https://github.com/dbauszus-glx) (23/02/2024)
- [@RobAndrewHurst](https://github.com/RobAndrewHurst) (22/02/2024)

### Description
A screenshot utility method will generate an image blob from the provided mapview target element.

The `screenshot` key flag must be set in the locale for the default view to append the screenshot button.

### Sampe Configuration
```json
"screenshot": true
```

* **The [html-to-image](https://www.npmjs.com/package/html-to-image) v1.11.11 module is imported from esm.sh. The script source must be enabled in the CSP directive.**

@module screenshot
@author @cityremade 
*/

import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.11'

console.log('screenshot v4.8')

// Add dictionary definitions 
mapp.utils.merge(mapp.dictionaries, {
  en: {
    screenshot: 'Create screenshot from map canvas'
  },
  pl: {
    screenshot: 'Utwórz zrzut ekranu z obszaru mapy'
  }
  });

/**
mapp.plugins.screenshot() will append the screenshot button to the `#mapButton` element in the mapp _default view.
@function screenshot
@param {Object} options 
@param {Object} mapview  
*/
mapp.plugins.screenshot = (options, mapview) => {

  const btnColumn = document.getElementById("mapButton")

  if (!btnColumn) return;

  btnColumn.append(mapp.utils.html.node`
    <button
      class="mask-icon add-photo mobile-display-none"
      title=${mapp.dictionary.screenshot}
      onclick=${()=>mapp.utils.screenshot(mapview)}>`);


}

/**
mapp.utils.screenshot(mapview) will create a screenshot from the mapview target element.
@function screenshot
@param {Object} mapview  
*/
mapp.utils.screenshot = (mapview) => {

  const node = mapview.Map.getTargetElement().parentNode;

  htmlToImage.toBlob(node, { skipFonts: true }).then(blob => {
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  }).catch(function (error) {
    console.error('oops, something went wrong!', error);
  });
}