/// <reference types="vite/client" />

// YAML file imports with ?raw suffix
declare module "*.yaml?raw" {
  const content: string;
  export default content;
}

declare module "*.yml?raw" {
  const content: string;
  export default content;
}

// Direct YAML file imports
declare module "*.yaml" {
  const content: unknown;
  export default content;
}

declare module "*.yml" {
  const content: unknown;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.sass" {
  const content: string;
  export default content;
}

declare module "*.less" {
  const content: string;
  export default content;
}
