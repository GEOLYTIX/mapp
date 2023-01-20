export default (function(){

    mapp.ui.locations.entries.update_entry = entry => {
  
      // Check whether the update method is already assigned to the entry.
      if (entry.update) return;

      // update_entry is limited to an array of include_if_updated.
      if (entry.params.include_if_updated) {

        // Create a map for field values.
        entry.include_if_updated = new Map()

        entry.params.include_if_updated.forEach(field => {

            // set field value in map.
            entry.include_if_updated.set(field, entry.location.infoj.find(e => e.field == field).value);
        })
      }
  
      // Assign update method to prevent multiple execution.
      entry.update = () => {

        if (entry.params.include_if_updated) {

          let someChanged = entry.params.include_if_updated.map(field => {

            let fieldEntry = entry.location.infoj.find(e => e.field == field)

            let chk = fieldEntry.value !== entry.include_if_updated.get(field);

            // update value in map.
            entry.include_if_updated.set(field, fieldEntry.value);

            // check whether value has changed
            return chk
          })

          // Return if none of the include_if_updated has been updated.
          if (!someChanged.some(chk => chk == true)) return;
        }
  
        // Find entry to update from params.update_field value.
        const field_entry = entry.location.infoj.find(_entry => _entry.field === entry.params.update_field)

        // Check whether field_entry value is already set to prevent multiple execution.
        if (field_entry.value === (mapp.user?.email || 'anonymous')) return;
  
        // Assign user email or anonymous if not known as newValue.
        field_entry.newValue = mapp.user?.email || 'anonymous'
  
        // Update the location.
        entry.location.update()
      }
  
      // Push update method into location updateCallbacks array.
      entry.location.updateCallbacks.push(entry.update)
    }
  
  })()
