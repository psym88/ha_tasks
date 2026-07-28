export const elementName = (name: string): string =>
  `ha-tasks-${name}`;

export const frontendVersion =
  decodeURIComponent(
    new URL(import.meta.url).pathname.match(
      /\/tasks_frontend\/([^/]+)\//,
    )?.[1] || "",
  );
