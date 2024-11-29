mapp.ui.locations.entries.i_like = i_like

function i_like(entry) {

  return mapp.utils.html.node`
  <div>Likes: ${entry.value}</div>
  <button 
    style="height: 100px;" onclick=${update_field}>
    <embed 
      style="height: 100%; pointer-events: none;"
      src="https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg" />`

  function update_field() {

    entry.newValue = entry.value+1
    entry.location.update()
  }
}
