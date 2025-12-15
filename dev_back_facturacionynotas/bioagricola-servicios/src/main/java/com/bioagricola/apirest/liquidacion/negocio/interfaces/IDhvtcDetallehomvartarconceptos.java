package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.DhvtcDetallehomvartarconceptosDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IDhvtcDetallehomvartarconceptos  {

    public DhvtcDetallehomvartarconceptosDTO crear(DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO) throws InvalidParameterException;

    public DhvtcDetallehomvartarconceptosDTO actualizar(DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO) throws InvalidParameterException;

    public String eliminar(Long dhvtcIderegistr);

    public List<DhvtcDetallehomvartarconceptosDTO> listar();


}
