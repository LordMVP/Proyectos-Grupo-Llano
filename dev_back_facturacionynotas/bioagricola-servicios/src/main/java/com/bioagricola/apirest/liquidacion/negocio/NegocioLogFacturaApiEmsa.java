package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.negocio.interfaces.ILogFacturaApiEmsa;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.aseo.LogFacturaApiEmsa;
import com.bioagricola.apirest.modelo.manejadores.ManejadorLogFacturaApiEmsa;
import com.bioagricola.apirest.modelo.projections.LogFacturaApiEmsaProjection;
import java.time.LocalDate;
import java.util.List;

/**
 * Servicios para operaciones CRUD y de negocio sobre la entidad LogFacturaApiEmsa
 * @author Yoner Silva
 */
@Service
public class NegocioLogFacturaApiEmsa implements ILogFacturaApiEmsa {

    @Autowired
    private ManejadorLogFacturaApiEmsa manejadorLog;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(NegocioLogFacturaApiEmsa.class.getName());

    @Override
    public List<LogFacturaApiEmsaProjection> findAllByRangeDate(LocalDate desde, LocalDate hasta) {
        return this.manejadorLog.findAllByRangeDate(desde, hasta);
    }

    @Override
    public LogFacturaApiEmsa save(LogFacturaApiEmsa item) {
        return this.manejadorLog.save(item);
    }

}
