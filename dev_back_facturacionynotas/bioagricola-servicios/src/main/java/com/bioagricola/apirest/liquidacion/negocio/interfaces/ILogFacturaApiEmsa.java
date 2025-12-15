package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.entidades.aseo.LogFacturaApiEmsa;
import com.bioagricola.apirest.modelo.projections.LogFacturaApiEmsaProjection;
import java.time.LocalDate;
import java.util.List;

/*
 * @author Yoner Silva
 */
public interface ILogFacturaApiEmsa {
    public List<LogFacturaApiEmsaProjection> findAllByRangeDate(LocalDate desde, LocalDate hasta);
    
    public LogFacturaApiEmsa save(LogFacturaApiEmsa item);
}