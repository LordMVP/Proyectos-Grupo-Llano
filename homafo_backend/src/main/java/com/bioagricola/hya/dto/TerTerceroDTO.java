package com.bioagricola.hya.dto;

import com.bioagricola.homologaciones.dto.basic.BarriosDTO;
import com.bioagricola.homologaciones.dto.basic.ProyectosDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
public class TerTerceroDTO {
    private Long terIderegistro;

    @NotBlank(message = "documento es obligatorio")
    @NotNull(message = "documento es obligatorio")
    @Size(max = 20, message = "el maximo tamaño es de 20 caracteres")
    private String terDocumento;
    @NotBlank(message = "nombre es obligatorio")
    @NotNull(message = "nombre es obligatorio")
    @Size(max = 50, message = "el maximo tamaño es de 50 caracteres")
    private String terNombre;
    @NotBlank(message = "apellido es obligatorio")
    @NotNull(message = "apellido es obligatorio")
    @Size(max = 50, message = "el maximo tamaño es de 50 caracteres")
    private String terApellido;
    private String terNomcompleto;
    @NotBlank(message = "sexo es obligatorio")
    @NotNull(message = "sexo es obligatorio")
    @Size(max = 2, message = "el maximo tamaño es de 2 caracteres")
    private String terSexo;
    private String terTelcelular;
    private String terTelfijo;
    private Long estTiptercero;
    @NotNull(message = "Unidad tipo tercero es obligatorio")
    private Long uniTiptercero;
    private String terCorreo;
    //@NotNull(message = "usuario registra es obligatorio")
    private Long usuIderegistro;
    private String ciudadCod;
    private String ciudadNombre;
    private Date terDocexpedicion;
    @NotNull(message = "unidad tipo identificacion es obligatorio")
    private Long uniTipidentifica;
    private Date terFecnacimiento;
    private Integer terDigverificacion;
    private Map<String, Object> terInfoadicional;
    private List<ClteClaterceroDTO> claterceros;
    private BarriosDTO barriosDTO;
    private ProyectosDTO proyectosDTO;
    private List<ContContactoTerceroDTO> contactosTercero;
}
