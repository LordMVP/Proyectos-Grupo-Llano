package com.bioagricola.homologaciones.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class HomologacionInfoBasicaRequest
{
	private String terDocumento;
    private String terNomcompleto;
    private Integer naturaleza;
    private String direccion;
    private Integer barrio;
    private Integer sector;
    private Integer departamento;
    private Integer proyecto;
    private Integer complementoPropiedad;
    private String catastralAntes;
    private String castastralNuevo;
    private String matriculaInmobiliaria;
    private String ubicacion;
    private Integer actividadComercial;
    private String longitud;
    private String latitud;
    private List<ContContactoterceroRequest> contactoTerceroLista;
    private List<UniUnidadTerceroRequest> clasiTerceroLista;
    private List<UniClasificacionViviendaJson> clasificacionVivienda;
    private Integer dsusIderegistr;
    private Integer IdUsuario;

}
