CREATE DATABASE biblioteca;
USE biblioteca;

-- 📚 Linguagens
CREATE TABLE linguagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50)
);

-- 🔥 Conteúdo principal (unificado)
CREATE TABLE conteudo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('funcao', 'codigo'),
  linguagem_id INT,
  titulo VARCHAR(255),
  descricao TEXT,
  FOREIGN KEY (linguagem_id) REFERENCES linguagens(id)
);

-- 🎠 Blocos do carrossel
CREATE TABLE blocos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conteudo_id INT,
  tipo ENUM('texto', 'imagem', 'quiz'),
  valor TEXT,
  FOREIGN KEY (conteudo_id) REFERENCES conteudo(id)
);

-- 🧠 Quiz
CREATE TABLE quiz (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bloco_id INT,
  pergunta TEXT,
  correta INT,
  FOREIGN KEY (bloco_id) REFERENCES blocos(id)
);

-- 🔘 Opções do quiz
CREATE TABLE opcoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT,
  texto TEXT,
  FOREIGN KEY (quiz_id) REFERENCES quiz(id)
);