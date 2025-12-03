package com.bioagricola.apirest.modelo.entidades;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.validation.constraints.Size;

@Entity
@Table(name = "cpr_ctrproceso")
@NamedQuery(name = "CprCtrproceso.findAll", query = "SELECT p FROM CprCtrProceso p")
public class CprCtrProceso {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_CPR_CTRPROCESO_PK = "cprIderegistro";
	public static final String ENTIDAD_CPR_CTRPROCESO_CPR_ESTADO = "cprEstado";
	public static final String ENTIDAD_CPR_CTRPROCESO_CPR_FECINICIO = "cprFecinicio";
	public static final String ENTIDAD_CPR_CTRPROCESO_CPR_FECFINAL = "cprFecfinal";
	public static final String ENTIDAD_CPR_CTRPROCESO_CPR_CANREGISTRO = "cprCanregistro";
	public static final String ENTIDAD_CPR_CTRPROCESO_PRG_IDREGISTRO = "prgIderegistro";
	public static final String ENTIDAD_CPR_CTRPROCESO_ACC_IDEREGISTRO = "accIderegistro";
	public static final String ENTIDAD_CPR_CTRPROCESO_EMP_IDEREGISTRO = "empIderegistro";
	public static final String ENTIDAD_CPR_CTRPROCESO_CPR_IDEHILO = "cprIdehilo";
	public static final String ENTIDAD_CPR_CTRPROCESO_USU_IDEREGISTRO = "usuIderegistro";
	private static final String[] ATRIBUTOS_ENTIDAD_CPR_CTRPROCESO = { ENTIDAD_CPR_CTRPROCESO_PK,
			ENTIDAD_CPR_CTRPROCESO_CPR_ESTADO, ENTIDAD_CPR_CTRPROCESO_CPR_FECINICIO,
			ENTIDAD_CPR_CTRPROCESO_CPR_FECFINAL, ENTIDAD_CPR_CTRPROCESO_CPR_CANREGISTRO,
			ENTIDAD_CPR_CTRPROCESO_PRG_IDREGISTRO, ENTIDAD_CPR_CTRPROCESO_ACC_IDEREGISTRO,
			ENTIDAD_CPR_CTRPROCESO_EMP_IDEREGISTRO, ENTIDAD_CPR_CTRPROCESO_CPR_IDEHILO,
			ENTIDAD_CPR_CTRPROCESO_USU_IDEREGISTRO };

	@Id
	@SequenceGenerator(name = "sq_cpr_ideregistro", sequenceName = "sq_cpr_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_cpr_ideregistro")
	@Column(name = "cpr_ideregistro")
	private Long cprIderegistro;

	@Column(name = "cpr_estado")
	@Size(min = 0, max = 1)
	private String cprEstado;

	@Column(name = "cpr_fecinicio")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date cprFecinicio;

	@Column(name = "cpr_fecfinal")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date cprFecfinal;

	@Column(name = "cpr_canregistro")
	private Long cprCanregistro;

	@Column(name = "prg_ideregistro")
	private Integer prgIderegistro;

	@Column(name = "acc_ideregistro")
	private Long accIderegistro;

	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	@Column(name = "cpr_idehilo")
	private Long cprIdehilo;

	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public CprCtrProceso() {
		//constructor por defecto
	}

	public Long getCprIderegistro() {
		return cprIderegistro;
	}

	public void setCprIderegistro(Long cprIderegistro) {
		this.cprIderegistro = cprIderegistro;
	}

	public String getCprEstado() {
		return cprEstado;
	}

	public void setCprEstado(String cprEstado) {
		this.cprEstado = cprEstado;
	}

	public Date getCprFecinicio() {
		return cprFecinicio;
	}

	public void setCprFecinicio(Date cprFecinicio) {
		this.cprFecinicio = cprFecinicio;
	}

	public Date getCprFecfinal() {
		return cprFecfinal;
	}

	public void setCprFecfinal(Date cprFecfinal) {
		this.cprFecfinal = cprFecfinal;
	}

	public Long getCprCanregistro() {
		return cprCanregistro;
	}

	public void setCprCanregistro(Long cprCanregistro) {
		this.cprCanregistro = cprCanregistro;
	}

	public Integer getPrgIderegistro() {
		return prgIderegistro;
	}

	public void setPrgIderegistro(Integer prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	public Long getAccIderegistro() {
		return accIderegistro;
	}

	public void setAccIderegistro(Long accIderegistro) {
		this.accIderegistro = accIderegistro;
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Long getCprIdehilo() {
		return cprIdehilo;
	}

	public void setCprIdehilo(Long cprIdehilo) {
		this.cprIdehilo = cprIdehilo;
	}

	public Long getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_CPR_CTRPROCESO) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadCprCtrproceso() {
		return ATRIBUTOS_ENTIDAD_CPR_CTRPROCESO;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accIderegistro == null) ? 0 : accIderegistro.hashCode());
		result = prime * result + ((cprCanregistro == null) ? 0 : cprCanregistro.hashCode());
		result = prime * result + ((cprEstado == null) ? 0 : cprEstado.hashCode());
		result = prime * result + ((cprFecfinal == null) ? 0 : cprFecfinal.hashCode());
		result = prime * result + ((cprFecinicio == null) ? 0 : cprFecinicio.hashCode());
		result = prime * result + ((cprIdehilo == null) ? 0 : cprIdehilo.hashCode());
		result = prime * result + ((cprIderegistro == null) ? 0 : cprIderegistro.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((prgIderegistro == null) ? 0 : prgIderegistro.hashCode());
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
		CprCtrProceso other = (CprCtrProceso) obj;
		if (accIderegistro == null) {
			if (other.accIderegistro != null)
				return false;
		} else if (!accIderegistro.equals(other.accIderegistro))
			return false;
		if (cprCanregistro == null) {
			if (other.cprCanregistro != null)
				return false;
		} else if (!cprCanregistro.equals(other.cprCanregistro))
			return false;
		if (cprEstado == null) {
			if (other.cprEstado != null)
				return false;
		} else if (!cprEstado.equals(other.cprEstado))
			return false;
		if (cprFecfinal == null) {
			if (other.cprFecfinal != null)
				return false;
		} else if (!cprFecfinal.equals(other.cprFecfinal))
			return false;
		if (cprFecinicio == null) {
			if (other.cprFecinicio != null)
				return false;
		} else if (!cprFecinicio.equals(other.cprFecinicio))
			return false;
		if (cprIdehilo == null) {
			if (other.cprIdehilo != null)
				return false;
		} else if (!cprIdehilo.equals(other.cprIdehilo))
			return false;
		if (cprIderegistro == null) {
			if (other.cprIderegistro != null)
				return false;
		} else if (!cprIderegistro.equals(other.cprIderegistro))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (prgIderegistro == null) {
			if (other.prgIderegistro != null)
				return false;
		} else if (!prgIderegistro.equals(other.prgIderegistro))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
