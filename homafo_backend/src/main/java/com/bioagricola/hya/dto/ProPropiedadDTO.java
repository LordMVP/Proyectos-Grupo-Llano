package com.bioagricola.hya.dto;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Data
public class ProPropiedadDTO {

    private Long proIderegistro;

    private Long terIderegistro;

    private String proIdepropieda;

    private Long estTippropieda;
    @Size(max = 15, message = "Numero catastral debe contener maximo 15 digitos")
    private String proNumcatastral;
    @Size(max = 30, message = "Numero catastral nacional debe contener maximo 30 digitos")
    private String proNumcatastralnacional;
    @Min(value = 0, message = "El valor de digitos debe ser mayor que 0")
    private Integer proDigitos;
    @NotNull(message = "Municipio es requerido")
    private Long uniMunicipio;
    @NotNull(message = "Barrio es requerido")
    private Long uniBarrio;
    @NotNull(message = "Direccion es requerido")
    @Size(max = 50)
    private String proDireccion;
    private Long uniCmpdireccion;
    @NotNull(message = "Sector es requerido")
    private Long mubaSector;
    @NotNull(message = "Zona es requerido")
    @Size(max = 1)
    private String proZona;
    private Integer proSeccion;
    private Integer proManzana;
    private String proGpslatitud;
    private String proGpsaltitud;
    private String proGpslongitud;
    @NotNull(message = "Acceso restringido es requerido")
    @Size(max = 1)
    private String proAltriesgo;
    private String proDescripcion;
    private String proEstado;
    private Date proFecha;
    private String proResolcatastral;
    private Integer uniTipovivienda;
    private Long usuIderegistro;
    private Long uniTippropieda;
    private String proNummatriculainmobiliaria;
    private List<ClasificacionViviendaDTO> clasificacionViviendaDTOS;
    private Long proIdpadre ;
}
