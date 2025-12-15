package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.dto.ApprovalDto;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IApproval;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author dsolano
 * @project dev_back_aprovechamiento
 * @class ApprovalService
 */
@RestController
@RequestMapping("/webresources/servicios/aprovechamiento")
public class ApprovalService {

    private final IApproval approval;

    public ApprovalService(IApproval approval) {
        this.approval = approval;
    }

    @PostMapping("/aprobar") // HU-119 120
    public ResponseEntity<ApprovalDto> processApproval(@RequestParam("incentivo") Integer incentive) {
        try {
            return ResponseEntity.ok().body(this.approval.approve(incentive));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new ApprovalDto(false, ex.getMessage()));
        }
    }

    @PostMapping("/descartar")
    public ResponseEntity<ApprovalDto> discardApproval(@RequestParam("incentivo") Integer incentive) {
        try {
            return ResponseEntity.ok().body(this.approval.discard(incentive));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new ApprovalDto(false, ex.getMessage()));
        }
    }

}
