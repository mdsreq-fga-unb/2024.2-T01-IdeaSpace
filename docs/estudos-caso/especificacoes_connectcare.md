# Especificação de Casos de Uso: ConnectCare  

## 1. Caso de Uso: Localizar Serviços de Saúde  

### Breve Descrição  
Este caso de uso permite que o paciente localize serviços como hospitais, clínicas e campanhas de saúde nas proximidades de sua localização.
 

### Ator  
Paciente

### Fluxo Básico de Eventos  
 
1. O paciente acessa o aplicativo "ConnectCare".
2. O paciente insere informações de localização (como cidade ou bairro) ou permite acesso à localização GPS do dispositivo.
3. O sistema exibe uma lista de serviços de saúde próximos (clínicas, hospitais, campanhas de saúde).
4. O paciente filtra os resultados com base em critérios como tipo de atendimento (consulta médica, vacina, etc.) e disponibilidade.
5. O paciente seleciona o serviço de saúde desejado.
6. O sistema exibe os detalhes do serviço, incluindo endereço, horário de funcionamento e informações adicionais.
7. O paciente decide se deseja agendar ou buscar mais informações sobre o serviço.


#### Fluxos Alternativos 

FA01: Falha na Localização

1. O paciente tenta acessar o serviço de localização no aplicativo.
2. O sistema não consegue acessar a localização GPS ou o paciente não fornece a localização.
3. O sistema solicita que o paciente insira manualmente a localização (endereço ou nome da cidade).
4. O paciente insere os dados e o sistema mostra os serviços de saúde próximos à localização fornecida.

FA02: Nenhum Serviço Encontrado

1. O paciente localiza serviços de saúde usando o aplicativo.
2. O sistema retorna uma mensagem informando que não há serviços disponíveis nas proximidades.
3. O sistema sugere opções alternativas, como agendar uma consulta em unidades mais distantes ou participar de campanhas móveis de atendimento.
4. O paciente decide uma das opções alternativas ou tenta outra busca com critérios diferentes.


### Fluxos de Exceção  

FE01: Falha no Acesso ao GPS

1. O paciente tenta acessar a funcionalidade de localização para buscar serviços de saúde.
2. O sistema não consegue acessar o GPS do dispositivo do paciente devido a problemas técnicos (ex.: falha na permissão de acesso ou erro no GPS).
3. O sistema exibe uma mensagem de erro informando que a localização não pôde ser obtida.
4. O paciente é solicitado a tentar novamente ou a inserir manualmente a localização.
5. Se o erro persistir, o sistema recomenda ao paciente que use a versão web do sistema ou entre em contato com o suporte.

FE02: Falha na Conexão com a Internet

1. O paciente tenta usar o sistema para localizar os serviços de saúde.
2. O sistema detecta que não há conexão com a internet ou que a conexão está instável.
3. O sistema exibe uma mensagem de erro indicando que a busca não pode ser realizada sem uma conexão estável.
4. O paciente é orientado a verificar sua conexão e tentar novamente.
5. Se o problema persistir, o paciente pode optar por consultar os serviços mais tarde ou utilizar outro dispositivo com acesso à internet.


### Pré-Condições 

O paciente deve estar autenticado no sistema (caso seja necessário).
O sistema deve ter acesso à localização do paciente ou informações de geolocalização fornecidas pelo usuário (se for uma funcionalidade de pesquisa baseada em proximidade).
O paciente deve ter fornecido informações básicas sobre o tipo de serviço desejado (ex: consulta médica, vacina, exames, etc.).

### Pós-Condições

O sistema retorna uma lista de serviços de saúde (clínicas, hospitais, campanhas, etc.) próximos ao paciente, com base nos filtros (localização, tipo de serviço e disponibilidade).
O paciente consegue visualizar os detalhes do serviço selecionado (endereço, horário de funcionamento, descrição, etc.).
Caso o paciente selecione um serviço, o sistema oferece informações adicionais, como o agendamento de consultas, se aplicável.

### Pontos de Extensão

Agendar Consulta: Após localizar um serviço de saúde (por exemplo, uma clínica ou hospital), o paciente pode agendar uma consulta diretamente a partir da informação do serviço encontrado.
Registrar e Divulgar Campanha de Saúde: O paciente também pode visualizar campanhas de saúde enquanto localiza os serviços, o que pode ser um ponto de extensão de campanhas locais de saúde, como vacinação ou exames gratuitos.

### Regras de Negócio

RN01: Filtragem de Serviços

Os serviços de saúde (clínicas, hospitais, campanhas) devem ser filtrados com base em localização (endereço, proximidade) e disponibilidade (horários de funcionamento).
A plataforma deve oferecer serviços de saúde próximos ao usuário, considerando a geolocalização do paciente e a proximidade mais rápida possível.

RN02: Disponibilidade de Serviços

O sistema deve exibir apenas serviços de saúde que estão disponíveis em tempo real, considerando os horários de funcionamento e os serviços ativos naquele momento.

RN03: Definir Tipos de Serviços

O sistema deve classificar os serviços de saúde conforme sua natureza: consultas médicas, vacinação, campanhas de saúde, exames, entre outros.
Dependendo do tipo de serviço escolhido, os filtros de busca podem variar (por exemplo, "exame" pode filtrar serviços laboratoriais, enquanto "consulta" pode mostrar médicos e clínicas).


---

## 2. Caso de Uso: Acompanhar Indicadores de Desempenho

### Breve Descrição  
Este caso de uso permite que o administrador monitore a performance do sistema e a eficácia dos serviços oferecidos.
 
### Ator  
Administrador

### Fluxo Básico de Eventos  
 
1. O administrador acessa o painel de administração do sistema "ConnectCare".
2. O administrador visualiza indicadores como número de usuários ativos, volume de agendamentos, taxa de satisfação dos pacientes e impacto das campanhas de saúde.
3. O administrador pode gerar relatórios detalhados com base em dados específicos (por exemplo, número de consultas por localidade, eficácia de campanhas de vacinação).
4. O sistema apresenta os dados em gráficos ou tabelas, permitindo que o administrador analise tendências e tome decisões informadas.
5. O administrador pode realizar ajustes no sistema, como adicionar novos parceiros ou serviços, com base nos indicadores observados.



#### Fluxos Alternativos 

FA01: Falha na Geração de Relatórios

1. O administrador tenta gerar um relatório sobre indicadores de impacto.
2. O sistema encontra um erro ao tentar compilar os dados (ex.: dados incompletos ou erro de conexão).
3. O sistema exibe uma mensagem de erro e sugere que o administrador tente novamente ou entre em contato com a equipe de suporte.
4. O administrador tenta gerar o relatório novamente após algum tempo ou solicita ajuda para resolver o problema.

FA02: Dados Inconsistentes nos Relatórios

1. O administrador gera um relatório sobre a eficácia de uma campanha de saúde.
2. O sistema apresenta dados inconsistentes ou fora do esperado.
3. O administrador revê as configurações de filtro do relatório e tenta novamente.
4. Caso o erro persista, o administrador realiza uma investigação mais detalhada ou entra em contato com a equipe técnica para corrigir os dados.



### Fluxos de Exceção  

FE01: Falha na Geração de Relatórios

1. O administrador tenta gerar um relatório sobre indicadores de impacto.
2. O sistema encontra um erro ao compilar os dados para gerar o relatório (ex.: dados incompletos, falha no banco de dados).
3. O sistema exibe uma mensagem de erro informando que o relatório não pode ser gerado no momento.
4. O administrador tenta gerar o relatório novamente após alguns minutos.
5. Caso o erro persista, o administrador é instruído a contatar a equipe técnica para corrigir o problema.

FE02: Dados Inconsistentes nos Relatórios

1. O administrador gera um relatório e descobre que os dados são inconsistentes ou incorretos (ex.: números divergentes ou resultados fora do esperado).
2. O sistema avisa que os dados podem estar incompletos ou incorretos.
3. O administrador é orientado a revisar os filtros aplicados ao relatório e a tentar novamente.
4. Caso o problema continue, o administrador solicita a assistência técnica para corrigir os dados no sistema.



### Pré-Condições 

O sistema deve estar coletando dados operacionais em tempo real (como número de consultas agendadas, atendimentos realizados, feedback dos pacientes, etc.).

Os dados necessários para gerar os relatórios devem estar completos e disponíveis.


### Pós-Condições

O administrador do sistema ou a organização parceira deve ser capaz de gerar relatórios baseados em dados de impacto, como o número de pacientes atendidos, taxas de participação nas campanhas, e indicadores de qualidade dos serviços.

O sistema salva os relatórios gerados para análise posterior e permite monitoramento contínuo das métricas de impacto social e operacional.


### Pontos de Extensão

Registrar e Divulgar Campanha de Saúde: As campanhas de saúde têm um impacto que pode ser monitorado. O administrador pode gerar relatórios sobre a eficácia da campanha, como número de participantes, feedbacks, e resultados de saúde.

Agendar Consulta: O número de consultas realizadas e outros dados operacionais são registrados e utilizados para monitorar o impacto social da plataforma.

Atualizar Prontuário Médico: As informações do prontuário médico de pacientes atendidos podem ser usadas para gerar relatórios analíticos sobre a saúde da comunidade.


### Regras de Negócio

RN01: Coleta de Dados de Desempenho

O sistema deve coletar dados de forma contínua para medir o desempenho das ações de saúde na comunidade, como número de atendimentos, participação em campanhas e melhorias no acesso à saúde.
Esses dados devem ser automaticamente agregados para fornecer relatórios detalhados e de fácil leitura.

RN02: Relatórios Personalizados

O administrador do sistema deve ser capaz de gerar relatórios personalizados, filtrando por diferentes critérios, como localização, faixa etária ou tipo de serviço, para avaliar o impacto das ações de saúde de forma mais eficiente.

RN03: Análise de Satisfação do Usuário

O sistema deve coletar feedback dos usuários após o atendimento e gerar indicadores de satisfação (como estrelas ou notas) para avaliar a qualidade dos serviços e o engajamento dos pacientes com as campanhas.



---

## 3. Caso de Uso: Agendar Atendimento Médico

### Breve Descrição  
O paciente pode utilizar o sistema ConnectCare para buscar e agendar uma consulta médica em unidades de saúde próximas, verificando horários disponíveis e recebendo confirmações e notificações sobre o atendimento.


### Ator  
Paciente

### Fluxo principal

1.    O paciente acessa o sistema ConnectCare.
2.    Ele faz login ou se cadastra caso ainda não tenha uma conta.
3.    O paciente busca serviços de saúde disponíveis utilizando filtros como localização e tipo de atendimento.
4.    O sistema exibe uma lista de unidades de saúde e horários disponíveis.
5.    O paciente seleciona o local e o horário desejado.
6.    O sistema solicita a confirmação do agendamento e, se necessário, exibe informações adicionais (documentos necessários, orientações de chegada, etc.).
7.    O paciente confirma o agendamento.
8.    O sistema registra a consulta e envia uma notificação de confirmação.

### Fluxo de exceção

-   Paciente não cadastrado: O sistema solicita que o usuário crie uma conta antes de continuar.
-    Nenhum serviço disponível: O sistema exibe uma mensagem informando que não há horários disponíveis e sugere outras datas ou locais próximos.
-    Erro na conexão com a internet: O sistema exibe uma mensagem de erro e sugere tentar novamente mais tarde.
-    Agendamento não confirmado: Se o paciente não concluir o processo, o sistema cancela a solicitação automaticamente após um tempo limite.

### Requisitos especiais

  O sistema deve ser acessível em dispositivos móveis com conexões de internet limitadas.
    As informações de saúde do paciente devem ser protegidas conforme regulamentações de privacidade.
    O sistema deve enviar notificações e lembretes automáticos para evitar faltas.

### Pré-condições

-    O paciente deve estar cadastrado na plataforma.
-    O sistema deve ter unidades de saúde cadastradas e disponíveis para atendimento.

### Pós-condições

-    A consulta médica estará registrada no sistema e associada ao paciente.
-    O paciente receberá uma confirmação e lembretes do agendamento.

---

## 4. Caso de uso: Visualizar Agenda de Consultas

### Breve Descrição

O profissional de saúde acessa o ConnectCare para visualizar sua agenda de atendimentos, verificando os horários das consultas agendadas, informações dos pacientes e detalhes adicionais sobre cada atendimento.

### Ator

Profissional da saúde

### Fluxo principal

1.   O profissional de saúde acessa o sistema ConnectCare.
2.    Ele faz login com suas credenciais.
3.    O sistema exibe o painel principal com opções de navegação.
4.    O profissional seleciona a opção "Agenda de Consultas".
5.   O sistema exibe a lista de atendimentos agendados, incluindo horários, nomes dos pacientes e tipo de consulta.
6.    O profissional pode clicar em uma consulta específica para visualizar detalhes adicionais, como histórico médico do paciente e documentos anexados.
7.    O profissional pode filtrar ou ordenar os atendimentos conforme necessidade (por data, tipo de atendimento, urgência, etc.).

### Fluxo de exceção

  Profissional não cadastrado ou login inválido: O sistema exibe uma mensagem de erro e solicita um novo login.
    Nenhuma consulta agendada: O sistema exibe uma mensagem informando que não há atendimentos para o período selecionado.
    Erro de conexão: O sistema exibe um aviso informando que os dados não puderam ser carregados e sugere tentar novamente mais tarde.

### Requisitos especiais

  O sistema deve garantir a privacidade das informações dos pacientes.
    A agenda deve ser atualizada em tempo real para refletir novas marcações ou cancelamentos.
    O sistema deve ser acessível em dispositivos móveis e funcionar com conexões de internet limitadas.

### Pré-condições

-    O profissional de saúde deve estar cadastrado na plataforma e autorizado a visualizar a agenda.
-    O sistema deve conter consultas previamente agendadas por pacientes.

### Pós-condições

-    O profissional terá acesso às informações dos atendimentos programados.
-    O sistema pode registrar que o profissional visualizou a agenda, permitindo otimizar o fluxo de atendimento.

## 5. Caso de Uso: Gerenciar Organizações Parceiras

### Breve Descrição

Uma organização parceira acessa o ConnectCare para gerenciar suas informações, atualizar serviços oferecidos, cadastrar campanhas de saúde e monitorar seu impacto na comunidade.

### Ator

Organizações parceiras

### Fluxo principal

1.    O representante da organização parceira acessa o sistema ConnectCare.
2.    Ele faz login com suas credenciais institucionais.
3.    O sistema exibe o painel administrativo com as opções de gerenciamento.
4.    O representante seleciona a opção "Gerenciar Organização".
5.    O sistema exibe as informações cadastradas da organização, incluindo nome, contatos, serviços oferecidos e campanhas ativas.
6.    O representante pode:
6.1        Atualizar dados da organização (endereço, telefone, responsáveis).
6.2        Cadastrar novos serviços de saúde disponíveis.
6.3        Criar, editar ou excluir campanhas de saúde comunitária.
6.4        Acompanhar relatórios sobre o impacto de suas ações (número de atendimentos, engajamento da comunidade, etc.).
7.    O sistema salva as alterações e notifica os usuários afetados, se necessário.

### Fluxo de exceção

  Usuário não autorizado: O sistema impede o acesso e exibe uma mensagem de erro.
    Dados inválidos ou incompletos: O sistema solicita a correção das informações antes de salvar.
    Erro de conexão: O sistema exibe um aviso e permite que o usuário tente novamente mais tarde.

### Requisitos especiais

  O sistema deve garantir que apenas usuários autorizados possam modificar os dados da organização.
  As alterações devem ser registradas para auditoria e segurança.
  O sistema deve permitir a exportação de relatórios sobre campanhas e atendimentos realizados.

### Pré-condições

-    A organização parceira deve estar cadastrada na plataforma e ter um usuário autorizado.

### Pós-condições

-    As informações da organização estarão atualizadas no sistema.
-    Os serviços e campanhas cadastrados poderão ser acessados pelos pacientes e profissionais de saúde.

## 6. Caso de Uso: Registrar e Divulgar Campanha de Saúde

### Breve Descrição

Este caso de uso irá permitir que organizações parceiras registrem e promovam campanhas de saúde.

### Ator

Organizações parceiras

### Fluxo principal

1. A organização parceira acessa a plataforma "ConnectCare".
2. A organização seleciona a opção "Registrar campanha".
3. O sistema solicita detalhes sobre a campanha, como nome, descrição, público-alvo, data e local.
4. A organização preenche as informações necessárias e submete a campanha.
5. O sistema valida os dados e confirma o registro da campanha.
6. O sistema promove a campanha entre os pacientes com base em critérios de localização, faixa etária e necessidades de saúde.
7. O paciente recebe uma notificação sobre a campanha relevante.
8. A organização pode monitorar a eficácia da campanha por meio de relatórios gerados pela plataforma.1

### Fluxo de exceção

Erro ao Submeter a Campanha:

1. A organização parceira tenta submeter os dados de uma campanha de saúde.
2. O sistema encontra um erro ao tentar registrar a campanha (ex.: dados faltando, formato incorreto).
3. O sistema exibe uma mensagem de erro, indicando qual informação está faltando ou é inválida.
4. A organização parceira é orientada a corrigir as informações e submeter novamente.
5. Se o erro persistir, a organização pode entrar em contato com o suporte para resolver o problema.
  

### Pré-condições

O organizador da campanha (ONG, hospital, organização parceira) deve estar autenticado e ter permissão para criar e registrar campanhas.

O sistema deve ter informações válidas sobre a campanha (nome, descrição, público-alvo, data, local).

O sistema deve ter uma base de dados de usuários com informações relevantes para segmentação da campanha (como faixa etária, histórico de saúde, localização).

### Pós-condições

A campanha de saúde é registrada no sistema, visível para os pacientes e com as informações de divulgação adequadas (data, local, público-alvo).

O sistema realiza a promoção da campanha para os usuários que atendem aos critérios de segmentação (Exemplo: enviar notificações para pacientes com mais de 60 anos sobre uma campanha de vacinação para idosos).

A campanha será registrada no painel de acompanhamento da organização parceira, permitindo que eles monitorem a participação e os resultados da campanha.