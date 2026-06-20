import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  Users, 
  Award, 
  QrCode, 
  CheckCircle, 
  Upload, 
  Plus, 
  Download, 
  Send, 
  Eye, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Mail,
  AlertTriangle
} from 'lucide-react';
import type { 
  Edital, 
  Candidato, 
  CursoExistente, 
  Disciplina, 
  Evento, 
  CertificadoConfig, 
  SugestaoCurso, 
  InteresseCurso, 
  Professor, 
  Aluno
} from './mockData';
import { 
  bibliotecaCursosPorArea, 
  cursosIniciais, 
  editaisIniciais, 
  professoresIniciais, 
  alunosIniciais, 
  candidatosIniciais, 
  eventosIniciais, 
  certificadoConfigInicial, 
  sugestoesIniciais, 
  interessesIniciais
} from './mockData';


export default function App() {
  // Global State (In-Memory Database)
  const [editais, setEditais] = useState<Edital[]>(editaisIniciais);
  const [candidatos, setCandidatos] = useState<Candidato[]>(candidatosIniciais);
  const [cursos, setCursos] = useState<CursoExistente[]>(cursosIniciais);
  const [professores] = useState<Professor[]>(professoresIniciais);
  const [alunos] = useState<Aluno[]>(alunosIniciais);
  const [eventos, setEventos] = useState<Evento[]>(eventosIniciais);
  const [certificadoConfig] = useState<CertificadoConfig>(certificadoConfigInicial);
  const [sugestoes, setSugestoes] = useState<SugestaoCurso[]>(sugestoesIniciais);
  const [interesses, setInteresses] = useState<InteresseCurso[]>(interessesIniciais);

  // Active Role and Navigation state
  // Roles: 'publico' | 'candidato' | 'admin' | 'coordenador' | 'professor' | 'aluno' | 'dossie-externo'
  const [currentRole, setCurrentRole] = useState<'publico' | 'candidato' | 'admin' | 'coordenador' | 'professor' | 'aluno' | 'dossie-externo'>('publico');
  const [darkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  
  // Selection States
  const [selectedStudentId, setSelectedStudentId] = useState<string>('aluno-1');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('prof-1');
  const [, setSelectedCandidatoId] = useState<string>('cand-1');
  const [dossierExternalToken, setDossierExternalToken] = useState<string>('');
  const [dossierStudentId, setDossierStudentId] = useState<string>('aluno-1');

  // Admin & Course Coordinators States
  const [selectedCursoForCoordenador, setSelectedCursoForCoordenador] = useState<string>('curso-1');
  const [coordenadores, setCoordenadores] = useState<{ id: string; nome: string; email: string; cursoId: string; cursoNome: string }[]>([
    { id: 'coord-1', nome: 'Dra. Sandra Letícia da Silva', email: 'sandra.leticia@ifam.edu.br', cursoId: 'curso-1', cursoNome: 'Especialização em Ensino de Ciências e Tecnologias' },
    { id: 'coord-2', nome: 'Dr. Roberto Oliveira', email: 'roberto.oliveira@ifam.edu.br', cursoId: 'curso-2', cursoNome: 'Mestrado Profissional em Ensino Tecnológico (PPGET)' }
  ]);
  const [newCoordNome, setNewCoordNome] = useState('');
  const [newCoordEmail, setNewCoordEmail] = useState('');
  const [newCoordCursoId, setNewCoordCursoId] = useState('curso-1');

  // New Course Registration States
  const [newCourseNome, setNewCourseNome] = useState('');
  const [newCourseTipo, setNewCourseTipo] = useState<'Especialização' | 'Mestrado' | 'Doutorado'>('Especialização');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [courseAddSuccess, setCourseAddSuccess] = useState(false);

  // Input States for Suggesting/Manifesting
  const [sugNome, setSugNome] = useState('');
  const [sugEmail, setSugEmail] = useState('');
  const [sugArea, setSugArea] = useState('Ensino de Ciências e Tecnologias');
  const [sugCursoSelect, setSugCursoSelect] = useState(bibliotecaCursosPorArea['Ensino de Ciências e Tecnologias'][0]);
  const [sugCursoCustom, setSugCursoCustom] = useState('');
  const [sugSucesso, setSugSucesso] = useState(false);

  const [intNome, setIntNome] = useState('');
  const [intEmail, setIntEmail] = useState('');
  const [intCurso, setIntCurso] = useState(cursosIniciais[0].nome);
  const [intSucesso, setIntSucesso] = useState(false);

  // Candidate Actions States
  const [candInscricaoEdital, setCandInscricaoEdital] = useState<string>('ed-spec-2026');
  const [candNome, setCandNome] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candCpf, setCandCpf] = useState('');
  const [candCota, setCandCota] = useState<'Ampla Concorrência' | 'Ações Afirmativas' | 'Pessoa com Deficiência (PcD)'>('Ampla Concorrência');
  const [candDocs, setCandDocs] = useState<{ [key: string]: string }>({});
  const [candSuccessMsg, setCandSuccessMsg] = useState(false);

  // Recurso States
  const [selectedCandForRecurso, setSelectedCandForRecurso] = useState<string>('cand-2');
  const [recursoDescricao, setRecursoDescricao] = useState('');
  const [recursoSuccessMsg, setRecursoSuccessMsg] = useState(false);

  // Coordinator Forms
  const [newEditalTitulo, setNewEditalTitulo] = useState('');
  const [newEditalTipo, setNewEditalTipo] = useState<'Especialização' | 'Mestrado' | 'Doutorado'>('Especialização');
  const [newEditalVagas, setNewEditalVagas] = useState(25);
  const [newEditalDocs, setNewEditalDocs] = useState<string[]>(['RG e CPF', 'Diploma de Graduação']);
  const [newEditalBarema, setNewEditalBarema] = useState<{ item: string; pontuacaoMaxima: number; obrigatorio: boolean }[]>([
    { item: 'Carta de Intenção', pontuacaoMaxima: 50, obrigatorio: true }
  ]);
  const [showNewEditalModal, setShowNewEditalModal] = useState(false);

  // Requisito Biblioteca para configurar no Edital
  const [customRequisitoItem, setCustomRequisitoItem] = useState('');
  const [customRequisitoPontos, setCustomRequisitoPontos] = useState(10);
  const [customRequisitoObrigatorio, setCustomRequisitoObrigatorio] = useState(false);

  // Alocação Professor
  const [allocCursoId, setAllocCursoId] = useState('curso-1');
  const [allocDiscipId, setAllocDiscipId] = useState('d-1');
  const [allocProfId, setAllocProfId] = useState('prof-1');
  const [allocSuccessMsg, setAllocSuccessMsg] = useState(false);

  // Ementa & Cronograma Forms
  const [ementaCursoId, setEmentaCursoId] = useState('curso-1');
  const [ementaNome, setEmentaNome] = useState('');
  const [ementaDesc, setEmentaDesc] = useState('');
  const [ementaCH, setEmentaCH] = useState(60);
  const [ementaCrono, setEmentaCrono] = useState('Segunda e Quarta: 18h30 - 22h30');
  const [ementaSuccess, setEmentaSuccess] = useState(false);

  // Judge Recurso modal
  const [judgingRecursoCandId, setJudgingRecursoCandId] = useState<string | null>(null);
  const [recursoDecisao, setRecursoDecisao] = useState<'Deferido' | 'Indeferido'>('Deferido');
  const [recursoRespostaText, setRecursoRespostaText] = useState('');

  // Rejeição Documento modal
  const [rejectingDocCandId, setRejectingDocCandId] = useState<string | null>(null);
  const [rejectingDocKey, setRejectingDocKey] = useState<string | null>(null);
  const [rejectMotivo, setRejectMotivo] = useState('');

  // Teacher actions
  const [teacherSelectedDiscip, setTeacherSelectedDiscip] = useState('d-1');
  const [gradesInput, setGradesInput] = useState<{ [alunoId: string]: number }>({});
  const [freqInput, setFreqInput] = useState<{ [alunoId: string]: number }>({});
  const [teacherSaveSuccess, setTeacherSaveSuccess] = useState(false);

  // Certificate Modal / View
  const [showingCertificate, setShowingCertificate] = useState<{ aluno: Aluno; evento: Evento } | null>(null);

  // Secure Dossiê Link Shared States
  const [generatedSecureLink, setGeneratedSecureLink] = useState('');

  // CSV Import States
  const [csvText, setCsvText] = useState('');
  const [csvImportType, setCsvImportType] = useState<'sugestoes' | 'candidatos'>('sugestoes');
  const [csvImportSuccess, setCsvImportSuccess] = useState(false);

  // Handle dark mode class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Sync activeTab with window URL hash for dynamic navigation highlighting
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#programas') setActiveTab('cursos');
      else if (hash === '#editais') setActiveTab('editais');
      else if (hash === '#eventos') setActiveTab('eventos');
      else if (hash === '#sobre') setActiveTab('sobre');
      else if (hash === '#contato') setActiveTab('contato');
      else setActiveTab('inicio');
    };
    handleHashChange(); // Run once on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update possibles courses when suggesting area changes
  useEffect(() => {
    const courses = bibliotecaCursosPorArea[sugArea];
    if (courses && courses.length > 0) {
      setSugCursoSelect(courses[0]);
    }
  }, [sugArea]);

  // Populate input values for grades when teacher selects discipline
  useEffect(() => {
    const discip = findDisciplina(teacherSelectedDiscip);
    if (discip) {
      const g: { [alunoId: string]: number } = {};
      const f: { [alunoId: string]: number } = {};
      alunos.forEach(a => {
        g[a.id] = discip.notas[a.id] !== undefined ? discip.notas[a.id] : 0;
        f[a.id] = discip.frequencias[a.id] !== undefined ? discip.frequencias[a.id] : 100;
      });
      setGradesInput(g);
      setFreqInput(f);
    }
  }, [teacherSelectedDiscip, currentRole]);

  // Helper search functions
  const findDisciplina = (id: string): Disciplina | undefined => {
    for (const c of cursos) {
      const d = c.disciplinas.find(dis => dis.id === id);
      if (d) return d;
    }
    return undefined;
  };

  // Submit Suggestion of Course
  const handleSugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugNome || !sugEmail) return;
    const finalCourseName = sugCursoCustom || sugCursoSelect;
    const newSug: SugestaoCurso = {
      id: 'sug-' + (sugestoes.length + 1),
      nomeCandidato: sugNome,
      email: sugEmail,
      areaConhecimento: sugArea,
      nomeCurso: finalCourseName,
      data: new Date().toLocaleDateString('pt-BR')
    };
    setSugestoes([newSug, ...sugestoes]);
    setSugNome('');
    setSugEmail('');
    setSugCursoCustom('');
    setSugSucesso(true);
    setTimeout(() => setSugSucesso(false), 5000);
  };

  // Submit Manifestation of Interest
  const handleIntSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intNome || !intEmail) return;
    const newInt: InteresseCurso = {
      id: 'int-' + (interesses.length + 1),
      nomeCandidato: intNome,
      email: intEmail,
      cursoNome: intCurso,
      data: new Date().toLocaleDateString('pt-BR')
    };
    setInteresses([newInt, ...interesses]);
    setIntNome('');
    setIntEmail('');
    setIntSucesso(true);
    setTimeout(() => setIntSucesso(false), 5000);
  };

  // Submit candidacy
  const handleCandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candNome || !candEmail || !candCpf) return;
    const edital = editais.find(ed => ed.id === candInscricaoEdital);
    if (!edital) return;

    const initialDocs: { [key: string]: { nomeArquivo: string; status: 'Pendente' | 'Aprovado' | 'Recusado' } } = {};
    edital.documentosExigidos.forEach(docName => {
      initialDocs[docName] = {
        nomeArquivo: candDocs[docName] || `${docName.toLowerCase().replace(/\s+/g, '_')}_upload.pdf`,
        status: 'Pendente'
      };
    });

    const initialBaremaPoints: { [key: string]: number } = {};
    edital.barema.forEach(b => {
      initialBaremaPoints[b.item] = 0;
    });

    const newCand: Candidato = {
      id: 'cand-' + (candidatos.length + 1),
      editalId: candInscricaoEdital,
      editalTitulo: edital.titulo,
      nome: candNome,
      email: candEmail,
      cpf: candCpf,
      cota: candCota,
      documentos: initialDocs,
      pontuacaoBarema: initialBaremaPoints,
      status: 'Inscrito'
    };

    setCandidatos([newCand, ...candidatos]);
    setSelectedCandidatoId(newCand.id);
    setCandNome('');
    setCandEmail('');
    setCandCpf('');
    setCandDocs({});
    setCandSuccessMsg(true);
    setTimeout(() => setCandSuccessMsg(false), 5000);
  };

  // Submit appeal (recurso)
  const handleRecursoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recursoDescricao) return;

    setCandidatos(candidatos.map(cand => {
      if (cand.id === selectedCandForRecurso) {
        return {
          ...cand,
          status: 'Aguardando Recurso',
          recurso: {
            descricao: recursoDescricao,
            status: 'Pendente',
            dataEnvio: new Date().toLocaleDateString('pt-BR')
          }
        };
      }
      return cand;
    }));

    setRecursoDescricao('');
    setRecursoSuccessMsg(true);
    setTimeout(() => setRecursoSuccessMsg(false), 5000);
  };

  // Add item to barema draft inside coordinator
  const addBaremaItemDraft = () => {
    if (!customRequisitoItem) return;
    setNewEditalBarema([
      ...newEditalBarema,
      { item: customRequisitoItem, pontuacaoMaxima: customRequisitoPontos, obrigatorio: customRequisitoObrigatorio }
    ]);
    setCustomRequisitoItem('');
    setCustomRequisitoPontos(10);
    setCustomRequisitoObrigatorio(false);
  };

  // Create new course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseNome.trim() || !newCourseDesc.trim()) return;

    const newCurso: CursoExistente = {
      id: 'curso-' + (cursos.length + 1),
      nome: newCourseNome,
      tipo: newCourseTipo,
      descricao: newCourseDesc,
      disciplinas: []
    };

    setCursos([...cursos, newCurso]);
    setNewCourseNome('');
    setNewCourseDesc('');
    setCourseAddSuccess(true);
    setTimeout(() => setCourseAddSuccess(false), 4000);
  };

  // Create new edital
  const handleCreateEdital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEditalTitulo) return;

    const newEd: Edital = {
      id: 'ed-' + (editais.length + 1),
      titulo: newEditalTitulo,
      tipo: newEditalTipo,
      vagas: newEditalVagas,
      vagasAmpla: Math.round(newEditalVagas * 0.8),
      vagasAfirmativas: Math.round(newEditalVagas * 0.15),
      vagasPcd: Math.round(newEditalVagas * 0.05),
      status: 'Aberto',
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      dataFim: '30 dias',
      documentosExigidos: newEditalDocs,
      barema: newEditalBarema
    };

    setEditais([...editais, newEd]);
    setNewEditalTitulo('');
    setNewEditalBarema([{ item: 'Carta de Intenção', pontuacaoMaxima: 50, obrigatorio: true }]);
    setShowNewEditalModal(false);
  };

  // Allocate Professor to Discipline
  const handleAllocateProf = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = professores.find(p => p.id === allocProfId);
    if (!prof) return;

    setCursos(cursos.map(c => {
      if (c.id === allocCursoId) {
        return {
          ...c,
          disciplinas: c.disciplinas.map(d => {
            if (d.id === allocDiscipId) {
              return { ...d, professorId: prof.id, professorNome: prof.nome };
            }
            return d;
          })
        };
      }
      return c;
    }));

    setAllocSuccessMsg(true);
    setTimeout(() => setAllocSuccessMsg(false), 4000);
  };

  // Add new discipline syllabus
  const handleCreateEmenta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ementaNome || !ementaDesc) return;

    const newD: Disciplina = {
      id: 'd-' + (Math.random() * 1000).toFixed(0),
      nome: ementaNome,
      ementa: ementaDesc,
      cargaHoraria: ementaCH,
      cronograma: ementaCrono,
      notas: {},
      frequencias: {}
    };

    setCursos(cursos.map(c => {
      if (c.id === ementaCursoId) {
        return { ...c, disciplinas: [...c.disciplinas, newD] };
      }
      return c;
    }));

    setEmentaNome('');
    setEmentaDesc('');
    setEmentaSuccess(true);
    setTimeout(() => setEmentaSuccess(false), 4000);
  };

  // Reject a document
  const triggerRejectDoc = (candId: string, docKey: string) => {
    setRejectingDocCandId(candId);
    setRejectingDocKey(docKey);
    setRejectMotivo('');
  };

  const handleConfirmRejectDoc = () => {
    if (!rejectingDocCandId || !rejectingDocKey) return;
    setCandidatos(candidatos.map(c => {
      if (c.id === rejectingDocCandId) {
        return {
          ...c,
          documentos: {
            ...c.documentos,
            [rejectingDocKey]: {
              ...c.documentos[rejectingDocKey],
              status: 'Recusado',
              motivoRecusa: rejectMotivo || 'Documento incorreto ou fora dos padrões solicitados'
            }
          },
          status: 'Indeferido'
        };
      }
      return c;
    }));
    setRejectingDocCandId(null);
    setRejectingDocKey(null);
  };

  // Approve a document
  const approveDoc = (candId: string, docKey: string) => {
    setCandidatos(candidatos.map(c => {
      if (c.id === candId) {
        const updatedDocs = {
          ...c.documentos,
          [docKey]: {
            ...c.documentos[docKey],
            status: 'Aprovado' as const,
            motivoRecusa: undefined
          }
        };
        // Check if all approved
        const allApproved = Object.values(updatedDocs).every(d => d.status === 'Aprovado');
        return {
          ...c,
          documentos: updatedDocs,
          status: allApproved ? 'Homologado' : c.status
        };
      }
      return c;
    }));
  };

  // Judge Recurso (Appeal)
  const triggerJudgeRecurso = (candId: string) => {
    setJudgingRecursoCandId(candId);
    setRecursoDecisao('Deferido');
    setRecursoRespostaText('');
  };

  const handleConfirmJudgeRecurso = () => {
    if (!judgingRecursoCandId) return;

    setCandidatos(candidatos.map(c => {
      if (c.id === judgingRecursoCandId) {
        const isDeferido = recursoDecisao === 'Deferido';
        const updatedDocs = { ...c.documentos };
        
        // If deferido, mark all rejected docs as approved
        if (isDeferido) {
          Object.keys(updatedDocs).forEach(k => {
            if (updatedDocs[k].status === 'Recusado') {
              updatedDocs[k].status = 'Aprovado';
              updatedDocs[k].motivoRecusa = undefined;
            }
          });
        }

        return {
          ...c,
          documentos: updatedDocs,
          status: isDeferido ? 'Homologado' : 'Indeferido',
          recurso: c.recurso ? {
            ...c.recurso,
            status: recursoDecisao,
            respostaCoordenador: recursoRespostaText || `Recurso analisado e ${recursoDecisao.toLowerCase()} pela comissão.`
          } : undefined
        };
      }
      return c;
    }));

    setJudgingRecursoCandId(null);
  };

  // Launch barema scores for candidate
  const setCandidateBaremaScore = (candId: string, itemKey: string, score: number) => {
    setCandidatos(candidatos.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          pontuacaoBarema: {
            ...c.pontuacaoBarema,
            [itemKey]: score
          }
        };
      }
      return c;
    }));
  };

  // Teacher save grades and frequency
  const handleTeacherSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCursos(cursos.map(c => {
      return {
        ...c,
        disciplinas: c.disciplinas.map(d => {
          if (d.id === teacherSelectedDiscip) {
            return {
              ...d,
              notas: { ...d.notas, ...gradesInput },
              frequencias: { ...d.frequencias, ...freqInput }
            };
          }
          return d;
        })
      };
    }));
    setTeacherSaveSuccess(true);
    setTimeout(() => setTeacherSaveSuccess(false), 3000);
  };

  // Generate secure public dossier link
  const handleGenerateDossierLink = (alunoId: string) => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = `/dossie-externo/${alunoId}?token=${token}`;
    setGeneratedSecureLink(link);
    setDossierStudentId(alunoId);
    setDossierExternalToken(token);
  };

  // Import mock CSV data
  const handleImportCSV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText) return;

    try {
      const lines = csvText.split('\n');
      if (csvImportType === 'sugestoes') {
        const newSugs: SugestaoCurso[] = [];
        lines.forEach((line, i) => {
          if (i === 0) return; // skip header
          const parts = line.split(',');
          if (parts.length >= 3) {
            newSugs.push({
              id: 'sug-csv-' + i + '-' + Math.random().toFixed(0),
              nomeCandidato: parts[0].trim(),
              email: parts[1].trim(),
              areaConhecimento: 'Engenharias e Tecnologia',
              nomeCurso: parts[2].trim(),
              data: new Date().toLocaleDateString('pt-BR')
            });
          }
        });
        setSugestoes([...newSugs, ...sugestoes]);
      } else {
        const newCands: Candidato[] = [];
        lines.forEach((line, i) => {
          if (i === 0) return; // skip header
          const parts = line.split(',');
          if (parts.length >= 4) {
            newCands.push({
              id: 'cand-csv-' + i,
              editalId: 'ed-spec-2026',
              editalTitulo: 'Edital 01/2026 - Especialização em Ensino de Ciências e Tecnologias (CMC)',
              nome: parts[0].trim(),
              email: parts[1].trim(),
              cpf: parts[2].trim(),
              cota: 'Ampla Concorrência',
              documentos: {
                'RG e CPF': { nomeArquivo: 'csv_upload.pdf', status: 'Aprovado' },
                'Diploma de Graduação': { nomeArquivo: 'csv_diploma.pdf', status: 'Aprovado' }
              },
              pontuacaoBarema: {},
              status: 'Homologado'
            });
          }
        });
        setCandidatos([...newCands, ...candidatos]);
      }
      setCsvText('');
      setCsvImportSuccess(true);
      setTimeout(() => setCsvImportSuccess(false), 4000);
    } catch (err) {
      alert('Erro ao processar CSV. Verifique o formato.');
    }
  };

  // Helper calculation of final scores
  const getCandidateTotalScore = (c: Candidato) => {
    return Object.values(c.pontuacaoBarema).reduce((acc, curr) => acc + curr, 0);
  };

  const activeStudent = alunos.find(a => a.id === selectedStudentId);

  return (
    <div className="app-container">
      <header className="fixed-header">
        {/* Left: Logo Group */}
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-lg tracking-tight">SouPós IFAM</span>
          <span className="badge badge-success btn-sm ml-2 hidden sm:inline-flex">Live Dev</span>
        </div>
        
        {/* Center: Public Navigation Menu (Stretched & Spaced with neon/shadow pills) */}
        {currentRole === 'publico' && (
          <nav className="header-nav-menu">
            <a href="#" className={`nav-pill ${activeTab === 'inicio' ? 'active' : ''}`}>Início</a>
            <a href="#programas" className={`nav-pill ${activeTab === 'cursos' ? 'active' : ''}`}>Cursos</a>
            <a href="#editais" className={`nav-pill nav-pill-editais ${activeTab === 'editais' ? 'active' : ''}`}>Editais</a>
            <a href="#eventos" className={`nav-pill nav-pill-eventos ${activeTab === 'eventos' ? 'active' : ''}`}>Eventos</a>
            <a href="#sobre" className={`nav-pill nav-pill-sobre ${activeTab === 'sobre' ? 'active' : ''}`}>Sobre o IFAM</a>
            <a href="#contato" className={`nav-pill nav-pill-contato ${activeTab === 'contato' ? 'active' : ''}`}>Contato</a>
          </nav>
        )}
        
        {/* Right: Actions / Profile Group */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-bg-app border border-border py-1 px-3 rounded-full text-xs font-semibold shadow-sm">
            <span className="text-text-muted">Perfil:</span>
            <select 
              value={currentRole} 
              onChange={(e) => {
                const val = e.target.value as any;
                setCurrentRole(val);
              }}
              className="bg-transparent text-primary font-bold border-none outline-none cursor-pointer"
            >
              <option value="publico" className="bg-white text-text-primary">Portal Público (Home)</option>
              <option value="candidato" className="bg-white text-text-primary">Portal do Candidato</option>
              <option value="admin" className="bg-white text-text-primary">Admin</option>
              <option value="coordenador" className="bg-white text-text-primary">Coordenador de Curso</option>
              <option value="professor" className="bg-white text-text-primary">Professor</option>
              <option value="aluno" className="bg-white text-text-primary">Portal do Aluno</option>
              {generatedSecureLink && <option value="dossie-externo" className="bg-white text-text-primary">Auditoria Externa (Link)</option>}
            </select>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col">
        
        {/* -------------------- 1. PORTAL PÚBLICO (HOME PAGE) -------------------- */}
        {currentRole === 'publico' && (
          <div className="fade-in">

            {/* ═══ HERO SECTION - Full bleed, image-backed, premium ═══ */}
            <div className="home-hero">
              <div className="home-hero__overlay" />
              <div className="home-hero__content container max-w-6xl">
                <div className="home-hero__badge">
                  <Sparkles className="h-4 w-4" />
                  Instituto Federal do Amazonas — Campus Manaus Centro
                </div>
                <h1 className="home-hero__title">
                  Transforme sua<br />
                  <span className="home-hero__title--accent">Carreira Profissional</span><br />
                  com a Pós-Graduação IFAM
                </h1>
                <p className="home-hero__subtitle">
                  Especializações, Mestrados e Doutorados 100% gratuitos na maior instituição 
                  tecnológica da Amazônia. Mais de 85% do corpo docente com doutorado, 
                  infraestrutura de pesquisa e certificados reconhecidos pelo MEC.
                </p>
                <div className="home-hero__ctas">
                  <button
                    onClick={() => setCurrentRole('candidato')}
                    className="home-hero__cta-primary"
                  >
                    Quero me Inscrever <ArrowRight className="h-5 w-5" />
                  </button>
                  <a href="#programas" className="home-hero__cta-secondary">
                    Conheça os Programas
                  </a>
                </div>
              </div>

              {/* Floating stat chips */}
              <div className="home-hero__stats">
                <div className="home-hero__stat">
                  <span className="home-hero__stat-num">+2.000</span>
                  <span className="home-hero__stat-label">Egressos Formados</span>
                </div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat">
                  <span className="home-hero__stat-num">20+</span>
                  <span className="home-hero__stat-label">Cursos Ativos</span>
                </div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat">
                  <span className="home-hero__stat-num">100%</span>
                  <span className="home-hero__stat-label">Gratuito e Federal</span>
                </div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat">
                  <span className="home-hero__stat-num">CAPES</span>
                  <span className="home-hero__stat-label">Programas Avaliados</span>
                </div>
              </div>
            </div>

            {/* ═══ TRUST BAR ═══ */}
            <div className="home-trust-bar">
              <div className="container max-w-6xl">
                <p className="home-trust-bar__label">Reconhecido e apoiado por:</p>
                <div className="home-trust-bar__logos">
                  {['MEC', 'CAPES', 'CNPq', 'FAPEAM', 'SUFRAMA', 'Polo de Inovação', 'UFAM', 'UEA'].map(org => (
                    <span key={org} className="home-trust-bar__logo-chip">{org}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ PROGRAM CATEGORIES ═══ */}
            <div id="programas" className="home-programs">
              <div className="container max-w-6xl">
                <div className="home-section-header">
                  <span className="home-section-header__tag">Níveis Acadêmicos</span>
                  <h2 className="home-section-header__title">Escolha seu nível de formação</h2>
                  <p className="home-section-header__subtitle">
                    Do aprimoramento profissional à pesquisa de alto impacto, o IFAM Campus Manaus Centro 
                    oferece programas para cada etapa da sua trajetória acadêmica.
                  </p>
                </div>
                <div className="home-programs__grid">
                  <div className="home-program-card home-program-card--green">
                    <div className="home-program-card__icon-wrap">
                      <Award className="h-8 w-8" />
                    </div>
                    <span className="home-program-card__tag">Lato Sensu</span>
                    <h3 className="home-program-card__title">Especialização</h3>
                    <p className="home-program-card__desc">
                      Aprofunde conhecimentos em áreas estratégicas. Cursos de 360h a 420h com foco 
                      em prática profissional e aplicação imediata no mercado de trabalho.
                    </p>
                    <ul className="home-program-card__list">
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Duração: 18 a 24 meses</li>
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Certificado IFAM + MEC</li>
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Aulas presenciais e híbridas</li>
                    </ul>
                    <div className="home-program-card__count">
                      <span>{cursos.filter(c => c.tipo === 'Especialização').length} cursos disponíveis</span>
                    </div>
                  </div>

                  <div className="home-program-card home-program-card--red">
                    <div className="home-program-card__icon-wrap">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <span className="home-program-card__tag">Stricto Sensu</span>
                    <h3 className="home-program-card__title">Mestrado</h3>
                    <p className="home-program-card__desc">
                      Ingresse na pesquisa científica e tecnológica. Programas com conceito CAPES 
                      voltados para inovação e desenvolvimento regional.
                    </p>
                    <ul className="home-program-card__list">
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Duração: 24 a 30 meses</li>
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Bolsas CAPES/CNPq</li>
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Dissertação com banca</li>
                    </ul>
                    <div className="home-program-card__count">
                      <span>{cursos.filter(c => c.tipo === 'Mestrado').length} programas disponíveis</span>
                    </div>
                  </div>

                  <div className="home-program-card home-program-card--dark">
                    <div className="home-program-card__icon-wrap">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <span className="home-program-card__tag">Stricto Sensu</span>
                    <h3 className="home-program-card__title">Doutorado</h3>
                    <p className="home-program-card__desc">
                      Forme-se pesquisador de excelência. Programas interdisciplinares com 
                      colaboração internacional e laboratórios de ponta.
                    </p>
                    <ul className="home-program-card__list">
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Duração: 48 meses</li>
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Intercâmbio internacional</li>
                      <li><CheckCircle className="h-4 w-4 shrink-0" /> Tese original</li>
                    </ul>
                    <div className="home-program-card__count">
                      <span>{cursos.filter(c => c.tipo === 'Doutorado').length} programas disponíveis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ WHY IFAM — Feature strip ═══ */}
            <div id="sobre" className="home-why">
              <div className="container max-w-6xl">
                <div className="home-why__inner">
                  <div className="home-why__text">
                    <span className="home-section-header__tag">Diferenciais</span>
                    <h2 className="home-why__title">O que torna o IFAM uma escolha única</h2>
                    <p className="home-why__desc">
                      Somos a única instituição federal de educação tecnológica do Amazonas com programas 
                      stricto sensu avaliados pela CAPES, inseridos na realidade socioeconômica e ambiental 
                      da maior floresta do mundo.
                    </p>
                    <div className="home-why__features">
                      {[
                        { icon: <Award className="h-5 w-5"/>, title: '100% Gratuito', desc: 'Sem mensalidades, sem taxas — financiado pelo governo federal.' },
                        { icon: <Users className="h-5 w-5"/>, title: 'Corpo Docente PhD', desc: 'Mais de 80% dos professores com título de Doutor.' },
                        { icon: <TrendingUp className="h-5 w-5"/>, title: 'Pesquisa Aplicada', desc: 'Projetos alinhados ao Polo Industrial de Manaus e à Zona Franca.' },
                        { icon: <UserCheck className="h-5 w-5"/>, title: 'Cursos In-Company', desc: 'Formação customizada para empresas via Lei da Informática e PD&I.' },
                      ].map((feat, i) => (
                        <div key={i} className="home-why__feature">
                          <div className="home-why__feature-icon">{feat.icon}</div>
                          <div>
                            <p className="home-why__feature-title">{feat.title}</p>
                            <p className="home-why__feature-desc">{feat.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="home-why__visual">
                    <div className="home-why__stat-card">
                      <div className="home-why__big-stat">
                        <span className="home-why__big-num">98%</span>
                        <span className="home-why__big-label">Taxa de empregabilidade dos egressos</span>
                      </div>
                      <div className="home-why__big-stat">
                        <span className="home-why__big-num">4.8★</span>
                        <span className="home-why__big-label">Avaliação média pelos alunos</span>
                      </div>
                      <div className="home-why__big-stat">
                        <span className="home-why__big-num">30+</span>
                        <span className="home-why__big-label">Anos formando profissionais</span>
                      </div>
                    </div>
                    <div className="home-why__quote">
                      <p className="home-why__quote-text">
                        "O mestrado no IFAM me abriu portas para pesquisa e inovação que eu jamais imaginei 
                        acessar trabalhando no Polo Industrial de Manaus."
                      </p>
                      <p className="home-why__quote-author">— Engenheira Eletricista, Turma PPGET 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ OPEN EDITAIS ═══ */}
            <div id="editais" className="home-editais">
              <div className="container max-w-6xl">
                <div className="home-section-header">
                  <span className="home-section-header__tag">Processos Seletivos</span>
                  <h2 className="home-section-header__title">Editais Abertos</h2>
                  <p className="home-section-header__subtitle">
                    Confira os processos seletivos em andamento e garanta sua vaga na Pós-Graduação do IFAM.
                  </p>
                </div>
                <div className="home-editais__grid">
                  {editais.map(ed => (
                    <div key={ed.id} className={`home-edital-card ${ed.status === 'Aberto' ? 'home-edital-card--open' : ''}`}>
                      <div className="home-edital-card__header">
                        <div className="home-edital-card__badges">
                          <span className="badge badge-info">{ed.tipo}</span>
                          <span className={`badge ${ed.status === 'Aberto' ? 'badge-success' : 'badge-warning'}`}>
                            {ed.status === 'Aberto' ? '● Inscrições Abertas' : 'Homologação'}
                          </span>
                        </div>
                        <span className="home-edital-card__vagas">{ed.vagas} vagas</span>
                      </div>
                      <h3 className="home-edital-card__title">{ed.titulo}</h3>
                      <p className="home-edital-card__period">
                        📅 Período: {ed.dataInicio} — {ed.dataFim}
                      </p>
                      <div className="home-edital-card__docs">
                        <p className="home-edital-card__docs-label">Documentos exigidos:</p>
                        <ul>
                          {ed.documentosExigidos.slice(0,3).map((doc, idx) => (
                            <li key={idx}><ChevronRight className="h-3 w-3 shrink-0" />{doc}</li>
                          ))}
                          {ed.documentosExigidos.length > 3 && (
                            <li className="text-text-muted">+{ed.documentosExigidos.length - 3} mais...</li>
                          )}
                        </ul>
                      </div>
                      <div className="home-edital-card__footer">
                        {ed.status === 'Aberto' ? (
                          <button
                            onClick={() => { setCandInscricaoEdital(ed.id); setCurrentRole('candidato'); }}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                          >
                            Inscrever-se Agora <ArrowRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button className="btn btn-secondary w-full" disabled>Inscrições Encerradas</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ ACADEMIC EVENTS ═══ */}
            <div id="eventos" className="home-eventos py-16 bg-slate-900/5 border-t border-b border-border">
              <div className="container max-w-6xl">
                <div className="home-section-header">
                  <span className="home-section-header__tag">Agenda</span>
                  <h2 className="home-section-header__title">Eventos & Extensão</h2>
                  <p className="home-section-header__subtitle">
                    Fique por dentro dos debates, palestras, colóquios e eventos científicos abertos ao público.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {eventos.map((ev) => (
                    <div key={ev.id} className="card flex flex-col justify-between p-6 bg-white border border-border rounded-xl shadow-md hover:shadow-lg transition-all">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge badge-info text-xs font-semibold py-1 px-3">
                            {ev.cargaHoraria}h de Carga Horária
                          </span>
                          <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Inscrições Abertas
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-primary transition-colors">
                          {ev.titulo}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                          {ev.descricao}
                        </p>
                      </div>
                      
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <div className="text-xs text-text-muted">
                          <span className="block font-semibold text-text-secondary">DATA DO EVENTO</span>
                          <span className="text-sm font-bold text-primary">{ev.data}</span>
                        </div>
                        <button 
                          onClick={() => alert(`Inscrição confirmada no evento: ${ev.titulo}!`)}
                          className="btn btn-primary btn-sm flex items-center gap-1.5"
                        >
                          Garantir Vaga <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ DEMAND FORMS ═══ */}
            <div className="home-forms">
              <div className="container max-w-6xl">
                <div className="home-section-header">
                  <span className="home-section-header__tag">Participe</span>
                  <h2 className="home-section-header__title">Ajude a construir o futuro do IFAM</h2>
                  <p className="home-section-header__subtitle">
                    Indique cursos que deseja ver na oferta ou cadastre seu interesse para receber alertas de novos editais.
                  </p>
                </div>
                <div className="home-forms__grid">
                  {/* FORM 1: SUGERIR NOVO CURSO */}
                  <div className="card home-form-card">
                    <div className="home-form-card__icon-row">
                      <div className="home-form-card__icon-wrap home-form-card__icon-wrap--green">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="home-form-card__title">Indique um Curso</h3>
                        <p className="home-form-card__subtitle">Contribua para a expansão da oferta acadêmica</p>
                      </div>
                    </div>

                    {sugSucesso && (
                      <div className="alert-success-msg">
                        <CheckCircle className="h-4 w-4" /> Obrigado! Sua sugestão foi registrada com sucesso.
                      </div>
                    )}

                    <form onSubmit={handleSugSubmit} className="home-form-card__form">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Nome Completo</label>
                          <input type="text" value={sugNome} onChange={e => setSugNome(e.target.value)} className="form-control" placeholder="Seu nome" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">E-mail</label>
                          <input type="email" value={sugEmail} onChange={e => setSugEmail(e.target.value)} className="form-control" placeholder="nome@email.com" required />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Área do Conhecimento</label>
                          <select value={sugArea} onChange={e => setSugArea(e.target.value)} className="form-control">
                            {Object.keys(bibliotecaCursosPorArea).map(area => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Curso Sugerido</label>
                          <select value={sugCursoSelect} onChange={e => setSugCursoSelect(e.target.value)} className="form-control">
                            {bibliotecaCursosPorArea[sugArea]?.map(cName => (
                              <option key={cName} value={cName}>{cName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Outro Curso (opcional)</label>
                        <input type="text" value={sugCursoCustom} onChange={e => setSugCursoCustom(e.target.value)} className="form-control" placeholder="Nome do curso que você deseja" />
                      </div>
                      <button type="submit" className="btn btn-primary w-full">
                        Enviar Indicação <Send className="h-4 w-4" />
                      </button>
                    </form>

                    <div className="home-form-card__live">
                      <h4 className="home-form-card__live-title">Sugestões Recentes da Comunidade</h4>
                      <div className="home-form-card__live-list">
                        {sugestoes.map((s) => (
                          <div key={s.id} className="home-form-card__live-item">
                            <div>
                              <p className="font-semibold text-text-primary text-xs">{s.nomeCurso}</p>
                              <p className="text-text-muted text-xs">{s.areaConhecimento}</p>
                            </div>
                            <span className="text-text-muted text-xs font-mono">{s.data}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FORM 2: ALERTA DE EDITAIS */}
                  <div className="card home-form-card">
                    <div className="home-form-card__icon-row">
                      <div className="home-form-card__icon-wrap home-form-card__icon-wrap--red">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="home-form-card__title">Alerta de Editais</h3>
                        <p className="home-form-card__subtitle">Seja avisado quando abrir o processo seletivo</p>
                      </div>
                    </div>

                    {intSucesso && (
                      <div className="alert-success-msg">
                        <CheckCircle className="h-4 w-4" /> Registrado! Você será avisado por e-mail quando o edital abrir.
                      </div>
                    )}

                    <form onSubmit={handleIntSubmit} className="home-form-card__form">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Nome Completo</label>
                          <input type="text" value={intNome} onChange={e => setIntNome(e.target.value)} className="form-control" placeholder="Seu nome" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">E-mail</label>
                          <input type="email" value={intEmail} onChange={e => setIntEmail(e.target.value)} className="form-control" placeholder="nome@email.com" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Curso de Interesse</label>
                        <select value={intCurso} onChange={e => setIntCurso(e.target.value)} className="form-control">
                          {cursos.map(c => (
                            <option key={c.id} value={c.nome}>{c.nome} ({c.tipo})</option>
                          ))}
                        </select>
                      </div>
                      <div className="home-form-card__edital-cta">
                        <div className="home-form-card__edital-cta-text">
                          <span>📬</span>
                          <div>
                            <p className="font-semibold text-sm text-text-primary">Receba alertas em primeira mão</p>
                            <p className="text-xs text-text-muted">Você receberá e-mail assim que o edital abrir, com link direto para inscrição.</p>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-secondary w-full mt-2">
                        Ativar Alerta de Edital <Award className="h-4 w-4" />
                      </button>
                    </form>

                    <div className="home-form-card__live">
                      <h4 className="home-form-card__live-title">Interessados Registrados</h4>
                      <div className="home-form-card__live-list">
                        {interesses.map((i) => (
                          <div key={i.id} className="home-form-card__live-item">
                            <div>
                              <p className="font-semibold text-text-primary text-xs">{i.nomeCandidato}</p>
                              <p className="text-text-muted text-xs">Interesse em: {i.cursoNome}</p>
                            </div>
                            <span className="text-text-muted text-xs font-mono">{i.data}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* -------------------- 2. PORTAL DO CANDIDATO -------------------- */}
        {currentRole === 'candidato' && (
          <div className="container max-w-5xl py-8 fade-in">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-heading mb-2">Portal de Candidaturas</h1>
                <p className="text-text-secondary">Faça novas inscrições, envie documentos e acompanhe recursos de processos seletivos do IFAM.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* CADASTRAR INSCRIÇÃO FORM */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card">
                  <h3 className="text-xl font-heading mb-4">Nova Inscrição Online</h3>
                  
                  {candSuccessMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-lg mb-6 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Inscrição realizada com sucesso! Seus documentos foram enviados para homologação.
                    </div>
                  )}

                  <form onSubmit={handleCandSubmit}>
                    <div className="form-group">
                      <label className="form-label">Selecione o Edital</label>
                      <select 
                        value={candInscricaoEdital}
                        onChange={e => setCandInscricaoEdital(e.target.value)}
                        className="form-control"
                      >
                        {editais.filter(ed => ed.status === 'Aberto').map(ed => (
                          <option key={ed.id} value={ed.id}>{ed.titulo}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Nome Completo</label>
                        <input 
                          type="text" 
                          value={candNome}
                          onChange={e => setCandNome(e.target.value)}
                          className="form-control" 
                          placeholder="Digite seu nome" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CPF</label>
                        <input 
                          type="text" 
                          value={candCpf}
                          onChange={e => setCandCpf(e.target.value)}
                          className="form-control" 
                          placeholder="000.000.000-00" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input 
                          type="email" 
                          value={candEmail}
                          onChange={e => setCandEmail(e.target.value)}
                          className="form-control" 
                          placeholder="nome@email.com" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tipo de Cota</label>
                        <select 
                          value={candCota}
                          onChange={e => setCandCota(e.target.value as any)}
                          className="form-control"
                        >
                          <option value="Ampla Concorrência">Ampla Concorrência</option>
                          <option value="Ações Afirmativas">Ações Afirmativas (Pretos, Pardos, Indígenas)</option>
                          <option value="Pessoa com Deficiência (PcD)">Pessoa com Deficiência (PcD)</option>
                        </select>
                      </div>
                    </div>

                    {/* DYNAMIC DOCUMENT UPLOADER */}
                    <div className="mt-6 border-t border-border pt-4">
                      <h4 className="text-sm font-semibold text-text-secondary uppercase mb-4">Envio de Documentos Exigidos (PDF)</h4>
                      <div className="space-y-3">
                        {editais.find(ed => ed.id === candInscricaoEdital)?.documentosExigidos.map((docName, idx) => (
                          <div key={idx} className="flex flex-wrap justify-between items-center p-3 bg-bg-app rounded-lg border border-border text-sm">
                            <span className="font-semibold">{docName}</span>
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                              <input 
                                type="file" 
                                onChange={e => {
                                  const name = e.target.files?.[0]?.name || `${docName}_upload.pdf`;
                                  setCandDocs(prev => ({ ...prev, [docName]: name }));
                                }}
                                className="hidden" 
                                id={`file-upload-${idx}`} 
                              />
                              <label htmlFor={`file-upload-${idx}`} className="btn btn-secondary btn-sm flex items-center gap-1 cursor-pointer">
                                <Upload className="h-3.5 w-3.5" /> Escolher Arquivo
                              </label>
                              <span className="text-xs text-text-muted max-w-[150px] truncate">
                                {candDocs[docName] || 'Nenhum arquivo enviado'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-6">
                      Finalizar Inscrição <CheckCircle className="h-4.5 w-4.5" />
                    </button>
                  </form>
                </div>

                {/* FORM PARA INTERPOSIÇÃO DE RECURSOS */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-accent-amber" />
                    <h3 className="text-xl font-heading">Interpor Recurso Contra Homologação</h3>
                  </div>
                  <p className="text-sm text-text-secondary mb-6">
                    Se você teve algum documento recusado na homologação preliminar, descreva sua justificativa e reenvie a argumentação abaixo para análise da coordenação.
                  </p>

                  {recursoSuccessMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-lg mb-6">
                      Recurso registrado com sucesso! A coordenação revisará a decisão.
                    </div>
                  )}

                  <form onSubmit={handleRecursoSubmit}>
                    <div className="form-group">
                      <label className="form-label">Escolha sua Candidatura (Reprovadas/Pendentes)</label>
                      <select 
                        value={selectedCandForRecurso}
                        onChange={e => setSelectedCandForRecurso(e.target.value)}
                        className="form-control"
                      >
                        {candidatos.map(c => (
                          <option key={c.id} value={c.id}>{c.nome} - {c.editalTitulo} ({c.status})</option>
                        ))}
                      </select>
                    </div>

                    {/* Show current status details */}
                    {(() => {
                      const selectedCand = candidatos.find(c => c.id === selectedCandForRecurso);
                      if (!selectedCand) return null;
                      return (
                        <div className="p-4 bg-bg-app rounded-lg border border-border text-xs mb-4">
                          <p className="font-bold mb-2">Detalhes da Homologação de {selectedCand.nome}:</p>
                          <div className="space-y-1">
                            {Object.entries(selectedCand.documentos).map(([docKey, docVal]) => (
                              <div key={docKey} className="flex justify-between items-center">
                                <span>{docKey}:</span>
                                <span className={`font-semibold ${docVal.status === 'Aprovado' ? 'text-emerald-500' : docVal.status === 'Recusado' ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                                  {docVal.status}
                                </span>
                              </div>
                            ))}
                          </div>
                          {selectedCand.status === 'Indeferido' && (
                            <div className="mt-3 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded">
                              <p className="font-bold">Motivos de Recusa:</p>
                              {Object.entries(selectedCand.documentos)
                                .filter(([_, v]) => v.status === 'Recusado')
                                .map(([k, v]) => (
                                  <p key={k}>- <strong>{k}</strong>: {v.motivoRecusa}</p>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="form-group">
                      <label className="form-label">Justificativa do Recurso</label>
                      <textarea 
                        value={recursoDescricao}
                        onChange={e => setRecursoDescricao(e.target.value)}
                        className="form-control h-24" 
                        placeholder="Descreva por que o documento deve ser aprovado e anexe as justificativas necessárias"
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-accent w-full">
                      Enviar Recurso <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* LISTA DE MINHAS INSCRIÇÕES */}
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-heading mb-4">Minhas Inscrições</h3>
                  <div className="space-y-4">
                    {candidatos.map(c => (
                      <div key={c.id} className="p-4 bg-bg-app rounded-lg border border-border text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-mono text-text-muted">ID: {c.id}</span>
                            <span className={`badge ${
                              c.status === 'Homologado' || c.status === 'Aprovado' ? 'badge-success' : 
                      c.status === 'Indeferido' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="font-bold text-text-primary mb-1">{c.nome}</p>
                          <p className="text-text-muted mb-2">{c.editalTitulo}</p>
                          
                          {/* Resource details if exists */}
                          {c.recurso && (
                            <div className="mt-3 p-2 bg-bg-app rounded border border-border">
                              <p className="font-semibold text-text-secondary">Recurso Enviado:</p>
                              <p className="text-text-muted italic">"{c.recurso.descricao}"</p>
                              <p className="mt-1 font-bold">
                                Status: <span className={c.recurso.status === 'Deferido' ? 'text-emerald-500' : c.recurso.status === 'Indeferido' ? 'text-rose-500' : 'text-amber-500'}>
                                  {c.recurso.status}
                                </span>
                              </p>
                              {c.recurso.respostaCoordenador && (
                                <p className="text-text-primary mt-1"><strong>Coordenador:</strong> {c.recurso.respostaCoordenador}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* -------------------- 3. PORTAL DO ADMIN (GERAL) -------------------- */}
        {currentRole === 'admin' && (
          <div className="container max-w-5xl py-8 fade-in">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-heading mb-2">Painel Geral do Admin</h1>
                <p className="text-text-secondary">Visão consolidada de todos os programas da pós-graduação do IFAM, estatísticas gerais e controle de coordenadores.</p>
              </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card p-4 text-center">
                <span className="text-2xl font-heading font-extrabold text-primary">{cursos.length}</span>
                <p className="text-xs text-text-muted mt-1 font-semibold">Cursos Oferecidos</p>
              </div>
              <div className="card p-4 text-center">
                <span className="text-2xl font-heading font-extrabold text-primary">{candidatos.length}</span>
                <p className="text-xs text-text-muted mt-1 font-semibold">Inscrições Processadas</p>
              </div>
              <div className="card p-4 text-center">
                <span className="text-2xl font-heading font-extrabold text-primary">{alunos.length}</span>
                <p className="text-xs text-text-muted mt-1 font-semibold">Alunos Matriculados</p>
              </div>
              <div className="card p-4 text-center">
                <span className="text-2xl font-heading font-extrabold text-primary">{sugestoes.length}</span>
                <p className="text-xs text-text-muted mt-1 font-semibold">Sugestões de Cursos</p>
              </div>
            </div>

            {/* GRAPHICS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* CHART 1: INSCRITOS POR EDITAL (SVG BAR CHART) */}
              <div className="card">
                <h3 className="text-sm font-bold text-text-secondary uppercase mb-4">Inscrições por Processo Seletivo (Editais)</h3>
                <div className="flex flex-col gap-4">
                  {editais.map(ed => {
                    const count = candidatos.filter(c => c.editalId === ed.id).length;
                    const maxCount = Math.max(...editais.map(e => candidatos.filter(c => c.editalId === e.id).length), 1);
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={ed.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-text-primary truncate max-w-[280px]" title={ed.titulo}>{ed.titulo}</span>
                          <span className="text-primary font-bold">{count} candidatos</span>
                        </div>
                        {/* SVG Bar */}
                        <svg className="w-full h-4 rounded bg-slate-900/10">
                          <rect width={`${percentage}%`} height="100%" fill="var(--primary)" rx="2" />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CHART 2: STATUS GERAL DA HOMOLOGAÇÃO (SVG PROGRESS BAR) */}
              <div className="card">
                <h3 className="text-sm font-bold text-text-secondary uppercase mb-4">Taxa Geral de Homologação (Seleção)</h3>
                {(() => {
                  const total = candidatos.length || 1;
                  const homologados = candidatos.filter(c => c.status === 'Homologado' || c.status === 'Aprovado').length;
                  const indeferidos = candidatos.filter(c => c.status === 'Indeferido').length;
                  const pendentes = total - homologados - indeferidos;

                  const pctH = (homologados / total) * 100;
                  const pctI = (indeferidos / total) * 100;
                  const pctP = (pendentes / total) * 100;

                  return (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        {/* Stacked Progress Bar SVG */}
                        <svg className="w-full h-8 rounded-lg overflow-hidden bg-slate-900/10">
                          {pctH > 0 && <rect x="0" y="0" width={`${pctH}%`} height="100%" fill="var(--primary)" />}
                          {pctI > 0 && <rect x={`${pctH}%`} y="0" width={`${pctI}%`} height="100%" fill="var(--secondary)" />}
                          {pctP > 0 && <rect x={`${pctH + pctI}%`} y="0" width={`${pctP}%`} height="100%" fill="var(--accent-amber)" />}
                        </svg>
                      </div>

                      {/* Labels and values */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-primary rounded">
                          <p className="font-bold">{pctH.toFixed(0)}%</p>
                          <p className="text-[10px] text-text-muted">Homologados</p>
                        </div>
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-secondary rounded">
                          <p className="font-bold">{pctI.toFixed(0)}%</p>
                          <p className="text-[10px] text-text-muted">Indeferidos</p>
                        </div>
                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-accent-amber rounded">
                          <p className="font-bold">{pctP.toFixed(0)}%</p>
                          <p className="text-[10px] text-text-muted">Pendentes</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* ATUAÇÃO COMO COORDENADOR & CONTROLE DE COORDENADORES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* SELETOR DE ATUAÇÃO (PODER ADICIONAL) */}
              <div className="card md:col-span-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-heading">Painel de Acesso Rápido</h3>
                </div>
                <p className="text-xs text-text-secondary mb-6">
                  Selecione um curso específico para atuar temporariamente como seu respectivo coordenador, acessando todas as suas permissões.
                </p>

                <div className="form-group">
                  <label className="form-label text-xs">Selecione o Curso para Gerenciar</label>
                  <select 
                    value={selectedCursoForCoordenador}
                    onChange={e => setSelectedCursoForCoordenador(e.target.value)}
                    className="form-control"
                  >
                    {cursos.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setCurrentRole('coordenador');
                  }}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  Atuar como Coordenador <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* GESTÃO DE COORDENADORES */}
              <div className="card md:col-span-2">
                <h3 className="text-lg font-heading mb-4">Lista de Coordenadores por Programa</h3>
                
                {/* Form to add coordinator */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCoordNome || !newCoordEmail) return;
                  const cName = cursos.find(c => c.id === newCoordCursoId)?.nome || '';
                  const newC = {
                    id: 'coord-' + (coordenadores.length + 1),
                    nome: newCoordNome,
                    email: newCoordEmail,
                    cursoId: newCoordCursoId,
                    cursoNome: cName
                  };
                  setCoordenadores([...coordenadores, newC]);
                  setNewCoordNome('');
                  setNewCoordEmail('');
                }} className="p-3 bg-bg-app border border-border rounded-lg text-xs space-y-3 mb-4">
                  <p className="font-bold">Cadastrar Novo Coordenador de Programa:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={newCoordNome}
                      onChange={e => setNewCoordNome(e.target.value)}
                      placeholder="Nome do Coordenador" 
                      className="form-control py-1 px-2 text-xs" 
                      required 
                    />
                    <input 
                      type="email" 
                      value={newCoordEmail}
                      onChange={e => setNewCoordEmail(e.target.value)}
                      placeholder="E-mail institucional" 
                      className="form-control py-1 px-2 text-xs" 
                      required 
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <select 
                      value={newCoordCursoId}
                      onChange={e => setNewCoordCursoId(e.target.value)}
                      className="form-control py-1 text-xs"
                    >
                      {cursos.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-secondary btn-sm py-1 shrink-0">Cadastrar</button>
                  </div>
                </form>

                <div className="table-container text-xs">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Curso Alocado</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordenadores.map(coord => (
                        <tr key={coord.id}>
                          <td className="font-bold">{coord.nome}</td>
                          <td className="font-mono">{coord.email}</td>
                          <td><span className="badge badge-info">{coord.cursoNome}</span></td>
                          <td>
                            <button 
                              onClick={() => {
                                setCoordenadores(coordenadores.filter(c => c.id !== coord.id));
                              }}
                              className="btn btn-danger btn-sm py-0.5 px-2 text-[10px]"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* CADASTRAR NOVO CURSO */}
            <div className="card mt-8">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-heading mb-0">Cadastrar Novo Curso de Pós-Graduação</h3>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                Adicione novos programas de Especialização, Mestrado ou Doutorado na base do IFAM. Após cadastrado, o curso estará disponível para alocação de coordenadores, professores e publicação de editais.
              </p>
              
              {courseAddSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-lg mb-6 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Novo curso cadastrado com sucesso na base do IFAM!
                </div>
              )}

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label">Nome do Curso / Programa</label>
                    <input 
                      type="text" 
                      value={newCourseNome}
                      onChange={e => setNewCourseNome(e.target.value)}
                      placeholder="Ex: Mestrado Profissional em Informática Industrial"
                      className="form-control" 
                      required 
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Tipo de Pós-Graduação</label>
                    <select 
                      value={newCourseTipo}
                      onChange={e => setNewCourseTipo(e.target.value as any)}
                      className="form-control"
                    >
                      <option value="Especialização">Especialização (Lato Sensu)</option>
                      <option value="Mestrado">Mestrado (Stricto Sensu)</option>
                      <option value="Doutorado">Doutorado (Stricto Sensu)</option>
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Área de Concentração / Descrição</label>
                    <input 
                      type="text" 
                      value={newCourseDesc}
                      onChange={e => setNewCourseDesc(e.target.value)}
                      placeholder="Ex: Engenharia de Software e IoT"
                      className="form-control" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn btn-primary">
                    Cadastrar Curso <Plus className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* -------------------- 3.5. PORTAL DO COORDENADOR DE CURSO -------------------- */}
        {currentRole === 'coordenador' && (() => {
          const courseIdOfEdital = (edId: string) => edId.includes('spec') ? 'curso-1' : 'curso-2';
          const courseIdOfCandidate = (cand: Candidato) => courseIdOfEdital(cand.editalId);

          const filteredCandidatos = candidatos.filter(c => courseIdOfCandidate(c) === selectedCursoForCoordenador);
          const filteredAlunos = alunos.filter(a => a.cursoId === selectedCursoForCoordenador);
          const activeCurso = cursos.find(c => c.id === selectedCursoForCoordenador);
          const activeCursoNome = activeCurso?.nome || '';

          // Calculate specific statistics for graphics
          const totalCands = filteredCandidatos.length || 1;
          const homologados = filteredCandidatos.filter(c => c.status === 'Homologado' || c.status === 'Aprovado').length;
          const indeferidos = filteredCandidatos.filter(c => c.status === 'Indeferido').length;
          const pendentes = totalCands - homologados - indeferidos;

          const pctH = (homologados / totalCands) * 100;
          const pctI = (indeferidos / totalCands) * 100;
          const pctP = (pendentes / totalCands) * 100;

          // Quotas distribution
          const ampla = filteredCandidatos.filter(c => c.cota === 'Ampla Concorrência').length;
          const afirmativas = filteredCandidatos.filter(c => c.cota === 'Ações Afirmativas').length;
          const pcd = filteredCandidatos.filter(c => c.cota === 'Pessoa com Deficiência (PcD)').length;
          const maxCota = Math.max(ampla, afirmativas, pcd, 1);

          return (
            <div className="container max-w-5xl py-8 fade-in">
              <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-success text-[10px] font-bold">Coordenação</span>
                    <h1 className="text-2xl font-heading text-primary my-0">{activeCursoNome}</h1>
                  </div>
                  <p className="text-text-secondary text-sm">Administre o edital, avalie inscrições de documentos, julgue recursos, cadastre ementas e exporte o dossiê final.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowNewEditalModal(true)} 
                    className="btn btn-primary"
                  >
                    <Plus className="h-5 w-5" /> Criar Edital
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentRole('admin');
                    }}
                    className="btn btn-secondary text-xs"
                  >
                    Painel Geral Admin
                  </button>
                </div>
              </div>

              {/* COURSE SPECIFIC DASHBOARD GRAPHS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Donut / Stacked Homologation Status for this course */}
                <div className="card">
                  <h3 className="text-xs font-bold text-text-secondary uppercase mb-4">Andamento das Homologações do Edital</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Total de Candidatos inscritos no curso:</span>
                      <span className="text-primary font-bold">{filteredCandidatos.length}</span>
                    </div>
                    
                    {/* SVG Stacked Bar */}
                    <svg className="w-full h-6 rounded overflow-hidden bg-slate-900/10">
                      {pctH > 0 && <rect x="0" y="0" width={`${pctH}%`} height="100%" fill="var(--primary)" />}
                      {pctI > 0 && <rect x={`${pctH}%`} y="0" width={`${pctI}%`} height="100%" fill="var(--secondary)" />}
                      {pctP > 0 && <rect x={`${pctH + pctI}%`} y="0" width={`${pctP}%`} height="100%" fill="var(--accent-amber)" />}
                    </svg>

                    <div className="flex justify-between gap-2 text-[10px] font-semibold">
                      <span className="text-primary">✓ Homologados: {homologados} ({pctH.toFixed(0)}%)</span>
                      <span className="text-secondary">✕ Indeferidos: {indeferidos} ({pctI.toFixed(0)}%)</span>
                      <span className="text-accent-amber">⚠ Pendentes/Recurso: {pendentes} ({pctP.toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Quotas distribution bar chart */}
                <div className="card">
                  <h3 className="text-xs font-bold text-text-secondary uppercase mb-4">Inscrições por Cota / Vagas</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Ampla Concorrência</span>
                        <span className="font-bold">{ampla}</span>
                      </div>
                      <svg className="w-full h-3 rounded bg-slate-900/10">
                        <rect width={`${(ampla / maxCota) * 100}%`} height="100%" fill="var(--primary)" />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Ações Afirmativas</span>
                        <span className="font-bold">{afirmativas}</span>
                      </div>
                      <svg className="w-full h-3 rounded bg-slate-900/10">
                        <rect width={`${(afirmativas / maxCota) * 100}%`} height="100%" fill="var(--secondary)" />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Pessoa com Deficiência (PcD)</span>
                        <span className="font-bold">{pcd}</span>
                      </div>
                      <svg className="w-full h-3 rounded bg-slate-900/10">
                        <rect width={`${(pcd / maxCota) * 100}%`} height="100%" fill="var(--accent-blue)" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* MODAL CRIAR EDITAL */}
              {showNewEditalModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                  <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-heading">Novo Edital de Seleção</h3>
                    <button 
                      onClick={() => setShowNewEditalModal(false)}
                      className="text-text-muted hover:text-text-primary font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleCreateEdital}>
                    <div className="form-group">
                      <label className="form-label">Título do Edital</label>
                      <input 
                        type="text" 
                        value={newEditalTitulo}
                        onChange={e => setNewEditalTitulo(e.target.value)}
                        className="form-control"
                        placeholder="Ex: Edital 05/2026 - Mestrado Profissional CMC"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Tipo</label>
                        <select 
                          value={newEditalTipo}
                          onChange={e => setNewEditalTipo(e.target.value as any)}
                          className="form-control"
                        >
                          <option value="Especialização">Especialização</option>
                          <option value="Mestrado">Mestrado</option>
                          <option value="Doutorado">Doutorado</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Vagas</label>
                        <input 
                          type="number" 
                          value={newEditalVagas}
                          onChange={e => setNewEditalVagas(Number(e.target.value))}
                          className="form-control"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Documentos Necessários (Separados por vírgula)</label>
                      <input 
                        type="text" 
                        value={newEditalDocs.join(', ')}
                        onChange={e => setNewEditalDocs(e.target.value.split(',').map(s => s.trim()))}
                        className="form-control"
                      />
                    </div>

                    {/* BAREMA BUILDER */}
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-text-secondary uppercase mb-2">Barema / Requisitos de Pontuação</h4>
                      <div className="space-y-2 mb-4 max-h-36 overflow-y-auto">
                        {newEditalBarema.map((b, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-bg-app rounded border border-border text-xs">
                            <span className="font-semibold">{b.item} ({b.pontuacaoMaxima} pts)</span>
                            <span className="badge badge-info">{b.obrigatorio ? 'Obrigatório' : 'Opcional'}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-bg-app rounded border border-border text-xs space-y-3">
                        <p className="font-bold">Adicionar Requisito à Planilha:</p>
                        <div className="form-group mb-0">
                          <label className="form-label">Item / Categoria</label>
                          <input 
                            type="text" 
                            value={customRequisitoItem}
                            onChange={e => setCustomRequisitoItem(e.target.value)}
                            placeholder="Ex: Artigo publicado em revista"
                            className="form-control py-1 text-xs" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="form-label">Pontuação Máxima</label>
                            <input 
                              type="number" 
                              value={customRequisitoPontos}
                              onChange={e => setCustomRequisitoPontos(Number(e.target.value))}
                              className="form-control py-1 text-xs" 
                            />
                          </div>
                          <div className="flex items-center gap-1 mt-6">
                            <input 
                              type="checkbox" 
                              checked={customRequisitoObrigatorio}
                              onChange={e => setCustomRequisitoObrigatorio(e.target.checked)}
                              id="custom-req-obrig"
                            />
                            <label htmlFor="custom-req-obrig" className="font-semibold text-text-secondary">Obrigatório?</label>
                          </div>
                        </div>
                        <button type="button" onClick={addBaremaItemDraft} className="btn btn-secondary btn-sm w-full py-1">
                          Inserir no Barema
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-6">
                      Publicar Edital <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

              {/* TABS DE COORDENAÇÃO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* HOMOLOGAÇÃO DE INSCRIÇÕES E DOCUMENTOS */}
                <div className="card md:col-span-2">
                  <h3 className="text-xl font-heading mb-4">Revisão de Homologação (Candidatos)</h3>
                  
                  {rejectingDocCandId && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg mb-6 text-xs">
                      <p className="font-bold mb-2">Registrar Motivo da Recusa de: {rejectingDocKey}</p>
                      <textarea
                        value={rejectMotivo}
                        onChange={e => setRejectMotivo(e.target.value)}
                        className="form-control mb-3 text-xs h-16"
                        placeholder="Ex: Assinatura cortada, documento vencido..."
                      ></textarea>
                      <div className="flex gap-2">
                        <button onClick={handleConfirmRejectDoc} className="btn btn-danger btn-sm">Confirmar Rejeição</button>
                        <button onClick={() => setRejectingDocCandId(null)} className="btn btn-secondary btn-sm">Cancelar</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {filteredCandidatos.map(cand => (
                      <div key={cand.id} className="p-4 bg-bg-app rounded-lg border border-border text-sm">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="font-bold text-text-primary text-base">{cand.nome}</span>
                            <p className="text-xs text-text-muted">{cand.editalTitulo}</p>
                          </div>
                          <span className={`badge ${
                            cand.status === 'Homologado' || cand.status === 'Aprovado' ? 'badge-success' : 
                            cand.status === 'Indeferido' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {cand.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-text-secondary uppercase">Documentos Enviados:</p>
                          {Object.entries(cand.documentos).map(([docKey, docVal]) => (
                            <div key={docKey} className="flex flex-wrap justify-between items-center p-2 bg-bg-card rounded border border-border text-xs">
                              <span className="font-mono text-text-secondary">{docKey}: <span className="text-text-muted">({docVal.nomeArquivo})</span></span>
                              <div className="flex items-center gap-1 mt-1 sm:mt-0">
                                {docVal.status === 'Pendente' && (
                                  <>
                                    <button 
                                      onClick={() => approveDoc(cand.id, docKey)} 
                                      className="btn btn-primary btn-sm py-0.5 px-2 text-[10px]"
                                    >
                                      Aprovar
                                    </button>
                                    <button 
                                      onClick={() => triggerRejectDoc(cand.id, docKey)} 
                                      className="btn btn-danger btn-sm py-0.5 px-2 text-[10px]"
                                    >
                                      Recusar
                                    </button>
                                  </>
                                )}
                                {docVal.status === 'Aprovado' && <span className="text-emerald-500 font-bold">✓ Aprovado</span>}
                                {docVal.status === 'Recusado' && (
                                  <span className="text-rose-500 font-bold" title={docVal.motivoRecusa}>
                                    ✕ Recusado: {docVal.motivoRecusa}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Barema Launch panel */}
                        {cand.status === 'Homologado' && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Pontuação do Barema / Avaliação de Títulos</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {editais.find(ed => ed.id === cand.editalId)?.barema.map((b, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                  <label className="text-[11px] font-semibold text-text-muted truncate" title={b.item}>{b.item}</label>
                                  <input 
                                    type="number" 
                                    value={cand.pontuacaoBarema[b.item] !== undefined ? cand.pontuacaoBarema[b.item] : 0}
                                    onChange={e => setCandidateBaremaScore(cand.id, b.item, Number(e.target.value))}
                                    className="form-control py-1 px-2 text-xs"
                                    max={b.pontuacaoMaxima}
                                    min="0"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-between items-center text-xs font-bold text-primary">
                              <span>Pontuação Total: {getCandidateTotalScore(cand)} pontos</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* JULGAMENTO DE RECURSOS */}
                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-xl font-heading mb-4">Julgamento de Recursos</h3>
                    
                    {judgingRecursoCandId && (
                      <div className="p-4 bg-bg-app border border-border rounded-lg mb-6 text-xs space-y-4">
                        <p className="font-bold">Julgar Recurso do Candidato</p>
                        <div className="form-group">
                          <label className="form-label">Decisão</label>
                          <select 
                            value={recursoDecisao} 
                            onChange={e => setRecursoDecisao(e.target.value as any)}
                            className="form-control text-xs"
                          >
                            <option value="Deferido">Deferido (Homologar Candidato)</option>
                            <option value="Indeferido">Indeferido (Manter Rejeitado)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Parecer do Coordenador</label>
                          <textarea
                            value={recursoRespostaText}
                            onChange={e => setRecursoRespostaText(e.target.value)}
                            className="form-control text-xs h-16"
                            placeholder="Descreva a fundamentação do julgamento..."
                          ></textarea>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleConfirmJudgeRecurso} className="btn btn-primary btn-sm w-full">Salvar Julgamento</button>
                          <button onClick={() => setJudgingRecursoCandId(null)} className="btn btn-secondary btn-sm">Voltar</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {filteredCandidatos.filter(c => c.recurso && c.recurso.status === 'Pendente').map(c => (
                        <div key={c.id} className="p-3 bg-bg-app rounded-lg border border-border text-xs">
                          <p className="font-bold text-text-primary">{c.nome}</p>
                          <p className="text-text-muted mb-2">{c.editalTitulo}</p>
                          <p className="p-2 bg-bg-app rounded border border-border italic mb-3">
                            "{c.recurso?.descricao}"
                          </p>
                          <button 
                            onClick={() => triggerJudgeRecurso(c.id)} 
                            className="btn btn-accent btn-sm w-full"
                          >
                            Analisar Recurso
                          </button>
                        </div>
                      ))}
                      {filteredCandidatos.filter(c => c.recurso && c.recurso.status === 'Pendente').length === 0 && (
                        <p className="text-xs text-text-muted text-center py-4">Nenhum recurso pendente no momento.</p>
                      )}
                    </div>
                  </div>

                  {/* IMPORTADOR EXPORTADOR DE DADOS */}
                  <div className="card">
                    <h3 className="text-xl font-heading mb-2">Importar / Exportar Dados</h3>
                    <p className="text-xs text-text-secondary mb-4">Migre suas planilhas de indicações da comunidade e listas de notas.</p>
                    
                    {csvImportSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] p-2 rounded mb-4">
                        Tabela CSV importada com sucesso para o banco de dados.
                      </div>
                    )}

                    <form onSubmit={handleImportCSV} className="space-y-3">
                      <div className="form-group mb-0">
                        <label className="form-label text-[11px]">Tipo de Importação</label>
                        <select 
                          value={csvImportType} 
                          onChange={e => setCsvImportType(e.target.value as any)}
                          className="form-control text-xs"
                        >
                          <option value="sugestoes">Indicações de Cursos (Home Page)</option>
                          <option value="candidatos">Lista de Candidatos Homologados</option>
                        </select>
                      </div>

                      <div className="form-group mb-0">
                        <label className="form-label text-[11px]">Cole as linhas do CSV</label>
                        <textarea 
                          value={csvText}
                          onChange={e => setCsvText(e.target.value)}
                          className="form-control text-[10px] font-mono h-20"
                          placeholder={csvImportType === 'sugestoes' ? "nomeCandidato,email,nomeCurso\nFelipe Lima,felipe@ifam.edu.br,Especialização em IoT" : "nome,email,cpf\nSara Melo,sara@gmail.com,000.111.222-33"}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-secondary btn-sm w-full py-1">Importar CSV</button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <button 
                        onClick={() => {
                          const csv = "Nome,Email,Area,Curso,Data\n" + sugestoes.map(s => `"${s.nomeCandidato}","${s.email}","${s.areaConhecimento}","${s.nomeCurso}","${s.data}"`).join('\n');
                          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(blob);
                          link.setAttribute("download", "indicacoes_cursos_ifam.csv");
                          link.click();
                        }}
                        className="btn btn-accent btn-sm w-full py-1 text-xs"
                      >
                        Exportar Indicações <Download className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* OUTRAS ATRIBUIÇÕES: ALOCAR PROFESSOR E CRIAR EMENTAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                
                {/* ALOCAR PROFESSOR */}
                <div className="card">
                  <h3 className="text-xl font-heading mb-4">Vincular Professor à Disciplina</h3>
                  {allocSuccessMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3 rounded-lg mb-4">
                      Vínculo estabelecido com sucesso! O professor já pode gerenciar a disciplina.
                    </div>
                  )}
                  <form onSubmit={handleAllocateProf}>
                    <div className="form-group">
                      <label className="form-label">Selecione o Curso</label>
                      <select 
                        value={allocCursoId} 
                        onChange={e => {
                          setAllocCursoId(e.target.value);
                          const matchingC = cursos.find(c => c.id === e.target.value);
                          if (matchingC && matchingC.disciplinas.length > 0) {
                            setAllocDiscipId(matchingC.disciplinas[0].id);
                          }
                        }}
                        className="form-control"
                      >
                        {cursos.map(c => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Disciplina</label>
                      <select 
                        value={allocDiscipId} 
                        onChange={e => setAllocDiscipId(e.target.value)}
                        className="form-control"
                      >
                        {cursos.find(c => c.id === allocCursoId)?.disciplinas.map(d => (
                          <option key={d.id} value={d.id}>{d.nome} (Siape: {d.professorNome || 'Não alocado'})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Professor(a) para Alocação</label>
                      <select 
                        value={allocProfId} 
                        onChange={e => setAllocProfId(e.target.value)}
                        className="form-control"
                      >
                        {professores.map(p => (
                          <option key={p.id} value={p.id}>{p.nome} - SIAPE {p.siape}</option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                      Vincular Professor <UserCheck className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                {/* CADASTRAR EMENTA DE CURSO */}
                <div className="card">
                  <h3 className="text-xl font-heading mb-4">Cadastrar Ementa de Curso</h3>
                  {ementaSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3 rounded-lg mb-4">
                      Nova ementa e cronograma inseridos no plano pedagógico.
                    </div>
                  )}
                  <form onSubmit={handleCreateEmenta}>
                    <div className="form-group">
                      <label className="form-label">Curso</label>
                      <select 
                        value={ementaCursoId} 
                        onChange={e => setEmentaCursoId(e.target.value)}
                        className="form-control"
                      >
                        {cursos.map(c => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 form-group">
                        <label className="form-label">Nome da Disciplina</label>
                        <input 
                          type="text" 
                          value={ementaNome}
                          onChange={e => setEmentaNome(e.target.value)}
                          className="form-control"
                          placeholder="Ex: Metodologias Ativas"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CH (Horas)</label>
                        <input 
                          type="number" 
                          value={ementaCH}
                          onChange={e => setEmentaCH(Number(e.target.value))}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cronograma / Horário de Aulas</label>
                      <input 
                        type="text" 
                        value={ementaCrono}
                        onChange={e => setEmentaCrono(e.target.value)}
                        className="form-control"
                        placeholder="Ex: Segunda e Quinta: 18h30 - 22h30"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descrição da Ementa</label>
                      <textarea 
                        value={ementaDesc}
                        onChange={e => setEmentaDesc(e.target.value)}
                        className="form-control h-16"
                        placeholder="Mapeie os tópicos, bibliografia básica e avaliação."
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-secondary w-full">
                      Salvar Componente Curricular <Plus className="h-4 w-4" />
                    </button>
                  </form>
                </div>

              </div>

              {/* DOSSIÊ DO ALUNO */}
              <div className="card mt-8">
                <h3 className="text-xl font-heading mb-4">Dossiê e Registro de Alunos (Secretaria)</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Compile e envie o dossiê acadêmico com o histórico de notas, frequências e documentação para o setor expedidor de diplomas do IFAM por meio de um link seguro.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="form-label">Selecione o Aluno para Compilação</label>
                    <div className="flex gap-2">
                      <select 
                        value={dossierStudentId}
                        onChange={e => setDossierStudentId(e.target.value)}
                        className="form-control"
                      >
                        {filteredAlunos.map(a => (
                          <option key={a.id} value={a.id}>{a.nome} - Matrícula: {a.matricula} ({a.cursoNome})</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleGenerateDossierLink(dossierStudentId)}
                        className="btn btn-primary"
                      >
                        Compilar Dossiê
                      </button>
                    </div>
                  </div>

                  <div>
                    {generatedSecureLink && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs space-y-3">
                        <p className="font-bold text-emerald-400">Link Criptografado Gerado:</p>
                        <div className="flex items-center gap-1 bg-bg-app border border-border p-2 rounded text-text-primary overflow-x-auto font-mono">
                          <span>{window.location.origin}{generatedSecureLink}</span>
                        </div>
                        <p className="text-text-muted">Esse token expira automaticamente e dispensa a necessidade de login do setor receptor.</p>
                        <button 
                          onClick={() => {
                            setCurrentRole('dossie-externo');
                          }}
                          className="btn btn-secondary btn-sm flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> Acessar Link Gerado (Simular Auditoria)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}


        {/* -------------------- 4. PORTAL DO PROFESSOR -------------------- */}
        {currentRole === 'professor' && (
          <div className="container max-w-5xl py-8 fade-in">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-heading mb-2">Portal Acadêmico do Professor</h1>
                <p className="text-text-secondary">Lançamento de notas, registro de presenças e controle de diários de classe das disciplinas associadas.</p>
              </div>

              <div className="flex items-center gap-2 bg-bg-app p-2 rounded border border-border">
                <span className="text-xs font-semibold">Identificação:</span>
                <select 
                  value={selectedTeacherId} 
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="bg-transparent border-none outline-none text-primary font-bold text-sm"
                >
                  {professores.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* DISCIPLINAS ALOCADAS */}
              <div className="card">
                <h3 className="text-lg font-heading mb-4">Minhas Disciplinas Alocadas</h3>
                <div className="space-y-3">
                  {(() => {
                    const profDiscs: { cNome: string; d: Disciplina }[] = [];
                    cursos.forEach(c => {
                      c.disciplinas.forEach(d => {
                        if (d.professorId === selectedTeacherId) {
                          profDiscs.push({ cNome: c.nome, d });
                        }
                      });
                    });

                    if (profDiscs.length === 0) {
                      return <p className="text-xs text-text-muted py-4">Nenhuma disciplina alocada para este docente. Entre em contato com a coordenação.</p>;
                    }

                    return profDiscs.map(({ cNome, d }) => (
                      <button 
                        key={d.id}
                        onClick={() => setTeacherSelectedDiscip(d.id)}
                        className={`w-full text-left p-3 rounded-lg border transition ${
                          teacherSelectedDiscip === d.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-bg-card text-text-primary'
                        }`}
                      >
                        <p className="font-bold text-sm">{d.nome}</p>
                        <p className="text-[11px] text-text-secondary truncate">{cNome}</p>
                        <span className="text-[10px] text-text-muted mt-1 block">CH: {d.cargaHoraria}h | {d.cronograma}</span>
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* DIÁRIO DE NOTAS E FREQUÊNCIA */}
              <div className="lg:col-span-2 card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-heading">
                    Diário de Classe: {findDisciplina(teacherSelectedDiscip)?.nome}
                  </h3>
                  <span className="badge badge-info">Frequência e Notas</span>
                </div>

                {teacherSaveSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-lg mb-6 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Diário de classe salvo e atualizado com sucesso!
                  </div>
                )}

                <form onSubmit={handleTeacherSave}>
                  <div className="table-container mb-6">
                    <table>
                      <thead>
                        <tr>
                          <th>Aluno</th>
                          <th>Matrícula</th>
                          <th>Nota Final</th>
                          <th>Frequência (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alunos.filter(a => a.cursoId === cursos.find(c => c.disciplinas.some(d => d.id === teacherSelectedDiscip))?.id).map(aluno => (
                          <tr key={aluno.id}>
                            <td>
                              <span className="font-bold text-text-primary">{aluno.nome}</span>
                              <span className="text-xs text-text-muted block">{aluno.email}</span>
                            </td>
                            <td><span className="font-mono text-xs">{aluno.matricula}</span></td>
                            <td>
                              <input 
                                type="number" 
                                value={gradesInput[aluno.id] !== undefined ? gradesInput[aluno.id] : 0} 
                                onChange={e => {
                                  const val = Number(e.target.value);
                                  setGradesInput(prev => ({ ...prev, [aluno.id]: val }));
                                }}
                                className="form-control py-1 px-2 text-xs w-16"
                                min="0"
                                max="100"
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                value={freqInput[aluno.id] !== undefined ? freqInput[aluno.id] : 100} 
                                onChange={e => {
                                  const val = Number(e.target.value);
                                  setFreqInput(prev => ({ ...prev, [aluno.id]: val }));
                                }}
                                className="form-control py-1 px-2 text-xs w-20"
                                min="0"
                                max="100"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Salvar Diário de Notas e Faltas <CheckCircle className="h-4.5 w-4.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}


        {/* -------------------- 5. PORTAL DO ALUNO -------------------- */}
        {currentRole === 'aluno' && (
          <div className="container max-w-5xl py-8 fade-in">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-heading mb-2">Portal Acadêmico do Aluno</h1>
                <p className="text-text-secondary">Consulte seu histórico escolar, frequência, ementas de aula, faça check-in em eventos e emita seus certificados.</p>
              </div>

              <div className="flex items-center gap-2 bg-bg-app p-2 rounded border border-border">
                <span className="text-xs font-semibold">Aluno:</span>
                <select 
                  value={selectedStudentId} 
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="bg-transparent border-none outline-none text-primary font-bold text-sm"
                >
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeStudent && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* HISTÓRICO ESCOLAR */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="card">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-heading mb-1">{activeStudent.cursoNome}</h3>
                        <p className="text-xs text-text-muted">Matrícula: {activeStudent.matricula} | TCC: {activeStudent.tccTitulo || 'Não cadastrado'}</p>
                      </div>
                      <span className="badge badge-success">Ativo</span>
                    </div>

                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Disciplina / Ementa</th>
                            <th>Professor</th>
                            <th>Frequência</th>
                            <th>Nota</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cursos.find(c => c.id === activeStudent.cursoId)?.disciplinas.map(discip => (
                            <tr key={discip.id}>
                              <td>
                                <span className="font-bold text-text-primary block">{discip.nome}</span>
                                <span className="text-xs text-text-muted block italic mb-2">"{discip.ementa}"</span>
                                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">{discip.cronograma}</span>
                              </td>
                              <td><span className="text-xs">{discip.professorNome || 'A definir'}</span></td>
                              <td>
                                <span className={`font-mono text-xs ${
                                  (discip.frequencias[activeStudent.id] || 100) < 75 ? 'text-rose-500 font-bold' : 'text-text-primary'
                                }`}>
                                  {discip.frequencias[activeStudent.id] !== undefined ? discip.frequencias[activeStudent.id] : 100}%
                                </span>
                              </td>
                              <td>
                                <span className={`font-mono text-xs ${
                                  (discip.notas[activeStudent.id] || 0) < 60 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'
                                }`}>
                                  {discip.notas[activeStudent.id] !== undefined ? discip.notas[activeStudent.id] : '-'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* EVENTOS E PRESENÇAS / CERTIFICADOS */}
                <div className="space-y-6">
                  {/* SIMULAÇÃO DE CHECK-IN QR CODE */}
                  <div className="card">
                    <h3 className="text-lg font-heading mb-2">Check-in de Eventos (QR Code)</h3>
                    <p className="text-xs text-text-secondary mb-4">Simule a leitura do QR Code do evento com a câmera do celular para atestar presença.</p>
                    
                    <div className="space-y-3">
                      {eventos.map(ev => {
                        const hasPres = ev.presencas.includes(activeStudent.id);
                        return (
                          <div key={ev.id} className="p-3 bg-bg-app rounded-lg border border-border text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-text-primary">{ev.titulo}</p>
                              <p className="text-text-muted">{ev.data} - CH: {ev.cargaHoraria}h</p>
                            </div>
                            {hasPres ? (
                              <span className="text-emerald-500 font-bold">✓ Presente</span>
                            ) : (
                              <button 
                                onClick={() => {
                                  setEventos(eventos.map(e => {
                                    if (e.id === ev.id) {
                                      return { ...e, presencas: [...e.presencas, activeStudent.id] };
                                    }
                                    return e;
                                  }));
                                }}
                                className="btn btn-secondary btn-sm py-1"
                              >
                                Ler QR Code
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* EMISSÃO DE CERTIFICADO */}
                  <div className="card">
                    <h3 className="text-lg font-heading mb-2">Emissão de Certificados</h3>
                    <p className="text-xs text-text-secondary mb-4">Emita seus certificados em PDF para os eventos que você atestou presença.</p>
                    
                    <div className="space-y-3">
                      {eventos.map(ev => {
                        const hasPres = ev.presencas.includes(activeStudent.id);
                        return (
                          <div key={ev.id} className="p-3 bg-bg-app rounded-lg border border-border text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-text-primary">{ev.titulo}</p>
                            </div>
                            {hasPres ? (
                              <button 
                                onClick={() => setShowingCertificate({ aluno: activeStudent, event: ev } as any)} 
                                className="btn btn-accent btn-sm py-1 flex items-center gap-1"
                              >
                                <Award className="h-3 w-3" /> Emitir PDF
                              </button>
                            ) : (
                              <span className="text-text-muted italic">Falta Presença</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}


        {/* -------------------- 6. AUDITORIA EXTERNA (DOSSIÊ SEGURO PÚBLICO) -------------------- */}
        {currentRole === 'dossie-externo' && (
          <div className="container max-w-4xl py-12 fade-in">
            <div className="card border-2 border-emerald-500 bg-bg-card p-8">
              
              {/* Header Dossiê */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-6 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-10 w-10 text-emerald-500" />
                  <div>
                    <h2 className="text-2xl font-heading font-extrabold text-emerald-500">IFAM - Dossiê de Homologação Acadêmica</h2>
                    <p className="text-xs text-text-muted">Verificação Externa Segura (Auditoria de Diplomas)</p>
                  </div>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-xs font-mono font-bold flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" /> Token: {dossierExternalToken}
                </div>
              </div>

              {(() => {
                const s = alunos.find(a => a.id === dossierStudentId);
                const cand = candidatos.find(c => c.email === s?.email) || candidatos[0];
                if (!s) return <p className="text-center text-rose-500">Erro: Aluno não localizado para este token.</p>;
                
                return (
                  <div className="space-y-6">
                    {/* Aluno info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg-app p-4 rounded border border-border text-sm">
                      <div>
                        <p className="text-text-muted text-xs">NOME DO ALUNO</p>
                        <p className="font-bold text-text-primary text-base">{s.nome}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">MATRÍCULA INSTITUCIONAL</p>
                        <p className="font-bold text-text-primary text-base font-mono">{s.matricula}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">PÓS-GRADUAÇÃO</p>
                        <p className="font-bold text-text-primary">{s.cursoNome}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">TRABALHO DE CONCLUSÃO DE CURSO (TCC)</p>
                        <p className="font-bold text-text-primary italic">"{s.tccTitulo || 'Pendente de Defesa'}"</p>
                      </div>
                    </div>

                    {/* Histórico e notas */}
                    <div>
                      <h3 className="text-base font-semibold text-text-secondary uppercase mb-3">Histórico de Componentes Curriculares</h3>
                      <div className="table-container text-xs">
                        <table>
                          <thead>
                            <tr>
                              <th>Disciplina</th>
                              <th>Carga Horária</th>
                              <th>Notas</th>
                              <th>Frequência</th>
                              <th>Situação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cursos.find(c => c.id === s.cursoId)?.disciplinas.map(d => {
                              const note = d.notas[s.id] !== undefined ? d.notas[s.id] : 85;
                              const freq = d.frequencias[s.id] !== undefined ? d.frequencias[s.id] : 95;
                              const passed = note >= 60 && freq >= 75;
                              return (
                                <tr key={d.id}>
                                  <td className="font-bold">{d.nome}</td>
                                  <td>{d.cargaHoraria}h</td>
                                  <td className="font-mono">{note}</td>
                                  <td className="font-mono">{freq}%</td>
                                  <td>
                                    <span className={`font-bold ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                      {passed ? 'APROVADO' : 'REPROVADO'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Documentos de ingresso homologados */}
                    <div>
                      <h3 className="text-base font-semibold text-text-secondary uppercase mb-3">Documentação de Ingresso Validada</h3>
                      <div className="space-y-2">
                        {Object.entries(cand.documentos).map(([docKey, docVal]) => (
                          <div key={docKey} className="flex justify-between items-center p-2.5 bg-bg-app rounded border border-border text-xs">
                            <span className="font-semibold text-text-primary">{docKey}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-text-muted">({docVal.nomeArquivo})</span>
                              <span className="text-emerald-500 font-bold">✓ Homologado e Auditado</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botão de download e confirmação final */}
                    <div className="mt-8 pt-6 border-t border-border flex flex-wrap justify-between items-center gap-4">
                      <span className="text-xs text-text-muted">Dossiê validado sob chaves públicas no ecossistema acadêmico do IFAM.</span>
                      <button 
                        onClick={() => {
                          alert('Dossiê consolidado exportado com sucesso no formato zip com as chaves PGP.');
                        }}
                        className="btn btn-primary"
                      >
                        Baixar Dossiê Completo (ZIP) <Download className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                );
              })()}

            </div>
          </div>
        )}

      </main>

      {/* POPUP DE VISUALIZAÇÃO DO CERTIFICADO EMITIDO */}
      {showingCertificate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white text-slate-900 p-8 rounded-lg max-w-2xl w-full border-8 border-double border-emerald-700 shadow-2xl relative fade-in">
            <button 
              onClick={() => setShowingCertificate(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 font-bold text-lg"
            >
              ✕ Fechar
            </button>

            {/* Certificado Design */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <GraduationCap className="h-14 w-14 text-emerald-700" />
              </div>
              <h1 className="font-heading font-extrabold text-3xl text-emerald-800 tracking-tight uppercase mb-6">Certificado de Participação</h1>
              
              <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
                {certificadoConfig.textoModelo
                  .replace('{NOME_ALUNO}', showingCertificate.aluno.nome)
                  .replace('{NOME_EVENTO}', showingCertificate.evento.titulo)
                  .replace('{DATA_EVENTO}', showingCertificate.evento.data)
                  .replace('{CARGA_HORARIA}', showingCertificate.evento.cargaHoraria.toString())}
              </p>

              {/* Assinaturas Duplas */}
              <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-12">
                <div className="text-center flex flex-col items-center">
                  <img 
                    src={certificadoConfig.assinante1Imagem} 
                    alt="Assinatura 1" 
                    className="h-10 mb-2 opacity-80"
                  />
                  <div className="border-t border-slate-300 w-full pt-1">
                    <p className="text-xs font-bold text-slate-800">{certificadoConfig.assinante1Nome}</p>
                    <p className="text-[10px] text-slate-500">{certificadoConfig.assinante1Cargo}</p>
                  </div>
                </div>

                <div className="text-center flex flex-col items-center">
                  <img 
                    src={certificadoConfig.assinante2Imagem} 
                    alt="Assinatura 2" 
                    className="h-10 mb-2 opacity-80"
                  />
                  <div className="border-t border-slate-300 w-full pt-1">
                    <p className="text-xs font-bold text-slate-800">{certificadoConfig.assinante2Nome}</p>
                    <p className="text-[10px] text-slate-500">{certificadoConfig.assinante2Cargo}</p>
                  </div>
                </div>
              </div>

              {/* QR Code de Validação no Certificado */}
              <div className="mt-8 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-100 pt-4">
                <span>Código de Verificação: VAL-{showingCertificate.aluno.matricula}-{showingCertificate.evento.id}</span>
                <div className="flex items-center gap-1.5">
                  <QrCode className="h-5 w-5 text-slate-700" />
                  <span>Validado digitalmente pelo SouPós IFAM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contato" className="bg-bg-app text-text-muted py-8 border-t-4 border-primary text-center text-xs">
        <p className="font-bold text-text-secondary">© 2026 Instituto Federal de Educação, Ciência e Tecnologia do Amazonas - IFAM</p>
        <p className="mt-1">Campus Manaus Centro | Pós-Graduação Lato e Stricto Sensu</p>
        <p className="mt-1 text-[10px] text-text-muted">Desenvolvido no Campus Manaus Centro</p>
      </footer>
    </div>
  );
}
