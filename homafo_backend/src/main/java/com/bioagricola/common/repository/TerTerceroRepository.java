package com.bioagricola.common.repository;

import com.bioagricola.common.entity.TerTercero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TerTerceroRepository extends JpaRepository<TerTercero, Long>, JpaSpecificationExecutor<TerTercero> {

    @Query(value = "select * from ter_tercero ter\r\n" +
            "inner join clte_clatercero clte on clte.ter_ideregistro=ter.ter_ideregistro\r\n" +
            "where clte.uni_clatercero=2688", nativeQuery = true)
    List<TerTercero> findTecnicosAforadores();

    @Query(value = "select * from ter_tercero where ter_nomcompleto ilike '%' || :nombre ||'%' limit 100", nativeQuery = true)
    List<TerTercero> findTercerosNombreLike(@Param("nombre") String nombre);

    @Query(value = "SELECT\n" +
            "ter.ter_ideregistro,\n" +
            "ter.ter_documento,\n" +
            "ter.ter_nomcompleto\n" +
            "FROM ter_tercero ter\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=ter.est_tiptercero\n" +
            "WHERE ter.uni_tiptercero= :unidad", nativeQuery = true)
    List<Object[]> tercerosTipoOld(@Param("unidad") Integer unidad);

    @Query(value = "select ter_ideregistro,ter_nomcompleto from ter_tercero where ter_nomcompleto ilike '%' || :nombre ||'%' limit 100", nativeQuery = true)
    List<Object[]> buscarTerceroNombre(@Param("nombre") String nombre);


    @Query(value = "SELECT\n" +
            "			ter.ter_ideregistro,\n" +
            "			ter.ter_documento,\n" +
            "			ter.ter_nomcompleto\n" +
            "			FROM ter_tercero ter\n" +
            "			INNER JOIN clte_clatercero clte ON clte.ter_ideregistro=ter.ter_ideregistro\n" +
            "			WHERE clte.uni_clatercero=:unidad", nativeQuery = true)
    List<Object[]> tercerosTipo(@Param("unidad") Integer unidad);

    @Query(value = "SELECT tt from TerTercero tt where tt.terDocumento = :identification")
    Optional<TerTercero> findByIdentification(@Param("identification") String identification);

    /**
     * Consulta nombres terceros
     *
     * @param name
     * @return lista nombres terceros
     */
    @Query(value = "select ter.ter_ideregistro, ter.ter_nomcompleto from ter_tercero ter where ter.ter_nomcompleto ilike :name ", nativeQuery = true)
    List<Object[]> findNamesLike(String name);

    /**
     * Valida existencia por id
     * @param id id tercero
     * @return true o false
     */
    boolean existsByTerIderegistro(Long id);


}

