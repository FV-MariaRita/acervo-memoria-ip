CREATE TABLE entrevistador (
    id SERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bio VARCHAR (300) NOT NULL,
    path_foto TEXT NOT NULL
);

CREATE TABLE entrevistado (
    id SERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bio VARCHAR (300) NOT NULL,
    funcao VARCHAR(30) not null,
    path_foto TEXT NOT NULL
);

CREATE TABLE entrevista (
    id SERIAL NOT NULL PRIMARY KEY,
	local VARCHAR(50) NOT NULL,
	data Date NOT NULL,
    path_audio TEXT NOT NULL,
	path_transcricao TEXT NOT NULL

);

create table entrevistador_entrevista (
	entrevista_id INT not null,
	entrevistador_id INT not null,
	
	primary key (entrevista_id, entrevistador_id),
	foreign key (entrevista_id) references entrevista(id),
	foreign key (entrevistador_id) references entrevistador(id)
);

CREATE TABLE sumario (
    id SERIAL NOT NULL PRIMARY KEY,
    entrevista_id INT NOT NULL,
    tempo_segundos INT NOT NULL,
    assunto VARCHAR(100) NOT NULL,
    
    foreign key (entrevista_id) references entrevista(id) on delete cascade
);

create table fotos_entrevista (
	id SERIAL primary key,
	entrevista_id INT not null,
	categoria VARCHAR(20) not null,
	numero INT not null,
	
	foreign key (entrevista_id) references entrevista(id) on delete cascade,
	
	unique (entrevista_id, categoria, numero)
);

CREATE TABLE solicitante (
    id SERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11)  NULL,
    email VARCHAR(255) not null,
    rua VARCHAR(30) not null,
    cep CHAR(8) not null,
    cidade VARCHAR(30) not null,
    uf CHAR(2) not null,
    pais VARCHAR(30) not null
);

CREATE TABLE solicitacao (
    id SERIAL NOT NULL PRIMARY KEY,
    data TIMESTAMP NOT NULL,
    entrevista_id INT NOT NULL,
    solicitante_id INT NOT NULL,
    path_termo TEXT NOT NULL,
    status VARCHAR(10) NOT NULL,
	
    foreign key (entrevista_id) references entrevista(id),
    foreign key (solicitante_id) references solicitante(id)
);

