import express from 'express';
import cors from 'cors';
import { initDB, dbQuery, dbGet, dbRun } from './db.js';
import { seedDB } from './seed.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- LAZY DATABASE INITIALIZATION MIDDLEWARE ---
let initPromise = null;
function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      await initDB();
      await seedDB();
    })();
  }
  return initPromise;
}

app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (err) {
    console.error('Erro na inicialização lazy do banco:', err);
    res.status(500).json({ error: 'Erro ao conectar/inicializar banco de dados: ' + err.message });
  }
});

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

app.post('/api/disciplinas', async (req, res) => {
  const { id, cursoId, nome, ementa, cargaHoraria, professorId, professorNome, cronograma } = req.body;
  try {
    await dbRun(
      "INSERT INTO disciplinas (id, cursoId, nome, ementa, cargaHoraria, professorId, professorNome, cronograma, notas, frequencias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        cursoId,
        nome,
        ementa || '',
        cargaHoraria || 0,
        professorId || null,
        professorNome || null,
        cronograma || '',
        JSON.stringify({}),
        JSON.stringify({})
      ]
    );
    res.status(201).json({ id, nome });
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
  const { id, titulo, tipo, vagas, vagasAmpla, vagasAfirmativas, vagasPcd, status, dataInicio, dataFim, documentosExigidos, barema } = req.body;
  try {
    await dbRun(
      "INSERT INTO editais (id, titulo, tipo, vagas, vagasAmpla, vagasAfirmativas, vagasPcd, status, dataInicio, dataFim, documentosExigidos, barema) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        titulo,
        tipo,
        vagas,
        vagasAmpla || 0,
        vagasAfirmativas || 0,
        vagasPcd || 0,
        status,
        dataInicio || '',
        dataFim || '',
        JSON.stringify(documentosExigidos || []),
        JSON.stringify(barema || [])
      ]
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
    const formatted = candidatos.map(c => {
      const formattedCand = {
        ...c,
        documentos: JSON.parse(c.documentos || '{}'),
        pontuacaoBarema: JSON.parse(c.pontuacaoBarema || '{}')
      };
      if (c.recursoDescricao) {
        formattedCand.recurso = {
          descricao: c.recursoDescricao,
          status: c.recursoStatus || 'Pendente',
          respostaCoordenador: c.recursoResposta || '',
          dataEnvio: c.recursoDataEnvio || ''
        };
      }
      return formattedCand;
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/candidatos', async (req, res) => {
  const { id, editalId, editalTitulo, nome, email, cpf, cota, documentos, pontuacaoBarema, status, recurso } = req.body;
  try {
    await dbRun(
      "INSERT INTO candidatos (id, editalId, editalTitulo, nome, email, cpf, cota, documentos, pontuacaoBarema, status, recursoDescricao, recursoStatus, recursoResposta, recursoDataEnvio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        editalId,
        editalTitulo,
        nome,
        email,
        cpf,
        cota,
        JSON.stringify(documentos || {}),
        JSON.stringify(pontuacaoBarema || {}),
        status,
        recurso ? recurso.descricao : null,
        recurso ? recurso.status : null,
        recurso ? recurso.respostaCoordenador || recurso.resposta : null,
        recurso ? recurso.dataEnvio : null
      ]
    );
    res.status(201).json({ id, nome, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/candidatos/:id', async (req, res) => {
  const { id } = req.params;
  const { status, documentos, pontuacaoBarema, recurso } = req.body;
  try {
    await dbRun(
      `UPDATE candidatos SET 
        status = ?, 
        documentos = ?, 
        pontuacaoBarema = ?, 
        recursoDescricao = ?, 
        recursoStatus = ?, 
        recursoResposta = ?,
        recursoDataEnvio = ?
       WHERE id = ?`,
      [
        status,
        JSON.stringify(documentos || {}),
        JSON.stringify(pontuacaoBarema || {}),
        recurso ? recurso.descricao : null,
        recurso ? recurso.status : null,
        recurso ? recurso.respostaCoordenador || recurso.resposta : null,
        recurso ? recurso.dataEnvio : null,
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

// 10. Atualização de Disciplinas (Notas, Frequências, Professor, etc.)
app.put('/api/disciplinas/:id', async (req, res) => {
  const { id } = req.params;
  const { notas, frequencias, professorId, professorNome, cronograma, ementa, nome } = req.body;
  try {
    const current = await dbGet("SELECT * FROM disciplinas WHERE id = ?", [id]);
    if (!current) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    
    const updated = {
      nome: nome !== undefined ? nome : current.nome,
      ementa: ementa !== undefined ? ementa : current.ementa,
      cronograma: cronograma !== undefined ? cronograma : current.cronograma,
      professorId: professorId !== undefined ? professorId : current.professorId,
      professorNome: professorNome !== undefined ? professorNome : current.professorNome,
      notas: notas !== undefined ? JSON.stringify(notas) : current.notas,
      frequencias: frequencias !== undefined ? JSON.stringify(frequencias) : current.frequencias
    };

    await dbRun(
      `UPDATE disciplinas SET 
        nome = ?,
        ementa = ?,
        cronograma = ?,
        professorId = ?,
        professorNome = ?,
        notas = ?,
        frequencias = ?
       WHERE id = ?`,
      [
        updated.nome,
        updated.ementa,
        updated.cronograma,
        updated.professorId,
        updated.professorNome,
        updated.notas,
        updated.frequencias,
        id
      ]
    );
    res.json({ message: 'Disciplina atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Local listen conditional
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor Express local rodando na porta ${PORT}`);
    console.log(`Conexão com banco de dados ativa e tabelas prontas.`);
  });
}

export default app;
