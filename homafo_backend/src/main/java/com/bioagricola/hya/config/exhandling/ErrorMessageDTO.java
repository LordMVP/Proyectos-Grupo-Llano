package com.bioagricola.hya.config.exhandling;

import lombok.Data;

/**
 * POJO {@link ErrorMessageDTO} como respuesta a los errores.
 *
 * @author dsolano
 */
@Data
public class ErrorMessageDTO {
    /**
     * codigo del Error POJO {@link ErrorMessageDTO}.
     */
    private int statusCode;
    /**
     * mensaje del POJO {@link ErrorMessageDTO}.
     */
    private String message;
    /**
     * descripcion del {@link ErrorMessageDTO}.
     */
    private String description;

    /**
     * Constructor del Servicio {@link ErrorMessageDTO}
     *
     * @param statusCode  codigo del Error
     * @param message     mensaje del Error
     * @param description descripcion del Error
     */
    public ErrorMessageDTO(int statusCode, String message, String description) {
        this.statusCode = statusCode;
        this.message = message;
        this.description = description;
    }
}
