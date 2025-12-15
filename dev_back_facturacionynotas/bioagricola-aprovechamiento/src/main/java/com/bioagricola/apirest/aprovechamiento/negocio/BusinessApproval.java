package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.dto.ApprovalDto;
import com.bioagricola.apirest.aprovechamiento.enums.ConsolidationState;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IApproval;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.entidades.ConConsolidacionAprovechamiento;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConsolidacionAprovechamiento;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class BusinessApproval
 */
@Service
public class BusinessApproval extends NegocioAbstracto<FacFactura, FacFacturaDTO> implements IApproval {
    public static final String DISCARD_STRING = "Proceso de Descarte Completado con Exito";
    public static final String APPROVAL = "Proceso de Aprobación Completado con Exito";
    public static final String DISCARD_FAIL = "No se realizo el proceso de Descarte";
    public static final String APPROVAL_FAIL = "No se realizo el proceso de Aprobación";
    private final ManejadorConConsolidacionAprovechamiento manejadorConConsolidacionAprovechamiento;

    public BusinessApproval(ManejadorConConsolidacionAprovechamiento manejadorConConsolidacionAprovechamiento) {
        this.manejadorConConsolidacionAprovechamiento = manejadorConConsolidacionAprovechamiento;
    }

    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return false;
    }

    @Override
    protected Logger getLogger() {
        return null;
    }

    @Override
    protected FacFacturaDTO instanciarDAO() {
        return null;
    }

    @Override
    public ApprovalDto approve(Integer incentive) {
        return getApprovalDto(incentive, ConsolidationState.CERRADO, APPROVAL, APPROVAL_FAIL);
    }

    @Override
    public ApprovalDto discard(Integer incentive) {
        return getApprovalDto(incentive, ConsolidationState.ELIMINADO, DISCARD_STRING, DISCARD_FAIL);
    }

    private ApprovalDto getApprovalDto(Integer incentive, ConsolidationState consolidationState, String msgOk, String msgFail) {
        ApprovalDto approvalDto = new ApprovalDto();
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        int userId = JwtUtil.auditoriaDTO.getIdUsuario();
        List<ConConsolidacionAprovechamiento> entities = this.manejadorConConsolidacionAprovechamiento
                .getByIdeEmpresa(enterpriseId, incentive, ConsolidationState.ACTIVO.name())
                .stream().peek(row -> {
                    row.setFechaActualizacion(new Date());
                    row.setUsuIdregistroAct(userId);
                    row.setEstado(String.valueOf(consolidationState));
                }).collect(Collectors.toList());

        if (!this.manejadorConConsolidacionAprovechamiento.saveAll(entities).isEmpty()) {
            approvalDto.setMessage(msgOk);
            approvalDto.setState(true);
        } else {
            approvalDto.setMessage(msgFail);
            approvalDto.setState(false);
        }
        return approvalDto;
    }

}
