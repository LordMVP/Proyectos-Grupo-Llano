package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.liquidacion.web.servicio.Payload.PayloadApi_EmsaDTO;
import com.bioagricola.apirest.liquidacion.web.servicio.Response.ResponseApi_EmsaDTO;
import org.springframework.web.multipart.MultipartFile;

/*
 * @author Yoner Silva
 */
public interface IAPI_EMSA {

    public ResponseApi_EmsaDTO loguearse(PayloadApi_EmsaDTO item); 
    
    public ResponseApi_EmsaDTO consultar_permisos_usuario();
    
    public ResponseApi_EmsaDTO consulta_cliente(PayloadApi_EmsaDTO item);
    
    public ResponseApi_EmsaDTO actualiza_cliente(PayloadApi_EmsaDTO item);
    
    public ResponseApi_EmsaDTO cargar_archivo_reliquidacion(PayloadApi_EmsaDTO item, MultipartFile file);
    
    public ResponseApi_EmsaDTO obtener_log_facturas(PayloadApi_EmsaDTO item);
    
    public ResponseApi_EmsaDTO generar_reporte_recaudo_pse(PayloadApi_EmsaDTO item);
}
