package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import lombok.Data;

/**
 *
 * @author yasilva
 */
@Data
public class ResumenConsolidadoAprovDto {
    
    private Long id;
    
    private Long terIderegistro;
    
    private String terNomcompleto;
	
    private BigDecimal coapSaldoFactCc;

    private BigDecimal coapSaldoFactTa;

    private BigDecimal coapCambioVlrCteTa;

    private BigDecimal coapPagoCteCc;

    private BigDecimal coapPagoCteTa;

    private BigDecimal coapFactAjusteCc;

    private BigDecimal coapFactAjusteTa;

    private BigDecimal coapPagoAjusteCc;

    private BigDecimal coapPagoAjusteTa;

    private BigDecimal coapCambioVlrPagoCte;

    private BigDecimal coapVlrCastigado;
    
    /*--------------------------------------------------*/
    
    private BigDecimal coapSaldoFactIa;
    
    private BigDecimal coapFactAjusteIa;
    
    private BigDecimal coapPagoIa;

    private BigDecimal coapCambioVlrCteIa;

    private BigDecimal coapPagoCteIa;

    private BigDecimal coapCambioVlrPagoCteIa;

    private BigDecimal coapVlrCastigadoIa;

    private Integer facIderegistro;

    private Integer prlIdregistro;

    private Long perIdregistr;

    private Integer perFacturacion;
    
    private Integer perPrestacion;
    
    private Integer maprcIderegistr;
    
}
