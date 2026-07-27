var V=globalThis,K=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oe=Symbol(),Fe=new WeakMap,O=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(K&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Fe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Fe.set(t,e))}return e}toString(){return this.cssText}},ze=r=>new O(typeof r=="string"?r:r+"",void 0,oe),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new O(t,r,oe)},Be=(r,e)=>{if(K)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=V.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},le=K?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ze(t)})(r):r;var{is:Et,defineProperty:_t,getOwnPropertyDescriptor:kt,getOwnPropertyNames:wt,getOwnPropertySymbols:At,getPrototypeOf:Tt}=Object,Z=globalThis,qe=Z.trustedTypes,St=qe?qe.emptyScript:"",Ct=Z.reactiveElementPolyfillSupport,F=(r,e)=>r,de={toAttribute(r,e){switch(e){case Boolean:r=r?St:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},je=(r,e)=>!Et(r,e),We={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:je};Symbol.metadata??=Symbol("metadata"),Z.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=We){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&_t(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=kt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let d=i?.call(this);n?.call(this,o),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??We}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let e=Tt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let t=this.properties,s=[...wt(t),...At(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(le(i))}else e!==void 0&&t.push(le(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Be(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:de).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:de;this._$Em=i;let d=o.fromAttribute(t,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??je)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[F("elementProperties")]=new Map,w[F("finalized")]=new Map,Ct?.({ReactiveElement:w}),(Z.reactiveElementVersions??=[]).push("2.1.2");var fe=globalThis,Ve=r=>r,J=fe.trustedTypes,Ke=J?J.createPolicy("lit-html",{createHTML:r=>r}):void 0,Xe="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,et="?"+A,Dt=`<${et}>`,I=document,B=()=>I.createComment(""),q=r=>r===null||typeof r!="object"&&typeof r!="function",ve=Array.isArray,It=r=>ve(r)||typeof r?.[Symbol.iterator]=="function",ce=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,Je=/>/g,C=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ge=/"/g,tt=/^(?:script|style|textarea|title)$/i,ye=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),a=ye(1),st=ye(2),it=ye(3),P=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Qe=new WeakMap,D=I.createTreeWalker(I,129);function rt(r,e){if(!ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(e):e}var Pt=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=z;for(let d=0;d<t;d++){let l=r[d],h,u,p=-1,x=0;for(;x<l.length&&(o.lastIndex=x,u=o.exec(l),u!==null);)x=o.lastIndex,o===z?u[1]==="!--"?o=Ze:u[1]!==void 0?o=Je:u[2]!==void 0?(tt.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=C):u[3]!==void 0&&(o=C):o===C?u[0]===">"?(o=i??z,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?C:u[3]==='"'?Ge:Ye):o===Ge||o===Ye?o=C:o===Ze||o===Je?o=z:(o=C,i=void 0);let E=o===C&&r[d+1].startsWith("/>")?" ":"";n+=o===z?l+Dt:p>=0?(s.push(h),l.slice(0,p)+Xe+l.slice(p)+A+E):l+A+(p===-2?d:E)}return[rt(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},W=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,d=e.length-1,l=this.parts,[h,u]=Pt(e,t);if(this.el=r.createElement(h,s),D.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=D.nextNode())!==null&&l.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Xe)){let x=u[o++],E=i.getAttribute(p).split(A),N=/([.?@])?(.*)/.exec(x);l.push({type:1,index:n,name:N[2],strings:E,ctor:N[1]==="."?pe:N[1]==="?"?ue:N[1]==="@"?me:M}),i.removeAttribute(p)}else p.startsWith(A)&&(l.push({type:6,index:n}),i.removeAttribute(p));if(tt.test(i.tagName)){let p=i.textContent.split(A),x=p.length-1;if(x>0){i.textContent=J?J.emptyScript:"";for(let E=0;E<x;E++)i.append(p[E],B()),D.nextNode(),l.push({type:2,index:++n});i.append(p[x],B())}}}else if(i.nodeType===8)if(i.data===et)l.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(A,p+1))!==-1;)l.push({type:7,index:n}),p+=A.length-1}n++}}static createElement(e,t){let s=I.createElement("template");return s.innerHTML=e,s}};function H(r,e,t=r,s){if(e===P)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=q(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=H(r,i._$AS(r,e.values),i,s)),e}var he=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??I).importNode(t,!0);D.currentNode=i;let n=D.nextNode(),o=0,d=0,l=s[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new j(n,n.nextSibling,this,e):l.type===1?h=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(h=new ge(n,this,e)),this._$AV.push(h),l=s[++d]}o!==l?.index&&(n=D.nextNode(),o++)}return D.currentNode=I,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},j=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),q(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==P&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):It(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=W.createElement(rt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new he(i,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Qe.get(e.strings);return t===void 0&&Qe.set(e.strings,t=new W(e)),t}k(e){ve(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(B()),this.O(B()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Ve(e).nextSibling;Ve(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=H(this,e,t,0),o=!q(e)||e!==this._$AH&&e!==P,o&&(this._$AH=e);else{let d=e,l,h;for(e=n[0],l=0;l<n.length-1;l++)h=H(this,d[s+l],t,l),h===P&&(h=this._$AH[l]),o||=!q(h)||h!==this._$AH[l],h===c?e=c:e!==c&&(e+=(h??"")+n[l+1]),this._$AH[l]=h}o&&!i&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},pe=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},ue=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},me=class extends M{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??c)===P)return;let s=this._$AH,i=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ge=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}};var Nt=fe.litHtmlPolyfillSupport;Nt?.(W,j),(fe.litHtmlVersions??=[]).push("3.3.3");var nt=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new j(e.insertBefore(B(),n),n,void 0,t??{})}return i._$AI(r),i};var be=globalThis,m=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=nt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};m._$litElement$=!0,m.finalized=!0,be.litElementHydrateSupport?.({LitElement:m});var Ht=be.litElementPolyfillSupport;Ht?.({LitElement:m});(be.litElementVersions??=[]).push("4.2.2");var ot=Symbol.for(""),Mt=r=>{if(r?.r===ot)return r?._$litStatic$},b=r=>({_$litStatic$:r,r:ot});var at=new Map,$e=r=>(e,...t)=>{let s=t.length,i,n,o=[],d=[],l,h=0,u=!1;for(;h<s;){for(l=e[h];h<s&&(n=t[h],(i=Mt(n))!==void 0);)l+=i+e[++h],u=!0;h!==s&&d.push(n),o.push(l),h++}if(h===s&&o.push(e[s]),u){let p=o.join("$$lit$$");(e=at.get(p))===void 0&&(o.raw=o,at.set(p,e=o)),t=d}return r(e,...t)},v=$e(a),as=$e(st),os=$e(it);var lt=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),dt=r=>{if(r.type==="sensor")return{schedule_type:r.type,problem_sensor:r.problemSensor.trim()};let e={schedule_type:r.type,schedule_unit:r.unit,schedule_interval:r.interval};return r.type==="fixed"&&(e.schedule_time=r.time,r.unit==="weekly"?e.schedule_weekdays=r.weekdays:r.unit==="monthly"?e.schedule_day=r.day:r.unit==="yearly"&&(e.schedule_day=r.day,e.schedule_month=r.month)),e},Lt=async(r,e)=>{let t=new FormData;t.append("file",e);let s=await r.fetchWithAuth("/api/file_upload",{method:"POST",body:t});if(!s.ok)throw new Error(`File upload failed (${s.status})`);return(await s.json()).file_id},ct=async(r,e,t)=>{let s=await Promise.all((t.files?.staged||[]).map(i=>Lt(r,i)));return r.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.task_id}:{},task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,...t.schedule?dt(t.schedule):e?{schedule_type:e.schedule_type}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification_target:t.notification.deviceIds.length?{device_id:t.notification.deviceIds}:{},notification_persistent:t.notification.persistent,notification_critical:t.notification.critical,notification_route:t.notification.route.trim()||null}:{},file_ids:s,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},Y=async r=>{let[e,t,s]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(s)?s:[]}},ht=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(s=>s?.[0]==="mobile_app"))},G=(r,e)=>r.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),pt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),ut=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),mt=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),gt=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",...dt(e),...t?{task_due:t}:{}});var Rt=new URL(import.meta.url).pathname.match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]?.toLowerCase()||"dev",g=r=>`ha-tasks-${r}-${Rt}`;var xe=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=f`
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
    `}},Ee=g("dialog");customElements.get(Ee)||customElements.define(Ee,xe);var T=({heading:r,content:e,actions:t=[]})=>{let s=document.createElement(Ee);return s.heading=r,s.content=e,s.actions=t,document.body.append(s),s.open=!0,new Promise(i=>{s.addEventListener("tasks-dialog-closed",n=>{s.remove(),i(n.detail)},{once:!0})})};var _e=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=f`
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
    `}},L=g("expandable");customElements.get(L)||customElements.define(L,_e);var Ce=f`
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
`,S=class extends m{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=Ce;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?a`<span class="error" role="alert">${this.error}</span>`:null}},ke=class extends S{static properties={...S.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return a`
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
    `}},we=class extends S{static properties={...S.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
    `}},Ae=class extends S{static properties={...S.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
    `}},Te=class extends m{static properties={label:{},value:{attribute:!1},options:{attribute:!1},disabled:{type:Boolean}};static styles=Ce;constructor(){super(),this.label="",this.value=[],this.options=[],this.disabled=!1}toggle(e,t){this.value=t?[...new Set([...this.value,e])]:this.value.filter(s=>s!==e),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.value}))}render(){return a`
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
    `}},Se=class extends m{static properties={label:{},description:{},checked:{type:Boolean},disabled:{type:Boolean}};static styles=[Ce,f`
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
    `}},R=g("text-field"),Q=g("select-field"),X=g("combobox-field"),ee=g("multi-select-field"),te=g("switch-field");customElements.get(R)||customElements.define(R,ke);customElements.get(Q)||customElements.define(Q,we);customElements.get(X)||customElements.define(X,Ae);customElements.get(ee)||customElements.define(ee,Te);customElements.get(te)||customElements.define(te,Se);var _=b(R),y=b(Q),se=b(X),ie=b(ee),re=b(te),k=b(L),Ut=[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],Ot=[{label:"Tasks",value:"mdi:clipboard-check-outline"},{label:"Tools",value:"mdi:wrench-outline"},{label:"Cleaning",value:"mdi:broom"},{label:"Home",value:"mdi:home-outline"},{label:"Calendar",value:"mdi:calendar-check-outline"}],ft=[{label:"After completion",value:"sliding"},{label:"Fixed schedule",value:"fixed"},{label:"Problem sensor",value:"sensor"}],Ft=[{label:"Days",value:"daily"},{label:"Weeks",value:"weekly"},{label:"Months",value:"monthly"},{label:"Years",value:"yearly"}],vt=[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:"Last day",value:"last"}],zt=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(s=>s.type!=="literal").map(s=>[s.type,s.value]))},De=class extends m{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=f`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t,s=[]){let i=zt(e,t.task_due),n=Number(i.year),o=Number(i.month),d=Number(i.day),l=(new Date(Date.UTC(n,o-1,d)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification_target?.device_id||[]).filter(u=>typeof u=="string"))],this.notificationPersistent=!!t.notification_persistent,this.notificationCritical=!!t.notification_critical,this.notificationRoute=t.notification_route||"",this.attachments=s.filter(u=>u.task_id===t.task_id),this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule_type,this.scheduleUnit=t.schedule_unit||"monthly",this.scheduleInterval=t.schedule_interval||1,this.scheduleWeekdays=t.schedule_weekdays?.length?[...t.schedule_weekdays]:[l],this.scheduleDay=t.schedule_day||d,this.scheduleMonth=t.schedule_month||o,this.scheduleTime=t.schedule_time||`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor=t.problem_sensor||"";let h=!t.task_id;this.scheduleDirty=h,this.assignmentDirty=h,this.notificationDirty=h,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await Y(e);this.users=[...t.users].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((s,i)=>(s.name||s.id).localeCompare(i.name||i.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(s=>s.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(s=>this.labels.some(i=>i.label_id===s)),this.nfcTagId=this.tags.some(s=>s.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError="Assignments could not be loaded"}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await ht(e)).sort((t,s)=>this.deviceName(t).localeCompare(this.deviceName(s),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(s=>s.id===t))}catch{this.notificationError="Notification devices could not be loaded"}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t?.task_id)){this.historyLoading=!0,this.historyError="";try{let s=await G(e,t.task_id);this.history=Array.isArray(s.history)?s.history:[]}catch{this.historyError="Completion history could not be loaded"}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let s=this.problemSensor.trim();return s.startsWith("binary_sensor.")||(t="Select a binary sensor"),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:s}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t="Interval must be at least 1":this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t="Select a valid time":this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t="Select at least one weekday"),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,s=this.scheduleDetails(!1),i=++this.previewRequest;if(!e||!t||!s||s.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let n=await gt(e,s,this.scheduleDirty?void 0:t.task_due||void 0);i===this.previewRequest&&(this.preview=n.task_dues)}catch{i===this.previewRequest&&(this.preview=[],this.previewError="Schedule preview could not be loaded")}finally{i===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),s=this.notificationRoute.trim();if(e||(this.nameError="Name is required"),s&&(!s.startsWith("/")||s.startsWith("//"))&&(this.notificationRouteError="Use an internal path beginning with /"),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await ct(this.hass,this.task.task_id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:s}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(i){return this.saveError=i instanceof Error?i.message:String(i),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return c;let e=c;return this.scheduleUnit==="weekly"?e=a`
        <p class="caption">Weekdays</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,s)=>a`
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
        <${y}
          label="Day"
          .value=${String(this.scheduleDay)}
          .options=${vt}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${y}>
      `:this.scheduleUnit==="yearly"&&(e=v`
        <div class="row">
          <${y}
            label="Day"
            .value=${String(this.scheduleDay)}
            .options=${vt}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${y}>
          <${y}
            label="Month"
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${y}>
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
    `}renderPlanning(){return this.scheduleType==="sensor"?v`
        <div class="planning">
          <${y}
            label="Trigger"
            .value=${this.scheduleType}
            .options=${ft}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${y}>
          <${se}
            label="Problem sensor"
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail})}
          ></${se}>
          <p class="hint">
            The task becomes due when the binary sensor changes to on.
          </p>
        </div>
      `:v`
      <div class="planning">
        <${y}
          label="Trigger"
          .value=${this.scheduleType}
          .options=${ft}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${y}>
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
          <${y}
            label="Unit"
            .value=${this.scheduleUnit}
            .options=${Ft}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${y}>
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
      </p>`;if(this.assignmentError)return a`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:"Unassigned",value:""},...this.users.map(i=>({label:i.name,value:i.id}))],t=[{label:"No NFC tag",value:""},...this.tags.map(i=>({label:i.name||i.id,value:i.id}))],s=this.labels.map(i=>({label:i.name,value:i.label_id}));return v`
      <div class="planning">
        <${y}
          label="Assignee"
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.assigneeId=i.detail})}
        ></${y}>
        <${y}
          label="NFC tag"
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.nfcTagId=i.detail})}
        ></${y}>
        <${ie}
          label="Labels"
          .value=${this.labelIds}
          .options=${s}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.labelIds=i.detail})}
        ></${ie}>
      </div>
    `}renderNotification(){if(this.notificationLoading)return a`<p class="hint" aria-live="polite">
        Loading notification devices…
      </p>`;if(this.notificationError)return a`<p class="error" role="alert">${this.notificationError}</p>`;let e=this.devices.map(t=>({label:this.deviceName(t),value:t.id}));return v`
      <div class="planning">
        <${ie}
          label="Mobile devices"
          .value=${this.notificationDeviceIds}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationDeviceIds=t.detail})}
        ></${ie}>
        ${e.length?c:a`<p class="hint">No mobile app devices found.</p>`}
        <${re}
          label="Persistent notification"
          description="Also show this notification in Home Assistant."
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationPersistent=t.detail})}
        ></${re}>
        <${re}
          label="Critical notification"
          description="Use critical delivery on supported mobile devices."
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationCritical=t.detail})}
        ></${re}>
        <${_}
          label="Navigation target"
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationRoute=t.detail})}
        ></${_}>
        <p class="hint">Internal path, for example /lovelace/tasks.</p>
      </div>
    `}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}toggleId(e,t){return t.includes(e)?t.filter(s=>s!==e):[...t,e]}renderAttachments(){return a`
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
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((s,i)=>i!==t)}}
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
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.history_entry_id),s=e.notes==="tasks.history.completed_via_nfc"?"Completed via NFC":e.notes||"No notes";return a`
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
    `:a`<p class="hint">No completion history.</p>`}render(){return v`
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
        <${y}
          label="Status"
          .value=${this.status}
          .options=${Ut}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${y}>
        <${se}
          label="Icon"
          .value=${this.icon}
          .options=${Ot}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${se}>
        <${k} heading="Assignment">
          ${this.renderAssignment()}
        </${k}>
        <${k} heading="Notifications">
          ${this.renderNotification()}
        </${k}>
        <${k} heading="Planning" open>
          ${this.renderPlanning()}
        </${k}>
        <${k} heading="Attachments">
          ${this.renderAttachments()}
        </${k}>
        ${this.task?.task_id?v`
              <${k} heading="Completion history">
                ${this.renderHistory()}
              </${k}>
            `:c}
        ${this.saveError?a`<p class="error" role="alert">${this.saveError}</p>`:c}
      </form>
    `}},Ie=g("task-form");customElements.get(Ie)||customElements.define(Ie,De);var Pe=async(r,e,t=[])=>{let s=e||{task_id:"",task_name:"",active:!0,schedule_type:"sliding",schedule_unit:"monthly",schedule_interval:1},i=document.createElement(Ie);return i.configure(r,s,t),await T({heading:e?`Edit ${s.task_name}`:"New task",content:i,actions:[{label:"Cancel",value:"cancel"},{label:"Save",value:"save",run:()=>i.save()}]})==="save"};var Ne=class extends m{static properties={tone:{reflect:!0}};static styles=f`
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
  `;constructor(){super(),this.tone="default"}render(){return a`<span><slot></slot></span>`}},ne=g("pill");customElements.get(ne)||customElements.define(ne,Ne);var U=b(L),$=b(ne),yt=b(R),He=class extends m{static properties={attachment:{attribute:!1},url:{}};static styles=f`
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
  `;render(){let e=this.attachment.content_type;return e.startsWith("image/")?a`<img src=${this.url} alt=${this.attachment.filename} />`:e.startsWith("video/")?a`<video src=${this.url} controls></video>`:e.startsWith("audio/")?a`<audio src=${this.url} controls></audio>`:e==="application/pdf"?a`<iframe
        src=${this.url}
        title=${this.attachment.filename}
      ></iframe>`:a`<a href=${this.url} target="_blank" rel="noopener">
      Open ${this.attachment.filename}
    </a>`}},Me=g("attachment-preview");customElements.get(Me)||customElements.define(Me,He);var Le=class extends m{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},historyError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0}};static styles=f`
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
  `;hass;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.historyError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1}configure(e,t,s){this.hass=e,this.task=t,this.attachments=s.filter(i=>i.task_id===t.task_id),this.loadDetails()}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.historyError="",this.attachmentError="";let[e,t,s]=await Promise.allSettled([Y(this.hass),G(this.hass,this.task.task_id),pt(this.hass,this.task.task_id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError="Assignment details could not be loaded",t.status==="fulfilled"?this.history=Array.isArray(t.value.history)?t.value.history:[]:this.historyError="Completion history could not be loaded",s.status==="fulfilled"?this.signedFiles=s.value.signed_files||{}:this.attachmentError="Attachment links could not be loaded",this.loading=!1}formatDate(e){if(!e)return"Not scheduled";let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}scheduleText(){if(this.task.schedule_type==="sensor"){let o=this.task.problem_sensor||"",d=this.hass?.states?.[o]?.attributes?.friendly_name||o;return d?`When ${d} reports a problem`:"When a problem occurs"}let e=Math.max(1,Number(this.task.schedule_interval)||1),t=this.task.schedule_unit||"monthly",i=`${e} ${{daily:"day",weekly:"week",monthly:"month",yearly:"year"}[t]}${e===1?"":"s"}`;if(this.task.schedule_type==="sliding")return`Every ${i} after completion`;let n=this.task.schedule_time||"00:00";if(t==="weekly"){let o=Array.from({length:7},(l,h)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,h+1)))),d=(this.task.schedule_weekdays||[]).map(l=>o[l]).filter(Boolean).join(", ");return`Every ${i}${d?` on ${d}`:""} at ${n}`}if(t==="monthly"){let o=this.task.schedule_day==="last"?"the last day":`day ${this.task.schedule_day||1}`;return`Every ${i} on ${o} at ${n}`}if(t==="yearly"){let o=new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,(this.task.schedule_month||1)-1,1)),d=this.task.schedule_day==="last"?`the last day of ${o}`:`${o} ${this.task.schedule_day||1}`;return`Every ${i} on ${d} at ${n}`}return`Every ${i} at ${n}`}renderInline(e){let t=[],s=/(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g,i=0;for(let n of e.matchAll(s)){let o=n.index??0;if(o>i&&t.push(e.slice(i,o)),n[2])t.push(a`<strong>${n[2]}</strong>`);else if(n[3])t.push(a`<em>${n[3]}</em>`);else if(n[4])t.push(a`<code>${n[4]}</code>`);else if(n[5]&&n[6]){let d=n[6];t.push(/^(?:https?:|mailto:|\/|#)/.test(d)?a`<a href=${d} target="_blank" rel="noopener"
                >${n[5]}</a
              >`:n[5])}i=o+n[0].length}return i<e.length&&t.push(e.slice(i)),t}renderDescription(){let e=(this.task.task_description||"").split(/\r?\n/);if(!e.some(s=>s.trim()))return a`<p class="hint">No description.</p>`;let t=[];for(let s=0;s<e.length;){let i=e[s];if(!i.trim())s+=1;else if(i.startsWith("- ")){let n=[];for(;e[s]?.startsWith("- ");)n.push(e[s].slice(2)),s+=1;t.push(a`<ul>
            ${n.map(o=>a`<li>${this.renderInline(o)}</li>`)}
          </ul>`)}else if(/^\d+\. /.test(i)){let n=[];for(;/^\d+\. /.test(e[s]||"");)n.push(e[s].replace(/^\d+\. /,"")),s+=1;t.push(a`<ol>
            ${n.map(o=>a`<li>${this.renderInline(o)}</li>`)}
          </ol>`)}else{let n=/^(#{1,2})\s+(.+)$/.exec(i);t.push(n?n[1].length===1?a`<h3>${this.renderInline(n[2])}</h3>`:a`<h4>${this.renderInline(n[2])}</h4>`:i.startsWith("> ")?a`<blockquote>${this.renderInline(i.slice(2))}</blockquote>`:a`<p>${this.renderInline(i)}</p>`),s+=1}}return t}async openAttachment(e){let t=this.signedFiles[e.attachment_id];if(!t)return;let s=document.createElement(Me);s.attachment=e,s.url=t,await T({heading:e.filename,content:s})}async complete(){if(!this.hass||this.completing||await T({heading:"Complete task?",content:a`<p>
        Mark “${this.task.task_name}” as completed and calculate its next due
        date?
      </p>`,actions:[{label:"Cancel",value:"cancel"},{label:"Complete",value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await ut(this.hass,this.task.task_id,this.completionNotes),!0}catch(t){return this.completionError=t instanceof Error?t.message:String(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(i=>i.id===this.task.assignee_id)?.name||(this.assignmentReady?"Unassigned":"Loading assignment\u2026"),t=this.tags.find(i=>i.id===this.task.nfc_tag_id),s=(this.task.label_ids||[]).map(i=>this.labels.find(n=>n.label_id===i)).filter(i=>!!i);return v`
      <div class="pills">
        <${$}>${this.formatDate(this.task.task_due)}</${$}>
        <${$}>${e}</${$}>
        <${$} tone=${this.task.active===!1?"muted":"positive"}>
          ${this.task.active===!1?"Inactive":"Active"}
        </${$}>
        ${this.attachments.length?v`<${$}>
              ${this.attachments.length}
              ${this.attachments.length===1?"file":"files"}
            </${$}>`:c}
        ${t?v`<${$}>NFC: ${t.name||t.id}</${$}>`:c}
        ${s.map(i=>v`<${$}>${i.name}</${$}>`)}
      </div>
    `}renderAttachments(){return this.attachmentError?a`<p class="error" role="alert">${this.attachmentError}</p>`:this.attachments.length?a`
      <ul class="records">
        ${this.attachments.map(e=>{let t=!!this.signedFiles[e.attachment_id];return a`
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
    `:a`<p class="hint">No attachments.</p>`}renderHistory(){return this.historyError?a`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?a`
      <ul class="records">
        ${this.history.map(e=>a`
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
    `:a`<p class="hint">No completion history.</p>`}render(){return v`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading?a`<p class="hint" aria-live="polite">Loading task details…</p>`:c}
        ${this.assignmentError?a`<p class="error" role="alert">${this.assignmentError}</p>`:c}
        <${U} heading="Planning" open>
          <dl class="planning-details">
            <dt>Due</dt>
            <dd>${this.formatDate(this.task.task_due)}</dd>
            <dt>Rule</dt>
            <dd>${this.scheduleText()}</dd>
          </dl>
        </${U}>
        <${U} heading="Attachments">
          ${this.renderAttachments()}
        </${U}>
        <${U} heading="Completion history">
          ${this.renderHistory()}
        </${U}>
        <${yt}
          label="Completion notes"
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${yt}>
        ${this.completionError?a`<p class="error" role="alert">${this.completionError}</p>`:c}
      </div>
    `}},Re=g("task-viewer");customElements.get(Re)||customElements.define(Re,Le);var bt=async(r,e,t)=>{let s=document.createElement(Re);return s.configure(r,e,t),await T({heading:e.task_name,content:s,actions:[{label:"Close",value:"close"},{label:"Complete",value:"complete",run:()=>s.complete()}]})==="complete"};var Ue=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=f`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),n=window.visualViewport,o=n?.offsetLeft||0,d=n?.offsetTop||0,l=o+(n?.width||window.innerWidth),h=d+(n?.height||window.innerHeight),u=8,p=4,x=Math.min(Math.max(o+u,s.right-i.width),l-i.width-u),E=s.bottom+p,N=E+i.height<=h-u?E:Math.max(d+u,s.top-i.height-p);t.style.left=`${x}px`,t.style.top=`${N}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return a`
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
    `}},ae=g("action-menu");customElements.get(ae)||customElements.define(ae,Ue);var $t=b(ae),Bt=[{label:"Open",value:"open"},{label:"Edit",value:"edit"},{label:"Delete",value:"delete",destructive:!0}],Oe=class extends m{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=f`
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
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .add {
      min-height: 40px;
      padding: 0 18px;
      color: var(--text-primary-color, white);
      background: var(--primary-color);
      border: 0;
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    .add:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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

    @media (max-width: 520px) {
      header,
      .header-actions {
        align-items: flex-start;
      }

      header {
        flex-direction: column;
      }
    }
  `;unsubscribe;connection;updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await lt(this.hass,s=>{this.snapshot=s});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=t instanceof Error?t.message:String(t))}}openTask(e){this.hass&&bt(this.hass,e,this.snapshot?.attachments||[])}async confirmDelete(e){this.hass&&await T({heading:"Delete task?",content:a`
        <p>
          Delete “${e.task_name}” including its completion history and
          attachments?
        </p>
      `,actions:[{label:"Cancel",value:"cancel"},{label:"Delete",value:"delete",destructive:!0,run:()=>mt(this.hass,e.task_id)}]})}render(){let e=this.snapshot;return a`
      <main>
        <header>
          <h1>Tasks V2</h1>
          <div class="header-actions">
            ${e?a`${e.tasks.length} Tasks · Revision ${e.revision}`:c}
            <button
              class="add"
              type="button"
              @click=${()=>this.hass&&void Pe(this.hass)}
            >
              Add task
            </button>
          </div>
        </header>
        ${this.error?a`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`:e?a`
                <ul>
                  ${e.tasks.map(t=>v`
                      <li>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.openTask(t)}
                        >
                          ${t.task_name}
                        </button>
                        <${$t}
                          label="Actions for ${t.task_name}"
                          .items=${Bt}
                          @tasks-action=${s=>{s.detail==="open"?this.openTask(t):s.detail==="edit"&&this.hass?Pe(this.hass,t,e.attachments):s.detail==="delete"&&this.confirmDelete(t)}}
                        ></${$t}>
                      </li>
                    `)}
                </ul>
              `:a`<p>Tasks werden geladen …</p>`}
      </main>
    `}},xt=g("panel-v2");customElements.get(xt)||customElements.define(xt,Oe);
