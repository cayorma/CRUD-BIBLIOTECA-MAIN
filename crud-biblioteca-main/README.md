# 📚 Biblioteca Acadêmica – CRUD Completo

## 1. Descrição do Projeto
Este projeto é uma **mini biblioteca acadêmica**, desenvolvido para praticar um **CRUD completo** (Create, Read, Update, Delete) utilizando:

- **Backend:** Node.js + Express.js
- **Banco de Dados:** MySQL
- **Frontend:** React.js
- **Objetivo:** Permitir a gestão de autores e livros com integração real entre frontend e backend.  

Existe um módulo bônus de **empréstimos**, que permite registrar o empréstimo de livros para alunos.

---

## 2. Funcionalidades

### 2.1 Backend
- CRUD completo de **Autores** (`/authors`)
  - Listar todos os autores
  - Listar autor por ID
  - Criar novo autor
  - Editar autor existente
  - Deletar autor
- CRUD completo de **Livros** (`/books`)
  - Listar todos os livros (opcional: incluir nome do autor via JOIN)
  - Listar livro por ID
  - Criar novo livro vinculado a um autor
  - Editar livro existente
  - Deletar livro
- Módulo BÔNUS: **Empréstimos** (`/loans`)
  - Registrar empréstimos de livros
  - Marcar devolução de livros

### 2.2 Frontend
- **Autores**
  - Tela de listagem: exibe nome e nacionalidade
  - Botões: Novo, Editar e Excluir
  - Formulário de criação/edição
- **Livros**
  - Tela de listagem: exibe título, categoria, ano e autor
  - Botões: Novo, Editar e Excluir
  - Formulário de criação/edição (select de autores)

---

## 3. Banco de Dados (MySQL)

### 3.1 Criação do banco de dados, tabela de autores, tabela de livros, tabela de empréstimos, 
```sql
CREATE DATABASE IF NOT EXISTS biblioteca_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE biblioteca_db;

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT,
    category VARCHAR(100),
    author_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_books_author
    FOREIGN KEY (author_id)
    REFERENCES authors(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_registration VARCHAR(50) NOT NULL,
    book_id INT NOT NULL,
    loan_date DATETIME NOT NULL,
    return_date DATETIME NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    CONSTRAINT fk_loans_book
    FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


## 4. Backend – Express.js

### 4.1 Configuração
- Pacotes principais: `express`, `mysql2`, `cors`, `body-parser`  
- Arquivo de configuração do banco: `db.js`  
- Validações básicas:
  - Autor deve ter `name`
  - Livro deve ter `title` e `author_id`

### 4.2 Rotas

| Entidade | Método | Endpoint       | Descrição                  |
|----------|--------|----------------|----------------------------|
| Authors  | GET    | /authors       | Listar todos os autores    |
| Authors  | GET    | /authors/:id   | Listar autor por ID        |
| Authors  | POST   | /authors       | Criar novo autor           |
| Authors  | PUT    | /authors/:id   | Atualizar autor            |
| Authors  | DELETE | /authors/:id   | Deletar autor              |
| Books    | GET    | /books         | Listar todos os livros     |
| Books    | GET    | /books/:id     | Listar livro por ID        |
| Books    | POST   | /books         | Criar novo livro           |
| Books    | PUT    | /books/:id     | Atualizar livro            |
| Books    | DELETE | /books/:id     | Deletar livro              |

---

## 5. Frontend – React.js

### 5.1 Estrutura de Rotas
- `/authors` → Lista de autores  
- `/authors/new` → Formulário de cadastro  
- `/authors/:id/edit` → Formulário de edição  
- `/books` → Lista de livros  
- `/books/new` → Formulário de cadastro  
- `/books/:id/edit` → Formulário de edição  

### 5.2 Requisitos
- Usar **React Router**  
- Consumir API via `fetch` ou `axios`  
- Feedback visual ao criar, editar ou excluir  
- Select de autores no formulário de livros  

---

## 6. Como Rodar o Projeto

### 6.1 Backend
1. Abra o terminal e navegue até a pasta do backend: cd backend
2. Instale as dependências: npm install
3. Configure o banco de dados no arquivo `db.js`:
- Ajuste `host`, `usuário`, `senha` e `nome do banco` de acordo com sua instalação MySQL.

4. Inicie o servidor: npm start
O backend estará rodando em: [**http://localhost:3001**](http://localhost:3001)

> **Observação**: a porta pode variar conforme sua configuração em `db.js`.

### 6.2 Frontend

1. Abra outro terminal e navegue até a pasta do frontend: cd frontend
2. Instale as dependências: npm install
3. Inicie a aplicação: npm start
4. Acesse a aplicação no navegador: [**http://localhost:3000**](http://localhost:3000)