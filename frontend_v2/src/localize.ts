const version = new URL(import.meta.url).pathname.match(
  /\/tasks_frontend\/([^/]+)\//,
)?.[1];
const versionQuery = version
  ? `?v=${encodeURIComponent(decodeURIComponent(version))}`
  : "";

type Messages = Record<string, string>;
type Variables = Record<string, string | number>;

let messages: Messages = {};
let language = "";
let requestedLanguage = "";
const catalogs = new Map<string, Promise<Messages>>();

const normalizeLanguage = (value?: string): string => {
  const code = String(value || "en")
    .toLowerCase()
    .split(/[-_]/)[0];
  return /^[a-z]{2,3}$/.test(code) ? code : "en";
};

const loadCatalog = (code: string): Promise<Messages> => {
  if (!catalogs.has(code)) {
    const path =
      code === "en"
        ? "/tasks_strings.json"
        : `/tasks_translations/${code}.json`;
    catalogs.set(
      code,
      fetch(`${path}${versionQuery}`)
        .then(async (response): Promise<{ frontend?: Messages }> =>
          response.ok ? response.json() : {},
        )
        .then((catalog) => catalog.frontend || {})
        .catch(() => ({})),
    );
  }
  return catalogs.get(code)!;
};

export const t = (key: string, variables: Variables = {}): string =>
  String(messages[key] ?? key).replace(
    /\{(\w+)\}/g,
    (_, name: string) => String(variables[name] ?? `{${name}}`),
  );

export async function setLanguage(value?: string): Promise<void> {
  const next = normalizeLanguage(value);
  requestedLanguage = next;
  const fallback = await loadCatalog("en");
  const translated = next === "en" ? fallback : await loadCatalog(next);
  if (requestedLanguage === next && language !== next) {
    language = next;
    messages = { ...fallback, ...translated };
  }
}

export const ready = setLanguage(globalThis.navigator?.language);
