
package com.bioagricola.apirest.modelo.dtos;

import lombok.Data;

/*
 * @author Yoner Silva
 */
@Data
public class EstructuraEmsaFileDTO {
    private String codigo_bio;
    private String codigo_emsa;
    private String nombre;
    private Long factura;
    private String periodo;
    private Integer valor;
    private String cod_baras;
}
