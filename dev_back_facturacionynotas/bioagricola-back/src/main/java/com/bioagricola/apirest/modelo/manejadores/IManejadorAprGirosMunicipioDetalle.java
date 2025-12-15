package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprGirosMunicipioDetalle;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IManejadorAprGirosMunicipioDetalle extends ManejadorCrud<AprGirosMunicipioDetalle, Integer> {
    List<AprGirosMunicipioDetalle> findByGirosMunicipioIdGiro(Integer idGiro);
    List<AprGirosMunicipioDetalle> findByMesAnioPago(Integer mesAnioPago);
    void deleteByGirosMunicipioIdGiro(Integer idGiro);
    void deleteAllByIdDetalleIn(List<Integer> ids);
}
