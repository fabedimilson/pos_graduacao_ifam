export interface Edital {
  id: string;
  titulo: string;
  tipo: 'Especialização' | 'Mestrado' | 'Doutorado';
  vagas: number;
  vagasAmpla: number;
  vagasAfirmativas: number;
  vagasPcd: number;
  status: 'Aberto' | 'Homologação' | 'Finalizado' | 'Em Andamento';
  dataInicio: string;
  dataFim: string;
  documentosExigidos: string[];
  barema: { item: string; pontuacaoMaxima: number; obrigatorio: boolean }[];
}

export interface Candidato {
  id: string;
  editalId: string;
  editalTitulo: string;
  nome: string;
  email: string;
  cpf: string;
  cota: 'Ampla Concorrência' | 'Ações Afirmativas' | 'Pessoa com Deficiência (PcD)';
  documentos: {
    [key: string]: {
      nomeArquivo: string;
      status: 'Pendente' | 'Aprovado' | 'Recusado';
      motivoRecusa?: string;
    };
  };
  pontuacaoBarema: { [item: string]: number };
  status: 'Inscrito' | 'Homologado' | 'Indeferido' | 'Aprovado' | 'Aguardando Recurso';
  recurso?: {
    descricao: string;
    status: 'Pendente' | 'Deferido' | 'Indeferido';
    respostaCoordenador?: string;
    dataEnvio: string;
  };
}

export interface Disciplina {
  id: string;
  nome: string;
  ementa: string;
  cargaHoraria: number;
  cronograma: string; // Ex: "Segunda e Quarta, 18h30 - 22h30"
  professorId?: string;
  professorNome?: string;
  notas: { [alunoId: string]: number };
  frequencias: { [alunoId: string]: number }; // percentual, ex: 90
}

export interface CursoExistente {
  id: string;
  nome: string;
  tipo: 'Especialização' | 'Mestrado' | 'Doutorado';
  descricao: string;
  disciplinas: Disciplina[];
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  cargaHoraria: number;
  qrCodeUrl: string;
  presencas: string[]; // alunoIds que registraram presença
}

export interface CertificadoConfig {
  assinante1Nome: string;
  assinante1Cargo: string;
  assinante1Imagem: string; // base64 ou placeholder
  assinante2Nome: string;
  assinante2Cargo: string;
  assinante2Imagem: string; // base64 ou placeholder
  textoModelo: string;
}

export interface SugestaoCurso {
  id: string;
  nomeCandidato: string;
  email: string;
  areaConhecimento: string;
  nomeCurso: string;
  data: string;
}

export interface InteresseCurso {
  id: string;
  nomeCandidato: string;
  email: string;
  cursoNome: string;
  data: string;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  siape: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  cursoId: string;
  cursoNome: string;
  tccTitulo?: string;
  status: 'Ativo' | 'Concluído';
}

// Biblioteca de Possíveis Cursos por Área de Conhecimento
export const bibliotecaCursosPorArea: { [area: string]: string[] } = {
  'Ensino de Ciências e Tecnologias': [
    'Especialização em Ensino de Ciências e Tecnologias',
    'Especialização em Robótica Educacional',
    'Mestrado Profissional em Ensino Tecnológico (PPGET)',
    'Doutorado em Ensino Tecnológico'
  ],
  'Ciências Exatas e da Terra': [
    'Especialização em Ciência de Dados aplicada à Indústria',
    'Mestrado em Modelagem Computacional',
    'Especialização em Desenvolvimento de Software Seguro'
  ],
  'Engenharias e Tecnologia': [
    'Especialização em Internet das Coisas (IoT) e Automação Industrial',
    'Especialização em Sistemas Embarcados da Lei da Informática',
    'Mestrado em Engenharia de Processos Industriais',
    'Especialização em PD&I para o Polo Industrial de Manaus'
  ],
  'Ciências Humanas e Sociais': [
    'Especialização em Gestão e Inovação na Educação Pública',
    'Especialização em Propriedade Intelectual e Transferência de Tecnologia'
  ]
};

// Cursos Existentes
export const cursosIniciais: CursoExistente[] = [
  {
    id: 'curso-1',
    nome: 'Especialização em Ensino de Ciências e Tecnologias',
    tipo: 'Especialização',
    descricao: 'Qualificar professores da Educação Básica por meio de fundamentos epistemológicos, tecnológicos e didático-pedagógicos.',
    disciplinas: [
      { id: 'd-1', nome: 'Didática das Ciências e Tecnologias', ementa: 'História do Ensino de Ciências. Teorias de aprendizagem. Métodos de ensino ativos.', cargaHoraria: 60, cronograma: 'Segunda a Sexta: 18h30 - 22h30', notas: {}, frequencias: {} },
      { id: 'd-2', nome: 'Seminário de Trabalho de Conclusão de Curso (TCC)', ementa: 'Metodologia científica. Estrutura do TCC. Pesquisa educacional.', cargaHoraria: 45, cronograma: 'Sábado: 8h - 12h', notas: {}, frequencias: {} }
    ]
  },
  {
    id: 'curso-2',
    nome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)',
    tipo: 'Mestrado',
    descricao: 'Formação de pesquisadores aplicados ao desenvolvimento de produtos educativos voltados ao ensino tecnológico.',
    disciplinas: [
      { id: 'd-3', nome: 'Pesquisa Aplicada ao Ensino Tecnológico', ementa: 'Fundamentos epistemológicos da pesquisa tecnológica. Métodos qualitativos e quantitativos.', cargaHoraria: 90, cronograma: 'Quarta e Quinta: 14h - 18h', notas: {}, frequencias: {} },
      { id: 'd-4', nome: 'Desenvolvimento de Produtos Educacionais', ementa: 'Design instrucional. Desenvolvimento de softwares e jogos educativos. Validação de produtos.', cargaHoraria: 90, cronograma: 'Terça: 8h - 12h, 14h - 18h', notas: {}, frequencias: {} }
    ]
  }
];

// Editais Iniciais
export const editaisIniciais: Edital[] = [
  {
    id: 'ed-spec-2026',
    titulo: 'Edital 01/2026 - Especialização em Ensino de Ciências e Tecnologias (CMC)',
    tipo: 'Especialização',
    vagas: 30,
    vagasAmpla: 24,
    vagasAfirmativas: 4,
    vagasPcd: 2,
    status: 'Aberto',
    dataInicio: '10/03/2026',
    dataFim: '17/03/2026',
    documentosExigidos: ['RG e CPF', 'Diploma de Graduação', 'Currículo Lattes', 'Carta de Intenção'],
    barema: [
      { item: 'Experiência Docente na Educação Básica (por ano)', pontuacaoMaxima: 40, obrigatorio: false },
      { item: 'Carta de Intenção de Pesquisa', pontuacaoMaxima: 30, obrigatorio: true },
      { item: 'Publicação de Artigos ou Trabalhos Científicos', pontuacaoMaxima: 30, obrigatorio: false }
    ]
  },
  {
    id: 'ed-mestrado-2026',
    titulo: 'Edital 03/2025 - Mestrado Profissional em Ensino Tecnológico (PPGET)',
    tipo: 'Mestrado',
    vagas: 17,
    vagasAmpla: 14,
    vagasAfirmativas: 3,
    vagasPcd: 0,
    status: 'Homologação',
    dataInicio: '01/10/2025',
    dataFim: '27/10/2025',
    documentosExigidos: ['Documento de Identidade', 'Diploma ou Declaração de Conclusão', 'Currículo Lattes', 'Projeto de Pesquisa'],
    barema: [
      { item: 'Projeto de Pesquisa alinhado com Linha de Ensino', pontuacaoMaxima: 40, obrigatorio: true },
      { item: 'Currículo Lattes (Artigos, Eventos e Livros)', pontuacaoMaxima: 35, obrigatorio: false },
      { item: 'Experiência Profissional em Educação ou Tecnologia', pontuacaoMaxima: 25, obrigatorio: false }
    ]
  }
];

// Professores Iniciais
export const professoresIniciais: Professor[] = [
  { id: 'prof-1', nome: 'Dra. Maria Vasconcelos', email: 'maria.vasconcelos@ifam.edu.br', siape: '1029384' },
  { id: 'prof-2', nome: 'Dr. Carlos Souza', email: 'carlos.souza@ifam.edu.br', siape: '9283741' },
  { id: 'prof-3', nome: 'Dr. Roberto Oliveira', email: 'roberto.oliveira@ifam.edu.br', siape: '8837462' }
];

// Alunos Cadastrados de Exemplo
export const alunosIniciais: Aluno[] = [
  { id: 'aluno-1', nome: 'Otávio Rangel Costa', email: 'otavio.rangel@gmail.com', matricula: 'IFAM2026001', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', tccTitulo: 'A Robótica de Baixo Custo como Ferramenta Didática no Ensino Fundamental II', status: 'Ativo' },
  { id: 'aluno-2', nome: 'Fernanda Lima Silva', email: 'fernanda.lima@gmail.com', matricula: 'IFAM2026002', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', tccTitulo: 'O Ensino de Química Baseado em Jogos Digitais e Elementos de Gamificação', status: 'Ativo' },
  { id: 'aluno-3', nome: 'Ricardo Mendes Souza', email: 'ricardo.mendes@gmail.com', matricula: 'IFAM2025102', cursoId: 'curso-2', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)', tccTitulo: 'Desenvolvimento e Avaliação de um Simulador Virtual de Circuitos para o Ensino Técnico', status: 'Ativo' }
];

// Candidatos Iniciais para Teste
export const candidatosIniciais: Candidato[] = [
  {
    id: 'cand-1',
    editalId: 'ed-spec-2026',
    editalTitulo: 'Edital 01/2026 - Especialização em Ensino de Ciências e Tecnologias (CMC)',
    nome: 'Juliana Pires Santos',
    email: 'juliana.pires@outlook.com',
    cpf: '123.456.789-00',
    cota: 'Ampla Concorrência',
    documentos: {
      'RG e CPF': { nomeArquivo: 'rg_cpf_juliana.pdf', status: 'Aprovado' },
      'Diploma de Graduação': { nomeArquivo: 'diploma_graduacao_juliana.pdf', status: 'Aprovado' },
      'Currículo Lattes': { nomeArquivo: 'lattes_juliana.pdf', status: 'Aprovado' },
      'Carta de Intenção': { nomeArquivo: 'carta_intencao_juliana.pdf', status: 'Aprovado' }
    },
    pontuacaoBarema: {
      'Experiência Docente na Educação Básica (por ano)': 20,
      'Carta de Intenção de Pesquisa': 25,
      'Publicação de Artigos ou Trabalhos Científicos': 10
    },
    status: 'Inscrito'
  },
  {
    id: 'cand-2',
    editalId: 'ed-spec-2026',
    editalTitulo: 'Edital 01/2026 - Especialização em Ensino de Ciências e Tecnologias (CMC)',
    nome: 'Alan Bruno Castro',
    email: 'alan.bruno@gmail.com',
    cpf: '987.654.321-11',
    cota: 'Ações Afirmativas',
    documentos: {
      'RG e CPF': { nomeArquivo: 'rg_cpf_alan.pdf', status: 'Aprovado' },
      'Diploma de Graduação': { nomeArquivo: 'diploma_graduacao_alan.pdf', status: 'Recusado', motivoRecusa: 'Falta assinatura digital do emissor e imagem cortada' },
      'Currículo Lattes': { nomeArquivo: 'lattes_alan.pdf', status: 'Aprovado' },
      'Carta de Intenção': { nomeArquivo: 'carta_alan.pdf', status: 'Aprovado' }
    },
    pontuacaoBarema: {
      'Experiência Docente na Educação Básica (por ano)': 0,
      'Carta de Intenção de Pesquisa': 18,
      'Publicação de Artigos ou Trabalhos Científicos': 0
    },
    status: 'Aguardando Recurso'
  }
];

// Eventos Iniciais
export const eventosIniciais: Evento[] = [
  {
    id: 'ev-1',
    titulo: 'V Colóquio de Ensino Tecnológico do Amazonas',
    descricao: 'Palestras e mesas redondas sobre inovação pedagógica e o uso de IA nas escolas ribeirinhas.',
    data: '15/05/2026',
    cargaHoraria: 8,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=check-ev-1',
    presencas: ['aluno-1', 'aluno-2']
  },
  {
    id: 'ev-2',
    titulo: 'Workshop II: Desenvolvimento de Produtos Educacionais',
    descricao: 'Oficina prática para avaliação de maquetes didáticas e aplicativos criados pelos mestrandos.',
    data: '22/06/2026',
    cargaHoraria: 4,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=check-ev-2',
    presencas: ['aluno-3']
  }
];

// Configuração Padrão de Assinatura de Certificado
export const certificadoConfigInicial: CertificadoConfig = {
  assinante1Nome: 'Dr. Amilton Ramos de Souza',
  assinante1Cargo: 'Diretor Geral do Campus Manaus Centro',
  assinante1Imagem: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_Robert_Mueller.svg', // Signature representation
  assinante2Nome: 'Dra. Sandra Letícia da Silva',
  assinante2Cargo: 'Coordenadora Geral de Pós-Graduação',
  assinante2Imagem: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Signature_of_Alexander_Hamilton.svg', // Signature representation
  textoModelo: 'Certificamos que {NOME_ALUNO} participou com êxito do evento "{NOME_EVENTO}" promovido pela Coordenação de Pós-Graduação do IFAM, realizado no dia {DATA_EVENTO}, totalizando uma carga horária de {CARGA_HORARIA} horas.'
};

// Sugestões Iniciais
export const sugestoesIniciais: SugestaoCurso[] = [
  { id: 'sug-1', nomeCandidato: 'Thiago Pereira', email: 'thiago.p@gmail.com', areaConhecimento: 'Engenharias e Tecnologia', nomeCurso: 'Mestrado Profissional em Energias Renováveis na Amazônia', data: '18/06/2026' },
  { id: 'sug-2', nomeCandidato: 'Mariana Lima', email: 'mari.lima@yahoo.com', areaConhecimento: 'Ensino de Ciências e Tecnologias', nomeCurso: 'Especialização em IA aplicada à Educação Básica', data: '19/06/2026' }
];

// Manifestações de Interesse Iniciais
export const interessesIniciais: InteresseCurso[] = [
  { id: 'int-1', nomeCandidato: 'Patrícia Rocha', email: 'patricia.rocha@gmail.com', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)', data: '19/06/2026' },
  { id: 'int-2', nomeCandidato: 'Bruno Gomes', email: 'bruno.gomes@live.com', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', data: '20/06/2026' }
];
