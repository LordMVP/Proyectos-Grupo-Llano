package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.UspuUsuprgunidDTO;
import com.bioagricola.apirest.modelo.entidades.PrunPrgunidad;
import com.bioagricola.apirest.modelo.entidades.UspuUsuprgunid;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPrunPrgunidad;
import com.bioagricola.apirest.modelo.manejadores.ManejadorUspuUsuprgunid;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class NegocioUspuUsuprgunid extends NegocioAbstracto<UspuUsuprgunid, UspuUsuprgunidDTO> {

    @Autowired
    private ManejadorUspuUsuprgunid manejadorUspuUsuprgunid;

    @Autowired
    private ManejadorPrunPrgunidad manejadroPrunPrgunidad;

    @Autowired
    private NegocioParParametro negocioParParametro;


    /**
     * Método de manejo de la lógica para la consulta de privilegios de un usuario
     *
     * @param idPrograma
     * @return
     * @throws IOException
     */
    public boolean consultaPrivilegios(Integer idPrograma) throws IOException {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        PrunPrgunidad responseRelacion = getPrunPrgunidad(idPrograma, ConstantesServicios.PRIVILEGIO_RETROACTIVO, idEmpresa, idUsuario);
        if (responseRelacion != null) {
            UspuUsuprgunid responsePrivilegio = getResponsePrivilegio(idUsuario, responseRelacion);
            return (responsePrivilegio != null);
        } else
            return false;
    }

    /**
     * Método de manejo de la lógica para la consulta de privilegios de un usuario por programa y tipo, retorna el periodo
     * de búsqueda para un usuario
     *
     * @param idPrograma
     * @return
     * @throws IOException
     */
    public int consultaPrivilegiosIlimitadoReporte(Integer idPrograma) throws IOException {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        Map<String, Object> consultaParametro = negocioParParametro.consultaParametros(idEmpresa,
                ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
        PrunPrgunidad responseRelacion = getPrunPrgunidad(idPrograma, ConstantesServicios.PRIVILEGIO_ILIMITADO_REPORTE, idEmpresa, idUsuario);
        Integer defaultLimit = (Integer) consultaParametro.get(ConstantesServicios.PERIODO_LIMITADO_REPORTE);

        if (responseRelacion != null) {
            UspuUsuprgunid responsePrivilegio = getResponsePrivilegio(idUsuario, responseRelacion);

            return (responsePrivilegio != null)
                    ? (Integer) consultaParametro.get(ConstantesServicios.PERIODO_ILIMITADO_REPORTE) :
                    defaultLimit;
        } else
            return defaultLimit;
    }

    private UspuUsuprgunid getResponsePrivilegio(int idUsuario, PrunPrgunidad responseRelacion) {
        Integer prunIderegistr = responseRelacion.getPrgIderegistro();
        return manejadorUspuUsuprgunid.consultaPrivilegioDeshabitado(idUsuario,
                prunIderegistr);
    }

    private PrunPrgunidad getPrunPrgunidad(Integer idPrograma, String tipo, int idEmpresa, int idUsuario) throws IOException {
        Map<String, Object> consultaParametro = negocioParParametro.consultaParametros(idEmpresa,
                ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);

        Integer idUnidadDxD = (Integer) (consultaParametro.get(tipo));

        // Luego se consulta si existe relación del programa con la unidad
        return manejadroPrunPrgunidad.consultaRelacion(idUsuario, idUnidadDxD, idPrograma);
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
    protected UspuUsuprgunidDTO instanciarDAO() {
        return new UspuUsuprgunidDTO();
    }

}
