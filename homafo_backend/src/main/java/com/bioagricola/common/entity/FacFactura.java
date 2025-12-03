package com.bioagricola.common.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Data;

@Entity
@Table(name = "fac_factura", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Data
public class FacFactura {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "fac_ideregistro")
	private Long facIderegistro;
	@Column(name = "fac_numero")
	private Long facNumero;
	@Column(name = "fac_metgenera")
	private String facMetgenera;
	@Column(name = "fac_estado")
	private String facEstado; 
	@Column(name = "fac_fecha")
	private Date facFecha;
	@Column(name = "fac_ideactual")
	private Long  facIdeactual;
	@Column(name = "fac_idepadre")
	private Long  facIdepadre;
	@Column(name = "fac_fecaprobada")
	private Date facFecaprobada;
	@Column(name = "fac_feceliminad")
	private Date facFeceliminad;
	@Column(name = "fac_fecfinancia")
	private Date facFecfinancia;
	@Column(name = "fac_feccastigad")
	private Date facFeccastigad;
	@Column(name = "fac_fecvence")
	private Date facFecvence;
	@Column(name = "emp_ideregistro")
	private Long empIderegistro;
	@Column(name = "sus_ideregistro")
	private Long susIderegistro;
	@Column(name = "dsus_ideregistr")
	private Long dsusIderegistr;
	@Column(name = "uni_tipsuscripc")
	private Long uniTipsuscripc;
	@Column(name = "uni_tipusosuscr")
	private Long uniTipusosuscr;
	@Column(name = "uni_liquidacion")
	private Long uniLiquidacion;
	@Column(name = "ter_ideregistro")
	private Long terIderegistro;
	@Column(name = "cic_ideregistro")
	private Long cicIderegistro;
	@Column(name = "per_ideregistro")
	private Long perIderegistro;
	@Column(name = "uni_documento")
	private Long uniDocumento;
	@Column(name = "uni_tipdocument")
	private Long uniTipdocument;
	@Column(name = "amo_ideregistro")
	private Long amoIderegistro;
	@Column(name = "cic_ano")
	private Long cicAno;
	@Column(name = "hliq_ideregistr")
	private Long hliqIderegistr;
	@Column(name = "fac_sdoreal")
	private Double facSdoreal;
	@Column(name = "fac_ideorigen")
	private Long facIdeorigen;
	@Column(name = "uni_tiptercero")
	private Long uniTiptercero;
	@Column(name = "fac_fecsuspens")
	private Date facFecsuspens;
	@Column(name = "fin_ideregistro")
	private Long finIderegistro;
	@Column(name = "fac_version")
	private Long facVersion;
	@Column(name = "fac_vlrreal")
	private Double facVlrreal;
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	@Column(name = "mvi_ideregistro")
	private Long mviIderegistro;
	@Column(name = "fac_ctrlfelec")
	private Long facCtrlfelec;
}
