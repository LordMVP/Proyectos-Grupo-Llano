package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.FacturacionServiceThread;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.SubsidioContribucion;
import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoFacturacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/webresources/servicios/procesamientoSubsidioContribucion")
public class ServicioProcesamientoSubsidioContribucion {

    private final SubsidioContribucion subsidioContribucion;

    @Autowired
    public ServicioProcesamientoSubsidioContribucion(SubsidioContribucion subsidioContribucion) {
        this.subsidioContribucion = subsidioContribucion;
    }

    @PostMapping("/procesarSubsidiosRangoPeriodos")
    public ResponseEntity<String> procesarSubsidiosRangoPeriodos(@RequestParam Integer fechaInicio, @RequestParam Integer fechaFin) {
        // Start processing in a separate thread that won't be affected by client disconnection
        CompletableFuture.runAsync(() -> {
            try {
                subsidioContribucion.procesarSubsidiosRangoPeriodos(fechaInicio, fechaFin);
            } catch (Exception e) {
                // Log any errors that occur during background processing
                e.printStackTrace();
            }
        });

        // Return immediately to the client
        return ResponseEntity.ok("Procesamiento iniciado en segundo plano");
    }


}

