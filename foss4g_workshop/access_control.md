## Access Control

The access control table stores user accounts. Create a table in the SQL editor.

```sql
CREATE TABLE acl (
  "_id" serial not null,
  email text not null,
  password text,
  verified boolean default false,
  approved boolean default false,
  verificationtoken text,
  approvaltoken text,
  failedattempts integer default 0,
  password_reset text,
  api text,
  approved_by text,
  expires_on integer,
  access_log text[] default '{}'::text[],
  blocked boolean default false,
  roles text[] default '{}'::text[],
  admin boolean default false,
  language text default 'en',
  session text
);
```

Make the app `PRIVATE` by adding an env variable with your connection string for the newly created acl table.

You also must add a secret which is used to salt and hash the password in the xyz host.

```json
"PRIVATE": "postgres://dbauszus-glx:***@ep-curly-base-242741.eu-central-1.aws.neon.tech/workshop?sslmode=require|acl",
"SECRET": "This can be anything. The longer, the better."
```

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
Thereafter an email is sent to all adminstrator to approve the user account.

For now let's make our account `PUBLIC` by changing the env variable key.

Everybody will be able to see application and registered users are able to login.

## Roles

Let's assign some user roles for edit.

Any of the `edit: true` entries in your layer infoj array. Put the edit true into a roles object for the editor role.

Also assign the skip null value flag. This will ensure that public user who do not have rights to edit the field will see an empty field. All fields with a value of null will be skipped.

```json
"roles": {
    "editor": {
        "edit": true
    }
},
"skipNullValue": true,
```

Now open the user admin panel on `/api/user/admin`

This is the same panel where you approve user accounts. Or block, or even delete accounts.

The editor role should now be available in the roles dropdown.

Assign yourself the role and logout out.

You will now see the field value or no field if skipped with null value. You are not able to edit the field.

Login to the application and you have a cookie with a user token which has the editor role. You should be able to see and edit the field.

Add the new env variables to your vercel.json and redploy to production.