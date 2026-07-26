const CATALOG_URL="/tasks_translations";
const version=new URL(import.meta.url).pathname.match(/\/tasks_frontend\/([^/]+)\//)?.[1];
const VERSION_QUERY=version?`?v=${encodeURIComponent(decodeURIComponent(version))}`:"";
const KEYS={fixed:"task.fixed",sliding:"task.sliding",daily:"task.daily",weekly:"task.weekly",monthly:"task.monthly",yearly:"task.yearly",files:"task.files",history:"task.history",noFiles:"task.no_files",noHistory:"task.no_history"};
const ESCAPES={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};

let messages={};
let language="en";
let appliedLanguage=null;
const loaded=new Map();

function interpolate(value,variables){
  return String(value).replace(/\{(\w+)\}/g,(_,key)=>variables[key]??`{${key}}`);
}

async function loadCatalog(code){
  if(!loaded.has(code)){
    const url=`${code==="en"?"/tasks_strings.json":`${CATALOG_URL}/${code}.json`}${VERSION_QUERY}`;
    loaded.set(code,fetch(url).then(response=>response.ok?response.json():{}).then(catalog=>catalog.frontend||{}).catch(()=>({})));
  }
  return loaded.get(code);
}

export function t(key,variables={}){return interpolate(messages[key]??key,variables);}
export const L=new Proxy({}, {get:(_,key)=>t(KEYS[key]||String(key))});
export const esc=(value)=>String(value??"").replace(/[&<>"']/g,character=>ESCAPES[character]);
export function errorMessage(error){const key=String(error?.code||error?.message||error||"");return messages[`error.${key}`]??error?.message??key;}
export function historyNote(value){return value==="tasks.history.completed_via_nfc"?t("history.completed_via_nfc"):value==="tasks.history.completed_via_todo"?t("history.completed_via_todo"):value;}
export function locale(){return language;}

export async function setLanguage(value){
  const requested=String(value||"en").toLowerCase().split(/[-_]/)[0];
  const next=/^[a-z]{2,3}$/.test(requested)?requested:"en";
  language=next;
  const fallback=await loadCatalog("en");
  const translated=next==="en"?fallback:await loadCatalog(next);
  const changed=appliedLanguage!==next;
  if(language===next){messages={...fallback,...translated};appliedLanguage=next;}
  return changed;
}

export const ready=setLanguage(globalThis.navigator?.language);
