package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.dto.SupportThirdPartyPaidDto;
import com.bioagricola.apirest.aprovechamiento.dto.SupportThirdPartyPaymentDTO;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.ISupportPaid;
import com.bioagricola.apirest.aprovechamiento.payload.SupportThirdPartyPaymentForm;
import com.bioagricola.apirest.aprovechamiento.payload.SupportThirdPartyPaymentsForm;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.entidades.*;
import com.bioagricola.apirest.modelo.manejadores.*;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class BusinessSupportPaid
 */
@Service
public class BusinessSupportPaid extends NegocioAbstracto<FacFactura, FacFacturaDTO> implements ISupportPaid {
    private final ManejadorSoportePagos supportPaidRepository;
    private final ManejadorRepctRepconsolidarecaudoaprov useConsolidateCollectionRepository;
    private final ManejadorConConsolidacionAprovechamiento useConsolidateRepository;
    private final ManejadorAprconcConciliacion useAprConcConciliationRepository;
    private final ManejadorTerTercero thirdPartyRepository;
    private final ManejadorTacbTerceroaprovctabancacria accountBankingRepository;

    public BusinessSupportPaid(ManejadorSoportePagos supportPaidRepository,
                               ManejadorRepctRepconsolidarecaudoaprov useConsolidateCollectionRepository,
                               ManejadorConConsolidacionAprovechamiento useConsolidateRepository,
                               ManejadorAprconcConciliacion useAprConcConciliationRepository,
                               ManejadorTerTercero thirdPartyRepository,
                               ManejadorTacbTerceroaprovctabancacria accountBankingRepository) {
        this.supportPaidRepository = supportPaidRepository;
        this.useConsolidateCollectionRepository = useConsolidateCollectionRepository;
        this.useConsolidateRepository = useConsolidateRepository;
        this.useAprConcConciliationRepository = useAprConcConciliationRepository;
        this.thirdPartyRepository = thirdPartyRepository;
        this.accountBankingRepository = accountBankingRepository;
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
    public List<SupportThirdPartyPaidDto> supportThirdPartyPayments(Integer id) {
        List<SupportThirdPartyPaidDto> dtoList = new ArrayList<>();
        List<SoportePagos> entityList = supportPaidRepository.getAllSoportePagos(id);
        List<RepctRepconsolidarecaudoaprov> detailsReport = new ArrayList<>();
        int userId = JwtUtil.auditoriaDTO.getIdUsuario();
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        AprconcConciliacion consolidateUse = useAprConcConciliationRepository.findById(1346L).orElse(null);

        for (SoportePagos row : entityList) {
            SupportThirdPartyPaidDto dto = new SupportThirdPartyPaidDto();

            dto.setSupportId(row.getSopIderegistro());
            dto.setLetterId(row.getSopIderegistro());
            dto.setSupportDate(row.getSopFechaComite());
            dto.setLetterPaid(row.getSopIderegistro().toString());
            //dto.setMinutes(row.getSopActa());
            dto.setTurnDate(row.getSopFechaGiro());
            dto.setPeriodId(row.getPerFacturacion());
            dto.setUserId(row.getUsuIderegistro());
            dto.setRegisterDate(row.getSopFechaRegistro());
            dto.setObservation(row.getSopObservacion());
            dtoList.add(dto);

            RepctRepconsolidarecaudoaprov detail = new RepctRepconsolidarecaudoaprov();

            detail.setConIdeconsolidacion(id);
            detail.setRepctFechaActa(row.getSopFechaGiro());
            detail.setUsuIderegistro(userId);
            detail.setEmpIderegistro(enterpriseId);
            detail.setRepctFechaRegistro(new Date());
            detail.setOficioPago(row.getSopIderegistro());
            detail.setRepctObservacion(row.getSopObservacion());
            detail.setRepctActa(row.getSopIdActa().toString());
            detail.setPerIderegistro(row.getPerFacturacion());
            detail.setRepctFechaGiro(row.getSopFechaGiro());
            detail.setRepctObservacion(row.getSopObservacion());

            if (consolidateUse != null) {
                this.thirdPartyRepository.findById(consolidateUse.getTerIderegistro())
                        .ifPresent(thirdParty -> {
                            detail.setTerIderegistro(thirdParty.getTerIderegistro());
                            detail.setAprovechador(thirdParty.getTerNomcompleto());
                            detail.setNit(thirdParty.getTerDocumento());

                            TacbTerceroaprovctabancacria bankingAccount = this.accountBankingRepository
                                    .findByTerIderegistro(BigInteger.valueOf(thirdParty.getTerIderegistro())).orElse(null);

                            if (bankingAccount != null)
                                detail.setCuentaBancaria(bankingAccount.getTacbNumerocuenta());
                        });
            }
            assert consolidateUse != null;
            int exportSeven = 1;
            detail.setExportarSeven(exportSeven);
            detail.setEstadoSeven(exportSeven == 0 ? "EXPORTADO" : "NO EXPORTADO");
            detailsReport.add(detail);
        }



//        this.useConsolidateCollectionRepository.saveAll(detailsReport);
        List<SoportePagos> entity = supportPaidRepository.getAllSoportePagos(1);

        //map entity to dto
        for (SoportePagos row : entity) {
            SupportThirdPartyPaidDto dto = new SupportThirdPartyPaidDto();

            dto.setSupportId(row.getSopIderegistro());
            dto.setLetterId(row.getSopIderegistro());
            dto.setSupportDate(row.getSopFechaComite());
            dto.setLetterPaid(row.getSopIderegistro().toString());
            //dto.setMinutes(row.getSopActa());
            dto.setTurnDate(row.getSopFechaGiro());
            dto.setPeriodId(row.getPerFacturacion());
            dto.setUserId(row.getUsuIderegistro());
            dto.setRegisterDate(row.getSopFechaRegistro());
            dto.setObservation(row.getSopObservacion());
            dtoList.add(dto);
        }



        return dtoList;
    }

    @Override
    public boolean updateSupport(SupportThirdPartyPaymentsForm form) {
        if (form != null) {
            SoportePagos entity = this.supportPaidRepository.getBySopIderegistro(form.getSupportId());
            entity.setSopFechaGiro(form.getTurnDate());
            entity.setSopObservacion(form.getObservations());
            entity.setSopIdActa(form.getActId());
            entity.setSopFechaComite(form.getDateCommittee());
            this.supportPaidRepository.save(entity);

            return true;
        }

        return false;
    }

    @Override
    public SupportThirdPartyPaymentDTO getSupportThirdPartyPayments(SupportThirdPartyPaymentForm form) {
        SupportThirdPartyPaymentDTO dto = new SupportThirdPartyPaymentDTO();
        Map<String, Object> entity = this.supportPaidRepository.getSupportThirdPartyPayments(form.getMaprcIderegistr(), Long.valueOf(form.getIdThirdParty()), form.getPerFacturacion());

        try {
            if (entity != null) {

                Timestamp sopFechaTimestamp = (Timestamp) entity.get("sop_fecharegistro");
                LocalDateTime sopFechaLocalDateTime = sopFechaTimestamp.toLocalDateTime();
                Timestamp sopFechaGiroTimestamp = (Timestamp) entity.get("sop_fecha_giro");
                LocalDateTime sopFechaGiroLocalDateTime = sopFechaGiroTimestamp.toLocalDateTime();
                Timestamp sopFechaComite= (Timestamp) entity.get("sop_fecha_comite");
                LocalDateTime sopFechaComiteLocalDateTime = sopFechaComite.toLocalDateTime();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                dto.setSupportDate(sopFechaLocalDateTime.format(formatter));
                dto.setSupportId((Integer)entity.get("sop_ideregistro"));
                dto.setLetterName(entity.get("sop_id_acta").toString());
                dto.setSupportPaid(sopFechaGiroLocalDateTime.format(formatter));
                dto.setObservation((String) entity.get("observaciones"));
                dto.setSupportDateCommittee(sopFechaComiteLocalDateTime.format(formatter));
            }
        }catch (Exception e){
            dto.setLetterName("");
            dto.setObservation("");
        }

        return dto;
    }

    @Override
    public Boolean updateObservations(SupportThirdPartyPaymentForm form) {
        this.supportPaidRepository.updateObservations(form.getObservations(), form.getMaprcIderegistr(), Long.valueOf(form.getIdThirdParty()), form.getPerFacturacion(), form.getSopFechaGiro());
        return true;
    }

    @Override
    public SoportePagos getLastSupportThirdPartyPayments() {
        return this.supportPaidRepository.getLastSupportThirdPartyPayments().orElse(null);
    }

    @Override
    public List<SoportePagos> getAllSupportPayments(Integer maprcIderegistr, Integer perFacturacion) {
        return supportPaidRepository.getAllSupportPayments(maprcIderegistr, perFacturacion);

    }

    @Override
    public boolean deleteSupportPayment(Integer sopIderegistro) {
        SoportePagos sop = supportPaidRepository.getBySopIderegistro(sopIderegistro);
        if (sop != null) {
            supportPaidRepository.updateSopIdActa(sop.getSopIderegistro());
            supportPaidRepository.delete(sop);
            return true;
        }
        return false;
    }
    @Override
    public void createSupportUpdateConciliation(SupportThirdPartyPaymentForm form) {
        this.supportPaidRepository.createSupportUpdateConciliation(form.getSopFechaGiro(), form.getPerFacturacion(), form.getIdThirdParty(), form.getMaprcIderegistr(), JwtUtil.auditoriaDTO.getIdUsuario(), form.getObservations(), Integer.valueOf(form.getSopIdActa()), form.getSopFechaComite());
    }

}
