/*
USE master
GO
DROP DATABASE libero
*/

CREATE DATABASE libero;
GO
USE libero;

CREATE TABLE assunto (
    id_as               INT IDENTITY(101,1) NOT NULL,
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
    qtdfavoritos        VARCHAR(100)        NOT NULL,
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
    id_car              INT IDENTITY(101,1),
    nome                VARCHAR(100)        NOT NULL,
PRIMARY KEY (id_car));

CREATE TABLE contribuidor (
    id_con              INT IDENTITY(1,1),
    nome                VARCHAR(200)        NOT NULL,
PRIMARY KEY(id_con));

CREATE TABLE palavraschave (
    indice              INT IDENTITY(1,1),
    texto               VARCHAR(400)        NOT NULL,
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
    id_roa              INT IDENTITY(1001,1),
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
    id_det              INT IDENTITY(101,1),
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

CREATE TABLE assuntosdeusuario (
    id_usuario          INT                 NOT NULL,
    id_assunto          INT                 NOT NULL,
    favoritado          BIT                 NOT NULL,
    compartilhado       BIT                 NOT NULL,
    estudado            BIT                 NOT NULL,
PRIMARY KEY(id_usuario, id_assunto),
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usr),
FOREIGN KEY (id_assunto) REFERENCES assunto(id_as));

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

GO

INSERT INTO assunto VALUES
('2021-01-24',0,0,'Líbero','Cartografia','2021-01-24'),
('2021-01-24',0,0,'Líbero','Climas e Anomalias','2021-01-24'),
('2021-01-24',0,0,'Líbero','Dinâmica Atmosférica','2021-01-24'),
('2021-01-24',0,0,'Líbero','Dinâmica Climática','2021-01-24'),
('2021-01-24',0,0,'Líbero','Polígonos','2021-01-24'),
('2021-01-24',0,0,'Líbero','Potência de Ponto','2021-01-24'),
('2021-01-24',0,0,'Líbero','Acréscimos e Descontos','2021-01-24'),
('2021-01-24',0,0,'Líbero','Porcentagem','2021-01-24'),
('2021-01-24',0,0,'Líbero','Concordância','2021-01-24'),
('2021-01-24',0,0,'Líbero','A Geração de 30 - Prosa','2021-01-24'),
('2021-01-24',0,0,'Líbero','Eletrosfera','2021-01-24'),
('2021-01-24',0,0,'Líbero','A Revolução Cubana','2021-01-24'),
('2021-01-24',0,0,'Líbero','A Nova República','2021-01-24'),
('2021-01-24',0,0,'Líbero','Alelos Múltiplos e Polialelia','2021-01-24'),
('2021-01-24',0,0,'Líbero','Evolução','2021-01-24'),
('2021-01-24',0,0,'Líbero','Anelídeos','2021-01-24'),
('2021-01-24',0,0,'Líbero','Bipolaridade e Multipolaridade','2021-01-24'),
('2021-01-24',0,0,'Líbero','Forma Algébrica','2021-01-24'),
('2021-01-24',0,0,'Líbero','Equações Trigonométricas','2021-01-24'),
('2021-01-24',0,0,'Líbero','Probabilidade','2021-01-24');

INSERT INTO usuario VALUES
('2021-01-25','fulano@fatec.sp.gov.br','123',1,'Estudante da FATEC ZONA LESTE',0,'Português','São Paulo, Brasil','Fulano',0,'imagemdoperfil',0,1,0);

INSERT INTO carreiras VALUES
('Medicina'),
('Analista de Sistemas'),
('Geólogo');

INSERT INTO palavraschave VALUES
('Geografia Física'),
('Geometria Plana'),
('Matemática Básica'),
('Gramática'),
('Literatura'),
('Química Geral'),
('História da América'),
('História do Brasil'),
('Genética'),
('Zoologia'),
('Geopolítica'),
('Números Complexos'),
('Trigonometria'),
('Binômio de Newton e Probabilidade'),
('Geografia'),
('Matemática'),
('Língua Portuguesa'),
('Português'),
('História'),
('Biologia'),
('Medicina'),
('ENEM');

INSERT INTO midia VALUES
('https://youtu.be/x0B7Wv6bCfU','Link de Vídeo')

INSERT INTO roadmap VALUES
('2021-01-25',0,0,0,0,'Líbero','Esse projeto tem como objetivo auxiliar os estudos do aluno de medicina.','Projeto Medicina','2021-01-25'),
('2021-01-25',0,0,0,0,'Líbero','Um roadmap especial com os principais temas discutidos sobre o Enem de 2022.','Enem 2022','2021-01-25');

--SELECT * FROM palavraschave
--SELECT * FROM midia
--SELECT * FROM assunto;

--DROP TABLE assunto;

SELECT a.id_as, a.criadoem, a.qtdfavoritos, a.qtdcompartilhamento, a.fonte, a.descricao, a.atualizadoem FROM assunto a;

SELECT r.id_roa, r.criadoem, r.qtdfavoritos, r.qtdcompartilhamento, r.fonte, r.descricao, r.nome, r.atualizadoem FROM roadmap r;

