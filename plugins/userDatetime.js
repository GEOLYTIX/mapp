/**
### userDatetime entry

The userDatetime plugin add the `type:userDatetime` entry method to the mapp.ui library. The userDatetime entry method sets the current datatime and user email in the location data at rest. The fields will be updated for new locations and when existing locations are edited. 
```js
{
  "type": "userDatetime",
  "datetime_field": "created_date",
  "user_field": "created_user"
}
```
### layer.userEditField

Editing of locations is restricted to user matching the `layer.userEditField` value.

### layer.userFilterField

A current filter matching the mapp user email will be set for the `layer.userFilterField` field.

@module userDatetime
@author @dbauszus-glx 
*/

console.log(`userDatetime v4.8`)

mapp.ui.locations.entries.userDatetime = userDatetime

/**
@function userDatetime

@description
The userDatetime entry method assigns the user and datetime to the user_field and datetime_field entries.

The fields are immediately updated for new locations.

An updateCallback method is added to the location which will update the fields whenever the location update method is called.

@param {Object} entry Infoj entry object.
@property {string} entry.user_field The field to store the mapp.user email.
@property {string} entry.datetime_field The field to store the current datetime integer value.
*/

function userDatetime(entry) {

  if (entry.location._editToggle) {
    entry.location.editToggle = entry.location._editToggle
    delete entry.location._editToggle
  }

  // The update method only needs to be assigned once.
  if (entry.updateCallback) return;

  entry.updateCallback = updateCallback.bind(entry)

  // Will only execute after entry.update is assigned.
  if (entry.location.new) {

    // Editing should remain toggled for new locations after the update.
    if (entry.location.editToggle) {
      entry.location._editToggle = entry.location.editToggle
      delete entry.location.editToggle
    }

    // Update user and datetime fields.
    entry.updateCallback()
  }

  entry.location.updateCallbacks.push(entry.updateCallback)
}

/**
@function updateCallback

@description
The updateCallback method added to the location.updateCallbacks array will be triggered whenever the location update method updates the location data at rest.
*/

async function updateCallback() {

  const entry = this

  const newValues = {};

  if (entry.user_field) {

    const userEmail = mapp.user?.email || 'anonymous'

    // Assign value to info entries with entry.user_field field.
    entry.location.infoj
      .filter(_entry => _entry.field === entry.user_field)
      .forEach(_entry => _entry.value = userEmail)

    newValues[entry.user_field] = userEmail
  }

  if (entry.datetime_field) {

    const dateInt = parseInt(Date.now() / 1000)

    // Assign value to info entries with entry.datetime_field field.
    entry.location.infoj
      .filter(_entry => _entry.field === entry.datetime_field)
      .forEach(_entry => _entry.value = dateInt)

    newValues[entry.datetime_field] = dateInt
  }

  // Do not process subsequent infoj entries.
  entry.location.view?.classList.add('disabled')

  // Update the location with the new values.
  await mapp.utils.xhr({
    method: 'POST',
    url:
      `${entry.location.layer.mapview.host}/api/query?template=location_update&` +
      mapp.utils.paramString({
        locale: entry.location.layer.mapview.locale.key,
        layer: entry.location.layer.key,
        table: entry.location.table,
        id: entry.location.id,
      }),
    body: JSON.stringify(newValues),
  });

  // Refresh the location.
  entry.location.view.dispatchEvent(new Event('updateInfo'))
}

mapp.location.decorate = mapp.utils.compose(userEdit, mapp.location.decorate.bind())

/**
@function userEdit

@description
The userEdit method is composed with the location decorator method.

The composed location decorator method will look for an entry with a field matching the layer.userEditField.

Location edits will be disabled if the userEditField entry value does not match the mapp.user.email.

@param {Object} location 
@returns {Object} location
*/

function userEdit(location) {

  // The userEditField is not set on the layer.
  if (!location.layer?.userEditField) return location;

  // Find entry with userEditField field.
  const userEntry = location.infoj.find(entry => entry.field === location.layer.userEditField)

  // Editing is allowed if the userEntry or its value are falsy.
  if (!userEntry?.value) return location;

  // The user value is different to the user.email
  if (userEntry.value !== mapp.user?.email) {

    // Remove edit.
    location.infoj.forEach(entry => delete entry.edit)

    // Remove delete
    location.layer.deleteLocation = false;
  }

  return location;
}

// Assign layer filter for the mapp.user
mapp.layer.userFilterField = userFilter

/**
@function userFilter

@description
Assigned as `mapp.layer.userFilterField` the userFilter method will be executed by the layer decorator method if the layer has a `userFilterField` flag.

The userFilter method assigns a match filter to the layer for the userFilterField with the user email as value.

@param {Object} layer Mapp Layer object.
@property {string} layer.userFilterField The field which holds the user email value.
*/

function userFilter(layer) {

  if (typeof layer.userFilterField !== 'string') {
    console.warn(`${layer.key}: The userFilterField must be of type string.`)
    return;
  }

  if (!mapp.user?.email) return;

  layer.filter.current ??= {}

  layer.filter.current[layer.userFilterField] = {
    match: mapp.user.email
  }
}