package com.bioagricola.common.repository;

import com.bioagricola.common.entity.ProPropiedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.List;
import java.util.Map;


@Repository("proPropiedadRepository")
@Transactional
public interface ProPropiedadRepository extends JpaRepository<ProPropiedad, Long>, JpaSpecificationExecutor<ProPropiedad> {
    @Query(value = "SELECT uu.uni_nombre1 FROM pro_propiedad pp \n"
            + "	INNER JOIN uni_unidad uu ON pp.uni_cmpdireccion = uu.uni_ideregistro \n"
            + "	WHERE pp.pro_ideregistro = :idPropiedad", nativeQuery = true)
    String getCmpDireccionName(@Param("idPropiedad") Long idPropiedad);

    @Query(value = "SELECT pp.proDireccion FROM ProPropiedad pp \n"
            + "	WHERE pp.proIderegistro = :idPropiedad", nativeQuery = false)
    String getPropDireccion(@Param("idPropiedad") Long idPropiedad);

    /**
     * Listar propiedades por id de tercero
     *
     * @param idTercero id de tercero
     * @return true o false
     */
    @Query(value = "SELECT pp FROM ProPropiedad pp WHERE pp.terIderegistro = :idTercero")
    List<ProPropiedad> findAllByTerIderegistro(@Param("idTercero") Long idTercero);

    @Query(value = "select dsus_ideregistr from dsus_detsuscrip where pro_ideregistro =:idpropiedad", nativeQuery = true)
    BigInteger validatePropDsus(Integer idpropiedad);

    /**
     * Consulta de id municipio, id barrio por id de la propiedad
     *
     * @param idpropiedad
     * @return id municipio, id barrio
     */
    @Query(value = "select pro.uniMunicipio as uniMunicipio, pro.uniBarrio as uniBarrio from ProPropiedad pro where pro.proIderegistro=:idpropiedad")
    Map<String, Long> findMunBarrByIdPropiedad(Long idpropiedad);

    /**
     * Consulta valores de longitud y latitud por ide propiedad
     *
     * @param idpropiedad id peropiedad
     * @return longitud y latitud
     */
    @Query(value = "select pro.pro_gpslongitud as longitud, pro.pro_gpslatitud as latitud\n" +
            "from pro_propiedad pro\n" +
            "where pro.pro_ideregistro =:idpropiedad", nativeQuery = true)
    Map<String, String> getLongLatiPropiedad(@Param("idpropiedad") Long idpropiedad);
    
    
    
    /**
     * Listar propiedades por id de tercero y empresa en sesión 
     *
     * @param idTercero id de tercero
     * @return true o false
     */
    @Query(value = "SELECT pp.* FROM pro_propiedad pp  " + 
    		       "  inner join esem_estempresa ee on ee.est_ideregistro = pp.est_tippropieda  " + 
    		       "   WHERE pp.ter_ideregistro = :idTercero and ee.emp_ideregistro = :idEmpresa and pp.uni_municipio=:municipio and pp.uni_tippropieda = :tipoPropiedad ",nativeQuery= true )
    List<ProPropiedad> findAllByTerIderegistroAndIdempresa(@Param("idTercero") Long idTercero, @Param("idEmpresa") Integer idEmpresa,@Param("municipio") Integer municipio,@Param("tipoPropiedad") Integer tipoPropiedad);

    @Query(value = "select MAX(p.proSecuenciaindep) from ProPropiedad p where p.proIdpadre=:propertyId")
    Long findChildsProperty(Long propertyId);

    @Query(value = "select exists( select * from dsus_detsuscrip where pro_ideregistro=:proIderegistro)",nativeQuery = true)
    boolean existInDsus(Long proIderegistro);

    @Query(value ="select p.proIdpadre from ProPropiedad p where p.proIderegistro=:proIderegistro")
    Long findParentProperty(Long proIderegistro);

    @Query(value = "select p from ProPropiedad p where p.proIdpadre=:proIdPadre and p.proSecuenciaindep>:proSecuencia order by p.proSecuenciaindep asc")
    List<ProPropiedad> findOtherChildProperties(Long proIdPadre, Long proSecuencia);

}
