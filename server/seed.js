import db from './db.js';

export function seedDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Cursos & Disciplinas
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

      const disciplinasIniciais = [
        { id: 'd-1', cursoId: 'curso-1', nome: 'Didática das Ciências e Tecnologias', cargaHoraria: 60, professorId: 'prof-1', cronograma: 'Segunda a Sexta: 18h30 - 22h30', notas: {}, frequencias: {} },
        { id: 'd-2', cursoId: 'curso-1', nome: 'Seminário de Trabalho de Conclusão de Curso (TCC)', cargaHoraria: 45, professorId: 'prof-3', cronograma: 'Sábado: 8h - 12h', notas: {}, frequencias: {} },
        { id: 'd-3', cursoId: 'curso-2', nome: 'Pesquisa Aplicada ao Ensino Tecnológico', cargaHoraria: 90, professorId: 'prof-2', cronograma: 'Quarta e Quinta: 14h - 18h', notas: {}, frequencias: {} },
        { id: 'd-4', cursoId: 'curso-2', nome: 'Desenvolvimento de Produtos Educacionais', cargaHoraria: 90, professorId: 'prof-3', cronograma: 'Terça: 8h - 12h, 14h - 18h', notas: {}, frequencias: {} }
      ];

      // Insert Cursos
      const stmtCurso = db.prepare("INSERT OR REPLACE INTO cursos (id, nome, tipo, descricao) VALUES (?, ?, ?, ?)");
      cursosIniciais.forEach(c => {
        stmtCurso.run(c.id, c.nome, c.tipo, c.descricao);
      });
      stmtCurso.finalize();

      // Insert Disciplinas
      const stmtDiscip = db.prepare("INSERT OR REPLACE INTO disciplinas (id, cursoId, nome, cargaHoraria, professorId, cronograma, notas, frequencias) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      disciplinasIniciais.forEach(d => {
        stmtDiscip.run(d.id, d.cursoId, d.nome, d.cargaHoraria, d.professorId, d.cronograma, JSON.stringify(d.notas), JSON.stringify(d.frequencias));
      });
      stmtDiscip.finalize();

      // 2. Editais
      const editaisIniciais = [
        {
          id: 'ed-spec-2026',
          titulo: 'Edital 01/2026 - Especialização em Ensino de Ciências e Tecnologias (CMC)',
          tipo: 'Especialização',
          vagas: 30,
          status: 'Aberto',
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
          status: 'Homologação',
          documentosExigidos: ['Documento de Identidade', 'Diploma ou Declaração de Conclusão', 'Currículo Lattes', 'Projeto de Pesquisa'],
          barema: [
            { item: 'Projeto de Pesquisa alinhado com Linha de Ensino', pontuacaoMaxima: 40, obrigatorio: true },
            { item: 'Currículo Lattes (Artigos, Eventos e Livros)', pontuacaoMaxima: 35, obrigatorio: false },
            { item: 'Experiência Profissional em Educação ou Tecnologia', pontuacaoMaxima: 25, obrigatorio: false }
          ]
        }
      ];

      const stmtEdital = db.prepare("INSERT OR REPLACE INTO editais (id, titulo, tipo, vagas, status, documentosExigidos, barema) VALUES (?, ?, ?, ?, ?, ?, ?)");
      editaisIniciais.forEach(e => {
        stmtEdital.run(e.id, e.titulo, e.tipo, e.vagas, e.status, JSON.stringify(e.documentosExigidos), JSON.stringify(e.barema));
      });
      stmtEdital.finalize();

      // 3. Professores
      const professoresIniciais = [
        { id: 'prof-1', nome: 'Dra. Maria Vasconcelos', email: 'maria.vasconcelos@ifam.edu.br', siape: '1029384', areaAtuacao: 'Ensino de Ciências' },
        { id: 'prof-2', nome: 'Dr. Carlos Souza', email: 'carlos.souza@ifam.edu.br', siape: '9283741', areaAtuacao: 'Biotecnologia e Educação' },
        { id: 'prof-3', nome: 'Dr. Roberto Oliveira', email: 'roberto.oliveira@ifam.edu.br', siape: '8837462', areaAtuacao: 'Desenvolvimento Tecnológico' }
      ];

      // Insert Professors
      const stmtProfExact = db.prepare("INSERT OR REPLACE INTO professores (id, nome, email, titulacao, areaAtuacao) VALUES (?, ?, ?, ?, ?)");
      professoresIniciais.forEach(p => {
        stmtProfExact.run(p.id, p.nome, p.email, 'Doutorado', p.areaAtuacao);
      });
      stmtProfExact.finalize();

      // 4. Alunos
      const alunosIniciais = [
        { id: 'aluno-1', nome: 'Otávio Rangel Costa', email: 'otavio.rangel@gmail.com', matricula: 'IFAM2026001', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', status: 'Ativo' },
        { id: 'aluno-2', nome: 'Fernanda Lima Silva', email: 'fernanda.lima@gmail.com', matricula: 'IFAM2026002', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', status: 'Ativo' },
        { id: 'aluno-3', nome: 'Ricardo Mendes Souza', email: 'ricardo.mendes@gmail.com', matricula: 'IFAM2025102', cursoId: 'curso-2', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)', status: 'Ativo' }
      ];

      const stmtAlunos = db.prepare("INSERT OR REPLACE INTO alunos (id, nome, email, matricula, cursoId, cursoNome, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
      alunosIniciais.forEach(a => {
        stmtAlunos.run(a.id, a.nome, a.email, a.matricula, a.cursoId, a.cursoNome, a.status);
      });
      stmtAlunos.finalize();

      // 5. Candidatos
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
          recursoResposta: ''
        }
      ];

      const stmtCand = db.prepare("INSERT OR REPLACE INTO candidatos (id, editalId, editalTitulo, nome, email, cpf, cota, documentos, pontuacaoBarema, status, recursoDescricao, recursoStatus, recursoResposta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      candidatosIniciais.forEach(c => {
        stmtCand.run(c.id, c.editalId, c.editalTitulo, c.nome, c.email, c.cpf, c.cota, JSON.stringify(c.documentos), JSON.stringify(c.pontuacaoBarema), c.status, c.recursoDescricao || null, c.recursoStatus || null, c.recursoResposta || null);
      });
      stmtCand.finalize();

      // 6. Eventos
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

      const stmtEvent = db.prepare("INSERT OR REPLACE INTO eventos (id, titulo, descricao, data, cargaHoraria, qrCodeUrl, presencas) VALUES (?, ?, ?, ?, ?, ?, ?)");
      eventosIniciais.forEach(ev => {
        stmtEvent.run(ev.id, ev.titulo, ev.descricao, ev.data, ev.cargaHoraria, ev.qrCodeUrl, JSON.stringify(ev.presencas));
      });
      stmtEvent.finalize();

      // 7. CertificadoConfig
      const certificadoConfigInicial = {
        assinante1Nome: 'Dr. Amilton Ramos de Souza',
        assinante1Cargo: 'Diretor Geral do Campus Manaus Centro',
        assinante1Imagem: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_Robert_Mueller.svg',
        assinante2Nome: 'Dra. Sandra Letícia da Silva',
        assinante2Cargo: 'Coordenadora Geral de Pós-Graduação',
        assinante2Imagem: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Signature_of_Alexander_Hamilton.svg',
        textoModelo: 'Certificamos que {NOME_ALUNO} participou com êxito do evento "{NOME_EVENTO}" promovido pela Coordenação de Pós-Graduação do IFAM, realizado no dia {DATA_EVENTO}, totalizando uma carga horária de {CARGA_HORARIA} horas.'
      };

      const stmtCert = db.prepare("INSERT OR REPLACE INTO certificado_config (id, assinante1Nome, assinante1Cargo, assinante1Imagem, assinante2Nome, assinante2Cargo, assinante2Imagem, textoModelo) VALUES (1, ?, ?, ?, ?, ?, ?, ?)");
      stmtCert.run(
        certificadoConfigInicial.assinante1Nome,
        certificadoConfigInicial.assinante1Cargo,
        certificadoConfigInicial.assinante1Imagem,
        certificadoConfigInicial.assinante2Nome,
        certificadoConfigInicial.assinante2Cargo,
        certificadoConfigInicial.assinante2Imagem,
        certificadoConfigInicial.textoModelo
      );
      stmtCert.finalize();

      // 8. Sugestoes
      const sugestoesIniciais = [
        { id: 'sug-1', nomeCandidato: 'Thiago Pereira', email: 'thiago.p@gmail.com', areaConhecimento: 'Engenharias e Tecnologia', nomeCurso: 'Mestrado Profissional em Energias Renováveis na Amazônia', data: '18/06/2026' },
        { id: 'sug-2', nomeCandidato: 'Mariana Lima', email: 'mari.lima@yahoo.com', areaConhecimento: 'Ensino de Ciências e Tecnologias', nomeCurso: 'Especialização em IA aplicada à Educação Básica', data: '19/06/2026' }
      ];

      const stmtSug = db.prepare("INSERT OR REPLACE INTO sugestoes_curso (id, nomeCandidato, email, areaConhecimento, nomeCurso, data) VALUES (?, ?, ?, ?, ?, ?)");
      sugestoesIniciais.forEach(s => {
        stmtSug.run(s.id, s.nomeCandidato, s.email, s.areaConhecimento, s.nomeCurso, s.data);
      });
      stmtSug.finalize();

      // 9. Interesses
      const interessesIniciais = [
        { id: 'int-1', nomeCandidato: 'Patrícia Rocha', email: 'patricia.rocha@gmail.com', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)', data: '19/06/2026' },
        { id: 'int-2', nomeCandidato: 'Bruno Gomes', email: 'bruno.gomes@live.com', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias', data: '20/06/2026' }
      ];

      const stmtInt = db.prepare("INSERT OR REPLACE INTO interesses_curso (id, nomeCandidato, email, cursoNome, data) VALUES (?, ?, ?, ?, ?)");
      interessesIniciais.forEach(i => {
        stmtInt.run(i.id, i.nomeCandidato, i.email, i.cursoNome, i.data);
      });
      stmtInt.finalize();

      console.log('Dados iniciais inseridos com sucesso no SQLite!');
      resolve();
    });
  });
}
