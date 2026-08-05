const version = new URL(import.meta.url).pathname.match(
  /\/tasks_frontend\/([^/]+)\//,
)?.[1];
const versionQuery = version
  ? `?v=${encodeURIComponent(decodeURIComponent(version))}`
  : "";

type Messages = Record<string, string>;
type Variables = Record<string, string | number>;
type Catalog = { common?: Messages };

let messages: Messages = {};
let language = "";
let requestedLanguage = "";
const catalogs = new Map<string, Promise<Messages>>();
const listeners = new Set<() => void>();

const normalizeLanguage = (value?: string): string => {
  const code = String(value || "en")
    .toLowerCase()
    .split(/[-_]/)[0];
  return /^[a-z]{2,3}$/.test(code) ? code : "en";
};

const frontendMessages = (catalog: Catalog): Messages =>
  Object.fromEntries(
    Object.entries(catalog.common || {})
      .filter(([key]) => key.startsWith("ui_"))
      .map(([key, value]) => {
        const separator = key.indexOf("_", 3);
        return [
          `${key.slice(3, separator)}.${key.slice(separator + 1)}`,
          value,
        ];
      }),
  );

const loadCatalog = (code: string): Promise<Messages> => {
  if (!catalogs.has(code)) {
    const path =
      code === "en"
        ? "/tasks_strings.json"
        : `/tasks_translations/${code}.json`;
    catalogs.set(
      code,
      fetch(`${path}${versionQuery}`)
        .then(async (response): Promise<Catalog> =>
          response.ok ? response.json() : {},
        )
        .then(frontendMessages)
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

export const timedScheduleText = (
  description: string,
  time: string,
): string => t("schedule.with_time", {
  description,
  time: t("app.at_time", { time }),
});

const localizedError = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value) {
    return undefined;
  }
  const key = `error.${value}`;
  const localized = t(key);
  return localized === key ? undefined : localized;
};

export const errorText = (error: unknown): string => {
  if (error && typeof error === "object") {
    const payload = error as { code?: unknown; message?: unknown };
    const fromCode = localizedError(payload.code);
    if (fromCode) {
      return fromCode;
    }
    const fromMessage = localizedError(payload.message);
    if (fromMessage) {
      return fromMessage;
    }
    if (typeof payload.message === "string" && payload.message) {
      return payload.message;
    }
  }
  if (error instanceof Error) {
    return localizedError(error.message) || error.message;
  }
  if (typeof error === "string" && error) {
    return localizedError(error) || error;
  }
  return t("error.unknown");
};

export async function setLanguage(value?: string): Promise<void> {
  const next = normalizeLanguage(value);
  requestedLanguage = next;
  const fallback = await loadCatalog("en");
  const translated = next === "en" ? fallback : await loadCatalog(next);
  if (requestedLanguage === next && language !== next) {
    language = next;
    messages = { ...fallback, ...translated };
    for (const listener of listeners) {
      listener();
    }
  }
}

export const subscribeLanguage = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const ready = setLanguage(globalThis.navigator?.language);
