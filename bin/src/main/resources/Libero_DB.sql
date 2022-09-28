/*
USE master
GO
DROP DATABASE libero
--DROP PROCEDURE sp_iud_assunto
*/

CREATE DATABASE libero;
GO
USE libero;
GO

CREATE TABLE assunto (
    id_as               INT IDENTITY(1,1),
    criadoem            VARCHAR(100)        NOT NULL,
    qtdfavoritos        INT                 NOT NULL,
    qtdcompartilhamento INT                 NOT NULL,
    fonte               VARCHAR(400)        NOT NULL,
    descricao           VARCHAR(400)        NOT NULL,
    atualizadoem        VARCHAR(100)        NOT NULL,
PRIMARY KEY (id_as));

CREATE TABLE usuario (
    id_usr              INT IDENTITY(1,1),
    criadoem            VARCHAR(100)        NOT NULL,
    email               VARCHAR(200)        NOT NULL,
    senha               VARCHAR(200)        NOT NULL,
    imagempadrao        BIT                 NOT NULL,
    descricao           VARCHAR(400)        NOT NULL,
    qtdfavoritos        INT                 NOT NULL,
    lingua              VARCHAR(100)        NOT NULL,
    locacao             VARCHAR(200)        NOT NULL,
    nome                VARCHAR(200)        NOT NULL,
    notificacoes        BIT                 NOT NULL,
    imagemdoperfilurl   VARCHAR(400)        NOT NULL,
    contribuidor        BIT                 NOT NULL,
    staff               BIT                 NOT NULL,
    professor           BIT                 NOT NULL,         
PRIMARY KEY(id_usr));

CREATE TABLE carreiras (
    id_car              INT IDENTITY(1,1),
    nome                VARCHAR(100)        NOT NULL,
PRIMARY KEY (id_car));

CREATE TABLE contribuidor (
    id_con              INT IDENTITY(1,1),
    nome                VARCHAR(200)        NOT NULL,
PRIMARY KEY(id_con));

CREATE TABLE palavraschave (
    indice              INT IDENTITY(1,1),
    texto               VARCHAR(50)        NOT NULL,
PRIMARY KEY(indice));

CREATE TABLE localizacao (
    id_loc              INT IDENTITY(1,1),
    atributos           VARCHAR(200)        NOT NULL,
    pais                VARCHAR(200)        NOT NULL,
    idpais              VARCHAR(200)        NOT NULL,
    nome                VARCHAR(200)        NOT NULL,
PRIMARY KEY(id_loc));

CREATE TABLE midia (
    id_mid              INT IDENTITY(1,1),
    midiaurl            VARCHAR(200)        NOT NULL,
    tipo                VARCHAR(200)        NOT NULL,
PRIMARY KEY(id_mid));

CREATE TABLE roadmap (
    id_roa              INT IDENTITY(1,1),
    criadoem            VARCHAR(100)        NOT NULL,
    qtdfavoritos        INT                 NOT NULL,
    favoritado          BIT                 NOT NULL,
    qtdcompartilhamento INT                 NOT NULL,
    compartilhado       BIT                 NOT NULL,
    fonte               VARCHAR(400)        NOT NULL,
    descricao           VARCHAR(400)        NOT NULL,
    nome                VARCHAR(200)        NOT NULL,
    atualizadoem        VARCHAR(100)        NOT NULL,
PRIMARY KEY(id_roa));

CREATE TABLE detalhes (
    id_det              INT IDENTITY(1,1),
    id_as_det           INT                 NOT NULL,
    id_roa_det          INT                 NOT NULL,
PRIMARY KEY (id_det),
FOREIGN KEY (id_as_det) REFERENCES assunto(id_as),
FOREIGN KEY (id_roa_det) REFERENCES roadmap(id_roa));

CREATE TABLE comentarios (
    id_com              INT IDENTITY(1,1),
    idstr               VARCHAR(50)         NOT NULL,
    criadoem            VARCHAR(100)        NOT NULL,
    qtdfavoritos        INT                 NOT NULL,
    favoritado          BIT                 NOT NULL,
    descricao           VARCHAR(400)        NOT NULL,
PRIMARY KEY(id_com));

CREATE TABLE avaliacao (
    id_av       INT IDENTITY(1,1),
    nota        INT
PRIMARY KEY(id_av)
);

CREATE TABLE assuntosdeusuario (
    id_usuario          INT                 NOT NULL,
    id_assunto          INT                 NOT NULL,
    favoritado          BIT                 NOT NULL,
    compartilhado       BIT                 NOT NULL,
    estudado            BIT                 NOT NULL,
PRIMARY KEY(id_usuario, id_assunto),
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usr),
FOREIGN KEY (id_assunto) REFERENCES assunto(id_as));

CREATE TABLE avaliacoesdeusuario(
    id_usuario      INT                     NOT NULL,
    id_avaliacao    INT                     NOT NULL
PRIMARY KEY(id_usuario, id_avaliacao),
FOREIGN KEY(id_usuario) REFERENCES usuario(id_usr),
FOREIGN KEY(id_avaliacao) REFERENCES avaliacao(id_av),
);

CREATE TABLE avaliacoesderoadmap(
    id_roadmap      INT                     NOT NULL,
    id_avaliacao    INT                     NOT NULL
PRIMARY KEY(id_roadmap, id_avaliacao),
FOREIGN KEY(id_roadmap) REFERENCES roadmap(id_roa),
FOREIGN KEY(id_avaliacao) REFERENCES avaliacao(id_av),
);

CREATE TABLE comentariosderoadmap (
    id_comentariosderoa INT                 NOT NULL,
    id_com_roa          INT                 NOT NULL,
    id_roa_com          INT                 NOT NULL,
PRIMARY KEY (id_comentariosderoa),
FOREIGN KEY (id_com_roa) REFERENCES comentarios(id_com),
FOREIGN KEY (id_roa_com) REFERENCES roadmap(id_roa));

CREATE TABLE palavraschavededetalhes (
    id_palavrasdedet    INT                 NOT NULL,
    indice_palavra      INT                 NOT NULL,
PRIMARY KEY (id_palavrasdedet, indice_palavra),
FOREIGN KEY (id_palavrasdedet) REFERENCES detalhes(id_det),
FOREIGN KEY (indice_palavra) REFERENCES palavraschave(indice));

CREATE TABLE midiasdedetalhes (
    id_midiadedet       INT                 NOT NULL,
    id_mid_det          INT                 NOT NULL,
PRIMARY KEY (id_midiadedet, id_mid_det),
FOREIGN KEY (id_midiadedet) REFERENCES detalhes(id_det),
FOREIGN KEY (id_mid_det) REFERENCES midia(id_mid));

CREATE TABLE locaisdeassunto (
    id_locaisdeas         INT               NOT NULL,
    id_as_loc            INT                NOT NULL,
PRIMARY KEY (id_locaisdeas, id_as_loc),
FOREIGN KEY (id_locaisdeas) REFERENCES localizacao(id_loc),
FOREIGN KEY (id_as_loc) REFERENCES assunto(id_as));

CREATE TABLE verticeassunto (
    id          INT IDENTITY        NOT NULL,
    from_id     INT                 NOT NULL,
    to_id       INT                 NOT NULL,
    peso        INT                 NOT NULL,
);

CREATE TABLE verticepalavraschave (
    id          INT IDENTITY        NOT NULL,
    from_id     INT                 NOT NULL,
    to_id       INT                 NOT NULL,
    peso        INT                 NOT NULL,
);

GO

INSERT INTO assunto VALUES
('2022-06-13',0,0,'Líbero','Heap Sort','2022-06-13'),
('2022-06-13',0,0,'Líbero','Merge Sort','2022-06-13'),
('2022-06-13',0,0,'Líbero','Árvore Binária','2022-06-13'),
('2022-06-13',0,0,'Líbero','Grafos','2022-06-13'),
('2022-06-13',0,0,'Líbero','Diagrama de Sequência','2022-06-13'),
('2022-06-13',0,0,'Líbero','Diagrama de Caso de Uso','2022-06-13'),
('2022-06-13',0,0,'Líbero','Diagrama de Estados','2022-06-13'),
('2022-06-13',0,0,'Líbero','UML','2022-06-13'),
('2022-06-13',0,0,'Líbero','Java 11','2022-06-13'),
('2022-06-13',0,0,'Líbero','Diagrama de Entidade Relacionamento','2022-06-13'),
('2022-06-13',0,0,'Líbero','Diagrama de Pacotes','2022-06-13'),
('2022-06-13',0,0,'Líbero','Diagrama de Classes','2022-06-13'),
('2022-06-13',0,0,'Líbero','Quick Sort','2022-06-13'),
('2022-06-13',0,0,'Líbero','Vetores','2022-06-13'),
('2022-06-13',0,0,'Líbero','Matrizes','2022-06-13'),
('2022-06-13',0,0,'Líbero','Variáveis','2022-06-13'),
('2022-06-13',0,0,'Líbero','Padrões de Projeto','2022-06-13'),
('2022-06-13',0,0,'Líbero','Padrão Singleton','2022-06-13'),
('2022-06-13',0,0,'Líbero','Padrão Prototype','2022-06-13'),
('2022-06-13',0,0,'Líbero','Padrão Adapter','2022-06-13');

INSERT INTO usuario VALUES
('2022/06/13','fulano@fatec.sp.gov.br','123',1,'Professor da FATEC ZONA LESTE',0,'Português','São Paulo, Brasil','Fulano da Silva',0,'',1,1,1);
INSERT INTO usuario VALUES
('2022/08/15','ciclano@fatec.sp.gov.br','123',1,'Usuário do Líbero',2,'Português','Rio de Janeiro, Brasil','Ciclano da Silva',0,'',1,1,1);

INSERT INTO carreiras VALUES
('Análise de Sistemas'),
('Engenharia de Software');

INSERT INTO palavraschave VALUES
('no silver bullet'),
('estrutura de dados'),
('arquitetura de software'),
('software'),
('hardware'),
('algorítmos'),
('lógica de programação'),
('programação'),
('desenvolvimento'),
('dev'),
('design patterns'),
('padrão de projeto'),
('spring boot'),
('java'),
('linux'),
('sistemas operacionais'),
('windows'),
('sistema operacional'),
('teste de software'),
('TDD'),
('ciclo de vida arquitetural'),
('ADS');

INSERT INTO midia VALUES
('https://www.youtube.com/watch?v=9GdesxWtOgs','Link de Vídeo do YouTube (especialista de mercado)')

INSERT INTO roadmap VALUES
('2022-06-13',0,0,0,0,'Líbero','Esse projeto tem como objetivo auxiliar os estudos do aluno de Engenharia de Software I','Engenharia de Software Feliz','2022-06-13'),
('2022-06-13',0,0,0,0,'Líbero','Um roadmap especial feito para ajudar os alunos de Estrutura de Dados','Estrutura de Dados Fácil','2022-06-13');

INSERT INTO detalhes VALUES
(3,2);

INSERT INTO avaliacao VALUES 
(5),
(3),
(4),
(2),
(4),
(5),
(5),
(4),
(5),
(1);

INSERT INTO avaliacoesdeusuario VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5);

INSERT INTO avaliacoesderoadmap VALUES
(1,6),
(1,7),
(1,8),
(1,9),
(1,10);

INSERT INTO verticeassunto VALUES
(	1	,	2	,	1	)
,(	1	,	3	,	2	)
,(	1	,	4	,	2	)
,(	1	,	5	,	4	)
,(	1	,	6	,	4	)
,(	1	,	7	,	4	)
,(	1	,	8	,	4	)
,(	1	,	9	,	1	)
,(	1	,	10	,	4	)
,(	1	,	11	,	4	)
,(	1	,	12	,	4	)
,(	1	,	13	,	1	)
,(	1	,	14	,	1	)
,(	1	,	15	,	1	)
,(	1	,	16	,	1	)
,(	1	,	17	,	2	)
,(	1	,	18	,	2	)
,(	1	,	19	,	2	)
,(	1	,	20	,	2	)
,(	2	,	1	,	1	)
,(	2	,	3	,	1	)
,(	2	,	4	,	2	)
,(	2	,	5	,	4	)
,(	2	,	6	,	4	)
,(	2	,	7	,	4	)
,(	2	,	8	,	4	)
,(	2	,	9	,	1	)
,(	2	,	10	,	4	)
,(	2	,	11	,	4	)
,(	2	,	12	,	4	)
,(	2	,	13	,	1	)
,(	2	,	14	,	1	)
,(	2	,	15	,	1	)
,(	2	,	16	,	1	)
,(	2	,	17	,	4	)
,(	2	,	18	,	4	)
,(	2	,	19	,	4	)
,(	2	,	20	,	4	)
,(	3	,	1	,	2	)
,(	3	,	2	,	2	)
,(	3	,	4	,	1	)
,(	3	,	5	,	4	)
,(	3	,	6	,	4	)
,(	3	,	7	,	4	)
,(	3	,	8	,	4	)
,(	3	,	9	,	1	)
,(	3	,	10	,	4	)
,(	3	,	11	,	4	)
,(	3	,	12	,	4	)
,(	3	,	13	,	1	)
,(	3	,	14	,	1	)
,(	3	,	15	,	1	)
,(	3	,	16	,	1	)
,(	3	,	17	,	4	)
,(	3	,	18	,	4	)
,(	3	,	19	,	3	)
,(	3	,	20	,	3	)
,(	4	,	1	,	2	)
,(	4	,	2	,	2	)
,(	4	,	3	,	1	)
,(	4	,	5	,	4	)
,(	4	,	6	,	4	)
,(	4	,	7	,	4	)
,(	4	,	8	,	4	)
,(	4	,	9	,	1	)
,(	4	,	10	,	2	)
,(	4	,	11	,	4	)
,(	4	,	12	,	3	)
,(	4	,	13	,	2	)
,(	4	,	14	,	1	)
,(	4	,	15	,	1	)
,(	4	,	16	,	1	)
,(	4	,	17	,	4	)
,(	4	,	18	,	4	)
,(	4	,	19	,	4	)
,(	4	,	20	,	4	)
,(	5	,	1	,	4	)
,(	5	,	2	,	4	)
,(	5	,	3	,	4	)
,(	5	,	4	,	4	)
,(	5	,	6	,	2	)
,(	5	,	7	,	1	)
,(	5	,	8	,	1	)
,(	5	,	9	,	4	)
,(	5	,	10	,	3	)
,(	5	,	11	,	3	)
,(	5	,	12	,	2	)
,(	5	,	13	,	4	)
,(	5	,	14	,	4	)
,(	5	,	15	,	4	)
,(	5	,	16	,	4	)
,(	5	,	17	,	2	)
,(	5	,	18	,	2	)
,(	5	,	19	,	2	)
,(	5	,	20	,	2	)
,(	6	,	1	,	4	)
,(	6	,	2	,	4	)
,(	6	,	3	,	4	)
,(	6	,	4	,	4	)
,(	6	,	5	,	3	)
,(	6	,	7	,	3	)
,(	6	,	8	,	1	)
,(	6	,	9	,	4	)
,(	6	,	10	,	1	)
,(	6	,	11	,	2	)
,(	6	,	12	,	1	)
,(	6	,	13	,	4	)
,(	6	,	14	,	4	)
,(	6	,	15	,	4	)
,(	6	,	16	,	4	)
,(	6	,	17	,	1	)
,(	6	,	18	,	3	)
,(	6	,	19	,	3	)
,(	6	,	20	,	3	)
,(	7	,	1	,	4	)
,(	7	,	2	,	4	)
,(	7	,	3	,	4	)
,(	7	,	4	,	3	)
,(	7	,	5	,	1	)
,(	7	,	6	,	2	)
,(	7	,	8	,	1	)
,(	7	,	9	,	4	)
,(	7	,	10	,	3	)
,(	7	,	11	,	2	)
,(	7	,	12	,	1	)
,(	7	,	13	,	4	)
,(	7	,	14	,	4	)
,(	7	,	15	,	4	)
,(	7	,	16	,	4	)
,(	7	,	17	,	3	)
,(	7	,	18	,	3	)
,(	7	,	19	,	3	)
,(	7	,	20	,	3	)
,(	8	,	1	,	4	)
,(	8	,	2	,	4	)
,(	8	,	3	,	4	)
,(	8	,	4	,	3	)
,(	8	,	5	,	1	)
,(	8	,	6	,	1	)
,(	8	,	7	,	1	)
,(	8	,	9	,	4	)
,(	8	,	10	,	3	)
,(	8	,	11	,	1	)
,(	8	,	12	,	1	)
,(	8	,	13	,	4	)
,(	8	,	14	,	3	)
,(	8	,	15	,	3	)
,(	8	,	16	,	3	)
,(	8	,	17	,	1	)
,(	8	,	18	,	2	)
,(	8	,	19	,	2	)
,(	8	,	20	,	2	)
,(	9	,	1	,	1	)
,(	9	,	2	,	1	)
,(	9	,	3	,	1	)
,(	9	,	4	,	1	)
,(	9	,	5	,	4	)
,(	9	,	6	,	4	)
,(	9	,	7	,	4	)
,(	9	,	8	,	4	)
,(	9	,	10	,	3	)
,(	9	,	11	,	3	)
,(	9	,	12	,	2	)
,(	9	,	13	,	1	)
,(	9	,	14	,	1	)
,(	9	,	15	,	1	)
,(	9	,	16	,	1	)
,(	9	,	17	,	2	)
,(	9	,	18	,	2	)
,(	9	,	19	,	2	)
,(	9	,	20	,	2	)
,(	10	,	1	,	4	)
,(	10	,	2	,	4	)
,(	10	,	3	,	4	)
,(	10	,	4	,	3	)
,(	10	,	5	,	4	)
,(	10	,	6	,	1	)
,(	10	,	7	,	4	)
,(	10	,	8	,	1	)
,(	10	,	9	,	4	)
,(	10	,	11	,	3	)
,(	10	,	12	,	3	)
,(	10	,	13	,	4	)
,(	10	,	14	,	3	)
,(	10	,	15	,	3	)
,(	10	,	16	,	3	)
,(	10	,	17	,	3	)
,(	10	,	18	,	3	)
,(	10	,	19	,	3	)
,(	10	,	20	,	3	)
,(	11	,	1	,	4	)
,(	11	,	2	,	4	)
,(	11	,	3	,	4	)
,(	11	,	4	,	4	)
,(	11	,	5	,	2	)
,(	11	,	6	,	2	)
,(	11	,	7	,	2	)
,(	11	,	8	,	1	)
,(	11	,	9	,	4	)
,(	11	,	10	,	3	)
,(	11	,	12	,	1	)
,(	11	,	13	,	4	)
,(	11	,	14	,	4	)
,(	11	,	15	,	4	)
,(	11	,	16	,	4	)
,(	11	,	17	,	3	)
,(	11	,	18	,	3	)
,(	11	,	19	,	3	)
,(	11	,	20	,	3	)
,(	12	,	1	,	4	)
,(	12	,	2	,	4	)
,(	12	,	3	,	4	)
,(	12	,	4	,	4	)
,(	12	,	5	,	1	)
,(	12	,	6	,	1	)
,(	12	,	7	,	1	)
,(	12	,	8	,	1	)
,(	12	,	9	,	3	)
,(	12	,	10	,	2	)
,(	12	,	11	,	2	)
,(	12	,	13	,	4	)
,(	12	,	14	,	4	)
,(	12	,	15	,	4	)
,(	12	,	16	,	3	)
,(	12	,	17	,	1	)
,(	12	,	18	,	2	)
,(	12	,	19	,	2	)
,(	12	,	20	,	2	)
,(	17	,	1	,	4	)
,(	17	,	2	,	4	)
,(	17	,	3	,	4	)
,(	17	,	4	,	4	)
,(	17	,	5	,	2	)
,(	17	,	6	,	2	)
,(	17	,	7	,	2	)
,(	17	,	8	,	1	)
,(	17	,	9	,	3	)
,(	17	,	10	,	3	)
,(	17	,	11	,	2	)
,(	17	,	12	,	2	)
,(	17	,	13	,	4	)
,(	17	,	14	,	4	)
,(	17	,	15	,	4	)
,(	17	,	16	,	4	)
,(	17	,	18	,	1	)
,(	17	,	19	,	1	)
,(	17	,	20	,	1	)
,(	18	,	1	,	4	)
,(	18	,	2	,	4	)
,(	18	,	3	,	4	)
,(	18	,	4	,	4	)
,(	18	,	5	,	3	)
,(	18	,	6	,	3	)
,(	18	,	7	,	3	)
,(	18	,	8	,	2	)
,(	18	,	9	,	3	)
,(	18	,	10	,	3	)
,(	18	,	11	,	3	)
,(	18	,	12	,	3	)
,(	18	,	13	,	4	)
,(	18	,	14	,	4	)
,(	18	,	15	,	4	)
,(	18	,	16	,	2	)
,(	18	,	17	,	1	)
,(	18	,	19	,	1	)
,(	18	,	20	,	1	)
,(	19	,	1	,	4	)
,(	19	,	2	,	4	)
,(	19	,	3	,	4	)
,(	19	,	4	,	4	)
,(	19	,	5	,	3	)
,(	19	,	6	,	3	)
,(	19	,	7	,	3	)
,(	19	,	8	,	2	)
,(	19	,	9	,	3	)
,(	19	,	10	,	3	)
,(	19	,	11	,	3	)
,(	19	,	12	,	3	)
,(	19	,	13	,	4	)
,(	19	,	14	,	4	)
,(	19	,	15	,	4	)
,(	19	,	16	,	2	)
,(	19	,	17	,	1	)
,(	19	,	18	,	1	)
,(	19	,	20	,	1	)
,(	20	,	1	,	4	)
,(	20	,	2	,	4	)
,(	20	,	3	,	4	)
,(	20	,	4	,	4	)
,(	20	,	5	,	3	)
,(	20	,	6	,	3	)
,(	20	,	7	,	3	)
,(	20	,	8	,	2	)
,(	20	,	9	,	3	)
,(	20	,	10	,	3	)
,(	20	,	11	,	3	)
,(	20	,	12	,	3	)
,(	20	,	13	,	4	)
,(	20	,	14	,	4	)
,(	20	,	15	,	4	)
,(	20	,	16	,	2	)
,(	20	,	17	,	1	)
,(	20	,	18	,	1	)
,(	20	,	19	,	1	)
,(	13	,	1	,	1	)
,(	13	,	2	,	1	)
,(	13	,	3	,	1	)
,(	13	,	4	,	2	)
,(	13	,	5	,	4	)
,(	13	,	6	,	4	)
,(	13	,	7	,	4	)
,(	13	,	8	,	4	)
,(	13	,	9	,	3	)
,(	13	,	10	,	4	)
,(	13	,	11	,	4	)
,(	13	,	12	,	4	)
,(	13	,	14	,	1	)
,(	13	,	15	,	1	)
,(	13	,	16	,	1	)
,(	13	,	17	,	4	)
,(	13	,	18	,	4	)
,(	13	,	19	,	4	)
,(	13	,	20	,	4	)
,(	14	,	1	,	1	)
,(	14	,	2	,	1	)
,(	14	,	3	,	1	)
,(	14	,	4	,	2	)
,(	14	,	5	,	4	)
,(	14	,	6	,	4	)
,(	14	,	7	,	4	)
,(	14	,	8	,	4	)
,(	14	,	9	,	3	)
,(	14	,	10	,	4	)
,(	14	,	11	,	4	)
,(	14	,	12	,	4	)
,(	14	,	13	,	1	)
,(	14	,	15	,	1	)
,(	14	,	16	,	1	)
,(	14	,	17	,	4	)
,(	14	,	18	,	4	)
,(	14	,	19	,	4	)
,(	14	,	20	,	4	)
,(	15	,	1	,	1	)
,(	15	,	2	,	1	)
,(	15	,	3	,	1	)
,(	15	,	4	,	2	)
,(	15	,	5	,	4	)
,(	15	,	6	,	4	)
,(	15	,	7	,	4	)
,(	15	,	8	,	4	)
,(	15	,	9	,	3	)
,(	15	,	10	,	4	)
,(	15	,	11	,	4	)
,(	15	,	12	,	4	)
,(	15	,	13	,	1	)
,(	15	,	14	,	1	)
,(	15	,	16	,	1	)
,(	15	,	17	,	4	)
,(	15	,	18	,	4	)
,(	15	,	19	,	4	)
,(	15	,	20	,	4	)
,(	16	,	1	,	1	)
,(	16	,	2	,	1	)
,(	16	,	3	,	1	)
,(	16	,	4	,	2	)
,(	16	,	5	,	4	)
,(	16	,	6	,	4	)
,(	16	,	7	,	4	)
,(	16	,	8	,	4	)
,(	16	,	9	,	3	)
,(	16	,	10	,	4	)
,(	16	,	11	,	4	)
,(	16	,	12	,	4	)
,(	16	,	13	,	1	)
,(	16	,	14	,	1	)
,(	16	,	15	,	1	)
,(	16	,	17	,	4	)
,(	16	,	18	,	4	)
,(	16	,	19	,	4	)
,(	16	,	20	,	4	);

GO

INSERT INTO verticepalavraschave VALUES
(1,1,5)
,(3,1,5);

GO

INSERT INTO midiasdedetalhes VALUES
(1,1);

INSERT INTO assuntosdeusuario VALUES
(1,1,1,1,0),
(1,2,1,0,0),
(1,3,0,0,0),
(1,4,1,1,1);

GO

CREATE PROCEDURE sp_iud_assunto (@cod CHAR(1), @id_as INT, @criadoem VARCHAR(100), @qtdfavoritos INT,
    @qtdcompartilhamento INT, @fonte VARCHAR(400), @descricao VARCHAR(400), @atualizadoem VARCHAR(100), @saida VARCHAR(50) OUTPUT)
AS
    IF (UPPER(@cod) = 'I')
    BEGIN
        SET IDENTITY_INSERT assunto ON;
        INSERT INTO assunto VALUES
        (@criadoem, @qtdfavoritos, @qtdcompartilhamento, @fonte, @descricao, @atualizadoem)
        SET @saida = 'Assunto inserido com sucesso'
    END
    ELSE
    BEGIN
        IF (UPPER(@cod) = 'U')
        BEGIN
            UPDATE assunto
            SET qtdfavoritos = @qtdfavoritos, qtdcompartilhamento = @qtdcompartilhamento, fonte = @fonte, descricao = @descricao, atualizadoem = @atualizadoem
            WHERE id_as = @id_as
            SET @saida = 'Assunto atualizado com sucesso'
            END
            ELSE
            BEGIN
                IF (UPPER(@cod) = 'D')
                BEGIN
                    DELETE assunto
                    WHERE id_as = @id_as
                    SET @saida = 'Assunto excluido com sucesso'
                END
                    ELSE
                    BEGIN
                        RAISERROR('Codigo invalido',16,1)
            END
        END
        SET IDENTITY_INSERT assunto OFF;
    END
GO

GO

CREATE PROCEDURE sp_iud_usuario (@cod CHAR(1), @id_usr INT, @criadoem VARCHAR(100),
    @email VARCHAR(200), @senha VARCHAR(200), @imagempadrao BIT, @descricao VARCHAR(400),
    @qtdfavoritos INT, @lingua VARCHAR(100), @locacao VARCHAR(200), @nome VARCHAR(200),
    @notificacoes BIT, @imagemdoperfilurl VARCHAR(400), @contribuidor BIT, @staff BIT,
    @professor BIT, @saida VARCHAR(50) OUTPUT)
AS
    IF (UPPER(@cod) = 'I')
    BEGIN
        SET IDENTITY_INSERT usuario ON;
        INSERT INTO usuario VALUES
        (@criadoem, @email, @senha, @imagempadrao, @descricao, @qtdfavoritos, @lingua, @locacao, @nome, @notificacoes, @imagemdoperfilurl, @contribuidor, @staff, @professor)
        SET @saida = 'Usuario inserido com sucesso'
    END
    ELSE
    BEGIN
        IF (UPPER(@cod) = 'U')
        BEGIN
            UPDATE usuario
            SET criadoem = @criadoem, 
                email = @email, 
                senha = @senha, 
                imagempadrao = @imagempadrao, 
                descricao = @descricao, 
                qtdfavoritos = @qtdfavoritos, 
                lingua = @lingua, 
                locacao = @locacao, 
                nome = @nome, 
                notificacoes = @notificacoes, 
                imagemdoperfilurl = @imagemdoperfilurl, 
                contribuidor = @contribuidor, 
                staff = @staff, 
                professor = @professor
            WHERE id_usr = @id_usr
            SET @saida = 'Usuario atualizado com sucesso'
            END
            ELSE
            BEGIN
                IF (UPPER(@cod) = 'D')
                BEGIN
                    DELETE usuario
                    WHERE id_usr = @id_usr
                    SET @saida = 'Usuario excluido com sucesso'
                END
                    ELSE
                    BEGIN
                        RAISERROR('Codigo invalido',16,1)
            END
        END
        SET IDENTITY_INSERT usuario OFF;  
    END

GO

GO
CREATE PROCEDURE sp_iud_roadmap (@cod CHAR(1), @id_roa INT, @criadoem VARCHAR(100),
    @qtdfavoritos INT, @favoritado BIT, @qtdcompartilhamento INT, @compartilhado BIT,
    @fonte VARCHAR(400), @descricao VARCHAR(400), @nome VARCHAR(200), @atualizadoem VARCHAR(100),
    @saida VARCHAR(50) OUTPUT)
AS
    IF (UPPER(@cod) = 'I')
    BEGIN
        SET IDENTITY_INSERT roadmap ON;
        INSERT INTO roadmap VALUES
        (@criadoem, @qtdfavoritos, @favoritado, @qtdcompartilhamento, @compartilhado, @fonte, @descricao, @nome, @atualizadoem)
        SET @saida = 'Roadmap inserido com sucesso'
    END
    ELSE
    BEGIN
        IF (UPPER(@cod) = 'U')
        BEGIN
            UPDATE roadmap
            SET criadoem = @criadoem, 
                qtdfavoritos = @qtdfavoritos, 
                favoritado = @favoritado, 
                qtdcompartilhamento = @qtdcompartilhamento,
                compartilhado = @compartilhado,
                fonte = @fonte,
                descricao = @descricao,
                nome = @nome,
                atualizadoem = @atualizadoem
            WHERE id_roa = @id_roa
            SET @saida = 'Roadmap atualizado com sucesso'
            END
            ELSE
            BEGIN
                IF (UPPER(@cod) = 'D')
                BEGIN
                    DELETE roadmap
                    WHERE id_roa = @id_roa
                    SET @saida = 'Roadmap excluido com sucesso'
                END
                    ELSE
                    BEGIN
                        RAISERROR('Codigo invalido',16,1)
            END
        END
        SET IDENTITY_INSERT roadmap OFF; 
    END

GO

GO
CREATE PROCEDURE sp_iud_carreiras (@cod CHAR(1), @id_car INT, @nome VARCHAR(100), @saida VARCHAR(50) OUTPUT)
AS
    IF(UPPER(@cod) = 'I')
    BEGIN
        SET IDENTITY_INSERT carreiras ON;
        INSERT INTO carreiras VALUES
        (@nome)
        SET @saida = 'Carreira inserida com sucesso'
    END
    ELSE
    BEGIN
        IF (UPPER(@cod) = 'U')
        BEGIN
            UPDATE carreiras
            SET nome = @nome
        WHERE id_car = @id_car
        SET @saida = 'Carreira inserida com sucesso'
        END
        ELSE
        BEGIN
            IF (UPPER(@cod) = 'D')
            BEGIN
                    DELETE carreiras
                    WHERE id_car = @id_car
                    SET @saida = 'Carreira excluida com sucesso'
                END
                    ELSE
                    BEGIN
                        RAISERROR('Codigo invalido',16,1)
            END
        END
        SET IDENTITY_INSERT carreiras OFF;  
    END

GO

GO
CREATE PROCEDURE sp_iud_palavraschave (@cod CHAR(1), @indice INT, @texto VARCHAR(50), @saida VARCHAR(50) OUTPUT)
AS
    IF(UPPER(@cod) = 'I')
    BEGIN
        SET IDENTITY_INSERT palavraschave ON;
        INSERT INTO palavraschave VALUES
        (@texto)
        SET @saida = 'Palavra inserida com sucesso'
    END
    ELSE
    BEGIN
        IF (UPPER(@cod) = 'U')
        BEGIN
            UPDATE palavraschave
            SET texto = @texto
        WHERE indice = @indice
        SET @saida = 'Palavra inserida com sucesso'
        END
        ELSE
        BEGIN
            IF (UPPER(@cod) = 'D')
            BEGIN
                    DELETE palavraschave
                    WHERE indice = @indice
                    SET @saida = 'Palavra excluida com sucesso'
                END
                    ELSE
                    BEGIN
                        RAISERROR('Codigo invalido',16,1)
            END
        END
        SET IDENTITY_INSERT palavraschave OFF;  
    END

GO

GO
CREATE PROCEDURE sp_iud_verticeassunto (@cod CHAR(1), @id INT, @from_id INT, @to_id INT, @peso INT, @saida VARCHAR(50) OUTPUT)
AS
    IF(UPPER(@cod) = 'I')
    BEGIN
        SET IDENTITY_INSERT palavraschave ON;
        INSERT INTO verticeassunto VALUES
        (@from_id, @to_id, @peso)
        SET @saida = 'Vertice assunto inserido com sucesso'
    END
    ELSE
    BEGIN
        IF (UPPER(@cod) = 'U')
        BEGIN
            UPDATE verticeassunto
            SET from_id = @from_id,
                to_id = @to_id,
                peso = @peso
        WHERE id = @id
        SET @saida = 'Vertice assunto atualizado com sucesso'
        END
        ELSE
        BEGIN
            IF (UPPER(@cod) = 'D')
            BEGIN
                    DELETE verticeassunto
                    WHERE id = @id
                    SET @saida = 'Vertice assunto excluido com sucesso'
                END
                    ELSE
                    BEGIN
                        RAISERROR('Codigo invalido',16,1)
            END
        END
        SET IDENTITY_INSERT verticeassunto OFF;  
    END

GO

--/
SELECT a.id_as, a.criadoem, a.qtdfavoritos, a.qtdcompartilhamento, a.fonte, a.descricao, a.atualizadoem FROM assunto a;

SELECT r.id_roa, r.criadoem, r.qtdfavoritos, r.qtdcompartilhamento, r.fonte, r.descricao, r.nome, r.atualizadoem FROM roadmap r;

SELECT v.id, v.from_id, v.to_id, v.peso FROM verticeassunto v;

SELECT * from usuario;

SELECT  u.id_usr, u.email, u.imagempadrao, u.descricao, u.qtdfavoritos, 
        u.lingua, u.locacao, u.nome, u.notificacoes, u.imagemdoperfilurl,
        u. contribuidor, u.staff, u.professor FROM usuario u WHERE u.id_usr = 2;

SELECT * from detalhes;
SELECT * from midiasdedetalhes;
SELECT * from midia;

SELECT * from assunto;
SELECT * from verticeassunto;
SELECT * from usuario;
SELECT * from palavraschave;

SELECT * from verticeassunto;
SELECT * from verticepalavraschave;

SELECT * from assuntosdeusuario;

SELECT * from avaliacoesdeusuario;

SELECT a.id_as, a.criadoem, a.qtdfavoritos, a.qtdcompartilhamento, a.fonte, a.descricao, a.atualizadoem,
    u.nome, u.descricao FROM assunto a, usuario u, assuntosdeusuario adeu
    WHERE a.id_as = adeu.id_assunto
    AND adeu.id_usuario = u.id_usr