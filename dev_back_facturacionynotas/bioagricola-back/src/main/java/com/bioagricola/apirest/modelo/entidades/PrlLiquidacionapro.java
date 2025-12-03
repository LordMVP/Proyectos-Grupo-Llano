package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name="prl_liquidacionapro", schema="aseo")
@NamedQuery(name = "PrlLiquidacionapro.findAll", query = "SELECT p FROM PrlLiquidacionapro p")
public class PrlLiquidacionapro implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PK="prlIderegistro";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PER_IDREGISTRO="perIderegistro";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_TIPO_PROCESO= "prlTipoProceso";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_USU_IDREGISTRO="prlUsuIderegistro";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_EJECUCION="prlFechaEjecucion";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_APROBACION="prlFechaAprobacion";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_DESCARTE="prlFechaDescarte";
	public static final String ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_ESTADO="prlEstado";
	
	private static final String[] ATRIBUTOS_ENTIDAD_PRL_LIQUIDACIONAPRO = {
			ENTIDAD_PRL_LIQUIDACIONAPRO_PK, ENTIDAD_PRL_LIQUIDACIONAPRO_PER_IDREGISTRO,
			ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_TIPO_PROCESO, ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_USU_IDREGISTRO,
			ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_EJECUCION, ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_APROBACION,
			ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_APROBACION ,ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_DESCARTE,
			ENTIDAD_PRL_LIQUIDACIONAPRO_PRL_FECHA_ESTADO
	};

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="prl_ideregistro")
	private Integer prlIderegistro;
	
    @Column(name="per_ideregistro")
    private Integer perIderegistro;
    
    @Column(name="prl_tipo_proceso")
	private Integer prlTipoProceso;

    @Column(name="prl_usu_ideregistro")
    private Integer prlUsuIderegistro;
    
    @Column(name="prl_fecha_ejecucion")
    private Date prlFechaEjecucion;
    
    @Column(name="prl_fecha_aprobacion")
    private Date prlFechaAprobacion;
    
    @Column(name="prl_fecha_descarte")
    private Date prlFechaDescarte;
    
    @Column(name="prl_estado")
    private String prlEstado;
    
    public PrlLiquidacionapro() {
		//constructor por defecto
    }

	public Integer getPrlIderegistro() {
		return prlIderegistro;
	}

	public void setPrlIderegistro(Integer prlIderegistro) {
		this.prlIderegistro = prlIderegistro;
	}

	public Integer getPerIderegistro() {
		return perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public Integer getPrlTipoProceso() {
		return prlTipoProceso;
	}

	public void setPrlTipoProceso(Integer prlTipoProceso) {
		this.prlTipoProceso = prlTipoProceso;
	}

	public Integer getPrlUsuIderegistro() {
		return prlUsuIderegistro;
	}

	public void setPrlUsuIderegistro(Integer prlUsuIderegistro) {
		this.prlUsuIderegistro = prlUsuIderegistro;
	}

	public Date getPrlFechaEjecucion() {
		return prlFechaEjecucion;
	}

	public void setPrlFechaEjecucion(Date prlFechaEjecucion) {
		this.prlFechaEjecucion = prlFechaEjecucion;
	}

	public Date getPrlFechaAprobacion() {
		return prlFechaAprobacion;
	}

	public void setPrlFechaAprobacion(Date prlFechaAprobacion) {
		this.prlFechaAprobacion = prlFechaAprobacion;
	}

	public Date getPrlFechaDescarte() {
		return prlFechaDescarte;
	}

	public void setPrlFechaDescarte(Date prlFechaDescarte) {
		this.prlFechaDescarte = prlFechaDescarte;
	}

	public String getPrlEstado() {
		return prlEstado;
	}

	public void setPrlEstado(String prlEstado) {
		this.prlEstado = prlEstado;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_PRL_LIQUIDACIONAPRO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadPrlLiquidacionapro() {
		return ATRIBUTOS_ENTIDAD_PRL_LIQUIDACIONAPRO;
	}
    
    

}
