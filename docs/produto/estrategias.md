## Estratégia Priorizada

**Abordagem**: Ágil

**Ciclo de Vida**: Incremental e Iterativo

**Processo**: ScrumXP

## Quadro Comparativo
    
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

!!! info "Referências"
    - **GOMES, ANDRÉ.** Scrum: o Framework Mínimo Viável. Disponível em: [LinkedIn](https://www.linkedin.com/pulse/scrum-o-framework-m%C3%ADnimo-vi%C3%A1vel-andr%C3%A9-gomes)
    - **SCHWABER, KEN.** SCRUM Development Process. Disponível em: [JeffSutherland](http://www.jeffsutherland.org/oopsla/schwapub.pdf)
    - **CIPULLO, GIOVANNA.** RAD: você sabe como funciona o desenvolvimento ágil de aplicações? Disponível em: [Korp](https://www.korp.com.br/rad-voce-sabe-como-funciona-o-desenvolvimento-agil-de-aplicacoes/)


## Justificativa
    
-   **Maior Escalabilidade**: ScrumXP é mais adequado para equipes com projetos em crescimento. Ele possui papéis e processos bem definidos que permitem uma expansão maior do projeto. RAD, por outro lado, tende a se ajustar melhor a projetos pequenos, fazendo com que a sua expansão seja limitada .

-   **Maior Flexibilidade nos Requisitos**: ScrumXP permite revisões e ajustes de requisitos a cada sprint, essencial para um projeto que precisa se adaptar rapidamente ao feedback e às demandas do cliente. RAD, por focar em protótipos rápidos, pode não acompanhar mudanças frequentes no mesmo nível de detalhe.

-   **Integração Contínua  com o Cliente**: ScrumXP envolve o cliente de forma constante, promovendo feedback a cada sprint. No RAD, o feedback do cliente é mais pontual e menos estruturado, o que pode resultar em um desalinhamento nos requisitos ao longo do projeto.
