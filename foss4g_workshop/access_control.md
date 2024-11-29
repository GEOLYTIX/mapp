# Access Control

Following the notes on [Application Security in the XYZ/wiki](https://github.com/GEOLYTIX/xyz/wiki/Security) we can create an Access Control List [ACL] in the neon workshop database.

![image](https://github.com/user-attachments/assets/14fb79f6-1e5f-4e6b-a12b-451c109052b7)

We want to keep the application PUBLIC but allow for user to register and login in order to facilitate user roles.

The ACL being in the same database as the locations table we can copy the DBS connection string for the `PUBLIC` environment variable and append `|acl` for the table name.

```json
"SECRET": "This can be anything. The longer, the better."
"PUBLIC": "postgresql://dbauszus-glx:🤫@ep-curly-base-242741.eu-central-1.aws.neon.tech/workshop?sslmode=require|acl",
```
**Remember to add the environment variables to the vercel.json before deploying.**

## Make yourself

You will now have to login to the application. Register your account with a valid email address.

You will see an error message that the transport has not been defined. However this is not a problem at this stage since the table is empty. There is no administrator to approve your account.

We can force verify the account, approve ourselves, and make us an admin too.

```sql
update acl set verified = true where email = 'dbauszus@gmail.com'
update acl set approved = true where email = 'dbauszus@gmail.com'
update acl set admin = true where email = 'dbauszus@gmail.com'
```

You should now be able to log in. But don't forget your password as there is no way at this stage to recover the password.

## Transport emails

If you like you can provide transport env variables to send and receive emails via nodemailer.

You can use the gmail smtp service for this. Please note that the password is not your google account password but an app password which you can easily generate like so.

- Click on your profile and select Manage your Google Account.
- Select Security.
- Below Signing in to Google select App passwords.
- Click Select app and choose Custom name.
- Name it either nodemailer or whatever you prefer.

```json
"TRANSPORT_HOST": "smtp.gmail.com",
"TRANSPORT_EMAIL": "dbauszus@gmail.com",
"TRANSPORT_PASSWORD": "***",
```

A user registers and will be sent an email to verify their account.
Thereafter an email is sent to all adminstrators to approve the user account.

For now let's make our account `PUBLIC` by changing the env variable key.

Everybody will be able to see application and registered users are able to login.

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
