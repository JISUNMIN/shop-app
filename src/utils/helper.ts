// src/utils/helper.ts
export function formatString(template: string, vars: Record<string, any>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}
