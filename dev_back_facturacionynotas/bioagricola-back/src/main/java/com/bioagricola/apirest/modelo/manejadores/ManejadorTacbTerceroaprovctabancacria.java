package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.TacbTerceroaprovctabancacria;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.Optional;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ManejadorTacbTerceroaprovctabancacria
 */
@Service
public interface ManejadorTacbTerceroaprovctabancacria extends ManejadorCrud<TacbTerceroaprovctabancacria, Integer>,
        IManejadorCrud<TacbTerceroaprovctabancacria, Integer> {

    Optional<TacbTerceroaprovctabancacria> findByTerIderegistro(BigInteger terIderegistro);
}
