package com.bioagricola.common.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "con_concepto", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class ConConcepto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uni_concepto", nullable = false)
	private Long uniConcepto;
	@NotNull
	@Column(name = "est_concepto", nullable = false)
	private Long estConcepto;

	@NotNull
	@Column(name = "con_nombre", nullable = false, length = 100)
	private String conNombre;

	@NotNull
	@Column(name = "con_alias", nullable = false, length = 10)
	private String conAlias;

	@NotNull
	@Column(name = "con_abreviatura", nullable = false, length = 20)
	private String conAbreviatura;

	@NotNull
	@Column(name = "con_tipcalculo", nullable = false, length = 1)
	private String conTipcalculo;

	@Column(name = "con_valor")
	private Double conValor;

	@Column(name = "con_formula", length = 2147483647)
	private String conFormula;

	@NotNull
	@Column(name = "con_operacion", nullable = false, length = 1)
	private String conOperacion;

	@Column(name = "con_naturaleza", length = 1)
	private String conNaturaleza;

	@NotNull
	@Column(name = "con_preliquidar", nullable = false, length = 1)
	private String conPreliquidar;

	@NotNull
	@Column(name = "con_anticipo", nullable = false, length = 1)
	private String conAnticipo;

	@Column(name = "con_pagpriori")
	private Integer conPagpriori;

	@NotNull
	@Column(name = "con_financiable", nullable = false, length = 1)
	private String conFinanciable;

	@Column(name = "con_inivigencia")
	private Timestamp conInivigencia;

	@Column(name = "con_finvigencia")
	private Timestamp conFinvigencia;

	@NotNull
	@Column(name = "con_estado", nullable = false, length = 1)
	private String conEstado;

	@Column(name = "prg_ideregistro")
	private Integer prgIderegistro;

	@NotNull
	@Column(name = "con_tipregistro", nullable = false, length = 1)
	private String conTipregistro;

	@NotNull
	@Column(name = "con_condonable", nullable = false, length = 1)
	private String conCondonable;

	@NotNull
	@Column(name = "con_valnulo", nullable = false, length = 1)
	private String conValnulo;

	@NotNull
	@Column(name = "usu_ideregistro", nullable = false)
	private Integer usuIderegistro;

	@Column(name = "fun_ideregistro")
	private Long funIderegistro;

	@NotNull
	@Column(name = "con_suspende", nullable = false, length = 1)
	private String conSuspende;

	@NotNull
	@Column(name = "con_intfinanciacion", nullable = false, length = 1)
	private String conIntfinanciacion;

	@NotNull
	@Column(name = "con_metajuste", nullable = false, length = 1)
	private String conMetajuste;

	@Column(name = "con_precision")
	private Integer conPrecision;

	@NotNull
	@Column(name = "con_contabiliza", nullable = false, length = 1)
	private String conContabiliza;

	@NotNull
	@Column(name = "con_liquidaservicio", nullable = false)
	private Boolean conLiquidaservicio;

	@Column(name = "con_propiedad")
	private String conPropiedad;

	public ConConcepto(Long id) {
		this.uniConcepto = id;
	}

}
