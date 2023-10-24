(()=>{var Ze=Object.create;var A=Object.defineProperty;var Xe=Object.getOwnPropertyDescriptor;var Ke=Object.getOwnPropertyNames;var Ye=Object.getPrototypeOf,Qe=Object.prototype.hasOwnProperty;var g=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(t,l)=>(typeof require!="undefined"?require:t)[l]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var et=(e,t,l,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ke(t))!Qe.call(e,i)&&i!==l&&A(e,i,{get:()=>t[i],enumerable:!(a=Xe(t,i))||a.enumerable});return e};var w=(e,t,l)=>(l=e!=null?Ze(Ye(e)):{},et(t||!e||!e.__esModule?A(l,"default",{value:e,enumerable:!0}):l,e));mapp.utils.merge(mapp.dictionaries,{en:{layer_zoom_to_extent:"Zoom to filtered layer extent",layer_visibility:"Toggle visibility"},de:{layer_zoom_to_extent:"Zoom zum Ausma\xDF des gefilterten Datensatzes",layer_visibility:"Umschalten der Ansicht"},cn:{layer_zoom_to_extent:"\u7F29\u653E\u81F3\u76F8\u5E94\u7B5B\u9009\u8303\u56F4",layer_visibility:"\u5207\u6362\u53EF\u89C1\u6027"},pl:{layer_zoom_to_extent:"Poka\u017C zasi\u0119g warstwy",layer_visibility:"Widoczno\u015B\u0107"},ko:{layer_zoom_to_extent:"\uD544\uD130\uB41C \uB808\uC774\uC5B4\uD06C\uAE30\uC5D0 \uC90C(zoom)",layer_visibility:"\uD1A0\uAE00 \uAC00\uC2DC\uC131"},fr:{layer_zoom_to_extent:"Zoom sur l'\xE9tendue de la couche",layer_visibility:"Changer la visiblit\xE9"},ja:{layer_zoom_to_extent:"\u30D5\u30A3\u30EB\u30BF\u30FC\u3055\u308C\u305F\u30EC\u30A4\u30E4\u30FC\u7BC4\u56F2\u3092\u30BA\u30FC\u30E0\u306B",layer_visibility:"\u8868\u793A\u5207\u66FF"}});var b=e=>{if(e.view===null)return;e.view=mapp.utils.html.node`<div class="layer-view">`;let t=Object.keys(e).map(l=>mapp.ui.layers.panels[l]&&mapp.ui.layers.panels[l](e)).filter(l=>typeof l<"u");if(e.panelOrder=e.panelOrder||["draw-drawer","dataviews-drawer","filter-drawer","style-drawer","meta"],t.sort((l,a)=>e.panelOrder.findIndex(i=>i===l.dataset?.id)<e.panelOrder.findIndex(i=>i===a.dataset?.id)?1:-1),e.drawer!==null){let l=e.filter.zoomToExtent&&mapp.utils.html`
      <button
        data-id=zoomToExtent
        title=${mapp.dictionary.layer_zoom_to_extent}
        class="mask-icon fullscreen"
        onclick=${async o=>{let s=await e.zoomToExtent();o.target.disabled=!s}}>`||"",a=mapp.utils.html.node`
      <button
        data-id=display-toggle
        title=${mapp.dictionary.layer_visibility}
        class="${`mask-icon toggle ${e.display&&"on"||"off"}`}"
        onclick=${o=>e.display?e.hide():e.show()}>`;e.showCallbacks.push(()=>{a.classList.add("on")}),e.hideCallbacks.push(()=>{a.classList.remove("on")});let i=mapp.utils.html`
      <h2>${e.name||e.key}</h2>
      ${l}
      ${a}
      <div class="mask-icon expander"></div>`;e.drawer=mapp.ui.elements.drawer({data_id:"layer-drawer",class:`layer-view raised ${e.classList||""} ${t.length?"":"empty"}`,header:i,content:t}),mapp.utils.render(e.view,e.drawer)}else t.forEach(l=>e.view.append(l));e.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{!e.tables||(e.tableCurrent()===null?(e.view.querySelector("[data-id=layer-drawer]").classList.remove("expanded"),e.view.classList.add("disabled")):e.view.classList.remove("disabled"))})};mapp.utils.merge(mapp.dictionaries,{en:{layer_group_hide_layers:"Hide all layers in group"},de:{layer_group_hide_layers:"Ausschalten aller Ebenen in Gruppe"},cn:{layer_group_hide_layers:"\u9690\u85CF\u56FE\u5C42"},pl:{layer_group_hide_layers:"Ukryj warstwy z tej grupy"},ko:{layer_group_hide_layers:"\uADF8\uB8F9\uC5D0\uC11C \uB808\uC774\uC5B4 \uC228\uAE30\uAE30"},fr:{layer_group_hide_layers:"Cacher les couches du groupe"},ja:{layer_group_hide_layers:"\u30B0\u30EB\u30FC\u30D7\u304B\u3089\u30EC\u30A4\u30E4\u30FC\u3092\u96A0\u3059"}});function I(e){if(!e.mapview||!e.target)return;let t={node:e.target,groups:{}};Object.values(e.mapview.layers).forEach(i=>l(i));function l(i){if(!i.hidden){if(b(i),!i.group){t.node.appendChild(i.view),t.node.dispatchEvent(new CustomEvent("addLayerView",{detail:i}));return}t.groups[i.group]||a(i),t.groups[i.group].addLayer(i),t.node.dispatchEvent(new CustomEvent("addLayerView",{detail:i}))}}function a(i){let o={list:[]};t.groups[i.group]=o;let s=mapp.utils.html.node`
      <button
        class="mask-icon on visibility-off"
        title=${mapp.dictionary.layer_group_hide_layers}
        onclick=${n=>{n.target.style.visibility="hidden",o.list.filter(r=>r.display).forEach(r=>r.hide())}}>`;o.meta=mapp.utils.html.node`<div class="meta">`,o.drawer=mapp.ui.elements.drawer({data_id:"layer-drawer",class:`layer-group ${i.groupClassList||""}`,header:mapp.utils.html`
        <h2>${i.group}</h2>
        ${s}
        <div class="mask-icon expander"></div>`,content:o.meta}),t.node.appendChild(o.drawer),o.chkVisibleLayer=()=>{s.style.visibility=o.list.some(n=>n.display)?"visible":"hidden"},o.addLayer=n=>{if(n.group=o,n.groupmeta){let r=o.meta.appendChild(mapp.utils.html.node`<div>`);r.innerHTML=n.groupmeta}o.list.push(n),o.drawer.appendChild(n.view),o.chkVisibleLayer(),n.showCallbacks.push(()=>o.chkVisibleLayer()),n.hideCallbacks.push(()=>o.chkVisibleLayer())}}}var B={like:P,match:P,numeric:R,integer:R,in:V,ni:V,date:N,datetime:N,boolean:tt,null:lt},_;function $(e,t){clearTimeout(_);let l=e.view.querySelector("[data-id=zoomToExtent]");l&&(l.disabled=!1),_=setTimeout(()=>{_=null,e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))},500)}function P(e,t){return mapp.utils.html.node`
  <input
    type="text"
    onkeyup=${l=>{l.target.value.length?e.filter.current[t.field]={[t.type]:encodeURIComponent(`${t.leading_wildcard&&"%"||""}${l.target.value}`)}:delete e.filter.current[t.field],$(e)}}>`}function tt(e,t){function l(a){e.filter.current[t.field]={boolean:a},e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}return l(!1),mapp.ui.elements.chkbox({label:t.label||t.title||"chkbox",onchange:l})}function lt(e,t){function l(a){e.filter.current[t.field]={null:a},e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}return l(!1),mapp.ui.elements.chkbox({label:t.label||t.title||"chkbox",onchange:l})}async function R(e,t){if(!t.max){let l=await mapp.utils.xhr(`${e.mapview.host}/api/query?${mapp.utils.paramString({template:"field_max",locale:e.mapview.locale.key,layer:e.key,table:e.tableCurrent(),field:t.field})}`);t.max=t.type==="integer"?parseInt(l.max):parseFloat(l.max)}if(!t.min){let l=await mapp.utils.xhr(`${e.mapview.host}/api/query?${mapp.utils.paramString({template:"field_min",locale:e.mapview.locale.key,layer:e.key,table:e.tableCurrent(),field:t.field})}`);t.min=t.type==="integer"?parseInt(l.min):parseFloat(l.min)}return t.step||(t.step=t.type==="integer"?1:.01),e.filter.current[t.field]=Object.assign({gte:Number(t.min),lte:Number(t.max)},e.filter.current[t.field]),$(e),mapp.ui.elements.slider_ab({min:Number(t.min),max:Number(t.max),step:t.step,label_a:mapp.dictionary.layer_filter_greater_than,val_a:Number(t.min),callback_a:l=>{e.filter.current[t.field].gte=Number(l.target.value),$(e)},label_b:mapp.dictionary.layer_filter_less_than,val_b:Number(t.max),callback_b:l=>{e.filter.current[t.field].lte=Number(l.target.value),$(e)}})}async function V(e,t){if(t.distinct){let a=await mapp.utils.xhr(`${e.mapview.host}/api/query?`+mapp.utils.paramString({template:"distinct_values",dbs:e.dbs,locale:e.mapview.locale.key,layer:e.key,table:e.tableCurrent(),field:t.field}));if(!a){console.warn(`Distinct values query did not return any values for field ${t.field}`);return}t[t.type]=[a].flat().map(i=>i[t.field]).filter(i=>i!==null)}let l=new Set(e.filter?.current[t.field]?.[t.type]||[]);return t.dropdown?mapp.ui.elements.dropdown({multi:!0,placeholder:"Select Multiple",entries:t[t.type].map(a=>({title:decodeURIComponent(a),option:encodeURIComponent(a),selected:l.has(a)})),callback:async(a,i)=>{Object.assign(e.filter.current,{[t.field]:{[t.type]:i}}),e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}}):t[t.type].map(a=>mapp.ui.elements.chkbox({val:encodeURIComponent(a),label:decodeURIComponent(a),checked:l.has(a),onchange:(i,o)=>{if(i)e.filter.current[t.field]||(e.filter.current[t.field]={}),e.filter.current[t.field][t.type]||(e.filter.current[t.field][t.type]=[]),e.filter.current[t.field][t.type].push(o);else{let s=e.filter.current[t.field][t.type].indexOf(o);e.filter.current[t.field][t.type].splice(s,1),e.filter.current[t.field][t.type].length||delete e.filter.current[t.field]}e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}}))}function N(e,t){let l=mapp.utils.html.node`
    <input
      data-id="inputAfter"
      onchange=${i}
      type=${t.type==="datetime"&&"datetime-local"||"date"}>`,a=mapp.utils.html.node`
    <input
      data-id="inputBefore"
      onchange=${i}
      type=${t.type==="datetime"&&"datetime-local"||"date"}>`;function i(o){o.target.dataset.id==="inputAfter"&&(e.filter.current[t.field]=Object.assign(e.filter.current[t.field]||{},{gt:new Date(o.target.value).getTime()/1e3})),o.target.dataset.id==="inputBefore"&&(e.filter.current[t.field]=Object.assign(e.filter.current[t.field]||{},{lt:new Date(o.target.value).getTime()/1e3})),e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}return mapp.utils.html`
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 5px;">
      <label>Date after
        ${l}</label>
      <label>Date before
        ${a}</label>`}var H=e=>{let t=mapp.utils.html.node`<p data-id="meta" class="meta">`;return t.innerHTML=e.meta,t};mapp.utils.merge(mapp.dictionaries,{en:{layer_add_new_location:"Add new locations"},de:{layer_add_new_location:"Erstelle neue Lage"},cn:{layer_add_new_location:"\u6570\u636E\u68C0\u89C6"},pl:{layer_add_new_location:"Dodaj nowe miejsca"},ko:{layer_add_new_location:"\uC0C8\uB85C\uC6B4 \uC704\uCE58 \uCD94\uAC00"},fr:{layer_add_new_location:"Ajouter des nouveaux lieux"},ja:{layer_add_new_location:"\u65B0\u3057\u3044\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u8FFD\u52A0"}});var U=e=>{if(typeof e.draw!="object"||e.draw.hidden)return;let t=Object.keys(e.draw).map(a=>mapp.ui.elements.drawing[a]&&mapp.ui.elements.drawing[a](e)).filter(a=>!!a);return t.length?mapp.ui.elements.drawer({data_id:"draw-drawer",class:`raised ${e.draw.classList||""}`,header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_add_new_location}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`
      ${t}`}):void 0};mapp.utils.merge(mapp.dictionaries,{en:{layer_filter_header:"Filter",layer_filter_select:"Select filter from list",layer_filter_clear_all:"Clear all filters",layer_filter_greater_than:"Greater than",layer_filter_less_than:"Less than"},de:{layer_filter_header:"Filter",layer_filter_select:"Filter Auswahl",layer_filter_clear_all:"Entferne alle Filter"},cn:{layer_filter_header:"\u7B5B\u9009",layer_filter_select:"\u4ECE\u5217\u8868\u7B5B\u9009"},pl:{layer_filter_header:"Filtruj",layer_filter_select:"Wybierz filtr z listy"},ko:{layer_filter_header:"\uD544\uD130",layer_filter_select:"\uB9AC\uC2A4\uD2B8\uB85C \uBD80\uD130 \uD544\uD130 \uC120\uD0DD"},fr:{layer_filter_header:"Filtres",layer_filter_select:"Choisir un filtre dans la liste"},ja:{layer_filter_header:"\u30D5\u30A3\u30EB\u30BF\u30FC",layer_filter_select:"\u30EA\u30B9\u30C8\u304B\u3089\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u9078\u629E"}});var G=e=>{if(e.filter.hidden||!e.infoj||(e.filter.list=e.infoj.filter(a=>a.filter!==void 0).filter(a=>!e.filter?.exclude?.includes(a.field)).filter(a=>![a.key,a.field,a.query,a.type,a.group].some(i=>new Set(e.infoj_skip||[]).has(i))).map(a=>(typeof a.filter=="string"&&(a.filter={type:a.filter,field:a.field}),a.filter.title??=a.title,a.filter.field??=a.field,a.filter)),!e.filter.list.length))return;let t=mapp.ui.elements.dropdown({data_id:`${e.key}-filter-dropdown`,placeholder:mapp.dictionary.layer_filter_select,keepPlaceholder:!0,entries:e.filter.list,callback:async(a,i)=>{if(e.filter.view.querySelector("[data-id=clearall]").style.display="block",i.card||(i.remove=()=>{delete e.filter.current[i.field],delete i.card,e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"));let s=e.view.querySelector("[data-id=zoomToExtent]");s&&(s.disabled=!1),e.filter.view.querySelector("[data-id=clearall]").style.display=e.filter.view.children.length===3?"none":"block"},!mapp.ui.layers.filters[i.type]))return;let o=[await mapp.ui.layers.filters[i.type](e,i)].flat();i.meta&&o.unshift(mapp.utils.html.node`<p>${i.meta}`),i.card=e.filter.view.appendChild(mapp.ui.elements.card({header:i.title,close:i.remove,content:o}))}}),l=mapp.utils.html`
    <button
      data-id=clearall
      class="primary-colour"
      style="display: none; margin-bottom: 5px;"
      onclick=${a=>{e.filter.list.filter(o=>o.card).forEach(o=>{o.card.querySelector("[data-id=close]").click()});let i=e.view.querySelector("[data-id=zoomToExtent]");i&&(i.disabled=!1),e.reload()}}>${mapp.dictionary.layer_filter_clear_all}`;return e.filter.view=mapp.ui.elements.drawer({data_id:"filter-drawer",class:`raised ${e.filter.classList||""}`,header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_filter_header}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`
      ${t}
      ${l}`}),e.filter.view};var W=e=>{let t=Object.assign({mapview:e.mapview,target:mapp.utils.html.node`<div>`,layer:e.key},e.gazetteer);return mapp.ui.Gazetteer(t),t.target};mapp.utils.merge(mapp.dictionaries,{en:{layer_dataview_header:"Data Views"},de:{layer_dataview_header:"Datenansichten"},cn:{layer_dataview_header:"\u6570\u636E\u68C0\u89C6"},pl:{layer_dataview_header:"Widoki danych"},ko:{layer_dataview_header:"\uB370\uC774\uD130 \uBCF4\uAE30"},fr:{layer_dataview_header:"Vues des donn\xE9es"},ja:{layer_dataview_header:"\u30C7\u30FC\u30BF\u30D3\u30E5\u30FC"}});var J=e=>{let t=Object.entries(e.dataviews).map(a=>{if(typeof a[1]!="object")return;let i=Object.assign(a[1],{key:a[0],layer:e,host:e.mapview.host}),o=document.querySelector(`[data-id=${i.target}]`);if(!o)return;i.target=mapp.utils.html.node`<div class="dataview-target">`,e.display&&i.display&&s();function s(){if(i.show)return i.show();mapp.ui.Dataview(i).then(()=>i.show()),o.dispatchEvent(new CustomEvent("addTab",{detail:i}))}return e.showCallbacks.push(()=>{i.display&&s()}),mapp.ui.elements.chkbox({label:i.title||i.key,checked:!!i.display,onchange:n=>{i.display=n,i.display?s():i.remove()}})});return e.dataviews.hide?void 0:mapp.ui.elements.drawer({data_id:"dataviews-drawer",class:"raised",header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_dataview_header}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`${t}`})};var Z=e=>{let t=Object.keys(e.reports).map(a=>{let i=e.reports[a];i.key=a,i.host=e.mapview.host;let o=`${i.host}/view?${mapp.utils.paramString({template:i.template,locale:e.mapview.locale.key,lat:mapp.hooks.current?.lat,lng:mapp.hooks.current?.lng,z:mapp.hooks.current?.z})}`;return mapp.utils.html`
      <a
        class="link-with-img"
        target="_blank"
        href="${o}">
        <div class="mask-icon event-note"></div>
        <span>${i.title||i.key}`});return mapp.ui.elements.drawer({data_id:"reports-drawer",class:"raised",header:mapp.utils.html`
      <h3>Reports</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`${t}`})};mapp.utils.merge(mapp.dictionaries,{en:{layer_style_header:"Style",layer_style_select_theme:"Select thematic style",layer_style_display_labels:"Display labels",layer_style_display_hover:"Enable hover",layer_style_switch_caption:"Click on labels to switch visibility or ",layer_style_switch_all:"switch all",layer_grid_legend_ratio:"Display colour as a ratio to the size",layer_style_cluster:"Multiple locations"},de:{layer_style_header:"Stil",layer_style_select_theme:"Auswahl eines thematischen Stiles",layer_style_display_labels:"Umschalten der Label Ansicht",layer_style_switch_caption:"Auswahl der Label schaltet Ansicht um oder ",layer_style_switch_all:"Alle ausw\xE4hlen",layer_grid_legend_ratio:"Farbe im Verh\xE4ltnis zur Gr\xF6\xDFe",layer_style_cluster:"Mehrere Lagen"},cn:{layer_style_header:"\u98CE\u683C\u6837\u5F0F",layer_style_select_theme:"\u9009\u62E9\u4E3B\u9898\u98CE\u683C",layer_style_display_labels:"\u663E\u793A\u6807\u7B7E",layer_style_switch_caption:"\u5355\u51FB\u56FE\u6807\u4EE5\u5207\u6362\u53EF\u89C1\u6027 ",layer_style_switch_all:"\u5168\u90E8\u5207\u6362",layer_grid_legend_ratio:"\u663E\u793A\u989C\u8272\u4E0E\u5C3A\u5BF8\u6BD4\u4F8B",layer_style_cluster:"\u591A\u4E2A\u5730\u70B9"},pl:{layer_style_header:"Styl",layer_style_select_theme:"Wybierz styl tematyczny",layer_style_display_labels:"Poka\u017C etykiety",layer_style_switch_caption:"Kliknij etykiety aby zmieni\u0107 widoczno\u015B\u0107 albo ",layer_style_switch_all:"zmie\u0144 wszystkie",layer_grid_legend_ratio:"Poka\u017C kolor w proporcji do rozmiaru",layer_style_cluster:"Wi\u0119cej miejsc"},ko:{layer_style_header:"\uC2A4\uD0C0\uC77C",layer_style_select_theme:"\uC8FC\uC81C\uBCC4 \uC2A4\uD0C0\uC77C \uC120\uD0DD",layer_style_display_labels:"\uB77C\uBCA8 \uD45C\uC2DC",layer_style_switch_caption:"\uAC00\uC2DC\uC131 \uBCC0\uACBD\uC744 \uC704\uD574 \uB77C\uBCA8 \uD074\uB9AD \uB610\uB294 ",layer_style_switch_all:"\uBAA8\uB450 \uBCC0\uACBD",layer_grid_legend_ratio:"\uD06C\uAE30\uBE44\uC728\uC5D0 \uB530\uB978 \uC0C9\uC0C1 \uD45C\uC2DC",layer_style_cluster:"\uBCF5\uC218 \uC704\uCE58"},fr:{layer_style_header:"Style",layer_style_select_theme:"Choisir un th\xE8me dans la liste",layer_style_display_labels:"Afficher les \xE9tiquettes",layer_style_switch_caption:"Cliquer sur l'etiquette pour changer la visiblit\xE9 ou ",layer_style_switch_all:"changer tout",layer_grid_legend_ratio:"Rapport de coleur et de taille",layer_style_cluster:"Plusieurs lieux"},ja:{layer_style_header:"\u30B9\u30BF\u30A4\u30EB",layer_style_select_theme:"\u30C6\u30FC\u30DE\u30B9\u30BF\u30A4\u30EB\u3092\u9078\u629E",layer_style_display_labels:"\u30E9\u30D9\u30EB\u3092\u8868\u793A",layer_style_switch_caption:"\u8868\u793A\u5207\u66FF\u3048\u306B\u306F\u5404\u30E9\u30D9\u30EB\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u304B ",layer_style_switch_all:"\u5168\u8868\u793A\u6216\u3044\u306F\u5168\u975E\u8868\u793A",layer_grid_legend_ratio:"\u8272\u306F\u30B5\u30A4\u30BA\u306E\u6BD4\u7387\u3067\u8868\u793A",layer_style_cluster:"\u591A\u6570\u306E\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3"}});var X=e=>{if(e.style.hidden)return;let t=[];e.style.opacitySlider&&t.push(mapp.ui.elements.slider({label:"Change layer opacity:",min:0,max:100,val:parseInt(e.L.getOpacity()*100),callback:a=>{e.L.setOpacity(parseFloat(a.target.value/100))}})),e.style.scaleSlider&&t.push(mapp.ui.elements.slider({label:"Change icon scale:",min:e.style.scaleSlider.min,max:e.style.scaleSlider.max,step:e.style.scaleSlider.step,val:e.style.default.icon.scale,callback:a=>{e.style.default.icon.scale=a.target.value,e.L.changed()}})),e.style.hover&&(e.style.hoverCheckbox=mapp.ui.elements.chkbox({data_id:"hoverCheckbox",label:e.style.hovers&&mapp.dictionary.layer_style_display_hover||e.style.hover.title||mapp.dictionary.layer_style_display_hover,checked:!!e.style.hover.display,onchange:a=>{e.style.hover.display=a}}),t.push(e.style.hoverCheckbox),Object.keys(e.style.hovers||0).length>1&&t.push(mapp.ui.elements.dropdown({placeholder:e.style.hover.title,entries:Object.keys(e.style.hovers).map(a=>({title:e.style.hovers[a].title||a,option:a})),callback:(a,i)=>{let o=e.style.hover.display;e.style.hover=e.style.hovers[i.option],e.style.hover.method??=mapp.layer.featureHover,e.style.hover.display=o}}))),e.style.label&&(e.style.labelCheckbox=mapp.ui.elements.chkbox({data_id:"labelCheckbox",label:e.style.labels&&mapp.dictionary.layer_style_display_labels||e.style.label.title||mapp.dictionary.layer_style_display_labels,checked:!!e.style.label.display,onchange:a=>{e.style.label.display=a,e.reload()}}),t.push(e.style.labelCheckbox),Object.keys(e.style.labels||0).length>1&&t.push(mapp.ui.elements.dropdown({placeholder:e.style.label.title,entries:Object.keys(e.style.labels).map(a=>({title:e.style.labels[a].title||a,option:a})),callback:(a,i)=>{let o=e.style.label.display;e.style.label=e.style.labels[i.option],e.style.label.display=o,e.reload()}}))),e.style.label&&e.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{let a=e.mapview.Map.getView().getZoom();a<=e.style.label.minZoom||a>=e.style.label.maxZoom?e.style.labelCheckbox.classList.add("disabled"):e.style.labelCheckbox.classList.remove("disabled")}),Object.keys(e.style.themes||0).length>1?t.push(mapp.utils.html`
      <div>${mapp.dictionary.layer_style_select_theme}</div>
        ${mapp.ui.elements.dropdown({placeholder:e.style.theme.title,entries:Object.keys(e.style.themes).map(a=>({title:e.style.themes[a].title||a,option:a})),callback:(a,i)=>{e.style.theme=e.style.themes[i.option],e.style.theme.setLabel&&e.style.labels&&(e.style.label=e.style.labels[e.style.theme.setLabel]),e.style.theme.setHover&&e.style.hovers&&(e.style.hover=e.style.hovers[e.style.theme.setHover]),e.view.querySelector("[data-id=style-drawer]").replaceChildren(...mapp.ui.layers.panels.style(e).children),e.reload()}})}`):e.style.theme?.title&&t.push(mapp.utils.html`
      <h3>${e.style.theme.title}`);function l(){return mapp.utils.html`
      <button
        style="height: 1.5em; width: 1.5em; float: right; margin-top: 5px;"
        class="mask-icon open-in-new"
        title="Open in Modal"
        onclick=${a=>{let i=a.target;i.style.display="none",mapp.ui.elements.modal({target:e.mapview.Map.getTargetElement(),content:e.style.legend.parentElement,close:()=>{e.style.drawer.append(e.style.legend.parentElement),i.style.display="block"}})}}>`}if(mapp.ui.layers.legends[e.style.theme?.type]&&t.push(mapp.utils.html`
    ${e.style.allowModal&&l()||void 0}
    <div class="legend">
      ${e.style.theme?.meta&&mapp.utils.html`<p>${e.style.theme.meta}`}
      ${mapp.ui.layers.legends[e.style.theme.type](e)}`),!!t.length)return e.style.drawer=mapp.ui.elements.drawer({data_id:"style-drawer",class:`raised ${e.style.classList||""}`,header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_style_header}</h3>
      <div class="mask-icon expander"></div>`,content:t}),e.style.drawer};var y=e=>{let t=e.style.theme.legend,l=e.style.theme,a=[],i=["contents"];i.push(t?.alignContents);let o,s=e.filter&&mapp.utils.html`
      <div
        class="switch-all"
        style="grid-column: 1/3;">
        ${mapp.dictionary.layer_style_switch_caption}
        <button
          class="primary-colour bold"
          onclick=${n=>{let r=[...n.target.closest(".legend").querySelectorAll(".switch")],d=r.filter(c=>c.classList.contains("disabled"));d.length==0||d.length==r.length?r.forEach(c=>c.click()):d.forEach(c=>c.click())}}>${mapp.dictionary.layer_style_switch_all}
        </button>.`;if(Object.entries(l.cat).forEach(n=>{n[1].icon&&(n[1].style={...n[1].style,icon:n[1].icon});let r=Array.isArray(n[1].style?.icon)?n[1].style:Object.assign({},e.style.default,n[1].style||n[1].icon||n[1]);n[1].style?.icon||delete r.icon;let d=mapp.utils.html`
      <div
        style="height: 24px; width: 24px; grid-column: 1;">
        ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},r))}`,c=mapp.utils.html`
      <div
        class=${`label ${e.filter&&"switch"||""} ${e.filter?.current[l.field]?.ni?.indexOf(n[0])>0?"disabled":""}`}
        style="grid-column: 2;"
        onclick=${p=>{!e.filter||(p.target.classList.toggle("disabled"),p.target.classList.contains("disabled")?(e.filter.current[l.field]||(e.filter.current[l.field]={}),e.filter.current[l.field].ni||(e.filter.current[l.field].ni=[]),e.filter.current[l.field].ni.push(n[1].keys||n[0]),e.filter.current[l.field].ni=e.filter.current[l.field].ni.flat()):(Array.isArray(n[1].keys)?n[1].keys.forEach(u=>{e.filter.current[l.field].ni.splice(e.filter.current[l.field].ni.indexOf(u),1)}):e.filter.current[l.field].ni.splice(e.filter.current[l.field].ni.indexOf(n[0]),1),e.filter.current[l.field].ni.length||delete e.filter.current[l.field]),o&&clearTimeout(o),o=setTimeout(()=>{e.style.filter||l.filter?e.L.changed():e.reload()},400))}}>${n[1].label||n[0]}`;a.push(mapp.utils.html`
    <div 
      data-id=${n[0]}
      class="${i.join(" ")}">
      ${d}${c}`)}),e.style.cluster){let n=mapp.utils.html`
      <div
        style="height: 40px; width: 40px;">
        ${mapp.ui.elements.legendIcon(Object.assign({width:40,height:40},e.style.default,e.style.cluster))}`,r=mapp.utils.html`
      <div
        class="label">
        ${mapp.dictionary.layer_style_cluster}`;a.push(mapp.utils.html`
      <div 
        data-id="cluster"
        class=${i.join(" ")}>
        ${n}${r}`)}return e.style.legend=mapp.utils.html.node`
    <div class="legend-wrapper">
      ${s||""}
      <div class=${`contents-wrapper ${t?.layout||"grid"}`}>
        ${a}
  `,e.style.legend};var K=e=>(e.style.legend=mapp.utils.html.node`<div>`,e.style.legend);var x=e=>{function t(l,a){let i;return Array.isArray(l.style?.icon)?i=l.style:i=Object.assign({},a.style.default,l.style||l.icon||l),l.style?.icon||delete i.icon,i.icon||i}return e.style.legend=mapp.utils.html.node`
    <div class="legend-wrapper">
      <div class=${`contents-wrapper ${e.style.theme.legend?.layout||"grid"} ${e.style.theme.legend?.nowrap?"nowrap":""}`}>
        ${e.style.theme.cat_arr.map(l=>mapp.utils.html`
            <div 
              data-id=${l.value}
              class=${`contents ${e.style.theme.legend?.horizontal?"horizontal":""}`}
            >
              <div style="height: 24px; width: 24px; grid-column: 1;">
                ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},t(l,e)))}
              </div>
              <div class="label" style="grid-column: 2;">
                ${l.label||l.value}
              </div>
            </div>
          `)}
      </div>
    </div>
  `,e.style.legend};var L=e=>{let t=[],l=mapp.utils.html`
  <div
    style="height: 24px; width: 24px;">
    ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},Object.assign({},e.style.default,e.style.theme.style)))}`;return t.push(mapp.utils.html`
    <div 
      class="contents">
      ${l}<div class="label">${e.style.theme.label}`),e.style.legend=mapp.utils.html.node`<div class="contents-wrapper grid">${t}`,e.style.legend};var Y={view:b,listview:I,filters:B,panels:{meta:H,draw:U,style:X,filter:G,gazetteer:W,reports:Z,dataviews:J},legends:{categorized:y,distributed:K,graduated:x,basic:L},styles:{categorized:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),y(e)),graduated:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),x(e)),grid:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),grid(e)),basic:e=>(console.warn("Please use mapp.layers.legends instead of mapp.layers.styles"),L(e))}};mapp.utils.merge(mapp.dictionaries,{en:{location_zoom:"Zoom map to feature bounds",location_save:"Save changes to cloud",location_remove:"Remove feature from selection",location_delete:"Delete location"},de:{location_zoom:"Ansicht den Lagen Geometrien anpassen",location_save:"Speichern der Daten\xE4nderungen",location_remove:"Lagen Auswahl aufheben",location_delete:"L\xF6schen der Lage"},cn:{location_zoom:"\u7F29\u653E\u5730\u56FE\u81F3\u76EE\u6807\u8303\u56F4",location_save:"\u5C06\u66F4\u6539\u4FDD\u5B58\u81F3\u4E91",location_remove:"\u5220\u9664\u6240\u9009\u76EE\u6807\u8981\u7D20",location_delete:"\u5220\u9664\u5730\u70B9"},pl:{location_zoom:"Poka\u017C zasi\u0119g miejsca",location_save:"Zapisz zmiany",location_remove:"Odznacz miejsce",location_delete:"Usu\u0144 miejsce"},ko:{location_zoom:"\uD55C\uACC4\uB97C \uD3EC\uD568\uD55C \uC90C \uC9C0\uB3C4",location_save:"\uBCC0\uACBD\uC0AC\uD56D \uD06C\uB77C\uC6B0\uB4DC \uC800\uC7A5",location_remove:"\uC120\uD0DD\uC5D0\uC11C \uD2B9\uC9D5 \uC81C\uAC70",location_delete:"\uC704\uCE58 \uC0AD\uC81C"},fr:{location_zoom:"Zoom sur le lieu",location_save:"Enregistrer les modifications",location_remove:"Le d\xE9s\xE9lectionner",location_delete:"Supprimer le lieu"},ja:{location_zoom:"\u30D5\u30A3\u30FC\u30C1\u30E3\u7BC4\u56F2\u306B\u306F\u30DE\u30C3\u30D7\u3092\u30BA\u30FC\u30E0",location_save:"\u30AF\u30E9\u30A6\u30C9\u306B\u5909\u66F4\u3092\u4FDD\u5B58",location_remove:"\u9078\u629E\u304B\u3089\u30D5\u30A3\u30FC\u30C1\u30E3\u30FC\uFF08\u6A5F\u80FD\uFF09\u3092\u524A\u9664",location_delete:"\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u524A\u9664"}});var Q=e=>{e.removeCallbacks?.push(function(){e.view.remove()});let t=[mapp.utils.html`<h2>${e.record.symbol}`,mapp.utils.html`<div class="mask-icon expander">`];e.infoj.some(l=>(l.type==="pin"||l.type==="geometry")&&l.value)&&t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_zoom}
      class = "mask-icon search"
      onclick = ${l=>{e.flyTo()}}>`),e.layer?.toggleLocationViewEdits&&e.infoj.some(l=>typeof l.edit<"u")&&(e.removeEdits=()=>{e.infoj.filter(l=>typeof l.edit<"u").forEach(l=>{delete l.newValue,l._edit=l.edit,delete l.edit})},!e.new&&e.removeEdits(),e.editToggle=mapp.utils.html.node`
      <button
        title = "Enable edits"
        class = ${`mask-icon edit ${e.new&&"on"||""}`}
        onclick = ${l=>{l.target.classList.contains("on")?(l.target.classList.remove("on"),e.removeEdits()):(l.target.classList.add("on"),e.infoj.forEach(a=>{!a._edit||(a.edit=a._edit,delete a._edit)})),e.viewEntries.remove(),e.viewEntries=e.view.appendChild(mapp.ui.locations.infoj(e))}}>`,t.push(e.editToggle)),t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_save}
      class = "btn-save mask-icon done"
      style = "display: none;"
      onclick = ${l=>{e.view.classList.add("disabled"),e.update()}}>`),e.updateCallbacks?.push(function(){e.view.dispatchEvent(new Event("updateInfo"))}),(e.layer?.edit?.delete||e.layer?.deleteLocation)&&t.push(mapp.utils.html`
      <button
        title = ${mapp.dictionary.location_delete}
        class = "mask-icon trash"
        onclick = ${l=>{e.trash()}}>`),t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_remove}
      class = "mask-icon close no"
      onclick = ${l=>{e.remove()}}>`),e.view=mapp.ui.elements.drawer({class:"location-view raised expanded",header:t}),e.viewEntries=e.view.appendChild(mapp.ui.locations.infoj(e)),e.view.querySelector(".header").style.borderBottom=`3px solid ${e.record.colour}`,e.view.addEventListener("valChange",l=>{if(l.detail.valChangeMethod instanceof Function){l.detail.valChangeMethod(l.detail);return}l.detail.value!=l.detail.newValue?l.detail.node.classList.add("val-changed"):(delete l.detail.newValue,l.detail.node.classList.remove("val-changed")),e.view.querySelector(".btn-save").style.display=e.infoj.some(a=>typeof a.newValue<"u")&&"inline-block"||"none"}),e.view.addEventListener("updateInfo",()=>{e.viewEntries.remove(),e.view.querySelector(".btn-save").style.display="none",e.editToggle&&(e.editToggle.classList.remove("on"),e.removeEdits()),e.layer?.dataviews&&Object.values(e.layer.dataviews).forEach(l=>{l.display===!0&&l.update()}),e.view.classList.remove("disabled"),e.viewEntries=e.view.appendChild(mapp.ui.locations.infoj(e))})};mapp.utils.merge(mapp.dictionaries,{en:{location_clear_all:"Clear locations",location_listview_full:"The listview for locations is full."},de:{location_clear_all:"Entferne Auswahl"},cn:{location_clear_all:"\uBAA8\uB4E0 \uC704\uCE58 \uC81C\uAC70"},pl:{location_clear_all:"Wyczy\u015B\u0107 selekcje"},ko:{location_clear_all:"\u6E05\u9664\u6240\u6709\u5730\u70B9"},fr:{location_clear_all:"Des\xE9lectionner tous les lieux."},ja:{location_clear_all:"\u5168\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u30AF\u30EA\u30A2"}});var ee=e=>{e.mapview||console.warn("A mapview is required in the locations listview params argument."),e.target||console.warn("A target element is required in the locations listview params argument.");let t=e.mapview.locale?.listview_records||[{symbol:"A",colour:"#2E6F9E"},{symbol:"B",colour:"#EC602D"},{symbol:"C",colour:"#5B8C5A"},{symbol:"D",colour:"#B84444"},{symbol:"E",colour:"#514E7E"},{symbol:"F",colour:"#E7C547"},{symbol:"G",colour:"#368F8B"},{symbol:"H",colour:"#841C47"},{symbol:"I",colour:"#61A2D1"},{symbol:"J",colour:"#37327F"}],l=e.target.appendChild(mapp.utils.html.node`
    <button 
      style="display: none; width: 100%; text-align: right;"
      class="tab-display bold primary-colour text-shadow"
      onclick=${i=>{Object.values(e.mapview.locations).forEach(o=>o.remove())}}>
      ${mapp.dictionary.location_clear_all}`);e.mapview.locations=new Proxy(e.mapview.locations,{set:function(i,o,s){let n=t.find(r=>!r.hook);return n?(Reflect.set(...arguments),n.hook=s.hook,s.record=n,s.style={strokeColor:n.colour,fillColor:n.colour,fillOpacity:.1},s.Style=mapp.utils.style([{strokeColor:"#000",strokeOpacity:.1,strokeWidth:8},{strokeColor:"#000",strokeOpacity:.1,strokeWidth:6},{strokeColor:"#000",strokeOpacity:.1,strokeWidth:4},{strokeColor:s.style.strokeColor||"#000",strokeWidth:2,fillColor:s.style.fillColor||"#fff",fillOpacity:s.style.fillOpacity||.2}]),s.pinStyle=mapp.utils.style({icon:{type:"markerLetter",letter:n.symbol,color:s.style.strokeColor,scale:3,anchor:[.5,1]}}),mapp.ui.locations.view(s),Object.values(e.target.children).forEach(r=>r.classList.remove("expanded")),e.target.insertBefore(s.view,l.nextSibling),s.view.dispatchEvent(new Event("addLocationView")),l.style.display="block",document.querySelector("[data-id=locations]").click(),document.querySelector("[data-id=locations]").style.display="block",!0):(alert(mapp.dictionary.location_listview_full),!0)},deleteProperty:function(i,o){Reflect.deleteProperty(...arguments);let s=t.find(n=>n.hook===o);return s&&delete s.hook,setTimeout(a,300),!0}});function a(){if(!document.querySelectorAll("#locations > .location-view").length){document.querySelector("[data-id=layers]").click(),l.style.display="none";let i=document.querySelector("#locations input");i?i.value="":document.querySelector("[data-id=locations]").style.display="none"}}};var le=(e,t)=>{if(!e.infoj)return;let l=mapp.utils.html.node`<div class="location-view-grid">`,a={};for(let i of t||e.infoj){if(e.view&&e.view.classList.contains("disabled"))break;if(i.listview=l,i.type=i.type||"text",i.objectAssignFromField){let s=i.location.infoj.find(n=>n.field===i.objectAssignFromField);s&&Object.assign(i,s.value)}if(i.objectMergeFromField){let s=i.location.infoj.find(n=>n.field===i.objectMergeFromField);s&&mapp.utils.merge(i,s.value)}if(i.objectMergeFromEntry){let s=i.location.infoj.find(n=>n.type===i.objectMergeFromEntry);s&&s.merge instanceof Object&&mapp.utils.merge(i,s.merge)}if(Array.isArray(i.location?.layer?.infoj_skip)&&[i.key,i.field,i.query,i.type,i.group].some(s=>new Set(i.location?.layer?.infoj_skip).has(s))||i.skipEntry||te(i))continue;if(i.nullValue&&i.value===null&&!i.defaults&&!i.edit&&(i.value=i.nullValue),i.group&&(a[i.group]||(i.expanded&&(console.warn('entry.expanded is deprecated. Use entry.groupClassList: "expanded" instead.'),i.groupClassList+=" expanded"),a[i.group]=i.listview.appendChild(mapp.ui.elements.drawer({class:`group ${i.groupClassList&&"expanded"||""}`,header:mapp.utils.html`
              <h3>${i.group}</h3>
              <div class="mask-icon expander"></div>`}))),i.listview=a[i.group]),i.node=i.listview.appendChild(mapp.utils.html.node`
      <div
        data-type=${i.type}
        class=${`contents ${i.type} ${i.class||""} ${i.inline&&"inline"||""}`}>`),i.title&&i.node.append(mapp.ui.locations.entries.title(i)),(i.value===null||typeof i.value>"u")&&(i.value=i.default||i.value),i.query&&(i.queryparams=Object.assign(i.queryparams||{},i.location.layer.queryparams||{},i.location.layer.mapview.locale.queryparams||{}),i.queryCheck||i.run===!0)){let s=mapp.utils.paramString(mapp.utils.queryParams(i));mapp.utils.xhr(`${i.host||i.location.layer.mapview.host}/api/query?${s}`).then(n=>{if(i.value=n,te(i)){i.node.remove();return}let r=mapp.ui.locations.entries[i.type]?.(i);r&&i.node.append(r)});continue}if(!Object.hasOwn(mapp.ui.locations.entries,i.type)){console.warn(`entry.type:${i.type} method not found.`);continue}let o=mapp.ui.locations.entries[i.type]?.(i);if(o==="break")break;o&&i.node.append(o)}return l};function te(e){if(e.skipFalsyValue&&!e.value?.length&&!e.edit||e.skipUndefinedValue&&typeof e.value>"u"&&!e.edit||e.skipNullValue&&e.value===null&&!e.edit)return!0}var ae=e=>{let t=mapp.ui.elements.chkbox({label:e.label||e.title,checked:e.value,disabled:!e.edit,onchange:a=>{e.newValue=a,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}});return mapp.utils.html.node`${t}`};var at={image:ot,images:st,documents:nt},it={image:ie,images:ie,documents:rt},k=e=>at[e.type](e);function ot(e){if(e.value){let t=mapp.utils.html`
      <button 
        style="position: absolute; width: 2em; height: 2em; right: 0.5em; top: 0.5em;"
        class="mask-icon trash no"
        data-name=${e.value.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}
        data-src=${e.value}
        onclick=${l=>C(l,e)}>`;return mapp.utils.html.node`
      <div style="position: relative;">
        <img
          style="width: 100%"
          src=${e.value}
          onclick=${mapp.ui.utils.imagePreview}>
          ${e.edit&&t}`}if(e.edit)return mapp.utils.html.node`
      <input
        type="file"
        accept="image/*;capture=camera"
        onchange=${t=>E(t,e)}>`}function st(e){let t=e.value?.map(l=>{let a=mapp.utils.html`
      <button
        class="mask-icon trash no"
        data-name=${l.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}
        data-src=${l}
        onclick=${i=>C(i,e)}>`;return mapp.utils.html`
      <div>
        <img 
          src=${l}
          onclick=${mapp.ui.utils.imagePreview}>
          ${e.edit&&a}`})||[];if(e.edit&&t.push(mapp.utils.html.node`
    <div class="mask-icon add-photo pos-center">
      <input
        type="file"
        accept="image/*;capture=camera"
        onchange=${l=>E(l,e)}>`),!!t.length)return e.list=mapp.utils.html.node`<div class="images-grid">${t}`,e.list}function nt(e){let t=e.value?.map(l=>{let a=mapp.utils.html`
      <button
        class="mask-icon trash no"
        data-name=${l.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}
        data-href=${l}
        onclick=${i=>C(i,e)}>`;return mapp.utils.html`
      <div class="link-with-img">
        ${e.edit&&a}
          <a
            target="_blank"
            href=${l}>${l.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")}`})||[];if(e.uploadBtn=mapp.utils.html.node`
    <div class="mask-icon cloud-upload">
      <input
        style="opacity: 0; width: 3em; height: 3em;"
        type="file"
        accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document;"
        onchange=${l=>E(l,e)}>`,e.edit&&t.push(e.uploadBtn),!!t.length)return e.list=mapp.utils.html.node`<div>${t}`,e.list}async function E(e,t){t.location.view?.classList.add("disabled");let l=new FileReader;!e.target.files[0]||(t.file=e.target.files[0],l.onload=a=>it[t.type](a,t),l.readAsDataURL(t.file))}function ie(e,t){let l=new Image;l.onload=async()=>{let a=mapp.utils.html.node`<canvas>`,i=1024,o=l.width,s=l.height;o>s&&o>i?(s*=i/o,o=i):s>i&&(o*=i/s,s=i),a.width=o,a.height=s,a.getContext("2d").drawImage(l,0,0,o,s);let n=a.toDataURL("image/jpeg",.5),r=t.file.name.replace(/^.*\//,"").replace(/\.([\w-]{3})/,"")+t.suffix_date?`@${Date.now()}`:"",d=await mapp.utils.xhr({method:"POST",requestHeader:{"Content-Type":"application/octet-stream"},url:`${t.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({public_id:r,resource_type:"image",folder:t.cloudinary_folder})}`,body:mapp.utils.dataURLtoBlob(n)});if(!d||d.error){let p=`Cloudinary Image upload failed!${d?.error?.message?` Error: ${d.error.message}`:""}`;alert(p);return}t.type==="image"?t.value=d.secure_url:t.value=Array.isArray(t.value)?t.value.concat([d.secure_url]):[d.secure_url],S(t)},l.src=e.target.result}async function rt(e,t){let l=await mapp.utils.xhr({method:"POST",requestHeader:{"Content-Type":"application/octet-stream"},url:`${t.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({public_id:t.file.name,resource_type:"raw",folder:t.cloudinary_folder})}`,body:e.target.result});if(!l||l.error){let i=`Cloudinary document upload failed!${l?.error?.message?` Error: ${l.error.message}`:""}`;alert(i);return}t.value=Array.isArray(t.value)?t.value.concat([l.secure_url]):[l.secure_url],S(t)}async function C(e,t){if(!confirm("Remove item?"))return;await mapp.utils.xhr(`${t.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({destroy:!0,public_id:e.target.dataset.name,folder:t.cloudinary_folder})}`);let l=new Set(t.value);l.delete(e.target.dataset.src||e.target.dataset.href),t.type==="image"?t.value=null:t.value=l.size?Array.from(l):null,S(t)}async function S(e){e.location.view?.classList.add("disabled"),await mapp.utils.xhr({method:"POST",url:`${e.location.layer.mapview.host}/api/location/update?`+mapp.utils.paramString({locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,id:e.location.id}),body:JSON.stringify({[e.field]:e.value})});let t=mapp.ui.locations.entries[e.type](e);mapp.utils.render(e.node,t),e.title&&t.before(mapp.ui.locations.entries.title(e)),e.location.view?.classList.remove("disabled")}var se=e=>{if(e.data??=e.value,e.data===null?(delete e.display,e.disabled=!0):delete e.disabled,e.layer=e.location.layer,e.host=e.host||e.location.layer.mapview.host,e.dependents&&e.dependents.some(t=>e.location.infoj.some(l=>!l.value&&l.field===t))&&delete e.display,e.update)return e.display&&e.update(),mapp.utils.html.node`
      ${e.chkbox||""}
      ${e.locationViewTarget||""}`;if(typeof e.target=="string"&&document.getElementById(e.target)){e.target=document.getElementById(e.target),mapp.ui.Dataview(e).then(()=>e.update());return}if(e.tabview=e.tabview||typeof e.target=="string"&&document.querySelector(`[data-id=${e.target}]`),e.tabview&&(e.target=mapp.utils.html.node`<div class="dataview-target">`,e.display&&oe(e)),!e.target){console.warn("type:dataview entry must have a target");return}return typeof e.target=="string"&&(e.locationViewTarget=mapp.utils.html.node`
      <div
        class="${`location ${e.class}`}">`,e.target=e.locationViewTarget,e.display&&mapp.ui.Dataview(e).then(()=>e.update())),e.chkbox=e.label&&mapp.ui.elements.chkbox({label:e.label,disabled:e.disabled,checked:!!e.display,onchange:t=>{if(e.display=t,e.locationViewTarget){if(!e.display){e.locationViewTarget.style.display="none";return}e.locationViewTarget.style.display="block",typeof e.update=="function"&&e.update(),typeof e.update!="function"&&mapp.ui.Dataview(e).then(()=>{typeof e.data=="object"?e.setData(e.data):e.update()});return}e.display?oe(e):e.remove()}}),mapp.utils.html.node`
    ${e.chkbox||""}
    ${e.locationViewTarget||""}`};function oe(e){if(e.show)return e.show();mapp.ui.Dataview(e).then(()=>{e.tab_style=`border-bottom: 3px solid ${e.location.style.strokeColor}`,e.tabview.dispatchEvent(new CustomEvent("addTab",{detail:e})),e.display&&e.show()})}var T=e=>{let t;return e.edit?t=mapp.utils.html.node`
      <input
        type=${e.type==="datetime"&&"datetime-local"||"date"}
        value=${e.value&&(e.type==="datetime"&&new Date(e.value*1e3).toISOString().split("Z")[0]||new Date(e.value*1e3).toISOString().split("T")[0])}
        onchange=${a=>{e.newValue=new Date(a.target.value).getTime()/1e3,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`:t=e.value&&new Date(e.value*1e3).toLocaleString(e.locale,e.options),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${t}`};var ne=e=>{let t=e.value;return t||(t=e.defaults==="user"&&mapp.user?.email||e.nullValue,t&&mapp.utils.xhr({method:"POST",url:`${e.location.layer.mapview.host}/api/location/update?`+mapp.utils.paramString({locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.layer.table,id:e.location.id}),body:JSON.stringify({[e.field]:t})})),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${e.prefix}${t}${e.suffix}`};var re=e=>{if(e.value=typeof e.value=="string"&&JSON.parse(e.value)||e.value,e.display=e.display&&e.value,e.edit?.draw&&(e.draw=e.edit.draw),e._edit?.draw&&delete e.draw,!e.value&&!e.draw)return;e.mapview=e.location.layer.mapview,e.style={...e.location?.style,...e.style},e.Style??=mapp.utils.style(e.style),e.show=dt;let t=mapp.ui.elements.chkbox({label:e.label||"Geometry",data_id:`${e.field}-chkbox`,checked:!!e.display,disabled:!e.value,onchange:i=>{i?e.show():(e.display=!1,e.L&&e.location.layer.mapview.Map.removeLayer(e.L))}});e.display&&e.show();let l=[];if(pt(e,l),e.edit&&e.value){let i=e.edit?.modifyBtnOnly?.label||"Modify Geometry",o=mapp.utils.html.node`
      <button
        class="flat bold wide primary-colour"
        onclick=${s=>ct(s,e)}>
        ${i}`;if(e.edit?.modifyBtnOnly)return o;l.push(o)}e.value&&e.edit?.delete&&l.push(mapp.utils.html`
    <button
      class="flat wide no-colour"
      onclick=${()=>{if(e.display){i();return}e.show(),setTimeout(i,500);async function i(){!confirm("Delete Geometry?")||(e.value=null,j(e))}}}>Delete Geometry`);let a=e.style&&mapp.utils.html`
    ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},e.style))}`;return l.length>0?mapp.ui.elements.drawer({data_id:"draw-drawer",class:e.draw?.classList,header:mapp.utils.html`
        ${t}
        <div class="mask-icon expander"></div>
        ${a}`,content:mapp.utils.html`
        ${l}`}):mapp.utils.html.node`<div class="flex-spacer">${t}${a}`};function dt(){this.display=!0;let e=this.location.view?.querySelector(`[data-id=${this.field}-chkbox] input`);e&&(e.checked=!0),this.L&&(this.location.layer.mapview.Map.removeLayer(this.L),delete this.L),this.L=this.location.layer.mapview.geoJSON({zIndex:this.zIndex||99,geometry:this.value,Style:this.Style,dataProjection:this.srid||this.location?.layer?.srid}),this.location.Layers.push(this.L)}function ct(e,t){let l=e.target;if(l.classList.contains("active")){t.mapview.interactions.highlight();return}l.classList.add("active"),!t.display&&t.show(),t.location.layer.mapview.Map.removeLayer(t.L);let a=t.L.getSource().getFeatures()[0];t.mapview.interactions.modify({Feature:a.clone(),layer:t.location.layer,snap:t.edit.snap,srid:t.srid||t.location.layer.srid,callback:i=>{if(l.classList.remove("active"),delete t.mapview.interaction,setTimeout(()=>{!t.mapview.interaction&&t.mapview.interactions.highlight()},400),i){t.value=i.geometry,j(t);return}t.location.layer.mapview.Map.addLayer(t.L)}})}function pt(e,t){!e.draw||(e.draw.callback=l=>{!l||(e.value=l.geometry,j(e))},Object.keys(e.draw).forEach(l=>{mapp.ui.elements.drawing[l]&&t.push(mapp.ui.elements.drawing[l](e))}))}async function j(e){e.L&&(e.location.layer.mapview.Map.removeLayer(e.L),delete e.L),e.location.view?.classList.add("disabled"),await mapp.utils.xhr({method:"POST",url:`${e.location.layer.mapview.host}/api/location/update?`+mapp.utils.paramString({locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,id:e.location.id}),body:JSON.stringify({[e.field]:e.value})}),e.location.layer.geom===e.field&&e.location.layer.reload();let t=mapp.ui.locations.entries[e.type](e);mapp.utils.render(e.node,t),e.title&&t.before(mapp.ui.locations.entries.title(e)),e.location.view?.classList.remove("disabled")}var de=e=>{let t=mapp.utils.html`
    <pre><code>${JSON.stringify(e.value,null,2)}`;return e.edit&&(t=mapp.utils.html`
    <textarea
      style="auto; min-height: 50px;"
      onfocus=${a=>{a.target.style.height=a.target.scrollHeight+"px"}}
      onfocusout=${a=>{a.target.style.height="auto"}}
      oninput=${a=>{e.json=(()=>{try{return JSON.parse(a.target.value)}catch{return!1}})(),a.target.style.border=e.json?"none":"1px solid red"}}
      onkeyup=${a=>{e.newValue=typeof e.json!="object"?e.value:e.json,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}
      onkeydown=${a=>setTimeout(()=>{a.target.style.height="auto",a.target.style.height=a.target.scrollHeight+"px"},100)}>${JSON.stringify(e.value,null,2)}`),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">${t}`};var ce=e=>{if(e.panel)return e.panel;if(e.mapview=e.location.layer.mapview,e.Layer=e.mapview.layers[e.layer],!e.Layer){console.warn("mvt_clone Layer not found in mapview.layers object.");return}e.style??=e.Layer.style,e.style.default&&(e.style.default={...e.location?.style,...e.style.default}),e.L=new ol.layer.VectorTile({source:e.Layer.L.getSource(),renderBuffer:200,zIndex:e.zIndex,style:mapp.layer.Style(e)}),e.Layer.clones.add(e.L),e.style.themes&&(e.style.theme||=e.style.themes[Object.keys(e.style.themes)[0]]),e.show=async()=>{if(e.display=!0,e.L&&e.featureLookup){e.style.panel&&(e.style.panel.style.display="block");try{e.mapview.Map.addLayer(e.L)}catch{}return}let a=mapp.utils.paramString(mapp.utils.queryParams(e));if(e.featureLookup=await mapp.utils.xhr(`${e.host||e.mapview.host}/api/query?${a}`),e.featureLookup===null){e.panel.querySelector("input").disabled=!0;return}e.style.panel=mapp.ui.layers.panels.style(e),e.style.panel&&(e.panel.append(e.style.panel),e.view=e.panel),e.mapview.Map.addLayer(e.L),e.location.removeCallbacks.push(()=>{e.mapview.Map.removeLayer(e.L),e.Layer.clones.delete(e.L)})},e.hide=async()=>{e.display=!1,e.style.panel&&(e.style.panel.style.display="none"),e.mapview.Map.removeLayer(e.L),e.Layer.clones.delete(e.L)},e.reload=()=>e.L?.changed();let t=mapp.ui.elements.chkbox({label:e.label||"MVT Clone",data_id:`${e.field}-chkbox`,checked:!!e.display,onchange:a=>a?e.show():e.hide()});e.display&&e.show(),e.panel=mapp.utils.html.node`<div>${t}`;function l(){if(!!e.Layer.tables&&e.featureLookup!==null){if(e.Layer.tableCurrent()===null){e.panel.querySelector("input").disabled=!0,e.style.panel&&(e.style.panel.style.display="none"),!e.display&&e.mapview.Map.removeLayer(e.L);return}e.panel.querySelector("input").disabled=!1,e.style.panel&&(e.style.panel.style.display="block");try{e.display&&e.mapview.Map.addLayer(e.L)}catch{}}}return l(),e.mapview.Map.getTargetElement().addEventListener("changeEnd",l),e.location.removeCallbacks.push(()=>{e.mapview.Map.removeLayer(e.L),e.mapview.Map.getTargetElement().removeEventListener("changeEnd",l)}),e.panel};var O=e=>(ut(e),e.edit?e.edit.range?mt(e):ft(e):vt(e));function ut(e){if(!isNaN(e.value))if(e.type==="integer"){let t={maximumFractionDigits:0};e.value=parseFloat(e.value).toLocaleString(e?.formatterParams?.locale||"en-GB",t)}else e.value=parseFloat(e.value).toLocaleString(e?.formatterParams?.locale||"en-GB",e?.formatterParams?.options)}function mt(e){return mapp.ui.elements.slider({min:e.edit.range.min,max:e.edit.range.max,val:e.value,callback:t=>{e.newValue=e.type==="integer"?parseInt(t.target.value):parseFloat(t.target.value),e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}})}function ft(e){return mapp.utils.html.node`
    <input
      type="number"
      value=${e.value}
      placeholder=${e.edit.placeholder}
      onkeyup=${t=>ht(t,e)}
    >`}function ht(e,t){t.type==="integer"&&(e.target.value=parseInt(e.target.value)),t.newValue=e.target.value,t.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:t}))}function vt(e){return mapp.utils.html.node`
    <div class="val" style=${e.css_val}>
      ${e.prefix}${e.value}${e.suffix}
    </div>`}var pe=e=>{e.srid=e.srid||e.location.layer.srid,e.location.layer.mapview.Map.removeLayer(e.L),e.L=e.location.layer.mapview.geoJSON({zIndex:1/0,geometry:{type:"Point",coordinates:e.value},dataProjection:e.srid,Style:e.style&&mapp.utils.style(e.style)||e.Style||e.location.pinStyle}),e.location.layer.display&&e.location.layer.L?.changed(),e.location.Layers.push(e.L);let t=mapp.ui.elements.chkbox({label:e.label||"Pin",checked:!0,onchange:a=>{e.display=a,a?e.location.layer.mapview.Map.addLayer(e.L):e.location.layer.mapview.Map.removeLayer(e.L)}});return mapp.utils.html.node`${t}`};var M=e=>{if(e.params??={},e.report&&(e.url??=`${e.location.layer.mapview.host}/view?`,Object.assign(e.params,{template:e.report.template,id:e.location.id,layer:e.location.layer.key,locale:e.location.layer.mapview.locale.key}),e.label??=e.report.label||"Report",e.icon_class??="mask-icon wysiwyg"),!e.url){console.warn("An entry.url must be defined for the URL path.");return}e.icon_class??="mask-icon open-in-new",e.label??="Link";let t=e.url+mapp.utils.paramString(e.params);return mapp.utils.html.node`
    <div class="link-with-img">
      <div style=${e.icon_style||""} class=${e.icon_class}></div>
      <a target="_blank" href=${t}>${e.label}`};var ue=e=>{let t=document.querySelector(`[data-id=${e.target}]`);e.tab_style=`border-bottom: 3px solid ${e.location.style.strokeColor}`,t.dispatchEvent(new CustomEvent("addTab",{detail:e})),e.display&&e.show();let l=mapp.ui.elements.chkbox({label:e.label,checked:!!e.display,onchange:a=>{e.display=a,e.display?e.show():e.remove()}});return mapp.utils.html.node`${l}`};var fe=e=>{if(!(!e.edit&&!e.value))return e.edit?gt(e):mapp.utils.html.node`
    <div
      class="val"
      style=${e.css_val}>
      ${e.prefix}${e.value}${e.suffix}`};function gt(e){return e.edit.options?(e.container=mapp.utils.html.node`<div>Loading...`,e.edit.options.length?me(e):mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"distinct_values",dbs:e.location.layer.dbs,locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,filter:e.location.layer.filter?.current,table:e.location.layer.tableCurrent(),field:e.field})).then(t=>{e.edit.options=[t].flat().map(l=>Object.values(l)[0]),me(e)}),e.container):mapp.utils.html.node`
    <input
      type="text"
      maxlength=${e.edit.maxlength}
      value="${e.value||""}"
      placeholder="${e.edit.placeholder||""}"
      onkeyup=${t=>{e.newValue=t.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`}function me(e){let t=e.edit.options.map(a=>({title:a===null?null:typeof a=="string"&&a||Object.keys(a)[0],option:a===null?null:typeof a=="string"&&a||Object.values(a)[0]})),l=t.find(a=>a.option===e.value);mapp.utils.render(e.container,mapp.ui.elements.dropdown({placeholder:e.edit.placeholder,span:l?.title||e.value,entries:t,callback:(a,i)=>{e.newValue=i.option,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}))}var F=e=>{let t=e.type!=="html"?e.value:"";e.edit&&(t=mapp.utils.html`
    <textarea
      style="auto; min-height: 50px;"
      maxlength=${e.edit.maxlength}
      placeholder="${e.edit.placeholder||""}"
      onfocus=${a=>{a.target.style.height=a.target.scrollHeight+"px"}}
      onfocusout=${a=>{a.target.style.height="auto"}}
      onkeyup=${a=>{e.newValue=a.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}
      onkeydown=${a=>setTimeout(()=>{a.target.style.height="auto",a.target.style.height=a.target.scrollHeight+"px"},100)}>
      ${e.value||""}`);let l=mapp.utils.html.node`
  <div
    class="val"
    style="${`${e.css_val||""}`}">${t}`;return!e.edit&&e.type==="html"&&(l.innerHTML=e.value||""),l};var he=e=>{let t,l=e.value&&e.value.toString().replace(".",":");return l=l&&l.length<3&&`${l}:00`||l,e.edit?t=mapp.utils.html.node`
      <input
        type="time"
        value=${l}
        onchange=${i=>{e.newValue=parseFloat(i.target.value.replace(":",".")),e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`:t=l,mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${t}`};var ge=e=>{if(e.panel)return e.panel;e.mapview=e.location.layer.mapview,e.style??={},e.style.default&&(e.style.default={...e.location?.style,...e.style.default});let t=mapp.ui.elements.chkbox({label:e.label||"MVT Clone",data_id:`${e.field}-chkbox`,checked:!!e.display,onchange:l=>l?ve(e):wt(e)});return e.display&&ve(e),e.panel=mapp.utils.html.node`<div>${t}`,e.location.removeCallbacks.push(()=>{e.mapview.Map.removeLayer(e.L)}),e.panel};async function ve(e){if(e.display=!0,e.L){e.style.panel&&(e.style.panel.style.display="block");try{e.mapview.Map.addLayer(e.L)}catch{}return}let t=mapp.utils.paramString(mapp.utils.queryParams(e));e.features=await mapp.utils.xhr(`${e.host||e.mapview.host}/api/query?${t}`),mapp.layer.formats[e.format](e),e.style.panel=mapp.ui.layers.panels.style(e),e.style.panel&&e.panel.append(e.style.panel),e.mapview.Map.addLayer(e.L),e.location.removeCallbacks.push(()=>{e.mapview.Map.removeLayer(e.L)})}function wt(e){e.display=!1,e.style.panel&&(e.style.panel.style.display="none"),e.mapview.Map.removeLayer(e.L)}var we={boolean:ae,dataview:se,date:T,datetime:T,defaults:ne,documents:k,geometry:re,html:F,image:k,images:k,integer:O,json:de,key:bt,link:M,mvt_clone:ce,numeric:O,pin:pe,report:M,tab:ue,text:fe,textarea:F,time:he,title:$t,vector_layer:ge};function bt(e){return mapp.utils.html.node`
  <div class="layer-key">
    <span>
      ${e.location.layer.name}`}function $t(e){let t=e.tooltip?mapp.utils.html`
  <span
    style="line-height: 1; margin-left: 0.4em;"
    class="mobile-display-none mask-icon question-mark">${e.tooltip}`:"";return mapp.utils.html.node`
    <div
      class="label"
      style=${e.css_title}
      title=${e.tooltip}>${e.title}
      ${t}`}var be={view:Q,listview:ee,infoj:le,entries:we};var $e=async e=>{if(typeof e.target=="string"&&(e.target=document.getElementById(e.target)),!e.target){console.warn("Dataview creation requires a target key-value"),console.log(e);return}if(e.queryparams={...e.queryparams,...e.layer?.queryparams,...e.layer?.mapview?.locale?.queryparams,...e.location?.layer?.queryparams,...e.location?.layer?.mapview?.locale?.queryparams},e.update=async()=>{if(!e.query)return;let t=mapp.utils.queryParams(e),l=mapp.utils.paramString(t),a=await mapp.utils.xhr(`${e.host||e.location.layer.mapview.host}/api/query?${l}`);if(!(a instanceof Error)){if(typeof e.responseFunction=="function"){e.responseFunction(a);return}typeof e.setData=="function"&&e.setData(a)}},e.toolbar&&e.target instanceof HTMLElement){let t=mapp.utils.html.node`<div class="dataview-target">`,l=typeof e.toolbar=="function"&&e.toolbar()||Object.keys(e.toolbar).map(a=>mapp.ui.elements.toolbar_el[a]?.(e));e.panel=e.target.appendChild(mapp.utils.html.node`
        <div class="flex-col">
          <div class="btn-row">${l}</div>
          ${t}`),e.target=t}return e.chart&&await mapp.ui.utils.Chart(e),typeof e.columns<"u"&&(console.warn("Table dataviews should be configured inside a tables object"),e.table={columns:e.columns}),e.table&&await mapp.ui.utils.Tabulator(e),e.mapChange&&e.layer&&e.layer.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{e.layer&&!e.layer.display||e.tab&&!e.tab.classList.contains("active")||typeof e.mapChange=="function"&&e.mapChange()||e.update()}),e};var ke=e=>{if(!!e.node)return e.tabs=e.node.appendChild(mapp.utils.html.node`<div class="tabs">`),e.panel=e.node.appendChild(mapp.utils.html.node`<div class="panel">`),e.id&&e.node.setAttribute("data-id",e.id),e.addTab=kt,e.node.addEventListener("addTab",t=>e.addTab(t.detail)),e};function kt(e){let t=this;e.location?e.location.removeCallbacks.push(()=>e.remove()):e.layer&&(e.layer.showCallbacks.push(()=>{e.display&&e.show()}),e.layer.hideCallbacks.push(()=>{e.remove()})),e.tab=mapp.utils.html.node`
    <div class="tab">
      <button
        .disabled=${e.disabled}
        class="header"
        style="${e.tab_style||""}"
        onclick=${l}>
          ${e.label||e.title||e.key||"Tab"}`,e.show&&t.tabs.append(e.tab),e.panel=e.panel||e.target||mapp.utils.html.node`
    <div class="${`panel ${e.class||""}`}">`,e.panel.addEventListener("activate",()=>{e.update&&e.update()}),e.show=l,e.remove=a;function l(){mapp.utils.render(t.panel,e.panel),t.tabs.childNodes.forEach(i=>i.classList.remove("active")),!e.tab.parentElement&&t.tabs.append(e.tab),e.tab.classList.add("active"),t.timer&&window.clearTimeout(t.timer),t.timer=window.setTimeout(()=>{if(e.panel instanceof HTMLElement){e.panel.dispatchEvent(new CustomEvent("activate"));return}e.target instanceof HTMLElement&&e.target.dispatchEvent(new CustomEvent("activate"))},500),t.showTab&&t.showTab(e)}function a(){if(!e.tab.parentElement)return;let i=e.tab.nextElementSibling||e.tab.previousElementSibling;if(e.tab.remove(),i)return i.querySelector(".header").click();t.removeLastTab&&t.removeLastTab()}}var _e=e=>mapp.utils.html.node`
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
    ${e.content}`;var ye=e=>mapp.utils.html.node`
  <label 
    data-id=${e.data_id||"chkbox"}
    class="checkbox">
    <input
      type="checkbox"
      .disabled=${!!e.disabled}
      .checked=${!!e.checked}
      onchange=${t=>{e.onchange&&e.onchange(t.target.checked,e.val)}}>
    </input>
    <div></div>
    <span>${e.label}`;var xe={modify:_t,draw:yt};mapp.utils.merge(mapp.dictionaries,{en:{remove_last_vertex:"Remove last vertex",delete_vertex:"Remove vertex"},de:{remove_last_vertex:"Entferne letzten Scheitelpunkt",delete_vertex:"Entferne Scheitelpunkt"},cn:{remove_last_vertex:"\u5220\u9664\u6700\u540E\u4E00\u4E2A\u9876\u70B9"},pl:{remove_last_vertex:"Usu\u0144 ostatni wierzcho\u0142ek"},ko:{remove_last_vertex:"\uB9C8\uC9C0\uB9C9 \uC815\uC810(\uAF2D\uC9C0\uC810) \uC81C\uAC70"},fr:{remove_last_vertex:"Effacer le dernier point"},ja:{remove_last_vertex:"\u6700\u5F8C\u306E\u30D0\u30FC\u30C6\u30C3\u30AF\u30B9\u3092\u524A\u9664"}});function _t(e){e&&e.preventDefault();let t=[];t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish(this.interaction.getFeature())}>
      ${mapp.dictionary.save}`),t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish()}>
      ${mapp.dictionary.cancel}`),this.popup({coords:this.interaction.vertices[this.interaction.vertices.length-1],content:mapp.utils.html.node`<ul>${t}`})}function yt(e){if(this.interaction.vertices.length===0)return;let t=[];t.push(mapp.utils.html`
  <li
    onclick=${()=>this.interaction.finish(this.interaction.getFeature())}>
      ${mapp.dictionary.save}`),t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish()}>
      ${mapp.dictionary.cancel}`),setTimeout(()=>this.popup({coords:this.interaction.vertices[this.interaction.vertices.length-1],content:mapp.utils.html.node`<ul>${t}`,autoPan:!0}),100)}var Le=e=>mapp.utils.html.node`
  <div 
    data-id=${e.data_id||"drawer"}
    class=${`drawer expandable ${e.class||""}`}>
    <div
      class="header"
      onclick=${t=>{if(!t.target.parentElement.classList.contains("empty")){if(t.target.parentElement.classList.contains("expanded"))return t.target.parentElement.classList.remove("expanded");e.accordion&&[...t.target.parentElement.parentElement.children].forEach(l=>{l.classList.remove("expanded")}),t.target.parentElement.classList.add("expanded")}}}>
      ${e.header}
    </div>
    ${e.content}`;var Ee={point:xt,line:Lt,polygon:Et,rectangle:Ct,circle_2pt:St,circle:Tt,locator:jt};mapp.utils.merge(mapp.dictionaries,{en:{draw_point:"Point",draw_position:"Current Position",draw_polygon:"Polygon",draw_rectangle:"Rectangle",circle_config:"Circle configuration",draw_circle:"Circle from Centre",draw_circle_2pt:"Manual Circle",draw_line:"Line",create:"Create"},de:{draw_point:"Punkt",draw_polygon:"Polygon",draw_rectangle:"Rechteck",draw_circle:"Kreis",draw_line:"Linie",create:"Erstellen"},cn:{draw_point:"\u70B9",draw_polygon:"\u591A\u8FB9\u5F62",draw_rectangle:"\u957F\u65B9\u5F62",draw_circle:"\u5708",draw_line:"\u7EBF"},pl:{draw_point:"Punkt",draw_polygon:"Poligon",draw_rectangle:"Prostok\u0105t",draw_circle:"Okrag",draw_line:"Linia"},ko:{draw_point:"\uC810",draw_polygon:"\uB2E4\uAC01\uD615",draw_rectangle:"\uC9C1\uC0AC\uAC01\uD615",draw_circle:"\uC6D0",draw_line:"\uC120"},fr:{draw_point:"Point",draw_polygon:"Polygone",draw_rectangle:"Rectangle",draw_circle:"Cercle",draw_line:"Ligne"},ja:{draw_point:"\u30DD\u30A4\u30F3\u30C8",draw_polygon:"\u30DD\u30EA\u30B4\u30F3",draw_rectangle:"\u9577\u65B9\u5F62",draw_circle:"\u4E38",draw_line:"\u7DDA"}});function xt(e){e.draw.point=Object.assign({layer:e,type:"Point"},typeof e.draw.point=="object"&&e.draw.point||{});let t=e.draw.point?.label||mapp.dictionary.draw_point;return e.draw.point.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${l=>{let a=l.target;if(a.classList.contains("active")){a.classList.remove("active"),e.mapview.interactions.highlight();return}a.classList.add("active"),!e.display&&e.show(),e.draw.point.callback=i=>{e.draw.callback(i,e.draw.point),a.classList.remove("active"),delete e.mapview.interaction,setTimeout(()=>{!e.mapview.interaction&&e.mapview.interactions.highlight()},400)},e.mapview.interactions.draw(e.draw.point)}}>
      ${t}`,e.draw.point.btn}function Lt(e){e.draw.line=Object.assign({layer:e,type:"LineString"},typeof e.draw.line=="object"&&e.draw.line||{});let t=e.draw.line?.label||mapp.dictionary.draw_line;return e.draw.line.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${l=>{let a=l.target;if(a.classList.contains("active")){a.classList.remove("active"),e.mapview.interactions.highlight();return}a.classList.add("active"),!e.display&&e.show(),e.draw.line.callback=i=>{e.draw.callback(i,e.draw.polygon),a.classList.remove("active"),delete e.mapview.interaction,setTimeout(()=>{!e.mapview.interaction&&e.mapview.interactions.highlight()},400)},e.mapview.interactions.draw(e.draw.line)}}>
      ${t}`,e.draw.line.btn}function Et(e){e.draw.polygon=Object.assign({layer:e,type:"Polygon"},typeof e.draw.polygon=="object"&&e.draw.polygon||{});let t=e.draw.polygon?.label||mapp.dictionary.draw_polygon;return e.draw.polygon.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${l=>{let a=l.target;if(a.classList.contains("active")){a.classList.remove("active"),e.mapview.interactions.highlight();return}a.classList.add("active"),!e.display&&e.show(),e.draw.polygon.callback=i=>{e.draw.callback(i,e.draw.polygon),a.classList.remove("active"),delete e.mapview.interaction,setTimeout(()=>{!e.mapview.interaction&&e.mapview.interactions.highlight()},400)},e.mapview.interactions.draw(e.draw.polygon)}}>
      ${t}`,e.draw.polygon.btn}function Ct(e){e.draw.rectangle=Object.assign({layer:e,type:"Circle",geometryFunction:ol.interaction.Draw.createBox()},typeof e.draw.rectangle=="object"&&e.draw.rectangle||{});let t=e.draw.rectangle?.label||mapp.dictionary.draw_rectangle;return e.draw.rectangle.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${l=>{let a=l.target;if(a.classList.contains("active")){a.classList.remove("active"),e.mapview.interactions.highlight();return}a.classList.add("active"),!e.display&&e.show(),e.draw.rectangle.callback=i=>{e.draw.callback(i,e.draw.rectangle),a.classList.remove("active"),delete e.mapview.interaction,setTimeout(()=>{!e.mapview.interaction&&e.mapview.interactions.highlight()},400)},e.mapview.interactions.draw(e.draw.rectangle)}}>
      ${t}`,e.draw.rectangle.btn}function St(e){e.draw.circle_2pt=Object.assign({layer:e,type:"Circle",geometryFunction:ol.interaction.Draw.createRegularPolygon(33)},typeof e.draw.circle_2pt=="object"&&e.draw.circle_2pt||{});let t=e.draw.circle_2pt?.label||mapp.dictionary.draw_circle_2pt;return e.draw.circle_2pt.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"
      onclick=${l=>{let a=l.target;if(a.classList.contains("active")){a.classList.remove("active"),e.mapview.interactions.highlight();return}a.classList.add("active"),!e.display&&e.show(),e.draw.circle_2pt.callback=i=>{e.draw.callback(i,e.draw.circle_2pt),a.classList.remove("active"),delete e.mapview.interaction,setTimeout(()=>{!e.mapview.interaction&&e.mapview.interactions.highlight()},400)},e.mapview.interactions.draw(e.draw.circle_2pt)}}>
      ${t}`,e.draw.circle_2pt.btn}function Tt(e){e.draw.circle=Object.assign({layer:e,type:"Point",units:"meter",radius:100,radiusMin:1,radiusMax:1e3,unitConversion:{meter:i=>i,km:i=>i*1e3,miles:i=>i*1609.34,meter2:i=>Math.sqrt(i/Math.PI),km2:i=>Math.sqrt(i*1e6/Math.PI)},geometryFunction:i=>new ol.geom.Polygon.circular(ol.proj.toLonLat(i),e.draw.circle.unitConversion[e.draw.circle.units](e.draw.circle.radius),64).transform("EPSG:4326","EPSG:3857")},typeof e.draw.circle=="object"&&e.draw.circle||{});let t=e.draw.circle?.label||mapp.dictionary.draw_circle,l=mapp.utils.html.node`
    <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
      <div style="grid-column: 1;">Units</div>
      <div style="grid-column: 2;">
        ${mapp.ui.elements.dropdown({placeholder:e.draw.circle.units,entries:[{title:"Meter",option:"meter"},{title:"KM",option:"km"},{title:"Miles",option:"miles"},{title:"Meter\xB2",option:"meter2"},{title:"KM\xB2",option:"km2"}],callback:(i,o)=>{e.draw.circle.units=o.option}})}`,a=mapp.ui.elements.slider({label:"Radius",min:e.draw.circle.radiusMin,max:e.draw.circle.radiusMax,val:e.draw.circle.radius,callback:i=>{e.draw.circle.radius=parseFloat(i.target.value)}});return e.draw.circle.panel=mapp.utils.html.node`
    <div class="panel flex-col">
      ${l}
      ${a}`,e.draw.circle.btn=mapp.utils.html.node`
  <button
    class="flat wide bold primary-colour"
    onclick=${i=>{let o=i.target;if(o.classList.contains("active")){o.classList.remove("active"),e.mapview.interactions.highlight();return}o.previousElementSibling.classList.add("expanded"),o.classList.add("active"),!e.display&&e.show(),e.draw.circle.callback=s=>{e.draw.callback(s,e.draw.circle),o.classList.remove("active"),delete e.mapview.interaction,setTimeout(()=>{!e.mapview.interaction&&e.mapview.interactions.highlight()},400)},e.mapview.interactions.draw(e.draw.circle)}}>${t}`,mapp.utils.html.node`<div>
    ${mapp.ui.elements.drawer({header:mapp.utils.html`
        <h3>${mapp.dictionary.circle_config}</h3>
        <div class="mask-icon expander"></div>`,content:e.draw.circle.panel})}
    ${e.draw.circle.btn}`}function jt(e){return e.draw.locator=Object.assign({layer:e,type:"Point"},typeof e.draw.locator=="object"&&e.draw.locator||{}),e.draw.locator.btn=mapp.utils.html.node`
    <button
      class="flat wide bold primary-colour"  
      onclick=${t=>{mapp.utils.getCurrentPosition(async l=>{let a={layer:e,table:e.tableCurrent(),new:!0},i=ol.proj.transform([parseFloat(l.coords.longitude),parseFloat(l.coords.latitude)],"EPSG:4326",`EPSG:${e.srid}`);a.id=await mapp.utils.xhr({method:"POST",url:`${e.mapview.host}/api/location/new?`+mapp.utils.paramString({locale:e.mapview.locale.key,layer:e.key,table:a.table}),body:JSON.stringify({[e.geom]:{type:"Point",coordinates:i}})}),mapp.location.get(a)})}}>${mapp.dictionary.draw_position}`,e.draw.locator.btn}var Ce=e=>{e.selectedTitles=new Set,e.selectedOptions=new Set;let t=e.entries.map(l=>{let a=mapp.utils.html.node`<li onclick=${i=>{let o=i.target.closest("button.dropdown");if(!e.multi&&o.classList.toggle("active"),e.multi){i.target.classList.toggle("selected"),i.target.classList.contains("selected")?(e.selectedTitles.add(l.title),e.selectedOptions.add(l.option)):(e.selectedTitles.delete(l.title),e.selectedOptions.delete(l.option)),o.querySelector("[data-id=header-span]").textContent=e.selectedTitles.size&&Array.from(e.selectedTitles).map(s=>decodeURIComponent(s)).join(", ")||e.span||e.placeholder,e.callback?.(i,Array.from(e.selectedOptions));return}e.keepPlaceholder||(o.querySelector("[data-id=header-span]").textContent=l.title),e.callback?.(i,l)}}>${l.title}`;return l.selected&&(a.classList.add("selected"),e.selectedTitles.add(l.title),e.selectedOptions.add(l.option)),a});return mapp.utils.html.node`
    <button 
      data-id=${e.data_id||"dropdown"}
      class="dropdown">
      <div class="head" onclick=${l=>{let a=l.target.getBoundingClientRect(),i=document.body.getBoundingClientRect();if(l.target.nextElementSibling.style.maxHeight=`${i.height-a.bottom}px`,l.target.nextElementSibling.style.width=`${l.target.offsetWidth}px`,l.target.parentElement.classList.contains("active")){l.target.parentElement.classList.remove("active");return}document.querySelectorAll("button.dropdown").forEach(o=>o.classList.remove("active")),l.target.parentElement.classList.add("active")}}>
      <span data-id=header-span>${e.selectedTitles.size&&Array.from(e.selectedTitles).join(", ")||e.span||e.placeholder}
      </span>
      <div class="icon"></div>
      </div>
      <ul>${t}`};var Se=e=>(console.warn("mapp.ui.elements.dropdown should be used with the multi flag"),e.multi=!0,mapp.ui.elements.dropdown(e));var Te=e=>mapp.utils.html.node`
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
            <div class="panel">${e.panel}`}`;var je=new XMLSerializer,Oe=e=>{if(e.svg||e.type||e.icon){if(Array.isArray(e.icon)){let i=function(){if(--a)return;let s=ol.render.toContext(l.getContext("2d"),{size:[e.width,e.height],pixelRatio:1}),n=e.icon[0].anchor||[.5,.5];e.icon.forEach(r=>{s.setStyle(r.legendStyle),s.drawGeometry(new ol.geom.Point([l.width*n[0],l.height*n[1]]))})};e.icon=e.icon.filter(s=>s);let l=document.createElement("canvas");l.width=e.width,l.height=e.height;let a=e.icon.length++,o=e.icon[0].legendScale||1;return e.icon.forEach(s=>{if(s.legendStyle){i();return}s.type&&Object.hasOwn(mapp.utils.svgSymbols,s.type)&&(s.url=mapp.utils.svgSymbols[s.type](s));try{s.legendStyle=new ol.style.Style({image:new ol.style.Icon({src:s.svg||s.url,crossOrigin:"anonymous",scale:o*(s.scale||1),anchor:s.legendAnchor||s.anchor||[.5,.5]})})}catch(r){console.error(r),console.log(s);return}let n=s.legendStyle.getImage();n.getImage(1).addEventListener("load",i),n.load()}),l}let t=`
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: ${e.width+"px"||"100%"};
      height: ${e.height+"px"||"100%"};
      background-image:url(${e.icon?.svg||e.svg||e.icon?.url||e.url||mapp.utils.svgSymbols[e.icon?.type||e.type](e.icon||e)})`;return mapp.utils.html`<div style=${t}>`}if(!e.fillColor){let t=`
      M 0,${e.height/2}
      L ${e.width/2},${e.height/2}
      ${e.width/2},${e.height/2}
      ${e.width},${e.height/2}`,l=mapp.utils.svg.node`
      <svg height=${e.height} width=${e.width}>
        <path d=${t}
          fill="none"
          stroke=${e.strokeColor}
          stroke-width=${e.strokeWidth||1}/>`,a=`data:image/svg+xml,${encodeURIComponent(je.serializeToString(l))}`,i=`
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: ${e.width}px;
      height: ${e.height}px;
      background-image: url(${a});`;return mapp.utils.html`<div style=${i}>`}if(e.fillColor){let t=mapp.utils.svg.node`
      <svg height=${e.height} width=${e.width}>
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
          stroke-width=${e.strokeWidth||1}>`,l=`data:image/svg+xml,${encodeURIComponent(je.serializeToString(t))}`,a=`
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: ${e.width}px;
      height: ${e.height}px;
      background-image: url(${l});`;return mapp.utils.html`<div style=${a}>`}};var Me=e=>{if(!(e.target instanceof HTMLElement))return;e.modal=e.target.appendChild(mapp.utils.html.node`
    <div 
      style="top: 10px; right: 10px; overflow: auto;"
      data-id=${e.data_id||"modal"}
      class="modal">
      <div class="header bold">
        <span>${e.header}</span>
        <button
          data-id=close
          class="mask-icon close"
          onclick=${t}>
      </div>
      ${e.content}`),e.modal.style.width=e.width||"50%",e.modal.style.height=e.height||"50%";function t(r){r.target.closest(".modal").remove(),e?.close?.(r)}function l(){e.modal.addEventListener("mousedown",a),e.modal.addEventListener("touchstart",a)}function a(r){if(r.target.matches("input, textarea"))return;e.modal.style.cursor="grabbing";let d={mousedown:{move:"mousemove",end:"mouseup"},touchstart:{move:"touchmove",end:"touchend"}},{move:c,end:p}=d[r.type];window.addEventListener(c,n),window.addEventListener(p,i)}function i(){e.modal.style.cursor="grab",o=void 0,s=void 0,window.removeEventListener("mousemove",n),window.removeEventListener("touchmove",n),window.removeEventListener("mouseup",i),window.removeEventListener("touchend",i)}let o,s;function n(r){let d=r.touches&&r.touches[0].pageX||r.pageX,c=r.touches&&r.touches[0].pageY||r.pageY;if(!o||!s){o=d,s=c;return}let p=parseInt(e.modal.style.right)+(o-d),u=parseInt(e.modal.style.top)+(c-s),m=document.documentElement.getBoundingClientRect(),h=window.innerWidth-p-e.modal.offsetWidth/2,D=u+e.modal.offsetHeight/2;h<m.left||h>m.right||D<m.top||D>m.bottom||(e.modal.style.right=p+"px",e.modal.style.top=u+"px",o=d,s=c)}l()};var Fe=e=>{return mapp.utils.html.node`
    <div
      role="group"
      data-id=${e.data_id||"slider"}
      title=${e.title||""}
      class="input-range single"
      style=${`--min: ${e.min}; --max: ${e.max}; --a: ${e.val}; ${e.style||""}`}>
      <div class="label-row">
        <label>${e.label}</label>
        <input data-id="a"
          type="number"
          min=${e.min}
          max=${e.max}
          step=${e.step||1}
          value=${e.val}
          oninput=${t}></input>
      </div>
      <div class="track-bg"></div>
      <input data-id="a"
        type="range"
        min=${e.min}
        max=${e.max}
        step=${e.step||1}
        value=${e.val}
        oninput=${t}>`;function t(l){let a=parseFloat(l.target.value);(isNaN(a)||a<e.min)&&(a=e.min);let i=l.target.closest(".input-range");a>e.max&&(i.style.setProperty("--max",a),i.querySelectorAll("input").forEach(o=>o.max=a)),i.style.setProperty(`--${l.target.dataset.id}`,a),i.querySelectorAll("input").forEach(o=>{o.dataset.id==l.target.dataset.id&&o!=l.target&&(o.value=a)}),e.callback&&e.callback(l)}};var qe=e=>{let t=mapp.utils.html.node`
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
          <input data-id="a" type="number"
            value=${e.val_a}
            min=${e.min}
            max=${e.max}
            style="--c: var(--a)"
            oninput=${l}></input>
        </label>
        <label>${e.label_b||"B"}
          <input data-id="b" type="number"
            value=${e.val_b}
            min=${e.min}
            max=${e.max}
            style="--c: var(--b)"
            oninput=${l}></input>
        </label>
      </div>
      <div class="track-bg"></div>
      <input data-id="a" type="range"
        min=${e.min}
        max=${e.max}
        step=${e.step||1}
        value=${e.val_a}
        oninput=${l}/>
      <input data-id="b" type="range"
        min=${e.min}
        max=${e.max}
        step=${e.step||1}
        value=${e.val_b}
        oninput=${l}/>`;function l(a){a.target.value=a.target.value>e.max?e.max:a.target.value,t.style.setProperty(`--${a.target.dataset.id}`,a.target.value),t.querySelectorAll("input").forEach(i=>{i.dataset.id==a.target.dataset.id&&i!=a.target&&(i.value=a.target.value)}),a.target.dataset.id==="a"&&typeof e.callback_a=="function"&&e.callback_a(a),a.target.dataset.id==="b"&&typeof e.callback_b=="function"&&e.callback_b(a)}return t};var ze={viewport:Ot,layerfilter:Mt,download_json:Ft,download_csv:qt,clear_table_filters:zt};function Ot(e){return mapp.utils.html`
    <button class=${`flat ${e.viewport&&"active"||""}`}
      onclick=${t=>{t.target.classList.toggle("active"),e.viewport=!e.viewport,e.update()}}>Viewport`}function Mt(e){return mapp.utils.html`
    <button class=${`flat ${e.queryparams.filter&&"active"||""}`}
      onclick=${t=>{t.target.classList.toggle("active"),e.queryparams.filter=!e.queryparams.filter,e.update()}}>Layer Filter`}function Ft(e){return mapp.utils.html`
    <button class="flat"
      onclick=${()=>{e.Tabulator.download("json",`${e.title||"table"}.json`)}}>Export as JSON`}function qt(e){return mapp.utils.html`
    <button class="flat"
      onclick=${()=>{if(!!e.data.length){if(e.toolbar.download_csv instanceof Object){let t=e.data.map(l=>e.toolbar.download_csv.fields.map(a=>l[a.field]&&a.string?`"${l[a.field].replace('"','\\"')}"`:l[a.field]));t.unshift(e.toolbar.download_csv.fields.map(l=>l.title||l.field)),mapp.utils.csvDownload(t,e.toolbar.download_csv);return}e.Tabulator.download("csv",`${e.title||"table"}.csv`)}}}>Download as CSV`}function zt(e){return mapp.utils.html`
    <button class="flat"
      onclick=${()=>{e.Tabulator.clearFilter(!0)}}>Clear Filters`}var De={btnPanel:Te,card:_e,chkbox:ye,contextMenu:xe,drawer:Le,drawing:Ee,dropdown:Ce,dropdown_multi:Se,legendIcon:Oe,modal:Me,slider:Fe,slider_ab:qe,toolbar_el:ze};var Ae,q=null;async function Dt(e,t){return Ae??=new Promise(l=>{if(window.Chart){q=window.Chart,l();return}Promise.all([import("https://cdn.jsdelivr.net/npm/chart.js/+esm"),import("https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels/+esm"),import("https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation/+esm")]).then(a=>{a[0].Chart.register(...a[0].registerables),a[0].Chart.register(a[1].default),a[0].Chart.register(a[2].default),q=a[0].Chart,l()}).catch(a=>{console.error(a.message),alert("Failed to load Chart.js library. Please reload the browser.")})}),await Ae,new q(e,t)}async function Ie(e){let t=e.target.appendChild(mapp.utils.html.node`<canvas>`);e.ChartJS=await Dt(t,mapp.utils.merge({type:"bar",options:{plugins:{legend:{display:!1},datalabels:{display:!1}}}},e.chart)),e.setData=l=>{e.noDataMask&&!l?(e.noDataMask=typeof e.noDataMask=="string"?e.noDataMask:"No Data",e.target.style.display="none",e.mask??=mapp.utils.html.node`<div class="dataview-mask">${e.noDataMask}`,e.target.parentElement?.append(e.mask)):(e.mask?.remove(),e.target.style.display="block"),l??={datasets:[{data:[]}]},l.datasets??=[{data:l}],e.data=l,e.chart.datasets?.length&&l.datasets.forEach((a,i)=>Object.assign(a,e.chart.datasets[i])),l.labels??=e.chart.labels,e.ChartJS.data=l,e.ChartJS.update(),typeof e.setDataCallback=="function"&&e.setDataCallback(e)},e.data&&e.setData(e.data)}var Pe,z=null;async function At(){Pe??=new Promise(l=>{if(window.Tabulator){z=window.Tabulator,l();return}document.getElementsByTagName("HEAD")[0].append(mapp.utils.html.node`
      <link rel="stylesheet" href="https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator.min.css"/>`),Promise.all([import("https://unpkg.com/tabulator-tables@5.5.2/dist/js/tabulator_esm.min.js")]).then(a=>{z=a[0].TabulatorFull,l()}).catch(a=>{console.error(a.message),alert("Failed to load Tabulator library. Please reload the browser.")})}),await Pe;let e=new z(...arguments);await new Promise(l=>e.on("tableBuilt",l));let t=e.element.querySelectorAll(".ul-parent");return t.length&&e.on("scrollHorizontal",l=>{let a=e.element.getBoundingClientRect();for(let i of t){let o=i.getBoundingClientRect(),s=i.querySelector("ul");s&&(s.style.left=`${o.left-a.left}px`)}}),e}async function Re(e){if(mapp.ui.utils.tabulator.columns(e),e.Tabulator=await At(e.target,{selectable:!1,...e.table}),e.table.autoResize===!1){let t=0;e.resizeObserver=new ResizeObserver(()=>{clearTimeout(t),t=setTimeout(()=>{e.target.offsetHeight>9&&e.Tabulator.redraw()},800)}),e.resizeObserver.observe(e.target)}It(e),e.setData=Pt,e.data&&e.setData(e.data)}function It(e){typeof e.events=="object"&&Object.entries(e.events).forEach(t=>{if(typeof mapp.ui.utils.tabulator[t[1].util||t[1]]=="function"){e.Tabulator.on(t[0],mapp.ui.utils.tabulator[t[1].util||t[1]](e,t[1]));return}typeof t[1]=="function"&&e.Tabulator.on(t[0],t[1])})}function Pt(e){this.noDataMask&&!e?(this.noDataMask=typeof this.noDataMask=="string"?this.noDataMask:"No Data",this.target.style.display="none",this.mask??=mapp.utils.html.node`<div class="dataview-mask">${this.noDataMask}`,this.target.parentElement?.append(this.mask)):(this.mask?.remove(),this.target.style.display="block"),e??=[],e&&=Array.isArray(e)?e:[e],this.Tabulator.setData(e),this.data=e,typeof this.setDataCallback=="function"&&this.setDataCallback(_this)}var Ve={headerFilter:{like:Vt,numeric:Nt,set:Ht,date:Bt},formatter:{toLocalString:Gt,date:Wt},select:Ut,columns:Rt};function Rt(e){e.table.columns.forEach(l=>t(l));function t(l){if(Array.isArray(l.columns)){l.columns.forEach(a=>t(a));return}typeof l.headerFilter=="string"&&mapp.ui.utils.tabulator.headerFilter[l.headerFilter]&&(l.headerFilter=mapp.ui.utils.tabulator.headerFilter[l.headerFilter](e)),typeof l.formatter=="string"&&mapp.ui.utils.tabulator.formatter[l.formatter]&&(l.formatter=mapp.ui.utils.tabulator.formatter[l.formatter](e))}}function Vt(e){return(t,l,a,i,o)=>{let s=t.getColumn().getField();function n(r){if(o.layerFilter){r.target.value.length?e.layer.filter.current[s]={[o.type||"like"]:encodeURIComponent(r.target.value)}:delete e.layer.filter.current[s],e.layer.reload(),e.update();return}let d=e.Tabulator.getFilters().find(p=>p.field===s&&p.type=="like");d&&(e.Tabulator.removeFilter(...Object.values(d)),o.layerFilter&&delete e.layer.filter.current[s]);let c=e.Tabulator.getFilters();r.target.value.length&&(c.push({field:s,type:"like",value:r.target.value}),e.Tabulator.setFilter(c))}return mapp.utils.html.node`<span>
      <input
        type="text"
        placeholder="Filter"
        oninput=${n}
        onblur=${n}>`}}function Nt(e){return(t,l,a,i,o)=>{let s=t.getColumn().getField(),n=mapp.utils.html`
      <input 
        type="number" 
        placeholder="Min"
        oninput=${r}
        onchange=${r}
        onblur=${r}>`;function r(p){let u=e.Tabulator.getFilters().find(m=>m.field===s&&m.type==">=");u&&(e.Tabulator.removeFilter(...Object.values(u)),o.layerFilter&&delete e.layer.filter.current[s]),Number(p.target.value)&&(e.Tabulator.addFilter(s,">=",Number(p.target.value)),o.layerFilter&&(e.layer.filter.current[s]=Object.assign(e.layer.filter.current[s]||{},{gte:Number(p.target.value)}),e.layer.reload(),e.update()))}let d=mapp.utils.html`
      <input 
        type="number" 
        placeholder="Max" 
        oninput=${c}
        onchange=${c}
        onblur=${c}>`;function c(p){let u=e.Tabulator.getFilters().find(m=>m.field===s&&m.type=="<=");u&&(e.Tabulator.removeFilter(...Object.values(u)),o.layerFilter&&delete e.layer.filter.current[s]),Number(p.target.value)&&(e.Tabulator.addFilter(s,"<=",Number(p.target.value)),o.layerFilter&&(e.layer.filter.current[s]=Object.assign(e.layer.filter.current[s]||{},{lte:Number(p.target.value)}),e.layer.reload(),e.update()))}return mapp.utils.html.node`
      <div><div style="display: flex;">${n}${d}`}}function Bt(e){return(t,l,a,i,o)=>{let s=t.getColumn().getField(),n=mapp.utils.html`
    <input
      type="date"
      onchange=${r}>`;function r(p){let u=new Date(p.target.value).getTime()/1e3,m=e.Tabulator.getFilters().find(h=>h.field===s&&h.type==">=");m&&(e.Tabulator.removeFilter(...Object.values(m)),o.layerFilter&&delete e.layer.filter.current[s]),u&&(e.Tabulator.addFilter(s,">=",u),o.layerFilter&&(e.layer.filter.current[s]=Object.assign(e.layer.filter.current[s]||{},{gte:u}),e.layer.reload(),e.update()))}let d=mapp.utils.html`
    <input
      type="date"
      onchange=${c}>`;function c(p){let u=new Date(p.target.value).getTime()/1e3,m=e.Tabulator.getFilters().find(h=>h.field===s&&h.type=="<=");m&&(e.Tabulator.removeFilter(...Object.values(m)),o.layerFilter&&delete e.layer.filter.current[s]),u&&(e.Tabulator.addFilter(s,"<=",u),o.layerFilter&&(e.layer.filter.current[s]=Object.assign(e.layer.filter.current[s]||{},{lte:u}),e.layer.reload(),e.update()))}return mapp.utils.html.node`
      <div><div style="display: flex;">${n}${d}`}}function Ht(e){return(t,l,a,i,o)=>{o.type=o.type||"in";let s=t.getColumn().getField(),n=mapp.utils.html.node`<div class="ul-parent">`;if(o.distinct)return mapp.utils.xhr(`${e.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"distinct_values",dbs:e.layer.dbs,table:e.layer.tableCurrent(),field:s})).then(d=>{mapp.utils.render(n,mapp.ui.elements.dropdown({multi:!0,placeholder:o.placeholder||"Set filter",entries:d.map(c=>({title:c[s],option:c[s]})),callback:r}))}),n;return mapp.utils.render(n,mapp.ui.elements.dropdown({multi:!0,placeholder:o.placeholder||"Set filter",entries:o.options.map(d=>({title:d,option:d})),callback:r})),n;async function r(d,c){if(o.layerFilter){c.length&&Object.assign(e.layer.filter.current,{[s]:{[o.type]:c}})||delete e.layer.filter.current[s],e.layer.reload(),e.update();return}let p=e.Tabulator.getFilters().find(u=>u.field===s);p&&(e.Tabulator.removeFilter(...Object.values(p)),o.layerFilter&&delete e.layer.filter.current[s]),c.length&&e.Tabulator.addFilter(s,"in",c)}}}function Ut(e,t={}){return(l,a)=>{let i=a.getData(),o=e.layer?.mapview.layers[t.layer]||e.layer;!o||!i[o.qID]||(mapp.location.get({layer:o,id:i[o.qID]}).then(s=>{!s||t.zoomToLocation&&s.flyTo()}),a.deselect())}}function Gt(e){return(t,l,a)=>{let i=parseFloat(t.getValue());if(!isNaN(i))return i.toLocaleString(l?.locale||"en-GB",l?.options)}}function Wt(e){return(t,l,a)=>{let i=parseInt(t.getValue());return isNaN(i)?void 0:new Date(i*1e3).toLocaleString(l?.locale||"en-GB",l?.options)}}var f={idle:600},He=e=>{Object.assign(f,e),f.idle!==0&&(window.onload=v,window.onmousemove=v,window.onmousedown=v,window.ontouchstart=v,window.onclick=v,window.onkeypress=v,v(),Be())};function v(){f.locked||(f.timeout&&clearTimeout(f.timeout),f.timeout=setTimeout(Ne,f.idle*1e3))}function Ne(){f.locked=!0,f.renew&&clearTimeout(f.renew);let e=new XMLHttpRequest;e.open("GET",`${f.host}/api/user/cookie?destroy=true`),e.onload=t=>location.reload(),e.send()}function Be(){f.renew=setTimeout(e,(f.idle-20)*1e3);function e(){let t=new XMLHttpRequest;t.open("GET",`${f.host}/api/user/cookie?renew=true`),t.onload=l=>{if(l.target.status===401)return Ne();Be()},t.send()}}var Ue=e=>{document.body.append(mapp.utils.html.node`
    <div class="interface-mask">
      <div class="bg-image" style=${`background-image:url(${e.target.src})`}>
      <button class="btn-close mask-icon close"
        onclick=${t=>t.target.parentElement.parentElement.remove()}>`)};var Ge=e=>{e.target.addEventListener("mousedown",l=>{l.preventDefault(),document.body.style.cursor="grabbing",window.addEventListener("mousemove",e.resizeEvent),window.addEventListener("mouseup",t)}),e.target.addEventListener("touchstart",l=>{l.preventDefault(),window.addEventListener("touchmove",e.resizeEvent),window.addEventListener("touchend",t)},{passive:!0});function t(){document.body.style.cursor="auto",window.removeEventListener("mousemove",e.resizeEvent),window.removeEventListener("touchmove",e.resizeEvent),window.removeEventListener("mouseup",t),window.removeEventListener("touchend",t)}};var We={Chart:Ie,Tabulator:Re,tabulator:Ve,idleLogout:He,imagePreview:Ue,resizeHandler:Ge};var Je=e=>{e.input=mapp.utils.html.node`<input 
    type="search" 
    placeholder=${e.placeholder}>`,e.list=mapp.utils.html.node`<ul>`,e.node=mapp.utils.html.node`<div class="dropdown">
    ${e.input}
    ${e.list}`,e.target.append(e.node),e.input.addEventListener("input",t),e.input.addEventListener("focus",t);function t(l){if(e.list.innerHTML="",!l.target.value.length)return;let a=l.target.value.split(",").map(parseFloat);if(a.length===2&&a.every(i=>!isNaN(i))){e.list.appendChild(mapp.utils.html.node`
          <li 
            onclick=${i=>{mapp.utils.gazetteer.getLocation({label:`Latitude:${a[0]}, Longitude:${a[1]}`,source:"Coordinates",lng:a[1],lat:a[0]})}}><span>Latitutde:${a[0]}, Longitude:${a[1]}`);return}e.provider&&(Object.hasOwn(mapp.utils.gazetteer,e.provider)?mapp.utils.gazetteer[e.provider](l.target.value,e):console.warn("Requested gazetteer service not available")),mapp.utils.gazetteer.datasets(l.target.value,e)}};self.ui=function(e){e.ui={layers:Y,locations:be,elements:De,utils:We,Gazetteer:Je,Dataview:$e,Tabview:ke}}(mapp);})();
//# sourceMappingURL=ui.js.map
