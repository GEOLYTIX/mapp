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

Let's assign some user roles for edit.

We will alter the textarea field entry.

The edit flag will be nested in an `editor` role object.

We also assign the skip null value flag. This will ensure that public users who do not have rights to edit the field will see an empty field. All fields with a value of null will be skipped.

The title will be changed to `Admin Notes`.

```json
{
  "title": "Admin Notes",
  "field": "textarea",
  "type": "textarea",
  "roles": {
      "editor": {
          "edit": true
      }
  },
  "skipNullValue": true,
}
```

Now open the user admin panel on `/api/user/admin`

This is the same panel where you approve user accounts. Or block, or even delete accounts.

The editor role should now be available in the roles dropdown.

Assign yourself the role and logout.

You will now see the field value or no field if skipped with null value. You are not able to edit the field.

Login to the application and you have a cookie with a user token which has the editor role. You should be able to see and edit the field.

Add the new env variables to your vercel.json and redeloy to production.
