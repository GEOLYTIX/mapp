# We :heart: plugins

Mapp is built around the idea that all kinds of functionality can be extended through plugins.
[Configuration Notes For Plugins](https://github.com/GEOLYTIX/xyz/wiki/Configuration#plugins)

This sample plugin adds a custom entry type `i_like` to the mapp.ui.locations.entries.

The plugin returns a button with our thumb_up icon to the location view.

When pressed the update_field method parses the infoj array for the `likes` field entry. Increases the likes value by 1. And updates the location and location view.

```js
export default (function () {

    mapp.ui.locations.entries.i_like = entry => {

        return mapp.utils.html.node`
            <button style="height: 100px;" onclick=${update_field}>
                <embed style="height: 100%; pointer-events: none;"
                    src="https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg" />`

        function update_field() {

            const field_entry = entry.location.infoj.find(find => find.field === entry.params.field)

            field_entry.newValue = field_entry.value+1

            field_entry.location.update()

            field_entry.location.view.dispatchEvent(new Event('updateInfo'))
        }

    }

})()
```

We can load the plugin from the public folder by creating the plugin file in the public root. The plugin is then referenced in the locale.plugins array like so:

```json
"plugins": [
    "/public/i_like_plugin.js"
],
```

Alternatively the plugin can also be loaded directly from this repository.

```json
"plugins": [
    "https://geolytix.github.io/mapp/foss4g_workshop/i_like_plugin.js"
],
```

We can add an entry for the plugin underneath the likes field entry.

```json
{
    "title": "Likes",
    "field": "likes",
    "inline": true
},
{
    "type": "i_like",
    "params": {
        "field": "likes"
    }
},
```
