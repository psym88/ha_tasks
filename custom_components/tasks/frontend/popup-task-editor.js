import { L, esc } from "./localize.js";
import { knownLabelIds, knownReferenceId } from "./sidebar-task-list.js";
import { errorMessage, t as tr } from "./localize.js";

export const TASK_EDITOR_TAG="tasks-popup-task-editor";
const MEDIUM_LABEL_FIELDS=new Set(["name","description","manufacturer","model"]);
const PLANNING_FIELDS=new Set(["schedule_type","schedule_unit","schedule_interval"]);

export function showTaskEditorPopup(controller,params){controller.dispatchEvent(new CustomEvent("show-dialog",{bubbles:true,composed:true,detail:{dialogTag:TASK_EDITOR_TAG,dialogImport:()=>customElements.whenDefined(TASK_EDITOR_TAG),dialogParams:{controller,...params},addHistory:true}}));}

export function taskEditorFooterHtml(){return `<ha-dialog-footer slot="footer" style="padding:0 24px max(16px,var(--safe-area-inset-bottom))"><ha-button class="save" slot="primaryAction" variant="brand">${tr("common.save")}</ha-button></ha-dialog-footer>`;}

export function taskField(f){const [key,label,value,required,type="text",opts=[]]=f,labelClass=MEDIUM_LABEL_FIELDS.has(key)?"ht-label-medium":"ht-label-normal",requiredAttribute=required?" required":"",caption=`<span class="${labelClass}">${label}${required&&!PLANNING_FIELDS.has(key)?'<span class="required">*</span>':""}</span>`;if(type==="textarea")return `<label data-field="${key}">${caption}<textarea class="ht-content" name="${key}" style="resize:vertical"${requiredAttribute}>${esc(value)}</textarea></label>`;if(type==="select")return `<label data-field="${key}">${caption}<select class="ht-content" name="${key}"${requiredAttribute}>${opts.map(o=>`<option value="${esc(o[0])}" ${value===o[0]?"selected":""}>${esc(o[1])}</option>`).join("")}</select></label>`;if(type==="labels"||type==="icon")return `<label data-field="${key}">${caption}<input name="${key}" type="hidden" value="${esc(type==="labels"?JSON.stringify(value||[]):value||"")}"><ha-selector></ha-selector></label>`;return `<label data-field="${key}">${caption}<input class="ht-content" name="${key}" type="${type}" value="${esc(value)}"${requiredAttribute} ${type==="number"?'min="1"':""}></label>`;}

export class TasksPopupTaskEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"});this.open=false;this.saved=false;this.cancelled=false;}
  showDialog(params){Object.assign(this,params);this.open=true;this.saved=false;this.cancelled=false;this.controller._activeFormDialog=this;this.render();const modal=this.shadowRoot.querySelector(".modal");if(this.after)Promise.resolve(this.after(modal));}
  async closeDialog(saved=false){if(!this.open)return true;this.saved=saved;if(!saved&&!this.cancelled&&this.onCancel){this.cancelled=true;await this.onCancel();}this.open=false;const dialog=this.shadowRoot.querySelector("ha-adaptive-dialog");if(dialog)dialog.open=false;return true;}
  dialogClosed(){if(this.open&&!this.saved&&!this.cancelled&&this.onCancel){this.cancelled=true;Promise.resolve(this.onCancel());}this.open=false;if(this.controller?._activeFormDialog===this)this.controller._activeFormDialog=null;this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:true,composed:true,detail:{dialog:this.localName}}));this.shadowRoot.innerHTML="";}
  async submit(event){event.preventDefault();const form=event.currentTarget,error=form.querySelector(".error"),values=Object.fromEntries(this.fields.map(field=>[field[0],form.elements[field[0]].value.trim()]));if(this.fields.some(field=>field[3]&&!values[field[0]])){error.style.display="block";error.textContent=tr("form.required");return;}const save=this.shadowRoot.querySelector(".save");save.disabled=true;try{await this.onSave(values);await this.closeDialog(true);}catch(exception){error.style.display="block";error.textContent=tr("common.error",{message:errorMessage(exception)});save.disabled=false;}}
  render(){this.shadowRoot.innerHTML=`<style>:host{font-family:var(--ha-font-family-body,Roboto,sans-serif);font-size:var(--ha-font-size-m,14px);line-height:var(--ha-line-height-normal,1.4);color:var(--primary-text-color)}.ht-label-medium{color:var(--primary-text-color);font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-medium,500)}.ht-label-normal{color:var(--primary-text-color);font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-normal,400)}.ht-content{color:var(--secondary-text-color);font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-normal,400)}.link{color:var(--primary-color);background:transparent}.editor-action.danger{color:var(--error-color);background:transparent}form,label{display:flex;flex-direction:column;gap:10px}label{gap:4px}.schedule_interval-row{display:flex;gap:10px}.schedule_interval-row>label{flex:1;min-width:0}input,select,textarea{box-sizing:border-box;padding:9px;border:1px solid var(--divider-color);border-radius:8px;background:var(--primary-background-color);color:var(--primary-text-color);font:inherit}textarea{min-height:60px}[data-field="task_description"] textarea{min-height:120px}.error{color:var(--error-color);min-height:16px}.details-content{display:flex;flex-direction:column;gap:10px;padding:0 16px 16px}.detail-row{display:flex;align-items:center;gap:8px;padding:7px 0}.filename{min-width:0;overflow:hidden;color:var(--primary-color)}.pending{text-decoration:line-through;opacity:.5}.file-list{width:100%}.file-upload-loader[hidden]{display:none}.attachment-upload{display:block;height:240px}.notification-options{display:flex;flex-direction:column;gap:4px}.notification-option{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:16px;min-height:48px;cursor:pointer}.notification-option-copy{display:flex;min-width:0;flex-direction:column;gap:2px}.notification-option-description{color:var(--secondary-text-color);font-size:var(--ha-font-size-s,12px);font-weight:var(--ha-font-weight-normal,400)}.problem-sensor-option{display:flex;flex-direction:column;gap:4px}button{font:inherit;cursor:pointer;border:0}ha-adaptive-dialog{--dialog-content-padding:0}ha-expansion-panel{--input-fill-color:transparent}.modal{box-sizing:border-box;padding:16px 24px 24px;overflow:auto}.required{color:var(--error-color);margin-left:3px}.weekday-buttons{display:flex;gap:5px;flex-wrap:wrap}.weekday{border:1px solid var(--divider-color);background:transparent}.weekday.selected{border-color:var(--primary-color);background:var(--primary-color);color:var(--text-primary-color)}.schedule-options>span{display:block;margin-bottom:5px}.schedule-box>.details-content{display:flex;flex-direction:column;gap:10px}.schedule-box [hidden]{display:none!important}</style><ha-adaptive-dialog width="medium" flexcontent><ha-icon-button slot="headerNavigationIcon" class="close" label="${tr("common.close")}"><ha-icon icon="mdi:close"></ha-icon></ha-icon-button><span slot="headerTitle">${esc(this.title)}</span><div class="modal"><form>${this.fields.map(taskField).join("")}<div class="error form-end" style="display:none"></div></form></div>${taskEditorFooterHtml()}</ha-adaptive-dialog>`;const dialog=this.shadowRoot.querySelector("ha-adaptive-dialog"),form=this.shadowRoot.querySelector("form");dialog.open=true;dialog.addEventListener("closed",()=>this.dialogClosed(),{once:true});this.shadowRoot.querySelector(".close").onclick=()=>this.closeDialog(false);this.shadowRoot.querySelector(".save").onclick=()=>form.requestSubmit();form.onsubmit=event=>this.submit(event);}
}

if(!customElements.get(TASK_EDITOR_TAG))customElements.define(TASK_EDITOR_TAG,TasksPopupTaskEditor);

export function taskDetailBoxHtml(title,content,{className="",expanded=false}={}){
  return `<ha-expansion-panel outlined${expanded?" expanded":""}${className?` class="${className}"`:""}><span slot="header">${esc(title)}</span><div class="details-content">${content}</div></ha-expansion-panel>`;
}

export function taskFilesBoxHtml(controller,task,{editable=false,pending=new Set(),staged=[]}={}){
  const files=task?controller.attachments.filter(file=>file.task_id===task.task_id):[],storedRows=files.map(file=>{const id=esc(file.attachment_id),name=esc(file.filename||""),url=controller.signedFiles?.get(file.attachment_id),tag=url?"ha-list-item-button":"ha-list-item-base",link=url?` data-file-open="${id}" href="${esc(url)}"`:"",isPending=pending.has(file.attachment_id),remove=editable?`<ha-icon-button slot="end" class="editor-action remove ${isPending?"":"danger"}" label="${isPending?tr("file.undo_remove"):tr("file.remove")}" title="${isPending?tr("common.undo"):tr("common.remove")}"><ha-icon icon="mdi:${isPending?"undo":"delete"}"></ha-icon></ha-icon-button>`:"";return `<${tag} data-file="${id}" class="file-row ${isPending?"pending":""}"${link}><ha-icon slot="start" icon="mdi:file-outline"></ha-icon><span slot="headline">${name}</span><span slot="supporting-text">${controller.size(file.size)}</span>${remove}</${tag}>`;}).join(""),stagedRows=editable?staged.map((file,index)=>`<ha-list-item-base data-staged="${index}" class="file-row"><ha-icon slot="start" icon="mdi:file-outline"></ha-icon><span slot="headline">${esc(file.name)}</span><span slot="supporting-text">${controller.size(file.size)}</span><ha-icon-button slot="end" class="editor-action remove danger" label="${tr("file.remove")}" title="${tr("common.remove")}"><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button></ha-list-item-base>`).join(""):"",rows=storedRows+stagedRows||`<ha-list-item-base><span slot="supporting-text" class="ht-content">${L.noFiles}</span></ha-list-item-base>`;
  const content=editable?`<ha-list-base class="file-list">${rows}</ha-list-base><ha-selector class="file-upload-loader" hidden></ha-selector><ha-file-upload class="attachment-upload"></ha-file-upload>`:`<ha-list-base class="file-list">${rows}</ha-list-base>`;
  return taskDetailBoxHtml(L.files,content,{className:"files-box"});
}

export function taskHistoryBoxHtml(controller,entries,{editable=false,pending=new Set(),status=""}={}){
  const rows=Array.isArray(entries)?(entries.length?entries.map(entry=>controller.historyRow(entry,editable)).join(""):`<ha-list-item-base><span slot="supporting-text" class="ht-content">${L.noHistory}</span></ha-list-item-base>`):(status||tr("common.loading"));
  return taskDetailBoxHtml(L.history,`<ha-list-base class="history-list">${rows}</ha-list-base>`,{className:"history-box"});
}

function expansionPanel(className,title,expanded=false){const panel=document.createElement("ha-expansion-panel"),header=document.createElement("span"),content=document.createElement("div");panel.className=className;panel.outlined=true;panel.expanded=expanded;header.slot="header";header.textContent=title;content.className="details-content";panel.append(header,content);return {panel,content};}

export function normalizeNotificationTarget(value){const deviceIds=Array.isArray(value?.device_id)?[...new Set(value.device_id.filter(id=>typeof id==="string"&&id))]:[];return deviceIds.length?{device_id:deviceIds}:{};}

export const withTaskEditor = Base => class extends Base {
  dialog(title,fields,onSave,after,onCancel){showTaskEditorPopup(this,{title,fields,onSave,after,onCancel});}
  async taskEditor(task=null){if(task)try{await this.ensureTaskFileUrls(task.task_id);}catch{}const t=task||{},assigneeId=knownReferenceId(t.assignee_id,this.users)||"",nfcTagId=knownReferenceId(t.nfc_tag_id,this.tags)||"",tagOptions=[...this.tags].sort((a,b)=>(a.name||a.id).localeCompare(b.name||b.id,this.locale())).map(tag=>[tag.id,tag.name||tag.id]),pendingFiles=new Set(),pendingHistory=new Set(),newUploads=new Set(),editor={task,stagedFiles:[],renderFiles:()=>{}},notification={target:normalizeNotificationTarget(t.notification_target),persistent:Boolean(t.notification_persistent),critical:Boolean(t.notification_critical),route:t.notification_route||null},dueSource=t.task_due||this.now,dueValue=this.dueDateKey(dueSource),[year,month,day]=dueValue.split("-").map(Number),due=new Date(Date.UTC(year,month-1,day)),timeParts=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hourCycle:"h23",...(this.timeZone()?{timeZone:this.timeZone()}:{})}).formatToParts(new Date(dueSource)).filter(part=>part.type!=="literal").map(part=>[part.type,part.value])),schedule={schedule_weekdays:[...(t.schedule_weekdays?.length?t.schedule_weekdays:[due.getUTCDay()===0?6:due.getUTCDay()-1])],schedule_day:t.schedule_day||day,schedule_month:t.schedule_month||month,schedule_time:t.schedule_time||`${timeParts.hour}:${timeParts.minute}`,problem_sensor:t.problem_sensor||null,existingDue:t.task_due||null};let createdInEditor=false;this.dialog(tr(task?"task.edit":"task.new"),[
    ["assignee_id",tr("task.user"),assigneeId,false,"select",[["",tr("task.unassigned")],...this.users.map(user=>[user.id,user.name])]],["nfc_tag_id",tr("task.nfc_tag_id"),nfcTagId,false,"select",[["",tr("task.no_nfc_tag")],...tagOptions]],["task_icon",tr("task.icon"),t.task_icon||"",false,"icon"],["label_ids",tr("task.labels"),t.label_ids||[],false,"labels"],["task_name",tr("task.name"),t.task_name,true],["task_description",tr("task.optional_description"),t.task_description,false,"textarea"],["schedule_type",tr("task.recurrence_calculation"),t.schedule_type||"sliding",true,"select",[["sliding",L.sliding],["fixed",L.fixed],["sensor",tr("task.problem")]]],["schedule_unit",tr("task.schedule_unit"),t.schedule_unit||"monthly",true,"select",[["daily",L.daily],["weekly",L.weekly],["monthly",L.monthly],["yearly",L.yearly]]],["schedule_interval",tr("task.schedule_unit"),t.schedule_interval||1,true,"number"]
  ],async v=>{for(const id of [...pendingHistory]){await this.ws({type:"tasks/history/delete",task_id:editor.task.task_id,history_entry_id:id});pendingHistory.delete(id);}for(const id of [...pendingFiles]){await this.ws({type:"tasks/attachment/delete",attachment_id:id});pendingFiles.delete(id);}const wasNew=!editor.task;const schedulePayload=v.schedule_type==="sensor"?{schedule_type:"sensor",problem_sensor:schedule.problem_sensor}:{schedule_type:v.schedule_type,schedule_unit:v.schedule_unit,schedule_interval:Number(v.schedule_interval),schedule_weekdays:schedule.schedule_weekdays,schedule_day:schedule.schedule_day,schedule_month:schedule.schedule_month,...(v.schedule_type==="fixed"?{schedule_time:schedule.schedule_time}:{})};editor.task=await this.ws({type:`tasks/task/${wasNew?"create":"update"}`,...(wasNew?{}:{task_id:editor.task.task_id}),task_name:v.task_name,task_icon:v.task_icon||null,task_description:v.task_description||null,assignee_id:v.assignee_id||null,label_ids:JSON.parse(v.label_ids||"[]"),nfc_tag_id:v.nfc_tag_id.trim()||null,notification_target:notification.target,notification_persistent:notification.persistent,notification_critical:notification.critical,notification_route:notification.route,...schedulePayload});if(wasNew)createdInEditor=true;if(editor.stagedFiles.length)try{while(editor.stagedFiles.length){const file=editor.stagedFiles[0],fileId=await this.uploadNativeFile(file),record=await this.attachUploadedFile(editor.task.task_id,fileId);newUploads.add(record.attachment_id);editor.stagedFiles.shift();}}finally{try{await this.ensureTaskFileUrls(editor.task.task_id);}catch{}editor.renderFiles();}newUploads.clear();},modal=>{this.arrangeBasics(modal);this.arrangeSchedule(modal,schedule);this.arrangeAssignment(modal);this.arrangeNotifications(modal,notification);this.mountDetails(modal,editor,pendingFiles,pendingHistory);},async()=>{if(createdInEditor&&editor.task){try{await this.ws({type:"tasks/task/delete",task_id:editor.task.task_id});}catch{}return;}for(const id of newUploads){try{await this.ws({type:"tasks/attachment/delete",attachment_id:id});}catch{}}});}
  mountIntervalStepper(field){const input=field.querySelector('input[name="schedule_interval"]'),control=document.createElement("div"),minus=document.createElement("button"),plus=document.createElement("button"),style=document.createElement("style"),schedule_unit=field.parentElement?.querySelector('[data-field="schedule_unit"] select');control.className="schedule_interval-stepper";for(const [button,label,icon] of [[minus,tr("task.interval_decrease"),"minus"],[plus,tr("task.interval_increase"),"plus"]]){button.type="button";button.className="schedule_interval-step";button.setAttribute("aria-label",label);button.innerHTML=`<ha-icon icon="mdi:${icon}"></ha-icon>`;}input.type="text";input.inputMode="numeric";input.pattern="[0-9]*";input.setAttribute("aria-label",tr("task.interval_label"));input.before(control);control.append(minus,input,plus);if(schedule_unit)schedule_unit.classList.add("schedule-select");style.textContent=".schedule-select,.schedule_interval-stepper{box-sizing:border-box;width:100%;height:44px}.schedule_interval-stepper{display:grid;grid-template-columns:42px minmax(36px,1fr) 42px;align-items:center;border:1px solid var(--divider-color);border-radius:8px;background:var(--primary-background-color);overflow:hidden}.schedule_interval-stepper:focus-within{border-color:var(--primary-color)}.schedule_interval-stepper input{box-sizing:border-box;width:100%;height:42px;min-width:0;padding:0 4px;border:0;border-radius:0;background:transparent;font:inherit;text-align:center;outline:0}.schedule_interval-step{display:flex!important;align-items:center;justify-content:center;width:42px!important;min-width:42px!important;height:42px!important;min-height:0!important;padding:0!important;border:0;border-radius:0;background:transparent;color:var(--secondary-text-color)}.schedule_interval-step:hover,.schedule_interval-step:focus-visible{background:var(--ha-color-fill-neutral-quiet-hover,var(--secondary-background-color));color:var(--primary-text-color);outline:0}.schedule_interval-step:disabled{color:var(--disabled-text-color);cursor:default;background:transparent}";field.append(style);const value=()=>Math.max(1,Math.trunc(Number(input.value)||1)),commit=next=>{input.value=String(Math.max(1,next));minus.disabled=value()<=1;input.dispatchEvent(new Event("input",{bubbles:true}));};minus.onclick=()=>commit(value()-1);plus.onclick=()=>commit(value()+1);input.oninput=()=>{input.value=input.value.replace(/\D/g,"");minus.disabled=value()<=1;};input.onblur=()=>commit(value());input.onkeydown=event=>{if(event.key==="ArrowUp"){event.preventDefault();commit(value()+1);}else if(event.key==="ArrowDown"){event.preventDefault();commit(value()-1);}};minus.disabled=value()<=1;}
  arrangeBasics(modal){const form=modal.querySelector("form"),name=form.querySelector('[data-field="task_name"]'),description=form.querySelector('[data-field="task_description"]');for(const [field,placeholder] of [[name,tr("task.name")],[description,tr("task.optional_description")]]){const control=field.querySelector("input,textarea"),displayPlaceholder=`${placeholder}${control.required?" *":""}`;control.placeholder=displayPlaceholder;control.setAttribute("aria-label",displayPlaceholder);field.querySelector(":scope > span")?.remove();}form.prepend(name,description);}
  arrangeAssignment(modal){const form=modal.querySelector("form"),iconField=form.querySelector('[data-field="task_icon"]'),iconInput=iconField.querySelector("input"),iconSelector=iconField.querySelector("ha-selector"),labelField=form.querySelector('[data-field="label_ids"]'),labelInput=labelField.querySelector("input"),labelSelector=labelField.querySelector("ha-selector"),fields=[form.querySelector('[data-field="assignee_id"]'),form.querySelector('[data-field="nfc_tag_id"]'),iconField,labelField],schedule=form.querySelector(".schedule-box"),{panel,content}=expansionPanel("assignment-box",tr("task.assignment")),labelIds=knownLabelIds(JSON.parse(labelInput.value||"[]"),this.labels);iconSelector.hass=this._hass;iconSelector.key="task_icon";iconSelector.selector={icon:{}};iconSelector.value=iconInput.value||null;iconSelector.addEventListener("value-changed",event=>{iconInput.value=event.detail?.value||"";});labelInput.value=JSON.stringify(labelIds);labelSelector.hass=this._hass;labelSelector.key="label_ids";labelSelector.selector={label:{multiple:true}};labelSelector.value=labelIds;labelSelector.addEventListener("value-changed",event=>{labelInput.value=JSON.stringify(event.detail?.value||[]);});schedule?schedule.after(panel):form.insertBefore(panel,fields[0]);fields.forEach(field=>content.append(field));}
  arrangeNotifications(modal,notification){const form=modal.querySelector("form"),assignment=form.querySelector(".assignment-box"),{panel,content}=expansionPanel("notification-box",tr("task.notification")),selector=document.createElement("ha-selector"),route=document.createElement("ha-selector"),routeField=document.createElement("div"),routeLabel=document.createElement("span"),options=document.createElement("div");selector.hass=this._hass;selector.key="notification_target";selector.label=tr("task.notification_devices");selector.selector={device:{multiple:true,filter:[{integration:"mobile_app"}]}};selector.value=notification.target.device_id||[];selector.addEventListener("value-changed",event=>{notification.target=normalizeNotificationTarget({device_id:event.detail?.value});selector.value=notification.target.device_id||[];});routeField.style.cssText="display:flex;flex-direction:column;gap:4px";routeLabel.className="ht-label-normal";routeLabel.textContent=tr("task.notification_route");route.hass=this._hass;route.key="notification_route";route.selector={navigation:null};route.required=false;route.value=notification.route||undefined;route.addEventListener("value-changed",event=>{notification.route=String(event.detail?.value||"").trim()||null;route.value=notification.route||undefined;});routeField.append(routeLabel,route);options.className="notification-options";for(const [key,label,description] of [["persistent",tr("task.notification_persistent"),tr("task.notification_persistent_description")],["critical",tr("task.notification_critical"),tr("task.notification_critical_description")]]){const row=document.createElement("label"),control=document.createElement("ha-switch"),copy=document.createElement("span"),text=document.createElement("span"),secondary=document.createElement("span");row.className="notification-option";copy.className="notification-option-copy";secondary.className="notification-option-description";control.checked=notification[key];text.textContent=label;secondary.textContent=description;control.addEventListener("change",()=>{notification[key]=control.checked;});copy.append(text,secondary);row.append(copy,control);options.append(row);}content.append(options,selector,routeField);assignment?assignment.after(panel):form.querySelector(".form-end").before(panel);}
  arrangeSchedule(modal,schedule){
    const form=modal.querySelector("form"),recurrence=form.querySelector('[data-field="schedule_type"]'),schedule_unit=form.querySelector('[data-field="schedule_unit"]'),unitLabel=schedule_unit.querySelector(":scope > span"),schedule_interval=form.querySelector('[data-field="schedule_interval"]'),mode=form.elements.schedule_type,row=document.createElement("div"),timeField=document.createElement("label"),timeInput=document.createElement("input"),options=document.createElement("div"),rule=document.createElement("div"),preview=document.createElement("div"),summary=document.createElement("div"),more=document.createElement("button"),firstDueBox=document.createElement("section"),firstDueTitle=document.createElement("h3"),firstDueText=document.createElement("span"),problem=document.createElement("div"),problemSelector=document.createElement("ha-selector"),{panel:box,content}=expansionPanel("schedule-box",tr("task.planning"));
    row.className="schedule_interval-row";timeField.className="schedule-time-option ht-label-normal";timeField.textContent=tr("task.time");timeInput.className="schedule-time ht-content";timeInput.type="time";timeInput.value=schedule.schedule_time;timeInput.required=true;timeField.append(timeInput);options.className="schedule-options ht-label-normal";rule.className="schedule-rule ht-content";preview.className="due-preview-list";summary.className="schedule-summary ht-content";problem.className="problem-sensor-option";unitLabel.style.visibility="hidden";form.insertBefore(box,recurrence);row.append(schedule_interval,schedule_unit);content.append(recurrence,row,timeField,options,rule);
    this.mountIntervalStepper(schedule_interval);more.type="button";more.className="link show-more-dates ht-label-normal";more.textContent=tr("task.show_more");more.style.cssText="padding:0;min-height:32px";preview.innerHTML=`<h3 class="ht-label-normal" style="margin:0">${tr("task.preview_task_dues")}</h3>`;preview.append(summary,more);
    firstDueBox.className="first-due-option";firstDueBox.style.cssText="display:flex;flex-direction:column;gap:0;margin:0;padding:0";firstDueTitle.className="first-due-title ht-label-normal";firstDueTitle.style.margin="0";firstDueTitle.textContent=tr("task.first_due");firstDueText.className="ht-content";firstDueBox.append(firstDueTitle,firstDueText);
    problemSelector.hass=this._hass;problemSelector.key="problem_sensor";problemSelector.label=tr("task.problem_sensor");problemSelector.selector={entity:{filter:[{domain:"binary_sensor"}]}};problemSelector.required=true;problemSelector.value=schedule.problem_sensor||undefined;problemSelector.addEventListener("value-changed",event=>{schedule.problem_sensor=event.detail?.value||null;problemSelector.value=schedule.problem_sensor||undefined;});const problemDescription=document.createElement("span");problemDescription.className="ht-content problem-sensor-description";problemDescription.textContent=tr("schedule.problem_sensor_description");problem.append(problemSelector,problemDescription);content.append(firstDueBox,preview,problem);
    const days=()=>`${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${String(schedule.schedule_day)===String(i+1)?"selected":""}>${i+1}</option>`).join("")}<option value="last" ${schedule.schedule_day==="last"?"selected":""}>${tr("task.last_day")}</option>`;
    let previewRequest=0,dirty=false,visibleCount=4,previewDates=[];const scheduleValue=()=>({schedule_type:mode.value,schedule_unit:form.elements.schedule_unit.value,schedule_interval:Number(form.elements.schedule_interval.value),schedule_weekdays:schedule.schedule_weekdays,schedule_day:schedule.schedule_day,schedule_month:schedule.schedule_month,...(mode.value==="fixed"?{schedule_time:schedule.schedule_time}:{})}),renderRule=()=>{rule.textContent=this.scheduleText(scheduleValue());},renderSummary=()=>{summary.innerHTML=this.editorScheduleHtml(previewDates.slice(0,visibleCount));if(mode.value==="sliding")firstDueText.textContent=previewDates[0]?this.date(previewDates[0]," - "):"–";summary.dataset.ready="true";summary.setAttribute("aria-busy","false");more.disabled=false;more.hidden=visibleCount>=previewDates.length;};const updateSummary=async()=>{renderRule();const task={...scheduleValue(),...(!dirty&&schedule.existingDue?{task_due:schedule.existingDue}:{})},request=++previewRequest;if(!summary.dataset.ready){summary.innerHTML=this.editorScheduleHtml([]);more.hidden=true;}summary.setAttribute("aria-busy","true");more.disabled=true;try{const result=await this.ws({type:"tasks/task/preview_next_due",...task});if(request===previewRequest&&summary.isConnected){previewDates=result.task_dues;renderSummary();}}catch{if(request===previewRequest&&summary.isConnected){if(mode.value==="sliding")firstDueText.textContent=tr("task.task_dues_failed");summary.innerHTML=this.editorScheduleHtml([],tr("task.task_dues_failed"));summary.setAttribute("aria-busy","false");more.disabled=false;more.hidden=true;}}};
    const changed=callback=>{
      dirty=true;
      callback();
    };
    timeInput.oninput=event=>changed(()=>{
      schedule.schedule_time=event.target.value;
      updateSummary();
    });

    const renderUnits=()=>{
      const singular=Number(form.elements.schedule_interval.value)===1;
      const singularKeys={
        daily:"task.day",
        weekly:"task.week",
        monthly:"task.month",
        yearly:"task.year",
      };
      const pluralNames={
        daily:L.daily,
        weekly:L.weekly,
        monthly:L.monthly,
        yearly:L.yearly,
      };
      for(const option of form.elements.schedule_unit.options){
        option.textContent=singular
          ?tr(singularKeys[option.value])
          :pluralNames[option.value];
      }
    };

    const renderFixedOptions=()=>{
      const kind=form.elements.schedule_unit.value;
      if(kind==="daily"){
        options.hidden=true;
        options.innerHTML="";
        updateSummary();
        return;
      }

      options.hidden=false;
      if(kind==="weekly"){
        const weekdays=Array.from({length:7},(_,index)=>
          new Intl.DateTimeFormat(this.locale(),{
            weekday:"short",
            timeZone:"UTC",
          }).format(new Date(Date.UTC(2024,0,index+1))),
        );
        options.innerHTML=`<span>${tr("task.schedule_weekdays")}</span><div class="weekday-buttons" style="display:flex;width:100%;gap:4px;flex-wrap:nowrap">${weekdays.map((weekday,index)=>`<button type="button" data-day="${index}" class="weekday ${schedule.schedule_weekdays.includes(index)?"selected":""}" style="flex:1 1 0;min-width:0;min-height:44px;padding:0">${weekday}</button>`).join("")}</div>`;
        options.querySelectorAll("[data-day]").forEach(button=>{
          button.onclick=()=>changed(()=>{
            const day=Number(button.dataset.day);
            schedule.schedule_weekdays=schedule.schedule_weekdays.includes(day)
              ?schedule.schedule_weekdays.filter(value=>value!==day)
              :[...schedule.schedule_weekdays,day];
            button.classList.toggle("selected");
            updateSummary();
          });
        });
      }else if(kind==="yearly"){
        const months=Array.from(
          {length:12},
          (_,index)=>`<option value="${index+1}" ${Number(schedule.schedule_month)===index+1?"selected":""}>${new Intl.DateTimeFormat(this.locale(),{month:"long"}).format(new Date(2024,index,1))}</option>`,
        ).join("");
        options.innerHTML=`<div class="annual-row" style="display:flex;gap:10px"><label style="flex:1;min-width:0">${tr("task.day")}<select class="month-day ht-content">${days()}</select></label><label style="flex:1;min-width:0">${tr("task.month")}<select class="year-month ht-content">${months}</select></label></div>`;
        options.querySelector(".year-month").onchange=event=>changed(()=>{
          schedule.schedule_month=Number(event.target.value);
          updateSummary();
        });
        options.querySelector(".month-day").onchange=event=>changed(()=>{
          schedule.schedule_day=event.target.value==="last"
            ?"last"
            :Number(event.target.value);
          updateSummary();
        });
      }else{
        options.innerHTML=`<label>${tr("task.on_day")}<select class="month-day ht-content">${days()}</select></label>`;
        options.querySelector(".month-day").onchange=event=>changed(()=>{
          schedule.schedule_day=event.target.value==="last"
            ?"last"
            :Number(event.target.value);
          updateSummary();
        });
      }
      updateSummary();
    };

    // Nach Erledigung
    const renderAfterCompletion=()=>{
      row.hidden=false;
      timeField.hidden=true;
      options.hidden=true;
      rule.hidden=false;
      firstDueBox.hidden=false;
      preview.hidden=true;
      problem.hidden=true;

      options.innerHTML="";
      updateSummary();
    };

    // Fester Zeitplan
    const renderFixedSchedule=()=>{
      row.hidden=false;
      timeField.hidden=false;
      rule.hidden=false;
      firstDueBox.hidden=true;
      preview.hidden=false;
      problem.hidden=true;

      renderFixedOptions();
    };

    // Bei Problem
    const renderProblemTrigger=()=>{
      row.hidden=true;
      timeField.hidden=true;
      options.hidden=true;
      rule.hidden=true;
      firstDueBox.hidden=true;
      preview.hidden=true;
      problem.hidden=false;

      previewRequest++;
      options.innerHTML="";
    };

    const renderTrigger=()=>{
      renderUnits();
      if(mode.value==="fixed"){
        renderFixedSchedule();
      }else if(mode.value==="sensor"){
        renderProblemTrigger();
      }else{
        renderAfterCompletion();
      }
    };

    more.onclick=()=>{
      visibleCount=previewDates.length;
      renderSummary();
    };
    mode.addEventListener("change",()=>changed(renderTrigger));
    form.elements.schedule_unit.addEventListener(
      "change",
      ()=>changed(renderTrigger),
    );
    form.elements.schedule_interval.addEventListener(
      "input",
      ()=>changed(()=>{
        renderUnits();
        if(mode.value!=="sensor"){
          updateSummary();
        }
      }),
    );
    renderTrigger();
  }
  async mountDetails(modal,editor,pendingFiles,pendingHistory){
    const form=modal.querySelector("form"),formEnd=form.querySelector(".form-end");formEnd.insertAdjacentHTML("beforebegin",taskFilesBoxHtml(this,editor.task,{editable:true,pending:pendingFiles,staged:editor.stagedFiles})+(editor.task?taskHistoryBoxHtml(this,null,{editable:true}):""));const filesBox=form.querySelector(".files-box");
    const renderFiles=()=>{const replacement=document.createElement("div");replacement.innerHTML=taskFilesBoxHtml(this,editor.task,{editable:true,pending:pendingFiles,staged:editor.stagedFiles});filesBox.querySelector(".file-list").replaceWith(replacement.firstElementChild.querySelector(".file-list"));const files=editor.task?this.attachments.filter(file=>file.task_id===editor.task.task_id):[];filesBox.querySelectorAll("[data-file]").forEach(row=>{const file=files.find(item=>item.attachment_id===row.dataset.file);row.querySelector(".remove").onclick=event=>{event.preventDefault();event.stopPropagation();pendingFiles.has(file.attachment_id)?pendingFiles.delete(file.attachment_id):pendingFiles.add(file.attachment_id);renderFiles();};});filesBox.querySelectorAll("[data-staged]").forEach(row=>row.querySelector(".remove").onclick=event=>{event.preventDefault();event.stopPropagation();editor.stagedFiles.splice(Number(row.dataset.staged),1);renderFiles();});this.wireFileOpeners(filesBox,this._activeFormDialog||this);};editor.renderFiles=renderFiles;
    renderFiles();const loader=filesBox.querySelector(".file-upload-loader"),upload=filesBox.querySelector("ha-file-upload");loader.hass=this._hass;loader.selector={file:{accept:"*/*"}};loader.required=false;upload.accept="*/*";upload.multiple=true;upload.addEventListener("file-picked",event=>{editor.stagedFiles.push(...(event.detail?.files||[]));renderFiles();upload.value=undefined;const input=upload.shadowRoot?.querySelector("input");if(input)input.value="";});
    if(!editor.task)return;const historyBox=form.querySelector(".history-box"),data=await this.ws({type:"tasks/history/list",task_id:editor.task.task_id}),hist=historyBox.querySelector(".history-list");hist.style.overflowX="auto";hist.innerHTML=data.history.length?data.history.map(h=>this.historyRow(h,true)).join(""):`<ha-list-item-base><span slot="supporting-text" class="ht-content">${L.noHistory}</span></ha-list-item-base>`;hist.querySelectorAll("[data-history]").forEach(r=>r.querySelector(".remove").onclick=()=>{pendingHistory.has(r.dataset.history)?pendingHistory.delete(r.dataset.history):pendingHistory.add(r.dataset.history);r.classList.toggle("pending");const button=r.querySelector(".remove"),pending=pendingHistory.has(r.dataset.history);button.classList.toggle("danger",!pending);button.setAttribute("aria-label",pending?tr("history.undo_remove"):tr("history.remove"));button.title=pending?tr("common.undo"):tr("common.remove");button.innerHTML=`<ha-icon icon="mdi:${pending?"undo":"delete"}"></ha-icon>`;});
  }
};
