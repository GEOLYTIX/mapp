module.exports = _ => {

    const layer = _.workspace.locales[_.locale].layers[_.layer]

    console.log(_)

    // Get fields array from query params.
    const fields = _.fields?.split(',')
        .map(field => _.workspace.templates[field]?.template || field)
        .filter(field => !!field)
   
    return `
        SELECT
        NULL AS id,
        ST_AsText(${_.geom || layer.geom}) AS geometry
        ${fields && `, ${fields.join(', ')}` || ''}
        FROM \${table}
        WHERE ${_.geom || layer.geom} IS NOT NULL \${filter};`
  }
