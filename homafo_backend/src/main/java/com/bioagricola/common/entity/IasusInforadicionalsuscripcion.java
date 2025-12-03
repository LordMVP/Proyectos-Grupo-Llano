package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "iasus_inforadicionalsuscripcion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class IasusInforadicionalsuscripcion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	@Column(name = "iasus_ideregistro")
	private Long iasusIderegistro;
	
	@Column(name = "sus_ideregistro")
	private Long susIderegistro;
	
	@Column(name = "dsus_ideregistr")
	private Long dsusIderegistr;
	
	@Column(name = "iasus_cobrojuridico")
	private Boolean iasusCobrojuridico;
	
	@Column(name = "iasus_pagapeaje")
	private Boolean iasusPagapeaje;
	
	@Column(name = "iasus_referenciacomercial")
	private String iasusReferenciacomercial;
	
	@Column(name = "iasus_nombreestablecimiento")
	private String iasusNombreestablecimiento;

	public IasusInforadicionalsuscripcion(Long susIderegistro, Long dsusIderegistr, Boolean iasusCobrojuridico, Boolean iasusPagapeaje, String iasusReferenciacomercial, String iasusNombreestablecimiento) {
		this.susIderegistro = susIderegistro;
		this.dsusIderegistr = dsusIderegistr;
		this.iasusCobrojuridico = iasusCobrojuridico;
		this.iasusPagapeaje = iasusPagapeaje;
		this.iasusReferenciacomercial = iasusReferenciacomercial;
		this.iasusNombreestablecimiento = iasusNombreestablecimiento;
	}
}
