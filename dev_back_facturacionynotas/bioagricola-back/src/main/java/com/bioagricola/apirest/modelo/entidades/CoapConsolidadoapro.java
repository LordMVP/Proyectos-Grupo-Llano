package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "coap_consolidadoapro", schema="aseo")
@NamedQuery(name = "CoapConsolidadoapro.findAll", query = "SELECT p FROM CoapConsolidadoapro p")
public class CoapConsolidadoapro implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_PK ="coapIderegistro";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_PRLA_IDREGISTRO ="dprlIderegistro";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_SALDO_FACTURACION_CC ="coapSaldoFactCc";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_SALDO_FACTURACION_TA ="coapSaldoFactTa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_CAMBIO_VLR_CORRIENTE_TA ="coapCambioVlrCteTa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_CORRIENTE_CC ="coapPagoCteCc";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_CORRIENTE_TA ="coapPagoCteTa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_FACTURADO_AJUSTE_CC ="coapFactAjusteCc";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_FACTURADO_AJUSTE_TA ="coapFactAjusteTa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_AJUSTE_CC ="coapPagoAjusteCc";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_AJUSTE_TA ="coapPagoAjusteTa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_CAMBIO_VLR_PAGO_CORRIENTE ="coapCambioVlrPagoCte";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_VALOR_CASTIGADO="coapVlrCastigado";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_DINC="dinc";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_ESTADO="estado";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_SALDO_FACT_IA="coapSaldoFactIa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_CAMBIO_VLR_CTE_IA="coapCambioVlrCteIa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_PAGO_CTE_IA="coapPagoCteIa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_CAMBIO_VLR_PAGO_CTE_IA="coapCambioVlrPagoCteIa";
	public static final String ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_NUMERO_HILO="coapNumeroHilo";
	

	private static final String [] ATRIBUTOS_ENTIDAD_COAP_CONSOLIDADOAPRO = {
			ENTIDAD_COAP_CONSOLIDADOAPRO_PK, ENTIDAD_COAP_CONSOLIDADOAPRO_PRLA_IDREGISTRO ,
			ENTIDAD_COAP_CONSOLIDADOAPRO_SALDO_FACTURACION_CC,
			ENTIDAD_COAP_CONSOLIDADOAPRO_SALDO_FACTURACION_TA, ENTIDAD_COAP_CONSOLIDADOAPRO_CAMBIO_VLR_CORRIENTE_TA,
			ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_CORRIENTE_TA, ENTIDAD_COAP_CONSOLIDADOAPRO_FACTURADO_AJUSTE_CC, 
			ENTIDAD_COAP_CONSOLIDADOAPRO_FACTURADO_AJUSTE_TA, ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_AJUSTE_CC ,
			ENTIDAD_COAP_CONSOLIDADOAPRO_PAGO_AJUSTE_TA , ENTIDAD_COAP_CONSOLIDADOAPRO_CAMBIO_VLR_PAGO_CORRIENTE ,
			ENTIDAD_COAP_CONSOLIDADOAPRO_VALOR_CASTIGADO, ENTIDAD_COAP_CONSOLIDADOAPRO_DINC,
			ENTIDAD_COAP_CONSOLIDADOAPRO_ESTADO,ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_SALDO_FACT_IA,
			ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_CAMBIO_VLR_CTE_IA,ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_PAGO_CTE_IA,
			ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_CAMBIO_VLR_PAGO_CTE_IA,ENTIDAD_COAP_CONSOLIDADOAPRO_COAP_NUMERO_HILO
	};
	
	@Id
	@SequenceGenerator(name = "stcoap_stage_consolidadoapro317_coap_ideregistro_seq", sequenceName = "stcoap_stage_consolidadoapro317_coap_ideregistro_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stcoap_stage_consolidadoapro317_coap_ideregistro_seq")
	@Column(name = "coap_ideregistro")
	private Integer coapIderegistro;
	
	@Column(name = "dprl_ideregistro")
	private Integer dprlIderegistro;
	
	@Column(name = "coap_saldo_fact_cc")
	private BigDecimal coapSaldoFactCc;
	
	@Column(name = "coap_saldo_fact_ta")
	private BigDecimal coapSaldoFactTa;
		
	@Column(name = "coap_cambio_vlr_cte_ta")
	private BigDecimal coapCambioVlrCteTa;
	
	@Column(name = "coap_pago_cte_cc")
	private BigDecimal coapPagoCteCc;
	
	@Column(name = "coap_pago_cte_ta")
	private BigDecimal coapPagoCteTa;
	
	@Column(name = "coap_fact_ajuste_cc")
	private BigDecimal coapFactAjusteCc;
	
	@Column(name = "coap_fact_ajuste_ta")
	private BigDecimal coapFactAjusteTa;
	
	@Column(name = "coap_pago_ajuste_cc")
	private BigDecimal coapPagoAjusteCc;
	
	@Column(name = "coap_pago_ajuste_ta")
	private BigDecimal coapPagoAjusteTa;
	
	@Column(name = "coap_cambio_vlr_pago_cte")
	private BigDecimal coapCambioVlrPagoCte;
	
	@Column(name = "coap_vlr_castigado")
	private BigDecimal coapVlrCastigado;
	
	@Column(name = "dinc")
	private BigDecimal dinc;
	
	@Column(name = "estado")
	private String estado;
	
	@Column(name = "coap_saldo_fact_ia")
	private BigDecimal coapSaldoFactIa;
	
	@Column(name = "coap_cambio_vlr_cte_ia")
	private BigDecimal coapCambioVlrCteIa;
	
	@Column(name = "coap_pago_cte_ia")
	private BigDecimal coapPagoCteIa;
	
	@Column(name = "coap_cambio_vlr_pago_cte_ia")
	private BigDecimal coapCambioVlrPagoCteIa;
	
	@Column(name = "coap_vlr_castigado_ia")
	private BigDecimal coapVlrCastigadoIa;

	@Column(name = "coap_numero_hilo")
	private Integer coapNumeroHilo;
	
	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name = "fecha_reg")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date fechaReg;
	
	@Column(name = "fac_ideregistro")
	private Integer facIderegistro;
	
	@Column(name = "ter_ideregistro")
	private Integer terIderegistro;
	
	@Column(name = "prl_idregistro")
	private Integer prlIdregistro;

	
	public CoapConsolidadoapro() {
		//constructor por defecto
	}


	public Integer getCoapIderegistro() {
		return coapIderegistro;
	}

	public void setCoapIderegistro(Integer coapIderegistro) {
		this.coapIderegistro = coapIderegistro;
	}

	public Integer getDprlIderegistro() {
		return dprlIderegistro;
	}

	public void setDprlIderegistro(Integer dprlIderegistro) {
		this.dprlIderegistro = dprlIderegistro;
	}

	public BigDecimal getCoapSaldoFactCc() {
		return coapSaldoFactCc;
	}

	public void setCoapSaldoFactCc(BigDecimal coapSaldoFactCc) {
		this.coapSaldoFactCc = coapSaldoFactCc;
	}

	public BigDecimal getCoapSaldoFactTa() {
		return coapSaldoFactTa;
	}

	public void setCoapSaldoFactTa(BigDecimal coapSaldoFactTa) {
		this.coapSaldoFactTa = coapSaldoFactTa;
	}

	public BigDecimal getCoapCambioVlrCteTa() {
		return coapCambioVlrCteTa;
	}

	public void setCoapCambioVlrCteTa(BigDecimal coapCambioVlrCteTa) {
		this.coapCambioVlrCteTa = coapCambioVlrCteTa;
	}

	public BigDecimal getCoapPagoCteCc() {
		return coapPagoCteCc;
	}

	public void setCoapPagoCteCc(BigDecimal coapPagoCteCc) {
		this.coapPagoCteCc = coapPagoCteCc;
	}

	public BigDecimal getCoapPagoCteTa() {
		return coapPagoCteTa;
	}

	public void setCoapPagoCteTa(BigDecimal coapPagoCteTa) {
		this.coapPagoCteTa = coapPagoCteTa;
	}

	public BigDecimal getCoapFactAjusteCc() {
		return coapFactAjusteCc;
	}

	public void setCoapFactAjusteCc(BigDecimal coapFactAjusteCc) {
		this.coapFactAjusteCc = coapFactAjusteCc;
	}

	public BigDecimal getCoapFactAjusteTa() {
		return coapFactAjusteTa;
	}

	public void setCoapFactAjusteTa(BigDecimal coapFactAjusteTa) {
		this.coapFactAjusteTa = coapFactAjusteTa;
	}

	public BigDecimal getCoapPagoAjusteCc() {
		return coapPagoAjusteCc;
	}

	public void setCoapPagoAjusteCc(BigDecimal coapPagoAjusteCc) {
		this.coapPagoAjusteCc = coapPagoAjusteCc;
	}

	public BigDecimal getCoapPagoAjusteTa() {
		return coapPagoAjusteTa;
	}

	public void setCoapPagoAjusteTa(BigDecimal coapPagoAjusteTa) {
		this.coapPagoAjusteTa = coapPagoAjusteTa;
	}

	public BigDecimal getCoapCambioVlrPagoCte() {
		return coapCambioVlrPagoCte;
	}

	public void setCoapCambioVlrPagoCte(BigDecimal coapCambioVlrPagoCte) {
		this.coapCambioVlrPagoCte = coapCambioVlrPagoCte;
	}

	public BigDecimal getCoapVlrCastigado() {
		return coapVlrCastigado;
	}

	public void setCoapVlrCastigado(BigDecimal coapVlrCastigado) {
		this.coapVlrCastigado = coapVlrCastigado;
	}

	public BigDecimal getDinc() {
		return dinc;
	}

	public void setDinc(BigDecimal dinc) {
		this.dinc = dinc;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public BigDecimal getCoapSaldoFactIa() {
		return coapSaldoFactIa;
	}


	public void setCoapSaldoFactIa(BigDecimal coapSaldoFactIa) {
		this.coapSaldoFactIa = coapSaldoFactIa;
	}


	public BigDecimal getCoapCambioVlrCteIa() {
		return coapCambioVlrCteIa;
	}


	public void setCoapCambioVlrCteIa(BigDecimal coapCambioVlrCteIa) {
		this.coapCambioVlrCteIa = coapCambioVlrCteIa;
	}


	public BigDecimal getCoapPagoCteIa() {
		return coapPagoCteIa;
	}


	public void setCoapPagoCteIa(BigDecimal coapPagoCteIa) {
		this.coapPagoCteIa = coapPagoCteIa;
	}


	public BigDecimal getCoapCambioVlrPagoCteIa() {
		return coapCambioVlrPagoCteIa;
	}


	public void setCoapCambioVlrPagoCteIa(BigDecimal coapCambioVlrPagoCteIa) {
		this.coapCambioVlrPagoCteIa = coapCambioVlrPagoCteIa;
	}


	public BigDecimal getCoapVlrCastigadoIa() {
		return coapVlrCastigadoIa;
	}


	public void setCoapVlrCastigadoIa(BigDecimal coapVlrCastigadoIa) {
		this.coapVlrCastigadoIa = coapVlrCastigadoIa;
	}


	public Integer getCoapNumeroHilo() {
		return coapNumeroHilo;
	}


	public void setCoapNumeroHilo(Integer coapNumeroHilo) {
		this.coapNumeroHilo = coapNumeroHilo;
	}
	
	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}


	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public Date getFechaReg() {
		return fechaReg;
	}


	public void setFechaReg(Date fechaReg) {
		this.fechaReg = fechaReg;
	}
	
	public Integer getFacIderegistro() {
		return facIderegistro;
	}


	public void setFacIderegistro(Integer facIderegistro) {
		this.facIderegistro = facIderegistro;
	}


	public Integer getTerIderegistro() {
		return terIderegistro;
	}


	public void setTerIderegistro(Integer terIderegistro) {
		this.terIderegistro = terIderegistro;
	}


	public Integer getPrlIdregistro() {
		return prlIdregistro;
	}


	public void setPrlIdregistro(Integer prlIdregistro) {
		this.prlIdregistro = prlIdregistro;
	}


	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_COAP_CONSOLIDADOAPRO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadCoapConsolidadoApro() {
		return ATRIBUTOS_ENTIDAD_COAP_CONSOLIDADOAPRO;
	}
	
	
}
