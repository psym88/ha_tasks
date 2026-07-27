var oe=globalThis,le=oe.ShadowRoot&&(oe.ShadyCSS===void 0||oe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),yt=new WeakMap,J=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(le&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=yt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&yt.set(t,e))}return e}toString(){return this.cssText}},_t=r=>new J(typeof r=="string"?r:r+"",void 0,Pe),$=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new J(t,r,Pe)},kt=(r,e)=>{if(le)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=oe.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},De=le?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return _t(t)})(r):r;var{is:Ss,defineProperty:Cs,getOwnPropertyDescriptor:Ps,getOwnPropertyNames:Ds,getOwnPropertySymbols:Is,getPrototypeOf:Ns}=Object,ce=globalThis,xt=ce.trustedTypes,Ms=xt?xt.emptyScript:"",Hs=ce.reactiveElementPolyfillSupport,G=(r,e)=>r,Ie={toAttribute(r,e){switch(e){case Boolean:r=r?Ms:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},wt=(r,e)=>!Ss(r,e),Et={attribute:!0,type:String,converter:Ie,reflect:!1,useDefault:!1,hasChanged:wt};Symbol.metadata??=Symbol("metadata"),ce.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Et){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Cs(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=Ps(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let h=i?.call(this);a?.call(this,o),this.requestUpdate(e,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Et}static _$Ei(){if(this.hasOwnProperty(G("elementProperties")))return;let e=Ns(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(G("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(G("properties"))){let t=this.properties,s=[...Ds(t),...Is(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(De(i))}else e!==void 0&&t.push(De(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return kt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:Ie).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ie;this._$Em=i;let h=o.fromAttribute(t,a.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let o=this.constructor;if(i===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??wt)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:o}=a,h=this[i];o!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,a,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[G("elementProperties")]=new Map,S[G("finalized")]=new Map,Hs?.({ReactiveElement:S}),(ce.reactiveElementVersions??=[]).push("2.1.2");var Re=globalThis,At=r=>r,de=Re.trustedTypes,Tt=de?de.createPolicy("lit-html",{createHTML:r=>r}):void 0,Nt="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Mt="?"+C,Os=`<${Mt}>`,H=document,X=()=>H.createComment(""),Y=r=>r===null||typeof r!="object"&&typeof r!="function",Fe=Array.isArray,Ls=r=>Fe(r)||typeof r?.[Symbol.iterator]=="function",Ne=`[ 	
\f\r]`,Q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,St=/-->/g,Ct=/>/g,N=RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pt=/'/g,Dt=/"/g,Ht=/^(?:script|style|textarea|title)$/i,Be=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),l=Be(1),pi=Be(2),mi=Be(3),O=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),It=new WeakMap,M=H.createTreeWalker(H,129);function Ot(r,e){if(!Fe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Tt!==void 0?Tt.createHTML(e):e}var Us=(r,e)=>{let t=r.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",o=Q;for(let h=0;h<t;h++){let d=r[h],c,p,u=-1,v=0;for(;v<d.length&&(o.lastIndex=v,p=o.exec(d),p!==null);)v=o.lastIndex,o===Q?p[1]==="!--"?o=St:p[1]!==void 0?o=Ct:p[2]!==void 0?(Ht.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=N):p[3]!==void 0&&(o=N):o===N?p[0]===">"?(o=i??Q,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,c=p[1],o=p[3]===void 0?N:p[3]==='"'?Dt:Pt):o===Dt||o===Pt?o=N:o===St||o===Ct?o=Q:(o=N,i=void 0);let b=o===N&&r[h+1].startsWith("/>")?" ":"";a+=o===Q?d+Os:u>=0?(s.push(c),d.slice(0,u)+Nt+d.slice(u)+C+b):d+C+(u===-2?h:b)}return[Ot(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},ee=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0,h=e.length-1,d=this.parts,[c,p]=Us(e,t);if(this.el=r.createElement(c,s),M.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&d.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Nt)){let v=p[o++],b=i.getAttribute(u).split(C),w=/([.?@])?(.*)/.exec(v);d.push({type:1,index:a,name:w[2],strings:b,ctor:w[1]==="."?He:w[1]==="?"?Oe:w[1]==="@"?Le:j}),i.removeAttribute(u)}else u.startsWith(C)&&(d.push({type:6,index:a}),i.removeAttribute(u));if(Ht.test(i.tagName)){let u=i.textContent.split(C),v=u.length-1;if(v>0){i.textContent=de?de.emptyScript:"";for(let b=0;b<v;b++)i.append(u[b],X()),M.nextNode(),d.push({type:2,index:++a});i.append(u[v],X())}}}else if(i.nodeType===8)if(i.data===Mt)d.push({type:2,index:a});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)d.push({type:7,index:a}),u+=C.length-1}a++}}static createElement(e,t){let s=H.createElement("template");return s.innerHTML=e,s}};function B(r,e,t=r,s){if(e===O)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=Y(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=B(r,i._$AS(r,e.values),i,s)),e}var Me=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??H).importNode(t,!0);M.currentNode=i;let a=M.nextNode(),o=0,h=0,d=s[0];for(;d!==void 0;){if(o===d.index){let c;d.type===2?c=new te(a,a.nextSibling,this,e):d.type===1?c=new d.ctor(a,d.name,d.strings,this,e):d.type===6&&(c=new Ue(a,this,e)),this._$AV.push(c),d=s[++h]}o!==d?.index&&(a=M.nextNode(),o++)}return M.currentNode=H,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},te=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=B(this,e,t),Y(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==O&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ls(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&Y(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=ee.createElement(Ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new Me(i,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=It.get(e.strings);return t===void 0&&It.set(e.strings,t=new ee(e)),t}k(e){Fe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new r(this.O(X()),this.O(X()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=At(e).nextSibling;At(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},j=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(e,t=this,s,i){let a=this.strings,o=!1;if(a===void 0)e=B(this,e,t,0),o=!Y(e)||e!==this._$AH&&e!==O,o&&(this._$AH=e);else{let h=e,d,c;for(e=a[0],d=0;d<a.length-1;d++)c=B(this,h[s+d],t,d),c===O&&(c=this._$AH[d]),o||=!Y(c)||c!==this._$AH[d],c===m?e=m:e!==m&&(e+=(c??"")+a[d+1]),this._$AH[d]=c}o&&!i&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},He=class extends j{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},Oe=class extends j{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},Le=class extends j{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=B(this,e,t,0)??m)===O)return;let s=this._$AH,i=e===m&&s!==m||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ue=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){B(this,e)}};var Rs=Re.litHtmlPolyfillSupport;Rs?.(ee,te),(Re.litHtmlVersions??=[]).push("3.3.3");var Lt=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let a=t?.renderBefore??null;s._$litPart$=i=new te(e.insertBefore(X(),a),a,void 0,t??{})}return i._$AI(r),i};var je=globalThis,g=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Lt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}};g._$litElement$=!0,g.finalized=!0,je.litElementHydrateSupport?.({LitElement:g});var Fs=je.litElementPolyfillSupport;Fs?.({LitElement:g});(je.litElementVersions??=[]).push("4.2.2");var he=globalThis,pe=he.ShadowRoot&&(he.ShadyCSS===void 0||he.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Rt=Symbol(),Ut=new WeakMap,ue=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(pe&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Ut.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ut.set(t,e))}return e}toString(){return this.cssText}},Ft=r=>new ue(typeof r=="string"?r:r+"",void 0,Rt);var Bt=(r,e)=>{if(pe)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=he.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},ze=pe?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Ft(t)})(r):r;var{is:Bs,defineProperty:js,getOwnPropertyDescriptor:zs,getOwnPropertyNames:Ks,getOwnPropertySymbols:qs,getPrototypeOf:Vs}=Object,me=globalThis,jt=me.trustedTypes,Ws=jt?jt.emptyScript:"",Zs=me.reactiveElementPolyfillSupport,se=(r,e)=>r,Ke={toAttribute(r,e){switch(e){case Boolean:r=r?Ws:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Kt=(r,e)=>!Bs(r,e),zt={attribute:!0,type:String,converter:Ke,reflect:!1,useDefault:!1,hasChanged:Kt};Symbol.metadata??=Symbol("metadata"),me.litPropertyMetadata??=new WeakMap;var L=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=zt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&js(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=zs(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let h=i?.call(this);a?.call(this,o),this.requestUpdate(e,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??zt}static _$Ei(){if(this.hasOwnProperty(se("elementProperties")))return;let e=Vs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(se("properties"))){let t=this.properties,s=[...Ks(t),...qs(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(ze(i))}else e!==void 0&&t.push(ze(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:Ke).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ke;this._$Em=i;let h=o.fromAttribute(t,a.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let o=this.constructor;if(i===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??Kt)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:o}=a,h=this[i];o!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,a,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};L.elementStyles=[],L.shadowRootOptions={mode:"open"},L[se("elementProperties")]=new Map,L[se("finalized")]=new Map,Zs?.({ReactiveElement:L}),(me.reactiveElementVersions??=[]).push("2.1.2");var Qe=globalThis,qt=r=>r,ge=Qe.trustedTypes,Vt=ge?ge.createPolicy("lit-html",{createHTML:r=>r}):void 0,Xt="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Yt="?"+P,Js=`<${Yt}>`,F=document,ve=()=>F.createComment(""),re=r=>r===null||typeof r!="object"&&typeof r!="function",Xe=Array.isArray,Gs=r=>Xe(r)||typeof r?.[Symbol.iterator]=="function",qe=`[ 	
\f\r]`,ie=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wt=/-->/g,Zt=/>/g,U=RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Jt=/'/g,Gt=/"/g,es=/^(?:script|style|textarea|title)$/i,Ye=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),ts=Ye(1),ss=Ye(2),is=Ye(3),ne=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Qt=new WeakMap,R=F.createTreeWalker(F,129);function rs(r,e){if(!Xe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vt!==void 0?Vt.createHTML(e):e}var Qs=(r,e)=>{let t=r.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",o=ie;for(let h=0;h<t;h++){let d=r[h],c,p,u=-1,v=0;for(;v<d.length&&(o.lastIndex=v,p=o.exec(d),p!==null);)v=o.lastIndex,o===ie?p[1]==="!--"?o=Wt:p[1]!==void 0?o=Zt:p[2]!==void 0?(es.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=U):p[3]!==void 0&&(o=U):o===U?p[0]===">"?(o=i??ie,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,c=p[1],o=p[3]===void 0?U:p[3]==='"'?Gt:Jt):o===Gt||o===Jt?o=U:o===Wt||o===Zt?o=ie:(o=U,i=void 0);let b=o===U&&r[h+1].startsWith("/>")?" ":"";a+=o===ie?d+Js:u>=0?(s.push(c),d.slice(0,u)+Xt+d.slice(u)+P+b):d+P+(u===-2?h:b)}return[rs(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},ae=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0,h=e.length-1,d=this.parts,[c,p]=Qs(e,t);if(this.el=r.createElement(c,s),R.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=R.nextNode())!==null&&d.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Xt)){let v=p[o++],b=i.getAttribute(u).split(P),w=/([.?@])?(.*)/.exec(v);d.push({type:1,index:a,name:w[2],strings:b,ctor:w[1]==="."?We:w[1]==="?"?Ze:w[1]==="@"?Je:K}),i.removeAttribute(u)}else u.startsWith(P)&&(d.push({type:6,index:a}),i.removeAttribute(u));if(es.test(i.tagName)){let u=i.textContent.split(P),v=u.length-1;if(v>0){i.textContent=ge?ge.emptyScript:"";for(let b=0;b<v;b++)i.append(u[b],ve()),R.nextNode(),d.push({type:2,index:++a});i.append(u[v],ve())}}}else if(i.nodeType===8)if(i.data===Yt)d.push({type:2,index:a});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)d.push({type:7,index:a}),u+=P.length-1}a++}}static createElement(e,t){let s=F.createElement("template");return s.innerHTML=e,s}};function z(r,e,t=r,s){if(e===ne)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=re(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=z(r,i._$AS(r,e.values),i,s)),e}var Ve=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??F).importNode(t,!0);R.currentNode=i;let a=R.nextNode(),o=0,h=0,d=s[0];for(;d!==void 0;){if(o===d.index){let c;d.type===2?c=new fe(a,a.nextSibling,this,e):d.type===1?c=new d.ctor(a,d.name,d.strings,this,e):d.type===6&&(c=new Ge(a,this,e)),this._$AV.push(c),d=s[++h]}o!==d?.index&&(a=R.nextNode(),o++)}return R.currentNode=F,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},fe=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),re(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==ne&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Gs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&re(this._$AH)?this._$AA.nextSibling.data=e:this.T(F.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=ae.createElement(rs(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new Ve(i,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=Qt.get(e.strings);return t===void 0&&Qt.set(e.strings,t=new ae(e)),t}k(e){Xe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new r(this.O(ve()),this.O(ve()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=qt(e).nextSibling;qt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},K=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,i){let a=this.strings,o=!1;if(a===void 0)e=z(this,e,t,0),o=!re(e)||e!==this._$AH&&e!==ne,o&&(this._$AH=e);else{let h=e,d,c;for(e=a[0],d=0;d<a.length-1;d++)c=z(this,h[s+d],t,d),c===ne&&(c=this._$AH[d]),o||=!re(c)||c!==this._$AH[d],c===_?e=_:e!==_&&(e+=(c??"")+a[d+1]),this._$AH[d]=c}o&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},We=class extends K{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},Ze=class extends K{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},Je=class extends K{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=z(this,e,t,0)??_)===ne)return;let s=this._$AH,i=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ge=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}};var Xs=Qe.litHtmlPolyfillSupport;Xs?.(ae,fe),(Qe.litHtmlVersions??=[]).push("3.3.3");var as=Symbol.for(""),Ys=r=>{if(r?.r===as)return r?._$litStatic$},x=r=>({_$litStatic$:r,r:as});var ns=new Map,et=r=>(e,...t)=>{let s=t.length,i,a,o=[],h=[],d,c=0,p=!1;for(;c<s;){for(d=e[c];c<s&&(a=t[c],(i=Ys(a))!==void 0);)d+=i+e[++c],p=!0;c!==s&&h.push(a),o.push(d),c++}if(c===s&&o.push(e[s]),p){let u=o.join("$$lit$$");(e=ns.get(u))===void 0&&(o.raw=o,ns.set(u,e=o)),t=h}return r(e,...t)},y=et(ts),Mi=et(ss),Hi=et(is);var Ri=(r,e)=>r.connection.subscribeMessage(e,{type:"tasks/subscribe"}),os=r=>{if(r.type==="sensor")return{schedule_type:r.type,problem_sensor:r.problemSensor.trim()};let e={schedule_type:r.type,schedule_unit:r.unit,schedule_interval:r.interval};return r.type==="fixed"&&(e.schedule_time=r.time,r.unit==="weekly"?e.schedule_weekdays=r.weekdays:r.unit==="monthly"?e.schedule_day=r.day:r.unit==="yearly"&&(e.schedule_day=r.day,e.schedule_month=r.month)),e},ei=async(r,e)=>{let t=new FormData;t.append("file",e);let s=await r.fetchWithAuth("/api/file_upload",{method:"POST",body:t});if(!s.ok)throw new Error(`File upload failed (${s.status})`);return(await s.json()).file_id},ls=async(r,e,t)=>{let s=await Promise.all((t.files?.staged||[]).map(i=>ei(r,i)));return r.connection.sendMessagePromise({type:"tasks/task/save",...e?{task_id:e.task_id}:{},task_name:t.name.trim(),task_description:t.description.trim()||null,task_icon:t.icon.trim()||null,active:t.active,...t.schedule?os(t.schedule):e?{schedule_type:e.schedule_type}:{},...t.assignment?{assignee_id:t.assignment.assigneeId||null,label_ids:t.assignment.labelIds,nfc_tag_id:t.assignment.nfcTagId||null}:{},...t.notification?{notification_target:t.notification.deviceIds.length?{device_id:t.notification.deviceIds}:{},notification_persistent:t.notification.persistent,notification_critical:t.notification.critical,notification_route:t.notification.route.trim()||null}:{},file_ids:s,deleted_attachment_ids:t.files?.deletedAttachmentIds||[],deleted_history_entry_ids:t.files?.deletedHistoryEntryIds||[]})},q=async r=>{let[e,t,s]=await Promise.all([r.connection.sendMessagePromise({type:"tasks/list"}),r.connection.sendMessagePromise({type:"tag/list"}).catch(()=>[]),r.connection.sendMessagePromise({type:"config/label_registry/list"}).catch(()=>[])]);return{users:e.users||[],tags:Array.isArray(t)?t:[],labels:Array.isArray(s)?s:[]}},be=async r=>{let e=await r.connection.sendMessagePromise({type:"config/device_registry/list"});return(Array.isArray(e)?e:[]).filter(t=>t.identifiers?.some(s=>s?.[0]==="mobile_app"))},cs=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/bulk",operations:e}),$e=(r,e)=>r.connection.sendMessagePromise({type:"tasks/history/list",task_id:e}),ds=(r,e)=>r.connection.sendMessagePromise({type:"tasks/attachment/urls",task_id:e}),hs=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/complete",task_id:e,notes:t.trim()||null}),Fi=(r,e)=>r.connection.sendMessagePromise({type:"tasks/task/delete",task_id:e}),Bi=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/update",task_id:e,active:t}),us=(r,e,t)=>r.connection.sendMessagePromise({type:"tasks/task/preview_next_due",...os(e),...t?{task_due:t}:{}});var ps=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1],ti=ps?`?v=${encodeURIComponent(decodeURIComponent(ps))}`:"",fs={},ms="",gs="",tt=new Map,si=r=>{let e=String(r||"en").toLowerCase().split(/[-_]/)[0];return/^[a-z]{2,3}$/.test(e)?e:"en"},vs=r=>{if(!tt.has(r)){let e=r==="en"?"/tasks_strings.json":`/tasks_translations/${r}.json`;tt.set(r,fetch(`${e}${ti}`).then(async t=>t.ok?t.json():{}).then(t=>t.frontend||{}).catch(()=>({})))}return tt.get(r)},n=(r,e={})=>String(fs[r]??r).replace(/\{(\w+)\}/g,(t,s)=>String(e[s]??`{${s}}`));async function ii(r){let e=si(r);gs=e;let t=await vs("en"),s=e==="en"?t:await vs(e);gs===e&&ms!==e&&(ms=e,fs={...t,...s})}var zi=ii(globalThis.navigator?.language);var f=r=>`ha-tasks-v2-${r}`;var st=class extends g{static properties={heading:{},content:{attribute:!1},actions:{attribute:!1},open:{type:Boolean}};static styles=$`
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
              aria-label=${n("common.close")}
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
                        class=${e.destructive?"destructive":m}
                        type="button"
                        @click=${()=>{this.run(e)}}
                      >
                        ${e.label}
                      </button>
                    `)}
                </footer>
              `:m}
        </article>
      </dialog>
    `}},it=f("dialog");customElements.get(it)||customElements.define(it,st);var D=({heading:r,content:e,actions:t=[]})=>{let s=document.createElement(it);return s.heading=r,s.content=e,s.actions=t,document.body.append(s),s.open=!0,new Promise(i=>{s.addEventListener("tasks-dialog-closed",a=>{s.remove(),i(a.detail)},{once:!0})})};var rt=class extends g{static properties={heading:{},open:{type:Boolean}};static styles=$`
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
    `}},V=f("expandable");customElements.get(V)||customElements.define(V,rt);var dt=$`
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
`,I=class extends g{static properties={label:{},value:{},required:{type:Boolean},disabled:{type:Boolean},error:{}};static styles=dt;constructor(){super(),this.label="",this.value="",this.required=!1,this.disabled=!1,this.error=""}change(e){this.value=e,this.error="",this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:e}))}errorMessage(){return this.error?l`<span class="error" role="alert">${this.error}</span>`:null}},nt=class extends I{static properties={...I.properties,multiline:{type:Boolean},inputType:{attribute:"input-type"},min:{type:Number}};constructor(){super(),this.multiline=!1,this.inputType="text",this.min=void 0}render(){return l`
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
    `}},at=class extends I{static properties={...I.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return l`
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
    `}},ot=class extends I{static properties={...I.properties,options:{attribute:!1}};constructor(){super(),this.options=[]}render(){return l`
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
    `}},lt=class extends g{static properties={label:{},value:{attribute:!1},options:{attribute:!1},disabled:{type:Boolean}};static styles=dt;constructor(){super(),this.label="",this.value=[],this.options=[],this.disabled=!1}toggle(e,t){this.value=t?[...new Set([...this.value,e])]:this.value.filter(s=>s!==e),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.value}))}render(){return l`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <div class="choices">
          ${this.options.map(e=>l`
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
    `}},ct=class extends g{static properties={label:{},description:{},checked:{type:Boolean},disabled:{type:Boolean}};static styles=[dt,$`
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
    `];constructor(){super(),this.label="",this.description="",this.checked=!1,this.disabled=!1}render(){return l`
      <label>
        <span class="copy">
          <span>${this.label}</span>
          ${this.description?l`<small>${this.description}</small>`:null}
        </span>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${e=>{this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:this.checked}))}}
        />
      </label>
    `}},W=f("text-field"),ye=f("select-field"),_e=f("combobox-field"),ke=f("multi-select-field"),xe=f("switch-field");customElements.get(W)||customElements.define(W,nt);customElements.get(ye)||customElements.define(ye,at);customElements.get(_e)||customElements.define(_e,ot);customElements.get(ke)||customElements.define(ke,lt);customElements.get(xe)||customElements.define(xe,ct);var A=x(W),k=x(ye),Ee=x(_e),we=x(ke),Ae=x(xe),T=x(V),ri=()=>[{label:n("v2.active"),value:"active"},{label:n("v2.inactive"),value:"inactive"}],ni=()=>[{label:n("v2.title"),value:"mdi:clipboard-check-outline"},{label:"\u{1F6E0}",value:"mdi:wrench-outline"},{label:"\u{1F9F9}",value:"mdi:broom"},{label:"\u2302",value:"mdi:home-outline"},{label:"\u{1F4C5}",value:"mdi:calendar-check-outline"}],bs=()=>[{label:n("task.sliding"),value:"sliding"},{label:n("task.fixed"),value:"fixed"},{label:n("task.problem_sensor"),value:"sensor"}],ai=()=>[{label:n("task.daily"),value:"daily"},{label:n("task.weekly"),value:"weekly"},{label:n("task.monthly"),value:"monthly"},{label:n("task.yearly"),value:"yearly"}],$s=()=>[...Array.from({length:31},(r,e)=>({label:String(e+1),value:String(e+1)})),{label:n("task.last_day"),value:"last"}],oi=(r,e)=>{let t=e?new Date(e):new Date;return Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:r.config?.time_zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).filter(s=>s.type!=="literal").map(s=>[s.type,s.value]))},ht=class extends g{static properties={name:{state:!0},description:{state:!0},status:{state:!0},icon:{state:!0},assigneeId:{state:!0},labelIds:{state:!0},nfcTagId:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},assignmentLoading:{state:!0},assignmentError:{state:!0},notificationDeviceIds:{state:!0},notificationPersistent:{state:!0},notificationCritical:{state:!0},notificationRoute:{state:!0},devices:{state:!0},notificationLoading:{state:!0},notificationError:{state:!0},notificationRouteError:{state:!0},attachments:{state:!0},stagedFiles:{state:!0},deletedAttachmentIds:{state:!0},history:{state:!0},deletedHistoryEntryIds:{state:!0},historyLoading:{state:!0},historyError:{state:!0},scheduleType:{state:!0},scheduleUnit:{state:!0},scheduleInterval:{state:!0},scheduleWeekdays:{state:!0},scheduleDay:{state:!0},scheduleMonth:{state:!0},scheduleTime:{state:!0},problemSensor:{state:!0},preview:{state:!0},previewLoading:{state:!0},previewError:{state:!0},previewExpanded:{state:!0},nameError:{state:!0},scheduleError:{state:!0},saveError:{state:!0},saving:{state:!0}};static styles=$`
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
  `;hass;task;scheduleDirty=!1;assignmentDirty=!1;notificationDirty=!1;previewRequest=0;constructor(){super(),this.name="",this.description="",this.status="active",this.icon="",this.assigneeId="",this.labelIds=[],this.nfcTagId="",this.users=[],this.labels=[],this.tags=[],this.assignmentLoading=!1,this.assignmentError="",this.notificationDeviceIds=[],this.notificationPersistent=!1,this.notificationCritical=!1,this.notificationRoute="",this.devices=[],this.notificationLoading=!1,this.notificationError="",this.notificationRouteError="",this.attachments=[],this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.historyLoading=!1,this.historyError="",this.scheduleType="sliding",this.scheduleUnit="monthly",this.scheduleInterval=1,this.scheduleWeekdays=[],this.scheduleDay=1,this.scheduleMonth=1,this.scheduleTime="09:00",this.problemSensor="",this.preview=[],this.previewLoading=!1,this.previewError="",this.previewExpanded=!1,this.nameError="",this.scheduleError="",this.saveError="",this.saving=!1}configure(e,t,s=[]){let i=oi(e,t.task_due),a=Number(i.year),o=Number(i.month),h=Number(i.day),d=(new Date(Date.UTC(a,o-1,h)).getUTCDay()+6)%7;this.hass=e,this.task=t,this.name=t.task_name,this.description=t.task_description||"",this.status=t.active===!1?"inactive":"active",this.icon=t.task_icon||"",this.assigneeId=t.assignee_id||"",this.labelIds=[...t.label_ids||[]],this.nfcTagId=t.nfc_tag_id||"",this.notificationDeviceIds=[...new Set((t.notification_target?.device_id||[]).filter(p=>typeof p=="string"))],this.notificationPersistent=!!t.notification_persistent,this.notificationCritical=!!t.notification_critical,this.notificationRoute=t.notification_route||"",this.attachments=s.filter(p=>p.task_id===t.task_id),this.stagedFiles=[],this.deletedAttachmentIds=[],this.history=[],this.deletedHistoryEntryIds=[],this.scheduleType=t.schedule_type,this.scheduleUnit=t.schedule_unit||"monthly",this.scheduleInterval=t.schedule_interval||1,this.scheduleWeekdays=t.schedule_weekdays?.length?[...t.schedule_weekdays]:[d],this.scheduleDay=t.schedule_day||h,this.scheduleMonth=t.schedule_month||o,this.scheduleTime=t.schedule_time||`${i.hour||"09"}:${i.minute||"00"}`,this.problemSensor=t.problem_sensor||"";let c=!t.task_id;this.scheduleDirty=c,this.assignmentDirty=c,this.notificationDirty=c,this.loadAssignments(),this.loadNotifications(),this.loadHistory(),this.updateComplete.then(()=>this.loadPreview())}async loadAssignments(){let e=this.hass;if(e){this.assignmentLoading=!0,this.assignmentError="";try{let t=await q(e);this.users=[...t.users].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.labels=[...t.labels].sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language)),this.tags=[...t.tags].sort((s,i)=>(s.name||s.id).localeCompare(i.name||i.id,this.hass?.locale?.language)),this.assigneeId=this.users.some(s=>s.id===this.assigneeId)?this.assigneeId:"",this.labelIds=this.labelIds.filter(s=>this.labels.some(i=>i.label_id===s)),this.nfcTagId=this.tags.some(s=>s.id===this.nfcTagId)?this.nfcTagId:""}catch{this.assignmentError=n("v2.assignment_load_error")}finally{this.assignmentLoading=!1}}}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}async loadNotifications(){let e=this.hass;if(e){this.notificationLoading=!0,this.notificationError="";try{this.devices=(await be(e)).sort((t,s)=>this.deviceName(t).localeCompare(this.deviceName(s),this.hass?.locale?.language)),this.notificationDeviceIds=this.notificationDeviceIds.filter(t=>this.devices.some(s=>s.id===t))}catch{this.notificationError=n("v2.notification_load_error")}finally{this.notificationLoading=!1}}}async loadHistory(){let e=this.hass,t=this.task;if(!(!e||!t?.task_id)){this.historyLoading=!0,this.historyError="";try{let s=await $e(e,t.task_id);this.history=Array.isArray(s.history)?s.history:[]}catch{this.historyError=n("v2.history_load_error")}finally{this.historyLoading=!1}}}monthOptions(){return Array.from({length:12},(e,t)=>({label:new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,t,1)),value:String(t+1)}))}weekdayLabels(){return Array.from({length:7},(e,t)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,t+1))))}problemSensorOptions(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("binary_sensor.")).map(e=>({label:e.attributes?.friendly_name||e.entity_id,value:e.entity_id})).sort((e,t)=>e.label.localeCompare(t.label))}scheduleDetails(e){let t="";if(this.scheduleType==="sensor"){let s=this.problemSensor.trim();return s.startsWith("binary_sensor.")||(t=n("v2.select_binary_sensor")),e&&(this.scheduleError=t),t?void 0:{type:"sensor",problemSensor:s}}return!Number.isInteger(this.scheduleInterval)||this.scheduleInterval<1?t=n("v2.interval_min"):this.scheduleType==="fixed"&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)?t=n("v2.select_valid_time"):this.scheduleType==="fixed"&&this.scheduleUnit==="weekly"&&!this.scheduleWeekdays.length&&(t=n("error.select_at_least_one_weekday")),e&&(this.scheduleError=t),t?void 0:{type:this.scheduleType,unit:this.scheduleUnit,interval:this.scheduleInterval,weekdays:[...this.scheduleWeekdays].sort(),day:this.scheduleDay,month:this.scheduleMonth,time:this.scheduleTime}}scheduleChanged(e){this.scheduleDirty=!0,this.scheduleError="",this.previewExpanded=!1,e(),this.loadPreview()}assignmentChanged(e){this.assignmentDirty=!0,e()}notificationChanged(e){this.notificationDirty=!0,this.notificationRouteError="",e()}async loadPreview(){let e=this.hass,t=this.task,s=this.scheduleDetails(!1),i=++this.previewRequest;if(!e||!t||!s||s.type==="sensor"){this.preview=[],this.previewLoading=!1,this.previewError="";return}this.previewLoading=!0,this.previewError="";try{let a=await us(e,s,this.scheduleDirty?void 0:t.task_due||void 0);i===this.previewRequest&&(this.preview=a.task_dues)}catch{i===this.previewRequest&&(this.preview=[],this.previewError=n("v2.preview_load_error"))}finally{i===this.previewRequest&&(this.previewLoading=!1)}}formatDue(e){return new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(new Date(e))}async save(){let e=this.name.trim(),t=this.scheduleDetails(!0),s=this.notificationRoute.trim();if(e||(this.nameError=n("v2.name_required")),s&&(!s.startsWith("/")||s.startsWith("//"))&&(this.notificationRouteError=n("v2.route_invalid")),!e||!t||this.notificationRouteError||!this.hass||!this.task||this.saving)return!1;this.nameError="",this.saveError="",this.saving=!0;try{return await ls(this.hass,this.task.task_id?this.task:void 0,{name:e,description:this.description,active:this.status==="active",icon:this.icon,schedule:this.scheduleDirty?t:void 0,assignment:this.assignmentDirty?{assigneeId:this.assigneeId,labelIds:this.labelIds,nfcTagId:this.nfcTagId}:void 0,notification:this.notificationDirty?{deviceIds:this.notificationDeviceIds,persistent:this.notificationPersistent,critical:this.notificationCritical,route:s}:void 0,files:{staged:this.stagedFiles,deletedAttachmentIds:this.deletedAttachmentIds,deletedHistoryEntryIds:this.deletedHistoryEntryIds}}),!0}catch(i){return this.saveError=i instanceof Error?i.message:String(i),!1}finally{this.saving=!1}}renderFixedOptions(){if(this.scheduleType!=="fixed")return m;let e=m;return this.scheduleUnit==="weekly"?e=l`
        <p class="caption">${n("task.schedule_weekdays")}</p>
        <div class="weekdays">
          ${this.weekdayLabels().map((t,s)=>l`
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
        <${k}
          label=${n("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${$s()}
          ?disabled=${this.saving}
          @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
        ></${k}>
      `:this.scheduleUnit==="yearly"&&(e=y`
        <div class="row">
          <${k}
            label=${n("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${$s()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleDay=t.detail==="last"?"last":Number(t.detail)})}
          ></${k}>
          <${k}
            label=${n("task.month")}
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleMonth=Number(t.detail)})}
          ></${k}>
        </div>
      `),y`
      <${A}
        label=${n("task.time")}
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${t=>this.scheduleChanged(()=>{this.scheduleTime=t.detail})}
      ></${A}>
      ${e}
    `}renderPreview(){if(this.scheduleType==="sensor")return m;if(this.previewLoading&&!this.preview.length)return l`<p class="hint" aria-live="polite">
        ${n("v2.loading_preview")}
      </p>`;if(this.previewError)return l`<p class="error" role="alert">${this.previewError}</p>`;if(this.scheduleType==="sliding")return l`
        <p class="caption">${n("task.first_due")}</p>
        <p class="hint">
          ${this.preview[0]?this.formatDue(this.preview[0]):"\u2014"}
        </p>
      `;let e=this.previewExpanded?this.preview:this.preview.slice(0,4);return l`
      <p class="caption">${n("task.preview_task_dues")}</p>
      <ol class="preview">
        ${e.map(t=>l`<li>${this.formatDue(t)}</li>`)}
      </ol>
      ${this.preview.length>4?l`
            <button
              class="link"
              type="button"
              @click=${()=>{this.previewExpanded=!this.previewExpanded}}
            >
              ${this.previewExpanded?n("v2.show_less"):n("v2.show_all")}
            </button>
          `:m}
    `}renderPlanning(){return this.scheduleType==="sensor"?y`
        <div class="planning">
          <${k}
            label=${n("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${bs()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
          ></${k}>
          <${Ee}
            label=${n("task.problem_sensor")}
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.problemSensor=e.detail})}
          ></${Ee}>
          <p class="hint">
            ${n("v2.sensor_hint")}
          </p>
        </div>
      `:y`
      <div class="planning">
        <${k}
          label=${n("task.recurrence_calculation")}
          .value=${this.scheduleType}
          .options=${bs()}
          ?disabled=${this.saving}
          @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleType=e.detail})}
        ></${k}>
        <div class="row">
          <${A}
            label=${n("v2.every")}
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleInterval=Number(e.detail)})}
          ></${A}>
          <${k}
            label=${n("v2.unit")}
            .value=${this.scheduleUnit}
            .options=${ai()}
            ?disabled=${this.saving}
            @value-changed=${e=>this.scheduleChanged(()=>{this.scheduleUnit=e.detail})}
          ></${k}>
        </div>
        ${this.renderFixedOptions()}
        ${this.scheduleType==="sliding"?l`
              <p class="hint">
                ${n("v2.sliding_hint")}
              </p>
            `:m}
        ${this.scheduleError?l`<p class="error" role="alert">${this.scheduleError}</p>`:m}
        ${this.renderPreview()}
      </div>
    `}renderAssignment(){if(this.assignmentLoading)return l`<p class="hint" aria-live="polite">
        ${n("v2.loading_assignments")}
      </p>`;if(this.assignmentError)return l`<p class="error" role="alert">${this.assignmentError}</p>`;let e=[{label:n("task.unassigned"),value:""},...this.users.map(i=>({label:i.name,value:i.id}))],t=[{label:n("task.no_nfc_tag"),value:""},...this.tags.map(i=>({label:i.name||i.id,value:i.id}))],s=this.labels.map(i=>({label:i.name,value:i.label_id}));return y`
      <div class="planning">
        <${k}
          label=${n("task.user")}
          .value=${this.assigneeId}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.assigneeId=i.detail})}
        ></${k}>
        <${k}
          label=${n("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${t}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.nfcTagId=i.detail})}
        ></${k}>
        <${we}
          label=${n("task.labels")}
          .value=${this.labelIds}
          .options=${s}
          ?disabled=${this.saving}
          @value-changed=${i=>this.assignmentChanged(()=>{this.labelIds=i.detail})}
        ></${we}>
      </div>
    `}renderNotification(){if(this.notificationLoading)return l`<p class="hint" aria-live="polite">
        ${n("v2.loading_notifications")}
      </p>`;if(this.notificationError)return l`<p class="error" role="alert">${this.notificationError}</p>`;let e=this.devices.map(t=>({label:this.deviceName(t),value:t.id}));return y`
      <div class="planning">
        <${we}
          label=${n("v2.mobile_devices")}
          .value=${this.notificationDeviceIds}
          .options=${e}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationDeviceIds=t.detail})}
        ></${we}>
        ${e.length?m:l`<p class="hint">${n("v2.no_mobile_devices")}</p>`}
        <${Ae}
          label=${n("task.notification_persistent")}
          description=${n("task.notification_persistent_description")}
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationPersistent=t.detail})}
        ></${Ae}>
        <${Ae}
          label=${n("task.notification_critical")}
          description=${n("task.notification_critical_description")}
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationCritical=t.detail})}
        ></${Ae}>
        <${A}
          label=${n("v2.navigation_target")}
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${t=>this.notificationChanged(()=>{this.notificationRoute=t.detail})}
        ></${A}>
        <p class="hint">${n("v2.navigation_hint")}</p>
      </div>
    `}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}toggleId(e,t){return t.includes(e)?t.filter(s=>s!==e):[...t,e]}renderAttachments(){return l`
      <div class="planning">
        ${this.attachments.length||this.stagedFiles.length?l`
              <ul class="records">
                ${this.attachments.map(e=>{let t=this.deletedAttachmentIds.includes(e.attachment_id);return l`
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
                        aria-label=${n(t?"v2.undo_remove_named":"v2.remove_named",{name:e.filename})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.deletedAttachmentIds=this.toggleId(e.attachment_id,this.deletedAttachmentIds)}}
                      >
                        ${t?n("common.undo"):n("common.remove")}
                      </button>
                    </li>
                  `})}
                ${this.stagedFiles.map((e,t)=>l`
                    <li class="record">
                      <span class="record-copy">
                        <span class="record-title">${e.name}</span>
                        <span class="record-detail"
                          >${this.formatSize(e.size)} ·
                          ${n("v2.new_file")}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${n("v2.remove_new_file",{name:e.name})}
                        ?disabled=${this.saving}
                        @click=${()=>{this.stagedFiles=this.stagedFiles.filter((s,i)=>i!==t)}}
                      >
                        ${n("common.remove")}
                      </button>
                    </li>
                  `)}
              </ul>
            `:l`<p class="hint">${n("task.no_files")}.</p>`}
        <label class="file-picker">
          <span>${n("v2.add_files")}</span>
          <input
            type="file"
            multiple
            ?disabled=${this.saving}
            @change=${e=>{let t=e.target;this.stagedFiles=[...this.stagedFiles,...Array.from(t.files||[])],t.value=""}}
          />
        </label>
      </div>
    `}renderHistory(){return this.historyLoading?l`<p class="hint" aria-live="polite">
        ${n("v2.loading_history")}
      </p>`:this.historyError?l`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?l`
      <ul class="records">
        ${this.history.map(e=>{let t=this.deletedHistoryEntryIds.includes(e.history_entry_id),s=e.notes==="tasks.history.completed_via_nfc"?n("history.completed_via_nfc"):e.notes||n("v2.no_notes");return l`
            <li class="record ${t?"pending":""}">
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(e.completed_at)} ·
                  ${e.user_name||n("common.system")}</span
                >
                <span class="record-detail">${s}</span>
              </span>
              <button
                class="record-action"
                type="button"
                aria-label=${t?n("history.undo_remove"):n("history.remove")}
                ?disabled=${this.saving}
                @click=${()=>{this.deletedHistoryEntryIds=this.toggleId(e.history_entry_id,this.deletedHistoryEntryIds)}}
              >
                ${t?n("common.undo"):n("common.remove")}
              </button>
            </li>
          `})}
      </ul>
    `:l`<p class="hint">${n("task.no_history")}.</p>`}render(){return y`
      <form @submit=${e=>e.preventDefault()}>
        <${A}
          label=${n("task.name")}
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.name=e.detail,this.nameError=""}}
        ></${A}>
        <${A}
          label=${n("task.optional_description")}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.description=e.detail}}
        ></${A}>
        <${k}
          label=${n("v2.status")}
          .value=${this.status}
          .options=${ri()}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.status=e.detail}}
        ></${k}>
        <${Ee}
          label=${n("task.icon")}
          .value=${this.icon}
          .options=${ni()}
          ?disabled=${this.saving}
          @value-changed=${e=>{this.icon=e.detail}}
        ></${Ee}>
        <${T} heading=${n("task.assignment")}>
          ${this.renderAssignment()}
        </${T}>
        <${T} heading=${n("task.notification")}>
          ${this.renderNotification()}
        </${T}>
        <${T} heading=${n("task.planning")} open>
          ${this.renderPlanning()}
        </${T}>
        <${T} heading=${n("task.files")}>
          ${this.renderAttachments()}
        </${T}>
        ${this.task?.task_id?y`
              <${T} heading=${n("task.history")}>
                ${this.renderHistory()}
              </${T}>
            `:m}
        ${this.saveError?l`<p class="error" role="alert">${this.saveError}</p>`:m}
      </form>
    `}},ut=f("task-form");customElements.get(ut)||customElements.define(ut,ht);var dr=async(r,e,t=[])=>{let s=e||{task_id:"",task_name:"",active:!0,schedule_type:"sliding",schedule_unit:"monthly",schedule_interval:1},i=document.createElement(ut);return i.configure(r,s,t),await D({heading:e?`${n("task.edit")}: ${s.task_name}`:n("task.new"),content:i,actions:[{label:n("common.cancel"),value:"cancel"},{label:n("common.save"),value:"save",run:()=>i.save()}]})==="save"};var pt=class extends g{static properties={items:{attribute:!1},label:{},open:{state:!0}};static styles=$`
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
  `;reposition=()=>this.positionMenu();constructor(){super(),this.items=[],this.label="Actions",this.open=!1}disconnectedCallback(){this.stopTrackingPosition(),super.disconnectedCallback()}get trigger(){return this.renderRoot.querySelector(".trigger")}get menu(){return this.renderRoot.querySelector(".menu")}toggleMenu(e){e.stopPropagation();let t=this.menu;t&&(this.open?t.hidePopover():(t.showPopover(),this.positionMenu(),this.menuItems()[0]?.focus()))}positionMenu(){let e=this.trigger,t=this.menu;if(!e||!t)return;let s=e.getBoundingClientRect(),i=t.getBoundingClientRect(),a=window.visualViewport,o=a?.offsetLeft||0,h=a?.offsetTop||0,d=o+(a?.width||window.innerWidth),c=h+(a?.height||window.innerHeight),p=8,u=4,v=Math.min(Math.max(o+p,s.right-i.width),d-i.width-p),b=s.bottom+u,w=b+i.height<=c-p?b:Math.max(h+p,s.top-i.height-u);t.style.left=`${v}px`,t.style.top=`${w}px`}menuItems(){return[...this.renderRoot.querySelectorAll(".item:not(:disabled)")]}moveFocus(e){let t=this.menuItems();if(!t.length)return;let s=t.indexOf(this.renderRoot.activeElement),i;e.key==="ArrowDown"?i=(s+1)%t.length:e.key==="ArrowUp"?i=(s-1+t.length)%t.length:e.key==="Home"?i=0:e.key==="End"&&(i=t.length-1),i!==void 0&&(e.preventDefault(),t[i].focus())}choose(e,t){e.stopPropagation(),this.menu?.hidePopover(),this.trigger?.focus(),this.dispatchEvent(new CustomEvent("tasks-action",{bubbles:!0,composed:!0,detail:t.value}))}trackPosition(){window.addEventListener("resize",this.reposition),window.addEventListener("scroll",this.reposition,!0),window.visualViewport?.addEventListener("resize",this.reposition),window.visualViewport?.addEventListener("scroll",this.reposition)}stopTrackingPosition(){window.removeEventListener("resize",this.reposition),window.removeEventListener("scroll",this.reposition,!0),window.visualViewport?.removeEventListener("resize",this.reposition),window.visualViewport?.removeEventListener("scroll",this.reposition)}render(){return l`
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
    `}},Te=f("action-menu");customElements.get(Te)||customElements.define(Te,pt);var ys="tasks-v2-table-state-v1",_s="tasks-v2-table-session-v1",Se={due:"task.due",assignee:"table.assignee",labels:"task.labels",notifications:"table.notifications",trigger:"table.recurrence",status:"v2.status"},ks={due:!0,assignee:!0,labels:!1,notifications:!1,trigger:!0,status:!0},xs=()=>({assignee:[],labels:[],notifications:[],trigger:[]}),Es=(r,e)=>{try{let t=globalThis[r],s=JSON.parse(t?.getItem(e)||"{}");return s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{return{}}},ws=x(Te),li=r=>[{label:n("v2.open"),value:"open"},{label:n("menu.edit"),value:"edit"},{label:r.active===!1?n("v2.resume"):n("v2.pause"),value:"active"},{label:n("common.delete"),value:"delete",destructive:!0}],mt=class extends g{static properties={hass:{attribute:!1},tasks:{attribute:!1},search:{state:!0},sortKey:{state:!0},sortDirection:{state:!0},filters:{state:!0},users:{state:!0},labels:{state:!0},devices:{state:!0},registryError:{state:!0},columns:{state:!0},selectedIds:{state:!0},bulkAction:{state:!0},bulkTarget:{state:!0},bulkBusy:{state:!0},bulkError:{state:!0}};static styles=$`
    :host {
      display: block;
      margin-top: 20px;
    }

    .toolbar {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
    }

    .bulk-bar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
      padding: 10px 12px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .bulk-count {
      margin-right: auto;
      font-weight: 500;
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
      flex-basis: 100%;
      margin: 0;
      color: var(--error-color);
    }

    .search {
      width: min(360px, 100%);
      min-height: 40px;
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
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 6px 24px rgba(0, 0, 0, 0.28)
      );
    }

    .column-panel {
      width: 240px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
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

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--primary-color);
    }

    .filter-footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }

    .filter-footer button {
      min-height: 36px;
      padding: 0 12px;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      border-radius: 18px;
      font: inherit;
      cursor: pointer;
    }

    .filter-actions {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }

    .registry-error {
      margin: 0;
      color: var(--error-color);
    }

    .table-wrap {
      overflow-x: auto;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
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

    .task {
      font-weight: 500;
    }

    .inactive .task {
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
      background: var(--success-color, #43a047);
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
      width: 48px;
      padding-right: 8px;
      padding-left: 12px;
      text-align: center;
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
      .labels-column,
      .notifications-column,
      .trigger-column,
      .status-column {
        display: none;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .bulk-count {
        flex-basis: 100%;
      }

      .search {
        flex: 1 1 220px;
      }

      .popover-panel {
        position: fixed;
        top: 16px;
        right: 16px;
        left: 16px;
        width: auto;
        max-height: calc(100dvh - 32px);
        overflow: auto;
      }

      .filter-grid {
        grid-template-columns: 1fr;
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
  `;registryConnection;constructor(){super();let e=Es("localStorage",ys),t=Es("sessionStorage",_s);this.tasks=[],this.search=typeof t.search=="string"?t.search:"",this.sortKey=["name","due","assignee","trigger","status"].includes(String(e.sortKey))?e.sortKey:"due",this.sortDirection=e.sortDirection==="desc"?"desc":"asc";let s=t.filters&&typeof t.filters=="object"&&!Array.isArray(t.filters)?t.filters:{};this.filters=Object.fromEntries(Object.keys(xs()).map(a=>[a,Array.isArray(s[a])?s[a].filter(o=>typeof o=="string"):[]]));let i=e.columns&&typeof e.columns=="object"&&!Array.isArray(e.columns)?e.columns:{};this.columns=Object.fromEntries(Object.keys(ks).map(a=>[a,typeof i[a]=="boolean"?i[a]:ks[a]])),this.users=[],this.labels=[],this.devices=[],this.registryError="",this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.bulkBusy=!1,this.bulkError=""}updated(){this.hass?.connection!==this.registryConnection&&this.loadRegistries()}async loadRegistries(){if(!this.hass)return;let e=this.hass,t=e.connection;this.registryConnection=t,this.registryError="";let[s,i]=await Promise.allSettled([q(e),be(e)]);this.registryConnection===t&&(s.status==="fulfilled"&&(this.users=s.value.users,this.labels=s.value.labels),i.status==="fulfilled"&&(this.devices=i.value),(s.status==="rejected"||i.status==="rejected")&&(this.registryError=n("v2.registry_load_error")))}trigger(e){return e.schedule_type==="sensor"?n("task.problem_sensor"):e.schedule_type==="fixed"?n("task.fixed"):n("task.sliding")}status(e){return e.active===!1?n("v2.paused"):n("v2.active")}assignee(e){return this.users.find(t=>t.id===e.assignee_id)?.name||n("task.unassigned")}taskLabels(e){let t=new Set(e.label_ids||[]);return this.labels.filter(s=>t.has(s.label_id)).sort((s,i)=>s.name.localeCompare(i.name,this.hass?.locale?.language))}deviceName(e){return e.name_by_user||e.name||[e.manufacturer,e.model].filter(Boolean).join(" ")||e.id}notificationDevices(e){let t=new Set(e.notification_target?.device_id||[]);return this.devices.filter(s=>t.has(s.id)).sort((s,i)=>this.deviceName(s).localeCompare(this.deviceName(i),this.hass?.locale?.language))}labelsText(e){return this.taskLabels(e).map(t=>t.name).join(", ")||"\u2014"}notificationsText(e){return[...e.notification_persistent?[n("task.notification_persistent")]:[],...this.notificationDevices(e).map(t=>this.deviceName(t))].join(", ")||"\u2014"}filterValues(e,t){if(t==="assignee")return[this.users.find(i=>i.id===e.assignee_id)?.id||"__none__"];if(t==="labels"){let s=this.taskLabels(e).map(i=>i.label_id);return s.length?s:["__none__"]}if(t==="notifications"){let s=[...e.notification_persistent?["panel"]:[],...this.notificationDevices(e).map(i=>i.id)];return s.length?s:["__none__"]}return[e.schedule_type]}filterLabel(e,t){return t==="__none__"?e==="assignee"?n("task.unassigned"):e==="labels"?n("task.no_labels"):n("v2.no_notifications"):e==="assignee"?this.users.find(s=>s.id===t)?.name||t:e==="labels"?this.labels.find(s=>s.label_id===t)?.name||t:e==="notifications"?t==="panel"?n("task.notification_persistent"):this.deviceName(this.devices.find(s=>s.id===t)):t==="sensor"?n("task.problem_sensor"):t==="fixed"?n("task.fixed"):n("task.sliding")}filterOptions(e){return[...new Set(this.tasks.flatMap(s=>this.filterValues(s,e)))].map(s=>({value:s,label:this.filterLabel(e,s)})).sort((s,i)=>s.label.localeCompare(i.label,this.hass?.locale?.language))}matchesFilters(e){return Object.keys(this.filters).every(t=>{let s=this.filters[t];return!s.length||this.filterValues(e,t).some(i=>s.includes(i))})}dueValue(e){if(e.active===!1||!e.task_due)return;let t=Date.parse(e.task_due);return Number.isNaN(t)?void 0:t}due(e){let t=this.dueValue(e);return t===void 0?"\u2014":new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}compare(e,t){let s;if(this.sortKey==="due"){let i=this.dueValue(e),a=this.dueValue(t);if(i===void 0||a===void 0)if(i===a)s=0;else return i===void 0?1:-1;else s=i-a}else{let i=a=>this.sortKey==="name"?a.task_name:this.sortKey==="assignee"?this.assignee(a):this.sortKey==="trigger"?this.trigger(a):this.status(a);s=i(e).localeCompare(i(t),this.hass?.locale?.language)}return s!==0?this.sortDirection==="asc"?s:-s:e.task_name.localeCompare(t.task_name,this.hass?.locale?.language)}visibleTasks(){let e=this.search.trim().toLocaleLowerCase(this.hass?.locale?.language);return this.tasks.filter(t=>this.matchesFilters(t)&&(!e||[t.task_name,t.task_description,this.assignee(t),this.taskLabels(t).map(s=>s.name).join(" "),this.notificationDevices(t).map(s=>this.deviceName(s)).join(" "),this.trigger(t),this.status(t)].some(s=>s?.toLocaleLowerCase(this.hass?.locale?.language).includes(e)))).sort((t,s)=>this.compare(t,s))}sort(e){this.sortKey===e?this.sortDirection=this.sortDirection==="asc"?"desc":"asc":(this.sortKey=e,this.sortDirection="asc"),this.storeLocalView()}sortLabel(e){return this.sortKey!==e?"":this.sortDirection==="asc"?"\u2191":"\u2193"}toggleFilter(e,t,s){let i=this.filters[e];this.filters={...this.filters,[e]:s?[...new Set([...i,t])]:i.filter(a=>a!==t)},this.storeSessionView()}toggleColumn(e,t){this.columns={...this.columns,[e]:t},this.storeLocalView()}storeLocalView(){try{globalThis.localStorage?.setItem(ys,JSON.stringify({sortKey:this.sortKey,sortDirection:this.sortDirection,columns:this.columns}))}catch{}}storeSessionView(){try{globalThis.sessionStorage?.setItem(_s,JSON.stringify({search:this.search,filters:this.filters}))}catch{}}columnText(e,t){return t==="due"?this.due(e):t==="assignee"?this.assignee(e):t==="labels"?this.labelsText(e):t==="notifications"?this.notificationsText(e):t==="trigger"?this.trigger(e):this.status(e)}mobileDetails(e){return Object.keys(this.columns).filter(t=>this.columns[t]&&this.columnText(e,t)!=="\u2014").map(t=>this.columnText(e,t)).join(" \xB7 ")}visibleColumnCount(){return Object.values(this.columns).filter(Boolean).length+3}selectedTasks(){let e=new Set(this.selectedIds);return this.tasks.filter(t=>e.has(t.task_id))}toggleTask(e,t){this.selectedIds=t?[...new Set([...this.selectedIds,e])]:this.selectedIds.filter(s=>s!==e)}toggleVisible(e,t){let s=new Set(this.selectedIds);for(let i of e)t?s.add(i.task_id):s.delete(i.task_id);this.selectedIds=[...s]}bulkTargets(){return this.bulkAction==="assign"?[{value:"__none__",label:n("task.unassigned")},...this.users.map(e=>({value:e.id,label:e.name}))]:this.bulkAction==="add-label"||this.bulkAction==="remove-label"?this.labels.map(e=>({value:e.label_id,label:e.name})):this.bulkAction==="add-notification"||this.bulkAction==="remove-notification"?[{value:"panel",label:n("task.notification_persistent")},...this.devices.map(e=>({value:e.id,label:this.deviceName(e)}))]:[]}bulkNeedsTarget(){return["assign","add-label","remove-label","add-notification","remove-notification"].includes(this.bulkAction)}bulkOperations(){return this.selectedTasks().map(e=>{if(this.bulkAction==="complete")return{action:"complete",task_id:e.task_id,notes:null};if(this.bulkAction==="delete")return{action:"delete",task_id:e.task_id};let t;if(this.bulkAction==="pause"||this.bulkAction==="resume")t={active:this.bulkAction==="resume"};else if(this.bulkAction==="assign")t={assignee_id:this.bulkTarget==="__none__"?null:this.bulkTarget};else if(this.bulkAction==="add-label"||this.bulkAction==="remove-label"){let s=e.label_ids||[];t={label_ids:this.bulkAction==="remove-label"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}else{let s=e.notification_target?.device_id||[];this.bulkTarget==="panel"?t={notification_persistent:this.bulkAction==="add-notification"}:t={notification_target:{device_id:this.bulkAction==="remove-notification"?s.filter(i=>i!==this.bulkTarget):[...new Set([...s,this.bulkTarget])]}}}return{action:"update",task_id:e.task_id,changes:t}})}async applyBulk(){if(!this.hass||this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget)return;let e=this.bulkOperations();if(e.length){if(this.bulkAction==="complete"||this.bulkAction==="delete"){let t=this.bulkAction==="delete";if(await D({heading:t?n("bulk.delete_title"):n("bulk.complete_title"),content:l`<p>
          ${t?n("bulk.delete_confirm",{count:e.length}):n("bulk.complete_confirm",{count:e.length})}
        </p>`,actions:[{label:n("common.cancel"),value:"cancel"},{label:t?n("common.delete"):n("v2.complete"),value:"confirm",destructive:t}]})!=="confirm")return}this.bulkBusy=!0,this.bulkError="";try{await cs(this.hass,e),this.selectedIds=[],this.bulkAction="",this.bulkTarget=""}catch(t){this.bulkError=t instanceof Error?t.message:String(t)}finally{this.bulkBusy=!1}}}selectedFilterCount(){return Object.values(this.filters).reduce((e,t)=>e+t.length,0)}filterGroup(e,t){return l`
      <fieldset>
        <legend>${e}</legend>
        ${this.filterOptions(t).map(s=>l`
            <label>
              <input
                type="checkbox"
                .checked=${this.filters[t].includes(s.value)}
                @change=${i=>this.toggleFilter(t,s.value,i.currentTarget.checked)}
              >
              <span>${s.label}</span>
            </label>
          `)}
      </fieldset>
    `}closePanel(e){e.currentTarget.closest("details")?.removeAttribute("open")}open(e){this.dispatchEvent(new CustomEvent("tasks-task-open",{bubbles:!0,composed:!0,detail:e}))}action(e,t){this.dispatchEvent(new CustomEvent("tasks-task-action",{bubbles:!0,composed:!0,detail:{action:t,task:e}}))}header(e,t,s=""){return l`
      <th
        class=${s}
        aria-sort=${this.sortKey===t?this.sortDirection==="asc"?"ascending":"descending":"none"}
      >
        <button type="button" @click=${()=>this.sort(t)}>
          ${e}
          ${this.sortKey===t?l`<span aria-hidden="true">${this.sortLabel(t)}</span>`:m}
        </button>
      </th>
    `}columnHeader(e){let t=`${e}-column`;return e==="labels"||e==="notifications"?l`<th class=${t}>${n(Se[e])}</th>`:this.header(n(Se[e]),e,t)}columnCell(e,t){let s=this.columnText(e,t);return l`
      <td class=${`${t}-column`}>
        ${t==="status"?l`<span class="status">${s}</span>`:s}
      </td>
    `}render(){let e=this.visibleTasks(),t=this.selectedFilterCount(),s=Object.keys(this.columns).filter(c=>this.columns[c]),i=this.selectedTasks(),a=new Set(this.selectedIds),o=e.length>0&&e.every(c=>a.has(c.task_id)),h=e.some(c=>a.has(c.task_id)),d=this.bulkTargets();return y`
      <div class="toolbar">
        <input
          class="search"
          type="search"
          aria-label=${n("table.search")}
          placeholder=${n("table.search")}
          .value=${this.search}
          @input=${c=>{this.search=c.currentTarget.value,this.storeSessionView()}}
        >
        <details>
          <summary>${n("table.filters")}${t?` (${t})`:""}</summary>
          <div class="popover-panel">
            <div class="filter-grid">
              ${this.filterGroup(n("task.assignment"),"assignee")}
              ${this.filterGroup(n("task.labels"),"labels")}
              ${this.filterGroup(n("table.notifications"),"notifications")}
              ${this.filterGroup(n("table.recurrence"),"trigger")}
            </div>
            <div class="filter-footer">
              ${this.registryError?l`<p class="registry-error">${this.registryError}</p>`:l`<span></span>`}
              <div class="filter-actions">
                <button
                  type="button"
                  @click=${()=>{this.filters=xs(),this.storeSessionView()}}
                >
                  ${n("table.reset_filters")}
                </button>
                <button
                  type="button"
                  @click=${this.closePanel}
                >
                  ${n("v2.done")}
                </button>
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>${n("table.columns")}</summary>
          <div class="popover-panel column-panel">
            <fieldset>
              <legend>${n("v2.visible_columns")}</legend>
              ${Object.keys(Se).map(c=>l`
                  <label>
                    <input
                      type="checkbox"
                      .checked=${this.columns[c]}
                      @change=${p=>this.toggleColumn(c,p.currentTarget.checked)}
                    >
                    <span>${n(Se[c])}</span>
                  </label>
                `)}
            </fieldset>
            <div class="filter-footer">
              <span></span>
              <button type="button" @click=${this.closePanel}>
                ${n("v2.done")}
              </button>
            </div>
          </div>
        </details>
      </div>
      ${i.length?l`
            <div class="bulk-bar">
              <span class="bulk-count">
                ${n("v2.selected",{count:i.length})}
              </span>
              <select
                aria-label=${n("bulk.actions")}
                .value=${this.bulkAction}
                @change=${c=>{this.bulkAction=c.currentTarget.value,this.bulkTarget="",this.bulkError=""}}
              >
                <option value="">${n("v2.choose_action")}</option>
                <option value="complete">${n("bulk.complete")}</option>
                <option value="pause">${n("v2.pause")}</option>
                <option value="resume">${n("v2.resume")}</option>
                <option value="assign">${n("bulk.assign_person")}</option>
                <option value="add-label">${n("v2.add_label")}</option>
                <option value="remove-label">${n("v2.remove_label")}</option>
                <option value="add-notification">${n("v2.add_notification")}</option>
                <option value="remove-notification">${n("v2.remove_notification")}</option>
                <option value="delete">${n("bulk.delete")}</option>
              </select>
              ${d.length?l`
                    <select
                      aria-label=${n("v2.choose_target")}
                      .value=${this.bulkTarget}
                      @change=${c=>{this.bulkTarget=c.currentTarget.value}}
                    >
                      <option value="">${n("v2.choose_target")}</option>
                      ${d.map(c=>l`
                          <option value=${c.value}>
                            ${c.label}
                          </option>
                        `)}
                    </select>
                  `:m}
              <button
                type="button"
                ?disabled=${this.bulkBusy||!this.bulkAction||this.bulkNeedsTarget()&&!this.bulkTarget}
                @click=${()=>{this.applyBulk()}}
              >
                ${this.bulkBusy?n("v2.applying"):n("v2.apply")}
              </button>
              <button
                type="button"
                ?disabled=${this.bulkBusy}
                @click=${()=>{this.selectedIds=[],this.bulkAction="",this.bulkTarget="",this.bulkError=""}}
              >
                ${n("v2.clear")}
              </button>
              ${this.bulkError?l`<p class="bulk-error">${this.bulkError}</p>`:m}
            </div>
          `:m}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="selection">
                <input
                  type="checkbox"
                  aria-label=${n("v2.select_visible")}
                  .checked=${o}
                  .indeterminate=${h&&!o}
                  @change=${c=>this.toggleVisible(e,c.currentTarget.checked)}
                >
              </th>
              ${this.header(n("table.task"),"name")}
              ${s.map(c=>this.columnHeader(c))}
              <th class="actions" aria-label=${n("task.actions")}></th>
            </tr>
          </thead>
          <tbody>
            ${e.length?e.map(c=>y`
                    <tr
                      class=${c.active===!1?"inactive":""}
                      aria-selected=${a.has(c.task_id)}
                    >
                      <td class="selection">
                        <input
                          type="checkbox"
                          aria-label=${n("v2.select_task",{name:c.task_name})}
                          .checked=${a.has(c.task_id)}
                          @change=${p=>this.toggleTask(c.task_id,p.currentTarget.checked)}
                        >
                      </td>
                      <td>
                        <button
                          class="task"
                          type="button"
                          @click=${()=>this.open(c)}
                        >
                          ${c.task_name}
                          <span class="mobile-details">
                            ${this.mobileDetails(c)}
                          </span>
                        </button>
                      </td>
                      ${s.map(p=>this.columnCell(c,p))}
                      <td class="actions">
                        <${ws}
                          label=${n("v2.actions_for",{name:c.task_name})}
                          .items=${li(c)}
                          @tasks-action=${p=>this.action(c,p.detail)}
                        ></${ws}>
                      </td>
                    </tr>
                  `):l`
                  <tr>
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.search?n("table.empty"):n("v2.no_tasks")}
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `}},As=f("task-table");customElements.get(As)||customElements.define(As,mt);var gt=class extends g{static properties={tone:{reflect:!0}};static styles=$`
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
  `;constructor(){super(),this.tone="default"}render(){return l`<span><slot></slot></span>`}},Ce=f("pill");customElements.get(Ce)||customElements.define(Ce,gt);var Z=x(V),E=x(Ce),Ts=x(W),vt=class extends g{static properties={attachment:{attribute:!1},url:{}};static styles=$`
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
  `;render(){let e=this.attachment.content_type;return e.startsWith("image/")?l`<img src=${this.url} alt=${this.attachment.filename} />`:e.startsWith("video/")?l`<video src=${this.url} controls></video>`:e.startsWith("audio/")?l`<audio src=${this.url} controls></audio>`:e==="application/pdf"?l`<iframe
        src=${this.url}
        title=${this.attachment.filename}
      ></iframe>`:l`<a href=${this.url} target="_blank" rel="noopener">
      ${n("v2.open_file",{name:this.attachment.filename})}
    </a>`}},ft=f("attachment-preview");customElements.get(ft)||customElements.define(ft,vt);var bt=class extends g{static properties={task:{attribute:!1},attachments:{state:!0},users:{state:!0},labels:{state:!0},tags:{state:!0},history:{state:!0},signedFiles:{state:!0},loading:{state:!0},assignmentReady:{state:!0},assignmentError:{state:!0},historyError:{state:!0},attachmentError:{state:!0},completionNotes:{state:!0},completionError:{state:!0},completing:{state:!0}};static styles=$`
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
  `;hass;constructor(){super(),this.attachments=[],this.users=[],this.labels=[],this.tags=[],this.history=[],this.signedFiles={},this.loading=!1,this.assignmentReady=!1,this.assignmentError="",this.historyError="",this.attachmentError="",this.completionNotes="",this.completionError="",this.completing=!1}configure(e,t,s){this.hass=e,this.task=t,this.attachments=s.filter(i=>i.task_id===t.task_id),this.loadDetails()}async loadDetails(){if(!this.hass)return;this.loading=!0,this.assignmentError="",this.historyError="",this.attachmentError="";let[e,t,s]=await Promise.allSettled([q(this.hass),$e(this.hass,this.task.task_id),ds(this.hass,this.task.task_id)]);e.status==="fulfilled"?(this.users=e.value.users,this.labels=e.value.labels,this.tags=e.value.tags,this.assignmentReady=!0):this.assignmentError=n("v2.assignment_load_error"),t.status==="fulfilled"?this.history=Array.isArray(t.value.history)?t.value.history:[]:this.historyError=n("v2.history_load_error"),s.status==="fulfilled"?this.signedFiles=s.value.signed_files||{}:this.attachmentError=n("v2.attachment_load_error"),this.loading=!1}formatDate(e){if(!e)return n("v2.not_scheduled");let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeStyle:"short",timeZone:this.hass?.config?.time_zone}).format(t)}formatSize(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}scheduleText(){if(this.task.schedule_type==="sensor"){let h=this.task.problem_sensor||"",d=this.hass?.states?.[h]?.attributes?.friendly_name||h;return d?`${n("schedule.problem_sensor_description")} (${d})`:n("schedule.problem_sensor_description")}let e=Math.max(1,Number(this.task.schedule_interval)||1),t=this.task.schedule_unit||"monthly",s={daily:"day",weekly:"week",monthly:"month",yearly:"year"},i=n(`schedule.period_${s[t]||"month"}`),a=n(`schedule.period_${s[t]||"month"}s`);if(this.task.schedule_type==="sliding")return n(e===1?"schedule.after_completion_one":"schedule.after_completion_many",{schedule_interval:e,period:e===1?i:a});let o=this.task.schedule_time||"00:00";if(t==="weekly"){let h=Array.from({length:7},(u,v)=>new Intl.DateTimeFormat(this.hass?.locale?.language,{weekday:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,v+1)))),d=(this.task.schedule_weekdays||[]).map(u=>h[u]).filter(Boolean),c=d.length>1?`${d.slice(0,-1).join(", ")}${n("schedule.and")}${d.at(-1)}`:d[0]||"";return`${n(e===1?"schedule.weekly_one":"schedule.weekly_many",{schedule_interval:e,days:c?n("schedule.on_days",{days:c}):""})} ${n("v2.at_time",{time:o})}`}if(t==="monthly"){let h=this.task.schedule_day==="last"?n("schedule.on_last_day"):n("schedule.on_day_number",{day:Number(this.task.schedule_day||1)});return`${n(e===1?"schedule.monthly_one":"schedule.monthly_many",{schedule_interval:e,day:h})} ${n("v2.at_time",{time:o})}`}if(t==="yearly"){let h=new Intl.DateTimeFormat(this.hass?.locale?.language,{month:"long"}).format(new Date(2024,(this.task.schedule_month||1)-1,1)),d=this.task.schedule_day==="last"?n("schedule.on_last_day_of_month",{month:h}):n("schedule.on_day_of_month",{day:Number(this.task.schedule_day||1),month:h});return`${n(e===1?"schedule.yearly_one":"schedule.yearly_many",{schedule_interval:e,day:d})} ${n("v2.at_time",{time:o})}`}return`${n(e===1?"schedule.fixed_one":"schedule.fixed_many",{schedule_interval:e,period:e===1?i:a})} ${n("v2.at_time",{time:o})}`}renderInline(e){let t=[],s=/(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g,i=0;for(let a of e.matchAll(s)){let o=a.index??0;if(o>i&&t.push(e.slice(i,o)),a[2])t.push(l`<strong>${a[2]}</strong>`);else if(a[3])t.push(l`<em>${a[3]}</em>`);else if(a[4])t.push(l`<code>${a[4]}</code>`);else if(a[5]&&a[6]){let h=a[6];t.push(/^(?:https?:|mailto:|\/|#)/.test(h)?l`<a href=${h} target="_blank" rel="noopener"
                >${a[5]}</a
              >`:a[5])}i=o+a[0].length}return i<e.length&&t.push(e.slice(i)),t}renderDescription(){let e=(this.task.task_description||"").split(/\r?\n/);if(!e.some(s=>s.trim()))return l`<p class="hint">${n("task.no_description")}.</p>`;let t=[];for(let s=0;s<e.length;){let i=e[s];if(!i.trim())s+=1;else if(i.startsWith("- ")){let a=[];for(;e[s]?.startsWith("- ");)a.push(e[s].slice(2)),s+=1;t.push(l`<ul>
            ${a.map(o=>l`<li>${this.renderInline(o)}</li>`)}
          </ul>`)}else if(/^\d+\. /.test(i)){let a=[];for(;/^\d+\. /.test(e[s]||"");)a.push(e[s].replace(/^\d+\. /,"")),s+=1;t.push(l`<ol>
            ${a.map(o=>l`<li>${this.renderInline(o)}</li>`)}
          </ol>`)}else{let a=/^(#{1,2})\s+(.+)$/.exec(i);t.push(a?a[1].length===1?l`<h3>${this.renderInline(a[2])}</h3>`:l`<h4>${this.renderInline(a[2])}</h4>`:i.startsWith("> ")?l`<blockquote>${this.renderInline(i.slice(2))}</blockquote>`:l`<p>${this.renderInline(i)}</p>`),s+=1}}return t}async openAttachment(e){let t=this.signedFiles[e.attachment_id];if(!t)return;let s=document.createElement(ft);s.attachment=e,s.url=t,await D({heading:e.filename,content:s})}async complete(){if(!this.hass||this.completing||await D({heading:n("task.complete_title"),content:l`<p>
        ${n("task.complete_confirm",{name:this.task.task_name})}
      </p>`,actions:[{label:n("common.cancel"),value:"cancel"},{label:n("v2.complete"),value:"complete"}]})!=="complete")return!1;this.completing=!0,this.completionError="";try{return await hs(this.hass,this.task.task_id,this.completionNotes),!0}catch(t){return this.completionError=t instanceof Error?t.message:String(t),!1}finally{this.completing=!1}}renderMetadata(){let e=this.users.find(i=>i.id===this.task.assignee_id)?.name||(this.assignmentReady?n("task.unassigned"):n("v2.loading_assignments")),t=this.tags.find(i=>i.id===this.task.nfc_tag_id),s=(this.task.label_ids||[]).map(i=>this.labels.find(a=>a.label_id===i)).filter(i=>!!i);return y`
      <div class="pills">
        <${E}>${this.formatDate(this.task.task_due)}</${E}>
        <${E}>${e}</${E}>
        <${E} tone=${this.task.active===!1?"muted":"positive"}>
          ${this.task.active===!1?n("v2.inactive"):n("v2.active")}
        </${E}>
        ${this.attachments.length?y`<${E}>
              ${n(this.attachments.length===1?"v2.file_count_one":"v2.file_count_many",{count:this.attachments.length})}
            </${E}>`:m}
        ${t?y`<${E}>NFC: ${t.name||t.id}</${E}>`:m}
        ${s.map(i=>y`<${E}>${i.name}</${E}>`)}
      </div>
    `}renderAttachments(){return this.attachmentError?l`<p class="error" role="alert">${this.attachmentError}</p>`:this.attachments.length?l`
      <ul class="records">
        ${this.attachments.map(e=>{let t=!!this.signedFiles[e.attachment_id];return l`
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
    `:l`<p class="hint">${n("task.no_files")}.</p>`}renderHistory(){return this.historyError?l`<p class="error" role="alert">${this.historyError}</p>`:this.history.length?l`
      <ul class="records">
        ${this.history.map(e=>l`
          <li class="record">
            <span
              >${this.formatDate(e.completed_at)} ·
              ${e.user_name||n("common.system")}</span
            >
            <span class="secondary"
              >${e.notes==="tasks.history.completed_via_nfc"?n("history.completed_via_nfc"):e.notes||n("v2.no_notes")}</span
            >
          </li>
        `)}
      </ul>
    `:l`<p class="hint">${n("task.no_history")}.</p>`}render(){return y`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading?l`<p class="hint" aria-live="polite">
              ${n("v2.loading_details")}
            </p>`:m}
        ${this.assignmentError?l`<p class="error" role="alert">${this.assignmentError}</p>`:m}
        <${Z} heading=${n("task.planning")} open>
          <dl class="planning-details">
            <dt>${n("task.due")}</dt>
            <dd>${this.formatDate(this.task.task_due)}</dd>
            <dt>${n("v2.rule")}</dt>
            <dd>${this.scheduleText()}</dd>
          </dl>
        </${Z}>
        <${Z} heading=${n("task.files")}>
          ${this.renderAttachments()}
        </${Z}>
        <${Z} heading=${n("task.history")}>
          ${this.renderHistory()}
        </${Z}>
        <${Ts}
          label=${n("task.completion_notes")}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${e=>{this.completionNotes=e.detail}}
        ></${Ts}>
        ${this.completionError?l`<p class="error" role="alert">${this.completionError}</p>`:m}
      </div>
    `}},$t=f("task-viewer");customElements.get($t)||customElements.define($t,bt);var Hr=async(r,e,t)=>{let s=document.createElement($t);return s.configure(r,e,t),await D({heading:e.task_name,content:s,actions:[{label:n("common.close"),value:"close"},{label:n("v2.complete"),value:"complete",run:()=>s.complete()}]})==="complete"};export{$ as a,l as b,m as c,g as d,x as e,y as f,Ri as g,q as h,Fi as i,Bi as j,n as k,ii as l,zi as m,f as n,D as o,dr as p,Te as q,li as r,As as s,Hr as t};
