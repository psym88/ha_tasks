const bundleHash =
  new URL(import.meta.url).pathname
    .match(/\/panel-([a-z0-9]+)\.js$/i)?.[1]
    ?.toLowerCase() || "dev";

export const elementName = (name: string): string =>
  `ha-tasks-${name}-${bundleHash}`;
