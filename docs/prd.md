PRD - Nutri Xpert Pro

1. Visão Geral do Produto  
O Nutri Xpert Pro é uma plataforma destinada a nutricionistas e pacientes, com o objetivo de centralizar e automatizar o acompanhamento nutricional, oferecendo uma experiência personalizada e escalável para a criação de dietas, monitoramento de progresso e gestão de avaliações.

1.1. Objetivo:  
Criar uma plataforma para nutricionistas que centralize **anamneses**, **painel de clientes**, **avaliações quinzenais (com fotos e gráficos de evolução)** e **gestão de dietas**, otimizada para dispositivos móveis, tablets e PCs.

1.2. MVP:  
- Ficha de **Anamnese**.  
- **Painel de Clientes**.  
- **Avaliação Quinzenal Básica** (peso, medidas e fotos).  
- **Banco de Alimentos** e **Dietas** personalizadas.  
- **Exportação de relatórios PDF**.

---

2. Funcionalidades do Sistema

2.1. Cadastro e Login  
2.1.1. **Login de Nutricionista**: Sistema de autenticação com email e senha.  
2.1.2. **Login de Paciente**: Acesso via email e senha.

2.2. Gestão de Pacientes  
2.2.1. **Cadastro de Paciente**: O nutricionista pode cadastrar pacientes com dados pessoais (nome, idade, sexo, profissão, etc.).  
2.2.2. **Atendimento Presencial ou Virtual**:  
  - O **atendimento presencial** ocorre no consultório, e o nutricionista preenche a **Ficha de Anamnese** junto ao paciente.  
  - O **atendimento virtual** pode ser feito de forma online, com o paciente preenchendo o formulário da anamnese **online** e enviando para o nutricionista via **email** ou link do sistema.

2.3. Avaliação Quinzenal  
2.3.1. **Avaliação Virtual**: Envio automático de email quinzenal solicitando o preenchimento de um novo formulário com **peso, medidas (pescoço, cintura e quadril) e 3 fotos** (frente, lado e costas).  
  - O formulário será enviado a cada 15 dias.  
  - Caso o paciente não envie, o **nutricionista será notificado** no painel de trabalho para que possa agir.  

2.3.2. **Avaliação Presencial**: O nutricionista escolhe se a avaliação será **presencial** de acordo com o reagendamento. O histórico será atualizado de acordo com a data da consulta.

2.3.3. **Histórico de Avaliações**: A cada avaliação, as **fotos** e **medidas** do paciente serão **atualizadas** e armazenadas no histórico, com as colagens de fotos comparando a primeira entrega e a mais recente para visualização do progresso.

2.3.4. **Gráficos**: Gráficos de **peso** e **medidas** serão gerados automaticamente com base nas avaliações, permitindo um acompanhamento visual da evolução do paciente.

2.4. Banco de Alimentos e Dietas  
2.4.1. **Tabela TACo**: O banco de alimentos usará a **Tabela TACo** para gerar as dietas personalizadas. O banco conterá alimentos com informações nutricionais (calorias, macronutrientes, etc.).  

2.4.2. **Dietas Automatizadas**:  
  - O sistema será capaz de sugerir dietas personalizadas com até **10 refeições**.  
  - O nutricionista poderá ajustar as **substituições de carboidratos e proteínas principais** de cada refeição, usando dados do banco de alimentos.  

2.4.3. **Geração de Dieta**: As dietas serão geradas com base nas necessidades energéticas (TMB, fator de atividade) do paciente.

2.5. Relatórios  
2.5.1. **Exportação em PDF**: O nutricionista poderá exportar relatórios com o histórico de avaliações do paciente, **fotos e gráficos de evolução**, e a dieta atualizada. Os relatórios poderão ser enviados diretamente para o paciente.

2.6. Notificações  
2.6.1. **Notificação de Pendências**: Caso o paciente não entregue o formulário de avaliação quinzenal (fotos, peso e medidas), uma **notificação** será gerada na área de trabalho do nutricionista.

2.7. Segurança e Privacidade  
2.7.1. **LGPD**: O sistema será em conformidade com a Lei Geral de Proteção de Dados (LGPD). Os dados dos pacientes serão criptografados e acessíveis apenas pelo nutricionista responsável.

2.7.2. **Autenticação**: Utilização de **NextAuth.js** para autenticação de usuários, com controle de permissões para nutricionistas e pacientes.

2.8. Tecnologias Utilizadas  
2.8.1. **Front-end**: Next.js (app dir) para SSR/SSG, otimizado para dispositivos móveis, tablets e PCs.  
2.8.2. **Back-end**: Node.js + TypeScript, com APIs otimizadas para chamadas de baixa latência.  
2.8.3. **Banco de Dados**: Neon (Postgres serverless) com Prisma ORM para queries e segurança row-level via filtros.  
2.8.4. **Armazenamento de Arquivos**: Vercel Blob ou AWS S3 + CDN (Cloudflare/ImageKit).  
2.8.5. **Fila / Jobs**: Redis + BullMQ para processamento de imagens e geração de thumbnails.  
2.8.6. **Gráficos**: Recharts / Chart.js para geração de gráficos dinâmicos.  
2.8.7. **CI/CD**: GitHub + GitHub Actions para deploy contínuo e migrações de banco de dados.

2.9. Interfaces e Usabilidade  
2.9.1. **Painel de Controle do Nutricionista**:  
  - Visualização do **histórico de fotos**, **gráficos** e **medidas**.  
  - Acesso fácil para criar, editar e visualizar **dietas** e **relatórios**.  
  - **Notificação de pendências** para pacientes com avaliações não entregues.  

2.9.2. **Interface do Paciente**:  
  - Acesso ao **formulário de anamnese**, **avaliações quinzenais** e **histórico de evolução**.  
  - Envio de **fotos e medidas** para o nutricionista.

---

3. Roadmap

3.1. Fase 1 - MVP  
3.1.1. **Cadastro e login**.  
3.1.2. **Ficha de anamnese** (presencial e online).  
3.1.3. **Avaliação quinzenal (virtual)**.  
3.1.4. **Banco de alimentos e dietas**.  
3.1.5. **Relatórios PDF**.  
3.1.6. **Notificações**.  
3.1.7. **Histórico de avaliações**.

3.2. Fase 2 - Pós-MVP  
3.2.1. **Avaliação presencial com reagendamento**.  
3.2.2. **Gráficos dinâmicos**.  
3.2.3. **Integração com API de suplementos (opcional)**.  
3.2.4. **Funcionalidade de exportação de PDF personalizada**.

---

Este PRD agora inclui a **avaliação presencial com reagendamento**, a **Tabela TACo** corretamente inserida, o **histórico de fotos e gráficos** para cada paciente e as **notificações automáticas** de pendências.