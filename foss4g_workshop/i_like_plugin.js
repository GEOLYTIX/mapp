export default (function () {

    mapp.ui.locations.entries.i_like = entry => {

        return mapp.utils.html.node`
            <button style="height: 100px;" onclick=${update_field}>
                <embed style="height: 100%; pointer-events: none;"
                    src="https://geolytix.github.io/mapp/foss4g_workshop/thumb-up.svg" />`

        function update_field() {

            const field_entry = entry.location.infoj.find(find => find.field === entry.params.field)

            field_entry.newValue = field_entry.value+1

            field_entry.location.update()

            field_entry.location.view.dispatchEvent(new Event('updateInfo'))
        }

    }

})()