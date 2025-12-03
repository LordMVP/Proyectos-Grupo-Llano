package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name="dprl_detliquidacionapro" , schema="aseo")
@NamedQuery(name = "DprlDetliquidacionapro.findAll", query = "SELECT p FROM DprlDetliquidacionapro p")
public class DprlDetliquidacionapro implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final String ENTIDAD_DPRL_DETLIQUIDACIONAPRO_PK="dprlIderegistro";
	public static final String ENTIDAD_DPRL_DETLIQUIDACIONAPRO_FAC_IDREGISTRO="facIderegistro";
	public static final String ENTIDAD_DPRL_DETLIQUIDACIONAPRO_TER_IDREGISTRO="terIderegistro";
	public static final String ENTIDAD_DPRL_DETLIQUIDACIONAPRO_PRLA_IDEREGISTRO="prlIdregistro";
	public static final String ENTIDAD_DPRL_DETLIQUIDACIONAPRO_ESTADO= "estado";
	public static final String ENTIDAD_DPRL_DETLIQUIDACIONAPRO_ID_EMPRESA= "idEmpresa";

	
	private static final String[] ATRIBUTOS_ENTIDAD_DPRL_DETLIQUIDACIONAPRO = {
			ENTIDAD_DPRL_DETLIQUIDACIONAPRO_PK, ENTIDAD_DPRL_DETLIQUIDACIONAPRO_FAC_IDREGISTRO,
			ENTIDAD_DPRL_DETLIQUIDACIONAPRO_PRLA_IDEREGISTRO, ENTIDAD_DPRL_DETLIQUIDACIONAPRO_ESTADO,
			ENTIDAD_DPRL_DETLIQUIDACIONAPRO_ID_EMPRESA
	};
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="dprl_ideregistro")
	private Integer dprlIderegistro;
	
    @Column(name="fac_ideregistro")
    private Long facIderegistro;
    
    @Column(name="ter_ideregistro")
    private Long terIderegistro;

    @Column(name="prl_idregistro")
    private Integer prlIdregistro;

    @Column(name="dprl_estado")
    private String estado;
    
    @Column(name="id_empresa")
    private Integer idEmpresa;

	@Column(name="uni_concepto")
	private Integer uniConcepto;

    public DprlDetliquidacionapro() {
		//constructor por defecto
    }

	public Integer getDprlIderegistr() {
		return dprlIderegistro;
	}

	public void setDprlIderegistr(Integer dprlIderegistr) {
		this.dprlIderegistro = dprlIderegistr;
	}

	public Long getFacIderegistro() {
		return facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public Integer getPrlIderegistro() {
		return prlIdregistro;
	}

	public void setPrlIderegistro(Integer prlIderegistro) {
		this.prlIdregistro = prlIderegistro;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public Long getTerIderegistro() {
		return terIderegistro;
	}

	public void setTerIderegistro(Long terIderegistro) {
		this.terIderegistro = terIderegistro;
	}
	
	public Integer getIdEmpresa() {
		return idEmpresa;
	}

	public void setIdEmpresa(Integer idEmpresa) {
		this.idEmpresa = idEmpresa;
	}

	public Integer getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_DPRL_DETLIQUIDACIONAPRO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadDprlDetliquidacionapro() {
		return ATRIBUTOS_ENTIDAD_DPRL_DETLIQUIDACIONAPRO;
	}
    
	
	

}
