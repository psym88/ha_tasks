var se=globalThis,ie=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),at=new WeakMap,K=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ie&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=at.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&at.set(t,e))}return e}toString(){return this.cssText}},nt=r=>new K(typeof r=="string"?r:r+"",void 0,_e),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new K(t,r,_e)},ot=(r,e)=>{if(ie)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=se.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},we=ie?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return nt(t)})(r):r;var{is:ss,defineProperty:is,getOwnPropertyDescriptor:rs,getOwnPropertyNames:as,getOwnPropertySymbols:ns,getPrototypeOf:os}=Object,re=globalThis,lt=re.trustedTypes,ls=lt?lt.emptyScript:"",cs=re.reactiveElementPolyfillSupport,q=(r,e)=>r,xe={toAttribute(r,e){switch(e){case Boolean:r=r?ls:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},dt=(r,e)=>!ss(r,e),ct={attribute:!0,type:String,converter:xe,reflect:!1,useDefault:!1,hasChanged:dt};Symbol.metadata??=Symbol("metadata"),re.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ct){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&is(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=rs(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){let u=i?.call(this);n?.call(this,l),this.requestUpdate(e,u,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ct}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=os(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,s=[...as(t),...ns(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(we(i))}else e!==void 0&&t.push(we(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:xe).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:xe;this._$Em=i;let u=l.fromAttribute(t,n.type);this[i]=u??this._$Ej?.get(i)??u,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let l=this.constructor;if(i===!1&&(n=this[e]),s??=l.getPropertyOptions(e),!((s.hasChanged??dt)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(l._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},l){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),n!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:l}=n,u=this[i];l!==!0||this._$AL.has(i)||u===void 0||this.C(i,void 0,n,u)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[q("elementProperties")]=new Map,A[q("finalized")]=new Map,cs?.({ReactiveElement:A}),(re.reactiveElementVersions??=[]).push("2.1.2");var Pe=globalThis,ht=r=>r,ae=Pe.trustedTypes,ut=ae?ae.createPolicy("lit-html",{createHTML:r=>r}):void 0,vt="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+S,ds=`<${yt}>`,F=document,Z=()=>F.createComment(""),J=r=>r===null||typeof r!="object"&&typeof r!="function",Ie=Array.isArray,hs=r=>Ie(r)||typeof r?.[Symbol.iterator]=="function",Te=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pt=/-->/g,mt=/>/g,I=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,ft=/"/g,$t=/^(?:script|style|textarea|title)$/i,Le=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),o=Le(1),kt=Le(2),_t=Le(3),M=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),bt=new WeakMap,L=F.createTreeWalker(F,129);function wt(r,e){if(!Ie(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(e):e}var us=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",l=G;for(let u=0;u<t;u++){let h=r[u],p,c,m=-1,_=0;for(;_<h.length&&(l.lastIndex=_,c=l.exec(h),c!==null);)_=l.lastIndex,l===G?c[1]==="!--"?l=pt:c[1]!==void 0?l=mt:c[2]!==void 0?($t.test(c[2])&&(i=RegExp("</"+c[2],"g")),l=I):c[3]!==void 0&&(l=I):l===I?c[0]===">"?(l=i??G,m=-1):c[1]===void 0?m=-2:(m=l.lastIndex-c[2].length,p=c[1],l=c[3]===void 0?I:c[3]==='"'?ft:gt):l===ft||l===gt?l=I:l===pt||l===mt?l=G:(l=I,i=void 0);let w=l===I&&r[u+1].startsWith("/>")?" ":"";n+=l===G?h+ds:m>=0?(s.push(p),h.slice(0,m)+vt+h.slice(m)+S+w):h+S+(m===-2?u:w)}return[wt(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Q=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,l=0,u=e.length-1,h=this.parts,[p,c]=us(e,t);if(this.el=r.createElement(p,s),L.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=L.nextNode())!==null&&h.length<u;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(vt)){let _=c[l++],w=i.getAttribute(m).split(S),H=/([.?@])?(.*)/.exec(_);h.push({type:1,index:n,name:H[2],strings:w,ctor:H[1]==="."?Ae:H[1]==="?"?Se:H[1]==="@"?Ce:R}),i.removeAttribute(m)}else m.startsWith(S)&&(h.push({type:6,index:n}),i.removeAttribute(m));if($t.test(i.tagName)){let m=i.textContent.split(S),_=m.length-1;if(_>0){i.textContent=ae?ae.emptyScript:"";for(let w=0;w<_;w++)i.append(m[w],Z()),L.nextNode(),h.push({type:2,index:++n});i.append(m[_],Z())}}}else if(i.nodeType===8)if(i.data===yt)h.push({type:2,index:n});else{let m=-1;for(;(m=i.data.indexOf(S,m+1))!==-1;)h.push({type:7,index:n}),m+=S.length-1}n++}}static createElement(e,t){let s=F.createElement("template");return s.innerHTML=e,s}};function O(r,e,t=r,s){if(e===M)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=J(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=O(r,i._$AS(r,e.values),i,s)),e}var Ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??F).importNode(t,!0);L.currentNode=i;let n=L.nextNode(),l=0,u=0,h=s[0];for(;h!==void 0;){if(l===h.index){let p;h.type===2?p=new X(n,n.nextSibling,this,e):h.type===1?p=new h.ctor(n,h.name,h.strings,this,e):h.type===6&&(p=new De(n,this,e)),this._$AV.push(p),h=s[++u]}l!==h?.index&&(n=L.nextNode(),l++)}return L.currentNode=F,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},X=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=O(this,e,t),J(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):hs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&J(this._$AH)?this._$AA.nextSibling.data=e:this.T(F.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Q.createElement(wt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new Ee(i,this),l=n.u(this.options);n.p(t),this.T(l),this._$AH=n}}_$AC(e){let t=bt.get(e.strings);return t===void 0&&bt.set(e.strings,t=new Q(e)),t}k(e){Ie(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(Z()),this.O(Z()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ht(e).nextSibling;ht(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,i){let n=this.strings,l=!1;if(n===void 0)e=O(this,e,t,0),l=!J(e)||e!==this._$AH&&e!==M,l&&(this._$AH=e);else{let u=e,h,p;for(e=n[0],h=0;h<n.length-1;h++)p=O(this,u[s+h],t,h),p===M&&(p=this._$AH[h]),l||=!J(p)||p!==this._$AH[h],p===d?e=d:e!==d&&(e+=(p??"")+n[h+1]),this._$AH[h]=p}l&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ae=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},Se=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},Ce=class extends R{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=O(this,e,t,0)??d)===M)return;let s=this._$AH,i=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},De=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){O(this,e)}};var ps=Pe.litHtmlPolyfillSupport;ps?.(Q,X),(Pe.litHtmlVersions??=[]).push("3.3.3");var xt=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new X(e.insertBefore(Z(),n),n,void 0,t??{})}return i._$AI(r),i};var Fe=globalThis,C=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=xt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};C._$litElement$=!0,C.finalized=!0,Fe.litElementHydrateSupport?.({LitElement:C});var ms=Fe.litElementPolyfillSupport;ms?.({LitElement:C});(Fe.litElementVersions??=[]).push("4.2.2");var Et=Symbol.for(""),gs=r=>{if(r?.r===Et)return r?._$litStatic$},k=r=>({_$litStatic$:r,r:Et});var Tt=new Map,Me=r=>(e,...t)=>{let s=t.length,i,n,l=[],u=[],h,p=0,c=!1;for(;p<s;){for(h=e[p];p<s&&(n=t[p],(i=gs(n))!==void 0);)h+=i+e[++p],c=!0;p!==s&&u.push(n),l.push(h),p++}if(p===s&&l.push(e[s]),c){let m=l.join("$$lit$$");(e=Tt.get(m))===void 0&&(l.raw=l,Tt.set(m,e=l)),t=u}return r(e,...t)},g=Me(o),Ws=Me(kt),Ks=Me(_t);var At=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),St=r=>{if(r.type==="sensor")return{type:r.type,entity_id:r.problemSensor.trim()};let e={type:r.type,unit:r.unit,interval:r.interval};return r.type==="fixed"&&(e.time=r.time,r.unit==="weekly"?e.weekdays=r.weekdays:r.unit==="monthly"?e.day=r.day:r.unit==="yearly"&&(e.day=r.day,e.month=r.month)),e},fs=async(r,e)=>{let t=new FormData;t.append("file",e);let s=await r.fetchWithAuth("/api/tasks/upload",{method:"POST",body:t});if(!s.ok)throw new Error(`File upload failed (${s.status})`);return(await s.json()).file_id};var Ct=async(r,e,t)=>{let s=await Promise.all((t.files?.staged||[]).map(i=>fs(r,i)));return r.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.id}:{},name:t.name.trim(),description:t.description.trim()||null,icon:t.icon.trim()||null,active:t.active,...t.schedule?{schedule:St(t.schedule)}:e?{schedule:e.schedule}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification:{device_ids:t.notification.deviceIds,persistent:t.notification.persistent,critical:t.notification.critical,route:t.notification.route.trim()||null}}:{},file_ids:s,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},U=async r=>{let[e,t,s]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(s)?s:[]}},ne=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(s=>s?.[0]==="mobile_app"))},Dt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),oe=(r,e)=>r.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),Pt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),It=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),Lt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),Ft=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),Mt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",schedule:St(e),...t?{due:t}:{}});var Nt=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1],bs=Nt?`?v=${encodeURIComponent(decodeURIComponent(Nt))}`:"",Ut={},Ht="",Ot="",Ne=new Map,He=new Set,vs=r=>{let e=String(r||"en").toLowerCase().split(/[-_]/)[0];return/^[a-z]{2,3}$/.test(e)?e:"en"},ys=r=>Object.fromEntries(Object.entries(r.common||{}).filter(([e])=>e.startsWith("ui_")).map(([e,t])=>{let s=e.indexOf("_",3);return[`${e.slice(3,s)}.${e.slice(s+1)}`,t]})),Rt=r=>{if(!Ne.has(r)){let e=r==="en"?"/tasks_strings.json":`/tasks_translations/${r}.json`;Ne.set(r,fetch(`${e}${bs}`).then(async t=>t.ok?t.json():{}).then(ys).catch(()=>({})))}return Ne.get(r)},a=(r,e={})=>String(Ut[r]??r).replace(/\{(\w+)\}/g,(t,s)=>String(e[s]??`{${s}}`)),Y=(r,e)=>a("schedule.with_time",{description:r,time:a("app.at_time",{time:e})}),le=r=>{if(typeof r!="string"||!r)return;let e=`error.${r}`,t=a(e);return t===e?void 0:t},D=r=>{if(r&&typeof r=="object"){let e=r,t=le(e.code);if(t)return t;let s=le(e.message);if(s)return s;if(typeof e.message=="string"&&e.message)return e.message}return r instanceof Error?le(r.message)||r.message:typeof r=="string"&&r?le(r)||r:a("error.unknown")};async function Oe(r){let e=vs(r);Ot=e;let t=await Rt("en"),s=e==="en"?t:await Rt(e);if(Ot===e&&Ht!==e){Ht=e,Ut={...t,...s};for(let i of He)i()}}var zt=r=>(He.add(r),()=>He.delete(r)),Bt=Oe(globalThis.navigator?.language);var f=class extends C{unsubscribeLanguage;connectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=zt(()=>this.requestUpdate()),super.connectedCallback()}disconnectedCallback(){this.unsubscribeLanguage?.(),this.unsubscribeLanguage=void 0,super.disconnectedCallback()}};var ee=(r,e)=>{let t=e.toLowerCase(),s=r.split(".").pop()?.toLowerCase();return t.startsWith("image/")?"mdi:file-image-outline":t==="application/pdf"||s==="pdf"?"mdi:file-pdf-box":t.startsWith("text/")||["txt","md","log"].includes(s||"")?"mdi:file-document-outline":t.startsWith("audio/")?"mdi:file-music-outline":t.startsWith("video/")?"mdi:file-video-outline":t.includes("zip")||t.includes("compressed")||["zip","rar","7z","gz"].includes(s||"")?"mdi:folder-zip-outline":t.includes("spreadsheet")||t.includes("excel")||["csv","xls","xlsx","ods"].includes(s||"")?"mdi:file-table-outline":t.includes("word")||["doc","docx","odt","rtf"].includes(s||"")?"mdi:file-word-outline":"mdi:file-outline"},te=r=>r<1024?`${r} B`:r<1048576?`${Math.round(r/1024)} KB`:`${(r/1048576).toFixed(1)} MB`;var Vt={daily:"day",weekly:"week",monthly:"month",yearly:"year"},ce=(r,e)=>{if(r.type==="sensor"){let u=a("schedule.problem_sensor_description");return r.sensorName?`${u} (${r.sensorName})`:u}let t=r.unit||"daily",s=Math.max(1,Number(r.interval)||1),i=a(`schedule.period_${Vt[t]}`),n=a(`schedule.period_${Vt[t]}s`);if(r.type==="sliding")return a(s===1?"schedule.after_completion_one":"schedule.after_completion_many",{schedule_interval:s,period:s===1?i:n});let l=r.time||"09:00";if(t==="weekly"){let u=Array.from({length:7},(c,m)=>new Intl.DateTimeFormat(e,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,m+1)))),h=(r.weekdays||[]).map(c=>u[c]).filter(Boolean),p=h.length>1?`${h.slice(0,-1).join(", ")} ${a("schedule.and")} ${h.at(-1)}`:h[0]||"";return Y(a(s===1?"schedule.weekly_one":"schedule.weekly_many",{schedule_interval:s,days:p?` ${a("schedule.on_days",{days:p})}`:""}),l)}if(t==="monthly"){let u=r.day==="last"?a("schedule.on_last_day"):a("schedule.on_day_number",{day:Number(r.day||1)});return Y(a(s===1?"schedule.monthly_one":"schedule.monthly_many",{schedule_interval:s,day:u}),l)}if(t==="yearly"){let u=new Intl.DateTimeFormat(e,{month:"long"}).format(new Date(2024,(r.month||1)-1,1)),h=r.day==="last"?a("schedule.on_last_day_of_month",{month:u}):a("schedule.on_day_of_month",{day:Number(r.day||1),month:u});return Y(a(s===1?"schedule.yearly_one":"schedule.yearly_many",{schedule_interval:s,day:h}),l)}return Y(a(s===1?"schedule.fixed_one":"schedule.fixed_many",{schedule_interval:s,period:s===1?i:n}),l)};var N=(r,e)=>{let t=r?.states?.[e.entity_id];return t?t.state==="unavailable"||t.state==="unknown"?t.state:"available":"missing"};var v=r=>`ha-tasks-${r}`,ai=decodeURIComponent(new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1]||"");var Re=class extends f{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},width:{},open:{type:Boolean}};running=!1;closeValue="";constructor(){super(),this.heading="",this.content=o``,this.actions=[],this.width="medium",this.open=!1}close(e=""){this.closeValue=e,this.open=!1}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){let e=this.actions.at(-1),t=this.actions.slice(0,-1);return o`
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
                ${t.map(s=>o`
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
    `}},Ue=v("dialog");customElements.get(Ue)||customElements.define(Ue,Re);var x=({heading:r,content:e,actions:t=[],width:s="medium"})=>{let i=document.createElement(Ue);return i.heading=r,i.content=e,i.actions=t,i.width=s,(document.querySelector("home-assistant")?.shadowRoot||document.body).append(i),i.open=!0,new Promise(l=>{i.addEventListener("tasks-dialog-closed",u=>{i.remove(),l(u.detail)},{once:!0})})};var ze=class extends f{static properties={heading:{},warning:{type:Boolean},open:{type:Boolean}};static styles=b`
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
  `;constructor(){super(),this.heading="",this.warning=!1,this.open=!1}render(){return o`
      <div class=${this.open?"expandable open":"expandable"}>
        <button
          class="heading"
          type="button"
          aria-expanded=${this.open?"true":"false"}
          @click=${()=>{this.open=!this.open}}
        >
          ${this.heading}
          ${this.warning?o`
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
        <div class="content">
          <div class="content-inner">
            <div class="content-padding"><slot></slot></div>
          </div>
        </div>
      </div>
    `}},z=v("expandable");customElements.get(z)||customElements.define(z,ze);var $s=b`
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

`,B=class extends f{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=$s;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?o`<span class="error" role="alert">${this.error}</span>`:null}},Be=class extends B{static properties={...B.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return o`
      <label>
        <span>${this.label}</span>
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
    `}},Ve=class extends B{static properties={...B.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return o`
      <label>
        <span>${this.label}</span>
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
    `}},V=v("text-field"),de=v("select-field");customElements.get(V)||customElements.define(V,Be);customElements.get(de)||customElements.define(de,Ve);var P=k(V),y=k(de),T=k(z),$=k("ha-form"),jt=()=>[{label:a("task.sliding"),value:"sliding"},{label:a("task.fixed"),value:"fixed"},{label:a("task.problem_sensor"),value:"sensor"}],ks=()=>[{label:a("task.daily"),value:"daily"},{label:a("task.weekly"),value:"weekly"},{label:a("task.monthly"),value:"monthly"},{label:a("task.yearly"),value:"yearly"}],Wt=()=>[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:a("task.last_day"),value:"last"}],_s=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(s=>s.type!=="literal").map(s=>[s.type,s.value]))},je=class extends f{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0},fileDropActive:{state:!0}};static styles=b`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1,this.fileDropActive=!1}configure(e,t,s=[]){let i=_s(e,t.due),n=Number(i.year),l=Number(i.month),u=Number(i.day),h=(new Date(Date.UTC(n,l-1,u)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.name,this.description=t.description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification.device_ids||[]).filter(c=>typeof c=="string"))],this.notificationPersistent=!!t.notification.persistent,this.notificationCritical=!!t.notification.critical,this.notificationRoute=t.notification.route||"",this.attachments=[...t.attachments],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule.type,t.schedule.type==="sensor"?(this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[h],this.scheduleDay=u,this.scheduleMonth=l,this.scheduleTime=`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor=t.schedule.entity_id):(this.scheduleUnit=t.schedule.unit,this.scheduleInterval=t.schedule.interval,this.scheduleWeekdays=t.schedule.type==="fixed"&&t.schedule.weekdays?.length?[...t.schedule.weekdays]:[h],this.scheduleDay=t.schedule.type==="fixed"&&t.schedule.day?t.schedule.day:u,this.scheduleMonth=t.schedule.type==="fixed"&&t.schedule.month?t.schedule.month:l,this.scheduleTime=t.schedule.type==="fixed"&&t.schedule.time||`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor="");let p=!t.id;this.scheduleDirty=p,this.assignmentDirty=p,this.notificationDirty=p,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await U(e);this.users=[...t.users].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((s,i)=>(s.name||s.id).localeCompare(i.name||i.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(s=>s.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(s=>this.labels.some(i=>i.label_id===s)),this.nfcTagId=this.tags.some(s=>s.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError=a("app.assignment_load_error")}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await ne(e)).sort((t,s)=>this.deviceName(t).localeCompare(this.deviceName(s),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(s=>s.id===t))}catch{this.notificationError=a("app.notification_load_error")}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t?.id)){this.historyLoading=!0,this.historyError="";try{let s=await oe(e,t.id);this.history=Array.isArray(s.history)?s.history:[]}catch{this.historyError=a("app.history_load_error")}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let s=this.problemSensor.trim();return s.startsWith("binary_sensor.")||(t=a("app.select_binary_sensor")),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:s}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t=a("app.interval_min"):this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t=a("app.select_valid_time"):this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t=a("error.select_at_least_one_weekday")),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,s=this.scheduleDetails(!1),i=++this.previewRequest;if(!e||!t||!s||s.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let n=await Mt(e,s,this.scheduleDirty?void 0:t.due||void 0);i===this.previewRequest&&(this.preview=n.dues)}catch{i===this.previewRequest&&(this.preview=[],this.previewError=a("app.preview_load_error"))}finally{i===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}scheduleText(){let e=this.hass?.states?.[this.problemSensor]?.attributes?.friendly_name||this.problemSensor;return ce({type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:this.scheduleWeekdays,day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime,sensorName:e},this.hass?.locale?.language)}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),s=this.notificationRoute.trim();if(e||(this.nameError=a("app.name_required")),s&&(!s.startsWith("/")||s.startsWith("//"))&&(this.notificationRouteError=a("app.route_invalid")),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await Ct(this.hass,this.task.id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:s}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(i){return this.saveError=D(i),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return d;let e=d;return this.scheduleUnit==="weekly"?e=o`
        <p class="selector-label">${a("task.schedule_weekdays")}</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,s)=>o`
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
          label=${a("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${Wt()}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${y}>
      `:this.scheduleUnit==="yearly"&&(e=g`
        <div class="row">
          <${y}
            label=${a("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${Wt()}
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
      <${P}
        label=${a("task.time")}
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${P}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return d;if(this.previewLoading&&!this.preview.length)return o`<p class="hint" aria-live="polite">
        ${a("app.loading_preview")}
      </p>`;if(this.previewError)return o`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return o`
        <p class="selector-label">${a("task.first_due")}</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return o`
      <p class="selector-label">${a("task.preview_task_dues")}</p>
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
    `}renderPlanning(){return this.scheduleType==="sensor"?g`
        <div class="planning">
          <${y}
            label=${a("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${jt()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${y}>
          <div
            class="selector-field"
            role="group"
            aria-label=${a("task.problem_sensor")}
          >
            <span class="selector-label">${a("task.problem_sensor")}</span>
            <${$}
              .hass=${this.hass}
              .data=${{problemSensor:this.problemSensor}}
              .schema=${[{name:"problemSensor",selector:{entity:{filter:{domain:"binary_sensor"}}}}]}
              .computeLabel=${()=>""}
              .disabled=${this.saving}
              @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail.value.problemSensor||""})}
            ></${$}>
          </div>
          ${this.scheduleError?o`<p class="error" role="alert">${this.scheduleError}</p>`:d}
          <p class="hint">
            ${a("schedule.problem_sensor_description")}
          </p>
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
          <${P}
            label=${a("app.every")}
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${P}>
          <${y}
            label=${a("app.unit")}
            .value=${this.scheduleUnit}
            .options=${ks()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${y}>
        </div>
        ${this.renderFixedOptions()}
        <p class="hint">${this.scheduleText()}</p>
        ${this.scheduleError?o`<p class="error" role="alert">${this.scheduleError}</p>`:d}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return o`<p class="hint" aria-live="polite">
        ${a("app.loading_assignments")}
      </p>`;if(this.assignmentError)return o`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:a("task.unassigned"),value:""},...this.users.map(s=>({label:s.name,value:s.id}))],t=[{label:a("task.no_nfc_tag"),value:""},...this.tags.map(s=>({label:s.name||s.id,value:s.id}))];return g`
      <div class="planning">
        <${y}
          label=${a("task.user")}
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.assigneeId=s.detail})}
        ></${y}>
        <${y}
          label=${a("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${s=>this.assignmentChanged(()=>{this.nfcTagId=s.detail})}
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
            @value-changed=${s=>{this.icon=s.detail.value.icon||""}}
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
            @value-changed=${s=>this.assignmentChanged(()=>{this.labelIds=s.detail.value.labels||[]})}
          ></${$}>
        </div>
      </div>
    `}renderNotification(){return this.notificationLoading?o`<p class="hint" aria-live="polite">
        ${a("app.loading_notifications")}
      </p>`:this.notificationError?o`<p class="error" role="alert">${this.notificationError}</p>`:g`
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
        ${this.notificationRouteError?o`<p class="error" role="alert">
              ${this.notificationRouteError}
            </p>`:d}
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
    `}toggleId(e,t){return t.includes(e)?t.filter(s=>s!==e):[...t,e]}stageFiles(e){this.saving||(this.stagedFiles=[...this.stagedFiles,...Array.from(e)])}renderAttachments(){return o`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?o`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.id);return o`
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
                        .icon=${ee(e.name,e.type)}
                      ></ha-icon>
                      <span class="record-copy">
                        <span class="record-title file-name">${e.name}</span>
                        <span class="record-detail"
                          >${te(e.size)} ·
                          ${a("app.new_file")}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${a("app.remove_new_file",{name:e.name})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((s,i)=>i!==t)}}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </button>
                    </li>
                  `)}
              </ul>
            `:o`<p class="hint">${a("task.no_files")}.</p>`}
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
    `}renderHistory(){return this.historyLoading?o`<p class="hint" aria-live="polite">
        ${a("app.loading_history")}
      </p>`:this.historyError?o`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?o`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.id),s=e.notes==="tasks.history.completed_via_nfc"?a("history.completed_via_nfc"):e.notes||a("app.no_notes");return o`
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
                <span class="record-detail">${s}</span>
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
    `:o`<p class="hint">${a("task.no_history")}.</p>`}planningWarning(){return this.scheduleError?!0:this.scheduleType!=="sensor"||!this.problemSensor.startsWith("binary_sensor.")?!1:N(this.hass,{type:"sensor",entity_id:this.problemSensor})!=="available"}render(){return g`
      <form @submit=${e=>e.preventDefault()}>
        <${P}
          label=${a("task.name")}
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${P}>
        <${P}
          label=${a("task.optional_description")}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${P}>
        <${T}
          heading=${a("task.planning")}
          .warning=${this.planningWarning()}
        >
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
        ${this.task?.id?g`
              <${T} heading=${a("task.history")}>
                ${this.renderHistory()}
              </${T}>
            `:d}
        ${this.saveError?o`<p class="error" role="alert">${this.saveError}</p>`:d}
      </form>
    `}},We=v("task-form");customElements.get(We)||customElements.define(We,je);var Ke=async(r,e,t=[])=>{let s=e||{id:"",name:"",active:!0,schedule:{type:"sliding",unit:"monthly",interval:1},notification:{device_ids:[],persistent:!1,critical:!1,route:null},due:null,completions:[],attachments:[]},i=document.createElement(We);return i.configure(r,s,t),await x({heading:e?a("task.edit"):a("task.new"),content:i,actions:[{label:a("common.save"),value:"save",run:()=>i.save()}]})==="save"};var qe=class extends f{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=b`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),n=window.visualViewport,l=n?.offsetLeft||0,u=n?.offsetTop||0,h=l+(n?.width||window.innerWidth),p=u+(n?.height||window.innerHeight),c=8,m=4,_=Math.min(Math.max(l+c,s.right-i.width),h-i.width-c),w=s.bottom+m,H=w+i.height<=p-c?w:Math.max(u+c,s.top-i.height-m);t.style.left=`${_}px`,t.style.top=`${H}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return o`
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
    `}},he=v("action-menu");customElements.get(he)||customElements.define(he,qe);var Kt="tasks-table-state-v2",qt="tasks-table-session-v1",ge=[{value:"due",label:"task.due"},{value:"assignee",label:"table.assignee"},{value:"nfc",label:"task.nfc_tag_id"},{value:"files",label:"task.files"},{value:"labels",label:"task.labels"},{value:"notifications",label:"table.notifications"},{value:"trigger",label:"table.recurrence"},{value:"status",label:"app.status"}],ue=Object.fromEntries(ge.map(r=>[r.value,r.label])),ws={assignee:"task.assignment",labels:"task.labels",notifications:"table.notifications",trigger:"table.recurrence",status:"app.status",due:"task.due"},Ge={due:!0,assignee:!0,nfc:!0,files:!0,labels:!1,notifications:!1,trigger:!1,status:!1},pe=()=>({assignee:[],labels:[],notifications:[],trigger:[],status:[],due:[]}),Ze=Object.keys(pe()),fe=[{value:"fixed",label:"task.fixed"},{value:"sliding",label:"task.sliding"},{value:"sensor",label:"task.problem_sensor"}],be=[{value:"active",label:"app.active"},{value:"paused",label:"app.paused"}],ve=[{value:"overdue",label:"table.due_overdue"},{value:"today",label:"table.due_today"},{value:"tomorrow",label:"table.due_tomorrow"},{value:"next_7_days",label:"table.due_next_7_days"},{value:"next_30_days",label:"table.due_next_30_days"}],Je=(r,e)=>{let t=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}).formatToParts(new Date(r)),s=i=>t.find(n=>n.type===i)?.value||"";return`${s("year")}-${s("month")}-${s("day")}`},Gt=(r,e)=>{let[t,s,i]=Je(r,e).split("-").map(Number);return Math.floor(Date.UTC(t,s-1,i)/864e5)},Zt=(r,e)=>{try{let t=globalThis[r],s=JSON.parse(t?.getItem(e)||"{}");return s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{return{}}},Jt=k(he),xs=r=>[{label:a("menu.edit"),value:"edit",icon:"mdi:pencil-outline"},{label:r.active===!1?a("app.resume"):a("app.pause"),value:"active",icon:r.active===!1?"mdi:play-circle-outline":"mdi:pause-circle-outline"},{label:a("common.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Ts=r=>[{label:a("bulk.complete"),value:"complete",icon:"mdi:check-circle-outline"},{label:a("app.pause"),value:"pause",icon:"mdi:pause-circle-outline"},{label:a("app.resume"),value:"resume",icon:"mdi:play-circle-outline"},{label:a("bulk.assign_person"),value:"assign",icon:"mdi:account-outline"},...r.some(e=>e.assignee_id)?[{label:a("bulk.remove_assignment"),value:"unassign",icon:"mdi:account-off-outline"}]:[],{label:a("app.add_label"),value:"add-label",icon:"mdi:tag-plus-outline"},{label:a("app.remove_label"),value:"remove-label",icon:"mdi:tag-minus-outline"},{label:a("app.add_notification"),value:"add-notification",icon:"mdi:bell-plus-outline"},{label:a("app.remove_notification"),value:"remove-notification",icon:"mdi:bell-minus-outline"},{label:a("bulk.delete"),value:"delete",icon:"mdi:delete-outline",destructive:!0}],Qe=class extends f{static properties={hass:{attribute:!1},tasks:{attribute:!1},compact:{type:Boolean,reflect:!0},showBulkSelection:{attribute:!1},showIcon:{attribute:!1},showAddTask:{attribute:!1},showHeader:{attribute:!1},showFilters:{attribute:!1},configuredFilters:{attribute:!1},showColumns:{attribute:!1},configuredColumns:{attribute:!1},now:{attribute:!1},showSearch:{attribute:!1},showActionMenu:{attribute:!1},search:{state:!0},filters:{state:!0},openFilterGroups:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},openBulkPicker:{state:!0},openToolbarPanel:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=b`
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
  `;registryConnection;closePanels=e=>{let t=e.composedPath();for(let s of this.renderRoot.querySelectorAll("details[open]"))t.includes(s)||s.removeAttribute("open");t.some(s=>s instanceof HTMLElement&&s.classList.contains("toolbar-popover"))||(this.openToolbarPanel="")};constructor(){super();let e=Zt("localStorage",Kt),t=Zt("sessionStorage",qt);this.tasks=[],this.compact=!1,this.showBulkSelection=!0,this.showIcon=!0,this.showAddTask=!1,this.showHeader=!0,this.showFilters=!0,this.configuredFilters=void 0,this.showColumns=!0,this.configuredColumns=void 0,this.now=void 0,this.showSearch=!0,this.showActionMenu=!0,this.search=typeof t.search=="string"?t.search:"";let s=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys(pe()).map(n=>[n,Array.isArray(s[n])?s[n].filter(l=>typeof l=="string"):[]])),this.openFilterGroups=[];let i=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(Ge).map(n=>[n,typeof i[n]=="boolean"?i[n]:Ge[n]])),this.users=[],this.labels=[],this.tags=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.openBulkPicker="",this.openToolbarPanel="",this.bulkBusy=!1,this.bulkError=""}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.closePanels)}disconnectedCallback(){document.removeEventListener("click",this.closePanels),super.disconnectedCallback()}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[s,i]=await Promise.allSettled([U(e),ne(e)]);this.registryConnection===t&&(s.status==="fulfilled"&&(this.users=s.value.users,this.labels=s.value.labels,this.tags=s.value.tags),i.status==="fulfilled"&&(this.devices=i.value),(s.status==="rejected"||i.status==="rejected")&&(this.registryError=a("app.registry_load_error")))}trigger(e){return e.schedule.type==="sensor"?a("task.problem_sensor"):e.schedule.type==="fixed"?a("task.fixed"):a("task.sliding")}status(e){return e.active===!1?a("app.paused"):a("app.active")}problemSensorStatus(e){return e.schedule.type==="sensor"?N(this.hass,e.schedule):void 0}problemSensorWarning(e){let t=this.problemSensorStatus(e);if(!t||t==="available")return d;let s=a(`problem.sensor_${t}`,{entity_id:e.schedule.type==="sensor"?e.schedule.entity_id:""});return o`
      <span class="sensor-warning" title=${s} aria-label=${s}>
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </span>
    `}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||"\u2014"}nfcTag(e){return e.nfc_tag_id?this.tags.find(t=>t.id===e.nfc_tag_id)?.name||e.nfc_tag_id:"\u2014"}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(s=>t.has(s.label_id)).sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification.device_ids||[]);return this.devices.filter(s=>t.has(s.id)).sort((s,i)=>this.deviceName(s).localeCompare(this.deviceName(i),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification.persistent?[a("task.notification_persistent")]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="due"){if(!e.due)return[];let s=this.hass?.config?.time_zone,i=Gt(e.due,s)-Gt(this.now||new Date,s);return[...i<0?["overdue"]:[],...i===0?["today"]:[],...i===1?["tomorrow"]:[],...i>=0&&i<7?["next_7_days"]:[],...i>=0&&i<30?["next_30_days"]:[]]}if(t==="assignee")return[this.users.find(i=>i.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let s=this.taskLabels(e).map(i=>i.label_id);return s.length?s:["__none__"]}if(t==="notifications"){let s=[...e.notification.persistent?["panel"]:[],...this.notificationDevices(e).map(i=>i.id)];return s.length?s:["__none__"]}return t==="status"?[e.active===!1?"paused":"active"]:[e.schedule.type]}filterLabel(e,t){if(t==="__none__")return e==="assignee"?a("task.unassigned"):e==="labels"?a("task.no_labels"):a("app.no_notifications");if(e==="assignee")return this.users.find(i=>i.id===t)?.name||t;if(e==="labels")return this.labels.find(i=>i.label_id===t)?.name||t;if(e==="notifications")return t==="panel"?a("task.notification_persistent"):this.deviceName(this.devices.find(i=>i.id===t));if(e==="status"){let i=be.find(n=>n.value===t);return i?a(i.label):t}let s=fe.find(i=>i.value===t);return s?a(s.label):t}filterOptions(e){return e==="due"?ve.map(s=>({value:s.value,label:a(s.label)})):[...new Set(this.tasks.flatMap(s=>this.filterValues(s,e)))].map(s=>({value:s,label:this.filterLabel(e,s)})).sort((s,i)=>s.label.localeCompare(i.label,this.hass?.locale?.language))}activeFilters(){return this.configuredFilters?{...pe(),...this.configuredFilters}:this.filters}matchesFilters(e,t){return Ze.every(s=>{let i=t[s];return!i.length||this.filterValues(e,s).some(n=>i.includes(n))})}dueValue(e){if(e.active===!1||!e.due)return;let t=Date.parse(e.due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);if(t===void 0){let s=this.problemSensorStatus(e);return s&&s!=="available"?a(`problem.sensor_${s}_short`):e.active!==!1&&e.schedule.type==="sensor"&&!e.due?a("table.waiting"):"\u2014"}return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}dueStatus(e){if(e.active===!1||this.dueValue(e)===void 0)return"";let t=this.hass?.config?.time_zone,s=Je(e.due,t),i=Je(new Date,t);return s<i?"due-overdue":s===i?"due-today":""}rowClass(e){return e.active===!1?"inactive":this.dueStatus(e)}sortGroup(e){return e.active===!1?2:e.schedule.type==="sensor"&&!e.due?1:0}compareDue(e,t){let s=this.sortGroup(e)-this.sortGroup(t);if(s)return s;let i=this.dueValue(e),n=this.dueValue(t);if(i===void 0||n===void 0){if(i!==n)return i===void 0?1:-1}else if(i!==n)return i-n;return e.name.localeCompare(t.name,this.hass?.locale?.language)}visibleTasks(){let e=this.showSearch?this.search.trim().toLocaleLowerCase(this.hass?.locale?.language):"",t=this.activeFilters();return this.tasks.filter(s=>this.matchesFilters(s,t)&&(!e||[s.name,s.description,this.assignee(s),this.nfcTag(s),this.taskLabels(s).map(i=>i.name).join(" "),this.notificationDevices(s).map(i=>this.deviceName(i)).join(" "),this.trigger(s),this.status(s)].some(i=>i?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((s,i)=>this.compareDue(s,i))}toggleFilter(e,t,s){let i=this.filters[e];this.filters={...this.filters,[e]:s?[...new Set([...i,t])]:i.filter(n=>n!==t)},this.retainVisibleSelection(),this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}resetColumns(){this.columns=this.configuredColumns?Object.fromEntries(Object.keys(ue).map(e=>[e,this.configuredColumns.includes(e)])):{...Ge},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(Kt,JSON.stringify({columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(qt,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="files"?String(e.attachments.length):t==="nfc"?this.nfcTag(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}columnValue(e,t){let s=this.columnText(e,t);return t==="due"&&s!=="\u2014"&&this.hass&&e.due?o`
        <ha-relative-time
          .hass=${this.hass}
          .datetime=${e.due}
          capitalize
          title=${s}
        ></ha-relative-time>
      `:t==="status"?o`<span class="status">${s}</span>`:s}mobileDetails(e){return this.visibleColumnKeys().filter(s=>this.columnText(e,s)!=="\u2014").map((s,i)=>o`
        ${i?o`<span aria-hidden="true"> · </span>`:d}
        ${this.columnValue(e,s)}
      `)}visibleColumnKeys(){return this.configuredColumns??Object.keys(this.columns).filter(e=>this.columns[e])}visibleColumnCount(){return this.visibleColumnKeys().length+1+Number(this.showIcon)+Number(this.showBulkSelection)+Number(this.showActionMenu)}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.id))}visibleSelectedTasks(){let e=new Set(this.selectedIds);return this.visibleTasks().filter(t=>e.has(t.id))}retainVisibleSelection(){let e=new Set(this.visibleTasks().map(t=>t.id));this.selectedIds=this.selectedIds.filter(t=>e.has(t))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(s=>s!==e)}toggleVisible(e,t){let s=new Set(this.selectedIds);for(let i of e)t?s.add(i.id):s.delete(i.id);this.selectedIds=[...s]}bulkTargets(){return this.bulkAction==="assign"?this.users.map(e=>({value:e.id,label:e.name})):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:a("task.notification_persistent")},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkActionDestructive(){return["delete","remove-label","remove-notification"].includes(this.bulkAction)}bulkActionLabel(){return this.bulkAction==="complete"?a("bulk.complete"):this.bulkAction==="pause"?a("app.pause"):this.bulkAction==="resume"?a("app.resume"):this.bulkAction==="assign"?a("app.assign"):this.bulkAction==="unassign"?a("bulk.remove_assignment"):this.bulkAction==="add-label"||this.bulkAction==="add-notification"?a("app.add"):this.bulkAction==="remove-label"||this.bulkAction==="remove-notification"?a("common.remove"):this.bulkAction==="delete"?a("common.delete"):a("app.apply")}bulkTargetLabel(){return this.bulkAction==="assign"?a("app.choose_person"):this.bulkAction==="add-label"||this.bulkAction==="remove-label"?a("app.choose_label"):a("app.choose_notification")}bulkTargetIcon(){return this.bulkAction==="assign"?"mdi:account-outline":this.bulkAction==="add-label"||this.bulkAction==="remove-label"?"mdi:tag-outline":"mdi:bell-outline"}bulkOperations(){return this.visibleSelectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",id:e.id,notes:null};if(this.bulkAction==="delete")return{action:"delete",id:e.id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget};else if(this.bulkAction==="unassign")t={assignee_id:null};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let s=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}else{let s=e.notification.device_ids||[];this.bulkTarget==="panel"?t={notification:{...e.notification,persistent:this.bulkAction==="add-notification"}}:t={notification:{...e.notification,device_ids:this.bulkAction==="remove-notification"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}}return{action:"update",id:e.id,changes:t}})}renderBulkPicker(e,t,s,i,n,l){let u=t.find(p=>p.value===s),h=this.openBulkPicker===e;return o`
      <div class=${h?"bulk-action-picker open":"bulk-action-picker"}>
        <button
          class="bulk-action-picker-trigger"
          type="button"
          aria-expanded=${h?"true":"false"}
          @click=${()=>{this.openBulkPicker=h?"":e}}
        >
          <ha-icon .icon=${u?.icon||n}></ha-icon>
          <span>${u?.label||i}</span>
          <ha-icon
            class="picker-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="bulk-action-content">
          <div class="bulk-action-list">
            ${t.map(p=>o`
                <button
                  class=${["bulk-action",s===p.value?"selected":"",p.destructive?"destructive":""].filter(Boolean).join(" ")}
                  type="button"
                  @click=${()=>{l(p.value),this.openBulkPicker=""}}
                >
                  ${p.icon?o`<ha-icon .icon=${p.icon}></ha-icon>`:d}
                  <span>${p.label}</span>
                </button>
              `)}
          </div>
        </div>
      </div>
    `}renderBulkMenu(e){let t=this.bulkTargets(),s=Ts(e),i=this.bulkTargetIcon(),n=t.map(l=>({...l,icon:i}));return o`
      <details
        class="bulk-menu"
        @toggle=${l=>{l.currentTarget.open||(this.openBulkPicker="")}}
      >
        <summary>${a("bulk.actions")} (${e.length})</summary>
        <div class="popover-panel">
          <div class="bulk-bar">
            ${this.renderBulkPicker("action",s,this.bulkAction,a("app.choose_action"),"mdi:gesture-tap-button",l=>{this.bulkAction=l,this.bulkTarget="",this.bulkError=""})}
            ${t.length?this.renderBulkPicker("target",n,this.bulkTarget,this.bulkTargetLabel(),i,l=>{this.bulkTarget=l}):d}
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
    `}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await x({heading:t?a("bulk.delete_title"):a("bulk.complete_title"),content:o`<p>
          ${t?a("bulk.delete_confirm",{count:e.length}):a("bulk.complete_confirm",{count:e.length})}
        </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:t?a("common.delete"):a("app.complete"),value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await Dt(this.hass,e);let t=new Set(e.map(s=>s.id));this.selectedIds=this.selectedIds.filter(s=>!t.has(s)),this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=D(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return this.showFilters?Ze.reduce((e,t)=>e+this.filters[t].length,0):0}filterGroup(e,t){let s=this.filters[t].length,i=this.openFilterGroups.includes(t);return o`
      <div class=${i?"filter-category open":"filter-category"}>
        <button
          class="filter-category-heading"
          type="button"
          aria-expanded=${i?"true":"false"}
          @click=${()=>{this.openFilterGroups=i?this.openFilterGroups.filter(n=>n!==t):[...this.openFilterGroups,t]}}
        >
          <span>${e}</span>
          ${s?o`<span class="filter-category-count">
                (${s})
              </span>`:d}
          <ha-icon
            class="filter-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="filter-category-content">
          <fieldset>
            ${this.filterOptions(t).map(n=>{let l=this.filters[t].includes(n.value);return o`
                <button
                  class=${l?"option-row active":"option-row"}
                  type="button"
                  aria-pressed=${l}
                  @click=${()=>this.toggleFilter(t,n.value,!l)}
                >
                  <span>${n.label}</span>
                  ${l?o`<ha-icon icon="mdi:check"></ha-icon>`:d}
                </button>
              `})}
          </fieldset>
        </div>
      </div>
    `}open(e){this.dispatchEvent(new CustomEvent("tasks-task-open",{bubbles:!0,composed:!0,detail:e}))}action(e,t){this.dispatchEvent(new CustomEvent("tasks-task-action",{bubbles:!0,composed:!0,detail:{action:t,task:e}}))}columnHeader(e){return o`
      <th class=${`${e}-column`}>${a(ue[e])}</th>
    `}columnCell(e,t){return o`
      <td class=${`${t}-column`}>
        ${this.columnValue(e,t)}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),s=this.visibleColumnKeys(),i=this.showBulkSelection?this.selectedTasks():[],n=new Set(this.showBulkSelection?this.selectedIds:[]),l=e.length>0&&e.every(c=>n.has(c.id)),u=e.some(c=>n.has(c.id)),h=this.showSearch||this.showAddTask||this.showFilters||this.showColumns||i.length>0,p=this.showAddTask&&!this.showSearch&&!this.showFilters&&!this.showColumns&&i.length===0;return g`
      ${h?o`
            <div class="toolbar">
              ${this.showSearch||this.showAddTask||i.length?o`
                    <div class="selection-toolbar">
                      ${this.showSearch?o`
                            <input
                              class="search"
                              type="search"
                              aria-label=${a("table.search")}
                              placeholder=${a("table.search")}
                              .value=${this.search}
                              @input=${c=>{this.search=c.currentTarget.value,this.retainVisibleSelection(),this.storeSessionView()}}
                            >
                          `:d}
                      ${this.showAddTask?o`
                            <button
                              class=${p?"toolbar-button full-width":"toolbar-button"}
                              type="button"
                              @click=${()=>this.dispatchEvent(new CustomEvent("tasks-task-add",{bubbles:!0,composed:!0}))}
                            >
                              ${a("card.add_task")}
                            </button>
                          `:d}
                      ${i.length?this.renderBulkMenu(i):d}
                    </div>
                  `:d}
              ${this.showFilters?o`
                    <div class="toolbar-popover">
                      <button
                        class=${this.openToolbarPanel==="filters"?"toolbar-button active":"toolbar-button"}
                        type="button"
                        aria-expanded=${this.openToolbarPanel==="filters"}
                        @click=${()=>{this.openToolbarPanel=this.openToolbarPanel==="filters"?"":"filters"}}
                      >
                        ${a("table.filters")}${t?` (${t})`:""}
                      </button>
                      ${this.openToolbarPanel==="filters"?o`
                            <div class="popover-panel filter-panel">
                              <div class="filter-grid">
                                ${Ze.map(c=>this.filterGroup(a(ws[c]),c))}
                              </div>
                              <div class="filter-footer">
                                ${this.registryError?o`<p class="registry-error">
                                      ${this.registryError}
                                    </p>`:d}
                                <ha-button
                                  appearance="plain"
                                  variant="neutral"
                                  @click=${()=>{this.filters=pe(),this.storeSessionView()}}
                                >
                                  ${a("table.reset_filters")}
                                </ha-button>
                              </div>
                            </div>
                          `:d}
                    </div>
                  `:d}
              ${this.showColumns?o`
                    <div class="toolbar-popover">
                      <button
                        class=${this.openToolbarPanel==="columns"?"toolbar-button active":"toolbar-button"}
                        type="button"
                        aria-expanded=${this.openToolbarPanel==="columns"}
                        @click=${()=>{this.openToolbarPanel=this.openToolbarPanel==="columns"?"":"columns"}}
                      >
                        ${a("table.columns")}
                      </button>
                      ${this.openToolbarPanel==="columns"?o`
                            <div class="popover-panel column-panel">
                              <div class="column-options">
                                ${Object.keys(ue).map(c=>o`
                                    <button
                                      class=${this.columns[c]?"option-row active":"option-row"}
                                      type="button"
                                      aria-pressed=${this.columns[c]}
                                      @click=${()=>this.toggleColumn(c,!this.columns[c])}
                                    >
                                      <span>${a(ue[c])}</span>
                                      ${this.columns[c]?o`<ha-icon
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
                                  ${a("table.reset_columns")}
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
          ${this.showHeader?o`
                <thead>
                  <tr>
                    ${this.showBulkSelection?o`
                          <th class="selection">
                            <ha-checkbox
                              aria-label=${a("app.select_visible")}
                              .checked=${l}
                              .indeterminate=${u&&!l}
                              @change=${c=>this.toggleVisible(e,c.currentTarget.checked)}
                            ></ha-checkbox>
                          </th>
                        `:d}
                    ${this.showIcon?o`<th class="icon" aria-hidden="true"></th>`:d}
                    <th>${a("table.task")}</th>
                    ${s.map(c=>this.columnHeader(c))}
                    ${this.showActionMenu?o`<th
                          class="actions"
                          aria-label=${a("task.actions")}
                        ></th>`:d}
                  </tr>
                </thead>
              `:d}
          <tbody>
            ${e.length?e.map(c=>g`
                    <tr
                      class=${this.rowClass(c)}
                      aria-selected=${n.has(c.id)}
                      @click=${()=>this.open(c)}
                    >
                      ${this.showBulkSelection?o`
                            <td
                              class="selection"
                              @click=${m=>m.stopPropagation()}
                            >
                              <ha-checkbox
                                aria-label=${a("app.select_task",{name:c.name})}
                                .checked=${n.has(c.id)}
                                @change=${m=>this.toggleTask(c.id,m.currentTarget.checked)}
                              ></ha-checkbox>
                            </td>
                          `:d}
                      ${this.showIcon?o`
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
                              <${Jt}
                                label=${a("app.actions_for",{name:c.name})}
                                .items=${xs(c)}
                                @tasks-action=${m=>this.action(c,m.detail)}
                              ></${Jt}>
                            </td>
                          `:d}
                    </tr>
                  `):o`
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
  `;constructor(){super(),this.tone="default"}render(){return o`<span><slot></slot></span>`}},ye=v("pill");customElements.get(ye)||customElements.define(ye,Xe);var j=k(z),E=k(ye),Qt=k(V),Ye=class extends f{static properties={attachment:{attribute:!1},url:{}};static styles=b`
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
    </a>`}},et=v("attachment-preview");customElements.get(et)||customElements.define(et,Ye);var tt=class extends f{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},historyError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0}};static styles=b`
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
      padding: 10px 12px;
      background: var(--secondary-background-color);
      border-radius: 10px;
      line-height: 1.45;
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
      background: var(--primary-background-color);
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
  `;hass;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.historyError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1}configure(e,t,s=[]){this.hass=e,this.task=t,this.attachments=[...t.attachments],this.loadDetails()}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.historyError="",this.attachmentError="";let[e,t,s]=await Promise.allSettled([U(this.hass),oe(this.hass,this.task.id),Pt(this.hass,this.task.id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError=a("app.assignment_load_error"),t.status==="fulfilled"?this.history=Array.isArray(t.value.history)?t.value.history:[]:this.historyError=a("app.history_load_error"),s.status==="fulfilled"?this.signedFiles=s.value.signed_files||{}:this.attachmentError=a("app.attachment_load_error"),this.loading=!1}formatDate(e){if(!e)return a("app.not_scheduled");let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}renderInline(e){let t=[],s=/(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g,i=0;for(let n of e.matchAll(s)){let l=n.index??0;if(l>i&&t.push(e.slice(i,l)),n[2])t.push(o`<strong>${n[2]}</strong>`);else if(n[3])t.push(o`<em>${n[3]}</em>`);else if(n[4])t.push(o`<code>${n[4]}</code>`);else if(n[5]&&n[6]){let u=n[6];t.push(/^(?:https?:|mailto:|\/|#)/.test(u)?o`<a href=${u} target="_blank" rel="noopener"
                >${n[5]}</a
              >`:n[5])}i=l+n[0].length}return i<e.length&&t.push(e.slice(i)),t}renderDescription(){let e=(this.task.description||"").split(/\r?\n/);if(!e.some(s=>s.trim()))return o`<p class="hint">${a("task.no_description")}.</p>`;let t=[];for(let s=0;s<e.length;){let i=e[s];if(!i.trim())s+=1;else if(i.startsWith("- ")){let n=[];for(;e[s]?.startsWith("- ");)n.push(e[s].slice(2)),s+=1;t.push(o`<ul>
            ${n.map(l=>o`<li>${this.renderInline(l)}</li>`)}
          </ul>`)}else if(/^\d+\. /.test(i)){let n=[];for(;/^\d+\. /.test(e[s]||"");)n.push(e[s].replace(/^\d+\. /,"")),s+=1;t.push(o`<ol>
            ${n.map(l=>o`<li>${this.renderInline(l)}</li>`)}
          </ol>`)}else{let n=/^(#{1,2})\s+(.+)$/.exec(i);t.push(n?n[1].length===1?o`<h3>${this.renderInline(n[2])}</h3>`:o`<h4>${this.renderInline(n[2])}</h4>`:i.startsWith("> ")?o`<blockquote>${this.renderInline(i.slice(2))}</blockquote>`:o`<p>${this.renderInline(i)}</p>`),s+=1}}return t}async openAttachment(e){let t=this.signedFiles[e.id];if(!t)return;let s=document.createElement(et);s.attachment=e,s.url=t,await x({heading:e.filename,content:s,width:"large"})}async complete(){if(!this.hass||this.completing||await x({heading:a("task.complete_title"),content:o`<p>
        ${a("task.complete_confirm",{name:this.task.name})}
      </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("app.complete"),value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await It(this.hass,this.task.id,this.completionNotes),!0}catch(t){return this.completionError=D(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(i=>i.id===this.task.assignee_id)?.name,t=this.tags.find(i=>i.id===this.task.nfc_tag_id),s=(this.task.label_ids||[]).map(i=>this.labels.find(n=>n.label_id===i)).filter(i=>!!i);return g`
      <div class="pills">
        ${this.task.due?g`<${E}>
              <ha-icon icon="mdi:calendar"></ha-icon>
              ${this.formatDate(this.task.due)}
            </${E}>`:d}
        ${e?g`<${E}>
              <ha-icon icon="mdi:account-outline"></ha-icon>
              ${e}
            </${E}>`:d}
        ${this.attachments.length?g`<${E}
              title=${a(this.attachments.length===1?"app.file_count_one":"app.file_count_many",{count:this.attachments.length})}
            >
              <ha-icon icon="mdi:paperclip"></ha-icon>
              ${this.attachments.length}
            </${E}>`:d}
        ${t?g`<${E}>
              <ha-icon icon="mdi:nfc"></ha-icon>
              ${t.name||t.id}
            </${E}>`:d}
        ${s.length?o`<span class="pill-break"></span>`:d}
        ${s.map(i=>g`<${E}>
              <ha-icon icon="mdi:tag-outline"></ha-icon>
              ${i.name}
            </${E}>`)}
      </div>
    `}planningWarning(){return this.task.schedule.type==="sensor"&&N(this.hass,this.task.schedule)!=="available"}scheduleText(){return ce(this.task.schedule,this.hass?.locale?.language)}renderPlanning(){let e=this.task.schedule,t=e.type==="sensor"?this.hass?.states?.[e.entity_id]:void 0,s=t?.attributes?.friendly_name,i=e.type==="sensor"?N(this.hass,e):void 0;return o`
      <dl class="planning-details">
        <dt>${a("task.recurrence_calculation")}</dt>
        <dd>${e.type==="sensor"?a("task.problem_sensor"):e.type==="fixed"?a("task.fixed"):a("task.sliding")}</dd>
        <dt>${a("task.planning")}</dt>
        <dd>${this.scheduleText()}</dd>
        ${e.type==="sensor"?o`
              <dt>${a("task.problem_sensor")}</dt>
              <dd>
                ${s?`${s} \xB7 `:""}${e.entity_id}
              </dd>
              <dt>${a("app.status")}</dt>
              <dd class=${i==="available"?"":"unavailable"}>
                ${t?o`
                      <button
                        class="entity-state ${i==="available"?"":"unavailable"}"
                        type="button"
                        @click=${()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.entity_id},bubbles:!0,composed:!0}))}
                      >
                        ${this.hass?.formatEntityState(t)??t.state}
                      </button>
                    `:a("problem.sensor_missing_short")}
              </dd>
            `:d}
      </dl>
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
    `:o`<p class="hint">${a("task.no_history")}.</p>`}render(){return g`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading?o`<p class="hint" aria-live="polite">
              ${a("app.loading_details")}
            </p>`:d}
        ${this.assignmentError?o`<p class="error" role="alert">${this.assignmentError}</p>`:d}
        <${j}
          heading=${a("task.planning")}
          .warning=${this.planningWarning()}
        >
          ${this.renderPlanning()}
        </${j}>
        <${j} heading=${a("task.files")}>
          ${this.renderAttachments()}
        </${j}>
        <${j} heading=${a("task.history")}>
          ${this.renderHistory()}
        </${j}>
        <${Qt}
          label=${a("task.completion_notes")}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${Qt}>
        ${this.completionError?o`<p class="error" role="alert">${this.completionError}</p>`:d}
      </div>
    `}},st=v("task-viewer");customElements.get(st)||customElements.define(st,tt);var Xt=async(r,e,t=[])=>{let s=document.createElement(st);return s.configure(r,e,t),await x({heading:e.name,content:s,actions:[{label:a("app.complete"),value:"complete",run:()=>s.complete()}]})==="complete"};var W="tasks-card",Yt=k(me),es=["due","assignee"],ts=()=>({type:`custom:${W}`,show_bulk_selection:!1,show_search:!0,show_action_menu:!1,show_icon:!0,show_add_task:!0,show_header:!1,filter_assignees:[],filter_current_user:!1,filter_unassigned:!1,filter_labels:[],filter_no_labels:!1,filter_notifications:[],filter_persistent:!1,filter_no_notifications:!1,filter_triggers:[],filter_statuses:[],filter_due:[],columns:[...es]}),Es=()=>{let{type:r,...e}=ts();return e},$e=(r,e,t)=>Array.isArray(r)?r.filter((s,i,n)=>typeof s=="string"&&e.some(l=>l.value===s)&&n.indexOf(s)===i):[...t],it=r=>Array.isArray(r)?r.filter((e,t,s)=>typeof e=="string"&&s.indexOf(e)===t):[],As=r=>({type:r.type||`custom:${W}`,show_bulk_selection:r.show_bulk_selection===!0,show_search:r.show_search!==!1,show_action_menu:r.show_action_menu===!0,show_icon:r.show_icon!==!1,show_add_task:r.show_add_task!==!1,show_header:r.show_header===!0,filter_assignees:it(r.filter_assignees),filter_current_user:r.filter_current_user===!0,filter_unassigned:r.filter_unassigned===!0,filter_labels:it(r.filter_labels),filter_no_labels:r.filter_no_labels===!0,filter_notifications:it(r.filter_notifications),filter_persistent:r.filter_persistent===!0,filter_no_notifications:r.filter_no_notifications===!0,filter_triggers:$e(r.filter_triggers,fe,[]),filter_statuses:$e(r.filter_statuses,be,[]),filter_due:$e(r.filter_due,ve,[]),columns:$e(r.columns,ge,es)}),rt=class extends f{static properties={hass:{attribute:!1},config:{state:!0},snapshot:{state:!0},error:{state:!0}};static styles=b`
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
  `;connection;unsubscribe;language;static getStubConfig(){return Es()}static getConfigForm(){return{schema:[{type:"expandable",name:"",title:a("card.options"),flatten:!0,schema:[{name:"show_bulk_selection",selector:{boolean:{}}},{name:"show_search",selector:{boolean:{}}},{name:"show_action_menu",selector:{boolean:{}}},{name:"show_icon",selector:{boolean:{}}},{name:"show_add_task",selector:{boolean:{}}},{name:"show_header",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("card.filter"),flatten:!0,schema:[{type:"expandable",name:"",title:a("task.assignment"),flatten:!0,schema:[{name:"filter_assignees",selector:{entity:{multiple:!0,filter:[{domain:"person"}]}}},{name:"filter_unassigned",selector:{boolean:{}}},{name:"filter_current_user",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("task.labels"),flatten:!0,schema:[{name:"filter_labels",selector:{label:{multiple:!0}}},{name:"filter_no_labels",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("table.notifications"),flatten:!0,schema:[{name:"filter_notifications",selector:{device:{multiple:!0,filter:[{integration:"mobile_app"}]}}},{name:"filter_persistent",selector:{boolean:{}}},{name:"filter_no_notifications",selector:{boolean:{}}}]},{type:"expandable",name:"",title:a("table.recurrence"),flatten:!0,schema:[{name:"filter_triggers",selector:{select:{multiple:!0,options:fe.map(e=>({value:e.value,label:a(e.label)}))}}}]},{type:"expandable",name:"",title:a("app.status"),flatten:!0,schema:[{name:"filter_statuses",selector:{select:{multiple:!0,options:be.map(e=>({value:e.value,label:a(e.label)}))}}}]},{type:"expandable",name:"",title:a("task.due"),flatten:!0,schema:[{name:"filter_due",selector:{select:{multiple:!0,options:ve.map(e=>({value:e.value,label:a(e.label)}))}}}]}]},{type:"expandable",name:"",title:a("card.content"),flatten:!0,schema:[{name:"columns",selector:{select:{multiple:!0,reorder:!0,options:ge.map(e=>({value:e.value,label:a(e.label)}))}}}]}],computeLabel:e=>{let t={show_bulk_selection:"card.multi_selection",show_search:"card.search",show_action_menu:"card.action_menu",show_icon:"task.icon",show_add_task:"card.add_task",show_header:"card.table_header",filter_assignees:"task.user",filter_current_user:"card.current_user",filter_unassigned:"task.unassigned",filter_labels:"task.labels",filter_no_labels:"task.no_labels",filter_notifications:"table.notifications",filter_persistent:"task.notification_persistent",filter_no_notifications:"app.no_notifications",filter_triggers:"table.recurrence",filter_statuses:"app.status",filter_due:"card.due_periods",columns:"card.visible_columns"};return t[e.name]?a(t[e.name]):void 0}}}constructor(){super(),this.config=ts(),this.error=""}setConfig(e){if(!e||typeof e!="object")throw new Error("Card configuration is required");this.config=As(e)}getCardSize(){return Math.max(2,Math.min(8,this.snapshot?.tasks.length||2))}updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,Oe(this.language))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass,t=e.connection;this.connection=t,this.error="";try{let s=await At(e,i=>{this.snapshot=i});this.connection===t?this.unsubscribe=s:s()}catch(s){this.connection===t&&(this.error=D(s))}}openTask(e){this.hass&&Xt(this.hass,e)}async confirmDelete(e){this.hass&&await x({heading:a("task.delete_title"),content:o`<p>
        ${a("task.delete_confirm",{name:e.name})}
      </p>`,actions:[{label:a("common.cancel"),value:"cancel"},{label:a("common.delete"),value:"delete",destructive:!0,run:()=>Lt(this.hass,e.id)}]})}handleTaskAction(e,t){this.hass&&(e==="edit"?Ke(this.hass,t):e==="active"?Ft(this.hass,t.id,t.active===!1):e==="delete"&&this.confirmDelete(t))}configuredFilters(){let e=new Set(this.config.filter_assignees.map(t=>this.hass?.states?.[t]?.attributes?.user_id).filter(t=>!!t));return this.config.filter_current_user&&this.hass?.user?.id&&e.add(this.hass.user.id),{assignee:[...e,...this.config.filter_unassigned?["__none__"]:[]],labels:[...this.config.filter_labels,...this.config.filter_no_labels?["__none__"]:[]],notifications:[...this.config.filter_notifications,...this.config.filter_persistent?["panel"]:[],...this.config.filter_no_notifications?["__none__"]:[]],trigger:this.config.filter_triggers,status:this.config.filter_statuses,due:this.config.filter_due}}render(){return this.error?o`<p class="message error">${this.error}</p>`:this.snapshot?g`
      <${Yt}
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
        @tasks-task-add=${()=>this.hass&&void Ke(this.hass)}
        @tasks-task-action=${e=>this.handleTaskAction(e.detail.action,e.detail.task)}
      ></${Yt}>
    `:o`<p class="message">${a("common.loading")}</p>`}};customElements.get(W)||customElements.define(W,rt);window.customCards||=[];var ke=window.customCards.find(r=>r.type===W);ke||(ke={type:W,name:"Tasks"},window.customCards.push(ke));Bt.then(()=>{ke.description=a("card.description")});
