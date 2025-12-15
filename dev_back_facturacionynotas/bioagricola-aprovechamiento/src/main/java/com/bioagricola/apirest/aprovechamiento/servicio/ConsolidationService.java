package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.dto.*;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IConsolidate;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.FacturacionServiceThread;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.RecaudoServiceThread;
import com.bioagricola.apirest.aprovechamiento.payload.*;
import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodoRecaudo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ServicioConsolidacion
 */
@RestController
@RequestMapping("/webresources/servicios/consolidacion")
public class ConsolidationService {
    private final IConsolidate consolidate;
    private final FacturacionServiceThread facturacionServiceThread;
    private final RecaudoServiceThread recaudoServiceThread;
    @Autowired
    public ConsolidationService(IConsolidate consolidate, FacturacionServiceThread facturacionServiceThread, RecaudoServiceThread recaudoServiceThread) {
        this.consolidate = consolidate;
        this.recaudoServiceThread = recaudoServiceThread;
        this.facturacionServiceThread = facturacionServiceThread;
    }

    @PostMapping("aprovechamiento") // HU-116 118
    public ResponseEntity<ConsolidationDto> consolidateUse(@Valid @RequestBody ConsolidationForm form) {
        ConsolidationDto dto = this.consolidate.consolidateUse(form);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping("incentivo-aprovechamiento")// HU-124
    public ResponseEntity<ConsolidationDto> consolidateUseIncentive(@Valid @RequestBody ConsolidationForm form) {
        ConsolidationDto consolidationDto = this.consolidate.consolidateUseIncentive(form);
        return new ResponseEntity<>(consolidationDto, HttpStatus.OK);
    }

    @PostMapping("novedades-conciliadas") // HU-125
    public ResponseEntity<ConsolidationDto> consolidateNewReconciledInvoices(@Valid @RequestBody ConsolidationForm form) {
        ConsolidationDto dto = this.consolidate.consolidateNewReconciledInvoices(form);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
/*
    @PostMapping("distribuir") // HU-125
    public ResponseEntity<String> distribuir(@RequestBody List<Long> ids) {
        this.facturacionServiceThread.executeDistribution(ids);
        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }

    @PostMapping("sincronizar") // HU-125
    public ResponseEntity<String> sincronizar(@RequestBody List<AprSincCicloPeriodoFacturacion> ids) {
        this.facturacionServiceThread.executeSincronization(ids);
        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }*/
        @PostMapping("sincronizar") // HU-125
        public ResponseEntity<String> sincronizar() {
            this.recaudoServiceThread.executeSincronization(new ArrayList<AprSincPeriodoRecaudo>());
            return new ResponseEntity<>("Ok", HttpStatus.OK);
        }

    @PostMapping("reporte-consolidado-facturacion") // HU-161
    public ResponseEntity<Page<List<ValueChangeDto<ConsolidationReportDto>>>> generateConsolidateBilling(@Valid @RequestBody ConsolidationReportForm form, Pageable pageable) {
        return new ResponseEntity<>(this.consolidate.generateConsolidateBilling(form, pageable), HttpStatus.OK);
    }
    @PostMapping("reporte-consolidado-aprovechamientoIAT") // HU-161 ?
    public ResponseEntity<Page<List<ValueChangeDto<ConsolidationReportIatDto>>>> generateConsolidatedUseReportIAT(@Valid @RequestBody ConsolidationReportForm form, Pageable pageable) {
        return new ResponseEntity<>(this.consolidate.generateConsolidateUseReportIAT(form, pageable), HttpStatus.OK);
    }
    @PostMapping("reporte-detalle-IAT") // HU-161 ?
    public ResponseEntity<Page<List<ValueChangeDto<ConsolidationDetailReportIatDto>>>> generateDetailReportIAT(@Valid @RequestBody ConsolidationReportForm form, Pageable pageable) {
        return new ResponseEntity<>(this.consolidate.generateDetailReportIAT(form, pageable), HttpStatus.OK);
    }
    @PostMapping("reporte-detalle-cambio-valor")
    public ResponseEntity<Page<List<ValueChangeDto<DetailValueChangeDto>>>> generateDetailConsolidatedUseReport(
            @Valid @RequestBody ConsolidationReportForm form,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3000") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return new ResponseEntity<>(this.consolidate.generateConsolidateDetailUseReport(form, pageable), HttpStatus.OK);
    }

    @PostMapping("reporte-recaudo-aprovechador") // HU-130/129/138 // TODO mirar si se esta filtrando por incentivo
    public ResponseEntity<Page<ThirdPartyCollectionDto>> generateCollectionUseAndIncentiveReport(@Valid @RequestBody CollectionReportForm form, Pageable pageable) {
        return new ResponseEntity<>(this.consolidate.generateCollectionUseAndIncentiveReport(form, pageable), HttpStatus.OK);
    }

    // TERCERO APROVECHADOR -NO INCENTIVO
    @PostMapping("detalle-recaudo-aprovechador") // HU-134
    public ResponseEntity<List<DetailCollectionUserThirdPartyDto>> generateCollectionDetailUseReport(@Valid @RequestBody CollectionReportDetailForm detail) {
        return new ResponseEntity<>(this.consolidate.generateCollectionDetailUseReport(detail), HttpStatus.OK);
    }

    @PostMapping("detalle-recaudo-aprovechador-periodos") // HU-135
    public ResponseEntity<List<DetailCollectionUserThirdPartyDto>> generateCollectionDetailUseReportByPeriods(@Valid @RequestBody CollectionReportDetailForm detail) {
        return new ResponseEntity<>(this.consolidate.generateCollectionDetailUseReportByPeriods(detail), HttpStatus.OK);
    }

    @PostMapping("reporte-cruce-recaudo") // HU-144 145
    public ResponseEntity<Page<ThirdCollectionCrossingDto>> generateCrossCollectionMeasured(@RequestParam("aforado") Integer measured,
                                                                                            @Valid @RequestBody CollectionReportDetailForm detail, Pageable pageable) {
        return new ResponseEntity<>(this.consolidate.generateCrossCollectionMeasured(measured, detail, 0, pageable), HttpStatus.OK);
    }

    @PostMapping("notas-recaudo-terceros") // HU-147/148 (0 -> no alcaldia /  1 -> alcaldia)
    public ResponseEntity<?> generateNotesByIdTerceroAndMonthReport(@Valid @RequestBody CollectionReportDetailForm detail) {
        return new ResponseEntity<>(this.consolidate.generateNotesByIdTerceroAndMonthReport(detail), HttpStatus.OK);
    }

    // TERCERO APROVECHADOR ALCALDIA - INCENTIVO
    @PostMapping("detalle-recaudo-alcaldia") // HU-139
    public ResponseEntity<?> generateCollectionDetailTownHallReport(@RequestBody CollectionDetailUse detail, Pageable pageable) {
        try {
            return new ResponseEntity<>(this.consolidate.generateCollectionDetailTownHallReport(detail, pageable), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("detalle-mes-recaudo-alcaldia") // HU-140
    public ResponseEntity<?> generateCollectionDetailTownHallReportByMonth(@RequestBody CollectionDetailTownHall detail, Pageable pageable) {
        try {
            return new ResponseEntity<>(this.consolidate.generateCollectionDetailTownHallReportByMonth(detail, pageable), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(value = "generar-oficio-tercero-aprovechador") // HU-154
    public ResponseEntity<?> generateLetterUseByIdTercero(@RequestBody Map<String,Object> parameters) {
        LetterDto letterDto = this.consolidate.generateLetterUseByIdTercero(parameters);

        if (letterDto.getBase64() != null && letterDto.getBase64().isEmpty())
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        else
            return new ResponseEntity<>(letterDto, HttpStatus.OK);
    }

    @PostMapping("reporte-facturas-castigadas") // HU- 150/151
    public ResponseEntity<?> generatePunishedInvoicesByMonthReport(@Valid @RequestBody CollectionDetailUse detail, Pageable pageable) {
        return new ResponseEntity<>(this.consolidate.generatePunishedInvoicesByMonthReport(detail, pageable), HttpStatus.OK);
    }

    @PostMapping("reporte-consolidado-aprovechador-facturas-castigadas")
    // HU-101  102/103 (incentivo = 0)  105/106 (incentivo = 1)
    public ResponseEntity<?> generateSearchCriteriaReport(@Valid @RequestBody SearchCriteriaReportForm form,
                                                          @RequestParam("incentivo") Long incentive,
                                                          Pageable pageable) {
        try {
            return new ResponseEntity<>(this.consolidate.generateSearchCriteriaReport(form, incentive, pageable), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("criterios-busqueda-reporte-facturacion") // HU- 180 181 182
    public ResponseEntity<?> generateSearchReportInvoicing(@Valid @RequestBody CriteriaSearchInvoicingReportForm form) {
        try {
            return new ResponseEntity<>(this.consolidate.criteriaSearchReportInvoicing(form), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("reporte-detalle-giros-tercero-aprovechador") // HU - 183 184
    public ResponseEntity<?> generateCriteriaDraftDetailReport(@Valid @RequestBody OrderDetailReportForm form, Pageable pageable) {
        try {
            return new ResponseEntity<>(this.consolidate.generateOrderDetailReport(form, pageable), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @PostMapping("exportar-seven-check")
    public ResponseEntity<?> updateExportadoSeven(@Valid @RequestBody ExportSevenCheckForm form) {
        try {
            return new ResponseEntity<>(this.consolidate.updateExportadoSeven(form), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("detalle-giros-aprovechadores_periodos") // HU - 185
    public ResponseEntity<?> generateDraftDetailProfitableOrderByPeriods(@Valid @RequestBody PeriodOrderDetailForm form) {
        try {
            return new ResponseEntity<>(this.consolidate.generateDetailOrderByPeriods(form), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("reporte-saldo-cartera_terceros") // HU - 186 - 187 - 188 - 189 - 190
    public ResponseEntity<?> generateThirdPartyPortfolioBalanceReport(@Valid @RequestBody AprBalanceReportForm balanceReportForm) {
        try {
            return new ResponseEntity<>(this.consolidate.generateThirdPartyBalanceReport(balanceReportForm), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("detalle-reporte-saldo-cartera_terceros") // HU - 186 - 187 - 188 - 189 - 190
    public ResponseEntity<?> generateDetailThirdPartyBalanceReport(@Valid @RequestBody AprDetailBalanceReportForm balanceReportForm) {
        try {
            return new ResponseEntity<>(this.consolidate.generateDetailThirdPartyBalanceReport(balanceReportForm), HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
