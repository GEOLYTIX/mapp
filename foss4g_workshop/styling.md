## Styling

Let's apply some styling to our scratch layer. A default style will be assigned without an implicit style configuration in the layer object. For the geojson layer the default style looks like this.

```js
style: {
    default: {
        strokeColor: '#333',
        fillColor: '#fff1',
        icon: {
            type: 'dot'
        }
    },
    highlight: {}
}
```

Let's go ahead and define our own default style in the layer config.

```json
"style": {
    "default": {
        "fillColor": "#FF69B4",
        "fillOpacity": 0.5
    }
},
```

The polygon fill will now be 50% translucent hotpink. The default style will still be assigned on top of this object and hence the icon and stroke remain unchanged.

There is no default highlight style. Let's assign this.

```json
"highlight": {
    "strokeColor": "#4B0082",
    "strokeWidth": 3,
    "scale": 2
}
```

Where applicable, for linestring and polygon features, a thicker indigo stroke will be assigned to the Openlayers render if a feature is highlighted. The scale refers to icons. The dot point features scale will be multiplied by 2 if highlighted.

The selected style is applied to features whose ID are in the location listview.

If you add a location from the scratch layer to the locations list by clicking on the highlighted feature you will notice that the location geometry is rendered in a distinctive style which is assigned from the location listview itself. 

**Remove the geometry entry from the scratch layer infoj** and apply a selected style instead. Instead of a location list specific stroke, all listed locations will be rendered with a 2pt purple stroke.

```json
"selected": {
    "strokeColor": "#A020F0",
    "strokeWidth": 2
}
```

## Themes

Themes allow to style features based on their properties. The basic theming types are graduated and categorical.

Let's create a categorical theme for our scratch layer.

We want to style the features based on the char_field property.

First we need to add the `char_field` to an array of properties in the layer configuration. The geojson loaded from the XYZ endpoint must contain the property in order to style the features.

```json
"properties": ["char_field"]
```

We want to create a simple colour theme. Let's update the char_field entry first. We set the title to be more meaningful and replace the edit flag with an edit.options array. The options in the array will be presented as a dropdown select input.

```json
{
    "title": "Pick a colour",
    "field": "char_field",
    "edit": {
        "options": [
            "Red",
            "Blue",
            "Green"
        ]
    }
}
```

At last we add the theme to the layer style configuration.

```json
"theme": {
    "title": "Colour theme",
    "field": "char_field",
    "type": "categorized",
    "cat": {
        "Red": {
            "strokeColor": "#F00",
            "fillColor": "#F00"
        },
        "Green": {
            "strokeColor": "#0F0",
            "fillColor": "#0F0"
        },
        "Blue": {
            "strokeColor": "#00F",
            "fillColor": "#00F"
        }
    }
}
```

The three categories are now associated with matching colours. You will notice that the default opacity is still applied since the theme style is assigned to the default style.

The default `dot` icon will also pick up on the fillColor.
