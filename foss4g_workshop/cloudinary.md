# Cloudinary Image Gallery

Cloudinary is a SaaS specialed on media. There is a free tier and signup is possible with Google SSO.


You can copy the `CLOUDINARY_URL` from the cloudinary dashboard and add the variable to your env.

```json
"CLOUDINARY_URL": "cloudinary://535318164441449:🤫@dxfbmva71"
```

**Remember to add the environment variable to the vercel.json before deploying.**

URL references for uploaded images must be stored with the location data in the locations table. We add a text array field for this in an SQL console.

```sql
ALTER TABLE locations ADD COLUMN images text[] DEFAULT '{}'::text[];
```

The mapp library has an images location entry type which will request the XYZ to sign uploads with the CLOUDINARY_URL.

We can add an infoj entry to the locations layer infoj array.

```json
{
  "title": "images",
  "field": "images",
  "type": "images",
  "edit": true,
  "cloudinary_folder": "belem"
}
```
### Redeploy

With a .vercel project folder in the root we will automatically re-deploy to this instance with `vercel --force --prod`.