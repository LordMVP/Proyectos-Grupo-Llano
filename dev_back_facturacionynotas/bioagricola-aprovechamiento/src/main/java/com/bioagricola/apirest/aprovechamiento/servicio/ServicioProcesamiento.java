package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.FacturacionServiceThread;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.RecaudoServiceThread;
import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoFacturacion;
import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodosFacturacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/webresources/servicios/procesamiento")
public class ServicioProcesamiento {

    private final FacturacionServiceThread facturacionServiceThread;

    @Autowired
    public ServicioProcesamiento(FacturacionServiceThread facturacionServiceThread) {
        this.facturacionServiceThread = facturacionServiceThread;
    }

    @GetMapping("/sinc/periodos/facturacion")
    public List<AprSincPeriodosFacturacion> getSincFacturacion() {
     return    facturacionServiceThread.findAllSincronizacion();
    }


    @GetMapping("/dist/periodos/facturacion")
    public List<AprDistPeriodoFacturacion> getDistFacturacion() {
        return    facturacionServiceThread.findAllDistribucion();
    }

    @PostMapping("/cron-actualizar")
    public String actualizarCron(@RequestParam String cron) {
        facturacionServiceThread.updateCronExpression(cron);
        return "Nueva expresión cron establecida: " + cron;
    }

    @GetMapping("/cron-obtener")
    public String getCurrentCron() {
        return facturacionServiceThread.getCronExpression();
    }

}

