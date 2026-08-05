var te=globalThis,se=te.ShadowRoot&&(te.ShadyCSS===void 0||te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),Ye=new WeakMap,W=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(se&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Ye.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ye.set(t,e))}return e}toString(){return this.cssText}},et=a=>new W(typeof a=="string"?a:a+"",void 0,me),b=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((s,i,o)=>s+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[o+1],a[0]);return new W(t,a,me)},tt=(a,e)=>{if(se)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=te.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,a.appendChild(s)}},ge=se?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return et(t)})(a):a;var{is:Xt,defineProperty:Yt,getOwnPropertyDescriptor:es,getOwnPropertyNames:ts,getOwnPropertySymbols:ss,getPrototypeOf:is}=Object,ie=globalThis,st=ie.trustedTypes,rs=st?st.emptyScript:"",as=ie.reactiveElementPolyfillSupport,q=(a,e)=>a,fe={toAttribute(a,e){switch(e){case Boolean:a=a?rs:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},rt=(a,e)=>!Xt(a,e),it={attribute:!0,type:String,converter:fe,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??=Symbol("metadata"),ie.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=it){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Yt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:o}=es(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){let p=i?.call(this);o?.call(this,l),this.requestUpdate(e,p,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??it}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=is(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,s=[...ts(t),...ss(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(ge(i))}else e!==void 0&&t.push(ge(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return tt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:fe).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:fe;this._$Em=i;let p=l.fromAttribute(t,o.type);this[i]=p??this._$Ej?.get(i)??p,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(e!==void 0){let l=this.constructor;if(i===!1&&(o=this[e]),s??=l.getPropertyOptions(e),!((s.hasChanged??rt)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(l._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},l){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),o!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:l}=o,p=this[i];l!==!0||this._$AL.has(i)||p===void 0||this.C(i,void 0,o,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[q("elementProperties")]=new Map,C[q("finalized")]=new Map,as?.({ReactiveElement:C}),(ie.reactiveElementVersions??=[]).push("2.1.2");var _e=globalThis,at=a=>a,re=_e.trustedTypes,ot=re?re.createPolicy("lit-html",{createHTML:a=>a}):void 0,pt="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,ut="?"+D,os=`<${ut}>`,H=document,Z=()=>H.createComment(""),J=a=>a===null||typeof a!="object"&&typeof a!="function",we=Array.isArray,ns=a=>we(a)||typeof a?.[Symbol.iterator]=="function",be=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,nt=/-->/g,lt=/>/g,F=RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,dt=/"/g,mt=/^(?:script|style|textarea|title)$/i,Te=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),n=Te(1),gt=Te(2),ft=Te(3),M=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ht=new WeakMap,N=H.createTreeWalker(H,129);function bt(a,e){if(!we(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return ot!==void 0?ot.createHTML(e):e}var ls=(a,e)=>{let t=a.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",l=G;for(let p=0;p<t;p++){let h=a[p],u,c,m=-1,x=0;for(;x<h.length&&(l.lastIndex=x,c=l.exec(h),c!==null);)x=l.lastIndex,l===G?c[1]==="!--"?l=nt:c[1]!==void 0?l=lt:c[2]!==void 0?(mt.test(c[2])&&(i=RegExp("</"+c[2],"g")),l=F):c[3]!==void 0&&(l=F):l===F?c[0]===">"?(l=i??G,m=-1):c[1]===void 0?m=-2:(m=l.lastIndex-c[2].length,u=c[1],l=c[3]===void 0?F:c[3]==='"'?dt:ct):l===dt||l===ct?l=F:l===nt||l===lt?l=G:(l=F,i=void 0);let w=l===F&&a[p+1].startsWith("/>")?" ":"";o+=l===G?h+os:m>=0?(s.push(u),h.slice(0,m)+pt+h.slice(m)+D+w):h+D+(m===-2?p:w)}return[bt(a,o+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Q=class a{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,l=0,p=e.length-1,h=this.parts,[u,c]=ls(e,t);if(this.el=a.createElement(u,s),N.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=N.nextNode())!==null&&h.length<p;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(pt)){let x=c[l++],w=i.getAttribute(m).split(D),R=/([.?@])?(.*)/.exec(x);h.push({type:1,index:o,name:R[2],strings:w,ctor:R[1]==="."?ye:R[1]==="?"?$e:R[1]==="@"?ke:z}),i.removeAttribute(m)}else m.startsWith(D)&&(h.push({type:6,index:o}),i.removeAttribute(m));if(mt.test(i.tagName)){let m=i.textContent.split(D),x=m.length-1;if(x>0){i.textContent=re?re.emptyScript:"";for(let w=0;w<x;w++)i.append(m[w],Z()),N.nextNode(),h.push({type:2,index:++o});i.append(m[x],Z())}}}else if(i.nodeType===8)if(i.data===ut)h.push({type:2,index:o});else{let m=-1;for(;(m=i.data.indexOf(D,m+1))!==-1;)h.push({type:7,index:o}),m+=D.length-1}o++}}static createElement(e,t){let s=H.createElement("template");return s.innerHTML=e,s}};function U(a,e,t=a,s){if(e===M)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,o=J(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(a),i._$AT(a,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=U(a,i._$AS(a,e.values),i,s)),e}var ve=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??H).importNode(t,!0);N.currentNode=i;let o=N.nextNode(),l=0,p=0,h=s[0];for(;h!==void 0;){if(l===h.index){let u;h.type===2?u=new X(o,o.nextSibling,this,e):h.type===1?u=new h.ctor(o,h.name,h.strings,this,e):h.type===6&&(u=new xe(o,this,e)),this._$AV.push(u),h=s[++p]}l!==h?.index&&(o=N.nextNode(),l++)}return N.currentNode=H,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},X=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),J(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ns(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&J(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Q.createElement(bt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let o=new ve(i,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=ht.get(e.strings);return t===void 0&&ht.set(e.strings,t=new Q(e)),t}k(e){we(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new a(this.O(Z()),this.O(Z()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=at(e).nextSibling;at(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,i){let o=this.strings,l=!1;if(o===void 0)e=U(this,e,t,0),l=!J(e)||e!==this._$AH&&e!==M,l&&(this._$AH=e);else{let p=e,h,u;for(e=o[0],h=0;h<o.length-1;h++)u=U(this,p[s+h],t,h),u===M&&(u=this._$AH[h]),l||=!J(u)||u!==this._$AH[h],u===d?e=d:e!==d&&(e+=(u??"")+o[h+1]),this._$AH[h]=u}l&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ye=class extends z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},$e=class extends z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},ke=class extends z{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??d)===M)return;let s=this._$AH,i=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},xe=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}};var cs=_e.litHtmlPolyfillSupport;cs?.(Q,X),(_e.litHtmlVersions??=[]).push("3.3.3");var vt=(a,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let o=t?.renderBefore??null;s._$litPart$=i=new X(e.insertBefore(Z(),o),o,void 0,t??{})}return i._$AI(a),i};var Ee=globalThis,P=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=vt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};P._$litElement$=!0,P.finalized=!0,Ee.litElementHydrateSupport?.({LitElement:P});var ds=Ee.litElementPolyfillSupport;ds?.({LitElement:P});(Ee.litElementVersions??=[]).push("4.2.2");var $t=Symbol.for(""),hs=a=>{if(a?.r===$t)return a?._$litStatic$},$=a=>({_$litStatic$:a,r:$t});var yt=new Map,Ae=a=>(e,...t)=>{let s=t.length,i,o,l=[],p=[],h,u=0,c=!1;for(;u<s;){for(h=e[u];u<s&&(o=t[u],(i=hs(o))!==void 0);)h+=i+e[++u],c=!0;u!==s&&p.push(o),l.push(h),u++}if(u===s&&l.push(e[s]),c){let m=l.join("$$lit$$");(e=yt.get(m))===void 0&&(l.raw=l,yt.set(m,e=l)),t=p}return a(e,...t)},g=Ae(n),js=Ae(gt),Vs=Ae(ft);var kt=(a,e)=>a.connection.subscribeMessage(e,{type:"tasks/subscribe"}),xt=a=>{if(a.type==="sensor")return{type:a.type,entity_id:a.problemSensor.trim()};let e={type:a.type,unit:a.unit,interval:a.interval};return a.type==="fixed"&&(e.time=a.time,a.unit==="weekly"?e.weekdays=a.weekdays:a.unit==="monthly"?e.day=a.day:a.unit==="yearly"&&(e.day=a.day,e.month=a.month)),e},ps=async(a,e)=>{let t=new FormData;t.append("file",e);let s=await a.fetchWithAuth("/api/tasks/upload",{method:"POST",body:t});if(!s.ok)throw new Error(`File upload failed (${s.status})`);return(await s.json()).file_id},_t=async a=>{let e=await a.json().catch(()=>({}));return new Error(e.code||`HTTP ${a.status}`)},wt=async a=>{let e=await a.fetchWithAuth("/api/tasks/archive");if(!e.ok)throw await _t(e);let t=URL.createObjectURL(await e.blob()),s=document.createElement("a");s.href=t,s.download=`tasks-${new Date().toISOString().slice(0,10)}.zip`,s.click(),setTimeout(()=>URL.revokeObjectURL(t),0)},Tt=async(a,e)=>{let t=await a.fetchWithAuth("/api/tasks/archive",{method:"POST",headers:{"Content-Type":"application/zip"},body:e});if(!t.ok)throw await _t(t);return t.json()},Et=async(a,e,t)=>{let s=await Promise.all((t.files?.staged||[]).map(i=>ps(a,i)));return a.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.id}:{},name:t.name.trim(),description:t.description.trim()||null,icon:t.icon.trim()||null,active:t.active,...t.schedule?{schedule:xt(t.schedule)}:e?{schedule:e.schedule}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification:{device_ids:t.notification.deviceIds,persistent:t.notification.persistent,critical:t.notification.critical,route:t.notification.route.trim()||null}}:{},file_ids:s,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},B=async a=>{let[e,t,s]=await Promise.all([a.connection.sendMessagePromise({type:"tasks/list"}),a.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),a.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(s)?s:[]}},ae=async a=>{let e=await a.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(s=>s?.[0]==="mobile_app"))},At=(a,e)=>a.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),oe=(a,e)=>a.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),St=(a,e)=>a.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),Ct=(a,e,t)=>a.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),Dt=(a,e)=>a.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),Pt=(a,e,t)=>a.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),It=(a,e,t)=>a.connection.sendMessagePromise({type:"tasks/task/preview_next_due",schedule:xt(e),...t?{due:t}:{}});var Lt=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1],us=Lt?`?v=${encodeURIComponent(decodeURIComponent(Lt))}`:"",Mt={},Ft="",Nt="",Se=new Map,Ce=new Set,ms=a=>{let e=String(a||"en").toLowerCase().split(/[-_]/)[0];return/^[a-z]{2,3}$/.test(e)?e:"en"},gs=a=>Object.fromEntries(Object.entries(a.common||{}).filter(([e])=>e.startsWith("ui_")).map(([e,t])=>{let s=e.indexOf("_",3);return[`${e.slice(3,s)}.${e.slice(s+1)}`,t]})),Ht=a=>{if(!Se.has(a)){let e=a==="en"?"/tasks_strings.json":`/tasks_translations/${a}.json`;Se.set(a,fetch(`${e}${us}`).then(async t=>t.ok?t.json():{}).then(gs).catch(()=>({})))}return Se.get(a)},r=(a,e={})=>String(Mt[a]??a).replace(/\{(\w+)\}/g,(t,s)=>String(e[s]??`{${s}}`)),E=(a,e)=>r("schedule.with_time",{description:a,time:r("app.at_time",{time:e})}),ne=a=>{if(typeof a!="string"||!a)return;let e=`error.${a}`,t=r(e);return t===e?void 0:t},T=a=>{if(a&&typeof a=="object"){let e=a,t=ne(e.code);if(t)return t;let s=ne(e.message);if(s)return s;if(typeof e.message=="string"&&e.message)return e.message}return a instanceof Error?ne(a.message)||a.message:typeof a=="string"&&a?ne(a)||a:r("error.unknown")};async function De(a){let e=ms(a);Nt=e;let t=await Ht("en"),s=e==="en"?t:await Ht(e);if(Nt===e&&Ft!==e){Ft=e,Mt={...t,...s};for(let i of Ce)i()}}var Ot=a=>(Ce.add(a),()=>Ce.delete(a)),Zs=De(globalThis.navigator?.language);var f=class extends P{unsubscribeLanguage;connectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=Ot(()=>this.requestUpdate()),super.connectedCallback()}disconnectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=void 0,super.disconnectedCallback()}};var v=a=>`ha-tasks-${a}`,Pe=decodeURIComponent(new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1]||"");var Ie=class extends f{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},width:{},open:{type:Boolean}};running=!1;closeValue="";constructor(){super(),this.heading="",this.content=n``,this.actions=[],this.width="medium",this.open=!1}close(e=""){this.closeValue=e,this.open=!1}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){let e=this.actions.at(-1),t=this.actions.slice(0,-1);return n`
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
                ${t.map(s=>n`
                    <ha-button
                      slot="secondaryAction"
                      appearance="plain"
                      variant=${s.destructive?"danger":"neutral"}
                      ?disabled=${this.running}
                      @click=${()=>{this.run(s)}}
                    >
                      ${s.label}
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
    `}},Le=v("dialog");customElements.get(Le)||customElements.define(Le,Ie);var _=({heading:a,content:e,actions:t=[],width:s="medium"})=>{let i=document.createElement(Le);return i.heading=a,i.content=e,i.actions=t,i.width=s,(document.querySelector("home-assistant")?.shadowRoot||document.body).append(i),i.open=!0,new Promise(l=>{i.addEventListener("tasks-dialog-closed",p=>{i.remove(),l(p.detail)},{once:!0})})};var Fe=class extends f{static properties={heading:{},warning:{type:Boolean},open:{type:Boolean}};static styles=b`
    .expandable {
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .heading {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      font: inherit;
      font-weight: 500;
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
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .expandable.open .content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .content-inner {
      min-height: 0;
      overflow: hidden;
    }

    .content-padding {
      padding: 0 16px 16px;
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
        <div class="content">
          <div class="content-inner">
            <div class="content-padding"><slot></slot></div>
          </div>
        </div>
      </div>
    `}},I=v("expandable");customElements.get(I)||customElements.define(I,Fe);var le=(a,e,t)=>r(a===1?e:t,{count:a}),Rt=$(I),Ne=class extends f{static properties={hass:{attribute:!1},busy:{state:!0},status:{state:!0},warning:{state:!0},failed:{state:!0}};static styles=b`
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
      padding-inline-start: 24px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    button {
      min-height: 40px;
      padding: 0 16px;
      color: var(--primary-color);
      background: transparent;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
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
  `;constructor(){super(),this.busy=!1,this.warning=!1,this.failed=!1}async exportArchive(){if(!(!this.hass||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[r("settings.exporting")];try{await wt(this.hass),this.status=[r("settings.export_complete")]}catch(e){this.failed=!0,this.status=[r("common.error",{message:T(e)})]}finally{this.busy=!1}}}reportLines(e){let t=[];t.push(le(e.attachments_imported||0,"settings.progress_attachment_one","settings.progress_attachment_many"),le(e.history_entries_imported||0,"settings.progress_history_one","settings.progress_history_many"),le(e.tasks_imported||0,"settings.progress_task_one","settings.progress_task_many"));let s=e.tasks_skipped||[];return s.length&&t.push(r(s.length===1?"settings.progress_skipped_one":"settings.progress_skipped_many",{count:s.length,names:s.join(", ")})),e.attachments_skipped&&t.push(le(e.attachments_skipped,"settings.progress_attachment_skipped_one","settings.progress_attachment_skipped_many")),this.warning=!!(s.length||e.attachments_skipped),t.push(r(this.warning?"settings.import_complete_warning":"settings.import_complete")),t}async importArchive(e){if(!(!this.hass||!e||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[r("settings.progress_load"),r("settings.progress_unpack")];try{this.status=this.reportLines(await Tt(this.hass,e))}catch(t){this.failed=!0,this.status=[r("settings.import_failed",{message:T(t)})]}finally{this.busy=!1}}}render(){let e=this.failed?"error":this.warning?"status warning":"status";return g`
      <${Rt} heading=${r("settings.import_export")} open>
        <div class="backup-content">
          <p>${r("settings.archive_hint")}</p>
          ${this.status?n`<ul class=${e} role="status" aria-live="polite">
                ${this.status.map(t=>n`<li>${t}</li>`)}
              </ul>`:d}
          <input
            id="archive"
            type="file"
            accept=".zip,application/zip"
            ?disabled=${this.busy}
            @change=${t=>{let s=t.currentTarget;this.importArchive(s.files?.[0]),s.value=""}}
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
      </${Rt}>
      ${Pe?n`<p class="version">${r("app.version",{version:Pe})}</p>`:d}
    `}},He=v("archive");customElements.get(He)||customElements.define(He,Ne);var Ut=a=>{let e=document.createElement(He);return e.hass=a,_({heading:r("settings.title"),content:e})};var Y=(a,e)=>{let t=e.toLowerCase(),s=a.split(".").pop()?.toLowerCase();return t.startsWith("image/")?"mdi:file-image-outline":t==="application/pdf"||s==="pdf"?"mdi:file-pdf-box":t.startsWith("text/")||["txt","md","log"].includes(s||"")?"mdi:file-document-outline":t.startsWith("audio/")?"mdi:file-music-outline":t.startsWith("video/")?"mdi:file-video-outline":t.includes("zip")||t.includes("compressed")||["zip","rar","7z","gz"].includes(s||"")?"mdi:folder-zip-outline":t.includes("spreadsheet")||t.includes("excel")||["csv","xls","xlsx","ods"].includes(s||"")?"mdi:file-table-outline":t.includes("word")||["doc","docx","odt","rtf"].includes(s||"")?"mdi:file-word-outline":"mdi:file-outline"};var O=(a,e)=>{let t=a?.states?.[e.entity_id];return t?t.state==="unavailable"||t.state==="unknown"?t.state:"available":"missing"};var fs=b`
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
    padding: 9px 12px;
    color: var(--primary-text-color);
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    font: inherit;
    font-size: 14px;
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

`,j=class extends f{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=fs;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?n`<span class="error" role="alert">${this.error}</span>`:null}},Me=class extends j{static properties={...j.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return n`
      <label>
        <span>${this.label}</span>
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
    `}},Oe=class extends j{static properties={...j.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return n`
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
    `}},V=v("text-field"),ce=v("select-field");customElements.get(V)||customElements.define(V,Me);customElements.get(ce)||customElements.define(ce,Oe);var L=$(V),y=$(ce),A=$(I),k=$("ha-form"),zt=()=>[{label:r("task.sliding"),value:"sliding"},{label:r("task.fixed"),value:"fixed"},{label:r("task.problem_sensor"),value:"sensor"}],bs=()=>[{label:r("task.daily"),value:"daily"},{label:r("task.weekly"),value:"weekly"},{label:r("task.monthly"),value:"monthly"},{label:r("task.yearly"),value:"yearly"}],Bt=()=>[...Array.from({length:31},(a,e)=>({label:String(e+1),value:String(e+1)})),{label:r("task.last_day"),value:"last"}],vs=(a,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:a.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(s=>s.type!=="literal").map(s=>[s.type,s.value]))},Re=class extends f{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0},fileDropActive:{state:!0}};static styles=b`
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
      border-top: 1px solid var(--divider-color);
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
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .record {
      display: grid;
      min-width: 0;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
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
      border-radius: 20px;
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
      border: 2px dashed var(--divider-color);
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1,this.fileDropActive=!1}configure(e,t,s=[]){let i=vs(e,t.due),o=Number(i.year),l=Number(i.month),p=Number(i.day),h=(new Date(Date.UTC(o,l-1,p)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.name,this.description=t.description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification.device_ids||[]).filter(c=>typeof c=="string"))],this.notificationPersistent=!!t.notification.persistent,this.notificationCritical=!!t.notification.critical,this.notificationRoute=t.notification.route||"",this.attachments=[...t.attachments],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule.type,t.schedule.type==="sensor"?(this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[h],this.scheduleDay=p,this.scheduleMonth=l,this.scheduleTime=`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor=t.schedule.entity_id):(this.scheduleUnit=t.schedule.unit,this.scheduleInterval=t.schedule.interval,this.scheduleWeekdays=t.schedule.type==="fixed"&&t.schedule.weekdays?.length?[...t.schedule.weekdays]:[h],this.scheduleDay=t.schedule.type==="fixed"&&t.schedule.day?t.schedule.day:p,this.scheduleMonth=t.schedule.type==="fixed"&&t.schedule.month?t.schedule.month:l,this.scheduleTime=t.schedule.type==="fixed"&&t.schedule.time||`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor="");let u=!t.id;this.scheduleDirty=u,this.assignmentDirty=u,this.notificationDirty=u,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await B(e);this.users=[...t.users].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((s,i)=>(s.name||s.id).localeCompare(i.name||i.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(s=>s.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(s=>this.labels.some(i=>i.label_id===s)),this.nfcTagId=this.tags.some(s=>s.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError=r("app.assignment_load_error")}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await ae(e)).sort((t,s)=>this.deviceName(t).localeCompare(this.deviceName(s),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(s=>s.id===t))}catch{this.notificationError=r("app.notification_load_error")}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t?.id)){this.historyLoading=!0,this.historyError="";try{let s=await oe(e,t.id);this.history=Array.isArray(s.history)?s.history:[]}catch{this.historyError=r("app.history_load_error")}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let s=this.problemSensor.trim();return s.startsWith("binary_sensor.")||(t=r("app.select_binary_sensor")),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:s}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t=r("app.interval_min"):this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t=r("app.select_valid_time"):this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t=r("error.select_at_least_one_weekday")),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,s=this.scheduleDetails(!1),i=++this.previewRequest;if(!e||!t||!s||s.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let o=await It(e,s,this.scheduleDirty?void 0:t.due||void 0);i===this.previewRequest&&(this.preview=o.dues)}catch{i===this.previewRequest&&(this.preview=[],this.previewError=r("app.preview_load_error"))}finally{i===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}scheduleText(){if(this.scheduleType==="sensor"){let o=this.hass?.states?.[this.problemSensor]?.attributes?.friendly_name||this.problemSensor;return o?`${r("schedule.problem_sensor_description")} (${o})`:r("schedule.problem_sensor_description")}let e=Math.max(1,Number(this.scheduleInterval)||1),t={daily:"day",weekly:"week",monthly:"month",yearly:"year"},s=r(`schedule.period_${t[this.scheduleUnit]}`),i=r(`schedule.period_${t[this.scheduleUnit]}s`);if(this.scheduleType==="sliding")return r(e===1?"schedule.after_completion_one":"schedule.after_completion_many",{schedule_interval:e,period:e===1?s:i});if(this.scheduleUnit==="weekly"){let o=Array.from({length:7},(u,c)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,c+1)))),l=this.scheduleWeekdays.map(u=>o[u]).filter(Boolean),p=l.length>1?`${l.slice(0,-1).join(", ")} ${r("schedule.and")} ${l.at(-1)}`:l[0]||"",h=r(e===1?"schedule.weekly_one":"schedule.weekly_many",{schedule_interval:e,days:p?` ${r("schedule.on_days",{days:p})}`:""});return E(h,this.scheduleTime)}if(this.scheduleUnit==="monthly"){let o=this.scheduleDay==="last"?r("schedule.on_last_day"):r("schedule.on_day_number",{day:Number(this.scheduleDay||1)}),l=r(e===1?"schedule.monthly_one":"schedule.monthly_many",{schedule_interval:e,day:o});return E(l,this.scheduleTime)}if(this.scheduleUnit==="yearly"){let o=new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,this.scheduleMonth-1,1)),l=this.scheduleDay==="last"?r("schedule.on_last_day_of_month",{month:o}):r("schedule.on_day_of_month",{day:Number(this.scheduleDay||1),month:o}),p=r(e===1?"schedule.yearly_one":"schedule.yearly_many",{schedule_interval:e,day:l});return E(p,this.scheduleTime)}return E(r(e===1?"schedule.fixed_one":"schedule.fixed_many",{schedule_interval:e,period:e===1?s:i}),this.scheduleTime)}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),s=this.notificationRoute.trim();if(e||(this.nameError=r("app.name_required")),s&&(!s.startsWith("/")||s.startsWith("//"))&&(this.notificationRouteError=r("app.route_invalid")),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await Et(this.hass,this.task.id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:s}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(i){return this.saveError=T(i),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return d;let e=d;return this.scheduleUnit==="weekly"?e=n`
        <p class="selector-label">${r("task.schedule_weekdays")}</p>
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
      `:this.scheduleUnit==="monthly"?e=g`
        <${y}
          label=${r("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${Bt()}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${y}>
      `:this.scheduleUnit==="yearly"&&(e=g`
        <div class="row">
          <${y}
            label=${r("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${Bt()}
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
      <${L}
        label=${r("task.time")}
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${L}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return d;if(this.previewLoading&&!this.preview.length)return n`<p class="hint" aria-live="polite">
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
          `:d}
    `}renderPlanning(){return this.scheduleType==="sensor"?g`
        <div class="planning">
          <${y}
            label=${r("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${zt()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${y}>
          <div
            class="selector-field"
            role="group"
            aria-label=${r("task.problem_sensor")}
          >
            <span class="selector-label">${r("task.problem_sensor")}</span>
            <${k}
              .hass=${this.hass}
              .data=${{problemSensor:this.problemSensor}}
              .schema=${[{name:"problemSensor",selector:{entity:{filter:{domain:"binary_sensor"}}}}]}
              .computeLabel=${()=>""}
              .disabled=${this.saving}
              @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail.value.problemSensor||""})}
            ></${k}>
          </div>
          ${this.scheduleError?n`<p class="error" role="alert">${this.scheduleError}</p>`:d}
          <p class="hint">
            ${r("schedule.problem_sensor_description")}
          </p>
        </div>
      `:g`
      <div class="planning">
        <${y}
          label=${r("task.recurrence_calculation")}
          .value=${this.scheduleType}
          .options=${zt()}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${y}>
        <div class="row">
          <${L}
            label=${r("app.every")}
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${L}>
          <${y}
            label=${r("app.unit")}
            .value=${this.scheduleUnit}
            .options=${bs()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${y}>
        </div>
        ${this.renderFixedOptions()}
        <p class="hint">${this.scheduleText()}</p>
        ${this.scheduleError?n`<p class="error" role="alert">${this.scheduleError}</p>`:d}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return n`<p class="hint" aria-live="polite">
        ${r("app.loading_assignments")}
      </p>`;if(this.assignmentError)return n`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:r("task.unassigned"),value:""},...this.users.map(s=>({label:s.name,value:s.id}))],t=[{label:r("task.no_nfc_tag"),value:""},...this.tags.map(s=>({label:s.name||s.id,value:s.id}))];return g`
      <div class="planning">
        <${y}
          label=${r("task.user")}
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.assigneeId=s.detail})}
        ></${y}>
        <${y}
          label=${r("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.nfcTagId=s.detail})}
        ></${y}>
        <div
          class="selector-field"
          role="group"
          aria-label=${r("task.icon")}
        >
          <span class="selector-label">${r("task.icon")}</span>
          <${k}
            .hass=${this.hass}
            .data=${{icon:this.icon}}
            .schema=${[{name:"icon",selector:{icon:{}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${s=>{this.icon=s.detail.value.icon||""}}
          ></${k}>
        </div>
        <div
          class="selector-field"
          role="group"
          aria-label=${r("task.labels")}
        >
          <span class="selector-label">${r("task.labels")}</span>
          <${k}
            .hass=${this.hass}
            .data=${{labels:this.labelIds}}
            .schema=${[{name:"labels",selector:{label:{multiple:!0}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${s=>this.assignmentChanged(()=>{this.labelIds=s.detail.value.labels||[]})}
          ></${k}>
        </div>
      </div>
    `}renderNotification(){return this.notificationLoading?n`<p class="hint" aria-live="polite">
        ${r("app.loading_notifications")}
      </p>`:this.notificationError?n`<p class="error" role="alert">${this.notificationError}</p>`:g`
      <div class="planning">
        <div class="selector-field" data-native-picker-spacing>
          <span class="selector-label">${r("app.mobile_devices")}</span>
          <${k}
            .hass=${this.hass}
            .data=${{devices:this.notificationDeviceIds}}
            .schema=${[{name:"devices",selector:{device:{multiple:!0,filter:{integration:"mobile_app"}}}}]}
            .computeLabel=${()=>""}
            .disabled=${this.saving}
            @value-changed=${e=>this.notificationChanged(()=>{this.notificationDeviceIds=e.detail.value.devices||[]})}
          ></${k}>
        </div>
        <div class="selector-field">
          <span class="selector-label">${r("app.navigation_target")}</span>
          <${k}
            .hass=${this.hass}
            .data=${{route:this.notificationRoute}}
            .schema=${[{name:"route",selector:{navigation:null}}]}
            .computeLabel=${()=>r("app.navigation_target")}
            .disabled=${this.saving}
            @value-changed=${e=>this.notificationChanged(()=>{this.notificationRoute=e.detail.value.route||""})}
          ></${k}>
        </div>
        ${this.notificationRouteError?n`<p class="error" role="alert">
              ${this.notificationRouteError}
            </p>`:d}
        <p class="hint">${r("app.navigation_hint")}</p>
        <${k}
          .hass=${this.hass}
          .data=${{critical:this.notificationCritical}}
          .schema=${[{name:"critical",selector:{boolean:{}}}]}
          .computeLabel=${()=>r("task.notification_critical")}
          .computeHelper=${()=>r("task.notification_critical_description")}
          .disabled=${this.saving}
          @value-changed=${e=>this.notificationChanged(()=>{this.notificationCritical=e.detail.value.critical??!1})}
        ></${k}>
        <div class="section-divider" role="separator"></div>
        <${k}
          .hass=${this.hass}
          .data=${{persistent:this.notificationPersistent}}
          .schema=${[{name:"persistent",selector:{boolean:{}}}]}
          .computeLabel=${()=>r("task.notification_persistent")}
          .computeHelper=${()=>r("task.notification_persistent_description")}
          .disabled=${this.saving}
          @value-changed=${e=>this.notificationChanged(()=>{this.notificationPersistent=e.detail.value.persistent??!1})}
        ></${k}>
      </div>
    `}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}toggleId(e,t){return t.includes(e)?t.filter(s=>s!==e):[...t,e]}stageFiles(e){this.saving||(this.stagedFiles=[...this.stagedFiles,...Array.from(e)])}renderAttachments(){return n`
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
                          >${this.formatSize(e.size)}</span
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
                        .icon=${Y(e.name,e.type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name">${e.name}</span>
                        <span class="record-detail"
                          >${this.formatSize(e.size)} ·
                          ${r("app.new_file")}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${r("app.remove_new_file",{name:e.name})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((s,i)=>i!==t)}}
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
    `}renderHistory(){return this.historyLoading?n`<p class="hint" aria-live="polite">
        ${r("app.loading_history")}
      </p>`:this.historyError?n`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.id),s=e.notes==="tasks.history.completed_via_nfc"?r("history.completed_via_nfc"):e.notes||r("app.no_notes");return n`
            <li class="record ${t?"pending":""}">
              <ha-icon
                class="record-icon"
                icon="mdi:check-circle-outline"
              ></ha-icon>
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.completed_at)} ·
                  ${e.user_name||r("common.system")}</span
                >
                <span class="record-detail">${s}</span>
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
    `:n`<p class="hint">${r("task.no_history")}.</p>`}planningWarning(){return this.scheduleError?!0:this.scheduleType!=="sensor"||!this.problemSensor.startsWith("binary_sensor.")?!1:O(this.hass,{type:"sensor",entity_id:this.problemSensor})!=="available"}render(){return g`
      <form @submit=${e=>e.preventDefault()}>
        <${L}
          label=${r("task.name")}
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${L}>
        <${L}
          label=${r("task.optional_description")}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${L}>
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
            `:d}
        ${this.saveError?n`<p class="error" role="alert">${this.saveError}</p>`:d}
      </form>
    `}},Ue=v("task-form");customElements.get(Ue)||customElements.define(Ue,Re);var ze=async(a,e,t=[])=>{let s=e||{id:"",name:"",active:!0,schedule:{type:"sliding",unit:"monthly",interval:1},notification:{device_ids:[],persistent:!1,critical:!1,route:null},due:null,completions:[],attachments:[]},i=document.createElement(Ue);return i.configure(a,s,t),await _({heading:e?r("task.edit"):r("task.new"),content:i,actions:[{label:r("common.save"),value:"save",run:()=>i.save()}]})==="save"};var Be=class extends f{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=b`
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
      border-radius: 50%;
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
      max-width: min(280px, calc(100vw - 16px));
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      overflow: hidden;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
      box-shadow: var(--ha-box-shadow-m, var(--ha-card-box-shadow));
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .item {
      display: flex;
      width: 100%;
      min-height: 40px;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
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
      border-top: 1px solid var(--divider-color);
    }

    .destructive ha-icon {
      color: var(--error-color);
    }
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=window.visualViewport,l=o?.offsetLeft||0,p=o?.offsetTop||0,h=l+(o?.width||window.innerWidth),u=p+(o?.height||window.innerHeight),c=8,m=4,x=Math.min(Math.max(l+c,s.right-i.width),h-i.width-c),w=s.bottom+m,R=w+i.height<=u-c?w:Math.max(p+c,s.top-i.height-m);t.style.left=`${x}px`,t.style.top=`${R}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return n`
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
    `}},de=v("action-menu");customElements.get(de)||customElements.define(de,Be);var jt="tasks-table-state-v2",Vt="tasks-table-session-v1",ys=[{value:"due",label:"task.due"},{value:"assignee",label:"table.assignee"},{value:"nfc",label:"task.nfc_tag_id"},{value:"files",label:"task.files"},{value:"labels",label:"task.labels"},{value:"notifications",label:"table.notifications"},{value:"trigger",label:"table.recurrence"},{value:"status",label:"app.status"}],ee=Object.fromEntries(ys.map(a=>[a.value,a.label])),$s={assignee:"task.assignment",labels:"task.labels",notifications:"table.notifications",trigger:"table.recurrence",status:"app.status",due:"task.due"},je={due:!0,assignee:!0,nfc:!0,files:!0,labels:!1,notifications:!1,trigger:!1,status:!1},he=()=>({assignee:[],labels:[],notifications:[],trigger:[],status:[],due:[]}),Ve=Object.keys(he()),ks=[{value:"fixed",label:"task.fixed"},{value:"sliding",label:"task.sliding"},{value:"sensor",label:"task.problem_sensor"}],xs=[{value:"active",label:"app.active"},{value:"paused",label:"app.paused"}],_s=[{value:"overdue",label:"table.due_overdue"},{value:"today",label:"table.due_today"},{value:"tomorrow",label:"table.due_tomorrow"},{value:"next_7_days",label:"table.due_next_7_days"},{value:"next_30_days",label:"table.due_next_30_days"}],Ke=(a,e)=>{let t=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}).formatToParts(new Date(a)),s=i=>t.find(o=>o.type===i)?.value||"";return`${s("year")}-${s("month")}-${s("day")}`},Kt=(a,e)=>{let[t,s,i]=Ke(a,e).split("-").map(Number);return Math.floor(Date.UTC(t,s-1,i)/864e5)},Wt=(a,e)=>{try{let t=globalThis[a],s=JSON.parse(t?.getItem(e)||"{}");return s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{return{}}},qt=$(de),ws=a=>[{label:r("menu.edit"),value:"edit",icon:"mdi:pencil-outline"},{label:a.active===!1?r("app.resume"):r("app.pause"),value:"active",icon:a.active===!1?"mdi:play-circle-outline":"mdi:pause-circle-outline"},{label:r("common.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Ts=()=>[{label:r("bulk.complete"),value:"complete",icon:"mdi:check-circle-outline"},{label:r("app.pause"),value:"pause",icon:"mdi:pause-circle-outline"},{label:r("app.resume"),value:"resume",icon:"mdi:play-circle-outline"},{label:r("bulk.assign_person"),value:"assign",icon:"mdi:account-outline"},{label:r("app.add_label"),value:"add-label",icon:"mdi:tag-plus-outline"},{label:r("app.remove_label"),value:"remove-label",icon:"mdi:tag-minus-outline"},{label:r("app.add_notification"),value:"add-notification",icon:"mdi:bell-plus-outline"},{label:r("app.remove_notification"),value:"remove-notification",icon:"mdi:bell-minus-outline"},{label:r("bulk.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],We=class extends f{static properties={hass:{attribute:!1},tasks:{attribute:!1},compact:{type:Boolean,reflect:!0},showBulkSelection:{attribute:!1},showIcon:{attribute:!1},showAddTask:{attribute:!1},showHeader:{attribute:!1},showFilters:{attribute:!1},configuredFilters:{attribute:!1},showColumns:{attribute:!1},configuredColumns:{attribute:!1},now:{attribute:!1},showSearch:{attribute:!1},showActionMenu:{attribute:!1},search:{state:!0},filters:{state:!0},openFilterGroups:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},openBulkPicker:{state:!0},openToolbarPanel:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=b`
    :host {
      display: block;
      margin-top: 20px;
    }

    .toolbar {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .selection-toolbar {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      gap: 8px;
    }

    .bulk-bar {
      display: grid;
      gap: 8px;
      width: 280px;
    }

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
      border-top: 1px solid var(--divider-color);
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

    .bulk-action-picker-trigger .picker-chevron {
      margin-inline-start: auto;
      transition: transform 200ms ease;
    }

    .bulk-action-picker.open .picker-chevron {
      transform: rotate(180deg);
    }

    .bulk-action-content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .bulk-action-picker.open .bulk-action-content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .bulk-action-list {
      display: grid;
      min-height: 0;
      max-height: min(336px, 42dvh);
      overflow-y: auto;
      border-top: 1px solid var(--divider-color);
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
      border-top: 1px solid var(--divider-color);
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
      border: 1px solid var(--divider-color);
      border-radius: 8px;
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
      width: min(560px, calc(100vw - 48px));
      box-sizing: border-box;
      padding: 16px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
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
      border: 1px solid var(--divider-color);
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
      margin-inline-start: auto;
      color: var(--secondary-text-color);
      transition: transform 200ms ease;
    }

    .filter-category-count {
      margin-inline-start: var(--ha-space-2);
      color: var(--secondary-text-color);
      font-weight: var(--ha-font-weight-normal);
    }

    .filter-category.open .filter-chevron {
      transform: rotate(180deg);
    }

    .filter-category-content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .filter-category.open .filter-category-content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .filter-category fieldset {
      min-height: 0;
      overflow: hidden;
      display: grid;
      box-sizing: border-box;
      padding: 0;
      border-top: 1px solid var(--divider-color);
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
      border: 1px solid var(--divider-color);
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
      border-top: 1px solid var(--divider-color);
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
      border: 1px solid var(--divider-color);
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
      font-weight: 500;
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

    .inactive .task-name {
      color: var(--secondary-text-color);
    }

    .inactive td {
      color: var(--secondary-text-color);
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
      padding-right: 4px;
      padding-left: 12px;
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
      position: relative;
      width: 48px;
      padding-top: 0;
      padding-right: 8px;
      padding-bottom: 0;
      padding-left: 12px;
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
  `;registryConnection;closePanels=e=>{let t=e.composedPath();for(let s of this.renderRoot.querySelectorAll("details[open]"))t.includes(s)||s.removeAttribute("open");t.some(s=>s instanceof HTMLElement&&s.classList.contains("toolbar-popover"))||(this.openToolbarPanel="")};constructor(){super();let e=Wt("localStorage",jt),t=Wt("sessionStorage",Vt);this.tasks=[],this.compact=!1,this.showBulkSelection=!0,this.showIcon=!0,this.showAddTask=!1,this.showHeader=!0,this.showFilters=!0,this.configuredFilters=void 0,this.showColumns=!0,this.configuredColumns=void 0,this.now=void 0,this.showSearch=!0,this.showActionMenu=!0,this.search=typeof t.search=="string"?t.search:"";let s=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys(he()).map(o=>[o,Array.isArray(s[o])?s[o].filter(l=>typeof l=="string"):[]])),this.openFilterGroups=[];let i=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(je).map(o=>[o,typeof i[o]=="boolean"?i[o]:je[o]])),this.users=[],this.labels=[],this.tags=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.openBulkPicker="",this.openToolbarPanel="",this.bulkBusy=!1,this.bulkError=""}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.closePanels)}disconnectedCallback(){document.removeEventListener("click",this.closePanels),super.disconnectedCallback()}willUpdate(e){if(e.has("configuredColumns")&&this.configuredColumns){let t=new Set(this.configuredColumns);this.columns=Object.fromEntries(Object.keys(ee).map(s=>[s,t.has(s)]))}}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[s,i]=await Promise.allSettled([B(e),ae(e)]);this.registryConnection===t&&(s.status==="fulfilled"&&(this.users=s.value.users,this.labels=s.value.labels,this.tags=s.value.tags),i.status==="fulfilled"&&(this.devices=i.value),(s.status==="rejected"||i.status==="rejected")&&(this.registryError=r("app.registry_load_error")))}trigger(e){return e.schedule.type==="sensor"?r("task.problem_sensor"):e.schedule.type==="fixed"?r("task.fixed"):r("task.sliding")}status(e){return e.active===!1?r("app.paused"):r("app.active")}problemSensorStatus(e){return e.schedule.type==="sensor"?O(this.hass,e.schedule):void 0}problemSensorWarning(e){let t=this.problemSensorStatus(e);if(!t||t==="available")return d;let s=r(`problem.sensor_${t}`,{entity_id:e.schedule.type==="sensor"?e.schedule.entity_id:""});return n`
      <span class="sensor-warning" title=${s} aria-label=${s}>
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </span>
    `}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||r("task.unassigned")}nfcTag(e){return e.nfc_tag_id?this.tags.find(t=>t.id===e.nfc_tag_id)?.name||e.nfc_tag_id:"\u2014"}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(s=>t.has(s.label_id)).sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification.device_ids||[]);return this.devices.filter(s=>t.has(s.id)).sort((s,i)=>this.deviceName(s).localeCompare(this.deviceName(i),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification.persistent?[r("task.notification_persistent")]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="due"){if(!e.due)return[];let s=this.hass?.config?.time_zone,i=Kt(e.due,s)-Kt(this.now||new Date,s);return[...i<0?["overdue"]:[],...i===0?["today"]:[],...i===1?["tomorrow"]:[],...i>=0&&i<7?["next_7_days"]:[],...i>=0&&i<30?["next_30_days"]:[]]}if(t==="assignee")return[this.users.find(i=>i.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let s=this.taskLabels(e).map(i=>i.label_id);return s.length?s:["__none__"]}if(t==="notifications"){let s=[...e.notification.persistent?["panel"]:[],...this.notificationDevices(e).map(i=>i.id)];return s.length?s:["__none__"]}return t==="status"?[e.active===!1?"paused":"active"]:[e.schedule.type]}filterLabel(e,t){if(t==="__none__")return e==="assignee"?r("task.unassigned"):e==="labels"?r("task.no_labels"):r("app.no_notifications");if(e==="assignee")return this.users.find(i=>i.id===t)?.name||t;if(e==="labels")return this.labels.find(i=>i.label_id===t)?.name||t;if(e==="notifications")return t==="panel"?r("task.notification_persistent"):this.deviceName(this.devices.find(i=>i.id===t));if(e==="status"){let i=xs.find(o=>o.value===t);return i?r(i.label):t}let s=ks.find(i=>i.value===t);return s?r(s.label):t}filterOptions(e){return e==="due"?_s.map(s=>({value:s.value,label:r(s.label)})):[...new Set(this.tasks.flatMap(s=>this.filterValues(s,e)))].map(s=>({value:s,label:this.filterLabel(e,s)})).sort((s,i)=>s.label.localeCompare(i.label,this.hass?.locale?.language))}activeFilters(){return this.configuredFilters?{...he(),...this.configuredFilters}:this.filters}matchesFilters(e,t){return Ve.every(s=>{let i=t[s];return!i.length||this.filterValues(e,s).some(o=>i.includes(o))})}dueValue(e){if(e.active===!1||!e.due)return;let t=Date.parse(e.due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);if(t===void 0){let s=this.problemSensorStatus(e);return s&&s!=="available"?r(`problem.sensor_${s}_short`):e.active!==!1&&e.schedule.type==="sensor"&&!e.due?r("table.waiting"):"\u2014"}return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}dueStatus(e){if(e.active===!1||this.dueValue(e)===void 0)return"";let t=this.hass?.config?.time_zone,s=Ke(e.due,t),i=Ke(new Date,t);return s<i?"due-overdue":s===i?"due-today":""}rowClass(e){return e.active===!1?"inactive":this.dueStatus(e)}sortGroup(e){return e.active===!1?2:e.schedule.type==="sensor"&&!e.due?1:0}compareDue(e,t){let s=this.sortGroup(e)-this.sortGroup(t);if(s)return s;let i=this.dueValue(e),o=this.dueValue(t);if(i===void 0||o===void 0){if(i!==o)return i===void 0?1:-1}else if(i!==o)return i-o;return e.name.localeCompare(t.name,this.hass?.locale?.language)}visibleTasks(){let e=this.showSearch?this.search.trim().toLocaleLowerCase(this.hass?.locale?.language):"",t=this.activeFilters();return this.tasks.filter(s=>this.matchesFilters(s,t)&&(!e||[s.name,s.description,this.assignee(s),this.nfcTag(s),this.taskLabels(s).map(i=>i.name).join(" "),this.notificationDevices(s).map(i=>this.deviceName(i)).join(" "),this.trigger(s),this.status(s)].some(i=>i?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((s,i)=>this.compareDue(s,i))}toggleFilter(e,t,s){let i=this.filters[e];this.filters={...this.filters,[e]:s?[...new Set([...i,t])]:i.filter(o=>o!==t)},this.retainVisibleSelection(),this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}resetColumns(){this.columns=this.configuredColumns?Object.fromEntries(Object.keys(ee).map(e=>[e,this.configuredColumns.includes(e)])):{...je},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(jt,JSON.stringify({columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(Vt,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="files"?String(e.attachments.length):t==="nfc"?this.nfcTag(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}columnValue(e,t){let s=this.columnText(e,t);return t==="due"&&s!=="\u2014"&&this.hass&&e.due?n`
        <ha-relative-time
          .hass=${this.hass}
          .datetime=${e.due}
          capitalize
          title=${s}
        ></ha-relative-time>
      `:t==="status"?n`<span class="status">${s}</span>`:s}mobileDetails(e){return this.visibleColumnKeys().filter(s=>this.columnText(e,s)!=="\u2014").map((s,i)=>n`
        ${i?n`<span aria-hidden="true"> · </span>`:d}
        ${this.columnValue(e,s)}
      `)}visibleColumnKeys(){return(this.configuredColumns??Object.keys(this.columns)).filter(e=>this.columns[e])}visibleColumnCount(){return this.visibleColumnKeys().length+1+Number(this.showIcon)+Number(this.showBulkSelection)+Number(this.showActionMenu)}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.id))}visibleSelectedTasks(){let e=new Set(this.selectedIds);return this.visibleTasks().filter(t=>e.has(t.id))}retainVisibleSelection(){let e=new Set(this.visibleTasks().map(t=>t.id));this.selectedIds=this.selectedIds.filter(t=>e.has(t))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(s=>s!==e)}toggleVisible(e,t){let s=new Set(this.selectedIds);for(let i of e)t?s.add(i.id):s.delete(i.id);this.selectedIds=[...s]}bulkTargets(){return this.bulkAction==="assign"?[{value:"__none__",label:r("task.unassigned")},...this.users.map(e=>({value:e.id,label:e.name}))]:this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:r("task.notification_persistent")},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkActionDestructive(){return["delete","remove-label","remove-notification"].includes(this.bulkAction)}bulkActionLabel(){return this.bulkAction==="complete"?r("bulk.complete"):this.bulkAction==="pause"?r("app.pause"):this.bulkAction==="resume"?r("app.resume"):this.bulkAction==="assign"?r("app.assign"):this.bulkAction==="add-label"||this.bulkAction==="add-notification"?r("app.add"):this.bulkAction==="remove-label"||this.bulkAction==="remove-notification"?r("common.remove"):this.bulkAction==="delete"?r("common.delete"):r("app.apply")}bulkTargetLabel(){return this.bulkAction==="assign"?r("app.choose_person"):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?r("app.choose_label"):r("app.choose_notification")}bulkTargetIcon(){return this.bulkAction==="assign"?"mdi:account-outline":this.bulkAction==="add-label"||this.bulkAction==="remove-label"?"mdi:tag-outline":"mdi:bell-outline"}bulkOperations(){return this.visibleSelectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",id:e.id,notes:null};if(this.bulkAction==="delete")return{action:"delete",id:e.id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget==="__none__"?null:this.bulkTarget};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let s=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}else{let s=e.notification.device_ids||[];this.bulkTarget==="panel"?t={notification:{...e.notification,persistent:this.bulkAction==="add-notification"}}:t={notification:{...e.notification,device_ids:this.bulkAction==="remove-notification"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}}return{action:"update",id:e.id,changes:t}})}renderBulkPicker(e,t,s,i,o,l){let p=t.find(u=>u.value===s),h=this.openBulkPicker===e;return n`
      <div class=${h?"bulk-action-picker open":"bulk-action-picker"}>
        <button
          class="bulk-action-picker-trigger"
          type="button"
          aria-expanded=${h?"true":"false"}
          @click=${()=>{this.openBulkPicker=h?"":e}}
        >
          <ha-icon .icon=${p?.icon||o}></ha-icon>
          <span>${p?.label||i}</span>
          <ha-icon
            class="picker-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="bulk-action-content">
          <div class="bulk-action-list">
            ${t.map(u=>n`
                <button
                  class=${["bulk-action",s===u.value?"selected":"",u.destructive?"destructive":""].filter(Boolean).join(" ")}
                  type="button"
                  @click=${()=>{l(u.value),this.openBulkPicker=""}}
                >
                  ${u.icon?n`<ha-icon .icon=${u.icon}></ha-icon>`:d}
                  <span>${u.label}</span>
                </button>
              `)}
          </div>
        </div>
      </div>
    `}renderBulkMenu(e){let t=this.bulkTargets(),s=Ts(),i=this.bulkTargetIcon(),o=t.map(l=>({...l,icon:i}));return n`
      <details
        class="bulk-menu"
        @toggle=${l=>{l.currentTarget.open||(this.openBulkPicker="")}}
      >
        <summary>${r("bulk.actions")} (${e.length})</summary>
        <div class="popover-panel">
          <div class="bulk-bar">
            ${this.renderBulkPicker("action",s,this.bulkAction,r("app.choose_action"),"mdi:gesture-tap-button",l=>{this.bulkAction=l,this.bulkTarget="",this.bulkError=""})}
            ${t.length?this.renderBulkPicker("target",o,this.bulkTarget,this.bulkTargetLabel(),i,l=>{this.bulkTarget=l}):d}
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
                </p>`:d}
          </div>
        </div>
      </details>
    `}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await _({heading:t?r("bulk.delete_title"):r("bulk.complete_title"),content:n`<p>
          ${t?r("bulk.delete_confirm",{count:e.length}):r("bulk.complete_confirm",{count:e.length})}
        </p>`,actions:[{label:r("common.cancel"),value:"cancel"},{label:t?r("common.delete"):r("app.complete"),value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await At(this.hass,e);let t=new Set(e.map(s=>s.id));this.selectedIds=this.selectedIds.filter(s=>!t.has(s)),this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=T(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return this.showFilters?Ve.reduce((e,t)=>e+this.filters[t].length,0):0}filterGroup(e,t){let s=this.filters[t].length,i=this.openFilterGroups.includes(t);return n`
      <div class=${i?"filter-category open":"filter-category"}>
        <button
          class="filter-category-heading"
          type="button"
          aria-expanded=${i?"true":"false"}
          @click=${()=>{this.openFilterGroups=i?this.openFilterGroups.filter(o=>o!==t):[...this.openFilterGroups,t]}}
        >
          <span>${e}</span>
          ${s?n`<span class="filter-category-count">
                (${s})
              </span>`:d}
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
                  ${l?n`<ha-icon icon="mdi:check"></ha-icon>`:d}
                </button>
              `})}
          </fieldset>
        </div>
      </div>
    `}open(e){this.dispatchEvent(new CustomEvent("tasks-task-open",{bubbles:!0,composed:!0,detail:e}))}action(e,t){this.dispatchEvent(new CustomEvent("tasks-task-action",{bubbles:!0,composed:!0,detail:{action:t,task:e}}))}columnHeader(e){return n`
      <th class=${`${e}-column`}>${r(ee[e])}</th>
    `}columnCell(e,t){return n`
      <td class=${`${t}-column`}>
        ${this.columnValue(e,t)}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),s=this.visibleColumnKeys(),i=this.showBulkSelection?this.selectedTasks():[],o=new Set(this.showBulkSelection?this.selectedIds:[]),l=e.length>0&&e.every(c=>o.has(c.id)),p=e.some(c=>o.has(c.id)),h=this.showSearch||this.showAddTask||this.showFilters||this.showColumns||i.length>0,u=this.showAddTask&&!this.showSearch&&!this.showFilters&&!this.showColumns&&i.length===0;return g`
      ${h?n`
            <div class="toolbar">
              ${this.showSearch||this.showAddTask||i.length?n`
                    <div class="selection-toolbar">
                      ${this.showSearch?n`
                            <input
                              class="search"
                              type="search"
                              aria-label=${r("table.search")}
                              placeholder=${r("table.search")}
                              .value=${this.search}
                              @input=${c=>{this.search=c.currentTarget.value,this.retainVisibleSelection(),this.storeSessionView()}}
                            >
                          `:d}
                      ${this.showAddTask?n`
                            <button
                              class=${u?"toolbar-button full-width":"toolbar-button"}
                              type="button"
                              @click=${()=>this.dispatchEvent(new CustomEvent("tasks-task-add",{bubbles:!0,composed:!0}))}
                            >
                              ${r("card.add_task")}
                            </button>
                          `:d}
                      ${i.length?this.renderBulkMenu(i):d}
                    </div>
                  `:d}
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
                                ${Ve.map(c=>this.filterGroup(r($s[c]),c))}
                              </div>
                              <div class="filter-footer">
                                ${this.registryError?n`<p class="registry-error">
                                      ${this.registryError}
                                    </p>`:d}
                                <ha-button
                                  appearance="plain"
                                  variant="neutral"
                                  @click=${()=>{this.filters=he(),this.storeSessionView()}}
                                >
                                  ${r("table.reset_filters")}
                                </ha-button>
                              </div>
                            </div>
                          `:d}
                    </div>
                  `:d}
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
                                ${Object.keys(ee).map(c=>n`
                                    <button
                                      class=${this.columns[c]?"option-row active":"option-row"}
                                      type="button"
                                      aria-pressed=${this.columns[c]}
                                      @click=${()=>this.toggleColumn(c,!this.columns[c])}
                                    >
                                      <span>${r(ee[c])}</span>
                                      ${this.columns[c]?n`<ha-icon
                                            icon="mdi:check"
                                          ></ha-icon>`:d}
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
                          `:d}
                    </div>
                  `:d}
            </div>
          `:d}
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
                              .indeterminate=${p&&!l}
                              @change=${c=>this.toggleVisible(e,c.currentTarget.checked)}
                            ></ha-checkbox>
                          </th>
                        `:d}
                    ${this.showIcon?n`<th class="icon" aria-hidden="true"></th>`:d}
                    <th>${r("table.task")}</th>
                    ${s.map(c=>this.columnHeader(c))}
                    ${this.showActionMenu?n`<th
                          class="actions"
                          aria-label=${r("task.actions")}
                        ></th>`:d}
                  </tr>
                </thead>
              `:d}
          <tbody>
            ${e.length?e.map(c=>g`
                    <tr
                      class=${this.rowClass(c)}
                      aria-selected=${o.has(c.id)}
                      @click=${()=>this.open(c)}
                    >
                      ${this.showBulkSelection?n`
                            <td
                              class="selection"
                              @click=${m=>m.stopPropagation()}
                            >
                              <ha-checkbox
                                aria-label=${r("app.select_task",{name:c.name})}
                                .checked=${o.has(c.id)}
                                @change=${m=>this.toggleTask(c.id,m.currentTarget.checked)}
                              ></ha-checkbox>
                            </td>
                          `:d}
                      ${this.showIcon?n`
                            <td class="icon">
                              <ha-icon
                                .icon=${c.active===!1?"mdi:pause-circle-outline":c.icon||"mdi:clipboard-check-outline"}
                              ></ha-icon>
                            </td>
                          `:d}
                      <td class="task-name">
                        ${c.name}
                        ${this.problemSensorWarning(c)}
                        <span class="mobile-details">
                          ${this.mobileDetails(c)}
                        </span>
                      </td>
                      ${s.map(m=>this.columnCell(c,m))}
                      ${this.showActionMenu?g`
                            <td
                              class="actions"
                              @click=${m=>m.stopPropagation()}
                            >
                              <${qt}
                                label=${r("app.actions_for",{name:c.name})}
                                .items=${ws(c)}
                                @tasks-action=${m=>this.action(c,m.detail)}
                              ></${qt}>
                            </td>
                          `:d}
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
    `}},pe=v("task-table");customElements.get(pe)||customElements.define(pe,We);var qe=class extends f{static properties={tone:{reflect:!0}};static styles=b`
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
  `;constructor(){super(),this.tone="default"}render(){return n`<span><slot></slot></span>`}},ue=v("pill");customElements.get(ue)||customElements.define(ue,qe);var K=$(I),S=$(ue),Gt=$(V),Ge=class extends f{static properties={attachment:{attribute:!1},url:{}};static styles=b`
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
    </a>`}},Ze=v("attachment-preview");customElements.get(Ze)||customElements.define(Ze,Ge);var Je=class extends f{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},historyError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0}};static styles=b`
    :host,
    .content,
    .records {
      display: grid;
      gap: 12px;
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
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
      grid-template-columns: 32px minmax(0, 1fr);
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
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
      gap: 8px 12px;
      margin: 0;
    }

    .planning-details dt {
      color: var(--primary-text-color);
    }

    .planning-details dd {
      margin: 0;
    }

    .entity-state {
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-decoration: underline;
      cursor: pointer;
    }

    .entity-state.unavailable,
    .unavailable {
      color: var(--error-color);
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
  `;hass;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.historyError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1}configure(e,t,s=[]){this.hass=e,this.task=t,this.attachments=[...t.attachments],this.loadDetails()}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.historyError="",this.attachmentError="";let[e,t,s]=await Promise.allSettled([B(this.hass),oe(this.hass,this.task.id),St(this.hass,this.task.id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError=r("app.assignment_load_error"),t.status==="fulfilled"?this.history=Array.isArray(t.value.history)?t.value.history:[]:this.historyError=r("app.history_load_error"),s.status==="fulfilled"?this.signedFiles=s.value.signed_files||{}:this.attachmentError=r("app.attachment_load_error"),this.loading=!1}formatDate(e){if(!e)return r("app.not_scheduled");let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}renderInline(e){let t=[],s=/(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g,i=0;for(let o of e.matchAll(s)){let l=o.index??0;if(l>i&&t.push(e.slice(i,l)),o[2])t.push(n`<strong>${o[2]}</strong>`);else if(o[3])t.push(n`<em>${o[3]}</em>`);else if(o[4])t.push(n`<code>${o[4]}</code>`);else if(o[5]&&o[6]){let p=o[6];t.push(/^(?:https?:|mailto:|\/|#)/.test(p)?n`<a href=${p} target="_blank" rel="noopener"
                >${o[5]}</a
              >`:o[5])}i=l+o[0].length}return i<e.length&&t.push(e.slice(i)),t}renderDescription(){let e=(this.task.description||"").split(/\r?\n/);if(!e.some(s=>s.trim()))return n`<p class="hint">${r("task.no_description")}.</p>`;let t=[];for(let s=0;s<e.length;){let i=e[s];if(!i.trim())s+=1;else if(i.startsWith("- ")){let o=[];for(;e[s]?.startsWith("- ");)o.push(e[s].slice(2)),s+=1;t.push(n`<ul>
            ${o.map(l=>n`<li>${this.renderInline(l)}</li>`)}
          </ul>`)}else if(/^\d+\. /.test(i)){let o=[];for(;/^\d+\. /.test(e[s]||"");)o.push(e[s].replace(/^\d+\. /,"")),s+=1;t.push(n`<ol>
            ${o.map(l=>n`<li>${this.renderInline(l)}</li>`)}
          </ol>`)}else{let o=/^(#{1,2})\s+(.+)$/.exec(i);t.push(o?o[1].length===1?n`<h3>${this.renderInline(o[2])}</h3>`:n`<h4>${this.renderInline(o[2])}</h4>`:i.startsWith("> ")?n`<blockquote>${this.renderInline(i.slice(2))}</blockquote>`:n`<p>${this.renderInline(i)}</p>`),s+=1}}return t}async openAttachment(e){let t=this.signedFiles[e.id];if(!t)return;let s=document.createElement(Ze);s.attachment=e,s.url=t,await _({heading:e.filename,content:s,width:"large"})}async complete(){if(!this.hass||this.completing||await _({heading:r("task.complete_title"),content:n`<p>
        ${r("task.complete_confirm",{name:this.task.name})}
      </p>`,actions:[{label:r("common.cancel"),value:"cancel"},{label:r("app.complete"),value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await Ct(this.hass,this.task.id,this.completionNotes),!0}catch(t){return this.completionError=T(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(i=>i.id===this.task.assignee_id)?.name||(this.assignmentReady?r("task.unassigned"):r("app.loading_assignments")),t=this.tags.find(i=>i.id===this.task.nfc_tag_id),s=(this.task.label_ids||[]).map(i=>this.labels.find(o=>o.label_id===i)).filter(i=>!!i);return g`
      <div class="pills">
        <${S}>${this.formatDate(this.task.due)}</${S}>
        <${S}>${e}</${S}>
        ${this.attachments.length?g`<${S}>
              ${r(this.attachments.length===1?"app.file_count_one":"app.file_count_many",{count:this.attachments.length})}
            </${S}>`:d}
        ${t?g`<${S}>NFC: ${t.name||t.id}</${S}>`:d}
        ${s.length?n`<span class="pill-break"></span>`:d}
        ${s.map(i=>g`<${S}>${i.name}</${S}>`)}
      </div>
    `}planningWarning(){return this.task.schedule.type==="sensor"&&O(this.hass,this.task.schedule)!=="available"}scheduleText(){let e=this.task.schedule;if(e.type==="sensor")return r("schedule.problem_sensor_description");let t=Math.max(1,Number(e.interval)||1),s={daily:"day",weekly:"week",monthly:"month",yearly:"year"},i=r(`schedule.period_${s[e.unit]}`),o=r(`schedule.period_${s[e.unit]}s`);if(e.type==="sliding")return r(t===1?"schedule.after_completion_one":"schedule.after_completion_many",{schedule_interval:t,period:t===1?i:o});let l=e.time||"09:00";if(e.unit==="weekly"){let p=Array.from({length:7},(m,x)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,x+1)))),h=(e.weekdays||[]).map(m=>p[m]).filter(Boolean),u=h.length>1?`${h.slice(0,-1).join(", ")} ${r("schedule.and")} ${h.at(-1)}`:h[0]||"",c=r(t===1?"schedule.weekly_one":"schedule.weekly_many",{schedule_interval:t,days:u?` ${r("schedule.on_days",{days:u})}`:""});return E(c,l)}if(e.unit==="monthly"){let p=e.day==="last"?r("schedule.on_last_day"):r("schedule.on_day_number",{day:Number(e.day||1)});return E(r(t===1?"schedule.monthly_one":"schedule.monthly_many",{schedule_interval:t,day:p}),l)}if(e.unit==="yearly"){let p=new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,(e.month||1)-1,1)),h=e.day==="last"?r("schedule.on_last_day_of_month",{month:p}):r("schedule.on_day_of_month",{day:Number(e.day||1),month:p});return E(r(t===1?"schedule.yearly_one":"schedule.yearly_many",{schedule_interval:t,day:h}),l)}return E(r(t===1?"schedule.fixed_one":"schedule.fixed_many",{schedule_interval:t,period:t===1?i:o}),l)}renderPlanning(){let e=this.task.schedule,t=e.type==="sensor"?this.hass?.states?.[e.entity_id]:void 0,s=t?.attributes?.friendly_name,i=e.type==="sensor"?O(this.hass,e):void 0;return n`
      <dl class="planning-details">
        <dt>${r("task.recurrence_calculation")}</dt>
        <dd>${e.type==="sensor"?r("task.problem_sensor"):e.type==="fixed"?r("task.fixed"):r("task.sliding")}</dd>
        <dt>${r("task.planning")}</dt>
        <dd>${this.scheduleText()}</dd>
        ${e.type==="sensor"?n`
              <dt>${r("task.problem_sensor")}</dt>
              <dd>
                ${s?`${s} \xB7 `:""}${e.entity_id}
              </dd>
              <dt>${r("app.status")}</dt>
              <dd class=${i==="available"?"":"unavailable"}>
                ${t?n`
                      <button
                        class="entity-state ${i==="available"?"":"unavailable"}"
                        type="button"
                        @click=${()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.entity_id},bubbles:!0,composed:!0}))}
                      >
                        ${t.state}
                      </button>
                    `:r("problem.sensor_missing_short")}
              </dd>
            `:d}
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
                  .icon=${Y(e.filename,e.content_type)}
                ></ha-icon>
                <span class="record-content">
                  <span>${e.filename}</span>
                  <span class="secondary">
                    ${this.formatSize(e.size)}
                  </span>
                </span>
              </button>
            </li>
          `})}
      </ul>
    `:n`<p class="hint">${r("task.no_files")}.</p>`}renderHistory(){return this.historyError?n`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?n`
      <ul class="records">
        ${this.history.map(e=>n`
          <li class="record">
            <ha-icon class="record-icon" icon="mdi:history"></ha-icon>
            <span class="record-content">
              <span>
                ${this.formatDate(e.completed_at)} ·
                ${e.user_name||r("common.system")}
              </span>
              <span class="secondary">
                ${e.notes==="tasks.history.completed_via_nfc"?r("history.completed_via_nfc"):e.notes||r("app.no_notes")}
              </span>
            </span>
          </li>
        `)}
      </ul>
    `:n`<p class="hint">${r("task.no_history")}.</p>`}render(){return g`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading?n`<p class="hint" aria-live="polite">
              ${r("app.loading_details")}
            </p>`:d}
        ${this.assignmentError?n`<p class="error" role="alert">${this.assignmentError}</p>`:d}
        <${K}
          heading=${r("task.planning")}
          .warning=${this.planningWarning()}
        >
          ${this.renderPlanning()}
        </${K}>
        <${K} heading=${r("task.files")}>
          ${this.renderAttachments()}
        </${K}>
        <${K} heading=${r("task.history")}>
          ${this.renderHistory()}
        </${K}>
        <${Gt}
          label=${r("task.completion_notes")}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${Gt}>
        ${this.completionError?n`<p class="error" role="alert">${this.completionError}</p>`:d}
      </div>
    `}},Qe=v("task-viewer");customElements.get(Qe)||customElements.define(Qe,Je);var Zt=async(a,e,t=[])=>{let s=document.createElement(Qe);return s.configure(a,e,t),await _({heading:e.name,content:s,actions:[{label:r("app.complete"),value:"complete",run:()=>s.complete()}]})==="complete"};var Jt=$(pe),Xe=class extends f{static properties={hass:{attribute:!1},narrow:{type:Boolean},snapshot:{state:!0},error:{state:!0}};static styles=b`
    :host {
      display: block;
      height: 100%;
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
      max-width: 960px;
      margin: 0 auto;
      padding: var(--ha-space-6);
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
        padding: var(--ha-space-4) var(--ha-space-2) var(--ha-space-6);
        padding-bottom: calc(var(--ha-space-12) + var(--ha-space-12));
      }

      .header-actions > span {
        display: none;
      }

      .fab {
        right: calc(var(--ha-space-4) + var(--safe-area-inset-right, 0px));
        bottom: calc(var(--ha-space-4) + var(--safe-area-inset-bottom, 0px));
      }
    }
  `;unsubscribe;connection;language;updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,De(this.language).then(()=>this.requestUpdate()))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await kt(this.hass,s=>{this.snapshot=s});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=T(t))}}openTask(e){this.hass&&Zt(this.hass,e)}async confirmDelete(e){this.hass&&await _({heading:r("task.delete_title"),content:n`<p>
        ${r("task.delete_confirm",{name:e.name})}
      </p>`,actions:[{label:r("common.cancel"),value:"cancel"},{label:r("common.delete"),value:"delete",destructive:!0,run:()=>Dt(this.hass,e.id)}]})}handleTaskAction(e,t){this.hass&&(e==="edit"?ze(this.hass,t):e==="active"?Pt(this.hass,t.id,t.active===!1):e==="delete"&&this.confirmDelete(t))}render(){let e=this.snapshot;return n`
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
              @click=${()=>this.hass&&void Ut(this.hass)}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </header>
        <main>
          ${this.error?n`<p class="error">${r("app.load_error",{message:this.error})}</p>`:e?g`
                  <${Jt}
                    .hass=${this.hass}
                    .tasks=${e.tasks}
                    .now=${e.now}
                    @tasks-task-open=${t=>this.openTask(t.detail)}
                    @tasks-task-action=${t=>this.handleTaskAction(t.detail.action,t.detail.task)}
                  ></${Jt}>
                `:n`<p>${r("common.loading")}</p>`}
        </main>
        <ha-button
          class="fab"
          appearance="accent"
          variant="brand"
          size="l"
          @click=${()=>this.hass&&void ze(this.hass)}
        >
          <ha-icon slot="start" icon="mdi:plus"></ha-icon>
          ${r("common.add_task")}
        </ha-button>
      </div>
    `}},Qt="tasks-panel";customElements.get(Qt)||customElements.define(Qt,Xe);
