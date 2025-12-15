package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.entidades.DsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad DsusDetsuscrip.
 *
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorDsusDetsuscrip extends ManejadorCrud<DsusDetsuscrip, Long>,
        IManejadorCrud<DsusDetsuscrip, Long>, PagingAndSortingRepository<DsusDetsuscrip, Long> {

    @Query("select dd.dsusIderegistr as ID_SUSCRIPCION, " + "fac.facNumero as NUMERO_FACTURA, "
            + "dd.dsusPcodigo as CODIGO, " + "dd.dsusEstado as ESTADO, " + "uu.uniNombre1 as TIPO_USO,   "
            + "dd.proCatestrato as ESTRATO, " + "tt.terNomcompleto as NOMBRE_COMPLETO,   "
            + "tt.terDocumento as DOCUMENTO_TERCERO, " + "pp.proDireccion as DIRECCION,   "
            + "b2.barrioNom as BARRIO,   " + "pp.proNumcatastral as CATASTRAL, " + "cc.cicNombre as CICLO,   "
            + "dd.cicIderegistro as ID_CICLO,   " + "ll.uniDocumento as UNI_DOCUMENTO, "
            + " fac.facVlrreal as tarifa_original, " + "ll.uniTipdocument as UNI_TIPDOCUMENTO   "
            + "from DsusDetsuscrip dd " + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "where dd.dsusIderegistr =:idSuscripcion " + "and dd.empIderegistro =:idEmpresa ")
    public List<Object[]> consultaDetalleSusDeshabitado(@Param("idSuscripcion") Long idSuscripcion,
                                                        @Param("idEmpresa") int idEmpresa);

    /**
     * Consulta de las suscripciones reliquidadas al procesar
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @param pageable
     * @param integer
     * @param idUsuario
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.SuscripcionReliquidadaDTO(fn.dsusIderegistr as ID_SUSCRIPCION,  "
            + "fn.facIderegistro as NUMERO_FACTURA, " + "uu.uniNombre1 as TIPO_USO, "
            + "dd.dsusPcodigo as CODIGO_ANTERIOR, " + "CONCAT(pp.perNombre, ' - ', fn.cicAno ) as PERIODO, "
            + "cc.cicNombre as CICLO, " + "e2.empresaNom as EMPRESA_ALTERNA, "
            + "ff.facVlrreal as TOTAL_FINAL_FACTURADA, " + "fn.facVlrreal as TOTAL_FINAL_DESCUENTO, "
            + "(ff.facVlrreal - fn.facVlrreal) as TOTAL_DESCUENTO) " + "from FacNovedad fn "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa "
            + "and fn.usuIderegistro =:idUsuario " + "and fn.tipoNota =:tipoNota ")

    public List<SuscripcionReliquidadaDTO> consultaSuscripcionesReliquidadas(
            @Param("idSuscripciones") List<Long> idSuscripciones, @Param("idEmpresa") int idEmpresa, Pageable pageable,
            @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota);

    /**
     * Consulta de las suscripciones reliquidadas al procesar
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.ReporteSuscripcionesReliquidadasDTO(fn.dsusIderegistr as ID_SUSCRIPCION,  "
            + "fn.facIderegistro as NUMERO_FACTURA, " + "dd.dsusPcodigo as CODIGO_ANTERIOR, "
            + "CONCAT(tt.terNombre, ' ', tt.terApellido ) as NOMBRE, " + "tt.terDocumento as DOCUMENTO, "
            + "pp2.proDireccion as DIRECCION, " + "b2.barrioNom as BARRIO, "
            + "CONCAT(pp.perNombre, ' - ', fn.cicAno ) as PERIODO_DESHABITADO, " + "cc.cicNombre as CICLO, "
            + "e2.empresaNom as EMPRESA_ALTERNA, " + "dd.proCatestrato as ESTRATO, "
            + "(ff.facVlrreal - fn.facVlrreal) as TOTAL_DESCUENTO_DESHABITADO) " + "from FacNovedad fn  "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro  "
            + "inner join ProPropiedad pp2 on pp2.proIderegistro = dd.proIderegistro  "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa")
    public List<ReporteSuscripcionesReliquidadasDTO> consultaSuscripcionesReliquidadasReport(
            @Param("idSuscripciones") List<Long> idSuscripciones, @Param("idEmpresa") int idEmpresa);

    /**
     * Consulta de conteo de resultados para definir el número de páginas para el
     * paginador de la tabla
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @param integer
     * @param idUsuario
     * @return
     */
    @Query("select COUNT(distinct fn.facIderegistro) " + "from FacNovedad fn "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa "
            + "and fn.usuIderegistro =:idUsuario " + "and fn.tipoNota =:tipoNota")
    public BigInteger conteoConsultaSuscripcionesReliquidadas(@Param("idSuscripciones") List<Long> idSuscripciones,
                                                              @Param("idEmpresa") int idEmpresa, @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota);

    /**
     * Consulta de los conceptos con diferencia para las suscripciones reliquidadas
     * (Se llama cuando se da clic en ver detalle)
     *
     * @param facIderegistro
     * @param idEmpresa
     * @param idUsuario
     * @return
     */
    @Query("select DISTINCT new com.bioagricola.apirest.modelo.dtos.ConceptoSuscripcionReliquidadaDTO(cc.conNombre as NOMBRE_CONCEPTO,  "
            + "dd2.dfacVlrtotal as TOTAL_FINAL_FACTURADA, " + "dd.dfacVlrtotal as TARIFA_FINAL_DESCUENTO, "
            + "(dd2.dfacVlrtotal - dd.dfacVlrtotal) as TOTAL_DESCUENTO, " + "fn.dsusIderegistr as ID_SUSCRIPCION, "
            + "CONCAT(pp.perNombre, ' - ', fn.cicAno ) as PERIODO_DESCUENTO, " + "tt.terNomcompleto as TERCERO, "
            + "tt.terDocumento as NUMERO_DOCUMENTO, " + "pp2.proDireccion as DIRECCION, "
            + "uu.uniNombre1 as UNI_DOCUMENTO, " + "uu2.uniNombre1 as UNI_TIPDOCUMENTO ) " + "from DfacDetnovedad dd  "
            + "inner join ConConcepto cc on cc.uniConcepto = dd.uniConcepto  "
            + "inner join DfacDetfactura dd2 on dd2.dfacIderegistr = dd.dfacIdepadre  "
            + "inner join FacNovedad fn on fn.facIderegistro = dd.facIderegistro  "
            + "inner join DsusDetsuscrip dd3 on dd3.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join TerTercero tt on tt.terIderegistro = dd3.terIderegistro  "
            + "inner join ProPropiedad pp2 on pp2.proIderegistro = dd3.proIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd3.uniLiquidacion  "
            + "inner join UniUnidad uu on uu.uniIderegistro = ll.uniDocumento "
            + "inner join UniUnidad uu2 on uu2.uniIderegistro = ll.uniTipdocument "
            + "where dd.facIderegistro = :facIderegistro " + "and dd.dfacIdepadre > 0 "
            + "and fn.empIderegistro = :idEmpresa " + "and fn.usuIderegistro = :idUsuario ")
    public List<ConceptoSuscripcionReliquidadaDTO> consultaConceptosSuscripcionesReliquidadas(
            @Param("facIderegistro") Long facIderegistro, @Param("idEmpresa") int idEmpresa,
            @Param("idUsuario") int idUsuario);

    @Query("select DISTINCT new com.bioagricola.apirest.modelo.dtos.ConceptoSuscripcionReliquidadaDTO ( "
            + "dd2.dfacIderegistr as ID_DETALLE, dd2.uniConcepto as ID_CONCEPTO,  cc.conNombre as NOMBRE_CONCEPTO,  "
            + "dd2.dfacVlrreal as VALOR_EMITIDO, coalesce  (dd.dfacVlrreal, 0.0 ) as VALOR_ADICIONAR, "
            + "0 as PORCENTAJE, 0 as SALDO, true as DISABLED_INPUT) "
            + "from DfacDetfactura dd2  "
            + "inner join ConConcepto cc on cc.uniConcepto = dd2.uniConcepto  "
            + "left  join DfacDetnovedad dd on dd2.facIderegistro = dd.facIderegistro  and dd2.uniConcepto = dd.uniConcepto and dd.tipoNota = :tipoNota "
            + "and dd.empIderegistro = :idEmpresa and dd.usuIderegistro = :idUsuario "
            + "inner join FacFactura ff on ff.facIderegistro = dd2.facIderegistro "
            + "where ff.facIderegistro = :facIderegistro and (case when ff.facIdepadre is null then 0 else ff.facIdepadre end ) = 0 "
            + "order by ID_CONCEPTO, VALOR_ADICIONAR desc")
    public List<ConceptoSuscripcionReliquidadaDTO> consultaConceptosDeuda(
            @Param("facIderegistro") Long facIderegistro, @Param("idEmpresa") int idEmpresa,
            @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota);

    @Query("select DISTINCT new com.bioagricola.apirest.modelo.dtos.ConceptoSuscripcionReliquidadaDTO ( "
            + "dd2.dfacIderegistr as ID_DETALLE, dd2.uniConcepto as ID_CONCEPTO,  cc.conNombre as NOMBRE_CONCEPTO,  "
            + "dd.dfacVlrreal as VALOR_EMITIDO, coalesce  (dd2.dfacVlrreal, 0.0 ) as VALOR_ADICIONAR, "
            + "0 as PORCENTAJE, 0 as SALDO, true as DISABLED_INPUT) "
            + "from DfacDetnovedad dd2  "
            + "inner join ConConcepto cc on cc.uniConcepto = dd2.uniConcepto  "
            + "inner join FacNovedad ff on ff.facIderegistro = dd2.facIderegistro "
            + "inner join DfacDetfactura dd on dd.dfacIderegistr = dd2.dfacIdepadre "
            + "where ff.facIderegistro = :facIderegistro and (case when ff.facIdepadre is null then 0 else ff.facIdepadre end ) > 0 "
            + "order by ID_CONCEPTO, VALOR_ADICIONAR desc")
    public List<ConceptoSuscripcionReliquidadaDTO> consultaConceptosDeudaReliq(
            @Param("facIderegistro") Long facIderegistro);

    @Query("select DISTINCT new com.bioagricola.apirest.modelo.dtos.ConceptoSuscripcionReliquidadaDTO(tt.terNomcompleto as TERCERO, "
            + "uu.uniNombre1 as UNI_DOCUMENTO, " + "uu2.uniNombre1 as UNI_TIPDOCUMENTO, "
            + "dd3.dsusPcodigo as CODIGO_ANTERIOR, "
            + "pp2.proDireccion as DIRECCION ) "
            + "from FacFactura fn "
            + "inner join DsusDetsuscrip dd3 on dd3.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join TerTercero tt on tt.terIderegistro = dd3.terIderegistro  "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd3.uniLiquidacion  "
            + "inner join ProPropiedad pp2 on pp2.proIderegistro = dd3.proIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = ll.uniDocumento "
            + "inner join UniUnidad uu2 on uu2.uniIderegistro = ll.uniTipdocument "
            + "where fn.facIderegistro = :facIderegistro ")
    public ConceptoSuscripcionReliquidadaDTO consultaTerceroDeuda(
            @Param("facIderegistro") Long facIderegistro);

    @Query("select DISTINCT new com.bioagricola.apirest.modelo.dtos.ConceptoSuscripcionReliquidadaDTO(tt.terNomcompleto as TERCERO, "
            + "uu.uniNombre1 as UNI_DOCUMENTO, " + "uu2.uniNombre1 as UNI_TIPDOCUMENTO, "
            + "dd3.dsusPcodigo as CODIGO_ANTERIOR, "
            + "pp2.proDireccion as DIRECCION ) "
            + "from FacNovedad fn "
            + "inner join DsusDetsuscrip dd3 on dd3.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join TerTercero tt on tt.terIderegistro = dd3.terIderegistro  "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd3.uniLiquidacion  "
            + "inner join ProPropiedad pp2 on pp2.proIderegistro = dd3.proIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = ll.uniDocumento "
            + "inner join UniUnidad uu2 on uu2.uniIderegistro = ll.uniTipdocument "
            + "where fn.facIderegistro = :facIderegistro ")
    public ConceptoSuscripcionReliquidadaDTO consultaTerceroDeudaReliq(
            @Param("facIderegistro") Long facIderegistro);

    /**
     * Consulta de las suscripciones a las cuales se les planea realizar una
     * marcación a futuro
     *
     * @param list
     * @param idEmpresa
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.MarcacionTarifaDTO(dd.dsusIderegistr as idSuscripcion,  "
            + "uu.uniNombre1 as tipoUso,  " + "dd.dsusPcodigo as codigoAnterior,  " + "cc.cicNombre as ciclo, "
            + "e2.empresaNom as empresaAlterna,  " + "dd.proCatestrato as estrato) " + "from DsusDetsuscrip dd   "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' "
            + "and dd.dsusIderegistr IN :idSuscripciones  " + "and dd.empIderegistro =:idEmpresa ")
    public List<MarcacionTarifaDTO> consultaDetalleMarcacionTarifa(@Param("idSuscripciones") List<Long> idSuscripciones,
                                                                   @Param("idEmpresa") int idEmpresa, Pageable pageable);

    /**
     * Conteo de resultados de la lista de suscripciones que se planea hacer una
     * marcación a futuro
     *
     * @param list
     * @param idEmpresa
     * @return
     */
    @Query("select COUNT(distinct dd.dsusIderegistr) " + "from DsusDetsuscrip dd "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' "
            + "and dd.dsusIderegistr IN :idSuscripciones  " + "and dd.empIderegistro =:idEmpresa ")
    public BigInteger conteoConsultaDetalleMarcacionTarifa(@Param("idSuscripciones") List<Long> idSuscripciones,
                                                           @Param("idEmpresa") int idEmpresa);

    @Query("select con.conNombre, fac.facIderegistro, fac.facVlrreal as tarifaFinal , "
            + "fac.facVlrreal as tarifa_original " + "from FacFactura fac "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fac.dsusIderegistr "
            + "inner join DfacDetfactura dfac  on dfac.facIderegistro = fac.facIderegistro "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro "
            + "inner join ConConcepto con on con.uniConcepto = dfac.uniConcepto "
            + "where fac.dsusIderegistr=:idSuscripcion " + "and dd.empIderegistro =:idEmpresa ")
    public List<Object[]> consultaConceptosDeshabitado(@Param("idSuscripcion") Long idSuscripcion,
                                                       @Param("idEmpresa") int idEmpresa);

    @Query("select distinct dd.dsusIderegistr as ID_SUSCRIPCION, " + "dd.dsusPcodigo as CODIGO, "
            + "dd.dsusEstado as ESTADO, " + "uu.uniNombre1 as TIPO_USO,   " + "dd.proCatestrato as ESTRATO, "
            + "tt.terNomcompleto as NOMBRE_COMPLETO,   " + "tt.terDocumento as DOCUMENTO_TERCERO, "
            + "pp.proDireccion as DIRECCION,   " + "b2.barrioNom as BARRIO,   " + "pp.proNumcatastral as CATASTRAL, "
            + "cc.cicNombre as CICLO,   " + "dd.cicIderegistro as ID_CICLO,   " + "ll.uniDocumento as UNI_DOCUMENTO, "
            + "ll.uniTipdocument as UNI_TIPDOCUMENTO   " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro   "
            + "inner join FacFactura ff on ff.dsusIderegistr = dd.dsusIderegistr "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR ff.facFecha BETWEEN :desde AND :hasta ) ")
    public List<Object[]> consultaDetalle(@Param("idSuscripcion") Long idSuscripcion,
                                          @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                          @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                          @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                          @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                          @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta, Pageable pageable);

    @Query("select distinct dd.dsusIderegistr as ID_SUSCRIPCION, " + "dd.dsusPcodigo as CODIGO, "
            + "dd.dsusEstado as ESTADO, " + "uu.uniNombre1 as TIPO_USO,   " + "dd.proCatestrato as ESTRATO, "
            + "tt.terNomcompleto as NOMBRE_COMPLETO,   " + "tt.terDocumento as DOCUMENTO_TERCERO, "
            + "pp.proDireccion as DIRECCION,   " + "b2.barrioNom as BARRIO,   " + "pp.proNumcatastral as CATASTRAL, "
            + "cc.cicNombre as CICLO,   " + "dd.cicIderegistro as ID_CICLO,   " + "ll.uniDocumento as UNI_DOCUMENTO, "
            + "ll.uniTipdocument as UNI_TIPDOCUMENTO,   " + "fac.facIderegistro as FAC_IDREGISTRO,  "
            + "pp2.perNombre as PER_NOMBRE,  " + "dd2.dfacVlrtotal as ESTRATO_ANTERIOR  " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro   "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = fac.facIderegistro  "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null "
            + "AND fac.uniDocumento = :tipoDocumentoParametrp  " + "AND dd2.uniConcepto = :parametroEstrato")
    public List<Object[]> consultaDetalleEstrato(@Param("idSuscripcion") Long idSuscripcion,
                                                 @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                 @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                 @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                 @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                 @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                                 @Param("tipoDocumentoParametrp") Integer tipoDocumentoParametrp,
                                                 @Param("parametroEstrato") Integer parametroEstrato, Pageable pageable);

    @Query("select distinct dd.dsusIderegistr as ID_SUSCRIPCION, " + "dd.dsusPcodigo as CODIGO, "
            + "fac.facIderegistro AS NUMERO_FACTURA, " + "CONCAT( pp2.perNombre,' - ',fac.cicAno) AS PERIODO, "
            + "(select uniNombre1 from UniUnidad  where uniIderegistro  = fac.uniTipusosuscr) AS TIPO_USO_ANTERIOR,"
            + "uu.uniNombre1 as TIPO_USO_ACTUAL,  " + "dd.dsusEstado as ESTADO, " + "dd.proCatestrato as ESTRATO, "
            + "tt.terNomcompleto as NOMBRE_COMPLETO,   " + "tt.terDocumento as DOCUMENTO_TERCERO, "
            + "pp.proDireccion as DIRECCION,   " + "b2.barrioNom as BARRIO,   " + "pp.proNumcatastral as CATASTRAL, "
            + "cc.cicNombre as CICLO   " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null ")
    public List<Object[]> consultaDetalleTipoUso(@Param("idSuscripcion") Long idSuscripcion,
                                                 @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                 @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                 @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                 @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                 @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta, Pageable pageable);

    /**
     * Consulta de facturas de una suscripción aforada
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param idEmpresa
     * @param desde
     * @param hasta
     * @param uniConeptoAforoExtraOrdinario
     * @param pageable
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.ConsultaDetalleSuscripcionDTO(dd.dsusIderegistr as ID_SUSCRIPCION, "
            + "dd.dsusPcodigo as CODIGO, " + "fac.facIderegistro AS NUMERO_FACTURA, "
            + "CONCAT( pp2.perNombre,' - ',fac.cicAno) AS PERIODO, " + "dd2.dfacVlrreal as ORDNIADRIO, "
            + "dd.proCatestrato as ESTRATO, " + "dd.dsusEstado as ESTADO, " + "uu.uniNombre1 as TIPO_USO_ACTUAL,  "
            + "tt.terNomcompleto as NOMBRE_COMPLETO,   " + "tt.terDocumento as DOCUMENTO_TERCERO, "
            + "pp.proDireccion as DIRECCION,   " + "b2.barrioNom as BARRIO,   " + "pp.proNumcatastral as CATASTRAL, "
            + "cc.cicNombre as CICLO ) " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = fac.facIderegistro "
            + "inner join Reclamos rec on rec.reclamoCodsus = dd.dsusPcodigo " + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "and (:uniConeptoAforoExtraOrdinario is null OR dd2.uniConcepto =:uniConeptoAforoExtraOrdinario) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null " + "AND rec.reclamoNumpqr =:numeroPqr ")
    public List<ConsultaDetalleSuscripcionDTO> consultaDetalleAforados(@Param("idSuscripcion") Long idSuscripcion,
                                                                       @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                                       @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                                       @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                                       @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                                       @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                                                       @Param("uniConeptoAforoExtraOrdinario") Integer uniConeptoAforoExtraOrdinario,
                                                                       @Param("numeroPqr") String numeroPqr, Pageable pageable);
    
    
    @Query(value = "select dd.dsus_ideregistr ID_SUSCRIPCION, dd.dsus_pcodigo CODIGO, ff.fac_ideregistro NUMERO_FACTURA, \n" +
"concat(pp.per_nombre,' - ',ff.cic_ano) PERIODO, df.dfac_vlrtotal ORDNIADRIO, dd.pro_catestrato ESTRATO, \n" +
"dd.dsus_estado ESTADO, uu.uni_nombre1 TIPO_USO_ACTUAL, tr.ter_nomcompleto NOMBRE_COMPLETO, \n" +
"tr.ter_documento DOCUMENTO_TERCERO, po.pro_direccion DIRECCION, b.barrio_nom BARRIO, po.pro_numcatastral CATASTRAL, \n" +
"cc.cic_nombre CICLO \n" +
"from public.dsus_detsuscrip dd \n" +
"inner join public.fac_factura ff on ff.dsus_ideregistr = dd.dsus_ideregistr  \n" +
"inner join public.dfac_detfactura df on df.fac_ideregistro = ff.fac_ideregistro \n" +
"inner join public.tido_tipdocumen tt on tt.uni_tipdocument = ff.uni_tipdocument \n" +
"inner join public.per_periodo pp on pp.per_ideregistro = ff.per_ideregistro \n" +
"inner join public.uni_unidad uu on uu.uni_ideregistro = dd.uni_tipusosuscr \n" +
"inner join public.ter_tercero tr on tr.ter_ideregistro = dd.ter_ideregistro \n" +
"inner join public.pro_propiedad po on po.pro_ideregistro = dd.pro_ideregistro \n" +
"inner join public.barrios b on b.barrio_ideregistro = dd.uni_barrio \n" +
"inner join public.cic_ciclo cc on cc.cic_ideregistro = ff.cic_ideregistro \n" +
"where (:idSuscripcion is null OR dd.dsus_ideregistr  =:idSuscripcion)\n" +
"and dd.emp_ideregistro =:idEmpresa \n" +
"AND (coalesce(:desde, null) is null OR ff.fac_fecha BETWEEN :desde AND :hasta ) \n" +
"AND ff.fac_estado = 'A'  AND ff.fac_idepadre  is null \n" +
"and (:uniConeptoAforoExtraOrdinario is null OR df.uni_concepto =:uniConeptoAforoExtraOrdinario) \n" +
"and tt.tido_estado = 'A' ", nativeQuery = true)
    public List<Object []> consultaDetalleAforados(@Param("idSuscripcion") Long idSuscripcion,
                                                                       //@Param("codAntSuscripcion") String codAntSuscripcion, 
                                                                       @Param("idEmpresa") int idEmpresa,
                                                                       @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                                                       @Param("uniConeptoAforoExtraOrdinario") Integer uniConeptoAforoExtraOrdinario,
                                                                       Pageable pageable);
    
    

    /**
     * Método de consulta de facturas de suscripciones para eliminación/adición de
     * deuda
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param idEmpresa
     * @param desde
     * @param hasta
     * @param pageable
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.ConsultaDetalleSuscripcionDTO(dd.dsusIderegistr as ID_SUSCRIPCION, "
            + "dd.dsusPcodigo as CODIGO, " + "fac.facIderegistro AS NUMERO_FACTURA, "
            + "CONCAT( pp2.perNombre,' - ',fac.cicAno) AS PERIODO, " + "dd.proCatestrato as ESTRATO, "
            + "dd.dsusEstado as ESTADO, " + "uu.uniNombre1 as TIPO_USO,  " + "tt.terNomcompleto as NOMBRE_COMPLETO,   "
            + "tt.terDocumento as DOCUMENTO_TERCERO, " + "pp.proDireccion as DIRECCION,   "
            + "b2.barrioNom as BARRIO,   " + "pp.proNumcatastral as CATASTRAL, "
            + "cc.cicNombre as CICLO, fac.facSdoreal as VALOR_EMITIDO, " + "SUM(dd3.dfacSdoreal) as VALOR_AJUSTAR, "
            + "0.0 as SALDO_EMITIDO," + "dd.dsusEstado as ESTADO_SUSCRIPCION ) " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = fac.facIderegistro "
            + "left join DfacDetnovedad dd3 on dd3.facIderegistro = fac.facIderegistro "
            + "and dd3.uniConcepto = dd2.uniConcepto "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null " + "group by fac.facIderegistro, "
            + "dd.dsusIderegistr, " + "dd.dsusPcodigo, " + "fac.facIderegistro, " + "pp2.perNombre, " + " fac.cicAno, "
            + "dd.proCatestrato, " + "dd.dsusEstado, " + "uu.uniNombre1,  " + "tt.terNomcompleto, "
            + "tt.terDocumento, " + "pp.proDireccion, " + "b2.barrioNom, " + "pp.proNumcatastral,  "
            + "cc.cicNombre, fac.facVlrreal,  " + "dd.dsusEstado")
    public List<ConsultaDetalleSuscripcionDTO> consultaDetalleNotaDeuda(@Param("idSuscripcion") Long idSuscripcion,
                                                                        @Param("nombreTercero") String nombreTercero,
                                                                        @Param("documentoTercero") String documentoTercero,
                                                                        @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                                        @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                                        @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                                        @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta, Pageable pageable);


    /**
     * Consulta de conteo de resultados para definir el número de páginas para
     * suscripciones para descuentoi por deshabitado o puerta a puerta
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param idEmpresa
     * @param desde
     * @param hasta
     * @return
     */
    @Query("select COUNT(distinct dd.dsusIderegistr) " + " from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro   "
            + "inner join FacFactura ff on ff.dsusIderegistr = dd.dsusIderegistr "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento)  "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral)  "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion)  "
            + "AND (coalesce(:desde, null) is null OR ff.facFecha BETWEEN :desde AND :hasta ) ")
    public BigInteger conteoConsultaDetalle(@Param("idSuscripcion") Long idSuscripcion,
                                            @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                            @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                            @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                            @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                            @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta);

    @Query("select COUNT(distinct dd.dsusIderegistr) " + " from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro   "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr  "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro  "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = fac.facIderegistro  "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.uniDocumento = :tipoDocumentoParametrp  " + "AND dd2.uniConcepto = :parametroEstrato "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null ")
    public BigInteger conteoConsultaDetalleEstrato(@Param("idSuscripcion") Long idSuscripcion,
                                                   @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                   @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                   @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                   @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                   @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                                   @Param("tipoDocumentoParametrp") Integer tipoDocumentoParametrp,
                                                   @Param("parametroEstrato") Integer parametroEstrato);

    @Query("select COUNT (DISTINCT fac.facIderegistro)" + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null ")
    public BigInteger conteoConsultaDetalleTipoUso(@Param("idSuscripcion") Long idSuscripcion,
                                                   @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                   @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                   @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                   @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                   @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta);

    /**
     * Consulta de conteo de resultados para la consulta de facturas de una
     * suscripción aforada
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param idEmpresa
     * @param desde
     * @param hasta
     * @param uniConeptoAforoExtraOrdinario
     * @param numeroPqr
     * @param pageable
     * @return
     */
    @Query("select COUNT(distinct fac.facIderegistro) " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = fac.facIderegistro "
            + "inner join Reclamos rec on rec.reclamoCodsus = dd.dsusPcodigo " + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "and (:uniConeptoAforoExtraOrdinario is null OR dd2.uniConcepto =:uniConeptoAforoExtraOrdinario) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null " + "AND rec.reclamoNumpqr =:numeroPqr ")
    public BigInteger conteoConsultaDetalleAforados(@Param("idSuscripcion") Long idSuscripcion,
                                                    @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                    @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                    @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                    @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                    @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                                    @Param("uniConeptoAforoExtraOrdinario") Integer uniConeptoAforoExtraOrdinario,
                                                    @Param("numeroPqr") String numeroPqr);
    
    
    @Query(value = "select count(distinct ff.fac_ideregistro) from public.dsus_detsuscrip dd \n" +
"inner join public.fac_factura ff on ff.dsus_ideregistr = dd.dsus_ideregistr  \n" +
"inner join public.dfac_detfactura df on df.fac_ideregistro = ff.fac_ideregistro \n" +
"inner join public.tido_tipdocumen tt on tt.uni_tipdocument = ff.uni_tipdocument \n" +
"where (:idSuscripcion is null OR dd.dsus_ideregistr  =:idSuscripcion) \n" +
"and dd.emp_ideregistro =:idEmpresa \n" +
"AND (coalesce(:desde, null) is null OR ff.fac_fecha BETWEEN :desde AND :hasta ) \n" +
"AND ff.fac_estado = 'A'  AND ff.fac_idepadre  is null \n" +
"and (:uniConeptoAforoExtraOrdinario is null OR df.uni_concepto =:uniConeptoAforoExtraOrdinario) \n" +
"and tt.tido_estado = 'A' ", nativeQuery = true)
    public BigInteger conteoConsultaDetalleAforados(@Param("idSuscripcion") Long idSuscripcion,
                                                    //@Param("codAntSuscripcion") String codAntSuscripcion, 
                                                    @Param("idEmpresa") int idEmpresa,
                                                    @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                                    @Param("uniConeptoAforoExtraOrdinario") Integer uniConeptoAforoExtraOrdinario);
    
    

    /**
     * Consulta de conteo de resultados para la consulta de facturas de una
     * suscripción para eliminación o adición de deuda
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param idEmpresa
     * @param desde
     * @param hasta
     * @return
     */
    @Query("select COUNT(distinct fac.facIderegistro) " + "from DsusDetsuscrip dd "
            + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join Barrios b2 on b2.barrioIderegistro = dd.uniBarrio "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr "
            + "inner join FacFactura fac on fac.dsusIderegistr = dd.dsusIderegistr "
            + "inner join PerPeriodo pp2 on pp2.perIderegistro = fac.perIderegistro "
            + "inner join LiqLiquidacion ll on ll.uniLiquidacion = dd.uniLiquidacion "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = fac.facIderegistro "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
            + "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero%) "
            + "AND (:documentoTercero is null OR tt.terDocumento = :documentoTercero) "
            + "AND (:ciclo is null OR cc.cicIderegistro =:ciclo) "
            + "AND (:documento is null OR ll.uniDocumento =:documento) "
            + "AND (:tipoDocumento is null OR ll.uniTipdocument =:tipoDocumento) "
            + "AND (:numCatastral is null OR pp.proNumcatastral =:numCatastral) "
            + "AND (:codAntSuscripcion is null OR dd.dsusPcodigo =:codAntSuscripcion) "
            + "AND (coalesce(:desde, null) is null OR fac.facFecha BETWEEN :desde AND :hasta ) "
            + "AND fac.facEstado = 'A' " + "AND fac.facIdepadre is null ")
    public BigInteger conteoConsultaDetalleNotaDeuda(@Param("idSuscripcion") Long idSuscripcion,
                                                     @Param("nombreTercero") String nombreTercero, @Param("documentoTercero") String documentoTercero,
                                                     @Param("ciclo") Integer ciclo, @Param("documento") Integer documento,
                                                     @Param("tipoDocumento") Integer tipoDocumento, @Param("numCatastral") String numCatastral,
                                                     @Param("codAntSuscripcion") String codAntSuscripcion, @Param("idEmpresa") int idEmpresa,
                                                     @Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta);

    @Query("select dd.susIderegistro as ID_SUSCRIPCION, " + "tt.terNomcompleto as NOMBRE_COMPLETO "
            + "from DsusDetsuscrip dd " + "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
            + "inner join ProPropiedad pp on pp.proIderegistro = dd.proIderegistro "
            + "inner join SusSuscripcion ss on ss.susIderegistro = dd.susIderegistro  "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro   "
            + "where (:empresaId is null OR e2.empresaCod =:empresaId) "
            + "AND (:numeroMedidor is null OR pp.proIdepropieda = :numeroMedidor)  "
            + "AND (:codigoAnterior is null OR dd.dsusPcodigo = :codigoAnterior) ")
    public List<Object[]> consultaMedidorSus(@Param("empresaId") String empresaId,
                                             @Param("numeroMedidor") String numeroMedidor, @Param("codigoAnterior") String codigoAnterior);

    @Query("select dd.dsusIderegistr as ID_SUSCRIPCION " + "from DsusDetsuscrip dd "
            + "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro   "
            + "where dd.empIderegistro =:idEmpresa "
            + "AND (:registroPersona is null OR dd.susIderegistro = :registroPersona) ")
    public Long consultaFacturacionConjunta(@Param("idEmpresa") int idEmpresa,
                                            @Param("registroPersona") Long registroPersona);

    /**
     * Método para consultar terceros asociados a facturas de un determinado periodo de liquidacion
     *
     * @param idSuscripcion
     */
        @Query("  select tt.terNomcompleto, tt.terDocumento\n" +
"            from DsusDetsuscrip dd \n" +
"            inner join TerTercero tt \n" +
"            on tt.terIderegistro =dd.terIderegistro \n" +
"            where dd.dsusIderegistr  = :idSuscripcion ")
    List<String> consultarTerceroPorSuscripcion(
            @Param("idSuscripcion") Long idSuscripcion);  
    
    /**   
    
    
    /**
     * Método encargado de obtener el valor de la liquidación asociado a cada
     * suscripción
     *
     * @param suscripcion
     * @return
     */
    @Query("select dd.uniLiquidacion from DsusDetsuscrip dd " + "where dd.dsusIderegistr = :idSuscripcion")
    public Integer consultaUniLiquidacion(Integer idSuscripcion);

    @Query("select dd.cicIderegistro, " + "pp.perIderegistro,  " + "cc.cicAnoactual, " + "dd.empIderegistro,  "
            + "uu.uniIderegistro, " + "uu.estIderegistro as est_motnota,  " + "dd.usuIderegistro "
            + "from DsusDetsuscrip dd  " + "inner join PerPeriodo pp on pp.cicIderegistro = dd.cicIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro  "
            + "inner join EsemEstempresa ee on ee.id.empIderegistro = dd.empIderegistro  "
            + "inner join UniUnidad uu on uu.estIderegistro = ee.id.estIderegistro  "
            + "where dd.empIderegistro = :empresaId and pp.perEstado ='A'  "
            + "and uu.uniIderegistro = :uniIdregistro  " + "and dd.dsusIderegistr = :idSuscript")
    public List<Object[]> baseParaNota(@Param("empresaId") Integer empresaId, @Param("idSuscript") Long idSuscript,
                                       @Param("uniIdregistro") Integer uniIdregistro);

    /**
     * Consulta para obtener las suscripciones, microruta a la que pertenece, factor
     * de descuento y concepto de descunto por indicador de calidad
     *
     * @param idMicroRuta
     * @param idEmpresa
     * @return
     */
    @Query("select new com.bioagricola.apirest.modelo.dtos.SuscripPorMicroRutaDTO(dd.dsusIderegistr, vv.rutIdemicroruta, vv.vrmrValor, vv.conIderegistro) from DsusDetsuscrip dd  "
            + "inner join RrbaRutarecoleccionbarrido rr on dd.dsusIderegistr = rr.dsusIderegistr and rr.rutrecbarSwtact = 'A' "
            + "inner join VrmrVarmicroruta vv on vv.rutIdemicroruta = rr.rutIderegistro and vv.vrmrValor > 0  "
            + "where vv.perIderegistro =:idPeriodo " + "and vv.conIderegistro =:idConceptoReporteTarifas "
            + "and vv.empIderegistro =:idEmpresa ")
    public List<SuscripPorMicroRutaDTO> obtenerSuscripPorMicroRuta(
            @Param("idConceptoReporteTarifas") Integer idConceptoReporteTarifas, @Param("idPeriodo") Integer idPeriodo,
            @Param("idEmpresa") int idEmpresa);

    /**
     * Consulta para obtener la empresa con la que está homologada una suscripción,
     * para saber si está homologada con el servicio de gas o energía
     *
     * @param idSuscripcion
     * @param idEmpresasesion
     * @return
     */
    @Query(value = "select empresahomologa.* from dsus_detsuscrip dd "
            + "inner join sus_suscripcion ss on ss.sus_ideregistro = dd.sus_ideregistro "
            + "inner join lateral (select distinct dd2.emp_ideregistro from dicn_disconven dd2 "
            + "where dd2.cnre_ideregistr = ss.cnre_ideregistr and dd2.dicn_empfactura ='S') empresahomologa on true "
            + "inner join empresas e2 on empresahomologa.emp_ideregistro = e2.empresa_sevemp "
            + "where dd.dsus_ideregistr =:idSuscripcion and dd.emp_ideregistro =:idEmpresasesion", nativeQuery = true)
    public Integer obtenerEmpresaHomolgadaXSuscrip(Long idSuscripcion, Integer idEmpresasesion);

    /**
     * Consulta de las suscripciones reliquidadas por nota de estrato al procesar
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @param pageable
     * @param idUsuario
     * @param tipoNota
     * @param uniConceptoEstrato
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.SuscripcionReliquidadaDTO(fn.dsusIderegistr as ID_SUSCRIPCION,  "
            + "fn.facIderegistro as NUMERO_FACTURA, " + "uu.uniNombre1 as TIPO_USO, " + "dd.proCatestrato as ESTRATO, "
            + "dd2.dfacVlrtotal as ESTRATO_ANTERIOR, " + "dd.dsusPcodigo as CODIGO_ANTERIOR, "
            + "CONCAT(pp.perNombre, ' - ', fn.cicAno ) as PERIODO, " + "cc.cicNombre as CICLO, "
            + "e2.empresaNom as EMPRESA_ALTERNA, " + "ff.facVlrreal as TOTAL_FINAL_FACTURADA, "
            + "fn.facVlrreal as TOTAL_FINAL_DESCUENTO, "
            + "(ff.facVlrreal - fn.facVlrreal) as TOTAL_DESCUENTO_ESTRATO) " + "from FacNovedad fn "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = ff.facIderegistro  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa "
            + "and fn.usuIderegistro =:idUsuario " + "and fn.tipoNota =:tipoNota "
            + "and dd2.uniConcepto = :uniConceptoEstrato ")
    public List<SuscripcionReliquidadaDTO> consultaSuscripcionesReliquidadasEstrato(
            @Param("idSuscripciones") List<Long> idSuscripciones, @Param("idEmpresa") int idEmpresa, Pageable pageable,
            @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota,
            @Param("uniConceptoEstrato") Integer uniConceptoEstrato);

    /**
     * Conteo de suscripciones reliquidadas por concepto de nota de cambio de
     * estrato
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @param idUsuario
     * @param tipoNota
     * @param uniConceptoEstrato
     * @return
     */
    @Query("select COUNT(distinct fn.facIderegistro) " + "from FacNovedad fn "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = ff.facIderegistro  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa "
            + "and fn.usuIderegistro =:idUsuario " + "and fn.tipoNota =:tipoNota "
            + "and dd2.uniConcepto = :uniConceptoEstrato ")
    public BigInteger conteoConsultaSuscripcionesReliquidadasEstrato(
            @Param("idSuscripciones") List<Long> idSuscripciones, @Param("idEmpresa") int idEmpresa,
            @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota,
            @Param("uniConceptoEstrato") Integer uniConceptoEstrato);

    /**
     * Consulta de las suscripciones reliquidadas por nota de cambio de tipo de uso
     * al procesar
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @param pageable
     * @param idUsuario
     * @param tipoNota
     * @param uniConceptoEstrato
     * @return
     */
    @Query("select distinct new com.bioagricola.apirest.modelo.dtos.SuscripcionReliquidadaDTO(fn.dsusIderegistr as ID_SUSCRIPCION,  "
            + "fn.facIderegistro as NUMERO_FACTURA, " + "uu.uniNombre1 as TIPO_USO, "
            + "(select uniNombre1 from UniUnidad  where uniIderegistro  = ff.uniTipusosuscr) AS TIPO_USO_ANTERIOR, "
            + "dd.dsusPcodigo as CODIGO_ANTERIOR, " + "CONCAT(pp.perNombre, ' - ', fn.cicAno ) as PERIODO, "
            + "cc.cicNombre as CICLO, " + "e2.empresaNom as EMPRESA_ALTERNA, " + "dd.proCatestrato as ESTRATO, "
            + "ff.facVlrreal as TOTAL_FINAL_FACTURADA, " + "fn.facVlrreal as TOTAL_FINAL_DESCUENTO, "
            + "(ff.facVlrreal - fn.facVlrreal) as TOTAL_DESCUENTO) " + " from FacNovedad fn "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = ff.facIderegistro  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa "
            + "and fn.usuIderegistro =:idUsuario " + "and fn.tipoNota =:tipoNota ")
    public List<SuscripcionReliquidadaDTO> consultaSuscripcionesReliquidadasTipoUso(
            @Param("idSuscripciones") List<Long> idSuscripciones, @Param("idEmpresa") int idEmpresa, Pageable pageable,
            @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota);

    /**
     * Conteo de suscripciones reliquidadas por concepto de nota de cambio de tipo
     * de uso
     *
     * @param idSuscripciones
     * @param idEmpresa
     * @param idUsuario
     * @param tipoNota
     * @param uniConceptoEstrato
     * @return
     */
    @Query("select COUNT(distinct fn.facIderegistro) " + " from FacNovedad fn "
            + "inner join FacFactura ff on ff.facIderegistro = fn.facIdepadre  "
            + "inner join DfacDetfactura dd2 on dd2.facIderegistro = ff.facIderegistro  "
            + "inner join DsusDetsuscrip dd on dd.dsusIderegistr = fn.dsusIderegistr  "
            + "inner join PerPeriodo pp on pp.perIderegistro = fn.perIderegistro  "
            + "inner join CicCiclo cc on cc.cicIderegistro = dd.cicIderegistro   "
            + "inner join UniUnidad uu on uu.uniIderegistro = dd.uniTipusosuscr  "
            + "inner join SusSuscripcion suscriptor_convenio_homologacion on suscriptor_convenio_homologacion.susIderegistro  = dd.susIderegistro  "
            + "inner join DicnDisconven  detalle_convenio_homologacion on detalle_convenio_homologacion.cnreIderegistr = suscriptor_convenio_homologacion.cnreIderegistr  "
            + "inner join Empresas e2 on e2.empresaSevemp =  detalle_convenio_homologacion.empIderegistro  "
            + "where detalle_convenio_homologacion.dicnEmpfactura = 'S' " + "and fn.facIdepadre is not null "
            + "and fn.dsusIderegistr IN :idSuscripciones " + "and fn.empIderegistro = :idEmpresa "
            + "and fn.usuIderegistro =:idUsuario " + "and fn.tipoNota =:tipoNota ")
    public BigInteger conteoConsultaSuscripcionesReliquidadasTipoUso(
            @Param("idSuscripciones") List<Long> idSuscripciones, @Param("idEmpresa") int idEmpresa,
            @Param("idUsuario") int idUsuario, @Param("tipoNota") Integer tipoNota);

    @Query("SELECT dd.dsusIderegistr from DsusDetsuscrip dd inner join FacFactura ff on ff.dsusIderegistr = dd.dsusIderegistr " +
            "where ff.facIderegistro = :factura ")
    public Long obtenerMunicipioCliente(@Param("factura") Long factura);

    /**
     * Método de consulta de suscripciones por id de usuario y cliente y empresa
     */
    @Query("select sus " +
            "from DsusDetsuscrip sus " +
            "where sus.terIderegistro = :idClient and sus.empIderegistro = :idEmpresa ")
    List<DsusDetsuscrip> searchSubscriptionsByIdEmpAndIdClient(@Param("idEmpresa") int idEmpresa, @Param("idClient") Long idClient);

  /**
     * Consulta para obtener el nombre de la empresa con la que está homologada una suscripción,
     * para saber si está homologada con el servicio de gas o energía por
     *
     * @param idSuscripcion
     * @param idEmpresasesion
     * @return
     */
    @Query(value = "select distinct e2.empresa_nom from dsus_detsuscrip dd "
            + "inner join sus_suscripcion ss on ss.sus_ideregistro = dd.sus_ideregistro "
            + "inner join lateral (select distinct dd2.emp_ideregistro from dicn_disconven dd2 "
            + "where dd2.cnre_ideregistr = ss.cnre_ideregistr and dd2.dicn_empfactura ='S') empresahomologa on true "
            + "inner join empresas e2 on empresahomologa.emp_ideregistro = e2.empresa_sevemp "
            + "where dd.dsus_ideregistr =:idSuscripcion and dd.emp_ideregistro =:idEmpresasesion", nativeQuery = true)
    String obtenerEmpresaHomolgadaXSuscripNombre(Long idSuscripcion, Integer idEmpresasesion);

    @Query(value = "select ds.dsus_pcodigo from dsus_detsuscrip ds " +
            "where ds.usu_ideregistro = :usuIderegistro ", nativeQuery = true)
    Optional<BigInteger> getDsusPcodigo(@Param("usuIderegistro") Long usuIderegistro);

    @Query(value = "select ds from DsusDetsuscrip ds where ds.dsusPcodigo = :code and ds.empIderegistro = 299 ")
    Optional<DsusDetsuscrip> getByCode(@Param("code") String code);

    @Query(value = "select ds from DsusDetsuscrip ds where ds.susIderegistro = :id and ds.empIderegistro = 317 ")
    Optional<DsusDetsuscrip> getById(@Param("id") Long id);
}

