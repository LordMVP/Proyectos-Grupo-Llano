package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioHvtconHomvartarconceptos;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IHvtconHomvartarconceptos;
import com.bioagricola.apirest.modelo.dtos.HvtconHomvartarconceptosDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/webresources/servicios/hvtconhomvartarconceptos")
public class ServicioHvtconHomvartarconceptos implements IHvtconHomvartarconceptos {

    @Autowired
    private NegocioHvtconHomvartarconceptos negocioHvtconHomvartarconceptos;

    @PostMapping("/crear")
    public HvtconHomvartarconceptosDTO crear(HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO) {
        return negocioHvtconHomvartarconceptos.crear(hvtconHomvartarconceptosDTO);
    }

    @PutMapping("/actualizar")
    public HvtconHomvartarconceptosDTO actualizar(HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO) {
        return negocioHvtconHomvartarconceptos.actualizar(hvtconHomvartarconceptosDTO);
    }

    @DeleteMapping("/eliminar/{hvtconIderegistr}")
    public String eliminar(@PathVariable Integer hvtconIderegistr) {
        negocioHvtconHomvartarconceptos.eliminar(hvtconIderegistr);
        return "Registro eliminado";
    }

    @GetMapping("/listar")
    @Override
    public List<HvtconHomvartarconceptosDTO> listar() {
        return negocioHvtconHomvartarconceptos.listar();
    }

    @GetMapping("/{hvtconIderegistr}")
    public HvtconHomvartarconceptosDTO consultarPorId(@PathVariable Integer hvtconIderegistr) {
        return negocioHvtconHomvartarconceptos.consultar(hvtconIderegistr);
    }
    //consultarEncabezadoPorTipo
    @GetMapping("/consultarEncabezadoPorTipo/{hvtcon_tipoactualizacion}")
    public List<Integer> consultarEncabezadoPorTipo(@PathVariable String hvtcon_tipoactualizacion) {
        return negocioHvtconHomvartarconceptos.consultarEncabezadoPorTipo(hvtcon_tipoactualizacion);
    }

    @GetMapping("/consultarAñoMesActualizar")
    public List<Object[]> consultarAñoMesActualizar() {
        List<Object[]> lista =  negocioHvtconHomvartarconceptos.consultarAñoMesActualizar();
        return lista;
    }

}
