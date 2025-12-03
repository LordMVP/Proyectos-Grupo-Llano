package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
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

@Entity
@Table(name = "cuap_cuenta_aprovechamiento")
@NamedQuery(name = "CuapCuentaAprovechamiento.findAll", query = "SELECT p FROM CuapCuentaAprovechamiento p")
public class CuapCuentaAprovechamiento implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_PK = "cuaIderegistro";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_PRA_IDREGISTRO = "praIderegistro";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VERSION = "liqVersion";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_TER_IDEREGISTRO="terIderegistro";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_FACTURADO = "liqValorFacturado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_RECAUDADO = "liqValorRecaudado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_FACTURADO = "liqValorCcFacturado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_RECAUDADO = "liqValorCcRecaudado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_FACTURADO = "liqValorTaFacturado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_RECAUDADO = "liqValorTaRecaudado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_IA_FACTURADO = "liqValorIaFacturado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_IA_RECAUDADO = "liqValorIaRecaudado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_FECHA = "liqFecha";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_NUMERO_FACTURAS_A_PAGAR = "liqNumeroFacturasAPagar";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_ESTADO = "liqEstado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_UNI_LIQUIDACION = "uniLiquidacion";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_AJUSTE_FACTURA = "liqAjusteAFactura";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_UNI_DOCUMENTO = "uniDocumento";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_UNI_TIPDOCUMENT = "uniTipdocument";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_AJUSTE_FACTURADO = "liqValorCcAjusteFacturado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_AJUSTE_RECAUDADO = "liqValorCcAjusteRecaudado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_AJUSTE_FACTURADO = "liqValorTaAjusteFacturado";
	public static final String ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_AJUSTE_RECAUDADO = "liqValorTaAjusteRecaudado";
	
	private static final String [] ATRIBUTOS_ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO = {
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_PK, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_PRA_IDREGISTRO ,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VERSION ,ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_TER_IDEREGISTRO,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_FACTURADO, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_RECAUDADO ,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_FACTURADO, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_RECAUDADO, 
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_FACTURADO, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_RECAUDADO ,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_IA_FACTURADO , ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_IA_RECAUDADO ,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_FECHA , ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_NUMERO_FACTURAS_A_PAGAR,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_ESTADO, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_UNI_LIQUIDACION, 
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_AJUSTE_FACTURA, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_UNI_DOCUMENTO,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_UNI_TIPDOCUMENT, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_AJUSTE_FACTURADO,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_CC_AJUSTE_RECAUDADO, ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_AJUSTE_FACTURADO ,
			ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO_LIQ_VALOR_TA_AJUSTE_RECAUDADO 
	};


	
	@Id
	@SequenceGenerator(name = "sq_cua_ideregistro", sequenceName = "sq_cua_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_cua_ideregistro")
	@Column(name = "cua_ideregistro")
	private Integer cuaIderegistro;
	
	@Column(name = "pra_ideregistro")
	private Integer praIderegistro;
	
	@Column(name = "liq_version")
	private Integer liqVersion;
	
	@Column(name = "ter_ideregistro")
	private Long terIderegistro;
	
	@Column(name = "liq_valor_facturado")
	private Long liqValorFacturado;
	
	@Column(name = "liq_valor_recaudado")
	private Long liqValorRecaudado;
	
	@Column(name = "liq_valor_cc_facturado")
	private Long liqValorCcFacturado;
	
	@Column(name = "liq_valor_cc_recaudado")
	private Long liqValorCcRecaudado;
	
	@Column(name = "liq_valor_ta_facturado")
	private Long liqValorTaFacturado;
	
	@Column(name = "liq_valor_ta_recaudado")
	private Long liqValorTaRecaudado;
	
	@Column(name = "liq_valor_ia_facturado")
	private Long liqValorIaFacturado;
	
	@Column(name = "liq_valor_ia_recaudado")
	private Long liqValorIaRecaudado;
	
	@Column(name = "liq_fecha")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date liqFecha;
	
	@Column(name = "liq_numero_facturas_a_pagar")
	private Integer liqNumeroFacturasAPagar;
	
	@Column(name = "liq_estado")
	private String liqEstado;
	
	@Column(name = "uni_liquidacion")
	private Integer uniLiquidacion;
	
	@Column(name = "liq_ajuste_a_factura")
	private Long liqAjusteAFactura;
	
	@Column(name = "uni_documento")
	private Integer uniDocumento;
	
	@Column(name = "uni_tipdocument")
	private Integer uniTipdocument;
	
	@Column(name = "liq_valor_cc_ajuste_facturado")
	private Long liqValorCcAjusteFacturado;
	
	@Column(name = "liq_valor_cc_ajuste_recaudado")
	private Long liqValorCcAjusteRecaudado;
	
	@Column(name = "liq_valor_ta_ajuste_facturado")
	private Long liqValorTaAjusteFacturado;
	
	@Column(name = "liq_valor_ta_ajuste_recaudado")
	private Long liqValorTaAjusteRecaudado;
	
	public CuapCuentaAprovechamiento() {
		//constructor por defecto
	}

	public Integer getCuaIderegistro() {
		return cuaIderegistro;
	}

	public void setCuaIderegistro(Integer cuaIderegistro) {
		this.cuaIderegistro = cuaIderegistro;
	}

	public Integer getPraIderegistro() {
		return praIderegistro;
	}

	public void setPraIderegistro(Integer praIderegistro) {
		this.praIderegistro = praIderegistro;
	}

	public Integer getLiqVersion() {
		return liqVersion;
	}

	public void setLiqVersion(Integer liqVersion) {
		this.liqVersion = liqVersion;
	}

	public Long getTerIderegistro() {
		return terIderegistro;
	}

	public void setTerIderegistro(Long terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public Long getLiqValorFacturado() {
		return liqValorFacturado;
	}

	public void setLiqValorFacturado(Long liqValorFacturado) {
		this.liqValorFacturado = liqValorFacturado;
	}

	public Long getLiqValorRecaudado() {
		return liqValorRecaudado;
	}

	public void setLiqValorRecaudado(Long liqValorRecaudado) {
		this.liqValorRecaudado = liqValorRecaudado;
	}

	public Long getLiqValorCcFacturado() {
		return liqValorCcFacturado;
	}

	public void setLiqValorCcFacturado(Long liqValorCcFacturado) {
		this.liqValorCcFacturado = liqValorCcFacturado;
	}

	public Long getLiqValorCcRecaudado() {
		return liqValorCcRecaudado;
	}

	public void setLiqValorCcRecaudado(Long liqValorCcRecaudado) {
		this.liqValorCcRecaudado = liqValorCcRecaudado;
	}

	public Long getLiqValorTaFacturado() {
		return liqValorTaFacturado;
	}

	public void setLiqValorTaFacturado(Long liqValorTaFacturado) {
		this.liqValorTaFacturado = liqValorTaFacturado;
	}

	public Long getLiqValorTaRecaudado() {
		return liqValorTaRecaudado;
	}

	public void setLiqValorTaRecaudado(Long liqValorTaRecaudado) {
		this.liqValorTaRecaudado = liqValorTaRecaudado;
	}

	public Long getLiqValorIaFacturado() {
		return liqValorIaFacturado;
	}

	public void setLiqValorIaFacturado(Long liqValorIaFacturado) {
		this.liqValorIaFacturado = liqValorIaFacturado;
	}

	public Long getLiqValorIaRecaudado() {
		return liqValorIaRecaudado;
	}

	public void setLiqValorIaRecaudado(Long liqValorIaRecaudado) {
		this.liqValorIaRecaudado = liqValorIaRecaudado;
	}

	public Date getLiqFecha() {
		return liqFecha;
	}

	public void setLiqFecha(Date liqFecha) {
		this.liqFecha = liqFecha;
	}

	public Integer getLiqNumeroFacturasAPagar() {
		return liqNumeroFacturasAPagar;
	}

	public void setLiqNumeroFacturasAPagar(Integer liqNumeroFacturasAPagar) {
		this.liqNumeroFacturasAPagar = liqNumeroFacturasAPagar;
	}

	public String getLiqEstado() {
		return liqEstado;
	}

	public void setLiqEstado(String liqEstado) {
		this.liqEstado = liqEstado;
	}

	public Integer getUniLiquidacion() {
		return uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public Long getLiqAjusteAFactura() {
		return liqAjusteAFactura;
	}

	public void setLiqAjusteAFactura(Long liqAjusteAFactura) {
		this.liqAjusteAFactura = liqAjusteAFactura;
	}

	public Integer getUniDocumento() {
		return uniDocumento;
	}

	public void setUniDocumento(Integer uniDocumento) {
		this.uniDocumento = uniDocumento;
	}

	public Integer getUniTipdocument() {
		return uniTipdocument;
	}

	public void setUniTipdocument(Integer uniTipdocument) {
		this.uniTipdocument = uniTipdocument;
	}

	public Long getLiqValorCcAjusteFacturado() {
		return liqValorCcAjusteFacturado;
	}

	public void setLiqValorCcAjusteFacturado(Long liqValorCcAjusteFacturado) {
		this.liqValorCcAjusteFacturado = liqValorCcAjusteFacturado;
	}

	public Long getLiqValorCcAjusteRecaudado() {
		return liqValorCcAjusteRecaudado;
	}

	public void setLiqValorCcAjusteRecaudado(Long liqValorCcAjusteRecaudado) {
		this.liqValorCcAjusteRecaudado = liqValorCcAjusteRecaudado;
	}

	public Long getLiqValorTaAjusteFacturado() {
		return liqValorTaAjusteFacturado;
	}

	public void setLiqValorTaAjusteFacturado(Long liqValorTaAjusteFacturado) {
		this.liqValorTaAjusteFacturado = liqValorTaAjusteFacturado;
	}

	public Long getLiqValorTaAjusteRecaudado() {
		return liqValorTaAjusteRecaudado;
	}

	public void setLiqValorTaAjusteRecaudado(Long liqValorTaAjusteRecaudado) {
		this.liqValorTaAjusteRecaudado = liqValorTaAjusteRecaudado;
	}
	
	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadCuapCuentaAprovechamiento() {
		return ATRIBUTOS_ENTIDAD_CUAP_CUENTA_APROVECHAMIENTO;
	}
	
	

	
	

}
