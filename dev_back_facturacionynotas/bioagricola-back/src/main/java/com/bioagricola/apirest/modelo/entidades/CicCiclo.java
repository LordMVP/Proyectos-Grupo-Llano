package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name = "cic_ciclo")
@NamedQuery(name = "CicCiclo.findAll", query = "SELECT p FROM CicCiclo p")
public class CicCiclo implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_CIC_CICLO_PK = "cicIderegistro";
	public static final String ENTIDAD_CIC_CICLO_CIC_NOMBRE = "cicNombre";
	public static final String ENTIDAD_CIC_CICLO_CIC_DIAINICIA = "cicDiainicia";
	public static final String ENTIDAD_CIC_CICLO_CIC_DIAFINALIZA = "cicDiafinaliza";
	public static final String ENTIDAD_CIC_CICLO_CIC_ESTADO = "cicEstado";
	public static final String ENTIDAD_CIC_CICLO_CIC_PERIODOS = "cicPeriodos";
	public static final String ENTIDAD_CIC_CICLO_CIC_ANOACTUAL = "cicAnoactual";
	public static final String ENTIDAD_CIC_CICLO_USU_IDEREGISTRO = "usuIderegistro";
	private static final String[] ATRIBUTOS_ENTIDAD_CIC_CICLO = { ENTIDAD_CIC_CICLO_CIC_PERIODOS, ENTIDAD_CIC_CICLO_PK,
			ENTIDAD_CIC_CICLO_CIC_NOMBRE, ENTIDAD_CIC_CICLO_CIC_DIAINICIA, ENTIDAD_CIC_CICLO_CIC_ANOACTUAL,
			ENTIDAD_CIC_CICLO_CIC_ESTADO, ENTIDAD_CIC_CICLO_USU_IDEREGISTRO, ENTIDAD_CIC_CICLO_CIC_DIAFINALIZA };

	@Id
	@Column(name = "cic_ideregistro")
	private Integer cicIderegistro;

	@Column(name = "cic_nombre")
	@Size(min = 0, max = 100)
	private String cicNombre;

	@Column(name = "cic_diainicia")
	private Short cicDiainicia;

	@Column(name = "cic_diafinaliza")
	private Short cicDiafinaliza;

	@Column(name = "cic_estado")
	@Size(min = 0, max = 1)
	private String cicEstado;

	@Column(name = "cic_periodos")
	private Short cicPeriodos;

	@Column(name = "cic_anoactual")
	private Short cicAnoactual;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@OneToMany(mappedBy = "cicCicloperPeriodoCicIderegistroFkey")
	@PodamExclude
	private List<PerPeriodo> perPeriodoCicIderegistroFkeyes;

	// bi-directional many-to-one association to CiemCicempresa
	@OneToMany(mappedBy = "cicCiclo")
	private List<CiemCicempresa> ciemCicempresas;
	
	@OneToMany(mappedBy="cicCiclo")
	private List<DperDetperiodo> dperDetperiodos;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public CicCiclo() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public Integer getCicIderegistro() {
		return this.cicIderegistro;
	}

	public void setCicIderegistro(Integer cicIderegistro) {

		this.cicIderegistro = cicIderegistro;
	}

	public String getCicNombre() {
		return this.cicNombre;
	}

	public void setCicNombre(String cicNombre) {

		this.cicNombre = cicNombre;
	}

	public Short getCicDiainicia() {
		return this.cicDiainicia;
	}

	public void setCicDiainicia(Short cicDiainicia) {

		this.cicDiainicia = cicDiainicia;
	}

	public Short getCicDiafinaliza() {
		return this.cicDiafinaliza;
	}

	public void setCicDiafinaliza(Short cicDiafinaliza) {

		this.cicDiafinaliza = cicDiafinaliza;
	}

	public String getCicEstado() {
		return this.cicEstado;
	}

	public void setCicEstado(String cicEstado) {

		this.cicEstado = cicEstado;
	}

	public Short getCicPeriodos() {
		return this.cicPeriodos;
	}

	public void setCicPeriodos(Short cicPeriodos) {

		this.cicPeriodos = cicPeriodos;
	}

	public Short getCicAnoactual() {
		return this.cicAnoactual;
	}

	public void setCicAnoactual(Short cicAnoactual) {

		this.cicAnoactual = cicAnoactual;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {

		this.usuIderegistro = usuIderegistro;
	}

	public List<PerPeriodo> getPerPeriodoCicIderegistroFkeyesList() {
		return this.perPeriodoCicIderegistroFkeyes;
	}

	public void setPerPeriodoCicIderegistroFkeyesList(List<PerPeriodo> perPeriodoCicIderegistroFkeyes) {
		this.perPeriodoCicIderegistroFkeyes = perPeriodoCicIderegistroFkeyes;
	}

	public List<CiemCicempresa> getCiemCicempresas() {
		return this.ciemCicempresas;
	}

	public void setCiemCicempresas(List<CiemCicempresa> ciemCicempresas) {
		this.ciemCicempresas = ciemCicempresas;
	}

	public CiemCicempresa addCiemCicempresa(CiemCicempresa ciemCicempresa) {
		getCiemCicempresas().add(ciemCicempresa);
		ciemCicempresa.setCicCiclo(this);

		return ciemCicempresa;
	}

	public CiemCicempresa removeCiemCicempresa(CiemCicempresa ciemCicempresa) {
		getCiemCicempresas().remove(ciemCicempresa);
		ciemCicempresa.setCicCiclo(null);

		return ciemCicempresa;
	}

	public List<DperDetperiodo> getDperDetperiodos() {
		return dperDetperiodos;
	}

	public void setDperDetperiodos(List<DperDetperiodo> dperDetperiodos) {
		this.dperDetperiodos = dperDetperiodos;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_CIC_CICLO) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadCicCiclo() {
		return ATRIBUTOS_ENTIDAD_CIC_CICLO;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cicAnoactual == null) ? 0 : cicAnoactual.hashCode());
		result = prime * result + ((cicDiafinaliza == null) ? 0 : cicDiafinaliza.hashCode());
		result = prime * result + ((cicDiainicia == null) ? 0 : cicDiainicia.hashCode());
		result = prime * result + ((cicEstado == null) ? 0 : cicEstado.hashCode());
		result = prime * result + ((cicIderegistro == null) ? 0 : cicIderegistro.hashCode());
		result = prime * result + ((cicNombre == null) ? 0 : cicNombre.hashCode());
		result = prime * result + ((cicPeriodos == null) ? 0 : cicPeriodos.hashCode());
		result = prime * result + ((ciemCicempresas == null) ? 0 : ciemCicempresas.hashCode());
		result = prime * result
				+ ((perPeriodoCicIderegistroFkeyes == null) ? 0 : perPeriodoCicIderegistroFkeyes.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CicCiclo other = (CicCiclo) obj;
		if (cicAnoactual == null) {
			if (other.cicAnoactual != null)
				return false;
		} else if (!cicAnoactual.equals(other.cicAnoactual))
			return false;
		if (cicDiafinaliza == null) {
			if (other.cicDiafinaliza != null)
				return false;
		} else if (!cicDiafinaliza.equals(other.cicDiafinaliza))
			return false;
		if (cicDiainicia == null) {
			if (other.cicDiainicia != null)
				return false;
		} else if (!cicDiainicia.equals(other.cicDiainicia))
			return false;
		if (cicEstado == null) {
			if (other.cicEstado != null)
				return false;
		} else if (!cicEstado.equals(other.cicEstado))
			return false;
		if (cicIderegistro == null) {
			if (other.cicIderegistro != null)
				return false;
		} else if (!cicIderegistro.equals(other.cicIderegistro))
			return false;
		if (cicNombre == null) {
			if (other.cicNombre != null)
				return false;
		} else if (!cicNombre.equals(other.cicNombre))
			return false;
		if (cicPeriodos == null) {
			if (other.cicPeriodos != null)
				return false;
		} else if (!cicPeriodos.equals(other.cicPeriodos))
			return false;
		if (ciemCicempresas == null) {
			if (other.ciemCicempresas != null)
				return false;
		} else if (!ciemCicempresas.equals(other.ciemCicempresas))
			return false;
		if (perPeriodoCicIderegistroFkeyes == null) {
			if (other.perPeriodoCicIderegistroFkeyes != null)
				return false;
		} else if (!perPeriodoCicIderegistroFkeyes.equals(other.perPeriodoCicIderegistroFkeyes))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
