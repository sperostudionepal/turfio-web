/** Lightweight runtime contracts for high-change JS components without adding a bundle dependency. */
export function assertObjectProp(component, name, value, { optional = false } = {}) {
  if (!import.meta.env.DEV) return;
  if (value == null && optional) return;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    console.warn(`[${component}] expected \`${name}\` to be an object.`);
  }
}

export function assertFunctionProp(component, name, value, { optional = true } = {}) {
  if (!import.meta.env.DEV) return;
  if (value == null && optional) return;
  if (typeof value !== 'function') console.warn(`[${component}] expected \`${name}\` to be a function.`);
}
