package com.bioagricola.apirest.liquidacion.web.servicio.Response;

import java.io.Serializable;
import lombok.Data;

/*
 * @author Yoner Silva
 */
@Data
public class ResponseApi_EmsaDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private Integer codigoRespuesta;
    private Object data;
    private String mensaje;
}
