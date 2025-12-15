package com.bioagricola.apirest.liquidacion.web.servicio;


import com.bioagricola.apirest.liquidacion.negocio.NegocioDhvtcDetallehomvartarconceptos;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IDhvtcDetallehomvartarconceptos;
import com.bioagricola.apirest.modelo.dtos.DhvtcDetallehomvartarconceptosDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDhvtcDetallehomvartarconceptos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/webresources/servicios/dhvtcDetallehomvartarconceptos")
//http://localhost:9090/asesoftware/webresources/servicios/dhvtcDetallehomvartarconceptos/crear
public class ServicioDhvtcDetallehomvartarconceptos implements IDhvtcDetallehomvartarconceptos {
    @Autowired
    private NegocioDhvtcDetallehomvartarconceptos negocioDhvtcDetallehomvartarconceptos;



    @PostMapping("/crear")
    @Override
    public DhvtcDetallehomvartarconceptosDTO crear(DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO) throws InvalidParameterException {

            return negocioDhvtcDetallehomvartarconceptos.crear(dhvtcDetallehomvartarconceptosDTO);

    }

    @PutMapping()
    @Override
    public DhvtcDetallehomvartarconceptosDTO actualizar(DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO) throws InvalidParameterException {
        return negocioDhvtcDetallehomvartarconceptos.actualizar(dhvtcDetallehomvartarconceptosDTO);
    }

    @DeleteMapping("/eliminar/{dhvtcIderegistr}")
    @Override
    public String eliminar(@PathVariable Long dhvtcIderegistr)  {
        negocioDhvtcDetallehomvartarconceptos.eliminar(dhvtcIderegistr);
        return "Se elimino el registro con id: " + dhvtcIderegistr;
    }

    @GetMapping("/listar")
    @Override
    public List<DhvtcDetallehomvartarconceptosDTO> listar() {
        return negocioDhvtcDetallehomvartarconceptos.listar();
    }
    // protected region Use esta region para su implementacion del servicio on begin
    // protected region Use esta region para su implementacion del servicio end
}
