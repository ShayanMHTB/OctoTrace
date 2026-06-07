/**
 * In-browser DuckDB. The WASM engine is fetched lazily from the jsDelivr CDN
 * and runs in a Web Worker — only the engine code comes from the network, your
 * GitHub data never leaves the page. The module is imported dynamically so it
 * is never evaluated during SSR.
 */
import type { AsyncDuckDB } from '@duckdb/duckdb-wasm';

let dbPromise: Promise<AsyncDuckDB> | null = null;

async function getDuckDB(): Promise<AsyncDuckDB> {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const duckdb = await import('@duckdb/duckdb-wasm');
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(bundles);

    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: 'text/javascript',
      }),
    );
    const worker = new Worker(workerUrl);
    const db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);
    return db;
  })();
  return dbPromise;
}

export interface Dataset {
  name: string;
  rows: Record<string, unknown>[];
}

/** (Re)create a table per dataset from in-memory rows via read_json_auto. */
export async function loadWarehouse(datasets: Dataset[]): Promise<void> {
  const db = await getDuckDB();
  const conn = await db.connect();
  try {
    for (const ds of datasets) {
      if (ds.rows.length === 0) continue;
      const file = `${ds.name}.json`;
      await db.dropFile(file).catch(() => {});
      await db.registerFileText(file, JSON.stringify(ds.rows));
      await conn.query(
        `CREATE OR REPLACE TABLE ${ds.name} AS SELECT * FROM read_json_auto('${file}')`,
      );
    }
  } finally {
    await conn.close();
  }
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  ms: number;
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const db = await getDuckDB();
  const conn = await db.connect();
  const start = performance.now();
  try {
    const table = await conn.query(sql);
    const columns = table.schema.fields.map((f) => f.name);
    const rows = table.toArray().map((row) => {
      const obj = row.toJSON() as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'bigint') obj[key] = Number(obj[key]);
      }
      return obj;
    });
    return { columns, rows, ms: Math.round(performance.now() - start) };
  } finally {
    await conn.close();
  }
}
