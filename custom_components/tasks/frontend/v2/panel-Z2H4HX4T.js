var L=globalThis,R=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,q=Symbol(),dt=new WeakMap,C=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(R&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=dt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&dt.set(e,t))}return t}toString(){return this.cssText}},pt=o=>new C(typeof o=="string"?o:o+"",void 0,q),v=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new C(e,o,q)},ut=(o,t)=>{if(R)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=L.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},W=R?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return pt(e)})(o):o;var{is:Dt,defineProperty:zt,getOwnPropertyDescriptor:Bt,getOwnPropertyNames:It,getOwnPropertySymbols:jt,getPrototypeOf:Vt}=Object,O=globalThis,mt=O.trustedTypes,qt=mt?mt.emptyScript:"",Wt=O.reactiveElementPolyfillSupport,P=(o,t)=>o,K={toAttribute(o,t){switch(t){case Boolean:o=o?qt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ft=(o,t)=>!Dt(o,t),gt={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:ft};Symbol.metadata??=Symbol("metadata"),O.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=gt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&zt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=Bt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let h=i?.call(this);r?.call(this,n),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gt}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let t=Vt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let e=this.properties,s=[...It(e),...jt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(W(i))}else t!==void 0&&e.push(W(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ut(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:K).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:K;this._$Em=i;let h=n.fromAttribute(e,r.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let n=this.constructor;if(i===!1&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??ft)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,h=this[i];n!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,r,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[P("elementProperties")]=new Map,b[P("finalized")]=new Map,Wt?.({ReactiveElement:b}),(O.reactiveElementVersions??=[]).push("2.1.2");var Y=globalThis,vt=o=>o,D=Y.trustedTypes,$t=D?D.createPolicy("lit-html",{createHTML:o=>o}):void 0,Et="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+y,Kt=`<${wt}>`,A=document,M=()=>A.createComment(""),H=o=>o===null||typeof o!="object"&&typeof o!="function",tt=Array.isArray,Ft=o=>tt(o)||typeof o?.[Symbol.iterator]=="function",F=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bt=/-->/g,yt=/>/g,_=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,xt=/"/g,St=/^(?:script|style|textarea|title)$/i,et=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),u=et(1),kt=et(2),Ct=et(3),E=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),At=new WeakMap,x=A.createTreeWalker(A,129);function Pt(o,t){if(!tt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(t):t}var Jt=(o,t)=>{let e=o.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",n=T;for(let h=0;h<e;h++){let a=o[h],c,d,l=-1,g=0;for(;g<a.length&&(n.lastIndex=g,d=n.exec(a),d!==null);)g=n.lastIndex,n===T?d[1]==="!--"?n=bt:d[1]!==void 0?n=yt:d[2]!==void 0?(St.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=_):d[3]!==void 0&&(n=_):n===_?d[0]===">"?(n=i??T,l=-1):d[1]===void 0?l=-2:(l=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?_:d[3]==='"'?xt:_t):n===xt||n===_t?n=_:n===bt||n===yt?n=T:(n=_,i=void 0);let f=n===_&&o[h+1].startsWith("/>")?" ":"";r+=n===T?a+Kt:l>=0?(s.push(c),a.slice(0,l)+Et+a.slice(l)+y+f):a+y+(l===-2?h:f)}return[Pt(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},N=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0,h=t.length-1,a=this.parts,[c,d]=Jt(t,e);if(this.el=o.createElement(c,s),x.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=x.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(Et)){let g=d[n++],f=i.getAttribute(l).split(y),w=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:w[2],strings:f,ctor:w[1]==="."?Z:w[1]==="?"?G:w[1]==="@"?Q:k}),i.removeAttribute(l)}else l.startsWith(y)&&(a.push({type:6,index:r}),i.removeAttribute(l));if(St.test(i.tagName)){let l=i.textContent.split(y),g=l.length-1;if(g>0){i.textContent=D?D.emptyScript:"";for(let f=0;f<g;f++)i.append(l[f],M()),x.nextNode(),a.push({type:2,index:++r});i.append(l[g],M())}}}else if(i.nodeType===8)if(i.data===wt)a.push({type:2,index:r});else{let l=-1;for(;(l=i.data.indexOf(y,l+1))!==-1;)a.push({type:7,index:r}),l+=y.length-1}r++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function S(o,t,e=o,s){if(t===E)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=H(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=S(o,i._$AS(o,t.values),i,s)),t}var J=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??A).importNode(e,!0);x.currentNode=i;let r=x.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new U(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new X(r,this,t)),this._$AV.push(c),a=s[++h]}n!==a?.index&&(r=x.nextNode(),n++)}return x.currentNode=A,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=S(this,t,e),H(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ft(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=N.createElement(Pt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new J(i,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=At.get(t.strings);return e===void 0&&At.set(t.strings,e=new N(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new o(this.O(M()),this.O(M()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=vt(t).nextSibling;vt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let r=this.strings,n=!1;if(r===void 0)t=S(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==E,n&&(this._$AH=t);else{let h=t,a,c;for(t=r[0],a=0;a<r.length-1;a++)c=S(this,h[s+a],e,a),c===E&&(c=this._$AH[a]),n||=!H(c)||c!==this._$AH[a],c===p?t=p:t!==p&&(t+=(c??"")+r[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Z=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},G=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Q=class extends k{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=S(this,t,e,0)??p)===E)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},X=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}};var Zt=Y.litHtmlPolyfillSupport;Zt?.(N,U),(Y.litHtmlVersions??=[]).push("3.3.3");var Tt=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new U(t.insertBefore(M(),r),r,void 0,e??{})}return i._$AI(o),i};var st=globalThis,m=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};m._$litElement$=!0,m.finalized=!0,st.litElementHydrateSupport?.({LitElement:m});var Gt=st.litElementPolyfillSupport;Gt?.({LitElement:m});(st.litElementVersions??=[]).push("4.2.2");var Ht=Symbol.for(""),Qt=o=>{if(o?.r===Ht)return o?._$litStatic$},z=o=>({_$litStatic$:o,r:Ht});var Mt=new Map,it=o=>(t,...e)=>{let s=e.length,i,r,n=[],h=[],a,c=0,d=!1;for(;c<s;){for(a=t[c];c<s&&(r=e[c],(i=Qt(r))!==void 0);)a+=i+t[++c],d=!0;c!==s&&h.push(r),n.push(a),c++}if(c===s&&n.push(t[s]),d){let l=n.join("$$lit$$");(t=Mt.get(l))===void 0&&(n.raw=n,Mt.set(l,t=n)),e=h}return o(t,...e)},ot=it(u),ve=it(kt),$e=it(Ct);var Nt=(o,t)=>o.connection.subscribeMessage(t,{type:"tasks/subscribe"});var Xt=new URL(import.meta.url).pathname.match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]?.toLowerCase()||"dev",$=o=>`ha-tasks-${o}-${Xt}`;var rt=class extends m{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=v`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(t){t.stopPropagation();let e=this.menu;e&&(this.open?e.hidePopover():(e.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let t=this.trigger,e=this.menu;if(!t||!e)return;let s=t.getBoundingClientRect(),i=e.getBoundingClientRect(),r=window.visualViewport,n=r?.offsetLeft||0,h=r?.offsetTop||0,a=n+(r?.width||window.innerWidth),c=h+(r?.height||window.innerHeight),d=8,l=4,g=Math.min(Math.max(n+d,s.right-i.width),a-i.width-d),f=s.bottom+l,w=f+i.height<=c-d?f:Math.max(h+d,s.top-i.height-l);e.style.left=`${g}px`,e.style.top=`${w}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(t){let e=this.menuItems();if(!e.length)return;let s=e.indexOf(this.renderRoot.activeElement),i;t.key==="ArrowDown"?i=(s+1)%e.length:t.key==="ArrowUp"?i=(s-1+e.length)%e.length:t.key==="Home"?i=0:t.key==="End"&&(i=e.length-1),i!==void 0&&(t.preventDefault(),e[i].focus())}choose(t,e){t.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:e.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return u`
      <button
        class="trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded=${this.open}
        aria-label=${this.label}
        @click=${t=>this.toggleMenu(t)}
      >
        ⋮
      </button>
      <div
        class="menu"
        popover="auto"
        role="menu"
        @click=${t=>t.stopPropagation()}
        @keydown=${t=>this.moveFocus(t)}
        @toggle=${t=>{let e=t.newState==="open";this.open=e,e?this.trackPosition():this.stopTrackingPosition()}}
      >
        ${this.items.map(t=>u`
            <button
              class=${t.destructive?"item destructive":"item"}
              type="button"
              role="menuitem"
              ?disabled=${t.disabled}
              @click=${e=>this.choose(e,t)}
            >
              ${t.label}
            </button>
          `)}
      </div>
    `}},B=$("action-menu");customElements.get(B)||customElements.define(B,rt);var nt=class extends m{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=v`
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
  `;constructor(){super(),this.heading="",this.content=u``,this.actions=[],this.open=!1}updated(){let t=this.renderRoot.querySelector("dialog");t&&(this.open&&!t.open?t.showModal():!this.open&&t.open&&t.close())}close(t=""){this.renderRoot.querySelector("dialog")?.close(t)}render(){return u`
      <dialog
        aria-labelledby="title"
        @close=${t=>{this.open=!1,this.dispatchEvent(new CustomEvent("tasks-dialog-closed",{bubbles:!0,composed:!0,detail:t.currentTarget.returnValue}))}}
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
          ${this.actions.length?u`
                <footer>
                  ${this.actions.map(t=>u`
                      <button
                        class=${t.destructive?"destructive":p}
                        type="button"
                        @click=${()=>this.close(t.value)}
                      >
                        ${t.label}
                      </button>
                    `)}
                </footer>
              `:p}
        </article>
      </dialog>
    `}},at=$("dialog");customElements.get(at)||customElements.define(at,nt);var Ut=({heading:o,content:t,actions:e=[]})=>{let s=document.createElement(at);return s.heading=o,s.content=t,s.actions=e,document.body.append(s),s.open=!0,new Promise(i=>{s.addEventListener("tasks-dialog-closed",r=>{s.remove(),i(r.detail)},{once:!0})})};var lt=class extends m{static properties={heading:{},open:{type:Boolean}};static styles=v`
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
  `;constructor(){super(),this.heading="",this.open=!1}render(){return u`
      <details
        ?open=${this.open}
        @toggle=${t=>{this.open=t.currentTarget.open}}
      >
        <summary>${this.heading}</summary>
        <div class="content"><slot></slot></div>
      </details>
    `}},I=$("expandable");customElements.get(I)||customElements.define(I,lt);var ct=class extends m{static properties={tone:{reflect:!0}};static styles=v`
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
  `;constructor(){super(),this.tone="default"}render(){return u`<span><slot></slot></span>`}},j=$("pill");customElements.get(j)||customElements.define(j,ct);var Lt=z(B),Rt=z(I),V=z(j),Yt=[{label:"Open",value:"open"}],ht=class extends m{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=v`
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
  `;unsubscribe;connection;updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let t=this.hass.connection;this.connection=t,this.error=void 0;try{let e=await Nt(this.hass,s=>{this.snapshot=s});this.connection===t?this.unsubscribe=e:e()}catch(e){this.connection===t&&(this.error=e instanceof Error?e.message:String(e))}}openTask(t){Ut({heading:t.task_name,content:ot`
        <p>
          <${V} tone=${t.active===!1?"muted":"positive"}>
            ${t.active===!1?"Inactive":"Active"}
          </${V}>
          <${V}>${t.schedule_type||"Unknown trigger"}</${V}>
        </p>
        ${t.task_description?u`<p>${t.task_description}</p>`:p}
        <${Rt} heading="Planning" open>
          <p>Due: ${t.due||"Not scheduled"}</p>
          <p>Trigger: ${t.schedule_type||"Unknown"}</p>
        </${Rt}>
      `,actions:[{label:"Close",value:"close"}]})}render(){let t=this.snapshot;return u`
      <main>
        <header>
          <h1>Tasks V2</h1>
          ${t?u`${t.tasks.length} Tasks · Revision ${t.revision}`:p}
        </header>
        ${this.error?u`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`:t?u`
                <ul>
                  ${t.tasks.map(e=>ot`
                      <li>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.openTask(e)}
                        >
                          ${e.task_name}
                        </button>
                        <${Lt}
                          label="Actions for ${e.task_name}"
                          .items=${Yt}
                          @tasks-action=${s=>{s.detail==="open"&&this.openTask(e)}}
                        ></${Lt}>
                      </li>
                    `)}
                </ul>
              `:u`<p>Tasks werden geladen …</p>`}
      </main>
    `}},Ot=$("panel-v2");customElements.get(Ot)||customElements.define(Ot,ht);
