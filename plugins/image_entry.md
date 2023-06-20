Adds method for infoj entry type `image`.

mapp.ui.locations.entries.image(entry)

The cloudinary folder must be provided in the entry configuration. The CLOUDINARY_URL must be set in the process env.

```js
{
 "title": "image_1",
 "field": "image_1",
 "type": "image",
 "cloudinary_folder": "iwg",
 "edit": true
}
```

Unlike the `images` type for an image gallery the single image can only be uploaded or removed.

The location view valueChange event and location update methods will not be called.

The entry method returns a target element.

A target node class `image-entry-target` will assigned to entry if not already defined.

It is possible to assign a document node as target before the calling the image entry method. The image or upload input will be rendered into the existing target.

This allows create an image upload and display node in a custom view without the need for a location view.

The input element will need to be styled in the custom document view.

The image onclick event calls the mapp.ui.utils.imagePreview() method.

```js
{
 "title": "image_1",
 "field": "image_1",
 "type": "image",
 "cloudinary_folder": "iwg",
 "edit": true
}
```