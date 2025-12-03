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
@Table(name = "empresas")
@NamedQuery(name = "Empresas.findAll", query = "SELECT p FROM Empresas p")
public class Empresas implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_EMPRESAS_PK = "empresaCod";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_NOM = "empresaNom";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_SLO = "empresaSlo";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_IMG = "empresaImg";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_CODSED = "empresaCodsed";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_CODSUC = "empresaCodsuc";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_INDEMP = "empresaIndemp";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_IDEFAC = "empresaIdefac";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_SEVEMP = "empresaSevemp";
	public static final String ENTIDAD_EMPRESAS_TER_IDEGENERICO = "terIdegenerico";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_CODFSSRI = "empresaCodfssri";
	public static final String ENTIDAD_EMPRESAS_EMPRESA_HOMASEO = "empresaHomaseo";
	private static final String[] ATRIBUTOS_ENTIDAD_EMPRESAS = { ENTIDAD_EMPRESAS_EMPRESA_HOMASEO,
			ENTIDAD_EMPRESAS_EMPRESA_SEVEMP, ENTIDAD_EMPRESAS_EMPRESA_SLO, ENTIDAD_EMPRESAS_EMPRESA_CODFSSRI,
			ENTIDAD_EMPRESAS_EMPRESA_NOM, ENTIDAD_EMPRESAS_EMPRESA_IDEFAC, ENTIDAD_EMPRESAS_PK,
			ENTIDAD_EMPRESAS_TER_IDEGENERICO, ENTIDAD_EMPRESAS_EMPRESA_IMG, ENTIDAD_EMPRESAS_EMPRESA_CODSUC,
			ENTIDAD_EMPRESAS_EMPRESA_CODSED, ENTIDAD_EMPRESAS_EMPRESA_INDEMP };

	@Id
	@Column(name = "empresa_cod")
	@Size(min = 0, max = 12)
	private String empresaCod;

	@Column(name = "empresa_nom")
	@Size(min = 0, max = 40)
	private String empresaNom;

	@Column(name = "empresa_slo")
	@Size(min = 0, max = 60)
	private String empresaSlo;

	@Column(name = "empresa_img")
	@Size(min = 0, max = 20)
	private String empresaImg;

	@Column(name = "empresa_codsed")
	@Size(min = 0, max = 2)
	private String empresaCodsed;

	@Column(name = "empresa_codsuc")
	@Size(min = 0, max = 2)
	private String empresaCodsuc;

	@Column(name = "empresa_indemp")
	@Size(min = 0, max = 1)
	private String empresaIndemp;

	@Column(name = "empresa_idefac")
	@Size(min = 0, max = 1)
	private String empresaIdefac;

	@Column(name = "empresa_sevemp")
	private Integer empresaSevemp;

	@Column(name = "ter_idegenerico")
	private Long terIdegenerico;

	@Column(name = "empresa_codfssri")
	@Size(min = 0, max = 4)
	private String empresaCodfssri;

	@Column(name = "empresa_homaseo")
	private boolean empresaHomaseo;

	@OneToMany(mappedBy = "empresasEmpresasCodfkUsuariosCodemp")
	@PodamExclude
	private List<Usuarios> fkUsuarios;

	// bi-directional many-to-one association to Barrios
	@OneToMany(mappedBy = "empresa")
	@PodamExclude
	private List<Barrios> barrios;

	// bi-directional many-to-one association to EsemEstempresa
	@OneToMany(mappedBy = "empresa")
	private List<EsemEstempresa> esemEstempresas;

	// bi-directional many-to-one association to CiemCicempresa
	@OneToMany(mappedBy = "empresa")
	private List<CiemCicempresa> ciemCicempresas;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public Empresas() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public String getEmpresaCod() {
		return this.empresaCod;
	}

	public void setEmpresaCod(String empresaCod) {

		this.empresaCod = empresaCod;
	}

	public String getEmpresaNom() {
		return this.empresaNom;
	}

	public void setEmpresaNom(String empresaNom) {

		this.empresaNom = empresaNom;
	}

	public String getEmpresaSlo() {
		return this.empresaSlo;
	}

	public void setEmpresaSlo(String empresaSlo) {

		this.empresaSlo = empresaSlo;
	}

	public String getEmpresaImg() {
		return this.empresaImg;
	}

	public void setEmpresaImg(String empresaImg) {

		this.empresaImg = empresaImg;
	}

	public String getEmpresaCodsed() {
		return this.empresaCodsed;
	}

	public void setEmpresaCodsed(String empresaCodsed) {

		this.empresaCodsed = empresaCodsed;
	}

	public String getEmpresaCodsuc() {
		return this.empresaCodsuc;
	}

	public void setEmpresaCodsuc(String empresaCodsuc) {

		this.empresaCodsuc = empresaCodsuc;
	}

	public String getEmpresaIndemp() {
		return this.empresaIndemp;
	}

	public void setEmpresaIndemp(String empresaIndemp) {

		this.empresaIndemp = empresaIndemp;
	}

	public String getEmpresaIdefac() {
		return this.empresaIdefac;
	}

	public void setEmpresaIdefac(String empresaIdefac) {

		this.empresaIdefac = empresaIdefac;
	}

	public Integer getEmpresaSevemp() {
		return this.empresaSevemp;
	}

	public void setEmpresaSevemp(Integer empresaSevemp) {

		this.empresaSevemp = empresaSevemp;
	}

	public Long getTerIdegenerico() {
		return this.terIdegenerico;
	}

	public void setTerIdegenerico(Long terIdegenerico) {

		this.terIdegenerico = terIdegenerico;
	}

	public String getEmpresaCodfssri() {
		return this.empresaCodfssri;
	}

	public void setEmpresaCodfssri(String empresaCodfssri) {

		this.empresaCodfssri = empresaCodfssri;
	}

	public boolean getEmpresaHomaseo() {
		return this.empresaHomaseo;
	}

	public void setEmpresaHomaseo(boolean empresaHomaseo) {

		this.empresaHomaseo = empresaHomaseo;
	}

	public List<Usuarios> getFkUsuarios() {
		return fkUsuarios;
	}

	public void setFkUsuarios(List<Usuarios> fkUsuarios) {
		this.fkUsuarios = fkUsuarios;
	}

	public List<Barrios> getBarrios() {
		return this.barrios;
	}

	public void setBarrios(List<Barrios> barrios) {
		this.barrios = barrios;
	}

	public Barrios addBarrio(Barrios barrio) {
		getBarrios().add(barrio);
		barrio.setEmpresa(this);

		return barrio;
	}

	public Barrios removeBarrio(Barrios barrio) {
		getBarrios().remove(barrio);
		barrio.setEmpresa(null);

		return barrio;
	}

	public List<EsemEstempresa> getEsemEstempresas() {
		return esemEstempresas;
	}

	public void setEsemEstempresas(List<EsemEstempresa> esemEstempresas) {
		this.esemEstempresas = esemEstempresas;
	}

	public List<CiemCicempresa> getCiemCicempresas() {
		return this.ciemCicempresas;
	}

	public void setCiemCicempresas(List<CiemCicempresa> ciemCicempresas) {
		this.ciemCicempresas = ciemCicempresas;
	}

	public CiemCicempresa addCiemCicempresa(CiemCicempresa ciemCicempresa) {
		getCiemCicempresas().add(ciemCicempresa);
		ciemCicempresa.setEmpresa(this);

		return ciemCicempresa;
	}

	public CiemCicempresa removeCiemCicempresa(CiemCicempresa ciemCicempresa) {
		getCiemCicempresas().remove(ciemCicempresa);
		ciemCicempresa.setEmpresa(null);

		return ciemCicempresa;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_EMPRESAS) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadEmpresas() {
		return ATRIBUTOS_ENTIDAD_EMPRESAS;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((barrios == null) ? 0 : barrios.hashCode());
		result = prime * result + ((ciemCicempresas == null) ? 0 : ciemCicempresas.hashCode());
		result = prime * result + ((empresaCod == null) ? 0 : empresaCod.hashCode());
		result = prime * result + ((empresaCodfssri == null) ? 0 : empresaCodfssri.hashCode());
		result = prime * result + ((empresaCodsed == null) ? 0 : empresaCodsed.hashCode());
		result = prime * result + ((empresaCodsuc == null) ? 0 : empresaCodsuc.hashCode());
		result = prime * result + (empresaHomaseo ? 1231 : 1237);
		result = prime * result + ((empresaIdefac == null) ? 0 : empresaIdefac.hashCode());
		result = prime * result + ((empresaImg == null) ? 0 : empresaImg.hashCode());
		result = prime * result + ((empresaIndemp == null) ? 0 : empresaIndemp.hashCode());
		result = prime * result + ((empresaNom == null) ? 0 : empresaNom.hashCode());
		result = prime * result + ((empresaSevemp == null) ? 0 : empresaSevemp.hashCode());
		result = prime * result + ((empresaSlo == null) ? 0 : empresaSlo.hashCode());
		result = prime * result + ((esemEstempresas == null) ? 0 : esemEstempresas.hashCode());
		result = prime * result + ((fkUsuarios == null) ? 0 : fkUsuarios.hashCode());
		result = prime * result + ((terIdegenerico == null) ? 0 : terIdegenerico.hashCode());
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
		Empresas other = (Empresas) obj;
		if (barrios == null) {
			if (other.barrios != null)
				return false;
		} else if (!barrios.equals(other.barrios))
			return false;
		if (ciemCicempresas == null) {
			if (other.ciemCicempresas != null)
				return false;
		} else if (!ciemCicempresas.equals(other.ciemCicempresas))
			return false;
		if (empresaCod == null) {
			if (other.empresaCod != null)
				return false;
		} else if (!empresaCod.equals(other.empresaCod))
			return false;
		if (empresaCodfssri == null) {
			if (other.empresaCodfssri != null)
				return false;
		} else if (!empresaCodfssri.equals(other.empresaCodfssri))
			return false;
		if (empresaCodsed == null) {
			if (other.empresaCodsed != null)
				return false;
		} else if (!empresaCodsed.equals(other.empresaCodsed))
			return false;
		if (empresaCodsuc == null) {
			if (other.empresaCodsuc != null)
				return false;
		} else if (!empresaCodsuc.equals(other.empresaCodsuc))
			return false;
		if (empresaHomaseo != other.empresaHomaseo)
			return false;
		if (empresaIdefac == null) {
			if (other.empresaIdefac != null)
				return false;
		} else if (!empresaIdefac.equals(other.empresaIdefac))
			return false;
		if (empresaImg == null) {
			if (other.empresaImg != null)
				return false;
		} else if (!empresaImg.equals(other.empresaImg))
			return false;
		if (empresaIndemp == null) {
			if (other.empresaIndemp != null)
				return false;
		} else if (!empresaIndemp.equals(other.empresaIndemp))
			return false;
		if (empresaNom == null) {
			if (other.empresaNom != null)
				return false;
		} else if (!empresaNom.equals(other.empresaNom))
			return false;
		if (empresaSevemp == null) {
			if (other.empresaSevemp != null)
				return false;
		} else if (!empresaSevemp.equals(other.empresaSevemp))
			return false;
		if (empresaSlo == null) {
			if (other.empresaSlo != null)
				return false;
		} else if (!empresaSlo.equals(other.empresaSlo))
			return false;
		if (esemEstempresas == null) {
			if (other.esemEstempresas != null)
				return false;
		} else if (!esemEstempresas.equals(other.esemEstempresas))
			return false;
		if (fkUsuarios == null) {
			if (other.fkUsuarios != null)
				return false;
		} else if (!fkUsuarios.equals(other.fkUsuarios))
			return false;
		if (terIdegenerico == null) {
			if (other.terIdegenerico != null)
				return false;
		} else if (!terIdegenerico.equals(other.terIdegenerico))
			return false;
		return true;
	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
