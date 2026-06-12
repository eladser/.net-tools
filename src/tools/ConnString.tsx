import { useState } from 'react';
import { Output, Row, Field, Checkbox } from '@/components/ui';

type Db = 'sqlserver' | 'postgres' | 'mysql' | 'sqlite' | 'redis' | 'mongodb';

const DBS: Array<{ value: Db; label: string }> = [
  { value: 'sqlserver', label: 'SQL Server' },
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'redis', label: 'Redis' },
  { value: 'mongodb', label: 'MongoDB' },
];

export function ConnString() {
  const [db, setDb] = useState<Db>('sqlserver');
  const [server, setServer] = useState('localhost');
  const [database, setDatabase] = useState('AppDb');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [integrated, setIntegrated] = useState(true);
  const [trust, setTrust] = useState(true);

  const fileBased = db === 'sqlite';
  const noDb = db === 'redis';

  let conn = '';
  switch (db) {
    case 'sqlserver':
      conn = `Server=${server};Database=${database};`;
      conn += integrated ? 'Integrated Security=True;' : `User Id=${user || 'sa'};Password=${pass || '<password>'};`;
      if (trust) conn += 'TrustServerCertificate=True;';
      break;
    case 'postgres':
      conn = `Host=${server};Database=${database};Username=${user || 'postgres'};Password=${pass || '<password>'};`;
      break;
    case 'mysql':
      conn = `Server=${server};Database=${database};Uid=${user || 'root'};Pwd=${pass || '<password>'};`;
      break;
    case 'sqlite':
      conn = `Data Source=${server || 'app.db'};`;
      break;
    case 'redis':
      conn = `${server}:6379${pass ? `,password=${pass}` : ''},abortConnect=false`;
      break;
    case 'mongodb':
      conn = user
        ? `mongodb://${user}:${pass || '<password>'}@${server}:27017/${database}?authSource=admin`
        : `mongodb://${server}:27017/${database}`;
      break;
  }

  return (
    <div className="space-y-3">
      <Row>
        <select value={db} onChange={(e) => setDb(e.target.value as Db)} className="field-select">
          {DBS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </Row>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label={fileBased ? 'File' : 'Server'} grow>
          <input type="text" value={server} onChange={(e) => setServer(e.target.value)}
            placeholder={fileBased ? 'app.db' : 'localhost'} className="field-input" />
        </Field>
        {!fileBased && !noDb && (
          <Field label="Database" grow>
            <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} className="field-input" />
          </Field>
        )}
        {!fileBased && !(db === 'sqlserver' && integrated) && (
          <>
            {!noDb && (
              <Field label="User" grow>
                <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="field-input" />
              </Field>
            )}
            <Field label="Password" grow>
              <input type="text" value={pass} onChange={(e) => setPass(e.target.value)}
                placeholder="left out if empty" className="field-input" />
            </Field>
          </>
        )}
      </div>
      {db === 'sqlserver' && (
        <Row>
          <Checkbox label="Integrated security" checked={integrated} onChange={setIntegrated} />
          <Checkbox label="TrustServerCertificate" checked={trust} onChange={setTrust} />
        </Row>
      )}
      <Output text={conn} />
    </div>
  );
}
