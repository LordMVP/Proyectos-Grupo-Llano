package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.dto.*;
import com.bioagricola.apirest.aprovechamiento.enums.ConsolidationState;
import com.bioagricola.apirest.aprovechamiento.enums.EnumConcepts;
import com.bioagricola.apirest.aprovechamiento.model.SevenDataDto;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IConsolidate;
import com.bioagricola.apirest.aprovechamiento.payload.*;
import com.bioagricola.apirest.aprovechamiento.repository.SevenRepository;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.entidades.*;
import com.bioagricola.apirest.modelo.manejadores.*;
import com.bioagricola.apirest.modelo.projections.ConConsolidacionAproGirosProjection;
import com.bioagricola.apirest.modelo.projections.ConConsolidacionAprovechamientoProjection;
import com.bioagricola.apirest.modelo.projections.DetPeriodoAproGirosProjection;
import com.bioagricola.apirest.modelo.projections.DetailConsolidacionAprovechamientoProjection;
import com.google.gson.Gson;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConsolidationServiceUtilities.*;
import static com.bioagricola.apirest.aprovechamiento.servicio.utils.DateUtil.*;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class NegocioConsolidacion
 */
@Service
public class BusinessConsolidate extends NegocioAbstracto<FacFactura, FacFacturaDTO> implements IConsolidate {
    private static final String CLASS_CONCEPT_USE_CC = "%\"aprovechamiento\": true, \"clase_concepto_aprovechamiento\": \"CC\"%";
    private String quantityRecordsCron;
    private String enterpriseIdCron;
    private String cronExpression;
    private static final String CLASS_CONCEPT_USE_TA = "%\"aprovechamiento\": true, \"clase_concepto_aprovechamiento\": \"TA\"%";
    private static final String CLASS_CONCEPT_USE_ADJUST_TA = "%\"clase_concepto_aprovechamiento\": \"AjusteTA\"%";
    private static final String CLASS_CONCEPT_USE_ADJUST_CC = "%{\"clase_concepto_aprovechamiento\": \"AjusteCC\"}%";
    private static final String CLASS_CONCEPT_DISCOUNT_DINC = "%{\"clase_concepto_aprovechamiento\": \"DescuentoDINC\"}%";
    private static final Integer ZERO = Integer.valueOf(0);
    private static final Integer PRG_PROCESO_SINCRONIZACION = 1096;
    private static final String PARAMETER_PATH = "/var/www/html/ReportesAchagua/";
    private static final String REPORT_NAME = "documentoOficioAprovechadorV4.jrxml";
    private static final String LOGO_JPG = "BioagricolaLogo.jpg";
    private static final String JNDI = "java:/PoolTecnicoAseo29";
    private static final String PDF = "pdf";
    public static final String MM_YYYY = "MM-yyyy";
    public static final String DD_MM_YYYY = "dd/MM/yyyy";
    public static final String PARAMETER_ERROR_MSG = "no encuentra objetos en parametros";
    private static DecimalFormat df = new DecimalFormat("#,##0.00");
    private SimpleDateFormat monthFormat = new SimpleDateFormat("MMMM", new Locale("es", "ES"));
    private SimpleDateFormat dateFormat = new SimpleDateFormat("dd,MMMM,yyyy", new Locale("es", "ES"));
    private SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy", new Locale("es", "ES"));
    private final ManejadorFacFactura manejadorFacFactura;
    private final ManejadorDfacDetfactura manejadorDfacDetfactura;
    private final ManejadorAprconcConciliacion manejadorAprconcConciliacion;
    private final ManejadorAprrecRecaudo manejadorAprrecRecaudo;
    private final ManejadorConConsolidacionAprovechamiento manejadorConConsolidacionAprovechamiento;
    private final ManejadorPdiaPardistribucionincentivo manejadorPdiaPardistribucionincentivo;
    private final ManejadorTacbTerceroaprovctabancacria manejadorTacbTerceroaprovctabancacria;
    private final NegocioParParametro negocioParParametro;
    private final ManejadorTerTercero manejadorTerTercero;
    private final ManejadorTidoTipdocumen manejadorTidoTipdocumen;
    private final ManejadorUsuarios manejadorUsuarios;
    private final ManejadorRepctRepconsolidarecaudoaprov manejadorRepctRepconsolida;
    private final ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;
    private final ManejadorDrecDetrecaudo manejadorDrecDetrecaudo;
    private final ManejadorDrecRecaudoAlcaldia manejadorDrecRecaudoAlcaldia;
    private final RestTemplate restTemplate;
    private static final String CFL_CODI = "cfl_codi";
    private static final String ITEM = "item";

    @Autowired
    private ManejadorFacturaAprovechamiento manejadorFacturaAprovechamiento;
    @Autowired
    private ManejadorConConcepto manejadorConConcepto;
    @Autowired
    private SevenRepository sevenRepository;

    public BusinessConsolidate(ManejadorFacFactura manejadorFacFactura, ManejadorAprconcConciliacion manejadorAprconcConciliacion, NegocioParParametro negocioParParametro,
                               ManejadorDfacDetfactura manejadorDfacDetfactura, ManejadorAprrecRecaudo manejadorAprrecRecaudo, ManejadorConConsolidacionAprovechamiento manejadorConConsolidacionAprovechamiento,
                               ManejadorPdiaPardistribucionincentivo manejadorPdiaPardistribucionincentivo,
                               ManejadorTerTercero manejadorTerTercero, ManejadorTacbTerceroaprovctabancacria manejadorTacbTerceroaprovctabancacria,
                               ManejadorUsuarios manejadorUsuarios, ManejadorRepctRepconsolidarecaudoaprov manejadorRepctRepconsolidarecaudoaprov,
                               ManejadorDsusDetsuscrip manejadorDsusDetsuscrip, ManejadorTidoTipdocumen manejadorTidoTipdocumen,
                               ManejadorDrecDetrecaudo manejadorDrecDetrecaudo, RestTemplate restTemplate,
                               ManejadorDrecRecaudoAlcaldia manejadorDrecRecaudoAlcaldia) {
        this.manejadorFacFactura = manejadorFacFactura;
        this.manejadorAprconcConciliacion = manejadorAprconcConciliacion;
        this.negocioParParametro = negocioParParametro;
        this.manejadorDfacDetfactura = manejadorDfacDetfactura;
        this.manejadorAprrecRecaudo = manejadorAprrecRecaudo;
        this.manejadorConConsolidacionAprovechamiento = manejadorConConsolidacionAprovechamiento;
        this.manejadorPdiaPardistribucionincentivo = manejadorPdiaPardistribucionincentivo;
        this.manejadorTerTercero = manejadorTerTercero;
        this.manejadorTacbTerceroaprovctabancacria = manejadorTacbTerceroaprovctabancacria;
        this.manejadorUsuarios = manejadorUsuarios;
        this.manejadorRepctRepconsolida = manejadorRepctRepconsolidarecaudoaprov;
        this.manejadorDsusDetsuscrip = manejadorDsusDetsuscrip;
        this.manejadorTidoTipdocumen = manejadorTidoTipdocumen;
        this.manejadorDrecDetrecaudo = manejadorDrecDetrecaudo;
        this.restTemplate = restTemplate;
        this.manejadorDrecRecaudoAlcaldia = manejadorDrecRecaudoAlcaldia;
    }

    @Override
    public ConsolidationDto consolidateUse(ConsolidationForm form) { // HU-116
        YearMonth yearMonth = getYearMonth(form.getPeriod());
        ConsolidationDto dto = new ConsolidationDto();
        IniciarProcesoDTO processDTO = new IniciarProcesoDTO();

        processDTO.setAnoCiclo(yearMonth.getYear());
        processDTO.setTipoAprovechamiento("TIPO_APROVECHAMIENTO");
        processDTO.setFechaCorteFacturacion(form.getBillingCutOffDate());

        List<FacFactura> invoices = getInvoicesUse(getInvoiceStates(), processDTO);

        if (!invoices.isEmpty())
            dto.setInvoices(getValidatedInvoices(invoices, form));

        return dto;
    }

    private List<FacFactura> getInvoicesUse(List<String> states, IniciarProcesoDTO dto) {
        return this.manejadorFacturaAprovechamiento.getFacturasAprovechamiento(states, dto.getAnoCiclo(),
                JwtUtil.auditoriaDTO.getIdEmpresa(),
                getConstantTypeUse(dto.getTipoAprovechamiento()),
                dto.getFechaCorteFacturacion());
    }

    private List<PercentageUserDto> getValidatedInvoices(List<FacFactura> validInvoices, ConsolidationForm form) {
        Date period = getDateFromYearMonth(form.getPeriod());
        Set<Long> idParentInvoices = new TreeSet<>();
        List<Integer> measuredConcepts; // Conceptos Aforado
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        long conceptCC = getConcept(CLASS_CONCEPT_USE_CC);
        long conceptTA = getConcept(CLASS_CONCEPT_USE_TA);
        long conceptAdjustTA = getConcept(CLASS_CONCEPT_USE_ADJUST_TA);
        long conceptAdjustCC = getConcept(CLASS_CONCEPT_USE_ADJUST_CC);
        BigDecimal utilizationPercentage; // porcentaje de Aprovechamiento

        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametros(enterpriseId, ConstantesServicios.UNIDAD_APROVECHAMIENTO);
            measuredConcepts = (List<Integer>) (parameters.get(ConstantesServicios.LIQUIDACION_AFORADOS));
            utilizationPercentage = new BigDecimal(((String) (parameters.get(ConstantesServicios
                    .PORCENTAJE_PARTICIPACION_AFORO_APROVECHAMIENTO))).replace("%", ""));
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        List<InvoiceConsolidationDto> invoices = new ArrayList<>();
        List<InvoiceConsolidationDto> financingInvoices = new ArrayList<>(); // facturas de financiación
        List<InvoiceConsolidationDto> measuredInvoices = new ArrayList<>(); // facturas de aforados
        List<InvoiceConsolidationDto> paymentInterestInvoices = new ArrayList<>(); // facturas de Interes de mora
        List<InvoiceConsolidationDto> otherInvoices = new ArrayList<>(); // otras facturas
        List<PercentageUserDto> percentageUserList = new ArrayList<>();

        invoices.addAll(convertToInvoiceConsolidationList(validInvoices, form, idParentInvoices, enterpriseId));
        invoices.addAll(getParentValidatedInvoices(form, enterpriseId, idParentInvoices));
        groupInvoices(conceptCC, invoices, financingInvoices, paymentInterestInvoices, measuredConcepts, otherInvoices, measuredInvoices);
        percentageUserList.addAll(consolidateFinancing(financingInvoices, conceptCC, conceptTA, conceptAdjustTA, conceptAdjustCC, form, false));
        percentageUserList.addAll(consolidatePaymentsMeasuredUsers(measuredInvoices, utilizationPercentage, period, conceptTA, conceptCC, form));
        percentageUserList.addAll(calculateValueConceptUse(period, utilizationPercentage, paymentInterestInvoices, false));
        percentageUserList.addAll(calculateValueConceptUse(period, utilizationPercentage, otherInvoices, false));
        saveInvoices(form, percentageUserList, false);
        return percentageUserList;
    }

    private long getConcept(String literalConcept) {
        return this.manejadorFacFactura.getConceptoXNombrePropiedad(literalConcept).orElse(ZERO).longValue();
    }

    private List<InvoiceConsolidationDto> convertToInvoiceConsolidationList(List<FacFactura> invoices, ConsolidationForm form,
                                                                            Set<Long> invoicesParentId, int enterpriseId) {
        List<InvoiceConsolidationDto> response = new ArrayList<>();

        invoices.forEach(invoice -> {
            InvoiceConsolidationDto dto = new InvoiceConsolidationDto();

            dto.setIdSettlement(invoice.getUniLiquidacion());
            dto.setIdPeriod(invoice.getPerIderegistro());
            dto.setIdInvoice(invoice.getFacIderegistro().intValue());
            dto.setIdFin(invoice.getFinIderegistro() != null ? invoice.getFinIderegistro().intValue() : 0);
            dto.setIdAmo(invoice.getAmoIderegistro() != null ? invoice.getAmoIderegistro().intValue() : 0);
            dto.setActualInvoiceValue(invoice.getFacVlrreal());
            dto.setInvoiceState(invoice.getFacEstado());
            dto.setDeadLineDate(invoice.getFacFecha());
            dto.setDetails(getDetails(form, enterpriseId, dto));
            response.add(dto);

            if (invoice.getFacIdeorigen() != null || invoice.getFacIdepadre() != null)
                invoicesParentId.add(invoice.getFacIdeorigen() != null ? invoice.getFacIdeorigen() : invoice.getFacIdepadre());
        });
        return response;
    }

    private List<InvoiceConsolidationDto> getParentValidatedInvoices(ConsolidationForm form, int enterpriseId, Set<Long> invoiceParentList) {
        List<InvoiceConsolidationDto> response = new ArrayList<>();

        invoiceParentList.forEach(id -> this.manejadorFacFactura.findById(id).ifPresent(invoice -> {
            InvoiceConsolidationDto dto = new InvoiceConsolidationDto();

            setInvoiceConsolidationFields(invoice, dto);

            List<Object[]> invoiceDetails = this.manejadorFacFactura.
                    obtenerDetallesFacturasHijasXRecaudo(id, form.getProcessingDeadlineDate(), enterpriseId);
            if (!invoiceDetails.isEmpty()) {
                List<InvoiceUseDetailDto> details = invoiceDetails
                        .stream().map(detail -> {
                            InvoiceUseDetailDto detailDto = getInvoiceUseDetailDto(detail);

                            detailDto.setIdDrec(detail[2] != null ? ((BigInteger) detail[2]).intValue() : 0);
                            return detailDto;
                        }).collect(Collectors.toList());

                dto.setDetails(details);
            }

            response.add(dto);
        }));
        return response;
    }

    private void groupInvoices(Long conceptCC, List<InvoiceConsolidationDto> invoicesDto,
                               List<InvoiceConsolidationDto> financingInvoices,
                               List<InvoiceConsolidationDto> paymentInterestInvoices,
                               List<Integer> measuredConcepts,
                               List<InvoiceConsolidationDto> otherInvoices,
                               List<InvoiceConsolidationDto> measuredInvoices) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<Long> concepts = measuredConcepts.stream().map(Integer::longValue).collect(Collectors.toList());
        final long concept = !concepts.isEmpty() ? concepts.get(0) : 0;
        final long finalConceptCC = conceptCC != null ? conceptCC : 0;

        invoicesDto.forEach(invoice -> {
            AtomicBoolean exclude = new AtomicBoolean(true);

            invoice.getDetails().forEach(detail -> {
                if (this.manejadorFacFactura.countByIdAndUniConcepto(detail.getIdDetailInvoice().longValue(), concept) > 0
                        && this.manejadorFacFactura.countByIdAndUniConcepto(detail.getIdDetailInvoice().longValue(), finalConceptCC) == 0) {
                    exclude.set(false);
                    measuredInvoices.add(invoice);
                }

                if (invoice.getIdFin() != null && invoice.getIdAmo() != null && invoice.getInvoiceState().equals("A")) {
                    exclude.set(false);
                    this.manejadorFacFactura.getPorcentajeAprovechamiento(detail.getIdConcept(), invoice.getIdSettlement())
                            .ifPresent(percentage -> {
                                detail.setPercentage(percentage.intValue());
                                financingInvoices.add(invoice);
                            });
                }

                if (this.manejadorFacFactura.countClasificacionFactura("IM", invoice.getIdInvoice(), enterpriseId).intValue() > 0) {
                    exclude.set(false);
                    this.manejadorFacFactura.getPorcentajeAprovechamiento(detail.getIdConcept(), invoice.getIdSettlement())
                            .ifPresent(percentage -> {
                                detail.setPercentage(percentage.intValue());
                                paymentInterestInvoices.add(invoice);
                            });
                }

                loadOtherInvoices(otherInvoices, invoice, exclude);
            });
        });
    }

    private void loadOtherInvoices(List<InvoiceConsolidationDto> otherInvoices, InvoiceConsolidationDto dto, AtomicBoolean exclude) {
        if (exclude.get())
            otherInvoices.add(dto);
    }

    private List<PercentageUserDto> consolidateFinancing(List<InvoiceConsolidationDto> invoices, Long conceptCC, Long conceptTA,
                                                         Long conceptAdjustTA, Long conceptAdjustCC, ConsolidationForm form,
                                                         boolean measured) {// HU-118
        BigDecimal utilizationPercentage = getUtilizationPercentage();
        Date period = getDateFromYearMonth(form.getPeriod());
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        BigDecimal sumTA = conceptTA != null ? addInvoicesByConcept(invoices, conceptTA.intValue()) : BigDecimal.ZERO;
        BigDecimal sumCC = conceptCC != null ? addInvoicesByConcept(invoices, conceptCC.intValue()) : BigDecimal.ZERO;
        BigDecimal sumAdjustTA = conceptAdjustTA != null ? addInvoicesByConcept(invoices, conceptAdjustTA.intValue()) : BigDecimal.ZERO;
        BigDecimal sumAdjustCC = conceptAdjustCC != null ? addInvoicesByConcept(invoices, conceptAdjustCC.intValue()) : BigDecimal.ZERO;
        BigDecimal totalCapital = sumTA.add(sumCC).add(sumAdjustCC).add(sumAdjustTA);
        Map<InvoiceConsolidationDto, BigDecimal> apportionment = new HashMap<>();
        Map<InvoiceConsolidationDto, BigDecimal> baseInterest = new HashMap<>();
        Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> capitalPercentage = new HashMap<>();
        Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> participationValue = new HashMap<>();
        BigDecimal hundred = BigDecimal.valueOf(100);

        for (InvoiceConsolidationDto invoice : invoices) {
            BigDecimal dues = new BigDecimal(this.manejadorFacFactura.getCuotas(invoice.getIdFin()).orElse(BigInteger.valueOf(1)));
            BigDecimal sumConcepts = BigDecimal.ZERO;
            Map<EnumConcepts, BigDecimal> percentCapitalEnum = new HashMap<>();
            BigDecimal commonInterest = BigDecimal.valueOf(1); // INTERES CORRIENTE

            for (InvoiceUseDetailDto detail : invoice.getDetails()) {
                commonInterest = commonInterest.add(new BigDecimal(this.manejadorFacFactura
                        .valorFinanciacion(detail.getIdDetailInvoice().longValue(), enterpriseId).orElse(BigInteger.ZERO)));
                sumConcepts = sumConcepts.add(addAllConcepts(conceptCC, conceptTA, conceptAdjustTA, conceptAdjustCC,
                        dues, percentCapitalEnum, detail));
            }

            capitalPercentage.put(invoice, percentCapitalEnum);

            BigDecimal apportionmentValue = sumConcepts.divide(totalCapital, 7, RoundingMode.HALF_DOWN).multiply(hundred);
            BigDecimal finalCommonInterest = commonInterest;

            apportionment.put(invoice, apportionmentValue);
            baseInterest.put(invoice, apportionmentValue.multiply(finalCommonInterest).divide(hundred, 7, RoundingMode.HALF_DOWN));
        }

        getCapitalPercentage(capitalPercentage);

        Map<EnumConcepts, Map<Integer, BigDecimal>> percentageConceptUse = new HashMap<>();
        Map<InvoiceConsolidationDto, Map<EnumConcepts, Map<Integer, BigDecimal>>> percentageUse =
                getPercentageUseMap(utilizationPercentage, apportionment, capitalPercentage, participationValue, percentageConceptUse);

        getInterestPercentageUse(utilizationPercentage, participationValue);
        return getUsesList(invoices, form, period, percentageConceptUse, percentageUse, utilizationPercentage, measured);
    }

    private BigDecimal getUtilizationPercentage() {
        BigDecimal utilizationPercentage; // porcentaje de Aprovechamiento
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();

        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametros(enterpriseId, ConstantesServicios.UNIDAD_APROVECHAMIENTO);
            utilizationPercentage = new BigDecimal(((String) (parameters.get(ConstantesServicios
                    .PORCENTAJE_PARTICIPACION_AFORO_APROVECHAMIENTO))).replace("%", ""));
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }
        return utilizationPercentage;
    }

    private BigDecimal addInvoicesByConcept(List<InvoiceConsolidationDto> invoices, Integer idConcept) {
        BigDecimal sumConcept = BigDecimal.ZERO;

        for (InvoiceConsolidationDto invoice : invoices) {
            BigDecimal dues = new BigDecimal(this.manejadorFacFactura.getCuotas(invoice.getIdFin()).orElse(BigInteger.valueOf(1)));
            sumConcept = sumConcept.add(invoice.getDetails().stream()
                    .filter(detail -> detail.getIdConcept().equals(idConcept))
                    .map(detail -> calculatePercentageByCapital(dues, detail.getIdConcept(), detail.getIdDetailInvoice().longValue()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
        }

        return sumConcept;
    }

    private BigDecimal calculatePercentageByCapital(BigDecimal dues, Integer concept, long idDetail) {
        return this.manejadorDfacDetfactura.vlrTotalByDfacIderegistrAndUniConcepto(idDetail, concept)
                .orElse(BigDecimal.ZERO).divide(dues, 7, RoundingMode.HALF_DOWN);
    }

    private BigDecimal addAllConcepts(Long conceptCC, Long conceptTA, Long conceptAdjustTA, Long conceptAdjustCC, BigDecimal dues,
                                      Map<EnumConcepts, BigDecimal> percentCapitalEnum, InvoiceUseDetailDto detail) {
        BigDecimal sumConcepts = BigDecimal.ZERO;

        if (conceptTA != null)
            sumConcepts = sumConcepts.add(addConcept(conceptTA.intValue(), dues, percentCapitalEnum, detail, EnumConcepts.ParteTA));

        if (conceptCC != null)
            sumConcepts = sumConcepts.add(addConcept(conceptCC.intValue(), dues, percentCapitalEnum, detail, EnumConcepts.ParteCC));

        if (conceptAdjustTA != null)
            sumConcepts = sumConcepts
                    .add(addConcept(conceptAdjustTA.intValue(), dues, percentCapitalEnum, detail, EnumConcepts.AjusteTA));

        if (conceptAdjustCC != null)
            sumConcepts = sumConcepts
                    .add(addConcept(conceptAdjustCC.intValue(), dues, percentCapitalEnum, detail, EnumConcepts.AjusteCC));

        return sumConcepts;
    }

    private BigDecimal addConcept(Integer idConcept, BigDecimal dues, Map<EnumConcepts, BigDecimal> percentCapitalEnum,
                                  InvoiceUseDetailDto detail, EnumConcepts enumConcepts) {
        BigDecimal sumConcepts = BigDecimal.ZERO;

        if (detail.getIdConcept().equals(idConcept)) {
            BigDecimal percentage = calculatePercentageByCapital(dues, detail.getIdConcept(), detail.getIdDetailInvoice().longValue());

            percentCapitalEnum.put(enumConcepts, percentage);
            sumConcepts = sumConcepts.add(percentage);
        }

        return sumConcepts;
    }

    private Map<InvoiceConsolidationDto, Map<EnumConcepts, Map<Integer, BigDecimal>>> getPercentageUseMap(
            BigDecimal utilizationPercentage, Map<InvoiceConsolidationDto, BigDecimal> apportionment,
            Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> capitalPercentage, Map<InvoiceConsolidationDto,
            Map<EnumConcepts, BigDecimal>> participationValue, Map<EnumConcepts, Map<Integer, BigDecimal>> percentageConceptUse) {
        Map<InvoiceConsolidationDto, Map<EnumConcepts, Map<Integer, BigDecimal>>> percentageUse = new HashMap<>();

        capitalPercentage.forEach((invoice, conceptCapital) -> {
            Map<EnumConcepts, BigDecimal> participationValueByConcept = new HashMap<>();

            conceptCapital.forEach((keyEnum, valorCapital) -> {
                participationValueByConcept.put(keyEnum, apportionment.get(invoice).multiply(valorCapital)
                        .divide(BigDecimal.valueOf(100)));
                participationValue.put(invoice, participationValueByConcept);
            });

            Map<EnumConcepts, Map<Integer, BigDecimal>> capitalConceptUse =
                    calculatePercentageUseByConcepts(utilizationPercentage, invoice, conceptCapital, percentageConceptUse);

            percentageUse.put(invoice, capitalConceptUse);
        });
        return percentageUse;
    }

    private Map<Integer, BigDecimal> calculatedParticipationPercentageByConcept(int idConcept, Integer idPeriod,
                                                                                Map<EnumConcepts, BigDecimal> conceptCapital,
                                                                                BigDecimal utilizationPercentage, EnumConcepts enumConcepts,
                                                                                Map<EnumConcepts, Map<Integer, BigDecimal>> percentageConceptUse) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        Map<Integer, BigDecimal> capitalDistributedByUse = new HashMap<>();
        Map<Integer, BigDecimal> percentageDistributedByUse = new HashMap<>();
        BigDecimal hundred = BigDecimal.valueOf(100);
        List<Object[]> participationPercentageList = this.manejadorFacFactura.getPorcentajeParticipacionAprovechador(idPeriod, enterpriseId, idConcept);

        participationPercentageList.forEach(objects -> {
            final BigDecimal percentage = (BigDecimal) objects[0];
            final int terceroId = ((BigDecimal) objects[1]).intValue();
            BigDecimal calculatedValue = conceptCapital.get(enumConcepts)
                    .multiply(utilizationPercentage).divide(hundred, 7, RoundingMode.HALF_DOWN)
                    .multiply(percentage).divide(hundred, 7, RoundingMode.HALF_DOWN);

            capitalDistributedByUse.put(terceroId, calculatedValue);
            percentageDistributedByUse.put(terceroId, percentage);
        });

        if (percentageConceptUse != null)
            percentageConceptUse.put(enumConcepts, percentageDistributedByUse);

        return capitalDistributedByUse;
    }

    private List<PercentageUserDto> getUsesList(List<InvoiceConsolidationDto> consolidationInvoices, ConsolidationForm form, Date period,
                                                Map<EnumConcepts, Map<Integer, BigDecimal>> percentageConceptUse,
                                                Map<InvoiceConsolidationDto, Map<EnumConcepts, Map<Integer, BigDecimal>>> percentageUse,
                                                BigDecimal utilizationPercentage, boolean measured) {
        List<PercentageUserDto> response = new ArrayList<>();
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        int userId = JwtUtil.auditoriaDTO.getIdUsuario();

        consolidationInvoices.forEach(invoice -> {
            for (InvoiceUseDetailDto detail : invoice.getDetails()) {
                percentageUse.get(invoice)
                        .forEach((enumConcept, valueByTercero) ->
                                valueByTercero.forEach((idTercero, calculatedValue) -> {
                                    PercentageUserDto dto = new PercentageUserDto();

                                    dto.setIdInvoice(invoice.getIdInvoice().longValue());
                                    dto.setEnumConcepts(enumConcept);
                                    dto.setIdThirdParty(idTercero.longValue());
                                    dto.setEnterpriseId(enterpriseId);
                                    dto.setUserId(userId);
                                    dto.setPeriodId(invoice.getIdPeriod());
                                    dto.setConceptId(detail.getIdConcept());
                                    dto.setIdDetailInvoice(detail.getIdDetailInvoice());
                                    dto.setState("P");
                                    dto.setIdDetailCollection(detail.getIdDrec() != null ? detail.getIdDrec() : 0);
                                    dto.setCalculatedValue(calculatedValue);
                                    dto.setPercentage(percentageConceptUse.get(enumConcept).get(idTercero));
                                    dto.setValueBase(utilizationPercentage);
                                    dto.setDeadLineDate(invoice.getDeadLineDate());
                                    dto.setInitialPeriodDate(period);
                                    dto.setRegisterDate(new Date());
                                    dto.setDateMaximumProcessing(form.getProcessingDeadlineDate());
                                    dto.setMeasured(measured ? 1 : 0);
                                    dto.setFinancing(1);
                                    response.add(dto);
                                }));
            }
        });

        return response;
    }

    private List<PercentageUserDto> consolidatePaymentsMeasuredUsers(List<InvoiceConsolidationDto> invoices,
                                                                     BigDecimal utilizationPercentage, Date period,
                                                                     Long conceptCC, Long conceptTA, ConsolidationForm form) { //HU-127
        List<InvoiceConsolidationDto> financingInvoices = new ArrayList<>();
        List<InvoiceConsolidationDto> financingNotInvoices = new ArrayList<>();
        List<PercentageUserDto> response = new ArrayList<>();

        invoices.forEach(invoice -> {
            if (invoice.getIdFin() != null && invoice.getIdAmo() != null && invoice.getInvoiceState().equals("A"))
                financingInvoices.add(invoice);
            else
                financingNotInvoices.add(invoice);
        });
        response.addAll(getPercentageByUse(utilizationPercentage, financingNotInvoices, period, true)); // HU-127
        response.addAll(consolidateFinancing(financingInvoices, conceptCC, conceptTA, null, null, form, true)); // HU - 128
        return response;
    }

    private List<PercentageUserDto> getPercentageByUse(BigDecimal utilizationPercentage, List<InvoiceConsolidationDto> invoices,
                                                       Date period, boolean measured) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<PercentageUserDto> response = new ArrayList<>();

        for (InvoiceConsolidationDto invoice : invoices) {
            BigDecimal valueConceptUse = invoice.getActualInvoiceValue().multiply(utilizationPercentage)
                    .divide(BigDecimal.valueOf(100), 7, RoundingMode.HALF_DOWN);

            response.addAll(getPercentageList(enterpriseId, invoice, valueConceptUse, period, utilizationPercentage, measured));
        }

        return response;
    }

    private List<PercentageUserDto> getPercentageList(int enterpriseId, InvoiceConsolidationDto invoice, BigDecimal valueConceptUse,
                                                      Date period, BigDecimal utilizationPercentage, boolean measured) {
        List<PercentageUserDto> response = new ArrayList<>();
        int userId = JwtUtil.auditoriaDTO.getIdUsuario();

        for (InvoiceUseDetailDto detail : invoice.getDetails()) {
            List<Object[]> percentageUseList = this.manejadorFacFactura
                    .getPorcentajeParticipacionAprovechador(invoice.getIdPeriod(), enterpriseId, detail.getIdConcept());
            percentageUseList.forEach(objects -> {
                PercentageUserDto percentageUserDto = new PercentageUserDto();
                BigDecimal percentage = (BigDecimal) objects[0];
                Long idTercero = (Long) objects[1];
                BigDecimal calculatedValue = valueConceptUse.multiply(percentage).divide(BigDecimal.valueOf(100), 7, RoundingMode.HALF_DOWN);

                percentageUserDto.setIdInvoice(invoice.getIdInvoice().longValue());
                percentageUserDto.setIdThirdParty(idTercero);
                percentageUserDto.setPercentage(percentage);
                percentageUserDto.setEnterpriseId(enterpriseId);
                percentageUserDto.setIdDetailInvoice((invoice.getIdInvoice()));
                percentageUserDto.setUserId(userId);
                percentageUserDto.setPeriodId(invoice.getIdPeriod());
                percentageUserDto.setConceptId(detail.getIdConcept());
                percentageUserDto.setEnumConcepts(EnumConcepts.ParteTA);
                percentageUserDto.setInitialPeriodDate(period);
                percentageUserDto.setIdDetailCollection(detail.getIdDrec() != null ? detail.getIdDrec() : 0);
                percentageUserDto.setValueBase(utilizationPercentage);
                percentageUserDto.setCalculatedValue(calculatedValue);
                percentageUserDto.setMeasured(measured ? 1 : 0);
                response.add(percentageUserDto);
            });
        }

        return response;
    }

    @Override
    public ConsolidationDto consolidateNewReconciledInvoices(ConsolidationForm form) {
        ConsolidationDto consolidationDto = new ConsolidationDto();
        List<Integer> concepts = new ArrayList<>(this.manejadorFacFactura.getIdUniconceptoXConPropiedadAprochOrIncetivoAproch(ConstantesServicios.APROVECHAMIENTO));
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        YearMonth yearMonth = getYearMonth(form.getPeriod());
        final Date period = getDateFromYearMonth(yearMonth);
        Integer claTercero;
        List<Integer> measuredConcepts;
        long conceptCC = getConcept(CLASS_CONCEPT_USE_CC);
        long conceptTA = getConcept(CLASS_CONCEPT_USE_TA);
        List<InvoiceConsolidationDto> financingInvoices = new ArrayList<>();
        List<InvoiceConsolidationDto> measuredInvoices = new ArrayList<>();
        List<InvoiceConsolidationDto> paymentInterestInvoices = new ArrayList<>();
        List<InvoiceConsolidationDto> otherInvoices = new ArrayList<>();
        BigDecimal utilizationPercentage; // porcentaje aprovechamiento

        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametrosAprovechamiento();
            claTercero = (Integer) parameters.get(ConstantesServicios.CLASIFICACION_TERCERO_INCENTIVO_APROVECHADOR);
            measuredConcepts = (List<Integer>) (parameters.get(ConstantesServicios.LIQUIDACION_AFORADOS));
            utilizationPercentage = new BigDecimal(((String) (parameters.get(ConstantesServicios.PORCENTAJE_PARTICIPACION_AFORO_APROVECHAMIENTO)))
                    .replace("%", ""));
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        List<Object[]> collections = this.manejadorFacFactura.obtenerDetallesFacturasConciliadasHijasXRecaudo(form.getBillingCutOffDate(), period, concepts, enterpriseId, claTercero);
        List<Object[]> notes = this.manejadorFacFactura.obtenerDetallesFacturasConciliadasHijasXNota(form.getBillingCutOffDate(), period, concepts, enterpriseId, claTercero);
        List<InvoiceConsolidationDto> invoices = new ArrayList<>();

        collections.forEach(collection -> createConsolidationData(invoices, collection, true));
        notes.forEach(note -> createConsolidationData(invoices, note, false));
        groupInvoices(conceptCC, invoices, financingInvoices, paymentInterestInvoices, measuredConcepts, otherInvoices, measuredInvoices);

        //HU-126
        List<PercentageUserDto> percentageUsers = new ArrayList<>();

        percentageUsers.addAll(consolidateFinancing(financingInvoices, null, conceptTA, null, null, form, false));
        percentageUsers.addAll(calculateValueConceptUse(period, utilizationPercentage, paymentInterestInvoices, true));
        percentageUsers.addAll(calculateValueConceptUse(period, utilizationPercentage, otherInvoices, true));
        consolidationDto.setInvoices(percentageUsers);
        saveInvoices(form, percentageUsers, true);
        return consolidationDto;
    }

    private List<PercentageUserDto> calculateValueConceptUse(Date period, BigDecimal utilizationPercentage,
                                                             List<InvoiceConsolidationDto> invoices, boolean selections) {
        long conceptCC = getConcept(CLASS_CONCEPT_USE_CC);
        long conceptAdjustTA = getConcept(CLASS_CONCEPT_USE_ADJUST_TA);
        List<Long> conceptCreditNote;
        List<Long> conceptDebitNote;
        List<Long> conceptPositiveBalanceNote;
        List<PercentageUserDto> percentageUsers = new ArrayList<>();

        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametrosAprovechamiento();
            conceptCreditNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_CREDITO);
            conceptDebitNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_DEBITO);
            conceptPositiveBalanceNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_CREDITO_SALDO_FAVOR);
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        invoices.forEach(invoice -> invoice.getDetails().forEach(detail -> {
            if (selections) {
                addToDto(period, utilizationPercentage, conceptDebitNote, conceptPositiveBalanceNote, percentageUsers, invoice, detail);
            } else {
                getPercentageByConceptsUse(period, utilizationPercentage, invoices, conceptCC, conceptAdjustTA, detail, percentageUsers);

                if ((conceptCreditNote.stream().anyMatch(nc -> detail.getIdConcept() == nc.longValue())
                        || invoice.getInvoiceState().equals("C"))
                        || conceptDebitNote.stream().anyMatch(nd -> detail.getIdConcept() == nd.longValue())
                        || conceptPositiveBalanceNote.stream().anyMatch(ns -> detail.getIdConcept() == ns.longValue()))
                    percentageUsers.addAll(getPercentageByUse(utilizationPercentage, invoices,
                            period, false));

                if (conceptCreditNote.stream().anyMatch(nc -> detail.getIdConcept() == nc.longValue())
                        || conceptDebitNote.stream().anyMatch(nd -> detail.getIdConcept() == nd.longValue())
                        || conceptPositiveBalanceNote.stream().anyMatch(ns -> detail.getIdConcept() == ns.longValue()))
                    percentageUsers.addAll(getPercentageByUse(utilizationPercentage, invoices,
                            period, false));
            }
        }));
        return percentageUsers;
    }

    private void addToDto(Date period, BigDecimal utilizationPercentage, List<Long> conceptDebitNote,
                          List<Long> conceptPositiveBalanceNote, List<PercentageUserDto> percentageUsers,
                          InvoiceConsolidationDto invoice, InvoiceUseDetailDto detail) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        int userId = JwtUtil.auditoriaDTO.getIdUsuario();

        if (invoice.getInvoiceState().equals("C") || conceptDebitNote.stream().anyMatch(nd -> detail.getIdConcept() == nd.longValue()) ||
                conceptPositiveBalanceNote.stream().anyMatch(ns -> detail.getIdConcept() == ns.longValue()) || detail.getIdDrec() != null) {
            BigDecimal conceptValue = ((invoice.getActualInvoiceValue()).multiply(utilizationPercentage))
                    .divide(BigDecimal.valueOf(100), 7, RoundingMode.HALF_DOWN);
            List<Object[]> percentageParticipation = this.manejadorFacFactura
                    .getPorcentajeParticipacionAprovechador(invoice.getIdPeriod(), enterpriseId, detail.getIdConcept());

            percentageParticipation.forEach(objects -> {
                PercentageUserDto percentageUserDto = new PercentageUserDto();
                BigDecimal percentage = (BigDecimal) objects[0];
                Long idTercero = (Long) objects[1];
                BigDecimal calculatedValue = conceptValue.multiply(percentage).divide(BigDecimal.valueOf(100), 7, RoundingMode.HALF_DOWN);

                percentageUserDto.setIdInvoice(invoice.getIdInvoice().longValue());
                percentageUserDto.setIdThirdParty(idTercero);
                percentageUserDto.setPercentage(percentage);
                percentageUserDto.setEnterpriseId(enterpriseId);
                percentageUserDto.setIdDetailInvoice(invoice.getIdInvoice());
                percentageUserDto.setUserId(userId);
                percentageUserDto.setPeriodId(invoice.getIdPeriod());
                percentageUserDto.setConceptId(detail.getIdConcept());
                percentageUserDto.setEnumConcepts(EnumConcepts.ParteTA);
                percentageUserDto.setInitialPeriodDate(period);
                percentageUserDto.setIdDetailCollection(detail.getIdDrec() != null ? detail.getIdDrec() : 0);
                percentageUserDto.setValueBase(utilizationPercentage);
                percentageUserDto.setCalculatedValue(calculatedValue);
                percentageUserDto.setIdProject(invoice.getIdProject());
                percentageUserDto.setMeasured(0);
                percentageUsers.add(percentageUserDto);
            });
        }
    }

    private void getPercentageByConceptsUse(Date period, BigDecimal utilizationPercentage, List<InvoiceConsolidationDto> invoices,
                                            long conceptCC, long conceptAdjustTA, InvoiceUseDetailDto detail, List<PercentageUserDto> percentageUsers) {
        if (detail.getIdConcept().longValue() == conceptAdjustTA || detail.getIdConcept().longValue() == conceptCC)
            percentageUsers.addAll(getPercentageByUse(utilizationPercentage, invoices, period, false));
    }

    public String executeConsolidation(Integer enterpriseId, Integer quantityRecords) {
        try {
            this.manejadorAprrecRecaudo.generateCpr(enterpriseId, quantityRecords,PRG_PROCESO_SINCRONIZACION);
            this.manejadorAprrecRecaudo.generateSincFa(enterpriseId, quantityRecords);
            this.manejadorAprrecRecaudo.generateSincCas(enterpriseId, quantityRecords);
            this.manejadorAprrecRecaudo.generateSincNot(enterpriseId, quantityRecords);
            this.manejadorAprrecRecaudo.generateSincRec(enterpriseId, quantityRecords);
            this.manejadorAprrecRecaudo.generateMarcacionDistribucion(enterpriseId);
            this.manejadorAprrecRecaudo.updateCpr(enterpriseId,PRG_PROCESO_SINCRONIZACION,'I');

            return "Ejecutado consolidación de aprovechamiento"+ enterpriseId + " " + quantityRecords;

        }catch (Exception e){
            return "Error en la consolidación de aprovechamiento";
        }
    }
  //@Scheduled(cron = "0 10 1 * * ?")
    public void executeConsolidation() {
        Integer idEmpresa = Integer.parseInt("317");
        Integer cantidadRegistros = Integer.parseInt("100000");

        if (this.manejadorAprrecRecaudo.validateCpr(idEmpresa,PRG_PROCESO_SINCRONIZACION) ){
            try {

                this.manejadorAprrecRecaudo.generateCpr(idEmpresa, cantidadRegistros, PRG_PROCESO_SINCRONIZACION);
                System.out.println("Generando Cpr");
                this.manejadorAprrecRecaudo.generateSincFa(idEmpresa, cantidadRegistros);
                System.out.println("Generando SincFa");
                this.manejadorAprrecRecaudo.generateSincRec(idEmpresa, cantidadRegistros);
                System.out.println("Generando SincRec");

                this.manejadorAprrecRecaudo.generateSincCas(idEmpresa, cantidadRegistros);
                System.out.println("Generando SincCas");
                this.manejadorAprrecRecaudo.generateSincNot(idEmpresa, cantidadRegistros);
                System.out.println("Generando SincNot");

                this.manejadorAprrecRecaudo.generateMarcacionDistribucion(idEmpresa);
                System.out.println("Generando Marcacion Distribucion");

                this.manejadorAprrecRecaudo.updateCpr(idEmpresa, PRG_PROCESO_SINCRONIZACION,'I');
            } catch (Exception e) {
                this.manejadorAprrecRecaudo.updateCpr(idEmpresa, PRG_PROCESO_SINCRONIZACION,'E');
                System.out.println("Error en la consolidación de aprovechamiento"+ e.getMessage());
            }
        }
    }

    private void saveInvoices(ConsolidationForm form, List<PercentageUserDto> userDtoList, boolean incentive) {
        List<ConConsolidacionAprovechamiento> entity = new ArrayList<>();

        for (PercentageUserDto dto : userDtoList) {
            ConConsolidacionAprovechamiento row = new ConConsolidacionAprovechamiento();
            Integer idConcept = dto.getConceptId();

            row.setFacIderegistro(BigInteger.valueOf(dto.getIdInvoice()));
            row.setConcepto(dto.getEnumConcepts().name());
            row.setTerIderegistro(dto.getIdThirdParty());
            row.setPorcentaje(dto.getPercentage());
            row.setEmpIderegistro(dto.getEnterpriseId());
            row.setUsuIderegistro(dto.getUserId());
            row.setPerIderegistro(dto.getPeriodId()); //
            row.setPerFecinicial(dto.getInitialPeriodDate());
            row.setUniConcepto(idConcept);
            row.setTipoConcepto(getConceptType(idConcept));
            row.setDfacIderegistr(BigInteger.valueOf(dto.getIdDetailInvoice()));
            row.setDrecIderegistro(dto.getIdDetailCollection());
            row.setValorBase(dto.getValueBase());
            row.setValorCalculado(dto.getCalculatedValue());
            row.setEstado(ConsolidationState.ACTIVO.name());
            row.setFechaReg(new Date());
            row.setFechaCorte(form.getBillingCutOffDate()); // fecha de corte
            row.setFechaMaximoProcesamiento(form.getProcessingDeadlineDate());
            row.setProyectoIderegistro(dto.getIdProject());
            row.setAforado(dto.getMeasured());
            row.setIncentivo(incentive ? 1 : 0);
            row.setOficioPago(0);
            row.setExportarSeven(0);
            entity.add(row);
        }

        this.manejadorConConsolidacionAprovechamiento.saveAll(entity);
    }

    private String getConceptType(Integer conceptId) {
        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametrosAprovechamiento();
            List<Long> idConceptCreditNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_CREDITO);

            if (idConceptCreditNote.stream().anyMatch(nc -> conceptId == nc.longValue()))
                return "NC";

            List<Long> idConceptDebitNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_DEBITO);

            if (idConceptDebitNote.stream().anyMatch(nd -> conceptId == nd.longValue()))
                return "ND";

            List<Long> idConceptPositiveBalanceNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_CREDITO_SALDO_FAVOR);

            if (idConceptPositiveBalanceNote.stream().anyMatch(ns -> conceptId == ns.longValue()))
                return "NS";

        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        return "NS";
    }

    @Override
    public ConsolidationDto consolidateUseIncentive(ConsolidationForm form) {
        ConsolidationDto consolidationDto = new ConsolidationDto();
        YearMonth yearMonth = getYearMonth(form.getPeriod());
        IniciarProcesoDTO processDTO = new IniciarProcesoDTO();

        processDTO.setAnoCiclo(yearMonth.getYear());
        processDTO.setTipoAprovechamiento("TIPO_INCENTIVO_APROVECHAMIENTO");
        processDTO.setFechaCorteFacturacion(form.getBillingCutOffDate());

        List<FacFactura> invoices = getInvoicesUse(getInvoiceStates(), processDTO);

        if (!invoices.isEmpty())
            consolidationDto.setInvoices(getValidIncentiveInvoices(invoices, form));

        return consolidationDto;
    }

    private List<PercentageUserDto> getValidIncentiveInvoices(List<FacFactura> validInvoices, ConsolidationForm form) {
        Integer enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        final Date period = getDateFromYearMonth(form.getPeriod());
        Set<Long> idParentInvoices = new TreeSet<>();
        BigDecimal incentiveUsePercentage = new BigDecimal(manejadorPdiaPardistribucionincentivo.porcentajeIncentivoAprovechamiento(enterpriseId));
        List<InvoiceConsolidationDto> invoices = new ArrayList<>();

        invoices.addAll(convertToInvoiceConsolidationList(validInvoices, form, idParentInvoices, enterpriseId));
        invoices.addAll(getParentValidatedInvoices(form, enterpriseId, idParentInvoices));

        List<InvoiceConsolidationDto> financingInvoices = new ArrayList<>();
        List<InvoiceConsolidationDto> paymentInterestInvoices = new ArrayList<>();
        List<InvoiceConsolidationDto> otherInvoices = new ArrayList<>();
        List<PercentageUserDto> percentageUserList = new ArrayList<>();

        groupInvoices(null, invoices, financingInvoices, paymentInterestInvoices, Collections.emptyList(), otherInvoices, null);
        percentageUserList.addAll(calculateValueConceptUse(period, incentiveUsePercentage, paymentInterestInvoices, false));
        percentageUserList.addAll(calculateValueConceptUse(period, incentiveUsePercentage, otherInvoices, false));
        saveInvoices(form, percentageUserList, true);
        return percentageUserList;
    }

    private void createConsolidationData(List<InvoiceConsolidationDto> invoices, Object[] object, boolean itsCollected) {
        InvoiceConsolidationDto dto = new InvoiceConsolidationDto();

        dto.setIdInvoice(object[0] != null ? ((BigInteger) object[0]).intValue() : 0);
        dto.setIdSettlement(object[1] != null ? ((BigInteger) object[1]).intValue() : 0);
        dto.setIdPeriod(object[2] != null ? ((BigInteger) object[2]).intValue() : 0);
        dto.setIdFin(object[3] != null ? ((BigInteger) object[3]).intValue() : 0);
        dto.setIdAmo(object[4] != null ? ((BigInteger) object[4]).intValue() : 0);
        dto.setActualInvoiceValue(object[5] != null ? BigDecimal.valueOf((Long) object[5]) : BigDecimal.valueOf(0));
        dto.setInvoiceState(object[6] != null ? (String) object[6] : "");
        dto.setDeadLineDate(object[7] != null ? (Date) object[7] : new Date());
        dto.setIdProject(object[10] != null ? ((BigInteger) object[10]).intValue() : 0);

        InvoiceUseDetailDto detailDto = new InvoiceUseDetailDto();

        detailDto.setIdDetailInvoice(object[8] != null ? ((BigInteger) object[8]).intValue() : 0);
        detailDto.setPercentage(0);
        detailDto.setIdConcept(object[9] != null ? ((BigInteger) object[9]).intValue() : 0);

        if (itsCollected)
            detailDto.setIdDrec(object[11] != null ? ((BigInteger) object[11]).intValue() : 0);

        dto.setDetails(Collections.singletonList(detailDto));
        invoices.add(dto);
    }

    private List<InvoiceUseDetailDto> getDetails(ConsolidationForm form, int enterpriseId, InvoiceConsolidationDto dto) {
        return this.manejadorFacFactura
                .obtenerDetallesFacturasHijasXNota(dto.getIdInvoice().longValue(),
                        form.getProcessingDeadlineDate(), enterpriseId)
                .stream().map(this::getInvoiceUseDetailDto)
                .collect(Collectors.toList());
    }

    private InvoiceUseDetailDto getInvoiceUseDetailDto(Object[] detail) {
        InvoiceUseDetailDto useDetailDto = new InvoiceUseDetailDto();

        useDetailDto.setIdDetailInvoice(detail[0] != null ? ((BigInteger) detail[0]).intValue() : 0);
        useDetailDto.setPercentage(0);
        useDetailDto.setIdConcept(detail[1] != null ? ((BigInteger) detail[1]).intValue() : 0);
        return useDetailDto;
    }

    private void setInvoiceConsolidationFields(FacFactura facFactura, InvoiceConsolidationDto dto) {
        dto.setIdSettlement(facFactura.getUniLiquidacion());
        dto.setIdPeriod(facFactura.getPerIderegistro());
        dto.setIdInvoice(facFactura.getFacIderegistro().intValue());
        dto.setIdFin(facFactura.getFinIderegistro() != null ? facFactura.getFinIderegistro().intValue() : 0);
        dto.setIdAmo(facFactura.getAmoIderegistro() != null ? facFactura.getAmoIderegistro().intValue() : 0);
        dto.setActualInvoiceValue(facFactura.getFacSdoreal());
        dto.setInvoiceState(facFactura.getFacEstado());
    }

    private Map<InvoiceConsolidationDto, Map<EnumConcepts, Map<Integer, BigDecimal>>> getInterestPercentageUse(
            BigDecimal utilizationPercentage, Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> participationValue) {
        Map<InvoiceConsolidationDto, Map<EnumConcepts, Map<Integer, BigDecimal>>> interestUse = new HashMap<>();

        participationValue.forEach((invoice, interestValue) -> {
            Map<EnumConcepts, Map<Integer, BigDecimal>> interestByConceptUse =
                    calculatePercentageUseByConcepts(utilizationPercentage, invoice, interestValue, null);

            interestUse.put(invoice, interestByConceptUse);
        });
        return interestUse;
    }

    private Map<EnumConcepts, Map<Integer, BigDecimal>> calculatePercentageUseByConcepts(BigDecimal utilizationPercentage,
                                                                                         InvoiceConsolidationDto invoiceDto,
                                                                                         Map<EnumConcepts, BigDecimal> interestValue,
                                                                                         Map<EnumConcepts, Map<Integer, BigDecimal>> percentageConceptUse) {
        Long conceptCC = getConcept(CLASS_CONCEPT_USE_CC);
        Long conceptTA = getConcept(CLASS_CONCEPT_USE_TA);
        Long conceptAdjustTA = getConcept(CLASS_CONCEPT_USE_ADJUST_TA);
        Long conceptAdjustCC = getConcept(CLASS_CONCEPT_USE_ADJUST_CC);
        Map<EnumConcepts, Map<Integer, BigDecimal>> dataByConceptUse = new HashMap<>();

        dataByConceptUse.put(EnumConcepts.ParteTA, calculatedParticipationPercentageByConcept(conceptTA.intValue(),
                invoiceDto.getIdPeriod(), interestValue, utilizationPercentage, EnumConcepts.ParteTA, percentageConceptUse));
        dataByConceptUse.put(EnumConcepts.ParteCC, calculatedParticipationPercentageByConcept(conceptCC.intValue(),
                invoiceDto.getIdPeriod(), interestValue, utilizationPercentage, EnumConcepts.ParteCC, percentageConceptUse));
        dataByConceptUse.put(EnumConcepts.AjusteTA, calculatedParticipationPercentageByConcept(conceptAdjustTA.intValue(),
                invoiceDto.getIdPeriod(), interestValue, utilizationPercentage, EnumConcepts.AjusteTA, percentageConceptUse));
        dataByConceptUse.put(EnumConcepts.AjusteCC, calculatedParticipationPercentageByConcept(conceptAdjustCC.intValue(),
                invoiceDto.getIdPeriod(), interestValue, utilizationPercentage, EnumConcepts.AjusteCC, percentageConceptUse));
        return dataByConceptUse;
    }

    private Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> getCapitalPercentage(
            Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> capitalPercentage) {
        Map<InvoiceConsolidationDto, Map<EnumConcepts, BigDecimal>> participationPercentage = new HashMap<>();

        capitalPercentage.forEach((k, v) -> {
            BigDecimal addInvoice = v.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<EnumConcepts, BigDecimal> conceptPercentage = new HashMap<>();

            v.forEach((keyEnum, value) -> conceptPercentage.put(keyEnum, value.divide(addInvoice, 7, RoundingMode.HALF_DOWN)
                    .multiply(BigDecimal.valueOf(100))));
            participationPercentage.put(k, conceptPercentage);
        });
        return participationPercentage;
    }
    private String setPeriodoFact(String periodo){
        String periodoFacturacion = "";
        //Split charat 0,4
        String year = periodo.substring(0, 4);
        String month = periodo.substring(4, 6);

        if (month.equals("12")) {
            periodoFacturacion = String.valueOf(Integer.parseInt(year) + 1) + "01";
        } else {
            periodoFacturacion = year + String.format("%02d", Integer.parseInt(month) + 1);
        }

        return periodoFacturacion;


    }
    @Override
    public Page<List<ValueChangeDto<ConsolidationReportDto>>> generateConsolidateBilling(ConsolidationReportForm form, Pageable pageable) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        SimpleDateFormat formatter = new SimpleDateFormat(MM_YYYY);
        List<ValueChangeDto<ConsolidationReportDto>> response = new ArrayList<>();
        String idTer = form.getTerIderegistro().stream().map(String::valueOf).collect(Collectors.joining(","));
        List<Map<String, Object>> parameters = manejadorConConsolidacionAprovechamiento.generateConsolidateBilling(idTer, enterpriseId, Integer.parseInt(form.getPeriodoliqFinal()),"A");
        if (parameters.isEmpty()) {
            ValueChangeDto<ConsolidationReportDto> valueChangeDto = new ValueChangeDto();
            valueChangeDto.setObjectChange(new ArrayList<>());

            ConsolidationReportDto dto = new ConsolidationReportDto();
            for (Long id : form.getTerIderegistro()) {


                this.manejadorTerTercero.findById(id.longValue()).ifPresent(tercero -> {
                    valueChangeDto.setUse(tercero.getTerNomcompleto());
                    valueChangeDto.setIdThirdParty(tercero.getTerIderegistro());
                    valueChangeDto.setNit(tercero.getTerDocumento());
                });
                valueChangeDto.setObjectChange(new ArrayList<>());

                valueChangeDto.getObjectChange().add(new ConsolidationReportDto());
                String periodoPrestacion = form.getPeriodoliqFinal();
                String periodoFacturacion = setPeriodoFact(periodoPrestacion);

                valueChangeDto.getObjectChange().get(0).setBenefitPeriodString(periodoPrestacion);
                valueChangeDto.getObjectChange().get(0).setLiquidationPeriodString(periodoFacturacion);
                response.add(valueChangeDto);
            }
        } else {
            for (Map<String, Object> parameter : parameters) {
                ValueChangeDto<ConsolidationReportDto> valueChangeDto = new ValueChangeDto();
                valueChangeDto.setObjectChange(new ArrayList<>());

                valueChangeDto.setUse(String.valueOf(parameter.get("ter_nomcompleto")));
                valueChangeDto.setIdThirdParty(Long.parseLong(String.valueOf(parameter.get("aprovechador"))));
                valueChangeDto.setNit(String.valueOf(parameter.get("documento")));
                ConsolidationReportDto dto = new ConsolidationReportDto();
                dto.setBenefitPeriodString(String.valueOf(parameter.get("periodoPrestacion")));
                dto.setLiquidationPeriodString(String.valueOf(parameter.get("periodofacturacion")));

                dto.setValueCC(optionalsToDouble(parameter.get("valorCC")));
                dto.setPercentageCC(optionalsToDouble(parameter.get("porcentajeCC")));
                dto.setValueTA(optionalsToDouble(parameter.get("valorTA")));
                dto.setPercentageTA(optionalsToDouble(parameter.get("porcentajeTA")));
                dto.setValueTADinc(optionalsToDouble(parameter.get("valorTADinc")));
                dto.setPercentageTADinc(optionalsToDouble(parameter.get("porcentajetadinc")));

                dto.setTotalsStream(dto.getValueCC() + dto.getValueTA() + dto.getValueTADinc());

                dto.setAdjustValueCC(optionalsToDouble(parameter.get("valorAjusteCC")));
                dto.setAdjustPercentageCC(optionalsToDouble(parameter.get("porcentajeAjusteCC")));
                dto.setAdjustValueTA(optionalsToDouble(parameter.get("valorAjusteTA")));
                dto.setAdjustPercentageTA(optionalsToDouble(parameter.get("porcentajeAjusteTA")));
                dto.setAdjustValueTADinc(optionalsToDouble(parameter.get("valorAjusteTADinc")));
                dto.setAdjustPercentageTADinc(optionalsToDouble(parameter.get("porcentajeAjusteTADinc")));

                dto.setTotalsAdjust(dto.getAdjustValueCC() + dto.getAdjustValueTA() + dto.getAdjustValueTADinc());

                dto.setSemesterValueCC(optionalsToDouble(parameter.get("valorSemestreCC")));
                dto.setSemesterPercentageCC(optionalsToDouble(parameter.get("porcentajeSemestreCC")));
                dto.setSemesterValueTA(optionalsToDouble(parameter.get("valorSemestreTA")));
                dto.setSemesterPercentageTA(optionalsToDouble(parameter.get("porcentajeSemestreTA")));
                dto.setSemesterValueTADinc(optionalsToDouble(parameter.get("valorSemestreTADinc")));
                dto.setSemesterPercentageTADinc(optionalsToDouble(parameter.get("porcentajeSemestreTADinc")));

                dto.setTotalsSemester(dto.getSemesterValueCC() + dto.getSemesterValueTA() + dto.getSemesterValueTADinc());

                dto.setTotals(dto.getTotalsStream() + dto.getTotalsAdjust() + dto.getTotalsSemester());

                valueChangeDto.getObjectChange().add(dto);
                response.add(valueChangeDto);
            }

        }


        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), response.size());
        // return list of ValueChangeDto
        List<List<ValueChangeDto<ConsolidationReportDto>>> subList = Collections.singletonList(response.subList(start, end));
        return new PageImpl<>(subList, pageable, response.size());
    }

    @Override
    public Page<List<ValueChangeDto<ConsolidationReportIatDto>>> generateConsolidateUseReportIAT(ConsolidationReportForm form, Pageable pageable) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();

        List<ValueChangeDto<ConsolidationReportIatDto>> response = new ArrayList<>();
        String terIderegistro =form.getTerIderegistro().get(0).toString();
        List<Map<String, Object>> parameters = manejadorConConsolidacionAprovechamiento.generateConsolidateUseReportIAT(terIderegistro, enterpriseId, Integer.parseInt(form.getPeriodoliqFinal()));
        if (parameters.isEmpty()) {
            for (Long id : form.getTerIderegistro()) {
                ValueChangeDto<ConsolidationReportIatDto> valueChangeDto = new ValueChangeDto();

                this.manejadorTerTercero.findById(id.longValue()).ifPresent(tercero -> {
                    valueChangeDto.setUse(tercero.getTerNomcompleto());
                    valueChangeDto.setIdThirdParty(tercero.getTerIderegistro());
                    valueChangeDto.setNit(tercero.getTerDocumento());
                });
                valueChangeDto.setObjectChange(new ArrayList<>());

                valueChangeDto.getObjectChange().add(new ConsolidationReportIatDto());
                response.add(valueChangeDto);
            }
        }else {
            for (Map<String, Object> parameter : parameters) {
                ValueChangeDto<ConsolidationReportIatDto> valueChangeDto = new ValueChangeDto();
                valueChangeDto.setUse(String.valueOf(parameter.get("nombre")));
                valueChangeDto.setIdThirdParty(Long.parseLong(String.valueOf(parameter.get("tercero"))));
                valueChangeDto.setNit(String.valueOf(parameter.get("nit")));
                valueChangeDto.setObjectChange(new ArrayList<>());
                ConsolidationReportIatDto dto = new ConsolidationReportIatDto();
                dto.setLiquidationPeriodString(String.valueOf(parameter.get("periodoliquidacion")));
                dto.setValueCC(optionalsToDouble(parameter.get("facCorriente")));
                dto.setValueDehabit(optionalsToDouble(parameter.get("facDeshabitado")));
                dto.setValueChangeSemester(optionalsToDouble(parameter.get("ajusteCambioSemestre")));

                dto.setTotals(dto.getValueCC() + dto.getValueDehabit() + dto.getValueChangeSemester());
                valueChangeDto.getObjectChange().add(dto);
                response.add(valueChangeDto);
            }
        }


        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), response.size());
        // return list of ValueChangeDto
        List<List<ValueChangeDto<ConsolidationReportIatDto>>> subList = Collections.singletonList(response.subList(start, end));
        return new PageImpl<>(subList, pageable, response.size());
    }

    @Override
    public Page<List<ValueChangeDto<ConsolidationDetailReportIatDto>>> generateDetailReportIAT(ConsolidationReportForm form, Pageable pageable) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<ValueChangeDto<ConsolidationDetailReportIatDto>> response = new ArrayList<>();
        for (Long id : form.getTerIderegistro()) {
            ValueChangeDto<ConsolidationDetailReportIatDto> valueChangeDto = new ValueChangeDto();
            this.manejadorTerTercero.findById(id).ifPresent(tercero -> {
                valueChangeDto.setUse(tercero.getTerNomcompleto());
                valueChangeDto.setIdThirdParty(tercero.getTerIderegistro());
                valueChangeDto.setNit(tercero.getTerDocumento());
            });
            valueChangeDto.setObjectChange(new ArrayList<>());
            List<Map<String, Object>> parameters = manejadorConConsolidacionAprovechamiento.generateDetailReportIAT(id, enterpriseId, Integer.parseInt(form.getPeriodoliqFinal()));
            for (Map<String, Object> parameter : parameters) {
                ConsolidationDetailReportIatDto dto = new ConsolidationDetailReportIatDto();
                dto.setLiquidationPeriodString(String.valueOf(parameter.get("periodoprestacion")));
                dto.setTypeUse(String.valueOf(parameter.get("tipoUso")));
                dto.setStratumOrUse(String.valueOf(parameter.get("estratoUso")));
                dto.setNumberUsers(optionalsToInteger(parameter.get("habitados")));
                dto.setNumberUsersDehabit(optionalsToInteger(parameter.get("deshabitados")));
                dto.setValueIncentiveUse(optionalsToDouble(parameter.get("vlruniiat")));
                dto.setValueIncentiveDehabit(optionalsToDouble(parameter.get("vlrunidesiat")));
                dto.setTons(optionalsToDouble(parameter.get("toneladas")));
                dto.setBilledCurrentIat(optionalsToDouble(parameter.get("facturadoActualIat")));
                dto.setBilledDehabitIat(optionalsToDouble(parameter.get("facturadoDehabitIat")));
                dto.setAdjustmentChangeSemester(optionalsToDouble(parameter.get("ajustes")));
                dto.setTotalBilled( dto.getBilledCurrentIat() + dto.getBilledDehabitIat() + dto.getAdjustmentChangeSemester());
                valueChangeDto.getObjectChange().add(dto);
            }
            response.add(valueChangeDto);
        }
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), response.size());
        // return list of ValueChangeDto
        List<List<ValueChangeDto<ConsolidationDetailReportIatDto>>> subList = Collections.singletonList(response.subList(start, end));
        return new PageImpl<>(subList, pageable, response.size());
    }
    @Override
    public Page<List<ValueChangeDto<DetailValueChangeDto>>> generateConsolidateDetailUseReport(ConsolidationReportForm form, Pageable pageable) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        SimpleDateFormat formatter = new SimpleDateFormat(MM_YYYY);
        List<ValueChangeDto<DetailValueChangeDto>> response = new ArrayList<>();
        String idTer = form.getTerIderegistro().stream().map(String::valueOf).collect(Collectors.joining(","));
        List<Map<String, Object>> parameters = manejadorConConsolidacionAprovechamiento.generateChangeValueReport(enterpriseId, Integer.parseInt(form.getPeriodoliqInicial()), idTer,"A");
        if (parameters.isEmpty()) {
            for (Long id : form.getTerIderegistro()) {
                ValueChangeDto<DetailValueChangeDto> valueChangeDto = new ValueChangeDto<>();
                this.manejadorTerTercero.findById(id).ifPresent(tercero -> {
                    valueChangeDto.setUse(tercero.getTerNomcompleto());
                    valueChangeDto.setIdThirdParty(tercero.getTerIderegistro());
                    valueChangeDto.setNit(tercero.getTerDocumento());
                    valueChangeDto.setObjectChange(new ArrayList<>());
                    valueChangeDto.getObjectChange().add(new DetailValueChangeDto());
                    response.add(valueChangeDto);
                });
            }
        } else {
            for (Map<String, Object> parameter : parameters) {
                ValueChangeDto<DetailValueChangeDto> valueChangeDto = new ValueChangeDto<>();
                DetailValueChangeDto dto = new DetailValueChangeDto();
                dto.setLiquidationPeriod(String.valueOf(parameter.get("periodofacturacion")));
                dto.setValueChange(optionalsToDouble(parameter.get("cambiovlrcte")));
                dto.setValuePaidChange(optionalsToDouble(parameter.get("cambiovlrpagocte")));
                valueChangeDto.setUse(String.valueOf(parameter.get("tercero_nombre")));
                valueChangeDto.setIdThirdParty(Long.parseLong(String.valueOf(parameter.get("tercero"))));
                valueChangeDto.setNit(String.valueOf(parameter.get("documento")));
                valueChangeDto.setObjectChange(new ArrayList<>());
                valueChangeDto.getObjectChange().add(dto);
                response.add(valueChangeDto);
            }
        }


        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), response.size());
        // return list of ValueChangeDto
        List<List<ValueChangeDto<DetailValueChangeDto>>> subList = Collections.singletonList(response.subList(start, end));
        return new PageImpl<>(subList, pageable, response.size());

    }

    public Double optionalsToDouble(Object optional) {
        return Optional.ofNullable(((BigDecimal) optional)).map(BigDecimal::doubleValue).orElse(0.0);
    }
    public BigDecimal optionalsToBigDecimal(Object optional) {
        return Optional.ofNullable(((BigDecimal) optional)).orElse(BigDecimal.ZERO);
    }
    public Boolean optionalsToBoolean(Object optional) {
        return Optional.ofNullable(((Boolean) optional)).orElse(false);
    }
    public Integer optionalsToInteger(Object optional) {
        return Optional.ofNullable(((BigDecimal) optional)).map(BigDecimal::intValue).orElse(0);
    }
    public Long optionalsToLong(Object optional) {
        return Optional.ofNullable(((BigDecimal) optional)).map(BigDecimal::longValue).orElse(0L);
    }
    public String optionalsToString(Object optional) {
        return Optional.ofNullable(String.valueOf(optional)).orElse("");
    }

    @Override
    public Page<ThirdPartyCollectionDto> generateCollectionUseAndIncentiveReport(CollectionReportForm form, Pageable pageable) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<ThirdPartyCollectionDto> response = new ArrayList<>();
        String idTer = form.getTerId().stream().map(String::valueOf).collect(Collectors.joining(","));
        String perPrestacion = form.getPeriodos().get(0).getPerPrestacion().toString();
        String perFacturacion = form.getPeriodos().get(0).getPerFacturacion().toString();
        List<Map<String, Object>> terceroAprovechamiento =
                this.manejadorConConsolidacionAprovechamiento.generateAproRec(
                        idTer,
                        enterpriseId,
                        Integer.parseInt(form.getPeriod()),
                        perPrestacion,
                        perFacturacion
                );
        if (terceroAprovechamiento.isEmpty()) {
            ThirdPartyCollectionDto dto = new ThirdPartyCollectionDto();
            this.manejadorTerTercero.findById(form.getTerId().get(0)).ifPresent(tercero -> {
                dto.setNit(tercero.getTerDocumento());
                dto.setUse(tercero.getTerNomcompleto());
                dto.setIdThirdParty(tercero.getTerIderegistro());
            });
            response.add(dto);
        } else {
            for (Map<String, Object> use : terceroAprovechamiento) {
                ThirdPartyCollectionDto dto = new ThirdPartyCollectionDto();
                dto.setNit(optionalsToString(use.get("nit")));
                dto.setUse(optionalsToString(use.get("ter_nombre")));
                dto.setAccount(optionalsToString(use.get("cuenta")));
                dto.setStateSeven(optionalsToString(use.get("estadoSeven") != null ? (use.get("estadoSeven").equals("A") ? "Liquidado" : "" ): ""));
                dto.setExportSeven(optionalsToBoolean(use.get("exportadoSeven")) ? 1 : 0);
                dto.setIdThirdParty(optionalsToLong(use.get("tercero")));
                dto.setPaidLetter(Optional.ofNullable(use.get("oficio"))
                        .map(Object::toString)
                        .map(Integer::parseInt)
                        .orElse(0));
                dto.setValuePaid(optionalsToBigDecimal(use.get("valor")));
                dto.setIdConsolidation(BigInteger.valueOf(optionalsToInteger(use.get("idConsolidation"))));
                response.add(dto);
            }
        }
        //for distinct oficio != null
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), response.size());
        return new PageImpl<>(response.subList(start, end), pageable, response.size());
    }

    private BigDecimal getFullBalanceNotes(BigDecimal balanceNote, long id) {
        List<Long> conceptPositiveBalanceNote;
        List<Long> conceptCreditNote;
        List<Long> conceptDebitNote;

        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametrosAprovechamiento();
            conceptPositiveBalanceNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_CREDITO_SALDO_FAVOR);
            conceptCreditNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_CREDITO);
            conceptDebitNote = (List<Long>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_NOTA_DEBITO);
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        balanceNote = balanceNote.add(getNoteValue(conceptPositiveBalanceNote, id));
        balanceNote = balanceNote.add(getNoteValue(conceptCreditNote, id));
        balanceNote = balanceNote.add(getNoteValue(conceptDebitNote, id));
        return balanceNote;
    }

    private void setTercero(ThirdPartyCollectionDto dto, Optional<TerTercero> tercero) {
        if (tercero.isPresent()) {
            dto.setNit(tercero.get().getTerDocumento() + "-"
                    + (tercero.get().getTerDigverificacion() != null ? tercero.get().getTerDigverificacion() : 0));
            dto.setUse(tercero.get().getTerNomcompleto());
        } else {
            dto.setNit("");
            dto.setUse("");
        }
    }

    private void setSevenAndPayment(ThirdPartyCollectionDto dto, ConConsolidacionAprovechamiento entity) {
        dto.setExportSeven(entity.getExportarSeven() != null ? entity.getExportarSeven() : 0);
        dto.setPaidLetter(entity.getOficioPago() != null ? entity.getOficioPago() : 0);
    }

    private BigDecimal getNoteValue(List<Long> noteConcepts, long id) {
        BigDecimal noteValue = BigDecimal.ZERO;

        if (noteConcepts != null) {
            for (Long ns : noteConcepts) {
                noteValue = noteValue.add(calculatePercentageByCapital(BigDecimal.ONE, ns.intValue(), id));
            }
        }

        return noteValue;
    }

    @Override
    public List<DetailCollectionUserThirdPartyDto> generateCollectionDetailUseReportByPeriods(CollectionReportDetailForm detail) {
        List<DetailCollectionUserThirdPartyDto> detailList = new ArrayList<>();
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        for (PeriodoFacturacionPrestacionForm form : detail.getPeriodos()){

            //Parse to Date
            //List<AprrecRecaudo> entityList = this.manejadorAprrecRecaudo
            //.getByTerIderegistroAndPerIderegistroAndPerPrestacionAndPerFacturacion(detail.getTerId(),Long.parseLong(form.getIdPeriodo().toString()), form.getPerPrestacion(), form.getPerFacturacion());

            List<Map<String, Object>> entityList =
                    this.manejadorAprrecRecaudo.getReporteRecaudoConcAprovechador(detail.getTerId().toString(),form.getPerPrestacion().toString(), form.getPerFacturacion().toString(),  JwtUtil.auditoriaDTO.getIdEmpresa(),"A",Integer.parseInt(detail.getPeriod()));
            entityList.forEach(entity -> {
                        DetailCollectionUserThirdPartyDto detailDto = new DetailCollectionUserThirdPartyDto();
                        detailDto.setThirdPartyId(String.valueOf(optionalsToString(entity.get("ter_ideregistro"))));
                        detailDto.setThirdPartyName(optionalsToString(entity.get("ter_nomcompleto")));
                        detailDto.setBenefitPeriod(entity.get("per_prestacion") != null ? entity.get("per_prestacion").toString() : optionalsToString(entity.get("per_prestacion_nom")));
                        detailDto.setLiquidationPeriod(entity.get("per_facturacion") != null ? entity.get("per_facturacion").toString() : optionalsToString(entity.get("per_facturacion_nom")));
                        detailDto.setPaidCC(optionalsToBigDecimal(entity.get("saldo_fact_cc")));
                        detailDto.setPaidTA(optionalsToBigDecimal(entity.get("saldo_fact_ta")));
                        detailDto.setValueChangeTA(optionalsToBigDecimal(entity.get("cambios_vlr_ta")));
                        detailDto.setValuesChangePaid(optionalsToBigDecimal(entity.get("cambios_vlr_pagados")));
                        detailDto.setAdjustPaidCC(optionalsToBigDecimal(entity.get("pago_aju_cc")));
                        detailDto.setAdjustPaidTA(optionalsToBigDecimal(entity.get("pago_aju_ta")));
                        detailDto.setDinc(BigDecimal.valueOf(0));
                        detailDto.setValueCollectedFinanced(optionalsToBigDecimal(entity.get("vlr_rec_fin")));
                        detailDto.setInterestValue(optionalsToBigDecimal(entity.get("int_mora_cte")));
                        //java.math.BigDecimal cannot be cast to java.lang.Integer

                        detailDto.setTotalPaid(detailDto.getPaidCC()
                                .add(detailDto.getPaidTA())
                                .subtract(detailDto.getValuesChangePaid())
                                .add(detailDto.getValueCollectedFinanced())
                                .add(detailDto.getInterestValue()));

                        detailList.add(detailDto);

                    }

            );
        }
        return detailList.subList(0,1 );


    }

    @Override
    public List<DetailCollectionUserThirdPartyDto> generateCollectionDetailUseReport(@Valid @RequestBody CollectionReportDetailForm reportDetail) {
        List<DetailCollectionUserThirdPartyDto> responseList = new ArrayList<>();

        reportDetail.getPeriodos().forEach(periodo -> {
            this.manejadorAprrecRecaudo.getReporteRecaudoConcAprovechador(
                reportDetail.getTerId().toString(),
                periodo.getPerPrestacion().toString(),
                periodo.getPerFacturacion().toString(),
                JwtUtil.auditoriaDTO.getIdEmpresa(),
                "A",
                Integer.parseInt(reportDetail.getPeriod())).forEach(detail -> {
                    TerTercero terTercero = this.manejadorTerTercero.consultaTerceroInfo(reportDetail.getTerId());

                    DetailCollectionUserThirdPartyDto dto = new DetailCollectionUserThirdPartyDto();

                    //si responseList no tiene datos, se le asignan los valores de la primera iteración
                    if (responseList.isEmpty()) {
                        dto.setThirdPartyName(terTercero.getTerNombre());
                        dto.setBenefitPeriod(optionalsToString(detail.get("per_prestacion_nom")));
                        dto.setLiquidationPeriod(optionalsToString(detail.get("per_facturacion_nom")));
                        dto.setPaidCC(optionalsToBigDecimal(detail.get("saldo_fact_cc")));
                        dto.setPaidTA(optionalsToBigDecimal(detail.get("saldo_fact_ta")));

                        dto.setValueChangeTA(optionalsToBigDecimal(detail.get("cambios_vlr_ta")));
                        dto.setValuesChangePaid(optionalsToBigDecimal(detail.get("cambios_vlr_pagados")));

                        dto.setAdjustPaidCC(optionalsToBigDecimal(detail.get("pago_aju_cc")));
                        dto.setAdjustPaidTA(optionalsToBigDecimal(detail.get("pago_aju_ta")));
                        dto.setDinc(BigDecimal.valueOf(0));

                        dto.setValueCollectedFinanced(optionalsToBigDecimal(detail.get("vlr_rec_fin")));

                        dto.setInterestValue(optionalsToBigDecimal(detail.get("int_mora_cte")));

                        dto.setTotalPaid(dto.getPaidCC().add(dto.getPaidTA()).subtract(dto.getValuesChangePaid())
                                .add(dto.getAdjustPaidCC()).add(dto.getAdjustPaidTA()));
                        responseList.add(dto);

                    } else {
                        if (!detail.get("per_prestacion_nom").toString().contains("TOTAL")) {
                            responseList.get(0).setPaidCC(responseList.get(0).getPaidCC().add(optionalsToBigDecimal(detail.get("saldo_fact_cc"))));
                            responseList.get(0).setPaidTA(responseList.get(0).getPaidTA().add(optionalsToBigDecimal(detail.get("saldo_fact_ta"))));
                            responseList.get(0).setValueChangeTA(responseList.get(0).getValueChangeTA().add(optionalsToBigDecimal(detail.get("cambios_vlr_ta"))));
                            responseList.get(0).setValuesChangePaid(responseList.get(0).getValuesChangePaid().add(optionalsToBigDecimal(detail.get("cambios_vlr_pagados"))));
                            responseList.get(0).setAdjustPaidCC(responseList.get(0).getAdjustPaidCC().add(optionalsToBigDecimal(detail.get("pago_aju_cc"))));
                            responseList.get(0).setAdjustPaidTA(responseList.get(0).getAdjustPaidTA().add(optionalsToBigDecimal(detail.get("pago_aju_ta"))));
                            responseList.get(0).setDinc(responseList.get(0).getDinc().add(BigDecimal.valueOf(0)));
                            responseList.get(0).setValueCollectedFinanced(responseList.get(0).getValueCollectedFinanced().add(optionalsToBigDecimal(detail.get("vlr_rec_fin"))));
                            responseList.get(0).setInterestValue(responseList.get(0).getInterestValue().add(optionalsToBigDecimal(detail.get("int_mora_cte"))));
                            responseList.get(0).setTotalPaid(responseList.get(0).getTotalPaid().add(responseList.get(0).getPaidCC().add(responseList.get(0).getPaidTA()).subtract(responseList.get(0).getValuesChangePaid())
                                    .add(responseList.get(0).getAdjustPaidCC()).add(responseList.get(0).getAdjustPaidTA())));
                        }

                    }
                });

        });


        return responseList;
    }



    @Override
    public LetterDto generateLetterUseByIdTercero( Map<String,Object> parameters) {
        /*final String uri = "http://10.43.51.30:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/json/";
        Integer enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer userId = JwtUtil.auditoriaDTO.getIdUsuario();
        String pass = this.manejadorUsuarios.getUsuarioPass(userId);
        Gson gson = new Gson();
        BigDecimal finalTotal = new BigDecimal(BigInteger.ZERO);
        String month = monthFormat.format(new Date());
        String monthBefore = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().plusMonths(-1)
                .format(DateTimeFormatter.ofPattern("MMMM", new Locale("es", "ES")));
        String year = yearFormat.format(new Date());
        Map<String, Object> parameters;

        try {
            Map<String, Object> mapParameters = this.negocioParParametro.consultaParametrosAprovechamiento();
            parameters = (Map<String, Object>) mapParameters.get(ConstantesServicios.PARAMETERS);
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        JasperParametersDto jasperParameters = new JasperParametersDto();
        JasperResponseDto jasperResponse = new JasperResponseDto();
        StringBuilder nitList = new StringBuilder();
        StringBuilder associationList = new StringBuilder();
        StringBuilder valueList = new StringBuilder();
        StringBuilder accountList = new StringBuilder();
        String minutes = "Pendiente HU132";

        finalTotal = BigDecimal.valueOf(1000000.00);

        jasperResponse.setJndi(JNDI);
        jasperResponse.setFormat(PDF);
        jasperResponse.setReportName(PARAMETER_PATH + REPORT_NAME);
        jasperParameters.setLogo(PARAMETER_PATH + LOGO_JPG);
        jasperParameters.setMinutes(minutes);
        jasperParameters.setMunicipality("MUNICIPIO AHHH");
        jasperParameters.setDate(dateFormat.format(new Date()).replace(",", "de"));
        jasperParameters.setPerson("LINDA CRISTAL");
        jasperParameters.setJob("CARGO");
        jasperParameters.setExecutive("DIRECTIVO");
        jasperParameters.setSubject("ASUNTO");
        jasperParameters.setTotal("$" + df.format(finalTotal.doubleValue()));

        String valueString = convertNumberToString(jasperParameters.getTotal() != null ?
                jasperParameters.getTotal().replace(".0000000", "") : "0", true);

        jasperParameters.setText("<p>Por medio del presente me permito solicitar su colaboraci&oacute;n, " +
                "a fin de realizar proceso de pago de las siguientes empresas por actividad de aprovechamiento. <br><br>" +
                "Segun Acta N&ordm; " + minutes + " generada en el comite de conciliaci&oacute;n el valor del recaudo " +
                "de la facturaci&oacute;n del monthString de " + month.toUpperCase(Locale.ROOT) +
                " del a&ntilde;o " + year + " es de " + "$" + df.format(finalTotal.doubleValue()) +
                " y los valores recaudados de cartera correspondientes" +
                " de abril de 2017 a " + monthBefore.toUpperCase(Locale.ROOT) + " del a&ntilde;o " + year +
                " son por valor de " + "$" + df.format(finalTotal.doubleValue()) + ", para un total general de pagos por valor de " +
                valueString + " M/Cte, los cuales se detallan a continuaci&oacute;n: <p>");
        jasperParameters.setSign(PARAMETER_PATH + LOGO_JPG);
        jasperParameters.setStrImagePath(PARAMETER_PATH);
        jasperParameters.setStrRootPath(PARAMETER_PATH);
        jasperParameters.setListNit(nitList.toString().isEmpty() ? "" : nitList.substring(0, nitList.toString().length() - 1));
        jasperParameters.setListAssociation(associationList.toString().isEmpty() ? "" : associationList.substring(0, associationList.toString().length() - 1));
        jasperParameters.setListValuePaid(valueList.toString().isEmpty() ? "" : valueList.substring(0, valueList.toString().length() - 1));
        jasperParameters.setListAccount(accountList.toString().isEmpty() ? "" : accountList.substring(0, accountList.toString().length() - 1));
        jasperParameters.setUseSwap(false);
        jasperResponse.setParameters(jasperParameters);
        jasperResponse.setUser(userId.toString());

        try {
            jasperResponse.setPassword(asHex(pass.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
*/   Gson gson = new Gson();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));
        HttpEntity<String> request = new HttpEntity<>(gson.toJson(parameters), headers);
        ResponseEntity<byte[]> responseEntity = restTemplate.postForEntity("http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes", request, byte[].class);
        LetterDto letterDto = new LetterDto();

        letterDto.setBase64(Base64.getEncoder().encodeToString(responseEntity.getBody()));
        return letterDto;
    }

    private BigDecimal getFinalTotal(List<Long> idList, BigDecimal finalTotal, StringBuilder nitList,
                                     StringBuilder associationList, StringBuilder valueList, StringBuilder accountList) {
        for (Long id : idList) {
            if (this.manejadorRepctRepconsolida.ifGenerateDocument(id) != null) {
                RepctRepconsolidarecaudoaprov entity = this.manejadorRepctRepconsolida.getRepctRepconsolidarecaudoaprov(id).orElse(null);

                if (entity != null) {
                    ConConsolidacionAprovechamiento use = this.manejadorConConsolidacionAprovechamiento.findById(entity.getConIdeconsolidacion()).orElse(null);
                    finalTotal = finalTotal.add(use != null ? use.getValorCalculado() : BigDecimal.ZERO);

                    List<RepctRepconsolidarecaudoaprov> entityList = this.manejadorRepctRepconsolida.getAllByTerIdeRegistro(idList);

                    entityList.forEach(row -> {
                        nitList.append(row.getNit().concat(":"));
                        associationList.append(row.getAprovechador().concat(":"));
                        valueList.append("$").append(df.format(row.getValorPago().doubleValue()).concat(":"));
                        accountList.append(row.getCuentaBancaria().concat(":"));
                        row.setOficioPago(1);
                        this.manejadorRepctRepconsolida.save(row);
                    });

                    if (use != null) {
                        use.setOficioPago(1);
                        use.setExportarSeven(1); // TODO preguntar si es al mismo tiempo que la creación del pago o si es otro proceso
                        this.manejadorConConsolidacionAprovechamiento.save(use);
                    }
                }
            }
        }

        return finalTotal;
    }

    @Override
    public Page<ThirdCollectionCrossingDto> generateCrossCollectionMeasured(Integer measured, CollectionReportDetailForm detail, Integer incentive, Pageable pageable) {
        List<ThirdCollectionCrossingDto> dtoList = new ArrayList<>();

        for (PeriodoFacturacionPrestacionForm form : detail.getPeriodos()) {
            List<ConConsolidacionAprovechamiento> list = this.manejadorAprconcConciliacion
                    .getCruceReucaudoByAforado(Long.valueOf(form.getIdPeriodo()), form.getPerPrestacion(), form.getPerFacturacion());

            for (ConConsolidacionAprovechamiento row : list) {
                ThirdCollectionCrossingDto dto = new ThirdCollectionCrossingDto();
                FacFactura invoice = this.manejadorFacFactura.findById(row.getFacIderegistro().longValue()).orElse(null);
                DrecDetrecaudo collection = this.manejadorDrecDetrecaudo.findById(row.getDrecIderegistro().longValue()).orElse(null);
                LocalDate initialDate = row.getPerFecinicial().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate collectionDate = collection != null ? collection.getDrecFecha().toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : LocalDate.now();

                if (invoice != null)
                    this.manejadorTidoTipdocumen.findById(invoice.getUniTipdocument())
                            .ifPresent(documentType -> {
                                dto.setDocument(documentType.getTidoNitcontabil());
                                dto.setDocumentType(documentType.getTidoNombre());
                            });

                dto.setIdInvoice(this.manejadorFacFactura.getNumeroFactura(row.getFacIderegistro().longValue()).orElse(BigInteger.ZERO));
                dto.setCodSubscription(this.manejadorDsusDetsuscrip.getDsusPcodigo(row.getUsuIderegistro().longValue()).orElse(BigInteger.ZERO));
                dto.setBenefitPeriod(initialDate.plusMonths(-1).format(DateTimeFormatter.ofPattern(MM_YYYY)));
                dto.setLiquidationPeriod(initialDate.format(DateTimeFormatter.ofPattern(MM_YYYY)));
                dto.setConcept(row.getConcepto());
                dto.setValuePaid(row.getValorCalculado());
                dto.setPeriodCollected(collectionDate.format(DateTimeFormatter.ofPattern(MM_YYYY)));
                dto.setTara(getTare(row));
                dtoList.add(dto);
            }
        }

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), dtoList.size());

        return new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
    }

    private BigDecimal getTare(ConConsolidacionAprovechamiento row) {
        BigDecimal tareValue = BigDecimal.ZERO;

        List<Integer> tareConcept;

        try {
            Map<String, Object> parameters = this.negocioParParametro.consultaParametrosAprovechamiento();
            tareConcept = (List<Integer>) parameters.get(ConstantesServicios.UNI_CONCEPTO_TAFA);
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        for (Integer idConcept : tareConcept) {
            if (idConcept != null)
                tareValue = tareValue.add(this.manejadorDfacDetfactura.getDfacVlrtotal(row.getFacIderegistro().longValue(), idConcept).orElse(BigDecimal.ZERO));
        }

        return tareValue;
    }

    @Override
    public List<NotesChangeValueDto> generateNotesByIdTerceroAndMonthReport(CollectionReportDetailForm detailUse) {
        List<NotesChangeValueDto> dtoList = new ArrayList<>();
        //    @Query(value = "select * from aseo.fn_gen_reporte_notas_aprovechador_iat(:perFacturacion, :idempresa, :maprcideregistr, :tercero, :estado) f", nativeQuery = true)
        List<Map<String,Object>> entityList = this.manejadorAprrecRecaudo.getReporteNotasRecaudoIat(detailUse.getPeriodos().get(0).getPerFacturacion(), JwtUtil.auditoriaDTO.getIdEmpresa(),Integer.parseInt(detailUse.getPeriod()), detailUse.getTerId().toString(), "A");
        //fecha,idnota,periodoliquidacion,documento,tipodocumento,concepto,cambiovlrta,cambiovlrpagado,periodorecaudo

        for (Map<String, Object> entity : entityList) {
            NotesChangeValueDto notesChangeValueDto = new NotesChangeValueDto();
            notesChangeValueDto.setDateRegisterNote(Optional.ofNullable((String) entity.get("fecha")).orElse(""));
            notesChangeValueDto.setIdNote(Optional.ofNullable((BigDecimal) entity.get("idnota")).orElse(BigDecimal.ZERO));
            notesChangeValueDto.setValueChangeTA(Optional.ofNullable((BigDecimal) entity.get("cambiovlrta")).orElse(BigDecimal.ZERO));
            notesChangeValueDto.setChangeValuePaid(Optional.ofNullable((BigDecimal) entity.get("cambiovlrpagado")).orElse(BigDecimal.ZERO));
            notesChangeValueDto.setLiquidationPeriod(Optional.ofNullable((String) entity.get("periodoliquidacion")).orElse(""));
            notesChangeValueDto.setDocument(Optional.ofNullable((String) entity.get("documento")).orElse(""));
            notesChangeValueDto.setDocumentType(Optional.ofNullable((String) entity.get("tipodocumento")).orElse(""));
            notesChangeValueDto.setConcept(Optional.ofNullable((String) entity.get("concepto")).orElse(""));
            notesChangeValueDto.setCollectedPeriod(Optional.ofNullable((String) entity.get("periodorecaudo")).orElse(""));
            dtoList.add(notesChangeValueDto);
        }

        return dtoList;

    }

    @Override
    public Page<CollectionDetailTownHallTotalDto> generateCollectionDetailTownHallReport(CollectionDetailUse detailUse, Pageable pageable) throws Exception {
        List<CollectionDetailTownHallTotalDto> dtoList = new ArrayList<>();

        detailUse.getSettlementPeriod()
                .forEach(periods -> {
                    List<Map<String, Object>> parameters = this.manejadorAprrecRecaudo.getReporteRecaudoDetailAprovechador(detailUse.getIdThirdParty(),JwtUtil.auditoriaDTO.getIdEmpresa(),detailUse.getIdPeriod(),periods.getInicio(), "A");
                    for (Map<String, Object> entity : parameters) {
                        DetRecaudoAlcaldiaIat row = new DetRecaudoAlcaldiaIat();
                        CollectionDetailTownHallTotalDto dto = new CollectionDetailTownHallTotalDto();
                        row.setSaldoAnteriorIAT(optionalsToBigDecimal(entity.get("saldoanterior")));
                        row.setCambioVlrIAT(optionalsToBigDecimal(entity.get("cambioVlrIat")));
                        row.setCambioVlrPagado(optionalsToBigDecimal(entity.get("cambioVlrPago")));
                        row.setValorRecaudoFinanciado(optionalsToBigDecimal(entity.get("vlrrecfinanciadoiat")));
                        row.setPagoIAT(optionalsToBigDecimal(entity.get("pagoiat")));
                        row.setPagoAjusteIAT(optionalsToBigDecimal(entity.get("pagoiatajuste")));
                        row.setPagoInteresMoraCorriente(optionalsToBigDecimal(entity.get("intereses_iat")));
                        row.setPagoTotal(optionalsToBigDecimal(entity.get("pagototal")));
                        row.setSaldoFinalPendiente(optionalsToBigDecimal(entity.get("saldopendienteiat")));

                        dto.setLiquidationPeriod(optionalsToString(entity.get("per_facturacion")));
                        dto.setBenefitPeriod(optionalsToString(entity.get("per_prestacion")));

                        Map<String, BigDecimal> totals = getStringBigDecimalMap(row);
                        dto.setTotals(totals);
                        dtoList.add(dto);
                    }
                });
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), dtoList.size());

        return new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
    }

    private static Map<String, BigDecimal> getStringBigDecimalMap(DetRecaudoAlcaldiaIat row) {
        Map<String, BigDecimal> totals = new HashMap<>();
        totals.put("totalSaldoAnterior", row.getSaldoAnteriorIAT() != null ? row.getSaldoAnteriorIAT() : BigDecimal.ZERO);
        totals.put("totalCambioVlr", row.getCambioVlrIAT());
        totals.put("totalCambioVlrPagado", row.getCambioVlrPagado());
        totals.put("totalValorRecaudo", row.getValorRecaudoFinanciado());
        totals.put("totalPagoIAT", row.getPagoIAT());
        totals.put("totalPagoAjuste", row.getPagoAjusteIAT());
        totals.put("totalPagoInteres", row.getPagoInteresMoraCorriente());
        totals.put("totalPagoTotal", row.getPagoTotal());
        totals.put("totalSaldoFinal", row.getSaldoFinalPendiente());
        return totals;
    }


    private DetRecaudoAlcaldiaIat getCollectionDetailTownHallEntity(Date initialDate, Date endDate, Long id) {
        Integer enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer userId = JwtUtil.auditoriaDTO.getIdUsuario();
        LocalDate beforeLocalDate = convertToLocalDateViaMillisecond(endDate);
        Date beforeInitialDate = Date.from(beforeLocalDate.withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date beforeEndDate = Date.from(beforeLocalDate.withDayOfMonth(beforeLocalDate.lengthOfMonth()).atStartOfDay(ZoneId.systemDefault()).toInstant());
        DetRecaudoAlcaldiaIat entity = new DetRecaudoAlcaldiaIat();

        entity.setSaldoFinalPendiente(BigDecimal.ZERO);
        this.manejadorDrecRecaudoAlcaldia.obtenerDetalleRecaudoPeriodoAnterior(id.intValue(), beforeInitialDate, beforeEndDate)
                .ifPresent(row -> entity.setSaldoAnteriorIAT(row.getSaldoFinalPendiente()));

        BigDecimal changeValue = BigDecimal.ZERO;
        BigDecimal changePaidValue = BigDecimal.ZERO;
        BigDecimal collectionValue = BigDecimal.ZERO;
        BigDecimal paidIAT = BigDecimal.ZERO;
        BigDecimal paidAdjust = BigDecimal.ZERO;
        BigDecimal paidInterest = BigDecimal.ZERO;
        BigDecimal paidTotal = BigDecimal.ZERO;
        BigDecimal balanceFinal = BigDecimal.ZERO;
        List<ConConsolidacionAprovechamiento> entities = this.manejadorConConsolidacionAprovechamiento.
                obtenerListadoConsolidacionPorTerceroAndPeriodo(initialDate, endDate, endDate, id, 1L);

        for (ConConsolidacionAprovechamiento row : entities) {
            entity.setFechaCorte(row.getFechaCorte());
            entity.setPerFecinicial(row.getPerFecinicial());

            if (row.getTipoConcepto().equals("NC") || row.getTipoConcepto().equals("ND"))
                changeValue = changeValue.add(row.getValorCalculado());

            changePaidValue = getChangePaidValue(changePaidValue, row);

            if (row.getFinanciacion() == 1) {
                collectionValue = collectionValue.add(row.getValorCalculado());
            } else {
                paidIAT = paidIAT.add(row.getValorCalculado());
            }

            if (!row.getTipoConcepto().equals("NC") || !row.getTipoConcepto().equals("ND") || !row.getTipoConcepto().equals("NS"))
                paidAdjust = paidAdjust.add(row.getValorCalculado());

            if (row.getTipoConcepto().equals("IM") || row.getTipoConcepto().equals("IC"))  //TODO preguntar si es correcto los conceptos
                paidInterest = paidInterest.add(row.getValorCalculado());

            paidTotal = paidTotal.add(collectionValue).add(paidIAT).add(paidAdjust)
                    .add(paidInterest).subtract(changePaidValue);
            BigDecimal previousBalanceIAT = entity.getSaldoAnteriorIAT() != null ? entity.getSaldoAnteriorIAT() : BigDecimal.ZERO;
            balanceFinal = balanceFinal.add(previousBalanceIAT).add(changeValue).subtract(changePaidValue)
                    .subtract(collectionValue).subtract(paidIAT)
                    .subtract(paidAdjust).subtract(paidInterest);
        }

        entity.setCambioVlrIAT(changeValue);
        entity.setCambioVlrPagado(changePaidValue);
        entity.setValorRecaudoFinanciado(collectionValue);
        entity.setPagoIAT(paidIAT);
        entity.setPagoAjusteIAT(paidAdjust);
        entity.setPagoInteresMoraCorriente(paidInterest);
        entity.setPagoTotal(paidTotal);
        entity.setSaldoFinalPendiente(balanceFinal);
        entity.setTerIderegistro(id);
        entity.setEmpIderegistro(enterpriseId);
        entity.setUsuIderegistro(userId);
        return entity;
    }

    private BigDecimal getChangePaidValue(BigDecimal changePaidValue, ConConsolidacionAprovechamiento row) {
        if (row.getTipoConcepto().equals("NS"))
            changePaidValue = changePaidValue.add(row.getValorCalculado());

        return changePaidValue;
    }

    private CollectionTownHallReportDto getCollectionTownHallReportDto(ConConsolidacionAprovechamiento row, LocalDate beforePeriod, LocalDate date) {
        CollectionTownHallReportDto dto = new CollectionTownHallReportDto();

        dto.setIdInvoice(row.getFacIderegistro().longValue());
        dto.setSubscriptionCode(row.getUsuIderegistro());
        dto.setBenefitPeriod(beforePeriod.format(DateTimeFormatter.ofPattern(MM_YYYY)));
        dto.setLiquidationPeriod(date.format(DateTimeFormatter.ofPattern(MM_YYYY)));

        FacFactura invoice = this.manejadorFacFactura.findById(row.getFacIderegistro().longValue()).orElse(null);

        if (invoice != null && invoice.getUniTipdocument() != null)
            this.manejadorTidoTipdocumen.findById(invoice.getUniTipdocument())
                    .ifPresent(documentType -> {
                        dto.setDocument(documentType.getTidoNitcontabil());
                        dto.setDocumentType(documentType.getTidoNombre());
                    });

        dto.setConcept(row.getConcepto());
        dto.setValuePaid(row.getValorCalculado());

        DrecDetrecaudo entity = this.manejadorDrecDetrecaudo.findById(row.getDrecIderegistro().longValue()).orElse(null);
        LocalDate collectionDate = entity != null ? entity.getDrecFecha().toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : LocalDate.now();

        dto.setCollectionPeriod(collectionDate.format(DateTimeFormatter.ofPattern(MM_YYYY)));
        return dto;
    }

    @Override
    public Page<CollectionTownHallReportDto> generateCollectionDetailTownHallReportByMonth(CollectionDetailTownHall detail, Pageable pageable) throws Exception {
        List<CollectionTownHallReportDto> dtoList = new ArrayList<>();

        List<Map<String, Object>> parameters = this.manejadorAprrecRecaudo.getReporteCruceRecaudoIat(JwtUtil.auditoriaDTO.getIdEmpresa(), Integer.parseInt(detail.getPeriodFact()));
        if (parameters.isEmpty()){
            CollectionTownHallReportDto dto = new CollectionTownHallReportDto();
            dtoList.add(dto);
        }else {
            for (Map<String, Object> entity : parameters) {
                CollectionTownHallReportDto dto = new CollectionTownHallReportDto();
                dto.setIdInvoice(Long.parseLong(entity.get("idFactura").toString()));
                dto.setSubscriptionCode((int) Long.parseLong(entity.get("codSuscripcion").toString()));
                dto.setBenefitPeriod(entity.get("periodoPrestacion").toString());
                dto.setLiquidationPeriod(entity.get("periodoLiquidacion").toString());

                dto.setDocument(entity.get("documento").toString());
                dto.setDocumentType(entity.get("tipoDocumento").toString());

                dto.setConcept(entity.get("concepto").toString());
                dto.setValuePaid(new BigDecimal(entity.get("valorPagado").toString()));
                dto.setCollectionPeriod(entity.get("fecha").toString());
                dtoList.add(dto);

            }
        }

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), dtoList.size());

        return new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
    }



    @Override
    public Page<InvoiceWrittenOffDto> generatePunishedInvoicesByMonthReport(CollectionDetailUse detailUse, Pageable pageable) {
        List<InvoiceWrittenOffDto> dtoList = new ArrayList<>();
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();

        for (SettlementPeriodForm form : detailUse.getSettlementPeriod()) {
            List<Map<String,Object>> entities = this.manejadorAprconcConciliacion
                    .getAllByPunishedInvoicesAndPeriod(Integer.parseInt(form.getFin()), enterpriseId);
            for (Map<String,Object> entity : entities) {
                InvoiceWrittenOffDto dto = new InvoiceWrittenOffDto();
                dto.setIdNote(null);
                dto.setIdParentInvoice(optionalsToLong(entity.get("fac_idepadre")));
                dto.setConcept(entity.get("uni_concepto").toString());
                dto.setDocument(entity.get("uni_documento").toString());
                dto.setDocumentType(entity.get("doc_tipo").toString());
                dto.setSettlementPeriod(form.getInicio());
                dto.setPunishedValue(optionalsToBigDecimal(entity.get("dfac_sdoreal")));
                dto.setPunishedPeriod(entity.get("per_facturacion").toString());
                dto.setParentDocInvoice(entity.get("fac_ideorigen").toString());
                dto.setParentDocTypeInvoice(entity.get("fac_ideregistro").toString());

                dtoList.add(dto);
            }

        }

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), dtoList.size());

        return new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
    }

    private String getPunishedPeriod(FacFactura invoice) {
        LocalDate date = invoice.getFacFeccastigad() != null ? invoice.getFacFeccastigad().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate() : LocalDate.now();

        return date.format(DateTimeFormatter.ofPattern(MM_YYYY));
    }

    private Long getIdParent(FacFactura invoice) {
        if (invoice == null)
            return 0L;

        if (invoice.getFacIdepadre() != null)
            return invoice.getFacIdepadre();

        if (invoice.getFacIdeorigen() != null)
            return invoice.getFacIdepadre();

        return 0L;
    }

    @Override
    public Page<SearchCriteriaReportDto> generateSearchCriteriaReport(SearchCriteriaReportForm form,
                                                                      Long incentive,
                                                                      Pageable pageable) throws Exception {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<SearchCriteriaReportDto> searchCriteriaReports = new ArrayList<>();

               //obtenemos los datos a organizar
        final List<ConConsolidacionAprovechamientoProjection> uses = this.manejadorConConsolidacionAprovechamiento
                .getAllByPunishedAndIdTerceroAndDates(form.getIdTerceroList().stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(",")), enterpriseId, form.getInitialDate(), form.getEndDate(), "A");

        for (ConConsolidacionAprovechamientoProjection use : uses) {
            SearchCriteriaReportDto searchCriteriaReport = new SearchCriteriaReportDto();

            searchCriteriaReport.setUse(use.getTernomcompleto());
            searchCriteriaReport.setPenalizedValueCC(use.getCastigo_saldo_cc());
            searchCriteriaReport.setPenalizedValueTA(use.getCastigo_saldo_ta());
            searchCriteriaReport.setPenalizedValueIAT(use.getCastigo_saldo_iat());
            searchCriteriaReport.setPenalizedValueAdjustCC(use.getCastigo_saldo_ajuste_cc());
            searchCriteriaReport.setPenalizedValueAdjustTA(use.getCastigo_saldo_ajuste_ta());
            searchCriteriaReport.setPenalizedValueAdjustIAT(use.getCastigo_saldo_ajuste_iat());

            BigDecimal total = BigDecimal.ZERO;
            total = total.add(searchCriteriaReport.getPenalizedValueCC());
            total = total.add(searchCriteriaReport.getPenalizedValueTA());
            total = total.add(searchCriteriaReport.getPenalizedValueIAT());
            total = total.add(searchCriteriaReport.getPenalizedValueAdjustCC());
            total = total.add(searchCriteriaReport.getPenalizedValueAdjustTA());
            total = total.add(searchCriteriaReport.getPenalizedValueAdjustIAT());

            searchCriteriaReport.setPenalizedValueUse(total);
            searchCriteriaReports.add(searchCriteriaReport);

            // Obtenemos las facturas
            List<DetailConsolidacionAprovechamientoProjection> invoices = this.manejadorConConsolidacionAprovechamiento
                    .getNumbersFac(use.getTerideregistro(), enterpriseId, form.getInitialDate(), form.getEndDate(), "A");

            searchCriteriaReport.setQuantityFcr(invoices.size());
            searchCriteriaReport.setDetail(assembleDetail(invoices));
        }


        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), searchCriteriaReports.size());
        return new PageImpl<>(searchCriteriaReports.subList(start, end), pageable, searchCriteriaReports.size());
    }

    private List<DetailCollectionPunishedUseDto> assembleDetail(List<DetailConsolidacionAprovechamientoProjection> invoices) {
        List<DetailCollectionPunishedUseDto> details = new ArrayList<>();

        invoices.forEach(invoice -> {
            DetailCollectionPunishedUseDto detail = new DetailCollectionPunishedUseDto();
            detail.setPaidCC(invoice.getT_valoracastigar_cc());
            detail.setPaidTA(invoice.getT_valorcastigar_ta());
            detail.setPaidIAT(invoice.getT_valorcastigar_iat());

            detail.setAdjustPaidCC(invoice.getT_valoracastigar_ajustecc());
            detail.setAdjustPaidTA(invoice.getT_valoracastigar_ajusteta());
            detail.setAdjustPaidIAT(invoice.getT_valoracastigar_ajusteiat());

            detail.setPercentCC(invoice.getT_porcentaje_cc());
            detail.setPercentTA(invoice.getT_porcentaje_ta());
            detail.setPercentIAT(invoice.getT_porcentaje_iat());

            detail.setPercentAdjustCC(invoice.getT_porcentajeajuste_cc());
            detail.setPercentAdjustTA(invoice.getT_porcentajeajuste_ta());
            detail.setPercentAdjustIAT(invoice.getT_porcentajeajuste_iat());

            detail.setInvoiceId(invoice.getIdfactura().toString());
            detail.setFac_numero(invoice.getFac_numero().toString());
            detail.setExpeditionDate(invoice.getFechaexpedicion());
            detail.setCastigoDate(invoice.getFechacastigo());
            detail.setAge(invoice.getT_edadcartera());

            detail.setTotalPercent(invoice.getPorcentaje_participacion());

            BigDecimal totalValue = BigDecimal.ZERO;
            totalValue = totalValue.add(detail.getPaidCC());
            totalValue = totalValue.add(detail.getPaidTA());
            totalValue = totalValue.add(detail.getPaidIAT());
            totalValue = totalValue.add(detail.getAdjustPaidCC());
            totalValue = totalValue.add(detail.getAdjustPaidTA());
            totalValue = totalValue.add(detail.getAdjustPaidIAT());

            detail.setValue(totalValue);
            details.add(detail);
        });
        return details;
    }

    @Override
    public List<ReportBudgetDto> criteriaSearchReportInvoicing(CriteriaSearchInvoicingReportForm form) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        int month;
        int year;
        List<ReportBudgetDto> response = new ArrayList<>();
        String codUse = "";
        String codIncentiveUse = "";
        String codCostC = "";

        try {
            Map<String, Object> parameters = this.negocioParParametro.consultaParametrosAprovechamiento();
            List<LinkedHashMap<String, String>> budgetMap = (List<LinkedHashMap<String, String>>) parameters.get(ConstantesServicios.REPORTE_PRESUPUESTO_APROVECHAMIENTO);

            for (LinkedHashMap<String, String> map : budgetMap) {
                if (map.get(ITEM).equals("Aprovechamiento"))
                    codUse = map.get(CFL_CODI);
                else if (map.get(ITEM).equals("Costo Comercializacion"))
                    codCostC = map.get(CFL_CODI);
                else if (map.get(ITEM).equals("Incentivo Aprovechamiento"))
                    codIncentiveUse = map.get(CFL_CODI);
            }
        } catch (IOException e) {
            throw new NullPointerException(PARAMETER_ERROR_MSG);
        }

        for (SettlementPeriodForm periodForm : form.getSettlementPeriods()) {
            ReportBudgetDto reportBudgetDto = new ReportBudgetDto();
            Map<String, BigDecimal> totalsBudgetReport = new HashMap<>();
            Map<String, BigDecimal> totalsAnalysisReport = new HashMap<>();
            // fields HU-181
            BigDecimal useCommercializationBudgetSeven;
            BigDecimal collectionUseMarketingValue;
            BigDecimal variation;
            BigDecimal percentageVariation;
            BigDecimal useVbaBudgetSeven;
            BigDecimal collectionUseVbaValue;
            BigDecimal variationVba;
            BigDecimal percentageVariationVba;
            BigDecimal generalBudgetValueAchievement;
            BigDecimal turnUse;
            BigDecimal compliance;
            BigDecimal incentiveForTreatmentAndUseBudget;
            BigDecimal collectionIncentiveOfUse;
            BigDecimal variationVIAT;
            BigDecimal percentageVariationVIAT;
            // fields HU-182
            BigDecimal totalValueBudgetThirdPartiesUse;
            BigDecimal executedTotal;
            BigDecimal analysisVariation;
            BigDecimal analysisPercentageVariation;
            Date startDate = periodForm.getStart();
            LocalDate localDate = convertToLocalDate(startDate);
            month = localDate.getMonthValue();
            year = localDate.getYear();

            reportBudgetDto.setStart(periodForm.getStart());
            reportBudgetDto.setEnd(periodForm.getEnd());

            useCommercializationBudgetSeven = getExecutedValueFromSeven(month, year, enterpriseId, codUse);

            totalsBudgetReport.put("useCommercializationBudgetSeven", useCommercializationBudgetSeven);

            collectionUseMarketingValue = this.manejadorConConsolidacionAprovechamiento
                    .getAllCollectionUseMarketing(enterpriseId, periodForm.getStart(), periodForm.getEnd()).orElse(BigDecimal.ZERO);
            variation = useCommercializationBudgetSeven.subtract(collectionUseMarketingValue);
            collectionUseMarketingValue = adjustDivideByZero(collectionUseMarketingValue);
            percentageVariation = useCommercializationBudgetSeven.divide(collectionUseMarketingValue, 3, RoundingMode.HALF_DOWN);

            totalsBudgetReport.put("collectionUseMarketingValue", collectionUseMarketingValue);
            totalsBudgetReport.put("variation", variation);
            totalsBudgetReport.put("percentageVariation", percentageVariation);

            useVbaBudgetSeven = getExecutedValueFromSeven(month, year, enterpriseId, codCostC);

            totalsBudgetReport.put("useVbaBudgetSeven", useVbaBudgetSeven);

            collectionUseVbaValue = this.manejadorConConsolidacionAprovechamiento
                    .getAllUseVbaBudget(enterpriseId, periodForm.getStart(), periodForm.getEnd()).orElse(BigDecimal.ZERO);
            variationVba = useVbaBudgetSeven.subtract(collectionUseVbaValue);
            collectionUseVbaValue = adjustDivideByZero(collectionUseVbaValue);
            percentageVariationVba = useVbaBudgetSeven.divide(collectionUseVbaValue, 3, RoundingMode.HALF_DOWN);

            totalsBudgetReport.put("collectionUseVba", collectionUseVbaValue);
            totalsBudgetReport.put("variationVba", variationVba);
            totalsBudgetReport.put("percentageVariationVba", percentageVariationVba);

            generalBudgetValueAchievement = useCommercializationBudgetSeven.add(useVbaBudgetSeven);
            turnUse = collectionUseMarketingValue.add(collectionUseVbaValue);
            turnUse = adjustDivideByZero(turnUse);
            compliance = generalBudgetValueAchievement.divide(turnUse, 3, RoundingMode.HALF_DOWN);

            totalsBudgetReport.put("generalPptValueAchievement", generalBudgetValueAchievement);
            totalsBudgetReport.put("turnUse", turnUse);
            totalsBudgetReport.put("compliance", compliance);

            incentiveForTreatmentAndUseBudget = getExecutedValueFromSeven(month, year, enterpriseId, codIncentiveUse);

            totalsBudgetReport.put("incentiveForTreatmentAndUseBudget", incentiveForTreatmentAndUseBudget);

            collectionIncentiveOfUse = this.manejadorConConsolidacionAprovechamiento
                    .getAllCollectionIncentiveOfUse(enterpriseId, periodForm.getStart(), periodForm.getEnd()).orElse(BigDecimal.ZERO);
            variationVIAT = incentiveForTreatmentAndUseBudget.subtract(collectionIncentiveOfUse);
            collectionIncentiveOfUse = adjustDivideByZero(collectionIncentiveOfUse);
            percentageVariationVIAT = incentiveForTreatmentAndUseBudget.divide(collectionIncentiveOfUse, 3, RoundingMode.HALF_DOWN);

            totalsBudgetReport.put("collectionIncentiveOfUse", collectionIncentiveOfUse);
            totalsBudgetReport.put("variationVIAT", variationVIAT);
            totalsBudgetReport.put("percentageVariationVIAT", percentageVariationVIAT);
            reportBudgetDto.setBudgetReport(totalsBudgetReport);

            //HU-182
            totalValueBudgetThirdPartiesUse = useCommercializationBudgetSeven
                    .add(useVbaBudgetSeven.add(incentiveForTreatmentAndUseBudget));
            executedTotal = collectionUseMarketingValue.add(collectionUseVbaValue.add(collectionIncentiveOfUse));
            analysisVariation = totalValueBudgetThirdPartiesUse.subtract(executedTotal);
            executedTotal = adjustDivideByZero(executedTotal);
            analysisPercentageVariation = totalValueBudgetThirdPartiesUse.divide(executedTotal, 3, RoundingMode.HALF_DOWN);

            totalsAnalysisReport.put("totalValueBudgetThirdPartiesUse", totalValueBudgetThirdPartiesUse);
            totalsAnalysisReport.put("executedTotal", executedTotal);
            totalsAnalysisReport.put("analysisVariation", analysisVariation);
            totalsAnalysisReport.put("analysisPercentageVariation", analysisPercentageVariation);
            reportBudgetDto.setAnalysisReportBudget(totalsAnalysisReport);
            response.add(reportBudgetDto);
        }

        return response;
    }

    private BigDecimal getExecutedValueFromSeven(int month, int year, int enterpriseId, String code) {
        SevenDataDto sevenDataUse = sevenRepository.sevenData(month, year, enterpriseId, Integer.parseInt(code));

        if (sevenDataUse.getExecutedValue() != null)
            return sevenDataUse.getExecutedValue();

        return BigDecimal.ZERO;
    }

    private BigDecimal adjustDivideByZero(BigDecimal value) {
        if (value.compareTo(BigDecimal.ZERO) == 0)
            value = BigDecimal.ONE;

        return value;
    }

    @Override
    public List<OrderDetailReportDto> generateOrderDetailReport(OrderDetailReportForm orderForm, Pageable pageable) {
        List<OrderDetailReportDto> response = new ArrayList<>();
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        LocalDate initDate;
        LocalDate endDate;
        BigDecimal total = null;
        Date initToDate;
        Date endToDate;

        initDate = getLocalDate(orderForm.getInitialDate());
        endDate = getLocalDate(orderForm.getEndDate());

        for (Map.Entry<LocalDate, LocalDate> entry : calculateYear(initDate, endDate).entrySet()) {
            initToDate = convertToDate(entry.getKey());
            endToDate = convertToDate(entry.getValue());

            for (Long id : orderForm.getIdTerceroList()) {
                OrderDetailReportDto orderDetailReportDto = new OrderDetailReportDto();
                orderDetailReportDto.setStart(initToDate);
                orderDetailReportDto.setEnd(endToDate);

                this.manejadorTerTercero.findById(id).ifPresent(tercero -> orderDetailReportDto
                        .setAssociation(tercero.getTerNomcompleto()));

                List<ConConsolidacionAproGirosProjection> associations = this.manejadorConConsolidacionAprovechamiento.getAllOrderDetailReport(enterpriseId, initToDate, endToDate, "A", id);
                if (!associations.isEmpty()) {
                    total = associations.stream().map(ConConsolidacionAproGirosProjection::getValor)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                }

                orderDetailReportDto.setTotal(total);
                response.add(orderDetailReportDto);
            }
        }

        return response;
    }


    @Override
    public List<PeriodOrderDetailDto> generateDetailOrderByPeriods(PeriodOrderDetailForm form) {
        List<PeriodOrderDetailDto> response = new ArrayList<>();
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();

        for (SettlementPeriodForm periodForm : form.getSettlementPeriods()) {
            PeriodOrderDetailDto dto = new PeriodOrderDetailDto();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date start = null;
            Date end = null;
            try {
                start = dateFormat.parse(periodForm.getInicio());
                end = dateFormat.parse(periodForm.getFin());
            } catch (Exception e) {
                System.err.println("No se pudo castear las fechas. " + e.getMessage());
            }

            for (Long id : form.getIdTerceroList()) {
                AtomicReference<Date> date = new AtomicReference<>(new Date());
                dto.setOrderValueCC(BigDecimal.ZERO);
                dto.setOrderValueTA(BigDecimal.ZERO);
                dto.setOrderValueIAT(BigDecimal.ZERO);

                List<DetPeriodoAproGirosProjection> registrosDetalle = (this.manejadorConConsolidacionAprovechamiento.getDetailsOrderByPeriod(enterpriseId, start, end,"A",id));

                if(!registrosDetalle.isEmpty()){
                    for (DetPeriodoAproGirosProjection registro : registrosDetalle) {
                        dto.setPaymentTradeNumber(registro.getOficioconciliacion_tercero());
                        dto.setMinuteNumber(registro.getNumeroactacon_tercero() != null ? registro.getNumeroactacon_tercero().toString() : "");
                        dto.setOrderValueCC(registro.getPagocc());
                        dto.setOrderValueTA(registro.getPagota());
                        dto.setOrderValueIAT(registro.getPagoiat());

                        String fecha = registro.getAprconc_fechagiro() != null ? dateFormat.format(registro.getAprconc_fechagiro()) : "";

                        if(registro.getAprconc_fechagiro()!= null){
                            LocalDate initDate = convertToLocalDate(registro.getAprconc_fechagiro());
                            dto.setPeriod(initDate.getYear() + "-" +initDate.getMonthValue());
                        }

                        dto.setOrderDate(fecha);
                        dto.setOrderValueTotal(dto.getOrderValueCC().add(dto.getOrderValueTA().add(dto.getOrderValueIAT())));

                        /*if (dto.getPeriod() != null && dto.getOrderValueCC() != null && dto.getOrderValueTA() != null && dto.getOrderValueIAT() != null && dto.getOrderValueTotal() != null
                            && dto.getOrderDate() != null && dto.getMinuteNumber() != null && dto.getPaymentTradeNumber() != null)*/
                        response.add(dto);
                    }
                }
            }
        }

        return response;
    }


    @Override
    public List<BalanceReportDto> generateThirdPartyBalanceReport(AprBalanceReportForm form) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<BalanceReportDto> response = new ArrayList<>();
        for (Long id : form.getIdTerceroList()) {
            Optional<TerTercero> byId = this.manejadorTerTercero.findById(id);
            BigDecimal invoicedTotal = BigDecimal.ZERO;
            BigDecimal orderCollection = BigDecimal.ZERO;
            BigDecimal vlrChanges = BigDecimal.ZERO;
            BigDecimal dinc = BigDecimal.ZERO;
            BigDecimal punishedWalletVlr = BigDecimal.ZERO ;

            BigDecimal facturado = BigDecimal.ZERO;
            BigDecimal ajusteFacturado = BigDecimal.ZERO;

            if (byId.isPresent()) {
                // form.getSettlementPeriod().getEnd() date to timestamp sumarle un dia
                Calendar c = Calendar.getInstance();
                c.setTime(form.getSettlementPeriod().getEnd());
                c.add(Calendar.DATE, 1);
                String end = new SimpleDateFormat("yyyy-MM-dd").format(c.getTime());
                Integer start = Integer.parseInt(new SimpleDateFormat("yyyyMM").format(form.getSettlementPeriod().getStart()));
                start += 1;
                //si start termina en 13 se le resta 12 y se le suma 1 al año 202113 = 202201
                if (start.toString().endsWith("13")) {
                    start -= 12;
                    start += 100;
                }

                List<Map<String, Object>> results = this.manejadorConConsolidacionAprovechamiento.generateThirdPartyBalanceReport(Math.toIntExact(id), enterpriseId, start, String.valueOf(form.getPeriod()),"A");

                for (Map<String, Object> result : results) {

                    BalanceReportDto balanceReportDto = new BalanceReportDto();
                    balanceReportDto.setAprov(byId.get().getTerNomcompleto());
                    balanceReportDto.setIdTer(id);


                    facturado = (BigDecimal) result.get("facturadoyta");
                    ajusteFacturado = (BigDecimal) result.get("ajuste_facturado");
                    //invoicedtotal -> sum all fac values from functioNS
                    invoicedTotal = facturado.add(ajusteFacturado);
                    orderCollection = (BigDecimal) result.get("recaudo_girado");
                    vlrChanges = (BigDecimal) result.get("cambio_valor");
                    dinc = (BigDecimal) result.get("dinc");
                    punishedWalletVlr = (BigDecimal) result.get("castigado");



                    if (invoicedTotal == null)
                        invoicedTotal = BigDecimal.ZERO;
                    if (orderCollection == null)
                        orderCollection = BigDecimal.ZERO;
                    if (vlrChanges == null)
                        vlrChanges = BigDecimal.ZERO;
                    if (dinc == null)
                        dinc = BigDecimal.ZERO;
                    if (punishedWalletVlr == null)
                        punishedWalletVlr = BigDecimal.ZERO;
                    balanceReportDto.setAprov(byId.get().getTerNomcompleto());
                    balanceReportDto.setInvoicedTotal(invoicedTotal);
                    balanceReportDto.setOrderCollection(orderCollection);
                    balanceReportDto.setVlrChanges(vlrChanges);
                    balanceReportDto.setDinc(dinc);
                    balanceReportDto.setPunishedWalletVlr(punishedWalletVlr);
                    //SALDO CARTERA
                    balanceReportDto.setWalletResidue(invoicedTotal.subtract(orderCollection).subtract(vlrChanges).subtract(dinc).subtract(punishedWalletVlr));
                    response.add(balanceReportDto);
                }
            }
        }
        return response;
    }



    @Override
    public List<DetailBalanceReportDto> generateDetailThirdPartyBalanceReport(AprDetailBalanceReportForm form) {
        int enterpriseId = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<DetailBalanceReportDto> response = new ArrayList<>();
        Long id = form.getIdTercero();

        List<Map<String, Object>> results = this.manejadorConConsolidacionAprovechamiento.generateDetailThirdPartyBalanceReport(Math.toIntExact(id), enterpriseId, form.getPeriod(),form.getCutDate());

        String start; //BigDecimal start
        String end; //BigDecimal end
        for (Map<String, Object> result : results) {

            DetailBalanceReportDto detailBalanceReportDto = new DetailBalanceReportDto();
            detailBalanceReportDto.setIdTer(id);

            //parse bigdecimal to string
            start = result.get("periodoprestacion").toString(); //liquidación
            end = result.get("periodofacturado").toString(); //liquidación


            BigDecimal invoicedTotal = (BigDecimal) result.get("total_facturado");
            BigDecimal orderCollection = (BigDecimal) result.get("recaudo_girado");
            BigDecimal vlrChanges = (BigDecimal) result.get("cambios_valor");
            BigDecimal dinc = (BigDecimal) result.get("dinc");
            BigDecimal punishedWalletVlr = (BigDecimal) result.get("castigado");

            if (invoicedTotal == null)
                invoicedTotal = BigDecimal.ZERO;
            if (orderCollection == null)
                orderCollection = BigDecimal.ZERO;
            if (vlrChanges == null)
                vlrChanges = BigDecimal.ZERO;
            if (dinc == null)
                dinc = BigDecimal.ZERO;
            if (punishedWalletVlr == null)
                punishedWalletVlr = BigDecimal.ZERO;
            if (start == null)
                start = "";
            if (end == null)
                end = "";



            detailBalanceReportDto.setPerPrestacion(start);
            detailBalanceReportDto.setPerFacturacion(end);

            detailBalanceReportDto.setInvoicedTotal(invoicedTotal);
            detailBalanceReportDto.setOrderCollection(orderCollection);
            detailBalanceReportDto.setVlrChanges(vlrChanges);
            detailBalanceReportDto.setDinc(dinc);
            detailBalanceReportDto.setPunishedWalletVlr(punishedWalletVlr);

            //SALDO CARTERA
            detailBalanceReportDto.setWalletResidue(invoicedTotal.subtract(orderCollection).subtract(vlrChanges).subtract(dinc).subtract(punishedWalletVlr));
            response.add(detailBalanceReportDto);
        }


        return response;
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
    public Object updateExportadoSeven(ExportSevenCheckForm form) {
        return this.manejadorAprconcConciliacion.updateExportadoSeven(form.getThirdPartyIds(), form.getPeriodStart(), form.getPeriodEnd(), form.getCutId(),form.getExportSeven());
    }

}