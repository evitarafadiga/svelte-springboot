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
    id_as               INT IDENTITY(101,1),
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
    id_car              INT IDENTITY(101,1),
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

CREATE TABLE edgesassunto (
    id          INT IDENTITY        NOT NULL,
    from_id     INT                 NOT NULL,
    to_id       INT                 NOT NULL,
    peso        INT                 NOT NULL,
);

CREATE TABLE edgespalavraschave (
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
(103,1002);

INSERT INTO edgesassunto VALUES
(117,118,5)
,(117,119,5)
,(117,120,5)

INSERT INTO edgespalavraschave VALUES
(1,1,5)
,(3,1,5);

GO

INSERT INTO midiasdedetalhes VALUES
(101,1);

INSERT INTO assuntosdeusuario VALUES
(1,101,1,1,0),
(1,102,1,0,0),
(1,103,0,0,0),
(1,104,1,1,1);

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

--/
SELECT a.id_as, a.criadoem, a.qtdfavoritos, a.qtdcompartilhamento, a.fonte, a.descricao, a.atualizadoem FROM assunto a;

SELECT r.id_roa, r.criadoem, r.qtdfavoritos, r.qtdcompartilhamento, r.fonte, r.descricao, r.nome, r.atualizadoem FROM roadmap r;

SELECT * from detalhes;
SELECT * from midiasdedetalhes;
SELECT * from midia;

SELECT * from assunto;
SELECT * from usuario;
SELECT * from palavraschave;

SELECT * from edgesassunto;
SELECT * from edgespalavraschave;

SELECT * from assuntosdeusuario;

SELECT a.id_as, a.criadoem, a.qtdfavoritos, a.qtdcompartilhamento, a.fonte, a.descricao, a.atualizadoem,
    u.nome, u.descricao FROM assunto a, usuario u, assuntosdeusuario adeu
    WHERE a.id_as = adeu.id_assunto
    AND adeu.id_usuario = u.id_usr