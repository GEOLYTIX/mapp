## Styling

The layer style config object controls the styling applied to features on an openlayers layer.

The default style is applied first.

A cluster style is applied to cluster features.

The highlight style is applied to a feature by the [mapview highlight interaction](https://geolytix.github.io/xyz/mapp/module-_mapview_interactions_highlight.html).

The gGoogle Icon font is a good source of svg icons for maps:

https://fonts.google.com/icons?icon.category=Maps

```json
"style": {
  "default": {
    "icon": {
      "svg": "/public/explore_nearby.svg"
    }
  },
  "cluster": {
    "icon": {
      "type": "dot"
    }
  },
  "highlight": {
    "scale": 1.5
  }
}
```
