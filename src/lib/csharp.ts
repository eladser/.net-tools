export interface CsharpOptions {
  rootName: string;
  records: boolean;
  nullable: boolean;
  jsonAttributes: boolean;
  fileScoped: boolean;
}

// first_name / first-name / firstName -> FirstName
export function pascalCase(key: string): string {
  const cleaned = key.replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase());
  const name = (cleaned.charAt(0).toUpperCase() + cleaned.slice(1)).replace(/[^a-zA-Z0-9_]/g, '');
  // Empty or symbol-only keys, and identifiers can't start with a digit
  if (!name) return '_Field';
  return /^\d/.test(name) ? '_' + name : name;
}

export function jsonToCsharp(json: string, opts: CsharpOptions): string {
  const parsed = JSON.parse(json);
  const classes = new Map<string, string>();
  const root = Array.isArray(parsed) ? parsed[0] ?? {} : parsed;

  if (typeof root !== 'object' || root === null) {
    return `// Top-level value is ${typeof root}; nothing to generate`;
  }

  generateType(root, opts.rootName || 'Root', classes, opts);

  const usings = opts.jsonAttributes ? 'using System.Text.Json.Serialization;\n\n' : '';
  return usings + [...classes.values()].join('\n\n');
}

function generateType(
  obj: Record<string, unknown>,
  name: string,
  classes: Map<string, string>,
  opts: CsharpOptions
): void {
  if (classes.has(name)) return;
  classes.set(name, ''); // reserve to break cycles

  const keyword = opts.records ? 'record' : 'class';
  const props: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const propName = pascalCase(key);
    const type = csharpType(value, propName, classes, opts);

    if (opts.jsonAttributes && propName !== key) {
      props.push(`    [JsonPropertyName("${key}")]`);
    }
    props.push(`    public ${type} ${propName} { get; set; }`);
  }

  const body = props.length ? props.join('\n') : '';
  classes.set(name, `public ${keyword} ${name}\n{\n${body}\n}`);
}

function csharpType(
  value: unknown,
  propName: string,
  classes: Map<string, string>,
  opts: CsharpOptions
): string {
  const n = (t: string) => (opts.nullable ? t + '?' : t);

  if (value === null || value === undefined) return n('object');
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2})?/.test(value)) return n('DateTime');
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return n('Guid');
    return n('string');
  }
  if (typeof value === 'number') {
    if (!Number.isInteger(value)) return n('double');
    return Math.abs(value) > 2147483647 ? n('long') : n('int');
  }
  if (typeof value === 'boolean') return n('bool');
  if (Array.isArray(value)) {
    if (value.length === 0) return n('List<object>');
    // Merge object elements so optional keys across items all appear
    if (typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
      const merged: Record<string, unknown> = {};
      for (const item of value) {
        if (typeof item === 'object' && item !== null) Object.assign(merged, item);
      }
      const itemName = singular(propName);
      generateType(merged, itemName, classes, opts);
      return n(`List<${itemName}>`);
    }
    return n(`List<${csharpType(value[0], propName, classes, opts).replace(/\?$/, '')}>`);
  }
  if (typeof value === 'object') {
    generateType(value as Record<string, unknown>, propName, classes, opts);
    return n(propName);
  }
  return n('object');
}

function singular(name: string): string {
  if (name.endsWith('ies')) return name.slice(0, -3) + 'y';
  if (name.endsWith('ses')) return name.slice(0, -2);
  if (name.endsWith('us')) return name + 'Item'; // Status, Bonus, Virus — not plurals
  if (name.endsWith('s') && !name.endsWith('ss')) return name.slice(0, -1);
  return name + 'Item';
}
