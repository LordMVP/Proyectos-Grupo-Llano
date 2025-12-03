package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * The persistent class for the afo_aforos database table.
 * 
 */
@Entity
@Table(name = "afo_aforos", schema = "aseo")
@NamedQuery(name = "AfoAforo.findAll", query = "SELECT a FROM AfoAforo a")
public class AfoAforo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "afo_ideregistro")
	private Integer afoIderegistro;

	@Column(name = "afo_cantidadfrecuenciarecoleccion")
	private Integer afoCantidadfrecuenciarecoleccion;

	@Column(name = "afo_estado")
	private String afoEstado;

	@Temporal(TemporalType.DATE)
	@Column(name = "afo_fecha")
	private Date afoFecha;

	@Temporal(TemporalType.DATE)
	@Column(name = "afo_fechaactualizacion")
	private Date afoFechaactualizacion;

	@Temporal(TemporalType.DATE)
	@Column(name = "afo_fechafinvegencia")
	private Date afoFechafinvegencia;

	@Temporal(TemporalType.DATE)
	@Column(name = "afo_fechainicio")
	private Date afoFechainicio;

	@Column(name = "afo_frecuenciarecoleccion")
	private String afoFrecuenciarecoleccion;

	@Column(name = "afo_ideafopadre")
	private Integer afoIdeafopadre;

	@Column(name = "afo_numpqr")
	private String afoNumpqr;

	@Column(name = "afo_observaciones")
	private String afoObservaciones;

	@Column(name = "barrio_ideregistro")
	private Integer barrioIderegistro;

	@Column(name = "mafv_factor")
	private BigDecimal mafvFactor;

	@Column(name = "rure_ideregistro")
	private Integer rureIderegistro;

	@Column(name = "ter_aforador")
	private Integer terAforador;

	@Column(name = "tfd_ideregistro")
	private Integer tfdIderegistro;

	@Column(name = "uni_clasesuscripcionaforo")
	private Integer uniClasesuscripcionaforo;

	@Column(name = "uni_complemento")
	private Integer uniComplemento;

	@Column(name = "uni_tipoaforo")
	private Integer uniTipoaforo;

	@Column(name = "uni_tipogenerador")
	private Integer uniTipogenerador;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	// bi-directional many-to-one association to DafoDetaforo
	@OneToMany(mappedBy = "afoAforo")
	private List<DafoDetaforo> dafoDetaforos;

	// bi-directional many-to-one association to HmafHistormaestroaforo
	@OneToMany(mappedBy = "afoAforo")
	private List<HmafHistormaestroaforo> hmafHistormaestroaforos;

	public AfoAforo() {
		//constructor por defecto
	}

	public Integer getAfoIderegistro() {
		return this.afoIderegistro;
	}

	public void setAfoIderegistro(Integer afoIderegistro) {
		this.afoIderegistro = afoIderegistro;
	}

	public Integer getAfoCantidadfrecuenciarecoleccion() {
		return this.afoCantidadfrecuenciarecoleccion;
	}

	public void setAfoCantidadfrecuenciarecoleccion(Integer afoCantidadfrecuenciarecoleccion) {
		this.afoCantidadfrecuenciarecoleccion = afoCantidadfrecuenciarecoleccion;
	}

	public String getAfoEstado() {
		return this.afoEstado;
	}

	public void setAfoEstado(String afoEstado) {
		this.afoEstado = afoEstado;
	}

	public Date getAfoFecha() {
		return this.afoFecha;
	}

	public void setAfoFecha(Date afoFecha) {
		this.afoFecha = afoFecha;
	}

	public Date getAfoFechaactualizacion() {
		return this.afoFechaactualizacion;
	}

	public void setAfoFechaactualizacion(Date afoFechaactualizacion) {
		this.afoFechaactualizacion = afoFechaactualizacion;
	}

	public Date getAfoFechafinvegencia() {
		return this.afoFechafinvegencia;
	}

	public void setAfoFechafinvegencia(Date afoFechafinvegencia) {
		this.afoFechafinvegencia = afoFechafinvegencia;
	}

	public Date getAfoFechainicio() {
		return this.afoFechainicio;
	}

	public void setAfoFechainicio(Date afoFechainicio) {
		this.afoFechainicio = afoFechainicio;
	}

	public String getAfoFrecuenciarecoleccion() {
		return this.afoFrecuenciarecoleccion;
	}

	public void setAfoFrecuenciarecoleccion(String afoFrecuenciarecoleccion) {
		this.afoFrecuenciarecoleccion = afoFrecuenciarecoleccion;
	}

	public Integer getAfoIdeafopadre() {
		return this.afoIdeafopadre;
	}

	public void setAfoIdeafopadre(Integer afoIdeafopadre) {
		this.afoIdeafopadre = afoIdeafopadre;
	}

	public String getAfoNumpqr() {
		return this.afoNumpqr;
	}

	public void setAfoNumpqr(String afoNumpqr) {
		this.afoNumpqr = afoNumpqr;
	}

	public String getAfoObservaciones() {
		return this.afoObservaciones;
	}

	public void setAfoObservaciones(String afoObservaciones) {
		this.afoObservaciones = afoObservaciones;
	}

	public Integer getBarrioIderegistro() {
		return this.barrioIderegistro;
	}

	public void setBarrioIderegistro(Integer barrioIderegistro) {
		this.barrioIderegistro = barrioIderegistro;
	}

	public BigDecimal getMafvFactor() {
		return this.mafvFactor;
	}

	public void setMafvFactor(BigDecimal mafvFactor) {
		this.mafvFactor = mafvFactor;
	}

	public Integer getRureIderegistro() {
		return this.rureIderegistro;
	}

	public void setRureIderegistro(Integer rureIderegistro) {
		this.rureIderegistro = rureIderegistro;
	}

	public Integer getTerAforador() {
		return this.terAforador;
	}

	public void setTerAforador(Integer terAforador) {
		this.terAforador = terAforador;
	}

	public Integer getTfdIderegistro() {
		return this.tfdIderegistro;
	}

	public void setTfdIderegistro(Integer tfdIderegistro) {
		this.tfdIderegistro = tfdIderegistro;
	}

	public Integer getUniClasesuscripcionaforo() {
		return this.uniClasesuscripcionaforo;
	}

	public void setUniClasesuscripcionaforo(Integer uniClasesuscripcionaforo) {
		this.uniClasesuscripcionaforo = uniClasesuscripcionaforo;
	}

	public Integer getUniComplemento() {
		return this.uniComplemento;
	}

	public void setUniComplemento(Integer uniComplemento) {
		this.uniComplemento = uniComplemento;
	}

	public Integer getUniTipoaforo() {
		return this.uniTipoaforo;
	}

	public void setUniTipoaforo(Integer uniTipoaforo) {
		this.uniTipoaforo = uniTipoaforo;
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

	public List<DafoDetaforo> getDafoDetaforos() {
		return this.dafoDetaforos;
	}

	public void setDafoDetaforos(List<DafoDetaforo> dafoDetaforos) {
		this.dafoDetaforos = dafoDetaforos;
	}

	public DafoDetaforo addDafoDetaforo(DafoDetaforo dafoDetaforo) {
		getDafoDetaforos().add(dafoDetaforo);
		dafoDetaforo.setAfoAforo(this);

		return dafoDetaforo;
	}

	public DafoDetaforo removeDafoDetaforo(DafoDetaforo dafoDetaforo) {
		getDafoDetaforos().remove(dafoDetaforo);
		dafoDetaforo.setAfoAforo(null);

		return dafoDetaforo;
	}

	public List<HmafHistormaestroaforo> getHmafHistormaestroaforos() {
		return this.hmafHistormaestroaforos;
	}

	public void setHmafHistormaestroaforos(List<HmafHistormaestroaforo> hmafHistormaestroaforos) {
		this.hmafHistormaestroaforos = hmafHistormaestroaforos;
	}

	public HmafHistormaestroaforo addHmafHistormaestroaforo(HmafHistormaestroaforo hmafHistormaestroaforo) {
		getHmafHistormaestroaforos().add(hmafHistormaestroaforo);
		hmafHistormaestroaforo.setAfoAforo(this);

		return hmafHistormaestroaforo;
	}

	public HmafHistormaestroaforo removeHmafHistormaestroaforo(HmafHistormaestroaforo hmafHistormaestroaforo) {
		getHmafHistormaestroaforos().remove(hmafHistormaestroaforo);
		hmafHistormaestroaforo.setAfoAforo(null);

		return hmafHistormaestroaforo;
	}

}