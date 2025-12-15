package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.dto.SupportThirdPartyPaidDto;
import com.bioagricola.apirest.aprovechamiento.dto.SupportThirdPartyPaymentDTO;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.ISupportPaid;
import com.bioagricola.apirest.aprovechamiento.payload.SupportThirdPartyPaymentForm;
import com.bioagricola.apirest.aprovechamiento.payload.SupportThirdPartyPaymentsForm;
import com.bioagricola.apirest.modelo.entidades.SoportePagos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ServicioSoportePagos
 */
@RestController
@RequestMapping("/webresources/servicios/soportes")
public class SupportPaymentsService {
    private final ISupportPaid supportPaid;

    public SupportPaymentsService(ISupportPaid supportPaid) {
        this.supportPaid = supportPaid;
    }

    @PostMapping("/pago-terceros") // HU-131
    public ResponseEntity<List<SupportThirdPartyPaidDto>> supportThirdPartyPayments(@Valid @RequestParam("ideconsolidacion") Integer id) {
        try {
            return ResponseEntity.ok().body(supportPaid.supportThirdPartyPayments(id));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<SoportePagos>> getAllSupportPayments(@RequestParam("maprcIderegistr") Integer maprcIderegistr, @RequestParam("perFacturacion") Integer perFacturacion) {
        try {
            return ResponseEntity.ok().body(supportPaid.getAllSupportPayments(maprcIderegistr, perFacturacion));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    @GetMapping("/ultimo-soporte") // HU-131
    public ResponseEntity<Object> getLastSupportThirdPartyPayments() {
        try {
            return ResponseEntity.ok().body(supportPaid.getLastSupportThirdPartyPayments());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/tercero")
    public ResponseEntity<SupportThirdPartyPaymentDTO> getSupportThirdPartyPayments(@RequestParam("maprcIderegistr") Integer maprcIderegistr, @RequestParam("terIderegistro") String terIderegistro, @RequestParam("perFacturacion") Integer perFacturacion) {
        try {
            return ResponseEntity.ok().body(supportPaid.getSupportThirdPartyPayments(new SupportThirdPartyPaymentForm(maprcIderegistr, terIderegistro, perFacturacion, null, null, null,null)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping("/pago-terceros-observaciones")
    public ResponseEntity<Boolean> updateObservations(@RequestBody SupportThirdPartyPaymentForm form) {
        try {
            return ResponseEntity.ok().body(supportPaid.updateObservations(form));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Boolean.valueOf(ex.getMessage()));
        }
    }
    @PostMapping("/actualizar-soporte")
    public ResponseEntity<Boolean> updateSupport(@RequestBody SupportThirdPartyPaymentsForm form) {
        try {
            return ResponseEntity.ok().body(supportPaid.updateSupport(form));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Boolean.valueOf(ex.getMessage()));
        }
    }
    @DeleteMapping("/eliminar-soporte")
    public ResponseEntity<Boolean> deleteSupportPayment(@RequestParam("sopIderegistro") Integer sopIderegistro) {
        try {
            return ResponseEntity.ok().body(supportPaid.deleteSupportPayment(sopIderegistro));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Boolean.valueOf(ex.getMessage()));
        }
    }

    @PostMapping("/crear-soporte")
    public void createSupportUpdateConciliation(@RequestBody SupportThirdPartyPaymentForm form) {
        supportPaid.createSupportUpdateConciliation(form);
    }
}
