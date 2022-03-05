CREATE DATABASE libero;
GO
USE libero;

CREATE TABLE assunto (
    id                  INT             NOT NULL,
    idstr               VARCHAR(50)     NOT NULL,
    criadoem            VARCHAR(100)    NOT NULL,
    qtdfavoritos        INT             NOT NULL,
    favoritado          BIT             NOT NULL,
    qtdcompartilhamento INT             NOT NULL,
    compartilhado       BIT             NOT NULL,
    fonte               VARCHAR(400)    NOT NULL,
    descricao           VARCHAR(400)    NOT NULL,
    estudado            BIT             NOT NULL,
    atualizadoem        VARCHAR(100)    NOT NULL,
PRIMARY KEY (id, idstr));

CREATE TABLE usuario (
    id                  INT             NOT NULL,
    idstr               VARCHAR(50)     NOT NULL,
    criadoem            VARCHAR(100)    NOT NULL,
    email               VARCHAR(200)    NOT NULL,
    senha               VARCHAR(200)    NOT NULL,
    imagempadrao        BIT             NOT NULL,
    descricao           VARCHAR(400)    NOT NULL,
    qtdfavoritos        VARCHAR(100)    NOT NULL,
    lingua              VARCHAR(100)    NOT NULL,
    locacao             VARCHAR(200)    NOT NULL,
    nome                VARCHAR(200)    NOT NULL,
    notificacoes        BIT             NOT NULL,
    imagemdoperfilurl   VARCHAR(400)    NOT NULL,
    contribuidor        BIT             NOT NULL,
    staff               BIT             NOT NULL,
    professor           BIT             NOT NULL,         
PRIMARY KEY(id, idstr));

CREATE TABLE carreiras (
    id_carreira         INT             NOT NULL,
    nome_carreira       VARCHAR(100)    NOT NULL,
PRIMARY KEY (id_carreira));

CREATE TABLE contribuidor (
    id_contribuidor     INT             NOT NULL,
    idstr_contribuidor  VARCHAR(50)     NOT NULL,
    nome                VARCHAR(200)    NOT NULL,
PRIMARY KEY(id_contribuidor, idstr_contribuidor));

CREATE TABLE palavraschave (
    indice              INT             NOT NULL,
    texto               VARCHAR(400)    NOT NULL,
PRIMARY KEY(indice));

CREATE TABLE local (
    id                  INT             NOT NULL,
    idstr               VARCHAR(50)     NOT NULL,
    atributos           VARCHAR(200)    NOT NULL,
    pais                VARCHAR(200)    NOT NULL,
    idpais              VARCHAR(200)    NOT NULL,
    nome                VARCHAR(200)    NOT NULL,
PRIMARY KEY(id, idstr));

CREATE TABLE midia (
    id                  INT             NOT NULL,
    idstr               VARCHAR(50)     NOT NULL,
    midiaurl            VARCHAR(200)    NOT NULL,
    tipo                VARCHAR(200)    NOT NULL,
    indice              VARCHAR(200)    NOT NULL,
PRIMARY KEY(id, idstr));

CREATE TABLE roadmap (
    id                  INT             NOT NULL,
    idstr               VARCHAR(50)     NOT NULL,
    criadoem            VARCHAR(100)    NOT NULL,
    qtdfavoritos        INT             NOT NULL,
    favoritado          BIT             NOT NULL,
    qtdcompartilhamento INT             NOT NULL,
    compartilhado       BIT             NOT NULL,
    fonte               VARCHAR(400)    NOT NULL,
    descricao           VARCHAR(400)    NOT NULL,
    nome                VARCHAR(200)    NOT NULL,
    atualizadoem        VARCHAR(100)    NOT NULL,
PRIMARY KEY(id, idstr));

CREATE TABLE comentarios (
    id                  INT             NOT NULL,
    idstr               VARCHAR(50)     NOT NULL,
    criadoem            VARCHAR(100)    NOT NULL,
    qtdfavoritos        INT             NOT NULL,
    favoritado          BIT             NOT NULL,
    descricao           VARCHAR(400)    NOT NULL,
PRIMARY KEY(id, idstr));

--SELECT * FROM assunto;

--DROP TABLE assunto;

INSERT INTO assunto VALUES
(1,'a','2021-01-24',0,0,0,0,'Líbero','Cartografia',0,'2021-01-24'),
(2,'a','2021-01-24',0,0,0,0,'Líbero','Climas e Anomalias',0,'2021-01-24'),
(3,'a','2021-01-24',0,0,0,0,'Líbero','Dinâmica Atmosférica',0,'2021-01-24'),
(4,'a','2021-01-24',0,0,0,0,'Líbero','Dinâmica Climática',0,'2021-01-24'),
(5,'a','2021-01-24',0,0,0,0,'Líbero','Polígonos',0,'2021-01-24'),
(6,'a','2021-01-24',0,0,0,0,'Líbero','Potência de Ponto',0,'2021-01-24'),
(7,'a','2021-01-24',0,0,0,0,'Líbero','Acréscimos e Descontos',0,'2021-01-24'),
(8,'a','2021-01-24',0,0,0,0,'Líbero','Porcentagem',0,'2021-01-24'),
(9,'a','2021-01-24',0,0,0,0,'Líbero','Concordância',0,'2021-01-24'),
(10,'a','2021-01-24',0,0,0,0,'Líbero','A Geração de 30 - Prosa',0,'2021-01-24'),
(11,'a','2021-01-24',0,0,0,0,'Líbero','Eletrosfera',0,'2021-01-24'),
(12,'a','2021-01-24',0,0,0,0,'Líbero','A Revolução Cubana',0,'2021-01-24'),
(13,'a','2021-01-24',0,0,0,0,'Líbero','A Nova República',0,'2021-01-24'),
(14,'a','2021-01-24',0,0,0,0,'Líbero','Alelos Múltiplos e Polialelia',0,'2021-01-24'),
(15,'a','2021-01-24',0,0,0,0,'Líbero','Evolução',0,'2021-01-24'),
(16,'a','2021-01-24',0,0,0,0,'Líbero','Anelídeos',0,'2021-01-24'),
(17,'a','2021-01-24',0,0,0,0,'Líbero','Bipolaridade e Multipolaridade',0,'2021-01-24'),
(18,'a','2021-01-24',0,0,0,0,'Líbero','Forma Algébrica',0,'2021-01-24'),
(19,'a','2021-01-24',0,0,0,0,'Líbero','Equações Trigonométricas',0,'2021-01-24'),
(20,'a','2021-01-24',0,0,0,0,'Líbero','Probabilidade',0,'2021-01-24');

--DROP TABLE midia
INSERT INTO usuario VALUES
(1,'u','2021-01-25','fulano@fatec.sp.gov.br','123',1,'Estudante da FATEC ZONA LESTE',0,'Português','São Paulo, Brasil','Fulano',0,'imagemdoperfil',0,1,0);

--SELECT * FROM usuario;

INSERT INTO carreiras VALUES
(1,'Medicina');

INSERT INTO palavraschave VALUES
(1001, 'Geografia Física'),
(1002, 'Geometria Plana'),
(1003, 'Matemática Básica'),
(1004, 'Gramática'),
(1005, 'Literatura'),
(1006, 'Química Geral'),
(1007, 'História da América'),
(1008, 'História do Brasil'),
(1009, 'Genética'),
(1010, 'Zoologia'),
(1011, 'Geopolítica'),
(1012, 'Números Complexos'),
(1013, 'Trigonometria'),
(1014, 'Binômio de Newton e Probabilidade'),
(1015, 'Geografia'),
(1016, 'Matemática'),
(1017, 'Língua Portuguesa'),
(1018, 'Português'),
(1019, 'História'),
(1020, 'Biologia'),
(1021, 'Medicina'),
(1022, 'ENEM');

--SELECT * FROM palavraschave

INSERT INTO midia VALUES
(100,'m','https://youtu.be/x0B7Wv6bCfU','Link',1)

INSERT INTO roadmap VALUES
(100,'r','2021-01-25',0,0,0,0,'Líbero','Esse projeto tem como objetivo auxiliar os estudos do aluno de medicina.','Projeto Medicina','2021-01-25'),
(101,'r','2021-01-25',0,0,0,0,'Líbero','Um roadmap especial com os principais temas discutidos sobre o Enem de 2022.','Enem 2022','2021-01-25');

--SELECT * FROM roadmap

SELECT a.id, a.idstr, a.criadoem, a.qtdfavoritos, a.favoritado, a.qtdcompartilhamento, a.compartilhado, a.fonte, a.descricao, a.estudado, a.atualizadoem FROM assunto a;

SELECT r.id, r.idstr, r.criadoem, r.qtdfavoritos, r.favoritado, r.qtdcompartilhamento, r.compartilhado, r.fonte, r.descricao, r.nome, r.atualizadoem FROM roadmap r;

