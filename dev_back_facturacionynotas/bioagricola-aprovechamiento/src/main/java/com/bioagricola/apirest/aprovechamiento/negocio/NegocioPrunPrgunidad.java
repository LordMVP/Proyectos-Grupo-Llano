package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.RequestPermisosDTO;
import com.bioagricola.apirest.modelo.entidades.PrunPrgunidad;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPrunPrgunidad;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;


@Service
public class NegocioPrunPrgunidad extends NegocioAbstracto<PrunPrgunidad, Long>{

    @Autowired
    ManejadorPrunPrgunidad manejadorPrunPrgunidad;

    @Autowired
    NegocioParParametro negocioParParametro;

    public boolean hasPermission(Integer idPrograma) throws Exception{
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        Map<String, Object> consultaParametro = null;

        consultaParametro = this.negocioParParametro.consultaParametrosAprovechamiento();
        Integer idUnidad = (Integer)(consultaParametro.get(ConstantesServicios.PARAM_PERMISOS));

        Integer respuesta = this.manejadorPrunPrgunidad.hasPermissions(idEmpresa, idPrograma, idUsuario, idUnidad);
        if(respuesta!= null && respuesta >0 ){
            return true;
        }else{
            return false;
        }
    }

    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return false;
    }

    @Override
    protected Logger getLogger() {
        return null;
    }

    @Override
    protected Long instanciarDAO() {
        return null;
    }
}
