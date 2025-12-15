package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.GeneralSpecification;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.NegocioNotasResponseDTO;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.SearchCriteria;
import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.entidades.*;
import com.bioagricola.apirest.modelo.enums.ImportacionNegativoEnum;
import com.bioagricola.apirest.modelo.manejadores.*;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.log4j.Logger;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Service
public class NegocioRecCarteraNotas {
    private final ManejadorImportacionNeg manejadorImportacionNeg;
    private final ManejadorImportacionNegTemp manejadorImportacionNegTemp;
    private final ManejadorImportacionNegDetalle manejadorImportacionNegDetalle;
    private final ManejadorDsusDetsuscrip dsusDetsuscrip;
    private final ModelMapper modelMapper;
    private final ManejadorCprCtrproceso manejadorCprCtrproceso;
    private final ManejadorFacFactura manejadorFacFactura;
    private final ManejadorDfacDetfactura manejadorDfacDetfactura;
    private final ManejadorConConcepto manejadorConConcepto;
    private final ManejadorTerTercero manejadorTerTercero;
    private final ManejadorEmpresas manejadorEmpresas;
    private final ManejadorPerPeriodo manejadorPerPeriodo;
    private static final String CSV = "csv";
    private static final String MSG_ERROR_HEADER = "El encabezado tiene errores";
    private static final String MSG_ERROR_LINE = "El codigo cliente en la linea %s no puede ser vacio";
    private static final String MSG_ERROR_TOTAL_PAY = "Los valores de la columna Total a Pagar no pueden estar vacio %s";
    private static final String MSG_ERROR_TOTAL_PAY_VALUE = "Los valores de la columna Total a Pagar no pueden ser mayores que 0 o ser menores a 1 millon , linea %s";
    private static final String MSG_ERROR_DATE = "El valor de la fecha de grabacion es obligatorio en la fila %s";
    private static final String MSG_ERROR_FORMAT = "El archivo tiene una extensión diferente a .csv";
    private static final String MSG_ERROR_DUPLICATE = "ya existe un archivo cargado para esta fecha, con el siguiente nombre %s";
    private static final String MSG_ERROR_EMPTY = "El archivo no puede estar vacio";
    private static final String MSG_ERROR_DELETE = "Error al eliminar, recaudo %s no encontrado";
    private static final String MSG_ERROR_DELETE_STATE = "Error al eliminar el recaudo %s, Estado del recaudo es diferente a PENDIENTE";
    private static final String MSG_ERROR_UNIQUE = "Ya existe un valor de %s para el client %s, en la fecha %s";
    private static final String ESTADO_CARGUE_DIFERENTE_A_PENDIENTE = "Estado cargue diferente a PENDIENTE";
    private static final String MSG_ERROR_RECAUDO = "Recaudo %s no encontrado";
    private final ReentrantLock reentrantLock;
    private static final Logger log = Logger.getLogger(NegocioRecCarteraNotas.class);
    
    @Autowired
    ManejadorNovNovedad manNovedad;
    
    @Autowired
    ManejadorDnovDetNovedad  manDnovDetNovedad;

    @Autowired
    public NegocioRecCarteraNotas(ManejadorImportacionNeg manejadorImportacionNeg, ManejadorImportacionNegTemp manejadorImportacionNegTemp,
                                  ManejadorImportacionNegDetalle manejadorImportacionNegDetalle, ManejadorDsusDetsuscrip dsusDetsuscrip,
                                  ModelMapper modelMapper, ManejadorCprCtrproceso manejadorCprCtrproceso, ManejadorFacFactura manejadorFacFactura,
                                  ManejadorDfacDetfactura manejadorDfacDetfactura, ManejadorConConcepto manejadorConConcepto,
                                  ManejadorTerTercero manejadorTerTercero, ManejadorEmpresas manejadorEmpresas, ManejadorPerPeriodo manejadorPerPeriodo) {
        this.manejadorImportacionNeg = manejadorImportacionNeg;
        this.manejadorImportacionNegTemp = manejadorImportacionNegTemp;
        this.manejadorImportacionNegDetalle = manejadorImportacionNegDetalle;
        this.dsusDetsuscrip = dsusDetsuscrip;
        this.modelMapper = modelMapper;
        this.manejadorCprCtrproceso = manejadorCprCtrproceso;
        this.manejadorFacFactura = manejadorFacFactura;
        this.manejadorDfacDetfactura = manejadorDfacDetfactura;
        this.manejadorConConcepto = manejadorConConcepto;
        this.manejadorTerTercero = manejadorTerTercero;
        this.manejadorEmpresas = manejadorEmpresas;
        this.manejadorPerPeriodo = manejadorPerPeriodo;
        this.reentrantLock = new ReentrantLock(true);
    }

    @Transactional
    public List<NegocioNotasResponseDTO> upload(MultipartFile file) throws IOException {
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        List<NegocioNotasResponseDTO> response = validateFile(file, extension);
        /***** Obtener la fecha del archivo ****/
        String dir = StringUtils.stripFilenameExtension(file.getOriginalFilename());
        String tmpFecha = dir.split("411_AJUSTE")[1]; 
        /*Date fecha =new Date (tmpFecha.substring(4,8)+"/"+tmpFecha.substring(2,4)+"/"+tmpFecha.substring(0,2));*/
        Date fecha = null;
        SimpleDateFormat inputFormat = new SimpleDateFormat("ddMMyyyy");
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy/MM/dd");
        
        try {
            fecha = inputFormat.parse(tmpFecha);
        } catch (Exception e) {
            e.printStackTrace();
        }
        /****  ----------------------  ****/
        if (!response.isEmpty())
            return response;

        Iterator<String[]> iterator = new CSVReaderBuilder(new InputStreamReader(file.getInputStream()))
                .withCSVParser(new CSVParserBuilder().withSeparator(';').build()).build().iterator();
        String[] header = iterator.next();

        if (!header[0].equals("ANIO_FACTURACION") || !header[1].equals("MES_FACTURACION") || !header[2].equals("CONCEPTO")
                || !header[3].equals("CLIENTE") || !header[4].equals("FECHA_GRABACION") || !header[5].equals("BANCO")
                || !header[6].equals("EXTRACTO") || !header[7].equals("VALOR_PAGO")) {
            response.add(new NegocioNotasResponseDTO(-4, MSG_ERROR_HEADER));
            return response;
        }

        int line = 1;
        ImportacionNegEMSA negEMSA = createNegEMSA(file,fecha);
        List<ImportacionNegTemp> negTemps = new ArrayList<>();

        while (iterator.hasNext()) {
            String[] row = iterator.next();

            if (validateRow(response, line, row)) break;

            Date recordingDate = fecha;//new Date(row[4]);
            String client = row[3];
            Double paid = Double.valueOf(row[7]);

            if (manejadorImportacionNegTemp.countByClientAndRecordingDateAnPaid(client, recordingDate, paid) > 0) {
                response.add(new NegocioNotasResponseDTO(line * -1, String.format(MSG_ERROR_UNIQUE, paid, client, recordingDate)));
            } else {
                negTemps.add(new ImportacionNegTemp(Integer.parseInt(row[0]), Integer.parseInt(row[1]), row[2], client, recordingDate, row[5], row[6], paid, negEMSA.getId()));
            }

            line++;
        }

        if (!response.isEmpty()) {
            this.manejadorImportacionNeg.deleteById(negEMSA.getId());
            return response;
        }

        List<ImportacionNegTemp> detail = manejadorImportacionNegTemp.saveAll(negTemps);

        return Collections.singletonList(new NegocioNotasResponseDTO(0, String.format("se importaron %s registros", detail.size()), detail));
    }

    private List<NegocioNotasResponseDTO> validateFile(MultipartFile file, String extension) {
        List<NegocioNotasResponseDTO> fails = new ArrayList<>();

        if (this.manejadorImportacionNeg.countByFilename(file.getOriginalFilename(), ImportacionNegativoEnum.APLICADO.name()) > 0)
            fails.add(new NegocioNotasResponseDTO(-1, String.format(MSG_ERROR_DUPLICATE, file.getOriginalFilename())));

        if (!CSV.equals(extension))
            fails.add(new NegocioNotasResponseDTO(-2, MSG_ERROR_FORMAT));

        if (file.isEmpty())
            fails.add(new NegocioNotasResponseDTO(-3, MSG_ERROR_EMPTY));

        return fails;
    }

    private ImportacionNegEMSA createNegEMSA(MultipartFile file, Date fecha) {
        ImportacionNegEMSA parentFile = new ImportacionNegEMSA();

        parentFile.setFilename(file.getOriginalFilename());
        parentFile.setState(ImportacionNegativoEnum.PENDIENTE.name());
        parentFile.setCreationDate(new Date());
        parentFile.setCreationDateFile(fecha);
        return this.manejadorImportacionNeg.save(parentFile);
    }

    private boolean validateRow(List<NegocioNotasResponseDTO> lineFails, int line, String[] row) {
        if (row[0] != null && row[0].isEmpty()) {
            lineFails.add(new NegocioNotasResponseDTO(line * -1, String.format("No se pueden cargar espacios vacios en el archivo en la linea %s", line + "")));
            return true;
        }

        if (row[3] == null || row[3].isEmpty()) {
            lineFails.add(new NegocioNotasResponseDTO(line * -1, String.format(MSG_ERROR_LINE, line + "")));
            return true;
        }

        if (row[4] == null || row[4].isEmpty()) {
            lineFails.add(new NegocioNotasResponseDTO(line * -1, String.format(MSG_ERROR_DATE, line)));
            return true;
        }

        if (row[7] == null || row[7].isEmpty()) {
            lineFails.add(new NegocioNotasResponseDTO(line * -1, String.format(MSG_ERROR_TOTAL_PAY, line)));
            return true;
        }

        BigDecimal addValue = new BigDecimal(row[7]);

        if (addValue.compareTo(BigDecimal.ZERO) >= 0 || addValue.compareTo(BigDecimal.valueOf(-1000000)) < 0) {
            lineFails.add(new NegocioNotasResponseDTO(line * -1, String.format(MSG_ERROR_TOTAL_PAY_VALUE, line)));
            return true;
        }

        return false;
    }

    @Transactional
    public List<ImportacionNegDetalle> process(ImportacionNegativosDTO dto) {
        if (dto.getIdImportancion() != null) {
                ImportacionNegEMSA negEMSA = this.manejadorImportacionNeg.findById(dto.getIdImportancion())
                    .orElseThrow(() -> new IllegalArgumentException(String.format("No existe importación con id %s", dto.getIdImportancion())));

            negEMSA.setState(ImportacionNegativoEnum.PROCESADO.name());
            this.manejadorImportacionNeg.save(negEMSA);
            return getAllImportationDetails(negEMSA);
        } else {
            List<ImportacionNegEMSA> negEMSAS = this.manejadorImportacionNeg.getAllByState(ImportacionNegativoEnum.PENDIENTE.name());
            List<ImportacionNegDetalle> response = new ArrayList<>();

            negEMSAS.forEach(negEMSA -> response.addAll(getAllImportationDetails(negEMSA)));
            return response;
        }

    }

    private List<ImportacionNegDetalle> getAllImportationDetails(ImportacionNegEMSA negEMSA) {
        List<ImportacionNegTemp> negTemps = this.manejadorImportacionNegTemp.findAllByIdParent(negEMSA.getId());
        List<ImportacionNegDetalle> details = new ArrayList<>();

        negTemps.forEach(negTemp -> {
            ImportacionNegDetalle detail = new ImportacionNegDetalle();

            detail.setEstadoCargue(ImportacionNegativoEnum.INCONSISTENTE.name());
            this.dsusDetsuscrip.getByCode(negTemp.getClient()).ifPresent(dsus -> {
                DsusDetsuscrip detailSubscribe = this.dsusDetsuscrip.getById(dsus.getSusIderegistro()).orElse(null);

                if (detailSubscribe != null) {
                    ConConcepto concept = manejadorConConcepto.findById(ConstantesServicios.ID_CONCEPTO_AJUSTES_EMSA).orElse(null);

                    manejadorEmpresas.findByEmpresaId(detailSubscribe.getEmpIderegistro())
                            .ifPresent(emp -> detail.setEmpresaActual(emp.getEmpresaNom() != null ? emp.getEmpresaNom() : ""));
                    manejadorTerTercero.findById(detailSubscribe.getTerIderegistro())
                            .ifPresent(terTercero -> detail.setName(terTercero.getTerNomcompleto() != null ? terTercero.getTerNomcompleto() : ""));
                    detail.setEstadoCargue(ImportacionNegativoEnum.PROCESADO.name());
                    detail.setCodigoSuscripcion(detailSubscribe.getDsusPcodigo());
                    detail.setEstadoSuscripcion(detailSubscribe.getDsusEstado());
                    detail.setIdSuscripcion(detailSubscribe.getDsusIderegistr().toString());
                    detail.setSusIdRegistro(detailSubscribe.getSusIderegistro());
                    detailSubscribe.getFacFacturaDsusIderegistrFkeyesList().stream().findFirst()
                            .ifPresent(invoice -> detail.setFacturaSuscripcion(invoice.getFacIderegistro().toString()));
                    detail.setCicloLiquidacion(detailSubscribe.getCicIderegistro().toString());
                    detail.setConcept(concept != null ? concept.getConNombre() : "");
                    manejadorPerPeriodo.getPerPeriodoByCiclo(detailSubscribe.getCicIderegistro()).stream().findFirst()
                            .ifPresent(period -> detail.setPeriodoLiquidacion(period.getPerNombre()));
                }
            });
            detail.setCodigoEmsa(negTemp.getClient());
            detail.setValorCargado(negTemp.getPaid());
            detail.setIdParent(negEMSA.getId());
            detail.setFechaArchivoRecaudo(negEMSA.getCreationDateFile());
            detail.setFechaImportacion(new Date());
            detail.setFechaRegistroEmsa(negTemp.getRecordingDate());
            detail.setExtract(negTemp.getExtract());
            details.add(detail);
        });
        this.manejadorImportacionNegTemp.deleteAll(negTemps);
        negEMSA.setState(ImportacionNegativoEnum.PROCESADO.name());
        this.manejadorImportacionNeg.save(negEMSA);
        return this.manejadorImportacionNegDetalle.saveAll(details);
    }

    @Transactional
    public Page<ImportacionNegEMSA> getAllImports(Pageable pageable) {
        return this.manejadorImportacionNeg.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("creationDate").descending())).map(this::convert);
    }

    private ImportacionNegEMSA convert(ImportacionNegEMSA importacionNegEMSA) {
        importacionNegEMSA.setTempDetails(this.manejadorImportacionNegTemp.findAllByIdParent(importacionNegEMSA.getId()));
        importacionNegEMSA.setDetails(this.manejadorImportacionNegDetalle.findAllByIdParent(importacionNegEMSA.getId()));
        return importacionNegEMSA;
    }

    @Transactional
    public ImportacionNegDetalle delete(Long id) {
        ImportacionNegDetalle importacionNegDetalle = this.manejadorImportacionNegDetalle.findById(id).orElseThrow(
                () -> new IllegalArgumentException(String.format(MSG_ERROR_DELETE, id)));

        if (!importacionNegDetalle.getEstadoCargue().equals(ImportacionNegativoEnum.PENDIENTE.name()))
            throw new IllegalArgumentException(String.format(MSG_ERROR_DELETE_STATE, id));

        importacionNegDetalle.setEstadoCargue(ImportacionNegativoEnum.ELIMINADO.name());
        return this.manejadorImportacionNegDetalle.save(importacionNegDetalle);
    }

    @Transactional
    public void hardDelete(Long id) {
        ImportacionNegEMSA emsa = manejadorImportacionNeg.findById(id).orElseThrow(() -> new IllegalArgumentException(String.format(MSG_ERROR_DELETE, id)));

        if (!emsa.getState().equals(ImportacionNegativoEnum.PENDIENTE.name()))
            throw new IllegalArgumentException(String.format(MSG_ERROR_DELETE_STATE, id));

        manejadorImportacionNegTemp.deleteAll(manejadorImportacionNegTemp.findAllByIdParent(emsa.getId()));
        manejadorImportacionNegDetalle.deleteAll(manejadorImportacionNegDetalle.findAllByIdParent(emsa.getId()));
        manejadorImportacionNeg.deleteById(emsa.getId());
    }

    @Transactional
    public void applyNote(ApplyNotesDTO applyNotesDTO) {
        log.debug("thread try to acquire lock");
        boolean isLockAcquired;

        try {
            isLockAcquired = reentrantLock.tryLock(1, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            throw new IllegalStateException(e);
        }

        if (isLockAcquired) {
            try {
                log.debug(String.format("%s own the lock", Thread.currentThread().getName()));
                // heavy operation
                runProcess(applyNotesDTO);
            } finally {
                reentrantLock.unlock();
                log.debug("thread unlock");
            }
        } else {
            throw new IllegalStateException("Existe Otro proceso en Curso");
        }
    }

    private void runProcess(ApplyNotesDTO applyNotesDTO) {
        long timeMillis = System.currentTimeMillis();
        List<ImportacionNegDetalle> details = new ArrayList<>();
        int user = JwtUtil.auditoriaDTO.getIdUsuario();
        int companyId = JwtUtil.auditoriaDTO.getIdEmpresa();
        log.error(applyNotesDTO.getIdSuscripcion());
        if (applyNotesDTO.getIdSuscripcion() != null) {
            Optional<ImportacionNegDetalle> optional = manejadorImportacionNegDetalle.findByIdSuscripcion(applyNotesDTO.getIdSuscripcion().toString());

            if (!optional.isPresent())
                throw new IllegalStateException(String.format(MSG_ERROR_RECAUDO, applyNotesDTO.getIdSuscripcion()));
            if (!optional.get().getEstadoCargue().equals(ImportacionNegativoEnum.PROCESADO.name()))
                throw new IllegalStateException(ESTADO_CARGUE_DIFERENTE_A_PENDIENTE);

            details.add(optional.get());
        } else {
            details.addAll(manejadorImportacionNegDetalle.findAllByFechaAplicacionNota(applyNotesDTO.getImportDate(),ImportacionNegativoEnum.PROCESADO.name()));//applyNotesDTO.getImportDate(),
        }

        if (details.isEmpty())
            throw new IllegalStateException("No existen Procesos para aplicar Nota");

        CprCtrProceso process = createProcess(timeMillis);
        List<ImportacionNegEMSA> emsas = new LinkedList<>();

        details.forEach(detail -> {
            Optional<FacFactura> optInvoice = manejadorFacFactura.getFacFacturaByDsuscripId(Integer.valueOf(detail.getIdSuscripcion())).stream().findFirst();
            emsas.add(manejadorImportacionNeg.findById(detail.getIdParent())
                    .orElseThrow(() -> new IllegalArgumentException(String.format("nota padre no encontrada %s", detail.getIdParent()))));

            if (!optInvoice.isPresent()) {
                detail.setEstadoCargue(ImportacionNegativoEnum.INCONSISTENTE.name());
                detail.setEstadoSuscripcion("Suscripción no Activa");
                manejadorImportacionNegDetalle.save(detail);
            } else {
                Timestamp ts=new Timestamp((new Date()).getTime());
                FacFactura fInvoice = optInvoice.get();
                NovNovedad nov = manNovedad.findByDsusIderegistrAndPerIderegistro(fInvoice.getDsusIderegistr(), fInvoice.getPerIderegistro())
                        .orElse(new NovNovedad());                        
                DnovDetNovedad dnov = new DnovDetNovedad();
                nov.setNovFecgenerac(ts);
                nov.setNovEstado("P");
                nov.setNovGenera("M");
                nov.setNovObservacion("AJUSTES EMSA NEGATIVOS");
                nov.setEmpIderegistro(fInvoice.getEmpIderegistro());
                nov.setCicIderegistro(fInvoice.getCicIderegistro());
                nov.setPerIderegistro(fInvoice.getPerIderegistro());
                nov.setCicAno(Integer.valueOf(fInvoice.getCicAno()));
                nov.setUsuIderegistro(user);
                nov.setDsusIderegistr(fInvoice.getDsusIderegistr());
                manNovedad.save(nov);
                dnov.setDnovEstado("P");
                dnov.setDnovCantidad(1);
                dnov.setDnovVlrUnitari(new BigDecimal(detail.getValorCargado()* -1));
                dnov.setDnovVlrTotal(new BigDecimal(detail.getValorCargado() * -1));
                dnov.setEmpIderegistro(fInvoice.getEmpIderegistro());
                dnov.setDsusIderegistr(fInvoice.getDsusIderegistr());
                dnov.setUniLiquidacion(fInvoice.getUniLiquidacion());
                dnov.setUniConcepto(ConstantesServicios.ID_CONCEPTO_AJUSTES_EMSA);
                dnov.setCicIderegistro(fInvoice.getCicIderegistro());
                dnov.setPerIderegistro(fInvoice.getPerIderegistro());
                dnov.setCicAno(Integer.parseInt(fInvoice.getCicAno().toString()));
                dnov.setUsuIderegistro(user);
                dnov.setNovIderegistro(Integer.parseInt(nov.getNovIderegistro().toString()));
                manDnovDetNovedad.save(dnov);
                
                
                /*DfacDetfactura detInvoice = new DfacDetfactura();
                BigDecimal value = BigDecimal.valueOf(detail.getValorCargado()).abs();                
                detInvoice.setDfacEstado("A");
                detInvoice.setDfacIdepadre(optInvoice.get().getFacIderegistro());
                detInvoice.setFacIderegistro(optInvoice.get().getFacIderegistro());
                detInvoice.setUniConcepto(ConstantesServicios.ID_CONCEPTO_AJUSTES_EMSA);
                detInvoice.setEmpIderegistro(companyId);
                detInvoice.setUsuIderegistro(user);
                detInvoice.setDfacCantidad(value);
                detInvoice.setDfacVlrunitari(value);
                detInvoice.setDfacVlrtotal(value);
                detInvoice.setDfacVlrreal(value);
                detInvoice.setDfacSdoreal(value);
                manejadorDfacDetfactura.save(detInvoice);
                FacFactura facInvoice = optInvoice.get();
                BigDecimal sldoFactura = facInvoice.getFacSdoreal();
                BigDecimal vlrFactura = facInvoice.getFacVlrreal();
                BigDecimal nSldoFactura = sldoFactura.add(value);
                BigDecimal nVlrFactura = vlrFactura.add(value);
                facInvoice.setFacSdoreal(nSldoFactura);
                facInvoice.setFacVlrreal(nVlrFactura);
                manejadorFacFactura.save(facInvoice);*/
                detail.setEstadoCargue(ImportacionNegativoEnum.APLICADO.name());
                detail.setFechaAplicacionNota(new Date());
                manejadorImportacionNegDetalle.save(detail);
                process.setCprEstado("I");
                manejadorCprCtrproceso.save(process);
            }
        });
        emsas.forEach(emsa -> {
            emsa.setState(ImportacionNegativoEnum.APLICADO.name());
            manejadorImportacionNeg.save(emsa);
        });
    }

    private CprCtrProceso createProcess(long time) {
        CprCtrProceso cprCtrProceso = new CprCtrProceso();

        cprCtrProceso.setPrgIderegistro(ConstantesServicios.ID_PROGRAMA_AJUSTES_EMSA);
        cprCtrProceso.setCprIdehilo(time);
        cprCtrProceso.setCprEstado("A");
        cprCtrProceso.setCprFecinicio(new Date());
        cprCtrProceso.setAccIderegistro(Long.parseLong(JwtUtil.auditoriaDTO.getId()));
        cprCtrProceso.setEmpIderegistro(JwtUtil.auditoriaDTO.getIdEmpresa());
        cprCtrProceso.setCprCanregistro(0L);
        cprCtrProceso.setUsuIderegistro((long) JwtUtil.auditoriaDTO.getIdUsuario());
        return manejadorCprCtrproceso.save(cprCtrProceso);
    }

    @Transactional
    public Page<ImportacionNegDetalle> filterDetail(FiltroImportacionNegativosDtllDTO dto, Pageable pageable) {
        GeneralSpecification<ImportacionNegDetalle> idSuscripcionFilter = null;
        GeneralSpecification<ImportacionNegDetalle> codigoSuscripcionFilter = null;
        GeneralSpecification<ImportacionNegDetalle> estadoSuscripcionFilter = null;
        GeneralSpecification<ImportacionNegDetalle> estadoCargueFilter = null;
        GeneralSpecification<ImportacionNegDetalle> nombreFilter = null;
        GeneralSpecification<ImportacionNegDetalle> empresaActualFilter = null;
        GeneralSpecification<ImportacionNegDetalle> fechaRegistroEmsaFilter = null;
        GeneralSpecification<ImportacionNegDetalle> fechaImportacionFilter = null;
        GeneralSpecification<ImportacionNegDetalle> fechaAplicacionNotaFilter = null;
        GeneralSpecification<ImportacionNegDetalle> conceptFilter = null;
        GeneralSpecification<ImportacionNegDetalle> extractFilter = null;
        GeneralSpecification<ImportacionNegDetalle> valorCargadoFilter = null;
        GeneralSpecification<ImportacionNegDetalle> codigoEmsaFilter = null;

        if (dto.getIdSuscripcion() != null)
            idSuscripcionFilter = new GeneralSpecification(new SearchCriteria("idSuscripcion", "=", dto.getIdSuscripcion()));

        if (dto.getCodigoSuscripcion() != null)
            codigoSuscripcionFilter = new GeneralSpecification(new SearchCriteria("codigoSuscripcion", "=", dto.getCodigoSuscripcion()));

        if (dto.getConcept() != null)
            conceptFilter = new GeneralSpecification(new SearchCriteria("concept", "=", dto.getConcept()));

        if (dto.getEstadoSuscripcion() != null)
            estadoSuscripcionFilter = new GeneralSpecification(new SearchCriteria("estadoSuscripcion", "=", dto.getEstadoSuscripcion()));

        if (dto.getEstadoCargue() != null)
            estadoCargueFilter = new GeneralSpecification(new SearchCriteria("estadoCargue", "=", dto.getEstadoCargue()));

        if (dto.getNombre() != null)
            nombreFilter = new GeneralSpecification(new SearchCriteria("name", "=", dto.getNombre()));

        if (dto.getEmpresaActual() != null)
            empresaActualFilter = new GeneralSpecification(new SearchCriteria("empresaActual", "=", dto.getEmpresaActual()));

        if (dto.getFechaRegistroEmsa() != null)
            fechaRegistroEmsaFilter = new GeneralSpecification(new SearchCriteria("fechaRegistroEmsa", "=", dto.getFechaRegistroEmsa()));

        if (dto.getFechaImportacion() != null)
            fechaImportacionFilter = new GeneralSpecification(new SearchCriteria("fechaImportacion", "=", dto.getFechaImportacion()));

        if (dto.getFechaAplicacionNota() != null)
            fechaAplicacionNotaFilter = new GeneralSpecification(new SearchCriteria("fechaAplicacionNota", "=", dto.getFechaAplicacionNota()));

        if (dto.getExtract() != null)
            extractFilter = new GeneralSpecification(new SearchCriteria("extract", "=", dto.getExtract()));

        if (dto.getValorCargado() != null)
            valorCargadoFilter = new GeneralSpecification(new SearchCriteria("valorCargado", "=", dto.getValorCargado()));

        if (dto.getCodigoEmsa() != null)
            codigoEmsaFilter = new GeneralSpecification(new SearchCriteria("codigoEmsa", "=", dto.getCodigoEmsa()));

        return manejadorImportacionNegDetalle.findAll(Specification.where(idSuscripcionFilter).and(codigoSuscripcionFilter).and(estadoSuscripcionFilter)
                        .and(conceptFilter).and(estadoCargueFilter).and(nombreFilter).and(empresaActualFilter).and(extractFilter)
                        .and(fechaRegistroEmsaFilter).and(fechaImportacionFilter).and(fechaAplicacionNotaFilter).and(valorCargadoFilter).and(codigoEmsaFilter),
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("fechaRegistroEmsa").descending())).map(this::convertDetail);
    }

    private ImportacionNegDetalle convertDetail(ImportacionNegDetalle detail) {
        detail.setEmsadto(modelMapper.map(this.manejadorImportacionNeg.findById(detail.getIdParent()).orElse(null), ImportacionNegEMSADTO.class));
        return detail;
    }

    public List<NoteResponseDTO> getAllByStateAndAppliedDateProcess(NegocioRecCarteraNotasDTO negocioRecCarteraNotasDTO) {
        List<NoteResponseDTO> response = new ArrayList<>();
        List<ImportacionNegDetalle> details = manejadorImportacionNegDetalle.findAllByConceptAndEstadoCargue(negocioRecCarteraNotasDTO.getStartDate(), negocioRecCarteraNotasDTO.getEndDate());
        Map<Pair<String, Date>, List<ImportacionNegDetalle>> listByConcept = details.stream().collect(groupingBy(detail -> Pair.of(detail.getConcept(), detail.getFechaArchivoRecaudo())));

        listByConcept.forEach((key, value) -> response.add(new NoteResponseDTO(value.size(), value.stream().map(detail -> BigDecimal.valueOf(detail.getValorCargado()))
                    .collect(Collectors.toList()).stream().reduce(BigDecimal.ZERO, BigDecimal::add), key.getLeft(), key.getRight())));
        return response;
    }
}
