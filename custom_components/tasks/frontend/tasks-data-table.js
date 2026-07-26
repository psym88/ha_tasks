import {
  createTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
} from "./vendor/tanstack-table-core.mjs";
import { esc, t } from "./localize.js";

export const TASKS_DATA_TABLE_TAG="tasks-data-table";

export class TasksDataTable extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this._data=[];
    this._columns={};
    this._columnOrder=[];
    this._hiddenColumns=[];
    this._sorting=[];
    this._grouping=[];
    this._expanded={};
    this._rowSelection={};
    this._lastSelectedRowId=null;
    this._search="";
    this._openMenu=null;
    this._displayExpanded={columns:false,grouping:false};
    this._defaultColumnOrder=undefined;
    this._defaultHiddenColumns=undefined;
    this._defaultSorting=undefined;
    this.filters=0;
    this.noDataText="";
    this.searchLabel="";
    this._outsideClick=event=>{
      if(!this._openMenu||event.composedPath().some(node=>node?.classList?.contains("popover")))return;
      this._openMenu=null;
      this.render();
    };
    this._table=createTable({
      data:[],
      columns:[],
      getRowId:row=>row.id,
      getCoreRowModel:getCoreRowModel(),
      getFilteredRowModel:getFilteredRowModel(),
      getSortedRowModel:getSortedRowModel(),
      getGroupedRowModel:getGroupedRowModel(),
      getExpandedRowModel:getExpandedRowModel(),
      enableRowSelection:true,
      groupedColumnMode:false,
      autoResetAll:false,
      autoResetExpanded:false,
      state:{},
    });
  }

  connectedCallback(){document.addEventListener("pointerdown",this._outsideClick,true);this.render();}
  disconnectedCallback(){document.removeEventListener("pointerdown",this._outsideClick,true);}
  set data(value){
    this._data=Array.isArray(value)?value:[];
    const ids=new Set(this._data.map(row=>row.id));
    this._rowSelection=Object.fromEntries(Object.entries(this._rowSelection).filter(([id,selected])=>selected&&ids.has(id)));
    if(this._lastSelectedRowId&&!ids.has(this._lastSelectedRowId))this._lastSelectedRowId=null;
    this.update();
  }
  get data(){return this._data;}
  set columns(value){this._columns=value||{};this.update();}
  get columns(){return this._columns;}
  set defaultColumnOrder(value){this._defaultColumnOrder=Array.isArray(value)?[...value]:[];}
  set columnOrder(value){this._columnOrder=Array.isArray(value)?value:[];this.update();}
  get columnOrder(){return this._columnOrder;}
  set defaultHiddenColumns(value){this._defaultHiddenColumns=Array.isArray(value)?[...value]:[];}
  set hiddenColumns(value){this._hiddenColumns=Array.isArray(value)?value:[];this.update();}
  get hiddenColumns(){return this._hiddenColumns;}
  set defaultSorting(value){this._defaultSorting=value?.column?[{id:value.column,desc:value.direction==="desc"}]:[];}
  set initialSorting(value){if(value?.column)this._sorting=[{id:value.column,desc:value.direction==="desc"}];}
  set initialGroupColumn(value){this._grouping=value?[value]:[];}
  set initialCollapsedGroups(value){this._expanded=value&&typeof value==="object"?value:{};}
  set filter(value){this._search=String(value||"");}
  get filter(){return this._search;}
  set selected(value){this._selected=Number(value)||0;this.renderSelection();}
  get selected(){return this._selected||0;}

  clearSelection(){this._rowSelection={};this._lastSelectedRowId=null;this.emitSelection();this.update();}
  selectRow(row,selected,range=false){
    const visibleRows=this._table.getRowModel().rows.filter(item=>!item.getIsGrouped());
    const currentIndex=visibleRows.findIndex(item=>item.id===row.id);
    const lastIndex=range&&this._lastSelectedRowId?visibleRows.findIndex(item=>item.id===this._lastSelectedRowId):-1;
    const next={...this._rowSelection};
    if(lastIndex>=0&&currentIndex>=0){
      const start=Math.min(lastIndex,currentIndex),end=Math.max(lastIndex,currentIndex);
      for(let index=start;index<=end;index++)next[visibleRows[index].id]=selected;
    }else next[row.id]=selected;
    this._rowSelection=next;
    this._lastSelectedRowId=row.id;
    this.emitSelection();
    this.update();
  }
  resetView(){
    this._sorting=(this._defaultSorting||[]).map(item=>({...item}));
    this._grouping=[];
    this._expanded={};
    this._columnOrder=[...(this._defaultColumnOrder||Object.keys(this._columns))];
    this._hiddenColumns=[...(this._defaultHiddenColumns||[])];
    const sorting=this._sorting[0];
    this.dispatchEvent(new CustomEvent("sorting-changed",{detail:sorting?{column:sorting.id,direction:sorting.desc?"desc":"asc"}:undefined}));
    this.dispatchEvent(new CustomEvent("grouping-changed",{detail:{value:undefined}}));
    this.dispatchEvent(new CustomEvent("collapsed-changed",{detail:{value:{}}}));
    this.dispatchEvent(new CustomEvent("columns-changed",{detail:{columnOrder:this._columnOrder,hiddenColumns:this._hiddenColumns}}));
    this.update();
  }

  columnDefinitions(){
    return Object.entries(this._columns).map(([id,definition])=>({
      id,
      accessorFn:row=>row[id],
      header:definition.title??definition.label??id,
      enableSorting:definition.sortable!==false&&id!=="icon"&&id!=="actions",
      enableGrouping:Boolean(definition.groupable),
      sortingFn:(left,right)=>{
        const a=left.original[id],b=right.original[id];
        return typeof a==="number"&&typeof b==="number"?a-b:String(a??"").localeCompare(String(b??""),undefined,{numeric:true,sensitivity:"base"});
      },
      meta:{definition},
    }));
  }

  syncTable(){
    const state={
      sorting:this._sorting,
      grouping:this._grouping,
      expanded:this._expanded,
      globalFilter:this._search,
      rowSelection:this._rowSelection,
      columnOrder:this._columnOrder,
      columnVisibility:Object.fromEntries(Object.keys(this._columns).map(id=>[id,!this._hiddenColumns.includes(id)])),
    };
    this._table.setOptions(previous=>({
      ...previous,
      data:this._data,
      columns:this.columnDefinitions(),
      state,
      globalFilterFn:(row,_columnId,value)=>{
        const needle=String(value||"").toLocaleLowerCase();
        return !needle||Object.values(row.original).some(item=>String(item??"").toLocaleLowerCase().includes(needle));
      },
      onSortingChange:updater=>{
        this._sorting=typeof updater==="function"?updater(this._sorting):updater;
        const sorting=this._sorting[0];
        this.dispatchEvent(new CustomEvent("sorting-changed",{detail:sorting?{column:sorting.id,direction:sorting.desc?"desc":"asc"}:undefined}));
        this.update();
      },
      onGroupingChange:updater=>{
        this._grouping=typeof updater==="function"?updater(this._grouping):updater;
        this.dispatchEvent(new CustomEvent("grouping-changed",{detail:{value:this._grouping[0]}}));
        this.update();
      },
      onExpandedChange:updater=>{
        this._expanded=typeof updater==="function"?updater(this._expanded):updater;
        this.dispatchEvent(new CustomEvent("collapsed-changed",{detail:{value:this._expanded}}));
        this.update();
      },
      onRowSelectionChange:updater=>{
        this._rowSelection=typeof updater==="function"?updater(this._rowSelection):updater;
        this.emitSelection();
        this.update();
      },
    }));
  }

  emitSelection(){
    const value=Object.entries(this._rowSelection).filter(([,selected])=>selected).map(([id])=>id);
    this._selected=value.length;
    this.dispatchEvent(new CustomEvent("selection-changed",{detail:{value}}));
  }

  update(){if(this.isConnected){this.syncTable();this.render();}}

  render(){
    const previousSearch=this.shadowRoot?.activeElement?.classList?.contains("search")
      ? {start:this.shadowRoot.activeElement.selectionStart,end:this.shadowRoot.activeElement.selectionEnd}
      : null;
    this.syncTable();
    const visibleColumns=this._table.getVisibleLeafColumns();
    this.shadowRoot.innerHTML=`<style>
      :host{display:flex;height:100%;min-height:0;flex-direction:column;container-type:inline-size;background:var(--primary-background-color);color:var(--primary-text-color)}
      .toolbar{box-sizing:border-box;height:calc(var(--header-height,0px) + var(--safe-area-inset-top,0px));padding-block-start:var(--safe-area-inset-top);padding-inline-end:var(--safe-area-inset-right);border-bottom:1px solid var(--divider-color);background:var(--sidebar-background-color);font-size:var(--ha-font-size-xl);font-weight:var(--ha-font-weight-normal)}
      .toolbar-content{display:flex;align-items:center;box-sizing:border-box;height:100%;padding:var(--ha-space-2) var(--ha-space-3)}
      ha-menu-button{margin-inline-end:var(--ha-space-6)}
      .main-title{min-width:0;max-height:var(--header-height);flex:1;margin-inline-start:var(--main-title-margin,var(--ha-space-6));color:var(--sidebar-text-color);line-height:var(--ha-line-height-normal)}
      .search{box-sizing:border-box;min-width:180px;max-width:360px;flex:1;padding:9px 12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--primary-background-color);color:var(--primary-text-color);font-family:var(--ha-font-family-body);font-size:var(--ha-font-size-m);line-height:var(--ha-line-height-normal)}
      .popover{font-size:var(--ha-font-size-m)}
      .filter-toggle,.settings-toggle{position:relative}.badge{position:absolute;inset-block-start:0;inset-inline-end:0;min-width:16px;border-radius:9px;background:var(--primary-color);color:var(--text-primary-color);font-size:11px;text-align:center}
      .popover{position:relative}.menu{position:absolute;z-index:4;inset-inline-end:0;min-width:230px;max-height:70vh;overflow:auto;padding:8px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);box-shadow:var(--ha-card-box-shadow);white-space:nowrap}.menu[hidden]{display:none}
      .filter-menu,.settings-menu{width:360px;max-width:calc(100vw - var(--ha-space-8));white-space:normal}.filter-menu,.display-menu{padding:0}
      .display-options{display:flex;flex-direction:column;padding-block:var(--ha-space-2)}.display-options label{display:flex;align-items:center;gap:var(--ha-space-2);min-height:40px;padding-inline:var(--ha-space-4)}
      .menu-action{display:flex;justify-content:flex-end;padding:var(--ha-space-2);border-top:1px solid var(--divider-color)}
      .filters{background:var(--card-background-color)}
      .selection{display:flex;align-items:center;justify-content:flex-end;box-sizing:border-box;height:var(--data-table-row-height,52px);padding-inline:var(--ha-space-3);border-bottom:1px solid var(--divider-color);background:var(--primary-background-color);--ha-assist-chip-container-color:var(--card-background-color)}
      .selection slot{display:flex;align-items:center;gap:var(--ha-space-2);color:var(--primary-text-color)}.selection:not(.active) slot{display:none}
      .table-wrap{min-height:0;flex:1;overflow:auto}table{width:100%;border-collapse:collapse;background:var(--card-background-color);font-family:var(--ha-font-family-body);font-size:var(--ha-font-size-m);line-height:var(--ha-line-height-condensed)}thead{box-shadow:inset 0 -1px var(--divider-color)}thead tr{height:var(--header-height)}tbody tr{height:var(--data-table-row-height,52px)}th,td{box-sizing:border-box;height:inherit;padding-block:0;padding-inline:var(--ha-space-4);border-bottom:1px solid var(--divider-color);text-align:start;vertical-align:middle}th{position:sticky;z-index:2;top:0;background:var(--card-background-color);font-size:var(--ha-font-size-s);line-height:var(--ha-line-height-normal);font-weight:var(--ha-font-weight-medium);white-space:nowrap}
      th{color:var(--primary-text-color);font-size:var(--ha-font-size-m)}td{color:var(--primary-text-color)}
      th button{position:relative;display:flex;width:100%;align-items:center;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:inherit;cursor:pointer}th button.sortable{padding-inline-end:var(--ha-space-5)}th button ha-icon{position:absolute;inset-inline-end:0;--mdc-icon-size:var(--ha-space-4)}thead th:first-child,tbody td:first-child{width:calc(var(--ha-space-6) * 2);min-width:calc(var(--ha-space-6) * 2);padding-inline-start:var(--ha-space-4);padding-inline-end:0}th[data-column="icon"],td[data-column="icon"]{width:calc(var(--ha-space-6) * 2);min-width:calc(var(--ha-space-6) * 2);padding-inline:var(--ha-space-3);text-align:center}td[data-column="icon"]{color:var(--secondary-text-color)}th[data-column="actions"],td[data-column="actions"]{width:64px;min-width:64px;padding-block:0;padding-inline:var(--ha-space-2);text-align:center}td[data-column="actions"]{color:var(--secondary-text-color)}
      .task-name-cell{min-width:0}.mobile-details{display:none;color:var(--secondary-text-color);font-size:var(--ha-font-size-s);line-height:var(--ha-line-height-normal)}
      tbody tr.task-row{cursor:pointer}tbody tr.task-row:hover{background:rgba(var(--rgb-primary-text-color),0.04)}.group-row{font-weight:var(--ha-font-weight-medium);cursor:pointer}.group-row td{width:auto;min-width:0;padding-inline:var(--ha-space-3);background:var(--primary-background-color)}.group-content{display:flex;align-items:center;gap:var(--ha-space-2);color:var(--primary-text-color)}.group-content ha-icon{--mdc-icon-size:var(--ha-space-6);flex:0 0 auto}
      .empty{text-align:center;color:var(--secondary-text-color)}.fab{position:absolute;inset-inline-end:24px;inset-block-end:24px}
      @container (max-width:600px){.toolbar{padding-inline-start:var(--safe-area-inset-left)}.toolbar-content{padding:var(--ha-space-1)}ha-menu-button{margin-inline-end:0}.main-title{margin-inline-start:var(--main-title-margin,var(--ha-space-2))}.search{min-width:0}.table-wrap table,.table-wrap thead,.table-wrap tbody{display:block}.table-wrap thead tr{display:flex}.table-wrap thead th{display:none}.table-wrap thead th:first-child,.table-wrap thead th[data-column="icon"],.table-wrap thead th[data-column="name"]{display:flex;align-items:center}.table-wrap thead th:first-child{flex:0 0 calc(var(--ha-space-6) * 2)}.table-wrap thead th[data-column="icon"]{flex:0 0 calc(var(--ha-space-6) * 2)}.table-wrap thead th[data-column="name"]{min-width:0;flex:1;padding-inline:var(--ha-space-2)}tbody tr.task-row{display:flex;height:auto;min-height:var(--data-table-row-height,52px)}tbody tr.task-row td{display:none;padding-inline:var(--ha-space-2)}tbody tr.task-row td:first-child,tbody tr.task-row td[data-column="icon"],tbody tr.task-row td[data-column="name"],tbody tr.task-row td[data-column="actions"]{display:flex;align-items:center}tbody tr.task-row td:first-child{flex:0 0 calc(var(--ha-space-6) * 2);padding-inline-start:var(--ha-space-4);padding-inline-end:0}tbody tr.task-row td[data-column="icon"]{flex:0 0 calc(var(--ha-space-6) * 2)}tbody tr.task-row td[data-column="name"]{min-width:0;flex:1}.mobile-details{display:block}tbody tr.group-row{display:table;width:100%}}
    </style>
    <div class="toolbar">
      <div class="toolbar-content">
        <ha-menu-button></ha-menu-button>
        <div class="main-title">${esc(this.tabs?.[0]?.name||"Tasks")}</div>
        <input class="search" type="search" value="${esc(this._search)}" placeholder="${esc(this.searchLabel||t("table.search"))}" aria-label="${esc(this.searchLabel||t("table.search"))}">
        <div class="popover filter-popover"><ha-icon-button class="filter-toggle" aria-label="${esc(t("table.filters"))}"><ha-icon icon="mdi:filter-variant"></ha-icon>${this.filters?`<span class="badge">${this.filters}</span>`:""}</ha-icon-button><div class="menu filter-menu" ${this._openMenu==="filter"?"":"hidden"}><div class="filters"><slot name="filter-pane"></slot></div><div class="menu-action"><ha-button class="reset-filters" appearance="plain">${esc(t("table.reset_filters"))}</ha-button></div></div></div>
        <div class="popover display-popover"><ha-icon-button class="settings-toggle" aria-label="${esc(t("table.display"))}"><ha-icon icon="mdi:view-column-outline"></ha-icon></ha-icon-button><div class="menu display-menu" ${this._openMenu==="display"?"":"hidden"}>
          <ha-expansion-panel left-chevron class="columns-panel" ${this._displayExpanded.columns?"expanded":""}><span slot="header">${esc(t("table.columns"))}</span><div class="display-options">
            ${this._columnOrder.filter(id=>this._columns[id]?.hideable!==false).map(id=>`<label><ha-checkbox data-column="${esc(id)}"></ha-checkbox><span>${esc(this._columns[id]?.title||this._columns[id]?.label||id)}</span></label>`).join("")}
          </div></ha-expansion-panel>
          <ha-expansion-panel left-chevron class="grouping-panel" ${this._displayExpanded.grouping?"expanded":""}><span slot="header">${esc(t("table.group_by"))}</span>
            <div class="display-options"><label><input type="radio" name="group" value="" ${this._grouping.length?"":"checked"}><span>${esc(t("table.no_group"))}</span></label>${Object.entries(this._columns).filter(([,column])=>column.groupable).map(([id,column])=>`<label><input type="radio" name="group" value="${esc(id)}" ${this._grouping[0]===id?"checked":""}><span>${esc(column.title||id)}</span></label>`).join("")}</div>
          </ha-expansion-panel>
          <div class="menu-action"><ha-button class="reset-view" appearance="plain">${esc(t("table.reset_view"))}</ha-button></div>
        </div></div>
        <div class="popover settings-popover"><ha-icon-button class="settings-menu-toggle" aria-label="${esc(t("settings.title"))}"><ha-icon icon="mdi:cog-outline"></ha-icon></ha-icon-button><div class="menu settings-menu" ${this._openMenu==="settings"?"":"hidden"}><slot name="settings-pane"></slot></div></div>
      </div>
    </div>
    <div class="selection${this.selected?" active":""}"><slot name="selection-bar"></slot></div>
    <div class="table-wrap"><table><thead><tr><th><ha-checkbox class="select-all" aria-label="${esc(t("table.select_all"))}"></ha-checkbox></th>${visibleColumns.map(column=>`<th data-column="${esc(column.id)}"></th>`).join("")}</tr></thead><tbody></tbody></table></div>
    <div class="fab"><slot name="fab"></slot></div>`;
    const menuButton=this.shadowRoot.querySelector("ha-menu-button");
    menuButton.hass=this.hass;
    menuButton.narrow=Boolean(this.narrow);
    this.renderHeader(visibleColumns);
    this.renderRows(visibleColumns);
    this.wire();
    this.renderSelection();
    if(previousSearch){
      const search=this.shadowRoot.querySelector(".search");
      search.focus();
      search.setSelectionRange(previousSearch.start,previousSearch.end);
    }
  }

  renderHeader(columns){
    const headers=this.shadowRoot.querySelectorAll("th[data-column]");
    columns.forEach((column,index)=>{
      const definition=column.columnDef.meta.definition,button=document.createElement("button"),label=document.createElement("span");
      label.textContent=definition.title??definition.label??column.id;
      button.append(label);
      button.classList.toggle("sortable",column.getCanSort());
      const sorted=column.getIsSorted();
      if(sorted){const icon=document.createElement("ha-icon");icon.setAttribute("icon",sorted==="desc"?"mdi:arrow-down":"mdi:arrow-up");button.append(icon);}
      button.disabled=!column.getCanSort();
      if(column.getCanSort())button.onclick=column.getToggleSortingHandler();
      headers[index].append(button);
    });
  }

  renderRows(columns){
    const body=this.shadowRoot.querySelector("tbody"),rows=this._table.getRowModel().rows;
    if(!rows.length){const row=body.insertRow(),cell=row.insertCell();cell.colSpan=columns.length+1;cell.className="empty";cell.textContent=this.noDataText||t("table.empty");return;}
    for(const row of rows){
      const tr=body.insertRow();
      if(row.getIsGrouped()){
        tr.className="group-row";const cell=tr.insertCell(),content=document.createElement("div"),icon=document.createElement("ha-icon"),label=document.createElement("span");cell.colSpan=columns.length+1;content.className="group-content";icon.setAttribute("icon",row.getIsExpanded()?"mdi:chevron-up":"mdi:chevron-down");label.textContent=`${row.groupingValue} (${row.subRows.length})`;content.append(icon,label);cell.append(content);tr.onclick=row.getToggleExpandedHandler();continue;
      }
      tr.className="task-row";tr.dataset.id=row.original.id;
      const selection=tr.insertCell(),checkbox=document.createElement("ha-checkbox");checkbox.checked=row.getIsSelected();checkbox.setAttribute("aria-label",row.original.name||row.id);checkbox.onclick=event=>{event.preventDefault();event.stopPropagation();this.selectRow(row,!row.getIsSelected(),event.shiftKey);};selection.append(checkbox);
      for(const column of columns){const cell=tr.insertCell();cell.dataset.column=column.id;const template=column.columnDef.meta.definition.template,value=row.original[column.id];if(template){const content=template(row.original);if(content){cell.append(content);if(column.id==="name")this.appendMobileDetails(content,row,columns);}}else cell.textContent=String(value??"");}
      tr.onclick=()=>this.dispatchEvent(new CustomEvent("row-click",{detail:{id:row.original.id}}));
    }
  }

  appendMobileDetails(content,row,columns){
    const values=[];
    for(const column of columns){
      if(column.id==="name"||column.id==="actions")continue;
      const definition=column.columnDef.meta.definition,value=row.original[column.id];
      if(definition.template){
        const rendered=definition.template(row.original),text=rendered?.textContent?.trim();
        if(text)values.push(text);
      }else if(value!==undefined&&value!==null&&String(value).trim())values.push(String(value));
    }
    if(!values.length)return;
    const details=document.createElement("span");
    details.className="mobile-details";
    details.textContent=values.join(" - ");
    content.append(details);
  }

  renderSelection(){
    const selection=this.shadowRoot?.querySelector(".selection");
    if(selection)selection.classList.toggle("active",Boolean(this.selected));
  }

  wire(){
    const search=this.shadowRoot.querySelector(".search"),selectAll=this.shadowRoot.querySelector(".select-all");
    search.oninput=()=>{
      this._search=search.value;
      this.dispatchEvent(new CustomEvent("search-changed",{detail:{value:this._search}}));
      this.syncTable();
      const body=this.shadowRoot.querySelector("tbody");
      body.innerHTML="";
      this.renderRows(this._table.getVisibleLeafColumns());
    };
    this.shadowRoot.querySelector(".filter-toggle").onclick=()=>{this._openMenu=this._openMenu==="filter"?null:"filter";this.render();};
    this.shadowRoot.querySelector(".settings-toggle").onclick=()=>{this._openMenu=this._openMenu==="display"?null:"display";this.render();};
    this.shadowRoot.querySelector(".settings-menu-toggle").onclick=()=>{this._openMenu=this._openMenu==="settings"?null:"settings";this.render();};
    this.shadowRoot.querySelector(".reset-filters").onclick=()=>this.dispatchEvent(new CustomEvent("clear-filter"));
    this.shadowRoot.querySelector(".reset-view").onclick=()=>this.resetView();
    selectAll.checked=this._table.getIsAllRowsSelected();selectAll.indeterminate=this._table.getIsSomeRowsSelected();selectAll.onclick=event=>{event.preventDefault();event.stopPropagation();this._lastSelectedRowId=null;this._table.toggleAllRowsSelected(!this._table.getIsAllRowsSelected());};
    this.shadowRoot.querySelectorAll('ha-checkbox[data-column]').forEach(checkbox=>{
      checkbox.checked=!this._hiddenColumns.includes(checkbox.dataset.column);
      checkbox.onchange=()=>{
      const hidden=checkbox.checked?this._hiddenColumns.filter(id=>id!==checkbox.dataset.column):[...new Set([...this._hiddenColumns,checkbox.dataset.column])];
      this._hiddenColumns=hidden;
      this.dispatchEvent(new CustomEvent("columns-changed",{detail:{columnOrder:this._columnOrder,hiddenColumns:hidden}}));
      this.update();
    };});
    for(const [section,panel] of Object.entries({columns:this.shadowRoot.querySelector(".columns-panel"),grouping:this.shadowRoot.querySelector(".grouping-panel")}))panel.addEventListener("expanded-changed",event=>{this._displayExpanded[section]=Boolean(event.detail?.expanded);});
    this.shadowRoot.querySelectorAll('input[name="group"]').forEach(input=>input.onchange=()=>{if(input.checked)this._table.setGrouping(input.value?[input.value]:[]);});
  }
}

if(!customElements.get(TASKS_DATA_TABLE_TAG))customElements.define(TASKS_DATA_TABLE_TAG,TasksDataTable);
