export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'urgent';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  initials: string;
  color: string;
  tasksCompleted: number;
  tasksPending: number;
  tasksInProgress: number;
  joinedAt: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  category: string;
  orderNumber: string;
  createdAt: string;
  completedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  action: string;
  timestamp: string;
}

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Carlos Admin',
    email: 'carlos@empresa.com',
    department: 'Gestão de TI',
    role: 'admin',
    initials: 'CA',
    color: '#0066CC',
    tasksCompleted: 48,
    tasksPending: 3,
    tasksInProgress: 5,
    joinedAt: '2024-01-15',
    isActive: true,
  },
  {
    id: 'u2',
    name: 'João Costa',
    email: 'joao.costa@empresa.com',
    department: 'Operações',
    role: 'user',
    initials: 'JC',
    color: '#10B981',
    tasksCompleted: 23,
    tasksPending: 5,
    tasksInProgress: 2,
    joinedAt: '2024-03-10',
    isActive: true,
  },
  {
    id: 'u3',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    department: 'Manutenção',
    role: 'user',
    initials: 'MS',
    color: '#F59E0B',
    tasksCompleted: 31,
    tasksPending: 2,
    tasksInProgress: 3,
    joinedAt: '2024-02-20',
    isActive: true,
  },
  {
    id: 'u4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    department: 'Logística',
    role: 'user',
    initials: 'PO',
    color: '#8B5CF6',
    tasksCompleted: 15,
    tasksPending: 8,
    tasksInProgress: 1,
    joinedAt: '2024-04-05',
    isActive: true,
  },
  {
    id: 'u5',
    name: 'Ana Lima',
    email: 'ana.lima@empresa.com',
    department: 'Qualidade',
    role: 'user',
    initials: 'AL',
    color: '#EF4444',
    tasksCompleted: 27,
    tasksPending: 4,
    tasksInProgress: 2,
    joinedAt: '2024-01-28',
    isActive: false,
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Inspeção de Equipamento #A-201',
    description: 'Realizar inspeção completa no equipamento A-201 conforme protocolo de segurança vigente. Verificar estado geral, desgaste de peças e eficiência operacional.',
    status: 'urgent',
    priority: 'critical',
    dueDate: '2026-06-14',
    assigneeId: 'u2',
    category: 'Manutenção',
    orderNumber: 'OS-2026-001',
    createdAt: '2026-06-10',
  },
  {
    id: 't2',
    title: 'Calibração de Sensores de Temperatura',
    description: 'Calibrar todos os sensores de temperatura da linha de produção B de acordo com as especificações técnicas.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-06-16',
    assigneeId: 'u3',
    category: 'Manutenção',
    orderNumber: 'OS-2026-002',
    createdAt: '2026-06-11',
  },
  {
    id: 't3',
    title: 'Auditoria de Estoque Q2',
    description: 'Realizar contagem e conferência de todos os itens em estoque para o relatório do segundo trimestre.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-20',
    assigneeId: 'u4',
    category: 'Logística',
    orderNumber: 'OS-2026-003',
    createdAt: '2026-06-09',
  },
  {
    id: 't4',
    title: 'Relatório de Qualidade - Lote #788',
    description: 'Elaborar relatório de qualidade para o lote 788 de acordo com as normas ISO 9001.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-06-12',
    assigneeId: 'u5',
    category: 'Qualidade',
    orderNumber: 'OS-2026-004',
    createdAt: '2026-06-08',
    completedAt: '2026-06-12',
  },
  {
    id: 't5',
    title: 'Troca de Filtros HVAC - Setor C',
    description: 'Substituição programada de filtros no sistema de climatização HVAC do setor C. Uso de EPI obrigatório.',
    status: 'urgent',
    priority: 'critical',
    dueDate: '2026-06-13',
    assigneeId: 'u2',
    category: 'Manutenção',
    orderNumber: 'OS-2026-005',
    createdAt: '2026-06-12',
  },
  {
    id: 't6',
    title: 'Atualização de Sistema ERP',
    description: 'Coordenar a atualização do módulo de inventário no sistema ERP com a equipe de TI.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-06-25',
    assigneeId: 'u1',
    category: 'TI',
    orderNumber: 'OS-2026-006',
    createdAt: '2026-06-10',
  },
  {
    id: 't7',
    title: 'Treinamento de Segurança - Turno B',
    description: 'Conduzir treinamento obrigatório de segurança e emergência para funcionários do turno B.',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-06-18',
    assigneeId: 'u3',
    category: 'RH',
    orderNumber: 'OS-2026-007',
    createdAt: '2026-06-11',
  },
  {
    id: 't8',
    title: 'Inspeção de Veículos da Frota',
    description: 'Vistoria semestral de todos os veículos da frota operacional incluindo documentação.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-22',
    assigneeId: 'u4',
    category: 'Logística',
    orderNumber: 'OS-2026-008',
    createdAt: '2026-06-10',
  },
  {
    id: 't9',
    title: 'Revisão de Procedimentos Operacionais',
    description: 'Revisar e atualizar os procedimentos operacionais padrão do departamento de operações.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-06-10',
    assigneeId: 'u2',
    category: 'Operações',
    orderNumber: 'OS-2026-009',
    createdAt: '2026-06-05',
    completedAt: '2026-06-09',
  },
  {
    id: 't10',
    title: 'Relatório Mensal de Indicadores',
    description: 'Consolidar e apresentar os indicadores de desempenho do mês de maio para a diretoria.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-06-11',
    assigneeId: 'u1',
    category: 'Gestão',
    orderNumber: 'OS-2026-010',
    createdAt: '2026-06-07',
    completedAt: '2026-06-11',
  },
  {
    id: 't11',
    title: 'Manutenção Preventiva - Compressor #3',
    description: 'Realizar manutenção preventiva mensal no compressor #3 da linha de ar comprimido conforme plano de manutenção.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-06-15',
    assigneeId: 'u3',
    category: 'Manutenção',
    orderNumber: 'OS-2026-011',
    createdAt: '2026-06-12',
  },
  {
    id: 't12',
    title: 'Verificação de Conformidade Ambiental',
    description: 'Auditar conformidade com normas ambientais vigentes para renovação do licenciamento 2026.',
    status: 'pending',
    priority: 'critical',
    dueDate: '2026-06-17',
    assigneeId: 'u5',
    category: 'Ambiental',
    orderNumber: 'OS-2026-012',
    createdAt: '2026-06-10',
  },
  {
    id: 't13',
    title: 'Levantamento de Necessidades de TI',
    description: 'Mapear as necessidades de hardware e software para o planejamento orçamentário do Q3.',
    status: 'pending',
    priority: 'low',
    dueDate: '2026-06-30',
    assigneeId: 'u1',
    category: 'TI',
    orderNumber: 'OS-2026-013',
    createdAt: '2026-06-12',
  },
  {
    id: 't14',
    title: 'Verificação de Pontos de Incêndio',
    description: 'Inspecionar todos os extintores e hidrantes do complexo para conformidade com AVCB.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-06-08',
    assigneeId: 'u2',
    category: 'Segurança',
    orderNumber: 'OS-2026-014',
    createdAt: '2026-06-01',
    completedAt: '2026-06-07',
  },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'a1', userId: 'u2', taskId: 't9', taskTitle: 'Revisão de Procedimentos Operacionais', action: 'concluiu a tarefa', timestamp: '2026-06-09T14:30:00' },
  { id: 'a2', userId: 'u1', taskId: 't10', taskTitle: 'Relatório Mensal de Indicadores', action: 'concluiu a tarefa', timestamp: '2026-06-11T16:45:00' },
  { id: 'a3', userId: 'u3', taskId: 't11', taskTitle: 'Manutenção Preventiva - Compressor #3', action: 'iniciou a tarefa', timestamp: '2026-06-12T08:00:00' },
  { id: 'a4', userId: 'u1', taskId: 't6', taskTitle: 'Atualização de Sistema ERP', action: 'atualizou status para Em Andamento', timestamp: '2026-06-12T09:15:00' },
  { id: 'a5', userId: 'u2', taskId: 't1', taskTitle: 'Inspeção de Equipamento #A-201', action: 'foi designado para tarefa urgente', timestamp: '2026-06-12T10:00:00' },
  { id: 'a6', userId: 'u5', taskId: 't4', taskTitle: 'Relatório de Qualidade - Lote #788', action: 'concluiu a tarefa', timestamp: '2026-06-12T11:30:00' },
  { id: 'a7', userId: 'u4', taskId: 't3', taskTitle: 'Auditoria de Estoque Q2', action: 'adicionou comentário à tarefa', timestamp: '2026-06-12T13:20:00' },
  { id: 'a8', userId: 'u3', taskId: 't2', taskTitle: 'Calibração de Sensores de Temperatura', action: 'atualizou progresso da tarefa', timestamp: '2026-06-13T07:45:00' },
];

export const WEEKLY_CHART_DATA = [
  { day: 'Seg', concluidas: 8, emAndamento: 3, pendentes: 4 },
  { day: 'Ter', concluidas: 12, emAndamento: 5, pendentes: 6 },
  { day: 'Qua', concluidas: 7, emAndamento: 4, pendentes: 8 },
  { day: 'Qui', concluidas: 15, emAndamento: 6, pendentes: 3 },
  { day: 'Sex', concluidas: 10, emAndamento: 3, pendentes: 5 },
  { day: 'Sáb', concluidas: 5, emAndamento: 1, pendentes: 2 },
  { day: 'Dom', concluidas: 3, emAndamento: 0, pendentes: 1 },
];

export const CATEGORIES = ['Manutenção', 'Operações', 'Logística', 'Qualidade', 'TI', 'RH', 'Gestão', 'Ambiental', 'Segurança'];
