package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

@Entity
@Table(name="acc_acceso")
@NamedQuery(name = "AccAcceso.findAll", query = "SELECT p FROM AccAcceso p")
public class AccAcceso implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_ACC_ACCESO_PK = "accIderegistro";
	public static final String ENTIDAD_ACC_ACCESO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_ACC_ACCESO_ACC_FECINGRESO = "accFecingreso";
	public static final String ENTIDAD_ACC_ACCESO_ACC_FECSALIDA = "accFecsalida";
	public static final String ENTIDAD_ACC_ACCESO_ACC_ESTADO = "accEstado";
	public static final String ENTIDAD_ACC_ACCESO_EMP_IDREGISTRO = "empIderegistro";
	public static final String ENTIDAD_ACC_ACCESO_PFI_IDEREGISTRO = "pfiIderegistro";
	public static final String ENTIDAD_ACC_ACCESO_ACC_OBSERVACION = "accObservacion";
	private static final String[] ATRIBUTOS_ENTIDAD_ACC_ACCESO
    = {ENTIDAD_ACC_ACCESO_PK,ENTIDAD_ACC_ACCESO_USU_IDEREGISTRO,ENTIDAD_ACC_ACCESO_ACC_FECINGRESO,ENTIDAD_ACC_ACCESO_ACC_FECSALIDA,ENTIDAD_ACC_ACCESO_ACC_ESTADO,ENTIDAD_ACC_ACCESO_EMP_IDREGISTRO,ENTIDAD_ACC_ACCESO_PFI_IDEREGISTRO,ENTIDAD_ACC_ACCESO_ACC_OBSERVACION};
	
	@Id
	@Column(name="acc_ideregistro")
	private Long accIderegistro;
	
	@PodamExclude
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name="acc_fecingreso")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date accFecingreso;
	
	@Column(name="acc_fecsalida")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date accFecsalida;
	
	@Column(name="acc_estado")
	@Size(min=0, max= 1)
	private String accEstado;
	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="pfi_ideregistro")
	private Integer pfiIderegistro;
	
	@Column(name="acc_observacion")
	private String accObservacion;
	
	@ManyToOne
	@JoinColumn(name="usu_ideregistro", referencedColumnName="usu_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private Usuarios accAccesoUsuIderegistroFkey1;
	
	
	
	public AccAcceso(){
		//constructor por defecto
	}

	public Long getAccIderegistro() {
		return accIderegistro;
	}

	public void setAccIderegistro(Long accIderegistro) {
		this.accIderegistro = accIderegistro;
	}

	public Long getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public Date getAccFecingreso() {
		return accFecingreso;
	}

	public void setAccFecingreso(Date accFecingreso) {
		this.accFecingreso = accFecingreso;
	}

	public Date getAccFecsalida() {
		return accFecsalida;
	}

	public void setAccFecsalida(Date accFecsalida) {
		this.accFecsalida = accFecsalida;
	}

	public String getAccEstado() {
		return accEstado;
	}

	public void setAccEstado(String accEstado) {
		this.accEstado = accEstado;
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Integer getPfiIderegistro() {
		return pfiIderegistro;
	}

	public void setPfiIderegistro(Integer pfiIderegistro) {
		this.pfiIderegistro = pfiIderegistro;
	}

	public String getAccObservacion() {
		return accObservacion;
	}

	public void setAccObservacion(String accObservacion) {
		this.accObservacion = accObservacion;
	}

	public Usuarios getAccAccesoUsuIderegistroFkey1() {
		return accAccesoUsuIderegistroFkey1;
	}

	public void setAccAccesoUsuIderegistroFkey1(Usuarios accAccesoUsuIderegistroFkey1) {
		this.accAccesoUsuIderegistroFkey1 = accAccesoUsuIderegistroFkey1;
	}
	
	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_ACC_ACCESO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
	public static String[] getAtributosEntidadAccAcceso() {
		return ATRIBUTOS_ENTIDAD_ACC_ACCESO;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accEstado == null) ? 0 : accEstado.hashCode());
		result = prime * result + ((accFecingreso == null) ? 0 : accFecingreso.hashCode());
		result = prime * result + ((accFecsalida == null) ? 0 : accFecsalida.hashCode());
		result = prime * result + ((accIderegistro == null) ? 0 : accIderegistro.hashCode());
		result = prime * result + ((accObservacion == null) ? 0 : accObservacion.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((pfiIderegistro == null) ? 0 : pfiIderegistro.hashCode());
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
		AccAcceso other = (AccAcceso) obj;
		if (accEstado == null) {
			if (other.accEstado != null)
				return false;
		} else if (!accEstado.equals(other.accEstado))
			return false;
		if (accFecingreso == null) {
			if (other.accFecingreso != null)
				return false;
		} else if (!accFecingreso.equals(other.accFecingreso))
			return false;
		if (accFecsalida == null) {
			if (other.accFecsalida != null)
				return false;
		} else if (!accFecsalida.equals(other.accFecsalida))
			return false;
		if (accIderegistro == null) {
			if (other.accIderegistro != null)
				return false;
		} else if (!accIderegistro.equals(other.accIderegistro))
			return false;
		if (accObservacion == null) {
			if (other.accObservacion != null)
				return false;
		} else if (!accObservacion.equals(other.accObservacion))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (pfiIderegistro == null) {
			if (other.pfiIderegistro != null)
				return false;
		} else if (!pfiIderegistro.equals(other.pfiIderegistro))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

	
	
	
	
	
	
	
	
	
}
