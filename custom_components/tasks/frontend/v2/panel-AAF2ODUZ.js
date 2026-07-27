var z=globalThis,F=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),Se=new WeakMap,N=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(F&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Se.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Se.set(t,e))}return e}toString(){return this.cssText}},Te=r=>new N(typeof r=="string"?r:r+"",void 0,te),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new N(t,r,te)},Ce=(r,e)=>{if(F)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=z.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},se=F?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Te(t)})(r):r;var{is:lt,defineProperty:dt,getOwnPropertyDescriptor:ct,getOwnPropertyNames:ht,getOwnPropertySymbols:pt,getPrototypeOf:ut}=Object,B=globalThis,De=B.trustedTypes,mt=De?De.emptyScript:"",gt=B.reactiveElementPolyfillSupport,O=(r,e)=>r,ie={toAttribute(r,e){switch(e){case Boolean:r=r?mt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Me=(r,e)=>!lt(r,e),Pe={attribute:!0,type:String,converter:ie,reflect:!1,useDefault:!1,hasChanged:Me};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Pe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&dt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=ct(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let p=i?.call(this);n?.call(this,o),this.requestUpdate(e,p,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Pe}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let e=ut(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let t=this.properties,s=[...ht(t),...pt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(se(i))}else e!==void 0&&t.push(se(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ce(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:ie).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ie;this._$Em=i;let p=o.fromAttribute(t,n.type);this[i]=p??this._$Ej?.get(i)??p,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??Me)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,p=this[i];o!==!0||this._$AL.has(i)||p===void 0||this.C(i,void 0,n,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[O("elementProperties")]=new Map,E[O("finalized")]=new Map,gt?.({ReactiveElement:E}),(B.reactiveElementVersions??=[]).push("2.1.2");var ce=globalThis,Ie=r=>r,W=ce.trustedTypes,Ne=W?W.createPolicy("lit-html",{createHTML:r=>r}):void 0,qe="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,ze="?"+_,vt=`<${ze}>`,T=document,U=()=>T.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",he=Array.isArray,ft=r=>he(r)||typeof r?.[Symbol.iterator]=="function",re=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oe=/-->/g,Le=/>/g,k=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ue=/'/g,He=/"/g,Fe=/^(?:script|style|textarea|title)$/i,pe=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),a=pe(1),Be=pe(2),We=pe(3),C=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Re=new WeakMap,S=T.createTreeWalker(T,129);function je(r,e){if(!he(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ne!==void 0?Ne.createHTML(e):e}var bt=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=L;for(let p=0;p<t;p++){let l=r[p],h,u,c=-1,b=0;for(;b<l.length&&(o.lastIndex=b,u=o.exec(l),u!==null);)b=o.lastIndex,o===L?u[1]==="!--"?o=Oe:u[1]!==void 0?o=Le:u[2]!==void 0?(Fe.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=k):u[3]!==void 0&&(o=k):o===k?u[0]===">"?(o=i??L,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?k:u[3]==='"'?He:Ue):o===He||o===Ue?o=k:o===Oe||o===Le?o=L:(o=k,i=void 0);let $=o===k&&r[p+1].startsWith("/>")?" ":"";n+=o===L?l+vt:c>=0?(s.push(h),l.slice(0,c)+qe+l.slice(c)+_+$):l+_+(c===-2?p:$)}return[je(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},R=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,p=e.length-1,l=this.parts,[h,u]=bt(e,t);if(this.el=r.createElement(h,s),S.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=S.nextNode())!==null&&l.length<p;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(qe)){let b=u[o++],$=i.getAttribute(c).split(_),D=/([.?@])?(.*)/.exec(b);l.push({type:1,index:n,name:D[2],strings:$,ctor:D[1]==="."?oe:D[1]==="?"?ae:D[1]==="@"?le:M}),i.removeAttribute(c)}else c.startsWith(_)&&(l.push({type:6,index:n}),i.removeAttribute(c));if(Fe.test(i.tagName)){let c=i.textContent.split(_),b=c.length-1;if(b>0){i.textContent=W?W.emptyScript:"";for(let $=0;$<b;$++)i.append(c[$],U()),S.nextNode(),l.push({type:2,index:++n});i.append(c[b],U())}}}else if(i.nodeType===8)if(i.data===ze)l.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(_,c+1))!==-1;)l.push({type:7,index:n}),c+=_.length-1}n++}}static createElement(e,t){let s=T.createElement("template");return s.innerHTML=e,s}};function P(r,e,t=r,s){if(e===C)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=H(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=P(r,i._$AS(r,e.values),i,s)),e}var ne=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??T).importNode(t,!0);S.currentNode=i;let n=S.nextNode(),o=0,p=0,l=s[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new q(n,n.nextSibling,this,e):l.type===1?h=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(h=new de(n,this,e)),this._$AV.push(h),l=s[++p]}o!==l?.index&&(n=S.nextNode(),o++)}return S.currentNode=T,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},q=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),H(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ft(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=R.createElement(je(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new ne(i,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Re.get(e.strings);return t===void 0&&Re.set(e.strings,t=new R(e)),t}k(e){he(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(U()),this.O(U()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Ie(e).nextSibling;Ie(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=P(this,e,t,0),o=!H(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let p=e,l,h;for(e=n[0],l=0;l<n.length-1;l++)h=P(this,p[s+l],t,l),h===C&&(h=this._$AH[l]),o||=!H(h)||h!==this._$AH[l],h===d?e=d:e!==d&&(e+=(h??"")+n[l+1]),this._$AH[l]=h}o&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},oe=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},ae=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},le=class extends M{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??d)===C)return;let s=this._$AH,i=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},de=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var $t=ce.litHtmlPolyfillSupport;$t?.(R,q),(ce.litHtmlVersions??=[]).push("3.3.3");var Ve=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new q(e.insertBefore(U(),n),n,void 0,t??{})}return i._$AI(r),i};var ue=globalThis,m=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};m._$litElement$=!0,m.finalized=!0,ue.litElementHydrateSupport?.({LitElement:m});var yt=ue.litElementPolyfillSupport;yt?.({LitElement:m});(ue.litElementVersions??=[]).push("4.2.2");var Ze=Symbol.for(""),xt=r=>{if(r?.r===Ze)return r?._$litStatic$},x=r=>({_$litStatic$:r,r:Ze});var Ke=new Map,me=r=>(e,...t)=>{let s=t.length,i,n,o=[],p=[],l,h=0,u=!1;for(;h<s;){for(l=e[h];h<s&&(n=t[h],(i=xt(n))!==void 0);)l+=i+e[++h],u=!0;h!==s&&p.push(n),o.push(l),h++}if(h===s&&o.push(e[s]),u){let c=o.join("$$lit$$");(e=Ke.get(c))===void 0&&(o.raw=o,Ke.set(c,e=o)),t=p}return r(e,...t)},y=me(a),jt=me(Be),Vt=me(We);var Je=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),Ye=r=>{if(r.type==="sensor")return{schedule_type:r.type,problem_sensor:r.problemSensor.trim()};let e={schedule_type:r.type,schedule_unit:r.unit,schedule_interval:r.interval};return r.type==="fixed"&&(e.schedule_time=r.time,r.unit==="weekly"?e.schedule_weekdays=r.weekdays:r.unit==="monthly"?e.schedule_day=r.day:r.unit==="yearly"&&(e.schedule_day=r.day,e.schedule_month=r.month)),e},Ge=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/save",task_id:e.task_id,task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,...t.schedule?Ye(t.schedule):{schedule_type:e.schedule_type},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},file_ids:[],deleted_attachment_ids:[],deleted_history_entry_ids:[]}),Qe=async r=>{let[e,t,s]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(s)?s:[]}},Xe=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",...Ye(e),...t?{task_due:t}:{}});var Et=new URL(import.meta.url).pathname.match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]?.toLowerCase()||"dev",v=r=>`ha-tasks-${r}-${Et}`;var ge=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=f`
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
    `}},ve=v("dialog");customElements.get(ve)||customElements.define(ve,ge);var j=({heading:r,content:e,actions:t=[]})=>{let s=document.createElement(ve);return s.heading=r,s.content=e,s.actions=t,document.body.append(s),s.open=!0,new Promise(i=>{s.addEventListener("tasks-dialog-closed",n=>{s.remove(),i(n.detail)},{once:!0})})};var fe=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=f`
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
    `}},I=v("expandable");customElements.get(I)||customElements.define(I,fe);var et=f`
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
`,w=class extends m{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=et;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?a`<span class="error" role="alert">${this.error}</span>`:null}},be=class extends w{static properties={...w.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return a`
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
    `}},$e=class extends w{static properties={...w.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
    `}},ye=class extends w{static properties={...w.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return a`
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
    `}},xe=class extends m{static properties={label:{},value:{attribute:!1},options:{attribute:!1},disabled:{type:Boolean}};static styles=et;constructor(){super(),this.label="",this.value=[],this.options=[],this.disabled=!1}toggle(e,t){this.value=t?[...new Set([...this.value,e])]:this.value.filter(s=>s!==e),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.value}))}render(){return a`
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
    `}},V=v("text-field"),K=v("select-field"),Z=v("combobox-field"),J=v("multi-select-field");customElements.get(V)||customElements.define(V,be);customElements.get(K)||customElements.define(K,$e);customElements.get(Z)||customElements.define(Z,ye);customElements.get(J)||customElements.define(J,xe);var A=x(V),g=x(K),Y=x(Z),tt=x(J),G=x(I),_t=[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],wt=[{label:"Tasks",value:"mdi:clipboard-check-outline"},{label:"Tools",value:"mdi:wrench-outline"},{label:"Cleaning",value:"mdi:broom"},{label:"Home",value:"mdi:home-outline"},{label:"Calendar",value:"mdi:calendar-check-outline"}],st=[{label:"After completion",value:"sliding"},{label:"Fixed schedule",value:"fixed"},{label:"Problem sensor",value:"sensor"}],At=[{label:"Days",value:"daily"},{label:"Weeks",value:"weekly"},{label:"Months",value:"monthly"},{label:"Years",value:"yearly"}],it=[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:"Last day",value:"last"}],kt=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(s=>s.type!=="literal").map(s=>[s.type,s.value]))},Ee=class extends m{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=f`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t){let s=kt(e,t.task_due),i=Number(s.year),n=Number(s.month),o=Number(s.day),p=(new Date(Date.UTC(i,n-1,o)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.scheduleType=t.schedule_type,this.scheduleUnit=t.schedule_unit||"monthly",this.scheduleInterval=t.schedule_interval||1,this.scheduleWeekdays=t.schedule_weekdays?.length?[...t.schedule_weekdays]:[p],this.scheduleDay=t.schedule_day||o,this.scheduleMonth=t.schedule_month||n,this.scheduleTime=t.schedule_time||`${s.hour||"09"}:${s.minute||"00"}`,this.problemSensor=t.problem_sensor||"",this.scheduleDirty=!1,this.assignmentDirty=!1,this.loadAssignments(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await Qe(e);this.users=[...t.users].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((s,i)=>(s.name||s.id).localeCompare(i.name||i.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(s=>s.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(s=>this.labels.some(i=>i.label_id===s)),this.nfcTagId=this.tags.some(s=>s.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError="Assignments could not be loaded"}finally{this.assignmentLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let s=this.problemSensor.trim();return s.startsWith("binary_sensor.")||(t="Select a binary sensor"),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:s}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t="Interval must be at least 1":this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t="Select a valid time":this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t="Select at least one weekday"),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}async loadPreview(){let e=this.hass,t=this.task,s=this.scheduleDetails(!1),i=++this.previewRequest;if(!e||!t||!s||s.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let n=await Xe(e,s,this.scheduleDirty?void 0:t.task_due||void 0);i===this.previewRequest&&(this.preview=n.task_dues)}catch{i===this.previewRequest&&(this.preview=[],this.previewError="Schedule preview could not be loaded")}finally{i===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0);if(e||(this.nameError="Name is required"),!e||!t||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await Ge(this.hass,this.task,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0}),!0}catch(s){return this.saveError=s instanceof Error?s.message:String(s),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return d;let e=d;return this.scheduleUnit==="weekly"?e=a`
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
      `:this.scheduleUnit==="monthly"?e=y`
        <${g}
          label="Day"
          .value=${String(this.scheduleDay)}
          .options=${it}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${g}>
      `:this.scheduleUnit==="yearly"&&(e=y`
        <div class="row">
          <${g}
            label="Day"
            .value=${String(this.scheduleDay)}
            .options=${it}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${g}>
          <${g}
            label="Month"
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${g}>
        </div>
      `),y`
      <${A}
        label="Time"
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${A}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return d;if(this.previewLoading&&!this.preview.length)return a`<p class="hint" aria-live="polite">Loading preview…</p>`;if(this.previewError)return a`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return a`
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
          `:d}
    `}renderPlanning(){return this.scheduleType==="sensor"?y`
        <div class="planning">
          <${g}
            label="Trigger"
            .value=${this.scheduleType}
            .options=${st}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${g}>
          <${Y}
            label="Problem sensor"
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail})}
          ></${Y}>
          <p class="hint">
            The task becomes due when the binary sensor changes to on.
          </p>
        </div>
      `:y`
      <div class="planning">
        <${g}
          label="Trigger"
          .value=${this.scheduleType}
          .options=${st}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${g}>
        <div class="row">
          <${A}
            label="Every"
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${A}>
          <${g}
            label="Unit"
            .value=${this.scheduleUnit}
            .options=${At}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${g}>
        </div>
        ${this.renderFixedOptions()}
        ${this.scheduleType==="sliding"?a`
              <p class="hint">
                The next due date is calculated from each completion.
              </p>
            `:d}
        ${this.scheduleError?a`<p class="error" role="alert">${this.scheduleError}</p>`:d}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return a`<p class="hint" aria-live="polite">
        Loading assignments…
      </p>`;if(this.assignmentError)return a`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:"Unassigned",value:""},...this.users.map(i=>({label:i.name,value:i.id}))],t=[{label:"No NFC tag",value:""},...this.tags.map(i=>({label:i.name||i.id,value:i.id}))],s=this.labels.map(i=>({label:i.name,value:i.label_id}));return y`
      <div class="planning">
        <${g}
          label="Assignee"
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.assigneeId=i.detail})}
        ></${g}>
        <${g}
          label="NFC tag"
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.nfcTagId=i.detail})}
        ></${g}>
        <${tt}
          label="Labels"
          .value=${this.labelIds}
          .options=${s}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.labelIds=i.detail})}
        ></${tt}>
      </div>
    `}render(){return y`
      <form @submit=${e=>e.preventDefault()}>
        <${A}
          label="Name"
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${A}>
        <${A}
          label="Description"
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${A}>
        <${g}
          label="Status"
          .value=${this.status}
          .options=${_t}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${g}>
        <${Y}
          label="Icon"
          .value=${this.icon}
          .options=${wt}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${Y}>
        <${G} heading="Assignment">
          ${this.renderAssignment()}
        </${G}>
        <${G} heading="Planning" open>
          ${this.renderPlanning()}
        </${G}>
        ${this.saveError?a`<p class="error" role="alert">${this.saveError}</p>`:d}
      </form>
    `}},_e=v("task-form");customElements.get(_e)||customElements.define(_e,Ee);var rt=async(r,e)=>{let t=document.createElement(_e);return t.configure(r,e),await j({heading:`Edit ${e.task_name}`,content:t,actions:[{label:"Cancel",value:"cancel"},{label:"Save",value:"save",run:()=>t.save()}]})==="save"};var we=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=f`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),n=window.visualViewport,o=n?.offsetLeft||0,p=n?.offsetTop||0,l=o+(n?.width||window.innerWidth),h=p+(n?.height||window.innerHeight),u=8,c=4,b=Math.min(Math.max(o+u,s.right-i.width),l-i.width-u),$=s.bottom+c,D=$+i.height<=h-u?$:Math.max(p+u,s.top-i.height-c);t.style.left=`${b}px`,t.style.top=`${D}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return a`
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
    `}},Q=v("action-menu");customElements.get(Q)||customElements.define(Q,we);var Ae=class extends m{static properties={tone:{reflect:!0}};static styles=f`
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
  `;constructor(){super(),this.tone="default"}render(){return a`<span><slot></slot></span>`}},X=v("pill");customElements.get(X)||customElements.define(X,Ae);var nt=x(Q),ot=x(I),ee=x(X),St=[{label:"Open",value:"open"},{label:"Edit",value:"edit"}],ke=class extends m{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=f`
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
  `;unsubscribe;connection;updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await Je(this.hass,s=>{this.snapshot=s});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=t instanceof Error?t.message:String(t))}}openTask(e){j({heading:e.task_name,content:y`
        <p>
          <${ee} tone=${e.active===!1?"muted":"positive"}>
            ${e.active===!1?"Inactive":"Active"}
          </${ee}>
          <${ee}>${e.schedule_type||"Unknown trigger"}</${ee}>
        </p>
        ${e.task_description?a`<p>${e.task_description}</p>`:d}
        <${ot} heading="Planning" open>
          <p>Due: ${e.task_due||"Not scheduled"}</p>
          <p>Trigger: ${e.schedule_type||"Unknown"}</p>
        </${ot}>
      `,actions:[{label:"Close",value:"close"}]})}render(){let e=this.snapshot;return a`
      <main>
        <header>
          <h1>Tasks V2</h1>
          ${e?a`${e.tasks.length} Tasks · Revision ${e.revision}`:d}
        </header>
        ${this.error?a`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`:e?a`
                <ul>
                  ${e.tasks.map(t=>y`
                      <li>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.openTask(t)}
                        >
                          ${t.task_name}
                        </button>
                        <${nt}
                          label="Actions for ${t.task_name}"
                          .items=${St}
                          @tasks-action=${s=>{s.detail==="open"?this.openTask(t):s.detail==="edit"&&this.hass&&rt(this.hass,t)}}
                        ></${nt}>
                      </li>
                    `)}
                </ul>
              `:a`<p>Tasks werden geladen …</p>`}
      </main>
    `}},at=v("panel-v2");customElements.get(at)||customElements.define(at,ke);
