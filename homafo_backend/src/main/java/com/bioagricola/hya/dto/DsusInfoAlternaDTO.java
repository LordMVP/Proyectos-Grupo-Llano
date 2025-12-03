package com.bioagricola.hya.dto;


import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bioagricola.homologaciones.entity.SusSuscripcion;

@Data
public class DsusInfoAlternaDTO {

    private Long dsusIderegistr;

    private String dsusPcodigo;

    private String  numCatastral;

    private List<DsusInfoDTO> dsusAlterna;

    private String nomCompleto;

    private Map<String,Object> estrato;

    private String proDireccion;

    private Map<String,Object> barrio;

    private Map<String,Object> complemento;

    private Map<String,Object> tipoUso;

    private Map<String,Object> liquidacion;

    private List<Map<String,Object>> condicionPredio;

    private String nomEstablecimiento;

    private Map<String,Object> actividadComercial;
    /*
     *Registro Nuevos Campos Formulario 
     * */
    private String  numCatastral30;
    
    private List<CosuConsuscripDTO> conceptosLiquidacion;
    
    private Object[] convenio; 
    
    private String observacion;
    
    

}
