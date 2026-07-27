var D=globalThis,z=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),_e=new WeakMap,P=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=_e.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&_e.set(t,e))}return e}toString(){return this.cssText}},Ee=o=>new P(typeof o=="string"?o:o+"",void 0,Q),v=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new P(t,o,Q)},Ae=(o,e)=>{if(z)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,o.appendChild(s)}},X=z?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Ee(t)})(o):o;var{is:Xe,defineProperty:Ye,getOwnPropertyDescriptor:et,getOwnPropertyNames:tt,getOwnPropertySymbols:st,getPrototypeOf:it}=Object,B=globalThis,we=B.trustedTypes,ot=we?we.emptyScript:"",rt=B.reactiveElementPolyfillSupport,M=(o,e)=>o,Y={toAttribute(o,e){switch(e){case Boolean:o=o?ot:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ke=(o,e)=>!Xe(o,e),Se={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Se){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ye(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=et(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let h=i?.call(this);r?.call(this,n),this.requestUpdate(e,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Se}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let e=it(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let t=this.properties,s=[...tt(t),...st(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(X(i))}else e!==void 0&&t.push(X(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ae(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:Y).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Y;this._$Em=i;let h=n.fromAttribute(t,r.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let n=this.constructor;if(i===!1&&(r=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??ke)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,h=this[i];n!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,r,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[M("elementProperties")]=new Map,b[M("finalized")]=new Map,rt?.({ReactiveElement:b}),(B.reactiveElementVersions??=[]).push("2.1.2");var ne=globalThis,Ce=o=>o,q=ne.trustedTypes,Te=q?q.createPolicy("lit-html",{createHTML:o=>o}):void 0,Oe="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Ue="?"+y,nt=`<${Ue}>`,w=document,N=()=>w.createComment(""),L=o=>o===null||typeof o!="object"&&typeof o!="function",ae=Array.isArray,at=o=>ae(o)||typeof o?.[Symbol.iterator]=="function",ee=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pe=/-->/g,Me=/>/g,E=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),He=/'/g,Ne=/"/g,Re=/^(?:script|style|textarea|title)$/i,le=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),l=le(1),De=le(2),ze=le(3),S=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Le=new WeakMap,A=w.createTreeWalker(w,129);function Be(o,e){if(!ae(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Te!==void 0?Te.createHTML(e):e}var lt=(o,e)=>{let t=o.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",n=H;for(let h=0;h<t;h++){let a=o[h],d,p,c=-1,f=0;for(;f<a.length&&(n.lastIndex=f,p=n.exec(a),p!==null);)f=n.lastIndex,n===H?p[1]==="!--"?n=Pe:p[1]!==void 0?n=Me:p[2]!==void 0?(Re.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=E):p[3]!==void 0&&(n=E):n===E?p[0]===">"?(n=i??H,c=-1):p[1]===void 0?c=-2:(c=n.lastIndex-p[2].length,d=p[1],n=p[3]===void 0?E:p[3]==='"'?Ne:He):n===Ne||n===He?n=E:n===Pe||n===Me?n=H:(n=E,i=void 0);let $=n===E&&o[h+1].startsWith("/>")?" ":"";r+=n===H?a+nt:c>=0?(s.push(d),a.slice(0,c)+Oe+a.slice(c)+y+$):a+y+(c===-2?h:$)}return[Be(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},O=class o{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,n=0,h=e.length-1,a=this.parts,[d,p]=lt(e,t);if(this.el=o.createElement(d,s),A.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=A.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Oe)){let f=p[n++],$=i.getAttribute(c).split(y),k=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:k[2],strings:$,ctor:k[1]==="."?se:k[1]==="?"?ie:k[1]==="@"?oe:T}),i.removeAttribute(c)}else c.startsWith(y)&&(a.push({type:6,index:r}),i.removeAttribute(c));if(Re.test(i.tagName)){let c=i.textContent.split(y),f=c.length-1;if(f>0){i.textContent=q?q.emptyScript:"";for(let $=0;$<f;$++)i.append(c[$],N()),A.nextNode(),a.push({type:2,index:++r});i.append(c[f],N())}}}else if(i.nodeType===8)if(i.data===Ue)a.push({type:2,index:r});else{let c=-1;for(;(c=i.data.indexOf(y,c+1))!==-1;)a.push({type:7,index:r}),c+=y.length-1}r++}}static createElement(e,t){let s=w.createElement("template");return s.innerHTML=e,s}};function C(o,e,t=o,s){if(e===S)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=L(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=C(o,i._$AS(o,e.values),i,s)),e}var te=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??w).importNode(t,!0);A.currentNode=i;let r=A.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new U(r,r.nextSibling,this,e):a.type===1?d=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(d=new re(r,this,e)),this._$AV.push(d),a=s[++h]}n!==a?.index&&(r=A.nextNode(),n++)}return A.currentNode=w,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),L(e)?e===u||e==null||e===""?(this._$AH!==u&&this._$AR(),this._$AH=u):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):at(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==u&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=O.createElement(Be(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new te(i,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=Le.get(e.strings);return t===void 0&&Le.set(e.strings,t=new O(e)),t}k(e){ae(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new o(this.O(N()),this.O(N()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Ce(e).nextSibling;Ce(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(e,t=this,s,i){let r=this.strings,n=!1;if(r===void 0)e=C(this,e,t,0),n=!L(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let h=e,a,d;for(e=r[0],a=0;a<r.length-1;a++)d=C(this,h[s+a],t,a),d===S&&(d=this._$AH[a]),n||=!L(d)||d!==this._$AH[a],d===u?e=u:e!==u&&(e+=(d??"")+r[a+1]),this._$AH[a]=d}n&&!i&&this.j(e)}j(e){e===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},se=class extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===u?void 0:e}},ie=class extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==u)}},oe=class extends T{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??u)===S)return;let s=this._$AH,i=e===u&&s!==u||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==u&&(s===u||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},re=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}};var ct=ne.litHtmlPolyfillSupport;ct?.(O,U),(ne.litHtmlVersions??=[]).push("3.3.3");var qe=(o,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new U(e.insertBefore(N(),r),r,void 0,t??{})}return i._$AI(o),i};var ce=globalThis,m=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};m._$litElement$=!0,m.finalized=!0,ce.litElementHydrateSupport?.({LitElement:m});var dt=ce.litElementPolyfillSupport;dt?.({LitElement:m});(ce.litElementVersions??=[]).push("4.2.2");var je=Symbol.for(""),ht=o=>{if(o?.r===je)return o?._$litStatic$},x=o=>({_$litStatic$:o,r:je});var Ie=new Map,de=o=>(e,...t)=>{let s=t.length,i,r,n=[],h=[],a,d=0,p=!1;for(;d<s;){for(a=e[d];d<s&&(r=t[d],(i=ht(r))!==void 0);)a+=i+e[++d],p=!0;d!==s&&h.push(r),n.push(a),d++}if(d===s&&n.push(e[s]),p){let c=n.join("$$lit$$");(e=Ie.get(c))===void 0&&(n.raw=n,Ie.set(c,e=n)),t=h}return o(e,...t)},R=de(l),Lt=de(De),Ot=de(ze);var Fe=(o,e)=>o.connection.subscribeMessage(e,{type:"tasks/subscribe"}),Ve=(o,e,t)=>o.connection.sendMessagePromise({type:"tasks/task/save",task_id:e.task_id,task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,schedule_type:e.schedule_type,file_ids:[],deleted_attachment_ids:[],deleted_history_entry_ids:[]});var pt=new URL(import.meta.url).pathname.match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]?.toLowerCase()||"dev",g=o=>`ha-tasks-${o}-${pt}`;var he=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=v`
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
  `;running=!1;constructor(){super(),this.heading="",this.content=l``,this.actions=[],this.open=!1}updated(){let e=this.renderRoot.querySelector("dialog");e&&(this.open&&!e.open?e.showModal():!this.open&&e.open&&e.close())}close(e=""){this.renderRoot.querySelector("dialog")?.close(e)}async run(e){if(!this.running){this.running=!0;try{await e.run?.()!==!1&&this.close(e.value)}finally{this.running=!1}}}render(){return l`
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
          ${this.actions.length?l`
                <footer>
                  ${this.actions.map(e=>l`
                      <button
                        class=${e.destructive?"destructive":u}
                        type="button"
                        @click=${()=>{this.run(e)}}
                      >
                        ${e.label}
                      </button>
                    `)}
                </footer>
              `:u}
        </article>
      </dialog>
    `}},pe=g("dialog");customElements.get(pe)||customElements.define(pe,he);var I=({heading:o,content:e,actions:t=[]})=>{let s=document.createElement(pe);return s.heading=o,s.content=e,s.actions=t,document.body.append(s),s.open=!0,new Promise(i=>{s.addEventListener("tasks-dialog-closed",r=>{s.remove(),i(r.detail)},{once:!0})})};var ut=v`
  :host {
    display: block;
  }

  label {
    display: grid;
    gap: 6px;
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  input,
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
`,_=class extends m{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=ut;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?l`<span class="error" role="alert">${this.error}</span>`:null}},ue=class extends _{static properties={..._.properties,multiline:{type:Boolean}};constructor(){super(),this.multiline=!1}render(){return l`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        ${this.multiline?l`
              <textarea
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              ></textarea>
            `:l`
              <input
                type="text"
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${!!this.error}
                @input=${e=>this.change(e.target.value)}
              />
            `}
        ${this.errorMessage()}
      </label>
    `}},me=class extends _{static properties={..._.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return l`
      <label>
        <span>${this.label}${this.required?" *":""}</span>
        <select
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${!!this.error}
          @change=${e=>this.change(e.target.value)}
        >
          ${this.options.map(e=>l`
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
    `}},ge=class extends _{static properties={..._.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return l`
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
          ${this.options.map(e=>l`<option value=${e.value}>${e.label}</option>`)}
        </datalist>
        ${this.errorMessage()}
      </label>
    `}},j=g("text-field"),F=g("select-field"),V=g("combobox-field");customElements.get(j)||customElements.define(j,ue);customElements.get(F)||customElements.define(F,me);customElements.get(V)||customElements.define(V,ge);var W=x(j),We=x(F),Ke=x(V),mt=[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],gt=[{label:"Tasks",value:"mdi:clipboard-check-outline"},{label:"Tools",value:"mdi:wrench-outline"},{label:"Cleaning",value:"mdi:broom"},{label:"Home",value:"mdi:home-outline"},{label:"Calendar",value:"mdi:calendar-check-outline"}],ve=class extends m{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},nameError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=v`
    :host,
    form {
      display: grid;
      gap: 16px;
    }

    .error {
      margin: 0;
      color: var(--error-color);
    }
  `;hass;task;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.nameError="",this.saveError="",this.saving=!1}configure(e,t){this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||""}async save(){let e=this.name.trim();if(!e)return this.nameError="Name is required",!1;if(!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await Ve(this.hass,this.task,{name:e,description:this.description,active:this.status==="active",icon:this.icon}),!0}catch(t){return this.saveError=t instanceof Error?t.message:String(t),!1}finally{this.saving=!1}}render(){return R`
      <form @submit=${e=>e.preventDefault()}>
        <${W}
          label="Name"
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${W}>
        <${W}
          label="Description"
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${W}>
        <${We}
          label="Status"
          .value=${this.status}
          .options=${mt}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${We}>
        <${Ke}
          label="Icon"
          .value=${this.icon}
          .options=${gt}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${Ke}>
        ${this.saveError?l`<p class="error" role="alert">${this.saveError}</p>`:null}
      </form>
    `}},fe=g("task-form");customElements.get(fe)||customElements.define(fe,ve);var Je=async(o,e)=>{let t=document.createElement(fe);return t.configure(o,e),await I({heading:`Edit ${e.task_name}`,content:t,actions:[{label:"Cancel",value:"cancel"},{label:"Save",value:"save",run:()=>t.save()}]})==="save"};var $e=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=v`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),r=window.visualViewport,n=r?.offsetLeft||0,h=r?.offsetTop||0,a=n+(r?.width||window.innerWidth),d=h+(r?.height||window.innerHeight),p=8,c=4,f=Math.min(Math.max(n+p,s.right-i.width),a-i.width-p),$=s.bottom+c,k=$+i.height<=d-p?$:Math.max(h+p,s.top-i.height-c);t.style.left=`${f}px`,t.style.top=`${k}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return l`
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
        ${this.items.map(e=>l`
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
    `}},K=g("action-menu");customElements.get(K)||customElements.define(K,$e);var be=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=v`
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
  `;constructor(){super(),this.heading="",this.open=!1}render(){return l`
      <details
        ?open=${this.open}
        @toggle=${e=>{this.open=e.currentTarget.open}}
      >
        <summary>${this.heading}</summary>
        <div class="content"><slot></slot></div>
      </details>
    `}},J=g("expandable");customElements.get(J)||customElements.define(J,be);var ye=class extends m{static properties={tone:{reflect:!0}};static styles=v`
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
  `;constructor(){super(),this.tone="default"}render(){return l`<span><slot></slot></span>`}},Z=g("pill");customElements.get(Z)||customElements.define(Z,ye);var Ze=x(K),Ge=x(J),G=x(Z),vt=[{label:"Open",value:"open"},{label:"Edit",value:"edit"}],xe=class extends m{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=v`
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
  `;unsubscribe;connection;updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let t=await Fe(this.hass,s=>{this.snapshot=s});this.connection===e?this.unsubscribe=t:t()}catch(t){this.connection===e&&(this.error=t instanceof Error?t.message:String(t))}}openTask(e){I({heading:e.task_name,content:R`
        <p>
          <${G} tone=${e.active===!1?"muted":"positive"}>
            ${e.active===!1?"Inactive":"Active"}
          </${G}>
          <${G}>${e.schedule_type||"Unknown trigger"}</${G}>
        </p>
        ${e.task_description?l`<p>${e.task_description}</p>`:u}
        <${Ge} heading="Planning" open>
          <p>Due: ${e.task_due||"Not scheduled"}</p>
          <p>Trigger: ${e.schedule_type||"Unknown"}</p>
        </${Ge}>
      `,actions:[{label:"Close",value:"close"}]})}render(){let e=this.snapshot;return l`
      <main>
        <header>
          <h1>Tasks V2</h1>
          ${e?l`${e.tasks.length} Tasks · Revision ${e.revision}`:u}
        </header>
        ${this.error?l`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`:e?l`
                <ul>
                  ${e.tasks.map(t=>R`
                      <li>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.openTask(t)}
                        >
                          ${t.task_name}
                        </button>
                        <${Ze}
                          label="Actions for ${t.task_name}"
                          .items=${vt}
                          @tasks-action=${s=>{s.detail==="open"?this.openTask(t):s.detail==="edit"&&this.hass&&Je(this.hass,t)}}
                        ></${Ze}>
                      </li>
                    `)}
                </ul>
              `:l`<p>Tasks werden geladen …</p>`}
      </main>
    `}},Qe=g("panel-v2");customElements.get(Qe)||customElements.define(Qe,xe);
