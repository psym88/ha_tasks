var Z=globalThis,J=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),it=new WeakMap,B=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(J&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=it.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&it.set(t,e))}return e}toString(){return this.cssText}},st=r=>new B(typeof r=="string"?r:r+"",void 0,ge),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,n)=>i+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new B(t,r,ge)},rt=(r,e)=>{if(J)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=Z.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},fe=J?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return st(t)})(r):r;var{is:ti,defineProperty:ii,getOwnPropertyDescriptor:si,getOwnPropertyNames:ri,getOwnPropertySymbols:ai,getPrototypeOf:ni}=Object,Q=globalThis,at=Q.trustedTypes,oi=at?at.emptyScript:"",li=Q.reactiveElementPolyfillSupport,j=(r,e)=>r,ve={toAttribute(r,e){switch(e){case Boolean:r=r?oi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ot=(r,e)=>!ti(r,e),nt={attribute:!0,type:String,converter:ve,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),Q.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=nt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&ii(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:n}=si(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:s,set(l){let p=s?.call(this);n?.call(this,l),this.requestUpdate(e,p,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??nt}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let e=ni(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let t=this.properties,i=[...ri(t),...ai(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(fe(s))}else e!==void 0&&t.push(fe(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:ve).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),l=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ve;this._$Em=s;let p=l.fromAttribute(t,n.type);this[s]=p??this._$Ej?.get(s)??p,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(e!==void 0){let l=this.constructor;if(s===!1&&(n=this[e]),i??=l.getPropertyOptions(e),!((i.hasChanged??ot)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(l._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},l){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),n!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:l}=n,p=this[s];l!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,n,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[j("elementProperties")]=new Map,S[j("finalized")]=new Map,li?.({ReactiveElement:S}),(Q.reactiveElementVersions??=[]).push("2.1.2");var we=globalThis,lt=r=>r,X=we.trustedTypes,ct=X?X.createPolicy("lit-html",{createHTML:r=>r}):void 0,gt="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+C,ci=`<${ft}>`,H=document,V=()=>H.createComment(""),q=r=>r===null||typeof r!="object"&&typeof r!="function",Ee=Array.isArray,di=r=>Ee(r)||typeof r?.[Symbol.iterator]=="function",be=`[ 	
\f\r]`,K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,ht=/>/g,P=RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pt=/'/g,ut=/"/g,vt=/^(?:script|style|textarea|title)$/i,Te=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),o=Te(1),bt=Te(2),yt=Te(3),M=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),mt=new WeakMap,N=H.createTreeWalker(H,129);function $t(r,e){if(!Ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(e):e}var hi=(r,e)=>{let t=r.length-1,i=[],s,n=e===2?"<svg>":e===3?"<math>":"",l=K;for(let p=0;p<t;p++){let c=r[p],h,m,u=-1,x=0;for(;x<c.length&&(l.lastIndex=x,m=l.exec(c),m!==null);)x=l.lastIndex,l===K?m[1]==="!--"?l=dt:m[1]!==void 0?l=ht:m[2]!==void 0?(vt.test(m[2])&&(s=RegExp("</"+m[2],"g")),l=P):m[3]!==void 0&&(l=P):l===P?m[0]===">"?(l=s??K,u=-1):m[1]===void 0?u=-2:(u=l.lastIndex-m[2].length,h=m[1],l=m[3]===void 0?P:m[3]==='"'?ut:pt):l===ut||l===pt?l=P:l===dt||l===ht?l=K:(l=P,s=void 0);let _=l===P&&r[p+1].startsWith("/>")?" ":"";n+=l===K?c+ci:u>=0?(i.push(h),c.slice(0,u)+gt+c.slice(u)+C+_):c+C+(u===-2?p:_)}return[$t(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},W=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,l=0,p=e.length-1,c=this.parts,[h,m]=hi(e,t);if(this.el=r.createElement(h,i),N.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=N.nextNode())!==null&&c.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(gt)){let x=m[l++],_=s.getAttribute(u).split(C),O=/([.?@])?(.*)/.exec(x);c.push({type:1,index:n,name:O[2],strings:_,ctor:O[1]==="."?$e:O[1]==="?"?ke:O[1]==="@"?xe:z}),s.removeAttribute(u)}else u.startsWith(C)&&(c.push({type:6,index:n}),s.removeAttribute(u));if(vt.test(s.tagName)){let u=s.textContent.split(C),x=u.length-1;if(x>0){s.textContent=X?X.emptyScript:"";for(let _=0;_<x;_++)s.append(u[_],V()),N.nextNode(),c.push({type:2,index:++n});s.append(u[x],V())}}}else if(s.nodeType===8)if(s.data===ft)c.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(C,u+1))!==-1;)c.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(e,t){let i=H.createElement("template");return i.innerHTML=e,i}};function R(r,e,t=r,i){if(e===M)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,n=q(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=R(r,s._$AS(r,e.values),s,i)),e}var ye=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??H).importNode(t,!0);N.currentNode=s;let n=N.nextNode(),l=0,p=0,c=i[0];for(;c!==void 0;){if(l===c.index){let h;c.type===2?h=new G(n,n.nextSibling,this,e):c.type===1?h=new c.ctor(n,c.name,c.strings,this,e):c.type===6&&(h=new _e(n,this,e)),this._$AV.push(h),c=i[++p]}l!==c?.index&&(n=N.nextNode(),l++)}return N.currentNode=H,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},G=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=R(this,e,t),q(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):di(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=W.createElement($t(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new ye(s,this),l=n.u(this.options);n.p(t),this.T(l),this._$AH=n}}_$AC(e){let t=mt.get(e.strings);return t===void 0&&mt.set(e.strings,t=new W(e)),t}k(e){Ee(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let n of e)s===t.length?t.push(i=new r(this.O(V()),this.O(V()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=lt(e).nextSibling;lt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(e,t=this,i,s){let n=this.strings,l=!1;if(n===void 0)e=R(this,e,t,0),l=!q(e)||e!==this._$AH&&e!==M,l&&(this._$AH=e);else{let p=e,c,h;for(e=n[0],c=0;c<n.length-1;c++)h=R(this,p[i+c],t,c),h===M&&(h=this._$AH[c]),l||=!q(h)||h!==this._$AH[c],h===d?e=d:e!==d&&(e+=(h??"")+n[c+1]),this._$AH[c]=h}l&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},$e=class extends z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},ke=class extends z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},xe=class extends z{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=R(this,e,t,0)??d)===M)return;let i=this._$AH,s=e===d&&i!==d||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},_e=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){R(this,e)}};var pi=we.litHtmlPolyfillSupport;pi?.(W,G),(we.litHtmlVersions??=[]).push("3.3.3");var kt=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let n=t?.renderBefore??null;i._$litPart$=s=new G(e.insertBefore(V(),n),n,void 0,t??{})}return s._$AI(r),s};var Ae=globalThis,I=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=kt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};I._$litElement$=!0,I.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:I});var ui=Ae.litElementPolyfillSupport;ui?.({LitElement:I});(Ae.litElementVersions??=[]).push("4.2.2");var _t=Symbol.for(""),mi=r=>{if(r?.r===_t)return r?._$litStatic$},y=r=>({_$litStatic$:r,r:_t});var xt=new Map,Se=r=>(e,...t)=>{let i=t.length,s,n,l=[],p=[],c,h=0,m=!1;for(;h<i;){for(c=e[h];h<i&&(n=t[h],(s=mi(n))!==void 0);)c+=s+e[++h],m=!0;h!==i&&p.push(n),l.push(c),h++}if(h===i&&l.push(e[i]),m){let u=l.join("$$lit$$");(e=xt.get(u))===void 0&&(l.raw=l,xt.set(u,e=l)),t=p}return r(e,...t)},f=Se(o),Ui=Se(bt),Bi=Se(yt);var wt=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),Et=r=>{if(r.type==="sensor")return{type:r.type,entity_id:r.problemSensor.trim()};let e={type:r.type,unit:r.unit,interval:r.interval};return r.type==="fixed"&&(e.time=r.time,r.unit==="weekly"?e.weekdays=r.weekdays:r.unit==="monthly"?e.day=r.day:r.unit==="yearly"&&(e.day=r.day,e.month=r.month)),e},gi=async(r,e)=>{let t=new FormData;t.append("file",e);let i=await r.fetchWithAuth("/api/tasks/upload",{method:"POST",body:t});if(!i.ok)throw new Error(`File upload failed (${i.status})`);return(await i.json()).file_id},Tt=async r=>{let e=await r.json().catch(()=>({}));return new Error(e.code||`HTTP ${r.status}`)},At=async r=>{let e=await r.fetchWithAuth("/api/tasks/archive");if(!e.ok)throw await Tt(e);let t=URL.createObjectURL(await e.blob()),i=document.createElement("a");i.href=t,i.download=`tasks-${new Date().toISOString().slice(0,10)}.zip`,i.click(),setTimeout(()=>URL.revokeObjectURL(t),0)},St=async(r,e)=>{let t=await r.fetchWithAuth("/api/tasks/archive",{method:"POST",headers:{"Content-Type":"application/zip"},body:e});if(!t.ok)throw await Tt(t);return t.json()},Ct=async(r,e,t)=>{let i=await Promise.all((t.files?.staged||[]).map(s=>gi(r,s)));return r.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.id}:{},name:t.name.trim(),description:t.description.trim()||null,icon:t.icon.trim()||null,active:t.active,...t.schedule?{schedule:Et(t.schedule)}:e?{schedule:e.schedule}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification:{device_ids:t.notification.deviceIds,persistent:t.notification.persistent,critical:t.notification.critical,route:t.notification.route.trim()||null}}:{},file_ids:i,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},F=async r=>{let[e,t,i]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(i)?i:[]}},Y=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(i=>i?.[0]==="mobile_app"))},It=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),ee=(r,e)=>r.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),Dt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),Lt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),Pt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),Nt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),Ht=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",schedule:Et(e),...t?{due:t}:{}});var Mt=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1],fi=Mt?`?v=${encodeURIComponent(decodeURIComponent(Mt))}`:"",Ft={},Ot="",Rt="",Ce=new Map,Ie=new Set,vi=r=>{let e=String(r||"en").toLowerCase().split(/[-_]/)[0];return/^[a-z]{2,3}$/.test(e)?e:"en"},bi=r=>Object.fromEntries(Object.entries(r.common||{}).filter(([e])=>e.startsWith("ui_")).map(([e,t])=>{let i=e.indexOf("_",3);return[`${e.slice(3,i)}.${e.slice(i+1)}`,t]})),zt=r=>{if(!Ce.has(r)){let e=r==="en"?"/tasks_strings.json":`/tasks_translations/${r}.json`;Ce.set(r,fetch(`${e}${fi}`).then(async t=>t.ok?t.json():{}).then(bi).catch(()=>({})))}return Ce.get(r)},a=(r,e={})=>String(Ft[r]??r).replace(/\{(\w+)\}/g,(t,i)=>String(e[i]??`{${i}}`)),te=r=>{if(typeof r!="string"||!r)return;let e=`error.${r}`,t=a(e);return t===e?void 0:t},w=r=>{if(r&&typeof r=="object"){let e=r,t=te(e.code);if(t)return t;let i=te(e.message);if(i)return i;if(typeof e.message=="string"&&e.message)return e.message}return r instanceof Error?te(r.message)||r.message:typeof r=="string"&&r?te(r)||r:a("error.unknown")};async function De(r){let e=vi(r);Rt=e;let t=await zt("en"),i=e==="en"?t:await zt(e);if(Rt===e&&Ot!==e){Ot=e,Ft={...t,...i};for(let s of Ie)s()}}var Ut=r=>(Ie.add(r),()=>Ie.delete(r)),Wi=De(globalThis.navigator?.language);var g=class extends I{unsubscribeLanguage;connectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=Ut(()=>this.requestUpdate()),super.connectedCallback()}disconnectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=void 0,super.disconnectedCallback()}};var v=r=>`ha-tasks-${r}`,Le=decodeURIComponent(new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1]||"");var Pe=class extends g{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},width:{},open:{type:Boolean}};running=!1;closeValue="";constructor(){super(),this.heading="",this.content=o``,this.actions=[],this.width="medium",this.open=!1}close(e=""){this.closeValue=e,this.open=!1}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){let e=this.actions.at(-1),t=this.actions.slice(0,-1);return o`
      <ha-adaptive-dialog
        width=${this.width}
        flexcontent
        header-title=${this.heading}
        .open=${this.open}
        @closed=${()=>{this.open=!1,this.dispatchEvent(new CustomEvent("tasks-dialog-closed",{bubbles:!0,composed:!0,detail:this.closeValue}))}}
      >
        ${this.content}
        ${e?o`
              <ha-dialog-footer slot="footer">
                ${t.map(i=>o`
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
    `}},Ne=v("dialog");customElements.get(Ne)||customElements.define(Ne,Pe);var k=({heading:r,content:e,actions:t=[],width:i="medium"})=>{let s=document.createElement(Ne);return s.heading=r,s.content=e,s.actions=t,s.width=i,document.body.append(s),s.open=!0,new Promise(n=>{s.addEventListener("tasks-dialog-closed",l=>{s.remove(),n(l.detail)},{once:!0})})};var He=class extends g{static properties={heading:{},icon:{},open:{type:Boolean}};static styles=b`
    details {
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
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

    .chevron {
      margin-inline-start: auto;
      color: var(--secondary-text-color);
    }

    details[open] .chevron {
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
  `;constructor(){super(),this.heading="",this.icon="",this.open=!1}render(){return o`
      <details
        ?open=${this.open}
        @toggle=${e=>{this.open=e.currentTarget.open}}
      >
        <summary>
          ${this.icon?o`<ha-icon .icon=${this.icon}></ha-icon>`:d}
          ${this.heading}
          <ha-icon
            class="chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </summary>
        <div class="content"><slot></slot></div>
      </details>
    `}},D=v("expandable");customElements.get(D)||customElements.define(D,He);var ie=(r,e,t)=>a(r===1?e:t,{count:r}),Bt=y(D),Me=class extends g{static properties={hass:{attribute:!1},busy:{state:!0},status:{state:!0},warning:{state:!0},failed:{state:!0}};static styles=b`
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
  `;constructor(){super(),this.busy=!1,this.warning=!1,this.failed=!1}async exportArchive(){if(!(!this.hass||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[a("settings.exporting")];try{await At(this.hass),this.status=[a("settings.export_complete")]}catch(e){this.failed=!0,this.status=[a("common.error",{message:w(e)})]}finally{this.busy=!1}}}reportLines(e){let t=[];t.push(ie(e.attachments_imported||0,"settings.progress_attachment_one","settings.progress_attachment_many"),ie(e.history_entries_imported||0,"settings.progress_history_one","settings.progress_history_many"),ie(e.tasks_imported||0,"settings.progress_task_one","settings.progress_task_many"));let i=e.tasks_skipped||[];return i.length&&t.push(a(i.length===1?"settings.progress_skipped_one":"settings.progress_skipped_many",{count:i.length,names:i.join(", ")})),e.attachments_skipped&&t.push(ie(e.attachments_skipped,"settings.progress_attachment_skipped_one","settings.progress_attachment_skipped_many")),this.warning=!!(i.length||e.attachments_skipped),t.push(a(this.warning?"settings.import_complete_warning":"settings.import_complete")),t}async importArchive(e){if(!(!this.hass||!e||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[a("settings.progress_load"),a("settings.progress_unpack")];try{this.status=this.reportLines(await St(this.hass,e))}catch(t){this.failed=!0,this.status=[a("settings.import_failed",{message:w(t)})]}finally{this.busy=!1}}}render(){let e=this.failed?"error":this.warning?"status warning":"status";return f`
      <${Bt} heading=${a("settings.import_export")} open>
        <div class="backup-content">
          <p>${a("settings.archive_hint")}</p>
          ${this.status?o`<ul class=${e} role="status" aria-live="polite">
                ${this.status.map(t=>o`<li>${t}</li>`)}
              </ul>`:d}
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
              ${a("settings.import")}
            </button>
            <button
              class="primary"
              type="button"
              ?disabled=${this.busy}
              @click=${()=>{this.exportArchive()}}
            >
              ${a("settings.export")}
            </button>
          </div>
        </div>
      </${Bt}>
      ${Le?o`<p class="version">${a("app.version",{version:Le})}</p>`:d}
    `}},Oe=v("archive");customElements.get(Oe)||customElements.define(Oe,Me);var jt=r=>{let e=document.createElement(Oe);return e.hass=r,k({heading:a("settings.title"),content:e,actions:[{label:a("common.close"),value:"close"}]})};var je=b`
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
`,L=class extends g{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=je;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?o`<span class="error" role="alert">${this.error}</span>`:null}},Re=class extends L{static properties={...L.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return o`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        ${this.multiline?o`
              <textarea
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              ></textarea>
            `:o`
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
    `}},ze=class extends L{static properties={...L.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return o`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        <select
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${!!this.error}
          @change=${e=>this.change(e.target.value)}
        >
          ${this.options.map(e=>o`
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
    `}},Fe=class extends L{static properties={...L.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return o`
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
          ${this.options.map(e=>o`<option value=${e.value}>${e.label}</option>`)}
        </datalist>
        ${this.errorMessage()}
      </label>
    `}},Ue=class extends g{static properties={label:{},value:{attribute:!1},options:{attribute:!1},disabled:{type:Boolean}};static styles=je;constructor(){super(),this.label="",this.value=[],this.options=[],this.disabled=!1}toggle(e,t){this.value=t?[...new Set([...this.value,e])]:this.value.filter(i=>i!==e),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.value}))}render(){return o`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <div class="choices">
          ${this.options.map(e=>o`
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
    `}},Be=class extends g{static properties={label:{},description:{},checked:{type:Boolean},disabled:{type:Boolean}};static styles=[je,b`
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
    `];constructor(){super(),this.label="",this.description="",this.checked=!1,this.disabled=!1}render(){return o`
      <label>
        <span class="copy">
          <span>${this.label}</span>
          ${this.description?o`<small>${this.description}</small>`:null}
        </span>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${e=>{this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.checked}))}}
        />
      </label>
    `}},U=v("text-field"),se=v("select-field"),re=v("combobox-field"),ae=v("multi-select-field"),ne=v("switch-field");customElements.get(U)||customElements.define(U,Re);customElements.get(se)||customElements.define(se,ze);customElements.get(re)||customElements.define(re,Fe);customElements.get(ae)||customElements.define(ae,Ue);customElements.get(ne)||customElements.define(ne,Be);var E=y(U),$=y(se),oe=y(re),le=y(ae),ce=y(ne),T=y(D),yi=()=>[{label:a("app.title"),value:"mdi:clipboard-check-outline"},{label:"\u{1F6E0}",value:"mdi:wrench-outline"},{label:"\u{1F9F9}",value:"mdi:broom"},{label:"\u2302",value:"mdi:home-outline"},{label:"\u{1F4C5}",value:"mdi:calendar-check-outline"}],Kt=()=>[{label:a("task.sliding"),value:"sliding"},{label:a("task.fixed"),value:"fixed"},{label:a("task.problem_sensor"),value:"sensor"}],$i=()=>[{label:a("task.daily"),value:"daily"},{label:a("task.weekly"),value:"weekly"},{label:a("task.monthly"),value:"monthly"},{label:a("task.yearly"),value:"yearly"}],Vt=()=>[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:a("task.last_day"),value:"last"}],ki=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(i=>i.type!=="literal").map(i=>[i.type,i.value]))},Ke=class extends g{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=b`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t,i=[]){let s=ki(e,t.due),n=Number(s.year),l=Number(s.month),p=Number(s.day),c=(new Date(Date.UTC(n,l-1,p)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.name,this.description=t.description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification.device_ids||[]).filter(m=>typeof m=="string"))],this.notificationPersistent=!!t.notification.persistent,this.notificationCritical=!!t.notification.critical,this.notificationRoute=t.notification.route||"",this.attachments=[...t.attachments],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule.type,t.schedule.type==="sensor"?(this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[c],this.scheduleDay=p,this.scheduleMonth=l,this.scheduleTime=`${s.hour||"09"}:${s.minute||"00"}`,this.problemSensor=t.schedule.entity_id):(this.scheduleUnit=t.schedule.unit,this.scheduleInterval=t.schedule.interval,this.scheduleWeekdays=t.schedule.type==="fixed"&&t.schedule.weekdays?.length?[...t.schedule.weekdays]:[c],this.scheduleDay=t.schedule.type==="fixed"&&t.schedule.day?t.schedule.day:p,this.scheduleMonth=t.schedule.type==="fixed"&&t.schedule.month?t.schedule.month:l,this.scheduleTime=t.schedule.type==="fixed"&&t.schedule.time||`${s.hour||"09"}:${s.minute||"00"}`,this.problemSensor="");let h=!t.id;this.scheduleDirty=h,this.assignmentDirty=h,this.notificationDirty=h,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await F(e);this.users=[...t.users].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((i,s)=>(i.name||i.id).localeCompare(s.name||s.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(i=>i.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(i=>this.labels.some(s=>s.label_id===i)),this.nfcTagId=this.tags.some(i=>i.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError=a("app.assignment_load_error")}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await Y(e)).sort((t,i)=>this.deviceName(t).localeCompare(this.deviceName(i),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(i=>i.id===t))}catch{this.notificationError=a("app.notification_load_error")}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t?.id)){this.historyLoading=!0,this.historyError="";try{let i=await ee(e,t.id);this.history=Array.isArray(i.history)?i.history:[]}catch{this.historyError=a("app.history_load_error")}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let i=this.problemSensor.trim();return i.startsWith("binary_sensor.")||(t=a("app.select_binary_sensor")),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:i}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t=a("app.interval_min"):this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t=a("app.select_valid_time"):this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t=a("error.select_at_least_one_weekday")),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,i=this.scheduleDetails(!1),s=++this.previewRequest;if(!e||!t||!i||i.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let n=await Ht(e,i,this.scheduleDirty?void 0:t.due||void 0);s===this.previewRequest&&(this.preview=n.dues)}catch{s===this.previewRequest&&(this.preview=[],this.previewError=a("app.preview_load_error"))}finally{s===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),i=this.notificationRoute.trim();if(e||(this.nameError=a("app.name_required")),i&&(!i.startsWith("/")||i.startsWith("//"))&&(this.notificationRouteError=a("app.route_invalid")),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await Ct(this.hass,this.task.id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:i}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(s){return this.saveError=w(s),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return d;let e=d;return this.scheduleUnit==="weekly"?e=o`
        <p class="caption">${a("task.schedule_weekdays")}</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,i)=>o`
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
      `:this.scheduleUnit==="monthly"?e=f`
        <${$}
          label=${a("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${Vt()}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${$}>
      `:this.scheduleUnit==="yearly"&&(e=f`
        <div class="row">
          <${$}
            label=${a("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${Vt()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${$}>
          <${$}
            label=${a("task.month")}
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${$}>
        </div>
      `),f`
      <${E}
        label=${a("task.time")}
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${E}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return d;if(this.previewLoading&&!this.preview.length)return o`<p class="hint" aria-live="polite">
        ${a("app.loading_preview")}
      </p>`;if(this.previewError)return o`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return o`
        <p class="caption">${a("task.first_due")}</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return o`
      <p class="caption">${a("task.preview_task_dues")}</p>
      <ol class="preview">
        ${e.map(t=>o`<li>${this.formatDue(t)}</li>`)}
      </ol>
      ${this.preview.length>4?o`
            <button
              class="link"
              type="button"
              @click=${()=>{this.previewExpanded=!this.previewExpanded}}
            >
              ${this.previewExpanded?a("app.show_less"):a("app.show_all")}
            </button>
          `:d}
    `}renderPlanning(){return this.scheduleType==="sensor"?f`
        <div class="planning">
          <${$}
            label=${a("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${Kt()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${$}>
          <${oe}
            label=${a("task.problem_sensor")}
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail})}
          ></${oe}>
          <p class="hint">
            ${a("app.sensor_hint")}
          </p>
        </div>
      `:f`
      <div class="planning">
        <${$}
          label=${a("task.recurrence_calculation")}
          .value=${this.scheduleType}
          .options=${Kt()}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${$}>
        <div class="row">
          <${E}
            label=${a("app.every")}
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${E}>
          <${$}
            label=${a("app.unit")}
            .value=${this.scheduleUnit}
            .options=${$i()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${$}>
        </div>
        ${this.renderFixedOptions()}
        ${this.scheduleType==="sliding"?o`
              <p class="hint">
                ${a("app.sliding_hint")}
              </p>
            `:d}
        ${this.scheduleError?o`<p class="error" role="alert">${this.scheduleError}</p>`:d}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return o`<p class="hint" aria-live="polite">
        ${a("app.loading_assignments")}
      </p>`;if(this.assignmentError)return o`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:a("task.unassigned"),value:""},...this.users.map(s=>({label:s.name,value:s.id}))],t=[{label:a("task.no_nfc_tag"),value:""},...this.tags.map(s=>({label:s.name||s.id,value:s.id}))],i=this.labels.map(s=>({label:s.name,value:s.label_id}));return f`
      <div class="planning">
        <${oe}
          label=${a("task.icon")}
          .value=${this.icon}
          .options=${yi()}
          ?disabled=${this.saving}
          @value-changed=${s=>{this.icon=s.detail}}
        ></${oe}>
        <${$}
          label=${a("task.user")}
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.assigneeId=s.detail})}
        ></${$}>
        <${$}
          label=${a("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.nfcTagId=s.detail})}
        ></${$}>
        <${le}
          label=${a("task.labels")}
          .value=${this.labelIds}
          .options=${i}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.labelIds=s.detail})}
        ></${le}>
      </div>
    `}renderNotification(){if(this.notificationLoading)return o`<p class="hint" aria-live="polite">
        ${a("app.loading_notifications")}
      </p>`;if(this.notificationError)return o`<p class="error" role="alert">${this.notificationError}</p>`;let e=this.devices.map(t=>({label:this.deviceName(t),value:t.id}));return f`
      <div class="planning">
        <${le}
          label=${a("app.mobile_devices")}
          .value=${this.notificationDeviceIds}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationDeviceIds=t.detail})}
        ></${le}>
        ${e.length?d:o`<p class="hint">${a("app.no_mobile_devices")}</p>`}
        <${ce}
          label=${a("task.notification_persistent")}
          description=${a("task.notification_persistent_description")}
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationPersistent=t.detail})}
        ></${ce}>
        <${ce}
          label=${a("task.notification_critical")}
          description=${a("task.notification_critical_description")}
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationCritical=t.detail})}
        ></${ce}>
        <${E}
          label=${a("app.navigation_target")}
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationRoute=t.detail})}
        ></${E}>
        <p class="hint">${a("app.navigation_hint")}</p>
      </div>
    `}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}fileIcon(e,t){let i=t.toLowerCase(),s=e.split(".").pop()?.toLowerCase();return i.startsWith("image/")?"mdi:file-image-outline":i==="application/pdf"||s==="pdf"?"mdi:file-pdf-box":i.startsWith("text/")||["txt","md","log"].includes(s||"")?"mdi:file-document-outline":i.startsWith("audio/")?"mdi:file-music-outline":i.startsWith("video/")?"mdi:file-video-outline":i.includes("zip")||i.includes("compressed")||["zip","rar","7z","gz"].includes(s||"")?"mdi:folder-zip-outline":i.includes("spreadsheet")||i.includes("excel")||["csv","xls","xlsx","ods"].includes(s||"")?"mdi:file-table-outline":i.includes("word")||["doc","docx","odt","rtf"].includes(s||"")?"mdi:file-word-outline":"mdi:file-outline"}toggleId(e,t){return t.includes(e)?t.filter(i=>i!==e):[...t,e]}renderAttachments(){return o`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?o`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.id);return o`
                    <li class="record ${t?"pending":""}">
                      <ha-icon
                        class="record-icon"
                        .icon=${this.fileIcon(e.filename,e.content_type)}
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
                ${this.stagedFiles.map((e,t)=>o`
                    <li class="record">
                      <ha-icon
                        class="record-icon"
                        .icon=${this.fileIcon(e.name,e.type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name">${e.name}</span>
                        <span class="record-detail"
                          >${this.formatSize(e.size)} ·
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
            `:o`<p class="hint">${a("task.no_files")}.</p>`}
        <label class="file-picker">
          <span>${a("app.add_files")}</span>
          <input
            type="file"
            multiple
            ?disabled=${this.saving}
            @change=${e=>{let t=e.target;this.stagedFiles=[...this.stagedFiles,...Array.from(t.files||[])],t.value=""}}
          />
        </label>
      </div>
    `}renderHistory(){return this.historyLoading?o`<p class="hint" aria-live="polite">
        ${a("app.loading_history")}
      </p>`:this.historyError?o`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?o`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.id),i=e.notes==="tasks.history.completed_via_nfc"?a("history.completed_via_nfc"):e.notes||a("app.no_notes");return o`
            <li class="record ${t?"pending":""}">
              <ha-icon
                class="record-icon"
                icon="mdi:check-circle-outline"
              ></ha-icon>
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.completed_at)} ·
                  ${e.user_name||a("common.system")}</span
                >
                <span class="record-detail">${i}</span>
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
    `:o`<p class="hint">${a("task.no_history")}.</p>`}render(){return f`
      <form @submit=${e=>e.preventDefault()}>
        <${E}
          label=${a("task.name")}
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${E}>
        <${E}
          label=${a("task.optional_description")}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${E}>
        <${T} heading=${a("task.planning")}>
          ${this.renderPlanning()}
        </${T}>
        <${T} heading=${a("task.assignment")}>
          ${this.renderAssignment()}
        </${T}>
        <${T} heading=${a("task.notification")}>
          ${this.renderNotification()}
        </${T}>
        <${T} heading=${a("task.files")}>
          ${this.renderAttachments()}
        </${T}>
        ${this.task?.id?f`
              <${T} heading=${a("task.history")}>
                ${this.renderHistory()}
              </${T}>
            `:d}
        ${this.saveError?o`<p class="error" role="alert">${this.saveError}</p>`:d}
      </form>
    `}},Ve=v("task-form");customElements.get(Ve)||customElements.define(Ve,Ke);var qe=async(r,e,t=[])=>{let i=e||{id:"",name:"",active:!0,schedule:{type:"sliding",unit:"monthly",interval:1},notification:{device_ids:[],persistent:!1,critical:!1,route:null},due:null,completions:[],attachments:[]},s=document.createElement(Ve);return s.configure(r,i,t),await k({heading:e?`${a("task.edit")}: ${i.name}`:a("task.new"),content:s,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("common.save"),value:"save",run:()=>s.save()}]})==="save"};var We=class extends g{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=b`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let i=e.getBoundingClientRect(),s=t.getBoundingClientRect(),n=window.visualViewport,l=n?.offsetLeft||0,p=n?.offsetTop||0,c=l+(n?.width||window.innerWidth),h=p+(n?.height||window.innerHeight),m=8,u=4,x=Math.min(Math.max(l+m,i.right-s.width),c-s.width-m),_=i.bottom+u,O=_+s.height<=h-m?_:Math.max(p+m,i.top-s.height-u);t.style.left=`${x}px`,t.style.top=`${O}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let i=t.indexOf(this.renderRoot.activeElement),s;e.key==="ArrowDown"?s=(i+1)%t.length:e.key==="ArrowUp"?s=(i-1+t.length)%t.length:e.key==="Home"?s=0:e.key==="End"&&(s=t.length-1),s!==void 0&&(e.preventDefault(),t[s].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return o`
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
        ${this.items.map(e=>o`
            <button
              class=${e.destructive?"item destructive":"item"}
              type="button"
              role="menuitem"
              ?disabled=${e.disabled}
              @click=${t=>this.choose(t,e)}
            >
              ${e.icon?o`<ha-icon .icon=${e.icon}></ha-icon>`:""}
              ${e.label}
            </button>
          `)}
      </div>
    `}},de=v("action-menu");customElements.get(de)||customElements.define(de,We);var qt="tasks-table-state-v2",Wt="tasks-table-session-v1",he={due:"task.due",assignee:"table.assignee",nfc:"task.nfc_tag_id",files:"task.files",labels:"task.labels",notifications:"table.notifications",trigger:"table.recurrence",status:"app.status"},Ge={due:!0,assignee:!0,nfc:!0,files:!0,labels:!1,notifications:!1,trigger:!1,status:!1},Gt=()=>({assignee:[],labels:[],notifications:[],trigger:[],status:[]}),Zt=(r,e)=>{try{let t=globalThis[r],i=JSON.parse(t?.getItem(e)||"{}");return i&&typeof i=="object"&&!Array.isArray(i)?i:{}}catch{return{}}},Jt=y(de),xi=r=>[{label:a("menu.edit"),value:"edit",icon:"mdi:pencil-outline"},{label:r.active===!1?a("app.resume"):a("app.pause"),value:"active",icon:r.active===!1?"mdi:play-circle-outline":"mdi:pause-circle-outline"},{label:a("common.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],_i=()=>[{label:a("bulk.complete"),value:"complete",icon:"mdi:check-circle-outline"},{label:a("app.pause"),value:"pause",icon:"mdi:pause-circle-outline"},{label:a("app.resume"),value:"resume",icon:"mdi:play-circle-outline"},{label:a("bulk.assign_person"),value:"assign",icon:"mdi:account-outline"},{label:a("app.add_label"),value:"add-label",icon:"mdi:tag-plus-outline"},{label:a("app.remove_label"),value:"remove-label",icon:"mdi:tag-minus-outline"},{label:a("app.add_notification"),value:"add-notification",icon:"mdi:bell-plus-outline"},{label:a("app.remove_notification"),value:"remove-notification",icon:"mdi:bell-minus-outline"},{label:a("bulk.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Ze=class extends g{static properties={hass:{attribute:!1},tasks:{attribute:!1},search:{state:!0},sortKey:{state:!0},sortDirection:{state:!0},filters:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=b`
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
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .bulk-action-picker > summary {
      display: flex;
      min-height: 48px;
      align-items: center;
      gap: var(--ha-space-3);
      padding: 0 var(--ha-space-4);
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
    }

    .bulk-action-picker > summary ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .bulk-action-picker > summary .picker-chevron {
      margin-inline-start: auto;
    }

    .bulk-action-picker[open] > summary .picker-chevron {
      transform: rotate(180deg);
    }

    .bulk-action-list {
      display: grid;
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

    .filter-category > summary {
      display: flex;
      min-height: 48px;
      align-items: center;
      padding: 0 var(--ha-space-4);
      background: transparent;
      border: 0;
      border-radius: 0;
      font-weight: var(--ha-font-weight-medium);
    }

    .filter-category > summary .filter-chevron {
      margin-inline-start: auto;
      color: var(--secondary-text-color);
    }

    .filter-category-count {
      margin-inline-start: var(--ha-space-2);
      color: var(--secondary-text-color);
      font-weight: var(--ha-font-weight-normal);
    }

    .filter-category[open] > summary .filter-chevron {
      transform: rotate(180deg);
    }

    .filter-category fieldset {
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

    .reset-action {
      margin-inline-start: auto;
    }

    .registry-error {
      margin: 0;
      color: var(--error-color);
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

    tbody tr {
      cursor: pointer;
    }

    .task-name {
      font-weight: 500;
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
      .selection-toolbar > details {
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
  `;registryConnection;closePanels=e=>{let t=e.composedPath();for(let i of this.renderRoot.querySelectorAll("details[open]"))t.includes(i)||i.removeAttribute("open")};constructor(){super();let e=Zt("localStorage",qt),t=Zt("sessionStorage",Wt);this.tasks=[],this.search=typeof t.search=="string"?t.search:"",this.sortKey=["name","due","assignee","trigger","status"].includes(String(e.sortKey))?e.sortKey:"due",this.sortDirection=e.sortDirection==="desc"?"desc":"asc";let i=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys(Gt()).map(n=>[n,Array.isArray(i[n])?i[n].filter(l=>typeof l=="string"):[]]));let s=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(Ge).map(n=>[n,typeof s[n]=="boolean"?s[n]:Ge[n]])),this.users=[],this.labels=[],this.tags=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.bulkBusy=!1,this.bulkError=""}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.closePanels)}disconnectedCallback(){document.removeEventListener("click",this.closePanels),super.disconnectedCallback()}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[i,s]=await Promise.allSettled([F(e),Y(e)]);this.registryConnection===t&&(i.status==="fulfilled"&&(this.users=i.value.users,this.labels=i.value.labels,this.tags=i.value.tags),s.status==="fulfilled"&&(this.devices=s.value),(i.status==="rejected"||s.status==="rejected")&&(this.registryError=a("app.registry_load_error")))}trigger(e){return e.schedule.type==="sensor"?a("task.problem_sensor"):e.schedule.type==="fixed"?a("task.fixed"):a("task.sliding")}status(e){return e.active===!1?a("app.paused"):a("app.active")}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||a("task.unassigned")}nfcTag(e){return e.nfc_tag_id?this.tags.find(t=>t.id===e.nfc_tag_id)?.name||e.nfc_tag_id:"\u2014"}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(i=>t.has(i.label_id)).sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification.device_ids||[]);return this.devices.filter(i=>t.has(i.id)).sort((i,s)=>this.deviceName(i).localeCompare(this.deviceName(s),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification.persistent?[a("task.notification_persistent")]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="assignee")return[this.users.find(s=>s.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let i=this.taskLabels(e).map(s=>s.label_id);return i.length?i:["__none__"]}if(t==="notifications"){let i=[...e.notification.persistent?["panel"]:[],...this.notificationDevices(e).map(s=>s.id)];return i.length?i:["__none__"]}return t==="status"?[e.active===!1?"paused":"active"]:[e.schedule.type]}filterLabel(e,t){return t==="__none__"?e==="assignee"?a("task.unassigned"):e==="labels"?a("task.no_labels"):a("app.no_notifications"):e==="assignee"?this.users.find(i=>i.id===t)?.name||t:e==="labels"?this.labels.find(i=>i.label_id===t)?.name||t:e==="notifications"?t==="panel"?a("task.notification_persistent"):this.deviceName(this.devices.find(i=>i.id===t)):e==="status"?t==="paused"?a("app.paused"):a("app.active"):t==="sensor"?a("task.problem_sensor"):t==="fixed"?a("task.fixed"):a("task.sliding")}filterOptions(e){return[...new Set(this.tasks.flatMap(i=>this.filterValues(i,e)))].map(i=>({value:i,label:this.filterLabel(e,i)})).sort((i,s)=>i.label.localeCompare(s.label,this.hass?.locale?.language))}matchesFilters(e){return Object.keys(this.filters).every(t=>{let i=this.filters[t];return!i.length||this.filterValues(e,t).some(s=>i.includes(s))})}dueValue(e){if(e.active===!1||!e.due)return;let t=Date.parse(e.due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);return t===void 0?"\u2014":new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}compare(e,t){let i;if(this.sortKey==="due"){let s=this.dueValue(e),n=this.dueValue(t);if(s===void 0||n===void 0)if(s===n)i=0;else return s===void 0?1:-1;else i=s-n}else{let s=n=>this.sortKey==="name"?n.name:this.sortKey==="assignee"?this.assignee(n):this.sortKey==="trigger"?this.trigger(n):this.status(n);i=s(e).localeCompare(s(t),this.hass?.locale?.language)}return i!==0?this.sortDirection==="asc"?i:-i:e.name.localeCompare(t.name,this.hass?.locale?.language)}visibleTasks(){let e=this.search.trim().toLocaleLowerCase(this.hass?.locale?.language);return this.tasks.filter(t=>this.matchesFilters(t)&&(!e||[t.name,t.description,this.assignee(t),this.nfcTag(t),this.taskLabels(t).map(i=>i.name).join(" "),this.notificationDevices(t).map(i=>this.deviceName(i)).join(" "),this.trigger(t),this.status(t)].some(i=>i?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((t,i)=>this.compare(t,i))}sort(e){this.sortKey===e?this.sortDirection=this.sortDirection==="asc"?"desc":"asc":(this.sortKey=e,this.sortDirection="asc"),this.storeLocalView()}sortLabel(e){return this.sortKey!==e?"":this.sortDirection==="asc"?"\u2191":"\u2193"}toggleFilter(e,t,i){let s=this.filters[e];this.filters={...this.filters,[e]:i?[...new Set([...s,t])]:s.filter(n=>n!==t)},this.retainVisibleSelection(),this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}resetColumns(){this.columns={...Ge},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(qt,JSON.stringify({sortKey:this.sortKey,sortDirection:this.sortDirection,columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(Wt,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="files"?String(e.attachments.length):t==="nfc"?this.nfcTag(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}mobileDetails(e){return Object.keys(this.columns).filter(t=>this.columns[t]&&this.columnText(e,t)!=="\u2014").map(t=>this.columnText(e,t)).join(" \xB7 ")}visibleColumnCount(){return Object.values(this.columns).filter(Boolean).length+4}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.id))}visibleSelectedTasks(){let e=new Set(this.selectedIds);return this.visibleTasks().filter(t=>e.has(t.id))}retainVisibleSelection(){let e=new Set(this.visibleTasks().map(t=>t.id));this.selectedIds=this.selectedIds.filter(t=>e.has(t))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(i=>i!==e)}toggleVisible(e,t){let i=new Set(this.selectedIds);for(let s of e)t?i.add(s.id):i.delete(s.id);this.selectedIds=[...i]}bulkTargets(){return this.bulkAction==="assign"?[{value:"__none__",label:a("task.unassigned")},...this.users.map(e=>({value:e.id,label:e.name}))]:this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:a("task.notification_persistent")},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkActionDestructive(){return["delete","remove-label","remove-notification"].includes(this.bulkAction)}bulkActionLabel(){return this.bulkAction==="complete"?a("bulk.complete"):this.bulkAction==="pause"?a("app.pause"):this.bulkAction==="resume"?a("app.resume"):this.bulkAction==="assign"?a("app.assign"):this.bulkAction==="add-label"||this.bulkAction==="add-notification"?a("app.add"):this.bulkAction==="remove-label"||this.bulkAction==="remove-notification"?a("common.remove"):this.bulkAction==="delete"?a("common.delete"):a("app.apply")}bulkTargetLabel(){return this.bulkAction==="assign"?a("app.choose_person"):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?a("app.choose_label"):a("app.choose_notification")}bulkTargetIcon(){return this.bulkAction==="assign"?"mdi:account-outline":this.bulkAction==="add-label"||this.bulkAction==="remove-label"?"mdi:tag-outline":"mdi:bell-outline"}bulkOperations(){return this.visibleSelectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",id:e.id,notes:null};if(this.bulkAction==="delete")return{action:"delete",id:e.id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget==="__none__"?null:this.bulkTarget};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let i=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?i.filter(s=>s!==this.bulkTarget):[...new Set([...i,this.bulkTarget])]}}else{let i=e.notification.device_ids||[];this.bulkTarget==="panel"?t={notification:{...e.notification,persistent:this.bulkAction==="add-notification"}}:t={notification:{...e.notification,device_ids:this.bulkAction==="remove-notification"?i.filter(s=>s!==this.bulkTarget):[...new Set([...i,this.bulkTarget])]}}}return{action:"update",id:e.id,changes:t}})}renderBulkMenu(e){let t=this.bulkTargets(),i=_i(),s=i.find(l=>l.value===this.bulkAction),n=t.find(l=>l.value===this.bulkTarget);return o`
      <details class="bulk-menu">
        <summary>${a("bulk.actions")} (${e.length})</summary>
        <div class="popover-panel">
          <div class="bulk-bar">
            <details class="bulk-action-picker">
              <summary>
                <ha-icon
                  .icon=${s?.icon||"mdi:gesture-tap-button"}
                ></ha-icon>
                <span>${s?.label||a("app.choose_action")}</span>
                <ha-icon
                  class="picker-chevron"
                  icon="mdi:chevron-down"
                ></ha-icon>
              </summary>
              <div class="bulk-action-list">
                ${i.map(l=>o`
                    <button
                      class=${["bulk-action",this.bulkAction===l.value?"selected":"",l.destructive?"destructive":""].filter(Boolean).join(" ")}
                      type="button"
                      @click=${p=>{this.bulkAction=l.value,this.bulkTarget="",this.bulkError="",p.currentTarget.closest("details")?.removeAttribute("open")}}
                    >
                      <ha-icon .icon=${l.icon}></ha-icon>
                      <span>${l.label}</span>
                    </button>
                  `)}
              </div>
            </details>
            ${t.length?o`
                  <details class="bulk-action-picker">
                    <summary>
                      <ha-icon .icon=${this.bulkTargetIcon()}></ha-icon>
                      <span>
                        ${n?.label||this.bulkTargetLabel()}
                      </span>
                      <ha-icon
                        class="picker-chevron"
                        icon="mdi:chevron-down"
                      ></ha-icon>
                    </summary>
                    <div class="bulk-action-list">
                      ${t.map(l=>o`
                          <button
                            class=${["bulk-action",this.bulkTarget===l.value?"selected":""].filter(Boolean).join(" ")}
                            type="button"
                            @click=${p=>{this.bulkTarget=l.value,p.currentTarget.closest("details")?.removeAttribute("open")}}
                          >
                            <ha-icon .icon=${this.bulkTargetIcon()}></ha-icon>
                            <span>${l.label}</span>
                          </button>
                        `)}
                    </div>
                  </details>
                `:d}
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
            ${this.bulkError?o`<p class="bulk-error" role="alert">
                  ${this.bulkError}
                </p>`:d}
          </div>
        </div>
      </details>
    `}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await k({heading:t?a("bulk.delete_title"):a("bulk.complete_title"),content:o`<p>
          ${t?a("bulk.delete_confirm",{count:e.length}):a("bulk.complete_confirm",{count:e.length})}
        </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:t?a("common.delete"):a("app.complete"),value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await It(this.hass,e);let t=new Set(e.map(i=>i.id));this.selectedIds=this.selectedIds.filter(i=>!t.has(i)),this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=w(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return Object.values(this.filters).reduce((e,t)=>e+t.length,0)}filterGroup(e,t){let i=this.filters[t].length;return o`
      <details class="filter-category">
        <summary>
          <span>${e}</span>
          ${i?o`<span class="filter-category-count">
                (${i})
              </span>`:d}
          <ha-icon
            class="filter-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </summary>
        <fieldset>
          ${this.filterOptions(t).map(s=>{let n=this.filters[t].includes(s.value);return o`
              <button
                class=${n?"option-row active":"option-row"}
                type="button"
                aria-pressed=${n}
                @click=${()=>this.toggleFilter(t,s.value,!n)}
              >
                <span>${s.label}</span>
                ${n?o`<ha-icon icon="mdi:check"></ha-icon>`:d}
              </button>
            `})}
        </fieldset>
      </details>
    `}open(e){this.dispatchEvent(new CustomEvent("tasks-task-open",{bubbles:!0,composed:!0,detail:e}))}action(e,t){this.dispatchEvent(new CustomEvent("tasks-task-action",{bubbles:!0,composed:!0,detail:{action:t,task:e}}))}header(e,t,i=""){return o`
      <th
        class=${i}
        aria-sort=${this.sortKey===t?this.sortDirection==="asc"?"ascending":"descending":"none"}
      >
        <button type="button" @click=${()=>this.sort(t)}>
          ${e}
          ${this.sortKey===t?o`<span aria-hidden="true">${this.sortLabel(t)}</span>`:d}
        </button>
      </th>
    `}columnHeader(e){let t=`${e}-column`;return e==="labels"||e==="notifications"||e==="files"||e==="nfc"?o`<th class=${t}>${a(he[e])}</th>`:this.header(a(he[e]),e,t)}columnCell(e,t){let i=this.columnText(e,t);return o`
      <td class=${`${t}-column`}>
        ${t==="status"?o`<span class="status">${i}</span>`:i}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),i=Object.keys(this.columns).filter(c=>this.columns[c]),s=this.selectedTasks(),n=new Set(this.selectedIds),l=e.length>0&&e.every(c=>n.has(c.id)),p=e.some(c=>n.has(c.id));return f`
      <div class="toolbar">
        <div class="selection-toolbar">
          <input
            class="search"
            type="search"
            aria-label=${a("table.search")}
            placeholder=${a("table.search")}
            .value=${this.search}
            @input=${c=>{this.search=c.currentTarget.value,this.retainVisibleSelection(),this.storeSessionView()}}
          >
          ${s.length?this.renderBulkMenu(s):d}
        </div>
        <details>
          <summary>${a("table.filters")}${t?` (${t})`:""}</summary>
          <div class="popover-panel filter-panel">
            <div class="filter-grid">
              ${this.filterGroup(a("task.assignment"),"assignee")}
              ${this.filterGroup(a("task.labels"),"labels")}
              ${this.filterGroup(a("table.notifications"),"notifications")}
              ${this.filterGroup(a("table.recurrence"),"trigger")}
              ${this.filterGroup(a("app.status"),"status")}
            </div>
            <div class="filter-footer">
              ${this.registryError?o`<p class="registry-error">${this.registryError}</p>`:d}
              <ha-button
                appearance="plain"
                variant="neutral"
                @click=${()=>{this.filters=Gt(),this.storeSessionView()}}
              >
                ${a("table.reset_filters")}
              </ha-button>
            </div>
          </div>
        </details>
        <details>
          <summary>${a("table.columns")}</summary>
          <div class="popover-panel column-panel">
            <div class="column-options">
              ${Object.keys(he).map(c=>o`
                  <button
                    class=${this.columns[c]?"option-row active":"option-row"}
                    type="button"
                    aria-pressed=${this.columns[c]}
                    @click=${()=>this.toggleColumn(c,!this.columns[c])}
                  >
                    <span>${a(he[c])}</span>
                    ${this.columns[c]?o`<ha-icon icon="mdi:check"></ha-icon>`:d}
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
        </details>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="selection">
                <ha-checkbox
                  aria-label=${a("app.select_visible")}
                  .checked=${l}
                  .indeterminate=${p&&!l}
                  @change=${c=>this.toggleVisible(e,c.currentTarget.checked)}
                ></ha-checkbox>
              </th>
              <th class="icon" aria-hidden="true"></th>
              ${this.header(a("table.task"),"name")}
              ${i.map(c=>this.columnHeader(c))}
              <th class="actions" aria-label=${a("task.actions")}></th>
            </tr>
          </thead>
          <tbody>
            ${e.length?e.map(c=>f`
                    <tr
                      class=${c.active===!1?"inactive":""}
                      aria-selected=${n.has(c.id)}
                      @click=${()=>this.open(c)}
                    >
                      <td
                        class="selection"
                        @click=${h=>h.stopPropagation()}
                      >
                        <ha-checkbox
                          aria-label=${a("app.select_task",{name:c.name})}
                          .checked=${n.has(c.id)}
                          @change=${h=>this.toggleTask(c.id,h.currentTarget.checked)}
                        ></ha-checkbox>
                      </td>
                      <td class="icon">
                        <ha-icon
                          .icon=${c.active===!1?"mdi:pause-circle-outline":c.icon||"mdi:clipboard-check-outline"}
                        ></ha-icon>
                      </td>
                      <td class="task-name">
                        ${c.name}
                        <span class="mobile-details">
                          ${this.mobileDetails(c)}
                        </span>
                      </td>
                      ${i.map(h=>this.columnCell(c,h))}
                      <td
                        class="actions"
                        @click=${h=>h.stopPropagation()}
                      >
                        <${Jt}
                          label=${a("app.actions_for",{name:c.name})}
                          .items=${xi(c)}
                          @tasks-action=${h=>this.action(c,h.detail)}
                        ></${Jt}>
                      </td>
                    </tr>
                  `):o`
                  <tr>
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.search?a("table.empty"):a("app.no_tasks")}
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `}},pe=v("task-table");customElements.get(pe)||customElements.define(pe,Ze);var Je=class extends g{static properties={tone:{reflect:!0}};static styles=b`
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
  `;constructor(){super(),this.tone="default"}render(){return o`<span><slot></slot></span>`}},ue=v("pill");customElements.get(ue)||customElements.define(ue,Je);var me=y(D),A=y(ue),Qt=y(U),Qe=class extends g{static properties={attachment:{attribute:!1},url:{}};static styles=b`
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
  `;render(){let e=this.attachment.content_type;return e.startsWith("image/")?o`<img src=${this.url} alt=${this.attachment.filename} />`:e.startsWith("video/")?o`<video src=${this.url} controls></video>`:e.startsWith("audio/")?o`<audio src=${this.url} controls></audio>`:e==="application/pdf"?o`<iframe
        src=${this.url}
        title=${this.attachment.filename}
      ></iframe>`:o`<a href=${this.url} target="_blank" rel="noopener">
      ${a("app.open_file",{name:this.attachment.filename})}
    </a>`}},Xe=v("attachment-preview");customElements.get(Xe)||customElements.define(Xe,Qe);var Ye=class extends g{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},historyError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0}};static styles=b`
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
  `;hass;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.historyError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1}configure(e,t,i=[]){this.hass=e,this.task=t,this.attachments=[...t.attachments],this.loadDetails()}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.historyError="",this.attachmentError="";let[e,t,i]=await Promise.allSettled([F(this.hass),ee(this.hass,this.task.id),Dt(this.hass,this.task.id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError=a("app.assignment_load_error"),t.status==="fulfilled"?this.history=Array.isArray(t.value.history)?t.value.history:[]:this.historyError=a("app.history_load_error"),i.status==="fulfilled"?this.signedFiles=i.value.signed_files||{}:this.attachmentError=a("app.attachment_load_error"),this.loading=!1}formatDate(e){if(!e)return a("app.not_scheduled");let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}attachmentIcon(e){let t=e.content_type.toLowerCase(),i=e.filename.split(".").pop()?.toLowerCase();return t.startsWith("image/")?"mdi:file-image-outline":t==="application/pdf"||i==="pdf"?"mdi:file-pdf-box":t.startsWith("text/")||["txt","md","log"].includes(i||"")?"mdi:file-document-outline":t.startsWith("audio/")?"mdi:file-music-outline":t.startsWith("video/")?"mdi:file-video-outline":t.includes("zip")||t.includes("compressed")||["zip","rar","7z","gz"].includes(i||"")?"mdi:folder-zip-outline":t.includes("spreadsheet")||t.includes("excel")||["csv","xls","xlsx","ods"].includes(i||"")?"mdi:file-table-outline":t.includes("word")||["doc","docx","odt","rtf"].includes(i||"")?"mdi:file-word-outline":"mdi:file-outline"}renderInline(e){let t=[],i=/(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g,s=0;for(let n of e.matchAll(i)){let l=n.index??0;if(l>s&&t.push(e.slice(s,l)),n[2])t.push(o`<strong>${n[2]}</strong>`);else if(n[3])t.push(o`<em>${n[3]}</em>`);else if(n[4])t.push(o`<code>${n[4]}</code>`);else if(n[5]&&n[6]){let p=n[6];t.push(/^(?:https?:|mailto:|\/|#)/.test(p)?o`<a href=${p} target="_blank" rel="noopener"
                >${n[5]}</a
              >`:n[5])}s=l+n[0].length}return s<e.length&&t.push(e.slice(s)),t}renderDescription(){let e=(this.task.description||"").split(/\r?\n/);if(!e.some(i=>i.trim()))return o`<p class="hint">${a("task.no_description")}.</p>`;let t=[];for(let i=0;i<e.length;){let s=e[i];if(!s.trim())i+=1;else if(s.startsWith("- ")){let n=[];for(;e[i]?.startsWith("- ");)n.push(e[i].slice(2)),i+=1;t.push(o`<ul>
            ${n.map(l=>o`<li>${this.renderInline(l)}</li>`)}
          </ul>`)}else if(/^\d+\. /.test(s)){let n=[];for(;/^\d+\. /.test(e[i]||"");)n.push(e[i].replace(/^\d+\. /,"")),i+=1;t.push(o`<ol>
            ${n.map(l=>o`<li>${this.renderInline(l)}</li>`)}
          </ol>`)}else{let n=/^(#{1,2})\s+(.+)$/.exec(s);t.push(n?n[1].length===1?o`<h3>${this.renderInline(n[2])}</h3>`:o`<h4>${this.renderInline(n[2])}</h4>`:s.startsWith("> ")?o`<blockquote>${this.renderInline(s.slice(2))}</blockquote>`:o`<p>${this.renderInline(s)}</p>`),i+=1}}return t}async openAttachment(e){let t=this.signedFiles[e.id];if(!t)return;let i=document.createElement(Xe);i.attachment=e,i.url=t,await k({heading:e.filename,content:i,width:"large"})}async complete(){if(!this.hass||this.completing||await k({heading:a("task.complete_title"),content:o`<p>
        ${a("task.complete_confirm",{name:this.task.name})}
      </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("app.complete"),value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await Lt(this.hass,this.task.id,this.completionNotes),!0}catch(t){return this.completionError=w(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(s=>s.id===this.task.assignee_id)?.name||(this.assignmentReady?a("task.unassigned"):a("app.loading_assignments")),t=this.tags.find(s=>s.id===this.task.nfc_tag_id),i=(this.task.label_ids||[]).map(s=>this.labels.find(n=>n.label_id===s)).filter(s=>!!s);return f`
      <div class="pills">
        <${A}>${this.formatDate(this.task.due)}</${A}>
        <${A}>${e}</${A}>
        ${this.attachments.length?f`<${A}>
              ${a(this.attachments.length===1?"app.file_count_one":"app.file_count_many",{count:this.attachments.length})}
            </${A}>`:d}
        ${t?f`<${A}>NFC: ${t.name||t.id}</${A}>`:d}
        ${i.length?o`<span class="pill-break"></span>`:d}
        ${i.map(s=>f`<${A}>${s.name}</${A}>`)}
      </div>
    `}renderAttachments(){return this.attachmentError?o`<p class="error" role="alert">${this.attachmentError}</p>`:this.attachments.length?o`
      <ul class="records">
        ${this.attachments.map(e=>{let t=!!this.signedFiles[e.id];return o`
            <li>
              <button
                class="record"
                type="button"
                ?disabled=${!t}
                @click=${()=>{this.openAttachment(e)}}
              >
                <ha-icon
                  class="record-icon"
                  .icon=${this.attachmentIcon(e)}
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
    `:o`<p class="hint">${a("task.no_files")}.</p>`}renderHistory(){return this.historyError?o`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?o`
      <ul class="records">
        ${this.history.map(e=>o`
          <li class="record">
            <ha-icon class="record-icon" icon="mdi:history"></ha-icon>
            <span class="record-content">
              <span>
                ${this.formatDate(e.completed_at)} ·
                ${e.user_name||a("common.system")}
              </span>
              <span class="secondary">
                ${e.notes==="tasks.history.completed_via_nfc"?a("history.completed_via_nfc"):e.notes||a("app.no_notes")}
              </span>
            </span>
          </li>
        `)}
      </ul>
    `:o`<p class="hint">${a("task.no_history")}.</p>`}render(){return f`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading?o`<p class="hint" aria-live="polite">
              ${a("app.loading_details")}
            </p>`:d}
        ${this.assignmentError?o`<p class="error" role="alert">${this.assignmentError}</p>`:d}
        <${me} heading=${a("task.files")}>
          ${this.renderAttachments()}
        </${me}>
        <${me} heading=${a("task.history")}>
          ${this.renderHistory()}
        </${me}>
        <${Qt}
          label=${a("task.completion_notes")}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${Qt}>
        ${this.completionError?o`<p class="error" role="alert">${this.completionError}</p>`:d}
      </div>
    `}},et=v("task-viewer");customElements.get(et)||customElements.define(et,Ye);var Xt=async(r,e,t=[])=>{let i=document.createElement(et);return i.configure(r,e,t),await k({heading:e.name,content:i,actions:[{label:a("common.close"),value:"close"},{label:a("app.complete"),value:"complete",run:()=>i.complete()}]})==="complete"};var Yt=y(pe),tt=class extends g{static properties={hass:{attribute:!1},narrow:{type:Boolean},snapshot:{state:!0},error:{state:!0}};static styles=b`
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
  `;unsubscribe;connection;language;updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,De(this.language).then(()=>this.requestUpdate()))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await wt(this.hass,i=>{this.snapshot=i});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=w(t))}}openTask(e){this.hass&&Xt(this.hass,e)}async confirmDelete(e){this.hass&&await k({heading:a("task.delete_title"),content:o`<p>
        ${a("task.delete_confirm",{name:e.name})}
      </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("common.delete"),value:"delete",destructive:!0,run:()=>Pt(this.hass,e.id)}]})}handleTaskAction(e,t){this.hass&&(e==="open"?this.openTask(t):e==="edit"?qe(this.hass,t):e==="active"?Nt(this.hass,t.id,t.active===!1):e==="delete"&&this.confirmDelete(t))}render(){let e=this.snapshot;return o`
      <div class="page">
        <header>
          <div class="header-title">
            <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}>
            </ha-menu-button>
            <h1>${a("app.title")}</h1>
          </div>
          <div class="header-actions">
            <ha-icon-button
              class="backup"
              label=${a("settings.import_export")}
              title=${a("settings.import_export")}
              @click=${()=>this.hass&&void jt(this.hass)}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </header>
        <main>
          ${this.error?o`<p class="error">${a("app.load_error",{message:this.error})}</p>`:e?f`
                  <${Yt}
                    .hass=${this.hass}
                    .tasks=${e.tasks}
                    @tasks-task-open=${t=>this.openTask(t.detail)}
                    @tasks-task-action=${t=>this.handleTaskAction(t.detail.action,t.detail.task)}
                  ></${Yt}>
                `:o`<p>${a("common.loading")}</p>`}
        </main>
        <ha-button
          class="fab"
          appearance="accent"
          variant="brand"
          size="l"
          @click=${()=>this.hass&&void qe(this.hass)}
        >
          <ha-icon slot="start" icon="mdi:plus"></ha-icon>
          ${a("common.add_task")}
        </ha-button>
      </div>
    `}},ei="tasks-panel";customElements.get(ei)||customElements.define(ei,tt);
