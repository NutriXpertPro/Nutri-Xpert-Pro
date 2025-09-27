# Nutri Xpert Pro - Plan.md

## 1. Objetivo do Sistema

O sistema Nutri Xpert Pro é uma plataforma desenvolvida para nutricionistas e pacientes com o objetivo de otimizar a gestão de consultas, criação de dietas, monitoramento de evolução e reavaliações de pacientes. Ele deve ser responsivo, suportando dispositivos móveis (smartphones, tablets) e desktops. 

### 1.1 Funcionalidades Principais:
- Formulário de anamnese
- Avaliações quinzenais para pacientes virtuais
- Avaliação presencial com alertas de pendência
- Geração automática de gráficos de evolução
- Geração de relatórios em PDF
- Banco de alimentos (Tabela TACO)
- Gestão de pacientes (cadastro, histórico, etc.)

---

## 2. Requisitos Funcionais

### 2.1 Cadastro de Pacientes
- Paciente poderá ser cadastrado de forma presencial ou virtual.
- Os dados necessários para o cadastro incluem: nome, idade, sexo, profissão, histórico de saúde, dados de contato, entre outros.
- O nutricionista poderá acessar e editar os dados do paciente a qualquer momento.

### 2.2 Anamnese
- O formulário de anamnese será preenchido presencialmente ou virtualmente.
- Caso o atendimento seja virtual, o nutricionista enviará um link para o paciente preencher o formulário.
- O formulário será armazenado no banco de dados (Neon/PostgreSQL).

### 2.3 Avaliações
- **2.3.1 Avaliação Quinzenal (Virtual)**
    - Para pacientes virtuais, será necessário que o nutricionista reative um formulário quinzenal que inclui o envio de 3 fotos (frente, lado e costas), peso e medidas.
    - Caso o paciente não envie os dados após 15 dias, o sistema gera um alerta de pendência para o nutricionista.

- **2.3.2 Avaliação Presencial (30 dias)**
    - Para pacientes presenciais, a avaliação será feita diretamente pelo nutricionista durante a consulta.
    - O nutricionista será responsável por registrar peso, medidas e outras informações relevantes.
    - Caso o paciente não forneça os dados dentro do período de 30 dias, o sistema gera um alerta de pendência.

### 2.4 Geração de Gráficos de Evolução
- Para pacientes presenciais, o nutricionista pode inserir manualmente todas as medidas e gerar gráficos completos de evolução.
- Para pacientes virtuais, o sistema calcula automaticamente o percentual de gordura e massa magra, utilizando a fórmula da marinha:
  - **Homens**: Medição de pescoço e cintura.
  - **Mulheres**: Medição de pescoço, cintura e quadril.

### 2.5 Banco de Alimentos (Tabela TACO)
- O sistema integrará um banco de alimentos baseado na Tabela TACO para auxiliar na criação de dietas personalizadas.
- O nutricionista poderá adicionar, editar e excluir alimentos do banco, criando dietas de até 10 refeições com substituições.

### 2.6 Relatórios e Exportação
- O sistema permitirá que o nutricionista gere relatórios detalhados e gráficos de evolução.
- Relatórios poderão ser exportados em formato PDF ou compartilhados via web.

---

## 3. Segurança e Conformidade (LGPD)
- Todos os dados do paciente serão armazenados de forma segura, com criptografia de ponta a ponta.
- Será garantido que o sistema esteja em conformidade com a Lei Geral de Proteção de Dados (LGPD), com consentimento explícito do paciente.
- Haverá controle de acesso granular, com diferentes permissões para nutricionistas e pacientes.

---

## 4. Tecnologias Utilizadas

### 4.1 Front-End
- **Next.js** (App dir) para SSR/SSG e rotas seguras.
- **Tailwind CSS** para estilos responsivos e modernos.
- **React** para uma UI interativa.

### 4.2 Back-End
- **Node.js** + **TypeScript** para a lógica de negócios.
- **tRPC/Express** para APIs seguras e eficientes.
- **Neon/PostgreSQL** como banco de dados serverless com Prisma ORM.

### 4.3 Armazenamento
- **Vercel Blob** ou **AWS S3** para upload seguro de imagens (fotos de avaliações).
- **Redis** para cache de dados frequentes e sessões.

### 4.4 Integrações
- **SendGrid** para envio de emails automáticos.
- **Chart.js** para gráficos de evolução.
- **Prisma ORM** para gerenciar as consultas ao banco de dados.

---

## 5. Fluxos de Trabalho Detalhados

### 5.1 Fluxo de Avaliação Quinzenal (Virtual)
1. O sistema envia um email automático ao paciente a cada 15 dias solicitando fotos e medidas.
2. O paciente preenche o formulário de avaliação online.
3. O nutricionista recebe os dados do paciente, visualiza as fotos e medidas.
4. O sistema gera gráficos e comparativos de evolução.
5. O nutricionista pode exportar o relatório em PDF ou compartilhá-lo via web.

### 5.2 Fluxo de Avaliação Presencial (30 dias)
1. O nutricionista registra as medidas do paciente durante a consulta.
2. O nutricionista gera gráficos de evolução com as medidas registradas.
3. O nutricionista pode exportar o relatório ou gerar gráficos comparativos.

---

## 6. Exames Laboratoriais e Histórico

### 6.1 Histórico de Exames
- O paciente pode enviar exames laboratoriais periodicamente.
- O nutricionista poderá acessar o histórico de exames do paciente no sistema.
- O sistema irá gerar gráficos de evolução dos exames ao longo do tempo.

### 6.2 Integração Automática de Dados
- O sistema integra automaticamente os dados de exames com o histórico do paciente.
- Os gráficos de evolução dos exames serão atualizados sempre que novos exames forem enviados.

---

## 7. Roadmap do Projeto

### 7.1 Sprint 1: Inicialização
- Criação do sistema de login (NextAuth.js).
- Cadastro de pacientes e estrutura de banco de dados.
- Módulo de anamnese.

### 7.2 Sprint 2: Avaliações e Gráficos
- Implementação das avaliações quinzenais.
- Geração de gráficos de evolução (peso, medidas, percentual de gordura e massa magra).

### 7.3 Sprint 3: Dietas e Banco de Alimentos
- Criação do módulo de dietas e integração com o banco de alimentos TACO.
- Implementação de substituições alimentares.

### 7.4 Sprint 4: Relatórios e Exportação
- Geração de relatórios completos (PDF/Web).
- Funcionalidade de exportação de dietas e gráficos.

### 7.5 Sprint 5: Conformidade e Segurança
- Implementação de segurança de dados (LGPD).
- Implementação de backup e criptografia de dados.

---

## 8. Considerações Finais

Este sistema visa otimizar a gestão de consultas, dietas e avaliações para nutricionistas, promovendo uma experiência personalizada tanto para pacientes presenciais quanto virtuais. O foco é em garantir uma comunicação eficiente, com recursos de monitoramento e alertas para pendências, além de fornecer ferramentas poderosas para a criação de dietas e relatórios com base em dados dinâmicos.

---