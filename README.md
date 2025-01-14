# Ideia Space 🚀

A [Ideia Space](https://www.ideiaspace.com.br/) é uma startup brasileira de educação que tem como objetivo melhorar a qualidade do ensino, especialmente nas áreas de STEAM (Ciência, Tecnologia, Engenharia, Artes e Matemática). Sua proposta é utilizar o fascínio pelo espaço como tema central para envolver e capacitar os alunos em projetos que estimulam a criatividade e a resolução de problemas.

Portanto, para este projeto, a Ideia Space é o cliente que necessita de uma solução de software capaz de criar uma experiência de aprendizado gamificada, associado à obtenção de métricas de desempenho dos alunos, para que possa avaliar a eficácia de seus métodos de ensino, associado ao engajamento dos alunos.

## Sumário

- [Ideia Space 🚀](#ideia-space-)
  - [Sumário](#sumário)
  - [Sobre o Projeto](#sobre-o-projeto)
    - [Objetivo](#objetivo)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Como Executar o Projeto](#como-executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Executando o Projeto](#executando-o-projeto)
    - [Troubleshooting](#troubleshooting)
  - [Equipe](#equipe)

## Sobre o Projeto

### Objetivo

O objetivo da plataforma é acompanhar o aprendizado do aluno para além das atividades presenciais, proporcionando um ambiente digital que permita o estudo contínuo do aluno e garanta a padronização de avaliações da Ideia Space.

## Tecnologias Utilizadas

- [Docker](https://www.docker.com/): Ferramenta de conteinerização que permite isolar os serviços da aplicação, garantindo portabilidade e consistência entre os ambientes de desenvolvimento e produção.  
- [PostgreSQL](https://www.postgresql.org/): Sistema avançado de gerenciamento de banco de dados relacional, conhecido por sua robustez e extensibilidade.  
- [FastAPI](https://fastapi.tiangolo.com/): Framework backend em Python projetado para desenvolver APIs modernas, seguras e escaláveis. Facilita o gerenciamento de dados dos alunos, autenticação e outras funcionalidades da plataforma.  
- [SQLAlchemy](https://www.sqlalchemy.org/): Biblioteca de mapeamento objeto-relacional (ORM) que assegura uma conexão eficiente e segura com o banco de dados, simplificando operações com dados.  
- [Next.js](https://nextjs.org/): Framework frontend baseado em React que oferece renderização híbrida (estática e server-side), proporcionando alta performance e ótima experiência de desenvolvimento.

## Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de que os seguintes pré-requisitos estão atendidos:

- **[Docker](https://www.docker.com/):** Ferramenta de conteinerização que permite isolar os serviços da aplicação.  
- **[Docker Compose](https://docs.docker.com/compose/):** Ferramenta para definir e gerenciar aplicações multi-contêiner.
- **[Make](https://www.gnu.org/software/make/):** Utilitário para automatizar tarefas de construção e gerenciamento de projetos.  

### Passos para Execução

1. **Clone o repositório do projeto:**  
   ```bash
   git clone https://github.com/mdsreq-fga-unb/2024.2-T01-IdeaSpace
   cd 2024.2-T01-IdeaSpace
   ```

2. **Configure as variáveis de ambiente do projeto:**

Para o backend, copie o template presente em [backend/.env.example](./backend/.env.example) para *backend/.env*.

```bash
    cp backend/.env.example backend/.env
```

Agora, configure as variáveis de ambiente no caminho mencionado com as credenciais do banco de dados (que será criado automaticamente depois), primeiro usuário administrador e a chave secreta de criptografia de senhas. Para uso no ambiente de desenvolvimento, pode ser suficiente apenas a cópia do template. Em produção, alterações devem ser feitas para garantir a segurança do sistema.

Para o frontend, copie o template presente em [frontend/.env.example](./frontend/.env.example).

```bash
    cp frontend/.env.example frontend/.env
```

3. **Suba os serviços utilizando o Docker Compose**
  ```bash
    # Comando Make
    make start

    # Comando equivalente
    docker compose -f docker/compose.yml up
  ```

### Acesso a aplicação

- O sistema de backend estará disponível na porta *8000* do [localhost](http://localhost:8000/).
- O sistema backend estará disponível na porta *3000* do [localhost](http://localhost:3000/)

### Troubleshooting

Para evitar erros no *build* da aplicação, verifique se as portas do frontend, backend e banco de dados (por padrão *5432*) estão disponíveis.

## Equipe

<div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; width: 80%; margin: 0 auto;">

<div style="text-align: center;">
    <a href="https://github.com/caio-felipee" target="_blank"><img src="https://github.com/caio-felipee.png" width="100" style="border-radius: 50%; margin: 5px 20px 5px 20px;"/></a>
    <p style="margin: 0 0 0 0"><strong>Caio Felipe</strong></p>
</div>

<div style="text-align: center;">
    <a href="https://github.com/Edilson-r-jr" target="_blank"><img src="https://github.com/Edilson-r-jr.png" width="100" style="border-radius: 50%; margin: 5px 20px 5px 20px;"/> </a>
    <p style="margin: 0 0 0 0"><strong>Edilson Ribeiro</strong></p>
    <p style="color: gray; margin: 0 0;">Líder</p>
</div>

<div style="text-align: center;">
    <a href="https://github.com/femathrl" target="_blank"><img src="https://github.com/femathrl.png" width="100" style="border-radius: 50%; margin: 5px 20px 5px 20px;"/></a>
    <p style="margin: 0 0 0 0"><strong>Felipe Matheus</strong></p>
</div>

<div style="text-align: center;">
    <a href="https://github.com/IgorSPaiva" target="_blank"><img src="https://github.com/IgorSPaiva.png" width="100" style="border-radius: 50%; margin: 5px 20px 5px 20px;"/></a>
    <p style="margin: 0 0 0 0"><strong>Igor Silva</strong></p>
</div>

<div style="text-align: center;">
    <a href="https://github.com/Matheussbrant" target="_blank"><img src="https://github.com/Matheussbrant.png" width="100" style="border-radius: 50%; margin: 5px 20px 5px 20px;"/></a>
    <p style="margin: 0 0 0 0"><strong>Matheus Brant</strong></p>
</div>

<div style="text-align: center;">
    <a href="https://github.com/sebazac332" target="_blank"><img src="https://github.com/sebazac332.png" width="100" style="border-radius: 50%; margin: 5px 20px 5px 20px;"/></a>
    <p style="margin: 0 0 0 0"><strong>Sebastián Héctor</strong></p>
</div>
</div>