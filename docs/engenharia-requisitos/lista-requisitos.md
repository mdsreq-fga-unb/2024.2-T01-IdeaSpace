## Observações

Conforme reuniões com o cliente, foram levantados requisitos para diferentes usuários. A regra de negócio da empresa visa a padronização do questionário entre todas as suas turmas e instituições. Por isso, o banco de perguntas é global (único para todas as turmas) e um professor não terá a permissão de realizar modificações nas perguntas.

## Requisitos Funcionais

| ID   | Requisito                             | Descrição                                                                                         | Papel         |
| ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| RF1  | Responder questionário de avaliação      | O aluno pode acessar e responder os questionários disponibilizados durante o período de validade. | Aluno         |
| RF2  | Visualizar desempenho de questionário    | O aluno pode visualizar notas e feedbacks detalhados após o término do questionário.              | Aluno         |
| RF3  | Sistema de pontos nos questionários      | Os alunos ganham pontos ao acertarem questões nos questionários, incentivando maior engajamento.  | Aluno         |
| RF4  | Visualizar scoreboard                    | Os alunos podem visualizar uma classificação (scoreboard) com os melhores desempenhos.            | Aluno         |
| RF5  | Liberar acesso a questionário            | O professor pode liberar questionários com datas e horários definidos para início e término.      | Professor     |
| RF6  | Visualizar gráficos individuais por turma| O professor pode acessar gráficos para monitorar o desempenho individual de alunos por turma.     | Professor     |
| RF7  | Baixar gráficos                          | O professor pode exportar gráficos de desempenho em formatos como PDF ou imagem.                  | Professor     |
| RF8  | Vizualizar gráficos coletivos por turma  | O professor pode acessar gráficos para monitorar desempenho coletivo por turma.                   | Professor     |
| RF9  | Editar turma                             | O administrador pode modificar nome, descrição e período de turmas existentes.                    | Administrador |
| RF10 | Remover turma                            | O administrador pode excluir turmas, desde que não tenham vínculos ativos.                        | Administrador |
| RF11 | Adicionar usuário                        | O administrador pode criar usuários gerando login, senha e atribuindo papéis.                     | Administrador |
| RF12 | Editar usuário                           | O administrador pode alterar login, senha e papel do usuário.                                     | Administrador |
| RF13 | Excluir usuário                          | O administrador pode excluir usuários permanentemente.                                            | Administrador |
| RF14 | Adicionar professor em turma             | O administrador pode vincular professores a turmas específicas.                                   | Administrador |
| RF15 | Adicionar aluno em turma                 | O administrador pode vincular alunos a turmas específicas.                                        | Administrador |
| RF16 | Adicionar perguntas ao banco             | O administrador pode cadastrar perguntas com tema, dificuldade e tipo.                            | Administrador |
| RF17 | Editar perguntas no banco                | O administrador pode modificar textos, alternativas ou classificações de perguntas.               | Administrador |
| RF18 | Excluir perguntas do banco               | O administrador pode remover perguntas que não estejam vinculadas a questionários ativos.         | Administrador |
| RF19 | Visualizar perguntas do banco            | O administrador pode acessar a lista de perguntas com filtros como tema e dificuldade.            | Administrador |
| RF20 | Criar questionário                       | O administrador pode criar questionários a partir do banco de questões.                           | Administrador |
| RF21 | Editar questionário                      | O administrador pode modificar questionários existentes, alterando título, perguntas ou tema.     | Administrador |
| RF22 | Excluir questionário                     | O administrador pode excluir questionários que não tenham sido respondidos.                       | Administrador |
| RF23 | Visualizar gráficos globais              | O administrador pode acessar gráficos de desempenho geral com filtros por data, turma ou tema.    | Administrador |
| RF24 | Baixar gráficos                          | O administrador pode exportar gráficos para relatórios.                                           | Administrador |
| RF25  | Criar turma                             | O administrador pode criar turmas, especificando nome, descrição e período.                       | Administrador |

## Requisitos não funcionais

| Nome do requisito                                             | Campo do URPS+  | Descrição                                                                                                                                                                           |
| ------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tempo de resposta inferior a 2 segundos para cada consulta    | Desempenho      | As ações realizadas pelos usuários devem ter tempo de resposta inferior a 2 segundos.                                                                                               |
| Suporte a múltiplos dispositivos                              | Usabilidade     | A plataforma deve ser responsiva, funcionando bem em desktops, tablets e smartphones.                                                                                               |
| Garantir segurança dos dados de desempenho de usuário e login | Confiabilidade  | Os dados dos usuários devem ser armazenados de forma segura, com criptografia AES(Advanced Encrytion Standard) para dados sensiveis e Hashing com Salt para senhas onde necessário. |
| Capacidade de escalabilidade                                  | Suportabilidade | O sistema deve suportar aumento no número de usuários e questionários sem perda de desempenho.                                                                                      |
| Compatibilidade com múltiplos navegadores                     | Usabilidade     | O sistema deve ser compatível com os navegadores mais utilizados, como Chrome, Firefox e Edge, em sua versão mais recente (até o ano de 2024).                                      |
| Suporte de texto para múltiplos idiomas                       | Suportabilidade | O sistema deve ser capaz de suportar novos idiomas.                                                                                                                                 |
