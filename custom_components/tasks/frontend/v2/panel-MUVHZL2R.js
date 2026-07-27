var B=globalThis,q=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),Pe=new WeakMap,H=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Pe.set(t,e))}return e}toString(){return this.cssText}},Ne=r=>new H(typeof r=="string"?r:r+"",void 0,re),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new H(t,r,re)},Le=(r,e)=>{if(q)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},ne=q?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Ne(t)})(r):r;var{is:ut,defineProperty:mt,getOwnPropertyDescriptor:gt,getOwnPropertyNames:vt,getOwnPropertySymbols:ft,getPrototypeOf:bt}=Object,W=globalThis,He=W.trustedTypes,yt=He?He.emptyScript:"",$t=W.reactiveElementPolyfillSupport,M=(r,e)=>r,oe={toAttribute(r,e){switch(e){case Boolean:r=r?yt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Ue=(r,e)=>!ut(r,e),Me={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:Ue};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Me){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&mt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:n}=gt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let p=s?.call(this);n?.call(this,o),this.requestUpdate(e,p,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Me}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let e=bt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let t=this.properties,i=[...vt(t),...ft(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(ne(s))}else e!==void 0&&t.push(ne(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:oe).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:oe;this._$Em=s;let p=o.fromAttribute(t,n.type);this[s]=p??this._$Ej?.get(s)??p,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(e!==void 0){let o=this.constructor;if(s===!1&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??Ue)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,p=this[s];o!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,n,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[M("elementProperties")]=new Map,w[M("finalized")]=new Map,$t?.({ReactiveElement:w}),(W.reactiveElementVersions??=[]).push("2.1.2");var ue=globalThis,Oe=r=>r,j=ue.trustedTypes,Re=j?j.createPolicy("lit-html",{createHTML:r=>r}):void 0,je="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Ve="?"+A,xt=`<${Ve}>`,C=document,O=()=>C.createComment(""),R=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,Et=r=>me(r)||typeof r?.[Symbol.iterator]=="function",ae=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,ze=/>/g,S=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Be=/'/g,qe=/"/g,Ke=/^(?:script|style|textarea|title)$/i,ge=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),a=ge(1),Ze=ge(2),Je=ge(3),I=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),We=new WeakMap,T=C.createTreeWalker(C,129);function Ye(r,e){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Re!==void 0?Re.createHTML(e):e}var _t=(r,e)=>{let t=r.length-1,i=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=U;for(let p=0;p<t;p++){let l=r[p],d,u,h=-1,y=0;for(;y<l.length&&(o.lastIndex=y,u=o.exec(l),u!==null);)y=o.lastIndex,o===U?u[1]==="!--"?o=Fe:u[1]!==void 0?o=ze:u[2]!==void 0?(Ke.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=S):u[3]!==void 0&&(o=S):o===S?u[0]===">"?(o=s??U,h=-1):u[1]===void 0?h=-2:(h=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?S:u[3]==='"'?qe:Be):o===qe||o===Be?o=S:o===Fe||o===ze?o=U:(o=S,s=void 0);let $=o===S&&r[p+1].startsWith("/>")?" ":"";n+=o===U?l+xt:h>=0?(i.push(d),l.slice(0,h)+je+l.slice(h)+A+$):l+A+(h===-2?p:$)}return[Ye(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},F=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0,p=e.length-1,l=this.parts,[d,u]=_t(e,t);if(this.el=r.createElement(d,i),T.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=T.nextNode())!==null&&l.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(je)){let y=u[o++],$=s.getAttribute(h).split(A),D=/([.?@])?(.*)/.exec(y);l.push({type:1,index:n,name:D[2],strings:$,ctor:D[1]==="."?de:D[1]==="?"?ce:D[1]==="@"?he:N}),s.removeAttribute(h)}else h.startsWith(A)&&(l.push({type:6,index:n}),s.removeAttribute(h));if(Ke.test(s.tagName)){let h=s.textContent.split(A),y=h.length-1;if(y>0){s.textContent=j?j.emptyScript:"";for(let $=0;$<y;$++)s.append(h[$],O()),T.nextNode(),l.push({type:2,index:++n});s.append(h[y],O())}}}else if(s.nodeType===8)if(s.data===Ve)l.push({type:2,index:n});else{let h=-1;for(;(h=s.data.indexOf(A,h+1))!==-1;)l.push({type:7,index:n}),h+=A.length-1}n++}}static createElement(e,t){let i=C.createElement("template");return i.innerHTML=e,i}};function P(r,e,t=r,i){if(e===I)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,n=R(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=P(r,s._$AS(r,e.values),s,i)),e}var le=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??C).importNode(t,!0);T.currentNode=s;let n=T.nextNode(),o=0,p=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new z(n,n.nextSibling,this,e):l.type===1?d=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(d=new pe(n,this,e)),this._$AV.push(d),l=i[++p]}o!==l?.index&&(n=T.nextNode(),o++)}return T.currentNode=C,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),R(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==I&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Et(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=F.createElement(Ye(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new le(s,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=We.get(e.strings);return t===void 0&&We.set(e.strings,t=new F(e)),t}k(e){me(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let n of e)s===t.length?t.push(i=new r(this.O(O()),this.O(O()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Oe(e).nextSibling;Oe(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(e,t=this,i,s){let n=this.strings,o=!1;if(n===void 0)e=P(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==I,o&&(this._$AH=e);else{let p=e,l,d;for(e=n[0],l=0;l<n.length-1;l++)d=P(this,p[i+l],t,l),d===I&&(d=this._$AH[l]),o||=!R(d)||d!==this._$AH[l],d===c?e=c:e!==c&&(e+=(d??"")+n[l+1]),this._$AH[l]=d}o&&!s&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},de=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},ce=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},he=class extends N{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??c)===I)return;let i=this._$AH,s=e===c&&i!==c||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},pe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var wt=ue.litHtmlPolyfillSupport;wt?.(F,z),(ue.litHtmlVersions??=[]).push("3.3.3");var Ge=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let n=t?.renderBefore??null;i._$litPart$=s=new z(e.insertBefore(O(),n),n,void 0,t??{})}return s._$AI(r),s};var ve=globalThis,m=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}};m._$litElement$=!0,m.finalized=!0,ve.litElementHydrateSupport?.({LitElement:m});var At=ve.litElementPolyfillSupport;At?.({LitElement:m});(ve.litElementVersions??=[]).push("4.2.2");var Xe=Symbol.for(""),kt=r=>{if(r?.r===Xe)return r?._$litStatic$},x=r=>({_$litStatic$:r,r:Xe});var Qe=new Map,fe=r=>(e,...t)=>{let i=t.length,s,n,o=[],p=[],l,d=0,u=!1;for(;d<i;){for(l=e[d];d<i&&(n=t[d],(s=kt(n))!==void 0);)l+=s+e[++d],u=!0;d!==i&&p.push(n),o.push(l),d++}if(d===i&&o.push(e[i]),u){let h=o.join("$$lit$$");(e=Qe.get(h))===void 0&&(o.raw=o,Qe.set(h,e=o)),t=p}return r(e,...t)},b=fe(a),Gt=fe(Ze),Qt=fe(Je);var et=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),tt=r=>{if(r.type==="sensor")return{schedule_type:r.type,problem_sensor:r.problemSensor.trim()};let e={schedule_type:r.type,schedule_unit:r.unit,schedule_interval:r.interval};return r.type==="fixed"&&(e.schedule_time=r.time,r.unit==="weekly"?e.schedule_weekdays=r.weekdays:r.unit==="monthly"?e.schedule_day=r.day:r.unit==="yearly"&&(e.schedule_day=r.day,e.schedule_month=r.month)),e},St=async(r,e)=>{let t=new FormData;t.append("file",e);let i=await r.fetchWithAuth("/api/file_upload",{method:"POST",body:t});if(!i.ok)throw new Error(`File upload failed (${i.status})`);return(await i.json()).file_id},it=async(r,e,t)=>{let i=await Promise.all((t.files?.staged||[]).map(s=>St(r,s)));return r.connection.sendMessagePromise({type:"tasks/task/save",task_id:e.task_id,task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,...t.schedule?tt(t.schedule):{schedule_type:e.schedule_type},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification_target:t.notification.deviceIds.length?{device_id:t.notification.deviceIds}:{},notification_persistent:t.notification.persistent,notification_critical:t.notification.critical,notification_route:t.notification.route.trim()||null}:{},file_ids:i,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},st=async r=>{let[e,t,i]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(i)?i:[]}},rt=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(i=>i?.[0]==="mobile_app"))},nt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),ot=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",...tt(e),...t?{task_due:t}:{}});var Tt=new URL(import.meta.url).pathname.match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]?.toLowerCase()||"dev",g=r=>`ha-tasks-${r}-${Tt}`;var be=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=f`
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
  `;running=!1;constructor(){super(),this.heading="",this.content=a``,this.actions=[],this.open=!1}updated(){let e=this.renderRoot.querySelector("dialog");e&&(this.open&&!e.open?e.showModal():!this.open&&e.open&&e.close())}close(e=""){this.renderRoot.querySelector("dialog")?.close(e)}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){return a`
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
          ${this.actions.length?a`
                <footer>
                  ${this.actions.map(e=>a`
                      <button
                        class=${e.destructive?"destructive":c}
                        type="button"
                        @click=${()=>{this.run(e)}}
                      >
                        ${e.label}
                      </button>
                    `)}
                </footer>
              `:c}
        </article>
      </dialog>
    `}},ye=g("dialog");customElements.get(ye)||customElements.define(ye,be);var V=({heading:r,content:e,actions:t=[]})=>{let i=document.createElement(ye);return i.heading=r,i.content=e,i.actions=t,document.body.append(i),i.open=!0,new Promise(s=>{i.addEventListener("tasks-dialog-closed",n=>{i.remove(),s(n.detail)},{once:!0})})};var $e=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=f`
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
  `;constructor(){super(),this.heading="",this.open=!1}render(){return a`
      <details
        ?open=${this.open}
        @toggle=${e=>{this.open=e.currentTarget.open}}
      >
        <summary>${this.heading}</summary>
        <div class="content"><slot></slot></div>
      </details>
    `}},L=g("expandable");customElements.get(L)||customElements.define(L,$e);var ke=f`
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
`,k=class extends m{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=ke;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?a`<span class="error" role="alert">${this.error}</span>`:null}},xe=class extends k{static properties={...k.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return a`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        ${this.multiline?a`
              <textarea
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              ></textarea>
            `:a`
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
    `}},Ee=class extends k{static properties={...k.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        <select
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${!!this.error}
          @change=${e=>this.change(e.target.value)}
        >
          ${this.options.map(e=>a`
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
    `}},_e=class extends k{static properties={...k.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
          ${this.options.map(e=>a`<option value=${e.value}>${e.label}</option>`)}
        </datalist>
        ${this.errorMessage()}
      </label>
    `}},we=class extends m{static properties={label:{},value:{attribute:!1},options:{attribute:!1},disabled:{type:Boolean}};static styles=ke;constructor(){super(),this.label="",this.value=[],this.options=[],this.disabled=!1}toggle(e,t){this.value=t?[...new Set([...this.value,e])]:this.value.filter(i=>i!==e),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.value}))}render(){return a`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <div class="choices">
          ${this.options.map(e=>a`
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
    `}},Ae=class extends m{static properties={label:{},description:{},checked:{type:Boolean},disabled:{type:Boolean}};static styles=[ke,f`
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
    `];constructor(){super(),this.label="",this.description="",this.checked=!1,this.disabled=!1}render(){return a`
      <label>
        <span class="copy">
          <span>${this.label}</span>
          ${this.description?a`<small>${this.description}</small>`:null}
        </span>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${e=>{this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.checked}))}}
        />
      </label>
    `}},K=g("text-field"),Z=g("select-field"),J=g("combobox-field"),Y=g("multi-select-field"),G=g("switch-field");customElements.get(K)||customElements.define(K,xe);customElements.get(Z)||customElements.define(Z,Ee);customElements.get(J)||customElements.define(J,_e);customElements.get(Y)||customElements.define(Y,we);customElements.get(G)||customElements.define(G,Ae);var E=x(K),v=x(Z),Q=x(J),X=x(Y),ee=x(G),_=x(L),Ct=[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],It=[{label:"Tasks",value:"mdi:clipboard-check-outline"},{label:"Tools",value:"mdi:wrench-outline"},{label:"Cleaning",value:"mdi:broom"},{label:"Home",value:"mdi:home-outline"},{label:"Calendar",value:"mdi:calendar-check-outline"}],at=[{label:"After completion",value:"sliding"},{label:"Fixed schedule",value:"fixed"},{label:"Problem sensor",value:"sensor"}],Dt=[{label:"Days",value:"daily"},{label:"Weeks",value:"weekly"},{label:"Months",value:"monthly"},{label:"Years",value:"yearly"}],lt=[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:"Last day",value:"last"}],Pt=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(i=>i.type!=="literal").map(i=>[i.type,i.value]))},Se=class extends m{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=f`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t,i=[]){let s=Pt(e,t.task_due),n=Number(s.year),o=Number(s.month),p=Number(s.day),l=(new Date(Date.UTC(n,o-1,p)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification_target?.device_id||[]).filter(d=>typeof d=="string"))],this.notificationPersistent=!!t.notification_persistent,this.notificationCritical=!!t.notification_critical,this.notificationRoute=t.notification_route||"",this.attachments=i.filter(d=>d.task_id===t.task_id),this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule_type,this.scheduleUnit=t.schedule_unit||"monthly",this.scheduleInterval=t.schedule_interval||1,this.scheduleWeekdays=t.schedule_weekdays?.length?[...t.schedule_weekdays]:[l],this.scheduleDay=t.schedule_day||p,this.scheduleMonth=t.schedule_month||o,this.scheduleTime=t.schedule_time||`${s.hour||"09"}:${s.minute||"00"}`,this.problemSensor=t.problem_sensor||"",this.scheduleDirty=!1,this.assignmentDirty=!1,this.notificationDirty=!1,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await st(e);this.users=[...t.users].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((i,s)=>(i.name||i.id).localeCompare(s.name||s.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(i=>i.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(i=>this.labels.some(s=>s.label_id===i)),this.nfcTagId=this.tags.some(i=>i.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError="Assignments could not be loaded"}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await rt(e)).sort((t,i)=>this.deviceName(t).localeCompare(this.deviceName(i),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(i=>i.id===t))}catch{this.notificationError="Notification devices could not be loaded"}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t)){this.historyLoading=!0,this.historyError="";try{let i=await nt(e,t.task_id);this.history=Array.isArray(i.history)?i.history:[]}catch{this.historyError="Completion history could not be loaded"}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let i=this.problemSensor.trim();return i.startsWith("binary_sensor.")||(t="Select a binary sensor"),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:i}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t="Interval must be at least 1":this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t="Select a valid time":this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t="Select at least one weekday"),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,i=this.scheduleDetails(!1),s=++this.previewRequest;if(!e||!t||!i||i.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let n=await ot(e,i,this.scheduleDirty?void 0:t.task_due||void 0);s===this.previewRequest&&(this.preview=n.task_dues)}catch{s===this.previewRequest&&(this.preview=[],this.previewError="Schedule preview could not be loaded")}finally{s===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),i=this.notificationRoute.trim();if(e||(this.nameError="Name is required"),i&&(!i.startsWith("/")||i.startsWith("//"))&&(this.notificationRouteError="Use an internal path beginning with /"),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await it(this.hass,this.task,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:i}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(s){return this.saveError=s instanceof Error?s.message:String(s),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return c;let e=c;return this.scheduleUnit==="weekly"?e=a`
        <p class="caption">Weekdays</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,i)=>a`
              <button
                class="weekday"
                type="button"
                aria-label=${t}
                aria-pressed=${this.scheduleWeekdays.includes(i)}
                ?disabled=${this.saving}
                @click=${()=>this.scheduleChanged(()=>{this.scheduleWeekdays=this.scheduleWeekdays.includes(i)?this.scheduleWeekdays.filter(s=>s!==i):[...this.scheduleWeekdays,i]})}
              >
                ${t}
              </button>
            `)}
        </div>
      `:this.scheduleUnit==="monthly"?e=b`
        <${v}
          label="Day"
          .value=${String(this.scheduleDay)}
          .options=${lt}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${v}>
      `:this.scheduleUnit==="yearly"&&(e=b`
        <div class="row">
          <${v}
            label="Day"
            .value=${String(this.scheduleDay)}
            .options=${lt}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${v}>
          <${v}
            label="Month"
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${v}>
        </div>
      `),b`
      <${E}
        label="Time"
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${E}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return c;if(this.previewLoading&&!this.preview.length)return a`<p class="hint" aria-live="polite">Loading preview…</p>`;if(this.previewError)return a`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return a`
        <p class="caption">First due</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return a`
      <p class="caption">Next due dates</p>
      <ol class="preview">
        ${e.map(t=>a`<li>${this.formatDue(t)}</li>`)}
      </ol>
      ${this.preview.length>4?a`
            <button
              class="link"
              type="button"
              @click=${()=>{this.previewExpanded=!this.previewExpanded}}
            >
              ${this.previewExpanded?"Show less":"Show all"}
            </button>
          `:c}
    `}renderPlanning(){return this.scheduleType==="sensor"?b`
        <div class="planning">
          <${v}
            label="Trigger"
            .value=${this.scheduleType}
            .options=${at}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${v}>
          <${Q}
            label="Problem sensor"
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail})}
          ></${Q}>
          <p class="hint">
            The task becomes due when the binary sensor changes to on.
          </p>
        </div>
      `:b`
      <div class="planning">
        <${v}
          label="Trigger"
          .value=${this.scheduleType}
          .options=${at}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${v}>
        <div class="row">
          <${E}
            label="Every"
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${E}>
          <${v}
            label="Unit"
            .value=${this.scheduleUnit}
            .options=${Dt}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${v}>
        </div>
        ${this.renderFixedOptions()}
        ${this.scheduleType==="sliding"?a`
              <p class="hint">
                The next due date is calculated from each completion.
              </p>
            `:c}
        ${this.scheduleError?a`<p class="error" role="alert">${this.scheduleError}</p>`:c}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return a`<p class="hint" aria-live="polite">
        Loading assignments…
      </p>`;if(this.assignmentError)return a`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:"Unassigned",value:""},...this.users.map(s=>({label:s.name,value:s.id}))],t=[{label:"No NFC tag",value:""},...this.tags.map(s=>({label:s.name||s.id,value:s.id}))],i=this.labels.map(s=>({label:s.name,value:s.label_id}));return b`
      <div class="planning">
        <${v}
          label="Assignee"
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.assigneeId=s.detail})}
        ></${v}>
        <${v}
          label="NFC tag"
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.nfcTagId=s.detail})}
        ></${v}>
        <${X}
          label="Labels"
          .value=${this.labelIds}
          .options=${i}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.labelIds=s.detail})}
        ></${X}>
      </div>
    `}renderNotification(){if(this.notificationLoading)return a`<p class="hint" aria-live="polite">
        Loading notification devices…
      </p>`;if(this.notificationError)return a`<p class="error" role="alert">${this.notificationError}</p>`;let e=this.devices.map(t=>({label:this.deviceName(t),value:t.id}));return b`
      <div class="planning">
        <${X}
          label="Mobile devices"
          .value=${this.notificationDeviceIds}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationDeviceIds=t.detail})}
        ></${X}>
        ${e.length?c:a`<p class="hint">No mobile app devices found.</p>`}
        <${ee}
          label="Persistent notification"
          description="Also show this notification in Home Assistant."
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationPersistent=t.detail})}
        ></${ee}>
        <${ee}
          label="Critical notification"
          description="Use critical delivery on supported mobile devices."
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationCritical=t.detail})}
        ></${ee}>
        <${E}
          label="Navigation target"
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationRoute=t.detail})}
        ></${E}>
        <p class="hint">Internal path, for example /lovelace/tasks.</p>
      </div>
    `}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}toggleId(e,t){return t.includes(e)?t.filter(i=>i!==e):[...t,e]}renderAttachments(){return a`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?a`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.attachment_id);return a`
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
                ${this.stagedFiles.map((e,t)=>a`
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
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((i,s)=>s!==t)}}
                      >
                        Remove
                      </button>
                    </li>
                  `)}
              </ul>
            `:a`<p class="hint">No attachments.</p>`}
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
    `}renderHistory(){return this.historyLoading?a`<p class="hint" aria-live="polite">
        Loading completion history…
      </p>`:this.historyError?a`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?a`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.history_entry_id),i=e.notes==="tasks.history.completed_via_nfc"?"Completed via NFC":e.notes||"No notes";return a`
            <li class="record ${t?"pending":""}">
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.completed_at)} ·
                  ${e.user_name||"System"}</span
                >
                <span class="record-detail">${i}</span>
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
    `:a`<p class="hint">No completion history.</p>`}render(){return b`
      <form @submit=${e=>e.preventDefault()}>
        <${E}
          label="Name"
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${E}>
        <${E}
          label="Description"
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${E}>
        <${v}
          label="Status"
          .value=${this.status}
          .options=${Ct}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${v}>
        <${Q}
          label="Icon"
          .value=${this.icon}
          .options=${It}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${Q}>
        <${_} heading="Assignment">
          ${this.renderAssignment()}
        </${_}>
        <${_} heading="Notifications">
          ${this.renderNotification()}
        </${_}>
        <${_} heading="Planning" open>
          ${this.renderPlanning()}
        </${_}>
        <${_} heading="Attachments">
          ${this.renderAttachments()}
        </${_}>
        <${_} heading="Completion history">
          ${this.renderHistory()}
        </${_}>
        ${this.saveError?a`<p class="error" role="alert">${this.saveError}</p>`:c}
      </form>
    `}},Te=g("task-form");customElements.get(Te)||customElements.define(Te,Se);var dt=async(r,e,t=[])=>{let i=document.createElement(Te);return i.configure(r,e,t),await V({heading:`Edit ${e.task_name}`,content:i,actions:[{label:"Cancel",value:"cancel"},{label:"Save",value:"save",run:()=>i.save()}]})==="save"};var Ce=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=f`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let i=e.getBoundingClientRect(),s=t.getBoundingClientRect(),n=window.visualViewport,o=n?.offsetLeft||0,p=n?.offsetTop||0,l=o+(n?.width||window.innerWidth),d=p+(n?.height||window.innerHeight),u=8,h=4,y=Math.min(Math.max(o+u,i.right-s.width),l-s.width-u),$=i.bottom+h,D=$+s.height<=d-u?$:Math.max(p+u,i.top-s.height-h);t.style.left=`${y}px`,t.style.top=`${D}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let i=t.indexOf(this.renderRoot.activeElement),s;e.key==="ArrowDown"?s=(i+1)%t.length:e.key==="ArrowUp"?s=(i-1+t.length)%t.length:e.key==="Home"?s=0:e.key==="End"&&(s=t.length-1),s!==void 0&&(e.preventDefault(),t[s].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return a`
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
        ${this.items.map(e=>a`
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
    `}},te=g("action-menu");customElements.get(te)||customElements.define(te,Ce);var Ie=class extends m{static properties={tone:{reflect:!0}};static styles=f`
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
  `;constructor(){super(),this.tone="default"}render(){return a`<span><slot></slot></span>`}},ie=g("pill");customElements.get(ie)||customElements.define(ie,Ie);var ct=x(te),ht=x(L),se=x(ie),Nt=[{label:"Open",value:"open"},{label:"Edit",value:"edit"}],De=class extends m{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=f`
    :host {
      display: block;
      min-height: 100%;
      box-sizing: border-box;
      padding: 24px;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    main {
      max-width: 960px;
      margin: 0 auto;
    }

    header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }

    ul {
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--divider-color);
    }

    .task {
      flex: 1;
      width: 100%;
      padding: 12px 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .task:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .error {
      color: var(--error-color);
    }
  `;unsubscribe;connection;updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await et(this.hass,i=>{this.snapshot=i});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=t instanceof Error?t.message:String(t))}}openTask(e){V({heading:e.task_name,content:b`
        <p>
          <${se} tone=${e.active===!1?"muted":"positive"}>
            ${e.active===!1?"Inactive":"Active"}
          </${se}>
          <${se}>${e.schedule_type||"Unknown trigger"}</${se}>
        </p>
        ${e.task_description?a`<p>${e.task_description}</p>`:c}
        <${ht} heading="Planning" open>
          <p>Due: ${e.task_due||"Not scheduled"}</p>
          <p>Trigger: ${e.schedule_type||"Unknown"}</p>
        </${ht}>
      `,actions:[{label:"Close",value:"close"}]})}render(){let e=this.snapshot;return a`
      <main>
        <header>
          <h1>Tasks V2</h1>
          ${e?a`${e.tasks.length} Tasks · Revision ${e.revision}`:c}
        </header>
        ${this.error?a`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`:e?a`
                <ul>
                  ${e.tasks.map(t=>b`
                      <li>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.openTask(t)}
                        >
                          ${t.task_name}
                        </button>
                        <${ct}
                          label="Actions for ${t.task_name}"
                          .items=${Nt}
                          @tasks-action=${i=>{i.detail==="open"?this.openTask(t):i.detail==="edit"&&this.hass&&dt(this.hass,t,e.attachments)}}
                        ></${ct}>
                      </li>
                    `)}
                </ul>
              `:a`<p>Tasks werden geladen …</p>`}
      </main>
    `}},pt=g("panel-v2");customElements.get(pt)||customElements.define(pt,De);
