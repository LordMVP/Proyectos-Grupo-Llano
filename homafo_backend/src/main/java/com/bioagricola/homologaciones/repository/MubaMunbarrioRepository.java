package com.bioagricola.homologaciones.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.common.entity.MubaMunbarrio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MubaMunbarrioRepository extends JpaRepository<MubaMunbarrio,Long>,JpaSpecificationExecutor<MubaMunbarrio> {

    @Query(value = "select muba.mubaIderegistro from MubaMunbarrio muba where muba.uniMunicipio.proyectoIderegistro=:municipality and muba.uniBarrio.barrioIderegistro=:neighborhood")
    Long findIdByMunBar(Long municipality, Long neighborhood);
    
    @Query(value="select mm2.rut_ideregistro  from muba_munbarrio mm inner join mbru_munbarruta mm2 on mm2.muba_ideregistr = mm.muba_ideregistr "
    		+ "and mm2.rut_ideregistro = 1275 where mm.uni_barrio = :idbarrio",nativeQuery=true)
    Optional<Long>findRutaBarrido(Integer idbarrio);
    
    @Query(value = "select mm.mbcd_ideregistr,uu.uni_ideregistro,uu.uni_nombre1 from public.mbcd_munbardirec mm  "
    		+ "inner join public.uni_unidad uu on uu.uni_ideregistro = mm.uni_ideregistro "
    		+ "where mm.mbcd_ideregistr = :mbcd",nativeQuery = true)
    List<Object []> findComplementoMultiusuarioByMbcd(@Param("mbcd") Long mbcd);

    @Query(value = "select mm.mbcd_ideregistr,uu.uni_ideregistro,uu.uni_nombre1 from public.mbcd_munbardirec mm  "
    		+ "left join public.uni_unidad uu on uu.uni_ideregistro = mm.uni_ideregistro "
    		+ "where uu.uni_ideregistro = :unidad limit 1",nativeQuery = true)
    List<Object []> findComplementoMultiusuarioByUnidad(@Param("unidad") Long unidad);
}
