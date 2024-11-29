## Styling

The layer style config object controls the styling applied to features on an openlayers layer.

The default style is applied first.

A cluster style is applied to cluster features.

The highlight style is applied to a feature by the [mapview highlight interaction](https://geolytix.github.io/xyz/mapp/module-_mapview_interactions_highlight.html).

The Google Icon font is a good source of svg icons for maps:

https://fonts.google.com/icons?icon.category=Maps

![image](https://github.com/user-attachments/assets/4aa5eaa8-2741-48ae-848c-7f9a023e93fc)

Stored in the public directory the svg can be assigned as icon style for point features.

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

### Themes

A theme allows to style features according to their properties. A 'cat' column can be added to the locations table in the SQL editor.

```sql
ALTER TABLE locations ADD COLUMN cat varchar;
```

We add an entry for the new field to the infoj array and limit values to an options array.

```json
{
  "title": "Category",
  "field": "cat",
  "inline": true,
  "edit": {
    "options": ["Bar", "Restaurant", "Shopping", "Activity", "Nature"]
  }
}
```

You are now able to select a category from the location view dropdown input.

![image](https://github.com/user-attachments/assets/7aef7402-8ccc-436b-9671-6fd4d2b13cec)

We add a categorized theme for the cat field to the locations layer style configuration. URL references can be used to load the svg icon from the github pages for this repository.

```json
"theme": {
  "title": "Categories",
  "type": "categorized",
  "field": "cat",
  "cat": {
    "Activity": {
      "label": "Activity",
      "style": {
        "icon": {
          "svg": "https://geolytix.github.io/mapp/foss4g_workshop/local_activity.svg"
        }
      }
    },
    "Bar": {
      "label": "Bar",
      "style": {
        "icon": {
          "svg": "https://geolytix.github.io/mapp/foss4g_workshop/wine_bar.svg"
        }
      }
    },
    "Restaurant": {
      "label": "Restaurant",
      "style": {
        "icon": {
          "svg": "https://geolytix.github.io/mapp/foss4g_workshop/restaurant.svg"
        }
      }
    },
    "Shopping": {
      "label": "Restaurant",
      "style": {
        "icon": {
          "svg": "https://geolytix.github.io/mapp/foss4g_workshop/local_mall.svg"
        }
      }
    },
    "Nature": {
      "label": "Nature",
      "style": {
        "icon": {
          "svg": "https://geolytix.github.io/mapp/foss4g_workshop/local_florist.svg"
        }
      }
    }
  }
}
```

A legend for theme will now be shown in the layer panel.

![image](https://github.com/user-attachments/assets/879ad556-8a46-4f21-9cab-654d5bb3e6db)

### Redeploy

With a .vercel project folder in the root we will automatically re-deploy to this instance with `vercel --force --prod`.
