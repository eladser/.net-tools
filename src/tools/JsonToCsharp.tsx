import { useState } from 'react';
import { Textarea, Output, Checkbox, Row, Field, Bench, PaneLabel, RefSection, RefCode } from '@/components/ui';
import { jsonToCsharp } from '@/lib/csharp';

export function JsonToCsharp() {
  const [input, setInput] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [records, setRecords] = useState(false);
  const [nullable, setNullable] = useState(true);
  const [jsonAttributes, setJsonAttributes] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    try {
      setOutput(jsonToCsharp(input, { rootName, records, nullable, jsonAttributes, fileScoped: false }));
    } catch (e) {
      setOutput(`// ${e instanceof Error ? e.message : 'Invalid JSON'}`);
    }
  };

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>json</PaneLabel>
          <Textarea
            rows={16}
            placeholder='{"user_id": 1, "first_name": "Ada", "created_at": "2026-01-01T00:00:00Z"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Row>
            <Field label="Class">
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="field-input w-28"
              />
            </Field>
            <Checkbox label="Records" checked={records} onChange={setRecords} />
            <Checkbox label="Nullable" checked={nullable} onChange={setNullable} />
            <Checkbox label="[JsonPropertyName]" checked={jsonAttributes} onChange={setJsonAttributes} />
          </Row>
          <button onClick={generate} className="btn-primary">Generate</button>
        </>
      }
      right={
        <>
          <PaneLabel>c#</PaneLabel>
          <Output text={output} placeholder="Classes come out here — snake_case keys become PascalCase properties" />
        </>
      }
    />
    <RefSection title="using it">
      <RefCode code={`var root = JsonSerializer.Deserialize<Root>(json);

// Or skip the attributes entirely with a naming policy:
var opts = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };
var root = JsonSerializer.Deserialize<Root>(json, opts);   // .NET 8+`} />
    </RefSection>
    </>
  );
}
