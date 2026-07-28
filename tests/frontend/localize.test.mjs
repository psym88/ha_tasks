import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import test from "node:test";

const catalog=language=>JSON.parse(readFileSync(new URL(`../../custom_components/tasks/translations/${language}.json`,import.meta.url),"utf8"));
const messages=language=>Object.fromEntries(Object.entries(catalog(language).common).filter(([key])=>key.startsWith("ui_")).map(([key,value])=>{const separator=key.indexOf("_",3);return [`${key.slice(3,separator)}.${key.slice(separator+1)}`,value];}));
globalThis.fetch=async url=>{const language=String(url).endsWith("/tasks_strings.json")?"en":String(url).match(/\/([a-z]{2,3})\.json$/)?.[1]||"en";return {ok:true,json:async()=>catalog(language)};};

const {errorMessage,historyNote,ready,setLanguage,t}=await import("../../custom_components/tasks/frontend/localize.js");
await ready;

test("English is loaded as the complete fallback catalog",async()=>{
  await setLanguage("en-US");
  assert.equal(t("common.add_task"),"Add task");
  assert.equal(t("task.complete_confirm",{name:"Laundry"}),"Do you want to mark “Laundry” as completed?");
  assert.ok(Object.keys(messages("en")).length>50);
});

test("German translations share the Home Assistant catalog",async()=>{
  const english=messages("en"),german=messages("de");
  assert.deepEqual(Object.keys(german).sort(),Object.keys(english).sort());
  await setLanguage("de-CH");
  assert.equal(t("common.add_task"),german["common.add_task"]);
  assert.equal(errorMessage({code:"nfc_tag_already_assigned",message:"nfc_tag_already_assigned"}),german["error.nfc_tag_already_assigned"]);
  assert.equal(errorMessage({unexpected:true}),german["error.unknown"]);
  assert.equal(historyNote("tasks.history.completed_via_nfc"),"Erledigt durch NFC Scan");
  await setLanguage("en");
});

test("missing language catalogs retain the English fallback",async()=>{
  await setLanguage("fr");
  assert.equal(t("common.add_task"),messages("en")["common.add_task"]);
  await setLanguage("en");
});

test("frontend derives display and translation versions from its static path",()=>{
  const root=new URL("../../custom_components/tasks/frontend/",import.meta.url);
  const controller=readFileSync(new URL("controller.js",root),"utf8");
  const localize=readFileSync(new URL("localize.js",root),"utf8");
  assert.match(controller,/import\.meta\.url/);
  assert.match(controller,/tasks_frontend/);
  assert.match(localize,/import\.meta\.url[\s\S]*VERSION_QUERY/);
  assert.match(localize,/tasks_strings\.json[\s\S]*VERSION_QUERY/);
});

test("frontend source contains no embedded German UI copy",()=>{
  const root=new URL("../../custom_components/tasks/frontend/",import.meta.url);
  const files=readdirSync(root,{recursive:true}).filter(name=>name.endsWith(".js"));
  const german=/[\u00e4\u00f6\u00fc\u00c4\u00d6\u00dc\u00df]/;
  for(const name of files)assert.doesNotMatch(readFileSync(new URL(name.replaceAll("\\","/"),root),"utf8"),german,name);
});
