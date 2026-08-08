var te=globalThis,ie=te.ShadowRoot&&(te.ShadyCSS===void 0||te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),at=new WeakMap,K=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ie&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=at.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&at.set(t,e))}return e}toString(){return this.cssText}},ot=r=>new K(typeof r=="string"?r:r+"",void 0,_e),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,o)=>i+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new K(t,r,_e)},nt=(r,e)=>{if(ie)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=te.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},we=ie?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return ot(t)})(r):r;var{is:si,defineProperty:ri,getOwnPropertyDescriptor:ai,getOwnPropertyNames:oi,getOwnPropertySymbols:ni,getPrototypeOf:li}=Object,se=globalThis,lt=se.trustedTypes,ci=lt?lt.emptyScript:"",di=se.reactiveElementPolyfillSupport,q=(r,e)=>r,xe={toAttribute(r,e){switch(e){case Boolean:r=r?ci:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},dt=(r,e)=>!si(r,e),ct={attribute:!0,type:String,converter:xe,reflect:!1,useDefault:!1,hasChanged:dt};Symbol.metadata??=Symbol("metadata"),se.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ct){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&ri(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:o}=ai(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:s,set(l){let p=s?.call(this);o?.call(this,l),this.requestUpdate(e,p,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ct}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=li(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,i=[...oi(t),...ni(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(we(s))}else e!==void 0&&t.push(we(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let o=(i.converter?.toAttribute!==void 0?i.converter:xe).toAttribute(t,i.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=i.getPropertyOptions(s),l=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:xe;this._$Em=s;let p=l.fromAttribute(t,o.type);this[s]=p??this._$Ej?.get(s)??p,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(e!==void 0){let l=this.constructor;if(s===!1&&(o=this[e]),i??=l.getPropertyOptions(e),!((i.hasChanged??dt)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(l._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},l){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),o!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,o]of i){let{wrapped:l}=o,p=this[s];l!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,o,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[q("elementProperties")]=new Map,S[q("finalized")]=new Map,di?.({ReactiveElement:S}),(se.reactiveElementVersions??=[]).push("2.1.2");var De=globalThis,ht=r=>r,re=De.trustedTypes,ut=re?re.createPolicy("lit-html",{createHTML:r=>r}):void 0,vt="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+P,hi=`<${yt}>`,M=document,G=()=>M.createComment(""),Z=r=>r===null||typeof r!="object"&&typeof r!="function",Ie=Array.isArray,ui=r=>Ie(r)||typeof r?.[Symbol.iterator]=="function",Te=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pt=/-->/g,mt=/>/g,L=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,ft=/"/g,$t=/^(?:script|style|textarea|title)$/i,Le=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),n=Le(1),kt=Le(2),_t=Le(3),H=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),bt=new WeakMap,F=M.createTreeWalker(M,129);function wt(r,e){if(!Ie(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(e):e}var pi=(r,e)=>{let t=r.length-1,i=[],s,o=e===2?"<svg>":e===3?"<math>":"",l=W;for(let p=0;p<t;p++){let h=r[p],u,d,m=-1,w=0;for(;w<h.length&&(l.lastIndex=w,d=l.exec(h),d!==null);)w=l.lastIndex,l===W?d[1]==="!--"?l=pt:d[1]!==void 0?l=mt:d[2]!==void 0?($t.test(d[2])&&(s=RegExp("</"+d[2],"g")),l=L):d[3]!==void 0&&(l=L):l===L?d[0]===">"?(l=s??W,m=-1):d[1]===void 0?m=-2:(m=l.lastIndex-d[2].length,u=d[1],l=d[3]===void 0?L:d[3]==='"'?ft:gt):l===ft||l===gt?l=L:l===pt||l===mt?l=W:(l=L,s=void 0);let x=l===L&&r[p+1].startsWith("/>")?" ":"";o+=l===W?h+hi:m>=0?(i.push(u),h.slice(0,m)+vt+h.slice(m)+P+x):h+P+(m===-2?p:x)}return[wt(r,o+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},J=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,l=0,p=e.length-1,h=this.parts,[u,d]=pi(e,t);if(this.el=r.createElement(u,i),F.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=F.nextNode())!==null&&h.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(vt)){let w=d[l++],x=s.getAttribute(m).split(P),O=/([.?@])?(.*)/.exec(w);h.push({type:1,index:o,name:O[2],strings:x,ctor:O[1]==="."?Ae:O[1]==="?"?Ce:O[1]==="@"?Se:R}),s.removeAttribute(m)}else m.startsWith(P)&&(h.push({type:6,index:o}),s.removeAttribute(m));if($t.test(s.tagName)){let m=s.textContent.split(P),w=m.length-1;if(w>0){s.textContent=re?re.emptyScript:"";for(let x=0;x<w;x++)s.append(m[x],G()),F.nextNode(),h.push({type:2,index:++o});s.append(m[w],G())}}}else if(s.nodeType===8)if(s.data===yt)h.push({type:2,index:o});else{let m=-1;for(;(m=s.data.indexOf(P,m+1))!==-1;)h.push({type:7,index:o}),m+=P.length-1}o++}}static createElement(e,t){let i=M.createElement("template");return i.innerHTML=e,i}};function N(r,e,t=r,i){if(e===H)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,o=Z(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=N(r,s._$AS(r,e.values),s,i)),e}var Ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);F.currentNode=s;let o=F.nextNode(),l=0,p=0,h=i[0];for(;h!==void 0;){if(l===h.index){let u;h.type===2?u=new Q(o,o.nextSibling,this,e):h.type===1?u=new h.ctor(o,h.name,h.strings,this,e):h.type===6&&(u=new Pe(o,this,e)),this._$AV.push(u),h=i[++p]}l!==h?.index&&(o=F.nextNode(),l++)}return F.currentNode=M,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},Q=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),Z(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==H&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ui(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&Z(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=J.createElement(wt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new Ee(s,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=bt.get(e.strings);return t===void 0&&bt.set(e.strings,t=new J(e)),t}k(e){Ie(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let o of e)s===t.length?t.push(i=new r(this.O(G()),this.O(G()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ht(e).nextSibling;ht(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(e,t=this,i,s){let o=this.strings,l=!1;if(o===void 0)e=N(this,e,t,0),l=!Z(e)||e!==this._$AH&&e!==H,l&&(this._$AH=e);else{let p=e,h,u;for(e=o[0],h=0;h<o.length-1;h++)u=N(this,p[i+h],t,h),u===H&&(u=this._$AH[h]),l||=!Z(u)||u!==this._$AH[h],u===c?e=c:e!==c&&(e+=(u??"")+o[h+1]),this._$AH[h]=u}l&&!s&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ae=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},Ce=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},Se=class extends R{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??c)===H)return;let i=this._$AH,s=e===c&&i!==c||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Pe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}};var mi=De.litHtmlPolyfillSupport;mi?.(J,Q),(De.litHtmlVersions??=[]).push("3.3.3");var xt=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let o=t?.renderBefore??null;i._$litPart$=s=new Q(e.insertBefore(G(),o),o,void 0,t??{})}return s._$AI(r),s};var Fe=globalThis,D=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=xt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};D._$litElement$=!0,D.finalized=!0,Fe.litElementHydrateSupport?.({LitElement:D});var gi=Fe.litElementPolyfillSupport;gi?.({LitElement:D});(Fe.litElementVersions??=[]).push("4.2.2");var Et=Symbol.for(""),fi=r=>{if(r?.r===Et)return r?._$litStatic$},k=r=>({_$litStatic$:r,r:Et});var Tt=new Map,Me=r=>(e,...t)=>{let i=t.length,s,o,l=[],p=[],h,u=0,d=!1;for(;u<i;){for(h=e[u];u<i&&(o=t[u],(s=fi(o))!==void 0);)h+=s+e[++u],d=!0;u!==i&&p.push(o),l.push(h),u++}if(u===i&&l.push(e[i]),d){let m=l.join("$$lit$$");(e=Tt.get(m))===void 0&&(l.raw=l,Tt.set(m,e=l)),t=p}return r(e,...t)},g=Me(n),Wi=Me(kt),Gi=Me(_t);var At=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),Ct=r=>{if(r.type==="sensor")return{type:r.type,condition_template:r.conditionTemplate.trim(),message_template:r.messageTemplate.trim()||null};let e={type:r.type,unit:r.unit,interval:r.interval};return r.type==="fixed"&&(e.time=r.time,r.unit==="weekly"?e.weekdays=r.weekdays:r.unit==="monthly"?e.day=r.day:r.unit==="yearly"&&(e.day=r.day,e.month=r.month)),e},bi=async(r,e)=>{let t=new FormData;t.append("file",e);let i=await r.fetchWithAuth("/api/tasks/upload",{method:"POST",body:t});if(!i.ok)throw new Error(`File upload failed (${i.status})`);return(await i.json()).file_id};var St=async(r,e,t)=>{let i=await Promise.all((t.files?.staged||[]).map(s=>bi(r,s)));return r.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.id}:{},name:t.name.trim(),description:t.description.trim()||null,icon:t.icon.trim()||null,active:t.active,...t.schedule?{schedule:Ct(t.schedule)}:e?{schedule:e.schedule}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification:{device_ids:t.notification.deviceIds,persistent:t.notification.persistent,critical:t.notification.critical,route:t.notification.route.trim()||null}}:{},file_ids:i,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},U=async r=>{let[e,t,i]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(i)?i:[]}},ae=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(i=>i?.[0]==="mobile_app"))},Pt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),Dt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),It=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),Lt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),Ft=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),Mt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",schedule:Ct(e),...t?{due:t}:{}});var Ht=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1],vi=Ht?`?v=${encodeURIComponent(decodeURIComponent(Ht))}`:"",Ut={},Ot="",Nt="",He=new Map,Oe=new Set,yi=r=>{let e=String(r||"en").toLowerCase().split(/[-_]/)[0];return/^[a-z]{2,3}$/.test(e)?e:"en"},$i=r=>Object.fromEntries(Object.entries(r.common||{}).filter(([e])=>e.startsWith("ui_")).map(([e,t])=>{let i=e.indexOf("_",3);return[`${e.slice(3,i)}.${e.slice(i+1)}`,t]})),Rt=r=>{if(!He.has(r)){let e=r==="en"?"/tasks_strings.json":`/tasks_translations/${r}.json`;He.set(r,fetch(`${e}${vi}`).then(async t=>t.ok?t.json():{}).then($i).catch(()=>({})))}return He.get(r)},a=(r,e={})=>String(Ut[r]??r).replace(/\{(\w+)\}/g,(t,i)=>String(e[i]??`{${i}}`)),X=(r,e)=>a("schedule.with_time",{description:r,time:a("app.at_time",{time:e})}),oe=r=>{if(typeof r!="string"||!r)return;let e=`error.${r}`,t=a(e);return t===e?void 0:t},T=r=>{if(r&&typeof r=="object"){let e=r,t=oe(e.code);if(t)return t;let i=oe(e.message);if(i)return i;if(typeof e.message=="string"&&e.message)return e.message}return r instanceof Error?oe(r.message)||r.message:typeof r=="string"&&r?oe(r)||r:a("error.unknown")};async function Ne(r){let e=yi(r);Nt=e;let t=await Rt("en"),i=e==="en"?t:await Rt(e);if(Nt===e&&Ot!==e){Ot=e,Ut={...t,...i};for(let s of Oe)s()}}var zt=r=>(Oe.add(r),()=>Oe.delete(r)),Bt=Ne(globalThis.navigator?.language);var f=class extends D{unsubscribeLanguage;connectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=zt(()=>this.requestUpdate()),super.connectedCallback()}disconnectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=void 0,super.disconnectedCallback()}};var Y=(r,e)=>{let t=e.toLowerCase(),i=r.split(".").pop()?.toLowerCase();return t.startsWith("image/")?"mdi:file-image-outline":t==="application/pdf"||i==="pdf"?"mdi:file-pdf-box":t.startsWith("text/")||["txt","md","log"].includes(i||"")?"mdi:file-document-outline":t.startsWith("audio/")?"mdi:file-music-outline":t.startsWith("video/")?"mdi:file-video-outline":t.includes("zip")||t.includes("compressed")||["zip","rar","7z","gz"].includes(i||"")?"mdi:folder-zip-outline":t.includes("spreadsheet")||t.includes("excel")||["csv","xls","xlsx","ods"].includes(i||"")?"mdi:file-table-outline":t.includes("word")||["doc","docx","odt","rtf"].includes(i||"")?"mdi:file-word-outline":"mdi:file-outline"},ee=r=>r<1024?`${r} B`:r<1048576?`${Math.round(r/1024)} KB`:`${(r/1048576).toFixed(1)} MB`;var ne=r=>[...r].sort((e,t)=>Date.parse(t.occurred_at)-Date.parse(e.occurred_at)),le=r=>r.type==="problem"?"mdi:alert-circle-outline":r.notes==="tasks.history.completed_via_nfc"?"mdi:nfc":r.user_id?"mdi:account-outline":"mdi:note-text-outline";var Vt={daily:"day",weekly:"week",monthly:"month",yearly:"year"},ce=(r,e)=>{if(r.type==="sensor")return a("schedule.problem_sensor_description");let t=r.unit||"daily",i=Math.max(1,Number(r.interval)||1),s=a(`schedule.period_${Vt[t]}`),o=a(`schedule.period_${Vt[t]}s`);if(r.type==="sliding")return a(i===1?"schedule.after_completion_one":"schedule.after_completion_many",{schedule_interval:i,period:i===1?s:o});let l=r.time||"09:00";if(t==="weekly"){let p=Array.from({length:7},(d,m)=>new Intl.DateTimeFormat(e,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,m+1)))),h=(r.weekdays||[]).map(d=>p[d]).filter(Boolean),u=h.length>1?`${h.slice(0,-1).join(", ")} ${a("schedule.and")} ${h.at(-1)}`:h[0]||"";return X(a(i===1?"schedule.weekly_one":"schedule.weekly_many",{schedule_interval:i,days:u?` ${a("schedule.on_days",{days:u})}`:""}),l)}if(t==="monthly"){let p=r.day==="last"?a("schedule.on_last_day"):a("schedule.on_day_number",{day:Number(r.day||1)});return X(a(i===1?"schedule.monthly_one":"schedule.monthly_many",{schedule_interval:i,day:p}),l)}if(t==="yearly"){let p=new Intl.DateTimeFormat(e,{month:"long"}).format(new Date(2024,(r.month||1)-1,1)),h=r.day==="last"?a("schedule.on_last_day_of_month",{month:p}):a("schedule.on_day_of_month",{day:Number(r.day||1),month:p});return X(a(i===1?"schedule.yearly_one":"schedule.yearly_many",{schedule_interval:i,day:h}),l)}return X(a(i===1?"schedule.fixed_one":"schedule.fixed_many",{schedule_interval:i,period:i===1?s:o}),l)};var v=r=>`ha-tasks-${r}`,ns=decodeURIComponent(new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1]||"");var Re=class extends f{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},width:{},open:{type:Boolean}};running=!1;closeValue="";constructor(){super(),this.heading="",this.content=n``,this.actions=[],this.width="medium",this.open=!1}close(e=""){this.closeValue=e,this.open=!1}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){let e=this.actions.at(-1),t=this.actions.slice(0,-1);return n`
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
    `}},Ue=v("dialog");customElements.get(Ue)||customElements.define(Ue,Re);var E=({heading:r,content:e,actions:t=[],width:i="medium"})=>{let s=document.createElement(Ue);return s.heading=r,s.content=e,s.actions=t,s.width=i,(document.querySelector("home-assistant")?.shadowRoot||document.body).append(s),s.open=!0,new Promise(l=>{s.addEventListener("tasks-dialog-closed",p=>{s.remove(),l(p.detail)},{once:!0})})};var ze=class extends f{static properties={heading:{},warning:{type:Boolean},open:{type:Boolean}};static styles=b`
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
                  aria-label=${a("app.section_needs_attention")}
                  title=${a("app.section_needs_attention")}
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
    `}},z=v("expandable");customElements.get(z)||customElements.define(z,ze);var ki=b`
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

`,B=class extends f{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=ki;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?n`<span class="error" role="alert">${this.error}</span>`:null}},Be=class extends B{static properties={...B.properties,placeholder:{},hideLabel:{attribute:"hide-label",type:Boolean},multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.placeholder="",this.hideLabel=!1,this.multiline=!1,this.inputType="text",this.min=void 0}render(){return n`
      <label>
        <span class=${this.hideLabel?"visually-hidden":""}>
          ${this.label}
        </span>
        ${this.multiline?n`
              <textarea
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
        ${this.errorMessage()}
      </label>
    `}},Ve=class extends B{static properties={...B.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return n`
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
    `}},V=v("text-field"),de=v("select-field");customElements.get(V)||customElements.define(V,Be);customElements.get(de)||customElements.define(de,Ve);var _=k(V),y=k(de),A=k(z),$=k("ha-form"),jt=()=>[{label:a("task.sliding"),value:"sliding"},{label:a("task.fixed"),value:"fixed"},{label:a("task.problem_sensor"),value:"sensor"}],_i=()=>[{label:a("task.binary_sensor"),value:"binary_sensor"},{label:a("task.template"),value:"template"}],Kt=r=>r.match(/^\s*{{\s*is_state\(['"](binary_sensor\.[^'"]+)['"],\s*['"]on['"]\)\s*}}\s*$/)?.[1]||"",wi=()=>[{label:a("task.daily"),value:"daily"},{label:a("task.weekly"),value:"weekly"},{label:a("task.monthly"),value:"monthly"},{label:a("task.yearly"),value:"yearly"}],qt=()=>[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:a("task.last_day"),value:"last"}],xi=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(i=>i.type!=="literal").map(i=>[i.type,i.value]))},je=class extends f{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},conditionTemplate:{state:!0},messageTemplate:{state:!0},problemType:{state:!0},problemSensor:{state:!0},conditionPreview:{state:!0},messagePreview:{state:!0},conditionTemplateError:{state:!0},messageTemplateError:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0},fileDropActive:{state:!0}};static styles=b`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;templateValidationRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.conditionTemplate="",this.messageTemplate="",this.problemType="binary_sensor",this.problemSensor="",this.conditionPreview="",this.messagePreview="",this.conditionTemplateError="",this.messageTemplateError="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1,this.fileDropActive=!1}configure(e,t,i=[]){let s=xi(e,t.due),o=Number(s.year),l=Number(s.month),p=Number(s.day),h=(new Date(Date.UTC(o,l-1,p)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.name,this.description=t.description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification.device_ids||[]).filter(d=>typeof d=="string"))],this.notificationPersistent=!!t.notification.persistent,this.notificationCritical=!!t.notification.critical,this.notificationRoute=t.notification.route||"",this.attachments=[...t.attachments],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=ne(t.history||[]),this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule.type,t.schedule.type==="sensor"?(this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[h],this.scheduleDay=p,this.scheduleMonth=l,this.scheduleTime=`${s.hour||"09"}:${s.minute||"00"}`,this.conditionTemplate=t.schedule.condition_template,this.messageTemplate=t.schedule.message_template||"",this.problemSensor=Kt(this.conditionTemplate),this.problemType=this.problemSensor?"binary_sensor":"template"):(this.scheduleUnit=t.schedule.unit,this.scheduleInterval=t.schedule.interval,this.scheduleWeekdays=t.schedule.type==="fixed"&&t.schedule.weekdays?.length?[...t.schedule.weekdays]:[h],this.scheduleDay=t.schedule.type==="fixed"&&t.schedule.day?t.schedule.day:p,this.scheduleMonth=t.schedule.type==="fixed"&&t.schedule.month?t.schedule.month:l,this.scheduleTime=t.schedule.type==="fixed"&&t.schedule.time||`${s.hour||"09"}:${s.minute||"00"}`,this.conditionTemplate="",this.messageTemplate="",this.problemType="binary_sensor",this.problemSensor="");let u=!t.id;this.scheduleDirty=u,this.assignmentDirty=u,this.notificationDirty=u,this.loadAssignments(),this.loadNotifications(),this.updateComplete.then(()=>this.loadPreview()),this.validateProblemTemplates()}conditionValue(){return this.problemType==="binary_sensor"?this.problemSensor.trim()?`{{ is_state('${this.problemSensor.trim()}', 'on') }}`:"":this.conditionTemplate.trim()}renderTemplateOnce(e){if(!this.hass||!e)return Promise.resolve("");let t;return new Promise((i,s)=>{t=this.hass.connection.subscribeMessage(o=>{if(t?.then(l=>l()),o.error){s(o.error);return}i(o.result??"")},{type:"render_template",template:e,strict:!0,report_errors:!0}),t.catch(s)})}async validateProblemTemplates(){if(this.scheduleType!=="sensor")return!0;let e=++this.templateValidationRequest;this.conditionPreview="",this.messagePreview="",this.conditionTemplateError="",this.messageTemplateError="";let[t,i]=await Promise.allSettled([this.renderTemplateOnce(this.conditionValue()),this.messageTemplate.trim()?this.renderTemplateOnce(this.messageTemplate.trim()):Promise.resolve("")]);if(e!==this.templateValidationRequest)return!1;this.conditionPreview=t.status==="fulfilled"?String(t.value):"",this.messagePreview=i.status==="fulfilled"?String(i.value):"";let s=Kt(this.conditionValue()),o=s?this.hass?.states?.[s]:void 0,l=s?o?o.state==="unknown"||o.state==="unavailable"?o.state:void 0:"missing":void 0;return this.conditionTemplateError=t.status==="rejected"?T(t.reason):l?a(`problem.sensor_${l}`,{entity_id:s}):typeof t.value!="boolean"?a("problem.condition_boolean_required"):"",this.messageTemplateError=i.status==="rejected"?T(i.reason):"",!this.conditionTemplateError&&!this.messageTemplateError}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await U(e);this.users=[...t.users].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((i,s)=>(i.name||i.id).localeCompare(s.name||s.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(i=>i.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(i=>this.labels.some(s=>s.label_id===i)),this.nfcTagId=this.tags.some(i=>i.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError=a("app.assignment_load_error")}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await ae(e)).sort((t,i)=>this.deviceName(t).localeCompare(this.deviceName(i),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(i=>i.id===t))}catch{this.notificationError=a("app.notification_load_error")}finally{this.notificationLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let i=this.conditionValue();return i||(t=a("app.problem_condition_required")),e&&(this.scheduleError=t),t?void 0:{type:"sensor",conditionTemplate:i,messageTemplate:this.messageTemplate}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t=a("app.interval_min"):this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t=a("app.select_valid_time"):this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t=a("error.select_at_least_one_weekday")),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,i=this.scheduleDetails(!1),s=++this.previewRequest;if(!e||!t||!i||i.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let o=await Mt(e,i,this.scheduleDirty?void 0:t.due||void 0);s===this.previewRequest&&(this.preview=o.dues)}catch{s===this.previewRequest&&(this.preview=[],this.previewError=a("app.preview_load_error"))}finally{s===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}scheduleText(){return ce({type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:this.scheduleWeekdays,day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime},this.hass?.locale?.language)}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),i=this.notificationRoute.trim();e||(this.nameError=a("app.name_required")),i&&(!i.startsWith("/")||i.startsWith("//"))&&(this.notificationRouteError=a("app.route_invalid"));let s=await this.validateProblemTemplates();if(!e||!t||this.notificationRouteError||!s||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await St(this.hass,this.task.id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:i}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(o){return this.saveError=T(o),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return c;let e=c;return this.scheduleUnit==="weekly"?e=n`
        <p class="selector-label">${a("task.schedule_weekdays")}</p>
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
          label=${a("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${qt()}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${y}>
      `:this.scheduleUnit==="yearly"&&(e=g`
        <div class="row">
          <${y}
            label=${a("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${qt()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${y}>
          <${y}
            label=${a("task.month")}
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${y}>
        </div>
      `),g`
      <${_}
        label=${a("task.time")}
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${_}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return c;if(this.previewLoading&&!this.preview.length)return n`<p class="hint" aria-live="polite">
        ${a("app.loading_preview")}
      </p>`;if(this.previewError)return n`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return n`
        <p class="selector-label">${a("task.first_due")}</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return n`
      <p class="selector-label">${a("task.preview_task_dues")}</p>
      <ol class="preview">
        ${e.map(t=>n`<li>${this.formatDue(t)}</li>`)}
      </ol>
      ${this.preview.length>4?n`
            <button
              class="link"
              type="button"
              @click=${()=>{this.previewExpanded=!this.previewExpanded}}
            >
              ${this.previewExpanded?a("app.show_less"):a("app.show_all")}
            </button>
          `:c}
    `}renderPlanning(){return this.scheduleType==="sensor"?g`
        <div class="planning">
          <${y}
            label=${a("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${jt()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${y}>
          <${y}
            label=${a("task.problem_sensor")}
            .value=${this.problemType}
            .options=${_i()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemType=e.detail,this.validateProblemTemplates()})}
          ></${y}>
          ${this.problemType==="binary_sensor"?g`<${$}
                .hass=${this.hass}
                .data=${{problemSensor:this.problemSensor}}
                .schema=${[{name:"problemSensor",selector:{entity:{filter:{domain:"binary_sensor"}}}}]}
                .computeLabel=${()=>""}
                .disabled=${this.saving}
                @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail.value.problemSensor||"",this.validateProblemTemplates()})}
              ></${$}>`:g`<${_}
                label=${a("task.problem_condition")}
                .placeholder=${a("schedule.problem_sensor_description")}
                required
                multiline
                .value=${this.conditionTemplate}
                ?disabled=${this.saving}
                @value-changed=${e=>this.scheduleChanged(()=>{this.conditionTemplate=e.detail,this.conditionPreview="",this.conditionTemplateError=""})}
                @focusout=${()=>{this.validateProblemTemplates()}}
              ></${_}>`}
          ${this.conditionTemplateError?n`<p class="error" role="alert">${this.conditionTemplateError}</p>`:this.problemType==="template"&&this.conditionPreview?n`<p class="hint">${a("problem.condition_preview",{result:this.conditionPreview})}</p>`:c}
          <${_}
            label=${a("task.problem_message")}
            .placeholder=${a("schedule.problem_message_description")}
            multiline
            .value=${this.messageTemplate}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.messageTemplate=e.detail,this.messagePreview="",this.messageTemplateError=""})}
            @focusout=${()=>{this.validateProblemTemplates()}}
          ></${_}>
          ${this.messageTemplateError?n`<p class="error" role="alert">${this.messageTemplateError}</p>`:this.messagePreview?n`<p class="hint">${a("problem.message_preview",{result:this.messagePreview})}</p>`:c}
          ${this.scheduleError?n`<p class="error" role="alert">${this.scheduleError}</p>`:c}
        </div>
      `:g`
      <div class="planning">
        <${y}
          label=${a("task.recurrence_calculation")}
          .value=${this.scheduleType}
          .options=${jt()}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${y}>
        <div class="row">
          <${_}
            label=${a("app.every")}
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${_}>
          <${y}
            label=${a("app.unit")}
            .value=${this.scheduleUnit}
            .options=${wi()}
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
        ${a("app.loading_assignments")}
      </p>`;if(this.assignmentError)return n`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:a("task.unassigned"),value:""},...this.users.map(i=>({label:i.name,value:i.id}))],t=[{label:a("task.no_nfc_tag"),value:""},...this.tags.map(i=>({label:i.name||i.id,value:i.id}))];return g`
      <div class="planning">
        <${y}
          label=${a("task.user")}
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.assigneeId=i.detail})}
        ></${y}>
        <${y}
          label=${a("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.nfcTagId=i.detail})}
        ></${y}>
        <div
          class="selector-field"
          role="group"
          aria-label=${a("task.icon")}
        >
          <span class="selector-label">${a("task.icon")}</span>
          <${$}
            .hass=${this.hass}
            .data=${{icon:this.icon}}
            .schema=${[{name:"icon",selector:{icon:{}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${i=>{this.icon=i.detail.value.icon||""}}
          ></${$}>
        </div>
        <div
          class="selector-field"
          role="group"
          aria-label=${a("task.labels")}
        >
          <span class="selector-label">${a("task.labels")}</span>
          <${$}
            .hass=${this.hass}
            .data=${{labels:this.labelIds}}
            .schema=${[{name:"labels",selector:{label:{multiple:!0}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${i=>this.assignmentChanged(()=>{this.labelIds=i.detail.value.labels||[]})}
          ></${$}>
        </div>
      </div>
    `}renderNotification(){return this.notificationLoading?n`<p class="hint" aria-live="polite">
        ${a("app.loading_notifications")}
      </p>`:this.notificationError?n`<p class="error" role="alert">${this.notificationError}</p>`:g`
      <div class="planning">
        <div class="selector-field" data-native-picker-spacing>
          <span class="selector-label">${a("app.mobile_devices")}</span>
          <${$}
            .hass=${this.hass}
            .data=${{devices:this.notificationDeviceIds}}
            .schema=${[{name:"devices",selector:{device:{multiple:!0,filter:{integration:"mobile_app"}}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${e=>this.notificationChanged(()=>{this.notificationDeviceIds=e.detail.value.devices||[]})}
          ></${$}>
        </div>
        <div class="selector-field">
          <span class="selector-label">${a("app.navigation_target")}</span>
          <${$}
            .hass=${this.hass}
            .data=${{route:this.notificationRoute}}
            .schema=${[{name:"route",selector:{navigation:null}}]}
            .computeLabel=${()=>a("app.navigation_target")}
            .disabled=${this.saving}
            @value-changed=${e=>this.notificationChanged(()=>{this.notificationRoute=e.detail.value.route||""})}
          ></${$}>
        </div>
        ${this.notificationRouteError?n`<p class="error" role="alert">
              ${this.notificationRouteError}
            </p>`:c}
        <p class="hint">${a("app.navigation_hint")}</p>
        <${$}
          .hass=${this.hass}
          .data=${{critical:this.notificationCritical}}
          .schema=${[{name:"critical",selector:{boolean:{}}}]}
          .computeLabel=${()=>a("task.notification_critical")}
          .computeHelper=${()=>a("task.notification_critical_description")}
          .disabled=${this.saving}
          @value-changed=${e=>this.notificationChanged(()=>{this.notificationCritical=e.detail.value.critical??!1})}
        ></${$}>
        <div class="section-divider" role="separator"></div>
        <${$}
          .hass=${this.hass}
          .data=${{persistent:this.notificationPersistent}}
          .schema=${[{name:"persistent",selector:{boolean:{}}}]}
          .computeLabel=${()=>a("task.notification_persistent")}
          .computeHelper=${()=>a("task.notification_persistent_description")}
          .disabled=${this.saving}
          @value-changed=${e=>this.notificationChanged(()=>{this.notificationPersistent=e.detail.value.persistent??!1})}
        ></${$}>
      </div>
    `}toggleId(e,t){return t.includes(e)?t.filter(i=>i!==e):[...t,e]}stageFiles(e){this.saving||(this.stagedFiles=[...this.stagedFiles,...Array.from(e)])}renderAttachments(){return n`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?n`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.id);return n`
                    <li class="record ${t?"pending":""}">
                      <ha-icon
                        class="record-icon"
                        .icon=${Y(e.filename,e.content_type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name"
                          >${e.filename}</span
                        >
                        <span class="record-detail"
                          >${ee(e.size)}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${a(t?"app.undo_remove_named":"app.remove_named",{name:e.filename})}
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
                        .icon=${Y(e.name,e.type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name">${e.name}</span>
                        <span class="record-detail"
                          >${ee(e.size)} ·
                          ${a("app.new_file")}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${a("app.remove_new_file",{name:e.name})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((i,s)=>s!==t)}}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </button>
                    </li>
                  `)}
              </ul>
            `:n`<p class="hint">${a("task.no_files")}.</p>`}
        <label
          class=${`file-picker ${this.fileDropActive?"drag-active":""}`}
          @dragenter=${e=>{e.preventDefault(),this.saving||(this.fileDropActive=!0)}}
          @dragover=${e=>{e.preventDefault()}}
          @dragleave=${e=>{(!e.relatedTarget||!e.currentTarget||!e.currentTarget.contains(e.relatedTarget))&&(this.fileDropActive=!1)}}
          @drop=${e=>{e.preventDefault(),this.fileDropActive=!1,e.dataTransfer?.files.length&&this.stageFiles(e.dataTransfer.files)}}
        >
          <span>${a("app.drop_files")}</span>
          <span class="file-picker-secondary">${a("app.click_to_upload")}</span>
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
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.id),i=e.type==="completed"&&e.notes==="tasks.history.completed_via_nfc"?a("history.completed_via_nfc"):e.type==="completed"?e.notes||a("app.no_notes"):e.message;return n`
            <li class="record ${t?"pending":""}">
              <ha-icon
                class="record-icon"
                .icon=${le(e)}
              ></ha-icon>
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.occurred_at)} ·
                  ${e.type==="completed"?e.user_name||a("common.system"):a("history.problem")}</span
                >
                <span class="record-detail">${e.type==="problem"?e.message:i}</span>
              </span>
              <button
                class="record-action"
                type="button"
                aria-label=${t?a("history.undo_remove"):a("history.remove")}
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
    `:n`<p class="hint">${a("task.no_history")}.</p>`}planningWarning(){return!!(this.scheduleError||this.conditionTemplateError||this.messageTemplateError||!this.scheduleDirty&&this.task?.schedule.type==="sensor"&&(this.task?.problem_condition_status||"valid")!=="valid")}render(){return g`
      <form @submit=${e=>e.preventDefault()}>
        <${_}
          label=${a("task.name")}
          .placeholder=${a("task.name")}
          .hideLabel=${!0}
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${_}>
        <${_}
          label=${a("task.optional_description")}
          .placeholder=${a("task.optional_description")}
          .hideLabel=${!0}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${_}>
        <${A}
          heading=${a("task.planning")}
          .warning=${this.planningWarning()}
        >
          ${this.renderPlanning()}
        </${A}>
        <${A} heading=${a("task.assignment")}>
          ${this.renderAssignment()}
        </${A}>
        <${A} heading=${a("task.notification")}>
          ${this.renderNotification()}
        </${A}>
        <${A} heading=${a("task.files")}>
          ${this.renderAttachments()}
        </${A}>
        ${this.task?.id?g`
              <${A} heading=${a("task.history")}>
                ${this.renderHistory()}
              </${A}>
            `:c}
        ${this.saveError?n`<p class="error" role="alert">${this.saveError}</p>`:c}
      </form>
    `}},Ke=v("task-form");customElements.get(Ke)||customElements.define(Ke,je);var qe=async(r,e,t=[])=>{let i=e||{id:"",name:"",active:!0,schedule:{type:"sliding",unit:"monthly",interval:1},notification:{device_ids:[],persistent:!1,critical:!1,route:null},due:null,history:[],attachments:[]},s=document.createElement(Ke);return s.configure(r,i,t),await E({heading:e?a("task.edit"):a("task.new"),content:s,actions:[{label:a("common.save"),value:"save",run:()=>s.save()}]})==="save"};var We=class extends f{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=b`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let i=e.getBoundingClientRect(),s=t.getBoundingClientRect(),o=window.visualViewport,l=o?.offsetLeft||0,p=o?.offsetTop||0,h=l+(o?.width||window.innerWidth),u=p+(o?.height||window.innerHeight),d=8,m=4,w=Math.min(Math.max(l+d,i.right-s.width),h-s.width-d),x=i.bottom+m,O=x+s.height<=u-d?x:Math.max(p+d,i.top-s.height-m);t.style.left=`${w}px`,t.style.top=`${O}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){if(e.key==="Escape"){e.preventDefault(),this.menu?.hidePopover(),this.trigger?.focus();return}let t=this.menuItems();if(!t.length)return;let i=t.indexOf(this.renderRoot.activeElement),s;e.key==="ArrowDown"?s=(i+1)%t.length:e.key==="ArrowUp"?s=(i-1+t.length)%t.length:e.key==="Home"?s=0:e.key==="End"&&(s=t.length-1),s!==void 0&&(e.preventDefault(),t[s].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return n`
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
    `}},he=v("action-menu");customElements.get(he)||customElements.define(he,We);var Wt="tasks-table-state-v2",Gt="tasks-table-session-v1",ge=[{value:"due",label:"task.due"},{value:"assignee",label:"table.assignee"},{value:"nfc",label:"task.nfc_tag_id"},{value:"files",label:"task.files"},{value:"labels",label:"task.labels"},{value:"notifications",label:"table.notifications"},{value:"trigger",label:"table.recurrence"},{value:"status",label:"app.status"}],ue=Object.fromEntries(ge.map(r=>[r.value,r.label])),Ti={assignee:"task.assignment",labels:"task.labels",notifications:"table.notifications",trigger:"table.recurrence",status:"app.status",due:"task.due"},Ge={due:!0,assignee:!0,nfc:!0,files:!0,labels:!1,notifications:!1,trigger:!1,status:!1},pe=()=>({assignee:[],labels:[],notifications:[],trigger:[],status:[],due:[]}),Ze=Object.keys(pe()),fe=[{value:"fixed",label:"task.fixed"},{value:"sliding",label:"task.sliding"},{value:"sensor",label:"task.problem_sensor"}],be=[{value:"active",label:"app.active"},{value:"paused",label:"app.paused"}],ve=[{value:"overdue",label:"table.due_overdue"},{value:"today",label:"table.due_today"},{value:"tomorrow",label:"table.due_tomorrow"},{value:"next_7_days",label:"table.due_next_7_days"},{value:"next_30_days",label:"table.due_next_30_days"}],Je=(r,e)=>{let t=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}).formatToParts(new Date(r)),i=s=>t.find(o=>o.type===s)?.value||"";return`${i("year")}-${i("month")}-${i("day")}`},Zt=(r,e)=>{let[t,i,s]=Je(r,e).split("-").map(Number);return Math.floor(Date.UTC(t,i-1,s)/864e5)},Jt=(r,e)=>{try{let t=globalThis[r],i=JSON.parse(t?.getItem(e)||"{}");return i&&typeof i=="object"&&!Array.isArray(i)?i:{}}catch{return{}}},Qt=k(he),Ei=r=>[{label:a("menu.edit"),value:"edit",icon:"mdi:pencil-outline"},{label:r.active===!1?a("app.resume"):a("app.pause"),value:"active",icon:r.active===!1?"mdi:play-circle-outline":"mdi:pause-circle-outline"},{label:a("common.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Ai=r=>[{label:a("bulk.complete"),value:"complete",icon:"mdi:check-circle-outline"},{label:a("app.pause"),value:"pause",icon:"mdi:pause-circle-outline"},{label:a("app.resume"),value:"resume",icon:"mdi:play-circle-outline"},{label:a("bulk.assign_person"),value:"assign",icon:"mdi:account-outline"},...r.some(e=>e.assignee_id)?[{label:a("bulk.remove_assignment"),value:"unassign",icon:"mdi:account-off-outline"}]:[],{label:a("app.add_label"),value:"add-label",icon:"mdi:tag-plus-outline"},{label:a("app.remove_label"),value:"remove-label",icon:"mdi:tag-minus-outline"},{label:a("app.add_notification"),value:"add-notification",icon:"mdi:bell-plus-outline"},{label:a("app.remove_notification"),value:"remove-notification",icon:"mdi:bell-minus-outline"},{label:a("bulk.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Qe=class extends f{static properties={hass:{attribute:!1},tasks:{attribute:!1},compact:{type:Boolean,reflect:!0},showBulkSelection:{attribute:!1},showIcon:{attribute:!1},showAddTask:{attribute:!1},showHeader:{attribute:!1},showFilters:{attribute:!1},configuredFilters:{attribute:!1},showColumns:{attribute:!1},configuredColumns:{attribute:!1},now:{attribute:!1},showSearch:{attribute:!1},showActionMenu:{attribute:!1},search:{state:!0},filters:{state:!0},openFilterGroups:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},openBulkPicker:{state:!0},openToolbarPanel:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=b`
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
  `;registryConnection;closePanels=e=>{let t=e.composedPath();for(let i of this.renderRoot.querySelectorAll("details[open]"))t.includes(i)||i.removeAttribute("open");t.some(i=>i instanceof HTMLElement&&i.classList.contains("toolbar-popover"))||(this.openToolbarPanel="")};constructor(){super();let e=Jt("localStorage",Wt),t=Jt("sessionStorage",Gt);this.tasks=[],this.compact=!1,this.showBulkSelection=!0,this.showIcon=!0,this.showAddTask=!1,this.showHeader=!0,this.showFilters=!0,this.configuredFilters=void 0,this.showColumns=!0,this.configuredColumns=void 0,this.now=void 0,this.showSearch=!0,this.showActionMenu=!0,this.search=typeof t.search=="string"?t.search:"";let i=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys(pe()).map(o=>[o,Array.isArray(i[o])?i[o].filter(l=>typeof l=="string"):[]])),this.openFilterGroups=[];let s=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(Ge).map(o=>[o,typeof s[o]=="boolean"?s[o]:Ge[o]])),this.users=[],this.labels=[],this.tags=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.openBulkPicker="",this.openToolbarPanel="",this.bulkBusy=!1,this.bulkError=""}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.closePanels)}disconnectedCallback(){document.removeEventListener("click",this.closePanels),super.disconnectedCallback()}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[i,s]=await Promise.allSettled([U(e),ae(e)]);this.registryConnection===t&&(i.status==="fulfilled"&&(this.users=i.value.users,this.labels=i.value.labels,this.tags=i.value.tags),s.status==="fulfilled"&&(this.devices=s.value),(i.status==="rejected"||s.status==="rejected")&&(this.registryError=a("app.registry_load_error")))}trigger(e){return e.schedule.type==="sensor"?a("task.problem_sensor"):e.schedule.type==="fixed"?a("task.fixed"):a("task.sliding")}status(e){return e.active===!1?a("app.paused"):a("app.active")}problemSensorWarning(e){if(e.schedule.type!=="sensor")return c;let t=e.problem_condition_status||"valid";if(t==="valid")return c;let i=t!=="invalid"?a(`problem.sensor_${t}`,{entity_id:e.problem_condition_entity_id||""}):a("problem.template_error");return n`
      <span class="sensor-warning" title=${i} aria-label=${i}>
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </span>
    `}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||"\u2014"}nfcTag(e){return e.nfc_tag_id?this.tags.find(t=>t.id===e.nfc_tag_id)?.name||e.nfc_tag_id:"\u2014"}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(i=>t.has(i.label_id)).sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification.device_ids||[]);return this.devices.filter(i=>t.has(i.id)).sort((i,s)=>this.deviceName(i).localeCompare(this.deviceName(s),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification.persistent?[a("task.notification_persistent")]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="due"){if(e.active===!1||!e.due)return[];let i=this.hass?.config?.time_zone,s=Zt(e.due,i)-Zt(this.now||new Date,i);return[...s<0?["overdue"]:[],...s===0?["today"]:[],...s===1?["tomorrow"]:[],...s>=0&&s<7?["next_7_days"]:[],...s>=0&&s<30?["next_30_days"]:[]]}if(t==="assignee")return[this.users.find(s=>s.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let i=this.taskLabels(e).map(s=>s.label_id);return i.length?i:["__none__"]}if(t==="notifications"){let i=[...e.notification.persistent?["panel"]:[],...this.notificationDevices(e).map(s=>s.id)];return i.length?i:["__none__"]}return t==="status"?[e.active===!1?"paused":"active"]:[e.schedule.type]}filterLabel(e,t){if(t==="__none__")return e==="assignee"?a("task.unassigned"):e==="labels"?a("task.no_labels"):a("app.no_notifications");if(e==="assignee")return this.users.find(s=>s.id===t)?.name||t;if(e==="labels")return this.labels.find(s=>s.label_id===t)?.name||t;if(e==="notifications")return t==="panel"?a("task.notification_persistent"):this.deviceName(this.devices.find(s=>s.id===t));if(e==="status"){let s=be.find(o=>o.value===t);return s?a(s.label):t}let i=fe.find(s=>s.value===t);return i?a(i.label):t}filterOptions(e){return e==="due"?ve.map(i=>({value:i.value,label:a(i.label)})):[...new Set(this.tasks.flatMap(i=>this.filterValues(i,e)))].map(i=>({value:i,label:this.filterLabel(e,i)})).sort((i,s)=>i.label.localeCompare(s.label,this.hass?.locale?.language))}activeFilters(){return this.configuredFilters?{...pe(),...this.configuredFilters}:this.filters}matchesFilters(e,t){return Ze.every(i=>{let s=t[i];return!s.length||this.filterValues(e,i).some(o=>s.includes(o))})}dueValue(e){if(e.active===!1||!e.due)return;let t=Date.parse(e.due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);return t===void 0?e.active!==!1&&e.schedule.type==="sensor"&&!e.due?a("table.waiting"):"\u2014":new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}dueStatus(e){if(e.active===!1||this.dueValue(e)===void 0)return"";let t=this.hass?.config?.time_zone,i=Je(e.due,t),s=Je(new Date,t);return i<s?"due-overdue":i===s?"due-today":""}rowClass(e){return e.active===!1?"inactive":this.dueStatus(e)}sortGroup(e){return e.active===!1?2:e.schedule.type==="sensor"&&!e.due?1:0}compareDue(e,t){let i=this.sortGroup(e)-this.sortGroup(t);if(i)return i;let s=this.dueValue(e),o=this.dueValue(t);if(s===void 0||o===void 0){if(s!==o)return s===void 0?1:-1}else if(s!==o)return s-o;return e.name.localeCompare(t.name,this.hass?.locale?.language)}visibleTasks(){let e=this.showSearch?this.search.trim().toLocaleLowerCase(this.hass?.locale?.language):"",t=this.activeFilters();return this.tasks.filter(i=>this.matchesFilters(i,t)&&(!e||[i.name,i.description,this.assignee(i),this.nfcTag(i),this.taskLabels(i).map(s=>s.name).join(" "),this.notificationDevices(i).map(s=>this.deviceName(s)).join(" "),this.trigger(i),this.status(i)].some(s=>s?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((i,s)=>this.compareDue(i,s))}toggleFilter(e,t,i){let s=this.filters[e];this.filters={...this.filters,[e]:i?[...new Set([...s,t])]:s.filter(o=>o!==t)},this.retainVisibleSelection(),this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}resetColumns(){this.columns=this.configuredColumns?Object.fromEntries(Object.keys(ue).map(e=>[e,this.configuredColumns.includes(e)])):{...Ge},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(Wt,JSON.stringify({columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(Gt,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="files"?String(e.attachments.length):t==="nfc"?this.nfcTag(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}columnValue(e,t){let i=this.columnText(e,t);return t==="due"&&i!=="\u2014"&&this.hass&&e.due?n`
        <ha-relative-time
          .hass=${this.hass}
          .datetime=${e.due}
          capitalize
          title=${i}
        ></ha-relative-time>
      `:t==="status"?n`<span class="status">${i}</span>`:i}mobileDetails(e){return this.visibleColumnKeys().filter(i=>this.columnText(e,i)!=="\u2014").map((i,s)=>n`
        ${s?n`<span aria-hidden="true"> · </span>`:c}
        ${this.columnValue(e,i)}
      `)}visibleColumnKeys(){return this.configuredColumns??Object.keys(this.columns).filter(e=>this.columns[e])}visibleColumnCount(){return this.visibleColumnKeys().length+1+Number(this.showIcon)+Number(this.showBulkSelection)+Number(this.showActionMenu)}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.id))}visibleSelectedTasks(){let e=new Set(this.selectedIds);return this.visibleTasks().filter(t=>e.has(t.id))}retainVisibleSelection(){let e=new Set(this.visibleTasks().map(t=>t.id));this.selectedIds=this.selectedIds.filter(t=>e.has(t))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(i=>i!==e)}toggleVisible(e,t){let i=new Set(this.selectedIds);for(let s of e)t?i.add(s.id):i.delete(s.id);this.selectedIds=[...i]}bulkTargets(){return this.bulkAction==="assign"?this.users.map(e=>({value:e.id,label:e.name})):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:a("task.notification_persistent")},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkActionDestructive(){return["delete","remove-label","remove-notification"].includes(this.bulkAction)}bulkActionLabel(){return this.bulkAction==="complete"?a("bulk.complete"):this.bulkAction==="pause"?a("app.pause"):this.bulkAction==="resume"?a("app.resume"):this.bulkAction==="assign"?a("app.assign"):this.bulkAction==="unassign"?a("bulk.remove_assignment"):this.bulkAction==="add-label"||this.bulkAction==="add-notification"?a("app.add"):this.bulkAction==="remove-label"||this.bulkAction==="remove-notification"?a("common.remove"):this.bulkAction==="delete"?a("common.delete"):a("app.apply")}bulkTargetLabel(){return this.bulkAction==="assign"?a("app.choose_person"):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?a("app.choose_label"):a("app.choose_notification")}bulkTargetIcon(){return this.bulkAction==="assign"?"mdi:account-outline":this.bulkAction==="add-label"||this.bulkAction==="remove-label"?"mdi:tag-outline":"mdi:bell-outline"}bulkOperations(){return this.visibleSelectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",id:e.id,notes:null};if(this.bulkAction==="delete")return{action:"delete",id:e.id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget};else if(this.bulkAction==="unassign")t={assignee_id:null};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let i=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?i.filter(s=>s!==this.bulkTarget):[...new Set([...i,this.bulkTarget])]}}else{let i=e.notification.device_ids||[];this.bulkTarget==="panel"?t={notification:{...e.notification,persistent:this.bulkAction==="add-notification"}}:t={notification:{...e.notification,device_ids:this.bulkAction==="remove-notification"?i.filter(s=>s!==this.bulkTarget):[...new Set([...i,this.bulkTarget])]}}}return{action:"update",id:e.id,changes:t}})}renderBulkPicker(e,t,i,s,o,l){let p=t.find(u=>u.value===i),h=this.openBulkPicker===e;return n`
      <div class=${h?"bulk-action-picker open":"bulk-action-picker"}>
        <button
          class="bulk-action-picker-trigger"
          type="button"
          aria-expanded=${h?"true":"false"}
          @click=${()=>{this.openBulkPicker=h?"":e}}
        >
          <ha-icon .icon=${p?.icon||o}></ha-icon>
          <span>${p?.label||s}</span>
          <ha-icon
            class="picker-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="bulk-action-content">
          <div class="bulk-action-list">
            ${t.map(u=>n`
                <button
                  class=${["bulk-action",i===u.value?"selected":"",u.destructive?"destructive":""].filter(Boolean).join(" ")}
                  type="button"
                  @click=${()=>{l(u.value),this.openBulkPicker=""}}
                >
                  ${u.icon?n`<ha-icon .icon=${u.icon}></ha-icon>`:c}
                  <span>${u.label}</span>
                </button>
              `)}
          </div>
        </div>
      </div>
    `}renderBulkMenu(e){let t=this.bulkTargets(),i=Ai(e),s=this.bulkTargetIcon(),o=t.map(l=>({...l,icon:s}));return n`
      <details
        class="bulk-menu"
        @toggle=${l=>{l.currentTarget.open||(this.openBulkPicker="")}}
      >
        <summary>${a("bulk.actions")} (${e.length})</summary>
        <div class="popover-panel">
          <div class="bulk-bar">
            ${this.renderBulkPicker("action",i,this.bulkAction,a("app.choose_action"),"mdi:gesture-tap-button",l=>{this.bulkAction=l,this.bulkTarget="",this.bulkError=""})}
            ${t.length?this.renderBulkPicker("target",o,this.bulkTarget,this.bulkTargetLabel(),s,l=>{this.bulkTarget=l}):c}
            <div class="bulk-footer">
              <ha-button
                appearance="accent"
                variant=${this.bulkActionDestructive()?"danger":"brand"}
                ?disabled=${this.bulkBusy||!e.length||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget}
                @click=${()=>{this.applyBulk()}}
              >
                ${this.bulkBusy?a("app.applying"):this.bulkActionLabel()}
              </ha-button>
            </div>
            ${this.bulkError?n`<p class="bulk-error" role="alert">
                  ${this.bulkError}
                </p>`:c}
          </div>
        </div>
      </details>
    `}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await E({heading:t?a("bulk.delete_title"):a("bulk.complete_title"),content:n`<p>
          ${t?a("bulk.delete_confirm",{count:e.length}):a("bulk.complete_confirm",{count:e.length})}
        </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:t?a("common.delete"):a("app.complete"),value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await Pt(this.hass,e);let t=new Set(e.map(i=>i.id));this.selectedIds=this.selectedIds.filter(i=>!t.has(i)),this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=T(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return this.showFilters?Ze.reduce((e,t)=>e+this.filters[t].length,0):0}filterGroup(e,t){let i=this.filters[t].length,s=this.openFilterGroups.includes(t);return n`
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
      <th class=${`${e}-column`}>${a(ue[e])}</th>
    `}columnCell(e,t){return n`
      <td class=${`${t}-column`}>
        ${this.columnValue(e,t)}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),i=this.visibleColumnKeys(),s=this.showBulkSelection?this.selectedTasks():[],o=new Set(this.showBulkSelection?this.selectedIds:[]),l=e.length>0&&e.every(d=>o.has(d.id)),p=e.some(d=>o.has(d.id)),h=this.showSearch||this.showAddTask||this.showFilters||this.showColumns||s.length>0,u=this.showAddTask&&!this.showSearch&&!this.showFilters&&!this.showColumns&&s.length===0;return g`
      ${h?n`
            <div class="toolbar">
              ${this.showSearch||this.showAddTask||s.length?n`
                    <div class="selection-toolbar">
                      ${this.showSearch?n`
                            <input
                              class="search"
                              type="search"
                              aria-label=${a("table.search")}
                              placeholder=${a("table.search")}
                              .value=${this.search}
                              @input=${d=>{this.search=d.currentTarget.value,this.retainVisibleSelection(),this.storeSessionView()}}
                            >
                          `:c}
                      ${this.showAddTask?n`
                            <button
                              class=${u?"toolbar-button full-width":"toolbar-button"}
                              type="button"
                              @click=${()=>this.dispatchEvent(new CustomEvent("tasks-task-add",{bubbles:!0,composed:!0}))}
                            >
                              ${a("card.add_task")}
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
                        ${a("table.filters")}${t?` (${t})`:""}
                      </button>
                      ${this.openToolbarPanel==="filters"?n`
                            <div class="popover-panel filter-panel">
                              <div class="filter-grid">
                                ${Ze.map(d=>this.filterGroup(a(Ti[d]),d))}
                              </div>
                              <div class="filter-footer">
                                ${this.registryError?n`<p class="registry-error">
                                      ${this.registryError}
                                    </p>`:c}
                                <ha-button
                                  appearance="plain"
                                  variant="neutral"
                                  @click=${()=>{this.filters=pe(),this.storeSessionView()}}
                                >
                                  ${a("table.reset_filters")}
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
                        ${a("table.columns")}
                      </button>
                      ${this.openToolbarPanel==="columns"?n`
                            <div class="popover-panel column-panel">
                              <div class="column-options">
                                ${Object.keys(ue).map(d=>n`
                                    <button
                                      class=${this.columns[d]?"option-row active":"option-row"}
                                      type="button"
                                      aria-pressed=${this.columns[d]}
                                      @click=${()=>this.toggleColumn(d,!this.columns[d])}
                                    >
                                      <span>${a(ue[d])}</span>
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
                                  ${a("table.reset_columns")}
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
                              aria-label=${a("app.select_visible")}
                              .checked=${l}
                              .indeterminate=${p&&!l}
                              @change=${d=>this.toggleVisible(e,d.currentTarget.checked)}
                            ></ha-checkbox>
                          </th>
                        `:c}
                    ${this.showIcon?n`<th class="icon" aria-hidden="true"></th>`:c}
                    <th>${a("table.task")}</th>
                    ${i.map(d=>this.columnHeader(d))}
                    ${this.showActionMenu?n`<th
                          class="actions"
                          aria-label=${a("task.actions")}
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
                                aria-label=${a("app.select_task",{name:d.name})}
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
                              <${Qt}
                                label=${a("app.actions_for",{name:d.name})}
                                .items=${Ei(d)}
                                @tasks-action=${m=>this.action(d,m.detail)}
                              ></${Qt}>
                            </td>
                          `:c}
                    </tr>
                  `):n`
                  <tr>
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.showSearch&&this.search?a("table.empty"):a("app.no_tasks")}
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `}},me=v("task-table");customElements.get(me)||customElements.define(me,Qe);var Xe=class extends f{static properties={tone:{reflect:!0}};static styles=b`
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
  `;constructor(){super(),this.tone="default"}render(){return n`<span><slot></slot></span>`}},ye=v("pill");customElements.get(ye)||customElements.define(ye,Xe);var I=k(z),C=k(ye),Xt=k(V),Ye=class extends f{static properties={attachment:{attribute:!1},url:{}};static styles=b`
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
      ${a("app.open_file",{name:this.attachment.filename})}
    </a>`}},et=v("attachment-preview");customElements.get(et)||customElements.define(et,Ye);var tt=class extends f{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0},renderedDescription:{state:!0},templateError:{state:!0}};static styles=b`
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

    .problem-error {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-2);
      padding: var(--ha-space-3);
      border: var(--ha-border-width-sm) solid var(--error-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .problem-error ha-icon {
      --mdc-icon-size: 22px;
      color: var(--error-color);
    }

    .problem-error-content {
      display: grid;
      gap: var(--ha-space-1);
      min-width: 0;
    }

    .problem-error-title {
      color: var(--primary-text-color);
    }

    .problem-error-message {
      color: var(--secondary-text-color);
      line-height: 1.45;
      overflow-wrap: anywhere;
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
  `;hass;unsubscribeTemplate;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1,this.renderedDescription="",this.templateError=""}connectedCallback(){super.connectedCallback(),this.subscribeDescriptionTemplate()}disconnectedCallback(){super.disconnectedCallback(),this.disconnectDescriptionTemplate()}configure(e,t,i=[]){this.hass=e,this.task=t,this.renderedDescription=t.description||"",this.attachments=[...t.attachments],this.history=ne(t.history||[]),this.isConnected&&this.subscribeDescriptionTemplate(),this.loadDetails()}async subscribeDescriptionTemplate(){if(this.unsubscribeTemplate||!this.hass||!this.task)return;let e=this.task.description||"";if(e.trim()){this.templateError="";try{this.unsubscribeTemplate=this.hass.connection.subscribeMessage(t=>{if("error"in t){this.templateError=t.error;return}this.templateError="",this.renderedDescription=t.result},{type:"render_template",template:e,variables:{config:{type:"markdown",content:e},user:this.hass?.user?.name||""},strict:!0,report_errors:!1}),await this.unsubscribeTemplate}catch{this.renderedDescription=e,this.unsubscribeTemplate=void 0}}}disconnectDescriptionTemplate(){this.unsubscribeTemplate?.then(e=>e()).catch(()=>{}),this.unsubscribeTemplate=void 0,this.templateError=""}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.attachmentError="";let[e,t]=await Promise.allSettled([U(this.hass),Dt(this.hass,this.task.id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError=a("app.assignment_load_error"),t.status==="fulfilled"?this.signedFiles=t.value.signed_files||{}:this.attachmentError=a("app.attachment_load_error"),this.loading=!1}formatDate(e){if(!e)return a("app.not_scheduled");let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}renderDescription(){return(this.task.description||"").trim()?n`
      ${this.templateError?n`<p class="error" role="alert">${this.templateError}</p>`:c}
      <ha-markdown
        cache
        breaks
        .content=${this.renderedDescription}
      ></ha-markdown>
    `:n`<p class="hint">${a("task.no_description")}.</p>`}async openAttachment(e){let t=this.signedFiles[e.id];if(!t)return;let i=document.createElement(et);i.attachment=e,i.url=t,await E({heading:e.filename,content:i,width:"large"})}async complete(){if(!this.hass||this.completing||await E({heading:a("task.complete_title"),content:n`<p>
        ${a("task.complete_confirm",{name:this.task.name})}
      </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("app.complete"),value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await It(this.hass,this.task.id,this.completionNotes),!0}catch(t){return this.completionError=T(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(s=>s.id===this.task.assignee_id)?.name,t=this.tags.find(s=>s.id===this.task.nfc_tag_id),i=(this.task.label_ids||[]).map(s=>this.labels.find(o=>o.label_id===s)).filter(s=>!!s);return g`
      <div class="pills">
        ${this.task.due?g`<${C}>
              <ha-icon icon="mdi:calendar"></ha-icon>
              ${this.formatDate(this.task.due)}
            </${C}>`:c}
        ${e?g`<${C}>
              <ha-icon icon="mdi:account-outline"></ha-icon>
              ${e}
            </${C}>`:c}
        ${this.attachments.length?g`<${C}
              title=${a(this.attachments.length===1?"app.file_count_one":"app.file_count_many",{count:this.attachments.length})}
            >
              <ha-icon icon="mdi:paperclip"></ha-icon>
              ${this.attachments.length}
            </${C}>`:c}
        ${t?g`<${C}>
              <ha-icon icon="mdi:nfc"></ha-icon>
              ${t.name||t.id}
            </${C}>`:c}
        ${i.length?n`<span class="pill-break"></span>`:c}
        ${i.map(s=>g`<${C}>
              <ha-icon icon="mdi:tag-outline"></ha-icon>
              ${s.name}
            </${C}>`)}
      </div>
    `}scheduleText(){return ce(this.task.schedule,this.hass?.locale?.language)}renderPlanning(){let e=this.task.schedule;if(e.type==="sensor"){let t=/^\s*{{\s*is_state\(['"]binary_sensor\.[^'"]+['"],\s*['"]on['"]\)\s*}}\s*$/.test(e.condition_template);return n`
        <dl class="planning-details">
          <dt>${a("task.recurrence_calculation")}</dt>
          <dd>${a("task.problem_sensor")}</dd>
          <dt>${a("task.sensor")}</dt>
          <dd>${a(t?"task.binary_sensor":"task.template")}</dd>
        </dl>
      `}return n`
      <dl class="planning-details">
        <dt>${a("task.recurrence_calculation")}</dt>
        <dd>${e.type==="fixed"?a("task.fixed"):a("task.sliding")}</dd>
        <dt>${a("task.planning")}</dt>
        <dd>${this.scheduleText()}</dd>
      </dl>
    `}renderProblemError(){if(this.task.schedule.type!=="sensor"||!this.task.problem_active||!this.task.due)return c;let e=this.history.find(t=>t.type==="problem");return e?n`
      <div class="problem-error" role="alert">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <div class="problem-error-content">
          <span class="problem-error-title">${a("task.problem_message")}</span>
          <span class="problem-error-message">${e.message}</span>
        </div>
      </div>
    `:c}renderAttachments(){return this.attachmentError?n`<p class="error" role="alert">${this.attachmentError}</p>`:this.attachments.length?n`
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
                  .icon=${Y(e.filename,e.content_type)}
                ></ha-icon>
                <span class="record-content">
                  <span>${e.filename}</span>
                  <span class="secondary">
                    ${ee(e.size)}
                  </span>
                </span>
              </button>
            </li>
          `})}
      </ul>
    `:n`<p class="hint">${a("task.no_files")}.</p>`}renderHistory(){return this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>n`
          <li class="record">
            <ha-icon
              class="record-icon"
              .icon=${le(e)}
            ></ha-icon>
            <span class="record-content">
              <span>
                ${this.formatDate(e.occurred_at)} ·
                ${e.type==="completed"?e.user_name||a("common.system"):a("history.problem")}
              </span>
              <span class="secondary">
                ${e.type==="problem"?e.message:e.notes==="tasks.history.completed_via_nfc"?a("history.completed_via_nfc"):e.notes||a("app.no_notes")}
              </span>
            </span>
          </li>
        `)}
      </ul>
    `:n`<p class="hint">${a("task.no_history")}.</p>`}render(){return g`
      <div class="content">
        ${this.renderMetadata()}
        ${this.renderProblemError()}
        <${I}
          heading=${a("task.optional_description")}
          .open=${!0}
        >
          <div class="description">${this.renderDescription()}</div>
        </${I}>
        ${this.loading?n`<p class="hint" aria-live="polite">
              ${a("app.loading_details")}
            </p>`:c}
        ${this.assignmentError?n`<p class="error" role="alert">${this.assignmentError}</p>`:c}
        <${I}
          heading=${a("task.planning")}
        >
          ${this.renderPlanning()}
        </${I}>
        <${I} heading=${a("task.files")}>
          ${this.renderAttachments()}
        </${I}>
        <${I} heading=${a("task.history")}>
          ${this.renderHistory()}
        </${I}>
        <${Xt}
          label=${a("task.completion_notes")}
          .placeholder=${a("task.completion_notes")}
          .hideLabel=${!0}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${Xt}>
        ${this.completionError?n`<p class="error" role="alert">${this.completionError}</p>`:c}
      </div>
    `}},it=v("task-viewer");customElements.get(it)||customElements.define(it,tt);var Yt=async(r,e,t=[])=>{let i=document.createElement(it);return i.configure(r,e,t),await E({heading:e.name,content:i,actions:[{label:a("app.complete"),value:"complete",run:()=>i.complete()}]})==="complete"};var j="tasks-card",ei=k(me),ti=["due","assignee"],ii=()=>({type:`custom:${j}`,show_bulk_selection:!1,show_search:!0,show_action_menu:!1,show_icon:!0,show_add_task:!0,show_header:!1,filter_assignees:[],filter_current_user:!1,filter_unassigned:!1,filter_labels:[],filter_no_labels:!1,filter_notifications:[],filter_persistent:!1,filter_no_notifications:!1,filter_triggers:[],filter_statuses:[],filter_due:[],columns:[...ti]}),Ci=()=>{let{type:r,...e}=ii();return e},$e=(r,e,t)=>Array.isArray(r)?r.filter((i,s,o)=>typeof i=="string"&&e.some(l=>l.value===i)&&o.indexOf(i)===s):[...t],st=r=>Array.isArray(r)?r.filter((e,t,i)=>typeof e=="string"&&i.indexOf(e)===t):[],Si=r=>({type:r.type||`custom:${j}`,show_bulk_selection:r.show_bulk_selection===!0,show_search:r.show_search!==!1,show_action_menu:r.show_action_menu===!0,show_icon:r.show_icon!==!1,show_add_task:r.show_add_task!==!1,show_header:r.show_header===!0,filter_assignees:st(r.filter_assignees),filter_current_user:r.filter_current_user===!0,filter_unassigned:r.filter_unassigned===!0,filter_labels:st(r.filter_labels),filter_no_labels:r.filter_no_labels===!0,filter_notifications:st(r.filter_notifications),filter_persistent:r.filter_persistent===!0,filter_no_notifications:r.filter_no_notifications===!0,filter_triggers:$e(r.filter_triggers,fe,[]),filter_statuses:$e(r.filter_statuses,be,[]),filter_due:$e(r.filter_due,ve,[]),columns:$e(r.columns,ge,ti)}),rt=class extends f{static properties={hass:{attribute:!1},config:{state:!0},snapshot:{state:!0},error:{state:!0}};static styles=b`
    :host {
      display: block;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .message {
      margin: 0;
      padding: var(--ha-space-4);
      color: var(--secondary-text-color);
    }

    .error {
      color: var(--error-color);
    }
  `;connection;unsubscribe;language;static getStubConfig(){return Ci()}static getConfigForm(){return{schema:[{type:"expandable",name:"",title:a("card.options"),flatten:!0,schema:[{name:"show_bulk_selection",selector:{boolean:{}}},{name:"show_search",selector:{boolean:{}}},{name:"show_action_menu",selector:{boolean:{}}},{name:"show_icon",selector:{boolean:{}}},{name:"show_add_task",selector:{boolean:{}}},{name:"show_header",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("card.filter"),flatten:!0,schema:[{type:"expandable",name:"",title:a("task.assignment"),flatten:!0,schema:[{name:"filter_assignees",selector:{entity:{multiple:!0,filter:[{domain:"person"}]}}},{name:"filter_unassigned",selector:{boolean:{}}},{name:"filter_current_user",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("task.labels"),flatten:!0,schema:[{name:"filter_labels",selector:{label:{multiple:!0}}},{name:"filter_no_labels",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("table.notifications"),flatten:!0,schema:[{name:"filter_notifications",selector:{device:{multiple:!0,filter:[{integration:"mobile_app"}]}}},{name:"filter_persistent",selector:{boolean:{}}},{name:"filter_no_notifications",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("table.recurrence"),flatten:!0,schema:[{name:"filter_triggers",selector:{select:{multiple:!0,options:fe.map(e=>({value:e.value,label:a(e.label)}))}}}]},{type:"expandable",name:"",title:a("app.status"),flatten:!0,schema:[{name:"filter_statuses",selector:{select:{multiple:!0,options:be.map(e=>({value:e.value,label:a(e.label)}))}}}]},{type:"expandable",name:"",title:a("task.due"),flatten:!0,schema:[{name:"filter_due",selector:{select:{multiple:!0,options:ve.map(e=>({value:e.value,label:a(e.label)}))}}}]}]},{type:"expandable",name:"",title:a("card.content"),flatten:!0,schema:[{name:"columns",selector:{select:{multiple:!0,reorder:!0,options:ge.map(e=>({value:e.value,label:a(e.label)}))}}}]}],computeLabel:e=>{let t={show_bulk_selection:"card.multi_selection",show_search:"card.search",show_action_menu:"card.action_menu",show_icon:"task.icon",show_add_task:"card.add_task",show_header:"card.table_header",filter_assignees:"task.user",filter_current_user:"card.current_user",filter_unassigned:"task.unassigned",filter_labels:"task.labels",filter_no_labels:"task.no_labels",filter_notifications:"table.notifications",filter_persistent:"task.notification_persistent",filter_no_notifications:"app.no_notifications",filter_triggers:"table.recurrence",filter_statuses:"app.status",filter_due:"card.due_periods",columns:"card.visible_columns"};return t[e.name]?a(t[e.name]):void 0}}}constructor(){super(),this.config=ii(),this.error=""}setConfig(e){if(!e||typeof e!="object")throw new Error("Card configuration is required");this.config=Si(e)}getCardSize(){return Math.max(2,Math.min(8,this.snapshot?.tasks.length||2))}updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,Ne(this.language))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass,t=e.connection;this.connection=t,this.error="";try{let i=await At(e,s=>{this.snapshot=s});this.connection===t?this.unsubscribe=i:i()}catch(i){this.connection===t&&(this.error=T(i))}}openTask(e){this.hass&&Yt(this.hass,e)}async confirmDelete(e){this.hass&&await E({heading:a("task.delete_title"),content:n`<p>
        ${a("task.delete_confirm",{name:e.name})}
      </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("common.delete"),value:"delete",destructive:!0,run:()=>Lt(this.hass,e.id)}]})}handleTaskAction(e,t){this.hass&&(e==="edit"?qe(this.hass,t):e==="active"?Ft(this.hass,t.id,t.active===!1):e==="delete"&&this.confirmDelete(t))}configuredFilters(){let e=new Set(this.config.filter_assignees.map(t=>this.hass?.states?.[t]?.attributes?.user_id).filter(t=>!!t));return this.config.filter_current_user&&this.hass?.user?.id&&e.add(this.hass.user.id),{assignee:[...e,...this.config.filter_unassigned?["__none__"]:[]],labels:[...this.config.filter_labels,...this.config.filter_no_labels?["__none__"]:[]],notifications:[...this.config.filter_notifications,...this.config.filter_persistent?["panel"]:[],...this.config.filter_no_notifications?["__none__"]:[]],trigger:this.config.filter_triggers,status:this.config.filter_statuses,due:this.config.filter_due}}render(){return this.error?n`<p class="message error">${this.error}</p>`:this.snapshot?g`
      <${ei}
        compact
        .hass=${this.hass}
        .tasks=${this.snapshot.tasks}
        .now=${this.snapshot.now}
        .configuredFilters=${this.configuredFilters()}
        .showBulkSelection=${this.config.show_bulk_selection}
        .showIcon=${this.config.show_icon}
        .showAddTask=${this.config.show_add_task}
        .showHeader=${this.config.show_header}
        .showFilters=${!1}
        .showColumns=${!1}
        .configuredColumns=${this.config.columns}
        .showSearch=${this.config.show_search}
        .showActionMenu=${this.config.show_action_menu}
        @tasks-task-open=${e=>this.openTask(e.detail)}
        @tasks-task-add=${()=>this.hass&&void qe(this.hass)}
        @tasks-task-action=${e=>this.handleTaskAction(e.detail.action,e.detail.task)}
      ></${ei}>
    `:n`<p class="message">${a("common.loading")}</p>`}};customElements.get(j)||customElements.define(j,rt);window.customCards||=[];var ke=window.customCards.find(r=>r.type===j);ke||(ke={type:j,name:"Tasks"},window.customCards.push(ke));Bt.then(()=>{ke.description=a("card.description")});
