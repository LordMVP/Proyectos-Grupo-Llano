package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.aprovechamiento.dto.ApprovalDto;

/**
 * @author dsolano
 * @project dev_back_aprovechamiento
 * @class IApproval
 */
public interface IApproval {
    ApprovalDto approve(Integer incentive);

    ApprovalDto discard(Integer incentive);
}
