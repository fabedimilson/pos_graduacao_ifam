import { dbRun } from './db.js';

export async function seedDB() {
  console.log('Iniciando semeadura do banco de dados...');

  // 1. Cursos
  const cursosIniciais = [
    {
      id: 'curso-1',
      nome: 'Especialização em Ensino de Ciências e Tecnologias',
      tipo: 'Especialização',
      descricao: 'Qualificar professores da Educação Básica por meio de fundamentos epistemológicos, tecnológicos e didático-pedagógicos.'
    },
    {
      id: 'curso-2',
      nome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)',
      tipo: 'Mestrado',
      descricao: 'Formação de pesquisadores aplicados ao desenvolvimento de produtos educativos voltados ao ensino tecnológico.'
    }
  ];

  for (const c of cursosIniciais) {
    await dbRun(
      "INSERT INTO cursos (id, nome, tipo, descricao) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [c.id, c.nome, c.tipo, c.descricao]
    );
  }
  console.log('Cursos semeados.');

  // 2. Professores
  const professoresIniciais = [
    { id: 'prof-1', nome: 'Dra. Maria Vasconcelos', email: 'maria.vasconcelos@ifam.edu.br', areaAtuacao: 'Ensino de Ciências' },
    { id: 'prof-2', nome: 'Dr. Carlos Souza', email: 'carlos.souza@ifam.edu.br', areaAtuacao: 'Biotecnologia e Educação' },
    { id: 'prof-3', nome: 'Dr. Roberto Oliveira', email: 'roberto.oliveira@ifam.edu.br', areaAtuacao: 'Desenvolvimento Tecnológico' }
  ];

  for (const p of professoresIniciais) {
    await dbRun(
      "INSERT INTO professores (id, nome, email, titulacao, areaAtuacao) VALUES (?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [p.id, p.nome, p.email, 'Doutorado', p.areaAtuacao]
    );
  }
  console.log('Professores semeados.');

  // 3. Disciplinas
  const disciplinasIniciais = [
    {
      id: 'd-1',
      cursoId: 'curso-1',
      nome: 'Didática das Ciências e Tecnologias',
      ementa: 'História do Ensino de Ciências. Teorias de aprendizagem. Métodos de ensino ativos.',
      cargaHoraria: 60,
      professorId: 'prof-1',
      professorNome: 'Dra. Maria Vasconcelos',
      cronograma: 'Segunda a Sexta: 18h30 - 22h30',
      notas: {},
      frequencias: {}
    },
    {
      id: 'd-2',
      cursoId: 'curso-1',
      nome: 'Seminário de Trabalho de Conclusão de Curso (TCC)',
      ementa: 'Metodologia científica. Estrutura do TCC. Pesquisa educacional.',
      cargaHoraria: 45,
      professorId: 'prof-3',
      professorNome: 'Dr. Roberto Oliveira',
      cronograma: 'Sábado: 8h - 12h',
      notas: {},
      frequencias: {}
    },
    {
      id: 'd-3',
      cursoId: 'curso-2',
      nome: 'Pesquisa Aplicada ao Ensino Tecnológico',
      ementa: 'Fundamentos epistemológicos da pesquisa tecnológica. Métodos qualitativos e quantitativos.',
      cargaHoraria: 90,
      professorId: 'prof-2',
      professorNome: 'Dr. Carlos Souza',
      cronograma: 'Quarta e Quinta: 14h - 18h',
      notas: {},
      frequencias: {}
    },
    {
      id: 'd-4',
      cursoId: 'curso-2',
      nome: 'Desenvolvimento de Produtos Educacionais',
      ementa: 'Design instrucional. Desenvolvimento de softwares e jogos educativos. Validação de produtos.',
      cargaHoraria: 90,
      professorId: 'prof-3',
      professorNome: 'Dr. Roberto Oliveira',
      cronograma: 'Terça: 8h - 12h, 14h - 18h',
      notas: {},
      frequencias: {}
    }
  ];

  for (const d of disciplinasIniciais) {
    await dbRun(
      "INSERT INTO disciplinas (id, cursoId, nome, ementa, cargaHoraria, professorId, professorNome, cronograma, notas, frequencias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [
        d.id,
        d.cursoId,
        d.nome,
        d.ementa,
        d.cargaHoraria,
        d.professorId,
        d.professorNome,
        d.cronograma,
        JSON.stringify(d.notas),
        JSON.stringify(d.frequencias)
      ]
    );
  }
  console.log('Disciplinas semeadas.');

  // 4. Editais
  const editaisIniciais = [
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
      vagasAmpla: 13,
      vagasAfirmativas: 3,
      vagasPcd: 1,
      status: 'Homologação',
      dataInicio: '05/01/2026',
      dataFim: '25/01/2026',
      documentosExigidos: ['Documento de Identidade', 'Diploma ou Declaração de Conclusão', 'Currículo Lattes', 'Projeto de Pesquisa'],
      barema: [
        { item: 'Projeto de Pesquisa alinhado com Linha de Ensino', pontuacaoMaxima: 40, obrigatorio: true },
        { item: 'Currículo Lattes (Artigos, Eventos e Livros)', pontuacaoMaxima: 35, obrigatorio: false },
        { item: 'Experiência Profissional em Educação ou Tecnologia', pontuacaoMaxima: 25, obrigatorio: false }
      ]
    }
  ];

  for (const e of editaisIniciais) {
    await dbRun(
      "INSERT INTO editais (id, titulo, tipo, vagas, vagasAmpla, vagasAfirmativas, vagasPcd, status, dataInicio, dataFim, documentosExigidos, barema) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [
        e.id,
        e.titulo,
        e.tipo,
        e.vagas,
        e.vagasAmpla,
        e.vagasAfirmativas,
        e.vagasPcd,
        e.status,
        e.dataInicio,
        e.dataFim,
        JSON.stringify(e.documentosExigidos),
        JSON.stringify(e.barema)
      ]
    );
  }
  console.log('Editais semeados.');

  // 5. Alunos
  const alunosIniciais = [
    { id: 'aluno-1', nome: 'Otávio Rangel Costa', email: 'otavio.rangel@gmail.com', matricula: 'IFAM2026001', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', status: 'Ativo' },
    { id: 'aluno-2', nome: 'Fernanda Lima Silva', email: 'fernanda.lima@gmail.com', matricula: 'IFAM2026002', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', status: 'Ativo' },
    { id: 'aluno-3', nome: 'Ricardo Mendes Souza', email: 'ricardo.mendes@gmail.com', matricula: 'IFAM2025102', cursoId: 'curso-2', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)', status: 'Ativo' }
  ];

  for (const a of alunosIniciais) {
    await dbRun(
      "INSERT INTO alunos (id, nome, email, matricula, cursoId, cursoNome, tccTitulo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [a.id, a.nome, a.email, a.matricula, a.cursoId, a.cursoNome, null, a.status]
    );
  }
  console.log('Alunos semeados.');

  // 6. Candidatos
  const candidatosIniciais = [
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
      status: 'Recurso Pendente',
      recursoDescricao: 'O documento do diploma de graduação enviado está assinado eletronicamente pelo Gov.br no verso do arquivo, favor reavaliar.',
      recursoStatus: 'Pendente',
      recursoResposta: '',
      recursoDataEnvio: '20/06/2026'
    }
  ];

  for (const c of candidatosIniciais) {
    await dbRun(
      "INSERT INTO candidatos (id, editalId, editalTitulo, nome, email, cpf, cota, documentos, pontuacaoBarema, status, recursoDescricao, recursoStatus, recursoResposta, recursoDataEnvio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [
        c.id,
        c.editalId,
        c.editalTitulo,
        c.nome,
        c.email,
        c.cpf,
        c.cota,
        JSON.stringify(c.documentos),
        JSON.stringify(c.pontuacaoBarema),
        c.status,
        c.recursoDescricao || null,
        c.recursoStatus || null,
        c.recursoResposta || null,
        c.recursoDataEnvio || null
      ]
    );
  }
  console.log('Candidatos semeados.');

  // 7. Eventos
  const eventosIniciais = [
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

  for (const ev of eventosIniciais) {
    await dbRun(
      "INSERT INTO eventos (id, titulo, descricao, data, cargaHoraria, qrCodeUrl, presencas) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [ev.id, ev.titulo, ev.descricao, ev.data, ev.cargaHoraria, ev.qrCodeUrl, JSON.stringify(ev.presencas)]
    );
  }
  console.log('Eventos semeados.');

  // 8. CertificadoConfig
  const certificadoConfigInicial = {
    assinante1Nome: 'Dr. Amilton Ramos de Souza',
    assinante1Cargo: 'Diretor Geral do Campus Manaus Centro',
    assinante1Imagem: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_Robert_Mueller.svg',
    assinante2Nome: 'Dra. Sandra Letícia da Silva',
    assinante2Cargo: 'Coordenadora Geral de Pós-Graduação',
    assinante2Imagem: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Signature_of_Alexander_Hamilton.svg',
    textoModelo: 'Certificamos que {NOME_ALUNO} participou com êxito do evento "{NOME_EVENTO}" promovido pela Coordenação de Pós-Graduação do IFAM, realizado no dia {DATA_EVENTO}, totalizando uma carga horária de {CARGA_HORARIA} horas.'
  };

  await dbRun(
    "INSERT INTO certificado_config (id, assinante1Nome, assinante1Cargo, assinante1Imagem, assinante2Nome, assinante2Cargo, assinante2Imagem, textoModelo) VALUES (1, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
    [
      certificadoConfigInicial.assinante1Nome,
      certificadoConfigInicial.assinante1Cargo,
      certificadoConfigInicial.assinante1Imagem,
      certificadoConfigInicial.assinante2Nome,
      certificadoConfigInicial.assinante2Cargo,
      certificadoConfigInicial.assinante2Imagem,
      certificadoConfigInicial.textoModelo
    ]
  );
  console.log('CertificadoConfig semeado.');

  // 9. Sugestoes
  const sugestoesIniciais = [
    { id: 'sug-1', nomeCandidato: 'Thiago Pereira', email: 'thiago.p@gmail.com', areaConhecimento: 'Engenharias e Tecnologia', nomeCurso: 'Mestrado Profissional em Energias Renováveis na Amazônia', data: '18/06/2026' },
    { id: 'sug-2', nomeCandidato: 'Mariana Lima', email: 'mari.lima@yahoo.com', areaConhecimento: 'Ensino de Ciências e Tecnologias', nomeCurso: 'Especialização em IA aplicada à Educação Básica', data: '19/06/2026' }
  ];

  for (const s of sugestoesIniciais) {
    await dbRun(
      "INSERT INTO sugestoes_curso (id, nomeCandidato, email, areaConhecimento, nomeCurso, data) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [s.id, s.nomeCandidato, s.email, s.areaConhecimento, s.nomeCurso, s.data]
    );
  }
  console.log('Sugestões semeadas.');

  // 10. Interesses
  const interessesIniciais = [
    { id: 'int-1', nomeCandidato: 'Patrícia Rocha', email: 'patricia.rocha@gmail.com', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)', data: '19/06/2026' },
    { id: 'int-2', nomeCandidato: 'Bruno Gomes', email: 'bruno.gomes@live.com', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', data: '20/06/2026' }
  ];

  for (const i of interessesIniciais) {
    await dbRun(
      "INSERT INTO interesses_curso (id, nomeCandidato, email, cursoNome, data) VALUES (?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING",
      [i.id, i.nomeCandidato, i.email, i.cursoNome, i.data]
    );
  }
  console.log('Interesses semeados.');

  console.log('Semeadura do banco de dados concluída com sucesso!');
}
