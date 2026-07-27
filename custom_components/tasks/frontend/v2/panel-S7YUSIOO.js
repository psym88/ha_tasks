var q=globalThis,B=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ne=Symbol(),Ie=new WeakMap,L=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ne)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(B&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Ie.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Ie.set(t,e))}return e}toString(){return this.cssText}},Ne=n=>new L(typeof n=="string"?n:n+"",void 0,ne),f=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new L(t,n,ne)},Me=(n,e)=>{if(B)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=q.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},re=B?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Ne(t)})(n):n;var{is:pt,defineProperty:ut,getOwnPropertyDescriptor:mt,getOwnPropertyNames:gt,getOwnPropertySymbols:vt,getPrototypeOf:ft}=Object,W=globalThis,Le=W.trustedTypes,bt=Le?Le.emptyScript:"",$t=W.reactiveElementPolyfillSupport,O=(n,e)=>n,oe={toAttribute(n,e){switch(e){case Boolean:n=n?bt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Ue=(n,e)=>!pt(n,e),Oe={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:Ue};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Oe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&ut(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=mt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let p=s?.call(this);r?.call(this,o),this.requestUpdate(e,p,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Oe}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let e=ft(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let t=this.properties,i=[...gt(t),...vt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(re(s))}else e!==void 0&&t.push(re(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Me(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:oe).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:oe;this._$Em=s;let p=o.fromAttribute(t,r.type);this[s]=p??this._$Ej?.get(s)??p,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let o=this.constructor;if(s===!1&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??Ue)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,p=this[s];o!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,r,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[O("elementProperties")]=new Map,_[O("finalized")]=new Map,$t?.({ReactiveElement:_}),(W.reactiveElementVersions??=[]).push("2.1.2");var ue=globalThis,Re=n=>n,j=ue.trustedTypes,He=j?j.createPolicy("lit-html",{createHTML:n=>n}):void 0,je="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Ve="?"+w,yt=`<${Ve}>`,T=document,R=()=>T.createComment(""),H=n=>n===null||typeof n!="object"&&typeof n!="function",me=Array.isArray,xt=n=>me(n)||typeof n?.[Symbol.iterator]=="function",ae=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ze=/-->/g,Fe=/>/g,k=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,Be=/"/g,Ke=/^(?:script|style|textarea|title)$/i,ge=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),a=ge(1),Ze=ge(2),Je=ge(3),C=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),We=new WeakMap,S=T.createTreeWalker(T,129);function Ye(n,e){if(!me(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(e):e}var Et=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",o=U;for(let p=0;p<t;p++){let l=n[p],h,u,d=-1,$=0;for(;$<l.length&&(o.lastIndex=$,u=o.exec(l),u!==null);)$=o.lastIndex,o===U?u[1]==="!--"?o=ze:u[1]!==void 0?o=Fe:u[2]!==void 0?(Ke.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=k):u[3]!==void 0&&(o=k):o===k?u[0]===">"?(o=s??U,d=-1):u[1]===void 0?d=-2:(d=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?k:u[3]==='"'?Be:qe):o===Be||o===qe?o=k:o===ze||o===Fe?o=U:(o=k,s=void 0);let y=o===k&&n[p+1].startsWith("/>")?" ":"";r+=o===U?l+yt:d>=0?(i.push(h),l.slice(0,d)+je+l.slice(d)+w+y):l+w+(d===-2?p:y)}return[Ye(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},z=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,p=e.length-1,l=this.parts,[h,u]=Et(e,t);if(this.el=n.createElement(h,i),S.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=S.nextNode())!==null&&l.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(je)){let $=u[o++],y=s.getAttribute(d).split(w),D=/([.?@])?(.*)/.exec($);l.push({type:1,index:r,name:D[2],strings:y,ctor:D[1]==="."?ce:D[1]==="?"?de:D[1]==="@"?he:I}),s.removeAttribute(d)}else d.startsWith(w)&&(l.push({type:6,index:r}),s.removeAttribute(d));if(Ke.test(s.tagName)){let d=s.textContent.split(w),$=d.length-1;if($>0){s.textContent=j?j.emptyScript:"";for(let y=0;y<$;y++)s.append(d[y],R()),S.nextNode(),l.push({type:2,index:++r});s.append(d[$],R())}}}else if(s.nodeType===8)if(s.data===Ve)l.push({type:2,index:r});else{let d=-1;for(;(d=s.data.indexOf(w,d+1))!==-1;)l.push({type:7,index:r}),d+=w.length-1}r++}}static createElement(e,t){let i=T.createElement("template");return i.innerHTML=e,i}};function P(n,e,t=n,i){if(e===C)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=H(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=P(n,s._$AS(n,e.values),s,i)),e}var le=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??T).importNode(t,!0);S.currentNode=s;let r=S.nextNode(),o=0,p=0,l=i[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new F(r,r.nextSibling,this,e):l.type===1?h=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(h=new pe(r,this,e)),this._$AV.push(h),l=i[++p]}o!==l?.index&&(r=S.nextNode(),o++)}return S.currentNode=T,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),H(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):xt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=z.createElement(Ye(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new le(s,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=We.get(e.strings);return t===void 0&&We.set(e.strings,t=new z(e)),t}k(e){me(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(R()),this.O(R()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Re(e).nextSibling;Re(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(r===void 0)e=P(this,e,t,0),o=!H(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let p=e,l,h;for(e=r[0],l=0;l<r.length-1;l++)h=P(this,p[i+l],t,l),h===C&&(h=this._$AH[l]),o||=!H(h)||h!==this._$AH[l],h===c?e=c:e!==c&&(e+=(h??"")+r[l+1]),this._$AH[l]=h}o&&!s&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ce=class extends I{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},de=class extends I{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},he=class extends I{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??c)===C)return;let i=this._$AH,s=e===c&&i!==c||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},pe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var _t=ue.litHtmlPolyfillSupport;_t?.(z,F),(ue.litHtmlVersions??=[]).push("3.3.3");var Ge=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new F(e.insertBefore(R(),r),r,void 0,t??{})}return s._$AI(n),s};var ve=globalThis,m=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};m._$litElement$=!0,m.finalized=!0,ve.litElementHydrateSupport?.({LitElement:m});var wt=ve.litElementPolyfillSupport;wt?.({LitElement:m});(ve.litElementVersions??=[]).push("4.2.2");var Xe=Symbol.for(""),At=n=>{if(n?.r===Xe)return n?._$litStatic$},x=n=>({_$litStatic$:n,r:Xe});var Qe=new Map,fe=n=>(e,...t)=>{let i=t.length,s,r,o=[],p=[],l,h=0,u=!1;for(;h<i;){for(l=e[h];h<i&&(r=t[h],(s=At(r))!==void 0);)l+=s+e[++h],u=!0;h!==i&&p.push(r),o.push(l),h++}if(h===i&&o.push(e[i]),u){let d=o.join("$$lit$$");(e=Qe.get(d))===void 0&&(o.raw=o,Qe.set(d,e=o)),t=p}return n(e,...t)},b=fe(a),Jt=fe(Ze),Yt=fe(Je);var et=(n,e)=>n.connection.subscribeMessage(e,{type:"tasks/subscribe"}),tt=n=>{if(n.type==="sensor")return{schedule_type:n.type,problem_sensor:n.problemSensor.trim()};let e={schedule_type:n.type,schedule_unit:n.unit,schedule_interval:n.interval};return n.type==="fixed"&&(e.schedule_time=n.time,n.unit==="weekly"?e.schedule_weekdays=n.weekdays:n.unit==="monthly"?e.schedule_day=n.day:n.unit==="yearly"&&(e.schedule_day=n.day,e.schedule_month=n.month)),e},it=(n,e,t)=>n.connection.sendMessagePromise({type:"tasks/task/save",task_id:e.task_id,task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,...t.schedule?tt(t.schedule):{schedule_type:e.schedule_type},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification_target:t.notification.deviceIds.length?{device_id:t.notification.deviceIds}:{},notification_persistent:t.notification.persistent,notification_critical:t.notification.critical,notification_route:t.notification.route.trim()||null}:{},file_ids:[],deleted_attachment_ids:[],deleted_history_entry_ids:[]}),st=async n=>{let[e,t,i]=await Promise.all([n.connection.sendMessagePromise({type:"tasks/list"}),n.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),n.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(i)?i:[]}},nt=async n=>{let e=await n.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(i=>i?.[0]==="mobile_app"))},rt=(n,e,t)=>n.connection.sendMessagePromise({type:"tasks/task/preview_next_due",...tt(e),...t?{task_due:t}:{}});var kt=new URL(import.meta.url).pathname.match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]?.toLowerCase()||"dev",g=n=>`ha-tasks-${n}-${kt}`;var be=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=f`
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
    `}},$e=g("dialog");customElements.get($e)||customElements.define($e,be);var V=({heading:n,content:e,actions:t=[]})=>{let i=document.createElement($e);return i.heading=n,i.content=e,i.actions=t,document.body.append(i),i.open=!0,new Promise(s=>{i.addEventListener("tasks-dialog-closed",r=>{i.remove(),s(r.detail)},{once:!0})})};var ye=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=f`
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
    `}},N=g("expandable");customElements.get(N)||customElements.define(N,ye);var ke=f`
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
`,A=class extends m{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=ke;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?a`<span class="error" role="alert">${this.error}</span>`:null}},xe=class extends A{static properties={...A.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return a`
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
    `}},Ee=class extends A{static properties={...A.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
    `}},_e=class extends A{static properties={...A.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
    `}},K=g("text-field"),Z=g("select-field"),J=g("combobox-field"),Y=g("multi-select-field"),G=g("switch-field");customElements.get(K)||customElements.define(K,xe);customElements.get(Z)||customElements.define(Z,Ee);customElements.get(J)||customElements.define(J,_e);customElements.get(Y)||customElements.define(Y,we);customElements.get(G)||customElements.define(G,Ae);var E=x(K),v=x(Z),Q=x(J),X=x(Y),ee=x(G),M=x(N),St=[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],Tt=[{label:"Tasks",value:"mdi:clipboard-check-outline"},{label:"Tools",value:"mdi:wrench-outline"},{label:"Cleaning",value:"mdi:broom"},{label:"Home",value:"mdi:home-outline"},{label:"Calendar",value:"mdi:calendar-check-outline"}],ot=[{label:"After completion",value:"sliding"},{label:"Fixed schedule",value:"fixed"},{label:"Problem sensor",value:"sensor"}],Ct=[{label:"Days",value:"daily"},{label:"Weeks",value:"weekly"},{label:"Months",value:"monthly"},{label:"Years",value:"yearly"}],at=[...Array.from({length:31},(n,e)=>({label:String(e+1),value:String(e+1)})),{label:"Last day",value:"last"}],Dt=(n,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:n.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(i=>i.type!=="literal").map(i=>[i.type,i.value]))},Se=class extends m{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=f`
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

    @media (max-width: 520px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t){let i=Dt(e,t.task_due),s=Number(i.year),r=Number(i.month),o=Number(i.day),p=(new Date(Date.UTC(s,r-1,o)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification_target?.device_id||[]).filter(l=>typeof l=="string"))],this.notificationPersistent=!!t.notification_persistent,this.notificationCritical=!!t.notification_critical,this.notificationRoute=t.notification_route||"",this.scheduleType=t.schedule_type,this.scheduleUnit=t.schedule_unit||"monthly",this.scheduleInterval=t.schedule_interval||1,this.scheduleWeekdays=t.schedule_weekdays?.length?[...t.schedule_weekdays]:[p],this.scheduleDay=t.schedule_day||o,this.scheduleMonth=t.schedule_month||r,this.scheduleTime=t.schedule_time||`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor=t.problem_sensor||"",this.scheduleDirty=!1,this.assignmentDirty=!1,this.notificationDirty=!1,this.loadAssignments(),this.loadNotifications(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await st(e);this.users=[...t.users].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((i,s)=>i.name.localeCompare(s.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((i,s)=>(i.name||i.id).localeCompare(s.name||s.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(i=>i.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(i=>this.labels.some(s=>s.label_id===i)),this.nfcTagId=this.tags.some(i=>i.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError="Assignments could not be loaded"}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await nt(e)).sort((t,i)=>this.deviceName(t).localeCompare(this.deviceName(i),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(i=>i.id===t))}catch{this.notificationError="Notification devices could not be loaded"}finally{this.notificationLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let i=this.problemSensor.trim();return i.startsWith("binary_sensor.")||(t="Select a binary sensor"),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:i}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t="Interval must be at least 1":this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t="Select a valid time":this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t="Select at least one weekday"),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,i=this.scheduleDetails(!1),s=++this.previewRequest;if(!e||!t||!i||i.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let r=await rt(e,i,this.scheduleDirty?void 0:t.task_due||void 0);s===this.previewRequest&&(this.preview=r.task_dues)}catch{s===this.previewRequest&&(this.preview=[],this.previewError="Schedule preview could not be loaded")}finally{s===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),i=this.notificationRoute.trim();if(e||(this.nameError="Name is required"),i&&(!i.startsWith("/")||i.startsWith("//"))&&(this.notificationRouteError="Use an internal path beginning with /"),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await it(this.hass,this.task,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:i}:void 0}),!0}catch(s){return this.saveError=s instanceof Error?s.message:String(s),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return c;let e=c;return this.scheduleUnit==="weekly"?e=a`
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
          .options=${at}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${v}>
      `:this.scheduleUnit==="yearly"&&(e=b`
        <div class="row">
          <${v}
            label="Day"
            .value=${String(this.scheduleDay)}
            .options=${at}
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
            .options=${ot}
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
          .options=${ot}
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
            .options=${Ct}
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
    `}render(){return b`
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
          .options=${St}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${v}>
        <${Q}
          label="Icon"
          .value=${this.icon}
          .options=${Tt}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${Q}>
        <${M} heading="Assignment">
          ${this.renderAssignment()}
        </${M}>
        <${M} heading="Notifications">
          ${this.renderNotification()}
        </${M}>
        <${M} heading="Planning" open>
          ${this.renderPlanning()}
        </${M}>
        ${this.saveError?a`<p class="error" role="alert">${this.saveError}</p>`:c}
      </form>
    `}},Te=g("task-form");customElements.get(Te)||customElements.define(Te,Se);var lt=async(n,e)=>{let t=document.createElement(Te);return t.configure(n,e),await V({heading:`Edit ${e.task_name}`,content:t,actions:[{label:"Cancel",value:"cancel"},{label:"Save",value:"save",run:()=>t.save()}]})==="save"};var Ce=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=f`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let i=e.getBoundingClientRect(),s=t.getBoundingClientRect(),r=window.visualViewport,o=r?.offsetLeft||0,p=r?.offsetTop||0,l=o+(r?.width||window.innerWidth),h=p+(r?.height||window.innerHeight),u=8,d=4,$=Math.min(Math.max(o+u,i.right-s.width),l-s.width-u),y=i.bottom+d,D=y+s.height<=h-u?y:Math.max(p+u,i.top-s.height-d);t.style.left=`${$}px`,t.style.top=`${D}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let i=t.indexOf(this.renderRoot.activeElement),s;e.key==="ArrowDown"?s=(i+1)%t.length:e.key==="ArrowUp"?s=(i-1+t.length)%t.length:e.key==="Home"?s=0:e.key==="End"&&(s=t.length-1),s!==void 0&&(e.preventDefault(),t[s].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return a`
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
    `}},te=g("action-menu");customElements.get(te)||customElements.define(te,Ce);var De=class extends m{static properties={tone:{reflect:!0}};static styles=f`
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
  `;constructor(){super(),this.tone="default"}render(){return a`<span><slot></slot></span>`}},ie=g("pill");customElements.get(ie)||customElements.define(ie,De);var ct=x(te),dt=x(N),se=x(ie),Pt=[{label:"Open",value:"open"},{label:"Edit",value:"edit"}],Pe=class extends m{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=f`
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
        <${dt} heading="Planning" open>
          <p>Due: ${e.task_due||"Not scheduled"}</p>
          <p>Trigger: ${e.schedule_type||"Unknown"}</p>
        </${dt}>
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
                          .items=${Pt}
                          @tasks-action=${i=>{i.detail==="open"?this.openTask(t):i.detail==="edit"&&this.hass&&lt(this.hass,t)}}
                        ></${ct}>
                      </li>
                    `)}
                </ul>
              `:a`<p>Tasks werden geladen …</p>`}
      </main>
    `}},ht=g("panel-v2");customElements.get(ht)||customElements.define(ht,Pe);
