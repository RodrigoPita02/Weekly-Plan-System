CREATE DATABASE plano_semanal;
USE plano_semanal;

CREATE TABLE tipo_atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL
);

INSERT INTO tipo_atividades (descricao) VALUES
('Música'), ('Motricidade'), ('Yoga'), ('Natação'),
('Trampolim'), ('Jujitsu'), ('Ciências'), ('Atendimento Pais');

CREATE TABLE valencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL
);

INSERT INTO valencias (descricao) VALUES
('Berçário'), ('Creche 12'), ('Creche 18'), ('Creche 2'),
('Pré 1'), ('Pré 2'), ('ATL');

CREATE TABLE plano_atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia_semana ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  tipo_atividade_id INT,
  valencia_id INT,
  FOREIGN KEY (tipo_atividade_id) REFERENCES tipo_atividades(id),
  FOREIGN KEY (valencia_id) REFERENCES valencias(id)
);
