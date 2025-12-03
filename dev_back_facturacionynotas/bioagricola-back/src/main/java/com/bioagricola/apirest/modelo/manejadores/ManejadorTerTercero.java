package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.dtos.TerceroPorFactDTO;
import com.bioagricola.apirest.modelo.entidades.TerTercero;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
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
     * @param perIderegistro
     * @return List<TerceroPorFactDTO>
     */
    @Query("select new com.bioagricola.apirest.modelo.dtos.TerceroPorFactDTO (tt.terNomcompleto , tt.terIderegistro) from TerTercero tt " +
            "inner join DprlDetliquidacionapro dd on dd.terIderegistro = tt.terIderegistro " +
            "inner join FacFactura ff on ff.facIderegistro = dd.facIderegistro " +
            "inner join PerPeriodo pp2 on pp2.perIderegistro = ff.perIderegistro " +
            "where pp2.perIderegistro IN :perIderegistro group by tt.terIderegistro")
    List<TerceroPorFactDTO> consultaTerceroPorPeriodoFac(@Param("perIderegistro") List<Integer> perIderegistro);

    Page<TerTercero> findAll(Specification specification, Pageable pageable);

    @Query("Select ter from TerTercero ter where ter.terIderegistro = :terIderegistro")
    TerTercero consultaTerceroInfo(@Param("terIderegistro") Long terIderegistro);
}



