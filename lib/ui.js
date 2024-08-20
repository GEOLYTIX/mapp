(()=>{mapp.utils.merge(mapp.dictionaries,{en:{layer_zoom_to_extent:"Zoom to filtered layer extent",layer_visibility:"Toggle visibility",zoom_to:"Zoom to"},de:{layer_zoom_to_extent:"Zoom zum Ausma\xDF des gefilterten Datensatzes",layer_visibility:"Umschalten der Ansicht",zoom_to:"Heranzoomen"},zn:{layer_zoom_to_extent:"\u7F29\u653E\u81F3\u7B5B\u9009\u56FE\u5C42\u7684\u76F8\u5E94\u8303\u56F4",layer_visibility:"\u53EF\u89C1\u6027\u5207\u6362",zoom_to:"\u7F29\u653E\u81F3"},zn_tw:{layer_zoom_to_extent:"\u7E2E\u653E\u81F3\u7BE9\u9078\u5716\u5C64\u7684\u76F8\u61C9\u7BC4\u570D",layer_visibility:"\u53EF\u898B\u6027\u5207\u63DB",zoom_to:"\u7E2E\u653E\u81F3"},pl:{layer_zoom_to_extent:"Przybli\u017C do odfiltrowanej wastwy",layer_visibility:"Zmodyfikuj widzialno\u015B\u0107",zoom_to:"Przybli\u017C do"},fr:{layer_zoom_to_extent:"Zoom sur la couche filtr\xE9e",layer_visibility:"Modifier la visibilit\xE9",zoom_to:"Zoom sur"},ja:{layer_zoom_to_extent:"\u30D5\u30A3\u30EB\u30BF\u30FC\u3055\u308C\u305F\u30EC\u30A4\u30E4\u30FC\u7BC4\u56F2\u3092\u30BA\u30FC\u30E0\u306B",layer_visibility:"\u8868\u793A\u5207\u66FF",zoom_to:"\u30BA\u30FC\u30E0\u3078"},es:{layer_zoom_to_extent:"Zoom a capa filtrada",layer_visibility:"Alternar visibilidad",zoom_to:"Acercar a"},tr:{layer_zoom_to_extent:"Filtrelenmis katman kapsamina yaklas",layer_visibility:"Gorunurlugu degistir",zoom_to:"Yaklas"},it:{layer_zoom_to_extent:"Zoom sul layer",layer_visibility:"Attiva/Disattiva visibilit\xE0",zoom_to:"Zoom a"},th:{layer_zoom_to_extent:"\u0E0B\u0E39\u0E21\u0E44\u0E1B\u0E17\u0E35\u0E48\u0E02\u0E2D\u0E1A\u0E40\u0E02\u0E15\u0E40\u0E25\u0E40\u0E22\u0E2D\u0E23\u0E4C\u0E17\u0E35\u0E48\u0E01\u0E23\u0E2D\u0E07",layer_visibility:"\u0E2A\u0E25\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19",zoom_to:"\u0E0B\u0E39\u0E21\u0E44\u0E1B\u0E17\u0E35\u0E48"}});var ee=e=>{if(e.view===null)return e;e.view=mapp.utils.html.node`<div class="layer-view">`;let t=Object.keys(e).map(i=>mapp.ui.layers.panels[i]&&mapp.ui.layers.panels[i](e)).filter(i=>typeof i<"u");if(e.panelOrder=e.panelOrder||["draw-drawer","dataviews-drawer","filter-drawer","style-drawer","meta"],t.sort((i,l)=>e.panelOrder.findIndex(a=>a===i.dataset?.id)<e.panelOrder.findIndex(a=>a===l.dataset?.id)?1:-1),e.drawer!==null){e.zoomToExtentBtn=e.filter.zoomToExtent&&mapp.utils.html`
      <button
        data-id=zoomToExtent
        title=${mapp.dictionary.layer_zoom_to_extent}
        class="mask-icon fullscreen"
        onclick=${async l=>{l.target.disabled=!await e.zoomToExtent(),e.show()}}>`,e.displayToggle=mapp.utils.html.node`
      <button
        data-id=display-toggle
        title=${mapp.dictionary.layer_visibility}
        class="${`mask-icon toggle ${e.zoomDisplay||e.display?"on":""}`}"
        onclick=${l=>{l.target.classList.toggle("on")?e.show():e.hide()}}>`,e.zoomBtn=e.tables&&mapp.utils.html.node`
      <button 
        data-id="zoom-to"
        title=${mapp.dictionary.zoom_to}
        class="mask-icon search"
        onclick=${()=>{let l=Object.entries(e.tables).find(s=>!!s[1])[0],a=Object.entries(e.tables).reverse().find(s=>!!s[1])[0],o=e.mapview.Map.getView();o.getZoom()<l?o.setZoom(l):o.setZoom(a),e.show()}}>`,e.showCallbacks.push(()=>{e.displayToggle.classList.add("on")}),e.hideCallbacks.push(()=>{!e.zoomDisplay&&e.displayToggle.classList.remove("on")});let i=mapp.utils.html`
      <h2>${e.name||e.key}</h2>
      ${e.zoomToExtentBtn}
      ${e.displayToggle}
      ${e.zoomBtn}
      <div class="mask-icon expander"></div>`;e.drawer=mapp.ui.elements.drawer({data_id:"layer-drawer",class:`layer-view raised ${e.classList||""} ${t.length?"":"empty"}`,header:i,content:t}),mapp.utils.render(e.view,e.drawer)}else t.forEach(i=>e.view.append(i));return e.tables&&e.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{e.tableCurrent()?(e.zoomBtn.style.display="none",e.displayToggle.classList.remove("disabled"),t.forEach(i=>i.classList.remove("disabled"))):(e.zoomBtn.style.display="block",e.view.querySelector("[data-id=layer-drawer]").classList.remove("expanded"),e.displayToggle.classList.add("disabled"),t.forEach(i=>i.classList.add("disabled")))}),e};mapp.utils.merge(mapp.dictionaries,{en:{layer_group_hide_layers:"Hide all layers in group"},de:{layer_group_hide_layers:"Ausschalten aller Ebenen in Gruppe"},zh:{layer_group_hide_layers:"\u9690\u85CF\u6574\u7EC4\u56FE\u5C42"},zh_tw:{layer_group_hide_layers:"\u96B1\u85CF\u6574\u7D44\u5716\u5C64"},pl:{layer_group_hide_layers:"Ukryj wszystkie warstwy w grupie"},fr:{layer_group_hide_layers:"Masquer toutes les couches du groupe"},ja:{layer_group_hide_layers:"\u30B0\u30EB\u30FC\u30D7\u304B\u3089\u30EC\u30A4\u30E4\u30FC\u3092\u96A0\u3059"},es:{layer_group_hide_layers:"Ocultar todas las capas del grupo"},tr:{layer_group_hide_layers:"Gruptaki tum katmanlari gizle"},it:{layer_group_hide_layers:"Nascondi tutti i layer nel gruppo"},th:{layer_group_hide_layers:"\u0E0B\u0E48\u0E2D\u0E19\u0E17\u0E38\u0E01\u0E0A\u0E31\u0E49\u0E19\u0E43\u0E19\u0E01\u0E25\u0E38\u0E48\u0E21"}});function te(e){if(!e.mapview||!e.target)return;let t={node:e.target,groups:{}};Object.values(e.mapview.layers).forEach(a=>i(a));function i(a){if(!a.hidden){if(mapp.ui.layers.view(a),!a.group){t.node.appendChild(a.view),t.node.dispatchEvent(new CustomEvent("addLayerView",{detail:a}));return}t.groups[a.group]||l(a),t.groups[a.group].addLayer(a),t.node.dispatchEvent(new CustomEvent("addLayerView",{detail:a}))}}function l(a){let o={list:[]};t.groups[a.group]=o;let s=mapp.utils.html.node`
      <button
        class="mask-icon on visibility-off"
        title=${mapp.dictionary.layer_group_hide_layers}
        onclick=${n=>{n.target.style.visibility="hidden",o.list.filter(r=>r.display).forEach(r=>r.hide())}}>`;o.meta=mapp.utils.html.node`<div class="meta">`,o.drawer=mapp.ui.elements.drawer({data_id:"layer-drawer",class:`layer-group ${a.groupClassList||""}`,header:mapp.utils.html`
        <h2>${a.group}</h2>
        ${s}
        <div class="mask-icon expander"></div>`,content:o.meta}),t.node.appendChild(o.drawer),o.chkVisibleLayer=()=>{s.style.visibility=o.list.some(n=>n.display)?"visible":"hidden"},o.addLayer=n=>{if(n.group=o,n.groupmeta){let r=o.meta.appendChild(mapp.utils.html.node`<div>`);r.innerHTML=n.groupmeta}o.list.push(n),o.drawer.appendChild(n.view),o.chkVisibleLayer(),n.showCallbacks.push(()=>o.chkVisibleLayer()),n.hideCallbacks.push(()=>o.chkVisibleLayer())}}}var ne={like:le,match:le,numeric:ae,integer:ae,in:oe,ni:oe,date:se,datetime:se,boolean:Ge,null:Ue};mapp.utils.merge(mapp.dictionaries,{en:{no_data_filter:"This field contains no data and cannot be filtered on.",filter_searchbox_placeholder:"Search",identical_values_filter:"This field contains only one distinct value and cannot be filtered on."},de:{no_data_filter:"Dieses Feld enth\xE4lt keine Daten und kann nicht gefiltert werden."}});var ie;function u(e){clearTimeout(ie),ie=setTimeout(()=>{e.style.legend&&mapp.ui.layers.legends[e.style.theme.type](e),e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))},500)}function le(e,t){return mapp.utils.html.node`
  <input
    type="text"
    onkeyup=${i=>{i.target.value.length?(e.filter.current[t.field]??={},e.filter.current[t.field][t.type]=encodeURIComponent(`${t.leading_wildcard&&"%"||""}${i.target.value}`)):(delete e.filter.current[t.field][t.type],Object.keys(e.filter.current[t.field])||delete e.filter.current[t.field]),u(e)}}>`}function Ge(e,t){function i(l){e.filter.current[t.field]={boolean:l},u(e)}return i(!1),mapp.ui.elements.chkbox({label:t.label||t.title||"chkbox",onchange:i})}function Ue(e,t){function i(l){e.filter.current[t.field]={null:l},u(e)}return i(!1),mapp.ui.elements.chkbox({label:t.label||t.title||"chkbox",onchange:i})}async function Ze(e,t){let i=await mapp.utils.xhr(`${e.mapview.host}/api/query?${mapp.utils.paramString({template:"field_minmax",locale:e.mapview.locale.key,layer:e.key,table:e.tableCurrent(),field:t.field})}`),l=isNaN(t.min)?i.minmax[0]:t.min,a=isNaN(t.max)?i.minmax[1]:t.max;t.min=t.type==="integer"?Math.round(l):parseFloat(l),t.max=t.type==="integer"?Math.round(a):parseFloat(a)}async function ae(e,t){let i=e.infoj.find(a=>a.field===t.field);if(Object.assign(t,i),(isNaN(t.max)||isNaN(t.min))&&await Ze(e,t),t.step??=t.type==="integer"?1:.01,e.filter.current[t.field]=Object.assign({gte:Number(t.min),lte:Number(t.max)},e.filter.current[t.field]),u(e),t.min===t.max)return mapp.utils.html.node`<div>${mapp.dictionary.identical_values_filter}</div>`;if(isNaN(t.min)||isNaN(t.max))return mapp.utils.html.node`<div>${mapp.dictionary.no_data_filter}</div>`;let l=t.prefix||t.suffix?`(${(t.prefix||t.suffix).trim()})`:"";return t.label_a??=`${mapp.dictionary.layer_filter_greater_than} ${l}`,t.label_b??=`${mapp.dictionary.layer_filter_less_than} ${l}`,t.val_a=e.filter.current?.[t.field]?.gte||t.min,t.val_b=e.filter.current?.[t.field]?.lte||t.max,t.callback_a=a=>{e.filter.current[t.field].gte=a,u(e)},t.callback_b=a=>{e.filter.current[t.field].lte=a,u(e)},mapp.ui.elements.slider_ab(t)}async function oe(e,t){if(!Array.isArray(t[t.type])){let a=await mapp.utils.xhr(`${e.mapview.host}/api/query?`+mapp.utils.paramString({template:"distinct_values",dbs:e.dbs,locale:e.mapview.locale.key,layer:e.key,table:e.tableCurrent(),field:t.field,filter:e.filter?.current}));if(!a)return console.warn(`Distinct values query did not return any values for field ${t.field}`),mapp.utils.html.node`<div>${mapp.dictionary.no_data_filter}</div>`;t[t.type]=[a].flat().map(o=>o[t.field]).filter(o=>o!==null)}let i=new Set(e.filter?.current[t.field]?.[t.type]||[]);if(t.dropdown||t.dropdown_pills){let a=mapp.ui.elements.dropdown({pills:t.dropdown_pills,multi:!0,inputfilter:!0,placeholder:"Select Multiple",maxHeight:300,entries:t[t.type].map(o=>({title:o,option:o,selected:i.has(o)})),callback:async(o,s)=>{s.length?Object.assign(e.filter.current,{[t.field]:{[t.type]:s}}):delete e.filter.current[t.field],u(e)}});return mapp.utils.html.node`<div class="filter">${a}`}if(t.searchbox){let a=mapp.utils.html.node`<div class="filter">`,o=mapp.ui.elements.pills({target:a,addCallback:(n,r)=>{Object.assign(e.filter.current,{[t.field]:{[t.type]:[...r]}}),u(e)},removeCallback:(n,r)=>{r.size===0?(s.input.value=null,delete e.filter.current[t.field]):Object.assign(e.filter.current,{[t.field]:{[t.type]:[...r]}}),u(e)}}),s=mapp.ui.elements.searchbox({target:a,placeholder:mapp.dictionary.filter_searchbox_placeholder,searchFunction:n=>{if(s.list.innerHTML="",!n.target.value)return;let r=n.target.value,d=t[t.type].filter(c=>c.toString().toLowerCase().startsWith(r.toLowerCase()));if(!d.length){s.list.append(mapp.utils.html.node`
            <li><span>${mapp.dictionary.no_results}`);return}d.filter(c=>!o.pills.has(c)).filter((c,m)=>m<9).forEach(c=>{s.list.append(mapp.utils.html.node`
              <li onclick=${()=>{!o.pills.has(c)&&o.add(c)}}>${c}`)})}});return mapp.utils.html.node`${a}`}let l=t[t.type].map(a=>mapp.ui.elements.chkbox({val:a,label:a,checked:i.has(a),onchange:(o,s)=>{if(o)e.filter.current[t.field]||(e.filter.current[t.field]={}),e.filter.current[t.field][t.type]||(e.filter.current[t.field][t.type]=[]),e.filter.current[t.field][t.type].push(s);else{let n=e.filter.current[t.field][t.type].indexOf(s);e.filter.current[t.field][t.type].splice(n,1),e.filter.current[t.field][t.type].length||delete e.filter.current[t.field]}u(e)}}));return mapp.utils.html.node`<div class="filter">${l}`}function se(e,t){let i=mapp.utils.html.node`
    <input
      data-id="inputAfter"
      onchange=${a}
      type=${t.type==="datetime"&&"datetime-local"||"date"}>`,l=mapp.utils.html.node`
    <input
      data-id="inputBefore"
      onchange=${a}
      type=${t.type==="datetime"&&"datetime-local"||"date"}>`;function a(o){o.target.dataset.id==="inputAfter"&&(e.filter.current[t.field]=Object.assign(e.filter.current[t.field]||{},{gt:new Date(o.target.value).getTime()/1e3})),o.target.dataset.id==="inputBefore"&&(e.filter.current[t.field]=Object.assign(e.filter.current[t.field]||{},{lt:new Date(o.target.value).getTime()/1e3})),u(e)}return mapp.utils.html`
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 5px;">
      <label>Date after
        ${i}</label>
      <label>Date before
        ${l}</label>`}var re=e=>{let t=mapp.utils.html.node`<p data-id="meta" class="meta">`;return t.innerHTML=e.meta,t};mapp.utils.merge(mapp.dictionaries,{en:{layer_add_new_location:"Add new locations"},de:{layer_add_new_location:"Erstelle neue Lage"},zh:{layer_add_new_location:"\u6DFB\u52A0\u65B0\u5730\u70B9"},zh_tw:{layer_add_new_location:"\u6DFB\u52A0\u65B0\u5730\u9EDE"},pl:{layer_add_new_location:"Dodaj now\u0105 lokalizacj\u0119"},fr:{layer_add_new_location:"Ajouter un site"},ja:{layer_add_new_location:"\u65B0\u3057\u3044\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u8FFD\u52A0"},es:{layer_add_new_location:"Agregar nuevos sitios"},tr:{layer_add_new_location:"Yeni konum ekle"},it:{layer_add_new_location:"Aggiungi nuovo elemento"},th:{layer_add_new_location:"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E43\u0E2B\u0E21\u0E48"}});var de=e=>{if(typeof e.draw!="object"||e.draw.hidden)return;let t=Object.keys(e.draw).map(l=>mapp.ui.elements.drawing[l]&&mapp.ui.elements.drawing[l](e)).filter(l=>!!l);return t.length?mapp.ui.elements.drawer({data_id:"draw-drawer",class:`raised ${e.draw.classList||""}`,header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_add_new_location}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`
      ${t}`}):void 0};mapp.utils.merge(mapp.dictionaries,{en:{layer_filter_header:"Filter",layer_filter_select:"Select filter from list",layer_filter_clear_all:"Clear all filters",layer_filter_greater_than:"Greater than",layer_filter_less_than:"Less than",layer_filter_set_filter:"Set filter"},de:{layer_filter_header:"Filter",layer_filter_select:"Filter Auswahl",layer_filter_clear_all:"Entferne alle Filter",layer_filter_greater_than:"Mehr als",layer_filter_less_than:"Weniger als",layer_filter_set_filter:"Filter einstellen"},zh:{layer_filter_header:"\u7B5B\u9009",layer_filter_select:"\u4ECE\u5217\u8868\u7B5B\u9009",layer_filter_clear_all:"\u6E05\u9664\u6240\u6709\u7B5B\u9009",layer_filter_greater_than:"\u5927\u4E8E",layer_filter_less_than:"\u5C0F\u4E8E",layer_filter_set_filter:"\u8BBE\u7F6E\u7B5B\u9009"},zh_tw:{layer_filter_header:"\u7BE9\u9078",layer_filter_select:"\u5F9E\u5217\u8868\u7BE9\u9078",layer_filter_clear_all:"\u6E05\u9664\u6240\u6709\u7BE9\u9078",layer_filter_greater_than:"\u5927\u65BC",layer_filter_less_than:"\u5C0F\u65BC",layer_filter_set_filter:"\u8A2D\u7F6E\u7BE9\u9078"},pl:{layer_filter_header:"Filtruj",layer_filter_select:"Wybierz z listy",layer_filter_clear_all:"Wyczy\u015B\u0107 wszystkie filtry",layer_filter_greater_than:"Wi\u0119ksze ni\u017C",layer_filter_less_than:"Mniejsze ni\u017C",layer_filter_set_filter:"Ustaw filtr"},fr:{layer_filter_header:"Filtre",layer_filter_select:"S\xE9lectionner un filtre de la liste",layer_filter_clear_all:"Enlever tous les filtres",layer_filter_greater_than:"Plus grand que",layer_filter_less_than:"Moins que",layer_filter_set_filter:"D\xE9finir le filtre"},ja:{layer_filter_header:"\u30D5\u30A3\u30EB\u30BF\u30FC",layer_filter_select:"\u30EA\u30B9\u30C8\u304B\u3089\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u9078\u629E",layer_filter_clear_all:"\u5168\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u30AF\u30EA\u30A2",layer_filter_greater_than:"\u4EE5\u4E0A",layer_filter_less_than:"\u4EE5\u4E0B",layer_filter_set_filter:"\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u8A2D\u5B9A"},es:{layer_filter_header:"Filtro",layer_filter_select:"Seleccionar filtro de la lista",layer_filter_clear_all:"Anular todos los filtros",layer_filter_greater_than:"Mas grande que",layer_filter_less_than:"Menos que",layer_filter_set_filter:"Definir el filtro"},tr:{layer_filter_header:"Filtrele",layer_filter_select:"Listeden filtre sec",layer_filter_clear_all:"Tum filtreleri kaldir",layer_filter_greater_than:"Buyuktur",layer_filter_less_than:"Kucuktur",layer_filter_set_filter:"Filtreyi ayarla"},it:{layer_filter_header:"Filtro",layer_filter_select:"Seleziona filtro dalla lista",layer_filter_clear_all:"Elimina tutti i filtri",layer_filter_greater_than:"Maggiore di",layer_filter_less_than:"Minore di",layer_filter_set_filter:"Imposta filtro"},th:{layer_filter_header:"\u0E01\u0E23\u0E2D\u0E07",layer_filter_select:"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07\u0E08\u0E32\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",layer_filter_clear_all:"\u0E25\u0E49\u0E32\u0E07\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",layer_filter_greater_than:"\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32",layer_filter_less_than:"\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32",layer_filter_set_filter:"\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07"}});var ce=e=>{if(e.filter.hidden||!e.infoj||(e.filter.list=e.infoj.filter(l=>l.filter!==void 0).filter(l=>l.field!==void 0).filter(l=>!e.filter?.exclude?.includes(l.field)).filter(l=>!l.skipEntry).map(l=>(typeof l.filter=="string"&&(l.filter={type:l.filter,field:l.field}),l.filter.title??=l.title,l.filter.field??=l.field,structuredClone(l.filter))),!e.filter.list.length))return;let t=mapp.ui.elements.dropdown({data_id:`${e.key}-filter-dropdown`,placeholder:mapp.dictionary.layer_filter_select,keepPlaceholder:!0,entries:e.filter.list,callback:async(l,a)=>{if(!mapp.ui.layers.filters[a.type]||a?.card)return;e.filter.view.querySelector("[data-id=clearall]").style.display="block",l.target.classList.add("selected"),a.remove=()=>{e.filter.current[a.field]&&(e.filter.current[a.field][a.type]?delete e.filter.current[a.field][a.type]:delete e.filter.current[a.field],e.filter.current[a.field]&&!Object.keys(e.filter.current[a.field]).length&&delete e.filter.current[a.field]),delete a.card,l.target.classList.remove("selected"),e.style.legend&&mapp.ui.layers.legends[e.style.theme.type](e),e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd")),e.filter.view.querySelector("[data-id=clearall]").style.display=e.filter.view.children.length===3?"none":"block"};let o=[await mapp.ui.layers.filters[a.type](e,a)].flat();a.meta&&o.unshift(mapp.utils.html.node`<p>${a.meta}`),a.card=e.filter.view.appendChild(mapp.ui.elements.card({header:a.title,close:a.remove,content:o}))}}),i=mapp.utils.html`
    <button
      data-id=clearall
      class="primary-colour"
      style="display: none; margin-bottom: 5px;"
      onclick=${l=>{e.filter.list.filter(a=>a.card).forEach(a=>{a.card.querySelector("[data-id=close]").click()})}}>${mapp.dictionary.layer_filter_clear_all}`;return e.filter.view=mapp.ui.elements.drawer({data_id:"filter-drawer",class:`raised ${e.filter.classList||""}`,header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_filter_header}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`
      ${t}
      ${i}`}),e.filter.view};var pe=e=>{let t=Object.assign({mapview:e.mapview,target:mapp.utils.html.node`<div>`,layer:e.key},e.gazetteer);return mapp.ui.Gazetteer(t),t.target};mapp.utils.merge(mapp.dictionaries,{en:{layer_dataview_header:"Data Views"},de:{layer_dataview_header:"Datenansichten"},zh:{layer_dataview_header:"\u663E\u793A\u6570\u636E"},zh_tw:{layer_dataview_header:"\u986F\u793A\u6578\u64DA"},pl:{layer_dataview_header:"Widok danych"},fr:{layer_dataview_header:"Voir les donn\xE9es"},ja:{layer_dataview_header:"\u30C7\u30FC\u30BF\u30D3\u30E5\u30FC"},es:{layer_dataview_header:"Ver los datos"},tr:{layer_dataview_header:"Veri gorunumleri"},it:{layer_dataview_header:"Visualizzazione dei dati"},th:{layer_dataview_header:"\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"}});function y(e){let t=Object.entries(e.dataviews).map(l=>{if(typeof l[1]!="object")return;let a=Object.assign(l[1],{key:l[0],host:e.mapview.host,layer:e});if(a.tabview=document.querySelector(`[data-id=${a.target}]`),!!a.tabview&&(a.target=mapp.utils.html.node`<div class="dataview-target">`,a.label??=a.title||a.key,a.show??=()=>{a.tabview.dispatchEvent(new CustomEvent("addTab",{detail:a})),a.show()},a.hide??=()=>{a.display=!1,a.remove()},!(mapp.ui.Dataview(a)instanceof Error)))return e.display&&a.display&&a.show(),e.showCallbacks.push(()=>{a.display&&a.show()}),a.chkbox});return e.dataviews.hide?void 0:mapp.ui.elements.drawer({data_id:"dataviews-drawer",class:"raised",header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_dataview_header}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`${t.filter(l=>!!l)}`})}var ue=e=>{let t=Object.keys(e.reports).map(l=>{let a=e.reports[l];a.key=l,a.host=e.mapview.host;let o=`${a.host}/view?${mapp.utils.paramString({template:a.template,locale:e.mapview.locale.key,lat:mapp.hooks.current?.lat,lng:mapp.hooks.current?.lng,z:mapp.hooks.current?.z})}`;return mapp.utils.html`
      <a
        class="link-with-img"
        target="_blank"
        href="${o}">
        <div class="mask-icon event-note"></div>
        <span>${a.title||a.key}`});return mapp.ui.elements.drawer({data_id:"reports-drawer",class:"raised",header:mapp.utils.html`
      <h3>Reports</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`${t}`})};mapp.utils.merge(mapp.dictionaries,{en:{layer_style_header:"Style",layer_style_select_theme:"Select thematic style",layer_style_display_labels:"Display labels",layer_style_display_hover:"Enable hover",layer_style_switch_caption:"Click on labels to switch visibility or",layer_style_switch_all:"switch all",layer_grid_legend_ratio:"Display colour as a ratio to the size",layer_style_cluster:"Multiple locations"},de:{layer_style_header:"Stil",layer_style_select_theme:"Auswahl eines thematischen Stiles",layer_style_display_labels:"Umschalten der Label Ansicht",layer_style_display_hover:"Hover Einschalten",layer_style_switch_caption:"Auswahl der Label schaltet Ansicht um oder",layer_style_switch_all:"Alle ausw\xE4hlen",layer_grid_legend_ratio:"Farbe im Verh\xE4ltnis zur Gr\xF6\xDFe",layer_style_cluster:"Mehrere Lagen"},zh:{layer_style_header:"\u98CE\u683C",layer_style_select_theme:"\u9009\u62E9\u4E3B\u9898\u98CE\u683C",layer_style_display_labels:"\u663E\u793A\u6807\u7B7E",layer_style_display_hover:"\u542F\u7528\u60AC\u505C",layer_style_switch_caption:"\u5355\u51FB\u6807\u7B7E\u5207\u6362\u53EF\u89C1\u6027",layer_style_switch_all:"\u5168\u90E8\u5207\u6362\uFF08\u5F00\u5173\uFF09",layer_grid_legend_ratio:"\u989C\u8272\u968F\u56FE\u70B9\u5927\u5C0F\u5448\u6BD4\u4F8B\u53D8\u5316",layer_style_cluster:"\u591A\u4E2A\u5730\u70B9"},zh_tw:{layer_style_header:"\u98A8\u683C",layer_style_select_theme:"\u9078\u64C7\u4E3B\u984C\u98A8\u683C",layer_style_display_labels:"\u986F\u793A\u6A19\u7C64",layer_style_display_hover:"\u555F\u7528\u61F8\u505C",layer_style_switch_caption:"\u6309\u4E00\u4E0B\u6A19\u7C64\u5207\u63DB\u53EF\u898B\u6027",layer_style_switch_all:"\u5168\u90E8\u5207\u63DB\uFF08\u958B\u95DC\uFF09",layer_grid_legend_ratio:"\u984F\u8272\u96A8\u5716\u9EDE\u5927\u5C0F\u5448\u6BD4\u4F8B\u8B8A\u5316",layer_style_cluster:"\u591A\u500B\u5730\u9EDE"},pl:{layer_style_header:"Styl",layer_style_select_theme:"Wybierz styl tematyczny",layer_style_display_labels:"Wy\u015Bwietl etykiety",layer_style_display_hover:"Wy\u015Bwietl etykiety pod kursorem",layer_style_switch_caption:"Kliknij na etykiet\u0119 aby w\u0142\u0105czy\u0107 widzialno\u015B\u0107 lub",layer_style_switch_all:"w\u0142\u0105cz wszystkie",layer_grid_legend_ratio:"Wy\u015Bwietlaj kolory jako stosunek do wielko\u015Bci",layer_style_cluster:"Lokalizacje wielkokrotne"},fr:{layer_style_header:"Style",layer_style_select_theme:"S\xE9lectionner le style de th\xE9matique",layer_style_display_labels:"Afficher les \xE9tiquettes",layer_style_display_hover:"Afficher via le curseur",layer_style_switch_caption:"Cliquez sur les \xE9tiquettes pour changer de visibilit\xE9 ou",layer_style_switch_all:"changer pour tous",layer_grid_legend_ratio:"Afficher la couleur en fonction de la taille",layer_style_cluster:"Emplacements multiples"},ja:{layer_style_header:"\u30B9\u30BF\u30A4\u30EB",layer_style_select_theme:"\u30C6\u30FC\u30DE\u30B9\u30BF\u30A4\u30EB\u3092\u9078\u629E",layer_style_display_labels:"\u30E9\u30D9\u30EB\u3092\u8868\u793A",layer_style_display_hover:"\u30DB\u30D0\u30EA\u30F3\u30B0\u3092\u3092\u6709\u52B9\u306B\u3059\u308B",layer_style_switch_caption:"\u8868\u793A\u5207\u66FF\u3048\u306B\u306F\u5404\u30E9\u30D9\u30EB\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u304B",layer_style_switch_all:"\u5168\u3066\u3092\u5909\u66F4",layer_grid_legend_ratio:"\u30B5\u30A4\u30BA\u306B\u5BFE\u3059\u308B\u8272\u3092\u6BD4\u7387\u3067\u8868\u793A\u3057\u307E\u3059",layer_style_cluster:"\u591A\u6570\u306E\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3"},es:{layer_style_header:"Estilo",layer_style_select_theme:"Seleccionar estilo tem\xE1tico",layer_style_display_labels:"Mostrar etiquetas",layer_style_display_hover:"Ver a trav\xE9s del curso",layer_style_switch_caption:"Clic en las etiquetas para cambiar la visibilidad o",layer_style_switch_all:"Cambiar todo",layer_grid_legend_ratio:"Mostrar el color como una relaci\xF3n con el tama\xF1o",layer_style_cluster:"M\xFAltiples localizaciones"},tr:{layer_style_header:"Stil",layer_style_select_theme:"Tematik stil sec",layer_style_display_labels:"Etiketleri goster",layer_style_display_hover:"Imlec uzerindeyken goster",layer_style_switch_caption:"Gorunurlugu degistirmek icin etikete tiklayiniz veya",layer_style_switch_all:"Hepsini degistir",layer_grid_legend_ratio:"Rengi boyuta orantili goster",layer_style_cluster:"Coklu konum"},it:{layer_style_header:"Stile",layer_style_select_theme:"Seleziona lo stile tematico",layer_style_display_labels:"Mostrare etichette",layer_style_display_hover:"Mostra tramite il cursore",layer_style_switch_caption:"Clicca sull etichetta per cambiare viibilit\xE0 o",layer_style_switch_all:"Cambiare tutto",layer_grid_legend_ratio:"Visualizza il colore proporzionale alla dimensione",layer_style_cluster:"Localit\xE0 multiple"},th:{layer_style_header:"\u0E2A\u0E44\u0E15\u0E25\u0E4C",layer_style_select_theme:"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E44\u0E15\u0E25\u0E4C\u0E43\u0E08\u0E04\u0E27\u0E32\u0E21",layer_style_display_labels:"\u0E41\u0E2A\u0E14\u0E07\u0E09\u0E25\u0E32\u0E01",layer_style_display_hover:"\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E42\u0E2E\u0E40\u0E27\u0E2D\u0E23\u0E4C",layer_style_switch_caption:"\u0E04\u0E25\u0E34\u0E01\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E32\u0E22\u0E01\u0E33\u0E01\u0E31\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E25\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19\u0E2B\u0E23\u0E37\u0E2D",layer_style_switch_all:"\u0E2A\u0E25\u0E31\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",layer_grid_legend_ratio:"\u0E41\u0E2A\u0E14\u0E07\u0E2A\u0E35\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E48\u0E2D\u0E02\u0E19\u0E32\u0E14",layer_style_cluster:"\u0E2B\u0E25\u0E32\u0E22\u0E41\u0E2B\u0E48\u0E07"}});function x(e){if(e.style.hidden)return;let t=[];if(e.style.theme?.setLabel&&e.style.labels&&(e.style.label=e.style.labels[e.style.theme.setLabel]),e.style.theme?.setHover&&e.style.hovers&&(e.style.hover=e.style.hovers[e.style.theme.setHover]),e.style.opacitySlider&&t.push(mapp.ui.elements.slider({label:"Change layer opacity:",min:0,max:100,val:parseInt(e.L.getOpacity()*100),callback:l=>{e.L.setOpacity(parseFloat(l.target.value/100))}})),e.style.scaleSlider&&t.push(mapp.ui.elements.slider({label:"Change icon scale:",min:e.style.scaleSlider.min,max:e.style.scaleSlider.max,step:e.style.scaleSlider.step,val:e.style.default.icon.scale,callback:l=>{e.style.default.icon.scale=l.target.value,e.L.changed()}})),e.style.hover&&!e.style.hover.hidden&&(e.style.hoverCheckbox=mapp.ui.elements.chkbox({data_id:"hoverCheckbox",label:e.style.hovers&&mapp.dictionary.layer_style_display_hover||e.style.hover.title||mapp.dictionary.layer_style_display_hover,checked:!!e.style.hover.display,onchange:l=>{e.style.hover.display=l}}),t.push(e.style.hoverCheckbox),Object.keys(e.style.hovers||0).length>1&&t.push(mapp.ui.elements.dropdown({placeholder:e.style.hover.title,entries:Object.keys(e.style.hovers).filter(l=>!e.style.hovers[l].hidden).map(l=>({title:e.style.hovers[l].title||l,option:l})),callback:(l,a)=>{let o=e.style.hover.display;e.style.hover=e.style.hovers[a.option],e.style.hover.method??=mapp.layer.featureHover,e.style.hover.display=o}}))),e.style.label&&!e.style.label.hidden&&(e.style.labelCheckbox=mapp.ui.elements.chkbox({data_id:"labelCheckbox",label:e.style.labels&&mapp.dictionary.layer_style_display_labels||e.style.label.title||mapp.dictionary.layer_style_display_labels,checked:!!e.style.label.display,onchange:l=>{e.style.label.display=l,e.reload()}}),t.push(e.style.labelCheckbox),Object.keys(e.style.labels||0).length>1&&t.push(mapp.ui.elements.dropdown({placeholder:e.style.label.title,entries:Object.keys(e.style.labels).filter(l=>!e.style.labels[l].hidden).map(l=>({title:e.style.labels[l].title||l,option:l})),callback:(l,a)=>{let o=e.style.label.display;e.style.label=e.style.labels[a.option],e.style.label.display=o,e.reload()}}))),e.style.label&&e.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{let l=e.mapview.Map.getView().getZoom();l<=e.style.label.minZoom||l>=e.style.label.maxZoom?e.style.labelCheckbox?.classList.add("disabled"):e.style.labelCheckbox?.classList.remove("disabled")}),Object.keys(e.style.themes||0).length>1?t.push(mapp.utils.html`
      <div>${mapp.dictionary.layer_style_select_theme}</div>
        ${mapp.ui.elements.dropdown({placeholder:e.style.theme.title,entries:Object.keys(e.style.themes).map(l=>({title:e.style.themes[l].title||l,option:l})),callback:(l,a)=>{e.style.theme=e.style.themes[a.option],e.style.theme.setLabel&&e.style.labels&&(e.style.label=e.style.labels[e.style.theme.setLabel]),e.style.theme.setHover&&e.style.hovers&&(e.style.hover=e.style.hovers[e.style.theme.setHover],e.style.hover.method??=mapp.layer.featureHover);let o=mapp.ui.layers.panels.style(e);e.view.querySelector("[data-id=style-drawer]").replaceChildren(...o.children),e.reload()}})}`):e.style.theme?.title&&t.push(mapp.utils.html`
      <h3>${e.style.theme.title}`),e.style.theme?.meta&&t.push(mapp.utils.html`<p>${e.style.theme.meta}`),Object.hasOwn(mapp.ui.layers.legends,e.style.theme?.type)&&(mapp.ui.layers.legends[e.style.theme?.type](e),e.style.legend&&t.push(e.style.legend)),!t.length)return;let i=mapp.utils.html`
    <h3>${mapp.dictionary.layer_style_header}</h3>
    <div class="mask-icon expander">`;return e.style.drawer=mapp.ui.elements.drawer({data_id:"style-drawer",class:`raised ${e.style.classList||""}`,header:i,content:t}),e.style.drawer}function v(e){let t=e.style.theme;t.legend??={},t.legend.grid=[],t.legend.alignContents??="left",t.legend.alignContents+=" contents";let i;if(t.legend.switch=t.field&&e.filter&&mapp.utils.html`
    <div
      class="switch-all"
      style="grid-column: 1/3;">
      ${mapp.dictionary.layer_style_switch_caption}
      <button
        class="primary-colour bold"
        onclick=${l=>{let a=[...l.target.closest(".legend").querySelectorAll(".switch")],o=a.filter(s=>s.classList.contains("disabled"));o.length==0||o.length==a.length?a.forEach(s=>s.click()):o.forEach(s=>s.click())}}>${mapp.dictionary.layer_style_switch_all}
      </button>.`,t.categories.forEach(l=>{let a=l.field||t.field;if(l.disabled=e.filter?.current[a]?.ni?.indexOf(l.value)>=0,e.featureFields&&t.distribution==="count"&&(l.count=e.featureFields[a]?.[l.value],!l.disabled&&!l.count))return;let o=mapp.ui.elements.legendIcon({width:24,height:24,...l.style}),s=mapp.utils.html`
      <div
        style="height: 24px; width: 24px; grid-column: 1;">
        ${o}`,n=`label ${e.filter&&"switch"||""} ${l.disabled&&"disabled"||""}`,r=l.label+(l.count?` [${l.count}]`:""),d=mapp.utils.html`
      <div
        class=${n}
        style="grid-column: 2;"
        onclick=${c=>{if(!e.filter)return;let m=e.filter.list?.find(_=>_.type==="ni"&&_.field===a);c.target.classList.toggle("disabled"),c.target.classList.contains("disabled")?(e.filter.current[a]||(e.filter.current[a]={}),e.filter.current[a].ni||(e.filter.current[a].ni=[]),e.filter.current[a].ni.push(l.keys||l.value),e.filter.current[a].ni=e.filter.current[a].ni.flat()):(Array.isArray(l.keys)?l.keys.forEach(_=>{e.filter.current[a].ni.splice(e.filter.current[a].ni.indexOf(_),1)}):e.filter.current[a].ni.splice(e.filter.current[a].ni.indexOf(l.value),1),e.filter.current[a].ni.length||(delete e.filter.current[a].ni,Object.keys(e.filter.current[a]).length||delete e.filter.current[a])),i&&clearTimeout(i),i=setTimeout(async()=>{m?.card&&m.card.querySelector(".filter").replaceWith(await mapp.ui.layers.filters[m.type](e,m)),e.style.filter||t.filter?e.L.changed():e.reload()},400)}}>${r}`;l.node=mapp.utils.html.node`<div 
      data-id=${l.value}
      class="${t.legend.alignContents}">
      ${s}${d}`,t.legend.grid.push(l.node)}),e.style.cluster){let l=mapp.utils.html`
      <div
        style="height: 40px; width: 40px;">
        ${mapp.ui.elements.legendIcon({width:40,height:40,icon:e.style.cluster.icon})}`,a=mapp.utils.html`
      <div
        class="label">
        ${mapp.dictionary.layer_style_cluster}`;t.legend.grid.push(mapp.utils.html`<div 
      data-id="cluster"
      class=${t.legend.alignContents}>
      ${l}${a}`)}return t.legend.layout??="grid",t.legend.node=mapp.utils.html.node`
    <div class="legend">
      ${t.legend.switch||""}
      <div class=${`contents-wrapper ${t.legend.layout}`}>
        ${t.legend.grid}`,e.style.legend??=t.legend.node,e.style.legend&&e.style.legend.replaceChildren(...t.legend.node.children),t.legend.node}function w(e){let t=e.style.theme;t.legend??={};let i=t.categories.filter(a=>a.value!==void 0).map(a=>{let o=`contents ${t.legend?.horizontal?"horizontal":""}`,s=mapp.ui.elements.legendIcon({width:24,height:24,...a.style});return a.label??=a.value,mapp.utils.html`<div 
        data-id=${a.value}
        class=${o}>
        <div style="height: 24px; width: 24px; grid-column: 1;">
          ${s}
        </div>
        <div class="label" style="grid-column: 2;">
          ${a.label}
        </div>`}),l=`contents-wrapper ${t.legend?.layout||"grid"} ${t.legend?.nowrap?"nowrap":""}`;return t.legend.node=mapp.utils.html.node`
    <div class="legend">
      <div class=${l}>
        ${i}
      </div>`,e.style.legend??=t.legend.node,e.style.legend&&e.style.legend.replaceChildren(...t.legend.node.children),t.legend.node}function b(e){let t=e.style.theme;t.legend??={},t.legend.grid=[],t.legend.alignContents??="left",t.legend.alignContents+=" contents",e.style.theme.style??={},e.style.theme.style.width??=24,e.style.theme.style.height??=24;let i=mapp.ui.elements.legendIcon(e.style.theme.style),l=mapp.utils.html`<div>${i}`;return t.legend.grid.push(mapp.utils.html`
    <div 
      class="contents">
      ${l}<div class="label" style="grid-column: 2";>${e.style.theme.label}`),t.legend.node=mapp.utils.html.node`
    <div class="legend">
    <div class="contents-wrapper grid">${t.legend.grid}`,e.style.legend&&e.style.legend.replaceChildren(...t.legend.node.children),t.legend.node}var me={view:ee,listview:te,filters:ne,panels:{meta:re,draw:de,style:x,filter:ce,gazetteer:pe,reports:ue,dataviews:y},legends:{categorized:v,graduated:w,basic:b},styles:{categorized:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),v(e)),graduated:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),w(e)),grid:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),grid(e)),basic:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),b(e))}};mapp.utils.merge(mapp.dictionaries,{en:{location_zoom:"Zoom map to feature bounds",location_save:"Save changes to cloud",location_remove:"Remove feature from selection",location_delete:"Delete location",location_save_changes:"Save your changes to this location?",location_close_without_save:"Close location without saving changes?"},de:{location_zoom:"Ansicht den Lagen Geometrien anpassen",location_save:"Speichern der Daten\xE4nderungen",location_remove:"Lagen Auswahl aufheben",location_delete:"L\xF6schen der Lage",location_save_changes:"Ihre \xC4nderungen an dieser Lage speichern?"},zh:{location_zoom:"\u5730\u56FE\u7F29\u653E\u81F3\u8981\u7D20\u8FB9\u754C",location_save:"\u4FDD\u5B58\u66F4\u6539\u5E76\u4E0A\u4F20\u81F3\u4E91\u7AEF",location_remove:"\u5220\u9664\u5DF2\u9009\u8981\u7D20",location_delete:"\u5220\u9664\u4F4D\u7F6E\u70B9",location_save_changes:"\u4FDD\u5B58\u5BF9\u6B64\u4F4D\u7F6E\u7684\u66F4\u6539\u5417\uFF1F"},zh_tw:{location_zoom:"\u5730\u5716\u7E2E\u653E\u81F3\u8981\u7D20\u908A\u754C",location_save:"\u4FDD\u5B58\u66F4\u6539\u4E26\u4E0A\u50B3\u81F3\u96F2\u7AEF",location_remove:"\u522A\u9664\u5DF2\u9078\u8981\u7D20",location_delete:"\u522A\u9664\u4F4D\u7F6E\u9EDE",location_save_changes:"\u4FDD\u5B58\u5C0D\u6B64\u4F4D\u7F6E\u7684\u66F4\u6539\u55CE\uFF1F"},pl:{location_zoom:"Przybli\u017C do granic warstwy",location_save:"Zapisz zmiany w chmurze",location_remove:"Usu\u0144 funkcj\u0119 z wyboru",location_delete:"Usu\u0144 lokalizacj\u0119",location_save_changes:"Czy zapisac zmiany dla tej lokalizacji"},fr:{location_zoom:"Zoomer sur les contours",location_save:"Enregistrer les modifications",location_remove:"Supprimer depuis la s\xE9lection",location_delete:"Supprimer l'emplacement",location_save_changes:"Sauvegarder les modifications pour ce site ?"},ja:{location_zoom:"\u30D5\u30A3\u30FC\u30C1\u30E3\u7BC4\u56F2\u306B\u306F\u30DE\u30C3\u30D7\u3092\u30BA\u30FC\u30E0",location_save:"\u30AF\u30E9\u30A6\u30C9\u306B\u5909\u66F4\u3092\u4FDD\u5B58",location_remove:"\u9078\u629E\u304B\u3089\u30D5\u30A3\u30FC\u30C1\u30E3\u30FC\u3092\u524A\u9664",location_delete:"\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u524A\u9664",location_save_changes:"\u3053\u306E\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u5909\u66F4\u3092\u4FDD\u5B58"},es:{location_zoom:"Ampliar los contornos del objeto.",location_save:"Registrar modificaciones",location_remove:"Eliminar de la selecci\xF3n",location_delete:"Eliminar ubicaci\xF3n",location_save_changes:"\xBFGuardar los cambios en esta ubicaci\xF3n?"},tr:{location_zoom:"Haritada sekil sinirlarina yaklas",location_save:"Degisiklikleri buluta kaydet",location_remove:"Sekli secilenlerden cikar",location_delete:"Konumu sil",location_save_changes:"Konum degisikliklerini kaydetmek ister misiniz?"},it:{location_zoom:"Zoom sull'elemento",location_save:"Salva le modifiche",location_remove:"Rimuovere elemento dalla selezione",location_delete:"Elimina localit\xE0",location_save_changes:"Vuoi salvare le modifiche in questa localit\xE0?"},th:{location_zoom:"\u0E0B\u0E39\u0E21\u0E44\u0E1B\u0E17\u0E35\u0E48\u0E02\u0E2D\u0E1A\u0E40\u0E02\u0E15\u0E40\u0E25\u0E40\u0E22\u0E2D\u0E23\u0E4C",location_save:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E25\u0E32\u0E27\u0E14\u0E4C",location_remove:" \u0E25\u0E1A\u0E04\u0E38\u0E13\u0E2A\u0E21\u0E1A\u0E31\u0E15\u0E34\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E40\u0E25\u0E37\u0E2D\u0E01",location_delete:"\u0E25\u0E1A\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07",location_save_changes:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E19\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E19\u0E35\u0E49\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48"}});function L(e){e.removeCallbacks?.push(function(){e.view.remove()});let t=[mapp.utils.html`<h2>${e.record.symbol}`,mapp.utils.html`<div class="mask-icon expander">`];e.infoj.filter(i=>new Set(["pin","geometry"]).has(i.type)).some(i=>!!i.value)&&t.push(mapp.utils.html`<button
      title = ${mapp.dictionary.location_zoom}
      class = "mask-icon search"
      onclick = ${()=>e.flyTo()}>`),Je(e)&&t.push(e.editToggle),t.push(mapp.utils.html`<button
    title = ${mapp.dictionary.location_save}
    class = "btn-save mask-icon done"
    style = "display: none;"
    onclick = ${()=>{e.view.classList.add("disabled"),e.update()}}>`),e.updateCallbacks?.push(function(){e.view.dispatchEvent(new Event("updateInfo"))}),(e.layer?.edit?.delete||e.layer?.deleteLocation)&&t.push(mapp.utils.html`<button
      title = ${mapp.dictionary.location_delete}
      class = "mask-icon trash"
      onclick = ${()=>e.trash()}>`),t.push(mapp.utils.html`<button
    title = ${mapp.dictionary.location_remove}
    class = "mask-icon close no"
    onclick = ${()=>{e.infoj.some(i=>typeof i.newValue<"u")&&!confirm(`${mapp.dictionary.location_close_without_save}`)||e.remove()}}>`),e.view=mapp.ui.elements.drawer({class:"location-view raised expanded",header:t}),e.viewEntries=e.view.appendChild(mapp.ui.locations.infoj(e)),e.view.querySelector(".header").style.borderBottom=`3px solid ${e.record.colour}`,e.view.addEventListener("valChange",Ke),e.renderLocationView=Ye,e.view.addEventListener("render",()=>e.renderLocationView()),e.view.addEventListener("updateInfo",()=>{e.view.querySelector(".btn-save").style.display="none",e.editToggle&&(e.editToggle.classList.remove("on"),e.removeEdits()),e.layer?.dataviews&&Object.values(e.layer.dataviews).forEach(i=>{i.display===!0&&i.update()}),e.renderLocationView()})}function Je(e){if(!e.layer?.toggleLocationViewEdits||!e.infoj.some(i=>i.edit))return!1;!e.new&&e.removeEdits(),e.editToggle=mapp.utils.html.node`<button
    title="Enable edits"
    class=${`mask-icon edit ${e.new&&"on"||""}`}
    onclick=${t}>`;async function t(i){if(e.infoj.some(l=>typeof l.newValue<"u")&&confirm(mapp.dictionary.location_save_changes)){if(await e.update()instanceof Error)return}else i.target.classList.toggle("on")?e.restoreEdits():(e.removeEdits(),e.view.querySelector(".btn-save").style.display="none");e.renderLocationView()}return!0}function Ke(e){let t=e.detail,i=t.location;if(t.valChangeMethod instanceof Function){t.valChangeMethod(t);return}if(t.value!=t.newValue?t.node.classList.add("val-changed"):(delete t.newValue,t.node.classList.remove("val-changed")),i.infoj.some(l=>l.invalid)){i.view.querySelector(".btn-save").style.display="none";return}i.view.querySelector(".btn-save").style.display=i.infoj.some(l=>typeof l.newValue<"u")?"inline-block":"none"}function Ye(){let e=this;e.viewEntries.remove(),e.view.classList.remove("disabled"),e.viewEntries=e.view.appendChild(mapp.ui.locations.infoj(e))}mapp.utils.merge(mapp.dictionaries,{en:{location_clear_all:"Clear locations",location_listview_full:"The listview for locations is full."},de:{location_clear_all:"Entferne Auswahl",location_listview_full:"Lagenliste ist voll."},zh:{location_clear_all:"\u6E05\u9664\u4F4D\u7F6E\u70B9",location_listview_full:"\u4F4D\u7F6E\u5217\u8868\u89C6\u56FE\u5DF2\u6EE1"},zh_tw:{location_clear_all:"\u6E05\u9664\u4F4D\u7F6E\u9EDE",location_listview_full:"\u4F4D\u7F6E\u5217\u8868\u8996\u5716\u5DF2\u6EFF"},pl:{location_clear_all:"Usu\u0144 lokalizacje",location_listview_full:"Lista dla lokalizacji jest pe\u0142na"},fr:{location_clear_all:"Effacer les emplacements",location_listview_full:"La liste des emplacements est pleine."},ja:{location_clear_all:"\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u30AF\u30EA\u30A2",location_listview_full:"\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u30EA\u30B9\u30C8\u30D3\u30E5\u30FC\u304C\u3044\u3063\u3071\u3044\u3067\u3059"},es:{location_clear_all:"Borrar localizaciones",location_listview_full:"La vista de lista de ubicaciones est\xE1 llena."},tr:{location_clear_all:"Konumlari temizle",location_listview_full:"Konum listesi dolu"},it:{location_clear_all:"Elimina localit\xE0",location_listview_full:"L elenco delle localit\xE0 \xE8 pieno"},th:{location_clear_all:"\u0E25\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",location_listview_full:"\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E40\u0E15\u0E47\u0E21"}});var he=e=>{e.mapview||console.warn("A mapview is required in the locations listview params argument."),e.target||console.warn("A target element is required in the locations listview params argument.");let t=e.mapview.locale?.listview_records||[{symbol:"A",colour:"#2E6F9E"},{symbol:"B",colour:"#EC602D"},{symbol:"C",colour:"#5B8C5A"},{symbol:"D",colour:"#B84444"},{symbol:"E",colour:"#514E7E"},{symbol:"F",colour:"#E7C547"},{symbol:"G",colour:"#368F8B"},{symbol:"H",colour:"#841C47"},{symbol:"I",colour:"#61A2D1"},{symbol:"J",colour:"#37327F"}],i=e.target.appendChild(mapp.utils.html.node`
    <button 
      style="display: none; width: 100%; text-align: right;"
      class="tab-display bold primary-colour text-shadow"
      onclick=${a=>{Object.values(e.mapview.locations).forEach(o=>o.remove())}}>
      ${mapp.dictionary.location_clear_all}`);e.mapview.locations=new Proxy(e.mapview.locations,{set:function(a,o,s){let n=t.find(r=>!r.hook);return n?(Reflect.set(...arguments),n.hook=s.hook,s.record=n,s.style={strokeColor:n.colour,fillColor:n.colour,fillOpacity:.1},s.Style=mapp.utils.style([{strokeColor:"#000",strokeOpacity:.1,strokeWidth:8},{strokeColor:"#000",strokeOpacity:.1,strokeWidth:6},{strokeColor:"#000",strokeOpacity:.1,strokeWidth:4},{strokeColor:s.style.strokeColor||"#000",strokeWidth:2,fillColor:s.style.fillColor||"#fff",fillOpacity:s.style.fillOpacity||.2}]),s.pinStyle=mapp.utils.style({icon:{type:"markerLetter",letter:n.symbol,color:s.style.strokeColor,scale:3,anchor:[.5,1]}}),mapp.ui.locations.view(s),Object.values(e.target.children).forEach(r=>r.classList.remove("expanded")),e.target.insertBefore(s.view,i.nextSibling),s.view.dispatchEvent(new Event("addLocationView")),i.style.display="block",document.querySelector("[data-id=locations]").click(),document.querySelector("[data-id=locations]").style.display="block",!0):(alert(mapp.dictionary.location_listview_full),!0)},deleteProperty:function(a,o){Reflect.deleteProperty(...arguments);let s=t.find(n=>n.hook===o);return s&&delete s.hook,setTimeout(l,300),!0}});function l(){if(!document.querySelectorAll("#locations > .location-view").length){document.querySelector("[data-id=layers]").click(),i.style.display="none";let a=document.querySelector("#locations input");a?a.value="":document.querySelector("[data-id=locations]").style.display="none"}}};var g;function E(e,t){if(!e.infoj)return;let i=mapp.utils.html.node`<div class="location-view-grid">`;g={},t??=e?.layer?.infoj_order;let l=Array.isArray(t)?t.map(o=>{if(typeof o=="string"){let s=e.infoj.find(n=>(n.key||n.field||n.query)===o);return s||console.warn(`infoj_order field: "${o}" not found in location.infoj. Please add entry.key, entry.field, or entry.query to the entry.`),s}else if(typeof o=="object")return o.location=e,o}).filter(o=>o!==void 0):e.infoj,a=0;for(let o of l){if(o.key??=o.field||a++,e.view?.classList.contains("disabled"))break;if(o.listview=i,o.type??="text",Xe(o),Qe(o),fe(o)||(et(o),tt(o),it(o),lt(o),at(o),ot(o)))continue;if(!Object.hasOwn(mapp.ui.locations.entries,o.type)){console.error(`entry.type:${o.type} method not found.`);continue}let s=mapp.ui.locations.entries[o.type]?.(o);s&&o.node.append(s)}return i}function Xe(e){e.jsonb_field&&e.jsonb_key&&e.value!==null&&typeof e.value=="object"&&e.value.jsonb&&(e.value=e.value.jsonb[e.jsonb_field][e.jsonb_key])}function Qe(e){let t=e.objectAssignFromField||e.objectMergeFromField||e.json_field;if(!t)return;let i=e.location.infoj.find(l=>l.field===t);if(i&&typeof i.value=="object"){if(e.json_field){if(!e.json_key){console.warn("json_field requires entry.json_key to be specified");return}if(!i.value)return;e.value=i.value[e.json_key]}e.objectAssignFromField&&Object.assign(e,i.value),e.objectMergeFromField&&mapp.utils.merge(e,i.value)}}function fe(e){if(e.skipEntry||e.skipFalsyValue&&!e.value&&!e.edit||e.skipUndefinedValue&&typeof e.value>"u"&&!e.edit||e.skipNullValue&&e.value===null&&!e.edit)return!0}function et(e){e.nullValue!==void 0&&(e.edit||(e.value??=e.nullValue))}function tt(e){e.default!==void 0&&e.edit&&(e.newValue=e.default,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e})))}function it(e){e.group&&(g[e.group]||(g[e.group]=e.listview.appendChild(mapp.ui.elements.drawer({class:"group",header:mapp.utils.html`
          <h3>${e.group}</h3>
          <div class="mask-icon expander"></div>`}))),typeof e.groupClassList=="string"&&g[e.group].classList.add(...e.groupClassList.split(" ")),e.listview=g[e.group])}function lt(e){let t=`contents ${e.type} ${e.class||""} ${e.inline&&"inline"||""}`;e.node=e.listview.appendChild(mapp.utils.html.node`
  <div
    data-type=${e.type}
    class=${t}>`)}function at(e){e.title&&e.node.append(mapp.ui.locations.entries.title(e))}function ot(e){if(e.query)if(e.queryparams={...e.queryparams,...e.location.layer?.queryparams,...e.location.layer?.mapview?.locale?.queryparams},e.queryCheck||e.run===!0){let t=mapp.utils.paramString(mapp.utils.queryParams(e));return delete e.run,e.hasRan=!0,e.host??=e.location?.layer?.mapview?.host||mapp.host,mapp.utils.xhr(`${e.host}/api/query?${t}`).then(i=>{if(i?e.value=e.field?i[e.field]:i:e.value=e.nullValue||null,fe(e)){e.node.remove();return}let l=mapp.ui.locations.entries[e.type]?.(e);l&&e.node.appendChild(l)}),!0}else e.field&&!e.hasRan&&console.warn(`field:"${e.field}" has a query:"${e.query}" which is not set to run. To resolve this, add queryCheck:true or run:true to the entry.`)}function C(e){if(e.edit)return mapp.ui.elements.chkbox({label:e.label||e.title,checked:e.newValue!==void 0?e.newValue:e.value,disabled:!e.edit,onchange:i=>{e.newValue=i,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}});let t=`mask-icon ${e.value?"done":"close"}`;return mapp.utils.html.node`
    <div class="link-with-img">
      <div class=${t}></div>
      <span>`}var st={image:rt,images:dt,documents:ct},nt={image:_e,images:_e,documents:pt};mapp.utils.merge(mapp.dictionaries,{en:{image_upload_failed:"Image upload failed.",document_upload_failed:"Document upload failed."},de:{image_upload_failed:"Hochladen des Bildes gescheitert.",document_upload_failed:"Hochladen des Dokumentes gescheitert."},zh:{image_upload_failed:"\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\u3002",document_upload_failed:"\u6587\u6863\u4E0A\u4F20\u5931\u8D25\u3002"},zh_tw:{image_upload_failed:"\u5716\u7247\u4E0A\u50B3\u5931\u6557\u3002",document_upload_failed:"\u6587\u6A94\u4E0A\u50B3\u5931\u6557\u3002"},pl:{image_upload_failed:"Za\u0142adowanie obrazu nie powiod\u0142o si\u0119",document_upload_failed:"Za\u0142adowanie dokumentu nie powiod\u0142o si\u0119"},fr:{image_upload_failed:"Echec du chargement de l'image.",document_upload_failed:"Echec du chargement du document."},ja:{image_upload_failed:"\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F",document_upload_failed:"\u66F8\u985E\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F"},es:{image_upload_failed:"Error al cargar la imagen.",document_upload_failed:"Error al cargar el documento."},tr:{image_upload_failed:"Gorsel yukleme basarisiz",document_upload_failed:"Belge yukleme basarisiz"},it:{image_upload_failed:"Errore nel caricare l'immagine",document_upload_failed:"Errore nel caricare il documento"},th:{image_upload_failed:"\u0E01\u0E32\u0E23\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E25\u0E49\u0E21\u0E40\u0E2B\u0E25\u0E27",document_upload_failed:"\u0E01\u0E32\u0E23\u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E25\u0E49\u0E21\u0E40\u0E2B\u0E25\u0E27"}});var $=e=>st[e.type](e);function rt(e){if(e.value){let t=mapp.utils.html`
      <button 
        style="position: absolute; width: 2em; height: 2em; right: 0.5em; top: 0.5em;"
        class="mask-icon trash no"
        data-name=${e.value.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}
        data-src=${e.value}
        onclick=${i=>S(i,e)}>`;return mapp.utils.html.node`
      <div style="position: relative;">
        <img
          style="width: 100%"
          src=${e.value}
          onclick=${mapp.ui.utils.imagePreview}>
          ${e.edit&&t}`}if(e.edit)return mapp.utils.html.node`
      <input
        type="file"
        accept="image/*;capture=camera"
        onchange=${t=>z(t,e)}>`}function dt(e){let t=e.value?.map(i=>{let l=mapp.utils.html`
      <button
        class="mask-icon trash no"
        data-name=${i.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}
        data-src=${i}
        onclick=${a=>S(a,e)}>`;return mapp.utils.html`
      <div>
        <img 
          src=${i}
          onclick=${mapp.ui.utils.imagePreview}>
          ${e.edit&&l}`})||[];if(e.edit&&t.push(mapp.utils.html.node`
    <div class="mask-icon add-photo pos-center">
      <input
        type="file"
        accept="image/*;capture=camera"
        onchange=${i=>z(i,e)}>`),!!t.length)return e.list=mapp.utils.html.node`<div class="images-grid">${t}`,e.list}function ct(e){let t=e.value?.map(i=>{let l=mapp.utils.html`
      <button
        class="mask-icon trash no"
        data-name=${i.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}
        data-href=${i}
        onclick=${a=>S(a,e)}>`;return mapp.utils.html`
      <div class="link-with-img">
        ${e.edit&&l}
          <a
            target="_blank"
            href=${i}>${i.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}`})||[];if(e.uploadBtn=mapp.utils.html.node`
    <div class="mask-icon cloud-upload">
      <input
        style="opacity: 0; width: 3em; height: 3em;"
        type="file"
        accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document;"
        onchange=${i=>z(i,e)}>`,e.edit&&t.push(e.uploadBtn),!!t.length)return e.list=mapp.utils.html.node`<div>${t}`,e.list}async function z(e,t){t.location.view?.classList.add("disabled");let i=new FileReader;e.target.files[0]&&(t.file=e.target.files[0],i.onload=l=>nt[t.type](l,t),i.readAsDataURL(t.file))}function _e(e,t){let i=new Image;i.onload=async()=>{let l=mapp.utils.html.node`<canvas>`,a=1024,o=i.width,s=i.height;o>s&&o>a?(s*=a/o,o=a):s>a&&(o*=a/s,s=a),l.width=o,l.height=s,l.getContext("2d").drawImage(i,0,0,o,s);let n=l.toDataURL("image/jpeg",.5),r=t.file.name.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")+t.suffix_date?`@${Date.now()}`:"",d=await mapp.utils.xhr({method:"POST",requestHeader:{"Content-Type":"application/octet-stream"},url:`${t.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({public_id:r,resource_type:"image",folder:t.cloudinary_folder})}`,body:mapp.utils.dataURLtoBlob(n)});if(!d||d.error){let c=d?.error?.message?` Error: ${d.error.message}`:"",m=`${mapp.dictionary.image_upload_failed}${c}`;alert(m);return}t.type==="image"?t.value=d.secure_url:t.value=Array.isArray(t.value)?t.value.concat([d.secure_url]):[d.secure_url],j(t)},i.src=e.target.result}async function pt(e,t){let i=await mapp.utils.xhr({method:"POST",requestHeader:{"Content-Type":"application/octet-stream"},url:`${t.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({public_id:t.file.name,resource_type:"raw",folder:t.cloudinary_folder})}`,body:e.target.result});if(!i||i.error){let l=i?.error?.message?` Error: ${i.error.message}`:"",a=`${mapp.dictionary.document_upload_failed}${l}`;alert(a);return}t.value=Array.isArray(t.value)?t.value.concat([i.secure_url]):[i.secure_url],j(t)}async function S(e,t){if(!confirm("Remove item?"))return;await mapp.utils.xhr(`${t.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({destroy:!0,public_id:e.target.dataset.name,folder:t.cloudinary_folder})}`);let i=new Set(t.value);i.delete(e.target.dataset.src||e.target.dataset.href),t.type==="image"?t.value=null:t.value=i.size?Array.from(i):null,j(t)}async function j(e){e.location.view?.classList.add("disabled"),await mapp.utils.xhr({method:"POST",url:`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"location_update",locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,id:e.location.id}),body:JSON.stringify({[e.field]:e.value})});let t=mapp.ui.locations.entries[e.type](e);mapp.utils.render(e.node,t),e.title&&t.before(mapp.ui.locations.entries.title(e)),e.location.view?.classList.remove("disabled")}function T(e){if(e.data??=e.value,e.data===null?(delete e.display,e.disabled=!0):delete e.disabled,e.layer??=e.location.layer,e.host??=e.layer.mapview.host,typeof e.target=="string"&&document.getElementById(e.target)){if(e.target=document.getElementById(e.target),mapp.ui.Dataview(e)instanceof Error)return;e.update();return}if(e.dependents&&console.warn(`The dataview type entry key:${e.key} may be dependent on other entries but has no dependents.`),e.update)return e.display&&e.show?.(),mapp.utils.html.node`
      ${e.chkbox||""}
      ${e.locationViewTarget||""}`;if(e.tabview??=typeof e.target=="string"&&document.querySelector(`[data-id=${e.target}]`),e.tabview?(e.tab_style??=`border-bottom: 3px solid ${e.location.style?.strokeColor||"var(--color-primary)"}`,e.target=mapp.utils.html.node`
      <div class="dataview-target">`,e.tabview.dispatchEvent(new CustomEvent("addTab",{detail:e}))):(e.locationViewTarget=mapp.utils.html.node`
      <div class="${`location ${e.class}`}">`,e.target=e.locationViewTarget),!(mapp.ui.Dataview(e)instanceof Error))return e.display&&e.show?.(),mapp.utils.html.node`
    ${e.chkbox||""}
    ${e.locationViewTarget||""}`}var ge=e=>new Date((e.newValue||e.value)*1e3).toLocaleDateString(e.locale,e.options),ve=e=>new Date((e.newValue||e.value)*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),ut={datetime:e=>`${new Date((e.newValue||e.value)*1e3).toLocaleDateString("fr-CA")}T${ve(e)}`,date:e=>`${new Date((e.newValue||e.value)*1e3).toLocaleDateString("fr-CA")}`},q=e=>{if(e.edit)return!e.value&&!e.newValue&&(e.newValue=parseInt(new Date().getTime()/1e3),e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))),mapp.utils.html.node`
      <input
        type=${e.type==="datetime"?"datetime-local":"date"}
        value="${ut[e.type](e)}"
        onchange=${l=>{e.newValue=new Date(l.target.value).getTime()/1e3,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`;let t=e.value&&(e.type==="datetime"?`${ge(e)} ${ve(e)}`:ge(e))||"null";return mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${t}`};function O(){console.warn("The type:defaults entry method has been deprecated.")}mapp.utils.merge(mapp.dictionaries,{en:{delete_geometry:"Delete Geometry",modify_geometry:"Modify Geometry"},de:{delete_geometry:"Geometrie entfernen",modify_geometry:"Geometrie bearbeiten"},zh:{delete_geometry:"\u5220\u9664\u56FE\u5F62"},zh_tw:{delete_geometry:"\u522A\u9664\u5716\u5F62"},pl:{delete_geometry:"Usu\u0144 geometri\u0119"},fr:{delete_geometry:"Effacer la G\xE9om\xE9trie"},ja:{delete_geometry:"\u30B8\u30AA\u30E1\u30C8\u30EA\u30FC\u3092\u524A\u9664"},es:{delete_geometry:"Eliminar geometr\xEDa"},tr:{delete_geometry:"Geometriyi sil"},it:{delete_geometry:"Elima geometria"},th:{delete_geometry:"\u0E25\u0E1A\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07\u0E40\u0E23\u0E02\u0E32\u0E04\u0E13\u0E34\u0E15"}});function I(e){if(e.format??="GeoJSON",e.mapview??=e.location?.layer?.mapview,e.value=typeof e.value=="string"?JSON.parse(e.value):e.value,e.srid??=e.location?.layer?.srid,e.zIndex??=e.location?.layer?.zIndex||99,e.edit?.draw&&(e.draw=e.edit.draw),e._edit?.draw&&delete e.draw,!e.value&&!e.draw&&!e.api)return;e.style&&Object.keys(e.style).length&&(e.style={...e.location?.style,...e.style}),e.Style??=mapp.utils.style(e.style),e.show??=mt,e.modify??=ft,e.label??="Geometry",e.display&&e.show(),e.chkbox=mapp.ui.elements.chkbox({label:e.label,data_id:`chkbox-${e.key}`,checked:!!e.display,disabled:e.disabled||!e.value&&!e.api,onchange:i=>{if(i)return e.show();e.display=!1,e.L&&e.location.layer.mapview.Map.removeLayer(e.L)}}),e.elements=e.api_elements||[],_t(e),ht(e);let t=e.style&&mapp.utils.html`
    ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},e.style))}`;return mapp.utils.html.node`
    <div class="flex-spacer">${e.chkbox}${t}</div>
    ${e.elements}`}async function mt(){this.display=!0;let e=this.location.view?.querySelector(`[data-id=chkbox-${this.key}] input`);e&&(e.checked=!0),!this.value&&this.api&&(this.blocking&&this.location.view?.classList.add("disabled"),await this.api(this)),this.L&&(this.location.layer.mapview.Map.removeLayer(this.L),delete this.L),this.L=this.location.layer.mapview.geometry(this),this.location.Layers.push(this.L)}function ht(e){e.edit&&e.value&&(e.field!==e.location.layer.geomCurrent()&&e.elements.push(mapp.utils.html`
    <button
      class="flat wide no-colour"
      onclick=${()=>{e.location.layer.mapview.interaction.finish(),e.display=!1,e.value=null,M(e)}}>
    ${e.edit.delete_label||mapp.dictionary.delete_geometry}`),e.elements.push(mapp.utils.html.node`
    <button
      class="flat bold wide primary-colour modify-btn"
      onclick=${t=>e.modify(t)}>
      ${e.edit.modify_label||mapp.dictionary.modify_geometry}`))}function ft(e){let t=this,i=e.target;if(i.classList.contains("active")){t.location.layer.mapview.interactions.highlight();return}i.classList.add("active"),!t.display&&t.show(),t.location.layer.mapview.Map.removeLayer(t.L);let l=t.L.getSource().getFeatures()[0];t.location.layer.mapview.interactions.modify({Feature:l.clone(),layer:t.location.layer,snap:t.edit.snap,srid:t.srid||t.location.layer.srid,callback:a=>{i.classList.remove("active"),delete t.location.layer.mapview.interaction,mapp.ui.elements.helpDialog(),setTimeout(()=>{!t.location.layer.mapview.interaction&&t.location.layer.mapview.interactions.highlight()},400),a?(t.value=a.geometry,M(t)):t.location.layer.mapview.Map.addLayer(t.L)}})}function _t(e){if(!e.draw)return;Object.keys(e.draw).forEach(i=>{e.draw[i]===!0&&(e.draw[i]={}),mapp.ui.elements.drawing[i]&&(e.draw[i].callback??=t,e.elements.push(mapp.ui.elements.drawing[i](e)))});function t(i){mapp.ui.elements.helpDialog(),i&&(e.value=i.geometry,M(e))}}async function M(e){e.L&&(e.location.layer.mapview.Map.removeLayer(e.L),delete e.L),e.location.view?.classList.add("disabled"),await mapp.utils.xhr({method:"POST",url:`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"location_update",locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,id:e.location.id}),body:JSON.stringify({[e.field]:e.value})}),e.dependents&&await e.location.syncFields(e.dependents),e.location.layer.geom===e.field&&e.location.layer.reload(),e.location.viewEntries.remove(),e.location.view?.classList.remove("disabled"),e.location.viewEntries=e.location.view.appendChild(mapp.ui.locations.infoj(e.location))}var we=e=>{let t=mapp.utils.html`
    <pre><code>${JSON.stringify(e.value,null,2)}`;return e.edit&&(t=mapp.utils.html`
    <textarea
      style="auto; min-height: 50px;"
      onfocus=${l=>{l.target.style.height=l.target.scrollHeight+"px"}}
      onfocusout=${l=>{l.target.style.height="auto"}}
      oninput=${l=>{e.json=(()=>{try{return JSON.parse(l.target.value)}catch{return!1}})(),l.target.style.border=e.json?"none":"1px solid red"}}
      onkeyup=${l=>{e.newValue=typeof e.json!="object"?e.value:e.json,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}
      onkeydown=${l=>setTimeout(()=>{l.target.style.height="auto",l.target.style.height=l.target.scrollHeight+"px"},100)}>${JSON.stringify(e.value,null,2)}`),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">${t}`};var be=e=>{if(e.panel)return e.panel;if(e.mapview??=e.location.layer.mapview,!e.mapview){console.warn("mvt_clone entry requires a mapview.");return}if(e.Layer=e.mapview.layers[e.layer],!e.Layer){console.warn("mvt_clone Layer not found in mapview.layers object.");return}e.zIndex??=e.Layer.zIndex,e.style??=e.Layer.style,e.style.default&&(e.style.default={...e.location?.style,...e.style.default}),e.key??=e.Layer.key,mapp.layer.styleParser(e),e.L=new ol.layer.VectorTile({source:e.Layer.L.getSource(),renderBuffer:200,zIndex:e.zIndex,style:mapp.layer.featureStyle(e)}),e.Layer.clones.add(e.L),e.location.removeCallbacks.push(()=>{e.mapview.Map.removeLayer(e.L),e.Layer.clones.delete(e.L),e.mapview.Map.getTargetElement().removeEventListener("changeEnd",i)}),e.style.themes&&(e.style.theme??=e.style.themes[Object.keys(e.style.themes)[0]]),e.style.panel=mapp.ui.layers.panels.style(e),e.style.panel&&(e.style.panel.style.display="none",e.view=e.panel),e.show=async()=>{e.display=!0;let l=mapp.utils.paramString(mapp.utils.queryParams(e));if(e.featureLookup=await mapp.utils.xhr(`${e.host||e.mapview?.host||mapp.host}/api/query?${l}`),e.featureLookup===null){e.panel.querySelector("input").disabled=!0,e.style.panel&&(e.style.panel.style.display="none");return}Array.isArray(e.featureLookup)||(e.featureLookup=[e.featureLookup]);try{e.mapview.Map.addLayer(e.L)}catch{}e.style.panel&&(e.style.panel.style.display="block")},e.hide=async()=>{e.display=!1,e.mapview.Map.removeLayer(e.L),e.style.panel&&(e.style.panel.style.display="none")};let t=mapp.ui.elements.chkbox({label:e.label||"MVT Clone",data_id:`${e.key}-chkbox`,checked:!!e.display,onchange:l=>l?e.show():e.hide()});e.panel=mapp.utils.html.node`<div>
    ${t}
    ${e.style.panel}`,e.display&&e.show();function i(){if(e.Layer.tables&&e.featureLookup!==null){if(e.Layer.tableCurrent()===null){e.panel.querySelector("input").disabled=!0,e.style.panel&&(e.style.panel.style.display="none");return}e.panel.querySelector("input").disabled=!1,e.style.panel&&(e.style.panel.style.display="block")}}return i(),e.mapview.Map.getTargetElement().addEventListener("changeEnd",i),e.panel};function k(e){if(e.edit)return gt(e);if(!(e.value===null||isNaN(e.value)))return mapp.utils.formatNumericValue(e),mapp.utils.html.node`<div 
    class="val"
    style=${e.css_val}
    >${e.stringValue}`}function gt(e){return e.edit===!0&&(e.edit={}),e.edit.callback??=()=>{e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))},e.edit.min??=e.min||-2147483648,e.edit.max??=e.max||2147483647,e.edit.step??=e.step||e.type==="integer"?1:.1,Object.assign(e,e.edit),e.edit.range&&e.value&&e.value>e.min&&e.value<e.max?mapp.ui.elements.slider(e):mapp.ui.elements.numericInput(e)}mapp.utils.merge(mapp.dictionaries,{en:{pin:"Pin"},de:{pin:"Pin"},zh:{pin:"\u6807\u6CE8"},zh_tw:{pin:"\u6A19\u6CE8"},pl:{pin:"Oznacz"},fr:{pin:"Marquer"},ja:{pin:"\u30D4\u30F3"},es:{pin:"Marcar"},tr:{pin:"Sabitle"},it:{pin:"Pin"},th:{pin:"\u0E40\u0E02\u0E47\u0E21\u0E2B\u0E21\u0E38\u0E14"}});var $e=e=>{if(!Array.isArray(e.value)){console.warn("Entry type pin requires a value array.");return}e.srid??=e.location.layer.srid,e.location.layer.mapview.Map.removeLayer(e.L),e.zIndex??=1/0,e.Style??=e.style?mapp.utils.style(e.style):e.location.pinStyle,e.geometry={type:"Point",coordinates:e.value},e.L=e.location.layer.mapview.geoJSON(e),e.location.layer.display&&e.location.layer.L?.changed(),e.location.Layers.push(e.L);let t=mapp.ui.elements.chkbox({label:`${e.label||mapp.dictionary.pin}`,checked:!0,onchange:l=>{e.display=l,l?e.location.layer.mapview.Map.addLayer(e.L):e.location.layer.mapview.Map.removeLayer(e.L)}});return mapp.utils.html.node`${t}`};var ke=e=>(e.pills??=e.value||[],mapp.ui.elements.pills(e),e.container);mapp.utils.merge(mapp.dictionaries,{en:{report:"Report",link:"Link"},de:{report:"Report",link:"Link"},zh:{report:"\u62A5\u544A",link:"\u5173\u8054"},zh_tw:{report:"\u5831\u544A",link:"\u95DC\u806F"},pl:{report:"Raport",link:"Link"},fr:{report:"Rapport",link:"Lien"},ja:{report:"\u30EC\u30DD\u30FC\u30C8",link:"\u30EA\u30F3\u30AF"},es:{report:"Informe",link:"Enlace"},tr:{report:"Rapor",link:"Baglanti"},it:{report:"Rapporto",link:"Link"},th:{report:"\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19",link:"\u0E25\u0E34\u0E07\u0E04\u0E4C"}});var D=e=>{if(e.params??={},e.report&&(e.url??=`${e.location.layer.mapview.host}/view?`,Object.assign(e.params,{template:e.report.template,id:e.location.id,layer:e.location.layer.key,locale:e.location.layer.mapview.locale.key}),e.label??=`${e.report.label||mapp.dictionary.report}`,e.icon_class??="mask-icon wysiwyg"),!e.url){console.warn("An entry.url must be defined for the URL path.");return}e.icon_class??="mask-icon open-in-new",e.label??=`${mapp.dictionary.link}`;let t=e.url+mapp.utils.paramString(e.params);return mapp.utils.html.node`
    <div class="link-with-img">
      <div style=${e.icon_style||""} class=${e.icon_class}></div>
      <a target="_blank" href=${t}>${e.label}`};var ye=e=>{let t=document.querySelector(`[data-id=${e.target}]`);return e.tab_style=`border-bottom: 3px solid ${e.location.style.strokeColor}`,t.dispatchEvent(new CustomEvent("addTab",{detail:e})),e.display&&e.show(),mapp.ui.elements.chkbox({label:e.label,checked:!!e.display,onchange:i=>{e.display=i,e.display?e.show():e.remove()}})};mapp.utils.merge(mapp.dictionaries,{en:{loading:"Loading",no_options_available:"No options available."},de:{loading:"Wird geladen",no_options_available:"Keine Auswahl verf\xFCgbar"},zh:{loading:"\u52A0\u8F7D\u4E2D",no_options_available:"\u65E0\u9009\u9879"},zh_tw:{loading:"\u8F09\u5165\u4E2D",no_options_available:"\u7121\u9078\u9805"},pl:{loading:"\u0141adowanie",no_options_available:"Opcja niedost\u0119pna"},fr:{loading:"Chargement",no_options_available:"Pas d'options disponibles."},ja:{loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D",no_options_available:"\u9078\u629E\u80A2\u306A\u3057"},es:{loading:"Cargando",no_options_available:"No hay opciones disponibles."},tr:{loading:"Yukleniyor",no_options_available:"Secenek bulunamadi"},it:{loading:"Caricamento",no_options_available:"Nessuna opzione disponibile"},th:{loading:"\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14",no_options_available:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E43\u0E2B\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01"}});function P(e){if(!(!e.edit&&!e.value))return e.edit?vt(e):mapp.utils.html.node`
    <div
      class="val"
      style=${e.css_val}>
      ${e.prefix}${e.value}${e.suffix}`}function vt(e){if(e.edit.options)return e.container=mapp.utils.html.node`<div>${mapp.dictionary.loading}`,e.edit.options.length?xe(e):mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:e.edit.query||(e.jsonb_field||e.json_field?"distinct_values_json":"distinct_values"),dbs:e.location.layer.dbs,locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,filter:e.location.layer.filter?.current,table:e.location.layer.tableCurrent(),field:e.json_field||e.jsonb_field||e.field,key:e.jsonb_key||e.json_key,id:e.location.id})).then(i=>{if(i===null){e.container.innerHTML=`${mapp.dictionary.no_options_available}`;return}e.edit.options=[i].flat().map(l=>Object.values(l)[0]),xe(e)}),e.container;return mapp.utils.html.node`
    <input
      type="text"
      maxlength=${e.edit.maxlength}
      value="${e.newValue||e.value||""}"
      placeholder="${e.edit.placeholder||""}"
      onkeyup=${t}>`;function t(i){e.newValue=e.edit.arraySeparator?i.target.value.split(e.edit.arraySeparator):i.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}function xe(e){let t=e.edit.options.map(l=>({title:l===null?null:typeof l=="string"&&l||Object.keys(l)[0],option:l===null?null:typeof l=="string"&&l||Object.values(l)[0]})),i=t.find(l=>l.option===e.value);mapp.utils.render(e.container,mapp.ui.elements.dropdown({placeholder:e.edit.placeholder,span:i?.title||e.value,entries:t,callback:(l,a)=>{e.newValue=a.option,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}))}var A=e=>{let t=e.type!=="html"?e.value:"";e.edit&&(t=mapp.utils.html`
    <textarea
      style="auto; min-height: 50px;"
      maxlength=${e.edit.maxlength}
      placeholder="${e.edit.placeholder||""}"
      onfocus=${l=>{l.target.style.height=l.target.scrollHeight+"px"}}
      onfocusout=${l=>{l.target.style.height="auto"}}
      onkeyup=${l=>{e.newValue=l.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}
      onkeydown=${l=>setTimeout(()=>{l.target.style.height="auto",l.target.style.height=l.target.scrollHeight+"px"},100)}>
      ${e.newValue||e.value||""}`);let i=mapp.utils.html.node`
  <div
    class="val"
    style="${`${e.css_val||""}`}">${t}`;return!e.edit&&e.type==="html"&&(i.innerHTML=e.value||""),i};var Le=e=>{let t,i=e.value&&e.value.toString().replace(".",":");return i=i&&i.length<3&&`${i}:00`||i,e.edit?t=mapp.utils.html.node`
      <input
        type="time"
        value=${i}
        onchange=${a=>{e.newValue=parseFloat(a.target.value.replace(":",".")),e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`:t=i,mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${t}`};function V(e){if(e.mapview??=e.location.layer.mapview,!e.mapview){console.warn("vector_layer entry requires a mapview.");return}return e.zIndex??=Object.keys(e.mapview.layers).length+1,e.style??={},e.style.default&&(e.style.default.icon&&(e.style.default.icon={...e.location?.style,...e.style.default.icon}),e.style.default={...e.location?.style,...e.style.default}),mapp.layer.styleParser(e),e.style.themes&&(e.style.theme??=e.style.themes[Object.keys(e.style.themes)[0]]),e.elements=e.api_elements||[],e.label??="Vector Layer",e.chkbox=mapp.ui.elements.chkbox({label:e.label,data_id:`chkbox-${e.key}`,checked:!!e.display,onchange:t=>t?e.show(e):bt(e)}),e.show??=wt,e.display&&e.show(e),e.panel=mapp.utils.html.node`<div>${e.chkbox}${e.elements}`,e.location.removeCallbacks.push(()=>{e.mapview.Map.removeLayer(e.L)}),e.panel}async function wt(e){e.display=!0;let t=e.location.view?.querySelector(`[data-id=chkbox-${e.key}] input`);if(t&&(t.checked=!0),e.mapview.Map.getLayers().getArray().includes(e.L))return;let l=mapp.utils.paramString(mapp.utils.queryParams(e));if(e.features=await mapp.utils.xhr(`${e.host||e.mapview?.host||mapp.host}/api/query?${l}`),e.features instanceof Error){console.warn("Features query failed.");return}if(!e.features&&e.api instanceof Function&&await e.api(e),!e.features){e.panel.querySelector("input").disabled=!0,e.style.panel&&(e.style.panel.style.display="none");return}e.setSource?e.setSource(e.features):mapp.layer.formats[e.format](e);try{e.mapview.Map.addLayer(e.L)}catch{}e.style.panel?.remove(),e.style.panel=mapp.ui.layers.panels.style(e),e.style.panel&&e.panel.append(e.style.panel)}function bt(e){e.display=!1,e.style.panel&&(e.style.panel.style.display="none"),e.mapview.Map.removeLayer(e.L)}function F(e){let t=`layer-key ${e.location.layer.display?"active":""}`;return mapp.utils.html.node`<div>
    <button 
      class=${t}
      title="${mapp.dictionary.layer_visibility}"
      onclick="${l=>{l.target.classList.toggle("active")?e.location.layer.show():e.location.layer.hide()}}">${e.location.layer.name}`}function R(e){let t=e.tooltip&&mapp.utils.html`
      <span
        class="tooltip mask-icon question-mark">${e.tooltip}`;return mapp.utils.html.node`
      <div
        class="label"
        style=${e.css_title}
        title=${e.tooltip}>${e.title}
        ${t}`}function H(e){if(!e.query){console.warn('You must provide a query to use "type": "query_button".');return}return e.label??=`Run query:${e.query}`,mapp.utils.html.node`
    <button 
      class="flat wide bold primary-colour"
      onclick=${()=>$t(e)}>${e.label}`}async function $t(e){e.updated_fields&&(console.warn("entry.updated_fields is deprecated, please use entry.dependents instead."),e.dependents??=e.updated_fields),e.location.view.classList.add("disabled"),e.queryparams??={},e.queryparams.template=e.query;let t=mapp.utils.paramString(mapp.utils.queryParams(e));e.host??=e.location.layer.mapview.host+"/api/query";let i=await mapp.utils.xhr(`${e.host}?${t}`);if(i instanceof Error){alert("Query failed."),e.location.view.classList.remove("disabled");return}e.value=i,e.alert&&alert(e.alert),e.reload&&e.location.layer.reload(),e.dependents&&await e.location.syncFields(e.dependents),e.location.view.dispatchEvent(new Event("updateInfo")),e.location.view.classList.remove("disabled")}var Ee={boolean:C,dataview:T,date:q,datetime:q,defaults:O,documents:$,geometry:I,html:A,image:$,images:$,integer:k,json:we,pills:ke,key:F,link:D,mvt_clone:be,numeric:k,pin:$e,report:D,tab:ye,text:P,textarea:A,time:Le,title:R,vector_layer:V,query_button:H};var Ce={view:L,listview:he,infoj:E,entries:Ee};async function N(e){if(e.create instanceof Function){e.create();return}if(typeof e.target=="string"&&(e.target=document.getElementById(e.target)),!(e.target instanceof HTMLElement)){console.warn("Dataviews require a HTMLHtmlElement target"),console.log(e);return}return xt(e)instanceof Error?e.err:(e.queryparams={...e.layer?.mapview?.locale?.queryparams,...e.layer?.queryparams,...e.queryparams},e.update??=Lt,e.show??=kt,e.hide??=yt,e.chkbox=e.label&&mapp.ui.elements.chkbox({data_id:e.key,label:e.label,checked:!!e.display,disabled:e.disabled,onchange:t=>{e.display=t,e.display?e.show():e.hide()}}),Et(e),Ct(e),e)}function kt(){this.display=!0,!this.create||this.dynamic?(this.create=function(){mapp.ui.utils[this.dataview].create(this)},this.create(),this.update&&this.update()):this.reload&&this.update&&this.update(),this.target.style.display="block"}function yt(){this.display=!1,this.target.style.display="none"}function xt(e){if(e.key??=e.query||e.title||e.label,e.dataview||(e.chart&&(e.dataview="chartjs"),typeof e.columns<"u"&&(console.warn("Table dataviews should be configured inside a tables object"),e.table={columns:e.columns},e.dataview="tabulator"),e.table&&(e.dataview="tabulator")),!Object.hasOwn(mapp.ui.utils,e.dataview))return e.err=new Error(`mapp.ui.utils.${e.dataview} doesnt exist`),console.error(e.err),e.update=()=>console.warn(`Unable to update ${e.key} dataview.`),e.err;if(typeof mapp.ui.utils[e.dataview].create!="function")return e.err=new Error(`mapp.ui.utils.${e.dataview}.create() method doesn't exist`),console.error(e.err),e.err}async function Lt(){if(this.create||(this.create=function(){mapp.ui.utils[this.dataview].create(this)},this.create()),!this.query)return;let e=mapp.utils.queryParams(this),t=mapp.utils.paramString(e);this.host??=this.layer?.mapview?.host;let i=await mapp.utils.xhr(`${this.host||mapp.host}/api/query?${t}`);if(!(i instanceof Error)){if(typeof this.responseFunction=="function"){this.responseFunction(i);return}typeof this.setData=="function"&&this.setData(i)}}function Et(e){if(!e.toolbar)return;typeof e.toolbar=="function"&&e.toolbar();let t=mapp.utils.html.node`<div class="dataview-target">`,i=Object.keys(e.toolbar).map(l=>mapp.ui.utils[e.dataview]?.toolbar[l]?.(e)).filter(l=>!!l);e.panel=e.target.appendChild(mapp.utils.html.node`
    <div class="flex-col">
      <div class="btn-row">${i}</div>
      ${t}`),e.target=t}function Ct(e){if(!e.mapChange)return;let t=e.layer?.mapview?.Map?.getTargetElement();t&&t.addEventListener("changeEnd",()=>{e.layer.display&&(e.tab&&!e.tab.classList.contains("active")||(typeof e.mapChange=="function"?e.mapChange():e.update()))})}function B(e){if(e.node)return e.tabs=e.node.appendChild(mapp.utils.html.node`<div class="tabs">`),e.panel=e.node.appendChild(mapp.utils.html.node`<div class="panel">`),e.id&&e.node.setAttribute("data-id",e.id),e.addTab=zt,e.node.addEventListener("addTab",t=>e.addTab(t.detail)),e}function zt(e){if(e.tab)return;let t=this;e.activate??=function(){(!e.create||e.dynamic)&&(e.create??=function(){mapp.ui.utils[e.dataview]?.create(e)},e.create()),e.update instanceof Function&&e.update()},e.location?e.location.removeCallbacks.push(()=>e.remove()):e.layer&&(e.layer.showCallbacks.push(()=>{e.display&&e.show()}),e.layer.hideCallbacks.push(()=>{e.remove()})),e.label??=e.title||e.key||"Tab",e.tab=mapp.utils.html.node`
    <div class="tab">
      <button
        .disabled=${e.disabled}
        class="header"
        style="${e.tab_style||""}"
        onclick=${i}>${e.label}`,e.panel??=e.target||mapp.utils.html.node`
    <div class="${`panel ${e.class||""}`}">`,e.show=i,e.remove=l,e.hide=l;function i(){mapp.utils.render(t.panel,e.panel),t.tabs.childNodes.forEach(a=>a.classList.remove("active")),!e.tab.parentElement&&t.tabs.append(e.tab),e.tab.classList.add("active"),t.timer&&window.clearTimeout(t.timer),t.timer=window.setTimeout(e.activate,500),t.showTab instanceof Function&&t.showTab(e)}function l(){if(!e.tab.parentElement)return;let a=e.tab.nextElementSibling||e.tab.previousElementSibling;if(e.tab.remove(),a)return a.querySelector(".header").click();t.removeLastTab&&t.removeLastTab()}}var ze=e=>mapp.utils.html.node`
  <div 
    data-id=${e.data_id||"card"}
    class="drawer">
    <div class="header bold">
      <span>${e.header}</span>
      <button
        data-id=close
        class="mask-icon close"
        onclick=${t=>{t.target.closest(".drawer").remove(),e.close&&e.close(t)}}>
    </div>
    ${e.content}`;var Se=e=>mapp.utils.html.node`
  <label 
    data-id=${e.data_id||"chkbox"}
    class="checkbox">
    <input
      name="mapp-ui-chkbox-element"
      type="checkbox"
      .disabled=${!!e.disabled}
      .checked=${!!e.checked}
      onchange=${t=>{e.onchange&&e.onchange(t.target.checked,e.val)}}>
    </input>
    <div></div>
    <span>${e.label}`;var je={modify:St,draw:jt};mapp.utils.merge(mapp.dictionaries,{en:{remove_last_vertex:"Remove last vertex",delete_vertex:"Remove vertex"},de:{remove_last_vertex:"Entferne letzten Scheitelpunkt",delete_vertex:"Entferne Scheitelpunkt"},zh:{remove_last_vertex:"\u5220\u9664\u6700\u540E\u4E00\u4E2A\u9876\u70B9",delete_vertex:"\u5220\u9664\u9876\u70B9"},zh_tw:{remove_last_vertex:"\u522A\u9664\u6700\u5F8C\u4E00\u500B\u9802\u9EDE",delete_vertex:"\u522A\u9664\u9802\u9EDE"},pl:{remove_last_vertex:"Usu\u0144 ostatni wierzcho\u0142ek",delete_vertex:"Usu\u0144 wierzcho\u0142ek"},fr:{remove_last_vertex:"Supprimer le dernier sommet",delete_vertex:"Supprimer les sommets"},ja:{remove_last_vertex:"\u6700\u5F8C\u306E\u30D0\u30FC\u30C6\u30C3\u30AF\u30B9\u3092\u524A\u9664",delete_vertex:"\u30D0\u30FC\u30C6\u30C3\u30AF\u30B9\u3092\u524A\u9664"},es:{remove_last_vertex:"Eliminar el \xFAltimo v\xE9rtice",delete_vertex:"Eliminar v\xE9rtice"},tr:{remove_last_vertex:"Son verteksi kaldir",delete_vertex:"Verteksi kaldir"},it:{remove_last_vertex:"Eliminare l'ultimo vertice",delete_vertex:"Elimina vertice"},th:{remove_last_vertex:"\u0E25\u0E1A\u0E08\u0E38\u0E14\u0E22\u0E2D\u0E14\u0E2A\u0E38\u0E14\u0E17\u0E49\u0E32\u0E22",delete_vertex:"\u0E25\u0E1A\u0E08\u0E38\u0E14\u0E22\u0E2D\u0E14"}});function St(e){e&&e.preventDefault();let t=[];t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish(this.interaction.getFeature())}>
      ${mapp.dictionary.save}`),t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish()}>
      ${mapp.dictionary.cancel}`),this.popup({coords:this.interaction.vertices[this.interaction.vertices.length-1],content:mapp.utils.html.node`<ul>${t}`})}function jt(e){if(this.interaction.vertices.length===0)return;let t=[];t.push(mapp.utils.html`
  <li
    onclick=${()=>this.interaction.finish(this.interaction.getFeature())}>
      ${mapp.dictionary.save}`),t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish()}>
      ${mapp.dictionary.cancel}`),setTimeout(()=>this.popup({coords:this.interaction.vertices[this.interaction.vertices.length-1],content:mapp.utils.html.node`<ul>${t}`,autoPan:!0}),100)}function W(e){return e.data_id??="drawer",e.class=`drawer expandable ${e.class||""}`,mapp.utils.html.node`
  <div 
    data-id=${e.data_id}
    class=${e.class}>
    <div
      class="header"
      onclick=${i}>
      ${e.header}
    </div>
    ${e.content}`;function i(l){l.target.parentElement.classList.contains("empty")||l.target.parentElement.classList.toggle("expanded")}}var Te={point:Tt,line:qt,polygon:Ot,rectangle:Mt,circle_2pt:It,circle:Dt,locator:Pt,drawOnclick:h};mapp.utils.merge(mapp.dictionaries,{en:{draw_dialog_title:"Drawing Instructions",draw_dialog_begin_drawing:"Begin Drawing - Click anywhere on the map",draw_dialog_cancel_drawing:"Cancel Drawing - ESC Key",draw_dialog_remove_vertex:"Remove Last Vertex - Right Click",draw_dialog_save:"Save - Double Click",draw_dialog_save_single:"Save - Single Click",draw_point:"Point",draw_position:"Current Position",draw_polygon:"Polygon",draw_rectangle:"Rectangle",circle_config:"Circle configuration",draw_circle:"Circle from Centre",draw_circle_2pt:"Manual Circle",radius:"Radius",units:"Units",draw_line:"Line",create:"Create"},de:{draw_point:"Punkt",draw_position:"Aktueller Standort",draw_polygon:"Polygon",draw_rectangle:"Rechteck",circle_config:"Zirkel Einstellung",draw_circle:"Zirkel",draw_circle_2pt:"2 Punkt Zirkel",radius:"Radius",units:"Masseinheit",draw_line:"Linie",create:"Erstellen"},zh:{draw_point:"\u70B9",draw_position:"\u5F53\u524D\u4F4D\u7F6E",draw_polygon:"\u591A\u8FB9\u5F62",draw_rectangle:"\u957F\u65B9\u5F62",circle_config:"\u5706\u5F62\u8C03\u6574",draw_circle:"\u7531\u4E2D\u5FC3\u70B9\u5916\u6CBF\u7ED8\u5236\u5706\u5F62",draw_circle_2pt:"\u624B\u7ED8\u5706\u5F62",radius:"\u534A\u5F84",units:"\u5355\u4F4D",draw_line:"\u7EBF\u6761",create:"\u521B\u5EFA"},zh_tw:{draw_point:"\u9EDE",draw_position:"\u7576\u524D\u4F4D\u7F6E",draw_polygon:"\u591A\u908A\u5F62",draw_rectangle:"\u9577\u65B9\u5F62",circle_config:"\u5713\u5F62\u8ABF\u6574",draw_circle:"\u7531\u4E2D\u5FC3\u9EDE\u5916\u6CBF\u7E6A\u88FD\u5713\u5F62",draw_circle_2pt:"\u624B\u7E6A\u5713\u5F62",radius:"\u534A\u5F91",units:"\u55AE\u4F4D",draw_line:"\u7DDA\u689D",create:"\u5275\u5EFA"},pl:{draw_point:"Punkt",draw_position:"Aktualna pozycja",draw_polygon:"Poligon",draw_rectangle:"Prostok\u0105t",circle_config:"Konfiguracja okr\u0119gu",draw_circle:"Okr\u0105g od centrum",draw_circle_2pt:"Okr\u0105g odr\u0119czny",radius:"Promie\u0144",units:"Jednostki",draw_line:"Linia",create:"Utw\xF3rz"},fr:{draw_point:"Point",draw_position:"Position Actuelle",draw_polygon:"Polygone",draw_rectangle:"Rectangle",circle_config:"Param\xE9trage du cercle",draw_circle:"Cercle \xE0 partir du centre",draw_circle_2pt:"Cercle Manuel",radius:"Rayon",units:"Unit\xE9",draw_line:"Ligne",create:"Cr\xE9er"},ja:{draw_point:"\u30DD\u30A4\u30F3\u30C8",draw_position:"\u73FE\u5730",draw_polygon:"\u30DD\u30EA\u30B4\u30F3",draw_rectangle:"\u9577\u65B9\u5F62",circle_config:"\u4E38\u306E\u69CB\u6210",draw_circle:"\u771F\u3093\u4E2D\u304B\u3089\u306E\u4E38",draw_circle_2pt:"\u30DE\u30CB\u30E5\u30A2\u30EB\u306E\u4E38",radius:"\u534A\u5F84",units:"\u5358\u4F4D",draw_line:"\u7DDA",create:"\u4F5C\u6210"},es:{draw_point:"Punto",draw_position:"Posici\xF3n actual",draw_polygon:"Pol\xEDgono",draw_rectangle:"Rect\xE1ngulo",circle_config:"Configuraci\xF3n del c\xEDrculo",draw_circle:"C\xEDrculo desde el centro",draw_circle_2pt:"C\xEDrculo manual",radius:"Radio",units:"Unidad",draw_line:"L\xEDnea",create:"Crear"},tr:{draw_point:"Nokta",draw_position:"Mevcut konum",draw_polygon:"Poligon",draw_rectangle:"Dikdortgen",circle_config:"Cember ayarlari",draw_circle:"Merkezden cember",draw_circle_2pt:"Manuel cember",radius:"Yaricap",units:"Birimler",draw_line:"Cizgi",create:"Olustur"},it:{draw_point:"Punto",draw_position:"Posizione attuale",draw_polygon:"Poligono",draw_rectangle:"Rettangolo",circle_config:"Configurazione cerchio",draw_circle:"Cerchio dal centro",draw_circle_2pt:"Cerchio manuale",radius:"Raggio",units:"Unit\xE0",draw_line:"Linea",create:"Creare"},th:{draw_point:"\u0E08\u0E38\u0E14",draw_position:"\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19",draw_polygon:"\u0E23\u0E39\u0E1B\u0E2B\u0E25\u0E32\u0E22\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21",draw_rectangle:"\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\u0E1C\u0E37\u0E19\u0E1C\u0E49\u0E32",circle_config:"\u0E01\u0E32\u0E23\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E04\u0E48\u0E32\u0E27\u0E07\u0E01\u0E25\u0E21",draw_circle:"\u0E27\u0E07\u0E01\u0E25\u0E21\u0E08\u0E32\u0E01\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E01\u0E25\u0E32\u0E07",draw_circle_2pt:"\u0E27\u0E07\u0E01\u0E25\u0E21\u0E41\u0E1A\u0E1A\u0E41\u0E21\u0E19\u0E19\u0E27\u0E25",radius:"\u0E23\u0E31\u0E28\u0E21\u0E35",units:"\u0E2B\u0E19\u0E48\u0E27\u0E22",draw_line:"\u0E40\u0E2A\u0E49\u0E19",create:"\u0E2A\u0E23\u0E49\u0E32\u0E07"}});function h(e,t,i){let l=e.target;if(!l.classList.toggle("active")){t.mapview.interaction.finish();return}!t.display&&t.show(),i.callback??=a=>{mapp.location.create(a,i,t),l.classList.remove("active"),delete t.mapview.interaction,mapp.ui.elements.helpDialog(),setTimeout(()=>{!t.mapview.interaction&&t.mapview.interactions.highlight()},400)},t.mapview.interactions.draw(i),i.helpDialog.header=mapp.utils.html`<h3>${mapp.dictionary.draw_dialog_title}</h3>`,i.helpDialog.data_id="dialog_drawing",mapp.ui.elements.helpDialog(i.helpDialog),l.classList.add("active")}function Tt(e){let t={content:mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>
    <ul>${mapp.dictionary.draw_dialog_save_single}</ul>`};return e.draw.point={layer:e,label:mapp.dictionary.draw_point,helpDialog:t,type:"Point",...e.draw.point},e.draw.point.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${i=>h(i,e,e.draw.point)}>
      ${e.draw.point.label}`,e.draw.point.btn}function qt(e){let t={content:mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>
    <ul>${mapp.dictionary.draw_dialog_remove_vertex}</ul>
    <ul>${mapp.dictionary.draw_dialog_save_single}</ul>`};return e.draw.line={layer:e,label:mapp.dictionary.draw_line,helpDialog:t,type:"LineString",...e.draw.line},e.draw.line.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${i=>h(i,e,e.draw.line)}>
      ${e.draw.line.label}`,e.draw.line.btn}function Ot(e){let t={content:mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>
    <ul>${mapp.dictionary.draw_dialog_cancel_drawing}
    <ul>${mapp.dictionary.draw_dialog_remove_vertex}</ul>
    <ul>${mapp.dictionary.draw_dialog_save}</ul>`};return e.draw.polygon={layer:e,label:mapp.dictionary.draw_polygon,helpDialog:t,type:"Polygon",...e.draw.polygon},e.draw.polygon.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${i=>h(i,e,e.draw.polygon)}>
      ${e.draw.polygon.label}`,e.draw.polygon.btn}function Mt(e){let t={content:mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>
    <ul>${mapp.dictionary.draw_dialog_save_single}</ul>`};return e.draw.rectangle={layer:e,label:mapp.dictionary.draw_rectangle,helpDialog:t,type:"Circle",geometryFunction:ol.interaction.Draw.createBox(),...e.draw.rectangle},e.draw.rectangle.btn=mapp.utils.html.node`
  <button
    class="flat wide bold primary-colour"
    onclick=${i=>h(i,e,e.draw.rectangle)}>
    ${e.draw.rectangle.label}`,e.draw.rectangle.btn}function It(e){let t={content:mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>
    <ul>${mapp.dictionary.draw_dialog_save_single}</ul>`};return e.draw.circle_2pt={layer:e,type:"Circle",helpDialog:t,geometryFunction:ol.interaction.Draw.createRegularPolygon(33),label:mapp.dictionary.draw_circle_2pt,...e.draw.circle_2pt},e.draw.circle_2pt.btn=mapp.utils.html.node`
  <button
    class="flat wide bold primary-colour"
    onclick=${i=>h(i,e,e.draw.circle_2pt)}>
    ${e.draw.circle_2pt.label}`,e.draw.circle_2pt.btn}function Dt(e){let t={content:mapp.utils.html.node`<li>
    <ul>${mapp.dictionary.draw_dialog_begin_drawing}</ul>
    <ul>${mapp.dictionary.draw_dialog_save_single}</ul>`};e.draw.circle={layer:e,helpDialog:t,type:"Point",units:"meter",radius:100,radiusMin:1,radiusMax:1e3,unitConversion:{meter:a=>a,km:a=>a*1e3,miles:a=>a*1609.34,meter2:a=>Math.sqrt(a/Math.PI),km2:a=>Math.sqrt(a*1e6/Math.PI)},geometryFunction:a=>new ol.geom.Polygon.circular(ol.proj.toLonLat(a),e.draw.circle.unitConversion[e.draw.circle.units](e.draw.circle.radius),64).transform("EPSG:4326","EPSG:3857"),label:mapp.dictionary.draw_circle,...e.draw.circle};let i=mapp.utils.html.node`
    <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
      <div style="grid-column: 1;">${mapp.dictionary.units}</div>
      <div style="grid-column: 2;">
        ${mapp.ui.elements.dropdown({placeholder:e.draw.circle.units,entries:[{title:"Meter",option:"meter"},{title:"KM",option:"km"},{title:"Miles",option:"miles"},{title:"Meter\xB2",option:"meter2"},{title:"KM\xB2",option:"km2"}],callback:(a,o)=>{e.draw.circle.units=o.option}})}`,l=mapp.ui.elements.slider({label:mapp.dictionary.radius,min:e.draw.circle.radiusMin,max:e.draw.circle.radiusMax,val:e.draw.circle.radius,callback:a=>{e.draw.circle.radius=parseFloat(a.target.value)}});return e.draw.circle.panel=mapp.utils.html.node`
    <div class="panel flex-col">
      ${i}
      ${l}`,e.draw.circle.btn=mapp.utils.html.node`
  <button
    class="flat wide bold primary-colour"
    onclick=${a=>h(a,e,e.draw.circle)}>
    ${e.draw.circle.label}`,e.draw.circle.hidePanel?e.draw.circle.btn:mapp.utils.html.node`<div>
    ${mapp.ui.elements.drawer({header:mapp.utils.html`
      <h3>${mapp.dictionary.circle_config}</h3>
      <div class="mask-icon expander"></div>`,content:e.draw.circle.panel})}${e.draw.circle.btn}`}function Pt(e){return e.draw.locator={layer:e,label:mapp.dictionary.draw_position,type:"Point",...e.draw.locator},e.draw.locator.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"  
      onclick=${t=>{mapp.utils.getCurrentPosition(async i=>{let l={layer:e,table:e.tableCurrent(),new:!0},a=ol.proj.transform([parseFloat(i.coords.longitude),parseFloat(i.coords.latitude)],"EPSG:4326",`EPSG:${e.srid}`);l.id=await mapp.utils.xhr({method:"POST",url:`${e.mapview.host}/api/query?`+mapp.utils.paramString({template:"location_new",locale:e.mapview.locale.key,layer:e.key,table:l.table}),body:JSON.stringify({[e.geom]:{type:"Point",coordinates:a}})}),mapp.location.get(l)})}}>${e.draw.locator.label}`,e.draw.locator.btn}var qe=e=>{e.selectedTitles=new Set,e.selectedOptions=new Set,e.pills&&=mapp.ui.elements.pills({pills:[...e.selectedTitles],addCallback:(o,s)=>{e.callback?.(null,[...s])},removeCallback:(o,s)=>{let n=i.find(r=>r.getAttribute("data-value")===o.toString());n.classList.remove("selected"),e.selectedTitles.delete(n.title),e.selectedOptions.delete(n.dataset.option),e.callback?.(null,[...s])}}),e.liOnClick??=t;function t(o,s){let n=o.target.closest("button.dropdown");if(!e.multi&&n.classList.toggle("active"),e.multi){o.target.classList.toggle("selected"),o.target.classList.contains("selected")?(e.selectedTitles.add(s.title),e.selectedOptions.add(s.option),e.pills?.add(s.title)):(e.selectedTitles.delete(s.title),e.selectedOptions.delete(s.option),e.pills?.remove(s.title)),e.pills||(n.querySelector("[data-id=header-span]").textContent=e.selectedTitles.size&&Array.from(e.selectedTitles).map(r=>r).join(", ")||e.span||e.placeholder),e.callback?.(o,[...e.selectedOptions]);return}e.keepPlaceholder||(n.querySelector("[data-id=header-span]").textContent=s.title),e.callback?.(o,s)}let i=e.entries.map(o=>{let s=mapp.utils.html.node`<li
      data-value=${o.option}
      onclick=${n=>e.liOnClick(n,o)}>
      ${o.title}`;return o.selected&&(s.classList.add("selected"),e.selectedTitles.add(o.title),e.selectedOptions.add(o.option),e.pills&&pills.add(o.title)),s});e.headerOnClick??=l;function l(o){let s=o.target.getBoundingClientRect(),r=document.body.getBoundingClientRect().height-s.bottom;if(o.target.nextElementSibling.style.maxHeight=`${r}px`,o.target.nextElementSibling.style.width=`${o.target.offsetWidth}px`,r<150?(o.target.parentElement.classList.add("dropdown-reverse"),o.target.nextElementSibling.style.maxHeight="150px"):(o.target.nextElementSibling.style.maxHeight=`${r}px`,o.target.parentElement.classList.contains("dropdown-reverse")&&o.target.parentElement.classList.remove("dropdown-reverse")),o.target.parentElement.classList.contains("active")){o.target.parentElement.classList.remove("active");return}document.querySelectorAll("button.dropdown").forEach(d=>d.classList.remove("active")),o.target.parentElement.classList.add("active")}let a=e.selectedTitles.size&&Array.from(e.selectedTitles).join(", ")||e.span||e.placeholder;return e.node=mapp.utils.html.node`
    ${e.pills?.container}
    <button
      data-id=${e.data_id||"dropdown"}
      class="dropdown">
        <div class="head" onclick=${e.headerOnClick}>
          <span data-id=header-span>${a}</span>
          <div class="icon"></div>
        </div>
        <ul>${i}`,e.node};var Oe=e=>(console.warn("mapp.ui.elements.dropdown should be used with the multi flag"),e.multi=!0,mapp.ui.elements.dropdown(e));var Me=e=>mapp.utils.html.node`
    <button 
        data-id=${e.data_id||"btnPanel"}
        class=${`btn-panel ${e.class||""}`}
        style=${e.style||""}
        onclick=${t=>{t.target.classList.toggle("active"),e.callback(t)}}>
        <div class="header">
            <h3>${e.label}</h3>
            <div
                class="mask-icon"
                style=${`
                    mask-image: url("${e.icon}");
                    -webkit-mask-image: url("${e.icon}");
                `}>
            </div>
        </div>
        ${e.panel&&mapp.utils.html`
            <div class="panel">${e.panel}`}`;var Ie=new XMLSerializer;function G(e){if(Array.isArray(e.icon))return At(e);if(e.svg||e.type||e.icon)return Vt(e);if(!e.fillColor)return Ft(e);if(e.fillColor)return Rt(e)}function At(e){let t=document.createElement("canvas");t.width=e.width,t.height=e.height;let i=e.icon.length;function l(){if(--i)return;let o=ol.render.toContext(t.getContext("2d"),{size:[e.width,e.height],pixelRatio:1});e.icon.forEach(s=>{o.setStyle(s.legendStyle),o.drawGeometry(new ol.geom.Point([t.width*.5,t.height*.5]))})}let a=e.icon[0].legendScale||1;return e.icon.forEach(o=>{o.type&&Object.hasOwn(mapp.utils.svgSymbols,o.type)&&(o.url=mapp.utils.svgSymbols[o.type](o));let s=new ol.style.Icon({src:o.svg||o.url,crossOrigin:"anonymous",scale:a*(o.scale||1),anchor:o.legendAnchor||[.5,.5]});o.legendStyle=new ol.style.Style({image:s});let n=s.getImage();s.getImageState()===2?l():(n.addEventListener("load",l),s.load())}),t}function Vt(e){let t=e.icon?.svg||e.svg||e.icon?.url||e.url||mapp.utils.svgSymbols[e.icon?.type||e.type](e.icon||e),i=`
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: ${e.width+"px"||"100%"};
    height: ${e.height+"px"||"100%"};
    background-image: url(${t})`;return mapp.utils.html.node`<div style=${i}>`}function Ft(e){let t=`M 0,${e.height/2} L ${e.width/2},${e.height/2} ${e.width/2},${e.height/2} ${e.width},${e.height/2}`,i=mapp.utils.svg.node`
  <svg 
    height=${e.height} 
    width=${e.width}>
    <path
      d=${t}
      fill="none"
      stroke=${e.strokeColor}
      stroke-width=${e.strokeWidth||1}/>`,l=`data:image/svg+xml,${encodeURIComponent(Ie.serializeToString(i))}`,a=`
    background-position: center; 
    background-repeat: no-repeat; 
    background-size: contain; 
    width: ${e.width}px; 
    height: ${e.height}px; 
    background-image: url(${l});`;return mapp.utils.html`<div style=${a}>`}function Rt(e){let t=mapp.utils.svg.node`
  <svg 
    height=${e.height}
    width=${e.width}>
    <rect
      x=${e.strokeWidth||1}
      y=${e.strokeWidth||1}
      rx="4px"
      ry="4px"
      stroke-linejoin="round"
      width=${e.width-2*(e.strokeWidth||1)}
      height=${e.height-2*(e.strokeWidth||1)}
      fill=${e.fillColor}
      fill-opacity=${e.fillOpacity||1}
      stroke=${e.strokeColor}
      stroke-width=${e.strokeWidth||1}>`,i=`data:image/svg+xml,${encodeURIComponent(Ie.serializeToString(t))}`,l=`
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: ${e.width}px;
    height: ${e.height}px;
    background-image: url(${i});`;return mapp.utils.html`<div style=${l}>`}function U(e){if(!e.target)e.modal=!0;else if(!(e.target instanceof HTMLElement))return;document.querySelector("dialog.modal")?.close(),e.closeBtn??=e.close&&mapp.utils.html.node`
    <button
      data-id=close
      class="mask-icon close"
      onclick=${i}>`,e.data_id??="dialog",e.headerDrag&&(e.header=mapp.utils.html.node`<header class="headerDrag">${e.header}</header>`);let t=`${e.modal?"modal":"dialog"} ${e.class||""}`;e.node=mapp.utils.html.node`
    <dialog 
      style=${e.css_style}
      data-id=${e.data_id}
      class="${t}">
      ${e.closeBtn}
      ${e.header}
      ${e.content}`,e.modal?(document.body.append(e.node),e.node.showModal()):(e.target.appendChild(e.node),e.node.show(),e.right&&(e.left=e.target.offsetWidth-e.node.offsetWidth-parseInt(e.right)),e.node.style.top=`${e.top||0}px`,e.node.style.left=`${e.left||0}px`,e.node.addEventListener("mousedown",l),e.node.addEventListener("touchstart",l),new ResizeObserver(a).observe(e.target));function i(){e.close instanceof Function&&e.close(),e.node.close()}function l(n){if(e.headerDrag&&!n.target.closest("header")||n.which===3)return;e.node.style.cursor="grabbing";let r={mousedown:{move:"mousemove",end:"mouseup"},touchstart:{move:"touchmove",end:"touchend"}},{move:d,end:c}=r[n.type];e.target.addEventListener(d,s),window.addEventListener(c,o)}function a(){let{offsetWidth:n,offsetHeight:r}=e.target,{offsetWidth:d,offsetHeight:c}=e.node,m=n-d,_=r-c;e.node.style.left=`${Math.min(Math.max(e.node.offsetLeft,0),m)}px`,e.node.style.top=`${Math.min(Math.max(e.node.offsetTop,0),_)}px`}function o(){delete e.x,delete e.y,e.node.style.cursor=e.headerDrag?"auto":"grab",e.target.removeEventListener("mousemove",s),e.target.removeEventListener("touchmove",s),e.target.removeEventListener("mouseup",o),e.target.removeEventListener("touchend",o)}function s(n){e.x??=n.x;let r=n.x-e.x;e.x=n.x,e.y??=n.y;let d=n.y-e.y;if(e.y=n.y,e.contained&&!e.modal){Ht(e,r,d);return}if(e.containedCentre&&!e.modal){Nt(e,r,d);return}e.node.style.left=`${e.node.offsetLeft+r}px`,e.node.style.top=`${e.node.offsetTop+d}px`}}function Ht(e,t,i){e.node.offsetLeft+t<0?e.node.style.left=0:t<0?e.node.style.left=`${e.node.offsetLeft+t}px`:e.target.offsetWidth-e.node.offsetWidth-e.node.offsetLeft>0&&(e.node.style.left=`${e.node.offsetLeft+t}px`),e.node.offsetTop+i<0?e.node.style.top=0:i<0?e.node.style.top=`${e.node.offsetTop+i}px`:e.target.offsetHeight-e.node.offsetHeight-e.node.offsetTop>0&&(e.node.style.top=`${e.node.offsetTop+i}px`)}function Nt(e,t,i){e.node.offsetLeft+parseInt(e.node.offsetWidth/2)+t<0||(t<0?e.node.style.left=`${e.node.offsetLeft+t}px`:e.target.offsetWidth-parseInt(e.node.offsetWidth/2)-e.node.offsetLeft>0&&(e.node.style.left=`${e.node.offsetLeft+t}px`),!(e.node.offsetTop+parseInt(e.node.offsetHeight/2)+i<0)&&(i<0?e.node.style.top=`${e.node.offsetTop+i}px`:e.target.offsetHeight-parseInt(e.node.offsetHeight/2)-e.node.offsetTop>0&&(e.node.style.top=`${e.node.offsetTop+i}px`)))}var Z,De=e=>{Z?.node.remove(),e&&(Z={target:document.getElementById("Map"),height:"auto",width:"200px",css_style:"padding: 0.5em;",top:30,left:60,contained:!0,close:!0,...e},mapp.ui.elements.dialog(Z))};function J(e={}){if(!(e.searchFunction instanceof Function)){console.warn("A searchFunction must be provided for the construction of a searchbox component.");return}return e.target instanceof HTMLElement||(e.target=mapp.utils.html.node`<div>`),e.name??="searchbox-input",e.input=mapp.utils.html.node`
    <input
      name=${e.name}
      type="search"
      placeholder=${e.placeholder}>`,e.list=mapp.utils.html.node`<ul>`,e.node=mapp.utils.html.node`
    <div class="searchbox">
      ${e.input}
      ${e.list}`,e.target.append(e.node),e.input.addEventListener("input",t=>e.searchFunction(t)),e.input.addEventListener("focus",t=>e.searchFunction(t)),e}function K(e){e.data_id="a",e.rangeInput="rangeInput",e.step??=1;let t=mapp.ui.elements.numericInput(e);return e.sliderElement=mapp.utils.html.node`
    <div
      role="group"
      data-id=${e.data_id||"slider"}
      title=${e.title||""}
      class="input-range single"
      style=${`
        --min: ${e.min};
        --max: ${e.max};
        --a: ${e.value};
        ${e.style||""}`}>
      <div class="label-row">
        <label>${e.label}
        ${t}
        </label>
      </div>
      <div class="track-bg"></div>
      <input data-id="a"
        name="rangeInput"
        type="range"
        min=${e.min}
        max=${e.max}
        step=${e.step}
        value=${e.value}
        oninput=${i}>`,e.sliderElement;function i(l){let a=Number(l.target.value);t.value=a,t.dispatchEvent(new Event("change"))}}function Y(e){e.step??=1;let t={...e,data_id:"a",value:e.val_a,rangeInput:"minRangeInput",callback:e.callback_a},i=mapp.ui.elements.numericInput(t),l={...e,data_id:"b",value:e.val_b,rangeInput:"maxRangeInput",callback:e.callback_b},a=mapp.ui.elements.numericInput(l),o=mapp.utils.html.node`
    <div
      role="group"
      class="input-range multi"
      style=${`
        --min: ${e.min};
        --max: ${e.max};
        --a: ${e.val_a};
        --b: ${e.val_b};`}>
      <div 
        class="label-row">
        <label>${e.label_a||"A"}
          ${i}</label>
        <label>${e.label_b||"B"}
          ${a}</label>
      </div>
      <div class="track-bg"></div>
      <input data-id="a" type="range"
        name="minRangeInput"
        min=${e.min}
        max=${e.max}
        step=${e.step}
        value=${e.val_a}
        oninput=${s}/>
      <input data-id="b" type="range"
        name="maxRangeInput"
        min=${e.min}
        max=${e.max}
        step=${e.step}
        value=${e.val_b}
        oninput=${s}/>`;t.sliderElement=o,l.sliderElement=o;function s(n){let r=Number(n.target.value);n.target.dataset.id==="a"&&(i.value=r,i.dispatchEvent(new Event("change"))),n.target.dataset.id==="b"&&(a.value=r,a.dispatchEvent(new Event("change")))}return o}mapp.utils.merge(mapp.dictionaries,{en:{pill_component_remove:"Remove"}});function X(e={}){return e.container=mapp.utils.html.node`<div class="pill-container">`,e.pills=Array.isArray(e.pills)?new Set(e.pills):new Set,e.add=Bt,e.remove=Wt,e.pills.forEach(t=>e.add(t)),e.target instanceof HTMLElement&&e.target.append(e.container),e}function Bt(e){let t=this,i=mapp.utils.html.node`<div
    class="pill"
    style=${t.css_pill}
    data-value=${e}
    title="${e}">${e}`;t.removeCallback&&i.append(mapp.utils.html.node`
    <button
      data-value=${e}
      title=${mapp.dictionary.pill_component_remove}
      class="primary-background"
      onclick=${l=>t.remove(e)}
      >&#10005;`),t.pills.has(e)||t.pills.add(e),t.container.append(i),typeof t.addCallback=="function"&&t.addCallback(e,t.pills)}function Wt(e){let t=this;Array.from(t.container.children).find(l=>l.getAttribute("data-value")===e.toString())?.remove(),t.pills.delete(e),typeof t.removeCallback=="function"&&t.removeCallback(e,t.pills)}function Q(e){return e.placeholder??="",e.data_id??="numeric-input",mapp.utils.html.node`<input
    data-id=${e.data_id}
    type="text"
    style="text-align: right"
    placeholder=${e.placeholder}
    value=${mapp.utils.formatNumericValue(e)}
    onchange=${i=>Pe(i,e)}
    oninput=${i=>Pe(i,e)}>`}function Pe(e,t){t.stringValue=e.target.value,t.newValue=mapp.utils.unformatStringValue(t),Gt(t.newValue,t)?(delete t.invalid,e.target.classList.remove("invalid"),t.sliderElement&&(t.sliderElement.style.setProperty(`--${e.target.dataset.id}`,t.newValue),t.sliderElement.querySelector(`[name=${t.rangeInput}]`).value=t.newValue)):(t.invalid=!0,e.target.classList.add("invalid")),t.callback(t.newValue),!t.invalid&&(e.target.value=mapp.utils.formatNumericValue(t))}function Gt(e,t){return isNaN(e)||t.min&&e<t.min?!1:t.max?e<=t.max:!0}var Ae={btnPanel:Me,card:ze,chkbox:Se,contextMenu:je,drawer:W,drawing:Te,dropdown:qe,dropdown_multi:Oe,numericInput:Q,legendIcon:G,dialog:U,pills:X,helpDialog:De,searchbox:J,slider:K,slider_ab:Y};var p={idle:600},Re=e=>{Object.assign(p,e),p.idle!==0&&(window.onload=f,window.onmousemove=f,window.onmousedown=f,window.ontouchstart=f,window.onclick=f,window.onkeypress=f,f(),Fe())};function f(){p.locked||(p.timeout&&clearTimeout(p.timeout),p.timeout=setTimeout(Ve,p.idle*1e3))}function Ve(){p.locked=!0,p.renew&&clearTimeout(p.renew);let e=new XMLHttpRequest;e.open("GET",`${p.host}/api/user/cookie?destroy=true`),e.onload=t=>location.reload(),e.send()}function Fe(){p.renew=setTimeout(e,(p.idle-20)*1e3);function e(){let t=new XMLHttpRequest;t.open("GET",`${p.host}/api/user/cookie?renew=true`),t.onload=i=>{if(i.target.status===401)return Ve();Fe()},t.send()}}var He=e=>{document.body.append(mapp.utils.html.node`
    <div class="interface-mask">
      <div class="bg-image" style=${`background-image:url(${e.target.src})`}>
      <button class="btn-close mask-icon close"
        onclick=${t=>t.target.parentElement.parentElement.remove()}>`)};var Ne=e=>{e.target.addEventListener("mousedown",i=>{i.preventDefault(),document.body.style.cursor="grabbing",window.addEventListener("mousemove",e.resizeEvent),window.addEventListener("mouseup",t)}),e.target.addEventListener("touchstart",i=>{i.preventDefault(),window.addEventListener("touchmove",e.resizeEvent),window.addEventListener("touchend",t)},{passive:!0});function t(){document.body.style.cursor="auto",window.removeEventListener("mousemove",e.resizeEvent),window.removeEventListener("touchmove",e.resizeEvent),window.removeEventListener("mouseup",t),window.removeEventListener("touchend",t)}};function Ut(e){console.warn("Please change mapp.ui.utils.Tabulator() to mapp.ui.utils.tabulator.create() which requires the Tabulator dataview plugin to be loaded.")}function Zt(e){console.warn("Please change mapp.ui.utils.Chart() to mapp.ui.utils.chartjs.create() which requires the ChartJS dataview plugin to be loaded.")}var Be={Chart:Zt,Tabulator:Ut,idleLogout:Re,imagePreview:He,resizeHandler:Ne};var We=e=>{mapp.utils.merge(mapp.dictionaries,{en:{invalid_lat_long_range:"Invalid coordinates: Latitude and longitude values must be within valid ranges.",invalid_lat_lon:"The provided Coordinates do not fall within the selected Locale."},de:{invalid_lat_long_range:"Falsche Eingabe von Latitude / Longitude.",invalid_lat_lon:"Koordinate liegt au\xDFerhalb der Lokale."}}),e={...e,...mapp.ui.elements.searchbox({target:e.target,name:"gazetteer-search-input",placeholder:e.placeholder,searchFunction:t})};function t(i){if(e.list.innerHTML="",!i.target.value.length)return;let l=i.target.value.split(",").map(parseFloat);if(l.length===2&&l.every(a=>typeof a=="number"&&!isNaN(a)&&isFinite(a))){let[a,o]=l;if(a>=-90&&a<=90&&o>=-180&&o<=180){e.list.appendChild(mapp.utils.html.node`
        <li onclick=${s=>{mapp.utils.gazetteer.getLocation({label:`Latitude:${l[0]}, Longitude:${l[1]}`,source:"Coordinates",lng:l[1],lat:l[0]},e)}}><span>Latitude:${l[0]}, Longitude:${l[1]}</span>`);return}else e.list.appendChild(mapp.utils.html.node`
          <li style="color: red;">
            <span>${mapp.dictionary.invalid_lat_long_range}</span>`)}e.provider&&(Object.hasOwn(mapp.utils.gazetteer,e.provider)?mapp.utils.gazetteer[e.provider](i.target.value,e):console.warn("Requested gazetteer service not available")),mapp.utils.gazetteer.datasets(i.target.value,e)}};self.ui={layers:me,locations:Ce,elements:Ae,utils:Be,Gazetteer:We,Dataview:N,Tabview:B},mapp&&(mapp.ui=ui);})();
//# sourceMappingURL=ui.js.map
