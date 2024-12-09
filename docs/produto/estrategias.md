## Estratégias de Engenharia de Software
    
### Estratégia Priorizada

**Abordagem**: Ágil

**Ciclo de Vida**: Incremental e Iterativo

**Processo**: ScrumXP


### Quadro Comparativo
    
O quadro a seguir, apresenta algumas características relacionadas ao RAD e ao ScrumXP, visando auxiliar no entendimento e justificativa da escolha do processo mais adequado ao caso da Ideia Space.

| 	Características 	|	 RAD	 |	ScrumXP	|
|---|---|---| 
|	**Abordagem Geral** | Iterativo e incremental orientado à prototipagem e adaptação.|Iterativo e incremental com foco em entregas rápidas e feedback contínuo.
|**Foco em Arquitetura**|	Arquitetura básica e flexível que pode ser rapidamente adaptada. A estrutura arquitetural inicial tende a ser simples, permitindo ajustes conforme as necessidades surgem ao longo do desenvolvimento. |	Arquitetura que evolui gradualmente, adaptando-se ao longo dos sprints. O foco é garantir uma estrutura flexível que responda às mudanças sem precisar de uma definição completa logo no início.
|**Estrutura de Processos**|	Organiza o processo em fases rápidas: planejamento, design, construção e implementação. Visa colocar uma versão funcional do produto nas mãos dos usuários o quanto antes.|Estruturado em sprints de 2-4 semanas, com entregas incrementais e feedback contínuo.|
|**Flexibilidade de Requisitos**|	Permite alterações de requisitos rapidamente entre as fases, adaptando-se ao feedback dos usuários e às mudanças de demanda sem um processo rígido de controle de escopo.|	Alta flexibilidade, permitindo mudanças de requisitos a cada sprint com base no feedback obtido.|
|**Colaboração com Cliente**| O cliente é envolvido diretamente em cada fase de prototipagem, revisando as versões iniciais do produto e fornecendo feedback para orientar melhorias e ajustes imediatos.	|	Envolve o cliente continuamente, buscando seu feedback ao final de cada sprint para garantir que o produto evolua conforme as expectativas e necessidades.
|**Complexidade do Processo** |Simples e rápido, com foco na prototipagem e na entrega de resultados visíveis em menor tempo. Reduz etapas complexas de planejamento e documentação. |Leve e ágil, com foco na entrega funcional e menos foco na documentação formal. Papéis e etapas bem definidos, facilitando a adaptação e o gerenciamento de tarefas.
|**Qualidade Técnica** |A velocidade do RAD pode resultar em uma menor atenção inicial à qualidade técnica. A prioridade está em alcançar rapidamente uma versão funcional, e revisões de qualidade são feitas posteriormente.|Inclui práticas de qualidade como TDD (Test-Driven Development), integração contínua e pair programming, que garantem um código limpo e funcional.
|**Práticas de Desenvolvimento**| A prototipagem rápida é o foco central, com práticas de desenvolvimento centradas em construir versões funcionais e viáveis, visando adaptações e melhorias ágeis durante o processo. |Inclui práticas técnicas robustas como TDD, refatoração contínua, integração contínua e pair programming,promovendo alta qualidade no código.
|**Adaptação ao Projeto da Ideia Space**| Ideal para projetos que precisam de uma primeira versão rápida e visualizável para validação inicial, ideal para um ambiente em que o feedback imediato pode acelerar decisões de produto.|Ideal para projetos que exigem interação e adaptação contínuas, pois permite responder a mudanças de forma rápida, mantendo o cliente envolvido em cada ciclo de desenvolvimento.
|**Documentação**|Documentação leve, com pouca estrutura formal, priorizando rapidez.|Documentação mínima e essencial, focada em comunicação ágil e feedback.
|**Controle de Qualidade**|Feito após a prototipagem inicial. A ênfase é em revisar o produto após cada fase, possibilitando ajustes incrementais para refinar a qualidade conforme necessário.| Controle de qualidade embutido nas práticas do XP e em revisões em cada sprint, garantindo que o software seja testado a cada nova funcionalidade.|
**Escalabilidade**|Mais adequado para equipes pequenas e projetos de menor escala, onde uma coordenação mais leve e rápida é viável. |Escalável, mas mais indicado para equipes menores e médias devido à sua abordagem colaborativa e interativa constante.
|**Suporte a Equipes de Desenvolvimento**|Funciona bem em equipes pequenas, com desenvolvedores envolvidos diretamente nas fases rápidas de prototipagem. Não há papéis definidos formalmente, incentivando uma estrutura de trabalho colaborativa e ágil.|Suporta equipes menores e mais colaborativas, com papéis mais flexíveis, permitindo maior adaptação ao ritmo do projeto.

 >Blibliografia
 >
 >GOMES, ANDRÉ: Scrum: o Framework Mínimo Viável. Disponível em: https://www.linkedin.com/pulse/scrum-o-framework-m%C3%ADnimo-vi%C3%A1vel-andr%C3%A9-gomes
 >
 > SCHWABER, KEN: SCRUM Development Process. Disponível em: http://www.jeffsutherland.org/oopsla/schwapub.pdf
 >
 > CIPULLO, GIOVANNA: RAD: você sabe como funciona o desenvolvimento ágil de aplicações? Disponível em: https://www.korp.com.br/rad-voce-sabe-como-funciona-o-desenvolvimento-agil-de-aplicacoes/


### Justificativa
    
-   **Maior Escalabilidade**: ScrumXP é mais adequado para equipes com projetos em crescimento. Ele possui papéis e processos bem definidos que permitem uma expansão maior do projeto. RAD, por outro lado, tende a se ajustar melhor a projetos pequenos, fazendo com que a sua expansão seja limitada .

-   **Maior Flexibilidade nos Requisitos**: ScrumXP permite revisões e ajustes de requisitos a cada sprint, essencial para um projeto que precisa se adaptar rapidamente ao feedback e às demandas do cliente. RAD, por focar em protótipos rápidos, pode não acompanhar mudanças frequentes no mesmo nível de detalhe.

-   **Integração Contínua  com o Cliente**: ScrumXP envolve o cliente de forma constante, promovendo feedback a cada sprint. No RAD, o feedback do cliente é mais pontual e menos estruturado, o que pode resultar em um desalinhamento nos requisitos ao longo do projeto.


# ENGENHARIA DE REQUISITOS

## Atividades e Técnicas de ER

### Planejamento da Release

#### Elicitação e Descoberta:
- **Entrevistas:** Entrevistas realizadas com o cliente, representante da Ideia Space, com o objetivo de entender melhor suas expectativas (associada a prioridades e necessidades) para uma nova versão.
- **Brainstorming:** Reuniões que permitem o surgimento de novas ideias para agregar na solução do produto de software.

#### Análise e Consenso:
- **Storyboarding:** Narrativa para ilustrar o funcionamento esperado de novas funcionalidades.
- **Mapas mentais:** Utilização de mapas mentais para a organização de ideias e desenvolvimento de conceitos quando informações relacionadas ao produto não estão claras.
- **Sessões de validação:** Apresentação e validação de propostas com o cliente e a equipe para alinhamento e consenso.
- **Análise de custo-benefício:** Avaliação do impacto e custo de cada funcionalidade para definição da melhor escolha no momento.

#### Declaração de Requisitos:
- **Critérios de aceitação:** Estabelecer critérios para cada funcionalidade para ajudar na validação e desenvolvimento.
- **Temas, Épicos e User Stories:** A organização dos requisitos em diferentes níveis proporciona uma melhor clareza do que deve ser desenvolvido.

### Planejamento da Sprint

#### Elicitação e Descoberta:
- **Refinamento de Requisitos:** Revisão e detalhamento dos requisitos no backlog, priorizando os itens para a sprint.
- **Análise Documental:** Avaliação de relatórios ou registros existentes para detalhar requisitos adicionais.

#### Análise e Consenso:
- **Planning Poker:** Estimativa colaborativa do esforço e complexidade dos requisitos priorizados.
- **Diagramas de Sequência:** Representação visual de fluxos entre componentes do sistema para facilitar o entendimento técnico.
- **Discussões Técnicas:** Reuniões entre desenvolvedores para identificar dependências e alinhar estratégias de implementação.

#### Declaração:
- **Definition of Done (DoD):** Lista de critérios para considerar uma funcionalidade concluída, incluindo testes e validações.
- **Critérios de Aceitação Detalhados:** Requisitos objetivos para validar que a funcionalidade atende às expectativas do cliente.
- **Kanban:** Utilizado para organizar e rastrear o progresso dos itens da sprint em colunas como "Planejado", "Em Progresso", "Em Teste" e "Concluído", proporcionando visibilidade contínua do status das funcionalidades e alinhamento com o DoD e os Critérios de Aceitação.

#### Organização e Atualização:
- **Revisão do Backlog com Critérios DEEP:** Garantia de que os itens do backlog estão Detalhados, Estimáveis e Priorizados.
- **Priorização WSJF (Weighted Shortest Job First):** Técnica para priorizar tarefas com base em valor comercial, urgência e esforço necessário.

---

### Execução da Sprint

#### Elicitação e Descoberta:
- **Daily Scrum:** Reuniões diárias rápidas, geralmente de 15 minutos, realizadas para alinhar o progresso da equipe, identificar impedimentos e planejar as atividades do dia.

#### Representação:
- **Protótipos:** Utilizados para validar a interface e o fluxo de funcionalidades antes do desenvolvimento completo. Eles permitem que a equipe visualize o produto final e realizem ajustes necessários no início da execução.

#### Verificação e Validação:
- **Revisões de Código:** Atividade realizada entre pares para garantir que o código atenda aos padrões de qualidade e esteja alinhado aos requisitos.
- **Testes Automatizados:** Utilização de pipelines de integração contínua (CI) para validar o funcionamento correto das funcionalidades desenvolvidas.

#### Desenvolvimento Colaborativo:
- **Pair Programming:** Técnica onde dois desenvolvedores trabalham juntos no mesmo código, alternando os papéis de "piloto" (quem escreve) e "navegador" (quem revisa).

#### Organização e Atualização:
- **Kanban:** Quadro visual para acompanhar o progresso dos itens, com colunas como "Planejado", "Em Progresso", "Em Teste" e "Concluído", proporcionando visibilidade contínua do progresso da sprint.

---

### Revisão de Sprint

#### Verificação e Validação:
- **Checklist de Validação:** Garantir que os requisitos implementados atendem a todas as necessidades do cliente; apenas requisitos que completam totalmente o checklist serão apresentados.
- **Checklist de Verificação:** Garante que os requisitos implementados foram realizados corretamente; requisitos que não completem a checklist não poderão ser apresentados.
- **Definition of Done (DoD):** Será usado como base para a elaboração das checklists de validação e verificação.
- **Feedback do Cliente:** Durante a reunião de revisão, os comentários e sugestões do cliente sobre os requisitos implementados que foram apresentados serão documentados para uso futuro.
- **Revisão Informal:** A forma de apresentar os requisitos implementados ao cliente será por meio de demonstrações e explicações do seu funcionamento. As explicações serão orais e não se concentrarão muito no aspecto técnico, favorecendo casos de uso práticos.

#### Análise e Consenso:
- **Análise de Custo / Benefício:** Verificar se as modificações e sugestões apresentadas pelo cliente geram valor suficiente para o negócio para serem implementadas.
- **Análise de Risco / Viabilidade:** Revisar, considerando o conhecimento do equipamento e as limitações do software utilizado, se é possível implementar as modificações e sugestões apresentadas pelo cliente.
- **Casos de Uso:** Verificar se existem casos de uso para as modificações e sugestões apresentadas pelo cliente para determinar se tais funcionalidades são necessárias. Caso existam, verificar o que deveria ou não ser permitido em cada uma delas.

---

### Retrospectiva da Sprint

#### Análise e Organização:
- **Feedback da Equipe:** Coleta de opiniões dos membros da equipe sobre pontos positivos e desafios enfrentados, com foco na melhoria contínua do processo.

#### Atualização do Processo:
- **Definição de Ações Corretivas:** Planejamento de medidas para resolver os problemas identificados durante a sprint e melhorar a colaboração e eficiência do time.

### Planejamento da Próxima Release

#### Elicitação e Descoberta:
- **Revisão de Requisitos Pendentes:** Avaliação dos requisitos que não foram concluídos em sprints anteriores para decidir se ainda são relevantes e devem ser priorizados na próxima release.
- **Revisão do Backlog:** Análise do backlog existente para identificar requisitos alinhados com os objetivos do projeto e as necessidades do cliente.

#### Análise e Consenso:
- **Priorização MoSCoW:** Técnica utilizada para classificar os requisitos em Must Have, Should Have, Could Have e Won’t Have, permitindo uma priorização clara baseada em impacto e valor.
- **Estimativas de Esforço e Tempo:** Utilização de práticas como o Planning Poker para estimar o esforço necessário para implementar cada requisito e prever o cronograma da próxima release.

#### Declaração:
- **Definição de Objetivos da Release:** Estabelecimento das metas da próxima release por meio de sessões de brainstorming e reuniões colaborativas, garantindo alinhamento entre a equipe e os stakeholders.

#### Organização e Atualização:
- **Backlog Organizado:** Aplicação de técnicas para organizar e priorizar os requisitos do backlog, garantindo que estejam prontos para o início do desenvolvimento.
- **Atualização do Backlog:** Revisão contínua do backlog para refletir as mudanças nas prioridades e no escopo do projeto.



### Engenharia de Requisitos e ScrumXP

| **Fases do Processo**          | **Atividades ER**                  | **Prática**                     | **Técnica**                                                      | **Resultado Esperado**                                                                 |
|--------------------------------|------------------------------------|---------------------------------|------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| **Planejamento da Release**    | **Elicitação e Descoberta**        | Levantamento de requisitos      | Entrevistas, brainstorming                                       | Requisitos na sua forma mais bruta levantados                                        |
|                                | **Análise e Consenso**             | Confirmação dos requisitos       | Mapas mentais, sessões de validação, análise de custo-benefício, storyboarding | Entendimento dos requisitos levantados e seleção para a release                     |
|                                | **Declaração**                     | Registro dos requisitos confirmados | Critérios de aceitação, temas, épicos e user stories              | Registros que auxiliam no desenvolvimento e validação das funcionalidades            |
| **Planejamento da Sprint**     | **Refinamento de Requisitos**      | Revisão Colaborativa            | Análise Documental                                               | Requisitos detalhados e prontos para desenvolvimento                                |
|                                | **Estimativa e Priorização**       | Estimativa de Complexidade       | Planning Poker                                                   | Requisitos priorizados com estimativas consensuais entre a equipe                   |
|                                | **Representação de Fluxos**        | Planejamento Técnico             | Diagramas de Sequência                                           | Fluxos entre componentes do sistema detalhados para facilitar o entendimento técnico |
|                                | **Discussões Técnicas**            | Definição de Padrões             | Reuniões entre desenvolvedores                                   | Estratégias alinhadas para resolver dependências e implementar requisitos            |
|                                | **Validação de Conclusão**         | Planejamento Visual              | Kanban, Definition of Done (DoD)                                 | Funcionalidades validadas conforme critérios predefinidos e organizadas visualmente  |
|                                | **Revisão do Backlog**             | Alinhamento Estratégico          | Critérios DEEP, Priorização WSJF                                 | Backlog refinado, com tarefas organizadas, priorizadas e alinhadas com os objetivos  |
| **Execução da Sprint**         | **Alinhamento Diário**             | Planejamento Operacional         | Daily Scrum                                                      | Progresso da equipe alinhado diariamente, com impedimentos identificados e resolvidos rapidamente |
|                                | **Desenvolvimento Colaborativo**   | Colaboração entre Desenvolvedores | Pair Programming                                                 | Código desenvolvido com maior qualidade e compartilhamento de conhecimento entre os membros da equipe |
|                                | **Validação de Interface**         | Prototipagem Ágil                | Protótipos                                                       | Interface e fluxo validados antes do desenvolvimento completo, reduzindo retrabalho |
|                                | **Garantia de Qualidade**          | Revisão Contínua                 | Revisões de Código, Testes Automatizados                         | Funcionalidades desenvolvidas com qualidade garantida e alinhadas aos requisitos     |
|                                | **Rastreamento do Progresso**      | Monitoramento Visual             | Kanban                                                           | Progresso visualizado e rastreado continuamente, com itens atualizados durante a sprint |
| **Revisão da Sprint**          | **Verificação e Validação**        | Definição de requisitos a serem apresentados | Checklist de Validação, Checklist de Verificação, Definition of Done (DoD) | Lista de requisitos que serão apresentados ao cliente para revisão                  |
|                                |    **Verificação e Validação**                                | Aprovação ou rejeição dos requisitos implementados | Feedback do cliente, Revisão informal                             | Requisito concluído, lista de modificações a serem feitas                           |
|                                | **Análise e Consenso**             | Definição de novos requisitos     | Análise de Custo / Benefício, Análise de Risco / Viabilidade, Casos de Uso | Lista de Requisitos RFs e RNFs com base nas modificações solicitadas pelo cliente   |
| **Retrospectiva da Sprint**    | **Feedback da Equipe**             | Análise e Organização             | Discussões em Grupo                                               | Opiniões coletadas sobre pontos positivos e desafios enfrentados na sprint           |
|                                | **Definição de Ações Corretivas**  | Atualização do Processo           | Planejamento de Melhorias                                        | Medidas planejadas para resolver problemas e melhorar a eficiência do time          |
| **Planejamento da Próxima Release** | **Organização e Atualização**     | Revisão dos Requisitos Pendentes  | Revisão do backlog                                               | Requisitos alinhados e priorizados novamente                                         |
|                                | **Análise e Consenso, Representação** | Priorização e Seleção de Requisitos | Técnica MoSCoW                                                   | Backlog organizado                                                                   |
|                                | **Análise e Consenso**             | Estimativas de Esforço e Tempo    | Planning Poker                                                   | Previsão de cronograma                                                               |
|                                | **Análise e Consenso**             | Definição dos Objetivos da Release | Brainstorm, reuniões entre a equipe, entrevistas                 | Metas da release definidas                                                          |
