var W=globalThis,Z=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),Be=new WeakMap,U=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Z&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Be.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Be.set(t,e))}return e}toString(){return this.cssText}},Ke=r=>new U(typeof r=="string"?r:r+"",void 0,ce),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new U(t,r,ce)},ze=(r,e)=>{if(Z)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=W.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},de=Z?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Ke(t)})(r):r;var{is:wt,defineProperty:At,getOwnPropertyDescriptor:Tt,getOwnPropertyNames:St,getOwnPropertySymbols:Ct,getPrototypeOf:Dt}=Object,G=globalThis,je=G.trustedTypes,It=je?je.emptyScript:"",Nt=G.reactiveElementPolyfillSupport,B=(r,e)=>r,he={toAttribute(r,e){switch(e){case Boolean:r=r?It:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Ve=(r,e)=>!wt(r,e),qe={attribute:!0,type:String,converter:he,reflect:!1,useDefault:!1,hasChanged:Ve};Symbol.metadata??=Symbol("metadata"),G.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=qe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&At(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=Tt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let h=i?.call(this);a?.call(this,o),this.requestUpdate(e,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??qe}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let e=Dt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let t=this.properties,s=[...St(t),...Ct(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(de(i))}else e!==void 0&&t.push(de(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ze(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:he).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:he;this._$Em=i;let h=o.fromAttribute(t,a.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let o=this.constructor;if(i===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??Ve)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:o}=a,h=this[i];o!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,a,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[B("elementProperties")]=new Map,w[B("finalized")]=new Map,Nt?.({ReactiveElement:w}),(G.reactiveElementVersions??=[]).push("2.1.2");var be=globalThis,We=r=>r,J=be.trustedTypes,Ze=J?J.createPolicy("lit-html",{createHTML:r=>r}):void 0,et="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,tt="?"+A,Pt=`<${tt}>`,I=document,z=()=>I.createComment(""),j=r=>r===null||typeof r!="object"&&typeof r!="function",ye=Array.isArray,Lt=r=>ye(r)||typeof r?.[Symbol.iterator]=="function",ue=`[ 	
\f\r]`,K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ge=/-->/g,Je=/>/g,C=RegExp(`>|${ue}(?:([^\\s"'>=/]+)(${ue}*=${ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Qe=/"/g,st=/^(?:script|style|textarea|title)$/i,$e=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),n=$e(1),it=$e(2),rt=$e(3),N=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Xe=new WeakMap,D=I.createTreeWalker(I,129);function at(r,e){if(!ye(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(e):e}var Ht=(r,e)=>{let t=r.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",o=K;for(let h=0;h<t;h++){let c=r[h],l,u,p=-1,x=0;for(;x<c.length&&(o.lastIndex=x,u=o.exec(c),u!==null);)x=o.lastIndex,o===K?u[1]==="!--"?o=Ge:u[1]!==void 0?o=Je:u[2]!==void 0?(st.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=C):u[3]!==void 0&&(o=C):o===C?u[0]===">"?(o=i??K,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,l=u[1],o=u[3]===void 0?C:u[3]==='"'?Qe:Ye):o===Qe||o===Ye?o=C:o===Ge||o===Je?o=K:(o=C,i=void 0);let k=o===C&&r[h+1].startsWith("/>")?" ":"";a+=o===K?c+Pt:p>=0?(s.push(l),c.slice(0,p)+et+c.slice(p)+A+k):c+A+(p===-2?h:k)}return[at(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},q=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0,h=e.length-1,c=this.parts,[l,u]=Ht(e,t);if(this.el=r.createElement(l,s),D.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=D.nextNode())!==null&&c.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(et)){let x=u[o++],k=i.getAttribute(p).split(A),P=/([.?@])?(.*)/.exec(x);c.push({type:1,index:a,name:P[2],strings:k,ctor:P[1]==="."?me:P[1]==="?"?ge:P[1]==="@"?fe:H}),i.removeAttribute(p)}else p.startsWith(A)&&(c.push({type:6,index:a}),i.removeAttribute(p));if(st.test(i.tagName)){let p=i.textContent.split(A),x=p.length-1;if(x>0){i.textContent=J?J.emptyScript:"";for(let k=0;k<x;k++)i.append(p[k],z()),D.nextNode(),c.push({type:2,index:++a});i.append(p[x],z())}}}else if(i.nodeType===8)if(i.data===tt)c.push({type:2,index:a});else{let p=-1;for(;(p=i.data.indexOf(A,p+1))!==-1;)c.push({type:7,index:a}),p+=A.length-1}a++}}static createElement(e,t){let s=I.createElement("template");return s.innerHTML=e,s}};function L(r,e,t=r,s){if(e===N)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=j(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=L(r,i._$AS(r,e.values),i,s)),e}var pe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??I).importNode(t,!0);D.currentNode=i;let a=D.nextNode(),o=0,h=0,c=s[0];for(;c!==void 0;){if(o===c.index){let l;c.type===2?l=new V(a,a.nextSibling,this,e):c.type===1?l=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(l=new ve(a,this,e)),this._$AV.push(l),c=s[++h]}o!==c?.index&&(a=D.nextNode(),o++)}return D.currentNode=I,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},V=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=L(this,e,t),j(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==N&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Lt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=q.createElement(at(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new pe(i,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=Xe.get(e.strings);return t===void 0&&Xe.set(e.strings,t=new q(e)),t}k(e){ye(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new r(this.O(z()),this.O(z()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=We(e).nextSibling;We(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,i){let a=this.strings,o=!1;if(a===void 0)e=L(this,e,t,0),o=!j(e)||e!==this._$AH&&e!==N,o&&(this._$AH=e);else{let h=e,c,l;for(e=a[0],c=0;c<a.length-1;c++)l=L(this,h[s+c],t,c),l===N&&(l=this._$AH[c]),o||=!j(l)||l!==this._$AH[c],l===d?e=d:e!==d&&(e+=(l??"")+a[c+1]),this._$AH[c]=l}o&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},me=class extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},ge=class extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},fe=class extends H{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=L(this,e,t,0)??d)===N)return;let s=this._$AH,i=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ve=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){L(this,e)}};var Mt=be.litHtmlPolyfillSupport;Mt?.(q,V),(be.litHtmlVersions??=[]).push("3.3.3");var nt=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let a=t?.renderBefore??null;s._$litPart$=i=new V(e.insertBefore(z(),a),a,void 0,t??{})}return i._$AI(r),i};var xe=globalThis,m=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=nt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};m._$litElement$=!0,m.finalized=!0,xe.litElementHydrateSupport?.({LitElement:m});var Ot=xe.litElementPolyfillSupport;Ot?.({LitElement:m});(xe.litElementVersions??=[]).push("4.2.2");var lt=Symbol.for(""),Ft=r=>{if(r?.r===lt)return r?._$litStatic$},y=r=>({_$litStatic$:r,r:lt});var ot=new Map,ke=r=>(e,...t)=>{let s=t.length,i,a,o=[],h=[],c,l=0,u=!1;for(;l<s;){for(c=e[l];l<s&&(a=t[l],(i=Ft(a))!==void 0);)c+=i+e[++l],u=!0;l!==s&&h.push(a),o.push(c),l++}if(l===s&&o.push(e[s]),u){let p=o.join("$$lit$$");(e=ot.get(p))===void 0&&(o.raw=o,ot.set(p,e=o)),t=h}return r(e,...t)},v=ke(n),ls=ke(it),cs=ke(rt);var ps=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),ct=r=>{if(r.type==="sensor")return{schedule_type:r.type,problem_sensor:r.problemSensor.trim()};let e={schedule_type:r.type,schedule_unit:r.unit,schedule_interval:r.interval};return r.type==="fixed"&&(e.schedule_time=r.time,r.unit==="weekly"?e.schedule_weekdays=r.weekdays:r.unit==="monthly"?e.schedule_day=r.day:r.unit==="yearly"&&(e.schedule_day=r.day,e.schedule_month=r.month)),e},Rt=async(r,e)=>{let t=new FormData;t.append("file",e);let s=await r.fetchWithAuth("/api/file_upload",{method:"POST",body:t});if(!s.ok)throw new Error(`File upload failed (${s.status})`);return(await s.json()).file_id},dt=async(r,e,t)=>{let s=await Promise.all((t.files?.staged||[]).map(i=>Rt(r,i)));return r.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.task_id}:{},task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,...t.schedule?ct(t.schedule):e?{schedule_type:e.schedule_type}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification_target:t.notification.deviceIds.length?{device_id:t.notification.deviceIds}:{},notification_persistent:t.notification.persistent,notification_critical:t.notification.critical,notification_route:t.notification.route.trim()||null}:{},file_ids:s,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},M=async r=>{let[e,t,s]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(s)?s:[]}},Y=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(s=>s?.[0]==="mobile_app"))},ht=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),Q=(r,e)=>r.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),ut=(r,e)=>r.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),pt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),ms=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),gs=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),mt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",...ct(e),...t?{task_due:t}:{}});var g=r=>`ha-tasks-v2-${r}`;var _e=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=f`
    dialog {
      width: min(560px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      box-sizing: border-box;
      padding: 0;
      overflow: hidden;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 0;
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 8px 32px rgba(0, 0, 0, 0.32)
      );
      font-family: var(--ha-font-family-body, sans-serif);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.48);
    }

    article {
      display: grid;
      max-height: calc(100dvh - 32px);
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    header,
    footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;
    }

    header {
      border-bottom: 1px solid var(--divider-color);
    }

    h2 {
      flex: 1;
      margin: 0;
      font-size: 20px;
      line-height: 28px;
    }

    section {
      padding: 20px;
      overflow: auto;
    }

    footer {
      justify-content: flex-end;
      border-top: 1px solid var(--divider-color);
    }

    button {
      min-height: 40px;
      padding: 0 16px;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    button:hover {
      background: var(--secondary-background-color);
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .close {
      width: 40px;
      padding: 0;
      color: var(--secondary-text-color);
      font-size: 26px;
      line-height: 1;
    }

    .destructive {
      color: var(--error-color);
    }
  `;running=!1;constructor(){super(),this.heading="",this.content=n``,this.actions=[],this.open=!1}updated(){let e=this.renderRoot.querySelector("dialog");e&&(this.open&&!e.open?e.showModal():!this.open&&e.open&&e.close())}close(e=""){this.renderRoot.querySelector("dialog")?.close(e)}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){return n`
      <dialog
        aria-labelledby="title"
        @close=${e=>{this.open=!1,this.dispatchEvent(new CustomEvent("tasks-dialog-closed",{bubbles:!0,composed:!0,detail:e.currentTarget.returnValue}))}}
      >
        <article>
          <header>
            <h2 id="title">${this.heading}</h2>
            <button
              class="close"
              type="button"
              aria-label="Close"
              @click=${()=>this.close()}
            >
              ×
            </button>
          </header>
          <section>${this.content}</section>
          ${this.actions.length?n`
                <footer>
                  ${this.actions.map(e=>n`
                      <button
                        class=${e.destructive?"destructive":d}
                        type="button"
                        @click=${()=>{this.run(e)}}
                      >
                        ${e.label}
                      </button>
                    `)}
                </footer>
              `:d}
        </article>
      </dialog>
    `}},Ee=g("dialog");customElements.get(Ee)||customElements.define(Ee,_e);var T=({heading:r,content:e,actions:t=[]})=>{let s=document.createElement(Ee);return s.heading=r,s.content=e,s.actions=t,document.body.append(s),s.open=!0,new Promise(i=>{s.addEventListener("tasks-dialog-closed",a=>{s.remove(),i(a.detail)},{once:!0})})};var we=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=f`
    details {
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    summary {
      display: flex;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      font-weight: 500;
      cursor: pointer;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::after {
      margin-left: auto;
      content: "⌄";
      transition: transform 160ms ease;
    }

    details[open] summary::after {
      transform: rotate(180deg);
    }

    summary:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .content {
      padding: 0 16px 16px;
      color: var(--secondary-text-color);
    }
  `;constructor(){super(),this.heading="",this.open=!1}render(){return n`
      <details
        ?open=${this.open}
        @toggle=${e=>{this.open=e.currentTarget.open}}
      >
        <summary>${this.heading}</summary>
        <div class="content"><slot></slot></div>
      </details>
    `}},O=g("expandable");customElements.get(O)||customElements.define(O,we);var Ie=f`
  :host {
    display: block;
  }

  label {
    display: grid;
    gap: 6px;
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  input:not([type="checkbox"]),
  textarea,
  select {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    padding: 9px 12px;
    color: var(--primary-text-color);
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    font: inherit;
    font-size: 14px;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }

  input:not([type="checkbox"]):hover,
  textarea:hover,
  select:hover {
    border-color: var(--secondary-text-color);
  }

  input:not([type="checkbox"]):focus,
  textarea:focus,
  select:focus {
    border-color: var(--primary-color);
    outline: 1px solid var(--primary-color);
  }

  [aria-invalid="true"] {
    border-color: var(--error-color);
  }

  .error {
    color: var(--error-color);
  }

  fieldset {
    display: grid;
    gap: 8px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  legend {
    margin-bottom: 6px;
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  .choices {
    display: grid;
    gap: 4px;
  }

  .choice {
    display: flex;
    min-height: 36px;
    align-items: center;
    gap: 10px;
    color: var(--primary-text-color);
    font-size: 14px;
  }

  .choice input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--primary-color);
  }
`,S=class extends m{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=Ie;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?n`<span class="error" role="alert">${this.error}</span>`:null}},Ae=class extends S{static properties={...S.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return n`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        ${this.multiline?n`
              <textarea
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              ></textarea>
            `:n`
              <input
                type=${this.inputType}
                min=${this.min??""}
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              />
            `}
        ${this.errorMessage()}
      </label>
    `}},Te=class extends S{static properties={...S.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return n`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        <select
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${!!this.error}
          @change=${e=>this.change(e.target.value)}
        >
          ${this.options.map(e=>n`
              <option
                value=${e.value}
                ?selected=${e.value===this.value}
              >
                ${e.label}
              </option>
            `)}
        </select>
        ${this.errorMessage()}
      </label>
    `}},Se=class extends S{static properties={...S.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return n`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        <input
          type="text"
          role="combobox"
          list="options"
          autocomplete="off"
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${!!this.error}
          @input=${e=>this.change(e.target.value)}
        />
        <datalist id="options">
          ${this.options.map(e=>n`<option value=${e.value}>${e.label}</option>`)}
        </datalist>
        ${this.errorMessage()}
      </label>
    `}},Ce=class extends m{static properties={label:{},value:{attribute:!1},options:{attribute:!1},disabled:{type:Boolean}};static styles=Ie;constructor(){super(),this.label="",this.value=[],this.options=[],this.disabled=!1}toggle(e,t){this.value=t?[...new Set([...this.value,e])]:this.value.filter(s=>s!==e),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.value}))}render(){return n`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <div class="choices">
          ${this.options.map(e=>n`
              <label class="choice">
                <input
                  type="checkbox"
                  .checked=${this.value.includes(e.value)}
                  @change=${t=>this.toggle(e.value,t.target.checked)}
                />
                <span>${e.label}</span>
              </label>
            `)}
        </div>
      </fieldset>
    `}},De=class extends m{static properties={label:{},description:{},checked:{type:Boolean},disabled:{type:Boolean}};static styles=[Ie,f`
      label {
        display: flex;
        min-height: 44px;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .copy {
        display: grid;
        gap: 2px;
      }

      small {
        color: var(--secondary-text-color);
      }

      input {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        margin: 0;
        accent-color: var(--primary-color);
      }
    `];constructor(){super(),this.label="",this.description="",this.checked=!1,this.disabled=!1}render(){return n`
      <label>
        <span class="copy">
          <span>${this.label}</span>
          ${this.description?n`<small>${this.description}</small>`:null}
        </span>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${e=>{this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.checked}))}}
        />
      </label>
    `}},F=g("text-field"),X=g("select-field"),ee=g("combobox-field"),te=g("multi-select-field"),se=g("switch-field");customElements.get(F)||customElements.define(F,Ae);customElements.get(X)||customElements.define(X,Te);customElements.get(ee)||customElements.define(ee,Se);customElements.get(te)||customElements.define(te,Ce);customElements.get(se)||customElements.define(se,De);var _=y(F),b=y(X),ie=y(ee),re=y(te),ae=y(se),E=y(O),Ut=[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],Bt=[{label:"Tasks",value:"mdi:clipboard-check-outline"},{label:"Tools",value:"mdi:wrench-outline"},{label:"Cleaning",value:"mdi:broom"},{label:"Home",value:"mdi:home-outline"},{label:"Calendar",value:"mdi:calendar-check-outline"}],gt=[{label:"After completion",value:"sliding"},{label:"Fixed schedule",value:"fixed"},{label:"Problem sensor",value:"sensor"}],Kt=[{label:"Days",value:"daily"},{label:"Weeks",value:"weekly"},{label:"Months",value:"monthly"},{label:"Years",value:"yearly"}],ft=[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:"Last day",value:"last"}],zt=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(s=>s.type!=="literal").map(s=>[s.type,s.value]))},Ne=class extends m{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=f`
    :host,
    form,
    .planning {
      display: grid;
      gap: 16px;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .weekday {
      min-width: 0;
      min-height: 36px;
      padding: 0 4px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid transparent;
      border-radius: 18px;
      font: inherit;
      cursor: pointer;
    }

    .weekday[aria-pressed="true"] {
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
    }

    .weekday:focus-visible,
    .link:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .weekday:disabled {
      opacity: 0.55;
      cursor: default;
    }

    .caption,
    .hint,
    .preview,
    .error {
      margin: 0;
      font-size: 13px;
    }

    .caption {
      color: var(--secondary-text-color);
    }

    .hint,
    .preview {
      color: var(--secondary-text-color);
    }

    .preview {
      display: grid;
      gap: 6px;
      padding: 0;
      list-style: none;
    }

    .link {
      justify-self: start;
      min-height: 32px;
      padding: 0;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      font: inherit;
      cursor: pointer;
    }

    .error {
      color: var(--error-color);
    }

    .records {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .record {
      display: grid;
      min-width: 0;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .record.pending {
      opacity: 0.55;
      text-decoration: line-through;
    }

    .record-copy {
      display: grid;
      min-width: 0;
      gap: 2px;
    }

    .record-title,
    .record-detail {
      overflow-wrap: anywhere;
    }

    .record-detail {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .record-action {
      min-width: 40px;
      min-height: 40px;
      padding: 0 10px;
      color: var(--error-color);
      background: transparent;
      border: 0;
      border-radius: 20px;
      font: inherit;
      cursor: pointer;
    }

    .pending .record-action {
      color: var(--primary-color);
    }

    .file-picker {
      display: grid;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .file-picker input {
      color: var(--primary-text-color);
      font: inherit;
    }

    @media (max-width: 520px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t,s=[]){let i=zt(e,t.task_due),a=Number(i.year),o=Number(i.month),h=Number(i.day),c=(new Date(Date.UTC(a,o-1,h)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification_target?.device_id||[]).filter(u=>typeof u=="string"))],this.notificationPersistent=!!t.notification_persistent,this.notificationCritical=!!t.notification_critical,this.notificationRoute=t.notification_route||"",this.attachments=s.filter(u=>u.task_id===t.task_id),this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule_type,this.scheduleUnit=t.schedule_unit||"monthly",this.scheduleInterval=t.schedule_interval||1,this.scheduleWeekdays=t.schedule_weekdays?.length?[...t.schedule_weekdays]:[c],this.scheduleDay=t.schedule_day||h,this.scheduleMonth=t.schedule_month||o,this.scheduleTime=t.schedule_time||`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor=t.problem_sensor||"";let l=!t.task_id;this.scheduleDirty=l,this.assignmentDirty=l,this.notificationDirty=l,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await M(e);this.users=[...t.users].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((s,i)=>(s.name||s.id).localeCompare(i.name||i.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(s=>s.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(s=>this.labels.some(i=>i.label_id===s)),this.nfcTagId=this.tags.some(s=>s.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError="Assignments could not be loaded"}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await Y(e)).sort((t,s)=>this.deviceName(t).localeCompare(this.deviceName(s),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(s=>s.id===t))}catch{this.notificationError="Notification devices could not be loaded"}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t?.task_id)){this.historyLoading=!0,this.historyError="";try{let s=await Q(e,t.task_id);this.history=Array.isArray(s.history)?s.history:[]}catch{this.historyError="Completion history could not be loaded"}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let s=this.problemSensor.trim();return s.startsWith("binary_sensor.")||(t="Select a binary sensor"),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:s}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t="Interval must be at least 1":this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t="Select a valid time":this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t="Select at least one weekday"),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,s=this.scheduleDetails(!1),i=++this.previewRequest;if(!e||!t||!s||s.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let a=await mt(e,s,this.scheduleDirty?void 0:t.task_due||void 0);i===this.previewRequest&&(this.preview=a.task_dues)}catch{i===this.previewRequest&&(this.preview=[],this.previewError="Schedule preview could not be loaded")}finally{i===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),s=this.notificationRoute.trim();if(e||(this.nameError="Name is required"),s&&(!s.startsWith("/")||s.startsWith("//"))&&(this.notificationRouteError="Use an internal path beginning with /"),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await dt(this.hass,this.task.task_id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:s}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(i){return this.saveError=i instanceof Error?i.message:String(i),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return d;let e=d;return this.scheduleUnit==="weekly"?e=n`
        <p class="caption">Weekdays</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,s)=>n`
              <button
                class="weekday"
                type="button"
                aria-label=${t}
                aria-pressed=${this.scheduleWeekdays.includes(s)}
                ?disabled=${this.saving}
                @click=${()=>this.scheduleChanged(()=>{this.scheduleWeekdays=this.scheduleWeekdays.includes(s)?this.scheduleWeekdays.filter(i=>i!==s):[...this.scheduleWeekdays,s]})}
              >
                ${t}
              </button>
            `)}
        </div>
      `:this.scheduleUnit==="monthly"?e=v`
        <${b}
          label="Day"
          .value=${String(this.scheduleDay)}
          .options=${ft}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${b}>
      `:this.scheduleUnit==="yearly"&&(e=v`
        <div class="row">
          <${b}
            label="Day"
            .value=${String(this.scheduleDay)}
            .options=${ft}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${b}>
          <${b}
            label="Month"
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${b}>
        </div>
      `),v`
      <${_}
        label="Time"
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${_}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return d;if(this.previewLoading&&!this.preview.length)return n`<p class="hint" aria-live="polite">Loading preview…</p>`;if(this.previewError)return n`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return n`
        <p class="caption">First due</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return n`
      <p class="caption">Next due dates</p>
      <ol class="preview">
        ${e.map(t=>n`<li>${this.formatDue(t)}</li>`)}
      </ol>
      ${this.preview.length>4?n`
            <button
              class="link"
              type="button"
              @click=${()=>{this.previewExpanded=!this.previewExpanded}}
            >
              ${this.previewExpanded?"Show less":"Show all"}
            </button>
          `:d}
    `}renderPlanning(){return this.scheduleType==="sensor"?v`
        <div class="planning">
          <${b}
            label="Trigger"
            .value=${this.scheduleType}
            .options=${gt}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${b}>
          <${ie}
            label="Problem sensor"
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail})}
          ></${ie}>
          <p class="hint">
            The task becomes due when the binary sensor changes to on.
          </p>
        </div>
      `:v`
      <div class="planning">
        <${b}
          label="Trigger"
          .value=${this.scheduleType}
          .options=${gt}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${b}>
        <div class="row">
          <${_}
            label="Every"
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${_}>
          <${b}
            label="Unit"
            .value=${this.scheduleUnit}
            .options=${Kt}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${b}>
        </div>
        ${this.renderFixedOptions()}
        ${this.scheduleType==="sliding"?n`
              <p class="hint">
                The next due date is calculated from each completion.
              </p>
            `:d}
        ${this.scheduleError?n`<p class="error" role="alert">${this.scheduleError}</p>`:d}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return n`<p class="hint" aria-live="polite">
        Loading assignments…
      </p>`;if(this.assignmentError)return n`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:"Unassigned",value:""},...this.users.map(i=>({label:i.name,value:i.id}))],t=[{label:"No NFC tag",value:""},...this.tags.map(i=>({label:i.name||i.id,value:i.id}))],s=this.labels.map(i=>({label:i.name,value:i.label_id}));return v`
      <div class="planning">
        <${b}
          label="Assignee"
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.assigneeId=i.detail})}
        ></${b}>
        <${b}
          label="NFC tag"
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.nfcTagId=i.detail})}
        ></${b}>
        <${re}
          label="Labels"
          .value=${this.labelIds}
          .options=${s}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.labelIds=i.detail})}
        ></${re}>
      </div>
    `}renderNotification(){if(this.notificationLoading)return n`<p class="hint" aria-live="polite">
        Loading notification devices…
      </p>`;if(this.notificationError)return n`<p class="error" role="alert">${this.notificationError}</p>`;let e=this.devices.map(t=>({label:this.deviceName(t),value:t.id}));return v`
      <div class="planning">
        <${re}
          label="Mobile devices"
          .value=${this.notificationDeviceIds}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationDeviceIds=t.detail})}
        ></${re}>
        ${e.length?d:n`<p class="hint">No mobile app devices found.</p>`}
        <${ae}
          label="Persistent notification"
          description="Also show this notification in Home Assistant."
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationPersistent=t.detail})}
        ></${ae}>
        <${ae}
          label="Critical notification"
          description="Use critical delivery on supported mobile devices."
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationCritical=t.detail})}
        ></${ae}>
        <${_}
          label="Navigation target"
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationRoute=t.detail})}
        ></${_}>
        <p class="hint">Internal path, for example /lovelace/tasks.</p>
      </div>
    `}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}toggleId(e,t){return t.includes(e)?t.filter(s=>s!==e):[...t,e]}renderAttachments(){return n`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?n`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.attachment_id);return n`
                    <li class="record ${t?"pending":""}">
                      <span class="record-copy">
                        <span class="record-title">${e.filename}</span>
                        <span class="record-detail"
                          >${this.formatSize(e.size)}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${t?`Undo removal of ${e.filename}`:`Remove ${e.filename}`}
                        ?disabled=${this.saving}
                        @click=${()=>{this.deletedAttachmentIds=this.toggleId(e.attachment_id,this.deletedAttachmentIds)}}
                      >
                        ${t?"Undo":"Remove"}
                      </button>
                    </li>
                  `})}
                ${this.stagedFiles.map((e,t)=>n`
                    <li class="record">
                      <span class="record-copy">
                        <span class="record-title">${e.name}</span>
                        <span class="record-detail"
                          >${this.formatSize(e.size)} · New</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${`Remove new file ${e.name}`}
                        ?disabled=${this.saving}
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((s,i)=>i!==t)}}
                      >
                        Remove
                      </button>
                    </li>
                  `)}
              </ul>
            `:n`<p class="hint">No attachments.</p>`}
        <label class="file-picker">
          <span>Add files</span>
          <input
            type="file"
            multiple
            ?disabled=${this.saving}
            @change=${e=>{let t=e.target;this.stagedFiles=[...this.stagedFiles,...Array.from(t.files||[])],t.value=""}}
          />
        </label>
      </div>
    `}renderHistory(){return this.historyLoading?n`<p class="hint" aria-live="polite">
        Loading completion history…
      </p>`:this.historyError?n`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.history_entry_id),s=e.notes==="tasks.history.completed_via_nfc"?"Completed via NFC":e.notes||"No notes";return n`
            <li class="record ${t?"pending":""}">
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.completed_at)} ·
                  ${e.user_name||"System"}</span
                >
                <span class="record-detail">${s}</span>
              </span>
              <button
                class="record-action"
                type="button"
                aria-label=${t?"Undo removal of completion":"Remove completion"}
                ?disabled=${this.saving}
                @click=${()=>{this.deletedHistoryEntryIds=this.toggleId(e.history_entry_id,this.deletedHistoryEntryIds)}}
              >
                ${t?"Undo":"Remove"}
              </button>
            </li>
          `})}
      </ul>
    `:n`<p class="hint">No completion history.</p>`}render(){return v`
      <form @submit=${e=>e.preventDefault()}>
        <${_}
          label="Name"
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${_}>
        <${_}
          label="Description"
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${_}>
        <${b}
          label="Status"
          .value=${this.status}
          .options=${Ut}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${b}>
        <${ie}
          label="Icon"
          .value=${this.icon}
          .options=${Bt}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${ie}>
        <${E} heading="Assignment">
          ${this.renderAssignment()}
        </${E}>
        <${E} heading="Notifications">
          ${this.renderNotification()}
        </${E}>
        <${E} heading="Planning" open>
          ${this.renderPlanning()}
        </${E}>
        <${E} heading="Attachments">
          ${this.renderAttachments()}
        </${E}>
        ${this.task?.task_id?v`
              <${E} heading="Completion history">
                ${this.renderHistory()}
              </${E}>
            `:d}
        ${this.saveError?n`<p class="error" role="alert">${this.saveError}</p>`:d}
      </form>
    `}},Pe=g("task-form");customElements.get(Pe)||customElements.define(Pe,Ne);var Ls=async(r,e,t=[])=>{let s=e||{task_id:"",task_name:"",active:!0,schedule_type:"sliding",schedule_unit:"monthly",schedule_interval:1},i=document.createElement(Pe);return i.configure(r,s,t),await T({heading:e?`Edit ${s.task_name}`:"New task",content:i,actions:[{label:"Cancel",value:"cancel"},{label:"Save",value:"save",run:()=>i.save()}]})==="save"};var Le=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=f`
    :host {
      display: inline-flex;
    }

    button {
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      font: inherit;
      cursor: pointer;
    }

    .trigger {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      color: var(--secondary-text-color);
      font-size: 24px;
      line-height: 1;
    }

    .trigger:hover,
    .trigger:focus-visible {
      background: var(--secondary-background-color);
    }

    .trigger:focus-visible,
    .item:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .menu {
      position: fixed;
      inset: auto;
      min-width: 176px;
      max-width: min(280px, calc(100vw - 16px));
      box-sizing: border-box;
      margin: 0;
      padding: 6px 0;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 6px 24px rgba(0, 0, 0, 0.28)
      );
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .item {
      display: block;
      width: 100%;
      min-height: 40px;
      padding: 8px 16px;
      text-align: left;
    }

    .item:hover:not(:disabled) {
      background: var(--secondary-background-color);
    }

    .item:disabled {
      color: var(--disabled-text-color);
      cursor: default;
    }

    .destructive {
      color: var(--error-color);
    }
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),a=window.visualViewport,o=a?.offsetLeft||0,h=a?.offsetTop||0,c=o+(a?.width||window.innerWidth),l=h+(a?.height||window.innerHeight),u=8,p=4,x=Math.min(Math.max(o+u,s.right-i.width),c-i.width-u),k=s.bottom+p,P=k+i.height<=l-u?k:Math.max(h+u,s.top-i.height-p);t.style.left=`${x}px`,t.style.top=`${P}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return n`
      <button
        class="trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded=${this.open}
        aria-label=${this.label}
        @click=${e=>this.toggleMenu(e)}
      >
        ⋮
      </button>
      <div
        class="menu"
        popover="auto"
        role="menu"
        @click=${e=>e.stopPropagation()}
        @keydown=${e=>this.moveFocus(e)}
        @toggle=${e=>{let t=e.newState==="open";this.open=t,t?this.trackPosition():this.stopTrackingPosition()}}
      >
        ${this.items.map(e=>n`
            <button
              class=${e.destructive?"item destructive":"item"}
              type="button"
              role="menuitem"
              ?disabled=${e.disabled}
              @click=${t=>this.choose(t,e)}
            >
              ${e.label}
            </button>
          `)}
      </div>
    `}},ne=g("action-menu");customElements.get(ne)||customElements.define(ne,Le);var vt="tasks-v2-table-state-v1",bt="tasks-v2-table-session-v1",oe={due:"Due",assignee:"Assignee",labels:"Labels",notifications:"Notifications",trigger:"Trigger",status:"Status"},yt={due:!0,assignee:!0,labels:!1,notifications:!1,trigger:!0,status:!0},$t=()=>({assignee:[],labels:[],notifications:[],trigger:[]}),xt=(r,e)=>{try{let t=globalThis[r],s=JSON.parse(t?.getItem(e)||"{}");return s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{return{}}},kt=y(ne),jt=r=>[{label:"Open",value:"open"},{label:"Edit",value:"edit"},{label:r.active===!1?"Resume":"Pause",value:"active"},{label:"Delete",value:"delete",destructive:!0}],He=class extends m{static properties={hass:{attribute:!1},tasks:{attribute:!1},search:{state:!0},sortKey:{state:!0},sortDirection:{state:!0},filters:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=f`
    :host {
      display: block;
      margin-top: 20px;
    }

    .toolbar {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
    }

    .bulk-bar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
      padding: 10px 12px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .bulk-count {
      margin-right: auto;
      font-weight: 500;
    }

    .bulk-bar select,
    .bulk-bar button {
      min-height: 36px;
      box-sizing: border-box;
      padding: 0 10px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
    }

    .bulk-bar button {
      color: var(--primary-color);
      cursor: pointer;
    }

    .bulk-bar button:disabled {
      opacity: 0.55;
      cursor: default;
    }

    .bulk-error {
      flex-basis: 100%;
      margin: 0;
      color: var(--error-color);
    }

    .search {
      width: min(360px, 100%);
      min-height: 40px;
      box-sizing: border-box;
      padding: 8px 12px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
    }

    .search:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    details {
      position: relative;
    }

    summary {
      min-height: 40px;
      box-sizing: border-box;
      padding: 9px 14px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      cursor: pointer;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .popover-panel {
      position: absolute;
      z-index: 2;
      top: 46px;
      right: 0;
      width: min(560px, calc(100vw - 48px));
      box-sizing: border-box;
      padding: 16px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 6px 24px rgba(0, 0, 0, 0.28)
      );
    }

    .column-panel {
      width: 240px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-bottom: 6px;
      font-weight: 500;
    }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 32px;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--primary-color);
    }

    .filter-footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }

    .filter-footer button {
      min-height: 36px;
      padding: 0 12px;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      border-radius: 18px;
      font: inherit;
      cursor: pointer;
    }

    .filter-actions {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }

    .registry-error {
      margin: 0;
      color: var(--error-color);
    }

    .table-wrap {
      overflow-x: auto;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      height: 52px;
      box-sizing: border-box;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      text-align: left;
      vertical-align: middle;
    }

    th {
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    th button,
    .task {
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    th button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: inherit;
    }

    tbody tr:last-child td {
      border-bottom: 0;
    }

    tbody tr:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color) 4%,
        transparent
      );
    }

    .task {
      font-weight: 500;
    }

    .inactive .task {
      color: var(--secondary-text-color);
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    .status::before {
      width: 8px;
      height: 8px;
      background: var(--success-color, #43a047);
      border-radius: 50%;
      content: "";
    }

    .inactive .status::before {
      background: var(--error-color);
    }

    .actions {
      width: 48px;
      padding-right: 8px;
      padding-left: 8px;
      text-align: center;
    }

    .selection {
      width: 48px;
      padding-right: 8px;
      padding-left: 12px;
      text-align: center;
    }

    .empty {
      padding: 28px 16px;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .mobile-details {
      display: none;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 400;
    }

    @media (max-width: 640px) {
      :host {
        margin-top: 16px;
      }

      .due-column,
      .assignee-column,
      .labels-column,
      .notifications-column,
      .trigger-column,
      .status-column {
        display: none;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .bulk-count {
        flex-basis: 100%;
      }

      .search {
        flex: 1 1 220px;
      }

      .popover-panel {
        position: fixed;
        top: 16px;
        right: 16px;
        left: 16px;
        width: auto;
        max-height: calc(100dvh - 32px);
        overflow: auto;
      }

      .filter-grid {
        grid-template-columns: 1fr;
      }

      th,
      td {
        padding-right: 10px;
        padding-left: 10px;
      }

      .mobile-details {
        display: block;
      }
    }
  `;registryConnection;constructor(){super();let e=xt("localStorage",vt),t=xt("sessionStorage",bt);this.tasks=[],this.search=typeof t.search=="string"?t.search:"",this.sortKey=["name","due","assignee","trigger","status"].includes(String(e.sortKey))?e.sortKey:"due",this.sortDirection=e.sortDirection==="desc"?"desc":"asc";let s=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys($t()).map(a=>[a,Array.isArray(s[a])?s[a].filter(o=>typeof o=="string"):[]]));let i=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(yt).map(a=>[a,typeof i[a]=="boolean"?i[a]:yt[a]])),this.users=[],this.labels=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.bulkBusy=!1,this.bulkError=""}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[s,i]=await Promise.allSettled([M(e),Y(e)]);this.registryConnection===t&&(s.status==="fulfilled"&&(this.users=s.value.users,this.labels=s.value.labels),i.status==="fulfilled"&&(this.devices=i.value),(s.status==="rejected"||i.status==="rejected")&&(this.registryError="Some filter options could not be loaded"))}trigger(e){return e.schedule_type==="sensor"?"Problem sensor":e.schedule_type==="fixed"?"Fixed schedule":"After completion"}status(e){return e.active===!1?"Paused":"Active"}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||"Unassigned"}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(s=>t.has(s.label_id)).sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification_target?.device_id||[]);return this.devices.filter(s=>t.has(s.id)).sort((s,i)=>this.deviceName(s).localeCompare(this.deviceName(i),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification_persistent?["Persistent notification"]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="assignee")return[this.users.find(i=>i.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let s=this.taskLabels(e).map(i=>i.label_id);return s.length?s:["__none__"]}if(t==="notifications"){let s=[...e.notification_persistent?["panel"]:[],...this.notificationDevices(e).map(i=>i.id)];return s.length?s:["__none__"]}return[e.schedule_type]}filterLabel(e,t){return t==="__none__"?e==="assignee"?"Unassigned":e==="labels"?"No labels":"No notifications":e==="assignee"?this.users.find(s=>s.id===t)?.name||t:e==="labels"?this.labels.find(s=>s.label_id===t)?.name||t:e==="notifications"?t==="panel"?"Persistent notification":this.deviceName(this.devices.find(s=>s.id===t)):t==="sensor"?"Problem sensor":t==="fixed"?"Fixed schedule":"After completion"}filterOptions(e){return[...new Set(this.tasks.flatMap(s=>this.filterValues(s,e)))].map(s=>({value:s,label:this.filterLabel(e,s)})).sort((s,i)=>s.label.localeCompare(i.label,this.hass?.locale?.language))}matchesFilters(e){return Object.keys(this.filters).every(t=>{let s=this.filters[t];return!s.length||this.filterValues(e,t).some(i=>s.includes(i))})}dueValue(e){if(e.active===!1||!e.task_due)return;let t=Date.parse(e.task_due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);return t===void 0?"\u2014":new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}compare(e,t){let s;if(this.sortKey==="due"){let i=this.dueValue(e),a=this.dueValue(t);if(i===void 0||a===void 0)if(i===a)s=0;else return i===void 0?1:-1;else s=i-a}else{let i=a=>this.sortKey==="name"?a.task_name:this.sortKey==="assignee"?this.assignee(a):this.sortKey==="trigger"?this.trigger(a):this.status(a);s=i(e).localeCompare(i(t),this.hass?.locale?.language)}return s!==0?this.sortDirection==="asc"?s:-s:e.task_name.localeCompare(t.task_name,this.hass?.locale?.language)}visibleTasks(){let e=this.search.trim().toLocaleLowerCase(this.hass?.locale?.language);return this.tasks.filter(t=>this.matchesFilters(t)&&(!e||[t.task_name,t.task_description,this.assignee(t),this.taskLabels(t).map(s=>s.name).join(" "),this.notificationDevices(t).map(s=>this.deviceName(s)).join(" "),this.trigger(t),this.status(t)].some(s=>s?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((t,s)=>this.compare(t,s))}sort(e){this.sortKey===e?this.sortDirection=this.sortDirection==="asc"?"desc":"asc":(this.sortKey=e,this.sortDirection="asc"),this.storeLocalView()}sortLabel(e){return this.sortKey!==e?"":this.sortDirection==="asc"?"\u2191":"\u2193"}toggleFilter(e,t,s){let i=this.filters[e];this.filters={...this.filters,[e]:s?[...new Set([...i,t])]:i.filter(a=>a!==t)},this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(vt,JSON.stringify({sortKey:this.sortKey,sortDirection:this.sortDirection,columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(bt,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}mobileDetails(e){return Object.keys(this.columns).filter(t=>this.columns[t]&&this.columnText(e,t)!=="\u2014").map(t=>this.columnText(e,t)).join(" \xB7 ")}visibleColumnCount(){return Object.values(this.columns).filter(Boolean).length+3}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.task_id))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(s=>s!==e)}toggleVisible(e,t){let s=new Set(this.selectedIds);for(let i of e)t?s.add(i.task_id):s.delete(i.task_id);this.selectedIds=[...s]}bulkTargets(){return this.bulkAction==="assign"?[{value:"__none__",label:"Unassigned"},...this.users.map(e=>({value:e.id,label:e.name}))]:this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:"Persistent notification"},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkOperations(){return this.selectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",task_id:e.task_id,notes:null};if(this.bulkAction==="delete")return{action:"delete",task_id:e.task_id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget==="__none__"?null:this.bulkTarget};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let s=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}else{let s=e.notification_target?.device_id||[];this.bulkTarget==="panel"?t={notification_persistent:this.bulkAction==="add-notification"}:t={notification_target:{device_id:this.bulkAction==="remove-notification"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}}return{action:"update",task_id:e.task_id,changes:t}})}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await T({heading:t?"Delete selected tasks?":"Complete selected tasks?",content:n`<p>
          ${t?`Delete ${e.length} selected tasks including their history and attachments?`:`Mark ${e.length} selected tasks as completed?`}
        </p>`,actions:[{label:"Cancel",value:"cancel"},{label:t?"Delete":"Complete",value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await ht(this.hass,e),this.selectedIds=[],this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=t instanceof Error?t.message:String(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return Object.values(this.filters).reduce((e,t)=>e+t.length,0)}filterGroup(e,t){return n`
      <fieldset>
        <legend>${e}</legend>
        ${this.filterOptions(t).map(s=>n`
            <label>
              <input
                type="checkbox"
                .checked=${this.filters[t].includes(s.value)}
                @change=${i=>this.toggleFilter(t,s.value,i.currentTarget.checked)}
              >
              <span>${s.label}</span>
            </label>
          `)}
      </fieldset>
    `}closePanel(e){e.currentTarget.closest("details")?.removeAttribute("open")}open(e){this.dispatchEvent(new CustomEvent("tasks-task-open",{bubbles:!0,composed:!0,detail:e}))}action(e,t){this.dispatchEvent(new CustomEvent("tasks-task-action",{bubbles:!0,composed:!0,detail:{action:t,task:e}}))}header(e,t,s=""){return n`
      <th
        class=${s}
        aria-sort=${this.sortKey===t?this.sortDirection==="asc"?"ascending":"descending":"none"}
      >
        <button type="button" @click=${()=>this.sort(t)}>
          ${e}
          ${this.sortKey===t?n`<span aria-hidden="true">${this.sortLabel(t)}</span>`:d}
        </button>
      </th>
    `}columnHeader(e){let t=`${e}-column`;return e==="labels"||e==="notifications"?n`<th class=${t}>${oe[e]}</th>`:this.header(oe[e],e,t)}columnCell(e,t){let s=this.columnText(e,t);return n`
      <td class=${`${t}-column`}>
        ${t==="status"?n`<span class="status">${s}</span>`:s}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),s=Object.keys(this.columns).filter(l=>this.columns[l]),i=this.selectedTasks(),a=new Set(this.selectedIds),o=e.length>0&&e.every(l=>a.has(l.task_id)),h=e.some(l=>a.has(l.task_id)),c=this.bulkTargets();return v`
      <div class="toolbar">
        <input
          class="search"
          type="search"
          aria-label="Search tasks"
          placeholder="Search tasks"
          .value=${this.search}
          @input=${l=>{this.search=l.currentTarget.value,this.storeSessionView()}}
        >
        <details>
          <summary>Filters${t?` (${t})`:""}</summary>
          <div class="popover-panel">
            <div class="filter-grid">
              ${this.filterGroup("Assignment","assignee")}
              ${this.filterGroup("Labels","labels")}
              ${this.filterGroup("Notifications","notifications")}
              ${this.filterGroup("Trigger","trigger")}
            </div>
            <div class="filter-footer">
              ${this.registryError?n`<p class="registry-error">${this.registryError}</p>`:n`<span></span>`}
              <div class="filter-actions">
                <button
                  type="button"
                  @click=${()=>{this.filters=$t(),this.storeSessionView()}}
                >
                  Clear filters
                </button>
                <button
                  type="button"
                  @click=${this.closePanel}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>Columns</summary>
          <div class="popover-panel column-panel">
            <fieldset>
              <legend>Visible columns</legend>
              ${Object.keys(oe).map(l=>n`
                  <label>
                    <input
                      type="checkbox"
                      .checked=${this.columns[l]}
                      @change=${u=>this.toggleColumn(l,u.currentTarget.checked)}
                    >
                    <span>${oe[l]}</span>
                  </label>
                `)}
            </fieldset>
            <div class="filter-footer">
              <span></span>
              <button type="button" @click=${this.closePanel}>Done</button>
            </div>
          </div>
        </details>
      </div>
      ${i.length?n`
            <div class="bulk-bar">
              <span class="bulk-count">
                ${i.length} selected
              </span>
              <select
                aria-label="Bulk action"
                .value=${this.bulkAction}
                @change=${l=>{this.bulkAction=l.currentTarget.value,this.bulkTarget="",this.bulkError=""}}
              >
                <option value="">Choose action</option>
                <option value="complete">Complete</option>
                <option value="pause">Pause</option>
                <option value="resume">Resume</option>
                <option value="assign">Assign person</option>
                <option value="add-label">Add label</option>
                <option value="remove-label">Remove label</option>
                <option value="add-notification">Add notification</option>
                <option value="remove-notification">Remove notification</option>
                <option value="delete">Delete</option>
              </select>
              ${c.length?n`
                    <select
                      aria-label="Bulk action target"
                      .value=${this.bulkTarget}
                      @change=${l=>{this.bulkTarget=l.currentTarget.value}}
                    >
                      <option value="">Choose target</option>
                      ${c.map(l=>n`
                          <option value=${l.value}>
                            ${l.label}
                          </option>
                        `)}
                    </select>
                  `:d}
              <button
                type="button"
                ?disabled=${this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget}
                @click=${()=>{this.applyBulk()}}
              >
                ${this.bulkBusy?"Applying\u2026":"Apply"}
              </button>
              <button
                type="button"
                ?disabled=${this.bulkBusy}
                @click=${()=>{this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.bulkError=""}}
              >
                Clear
              </button>
              ${this.bulkError?n`<p class="bulk-error">${this.bulkError}</p>`:d}
            </div>
          `:d}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="selection">
                <input
                  type="checkbox"
                  aria-label="Select visible tasks"
                  .checked=${o}
                  .indeterminate=${h&&!o}
                  @change=${l=>this.toggleVisible(e,l.currentTarget.checked)}
                >
              </th>
              ${this.header("Task","name")}
              ${s.map(l=>this.columnHeader(l))}
              <th class="actions" aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            ${e.length?e.map(l=>v`
                    <tr
                      class=${l.active===!1?"inactive":""}
                      aria-selected=${a.has(l.task_id)}
                    >
                      <td class="selection">
                        <input
                          type="checkbox"
                          aria-label="Select ${l.task_name}"
                          .checked=${a.has(l.task_id)}
                          @change=${u=>this.toggleTask(l.task_id,u.currentTarget.checked)}
                        >
                      </td>
                      <td>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.open(l)}
                        >
                          ${l.task_name}
                          <span class="mobile-details">
                            ${this.mobileDetails(l)}
                          </span>
                        </button>
                      </td>
                      ${s.map(u=>this.columnCell(l,u))}
                      <td class="actions">
                        <${kt}
                          label="Actions for ${l.task_name}"
                          .items=${jt(l)}
                          @tasks-action=${u=>this.action(l,u.detail)}
                        ></${kt}>
                      </td>
                    </tr>
                  `):n`
                  <tr>
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.search?"No matching tasks":"No tasks"}
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `}},_t=g("task-table");customElements.get(_t)||customElements.define(_t,He);var Me=class extends m{static properties={tone:{reflect:!0}};static styles=f`
    :host {
      display: inline-flex;
      margin: 0 8px 8px 0;
    }

    span {
      display: inline-flex;
      min-height: 28px;
      box-sizing: border-box;
      align-items: center;
      padding: 3px 10px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      font-size: 13px;
      line-height: 20px;
    }

    :host([tone="positive"]) span {
      color: var(--success-color);
      border-color: var(--success-color);
    }

    :host([tone="muted"]) span {
      color: var(--secondary-text-color);
    }
  `;constructor(){super(),this.tone="default"}render(){return n`<span><slot></slot></span>`}},le=g("pill");customElements.get(le)||customElements.define(le,Me);var R=y(O),$=y(le),Et=y(F),Oe=class extends m{static properties={attachment:{attribute:!1},url:{}};static styles=f`
    :host {
      display: block;
    }

    img,
    video,
    iframe {
      display: block;
      width: 100%;
      max-height: 70dvh;
      border: 0;
      object-fit: contain;
    }

    audio {
      width: 100%;
    }

    a {
      color: var(--primary-color);
    }
  `;render(){let e=this.attachment.content_type;return e.startsWith("image/")?n`<img src=${this.url} alt=${this.attachment.filename} />`:e.startsWith("video/")?n`<video src=${this.url} controls></video>`:e.startsWith("audio/")?n`<audio src=${this.url} controls></audio>`:e==="application/pdf"?n`<iframe
        src=${this.url}
        title=${this.attachment.filename}
      ></iframe>`:n`<a href=${this.url} target="_blank" rel="noopener">
      Open ${this.attachment.filename}
    </a>`}},Fe=g("attachment-preview");customElements.get(Fe)||customElements.define(Fe,Oe);var Re=class extends m{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},historyError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0}};static styles=f`
    :host,
    .content,
    .records {
      display: grid;
      gap: 12px;
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .description,
    .hint,
    .error {
      margin: 0;
    }

    .description {
      display: grid;
      gap: 8px;
      white-space: pre-wrap;
    }

    .description :is(p, h3, h4, ul, ol, blockquote) {
      margin: 0;
    }

    .description :is(ul, ol) {
      padding-left: 24px;
    }

    .description blockquote {
      padding-left: 12px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--divider-color);
    }

    .description a {
      color: var(--primary-color);
    }

    .description code {
      padding: 1px 4px;
      background: var(--secondary-background-color);
      border-radius: 4px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .error {
      color: var(--error-color);
      font-size: 13px;
    }

    .records {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .record {
      display: grid;
      min-width: 0;
      gap: 2px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    button.record {
      width: 100%;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    button.record:hover {
      background: var(--secondary-background-color);
    }

    .secondary {
      color: var(--secondary-text-color);
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    .planning-details {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 8px 12px;
      margin: 0;
    }

    .planning-details dt {
      color: var(--secondary-text-color);
    }

    .planning-details dd {
      margin: 0;
    }

    @media (max-width: 520px) {
      .planning-details {
        grid-template-columns: 1fr;
        gap: 2px;
      }

      .planning-details dd + dt {
        margin-top: 8px;
      }
    }
  `;hass;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.historyError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1}configure(e,t,s){this.hass=e,this.task=t,this.attachments=s.filter(i=>i.task_id===t.task_id),this.loadDetails()}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.historyError="",this.attachmentError="";let[e,t,s]=await Promise.allSettled([M(this.hass),Q(this.hass,this.task.task_id),ut(this.hass,this.task.task_id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError="Assignment details could not be loaded",t.status==="fulfilled"?this.history=Array.isArray(t.value.history)?t.value.history:[]:this.historyError="Completion history could not be loaded",s.status==="fulfilled"?this.signedFiles=s.value.signed_files||{}:this.attachmentError="Attachment links could not be loaded",this.loading=!1}formatDate(e){if(!e)return"Not scheduled";let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}scheduleText(){if(this.task.schedule_type==="sensor"){let o=this.task.problem_sensor||"",h=this.hass?.states?.[o]?.attributes?.friendly_name||o;return h?`When ${h} reports a problem`:"When a problem occurs"}let e=Math.max(1,Number(this.task.schedule_interval)||1),t=this.task.schedule_unit||"monthly",i=`${e} ${{daily:"day",weekly:"week",monthly:"month",yearly:"year"}[t]}${e===1?"":"s"}`;if(this.task.schedule_type==="sliding")return`Every ${i} after completion`;let a=this.task.schedule_time||"00:00";if(t==="weekly"){let o=Array.from({length:7},(c,l)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,l+1)))),h=(this.task.schedule_weekdays||[]).map(c=>o[c]).filter(Boolean).join(", ");return`Every ${i}${h?` on ${h}`:""} at ${a}`}if(t==="monthly"){let o=this.task.schedule_day==="last"?"the last day":`day ${this.task.schedule_day||1}`;return`Every ${i} on ${o} at ${a}`}if(t==="yearly"){let o=new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,(this.task.schedule_month||1)-1,1)),h=this.task.schedule_day==="last"?`the last day of ${o}`:`${o} ${this.task.schedule_day||1}`;return`Every ${i} on ${h} at ${a}`}return`Every ${i} at ${a}`}renderInline(e){let t=[],s=/(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g,i=0;for(let a of e.matchAll(s)){let o=a.index??0;if(o>i&&t.push(e.slice(i,o)),a[2])t.push(n`<strong>${a[2]}</strong>`);else if(a[3])t.push(n`<em>${a[3]}</em>`);else if(a[4])t.push(n`<code>${a[4]}</code>`);else if(a[5]&&a[6]){let h=a[6];t.push(/^(?:https?:|mailto:|\/|#)/.test(h)?n`<a href=${h} target="_blank" rel="noopener"
                >${a[5]}</a
              >`:a[5])}i=o+a[0].length}return i<e.length&&t.push(e.slice(i)),t}renderDescription(){let e=(this.task.task_description||"").split(/\r?\n/);if(!e.some(s=>s.trim()))return n`<p class="hint">No description.</p>`;let t=[];for(let s=0;s<e.length;){let i=e[s];if(!i.trim())s+=1;else if(i.startsWith("- ")){let a=[];for(;e[s]?.startsWith("- ");)a.push(e[s].slice(2)),s+=1;t.push(n`<ul>
            ${a.map(o=>n`<li>${this.renderInline(o)}</li>`)}
          </ul>`)}else if(/^\d+\. /.test(i)){let a=[];for(;/^\d+\. /.test(e[s]||"");)a.push(e[s].replace(/^\d+\. /,"")),s+=1;t.push(n`<ol>
            ${a.map(o=>n`<li>${this.renderInline(o)}</li>`)}
          </ol>`)}else{let a=/^(#{1,2})\s+(.+)$/.exec(i);t.push(a?a[1].length===1?n`<h3>${this.renderInline(a[2])}</h3>`:n`<h4>${this.renderInline(a[2])}</h4>`:i.startsWith("> ")?n`<blockquote>${this.renderInline(i.slice(2))}</blockquote>`:n`<p>${this.renderInline(i)}</p>`),s+=1}}return t}async openAttachment(e){let t=this.signedFiles[e.attachment_id];if(!t)return;let s=document.createElement(Fe);s.attachment=e,s.url=t,await T({heading:e.filename,content:s})}async complete(){if(!this.hass||this.completing||await T({heading:"Complete task?",content:n`<p>
        Mark “${this.task.task_name}” as completed and calculate its next due
        date?
      </p>`,actions:[{label:"Cancel",value:"cancel"},{label:"Complete",value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await pt(this.hass,this.task.task_id,this.completionNotes),!0}catch(t){return this.completionError=t instanceof Error?t.message:String(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(i=>i.id===this.task.assignee_id)?.name||(this.assignmentReady?"Unassigned":"Loading assignment\u2026"),t=this.tags.find(i=>i.id===this.task.nfc_tag_id),s=(this.task.label_ids||[]).map(i=>this.labels.find(a=>a.label_id===i)).filter(i=>!!i);return v`
      <div class="pills">
        <${$}>${this.formatDate(this.task.task_due)}</${$}>
        <${$}>${e}</${$}>
        <${$} tone=${this.task.active===!1?"muted":"positive"}>
          ${this.task.active===!1?"Inactive":"Active"}
        </${$}>
        ${this.attachments.length?v`<${$}>
              ${this.attachments.length}
              ${this.attachments.length===1?"file":"files"}
            </${$}>`:d}
        ${t?v`<${$}>NFC: ${t.name||t.id}</${$}>`:d}
        ${s.map(i=>v`<${$}>${i.name}</${$}>`)}
      </div>
    `}renderAttachments(){return this.attachmentError?n`<p class="error" role="alert">${this.attachmentError}</p>`:this.attachments.length?n`
      <ul class="records">
        ${this.attachments.map(e=>{let t=!!this.signedFiles[e.attachment_id];return n`
            <li>
              <button
                class="record"
                type="button"
                ?disabled=${!t}
                @click=${()=>{this.openAttachment(e)}}
              >
                <span>${e.filename}</span>
                <span class="secondary"
                  >${this.formatSize(e.size)}</span
                >
              </button>
            </li>
          `})}
      </ul>
    `:n`<p class="hint">No attachments.</p>`}renderHistory(){return this.historyError?n`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>n`
          <li class="record">
            <span
              >${this.formatDate(e.completed_at)} ·
              ${e.user_name||"System"}</span
            >
            <span class="secondary"
              >${e.notes==="tasks.history.completed_via_nfc"?"Completed via NFC":e.notes||"No notes"}</span
            >
          </li>
        `)}
      </ul>
    `:n`<p class="hint">No completion history.</p>`}render(){return v`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading?n`<p class="hint" aria-live="polite">Loading task details…</p>`:d}
        ${this.assignmentError?n`<p class="error" role="alert">${this.assignmentError}</p>`:d}
        <${R} heading="Planning" open>
          <dl class="planning-details">
            <dt>Due</dt>
            <dd>${this.formatDate(this.task.task_due)}</dd>
            <dt>Rule</dt>
            <dd>${this.scheduleText()}</dd>
          </dl>
        </${R}>
        <${R} heading="Attachments">
          ${this.renderAttachments()}
        </${R}>
        <${R} heading="Completion history">
          ${this.renderHistory()}
        </${R}>
        <${Et}
          label="Completion notes"
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${Et}>
        ${this.completionError?n`<p class="error" role="alert">${this.completionError}</p>`:d}
      </div>
    `}},Ue=g("task-viewer");customElements.get(Ue)||customElements.define(Ue,Re);var ii=async(r,e,t)=>{let s=document.createElement(Ue);return s.configure(r,e,t),await T({heading:e.task_name,content:s,actions:[{label:"Close",value:"close"},{label:"Complete",value:"complete",run:()=>s.complete()}]})==="complete"};export{f as a,n as b,d as c,m as d,y as e,v as f,ps as g,M as h,ms as i,gs as j,g as k,T as l,Ls as m,ne as n,jt as o,_t as p,ii as q};
