var ie=globalThis,se=ie.ShadowRoot&&(ie.ShadyCSS===void 0||ie.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),st=new WeakMap,K=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(se&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=st.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&st.set(t,e))}return e}toString(){return this.cssText}},at=a=>new K(typeof a=="string"?a:a+"",void 0,ye),b=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((i,s,o)=>i+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[o+1],a[0]);return new K(t,a,ye)},rt=(a,e)=>{if(se)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=ie.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,a.appendChild(i)}},$e=se?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return at(t)})(a):a;var{is:ai,defineProperty:ri,getOwnPropertyDescriptor:oi,getOwnPropertyNames:ni,getOwnPropertySymbols:li,getPrototypeOf:ci}=Object,ae=globalThis,ot=ae.trustedTypes,di=ot?ot.emptyScript:"",hi=ae.reactiveElementPolyfillSupport,W=(a,e)=>a,ke={toAttribute(a,e){switch(e){case Boolean:a=a?di:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},lt=(a,e)=>!ai(a,e),nt={attribute:!0,type:String,converter:ke,reflect:!1,useDefault:!1,hasChanged:lt};Symbol.metadata??=Symbol("metadata"),ae.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=nt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&ri(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:o}=oi(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:s,set(l){let u=s?.call(this);o?.call(this,l),this.requestUpdate(e,u,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??nt}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;let e=ci(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){let t=this.properties,i=[...ni(t),...li(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift($e(s))}else e!==void 0&&t.push($e(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let o=(i.converter?.toAttribute!==void 0?i.converter:ke).toAttribute(t,i.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=i.getPropertyOptions(s),l=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ke;this._$Em=s;let u=l.fromAttribute(t,o.type);this[s]=u??this._$Ej?.get(s)??u,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(e!==void 0){let l=this.constructor;if(s===!1&&(o=this[e]),i??=l.getPropertyOptions(e),!((i.hasChanged??lt)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(l._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},l){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),o!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,o]of i){let{wrapped:l}=o,u=this[s];l!==!0||this._$AL.has(s)||u===void 0||this.C(s,void 0,o,u)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[W("elementProperties")]=new Map,C[W("finalized")]=new Map,hi?.({ReactiveElement:C}),(ae.reactiveElementVersions??=[]).push("2.1.2");var Se=globalThis,ct=a=>a,re=Se.trustedTypes,dt=re?re.createPolicy("lit-html",{createHTML:a=>a}):void 0,vt="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+P,pi=`<${bt}>`,M=document,Z=()=>M.createComment(""),J=a=>a===null||typeof a!="object"&&typeof a!="function",Ce=Array.isArray,ui=a=>Ce(a)||typeof a?.[Symbol.iterator]=="function",we=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,pt=/>/g,F=RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,mt=/"/g,ft=/^(?:script|style|textarea|title)$/i,Pe=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),n=Pe(1),yt=Pe(2),$t=Pe(3),N=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),gt=new WeakMap,H=M.createTreeWalker(M,129);function kt(a,e){if(!Ce(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(e):e}var mi=(a,e)=>{let t=a.length-1,i=[],s,o=e===2?"<svg>":e===3?"<math>":"",l=G;for(let u=0;u<t;u++){let h=a[u],p,d,m=-1,T=0;for(;T<h.length&&(l.lastIndex=T,d=l.exec(h),d!==null);)T=l.lastIndex,l===G?d[1]==="!--"?l=ht:d[1]!==void 0?l=pt:d[2]!==void 0?(ft.test(d[2])&&(s=RegExp("</"+d[2],"g")),l=F):d[3]!==void 0&&(l=F):l===F?d[0]===">"?(l=s??G,m=-1):d[1]===void 0?m=-2:(m=l.lastIndex-d[2].length,p=d[1],l=d[3]===void 0?F:d[3]==='"'?mt:ut):l===mt||l===ut?l=F:l===ht||l===pt?l=G:(l=F,s=void 0);let E=l===F&&a[u+1].startsWith("/>")?" ":"";o+=l===G?h+pi:m>=0?(i.push(p),h.slice(0,m)+vt+h.slice(m)+P+E):h+P+(m===-2?u:E)}return[kt(a,o+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},Q=class a{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,l=0,u=e.length-1,h=this.parts,[p,d]=mi(e,t);if(this.el=a.createElement(p,i),H.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=H.nextNode())!==null&&h.length<u;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(vt)){let T=d[l++],E=s.getAttribute(m).split(P),z=/([.?@])?(.*)/.exec(T);h.push({type:1,index:o,name:z[2],strings:E,ctor:z[1]==="."?xe:z[1]==="?"?Te:z[1]==="@"?Ee:B}),s.removeAttribute(m)}else m.startsWith(P)&&(h.push({type:6,index:o}),s.removeAttribute(m));if(ft.test(s.tagName)){let m=s.textContent.split(P),T=m.length-1;if(T>0){s.textContent=re?re.emptyScript:"";for(let E=0;E<T;E++)s.append(m[E],Z()),H.nextNode(),h.push({type:2,index:++o});s.append(m[T],Z())}}}else if(s.nodeType===8)if(s.data===bt)h.push({type:2,index:o});else{let m=-1;for(;(m=s.data.indexOf(P,m+1))!==-1;)h.push({type:7,index:o}),m+=P.length-1}o++}}static createElement(e,t){let i=M.createElement("template");return i.innerHTML=e,i}};function U(a,e,t=a,i){if(e===N)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,o=J(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(a),s._$AT(a,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=U(a,s._$AS(a,e.values),s,i)),e}var _e=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);H.currentNode=s;let o=H.nextNode(),l=0,u=0,h=i[0];for(;h!==void 0;){if(l===h.index){let p;h.type===2?p=new X(o,o.nextSibling,this,e):h.type===1?p=new h.ctor(o,h.name,h.strings,this,e):h.type===6&&(p=new Ae(o,this,e)),this._$AV.push(p),h=i[++u]}l!==h?.index&&(o=H.nextNode(),l++)}return H.currentNode=M,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},X=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),J(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==N&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ui(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&J(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Q.createElement(kt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new _e(s,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=gt.get(e.strings);return t===void 0&&gt.set(e.strings,t=new Q(e)),t}k(e){Ce(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let o of e)s===t.length?t.push(i=new a(this.O(Z()),this.O(Z()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ct(e).nextSibling;ct(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},B=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(e,t=this,i,s){let o=this.strings,l=!1;if(o===void 0)e=U(this,e,t,0),l=!J(e)||e!==this._$AH&&e!==N,l&&(this._$AH=e);else{let u=e,h,p;for(e=o[0],h=0;h<o.length-1;h++)p=U(this,u[i+h],t,h),p===N&&(p=this._$AH[h]),l||=!J(p)||p!==this._$AH[h],p===c?e=c:e!==c&&(e+=(p??"")+o[h+1]),this._$AH[h]=p}l&&!s&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},xe=class extends B{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},Te=class extends B{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},Ee=class extends B{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??c)===N)return;let i=this._$AH,s=e===c&&i!==c||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ae=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}};var gi=Se.litHtmlPolyfillSupport;gi?.(Q,X),(Se.litHtmlVersions??=[]).push("3.3.3");var wt=(a,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let o=t?.renderBefore??null;i._$litPart$=s=new X(e.insertBefore(Z(),o),o,void 0,t??{})}return s._$AI(a),s};var De=globalThis,D=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};D._$litElement$=!0,D.finalized=!0,De.litElementHydrateSupport?.({LitElement:D});var vi=De.litElementPolyfillSupport;vi?.({LitElement:D});(De.litElementVersions??=[]).push("4.2.2");var xt=Symbol.for(""),bi=a=>{if(a?.r===xt)return a?._$litStatic$},$=a=>({_$litStatic$:a,r:xt});var _t=new Map,Ie=a=>(e,...t)=>{let i=t.length,s,o,l=[],u=[],h,p=0,d=!1;for(;p<i;){for(h=e[p];p<i&&(o=t[p],(s=bi(o))!==void 0);)h+=s+e[++p],d=!0;p!==i&&u.push(o),l.push(h),p++}if(p===i&&l.push(e[i]),d){let m=l.join("$$lit$$");(e=_t.get(m))===void 0&&(l.raw=l,_t.set(m,e=l)),t=u}return a(e,...t)},g=Ie(n),Qi=Ie(yt),Xi=Ie($t);var Tt=(a,e)=>a.connection.subscribeMessage(e,{type:"tasks/subscribe"}),Et=a=>{if(a.type==="sensor")return{type:a.type,condition_template:a.conditionTemplate.trim(),message_template:a.messageTemplate.trim()||null};let e={type:a.type,unit:a.unit,interval:a.interval};return a.type==="fixed"&&(e.time=a.time,a.unit==="weekly"?e.weekdays=a.weekdays:a.unit==="monthly"?e.day=a.day:a.unit==="yearly"&&(e.day=a.day,e.month=a.month)),e},fi=async(a,e)=>{let t=new FormData;t.append("file",e);let i=await a.fetchWithAuth("/api/tasks/upload",{method:"POST",body:t});if(!i.ok)throw new Error(`File upload failed (${i.status})`);return(await i.json()).file_id},At=async a=>{let e=await a.json().catch(()=>({}));return new Error(e.code||`HTTP ${a.status}`)},St=async a=>{let e=await a.fetchWithAuth("/api/tasks/archive");if(!e.ok)throw await At(e);let t=URL.createObjectURL(await e.blob()),i=document.createElement("a");i.href=t,i.download=`tasks-${new Date().toISOString().slice(0,10)}.zip`,i.click(),setTimeout(()=>URL.revokeObjectURL(t),0)},Ct=async(a,e)=>{let t=await a.fetchWithAuth("/api/tasks/archive",{method:"POST",headers:{"Content-Type":"application/zip"},body:e});if(!t.ok)throw await At(t);return t.json()},Pt=async(a,e,t)=>{let i=await Promise.all((t.files?.staged||[]).map(s=>fi(a,s)));return a.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.id}:{},name:t.name.trim(),description:t.description.trim()||null,icon:t.icon.trim()||null,active:t.active,...t.schedule?{schedule:Et(t.schedule)}:e?{schedule:e.schedule}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification:{device_ids:t.notification.deviceIds,persistent:t.notification.persistent,critical:t.notification.critical,route:t.notification.route.trim()||null}}:{},file_ids:i,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},V=async a=>{let[e,t,i]=await Promise.all([a.connection.sendMessagePromise({type:"tasks/list"}),a.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),a.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(i)?i:[]}},oe=async a=>{let e=await a.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(i=>i?.[0]==="mobile_app"))},Dt=(a,e)=>a.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),It=(a,e)=>a.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),Lt=(a,e,t)=>a.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),Ft=(a,e)=>a.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),Ht=(a,e,t)=>a.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),Mt=(a,e,t)=>a.connection.sendMessagePromise({type:"tasks/task/preview_next_due",schedule:Et(e),...t?{due:t}:{}});var Nt=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1],yi=Nt?`?v=${encodeURIComponent(decodeURIComponent(Nt))}`:"",Ut={},Rt="",Ot="",Le=new Map,Fe=new Set,$i=a=>{let e=String(a||"en").toLowerCase().split(/[-_]/)[0];return/^[a-z]{2,3}$/.test(e)?e:"en"},ki=a=>Object.fromEntries(Object.entries(a.common||{}).filter(([e])=>e.startsWith("ui_")).map(([e,t])=>{let i=e.indexOf("_",3);return[`${e.slice(3,i)}.${e.slice(i+1)}`,t]})),zt=a=>{if(!Le.has(a)){let e=a==="en"?"/tasks_strings.json":`/tasks_translations/${a}.json`;Le.set(a,fetch(`${e}${yi}`).then(async t=>t.ok?t.json():{}).then(ki).catch(()=>({})))}return Le.get(a)},r=(a,e={})=>String(Ut[a]??a).replace(/\{(\w+)\}/g,(t,i)=>String(e[i]??`{${i}}`)),Y=(a,e)=>r("schedule.with_time",{description:a,time:r("app.at_time",{time:e})}),ne=a=>{if(typeof a!="string"||!a)return;let e=`error.${a}`,t=r(e);return t===e?void 0:t},k=a=>{if(a&&typeof a=="object"){let e=a,t=ne(e.code);if(t)return t;let i=ne(e.message);if(i)return i;if(typeof e.message=="string"&&e.message)return e.message}return a instanceof Error?ne(a.message)||a.message:typeof a=="string"&&a?ne(a)||a:r("error.unknown")};async function He(a){let e=$i(a);Ot=e;let t=await zt("en"),i=e==="en"?t:await zt(e);if(Ot===e&&Rt!==e){Rt=e,Ut={...t,...i};for(let s of Fe)s()}}var Bt=a=>(Fe.add(a),()=>Fe.delete(a)),ss=He(globalThis.navigator?.language);var v=class extends D{unsubscribeLanguage;connectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=Bt(()=>this.requestUpdate()),super.connectedCallback()}disconnectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=void 0,super.disconnectedCallback()}};var f=a=>`ha-tasks-${a}`,Me=decodeURIComponent(new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1]||"");var Ne=class extends v{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},width:{},open:{type:Boolean}};running=!1;closeValue="";constructor(){super(),this.heading="",this.content=n``,this.actions=[],this.width="medium",this.open=!1}close(e=""){this.closeValue=e,this.open=!1}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){let e=this.actions.at(-1),t=this.actions.slice(0,-1);return n`
      <ha-adaptive-dialog
        width=${this.width}
        flexcontent
        header-title=${this.heading}
        .open=${this.open}
        @closed=${()=>{this.open=!1,this.dispatchEvent(new CustomEvent("tasks-dialog-closed",{bubbles:!0,composed:!0,detail:this.closeValue}))}}
      >
        ${this.content}
        ${e?n`
              <ha-dialog-footer slot="footer">
                ${t.map(i=>n`
                    <ha-button
                      slot="secondaryAction"
                      appearance="plain"
                      variant=${i.destructive?"danger":"neutral"}
                      ?disabled=${this.running}
                      @click=${()=>{this.run(i)}}
                    >
                      ${i.label}
                    </ha-button>
                  `)}
                <ha-button
                  slot="primaryAction"
                  appearance="accent"
                  variant=${e.destructive?"danger":"brand"}
                  ?disabled=${this.running}
                  @click=${()=>{this.run(e)}}
                >
                  ${e.label}
                </ha-button>
              </ha-dialog-footer>
            `:""}
      </ha-adaptive-dialog>
    `}},Re=f("dialog");customElements.get(Re)||customElements.define(Re,Ne);var w=({heading:a,content:e,actions:t=[],width:i="medium"})=>{let s=document.createElement(Re);return s.heading=a,s.content=e,s.actions=t,s.width=i,(document.querySelector("home-assistant")?.shadowRoot||document.body).append(s),s.open=!0,new Promise(l=>{s.addEventListener("tasks-dialog-closed",u=>{s.remove(),l(u.detail)},{once:!0})})};var Oe=class extends v{static properties={heading:{},warning:{type:Boolean},open:{type:Boolean}};static styles=b`
    .expandable {
      overflow: hidden;
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .heading {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: var(--ha-space-3);
      padding: 0 var(--ha-space-4);
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      font: inherit;
      font-weight: var(--ha-font-weight-medium);
      text-align: start;
      cursor: pointer;
    }

    .chevron {
      margin-inline-start: auto;
      color: var(--secondary-text-color);
      transition: transform 200ms ease;
    }

    .warning {
      color: var(--error-color);
      --mdc-icon-size: 18px;
    }

    .expandable.open .chevron {
      transform: rotate(180deg);
    }

    .heading:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      visibility: hidden;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease,
        visibility 0s linear 200ms;
    }

    .expandable.open .content {
      grid-template-rows: 1fr;
      opacity: 1;
      visibility: visible;
      transition-delay: 0s;
    }

    .content-inner {
      min-height: 0;
      overflow: hidden;
    }

    .content-padding {
      padding: 0 var(--ha-space-4) var(--ha-space-4);
      color: var(--secondary-text-color);
    }

    @media (prefers-reduced-motion: reduce) {
      .content,
      .chevron {
        transition: none;
      }
    }
  `;constructor(){super(),this.heading="",this.warning=!1,this.open=!1}render(){return n`
      <div class=${this.open?"expandable open":"expandable"}>
        <button
          class="heading"
          type="button"
          aria-expanded=${this.open?"true":"false"}
          @click=${()=>{this.open=!this.open}}
        >
          ${this.heading}
          ${this.warning?n`
                <ha-icon
                  class="warning"
                  icon="mdi:alert-circle-outline"
                  aria-label=${r("app.section_needs_attention")}
                  title=${r("app.section_needs_attention")}
                ></ha-icon>
              `:null}
          <ha-icon
            class="chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div
          class="content"
          aria-hidden=${this.open?"false":"true"}
          ?inert=${!this.open}
        >
          <div class="content-inner">
            <div class="content-padding"><slot></slot></div>
          </div>
        </div>
      </div>
    `}},I=f("expandable");customElements.get(I)||customElements.define(I,Oe);var le=(a,e,t)=>r(a===1?e:t,{count:a}),Vt=$(I),ze=class extends v{static properties={hass:{attribute:!1},busy:{state:!0},status:{state:!0},warning:{state:!0},failed:{state:!0}};static styles=b`
    :host {
      display: grid;
      gap: var(--ha-space-3);
    }

    p,
    ul {
      margin: 0;
    }

    ul {
      display: grid;
      gap: 6px;
      padding-inline-start: var(--ha-space-6);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--ha-space-2);
    }

    button {
      min-height: 40px;
      padding: 0 var(--ha-space-4);
      color: var(--primary-color);
      background: transparent;
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-2xl);
      font: inherit;
      font-weight: var(--ha-font-weight-medium);
      cursor: pointer;
    }

    button.primary {
      color: var(--text-primary-color);
      background: var(--primary-color);
      border-color: var(--primary-color);
    }

    button:disabled {
      opacity: 0.55;
      cursor: default;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    input {
      display: none;
    }

    .status {
      color: var(--success-color);
    }

    .warning {
      color: var(--warning-color);
    }

    .error {
      color: var(--error-color);
    }

    .backup-content {
      display: grid;
      gap: var(--ha-space-4);
    }

    .version {
      color: var(--secondary-text-color);
      font-size: var(--ha-font-size-s);
      text-align: end;
    }
  `;constructor(){super(),this.busy=!1,this.warning=!1,this.failed=!1}async exportArchive(){if(!(!this.hass||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[r("settings.exporting")];try{await St(this.hass),this.status=[r("settings.export_complete")]}catch(e){this.failed=!0,this.status=[r("common.error",{message:k(e)})]}finally{this.busy=!1}}}reportLines(e){let t=[];t.push(le(e.attachments_imported||0,"settings.progress_attachment_one","settings.progress_attachment_many"),le(e.history_entries_imported||0,"settings.progress_history_one","settings.progress_history_many"),le(e.tasks_imported||0,"settings.progress_task_one","settings.progress_task_many"));let i=e.tasks_skipped||[];return i.length&&t.push(r(i.length===1?"settings.progress_skipped_one":"settings.progress_skipped_many",{count:i.length,names:i.join(", ")})),e.attachments_skipped&&t.push(le(e.attachments_skipped,"settings.progress_attachment_skipped_one","settings.progress_attachment_skipped_many")),this.warning=!!(i.length||e.attachments_skipped),t.push(r(this.warning?"settings.import_complete_warning":"settings.import_complete")),t}async importArchive(e){if(!(!this.hass||!e||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[r("settings.progress_load"),r("settings.progress_unpack")];try{this.status=this.reportLines(await Ct(this.hass,e))}catch(t){this.failed=!0,this.status=[r("settings.import_failed",{message:k(t)})]}finally{this.busy=!1}}}render(){let e=this.failed?"error":this.warning?"status warning":"status";return g`
      <${Vt} heading=${r("settings.import_export")} open>
        <div class="backup-content">
          <p>${r("settings.archive_hint")}</p>
          ${this.status?n`<ul class=${e} role="status" aria-live="polite">
                ${this.status.map(t=>n`<li>${t}</li>`)}
              </ul>`:c}
          <input
            id="archive"
            type="file"
            accept=".zip,application/zip"
            ?disabled=${this.busy}
            @change=${t=>{let i=t.currentTarget;this.importArchive(i.files?.[0]),i.value=""}}
          />
          <div class="actions">
            <button
              type="button"
              ?disabled=${this.busy}
              @click=${()=>this.renderRoot.querySelector("#archive")?.click()}
            >
              ${r("settings.import")}
            </button>
            <button
              class="primary"
              type="button"
              ?disabled=${this.busy}
              @click=${()=>{this.exportArchive()}}
            >
              ${r("settings.export")}
            </button>
          </div>
        </div>
      </${Vt}>
      ${Me?n`<p class="version">${r("app.version",{version:Me})}</p>`:c}
    `}},Ue=f("archive");customElements.get(Ue)||customElements.define(Ue,ze);var jt=a=>{let e=document.createElement(Ue);return e.hass=a,w({heading:r("settings.title"),content:e})};var ee=(a,e)=>{let t=e.toLowerCase(),i=a.split(".").pop()?.toLowerCase();return t.startsWith("image/")?"mdi:file-image-outline":t==="application/pdf"||i==="pdf"?"mdi:file-pdf-box":t.startsWith("text/")||["txt","md","log"].includes(i||"")?"mdi:file-document-outline":t.startsWith("audio/")?"mdi:file-music-outline":t.startsWith("video/")?"mdi:file-video-outline":t.includes("zip")||t.includes("compressed")||["zip","rar","7z","gz"].includes(i||"")?"mdi:folder-zip-outline":t.includes("spreadsheet")||t.includes("excel")||["csv","xls","xlsx","ods"].includes(i||"")?"mdi:file-table-outline":t.includes("word")||["doc","docx","odt","rtf"].includes(i||"")?"mdi:file-word-outline":"mdi:file-outline"},te=a=>a<1024?`${a} B`:a<1048576?`${Math.round(a/1024)} KB`:`${(a/1048576).toFixed(1)} MB`;var ce=a=>[...a].sort((e,t)=>Date.parse(t.occurred_at)-Date.parse(e.occurred_at)),de=a=>a.type==="problem"?"mdi:alert-circle-outline":a.notes==="tasks.history.completed_via_nfc"?"mdi:nfc":a.user_id?"mdi:account-outline":"mdi:note-text-outline";var R=a=>r(a?"problem.detected":"problem.standby"),O=()=>r("problem.trigger_unavailable");var qt={daily:"day",weekly:"week",monthly:"month",yearly:"year"},he=(a,e)=>{if(a.type==="sensor")return r("schedule.problem_sensor_description");let t=a.unit||"daily",i=Math.max(1,Number(a.interval)||1),s=r(`schedule.period_${qt[t]}`),o=r(`schedule.period_${qt[t]}s`);if(a.type==="sliding")return r(i===1?"schedule.after_completion_one":"schedule.after_completion_many",{schedule_interval:i,period:i===1?s:o});let l=a.time||"09:00";if(t==="weekly"){let u=Array.from({length:7},(d,m)=>new Intl.DateTimeFormat(e,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,m+1)))),h=(a.weekdays||[]).map(d=>u[d]).filter(Boolean),p=h.length>1?`${h.slice(0,-1).join(", ")} ${r("schedule.and")} ${h.at(-1)}`:h[0]||"";return Y(r(i===1?"schedule.weekly_one":"schedule.weekly_many",{schedule_interval:i,days:p?` ${r("schedule.on_days",{days:p})}`:""}),l)}if(t==="monthly"){let u=a.day==="last"?r("schedule.on_last_day"):r("schedule.on_day_number",{day:Number(a.day||1)});return Y(r(i===1?"schedule.monthly_one":"schedule.monthly_many",{schedule_interval:i,day:u}),l)}if(t==="yearly"){let u=new Intl.DateTimeFormat(e,{month:"long"}).format(new Date(2024,(a.month||1)-1,1)),h=a.day==="last"?r("schedule.on_last_day_of_month",{month:u}):r("schedule.on_day_of_month",{day:Number(a.day||1),month:u});return Y(r(i===1?"schedule.yearly_one":"schedule.yearly_many",{schedule_interval:i,day:h}),l)}return Y(r(i===1?"schedule.fixed_one":"schedule.fixed_many",{schedule_interval:i,period:i===1?s:o}),l)};var wi=b`
  :host {
    display: block;
  }

  label {
    display: grid;
    gap: 6px;
    color: var(--primary-text-color);
    font-size: 13px;
  }

  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: 9px var(--ha-space-3);
    color: var(--primary-text-color);
    background: var(--primary-background-color);
    border: var(--ha-border-width-sm) solid var(--divider-color);
    border-radius: var(--ha-border-radius-md);
    font: inherit;
    font-size: var(--ha-font-size-m);
  }

  input,
  select {
    height: 40px;
  }

  input[type="time"] {
    display: block;
    min-inline-size: 0;
    inline-size: 100%;
    inline-size: -webkit-fill-available;
    padding-block: 0;
    -webkit-appearance: none;
    appearance: none;
    line-height: 40px;
  }

  input[type="time"]::-webkit-date-and-time-value {
    height: 100%;
    margin: 0;
    line-height: 40px;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }

  textarea.with-toolbar {
    border-radius: var(--ha-border-radius-md) var(--ha-border-radius-md) 0 0;
  }

  .toolbar {
    display: flex;
    min-height: 40px;
    box-sizing: border-box;
    align-items: center;
    padding: 0 var(--ha-space-2);
    margin-top: -1px;
    background: var(--secondary-background-color);
    border: var(--ha-border-width-sm) solid var(--divider-color);
    border-radius: 0 0 var(--ha-border-radius-md) var(--ha-border-radius-md);
  }

  ::slotted(button[slot="toolbar"]) {
    display: inline-flex;
    min-height: 32px;
    align-items: center;
    gap: var(--ha-space-2);
    padding: 0 var(--ha-space-2);
    color: var(--primary-color);
    background: transparent;
    border: 0;
    border-radius: var(--ha-border-radius-md);
    cursor: pointer;
    font: inherit;
    font-weight: 500;
  }

  ::slotted(button[slot="toolbar"]:hover) {
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
  }

  ::slotted(button[slot="toolbar"]:focus-visible) {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }

  ::slotted(button[slot="toolbar"]:disabled) {
    cursor: default;
    opacity: 0.5;
  }

  input:hover,
  textarea:hover,
  select:hover {
    border-color: var(--secondary-text-color);
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: var(--primary-color);
    outline: 1px solid var(--primary-color);
  }

  [aria-invalid="true"] {
    border-color: var(--error-color);
  }

  .error {
    display: block;
    margin-top: 6px;
    color: var(--error-color);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

`,j=class extends v{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=wi;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?n`<span class="error" role="alert">${this.error}</span>`:null}},Be=class extends j{static properties={...j.properties,placeholder:{},hideLabel:{attribute:"hide-label",type:Boolean},multiline:{type:Boolean},hasToolbar:{attribute:"has-toolbar",type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.placeholder="",this.hideLabel=!1,this.multiline=!1,this.hasToolbar=!1,this.inputType="text",this.min=void 0}render(){return n`
      <label>
        <span class=${this.hideLabel?"visually-hidden":""}>
          ${this.label}
        </span>
        ${this.multiline?n`
              <textarea
                class=${this.hasToolbar?"with-toolbar":""}
                .value=${this.value}
                .placeholder=${this.placeholder}
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
                .placeholder=${this.placeholder}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              />
            `}
      </label>
      ${this.hasToolbar?n`<div class="toolbar"><slot name="toolbar"></slot></div>`:null}
      ${this.errorMessage()}
    `}},Ve=class extends j{static properties={...j.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return n`
      <label>
        <span>${this.label}</span>
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
    `}},q=f("text-field"),pe=f("select-field");customElements.get(q)||customElements.define(q,Be);customElements.get(pe)||customElements.define(pe,Ve);var _=$(q),y=$(pe),A=$(I),x=$("ha-form"),_i=500,Kt=()=>[{label:r("task.sliding"),value:"sliding"},{label:r("task.fixed"),value:"fixed"},{label:r("task.problem_sensor"),value:"sensor"}],xi=a=>a.match(/^\s*{{\s*is_state\(['"](binary_sensor\.[^'"]+)['"],\s*['"]on['"]\)\s*}}\s*$/)?.[1]||"",Ti=()=>[{label:r("task.daily"),value:"daily"},{label:r("task.weekly"),value:"weekly"},{label:r("task.monthly"),value:"monthly"},{label:r("task.yearly"),value:"yearly"}],Wt=()=>[...Array.from({length:31},(a,e)=>({label:String(e+1),value:String(e+1)})),{label:r("task.last_day"),value:"last"}],Ei=(a,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:a.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(i=>i.type!=="literal").map(i=>[i.type,i.value]))},je=class extends v{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},conditionTemplate:{state:!0},messageTemplate:{state:!0},conditionPreview:{state:!0},messagePreview:{state:!0},conditionTemplateError:{state:!0},messageTemplateError:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0},fileDropActive:{state:!0}};static styles=b`
    :host,
    form,
    .planning {
      display: grid;
      gap: var(--ha-space-4);
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ha-space-3);
    }

    .selector-field {
      display: grid;
      gap: 6px;
      color: var(--primary-text-color);
    }

    .selector-field[data-native-picker-spacing] {
      gap: 0;
    }

    .selector-label {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 13px;
    }

    .section-divider {
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--ha-space-1);
    }

    .weekday {
      min-width: 0;
      min-height: 36px;
      padding: 0 var(--ha-space-1);
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border: var(--ha-border-width-sm) solid transparent;
      border-radius: var(--ha-border-radius-pill);
      font: inherit;
      cursor: pointer;
    }

    .weekday[aria-pressed="true"] {
      color: var(--text-primary-color);
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

    .template-feedback {
      min-height: 16px;
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
      gap: var(--ha-space-1);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .record {
      display: grid;
      min-width: 0;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ha-space-3);
      padding: var(--ha-space-2) 0;
      border-bottom: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .record-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
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

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .record-detail {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .record-action {
      display: inline-flex;
      width: 40px;
      height: 40px;
      align-items: center;
      justify-content: center;
      padding: 0;
      color: var(--error-color);
      background: transparent;
      border: 0;
      border-radius: var(--ha-border-radius-2xl);
      font: inherit;
      cursor: pointer;
    }

    .pending .record-action {
      color: var(--primary-color);
    }

    .record-action ha-icon {
      --mdc-icon-size: 20px;
    }

    .file-picker {
      display: flex;
      min-height: 112px;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ha-space-1);
      padding: var(--ha-space-4);
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      border: var(--ha-border-width-md) dashed var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
      text-align: center;
      cursor: pointer;
    }

    .file-picker:hover,
    .file-picker.drag-active {
      background: var(--secondary-background-color);
      border-color: var(--primary-color);
    }

    .file-picker:focus-within {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .file-picker-secondary {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .file-picker input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }

    @media (max-width: 520px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;templateValidationRequest=0;templateValidationTimer;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.conditionTemplate="",this.messageTemplate="",this.conditionPreview="",this.messagePreview="",this.conditionTemplateError="",this.messageTemplateError="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1,this.fileDropActive=!1}configure(e,t,i=[]){let s=Ei(e,t.due),o=Number(s.year),l=Number(s.month),u=Number(s.day),h=(new Date(Date.UTC(o,l-1,u)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.name,this.description=t.description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification.device_ids||[]).filter(d=>typeof d=="string"))],this.notificationPersistent=!!t.notification.persistent,this.notificationCritical=!!t.notification.critical,this.notificationRoute=t.notification.route||"",this.attachments=[...t.attachments],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=ce(t.history||[]),this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule.type,t.schedule.type==="sensor"?(this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[h],this.scheduleDay=u,this.scheduleMonth=l,this.scheduleTime=`${s.hour||"09"}:${s.minute||"00"}`,this.conditionTemplate=t.schedule.condition_template,this.messageTemplate=t.schedule.message_template||""):(this.scheduleUnit=t.schedule.unit,this.scheduleInterval=t.schedule.interval,this.scheduleWeekdays=t.schedule.type==="fixed"&&t.schedule.weekdays?.length?[...t.schedule.weekdays]:[h],this.scheduleDay=t.schedule.type==="fixed"&&t.schedule.day?t.schedule.day:u,this.scheduleMonth=t.schedule.type==="fixed"&&t.schedule.month?t.schedule.month:l,this.scheduleTime=t.schedule.type==="fixed"&&t.schedule.time||`${s.hour||"09"}:${s.minute||"00"}`,this.conditionTemplate="",this.messageTemplate="");let p=!t.id;this.scheduleDirty=p,this.assignmentDirty=p,this.notificationDirty=p,this.loadAssignments(),this.loadNotifications(),this.updateComplete.then(()=>this.loadPreview()),this.validateProblemTemplates()}conditionValue(){return this.conditionTemplate.trim()}async chooseProblemEntity(){if(!this.hass||this.saving)return;let e=xi(this.conditionTemplate),t=e,i=document.createElement("ha-form");i.hass=this.hass,i.data={problemSensor:e},i.schema=[{name:"problemSensor",required:!0,selector:{entity:{filter:{domain:"binary_sensor"}}}}],i.computeLabel=()=>r("task.binary_sensor"),i.addEventListener("value-changed",l=>{t=l.detail.value.problemSensor||""});let s=!!(this.conditionTemplate.trim()&&!e);await w({heading:r("task.select_problem_entity"),content:n`
        ${s?n`<p>${r("task.replace_condition_hint")}</p>`:c}
        ${i}
      `,actions:[{label:r("common.cancel"),value:"cancel"},{label:s?r("task.replace_condition"):r("app.apply"),value:"apply",run:()=>!!t}],width:"small"})!=="apply"||!t||(this.scheduleChanged(()=>{this.conditionTemplate=`{{ is_state('${t}', 'on') }}`,this.conditionPreview="",this.conditionTemplateError=""}),await this.validateProblemTemplates())}renderTemplateOnce(e){if(!this.hass||!e)return Promise.resolve("");let t;return new Promise((i,s)=>{t=this.hass.connection.subscribeMessage(o=>{if(t?.then(l=>l()),o.error){s(o.error);return}i(o.result??"")},{type:"render_template",template:e,strict:!0,report_errors:!0}),t.catch(s)})}scheduleTemplateValidation(){this.templateValidationRequest+=1,clearTimeout(this.templateValidationTimer),this.templateValidationTimer=setTimeout(()=>{this.validateProblemTemplates()},_i)}async validateProblemTemplates(){if(clearTimeout(this.templateValidationTimer),this.templateValidationTimer=void 0,this.scheduleType!=="sensor")return!0;let e=++this.templateValidationRequest;this.conditionPreview="",this.messagePreview="",this.conditionTemplateError="",this.messageTemplateError="";let[t,i]=await Promise.allSettled([this.renderTemplateOnce(this.conditionValue()),this.messageTemplate.trim()?this.renderTemplateOnce(this.messageTemplate.trim()):Promise.resolve("")]);return e!==this.templateValidationRequest?!1:(this.conditionPreview=t.status==="fulfilled"?typeof t.value=="boolean"?R(t.value):String(t.value):"",this.messagePreview=i.status==="fulfilled"?String(i.value):"",this.conditionTemplateError=t.status==="rejected"?k(t.reason):typeof t.value!="boolean"?r("problem.condition_boolean_required"):"",this.messageTemplateError=i.status==="rejected"?k(i.reason):"",!this.conditionTemplateError&&!this.messageTemplateError)}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await V(e);this.users=[...t.users].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((i,s)=>(i.name||i.id).localeCompare(s.name||s.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(i=>i.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(i=>this.labels.some(s=>s.label_id===i)),this.nfcTagId=this.tags.some(i=>i.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError=r("app.assignment_load_error")}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await oe(e)).sort((t,i)=>this.deviceName(t).localeCompare(this.deviceName(i),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(i=>i.id===t))}catch{this.notificationError=r("app.notification_load_error")}finally{this.notificationLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let i=this.conditionValue();return i||(t=r("app.problem_condition_required")),e&&(this.scheduleError=t),t?void 0:{type:"sensor",conditionTemplate:i,messageTemplate:this.messageTemplate}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t=r("app.interval_min"):this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t=r("app.select_valid_time"):this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t=r("error.select_at_least_one_weekday")),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,i=this.scheduleDetails(!1),s=++this.previewRequest;if(!e||!t||!i||i.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let o=await Mt(e,i,this.scheduleDirty?void 0:t.due||void 0);s===this.previewRequest&&(this.preview=o.dues)}catch{s===this.previewRequest&&(this.preview=[],this.previewError=r("app.preview_load_error"))}finally{s===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}scheduleText(){return he({type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:this.scheduleWeekdays,day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime},this.hass?.locale?.language)}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),i=this.notificationRoute.trim();e||(this.nameError=r("app.name_required")),i&&(!i.startsWith("/")||i.startsWith("//"))&&(this.notificationRouteError=r("app.route_invalid"));let s=await this.validateProblemTemplates();if(!e||!t||this.notificationRouteError||!s||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await Pt(this.hass,this.task.id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:i}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(o){return this.saveError=k(o),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return c;let e=c;return this.scheduleUnit==="weekly"?e=n`
        <p class="selector-label">${r("task.schedule_weekdays")}</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,i)=>n`
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
      `:this.scheduleUnit==="monthly"?e=g`
        <${y}
          label=${r("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${Wt()}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${y}>
      `:this.scheduleUnit==="yearly"&&(e=g`
        <div class="row">
          <${y}
            label=${r("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${Wt()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${y}>
          <${y}
            label=${r("task.month")}
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${y}>
        </div>
      `),g`
      <${_}
        label=${r("task.time")}
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${_}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return c;if(this.previewLoading&&!this.preview.length)return n`<p class="hint" aria-live="polite">
        ${r("app.loading_preview")}
      </p>`;if(this.previewError)return n`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return n`
        <p class="selector-label">${r("task.first_due")}</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return n`
      <p class="selector-label">${r("task.preview_task_dues")}</p>
      <ol class="preview">
        ${e.map(t=>n`<li>${this.formatDue(t)}</li>`)}
      </ol>
      ${this.preview.length>4?n`
            <button
              class="link"
              type="button"
              @click=${()=>{this.previewExpanded=!this.previewExpanded}}
            >
              ${this.previewExpanded?r("app.show_less"):r("app.show_all")}
            </button>
          `:c}
    `}renderPlanning(){if(this.scheduleType==="sensor"){let e=this.task?.schedule.type==="sensor"&&this.task.problem_warning&&this.conditionValue()===this.task.schedule.condition_template.trim(),t=e?O():this.conditionPreview;return g`
        <div class="planning">
          <${y}
            label=${r("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${Kt()}
            ?disabled=${this.saving}
            @value-changed=${i=>this.scheduleChanged(()=>{this.scheduleType=i.detail})}
          ></${y}>
          <${_}
            label=${r("task.problem_condition")}
            .placeholder=${r("schedule.problem_sensor_description")}
            required
            multiline
            has-toolbar
            .value=${this.conditionTemplate}
            ?disabled=${this.saving}
            @value-changed=${i=>{this.scheduleChanged(()=>{this.conditionTemplate=i.detail,this.conditionPreview="",this.conditionTemplateError=""}),this.scheduleTemplateValidation()}}
          >
            <button
              slot="toolbar"
              type="button"
              ?disabled=${this.saving}
              @click=${()=>{this.chooseProblemEntity()}}
            >
              <ha-icon icon="mdi:code-braces-box"></ha-icon>
              ${r("task.generate_from_entity")}
            </button>
          </${_}>
          <div class="template-feedback">
            ${this.conditionTemplateError?n`<p class="error" role="alert">${this.conditionTemplateError}</p>`:t?n`<p class=${e?"error":"hint"}>${r("problem.condition_preview",{result:t})}</p>`:c}
          </div>
          <${_}
            label=${r("task.problem_message")}
            .placeholder=${r("schedule.problem_message_description")}
            multiline
            .value=${this.messageTemplate}
            ?disabled=${this.saving}
            @value-changed=${i=>{this.scheduleChanged(()=>{this.messageTemplate=i.detail,this.messagePreview="",this.messageTemplateError=""}),this.scheduleTemplateValidation()}}
          ></${_}>
          <div class="template-feedback">
            ${this.messageTemplateError?n`<p class="error" role="alert">${this.messageTemplateError}</p>`:this.messagePreview?n`<p class="hint">${r("problem.message_preview",{result:this.messagePreview})}</p>`:c}
          </div>
          ${this.scheduleError?n`<p class="error" role="alert">${this.scheduleError}</p>`:c}
        </div>
      `}return g`
      <div class="planning">
        <${y}
          label=${r("task.recurrence_calculation")}
          .value=${this.scheduleType}
          .options=${Kt()}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${y}>
        <div class="row">
          <${_}
            label=${r("app.every")}
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${_}>
          <${y}
            label=${r("app.unit")}
            .value=${this.scheduleUnit}
            .options=${Ti()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${y}>
        </div>
        ${this.renderFixedOptions()}
        <p class="hint">${this.scheduleText()}</p>
        ${this.scheduleError?n`<p class="error" role="alert">${this.scheduleError}</p>`:c}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return n`<p class="hint" aria-live="polite">
        ${r("app.loading_assignments")}
      </p>`;if(this.assignmentError)return n`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:r("task.unassigned"),value:""},...this.users.map(i=>({label:i.name,value:i.id}))],t=[{label:r("task.no_nfc_tag"),value:""},...this.tags.map(i=>({label:i.name||i.id,value:i.id}))];return g`
      <div class="planning">
        <${y}
          label=${r("task.user")}
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.assigneeId=i.detail})}
        ></${y}>
        <${y}
          label=${r("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.nfcTagId=i.detail})}
        ></${y}>
        <div
          class="selector-field"
          role="group"
          aria-label=${r("task.icon")}
        >
          <span class="selector-label">${r("task.icon")}</span>
          <${x}
            .hass=${this.hass}
            .data=${{icon:this.icon}}
            .schema=${[{name:"icon",selector:{icon:{}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${i=>{this.icon=i.detail.value.icon||""}}
          ></${x}>
        </div>
        <div
          class="selector-field"
          role="group"
          aria-label=${r("task.labels")}
        >
          <span class="selector-label">${r("task.labels")}</span>
          <${x}
            .hass=${this.hass}
            .data=${{labels:this.labelIds}}
            .schema=${[{name:"labels",selector:{label:{multiple:!0}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${i=>this.assignmentChanged(()=>{this.labelIds=i.detail.value.labels||[]})}
          ></${x}>
        </div>
      </div>
    `}renderNotification(){return this.notificationLoading?n`<p class="hint" aria-live="polite">
        ${r("app.loading_notifications")}
      </p>`:this.notificationError?n`<p class="error" role="alert">${this.notificationError}</p>`:g`
      <div class="planning">
        <div class="selector-field" data-native-picker-spacing>
          <span class="selector-label">${r("app.mobile_devices")}</span>
          <${x}
            .hass=${this.hass}
            .data=${{devices:this.notificationDeviceIds}}
            .schema=${[{name:"devices",selector:{device:{multiple:!0,filter:{integration:"mobile_app"}}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${e=>this.notificationChanged(()=>{this.notificationDeviceIds=e.detail.value.devices||[]})}
          ></${x}>
        </div>
        <div class="selector-field">
          <span class="selector-label">${r("app.navigation_target")}</span>
          <${x}
            .hass=${this.hass}
            .data=${{route:this.notificationRoute}}
            .schema=${[{name:"route",selector:{navigation:null}}]}
            .computeLabel=${()=>r("app.navigation_target")}
            .disabled=${this.saving}
            @value-changed=${e=>this.notificationChanged(()=>{this.notificationRoute=e.detail.value.route||""})}
          ></${x}>
        </div>
        ${this.notificationRouteError?n`<p class="error" role="alert">
              ${this.notificationRouteError}
            </p>`:c}
        <p class="hint">${r("app.navigation_hint")}</p>
        <${x}
          .hass=${this.hass}
          .data=${{critical:this.notificationCritical}}
          .schema=${[{name:"critical",selector:{boolean:{}}}]}
          .computeLabel=${()=>r("task.notification_critical")}
          .computeHelper=${()=>r("task.notification_critical_description")}
          .disabled=${this.saving}
          @value-changed=${e=>this.notificationChanged(()=>{this.notificationCritical=e.detail.value.critical??!1})}
        ></${x}>
        <div class="section-divider" role="separator"></div>
        <${x}
          .hass=${this.hass}
          .data=${{persistent:this.notificationPersistent}}
          .schema=${[{name:"persistent",selector:{boolean:{}}}]}
          .computeLabel=${()=>r("task.notification_persistent")}
          .computeHelper=${()=>r("task.notification_persistent_description")}
          .disabled=${this.saving}
          @value-changed=${e=>this.notificationChanged(()=>{this.notificationPersistent=e.detail.value.persistent??!1})}
        ></${x}>
      </div>
    `}toggleId(e,t){return t.includes(e)?t.filter(i=>i!==e):[...t,e]}stageFiles(e){this.saving||(this.stagedFiles=[...this.stagedFiles,...Array.from(e)])}renderAttachments(){return n`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?n`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.id);return n`
                    <li class="record ${t?"pending":""}">
                      <ha-icon
                        class="record-icon"
                        .icon=${ee(e.filename,e.content_type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name"
                          >${e.filename}</span
                        >
                        <span class="record-detail"
                          >${te(e.size)}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${r(t?"app.undo_remove_named":"app.remove_named",{name:e.filename})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.deletedAttachmentIds=this.toggleId(e.id,this.deletedAttachmentIds)}}
                      >
                        <ha-icon
                          .icon=${t?"mdi:undo":"mdi:delete-outline"}
                        ></ha-icon>
                      </button>
                    </li>
                  `})}
                ${this.stagedFiles.map((e,t)=>n`
                    <li class="record">
                      <ha-icon
                        class="record-icon"
                        .icon=${ee(e.name,e.type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name">${e.name}</span>
                        <span class="record-detail"
                          >${te(e.size)} ·
                          ${r("app.new_file")}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${r("app.remove_new_file",{name:e.name})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((i,s)=>s!==t)}}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </button>
                    </li>
                  `)}
              </ul>
            `:n`<p class="hint">${r("task.no_files")}.</p>`}
        <label
          class=${`file-picker ${this.fileDropActive?"drag-active":""}`}
          @dragenter=${e=>{e.preventDefault(),this.saving||(this.fileDropActive=!0)}}
          @dragover=${e=>{e.preventDefault()}}
          @dragleave=${e=>{(!e.relatedTarget||!e.currentTarget||!e.currentTarget.contains(e.relatedTarget))&&(this.fileDropActive=!1)}}
          @drop=${e=>{e.preventDefault(),this.fileDropActive=!1,e.dataTransfer?.files.length&&this.stageFiles(e.dataTransfer.files)}}
        >
          <span>${r("app.drop_files")}</span>
          <span class="file-picker-secondary">${r("app.click_to_upload")}</span>
          <input
            type="file"
            multiple
            ?disabled=${this.saving}
            @change=${e=>{let t=e.target;this.stageFiles(t.files||[]),t.value=""}}
          />
        </label>
      </div>
    `}renderHistory(){return this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.id),i=e.type==="completed"&&e.notes==="tasks.history.completed_via_nfc"?r("history.completed_via_nfc"):e.type==="completed"?e.notes||r("app.no_notes"):e.message;return n`
            <li class="record ${t?"pending":""}">
              <ha-icon
                class="record-icon"
                .icon=${de(e)}
              ></ha-icon>
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.occurred_at)} ·
                  ${e.type==="completed"?e.user_name||r("common.system"):r("history.problem")}</span
                >
                <span class="record-detail">${e.type==="problem"?e.message:i}</span>
              </span>
              <button
                class="record-action"
                type="button"
                aria-label=${t?r("history.undo_remove"):r("history.remove")}
                ?disabled=${this.saving}
                @click=${()=>{this.deletedHistoryEntryIds=this.toggleId(e.id,this.deletedHistoryEntryIds)}}
              >
                <ha-icon
                  .icon=${t?"mdi:undo":"mdi:delete-outline"}
                ></ha-icon>
              </button>
            </li>
          `})}
      </ul>
    `:n`<p class="hint">${r("task.no_history")}.</p>`}planningWarning(){return!!(this.scheduleError||this.conditionTemplateError||this.messageTemplateError||this.task?.schedule.type==="sensor"&&this.task.problem_warning&&this.conditionValue()===this.task.schedule.condition_template.trim())}render(){return g`
      <form @submit=${e=>e.preventDefault()}>
        <${_}
          label=${r("task.name")}
          .placeholder=${r("task.name")}
          .hideLabel=${!0}
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${_}>
        <${_}
          label=${r("task.optional_description")}
          .placeholder=${r("task.optional_description")}
          .hideLabel=${!0}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${_}>
        <${A}
          heading=${r("task.planning")}
          .warning=${this.planningWarning()}
        >
          ${this.renderPlanning()}
        </${A}>
        <${A} heading=${r("task.assignment")}>
          ${this.renderAssignment()}
        </${A}>
        <${A} heading=${r("task.notification")}>
          ${this.renderNotification()}
        </${A}>
        <${A} heading=${r("task.files")}>
          ${this.renderAttachments()}
        </${A}>
        ${this.task?.id?g`
              <${A} heading=${r("task.history")}>
                ${this.renderHistory()}
              </${A}>
            `:c}
        ${this.saveError?n`<p class="error" role="alert">${this.saveError}</p>`:c}
      </form>
    `}},qe=f("task-form");customElements.get(qe)||customElements.define(qe,je);var ue=async(a,e,t=[])=>{let i=e||{id:"",name:"",active:!0,schedule:{type:"sliding",unit:"monthly",interval:1},notification:{device_ids:[],persistent:!1,critical:!1,route:null},due:null,history:[],attachments:[]},s=document.createElement(qe);return s.configure(a,i,t),await w({heading:i.id?r("task.edit"):r("task.new"),content:s,actions:[{label:r("common.save"),value:"save",run:()=>s.save()}]})==="save"},Gt=(a,e)=>ue(a,{...e,id:"",nfc_tag_id:null,due:null,history:[],attachments:[],problem_warning:void 0});var Ke=class extends v{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=b`
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: var(--ha-border-radius-circle);
      color: var(--secondary-text-color);
    }

    .trigger ha-icon {
      --mdc-icon-size: 24px;
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
      max-width: min(280px, calc(100vw - var(--ha-space-4)));
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      overflow: hidden;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
      box-shadow: var(--ha-box-shadow-m, var(--ha-card-box-shadow));
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .item {
      display: flex;
      width: 100%;
      min-height: 40px;
      align-items: center;
      gap: var(--ha-space-3);
      padding: var(--ha-space-2) var(--ha-space-4);
      text-align: left;
    }

    .item ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
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
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .destructive ha-icon {
      color: var(--error-color);
    }
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let i=e.getBoundingClientRect(),s=t.getBoundingClientRect(),o=window.visualViewport,l=o?.offsetLeft||0,u=o?.offsetTop||0,h=l+(o?.width||window.innerWidth),p=u+(o?.height||window.innerHeight),d=8,m=4,T=Math.min(Math.max(l+d,i.right-s.width),h-s.width-d),E=i.bottom+m,z=E+s.height<=p-d?E:Math.max(u+d,i.top-s.height-m);t.style.left=`${T}px`,t.style.top=`${z}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){if(e.key==="Escape"){e.preventDefault(),this.menu?.hidePopover(),this.trigger?.focus();return}let t=this.menuItems();if(!t.length)return;let i=t.indexOf(this.renderRoot.activeElement),s;e.key==="ArrowDown"?s=(i+1)%t.length:e.key==="ArrowUp"?s=(i-1+t.length)%t.length:e.key==="Home"?s=0:e.key==="End"&&(s=t.length-1),s!==void 0&&(e.preventDefault(),t[s].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return n`
      <button
        class="trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded=${this.open}
        aria-label=${this.label}
        @click=${e=>this.toggleMenu(e)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
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
              ${e.icon?n`<ha-icon .icon=${e.icon}></ha-icon>`:""}
              ${e.label}
            </button>
          `)}
      </div>
    `}},me=f("action-menu");customElements.get(me)||customElements.define(me,Ke);var Zt="tasks-table-state-v2",Jt="tasks-table-session-v1",Ai=[{value:"due",label:"task.due"},{value:"assignee",label:"table.assignee"},{value:"nfc",label:"task.nfc_tag_id"},{value:"files",label:"task.files"},{value:"labels",label:"task.labels"},{value:"notifications",label:"table.notifications"},{value:"trigger",label:"table.recurrence"},{value:"status",label:"app.status"}],ge=Object.fromEntries(Ai.map(a=>[a.value,a.label])),Si={assignee:"task.assignment",labels:"task.labels",notifications:"table.notifications",trigger:"table.recurrence",status:"app.status",due:"task.due"},We={due:!0,assignee:!0,nfc:!0,files:!0,labels:!1,notifications:!1,trigger:!1,status:!1},ve=()=>({assignee:[],labels:[],notifications:[],trigger:[],status:[],due:[]}),Ge=Object.keys(ve()),Ci=[{value:"fixed",label:"task.fixed"},{value:"sliding",label:"task.sliding"},{value:"sensor",label:"task.problem_sensor"}],Pi=[{value:"active",label:"app.active"},{value:"paused",label:"app.paused"}],Di=[{value:"overdue",label:"table.due_overdue"},{value:"today",label:"table.due_today"},{value:"tomorrow",label:"table.due_tomorrow"},{value:"next_7_days",label:"table.due_next_7_days"},{value:"next_30_days",label:"table.due_next_30_days"}],Ze=(a,e)=>{let t=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}).formatToParts(new Date(a)),i=s=>t.find(o=>o.type===s)?.value||"";return`${i("year")}-${i("month")}-${i("day")}`},Qt=(a,e)=>{let[t,i,s]=Ze(a,e).split("-").map(Number);return Math.floor(Date.UTC(t,i-1,s)/864e5)},Xt=(a,e)=>{try{let t=globalThis[a],i=JSON.parse(t?.getItem(e)||"{}");return i&&typeof i=="object"&&!Array.isArray(i)?i:{}}catch{return{}}},Yt=$(me),Ii=a=>[{label:r("menu.edit"),value:"edit",icon:"mdi:pencil-outline"},{label:r("menu.copy"),value:"copy",icon:"mdi:content-copy"},{label:a.active===!1?r("app.resume"):r("app.pause"),value:"active",icon:a.active===!1?"mdi:play-circle-outline":"mdi:pause-circle-outline"},{label:r("common.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Li=a=>[{label:r("bulk.complete"),value:"complete",icon:"mdi:check-circle-outline"},{label:r("app.pause"),value:"pause",icon:"mdi:pause-circle-outline"},{label:r("app.resume"),value:"resume",icon:"mdi:play-circle-outline"},{label:r("bulk.assign_person"),value:"assign",icon:"mdi:account-outline"},...a.some(e=>e.assignee_id)?[{label:r("bulk.remove_assignment"),value:"unassign",icon:"mdi:account-off-outline"}]:[],{label:r("app.add_label"),value:"add-label",icon:"mdi:tag-plus-outline"},{label:r("app.remove_label"),value:"remove-label",icon:"mdi:tag-minus-outline"},{label:r("app.add_notification"),value:"add-notification",icon:"mdi:bell-plus-outline"},{label:r("app.remove_notification"),value:"remove-notification",icon:"mdi:bell-minus-outline"},{label:r("bulk.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Je=class extends v{static properties={hass:{attribute:!1},tasks:{attribute:!1},compact:{type:Boolean,reflect:!0},showBulkSelection:{attribute:!1},showIcon:{attribute:!1},showAddTask:{attribute:!1},showHeader:{attribute:!1},showFilters:{attribute:!1},configuredFilters:{attribute:!1},showColumns:{attribute:!1},configuredColumns:{attribute:!1},now:{attribute:!1},showSearch:{attribute:!1},showActionMenu:{attribute:!1},search:{state:!0},filters:{state:!0},openFilterGroups:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},openBulkPicker:{state:!0},openToolbarPanel:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=b`
    :host {
      display: block;
      margin-top: var(--ha-space-5);
    }

    .toolbar {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--ha-space-2);
      margin-bottom: var(--ha-space-3);
    }

    .selection-toolbar {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      gap: var(--ha-space-2);
    }

    .bulk-bar {
      display: grid;
      gap: var(--ha-space-2);
      width: 280px;
    }

    .bulk-bar button {
      min-height: 36px;
      box-sizing: border-box;
      padding: 0 10px;
      background: var(--card-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-md);
      font: inherit;
      color: var(--primary-color);
      cursor: pointer;
    }

    .bulk-bar button:disabled {
      opacity: 0.55;
      cursor: default;
    }

    .bulk-error {
      margin: 0;
      color: var(--error-color);
    }

    .bulk-menu .popover-panel {
      width: 312px;
    }

    .bulk-menu > summary {
      color: var(--primary-color);
    }

    .bulk-action-picker {
      overflow: hidden;
    }

    .bulk-action-picker + .bulk-action-picker {
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .bulk-bar .bulk-action-picker-trigger {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: var(--ha-space-3);
      padding: 0 var(--ha-space-4);
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .bulk-bar .bulk-action-picker-trigger:hover {
      background: var(--secondary-background-color);
    }

    .bulk-action-picker-trigger ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .bulk-action-picker-trigger .picker-chevron,
    .filter-category-heading .filter-chevron {
      margin-inline-start: auto;
      transition: transform 200ms ease;
    }

    .bulk-action-picker.open .picker-chevron,
    .filter-category.open .filter-chevron {
      transform: rotate(180deg);
    }

    .bulk-action-content,
    .filter-category-content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .bulk-action-picker.open .bulk-action-content,
    .filter-category.open .filter-category-content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .bulk-action-list {
      display: grid;
      min-height: 0;
      max-height: min(336px, 42dvh);
      overflow-y: auto;
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .bulk-bar .bulk-action {
      display: flex;
      min-height: 48px;
      align-items: center;
      gap: var(--ha-space-3);
      padding: 0 var(--ha-space-4);
      color: var(--secondary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      text-align: start;
    }

    .bulk-bar .bulk-action + .bulk-action {
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .bulk-bar .bulk-action:hover,
    .bulk-bar .bulk-action.selected {
      background: var(--secondary-background-color);
    }

    .bulk-bar .bulk-action.selected {
      color: var(--primary-color);
    }

    .bulk-action ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .bulk-bar .bulk-action.destructive,
    .bulk-action.destructive ha-icon {
      color: var(--error-color);
    }

    .bulk-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ha-space-2);
      padding-top: var(--ha-space-2);
    }

    .search {
      width: min(360px, 100%);
      min-width: 0;
      min-height: 40px;
      flex: 1;
      box-sizing: border-box;
      padding: var(--ha-space-2) var(--ha-space-3);
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-md);
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

    .toolbar-popover {
      position: relative;
    }

    summary,
    .toolbar-button {
      height: 40px;
      box-sizing: border-box;
      padding: 9px 14px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-md);
      font: inherit;
      cursor: pointer;
    }

    .toolbar-button {
      appearance: none;
      line-height: normal;
    }

    .toolbar-button.full-width {
      width: 100%;
    }

    summary {
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .toolbar > details[open] > summary,
    .selection-toolbar > details[open] > summary,
    .toolbar-button.active {
      color: var(--primary-color);
      background: var(--secondary-background-color);
      border-color: var(--primary-color);
    }

    .popover-panel {
      position: absolute;
      z-index: 2;
      top: 46px;
      right: 0;
      width: min(560px, calc(100vw - var(--ha-space-12)));
      box-sizing: border-box;
      padding: var(--ha-space-4);
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
      box-shadow: var(--ha-box-shadow-m, var(--ha-card-box-shadow));
    }

    .column-panel,
    .filter-panel {
      width: 312px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ha-space-2);
      width: 100%;
    }

    .filter-category {
      position: static;
      width: 100%;
      overflow: hidden;
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .filter-category-heading {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      padding: 0 var(--ha-space-4);
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      font-weight: var(--ha-font-weight-medium);
      text-align: start;
      cursor: pointer;
    }

    .filter-category-heading .filter-chevron {
      color: var(--secondary-text-color);
    }

    .filter-category-count {
      margin-inline-start: var(--ha-space-2);
      color: var(--secondary-text-color);
      font-weight: var(--ha-font-weight-normal);
    }

    .filter-category fieldset {
      min-height: 0;
      overflow: hidden;
      display: grid;
      box-sizing: border-box;
      padding: 0;
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    ha-checkbox {
      min-height: 32px;
    }

    .column-options {
      display: grid;
      overflow: hidden;
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .option-row {
      display: flex;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      align-items: center;
      justify-content: flex-start;
      gap: var(--ha-space-3);
      padding-inline: var(--ha-space-4);
      color: var(--secondary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .option-row ha-icon {
      --mdc-icon-size: 20px;
      margin-inline-start: auto;
    }

    .option-row + .option-row {
      border-top: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .option-row:hover,
    .option-row.active {
      background: var(--secondary-background-color);
    }

    .option-row.active {
      color: var(--primary-color);
      font-weight: var(--ha-font-weight-medium);
    }

    .filter-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ha-space-2);
      margin-top: 0;
      padding-top: var(--ha-space-2);
    }

    .registry-error {
      margin: 0;
      color: var(--error-color);
    }

    @media (prefers-reduced-motion: reduce) {
      .bulk-action-content,
      .picker-chevron,
      .filter-category-content,
      .filter-chevron {
        transition: none;
      }
    }

    .table-wrap {
      overflow-x: auto;
      background: var(--card-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      height: 52px;
      box-sizing: border-box;
      padding: var(--ha-space-2) var(--ha-space-4);
      border-bottom: var(--ha-border-width-sm) solid var(--divider-color);
      text-align: left;
      vertical-align: middle;
    }

    th {
      color: var(--primary-text-color);
      font-weight: var(--ha-font-weight-medium);
      white-space: nowrap;
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

    tbody tr {
      cursor: pointer;
    }

    .task-name {
      color: var(--primary-text-color);
      font-weight: var(--ha-font-weight-medium);
    }

    .inactive .task-name {
      color: var(--secondary-text-color);
    }

    td:is(
        .due-column,
        .assignee-column,
        .files-column,
        .nfc-column,
        .labels-column,
        .notifications-column,
        .trigger-column,
        .status-column
      ) {
      color: var(--secondary-text-color);
    }

    .sensor-warning {
      display: inline-flex;
      margin-left: 6px;
      color: var(--error-color);
      vertical-align: text-bottom;
    }

    .sensor-warning ha-icon {
      --mdc-icon-size: 18px;
    }

    .inactive {
      background: color-mix(
        in srgb,
        var(--secondary-text-color) 5%,
        transparent
      );
    }

    .icon {
      width: 40px;
      padding-right: var(--ha-space-1);
      padding-left: var(--ha-space-3);
      text-align: center;
    }

    .icon ha-icon {
      color: var(--primary-text-color);
    }

    .inactive .icon ha-icon {
      color: var(--secondary-text-color);
    }

    .due-today .icon ha-icon {
      color: var(--warning-color);
    }

    .due-overdue .icon ha-icon {
      color: var(--error-color);
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    .status::before {
      width: 8px;
      height: 8px;
      background: var(--success-color);
      border-radius: var(--ha-border-radius-circle);
      content: "";
    }

    .inactive .status::before {
      background: var(--error-color);
    }

    .actions {
      width: 48px;
      padding-right: var(--ha-space-2);
      padding-left: var(--ha-space-2);
      text-align: center;
    }

    .selection {
      position: relative;
      width: 48px;
      padding-top: 0;
      padding-right: var(--ha-space-2);
      padding-bottom: 0;
      padding-left: var(--ha-space-3);
      line-height: 0;
      text-align: center;
    }

    .selection ha-checkbox {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      min-height: 0;
      transform: translate(-50%, -50%);
    }

    .empty {
      padding: var(--ha-space-7) var(--ha-space-4);
      color: var(--secondary-text-color);
      text-align: center;
    }

    .mobile-details {
      display: none;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: var(--ha-font-size-s);
      font-weight: var(--ha-font-weight-normal);
    }

    @media (max-width: 640px) {
      :host {
        margin-top: var(--ha-space-4);
      }

      .due-column,
      .assignee-column,
      .files-column,
      .nfc-column,
      .labels-column,
      .notifications-column,
      .trigger-column,
      .status-column {
        display: none;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .search {
        flex: 1;
      }

      .toolbar > details,
      .selection-toolbar > details,
      .toolbar > .toolbar-popover {
        position: static;
      }

      .toolbar .popover-panel {
        top: calc(100% + 6px);
        right: 0;
        left: 0;
        width: auto;
        max-width: none;
        max-height: calc(100dvh - 96px);
        overflow: auto;
      }

      .bulk-bar {
        width: 100%;
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

    :host([compact]) {
      margin-top: 0;
    }

    :host([compact])
      :is(
        .due-column,
        .assignee-column,
        .files-column,
        .nfc-column,
        .labels-column,
        .notifications-column,
        .trigger-column,
        .status-column
      ) {
      display: none;
    }

    :host([compact]) .toolbar {
      flex-wrap: wrap;
    }

    :host([compact]) .search {
      flex: 1;
    }

    :host([compact]) :is(.toolbar, .selection-toolbar) > details {
      position: static;
    }

    :host([compact]) .toolbar > .toolbar-popover {
      position: static;
    }

    :host([compact]) .toolbar .popover-panel {
      top: calc(100% + 6px);
      right: 0;
      left: 0;
      width: auto;
      max-width: none;
      max-height: calc(100dvh - 96px);
      overflow: auto;
    }

    :host([compact]) .bulk-bar {
      width: 100%;
    }

    :host([compact]) :is(th, td) {
      padding-right: 10px;
      padding-left: 10px;
    }

    :host([compact]) .mobile-details {
      display: block;
    }
  `;registryConnection;closePanels=e=>{let t=e.composedPath();for(let i of this.renderRoot.querySelectorAll("details[open]"))t.includes(i)||i.removeAttribute("open");t.some(i=>i instanceof HTMLElement&&i.classList.contains("toolbar-popover"))||(this.openToolbarPanel="")};constructor(){super();let e=Xt("localStorage",Zt),t=Xt("sessionStorage",Jt);this.tasks=[],this.compact=!1,this.showBulkSelection=!0,this.showIcon=!0,this.showAddTask=!1,this.showHeader=!0,this.showFilters=!0,this.configuredFilters=void 0,this.showColumns=!0,this.configuredColumns=void 0,this.now=void 0,this.showSearch=!0,this.showActionMenu=!0,this.search=typeof t.search=="string"?t.search:"";let i=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys(ve()).map(o=>[o,Array.isArray(i[o])?i[o].filter(l=>typeof l=="string"):[]])),this.openFilterGroups=[];let s=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(We).map(o=>[o,typeof s[o]=="boolean"?s[o]:We[o]])),this.users=[],this.labels=[],this.tags=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.openBulkPicker="",this.openToolbarPanel="",this.bulkBusy=!1,this.bulkError=""}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.closePanels)}disconnectedCallback(){document.removeEventListener("click",this.closePanels),super.disconnectedCallback()}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[i,s]=await Promise.allSettled([V(e),oe(e)]);this.registryConnection===t&&(i.status==="fulfilled"&&(this.users=i.value.users,this.labels=i.value.labels,this.tags=i.value.tags),s.status==="fulfilled"&&(this.devices=s.value),(i.status==="rejected"||s.status==="rejected")&&(this.registryError=r("app.registry_load_error")))}trigger(e){return e.schedule.type==="sensor"?r("task.problem_sensor"):e.schedule.type==="fixed"?r("task.fixed"):r("task.sliding")}status(e){return e.active===!1?r("app.paused"):r("app.active")}problemSensorWarning(e){if(e.schedule.type!=="sensor"||!e.problem_warning)return c;let t=O();return n`
      <span class="sensor-warning" title=${t} aria-label=${t}>
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </span>
    `}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||"\u2014"}nfcTag(e){return e.nfc_tag_id?this.tags.find(t=>t.id===e.nfc_tag_id)?.name||e.nfc_tag_id:"\u2014"}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(i=>t.has(i.label_id)).sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification.device_ids||[]);return this.devices.filter(i=>t.has(i.id)).sort((i,s)=>this.deviceName(i).localeCompare(this.deviceName(s),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification.persistent?[r("task.notification_persistent")]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="due"){if(e.active===!1||!e.due)return[];let i=this.hass?.config?.time_zone,s=Qt(e.due,i)-Qt(this.now||new Date,i);return[...s<0?["overdue"]:[],...s===0?["today"]:[],...s===1?["tomorrow"]:[],...s>=0&&s<7?["next_7_days"]:[],...s>=0&&s<30?["next_30_days"]:[]]}if(t==="assignee")return[this.users.find(s=>s.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let i=this.taskLabels(e).map(s=>s.label_id);return i.length?i:["__none__"]}if(t==="notifications"){let i=[...e.notification.persistent?["panel"]:[],...this.notificationDevices(e).map(s=>s.id)];return i.length?i:["__none__"]}return t==="status"?[e.active===!1?"paused":"active"]:[e.schedule.type]}filterLabel(e,t){if(t==="__none__")return e==="assignee"?r("task.unassigned"):e==="labels"?r("task.no_labels"):r("app.no_notifications");if(e==="assignee")return this.users.find(s=>s.id===t)?.name||t;if(e==="labels")return this.labels.find(s=>s.label_id===t)?.name||t;if(e==="notifications")return t==="panel"?r("task.notification_persistent"):this.deviceName(this.devices.find(s=>s.id===t));if(e==="status"){let s=Pi.find(o=>o.value===t);return s?r(s.label):t}let i=Ci.find(s=>s.value===t);return i?r(i.label):t}filterOptions(e){return e==="due"?Di.map(i=>({value:i.value,label:r(i.label)})):[...new Set(this.tasks.flatMap(i=>this.filterValues(i,e)))].map(i=>({value:i,label:this.filterLabel(e,i)})).sort((i,s)=>i.label.localeCompare(s.label,this.hass?.locale?.language))}activeFilters(){return this.configuredFilters?{...ve(),...this.configuredFilters}:this.filters}matchesFilters(e,t){return Ge.every(i=>{let s=t[i];return!s.length||this.filterValues(e,i).some(o=>s.includes(o))})}dueValue(e){if(e.active===!1||!e.due)return;let t=Date.parse(e.due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);return t===void 0?e.active!==!1&&e.schedule.type==="sensor"&&!e.due?e.problem_warning?O():R(!1):"\u2014":new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}dueStatus(e){if(e.active===!1||this.dueValue(e)===void 0)return"";let t=this.hass?.config?.time_zone,i=Ze(e.due,t),s=Ze(new Date,t);return i<s?"due-overdue":i===s?"due-today":""}rowClass(e){return e.active===!1?"inactive":this.dueStatus(e)}sortGroup(e){return e.active===!1?2:e.schedule.type==="sensor"&&!e.due?1:0}compareDue(e,t){let i=this.sortGroup(e)-this.sortGroup(t);if(i)return i;let s=this.dueValue(e),o=this.dueValue(t);if(s===void 0||o===void 0){if(s!==o)return s===void 0?1:-1}else if(s!==o)return s-o;return e.name.localeCompare(t.name,this.hass?.locale?.language)}visibleTasks(){let e=this.showSearch?this.search.trim().toLocaleLowerCase(this.hass?.locale?.language):"",t=this.activeFilters();return this.tasks.filter(i=>this.matchesFilters(i,t)&&(!e||[i.name,i.description,this.assignee(i),this.nfcTag(i),this.taskLabels(i).map(s=>s.name).join(" "),this.notificationDevices(i).map(s=>this.deviceName(s)).join(" "),this.trigger(i),this.status(i)].some(s=>s?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((i,s)=>this.compareDue(i,s))}toggleFilter(e,t,i){let s=this.filters[e];this.filters={...this.filters,[e]:i?[...new Set([...s,t])]:s.filter(o=>o!==t)},this.retainVisibleSelection(),this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}resetColumns(){this.columns=this.configuredColumns?Object.fromEntries(Object.keys(ge).map(e=>[e,this.configuredColumns.includes(e)])):{...We},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(Zt,JSON.stringify({columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(Jt,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="files"?String(e.attachments.length):t==="nfc"?this.nfcTag(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}columnValue(e,t){let i=this.columnText(e,t);return t==="due"&&i!=="\u2014"&&this.hass&&e.due?n`
        <ha-relative-time
          .hass=${this.hass}
          .datetime=${e.due}
          capitalize
          title=${i}
        ></ha-relative-time>
      `:t==="status"?n`<span class="status">${i}</span>`:i}mobileDetails(e){return this.visibleColumnKeys().filter(i=>this.columnText(e,i)!=="\u2014").map((i,s)=>n`
        ${s?n`<span aria-hidden="true"> · </span>`:c}
        ${this.columnValue(e,i)}
      `)}visibleColumnKeys(){return this.configuredColumns??Object.keys(this.columns).filter(e=>this.columns[e])}visibleColumnCount(){return this.visibleColumnKeys().length+1+Number(this.showIcon)+Number(this.showBulkSelection)+Number(this.showActionMenu)}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.id))}visibleSelectedTasks(){let e=new Set(this.selectedIds);return this.visibleTasks().filter(t=>e.has(t.id))}retainVisibleSelection(){let e=new Set(this.visibleTasks().map(t=>t.id));this.selectedIds=this.selectedIds.filter(t=>e.has(t))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(i=>i!==e)}toggleVisible(e,t){let i=new Set(this.selectedIds);for(let s of e)t?i.add(s.id):i.delete(s.id);this.selectedIds=[...i]}bulkTargets(){return this.bulkAction==="assign"?this.users.map(e=>({value:e.id,label:e.name})):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:r("task.notification_persistent")},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkActionDestructive(){return["delete","remove-label","remove-notification"].includes(this.bulkAction)}bulkActionLabel(){return this.bulkAction==="complete"?r("bulk.complete"):this.bulkAction==="pause"?r("app.pause"):this.bulkAction==="resume"?r("app.resume"):this.bulkAction==="assign"?r("app.assign"):this.bulkAction==="unassign"?r("bulk.remove_assignment"):this.bulkAction==="add-label"||this.bulkAction==="add-notification"?r("app.add"):this.bulkAction==="remove-label"||this.bulkAction==="remove-notification"?r("common.remove"):this.bulkAction==="delete"?r("common.delete"):r("app.apply")}bulkTargetLabel(){return this.bulkAction==="assign"?r("app.choose_person"):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?r("app.choose_label"):r("app.choose_notification")}bulkTargetIcon(){return this.bulkAction==="assign"?"mdi:account-outline":this.bulkAction==="add-label"||this.bulkAction==="remove-label"?"mdi:tag-outline":"mdi:bell-outline"}bulkOperations(){return this.visibleSelectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",id:e.id,notes:null};if(this.bulkAction==="delete")return{action:"delete",id:e.id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget};else if(this.bulkAction==="unassign")t={assignee_id:null};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let i=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?i.filter(s=>s!==this.bulkTarget):[...new Set([...i,this.bulkTarget])]}}else{let i=e.notification.device_ids||[];this.bulkTarget==="panel"?t={notification:{...e.notification,persistent:this.bulkAction==="add-notification"}}:t={notification:{...e.notification,device_ids:this.bulkAction==="remove-notification"?i.filter(s=>s!==this.bulkTarget):[...new Set([...i,this.bulkTarget])]}}}return{action:"update",id:e.id,changes:t}})}renderBulkPicker(e,t,i,s,o,l){let u=t.find(p=>p.value===i),h=this.openBulkPicker===e;return n`
      <div class=${h?"bulk-action-picker open":"bulk-action-picker"}>
        <button
          class="bulk-action-picker-trigger"
          type="button"
          aria-expanded=${h?"true":"false"}
          @click=${()=>{this.openBulkPicker=h?"":e}}
        >
          <ha-icon .icon=${u?.icon||o}></ha-icon>
          <span>${u?.label||s}</span>
          <ha-icon
            class="picker-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="bulk-action-content">
          <div class="bulk-action-list">
            ${t.map(p=>n`
                <button
                  class=${["bulk-action",i===p.value?"selected":"",p.destructive?"destructive":""].filter(Boolean).join(" ")}
                  type="button"
                  @click=${()=>{l(p.value),this.openBulkPicker=""}}
                >
                  ${p.icon?n`<ha-icon .icon=${p.icon}></ha-icon>`:c}
                  <span>${p.label}</span>
                </button>
              `)}
          </div>
        </div>
      </div>
    `}renderBulkMenu(e){let t=this.bulkTargets(),i=Li(e),s=this.bulkTargetIcon(),o=t.map(l=>({...l,icon:s}));return n`
      <details
        class="bulk-menu"
        @toggle=${l=>{l.currentTarget.open||(this.openBulkPicker="")}}
      >
        <summary>${r("bulk.actions")} (${e.length})</summary>
        <div class="popover-panel">
          <div class="bulk-bar">
            ${this.renderBulkPicker("action",i,this.bulkAction,r("app.choose_action"),"mdi:gesture-tap-button",l=>{this.bulkAction=l,this.bulkTarget="",this.bulkError=""})}
            ${t.length?this.renderBulkPicker("target",o,this.bulkTarget,this.bulkTargetLabel(),s,l=>{this.bulkTarget=l}):c}
            <div class="bulk-footer">
              <ha-button
                appearance="accent"
                variant=${this.bulkActionDestructive()?"danger":"brand"}
                ?disabled=${this.bulkBusy||!e.length||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget}
                @click=${()=>{this.applyBulk()}}
              >
                ${this.bulkBusy?r("app.applying"):this.bulkActionLabel()}
              </ha-button>
            </div>
            ${this.bulkError?n`<p class="bulk-error" role="alert">
                  ${this.bulkError}
                </p>`:c}
          </div>
        </div>
      </details>
    `}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await w({heading:t?r("bulk.delete_title"):r("bulk.complete_title"),content:n`<p>
          ${t?r("bulk.delete_confirm",{count:e.length}):r("bulk.complete_confirm",{count:e.length})}
        </p>`,actions:[{label:r("common.cancel"),value:"cancel"},{label:t?r("common.delete"):r("app.complete"),value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await Dt(this.hass,e);let t=new Set(e.map(i=>i.id));this.selectedIds=this.selectedIds.filter(i=>!t.has(i)),this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=k(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return this.showFilters?Ge.reduce((e,t)=>e+this.filters[t].length,0):0}filterGroup(e,t){let i=this.filters[t].length,s=this.openFilterGroups.includes(t);return n`
      <div class=${s?"filter-category open":"filter-category"}>
        <button
          class="filter-category-heading"
          type="button"
          aria-expanded=${s?"true":"false"}
          @click=${()=>{this.openFilterGroups=s?this.openFilterGroups.filter(o=>o!==t):[...this.openFilterGroups,t]}}
        >
          <span>${e}</span>
          ${i?n`<span class="filter-category-count">
                (${i})
              </span>`:c}
          <ha-icon
            class="filter-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="filter-category-content">
          <fieldset>
            ${this.filterOptions(t).map(o=>{let l=this.filters[t].includes(o.value);return n`
                <button
                  class=${l?"option-row active":"option-row"}
                  type="button"
                  aria-pressed=${l}
                  @click=${()=>this.toggleFilter(t,o.value,!l)}
                >
                  <span>${o.label}</span>
                  ${l?n`<ha-icon icon="mdi:check"></ha-icon>`:c}
                </button>
              `})}
          </fieldset>
        </div>
      </div>
    `}open(e){this.dispatchEvent(new CustomEvent("tasks-task-open",{bubbles:!0,composed:!0,detail:e}))}action(e,t){this.dispatchEvent(new CustomEvent("tasks-task-action",{bubbles:!0,composed:!0,detail:{action:t,task:e}}))}columnHeader(e){return n`
      <th class=${`${e}-column`}>${r(ge[e])}</th>
    `}columnCell(e,t){return n`
      <td class=${`${t}-column`}>
        ${this.columnValue(e,t)}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),i=this.visibleColumnKeys(),s=this.showBulkSelection?this.selectedTasks():[],o=new Set(this.showBulkSelection?this.selectedIds:[]),l=e.length>0&&e.every(d=>o.has(d.id)),u=e.some(d=>o.has(d.id)),h=this.showSearch||this.showAddTask||this.showFilters||this.showColumns||s.length>0,p=this.showAddTask&&!this.showSearch&&!this.showFilters&&!this.showColumns&&s.length===0;return g`
      ${h?n`
            <div class="toolbar">
              ${this.showSearch||this.showAddTask||s.length?n`
                    <div class="selection-toolbar">
                      ${this.showSearch?n`
                            <input
                              class="search"
                              type="search"
                              aria-label=${r("table.search")}
                              placeholder=${r("table.search")}
                              .value=${this.search}
                              @input=${d=>{this.search=d.currentTarget.value,this.retainVisibleSelection(),this.storeSessionView()}}
                            >
                          `:c}
                      ${this.showAddTask?n`
                            <button
                              class=${p?"toolbar-button full-width":"toolbar-button"}
                              type="button"
                              @click=${()=>this.dispatchEvent(new CustomEvent("tasks-task-add",{bubbles:!0,composed:!0}))}
                            >
                              ${r("card.add_task")}
                            </button>
                          `:c}
                      ${s.length?this.renderBulkMenu(s):c}
                    </div>
                  `:c}
              ${this.showFilters?n`
                    <div class="toolbar-popover">
                      <button
                        class=${this.openToolbarPanel==="filters"?"toolbar-button active":"toolbar-button"}
                        type="button"
                        aria-expanded=${this.openToolbarPanel==="filters"}
                        @click=${()=>{this.openToolbarPanel=this.openToolbarPanel==="filters"?"":"filters"}}
                      >
                        ${r("table.filters")}${t?` (${t})`:""}
                      </button>
                      ${this.openToolbarPanel==="filters"?n`
                            <div class="popover-panel filter-panel">
                              <div class="filter-grid">
                                ${Ge.map(d=>this.filterGroup(r(Si[d]),d))}
                              </div>
                              <div class="filter-footer">
                                ${this.registryError?n`<p class="registry-error">
                                      ${this.registryError}
                                    </p>`:c}
                                <ha-button
                                  appearance="plain"
                                  variant="neutral"
                                  @click=${()=>{this.filters=ve(),this.storeSessionView()}}
                                >
                                  ${r("table.reset_filters")}
                                </ha-button>
                              </div>
                            </div>
                          `:c}
                    </div>
                  `:c}
              ${this.showColumns?n`
                    <div class="toolbar-popover">
                      <button
                        class=${this.openToolbarPanel==="columns"?"toolbar-button active":"toolbar-button"}
                        type="button"
                        aria-expanded=${this.openToolbarPanel==="columns"}
                        @click=${()=>{this.openToolbarPanel=this.openToolbarPanel==="columns"?"":"columns"}}
                      >
                        ${r("table.columns")}
                      </button>
                      ${this.openToolbarPanel==="columns"?n`
                            <div class="popover-panel column-panel">
                              <div class="column-options">
                                ${Object.keys(ge).map(d=>n`
                                    <button
                                      class=${this.columns[d]?"option-row active":"option-row"}
                                      type="button"
                                      aria-pressed=${this.columns[d]}
                                      @click=${()=>this.toggleColumn(d,!this.columns[d])}
                                    >
                                      <span>${r(ge[d])}</span>
                                      ${this.columns[d]?n`<ha-icon
                                            icon="mdi:check"
                                          ></ha-icon>`:c}
                                    </button>
                                  `)}
                              </div>
                              <div class="filter-footer">
                                <ha-button
                                  appearance="plain"
                                  variant="neutral"
                                  @click=${this.resetColumns}
                                >
                                  ${r("table.reset_columns")}
                                </ha-button>
                              </div>
                            </div>
                          `:c}
                    </div>
                  `:c}
            </div>
          `:c}
      <div class="table-wrap">
        <table>
          ${this.showHeader?n`
                <thead>
                  <tr>
                    ${this.showBulkSelection?n`
                          <th class="selection">
                            <ha-checkbox
                              aria-label=${r("app.select_visible")}
                              .checked=${l}
                              .indeterminate=${u&&!l}
                              @change=${d=>this.toggleVisible(e,d.currentTarget.checked)}
                            ></ha-checkbox>
                          </th>
                        `:c}
                    ${this.showIcon?n`<th class="icon" aria-hidden="true"></th>`:c}
                    <th>${r("table.task")}</th>
                    ${i.map(d=>this.columnHeader(d))}
                    ${this.showActionMenu?n`<th
                          class="actions"
                          aria-label=${r("task.actions")}
                        ></th>`:c}
                  </tr>
                </thead>
              `:c}
          <tbody>
            ${e.length?e.map(d=>g`
                    <tr
                      class=${this.rowClass(d)}
                      aria-selected=${o.has(d.id)}
                      @click=${()=>this.open(d)}
                    >
                      ${this.showBulkSelection?n`
                            <td
                              class="selection"
                              @click=${m=>m.stopPropagation()}
                            >
                              <ha-checkbox
                                aria-label=${r("app.select_task",{name:d.name})}
                                .checked=${o.has(d.id)}
                                @change=${m=>this.toggleTask(d.id,m.currentTarget.checked)}
                              ></ha-checkbox>
                            </td>
                          `:c}
                      ${this.showIcon?n`
                            <td class="icon">
                              <ha-icon
                                .icon=${d.active===!1?"mdi:pause-circle-outline":d.icon||"mdi:clipboard-check-outline"}
                              ></ha-icon>
                            </td>
                          `:c}
                      <td class="task-name">
                        ${d.name}
                        ${this.problemSensorWarning(d)}
                        <span class="mobile-details">
                          ${this.mobileDetails(d)}
                        </span>
                      </td>
                      ${i.map(m=>this.columnCell(d,m))}
                      ${this.showActionMenu?g`
                            <td
                              class="actions"
                              @click=${m=>m.stopPropagation()}
                            >
                              <${Yt}
                                label=${r("app.actions_for",{name:d.name})}
                                .items=${Ii(d)}
                                @tasks-action=${m=>this.action(d,m.detail)}
                              ></${Yt}>
                            </td>
                          `:c}
                    </tr>
                  `):n`
                  <tr>
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.showSearch&&this.search?r("table.empty"):r("app.no_tasks")}
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `}},be=f("task-table");customElements.get(be)||customElements.define(be,Je);var Qe=class extends v{static properties={tone:{reflect:!0}};static styles=b`
    :host {
      display: inline-flex;
      margin: 0 var(--ha-space-2) var(--ha-space-2) 0;
    }

    span {
      display: inline-flex;
      min-height: 28px;
      box-sizing: border-box;
      align-items: center;
      padding: 3px 10px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: var(--ha-border-width-sm) solid var(--divider-color);
      border-radius: var(--ha-border-radius-pill);
      font-size: 13px;
      line-height: 20px;
    }

    ::slotted(ha-icon) {
      --mdc-icon-size: 16px;

      margin-right: 6px;
    }

    :host([tone="positive"]) span {
      color: var(--success-color);
      border-color: var(--success-color);
    }

    :host([tone="muted"]) span {
      color: var(--secondary-text-color);
    }
  `;constructor(){super(),this.tone="default"}render(){return n`<span><slot></slot></span>`}},fe=f("pill");customElements.get(fe)||customElements.define(fe,Qe);var L=$(I),S=$(fe),ei=$(q),Xe=class extends v{static properties={attachment:{attribute:!1},url:{}};static styles=b`
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

    iframe {
      height: 70dvh;
    }

    a {
      color: var(--primary-color);
    }
  `;render(){let e=this.attachment.content_type;return e.startsWith("image/")?n`<img src=${this.url} alt=${this.attachment.filename} />`:e.startsWith("video/")?n`<video src=${this.url} controls></video>`:e.startsWith("audio/")?n`<audio src=${this.url} controls></audio>`:e==="application/pdf"?n`<iframe
        src=${this.url}
        title=${this.attachment.filename}
      ></iframe>`:n`<a href=${this.url} target="_blank" rel="noopener">
      ${r("app.open_file",{name:this.attachment.filename})}
    </a>`}},Ye=f("attachment-preview");customElements.get(Ye)||customElements.define(Ye,Xe);var et=class extends v{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0},renderedDescription:{state:!0},templateError:{state:!0}};static styles=b`
    :host,
    .content,
    .records {
      display: grid;
      gap: var(--ha-space-3);
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ha-space-1);
    }

    .pills > * {
      margin: 0;
    }

    .pill-break {
      flex-basis: 100%;
      height: 0;
    }

    .description,
    .hint,
    .error {
      margin: 0;
    }

    .description {
      line-height: 1.45;
    }

    .description > :not(:last-child) {
      margin-bottom: var(--ha-space-2);
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
      grid-template-columns: 32px minmax(0, 1fr);
      align-items: center;
      gap: var(--ha-space-2);
      padding: var(--ha-space-2) 0;
      border-bottom: var(--ha-border-width-sm) solid var(--divider-color);
    }

    .record-icon {
      --mdc-icon-size: 22px;
      color: var(--secondary-text-color);
    }

    .record-content {
      display: grid;
      min-width: 0;
      gap: 2px;
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
      gap: var(--ha-space-2) var(--ha-space-3);
      margin: 0;
    }

    .planning-details dt {
      color: var(--primary-text-color);
    }

    .planning-details dd {
      min-width: 0;
      margin: 0;
    }

    @media (max-width: 520px) {
      .planning-details {
        grid-template-columns: 1fr;
        gap: 2px;
      }

      .planning-details dd + dt {
        margin-top: var(--ha-space-2);
      }
    }
  `;hass;unsubscribeTemplate;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1,this.renderedDescription="",this.templateError=""}connectedCallback(){super.connectedCallback(),this.subscribeDescriptionTemplate()}disconnectedCallback(){super.disconnectedCallback(),this.disconnectDescriptionTemplate()}configure(e,t,i=[]){this.hass=e,this.task=t,this.renderedDescription=t.description||"",this.attachments=[...t.attachments],this.history=ce(t.history||[]),this.isConnected&&this.subscribeDescriptionTemplate(),this.loadDetails()}async subscribeDescriptionTemplate(){if(this.unsubscribeTemplate||!this.hass||!this.task)return;let e=this.task.description||"";if(e.trim()){this.templateError="";try{this.unsubscribeTemplate=this.hass.connection.subscribeMessage(t=>{if("error"in t){this.templateError=t.error;return}this.templateError="",this.renderedDescription=t.result},{type:"render_template",template:e,variables:{config:{type:"markdown",content:e},user:this.hass?.user?.name||""},strict:!0,report_errors:!1}),await this.unsubscribeTemplate}catch{this.renderedDescription=e,this.unsubscribeTemplate=void 0}}}disconnectDescriptionTemplate(){this.unsubscribeTemplate?.then(e=>e()).catch(()=>{}),this.unsubscribeTemplate=void 0,this.templateError=""}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.attachmentError="";let[e,t]=await Promise.allSettled([V(this.hass),It(this.hass,this.task.id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError=r("app.assignment_load_error"),t.status==="fulfilled"?this.signedFiles=t.value.signed_files||{}:this.attachmentError=r("app.attachment_load_error"),this.loading=!1}formatDate(e){if(!e)return r("app.not_scheduled");let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}renderDescription(){return(this.task.description||"").trim()?n`
      ${this.templateError?n`<p class="error" role="alert">${this.templateError}</p>`:c}
      <ha-markdown
        cache
        breaks
        .content=${this.renderedDescription}
      ></ha-markdown>
    `:n`<p class="hint">${r("task.no_description")}.</p>`}async openAttachment(e){let t=this.signedFiles[e.id];if(!t)return;let i=document.createElement(Ye);i.attachment=e,i.url=t,await w({heading:e.filename,content:i,width:"large"})}async complete(){if(!this.hass||this.completing||await w({heading:r("task.complete_title"),content:n`<p>
        ${r("task.complete_confirm",{name:this.task.name})}
      </p>`,actions:[{label:r("common.cancel"),value:"cancel"},{label:r("app.complete"),value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await Lt(this.hass,this.task.id,this.completionNotes),!0}catch(t){return this.completionError=k(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(s=>s.id===this.task.assignee_id)?.name,t=this.tags.find(s=>s.id===this.task.nfc_tag_id),i=(this.task.label_ids||[]).map(s=>this.labels.find(o=>o.label_id===s)).filter(s=>!!s);return g`
      <div class="pills">
        ${this.task.due?g`<${S}>
              <ha-icon icon="mdi:calendar"></ha-icon>
              ${this.formatDate(this.task.due)}
            </${S}>`:c}
        ${e?g`<${S}>
              <ha-icon icon="mdi:account-outline"></ha-icon>
              ${e}
            </${S}>`:c}
        ${this.attachments.length?g`<${S}
              title=${r(this.attachments.length===1?"app.file_count_one":"app.file_count_many",{count:this.attachments.length})}
            >
              <ha-icon icon="mdi:paperclip"></ha-icon>
              ${this.attachments.length}
            </${S}>`:c}
        ${t?g`<${S}>
              <ha-icon icon="mdi:nfc"></ha-icon>
              ${t.name||t.id}
            </${S}>`:c}
        ${i.length?n`<span class="pill-break"></span>`:c}
        ${i.map(s=>g`<${S}>
              <ha-icon icon="mdi:tag-outline"></ha-icon>
              ${s.name}
            </${S}>`)}
      </div>
    `}scheduleText(){return he(this.task.schedule,this.hass?.locale?.language)}renderPlanning(){let e=this.task.schedule;if(e.type==="sensor"){let t=this.history.find(o=>o.type==="problem"),i=t&&t.occurred_at===this.task.due?t.message:"",s=this.task.due?R(!0):this.task.problem_warning?O():R(!1);return n`
        <dl class="planning-details">
          <dt>${r("task.recurrence_calculation")}</dt>
          <dd>${r("task.problem_sensor")}</dd>
          <dt>${r("app.status")}</dt>
          <dd class=${this.task.problem_warning&&!this.task.due?"error":""}>
            ${s}
          </dd>
          <dt>${r("task.problem_message")}</dt>
          <dd class=${i?"error":""}>${i||"\u2014"}</dd>
        </dl>
      `}return n`
      <dl class="planning-details">
        <dt>${r("task.recurrence_calculation")}</dt>
        <dd>${e.type==="fixed"?r("task.fixed"):r("task.sliding")}</dd>
        <dt>${r("task.planning")}</dt>
        <dd>${this.scheduleText()}</dd>
      </dl>
    `}renderAttachments(){return this.attachmentError?n`<p class="error" role="alert">${this.attachmentError}</p>`:this.attachments.length?n`
      <ul class="records">
        ${this.attachments.map(e=>{let t=!!this.signedFiles[e.id];return n`
            <li>
              <button
                class="record"
                type="button"
                ?disabled=${!t}
                @click=${()=>{this.openAttachment(e)}}
              >
                <ha-icon
                  class="record-icon"
                  .icon=${ee(e.filename,e.content_type)}
                ></ha-icon>
                <span class="record-content">
                  <span>${e.filename}</span>
                  <span class="secondary">
                    ${te(e.size)}
                  </span>
                </span>
              </button>
            </li>
          `})}
      </ul>
    `:n`<p class="hint">${r("task.no_files")}.</p>`}renderHistory(){return this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>n`
          <li class="record">
            <ha-icon
              class="record-icon"
              .icon=${de(e)}
            ></ha-icon>
            <span class="record-content">
              <span>
                ${this.formatDate(e.occurred_at)} ·
                ${e.type==="completed"?e.user_name||r("common.system"):r("history.problem")}
              </span>
              <span class="secondary">
                ${e.type==="problem"?e.message:e.notes==="tasks.history.completed_via_nfc"?r("history.completed_via_nfc"):e.notes||r("app.no_notes")}
              </span>
            </span>
          </li>
        `)}
      </ul>
    `:n`<p class="hint">${r("task.no_history")}.</p>`}render(){return g`
      <div class="content">
        ${this.renderMetadata()}
        <${L}
          heading=${r("task.optional_description")}
          .open=${!0}
        >
          <div class="description">${this.renderDescription()}</div>
        </${L}>
        ${this.loading?n`<p class="hint" aria-live="polite">
              ${r("app.loading_details")}
            </p>`:c}
        ${this.assignmentError?n`<p class="error" role="alert">${this.assignmentError}</p>`:c}
        <${L}
          heading=${r("task.planning")}
          .warning=${!!(this.task.problem_warning||this.task.schedule.type==="sensor"&&this.task.due)}
        >
          ${this.renderPlanning()}
        </${L}>
        <${L} heading=${r("task.files")}>
          ${this.renderAttachments()}
        </${L}>
        <${L} heading=${r("task.history")}>
          ${this.renderHistory()}
        </${L}>
        <${ei}
          label=${r("task.completion_notes")}
          .placeholder=${r("task.completion_notes")}
          .hideLabel=${!0}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${ei}>
        ${this.completionError?n`<p class="error" role="alert">${this.completionError}</p>`:c}
      </div>
    `}},tt=f("task-viewer");customElements.get(tt)||customElements.define(tt,et);var ti=async(a,e,t=[])=>{let i=document.createElement(tt);return i.configure(a,e,t),await w({heading:e.name,content:i,actions:[{label:r("app.complete"),value:"complete",run:()=>i.complete()}]})==="complete"};var ii=$(be),it=class extends v{static properties={hass:{attribute:!1},narrow:{type:Boolean},snapshot:{state:!0},error:{state:!0}};static styles=b`
    :host {
      display: block;
      height: 100dvh;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .page {
      height: 100%;
      overflow: auto;
    }

    main {
      padding: 0 var(--ha-space-6);
      padding-bottom: calc(var(--ha-space-12) + var(--ha-space-12));
    }

    header {
      position: sticky;
      z-index: 4;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ha-space-4);
      min-height: var(--header-height);
      box-sizing: border-box;
      padding: var(--safe-area-inset-top, 0) var(--ha-space-4) 0;
      color: var(--app-header-text-color, var(--primary-text-color));
      background: var(--app-header-background-color, var(--card-background-color));
      border-bottom: var(
        --app-header-border-bottom,
        var(--ha-border-width-s) solid var(--divider-color)
      );
    }

    .header-title {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: var(--ha-space-3);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--ha-space-4);
    }

    .fab {
      position: fixed;
      z-index: 3;
      right: calc(var(--ha-space-6) + var(--safe-area-inset-right, 0px));
      bottom: calc(var(--ha-space-6) + var(--safe-area-inset-bottom, 0px));
      display: inline-flex;
      width: auto;
      --ha-button-box-shadow: var(--ha-box-shadow-l);
    }

    .backup {
      color: var(--app-header-text-color);
    }

    h1 {
      margin: 0;
      font-size: var(--ha-font-size-xl);
      font-weight: var(--ha-font-weight-normal, 400);
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 520px) {
      .header-actions {
        gap: var(--ha-space-2);
      }

      header {
        padding-right: var(--ha-space-2);
        padding-left: var(--ha-space-1);
      }

      main {
        padding: 0 var(--ha-space-2) var(--ha-space-6);
        padding-bottom: calc(var(--ha-space-12) + var(--ha-space-12));
      }

      .fab {
        right: calc(var(--ha-space-4) + var(--safe-area-inset-right, 0px));
        bottom: calc(var(--ha-space-4) + var(--safe-area-inset-bottom, 0px));
      }
    }
  `;unsubscribe;connection;language;updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,He(this.language))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await Tt(this.hass,i=>{this.snapshot=i});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=k(t))}}openTask(e){this.hass&&ti(this.hass,e)}async confirmDelete(e){this.hass&&await w({heading:r("task.delete_title"),content:n`<p>
        ${r("task.delete_confirm",{name:e.name})}
      </p>`,actions:[{label:r("common.cancel"),value:"cancel"},{label:r("common.delete"),value:"delete",destructive:!0,run:()=>Ft(this.hass,e.id)}]})}handleTaskAction(e,t){this.hass&&(e==="edit"?ue(this.hass,t):e==="copy"?Gt(this.hass,t):e==="active"?Ht(this.hass,t.id,t.active===!1):e==="delete"&&this.confirmDelete(t))}render(){let e=this.snapshot;return n`
      <div class="page">
        <header>
          <div class="header-title">
            <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}>
            </ha-menu-button>
            <h1>${r("app.title")}</h1>
          </div>
          <div class="header-actions">
            <ha-icon-button
              class="backup"
              label=${r("settings.import_export")}
              title=${r("settings.import_export")}
              @click=${()=>this.hass&&void jt(this.hass)}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </header>
        <main>
          ${this.error?n`<p class="error">${r("app.load_error",{message:this.error})}</p>`:e?g`
                  <${ii}
                    .hass=${this.hass}
                    .tasks=${e.tasks}
                    .now=${e.now}
                    @tasks-task-open=${t=>this.openTask(t.detail)}
                    @tasks-task-action=${t=>this.handleTaskAction(t.detail.action,t.detail.task)}
                  ></${ii}>
                `:n`<p>${r("common.loading")}</p>`}
        </main>
        <ha-button
          class="fab"
          appearance="accent"
          variant="brand"
          size="l"
          @click=${()=>this.hass&&void ue(this.hass)}
        >
          <ha-icon slot="start" icon="mdi:plus"></ha-icon>
          ${r("common.add_task")}
        </ha-button>
      </div>
    `}},si="tasks-panel";customElements.get(si)||customElements.define(si,it);
