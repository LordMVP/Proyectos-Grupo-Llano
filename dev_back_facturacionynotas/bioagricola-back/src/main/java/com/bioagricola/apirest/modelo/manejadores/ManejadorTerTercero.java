package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.TerTercero;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.TerceroFactProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad TerTercero.
 *
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorTerTercero extends ManejadorCrud<TerTercero, Long>, IManejadorCrud<TerTercero, Long> {

    /**
     * Método de consulta de terceros según nombre
     */
    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "where clte.uniClatercero in :clasificaciones " +
            "and upper(ter.terNomcompleto) like %:nombre%")
    List<TerTercero> consultaTercerosAprovechadoresPorNombre(
            @Param("nombre") String nombre,
            @Param("clasificaciones") List<Integer> clasificaciones);

    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "where clte.uniClatercero in :clasificaciones ")
    List<TerTercero> consultaTercerosIncentivoAprovechador(
            @Param("clasificaciones") List<Integer> clasificaciones);

    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "inner join DsusDetsuscrip dd on dd.terIderegistro = ter.terIderegistro " +
            "where clte.uniClatercero = :clasificacion ")
    List<TerTercero> consultaTercerosIncentivoAprovechadorOAprovechador(
            @Param("clasificacion") Integer clasificacion);

    /**
     * Método de consulta de terceros según documento
     */
    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "where clte.uniClatercero in :clasificaciones " +
            "and ter.terDocumento like %:documento%")
    List<TerTercero> consultaTercerosAprovechadoresPorDocumento(
            @Param("documento") String documento,
            @Param("clasificaciones") List<Integer> clasificaciones);
    
    
    /**
     * Método de consulta de terceros según documento y digito
     */
    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "where clte.uniClatercero in :clasificaciones " +
            "and ter.terDigverificacion = :digito")
    List<TerTercero> consultaTercerosAprovechadoresPorDigito(
            @Param("digito") Short digito,
            @Param("clasificaciones") List<Integer> clasificaciones);

    /**
     * Método de consulta de terceros según documento y digito
     */
    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "where clte.uniClatercero in :clasificaciones " +
            "and ter.terDocumento like %:documento% " +
            "and ter.terDigverificacion = :digito")
    List<TerTercero> consultaTercerosAprovechadoresPorDocumentoYDigito(
            @Param("documento") String documento,
            @Param("digito") Short digito,
            @Param("clasificaciones") List<Integer> clasificaciones);


    /**
     * Método de consulta de terceros según la clasificacion
     */
    @Query("select ter " +
            "from ClteClatercero clte " +
            "inner join TerTercero ter " +
            "on ter.terIderegistro = clte.terIderegistro " +
            "where clte.uniClatercero = :clasificacion ")
    List<TerTercero> consultaTercerosAprovechadoresPorClasificacion(@Param("clasificacion") Integer clasificacion);

    /**
     * Método para consultar informacion adicional del tercero
     *
     * @return
     */
    @Query("Select ter from TerTercero ter where ter.terIderegistro= :terIderegistro")
    List<TerTercero> consultaTerceroInfoAdicional(@Param("terIderegistro") Long terIderegistro);


    @Query("select distinct tt.terNombre from TerTercero tt "
            + "inner join DsusDetsuscrip dd on dd.terIderegistro = tt.terIderegistro "
            + "where dd.empIderegistro = :idEmpresa")
    List<String> consultarNombresPorEmpresa(
            @Param("idEmpresa") int idEmpresa);

    /**
     * Método para consultar terceros asociados a facturas de un determinado periodo de liquidacion
     *
     * @param maprcIderegistr
     * @param idempresa
     * @return List<TerceroFactProjection>
     */
    @Query(value = "select distinct tt.ter_nomcompleto,tt.ter_ideregistro from aseo.aprconc_conciliacion ac \n" +
                        "inner join aseo.maprc_maestroconciliacion mm on ac.maprc_ideregistr = mm.maprc_ideregistr\n" +
                        "inner join aseo.prl_liquidacionapro pl on mm.per_ideregistro = pl.per_ideregistro and mm.usu_ideregistro = pl.prl_usu_ideregistro\n" +
                        "inner join public.ter_tercero tt on tt.ter_ideregistro = ac.ter_ideregistro \n" +
                    "where pl.prl_estado in ('A','P') and mm.maprc_ideregistr in (:maprcideregistr) and mm.emp_ideregistro = :idempresa ", nativeQuery = true)
    List<TerceroFactProjection> consultaTerceroPorPeriodoFac(@Param("idempresa") Integer idempresa,@Param("maprcideregistr") List<Long> maprcIderegistr);

    Page<TerTercero> findAll(Specification specification, Pageable pageable);

    @Query("Select ter from TerTercero ter where ter.terIderegistro = :terIderegistro")
    TerTercero consultaTerceroInfo(@Param("terIderegistro") Long terIderegistro);
}



