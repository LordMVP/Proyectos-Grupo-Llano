package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the hmaf_histormaestroaforos database table.
 * 
 */
@Entity
@Table(name = "hmaf_histormaestroaforos", schema = "aseo")
@NamedQuery(name = "HmafHistormaestroaforo.findAll", query = "SELECT h FROM HmafHistormaestroaforo h")
public class HmafHistormaestroaforo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "hmaf_ideregistro")
	private Integer hmafIderegistro;

	@Column(name = "cic_ideregistro")
	private Integer cicIderegistro;

	@Temporal(TemporalType.DATE)
	@Column(name = "hmaf_fechafinalizacion")
	private Date hmafFechafinalizacion;

	@Temporal(TemporalType.DATE)
	@Column(name = "hmaf_fechainicio")
	private Date hmafFechainicio;

	@Temporal(TemporalType.DATE)
	@Column(name = "hmaf_fecharegistro")
	private Date hmafFecharegistro;

	@Column(name = "mafv_factor")
	private String mafvFactor;

	@Column(name = "mafv_ideregistro")
	private Integer mafvIderegistro;

	@Column(name = "mhac_estado")
	private String mhacEstado;

	@Column(name = "mnaf_peso")
	private String mnafPeso;

	@Column(name = "mnaf_tafna")
	private String mnafTafna;

	@Column(name = "mnaf_trna")
	private String mnafTrna;

	@Column(name = "per_ideregistro")
	private Integer perIderegistro;

	@Column(name = "ter_aforador")
	private Integer terAforador;

	@Column(name = "uni_tipogenerador")
	private Integer uniTipogenerador;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@PodamExclude
	@Column(name = "afo_ideregistro")
	private Integer afoIderegistro;

	// bi-directional many-to-one association to AfoAforo
	@ManyToOne
	@JoinColumn(name = "afo_ideregistro", referencedColumnName = "afo_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private AfoAforo afoAforo;

	public HmafHistormaestroaforo() {
		//constructor por defecto
	}

	public Integer getAfoIderegistro() {
		return afoIderegistro;
	}

	public void setAfoIderegistro(Integer afoIderegistro) {
		this.afoIderegistro = afoIderegistro;
	}

	public Integer getHmafIderegistro() {
		return this.hmafIderegistro;
	}

	public void setHmafIderegistro(Integer hmafIderegistro) {
		this.hmafIderegistro = hmafIderegistro;
	}

	public Integer getCicIderegistro() {
		return this.cicIderegistro;
	}

	public void setCicIderegistro(Integer cicIderegistro) {
		this.cicIderegistro = cicIderegistro;
	}

	public Date getHmafFechafinalizacion() {
		return this.hmafFechafinalizacion;
	}

	public void setHmafFechafinalizacion(Date hmafFechafinalizacion) {
		this.hmafFechafinalizacion = hmafFechafinalizacion;
	}

	public Date getHmafFechainicio() {
		return this.hmafFechainicio;
	}

	public void setHmafFechainicio(Date hmafFechainicio) {
		this.hmafFechainicio = hmafFechainicio;
	}

	public Date getHmafFecharegistro() {
		return this.hmafFecharegistro;
	}

	public void setHmafFecharegistro(Date hmafFecharegistro) {
		this.hmafFecharegistro = hmafFecharegistro;
	}

	public String getMafvFactor() {
		return this.mafvFactor;
	}

	public void setMafvFactor(String mafvFactor) {
		this.mafvFactor = mafvFactor;
	}

	public Integer getMafvIderegistro() {
		return this.mafvIderegistro;
	}

	public void setMafvIderegistro(Integer mafvIderegistro) {
		this.mafvIderegistro = mafvIderegistro;
	}

	public String getMhacEstado() {
		return this.mhacEstado;
	}

	public void setMhacEstado(String mhacEstado) {
		this.mhacEstado = mhacEstado;
	}

	public String getMnafPeso() {
		return this.mnafPeso;
	}

	public void setMnafPeso(String mnafPeso) {
		this.mnafPeso = mnafPeso;
	}

	public String getMnafTafna() {
		return this.mnafTafna;
	}

	public void setMnafTafna(String mnafTafna) {
		this.mnafTafna = mnafTafna;
	}

	public String getMnafTrna() {
		return this.mnafTrna;
	}

	public void setMnafTrna(String mnafTrna) {
		this.mnafTrna = mnafTrna;
	}

	public Integer getPerIderegistro() {
		return this.perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public Integer getTerAforador() {
		return this.terAforador;
	}

	public void setTerAforador(Integer terAforador) {
		this.terAforador = terAforador;
	}

	public Integer getUniTipogenerador() {
		return this.uniTipogenerador;
	}

	public void setUniTipogenerador(Integer uniTipogenerador) {
		this.uniTipogenerador = uniTipogenerador;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public AfoAforo getAfoAforo() {
		return this.afoAforo;
	}

	public void setAfoAforo(AfoAforo afoAforo) {
		this.afoAforo = afoAforo;
	}

}