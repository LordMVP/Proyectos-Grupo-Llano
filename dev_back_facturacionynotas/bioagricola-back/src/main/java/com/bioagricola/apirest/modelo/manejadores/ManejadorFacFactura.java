package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.dtos.ToneladasPorSuscripDTO;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad FacFactura.
 *
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorFacFactura extends ManejadorCrud<FacFactura, Long>, IManejadorCrud<FacFactura, Long> {

    @Query("select f.facIderegistro " + "from FacFactura f " + "where f.dsusIderegistr =:idsuscripcion "
            + "and f.uniDocumento =:iddocumento " + "and f.uniTipdocument=:idtipodocumento "
            + "and f.cicIderegistro=:idciclo " + "and f.perIderegistro=:idperiodo " + "AND f.cicAno=:cicloanio "
            + "AND f.facEstado  IN ('A','G') AND f.facIdeorigen is null")
    public Long getFacturaCicloPeriodoActual(@Param("idsuscripcion") Long idsuscripcion,
                                             @Param("iddocumento") Integer iddocumento, @Param("idtipodocumento") Integer idtipodocumento,
                                             @Param("idciclo") Integer idciclo, @Param("idperiodo") Integer idperiodo,
                                             @Param("cicloanio") Short cicloanio);

    @Query(value = "select fac.emp_ideregistro idempresa, fac.uni_documento iddocumento,"
            + " fac.uni_tipdocument idtipodocumento, fac.fac_ideregistro idfactura,"
            + " fac.dsus_ideregistr idsuscripcion " + "from fac_factura fac "
            + " INNER JOIN dsus_detsuscrip dsus " + " ON fac.dsus_ideregistr = dsus.dsus_ideregistr  "
            + " where fac.fac_estado = 'G' " + "AND fac.emp_ideregistro = :idEmpresa "
            + " AND dsus.cic_ideregistro = :idCiclo ", nativeQuery = true)
    public Object[] getConsultarFacturasGeneradas(Integer idEmpresa, Integer idCiclo);

    @Modifying
    @Query(value = "INSERT INTO public.fac_factura("
            + " fac_metgenera,fac_estado,fac_fecha,fac_fecvence,emp_ideregistro,sus_ideregistro,dsus_ideregistr,uni_tipsuscripc,uni_tipusosuscr,"
            + " uni_liquidacion,ter_ideregistro,cic_ideregistro,per_ideregistro,uni_documento,uni_tipdocument,cic_ano,hliq_ideregistr,fac_sdoreal,uni_tiptercero,"
            + " fac_fecsuspens,fac_version,fac_vlrreal,fac_fecaprobada,usu_ideregistro)"
            + " VALUES (:facMetgenera,:facEstado,:facFecha,:facFecvence,:empIderegistro,:susIderegistro,:dsusIderegistr,:uniTipsuscripc,:uniTipusosuscr,:uniLiquidacion,"
            + " :terIderegistro,:cicIderegistro,:perIderegistro,:uniDocumento,:uniTipdocument,:cicAno,:hliqIderegistr,:facSdoreal,:uniTiptercero,:facFecsuspens,"
            + " :facVersion,:facVlrreal,:facFecaprobada,:usuIderegistro)", nativeQuery = true)
    @Transactional
    void insertFacFactura(char facMetgenera, char facEstado, Timestamp facFecha, Timestamp facFecvence,
                          Integer empIderegistro, BigInteger susIderegistro, BigInteger dsusIderegistr, Integer uniTipsuscripc,
                          Integer uniTipusosuscr, Integer uniLiquidacion, BigInteger terIderegistro, Integer cicIderegistro,
                          Integer perIderegistro, Integer uniDocumento, Integer uniTipdocument, Short cicAno,
                          Integer hliqIderegistr, BigDecimal facSdoreal, Integer uniTiptercero, Timestamp facFecsuspens,
                          Integer facVersion, BigDecimal facVlrreal, Timestamp facFecaprobada, Integer usuIderegistro);

    @Query(value = "SELECT" + "                  fac.fac_ideregistro idfactura,"
            + "                  fac.cic_ideregistro idciclo," + "                  fac.per_ideregistro idperiodo,"
            + "                  fac.cic_ano cicloanio," + "                  fac.emp_ideregistro idempresa,"
            + "                  fac.fac_sdoreal saldo," + "                  ("
            + "                   CASE WHEN fac.fac_fecvence < now() THEN" + "                   'M'"
            + "                   ELSE" + "                   'C'" + "                   END"
            + "                  ) As tipo" + "                FROM" + "                  fac_factura fac"
            + "                WHERE" + "                  fac.fac_sdoreal > 0 AND fac.fac_estado='A'"
            + "                AND fac.dsus_ideregistr = :idsuscripcion AND fac.fac_idepadre IS NULL"
            + "                AND fac.per_ideregistro <= (SELECT per1.per_ideregistro FROM per_periodo per1 WHERE per1.cic_ideregistro = fac.cic_ideregistro AND per_estado = 'A')", nativeQuery = true)
    public Object[] consultarFacturasConSaldo(Integer idsuscripcion);

    @Query("select ff.facIderegistro, " + "ff.facIdeorigen,  " + "dd.dfacIderegistr, " + "dd.dfacIdeorigen  "
            + "from FacFactura ff  " + "inner join DfacDetfactura dd on dd.facIderegistro = ff.facIderegistro  "
            + "where ff.empIderegistro = :empresaId  " + "and ff.facIderegistro = :facIderegistro  "
            + "and dd.uniConcepto = :uniConcepto")
    public List<Object[]> baseParaNofa(@Param("empresaId") Integer empresaId,
                                       @Param("facIderegistro") Long facIderegistro, @Param("uniConcepto") Integer uniConcepto);

    @Query("select ff from FacFactura ff  " + "inner join PerPeriodo pp on pp.perIderegistro = ff.perIderegistro  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = ff.dsusIderegistr  "
            + "where ff.dsusIderegistr = :suscripcion " + "and ff.empIderegistro =:idEmpresa "
            + "and ff.facFecha between :perFecInicio and :perFecFin ")
    public List<FacFactura> consultaFacturasPorSucripcion(@Param("suscripcion") Long suscripcion,
                                                          @Param("idEmpresa") int idEmpresa, @Param("perFecInicio") Timestamp perFecInicio,
                                                          @Param("perFecFin") Timestamp perFecFin);

    /**
     * Método encargado de consultar todas las suscripciones que se les va a aplicar
     * descuento por indicadores de calidad, a su vez que se validan como vigentes
     * ya que la consulta se realiza directamente en la tabla de facturas
     *
     * @param perFecInicio
     * @param perFecFin
     * @param idEmpresa
     * @return
     */
    @Query("select distinct ff.dsusIderegistr from FacFactura ff "
            + "inner join PerPeriodo pp on pp.perIderegistro = ff.perIderegistro  "
            + "where ff.empIderegistro =:idEmpresa " + "and ff.facFecha between :perFecInicio and :perFecFin ")
    public List<Long> consultaSuscripVigentesCompactacion(@Param("perFecInicio") Timestamp perFecInicio,
                                                          @Param("perFecFin") Timestamp perFecFin, @Param("idEmpresa") int idEmpresa);

    /**
     * Consulta para validar el valor total de las toneladas por cada suscripción,
     * para aplicar el descuento de indicadores de calidad cuando sea necesario
     *
     * @param conceptosToneladas
     * @param docFactServicio
     * @param dsusIderegistr
     * @param perFecInicio
     * @param perFecFin
     * @return
     */
    @Query("select sum(dd.dfacVlrtotal) "
            + "from FacFactura ff  " + "inner join DsusDetsuscrip dd2 on dd2.dsusIderegistr = ff.dsusIderegistr  "
            + "inner join DfacDetfactura dd on dd.facIderegistro = ff.facIderegistro "
            + "inner join PerPeriodo pp on pp.perIderegistro = ff.perIderegistro "
            + "where dd.uniConcepto in :conceptosToneladas " + "and ff.uniDocumento in :docFactServicio "
            + "and ff.dsusIderegistr = :dsusIderegistr " + "and pp.perFecinicial between :perFecInicio and :perFecFin "
            + "and ff.facEstado in ('A', 'F') " + "and ff.facIdepadre is null ")
    public BigDecimal consultaSumatoriaToneladasPorSuscrip(
            @Param("conceptosToneladas") List<Integer> conceptosToneladas,
            @Param("docFactServicio") List<Integer> docFactServicio, @Param("dsusIderegistr") Long dsusIderegistr,
            @Param("perFecInicio") Timestamp perFecInicio, @Param("perFecFin") Timestamp perFecFin);

    /**
     * Consulta para validar el valor total de las toneladas por cada suscripción y cada concepto de toneladas,
     * para aplicar el descuento de indicadores de calidad cuando sea necesario
     *
     * @param conceptosToneladas
     * @param docFactServicio
     * @param dsusIderegistr
     * @param perFecInicio
     * @param perFecFin
     * @return
     */
    @Query("select new com.bioagricola.apirest.modelo.dtos.ToneladasPorSuscripDTO(dd2.dsusIderegistr, dd.uniConcepto, sum(dd.dfacVlrtotal)) "
            + "from FacFactura ff  " + "inner join DsusDetsuscrip dd2 on dd2.dsusIderegistr = ff.dsusIderegistr  "
            + "inner join DfacDetfactura dd on dd.facIderegistro = ff.facIderegistro "
            + "inner join PerPeriodo pp on pp.perIderegistro = ff.perIderegistro "
            + "where dd.uniConcepto in :conceptosToneladas " + "and ff.uniDocumento in :docFactServicio "
            + "and ff.dsusIderegistr = :dsusIderegistr " + "and pp.perFecinicial between :perFecInicio and :perFecFin "
            + "and ff.facEstado in ('A', 'F') " + "and ff.facIdepadre is null "
            + "group by dd2.dsusIderegistr, dd.uniConcepto")
    public List<ToneladasPorSuscripDTO> consultaToneladasPorSuscrip(
            @Param("conceptosToneladas") List<Integer> conceptosToneladas,
            @Param("docFactServicio") List<Integer> docFactServicio, @Param("dsusIderegistr") Long dsusIderegistr,
            @Param("perFecInicio") Timestamp perFecInicio, @Param("perFecFin") Timestamp perFecFin);

    @Query("select dd.dfacVlrtotal " +
            "from FacFactura ff " +
            "join DfacDetfactura dd on dd.facIderegistro = ff.facIderegistro " +
            "join DocDocumento dd2 on dd2.uniDocumento = ff.uniDocumento " +
            "where ff.facIdeorigen = :facIdeorigen and dd.uniConcepto = :uniConcepto " +
            "and dd2.docAbreviatura = 'CC'")
    public BigDecimal valorCastigado(@Param("facIdeorigen") Long facIdeorigen, @Param("uniConcepto") Integer uniConcepto);

    @Query("select sum(df.dfacVlrreal) from DfacDetfactura df where df.facIderegistro = :facIdRegistro")
    BigDecimal getValorTotal(@Param("facIdRegistro") Long facIdRegistro);

    @Query("select f from FacFactura f " +
            "where f.facIdepadre = :idFactura and f.facFecha <= :limiteProc " +
            "and f.docDocumentofacFacturaDocDocumentoFkey.docAbreviatura = :tipoNota ")
    List<FacFactura> getNotasFactura(@Param("idFactura") Long idFactura,
                                     @Param("limiteProc") Date limiteProc,
                                     @Param("tipoNota") String tipoNota);

    @Query("select f from FacFactura f " +
            "where f.docDocumentofacFacturaDocDocumentoFkey.docAbreviatura = 'CC' and f.facIdeorigen= :idFactura and f.facFecha<= :limiteProc")
    List<FacFactura> getSaldoConCastigo(@Param("idFactura") Long idFactura, @Param("limiteProc") Date limiteProc);

    @Query("select f from FacFactura f " +
            "where f.facIdeorigen = :idFactura " +
            "and f.facFecha<= :limiteProc and f.finIderegistro is not null")
    List<FacFactura> getSaldoFinanciado(@Param("idFactura") Long idFactura, @Param("limiteProc") Date fechaLimite);


    @Query("select f from FacFactura f join DfinDetfinanci df " +
            "on f.facIderegistro = df.facIderegistro " +
            "where f.facFecha<= :limiteProc and f.finIderegistro = :finIderegistro")
    List<FacFactura> getFacBaseFinanciacion(@Param("finIderegistro") Long finIderegistro, @Param("limiteProc") Date fechaLimite);

    @Query("select f from FacFactura  f " +
            "where f.facFecha<= :limiteProc and f.facIderegistro = :facIdeorigen")
    List<FacFactura> getFacBaseOrigen(@Param("facIdeorigen") Long facIdeorigen, @Param("limiteProc") Date fechaLimite);

    /**
     * Consulta que mediante unos parámetros de búsqueda permite listar las facturas de suscripciones
     * del Servicio de Aseo prestado por Bioagrícola dentro de un rango específico de fechas.
     *
     * @param dateInit
     * @param dateEnd
     * @param dsusId
     * @param codBefore
     * @param numInvoice
     * @return
     */
    @Query("select ff.cicAno, ff.facEstado, ff.perIderegistro, ff.facVlrreal, ff.facFecha, ff.dsusIderegistr, ff.facIderegistro, ff.facIderegistro " +
            "from FacFactura ff " +
            "inner join DsusDetsuscrip dd " +
            "on (ff.dsusIderegistr = dd.dsusIderegistr) " +
            "where 1=1 and ff.facIdepadre is null " +
            "and ff.facFecha between :dateInit and :dateEnd " +
            "AND dd.dsusIderegistr = :dsusId " +
            "AND (:codBefore IS NULL OR dd.dsusPcodigo = :codBefore) " +
            "AND (:numInvoice IS NULL OR ff.facNumero = :numInvoice) ")
    List<Object[]> getFilterInvoice(@Param("dateInit") Date dateInit, @Param("dateEnd") Date dateEnd, @Param("dsusId") Long dsusId,
                                    @Param("codBefore") String codBefore, @Param("numInvoice") Long numInvoice);

    /**
     * consulta que retorna el Saldo por cliente al corte de la factura que se está consultando
     *
     * @param invoiceDate fecha de factura
     * @param idDsusCr    parametro cliente
     * @param integerList parametros de interes mora y saldo a favor
     * @return
     */
    @Query("SELECT SUM(ff.facSdoreal) " +
            "FROM FacFactura ff " +
            "WHERE ff.uniDocumento NOT IN (:list) " +
            "AND ff.facEstado = 'A' " +
            "AND ff.facIdepadre IS NULL " +
            "AND ff.facFecvence < :date " +
            "AND ff.dsusIderegistr = :idDsusCr ")
    Double sumSaldoRealByClient(@Param("date") Date invoiceDate, @Param("idDsusCr") Long idDsusCr, @Param("list") List<Integer> integerList);


    /**
     * @param invoiceDate fecha de factura
     * @param idDsusCr    parametro cliente
     * @param integerList parametros de interes morao saldo a favor
     * @return
     */
    @Query("SELECT SUM(ff.facSdoreal) " +
            "FROM FacFactura ff " +
            "WHERE ff.uniDocumento IN (:list) " +
            "AND ff.facEstado = 'A' " +
            "AND ff.facIdepadre IS NULL " +
            "AND ff.facFecvence < :date " +
            "AND ff.dsusIderegistr = :idDsusCr ")
    Double sumSaldoRealByUniDocumentList(@Param("date") Date invoiceDate, @Param("idDsusCr") Long idDsusCr, @Param("list") List<Integer> integerList);

    @Query(value = "select * from aseo.fn_getlabelsfacturacion(:idsuscripcion, :idfactura, :iddocumentorelacionado, :idempresa, :idestructura, :retornarsoloetiquetados) ",
            nativeQuery = true)
    List<Object[]> getFnGetlabelsfacturacion(@Param("idsuscripcion") Long idDsusCr, @Param("idfactura") Long idFac,
                                             @Param("iddocumentorelacionado") Long idDocRe, @Param("idempresa") Integer idEmp,
                                             @Param("idestructura") Long idestructura, @Param("retornarsoloetiquetados") boolean retornarsoloetiquetados);

    @Query(value = "SELECT " +
            "parent.fac_ideregistro, " +
            "parent.uni_liquidacion, " +
            "parent.per_ideregistro, " +
            "child.fac_ideregistro as child_ide_registro, " +
            "child.fin_ideregistro, " +
            "child.amo_ideregistro, " +
            "parent.fac_vlrreal, " +
            "parent.fac_estado, " +
            "parent.fac_fecha " +
            "FROM fac_factura child " +
            "inner JOIN fac_factura parent " +
            "ON child.fac_idepadre = parent.fac_ideregistro " +
            "inner join dfac_detfactura dfac on dfac.fac_ideregistro = child.fac_ideregistro " +
            "inner join per_periodo pp on parent.per_ideregistro = pp.per_ideregistro " +
            "where parent.fac_estado in ('A', 'F', 'C', 'N') " +
            "and parent.fac_vlrreal >= 0 " +
            "and pp.per_fecinicial <= :periodo " +
            "and child.fac_estado in ('A', 'F', 'C', 'N') " +
            "and parent.emp_ideregistro = :idempresa " +
            "and parent.fac_idepadre is not null " +
            "and (child.fac_idepadre = parent.fac_ideregistro or child.fac_ideorigen = parent.fac_ideregistro) " +
            "and parent.fac_sdoreal = 0 " + // no ha sido objeto de conciliación
            "and parent.fac_fecha <= :corteFacturacion " +
            "and child.fac_fecha  <= :corteFacturacion " +
            "and dfac.uni_concepto in :uniConList ", // conceptos de aprovechamiento o incentivo aprovechamiento
            nativeQuery = true)
    List<Object[]> obtenerFacturasPadrePorFechaCorte(@Param("corteFacturacion") Date corteFacturacion,
                                                     @Param("uniConList") List<Integer> uniConList,
                                                     @Param("periodo") Date periodo,
                                                     @Param("idempresa") Integer idempresa);

    @Query(value = "select " +
            "dfac.uni_concepto, " +
            "dfac.dfac_ideregistr, " +
            "drec.drec_ideregistr " +
            "from fac_factura ff " +
            "inner join dfac_detfactura dfac on dfac.fac_ideregistro = ff.fac_ideregistro " +
            "inner join drec_detrecaudo drec on drec.dfac_ideregistr = dfac.dfac_ideregistr " +
            "where ff.fac_estado = 'A' " +
            "and ff.fac_ideregistro = :facIderegistro and ff.emp_ideregistro = :idempresa " +
            "and drec.drec_fecha <= :limiteProcesamiento and ff.fac_idepadre is not null ", nativeQuery = true)
    List<Object[]> obtenerDetallesFacturasHijasXRecaudo(@Param("facIderegistro") Long facIderegistro, @Param("limiteProcesamiento") Date limiteProcesamiento,
                                                        @Param("idempresa") Integer idempresa);

    @Query(value = "select " +
            "dfac.uni_concepto, " +
            "dfac.dfac_ideregistr " +
            "from fac_factura ff " +
            "inner join dfac_detfactura dfac on dfac.fac_ideregistro = ff.fac_ideregistro " +
            "where ff.fac_estado = 'A' " +
            "and ff.fac_ideregistro = :facIderegistro and ff.emp_ideregistro = :idempresa " +
            "and ff.fac_fecha <= :limiteProcesamiento and ff.fac_idepadre is not null ", nativeQuery = true)
    List<Object[]> obtenerDetallesFacturasHijasXNota(@Param("facIderegistro") Long facIderegistro, @Param("limiteProcesamiento") Date limiteProcesamiento,
                                                     @Param("idempresa") Integer idempresa);

    @Query(value = "select dfac.dfac_vlrreal " +
            "from dfac_detfactura dfac " +
            "inner join con_concepto cc on dfac.uni_concepto = cc.uni_concepto " +
            "where dfac.dfac_estado = 'A' and cc.con_intfinanciacion = 'S' and cc.con_operacion = 'S' " +
            "and dfac.dfac_ideregistr = :dfacIderegistro and dfac.emp_ideregistro = :idempresa ", nativeQuery = true)
    Optional<BigInteger> valorFinanciacion(@Param("dfacIderegistro") Long dfacIderegistro, @Param("idempresa") Integer idempresa);

    @Query(value = "select distinct cc.uni_concepto " +
            "from con_concepto cc inner join aseo.coli_conliquida_apro coli on coli.uni_concepto = cc.uni_concepto " +
            " where cc.con_propiedad is not null and cast(cc.con_propiedad as text) like :propiedad and cc.con_operacion = 'S' ", nativeQuery = true)
    List<Integer> getIdUniconceptoXConPropiedadAprochOrIncetivoAproch(@Param("propiedad") String propiedad);

    @Query(value = "select distinct cc.uni_concepto " +
            "from con_concepto cc where cast(cc.con_propiedad as text) like :propiedad ", nativeQuery = true)
    Optional<Integer> getConceptoXNombrePropiedad(@Param("propiedad") String propiedad);

    @Query("select count(dd.dfacIderegistr) from DfacDetfactura dd where dd.dfacIderegistr = :dfacIderegistr and dd.uniConcepto = :uniConcepto")
    Integer countByIdAndUniConcepto(@Param("dfacIderegistr") Long dfacIderegistr, @Param("uniConcepto") Long uniConcepto);

    @Query(value = "select coli.uni_porcentaje " +
            "from coli_conliquida_apro coli " +
            "where coli.uni_concepto = :idConcepto and coli.uni_liquidacion = :liquidacion ", nativeQuery = true)
    Optional<BigInteger> getPorcentajeAprovechamiento(@Param("idConcepto") Integer idConcepto, @Param("liquidacion") Integer liquidacion);

    @Query(value = "select amf.amfi_numcuotas " +
            "from amfi_amofinanci amf " +
            "where amf.fin_ideregistro = :finIdRegistro and amf.amfi_estado = 'A' ", nativeQuery = true)
    Optional<BigInteger> getCuotas(@Param("finIdRegistro") Integer finIdRegistro);

    @Query(value = "select count(ff.fac_ideregistro) " +
            "from fac_factura ff inner join doc_documento dd " +
            "on (ff.uni_documento = dd.uni_documento) " +
            "where dd.doc_tipo = :clasificacion and ff.fac_ideregistro = :idFactura and ff.emp_ideregistro = :idempresa", nativeQuery = true)
    BigInteger countClasificacionFactura(@Param("clasificacion") String clasificacion, @Param("idFactura") Integer idFactura,
                                         @Param("idempresa") Integer idempresa);

    @Query(value = "select vrta_valor, ter_ideregistro " +
            "from aseo.vrta_varterapr vv " +
            "where vv.per_ideregistro = :perIderegistro and vv.emp_ideregistro = :empIderegistro " +
            "and vv.con_ideregistro = :conIderegistro ", nativeQuery = true)
    List<Object[]> getPorcentajeParticipacionAprovechador(@Param("perIderegistro") Integer perIderegistro,
                                                          @Param("empIderegistro") Integer empIderegistro,
                                                          @Param("conIderegistro") Integer conIderegistro);

    @Query(value = "select " +
            "ff.fac_ideregistro, " +
            "ff.uni_liquidacion, " +
            "ff.per_ideregistro, " +
            "ff.fin_ideregistro, " +
            "ff.amo_ideregistro, " +
            "ff.fac_vlrreal, " +
            "ff.fac_estado, " +
            "ff.fac_fecha, " +
            "dfac.uni_concepto, " +
            "dfac.dfac_ideregistr," +
            "p.proyecto_ideregistro, " +
            "drec.drec_ideregistr " +
            "from fac_factura ff inner JOIN fac_factura parent ON (ff.fac_idepadre = parent.fac_ideregistro OR ff.fac_ideorigen = parent.fac_ideregistro) " +
            "inner join aseo.con_consolidacionaprovechamiento con ON (parent.fac_ideregistro = con.fac_ideregistro) " +
            "inner join per_periodo pp on ff.per_ideregistro = pp.per_ideregistro " +
            "inner join dfac_detfactura dfac on dfac.fac_ideregistro = ff.fac_ideregistro " +
            "inner join drec_detrecaudo drec on drec.dfac_ideregistr = dfac.dfac_ideregistr " +
            "inner join aseo.coli_conliquida_apro apro on (apro.uni_concepto = dfac.uni_concepto and apro.uni_liquidacion = ff.uni_liquidacion and apro.uni_documento = ff.uni_documento) " +
            "inner join proyectos p on (apro.proyecto_llacom = p.proyecto_llacom) " +
            "inner join ter_tercero ter on apro.ter_ideregistro = ter.ter_ideregistro " +
            "inner join clte_clatercero cte on cte.ter_ideregistro = ter.ter_ideregistro " +
            "where ff.fac_estado IN ('A', 'F', 'C', 'N') and ff.fac_fecha <= :limiteProcesamiento " +
            "and (select count(cc.con_idconsolidacion) from aseo.con_consolidacionaprovechamiento cc where cc.fac_ideregistro = ff.fac_ideregistro) = 0 " +
            "and ff.emp_ideregistro = :idempresa and pp.per_fecinicial <= :periodo and dfac.uni_concepto in :uniConList " +
            "and drec.drec_fecha <= :limiteProcesamiento and ff.fac_idepadre is not null " +
            "and cte.uni_clatercero = :clatercero and apro.emp_ideregistro = :idempresa " +
            "and ff.fac_idepadre is not null or ff.fac_ideorigen is not null ", nativeQuery = true)
    List<Object[]> obtenerDetallesFacturasConciliadasHijasXRecaudo(@Param("limiteProcesamiento") Date limiteProcesamiento,
                                                                   @Param("periodo") Date periodo,
                                                                   @Param("uniConList") List<Integer> uniConList,
                                                                   @Param("idempresa") Integer idempresa,
                                                                   @Param("clatercero") Integer clatercero);

    @Query(value = "select " +
            "ff.fac_ideregistro, " +
            "ff.uni_liquidacion, " +
            "ff.per_ideregistro, " +
            "ff.fin_ideregistro, " +
            "ff.amo_ideregistro, " +
            "ff.fac_vlrreal, " +
            "ff.fac_estado, " +
            "ff.fac_fecha, " +
            "dfac.uni_concepto, " +
            "dfac.dfac_ideregistr, " +
            "p.proyecto_ideregistro " +
            "from fac_factura ff inner JOIN fac_factura parent ON (ff.fac_idepadre = parent.fac_ideregistro OR ff.fac_ideorigen = parent.fac_ideregistro) " +
            "inner join aseo.con_consolidacionaprovechamiento con ON (parent.fac_ideregistro = con.fac_ideregistro) " +
            "inner join per_periodo pp on ff.per_ideregistro = pp.per_ideregistro " +
            "inner join dfac_detfactura dfac on dfac.fac_ideregistro = ff.fac_ideregistro " +
            "inner join aseo.coli_conliquida_apro apro on (apro.uni_concepto = dfac.uni_concepto and apro.uni_liquidacion = ff.uni_liquidacion and apro.uni_documento = ff.uni_documento) " +
            "inner join proyectos p on (apro.proyecto_llacom = p.proyecto_llacom) " +
            "inner join ter_tercero ter on apro.ter_ideregistro = ter.ter_ideregistro " +
            "inner join clte_clatercero cte on cte.ter_ideregistro = ter.ter_ideregistro " +
            "where ff.fac_estado IN ('A', 'F', 'C', 'N') and ff.fac_fecha <= :limiteProcesamiento " +
            "and (select count(cc.con_idconsolidacion) from aseo.con_consolidacionaprovechamiento cc where cc.fac_ideregistro = ff.fac_ideregistro) = 0 " +
            "and ff.emp_ideregistro = :idempresa and pp.per_fecinicial <= :periodo and dfac.uni_concepto in :uniConList " +
            "and cte.uni_clatercero = :clatercero and apro.emp_ideregistro = :idempresa " +
            "and ff.fac_idepadre is not null or ff.fac_ideorigen is not null ", nativeQuery = true)
    List<Object[]> obtenerDetallesFacturasConciliadasHijasXNota(@Param("limiteProcesamiento") Date limiteProcesamiento,
                                                                @Param("periodo") Date periodo,
                                                                @Param("uniConList") List<Integer> uniConList,
                                                                @Param("idempresa") Integer idempresa,
                                                                @Param("clatercero") Integer clatercero);

    @Query(value = "select dd.uni_municipio " +
            "from fac_factura ff " +
            "inner join dsus_detsuscrip dd on (ff.dsus_ideregistr = dd.dsus_ideregistr) " +
            "where ff.fac_ideregistro = :facIderegistro and ff.emp_ideregistro = :idempresa ", nativeQuery = true)
    Optional<BigInteger> obtenerIdMunicipioPorIdFactura(@Param("facIderegistro") Long facIderegistro, @Param("idempresa") Integer idempresa);

    @Query(value = "select p.proyecto_ideregistro " +
            "from aseo.coli_conliquida_apro apro " +
            "inner join proyectos p on (apro.proyecto_llacom = p.proyecto_llacom) " +
            "where apro.uni_concepto = :uniConcepto " +
            "and apro.uni_liquidacion = :uniLiquidacion " +
            "and apro.uni_documento = :uniDocumento ", nativeQuery = true)
    Integer proyectoIderegistro(@Param("uniConcepto") Integer uniConcepto, @Param("uniLiquidacion") Integer uniLiquidacion,
                                @Param("uniDocumento") Integer uniDocumento);

    @Query(value = "select ff.fac_numero from fac_factura ff " +
            "where ff.fac_ideregistro = :facIderegistro ", nativeQuery = true)
    Optional<BigInteger> getNumeroFactura(@Param("facIderegistro") Long facIderegistro);

    @Query(value = "SELECT ff.*  FROM fac_factura ff inner join per_periodo pp on ff.per_ideregistro = pp.per_ideregistro " +
            "WHERE ff.fac_estado = 'A' and ff.emp_ideregistro = '317' and ff.dsus_ideregistr = :idregistro ORDER BY pp.per_fecfinal desc", nativeQuery = true)
    List<FacFactura> getFacFacturaByDsuscripId(@Param("idregistro") Integer idregistro);
}