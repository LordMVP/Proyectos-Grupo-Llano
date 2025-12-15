package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.aprovechamiento.dto.SupportThirdPartyPaidDto;
import com.bioagricola.apirest.aprovechamiento.dto.SupportThirdPartyPaymentDTO;
import com.bioagricola.apirest.aprovechamiento.payload.SupportThirdPartyPaymentForm;
import com.bioagricola.apirest.aprovechamiento.payload.SupportThirdPartyPaymentsForm;
import com.bioagricola.apirest.modelo.entidades.SoportePagos;

import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ISupportPaid
 */
public interface ISupportPaid {
    List<SupportThirdPartyPaidDto> supportThirdPartyPayments(Integer idConsolidacion);

    boolean updateSupport(SupportThirdPartyPaymentsForm supportThirdPartyPaymentsForm);

    Boolean updateObservations(SupportThirdPartyPaymentForm form);

    SupportThirdPartyPaymentDTO getSupportThirdPartyPayments(SupportThirdPartyPaymentForm form);

    Object getLastSupportThirdPartyPayments();

    List<SoportePagos> getAllSupportPayments(Integer maprcIderegistr, Integer perFacturacion);

    //Borrar soporte de pago
    boolean deleteSupportPayment(Integer sopIderegistro);

    //createSupportUpdateConciliation
    void createSupportUpdateConciliation(SupportThirdPartyPaymentForm form);
}

