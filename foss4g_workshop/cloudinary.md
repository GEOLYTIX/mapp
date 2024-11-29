# Cloudinary Image Gallery

Cloudinary is a SaaS specialed on media. There is a free tier and signup is possible with Google SSO.

![image](https://github.com/user-attachments/assets/2b6d0b40-781c-413c-a902-8c6c63844648)

You can copy the `CLOUDINARY_URL` from the cloudinary dashboard `View API Keys` to the process env.

![image](https://github.com/user-attachments/assets/53894d0a-e966-4996-87d3-fbd9d0a2bad3)

```json
"CLOUDINARY_URL": "cloudinary://535318164441449:🤫@dxfbmva71"
```

**Remember to add the environment variable to the vercel.json before deploying.**

URL references for uploaded images must be stored with the location data in the locations table. We add a text array field for this in an SQL console.

```sql
ALTER TABLE locations ADD COLUMN images text[] DEFAULT '{}'::text[];
```

The mapp library has an images location entry type which will request the XYZ Host to sign uploads with the CLOUDINARY_URL.

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

After redeploying the instance with `vercel --force --prod` you will be able upload and see images on locations.

![image](https://github.com/user-attachments/assets/81f69aa8-ccab-4784-bc22-ac91b52fafdd)
