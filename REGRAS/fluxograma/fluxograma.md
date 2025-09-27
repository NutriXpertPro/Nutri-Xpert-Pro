Fluxograma Completo - Nutri Xpert Pro

mermaid
flowchart TD
    A[Acesso ao Sistema] --> B[Tela de Login]
    B --> C{Autenticação NextAuth.js}
    C -->|Nutricionista Ativo| D[Dashboard Nutricionista]
    C -->|Paciente| E[Dashboard Paciente]
    C -->|Falha| B

    subgraph Registro e Habilitação de Nutricionista
        RN1[Cadastro Nutricionista] --> RN2[Seleção de Plano/Pagamento]
        RN2 --> RN3{Pagamento Confirmado?}
        RN3 -->|Sim| RN4[Aprovação/Habilitação]
        RN3 -->|Não| RN2
        RN4 -->|Habilitado| D
        RN4 -->|Rejeitado| RN1
    end

    B --> RN1
    
    D --> F[Menu Principal]
    E --> G[Menu Paciente]
    
    F --> H[Gestão de Pacientes]
    H --> H1[Novo Cadastro]
    H1 --> H2[Formulário de Anamnese]
    H2 --> H3{Modalidade Atendimento}
    H3 -->|Presencial| H4[Preenchimento no consultório]
    H3 -->|Virtual| H5[Envio link/email para paciente]
    H5 --> H6[Paciente preenche online]
    H6 --> H7[Integração automática]
    H4 --> H8[Armazenamento seguro Neon/PostgreSQL]
    H7 --> H8
    H8 --> H9[Visualização/Edição]
    H9 --> H
    
    F --> I[Avaliações Quinzenais]
    I --> I1[Selecionar Paciente]
    I1 --> I2{Modalidade Avaliação}
    I2 -->|Virtual| I3[Email automático a cada 15 dias]
    I3 --> I4[Formulário de Avaliação Online]
    I4 --> I5[Upload: 3 fotos (frente, lado, costas)]
    I5 --> I6[Registro: Peso e Medidas]
    I6 --> I7[Armazenamento e Histórico]
    I7 --> I8[Comparativo Visual lado a lado]
    I8 --> I9[Gráficos de Evolução]
    I9 --> I10{Exportar para PDF}
    I10 -->|Sim| I11[PDF com fotos e gráficos]
    I10 -->|Não| I
    I11 --> I
    
    I2 -->|Presencial| I12[Registro direto pelo nutricionista]
    I12 --> I7
    
    I2 -->|Pendente| I13[Notificação no Dashboard]
    I13 --> I14[Visualizar clientes com pendência]
    I14 --> I3
    
    F --> J[Criação de Dietas]
    J --> J1[Selecionar Paciente]
    J1 --> J2[Cálculos Automáticos<br>TMB, Fator Atividade]
    J2 --> J3[Acesso Banco Alimentos TACO]
    J3 --> J3.5[Sugestão IA<br>Dietas, Suplementos, Manipulados]
    J3.5 --> J4[Montagem Dieta Personalizada<br>Até 10 refeições + substituições]
    J4 --> J5{Exportar Dieta}
    J5 -->|PDF| J6[Geração PDF profissional]
    J5 -->|Web| J7[Visualização Web]
    J6 --> J
    J7 --> J
    
    F --> K[Relatórios e Análises]
    K --> K1[Selecionar Paciente]
    K1 --> K2[Visualizar Histórico Completo]
    K2 --> K3[Gerar Relatórios Personalizados]
    K3 --> K4[Exportar PDF]
    K4 --> K
    
    F --> L[Configurações]
    L --> L1[Upload Logomarca]
    L1 --> L2[Personalização Visual]
    L2 --> L3[Configurações de Conta]
    L3 --> L
    
    G --> M[Minhas Avaliações]
    M --> M1[Formulário de Anamnese]
    M1 --> M2[Preenchimento Online]
    M2 --> M3[Envío para Nutricionista]
    M3 --> M
    
    G --> N[Avaliações Quinzenais]
    N --> N1[Receber Email]
    N1 --> N2[Preencher Formulário]
    N2 --> N3[Upload Fotos e Medidas]
    N3 --> N4[Envío para Nutricionista]
    N4 --> N
    
    G --> O[Minha Evolução]
    O --> O1[Visualizar Histórico]
    O1 --> O2[Ver Gráficos de Progresso]
    O2 --> O3[Comparar Fotos]
    O3 --> O
    
    G --> P[Minhas Dietas]
    P --> P1[Visualizar Dietas Atuais]
    P1 --> P2[Histórico de Dietas]
    P2 --> P
    
    style A fill:#7c3aed,color:white
    style D fill:#2563eb,color:white
    style E fill:#059669,color:white
    style H fill:#10b981,color:white
    style I fill:#f59e0b,color:white
    style J fill:#8b5cf6,color:white
    style K fill:#ec4899,color:white
    style L fill:#6366f1,color:white
    style M fill:#f97316,color:white



Arquitetura Técnica Detalhada

1. Sistema de Autenticação e Autorização


┌─────────────────────────────────────────────────┐
│             NextAuth.js + JWT                   │
├─────────────────────────────────────────────────┤
│  • Autenticação por email/senha                 │
│  • Dois perfis: nutricionista e paciente        │
│  • Controle de permissões granular              │
│  • Sessions com Redis para performance          │
│  • RLS (Row-Level Security) no PostgreSQL       │
│  • Interface responsiva para todos dispositivos │
│  • Recuperação de senha segura                  │
└─────────────────────────────────────────────────┘


1.5. Módulo de Gerenciamento de Assinaturas


┌─────────────────────────────────────────────────┐
│           Gerenciamento de Assinaturas          │
├─────────────────────────────────────────────────┤
│  • Integração com Gateway de Pagamento          │
│    (Stripe, PagSeguro, etc.)                    │
│  • Suporte a pagamentos recorrentes             │
│    (Cartão de Crédito, Pix, Débito)             │
│  • Fluxo de aprovação de nutricionistas         │
│    (manual ou automático)                       │
│  • Gestão de status de assinatura               │
│    (Ativa, Pendente, Cancelada)                 │
│  • Notificações de vencimento e falha de        │
│    pagamento                                    │
│  • Restrição de acesso a funcionalidades        │
│    com base no status da assinatura             │
└─────────────────────────────────────────────────┘


2. Módulo de Gestão de Pacientes


┌─────────────────────────────────────────────────┐
│           Sistema de Gestão de Pacientes        │
├─────────────────────────────────────────────────┤
│  • Cadastro completo de pacientes               │
│  • Dados pessoais: nome, idade, sexo, profissão │
│  • Duas modalidades de atendimento:             │
│    - Presencial: preenchimento no consultório   │
│    - Virtual: envio por email/link seguro       │
│  • Formulário PWA responsivo                    │
│  • Histórico médico e preferências alimentares  │
│  • Armazenamento seguro com criptografia        │
│  • Integração automática de dados               │
│  • Pesquisa e filtros de pacientes              │
└─────────────────────────────────────────────────┘


3. Sistema de Avaliações Quinzenais


┌─────────────────────────────────────────────────┐
│           Avaliações Quinzenais                 │
├─────────────────────────────────────────────────┤
│  • Agendamento automático a cada 15 dias        │
│  • Sistema de emails automáticos (SendGrid)     │
│  • Formulário responsivo para pacientes         │
│  • Upload seguro de 3 fotos (frente, lado, costas)│
│  • Registro de peso e medidas específicas:      │
│    - Homens: pescoço e cintura                  │
│    - Mulheres: pescoço, cintura e quadril       │
│  • Processamento de imagens (thumbnails)        │
│  • Comparativo visual lado a lado               │
│  • Gráficos evolutivos de progresso             │
│  • Sistema de notificações para pendências      │
│  • Histórico completo de avaliações            │
│  • Exportação PDF profissional                  │
└─────────────────────────────────────────────────┘


4. Módulo de Criação de Dietas


┌─────────────────────────────────────────────────┐
│         Sistema de Criação de Dietas            │
├─────────────────────────────────────────────────┤
│  • Integração com Tabela TACo                   │
│  • Cálculos automáticos de TMB                  │
│  • Consideração de fator de atividade           │
│  • Geração de dietas personalizadas             │
│  • Até 10 refeições diárias                     │
│  • Sistema de substituições alimentares         │
│  • Ajustes manuais pelo nutricionista           │
│  • Visualização web responsiva                  │
│  • Exportação PDF com logomarca                 │
│  • Histórico de dietas por paciente             │
│  • Banco de alimentos CRUD                      │
│  • Integração com IA para sugestão de dietas, suplementos e manipulados │
└─────────────────────────────────────────────────┘


4.5. Módulo de Inteligência Artificial


┌─────────────────────────────────────────────────┐
│         Módulo de Inteligência Artificial       │
├─────────────────────────────────────────────────┤
│  • Análise de perfil do paciente (anamnese,     │
│    exames de sangue, objetivos)                 │
│  • Sugestão de modelos completos de dieta       │
│  • Indicação de suplementos e manipulados       │
│  • Base de conhecimento nutricional (e-books,   │
│    papers, estudos acadêmicos)                  │
│  • Interface para avaliação e edição das        │
│    sugestões pelo nutricionista                 │
└─────────────────────────────────────────────────┘


5. Infraestrutura e Tecnologias


┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Next.js 14+   │◄──►│   Node.js       │◄──►│   PostgreSQL   │
│   App Router    │    │   TypeScript    │    │   Supabase         │
│   Tailwind CSS  │    │   tRPC/Express  │    │   Prisma ORM   │
│   PWA           │    │   Redis/BullMQ  │    │   RLS Security │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ▲                         ▲                     ▲
        │                         │                     │
        └───────┐           ┌─────┴─────┐           ┌───┴───┐
                │           │           │           │       │
            ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
            │ Vercel  │ │ AWS S3  │ │Redis    │ │Cloud-   │
            │ Blob    │ │         │ │Cache    │ │flare    │
            └─────────┘ └─────────┘ └─────────┘ └─────────┘
                    │           │
                    └─────┬─────┘
                          │
                    ┌─────────────┐
                    │  Email      │
                    │  Service    │
                    │  (SendGrid) │
                    └─────────────┘


Fluxos de Trabalho Detalhados

1. Fluxo de Atendimento Presencial


Nutricionista inicia consulta → Seleciona paciente → 
Preenche anamnese no consultório → Salva dados → 
Sistema armazena informações → Agenda próxima consulta → 
Gera lembrete automático


2. Fluxo de Atendimento Virtual


Nutricionista seleciona paciente → Envia formulário por email → 
Paciente recebe link → Preenche formulário online → 
Sistema integra automaticamente → Nutricionista recebe notificação → 
Revisa dados → Confirma armazenamento


3. Fluxo de Avaliação Quinzenal


Sistema verifica datas → Envia email automático → 
Paciente preenche formulário → Upload de fotos e medidas → 
Sistema processa imagens → Atualiza histórico → 
Gera comparativo visual → Cria gráficos evolutivos → 
Notifica nutricionista → Disponibiliza para exportação PDF


4. Fluxo de Criação de Dieta


Nutricionista seleciona paciente → Sistema calcula TMB → 
Define necessidades energéticas → Acessa banco TACo → 
Gera dieta automática → Permite ajustes manuais → 
Configura substituições → Visualiza preview → 
Exporta PDF ou compartilha online


4.5. Fluxo de Criação de Dieta com IA


Nutricionista seleciona paciente → Sistema calcula TMB → 
Define necessidades energéticas → Acessa banco TACo → 
IA analisa perfil do paciente (anamnese, exames, objetivos) → 
IA sugere modelos de dieta, suplementos e manipulados → 
Nutricionista avalia e edita sugestões da IA → 
Gera dieta personalizada → Permite ajustes manuais → 
Configura substituições → Visualiza preview → 
Exporta PDF ou compartilha online


Sistema de Notificações


┌─────────────────────────────────────────────────┐
│           Sistema de Notificações               │
├─────────────────────────────────────────────────┤
│  • Monitoramento contínuo de prazos             │
│  • Alertas visuais no dashboard                 │
│  • Lista prioritária de pendências              │
│  • Email reminders para pacientes               │
│  • Notificações push para nutricionistas        │
│  • Histórico de alertas e ações                 │
│  • Configurações personalizáveis                │
└─────────────────────────────────────────────────┘


Conformidade e Segurança


┌─────────────────────────────────────────────────┐
│           LGPD e Segurança de Dados             │
├─────────────────────────────────────────────────┤
│  • Criptografia de dados sensíveis              │
│  • Armazenamento seguro de imagens              │
│  • Controle de acesso granular                  │
│  • Audit trail de acessos                       │
│  • Backups automáticos                          │
│  • Política de retenção de dados                │
│  • Exclusão segura de informações               │
│  • Anonimização de dados para analytics         │
└─────────────────────────────────────────────────┘


Este fluxograma completo representa toda a arquitetura do sistema Nutri Xpert Pro, incluindo todos os módulos, fluxos de trabalho e integrações técnicas especificadas no PRD, com atenção especial à conformidade com LGPD, usabilidade em múltiplos dispositivos e a experiência diferenciada para nutricionistas e pacientes.