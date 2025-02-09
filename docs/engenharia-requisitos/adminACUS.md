# Admin

## 1. Gerenciar perguntas

### Remoção de perguntas

#### Criterios de aceitação

- O administrador deve conseguir excluir perguntas individuais ou múltiplas.

- O sistema deve exibir uma mensagem de confirmação antes da exclusão.

- Perguntas vinculadas a questionários ativos não podem ser removidas.

### Criação de perguntas

#### Criterios de aceitação

- O administrador deve conseguir cadastrar perguntas informando título, enunciado, alternativas e resposta correta.

- O sistema deve validar se todos os campos obrigatórios foram preenchidos.

- A pergunta criada deve estar disponível para ser associada a questionários.

### Filtragem de perguntas por tema

#### Criterios de aceitação

- O administrador deve conseguir buscar perguntas utilizando palavras-chave associadas ao tema.

- O sistema deve exibir apenas perguntas correspondentes ao tema selecionado.

### Filtragem de perguntas por nível de dificuldade

#### Criterios de aceitação

- O administrador deve poder filtrar perguntas pelos níveis: Fácil, Médio e Difícil.

- O sistema deve exibir corretamente todas as perguntas do nível selecionado.

## 2. Gerenciar turmas na plataforma

### Editar turma

#### Criterios de aceitação

- O administrador deve conseguir alterar nome e ano letivo de uma turma.

### Criar turma

#### Criterios de aceitação

- O administrador deve cadastrar uma nova turma informando nome e ano letivo.

- A turma criada deve ficar disponível imediatamente para gerenciamento.

### Adicionar aluno em turma

##### Criterios de aceitação

- O administrador deve conseguir vincular um aluno a uma turma existente.

- O sistema deve verificar se o aluno já está matriculado em outra turma antes de adicionar.

### Editar perfil de aluno

#### Criterios de aceitação

- O administrador deve poder alterar informações básicas do perfil do aluno (nome, e-mail, turma associada).

- O sistema deve garantir a atualização imediata das informações após a edição.

## 3. Gerenciar professores na plataforma

### Criar perfil de professor

#### Criterios de aceitação

- O administrador deve conseguir cadastrar professores informando nome e e-mail.

- O sistema deve validar se o e-mail já está cadastrado antes de permitir o registro.

### Desativar perfil de professor

#### Criterios de aceitação

- O administrador deve conseguir desativar um professor, impedindo novos acessos ao sistema.

- O sistema deve garantir que turmas e atividades associadas ao professor permaneçam registradas.

### Editar perfil de professor

#### Criterios de aceitação

- O administrador deve poder alterar informações básicas do perfil do professor (nome, e-mail).

- O sistema deve validar se o novo e-mail não está associado a outro professor antes da alteração.

## 4. Gerenciar alunos na plataforma

#### Criterios de aceitação

### Criar perfil de aluno

- O administrador deve conseguir cadastrar um aluno informando nome, e-mail e turma.

- O sistema deve garantir que o aluno seja vinculado a uma turma no momento do cadastro.

### Desativar perfil de aluno

#### Criterios de aceitação

- O administrador deve conseguir desativar um aluno, impedindo o acesso à plataforma.

- O sistema deve manter o histórico de desempenho do aluno para futuras consultas.

### Editar perfil de aluno

#### Criterios de aceitação

- O administrador deve poder alterar informações básicas do aluno (nome, e-mail, turma associada).

- O sistema deve impedir a remoção do aluno se ele já tiver respostas registradas em questionários.
