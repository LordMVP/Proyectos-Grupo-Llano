package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * The persistent class for the not_nota database table.
 * 
 */
@Entity
@Table(name = "not_nota")
@NamedQuery(name = "NotNota.findAll", query = "SELECT n FROM NotNota n")
public class NotNota implements Serializable {
	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_NOT_NOTA_PK = "notIderegistro";
	public static final String ENTIDAD_NOT_NOTA_CIC_ANO = "cicAno";
	public static final String ENTIDAD_NOT_NOTA_NOT_COMENTARIO = "notComentario";
	public static final String ENTIDAD_NOT_NOTA_NOT_FECHA = "notFecha";
	public static final String ENTIDAD_NOT_NOTA_UNI_MOTNOTA = "uniMotnota";
	public static final String ENTIDAD_NOT_NOTA_USU_IDEREGISTRO = "usuIderegistro";
	private static final String[] ATRIBUTOS_ENTIDAD_NOT_NOTA = { ENTIDAD_NOT_NOTA_PK, ENTIDAD_NOT_NOTA_CIC_ANO,
			ENTIDAD_NOT_NOTA_NOT_COMENTARIO, ENTIDAD_NOT_NOTA_NOT_FECHA, ENTIDAD_NOT_NOTA_UNI_MOTNOTA,
			ENTIDAD_NOT_NOTA_USU_IDEREGISTRO };

	@Id
	@SequenceGenerator(name = "sq_not_ideregistro", sequenceName = "sq_not_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_not_ideregistro")
	@Column(name = "not_ideregistro")
	private Long notIderegistro;

	@Column(name = "cic_ano")
	private Short cicAno;

	@Column(name = "not_comentario")
	private String notComentario;
        
        @Column(name = "not_pqr")
	private String notPqr;

	@Column(name = "not_fecha")
	private Timestamp notFecha;

	@Column(name = "uni_motnota")
	private Integer uniMotnota;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	// bi-directional many-to-one association to DsusDetsuscrip
	@ManyToOne
	@JoinColumn(name = "dsus_ideregistr", referencedColumnName = "dsus_ideregistr")
	private DsusDetsuscrip dsusDetsuscrip;

	// bi-directional many-to-one association to EsemEstempresa
	@ManyToOne
	@JoinColumns({ @JoinColumn(name = "emp_ideregistro", referencedColumnName = "emp_ideregistro"),
			@JoinColumn(name = "est_motnota", referencedColumnName = "est_ideregistro") })
	private EsemEstempresa esemEstempresa;

	// bi-directional many-to-one association to PerPeriodo
	@ManyToOne
	@JoinColumns({ @JoinColumn(name = "cic_ideregistro", referencedColumnName = "cic_ideregistro"),
			@JoinColumn(name = "per_ideregistro", referencedColumnName = "per_ideregistro") })
	private PerPeriodo perPeriodo;

	// bi-directional many-to-one association to NofaNotfactura
	@OneToMany(mappedBy = "notNota")
	private List<NofaNotfactura> nofaNotfacturas;

	public NotNota() {
		//constructor por defecto 
	}

	public Long getNotIderegistro() {
		return this.notIderegistro;
	}

	public void setNotIderegistro(Long notIderegistro) {
		this.notIderegistro = notIderegistro;
	}

	public Short getCicAno() {
		return this.cicAno;
	}

	public void setCicAno(Short cicAno) {
		this.cicAno = cicAno;
	}

	public String getNotComentario() {
		return this.notComentario;
	}

	public void setNotComentario(String notComentario) {
		this.notComentario = notComentario;
	}

        public String getNotPqr() {
            return notPqr;
        }

        public void setNotPqr(String notPqr) {
            this.notPqr = notPqr;
        }
        
	public Timestamp getNotFecha() {
		return this.notFecha;
	}

	public void setNotFecha(Timestamp notFecha) {
		this.notFecha = notFecha;
	}

	public Integer getUniMotnota() {
		return this.uniMotnota;
	}

	public void setUniMotnota(Integer uniMotnota) {
		this.uniMotnota = uniMotnota;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public DsusDetsuscrip getDsusDetsuscrip() {
		return this.dsusDetsuscrip;
	}

	public void setDsusDetsuscrip(DsusDetsuscrip dsusDetsuscrip) {
		this.dsusDetsuscrip = dsusDetsuscrip;
	}

	public EsemEstempresa getEsemEstempresa() {
		return this.esemEstempresa;
	}

	public void setEsemEstempresa(EsemEstempresa esemEstempresa) {
		this.esemEstempresa = esemEstempresa;
	}

	public PerPeriodo getPerPeriodo() {
		return this.perPeriodo;
	}

	public void setPerPeriodo(PerPeriodo perPeriodo) {
		this.perPeriodo = perPeriodo;
	}

	public List<NofaNotfactura> getNofaNotfacturas() {
		return nofaNotfacturas;
	}

	public void setNofaNotfacturas(List<NofaNotfactura> nofaNotfacturas) {
		this.nofaNotfacturas = nofaNotfacturas;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_NOT_NOTA) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadCosuConsuscrip() {
		return ATRIBUTOS_ENTIDAD_NOT_NOTA;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cicAno == null) ? 0 : cicAno.hashCode());
		result = prime * result + ((dsusDetsuscrip == null) ? 0 : dsusDetsuscrip.hashCode());
		result = prime * result + ((esemEstempresa == null) ? 0 : esemEstempresa.hashCode());
		result = prime * result + ((notComentario == null) ? 0 : notComentario.hashCode());
		result = prime * result + ((notFecha == null) ? 0 : notFecha.hashCode());
		result = prime * result + ((notIderegistro == null) ? 0 : notIderegistro.hashCode());
		result = prime * result + ((perPeriodo == null) ? 0 : perPeriodo.hashCode());
		result = prime * result + ((uniMotnota == null) ? 0 : uniMotnota.hashCode());
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
		NotNota other = (NotNota) obj;
		if (cicAno == null) {
			if (other.cicAno != null)
				return false;
		} else if (!cicAno.equals(other.cicAno))
			return false;
		if (dsusDetsuscrip == null) {
			if (other.dsusDetsuscrip != null)
				return false;
		} else if (!dsusDetsuscrip.equals(other.dsusDetsuscrip))
			return false;
		if (esemEstempresa == null) {
			if (other.esemEstempresa != null)
				return false;
		} else if (!esemEstempresa.equals(other.esemEstempresa))
			return false;
		if (notComentario == null) {
			if (other.notComentario != null)
				return false;
		} else if (!notComentario.equals(other.notComentario))
			return false;
		if (notFecha == null) {
			if (other.notFecha != null)
				return false;
		} else if (!notFecha.equals(other.notFecha))
			return false;
		if (notIderegistro == null) {
			if (other.notIderegistro != null)
				return false;
		} else if (!notIderegistro.equals(other.notIderegistro))
			return false;
		if (perPeriodo == null) {
			if (other.perPeriodo != null)
				return false;
		} else if (!perPeriodo.equals(other.perPeriodo))
			return false;
		if (uniMotnota == null) {
			if (other.uniMotnota != null)
				return false;
		} else if (!uniMotnota.equals(other.uniMotnota))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}