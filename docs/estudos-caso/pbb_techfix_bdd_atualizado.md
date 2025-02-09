# Critérios de Aceitação e BDDs

# Técnico de Campo

## 1. Catalogar equipamentos vistos

### Acessar especificações de equipamentos

#### Critérios de Aceitação:

- O técnico deve conseguir buscar equipamentos cadastrados pelo nome ou código de identificação.
- O sistema deve exibir todas as especificações detalhadas do equipamento, incluindo nome, modelo, fabricante, número de série e descrição.
- A interface deve ser clara e legível, garantindo que todas as informações estejam organizadas e acessíveis.
- Caso o equipamento não seja encontrado, o sistema deve exibir uma mensagem informativa ao usuário.

#### BDD Positivo:

**Dado** que o técnico acessou o sistema,  
**E** existem equipamentos cadastrados no sistema,  
**Quando** ele buscar pelo nome "Impressora Laser X123" ou pelo código correspondente,  
**Então** o sistema deve exibir todas as especificações completas desse equipamento,  
**E** a informação deve estar corretamente formatada e legível.

#### BDD Negativo:

**Dado** que o técnico acessou o sistema,  
**E** não existem equipamentos com o nome ou código desejado,
**Quando** ele buscar por codigo ou nome,  
**Então** o sistema deve exibir a mensagem: "Nenhum equipamento encontrado.",  
**E** não deve apresentar informações incorretas ou vazias.

---

## 2. Registrar especificações de equipamentos

#### Critérios de Aceitação:

- O sistema deve permitir que o técnico cadastre novos equipamentos informando obrigatoriamente: nome, modelo, fabricante e descrição.
- O sistema deve validar os dados antes de salvar, impedindo caracteres inválidos, campos vazios ou dados inconsistentes.
- O equipamento cadastrado deve ser exibido corretamente na listagem de equipamentos.
- O sistema deve registrar a data e o usuário responsável pelo cadastro.

#### BDD Positivo:

**Dado** que o técnico acessou o sistema,  
**E** que o técnico acessou a tela de cadastro de equipamentos,  
**E** ele preencheu corretamente os campos "Nome: Impressora Laser X123", "Modelo: 2024", "Fabricante: HP", "Descrição: Impressora a laser de alta velocidade",  
**Quando** ele clicar no botão "Salvar",  
**Então** o sistema deve validar as informações,  
**E** exibir a mensagem: "Equipamento cadastrado com sucesso!",  
**E** o equipamento deve aparecer corretamente na listagem.

#### BDD Negativo:

**Dado** que o técnico acessou a tela de cadastro de equipamentos,  
**E** ele preencheu o campo "Nome" com caracteres inválidos como "@@@@@",  
**Ou** deixou campos obrigatórios em branco,  
**Quando** ele tentar salvar,  
**Então** o sistema deve exibir mensagens de erro correspondentes:

- "Erro: Nome inválido. Insira um nome válido."
- "Erro: O campo 'Modelo' é obrigatório."  
  **E** o equipamento não deve ser salvo.

---

## 3. Acessar histórico de equipamentos

#### Critérios de Aceitação:

- O técnico deve visualizar um histórico detalhado de todas as ações realizadas em um equipamento específico.
- O histórico deve conter data, ação realizada e o responsável pela ação.
- O sistema deve permitir a filtragem do histórico por data e tipo de ação.
- Caso não existam registros no histórico, o sistema deve exibir uma mensagem informativa.

#### BDD Positivo:

**Dado** que o técnico acessou o sistema e selecionou o equipamento "Impressora Laser X123",  
**E** existem registros no histórico desse equipamento,  
**Quando** ele clicar no botão "Ver histórico",  
**Então** o sistema deve exibir todos os registros desse equipamento em ordem cronológica,  
**E** permitir a filtragem dos registros por data ou tipo de ação.

#### BDD Negativo:

**Dado** que o técnico acessou o sistema e escolheu o equipamento "Novo Equipamento",  
**E** o histórico desse equipamento está vazio,  
**Quando** ele clicar no botão "Ver histórico",  
**Então** o sistema deve exibir a mensagem: "Nenhum registro encontrado no histórico."

---

## 4. Registrar histórico de equipamentos

#### Critérios de Aceitação:

- O sistema deve permitir adicionar registros ao histórico de equipamentos com as seguintes informações obrigatórias: data, descrição do evento e técnico responsável.
- O sistema deve impedir o registro de eventos sem informações obrigatórias.
- O novo registro deve ser adicionado ao histórico do equipamento e ficar visível na consulta do histórico.

#### BDD Positivo:

**Dado** que o técnico acessou o sistema
**E** está na página de registro de histórico,  
**E** ele preenche os campos obrigatórios: "Data: 20/01/2025", "Descrição: Substituição do toner", "Técnico: João Silva",  
**Quando** ele clicar no botão "Salvar",  
**Então** o sistema deve validar as informações,  
**E** exibir a mensagem: "Histórico registrado com sucesso!",  
**E** o registro deve ser adicionado ao histórico do equipamento.

#### BDD Negativo:

**Dado** que o técnico acessou o sistema e está na página de registro de histórico,  
**E** ele deixou o campo "Data" em branco,
**Ou** ele deixou o campo "Descrição" em branco,
**Ou** ele deixou o campo "Técnico" em branco,
**Quando** ele clicar no botão "Salvar",  
**Então** o sistema deve exibir a mensagem: "Erro: O campo é obrigatório." abaixo do campo vazio,
**E** o registro não deve ser salvo.

---

## 5. Deletar especificações de equipamentos

#### Critérios de Aceitação:

- O sistema deve permitir a exclusão de equipamentos cadastrados, desde que não possuam registros no histórico.
- O sistema deve exibir uma mensagem de confirmação antes de excluir um equipamento.
- Se um equipamento estiver associado a registros no histórico, a exclusão deve ser impedida e uma mensagem de erro deve ser exibida.
- Após a exclusão, o equipamento não deve mais aparecer na listagem.

#### BDD Positivo:

**Dado** que o técnico acessou o sistema
**E** visualizou o equipamento "Impressora Laser X123",  
**E** o equipamento não possui registros no histórico,  
**Quando** ele clicou no botão "Excluir",  
**Então** o sistema deve exibir a mensagem: "Tem certeza que deseja excluir?",
**Quando** ele confirmar a exclusão,
**Então** o sistema deve exibir a mensagem: "Equipamento removido com sucesso"
**E** o equipamento deve ser removido do banco de dados,  
**E** não deve mais aparecer na listagem de equipamentos.

#### BDD Negativo 1:

**Dado** que o técnico acessou o sistema
**E** visualizou o equipamento "Impressora Laser X123",  
**E** o equipamento não possui registros no histórico,  
**Quando** ele clicou no botão "Excluir",  
**Então** o sistema deve exibir a mensagem: "Tem certeza que deseja excluir?",
**Quando** ele não confirma a exclusão,  
**Então** deve voltar para a tela de registro do equipamento,  
**E** o equipamento não deve ser removido do banco de dados.

#### BDD Negativo 2:

**Dado** que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
**E** o equipamento está associado a registros no histórico,  
**Quando** ele clicar no botão "Excluir",  
**Então** o sistema deve exibir a mensagem: "Erro: Não é possível excluir equipamentos com histórico associado.",  
**E** a exclusão não deve ser permitida.

## 6. Editar especificações de equipamentos

### Critérios de Aceitação:

- O sistema deve permitir que o técnico edite as informações de um equipamento, incluindo nome, modelo, número de série, fabricante e descrição.
- O sistema deve validar os dados antes de salvar, impedindo a inclusão de caracteres inválidos, campos obrigatórios vazios ou dados inconsistentes.
- As edições devem ser salvas apenas após a confirmação do técnico.
- O sistema deve registrar a data e o usuário responsável pela edição no histórico do equipamento.

### BDD Positivo:

**Dado** que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
**E** ele clicou no botão "Editar" e alterou o campo "Modelo" para "2025",  
**E** preencheu corretamente os demais campos obrigatórios,  
**Quando** ele clicar no botão "Salvar",
**Então** o sistema deve exibir a mensagem: "Tem certeza que deseja alterar?",
**Quando** ele confirmar a exclusão,
**Então** o sistema deve validar as informações,  
**E** exibir a mensagem: "Alterações salvas com sucesso!",  
**E** os dados atualizados devem ser exibidos na listagem do equipamento,  
**E** a alteração deve ser registrada no histórico do equipamento, incluindo a data e o usuário responsável.

### BDD Negativo 1:

**Dado** que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
**E** ele clicou no botão "Editar" e alterou o campo "Modelo" para "2025",  
**E** preencheu corretamente os demais campos obrigatórios,  
**Quando** ele clicar no botão "Salvar",
**Então** o sistema deve exibir a mensagem: "Tem certeza que deseja alterar?",
**Quando** ele não confirmar a exclusão,
**Então** o sistema deve retornar para a tela de equipamento,  
**E** não deve alterar os dados do equipamento,  
**E** a alteração não deve ser registrada no histórico do equipamento, incluindo a data e o usuário responsável.

### BDD Negativo 2:

**Dado** que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
**E** ele clicou no botão "Editar" e alterou o campo "Modelo" para "@@@@@@",  
**Ou** deixou campos obrigatórios vazios,  
**Quando** ele tentar salvar,  
**Então** o sistema deve exibir uma mensagem de erro "Erro: O modelo contém caracteres inválidos." abaixo do campo com erro,
**Ou** o sistema deve exibir uma mensagem de erro "Erro: O campo 'Número de Série' é obrigatório." abaixo do campo vazio,
**E** as alterações não devem ser salvas.

---

# Atendente

## 7. Visualizar agenda

### Critérios de Aceitação:

- O atendente deve visualizar a agenda de serviços com opções de exibição por dia, semana ou mês.
- O sistema deve exibir os agendamentos com informações detalhadas, incluindo data, horário, cliente, serviço solicitado e técnico responsável.
- Deve ser possível filtrar os agendamentos por técnico e cliente.
- O sistema deve permitir a atualização automática dos agendamentos em tempo real.

### BDD Positivo:

**Dado** que o atendente acessou o sistema,  
**E** existem agendamentos cadastrados,  
**Quando** ele selecionar "Semana" e filtrar por "Técnico: João Silva",  
**Então** o sistema deve exibir todos os agendamentos da semana para João Silva,  
**E** os detalhes de cada agendamento devem ser apresentados, incluindo cliente, horário e status.

### BDD Negativo:

**Dado** que o atendente acessou o sistema,  
**E** não existem agendamentos cadastrados,  
**Quando** ele tentar visualizar a agenda,  
**Então** o sistema deve exibir uma mensagem: "Nenhum agendamento encontrado."

### BDD Negativo 2:

**Dado** que o atendente acessou o sistema,  
**E** existem agendamentos cadastrados,  
**E** o técnico que se deseja procurar não tem agendamentos para o período de tempo desejado
**Quando** ele selecionar "Semana" e filtrar por "Técnico: João Silva",  
**Então** o sistema deve exibir uma mensagem: "Nenhum agendamento encontrado para o técnico João Silva."

---

## 8. Agendar cliente

### Critérios de Aceitação:

- O sistema deve permitir que o atendente cadastre um novo agendamento informando obrigatoriamente: nome do cliente, data, horário, tipo de serviço e técnico responsável.
- O sistema deve validar se o técnico está disponível no horário selecionado.
- O sistema deve impedir o agendamento caso já exista outro serviço no mesmo horário para o técnico.
- O agendamento deve ser salvo e aparecer automaticamente na agenda após a confirmação.

### BDD Positivo:

**Dado** que o atendente acessou o sistema,  
**E** preencheu os campos obrigatórios: "Cliente: Maria Souza", "Data: 22/01/2025", "Horário: 14h", "Serviço: Manutenção de impressora", "Técnico: João Silva",  
**E** o técnico está disponível nesse horário,  
**Quando** ele clicar no botão "Agendar",  
**Então** o sistema deve validar as informações,  
**E** exibir a mensagem: "Agendamento criado com sucesso!",  
**E** o agendamento deve ser adicionado à agenda.

### BDD Negativo:

**Dado** que o atendente acessou o sistema,  
**E** o técnico João Silva já possui um agendamento no mesmo horário,  
**Quando** ele tentar criar um novo agendamento para esse técnico no mesmo horário,  
**Então** o sistema deve exibir a mensagem: "Erro: Técnico indisponível para o horário selecionado.",  
**E** o agendamento não deve ser criado.

### BDD Negativo 2:

**Dado** que o atendente acessou o sistema,  
**E** não preencheu os campos obrigatórios: "Cliente: Maria Souza", "Data: 22/01/2025", "Horário: 14h", "Serviço: Manutenção de impressora", "Técnico: João Silva",
**Ou** preencheu os campos obrigatórios: "Cliente", "Data", "Horário", "Serviço" e "Técnico" com algum caracter inválido,
**Quando** ele clicar no botão "Agendar",  
**Então** exibir a mensagem: "Erro: O campo é obrigatório." abaixo do campo vazio,  
**Ou** exibir a mensagem: "Erro: O campo contém caracteres inválidos." abaixo do campo vazio,  
**E** o agendamento não deve ser adicionado à agenda.

---

## 9. Cancelar agendamento

### Critérios de Aceitação:

- O atendente deve visualizar os detalhes do agendamento antes de cancelá-lo.
- O sistema deve exibir um pop-up de confirmação antes de concluir o cancelamento.
- O cancelamento deve ser registrado no histórico do cliente e do técnico.

### BDD Positivo:

**Dado** que o atendente acessou o sistema e selecionou o agendamento "Cliente: Maria Souza, Data: 22/01/2025, Horário: 14h",  
**Quando** ele clicar no botão "Cancelar" e confirmar a ação,  
**Então** o sistema deve exibir a mensagem: "Tem certeza que deseja excluir?",
**Quando** ele confirmar a exclusão,
**Então** o sistema deve exibir a mensagem: "Agendamento cancelado com sucesso!",  
**E** remover o agendamento da agenda,  
**E** registrar o cancelamento no histórico do cliente e do técnico.

### BDD Negativo 1:

**Dado** que o atendente acessou o sistema e selecionou o agendamento "Cliente: Maria Souza, Data: 22/01/2025, Horário: 14h",  
**Quando** ele clicar no botão "Cancelar" e confirmar a ação,  
**Então** o sistema deve exibir a mensagem: "Tem certeza que deseja excluir?",
**Quando** ele não confirmar a exclusão,
**Então** o sistema voltar para a tela de agendamento,  
**E** não remover o agendamento da agenda,  
**E** registrar não o cancelamento no histórico do cliente e do técnico.

### BDD Negativo 2:

**Dado** que o atendente acessou o sistema e selecionou um agendamento,  
**Quando** ele clicar no botão "Cancelar" e desistir da ação,  
**Então** o sistema não deve excluir o agendamento,  
**E** deve exibir a mensagem: "Cancelamento abortado."

---

# Diretora de Operações

## 12. Cadastrar tarefas

### Critérios de Aceitação:

- O sistema deve permitir o cadastro de tarefas informando obrigatoriamente: título, descrição, prazo de conclusão e responsável.
- O sistema deve impedir o cadastro de tarefas com informações inválidas ou incompletas.
- A tarefa deve ser salva corretamente e estar acessível na lista de tarefas.

### BDD Positivo:

**Dado** que a diretora acessou o sistema e preencheu os campos obrigatórios:  
"Título: Atualizar banco de dados", "Descrição: Revisar e aplicar scripts de correção", "Prazo: 25/01/2025", "Responsável: Ana Lima",  
**Quando** ela clicar em "Salvar",  
**Então** o sistema deve validar os dados,  
**E** exibir a mensagem: "Tarefa cadastrada com sucesso!",  
**E** a tarefa deve ser exibida na lista de tarefas.

### BDD Negativo:

**Dado** que a diretora acessou o sistema e preencheu apenas o campo "Título",
**Ou** que a diretora acessou o sistema e preencheu apenas o campo "Descrição",
**Ou** que a diretora acessou o sistema e preencheu apenas o campo "Prazo",  
**Ou** que a diretora acessou o sistema e preencheu apenas o campo "Responsável",  
**Quando** ela tentar salvar a tarefa,  
**Então** o sistema deve exibir a mensagem: "Erro: Todos os campos obrigatórios devem ser preenchidos.",  
**E** a tarefa não deve ser salva.

---

## 13. Visualizar gráfico de desempenho

### Critérios de Aceitação:

- O sistema deve gerar gráficos de desempenho com base em tarefas concluídas e tempo de execução.
- Se deve ser capaz de selecionar o período de tempo que será usado para gerar o gráfico.
- Deve gerar pop - ups com mensagens de sucesso antes de mostrar o gráfico ou falha no caso de um erro.

### BDD Positivo:

**Dado** que a diretora acessou o sistema,
**E** está na tela de gráficos de desempenho,
**E** existem tarefas concluídas no periodo desejado,
**Quando** Quando ela selecionar "Data de início: 01/01/2025" e "Data final: 20/01/2025",
**E** ela clicar em "Gerar gráfico",
**Então** o sistema deve exibir a mensagem: "Gráfico gerado com sucesso!",  
**E** exibir um gráfico com as métricas de desempenho.

### BDD Negativo:

**Dado** que a diretora acessou o sistema,
**E** está na tela de gráficos de desempenho,
**E** não existem tarefas concluídas no periodo desejado,
**Quando** Quando ela selecionar "Data de início: 01/01/2025" e "Data final: 20/01/2025",
**E** ela clicar em "Gerar gráfico",
**Então** o sistema deve exibir a mensagem: "Erro: Nenhum dado encontrado para o período selecionado.",  
**E** voltar para a tela de gráficos de desempenho.

---
