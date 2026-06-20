-- Schema SQL para o Banco de Dados (SQLite e PostgreSQL Compatível)

CREATE TABLE IF NOT EXISTS cursos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'Especialização' | 'Mestrado' | 'Doutorado'
  descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS editais (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'Especialização' | 'Mestrado' | 'Doutorado'
  vagas INTEGER NOT NULL,
  vagasAmpla INTEGER NOT NULL DEFAULT 0,
  vagasAfirmativas INTEGER NOT NULL DEFAULT 0,
  vagasPcd INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL, -- 'Aberto' | 'Homologação' | 'Finalizado' | 'Em Andamento'
  dataInicio TEXT NOT NULL DEFAULT '',
  dataFim TEXT NOT NULL DEFAULT '',
  documentosExigidos TEXT NOT NULL, -- JSON array of strings
  barema TEXT NOT NULL -- JSON array of barema objects
);

CREATE TABLE IF NOT EXISTS candidatos (
  id TEXT PRIMARY KEY,
  editalId TEXT NOT NULL,
  editalTitulo TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf TEXT NOT NULL,
  cota TEXT NOT NULL, -- 'Ampla Concorrência' | 'Ações Afirmativas' | 'Pessoa com Deficiência (PcD)'
  documentos TEXT NOT NULL, -- JSON object mapping document name to {nomeArquivo, status, motivoRejeicao}
  pontuacaoBarema TEXT NOT NULL, -- JSON object mapping barema item to score
  status TEXT NOT NULL, -- 'Inscrito' | 'Homologado' | 'Recusado' | 'Recurso Pendente' | 'Aguardando Recurso'
  recursoDescricao TEXT,
  recursoStatus TEXT, -- 'Pendente' | 'Deferido' | 'Indeferido'
  recursoResposta TEXT,
  recursoDataEnvio TEXT,
  FOREIGN KEY(editalId) REFERENCES editais(id)
);

CREATE TABLE IF NOT EXISTS professores (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  titulacao TEXT NOT NULL,
  areaAtuacao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alunos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  matricula TEXT NOT NULL,
  cursoId TEXT NOT NULL,
  cursoNome TEXT NOT NULL,
  tccTitulo TEXT,
  status TEXT NOT NULL, -- 'Ativo' | 'Concluído' | 'Trancado'
  FOREIGN KEY(cursoId) REFERENCES cursos(id)
);

CREATE TABLE IF NOT EXISTS eventos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data TEXT NOT NULL,
  cargaHoraria INTEGER NOT NULL,
  qrCodeUrl TEXT NOT NULL,
  presencas TEXT NOT NULL -- JSON array of student IDs
);

CREATE TABLE IF NOT EXISTS certificado_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  assinante1Nome TEXT NOT NULL,
  assinante1Cargo TEXT NOT NULL,
  assinante1Imagem TEXT NOT NULL,
  assinante2Nome TEXT NOT NULL,
  assinante2Cargo TEXT NOT NULL,
  assinante2Imagem TEXT NOT NULL,
  textoModelo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sugestoes_curso (
  id TEXT PRIMARY KEY,
  nomeCandidato TEXT NOT NULL,
  email TEXT NOT NULL,
  areaConhecimento TEXT NOT NULL,
  nomeCurso TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS interesses_curso (
  id TEXT PRIMARY KEY,
  nomeCandidato TEXT NOT NULL,
  email TEXT NOT NULL,
  cursoNome TEXT NOT NULL,
  data TEXT NOT NULL
);

-- Tabela para armazenar as disciplinas vinculadas a cada curso
CREATE TABLE IF NOT EXISTS disciplinas (
  id TEXT PRIMARY KEY,
  cursoId TEXT NOT NULL,
  nome TEXT NOT NULL,
  ementa TEXT NOT NULL DEFAULT '',
  cargaHoraria INTEGER NOT NULL,
  professorId TEXT, -- Professor alocado
  professorNome TEXT, -- Nome do professor alocado
  cronograma TEXT NOT NULL,
  notas TEXT NOT NULL, -- JSON object mapping studentId to grade
  frequencias TEXT NOT NULL, -- JSON object mapping studentId to frequency
  FOREIGN KEY(cursoId) REFERENCES cursos(id),
  FOREIGN KEY(professorId) REFERENCES professores(id)
);
