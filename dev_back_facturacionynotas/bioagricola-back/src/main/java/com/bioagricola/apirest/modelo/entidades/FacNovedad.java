package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


/**
 * The persistent class for the fac_novedad database table.
 * 
 */
@Entity
@Table(name="fac_novedad")
@NamedQuery(name="FacNovedad.findAll", query="SELECT f FROM FacNovedad f")
public class FacNovedad implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="fac_ideregistro")
	private Long facIderegistro;
	
	@Column(name="amo_ideregistro")
	private Long amoIderegistro;

	@Column(name="cic_ano")
	private Integer cicAno;

	@Column(name="cic_ideregistro")
	private Integer cicIderegistro;

	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;

	@Column(name="emp_ideregistro")
	private Integer empIderegistro;

	@Column(name="fac_ctrlfelec")
	private Integer facCtrlfelec;

	@Column(name="fac_estado")
	private String facEstado;

	@Column(name="fac_fecaprobada")
	private Timestamp facFecaprobada;

	@Column(name="fac_feccastigad")
	private Timestamp facFeccastigad;

	@Column(name="fac_feceliminad")
	private Timestamp facFeceliminad;

	@Column(name="fac_fecfinancia")
	private Timestamp facFecfinancia;

	@Column(name="fac_fecha")
	private Timestamp facFecha;

	@Column(name="fac_fecsuspens")
	private Timestamp facFecsuspens;

	@Column(name="fac_fecvence")
	private Timestamp facFecvence;

	@Column(name="fac_ideactual")
	private Long facIdeactual;

	@Column(name="fac_ideorigen")
	private Long facIdeorigen;

	@Column(name="fac_idepadre")
	private Long facIdepadre;


	@Column(name="fac_metgenera")
	private String facMetgenera;

	@Column(name="fac_numero")
	private Long facNumero;

	@Column(name="fac_sdoreal")
	private BigDecimal facSdoreal;

	@Column(name="fac_version")
	private Integer facVersion;

	@Column(name="fac_vlrreal")
	private BigDecimal facVlrreal;

	@Column(name="fin_ideregistro")
	private Long finIderegistro;

	@Column(name="hliq_ideregistr")
	private Long hliqIderegistr;

	@Column(name="mvi_ideregistro")
	private Long mviIderegistro;

	@Column(name="per_ideregistro")
	private Integer perIderegistro;

	@Column(name="sus_ideregistro")
	private Long susIderegistro;

	@Column(name="ter_ideregistro")
	private Long terIderegistro;

	@Column(name="uni_documento")
	private Integer uniDocumento;

	@Column(name="uni_liquidacion")
	private Integer uniLiquidacion;

	@Column(name="uni_tipdocument")
	private Integer uniTipdocument;

	@Column(name="uni_tipsuscripc")
	private Integer uniTipsuscripc;

	@Column(name="uni_tiptercero")
	private Integer uniTiptercero;

	@Column(name="uni_tipusosuscr")
	private Integer uniTipusosuscr;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name="tipo_nota")
	private Integer tipoNota;
	
	public FacNovedad() {
		//constructor por defecto
	}

	public Long getAmoIderegistro() {
		return this.amoIderegistro;
	}

	public void setAmoIderegistro(Long amoIderegistro) {
		this.amoIderegistro = amoIderegistro;
	}

	public Integer getCicAno() {
		return this.cicAno;
	}

	public void setCicAno(Integer cicAno) {
		this.cicAno = cicAno;
	}

	public Integer getCicIderegistro() {
		return this.cicIderegistro;
	}

	public void setCicIderegistro(Integer cicIderegistro) {
		this.cicIderegistro = cicIderegistro;
	}

	public Long getDsusIderegistr() {
		return this.dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Integer getFacCtrlfelec() {
		return this.facCtrlfelec;
	}

	public void setFacCtrlfelec(Integer facCtrlfelec) {
		this.facCtrlfelec = facCtrlfelec;
	}

	public String getFacEstado() {
		return this.facEstado;
	}

	public void setFacEstado(String facEstado) {
		this.facEstado = facEstado;
	}

	public Timestamp getFacFecaprobada() {
		return this.facFecaprobada;
	}

	public void setFacFecaprobada(Timestamp facFecaprobada) {
		this.facFecaprobada = facFecaprobada;
	}

	public Timestamp getFacFeccastigad() {
		return this.facFeccastigad;
	}

	public void setFacFeccastigad(Timestamp facFeccastigad) {
		this.facFeccastigad = facFeccastigad;
	}

	public Timestamp getFacFeceliminad() {
		return this.facFeceliminad;
	}

	public void setFacFeceliminad(Timestamp facFeceliminad) {
		this.facFeceliminad = facFeceliminad;
	}

	public Timestamp getFacFecfinancia() {
		return this.facFecfinancia;
	}

	public void setFacFecfinancia(Timestamp facFecfinancia) {
		this.facFecfinancia = facFecfinancia;
	}

	public Timestamp getFacFecha() {
		return this.facFecha;
	}

	public void setFacFecha(Timestamp facFecha) {
		this.facFecha = facFecha;
	}

	public Timestamp getFacFecsuspens() {
		return this.facFecsuspens;
	}

	public void setFacFecsuspens(Timestamp facFecsuspens) {
		this.facFecsuspens = facFecsuspens;
	}

	public Timestamp getFacFecvence() {
		return this.facFecvence;
	}

	public void setFacFecvence(Timestamp facFecvence) {
		this.facFecvence = facFecvence;
	}

	public Long getFacIdeactual() {
		return this.facIdeactual;
	}

	public void setFacIdeactual(Long facIdeactual) {
		this.facIdeactual = facIdeactual;
	}

	public Long getFacIdeorigen() {
		return this.facIdeorigen;
	}

	public void setFacIdeorigen(Long facIdeorigen) {
		this.facIdeorigen = facIdeorigen;
	}

	public Long getFacIdepadre() {
		return this.facIdepadre;
	}

	public void setFacIdepadre(Long facIdepadre) {
		this.facIdepadre = facIdepadre;
	}

	public Long getFacIderegistro() {
		return this.facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public String getFacMetgenera() {
		return this.facMetgenera;
	}

	public void setFacMetgenera(String facMetgenera) {
		this.facMetgenera = facMetgenera;
	}

	public Long getFacNumero() {
		return this.facNumero;
	}

	public void setFacNumero(Long facNumero) {
		this.facNumero = facNumero;
	}

	public BigDecimal getFacSdoreal() {
		return this.facSdoreal;
	}

	public void setFacSdoreal(BigDecimal facSdoreal) {
		this.facSdoreal = facSdoreal;
	}

	public Integer getFacVersion() {
		return this.facVersion;
	}

	public void setFacVersion(Integer facVersion) {
		this.facVersion = facVersion;
	}

	public BigDecimal getFacVlrreal() {
		return this.facVlrreal;
	}

	public void setFacVlrreal(BigDecimal facVlrreal) {
		this.facVlrreal = facVlrreal;
	}

	public Long getFinIderegistro() {
		return this.finIderegistro;
	}

	public void setFinIderegistro(Long finIderegistro) {
		this.finIderegistro = finIderegistro;
	}

	public Long getHliqIderegistr() {
		return this.hliqIderegistr;
	}

	public void setHliqIderegistr(Long hliqIderegistr) {
		this.hliqIderegistr = hliqIderegistr;
	}

	public Long getMviIderegistro() {
		return this.mviIderegistro;
	}

	public void setMviIderegistro(Long mviIderegistro) {
		this.mviIderegistro = mviIderegistro;
	}

	public Integer getPerIderegistro() {
		return this.perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public Long getSusIderegistro() {
		return this.susIderegistro;
	}

	public void setSusIderegistro(Long susIderegistro) {
		this.susIderegistro = susIderegistro;
	}

	public Long getTerIderegistro() {
		return this.terIderegistro;
	}

	public void setTerIderegistro(Long terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public Integer getUniDocumento() {
		return this.uniDocumento;
	}

	public void setUniDocumento(Integer uniDocumento) {
		this.uniDocumento = uniDocumento;
	}

	public Integer getUniLiquidacion() {
		return this.uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public Integer getUniTipdocument() {
		return this.uniTipdocument;
	}

	public void setUniTipdocument(Integer uniTipdocument) {
		this.uniTipdocument = uniTipdocument;
	}

	public Integer getUniTipsuscripc() {
		return this.uniTipsuscripc;
	}

	public void setUniTipsuscripc(Integer uniTipsuscripc) {
		this.uniTipsuscripc = uniTipsuscripc;
	}

	public Integer getUniTiptercero() {
		return this.uniTiptercero;
	}

	public void setUniTiptercero(Integer uniTiptercero) {
		this.uniTiptercero = uniTiptercero;
	}

	public Integer getUniTipusosuscr() {
		return this.uniTipusosuscr;
	}

	public void setUniTipusosuscr(Integer uniTipusosuscr) {
		this.uniTipusosuscr = uniTipusosuscr;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}
	public Integer getTipoNota() {
		return this.tipoNota;
	}
	public void setTipoNota(Integer tipoNota) {
		this.tipoNota = tipoNota;
	}

}