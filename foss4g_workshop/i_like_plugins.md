# We 💖 plugins

Mapp is built around the idea that all kinds of functionality can be extended through [plugins](https://github.com/GEOLYTIX/xyz/wiki/Plugins).

We can a sample plugin from the mapp repository to the locale.

```json
"plugins": [
  "https://geolytix.github.io/mapp/plugins/coordinates.js"
],
"coordinates": {}
```

A button will be added to default view allowing the user to query the coordinates from a click into the mapview.

![image](https://github.com/user-attachments/assets/b6ffc35f-bd6c-4c93-b837-a55df46eb0ed)

A custom templates can also be added to the public folder to be deployed with the instance.

Add this script as `i_like_plugin.js` in the public folder. The plugin will create a custom entry type to increase a likes counter.

```js
mapp.ui.locations.entries.i_like = i_like

function i_like(entry) {

  return mapp.utils.html.node`
  <div>Likes: ${entry.value}</div>
  <button 
    style="height: 100px;" onclick=${update_field}>
    <embed 
      style="height: 100%; pointer-events: none;"
      src="https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg" />`

  function update_field() {

    entry.newValue = entry.value+1
    entry.location.update()
  }
}
```

Add the plugin location to the plugins array property in the JSON locale.

```json
"plugins": [
  "https://geolytix.github.io/mapp/plugins/coordinates.js",
  "/public/i_like_plugin.js"
],
```

A fields must be added to the locations table to store the likes count.

```SQL
ALTER TABLE locations ADD COLUMN likes integer default 0;
```

We can now add the entry for the plugin to the locations infoj entries.

```json
{
  "type": "i_like",
  "field": "likes"
}
```

The like button should now be available in the locations view.

[Screencast from 2024-11-29 17-53-50.webm](https://github.com/user-attachments/assets/1fdb07b4-abf7-48cc-9129-fb97d9f159a1)

👍👍👍
