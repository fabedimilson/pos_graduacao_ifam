
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Use Neon PostgreSQL if DATABASE_URL is defined, else fallback to local SQLite
const usePostgres = !!process.env.DATABASE_URL;

let pgPool = null;
let sqliteDb = null;

if (usePostgres) {
  console.log('Banco de dados: Conectando ao Neon PostgreSQL...');
  pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  console.log('Banco de dados: Conectando ao SQLite local...');
  const sqlite3 = (await import('sqlite3')).default;
  const sqlite = sqlite3.verbose();
  sqliteDb = new sqlite.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao abrir o banco SQLite local:', err.message);
    }
  });
}

// Maps lowercase column names from PostgreSQL to camelCase properties used in the application
const keyMappings = {
  editalid: 'editalId',
  editaltitulo: 'editalTitulo',
  documentosexigidos: 'documentosExigidos',
  vagasampla: 'vagasAmpla',
  vagasafirmativas: 'vagasAfirmativas',
  vagaspcd: 'vagasPcd',
  datainicio: 'dataInicio',
  datafim: 'dataFim',
  pontuacaobarema: 'pontuacaoBarema',
  recursodescricao: 'recursoDescricao',
  recursostatus: 'recursoStatus',
  recursoresposta: 'recursoResposta',
  recursodataenvio: 'recursoDataEnvio',
  areaatuacao: 'areaAtuacao',
  cursoid: 'cursoId',
  cursonome: 'cursoNome',
  tcctitulo: 'tccTitulo',
  cargahoraria: 'cargaHoraria',
  qrcodeurl: 'qrCodeUrl',
  assinante1nome: 'assinante1Nome',
  assinante1cargo: 'assinante1Cargo',
  assinante1imagem: 'assinante1Imagem',
  assinante2nome: 'assinante2Nome',
  assinante2cargo: 'assinante2Cargo',
  assinante2imagem: 'assinante2Imagem',
  textomodelo: 'textoModelo',
  nomecandidato: 'nomeCandidato',
  areaconhecimento: 'areaConhecimento',
  nomecurso: 'nomeCurso',
  professorid: 'professorId',
  professornome: 'professorNome'
};

function normalizeRow(row) {
  if (!row) return row;
  const normalized = {};
  for (const key of Object.keys(row)) {
    const lowerKey = key.toLowerCase();
    const mappedKey = keyMappings[lowerKey] || key;
    normalized[mappedKey] = row[key];
  }
  return normalized;
}

// Helper to convert SQLite '?' parameters to PostgreSQL '$1, $2, ...'
function convertPlaceholders(query) {
  if (!usePostgres) return query;
  let index = 1;
  return query.replace(/\?/g, () => `$${index++}`);
}

export function initDB() {
  return new Promise((resolve, reject) => {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    if (usePostgres) {
      pgPool.query(schema)
        .then(() => {
          console.log('Estrutura do banco de dados PostgreSQL (Neon) inicializada.');
          resolve();
        })
        .catch((err) => {
          console.error('Erro ao rodar schema.sql no PostgreSQL:', err.message);
          reject(err);
        });
    } else {
      sqliteDb.exec(schema, (err) => {
        if (err) {
          console.error('Erro ao rodar schema.sql no SQLite:', err.message);
          reject(err);
        } else {
          console.log('Estrutura do banco de dados SQLite inicializada.');
          resolve();
        }
      });
    }
  });
}

export function dbQuery(query, params = []) {
  if (usePostgres) {
    const pgQuery = convertPlaceholders(query);
    return pgPool.query(pgQuery, params).then(res => res.rows.map(normalizeRow));
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(normalizeRow));
      });
    });
  }
}

export function dbGet(query, params = []) {
  if (usePostgres) {
    const pgQuery = convertPlaceholders(query);
    return pgPool.query(pgQuery, params).then(res => normalizeRow(res.rows[0]));
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(normalizeRow(row));
      });
    });
  }
}

export function dbRun(query, params = []) {
  if (usePostgres) {
    const pgQuery = convertPlaceholders(query);
    return pgPool.query(pgQuery, params).then(res => ({
      id: null,
      changes: res.rowCount
    }));
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
}

const db = usePostgres ? pgPool : sqliteDb;
export default db;
