package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.aprovechamiento.dto.*;
import com.bioagricola.apirest.aprovechamiento.payload.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class IConsolidate
 */
public interface IConsolidate {
    ConsolidationDto consolidateUse(ConsolidationForm consolidationForm);

    ConsolidationDto consolidateUseIncentive(ConsolidationForm consolidationForm);

    ConsolidationDto consolidateNewReconciledInvoices(ConsolidationForm consolidationForm);

    Page<List<ValueChangeDto<ConsolidationReportDto>>> generateConsolidateBilling(ConsolidationReportForm consolidationReportForm, Pageable pageable);

    Page<List<ValueChangeDto<ConsolidationReportIatDto>>> generateConsolidateUseReportIAT(ConsolidationReportForm consolidationReportForm, Pageable pageable);

    Page<List<ValueChangeDto<ConsolidationDetailReportIatDto>>> generateDetailReportIAT(ConsolidationReportForm consolidationReportForm, Pageable pageable);

    Page<List<ValueChangeDto<DetailValueChangeDto>>> generateConsolidateDetailUseReport(ConsolidationReportForm consolidationReportForm, Pageable pageable);

    Page<ThirdPartyCollectionDto> generateCollectionUseAndIncentiveReport(CollectionReportForm collectionReportForm, Pageable pageable);

    List<DetailCollectionUserThirdPartyDto> generateCollectionDetailUseReport(CollectionReportDetailForm detail);

    List<DetailCollectionUserThirdPartyDto> generateCollectionDetailUseReportByPeriods(CollectionReportDetailForm detail);

    Page<ThirdCollectionCrossingDto> generateCrossCollectionMeasured(Integer measured, CollectionReportDetailForm detail, Integer incentive, Pageable pageable) ;

    List<NotesChangeValueDto> generateNotesByIdTerceroAndMonthReport(CollectionReportDetailForm detail);

    Page<CollectionDetailTownHallTotalDto> generateCollectionDetailTownHallReport(CollectionDetailUse detailUse, Pageable pageable) throws Exception;

    Page<CollectionTownHallReportDto> generateCollectionDetailTownHallReportByMonth(CollectionDetailTownHall collectionDetailTownHall, Pageable pageable) throws Exception;

    LetterDto generateLetterUseByIdTercero( Map<String,Object> parameters);

    Page<InvoiceWrittenOffDto> generatePunishedInvoicesByMonthReport(CollectionDetailUse detail, Pageable pageable);

    Page<SearchCriteriaReportDto> generateSearchCriteriaReport(SearchCriteriaReportForm form, Long incentive, Pageable pageable) throws Exception;

    List<ReportBudgetDto> criteriaSearchReportInvoicing(CriteriaSearchInvoicingReportForm form);

    List<OrderDetailReportDto> generateOrderDetailReport(OrderDetailReportForm form, Pageable pageable);

    List<PeriodOrderDetailDto> generateDetailOrderByPeriods(PeriodOrderDetailForm form);

    List<BalanceReportDto> generateThirdPartyBalanceReport(AprBalanceReportForm balanceReportForm);

    List<DetailBalanceReportDto> generateDetailThirdPartyBalanceReport(AprDetailBalanceReportForm form);

    String executeConsolidation(Integer enterpriseId, Integer quantityRecords);

    Object updateExportadoSeven(ExportSevenCheckForm form);
}
