create table aseo.afo_aforos (
	afo_ideregistro serial not null,
	uni_tipoaforo int4 not null,
	afo_fecha date,
	afo_fechainicio date,
	afo_fechafinvegencia date,
	afo_numpqr varchar(50),
	uni_clasesuscripcionaforo int4 not null,
	afo_frecuenciarecoleccion varchar(50),
	afo_estado varchar(50) not null,
	ter_aforador int4 not null,
	afo_multiusutipodistribucion varchar(100),
	uni_tipogenerador int4 not null,
	mafv_factor varchar(50),
	usu_ideregistro int4 not null,
	CONSTRAINT afo_aforos_pkey PRIMARY KEY (afo_ideregistro)
);

create table aseo.mafv_maestroaforovisitas (
	mafv_ideregistro serial not null,
	afo_ideregistro int4 not null,
	mafv_inicio date,
	mafv_fin date,
	mafv_estado varchar(20),
	mafv_fecharegistro date,
	mafv_fechaactualizacion date,
	per_ideregistro int4,
	cic_ciclo varchar(50),
	uni_tipogenerador int4,
	mafv_factor varchar(50),
	usu_ideregistro int4 not null,
	CONSTRAINT mafv_maestroaforovisitas_pkey PRIMARY KEY (mafv_ideregistro),
	CONSTRAINT mafv_maestroaforovisitas_afo_aforos_fkey FOREIGN KEY (afo_ideregistro) REFERENCES aseo.afo_aforos(afo_ideregistro)
);

create table aseo.dafo_detaforo (
	dafo_ideregistro serial not null,
	afo_ideregistro int4 not null,
	dafo_fecharegistro date,
	dafo_fechactualizacion date,
	afo_fechafinvegencia date,
	afo_numpqr varchar(50),
	dsus_idegistr int4,
	dafo_multiusuporcentaje varchar(50),
	usu_ideregistro int4 not null,
	CONSTRAINT dafo_detaforo_pkey PRIMARY KEY (dafo_ideregistro),
	CONSTRAINT dafo_detaforo_afo_aforos_fkey FOREIGN KEY (afo_ideregistro) REFERENCES aseo.afo_aforos(afo_ideregistro)
);

create table aseo.dmaf_detallemaestrovisitas(
	dmaf_ideregistro serial not null,
	mafv_ideregistro int4 not null,
	dmav_consecutivovisita int4 not null,
	dmaf_fechavisita date not null,
	ter_aforador int4 not null,
	uni_conceptoaforo int4 not null,
	dmaf_volumenaforo numeric(15,5),
	dmaf_pesoaforo numeric(15,5),
	dmaf_estado varchar(20),
	dmaf_fecharegistro date,
	dmaf_semanasecuencia varchar(10),
	dmaf_observaciones varchar(150),
	usu_ideregistro int4 not null,
	CONSTRAINT dmaf_detallemaestrovisitas_pkey PRIMARY KEY (dmaf_ideregistro),
	CONSTRAINT dmaf_detallemaestrovisitas_mafv_maestroaforovisitas_fkey FOREIGN KEY (mafv_ideregistro) REFERENCES aseo.mafv_maestroaforovisitas (mafv_ideregistro)
);

create table aseo.adva_adjuntovisitas(
	adva_ideregistro serial not null,
	uni_tipoadjunto int4 not null,
	adva_idfererenciaazdigital varchar(100),
	emp_ideregistro int4 not null,
	adva_fecha date,
	ter_aforador int4 not null,
	adva_observaciones varchar(150),
	usu_ideregistro int4 not null,
	dmaf_ideregistro int4 not null,
	mafv_ideregistro int4 not null,
	CONSTRAINT adva_adjuntovisitas_pkey PRIMARY KEY (adva_ideregistro),
	CONSTRAINT adva_adjuntovisitas_mafv_maestroaforovisitas_fkey FOREIGN KEY (mafv_ideregistro) REFERENCES aseo.mafv_maestroaforovisitas (mafv_ideregistro),
	CONSTRAINT adva_adjuntovisitas_dmaf_detallemaestrovisitas_fkey FOREIGN KEY (dmaf_ideregistro) REFERENCES aseo.dmaf_detallemaestrovisitas (dmaf_ideregistro)
);

create table aseo.tpmaf_temprocesomaestroaforos(
	tpmaf_ideregistro serial not null,
	afo_ideregistro int4 not null,
	per_ideregistro int4 not null,
	cic_ideregistro int4 not null,
	hmaf_fechainicio date,
	hmaf_fechafinalizacion date,
	mhac_estado varchar(30),
	mafv_ideregistro int4 not null,
	hmaf_fecharegistro date,
	uni_tipogenerador int4 not null,
	mafv_factor varchar(50),
	usu_ideregistro int4 not null,
	ter_aforador int4,
	mnaf_tafna varchar(40),
	mnaf_trna varchar(40),
	mnaf_peso varchar(40),
	CONSTRAINT tpmaf_temprocesomaestroaforos_pkey PRIMARY KEY (tpmaf_ideregistro),
	CONSTRAINT tpmaf_temprocesomaestroaforos_afo_aforos_fkey FOREIGN KEY (afo_ideregistro) REFERENCES aseo.afo_aforos (afo_ideregistro),
	CONSTRAINT tpmaf_temprocesomaestroaforos_mafv_maestroaforovisitas_fkey FOREIGN KEY (mafv_ideregistro) REFERENCES aseo.mafv_maestroaforovisitas  (mafv_ideregistro)
);

create table aseo.hmaf_histormaestroaforos(
	hmaf_ideregistro serial not null,
	afo_ideregistro int4 not null,
	per_ideregistro int4 not null,
	cic_ideregistro int4 not null,
	hmaf_fechainicio date,
	hmaf_fechafinalizacion date,
	mhac_estado varchar(30),
	mafv_ideregistro int4 not null,
	hmaf_fecharegistro date,
	uni_tipogenerador int4 not null,
	mafv_factor varchar(50),
	usu_ideregistro int4 not null,
	ter_aforador int4,
	mnaf_tafna varchar(40),
	mnaf_trna varchar(40),
	mnaf_peso varchar(40),
	CONSTRAINT hmaf_histormaestroaforos_pkey PRIMARY KEY (hmaf_ideregistro),
	CONSTRAINT hmaf_histormaestroaforos_afo_aforos_fkey FOREIGN KEY (afo_ideregistro) REFERENCES aseo.afo_aforos (afo_ideregistro),
	CONSTRAINT hmaf_histormaestroaforos_mafv_maestroaforovisitas_fkey FOREIGN KEY (mafv_ideregistro) REFERENCES aseo.mafv_maestroaforovisitas  (mafv_ideregistro)
);

create table aseo.auaf_auditoriaaforos (
	auaf_ideregistro serial not null,
	auaf_fecha date not null,
	auaf_tabla varchar(100) not null,
	auaf_informacionanterior varchar(300) not null,
	auaf_informacionnueva varchar(300) not null,
	usu_ideregistro int4 not null,
	CONSTRAINT auaf_auditoriaaforos_pkey PRIMARY KEY (auaf_ideregistro)
);

create table aseo.hmafv_maestroaforovisitas  (
	hmafv_ideregistro serial not null,
	afo_ideregistro int4 not null,
	mafv_inicio date,
	mafv_fin date,
	mafv_estado varchar(20),
	mafv_fecharegistro date,
	mafv_fechaactualizacion date,
	per_ideregistro int4,
	cic_ciclo varchar(50),
	uni_tipogenerador int4,
	mafv_factor varchar(50),
	usu_ideregistro int4 not null,
	CONSTRAINT hmafv_maestroaforovisitas_pkey PRIMARY KEY (hmafv_ideregistro),
	CONSTRAINT hmafv_maestroaforovisitas_afo_aforos_fkey FOREIGN KEY (afo_ideregistro) REFERENCES aseo.afo_aforos(afo_ideregistro)
);

create table aseo.hdmaf_detallemaestrovisitas(
	hdmaf_ideregistro serial not null,
	mafv_ideregistro int4 not null,
	dmav_consecutivovisita int4 not null,
	dmaf_fechavisita date not null,
	ter_aforador int4 not null,
	uni_conceptoaforo int4 not null,
	dmaf_volumenaforo numeric(15,5),
	dmaf_pesoaforo numeric(15,5),
	dmaf_estado varchar(20),
	dmaf_fecharegistro date,
	dmaf_semanasecuencia varchar(10),
	dmaf_observaciones varchar(150),
	usu_ideregistro int4 not null,
	CONSTRAINT hdmaf_detallemaestrovisitas_pkey PRIMARY KEY (hdmaf_ideregistro),
	CONSTRAINT hdmaf_detallemaestrovisitas_mafv_maestroaforovisitas_fkey FOREIGN KEY (mafv_ideregistro) REFERENCES aseo.mafv_maestroaforovisitas (mafv_ideregistro)
);


