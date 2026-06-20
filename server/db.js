import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const sqlite = sqlite3.verbose();

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o arquivo SQLite:', err.message);
  } else {
    console.log('Conexão aberta com o banco de dados SQLite local.');
  }
});

export function initDB() {
  return new Promise((resolve, reject) => {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schema, (err) => {
      if (err) {
        console.error('Erro ao rodar o arquivo schema.sql:', err.message);
        reject(err);
      } else {
        console.log('Estrutura do banco de dados SQLite inicializada.');
        resolve();
      }
    });
  });
}

export default db;
