package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.dtos.DhvtcDetallehomvartarconceptosDTO;
import com.bioagricola.apirest.modelo.entidades.DhvtcDetallehomvartarconceptos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

@Service
public interface  ManejadorDhvtcDetallehomvartarconceptos extends ManejadorCrud<DhvtcDetallehomvartarconceptos, Long>, IManejadorCrud<DhvtcDetallehomvartarconceptos, Long> {


    @Query("SELECT d FROM DhvtcDetallehomvartarconceptos d WHERE d.dhvtcIderegistr = :dhvtcIderegistr")

    DhvtcDetallehomvartarconceptosDTO consultarPorId(Long    dhvtcIderegistr);

    //consultar(Long filterBy, String orderBy, Integer from, Integer to);


}
