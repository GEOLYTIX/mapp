# Access Control

Following the notes on [Application Security in the XYZ/wiki](https://github.com/GEOLYTIX/xyz/wiki/Security) we can create an Access Control List [ACL] in the neon workshop database.

![image](https://github.com/user-attachments/assets/14fb79f6-1e5f-4e6b-a12b-451c109052b7)

We want to keep the application PUBLIC but allow for user to register and login in order to facilitate user roles.

The ACL being in the same database as the locations table we can copy the DBS connection string for the `PUBLIC` environment variable and append `|acl` for the table name.

A `SECRET` string is required to sign JWT with for a user cookie.

```json
"SECRET": "This can be anything. The longer, the better."
"PUBLIC": "postgresql://dbauszus-glx:🤫@ep-curly-base-242741.eu-central-1.aws.neon.tech/workshop?sslmode=require|acl",
```
**Remember to add the environment variables to the vercel.json before deploying.**

## Make yourself

After reloading the node process a login button will appear. Follow the link to the login form and from there to register a new user account.

![image](https://github.com/user-attachments/assets/b09b4d51-d597-445e-bf66-d21ae50345a6)

New accounts must be verified by the user and approved by a site administrator. Verification will require the setup of a [mail transport via SMTP](https://github.com/GEOLYTIX/xyz/wiki/Process-Environment#transport).

Since this is the first user in the ACL there will be no administrator to approve anyways.

We will there therefore verify, approve, and make us self an administrator through the SQL console.

![image](https://github.com/user-attachments/assets/d3b11c67-b5f5-4a97-baa5-af532091bbab)


## Roles

Roles allow to restrict access to layer and locales. We add two role restrictions to the locations layer JSON in the workspace.

We add the '*' role which means that any user can see the layer. We also add the "delete_location" role with an object value which will be merged into the layer JSON when the layer is requested from a user having the "delete_location" role. This role will prevent any user to delete any locations.

```js
"roles": {
  "*": true,
  "delete_location": {
    "deleteLocation": true
  }
}
```
If we access the admin panel through the link button in the default application view we will see all registered user. The dropdown for roles will now allow to assign any role defined in the workspace.

![image](https://github.com/user-attachments/assets/b7716be6-f3ea-454d-9122-7f393bba53be)

A new user cookie will be requested if we refresh the default view. With the "delete_locations" role we are now able to delete selected locations.

![image](https://github.com/user-attachments/assets/dff5c1a3-0c10-43af-a288-c9d5921b4fb8)

We finish this exercise by redeploying the application with the updated workspace and process env via `vercel --force --prod`.
