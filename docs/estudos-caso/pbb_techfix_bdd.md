## Técnico de Campo

### Catalogar equipamentos vistos

1. Acessar especificações de equipamentos<br>
**Critérios de Aceitação:**

    1. O técnico deve conseguir buscar as especificações de equipamentos cadastrados pelo nome ou código. <br>
    2. As especificações devem ser exibidas em uma interface clara e legível. <br>

    **BDD Positivo:** <br>
    Dado que o técnico acessou o sistema, <br>
    E existem equipamentos cadastrados no sistema, <br>
    Quando ele buscar o equipamento pelo nome "Impressora Laser X123", <br>
    Então as especificações completas desse equipamento devem ser exibidas corretamente. <br>

    **BDD Negativo:** <br>
    Dado que o técnico acessou o sistema, <br>
    não existem equipamentos com o nome ou código buscado, <br>
    Quando ele buscar por "Equipamento Inexistente", <br>
    Então o sistema deve exibir uma mensagem: "Nenhum equipamento encontrado." <br>

---

2. Registrar especificações de equipamentos <br>
**Critérios de Aceitação:** <br>

    1. O sistema deve permitir que o técnico insira especificações detalhadas, incluindo nome, modelo e descrição. <br>
    2. O registro deve ser validado antes de ser salvo. <br>

    **BDD Positivo:** <br>

    Dado que o técnico está na tela de cadastro de equipamentos, <br>
    E ele preenche os campos "Nome: Impressora Laser X123", "Modelo: 2024", "Descrição: Impressora a laser de alta velocidade", <br>
    Quando ele clicar no botão "Salvar", <br>
    Então o sistema deve exibir uma mensagem: "Equipamento cadastrado com sucesso!" <br>
    E o equipamento deve aparecer na listagem. <br>

    **BDD Negativo:** <br>
    Dado que o técnico está na tela de cadastro de equipamentos, <br>
    E ele preenche o campo "Nome" com "@" (um valor inválido), <br>
    Quando ele tentar salvar, <br>
    Então o sistema deve exibir uma mensagem: "Erro: Nome inválido. Insira um nome válido." <br>
    E o equipamento não deve ser salvo. <br>

---

3. Acessar histórico de equipamentos <br>
**Critérios de Aceitação:** <br>

    O técnico deve visualizar um histórico detalhado de ações realizadas em um equipamento específico.<br>
    O sistema deve permitir filtrar o histórico por data. <br>

    **BDD Positivo:** <br>
    Dado que o técnico acessou o sistema e escolheu o equipamento "Impressora Laser X123", <br>
    E existem registros no histórico desse equipamento, <br>
    Quando ele clicar no botão "Ver histórico", <br>
    Então o sistema deve exibir os registros associados a esse equipamento em ordem cronológica. <br>
    **BDD Negativo:** <br>
    Dado que o técnico acessou o sistema e escolheu o equipamento "Novo Equipamento", <br>
    E o histórico desse equipamento está vazio, <br>
    Quando ele clicar no botão "Ver histórico", <br>
    Então o sistema deve exibir uma mensagem: "Nenhum registro encontrado no histórico." <br>

---

4. Registrar histórico de equipamentos  
**Critérios de Aceitação:**

    1. O sistema deve permitir adicionar informações como data, descrição do evento e técnico responsável.  
    2. Todos os campos obrigatórios devem ser preenchidos.  

    **BDD Positivo:**  
    Dado que o técnico acessou o sistema e está na página de registro de histórico,  
    E ele preenche os campos "Data: 20/01/2025", "Descrição: Substituição do toner", "Técnico: João Silva",  
    Quando ele clicar no botão "Salvar",  
    Então o sistema deve exibir uma mensagem: "Histórico registrado com sucesso!"  
    E o registro deve ser adicionado ao histórico do equipamento.  

    **BDD Negativo:**  
    Dado que o técnico acessou o sistema e está na página de registro de histórico,  
    E ele deixa o campo "Descrição" em branco,  
    Quando ele clicar no botão "Salvar",  
    Então o sistema deve exibir uma mensagem: "Erro: O campo 'Descrição' é obrigatório."  
    E o registro não deve ser salvo.  

---

5. Deletar especificações de equipamentos  
**Critérios de Aceitação:**

    1. O sistema deve exibir uma mensagem de confirmação antes de excluir o equipamento.  
    2. Equipamentos não podem ser excluídos se estiverem associados a um histórico.  

    **BDD Positivo:**  
    Dado que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
    E clicou no botão "Excluir",  
    Quando ele confirmar a exclusão,  
    Então o sistema deve exibir uma mensagem: "Equipamento excluído com sucesso!"  
    E o equipamento deve ser removido do banco de dados.  

    **BDD Negativo:**  
    Dado que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
    E o equipamento está associado a um histórico,  
    Quando ele clicar no botão "Excluir",  
    Então o sistema deve exibir uma mensagem: "Erro: Não é possível excluir equipamentos com histórico associado."  

---

6. Editar especificações de equipamentos  
**Critérios de Aceitação:**

    1. O sistema deve permitir editar o nome, modelo e descrição de um equipamento.  
    2. As edições devem ser salvas apenas após validação.  

    **BDD Positivo:**  
    Dado que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
    E ele clicou no botão "Editar" e alterou o campo "Modelo" para "2025",  
    Quando ele clicar no botão "Salvar",  
    Então o sistema deve exibir uma mensagem: "Alterações salvas com sucesso!"  
    E os dados atualizados devem ser exibidos na listagem.  

    **BDD Negativo:**  
    Dado que o técnico acessou o sistema e visualizou o equipamento "Impressora Laser X123",  
    E ele clicou no botão "Editar" e alterou o campo "Modelo" para "####",  
    Quando ele tentar salvar,  
    Então o sistema deve exibir uma mensagem: "Erro: O modelo contém caracteres inválidos."  
    E as alterações não devem ser salvas.  

## Atendente

### Agendar serviço

7. Visualizar agenda  
**Critérios de Aceitação:**

    1. O atendente deve visualizar todos os agendamentos do dia, semana ou mês.  
    2. Deve ser possível filtrar por técnico ou cliente.  

    **BDD Positivo:**  
    Dado que o atendente acessou o sistema,  
    E existem agendamentos cadastrados,  
    Quando ele selecionar "Semana" e filtrar por "Técnico: João Silva",  
    Então o sistema deve exibir todos os agendamentos da semana para João Silva.  

    **BDD Negativo:**  
    Dado que o atendente acessou o sistema,  
    E não existem agendamentos cadastrados,  
    Quando ele tentar visualizar a agenda,  
    Então o sistema deve exibir uma mensagem: "Nenhum agendamento encontrado."  

---

8. Agendar cliente  
**Critérios de Aceitação:**

    1. O sistema deve permitir cadastrar um novo agendamento com cliente, data, horário e técnico responsável.  
    2. Não pode haver sobreposição de horários para o mesmo técnico.  

    **BDD Positivo:**  
    Dado que o atendente acessou o sistema,  
    E ele preencheu os campos "Cliente: Maria Souza", "Data: 22/01/2025", "Horário: 14h", "Técnico: João Silva",  
    Quando ele clicar no botão "Agendar",  
    Então o sistema deve exibir uma mensagem: "Agendamento criado com sucesso!"  
    E o agendamento deve ser adicionado à agenda.  

    **BDD Negativo:**  
    Dado que o atendente acessou o sistema,  
    E o técnico João Silva já possui um agendamento às 14h na mesma data,  
    Quando ele tentar criar um novo agendamento no mesmo horário,  
    Então o sistema deve exibir uma mensagem: "Erro: Técnico indisponível para o horário selecionado."  
    E o agendamento não deve ser criado.  

---

9. Cancelar agendamento  
**Critérios de Aceitação:**

    1. O atendente deve visualizar os detalhes do agendamento antes de cancelá-lo.  
    2. O sistema deve solicitar confirmação antes de realizar o cancelamento.  

    **BDD Positivo:**  
    Dado que o atendente acessou o sistema e selecionou o agendamento "Cliente: Maria Souza, Data: 22/01/2025, Horário: 14h",  
    Quando ele clicar no botão "Cancelar" e confirmar a ação,  
    Então o sistema deve exibir a mensagem: "Agendamento cancelado com sucesso!"  
    E o agendamento deve ser removido da agenda.  

    **BDD Negativo:**  
    Dado que o atendente acessou o sistema e selecionou o agendamento "Cliente: Maria Souza, Data: 22/01/2025, Horário: 14h",  
    Quando ele clicar no botão "Cancelar" e desistir da ação,  
    Então o sistema não deve excluir o agendamento,  
    E deve exibir a mensagem: "Cancelamento abortado."  

---

10. Visualizar histórico de serviços  
**Critérios de Aceitação:**

    1. O sistema deve exibir o histórico de serviços por cliente ou técnico.  
    2. Deve ser possível visualizar detalhes como data, tipo de serviço e status.  

    **BDD Positivo:**  
    Dado que o atendente acessou o sistema e buscou pelo cliente "João Pereira",  
    Quando ele clicar em "Ver histórico",  
    Então o sistema deve exibir todos os serviços realizados para o cliente, incluindo "Reparo de servidor, Data: 15/01/2025, Status: Concluído".  

    **BDD Negativo:**  
    Dado que o atendente acessou o sistema e buscou pelo cliente "Carlos Silva",  
    E não existem serviços registrados para esse cliente,  
    Quando ele clicar em "Ver histórico",  
    Então o sistema deve exibir a mensagem: "Nenhum histórico encontrado para este cliente."  

---

11. Notificar cliente sobre agendamento  
**Critérios de Aceitação:**

    1. O sistema deve enviar notificações por e-mail ou SMS ao cliente.  
    2. Deve ser possível incluir informações como data, horário e técnico responsável.  

    **BDD Positivo:**  
    Dado que o atendente criou um agendamento para "Maria Souza, Data: 22/01/2025, Horário: 14h",  
    Quando ele clicar em "Notificar cliente",  
    Então o cliente deve receber a mensagem: "Seu agendamento foi confirmado para 22/01/2025 às 14h com o técnico João Silva."  

    **BDD Negativo:**  
    Dado que o atendente acessou um agendamento incompleto,  
    E o campo "Data" está vazio,  
    Quando ele tentar notificar o cliente,  
    Então o sistema deve exibir a mensagem: "Erro: Não é possível enviar notificações para agendamentos incompletos."  

## Diretora de Operações

### Supervisionar tarefas

12. Cadastrar tarefas  
**Critérios de Aceitação:**

    1. O sistema deve permitir cadastrar tarefas com título, descrição e prazo de conclusão.  
    2. Campos obrigatórios devem ser validados antes de salvar.  

    **BDD Positivo:**  
    Dado que a diretora acessou o sistema e preencheu os campos "Título: Atualizar banco de dados", "Descrição: Revisar e aplicar scripts de correção", "Prazo: 25/01/2025",  
    Quando ela clicar em "Salvar",  
    Então a tarefa deve ser salva no sistema e exibida na lista de tarefas.  

    **BDD Negativo:**  
    Dado que a diretora acessou o sistema e preencheu apenas o campo "Título",  
    Quando ela tentar salvar a tarefa,  
    Então o sistema deve exibir a mensagem: "Erro: Todos os campos obrigatórios devem ser preenchidos."  
    E a tarefa não deve ser salva.  

---

13. Visualizar gráfico de desempenho  
**Critérios de Aceitação:**

    1. O sistema deve gerar gráficos de desempenho com base em tarefas concluídas e tempo de execução.  
    2. Deve ser possível escolher o período para análise.  

    **BDD Positivo:**  
    Dado que a diretora acessou o sistema,  
    E existem tarefas concluídas entre 01/01/2025 e 20/01/2025,  
    Quando ela selecionar o período e clicar em "Gerar gráfico",  
    Então o sistema deve exibir um gráfico com as métricas de desempenho.  

    **BDD Negativo:**  
    Dado que a diretora acessou o sistema,  
    E não existem tarefas concluídas no período de 01/01/2024 a 20/01/2024,  
    Quando ela clicar em "Gerar gráfico",  
    Então o sistema deve exibir a mensagem: "Nenhum dado encontrado para o período selecionado."  
