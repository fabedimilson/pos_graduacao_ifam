import express from 'express';
import cors from 'cors';
import db, { initDB } from './db.js';
import { seedDB } from './seed.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database and start server
initDB()
  .then(() => seedDB())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor Express local rodando na porta ${PORT}`);
      console.log(`Conexão com SQLite ativa. Tabelas de dados prontas.`);
    });
  })
  .catch((err) => {
    console.error('Erro na inicialização do servidor:', err);
    process.exit(1);
  });

// --- HELPER FUNCTION: DB Queries with Promises ---
const dbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// --- API ENDPOINTS ---

// 1. Cursos & Disciplinas
app.get('/api/cursos', async (req, res) => {
  try {
    const courses = await dbQuery("SELECT * FROM cursos");
    const disciplines = await dbQuery("SELECT * FROM disciplinas");

    const fullCourses = courses.map(c => {
      const courseDiscs = disciplines
        .filter(d => d.cursoId === c.id)
        .map(d => ({
          ...d,
          notas: JSON.parse(d.notas || '{}'),
          frequencias: JSON.parse(d.frequencias || '{}')
        }));
      return {
        ...c,
        disciplinas: courseDiscs
      };
    });

    res.json(fullCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cursos', async (req, res) => {
  const { id, nome, tipo, descricao } = req.body;
  try {
    await dbRun(
      "INSERT INTO cursos (id, nome, tipo, descricao) VALUES (?, ?, ?, ?)",
      [id, nome, tipo, descricao]
    );
    res.status(201).json({ id, nome, tipo, descricao });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Editais
app.get('/api/editais', async (req, res) => {
  try {
    const editais = await dbQuery("SELECT * FROM editais");
    const formatted = editais.map(e => ({
      ...e,
      documentosExigidos: JSON.parse(e.documentosExigidos || '[]'),
      barema: JSON.parse(e.barema || '[]')
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/editais', async (req, res) => {
  const { id, titulo, tipo, vagas, status, documentosExigidos, barema } = req.body;
  try {
    await dbRun(
      "INSERT INTO editais (id, titulo, tipo, vagas, status, documentosExigidos, barema) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, titulo, tipo, vagas, status, JSON.stringify(documentosExigidos), JSON.stringify(barema)]
    );
    res.status(201).json({ id, titulo, tipo, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Candidatos
app.get('/api/candidatos', async (req, res) => {
  try {
    const candidatos = await dbQuery("SELECT * FROM candidatos");
    const formatted = candidatos.map(c => ({
      ...c,
      documentos: JSON.parse(c.documentos || '{}'),
      pontuacaoBarema: JSON.parse(c.pontuacaoBarema || '{}')
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/candidatos', async (req, res) => {
  const { id, editalId, editalTitulo, nome, email, cpf, cota, documentos, pontuacaoBarema, status } = req.body;
  try {
    await dbRun(
      "INSERT INTO candidatos (id, editalId, editalTitulo, nome, email, cpf, cota, documentos, pontuacaoBarema, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, editalId, editalTitulo, nome, email, cpf, cota, JSON.stringify(documentos), JSON.stringify(pontuacaoBarema), status]
    );
    res.status(201).json({ id, nome, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/candidatos/:id', async (req, res) => {
  const { id } = req.params;
  const { status, documentos, pontuacaoBarema, recursoDescricao, recursoStatus, recursoResposta } = req.body;
  try {
    await dbRun(
      `UPDATE candidatos SET 
        status = ?, 
        documentos = ?, 
        pontuacaoBarema = ?, 
        recursoDescricao = ?, 
        recursoStatus = ?, 
        recursoResposta = ?
       WHERE id = ?`,
      [
        status,
        JSON.stringify(documentos || {}),
        JSON.stringify(pontuacaoBarema || {}),
        recursoDescricao || null,
        recursoStatus || null,
        recursoResposta || null,
        id
      ]
    );
    res.json({ message: 'Candidato atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Professores
app.get('/api/professores', async (req, res) => {
  try {
    const professores = await dbQuery("SELECT * FROM professores");
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Alunos
app.get('/api/alunos', async (req, res) => {
  try {
    const alunos = await dbQuery("SELECT * FROM alunos");
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Eventos
app.get('/api/eventos', async (req, res) => {
  try {
    const eventos = await dbQuery("SELECT * FROM eventos");
    const formatted = eventos.map(ev => ({
      ...ev,
      presencas: JSON.parse(ev.presencas || '[]')
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. CertificadoConfig
app.get('/api/certificado-config', async (req, res) => {
  try {
    const config = await dbGet("SELECT * FROM certificado_config WHERE id = 1");
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Sugestões de Cursos
app.get('/api/sugestoes', async (req, res) => {
  try {
    const sugestoes = await dbQuery("SELECT * FROM sugestoes_curso");
    res.json(sugestoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sugestoes', async (req, res) => {
  const { id, nomeCandidato, email, areaConhecimento, nomeCurso, data } = req.body;
  try {
    await dbRun(
      "INSERT INTO sugestoes_curso (id, nomeCandidato, email, areaConhecimento, nomeCurso, data) VALUES (?, ?, ?, ?, ?, ?)",
      [id, nomeCandidato, email, areaConhecimento, nomeCurso, data]
    );
    res.status(201).json({ id, nomeCurso });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Interesses em Cursos
app.get('/api/interesses', async (req, res) => {
  try {
    const interesses = await dbQuery("SELECT * FROM interesses_curso");
    res.json(interesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/interesses', async (req, res) => {
  const { id, nomeCandidato, email, cursoNome, data } = req.body;
  try {
    await dbRun(
      "INSERT INTO interesses_curso (id, nomeCandidato, email, cursoNome, data) VALUES (?, ?, ?, ?, ?)",
      [id, nomeCandidato, email, cursoNome, data]
    );
    res.status(201).json({ id, cursoNome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Atualização de Disciplinas (Notas e Frequências)
app.put('/api/disciplinas/:id', async (req, res) => {
  const { id } = req.params;
  const { notas, frequencias } = req.body;
  try {
    await dbRun(
      "UPDATE disciplinas SET notas = ?, frequencias = ? WHERE id = ?",
      [JSON.stringify(notas), JSON.stringify(frequencias), id]
    );
    res.json({ message: 'Disciplina atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
