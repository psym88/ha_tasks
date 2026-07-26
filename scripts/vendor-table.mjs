import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const source=new URL("../node_modules/@tanstack/table-core/build/lib/index.mjs",import.meta.url);
const license=new URL("../node_modules/@tanstack/table-core/LICENSE",import.meta.url);
const targetDirectory=new URL("../custom_components/tasks/frontend/vendor/",import.meta.url);
const target=new URL("tanstack-table-core.mjs",targetDirectory);

await mkdir(targetDirectory,{recursive:true});
const browserSource=(await readFile(source,"utf8")).replaceAll("process.env.NODE_ENV","'production'");
await writeFile(target,browserSource);
await copyFile(license,new URL("tanstack-table-core.LICENSE",targetDirectory));
