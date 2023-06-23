# Cloudinary Image Gallery

With a free cloudinary account it is very easy to add an image gallery to our bars layer locations.

You can copy the `CLOUDINARY_URL` from the cloudinary dashboard and add the variable to your env.


```json
"CLOUDINARY_URL": "cloudinary://975917455425476:4XttGE9CWXyNYsF9xpMTDxTh8Ng@geolytix"
```

**Remember to add the environment variable to the vercel.json before deploying.**

Create a cloudinary folder in the media dashboard and add an entry to the bars layer infoj. 
[Configuration Notes for Images](https://github.com/GEOLYTIX/xyz/wiki/Configuration#images)

```json
{
    "field": "images",
    "type": "images",
    "edit": true,
    "cloudinary_folder": "workspace"
}
```

This means everyone can add and remove images to each locations gallery.

The image reference for each location are stored in the images array field.

```sql
images text[] DEFAULT '{}'::text[]
```