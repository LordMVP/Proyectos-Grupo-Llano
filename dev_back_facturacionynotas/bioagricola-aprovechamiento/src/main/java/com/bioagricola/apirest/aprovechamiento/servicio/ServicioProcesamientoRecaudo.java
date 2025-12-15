package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.RecaudoServiceThread;
import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoRecaudo;
import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodoRecaudo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/webresources/servicios/procesamientoRecaudo")
public class ServicioProcesamientoRecaudo {

    private final RecaudoServiceThread recaudoServiceThread;

    @Autowired
    public ServicioProcesamientoRecaudo(RecaudoServiceThread recaudoServiceThread) {
        this.recaudoServiceThread = recaudoServiceThread;
    }


    @GetMapping("/sinc/periodos/recaudo")
    public List<AprSincPeriodoRecaudo> getSincFacturacion() {
        return    recaudoServiceThread.findAllOrderByRecFecpagoDesc();
    }

    @GetMapping("/dist/periodos/recaudo")
    public List<AprDistPeriodoRecaudo> getDistFacturacion() {
        return    recaudoServiceThread.findAllDistribucion();
    }

    @PostMapping("/procesar-recaudo-mensual")
    public String procesarRecaudoMensual() {
        recaudoServiceThread.procesarRecaudoMensualAsync();
        return "Ok";
    }

    @PostMapping("/cron-actualizar")
    public String actualizarCron(@RequestParam String cron) {
        recaudoServiceThread.updateCronExpression(cron);
        return "Nueva expresión cron establecida: " + cron;
    }

    @GetMapping("/cron-obtener")
    public String getCurrentCron() {
        return recaudoServiceThread.getCronExpression();
    }

}
