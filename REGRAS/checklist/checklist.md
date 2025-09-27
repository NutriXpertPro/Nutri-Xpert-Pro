# CHECKLIST COMPLETO - NUTRI XPERT PRO

## 1. VISÃO GERAL DO PROJETO
- [~] Documentação técnica completa
- [x] Arquitetura do sistema definida
- [x] Stack tecnológica configurada

## 2. CONFIGURAÇÃO INICIAL E INFRAESTRUTURA

### 2.1 AMBIENTE DE DESENVOLVIMENTO
- [x] Configuração do Next.js (App Router)
- [x] Configuração do TypeScript
- [x] Configuração do Tailwind CSS
- [x] Configuração do ESLint e Prettier (20/09/2025, 19:48 -03 - Instalação de dependências e criação de arquivos de configuração para ESLint e Prettier)

### 2.2 BANCO DE DADOS
- [x] Configuração do Supabase (PostgreSQL) (25/09/2025)

### 2.4 GERENCIAMENTO DE ASSINATURAS
- [x] Integração com Gateway de Pagamento (Stripe/Outro) (26/09/2025 - Schema, .env, util e package instalados)
- [x] Fluxo de Assinatura Recorrente (Cartão de Crédito, Pix, Débito) (26/09/2025 - APIs de checkout e webhook implementadas)
- [ ] Sistema de Aprovação de Nutricionistas (Manual/Automático)
- [ ] Gerenciamento de Status de Assinatura (Ativa, Pendente, Cancelada)
- [ ] Notificações de Vencimento/Falha de Pagamento
- [x] Configuração do Prisma ORM
- [x] Schema do banco de dados
- [x] Migrações iniciais
- [x] Seeders (dados iniciais) (20/09/2025, 19:48 -03 - Criação do arquivo `prisma/seed.ts` com dados iniciais e adição do script `prisma:seed` ao `package.json`)

### 2.3 AUTENTICAÇÃO E SEGURANÇA
- [x] Configuração do NextAuth.js
- [x] Providers de autenticação (email/senha)
- [x] Middleware de autenticação
- [~] Sistema de permissões (RBAC)
- [x] Configuração de sessões
- [x] Configuração do Google OAuth (redirect_uri) ajustada (20/09/2025, 19:48 -03 - Resolução do erro 'redirect_uri_mismatch' no Google Cloud Console).

## 3. FUNCIONALIDADES PRINCIPAIS

### 3.1 FASE 1 - MVP

#### GESTÃO DE USUÁRIOS
- [ x] Cadastro de nutricionista
- [x ] Login de nutricionista
- [x ] Cadastro de pacientes pelo nutricionista
- [x] Implementar login de paciente (feito em 26/09/2025)
- [x ] Perfis de usuário (nutricionista/paciente)
- [x] Sistema de permissões por usuário

#### DASHBOARD E INTERFACES
- [x ] Dashboard do nutricionista
- [x ]  Painel de controle principal
- [x ] Interface/portal do paciente
- [x ] Menu de navegação responsivo (20/09/2025, 19:48 -03 - Implementação de menu de navegação responsivo no componente Header)
- [x ] Sistema de notificações na interface (20/09/2025, 19:48 -03 - Criação do componente `NotificationBell`, integração em `app/providers.tsx` e criação do endpoint `app/api/notifications/route.ts`)

#### GESTÃO DE PACIENTES
- [x]  Listagem de pacientes (22/09/2025)
- [x] Visualização detalhada do paciente (22/09/2025)
- [x] Edição de dados do paciente (22/09/2025)
- [x] Histórico completo do paciente (22/09/2025)
- [x] Busca e filtros de pacientes (22/09/2025)

#### FICHA DE ANAMNESE
- [x] Formulário de anamnese completo (22/09/2025)
- [x] Anamnese presencial (preenchida pelo nutricionista) (23/09/2025)
- [x] Anamnese virtual (link enviado para paciente) (23/09/2025)
- [x] Validação de campos obrigatórios (23/09/2025)
- [x] Armazenamento seguro dos dados (23/09/2025)

#### SISTEMA DE AVALIAÇÕES
- [x] Avaliação quinzenal virtual (22/09/2025)
- [x] Sistema de upload de fotos (3 fotos: frente, lado, costas) (22/09/2025)
- [x] Processamento e redimensionamento de imagens (22/09/2025 - Base implementada, simulação de upload)
- [x] Armazenamento seguro de imagens (23/09/2025 - Implementação de armazenamento de imagens no Vercel Blob e atualização do banco de dados)
- [x] Cálculo automático de percentual de gordura (fórmula marinha) (23/09/2025 - Implementação da fórmula da marinha para cálculo de percentual de gordura e integração na criação de anamnese)
- [x] Histórico de avaliações por paciente (23/09/2025 - Criação do endpoint API para buscar histórico de avaliações por cliente)

#### COMUNICAÇÃO E NOTIFICAÇÕES
- [x] Sistema de envio de emails automáticos (23/09/2025 - Implementação da função utilitária de envio de emails com SendGrid e instalação da dependência)
- [x] Envio quinzenal de formulário de avaliação (23/09/2025 - Implementação do endpoint API para agendamento e envio de links de formulário de avaliação via email)
- [x] Notificações de pendências para nutricionista (23/09/2025 - Implementação do endpoint API para buscar avaliações pendentes para nutricionistas)
- [x] Alertas no dashboard (23/09/2025 - Implementação da exibição de alertas de avaliações pendentes no dashboard do nutricionista)
- [x] Templates de email personalizados (23/09/2025 - Criação de template de email para lembrete de avaliação e integração no envio de emails)

#### BANCO DE ALIMENTOS E DIETAS
- [x] Importação da Tabela TACO (23/09/2025 - Criação do arquivo `prisma/seed.ts` com placeholder para importação da Tabela TACO)
- [x] Cadastro de alimentos personalizados (23/09/2025 - Criação de APIs REST para CRUD de alimentos personalizados)
- [x] Sistema de busca de alimentos (23/09/2025 - Implementação de funcionalidade de busca por nome e categoria na API de alimentos)
- [x] Criação de dietas personalizadas (até 10 refeições) (23/09/2025 - Criação de APIs REST para CRUD de dietas personalizadas)
- [x] Sistema de substituições alimentares (23/09/2025 - Criação do endpoint API para sugestão de substituições de alimentos)
- [x] Cálculo nutricional automático (23/09/2025 - Criação do endpoint API para cálculo nutricional automático de dietas)
- [x] Salvamento de dietas por paciente (24/09/2025)

#### RELATÓRIOS E GRÁFICOS BÁSICOS
- [x] Gráficos de evolução de peso (25/09/2025)
- [x] Gráficos de medidas corporais (25/09/2025)
- [x] Histórico visual de fotos (24/09/2025)
- [x] Relatórios básicos em PDF (25/09/2025)
- [x] Exportação de dados do paciente (25/09/2025)

### 3.2 FASE 2 - PÓS-MVP

#### AVALIAÇÕES PRESENCIAIS
- [x] Avaliação presencial com reagendamento (26/09/2025)
- [x] Sistema de agendamento/calendário (26/09/2025)
- [ ] Lembretes de consultas
- [ ] Histórico de consultas presenciais

#### EXAMES LABORATORIAIS
- [ ] Upload de exames laboratoriais
- [ ] Histórico de exames por paciente
- [ ] Gráficos de evolução de exames
- [ ] Integração de dados de exames com relatórios

#### GRÁFICOS E RELATÓRIOS AVANÇADOS
- [ ] Gráficos dinâmicos interativos
- [ ] Comparativos de evolução com fotos lado a lado
- [ ] Relatórios PDF personalizados
- [ ] Dashboard de analytics para nutricionista
- [ ] Estatísticas gerais da carteira de pacientes

#### INTEGRAÇÕES E APIs
- [ ] Integração com API de suplementos (opcional)
- [ ] API para exportação de dados
- [ ] Webhooks para notificações externas

## 4. SEGURANÇA E CONFORMIDADE

### 4.1 LGPD E PRIVACIDADE
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Consentimento explícito do paciente
- [ ] Criptografia de dados sensíveis
- [ ] Logs de acesso e auditoria

### 4.2 BACKUP E SEGURANÇA
- [ ] Sistema de backup automático
- [ ] Criptografia de dados em repouso
- [ ] Criptografia de dados em trânsito
- [ ] Rate limiting nas APIs
- [ ] Validação e sanitização de inputs

## 5. PERFORMANCE E OTIMIZAÇÃO

### 5.1 OTIMIZAÇÕES
- [ ] Configuração do Redis para cache
- [ ] Otimização de imagens (compressão automática)
- [ ] Lazy loading de componentes
- [ ] Otimização de queries do banco
- [ ] CDN para arquivos estáticos

### 5.2 RESPONSIVIDADE
- [x] Design responsivo para mobile
- [x] Otimização para tablets
- [ ] Testes em diferentes dispositivos
- [ ] Performance mobile otimizada

## 6. TESTES E QUALIDADE

### 6.1 TESTES
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)
- [ ] Testes de performance
- [ ] Testes de segurança

### 6.2 MONITORAMENTO
- [ ] Sistema de logs estruturados
- [ ] Monitoramento de erros
- [ ] Métricas de performance
- [ ] Alertas de sistema

## 7. DEPLOY E PRODUÇÃO

### 7.1 CI/CD
- [ ] Pipeline de deploy automático (GitHub Actions)
- [ ] Deploy na Vercel
- [ ] Configuração de variáveis de ambiente
- [ ] Migrações automáticas de banco

### 7.2 PRODUÇÃO
- [ ] Configuração de domínio personalizado
- [ ] Certificado SSL
- [ ] Monitoramento de uptime (20/09/2025, 19:48 -03 - Configuração de serviço externo de monitoramento de uptime)
- [ ] Backup de produção configurado (20/09/2025, 19:48 -03 - Configuração de serviço externo de backup de produção)ção)