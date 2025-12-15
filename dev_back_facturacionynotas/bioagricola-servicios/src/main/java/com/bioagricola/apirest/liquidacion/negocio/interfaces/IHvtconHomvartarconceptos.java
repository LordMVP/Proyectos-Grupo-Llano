package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.HmafHistormaestroaforoDTO;
import com.bioagricola.apirest.modelo.dtos.HvtconHomvartarconceptosDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IHvtconHomvartarconceptos {
    public HvtconHomvartarconceptosDTO crear(HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO);

    public HvtconHomvartarconceptosDTO actualizar(HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO);

    public String eliminar(Integer hvtconIderegistr);

    public List<HvtconHomvartarconceptosDTO> listar();


}
