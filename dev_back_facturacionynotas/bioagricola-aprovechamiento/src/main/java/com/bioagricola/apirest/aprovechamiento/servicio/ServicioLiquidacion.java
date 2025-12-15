package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.ILiquidacion;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IPeriodo;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.dtos.PerPeriodoDTO;
import com.bioagricola.apirest.aprovechamiento.payload.PeriodoFacturacionPrestacionForm;
import com.bioagricola.apirest.modelo.dtos.ProgresoLiqAprovDTO;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Servicios para la pantalla de liquidacion
 *
 * @author svillanueva
 */

@RestController
@RequestMapping("/webresources/servicios/liquidacion")
public class ServicioLiquidacion {

    @Autowired
    private IPeriodo periodoService;

    @Autowired
    private ILiquidacion liquidacionService;

    @GetMapping("terceros")
    public List<Object> getTerceros() {
        return null;
    }

    @GetMapping("periodo")
    public ResponseEntity<?> getPeriodo() {
        Map<String, Object> mensajes = new HashMap<>();
        try {
            mensajes.put("periodo", this.periodoService.getPeriodo());
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (Exception ex) {
            mensajes.put("mensaje", ex.getMessage());
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        }
    }

    @PostMapping("iniciarproceso")
    public ResponseEntity<?> iniciarProceso(@RequestBody IniciarProcesoDTO iniciarProcesoDTO) throws Exception {
        Map<String, Object> mensajes = new HashMap<>();
        try {
            CompletableFuture<Long> proceso_aprov = this.liquidacionService.iniciarLiquidacion(iniciarProcesoDTO);
            mensajes.put("estadoProceso", "OK");
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (NegocioException ex) {
            mensajes.put("mensaje", ex.getMessage());
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        }
    }

    @GetMapping("progreso")
    public ResponseEntity<?> validarProcesoEjecucion(@RequestParam Integer programa) {
        Map<String, Object> mensajes = new HashMap<>();
        ProgresoLiqAprovDTO progresoLiqAprovDTO = this.liquidacionService.progresoLiquidacion(programa);
        mensajes.put("estadoProceso", progresoLiqAprovDTO.getEstadoProceso());
        if (progresoLiqAprovDTO.getCantidadRegistros() != null) {
            mensajes.put("cantidadRegistros", progresoLiqAprovDTO.getCantidadRegistros());
        }
        return new ResponseEntity<>(mensajes, HttpStatus.OK);
    }

    @GetMapping("/lista-periodos")
    public List<PerPeriodoDTO> consultarPeriodos() {
        return periodoService.getPeriodos();
    }
    @GetMapping("/listar-periodos")
    public List<PerPeriodoDTO> listarPeriodos() {
        return periodoService.getPeriodosCon();
    }    
    @GetMapping("aprobar-proceso")
    public ResponseEntity<?> aprobarProceso(){
        Map<String, Object> mensajes = new HashMap<>();
        try {
            this.liquidacionService.aprobarProceso();
            mensajes.put("estadoProceso", "OK");
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (Exception ex) {
            mensajes.put("mensaje", ex.getMessage());
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        }
    }
    
    @GetMapping("descartar-proceso")
    public ResponseEntity<?> descartarProceso(){
        Map<String, Object> mensajes = new HashMap<>();
        try {
            this.liquidacionService.descartarProceso();
            mensajes.put("estadoProceso", "OK");
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (Exception ex) {
            mensajes.put("mensaje", ex.getMessage());
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        }
    }
    @GetMapping("/listar-periodos-facturacion-prestacion-apro/{id}")
    public List<PeriodoFacturacionPrestacionForm> getPeriodosApro(@PathVariable String id) {
        Integer maprcIderegistro = Integer.parseInt(id);
        return periodoService.getPeriodosApro(maprcIderegistro);
    }
}
