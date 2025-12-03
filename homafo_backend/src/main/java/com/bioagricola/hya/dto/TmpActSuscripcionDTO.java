package com.bioagricola.hya.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Data
public class TmpActSuscripcionDTO {

	//Respuesta - Formulario
    private Long actsusIderegistro;

    //Respuesta
    private String dsusPcodigoAseo;
    
    //Respuesta
    private Long dsusIderegistro;
    
    //Respuesta - Formulario
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private LocalDate fechaEncuesta;
    
    //Respuesta - Formulario
    private Long usuIderegistro;
    
    //Respuesta - Formulario
    private String facturacion;
    
    //Respuesta - Formulario
    private String terNombre;
    
    //Respuesta - Formulario
    private String terTipoDocumento;
    
    //Respuesta - Formulario
    private String terDocumento;
    
    //Respuesta - Formulario
    private String terTelcelular;
    
    //Respuesta - Formulario
    private String terCorreo;
    
    //Respuesta - Formulario
    private String proDireccion;
    
    //Respuesta - Formulario
    private String proZona;
    
    //Respuesta - Formulario
    private Long mubaSector;
    
    //Respuesta - Formulario
    private Integer proSeccion;
    
    //Respuesta - Formulario
    private Integer proManzana;
    
    //Formulario
    private Long uniBarrio;
    
    //Formulario
    private Long uniComplemento;
    
    //Respuesta - Formulario
    private String nomEstablecimiento;
    
    //Formulario
    private Long uniActcomercial;
    
    //Respuesta - Formulario
    private Integer proCatestrato;
    
    //Formulario
    private Long uniTipusosus;
    
    //Formulario
    private Long uniLiquidacion;
    
    //Respuesta - Formulario
    private String proNumcatastral;
    
    //Respuesta - Formulario
    private String proNumcatastralnacional;
    
    //Formulario
    private String servicioEmsa;
    
    //Formulario
    private String medidorAlternoEmsa;
    
    //Formulario
    private String codigoAlternoEmsa;
    
    //Formulario
    private String servicioGas;
    
    //Formulario
    private String medidorAlternoGas;
    
    //Formulario
    private String codigoAlternoGas;
    
    //Formulario
    private Integer deshabitado;
    
    //Formulario
    private Integer descuento_pap;
    
    //Respuesta - Formulario
    private String observacion;
    
    //Respuesta
    private String actsusTipo;
    
    //Respuesta
    private Character actsusEstado;
    
    //Respuesta
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private LocalDateTime actsusFecha;

    //Respuesta
    private List<AlternaDto> actsusAlterna;

    //Respuesta
    private Map<String,Object> barrio;

    //Respuesta
    private Map<String,Object> complemento;
    
    //Respuesta
    private Map<String,Object> estrato;

    //Respuesta
    private Map<String,Object> tipUsosus;

    //Respuesta
    private Map<String,Object> liquidacion;

    //Respuesta
    private List<Object> condsPredio;

    //Respuesta
    private Map<String,Object> actComercial;
    
    //Respuesta
    private Map<String,Object> conceptosLiquidacion;
    
}
