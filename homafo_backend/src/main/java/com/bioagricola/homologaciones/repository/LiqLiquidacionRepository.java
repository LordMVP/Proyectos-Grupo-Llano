package com.bioagricola.homologaciones.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.LiqLiquidacion;

public interface LiqLiquidacionRepository extends JpaRepository <LiqLiquidacion,Long>
{
	@Query(value = "select liq.uni_liquidacion, liq.liq_nombre "
			+ "FROM liq_liquidacion liq "
			+ "inner join uni_unidad uu on uu.uni_ideregistro = liq.uni_liquidacion and uu.uni_propiedad ->> 'emp' = cast(:empresa as text) "
			+ "INNER JOIN est_estructura est ON est.est_ideregistro = liq.est_liquidacion and liq.liq_venclasific = 'LI' "
			+ "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro and esem.emp_ideregistro = :empresa "
			+ "ORDER BY liq.liq_nombre ASC",nativeQuery = true)
	List<Object[]> informacionLiquidacion(@Param("empresa") Integer empresa);

	@Query(value = "SELECT "
			+ "liq.uni_liquidacion llave, "
			+ "liq.liq_nombre valor "
			+ "FROM liq_liquidacion liq "
			+ "inner join uni_unidad uni on uni.uni_ideregistro = liq.uni_liquidacion "
			+ "INNER JOIN est_estructura est ON est.est_ideregistro=liq.est_liquidacion "
			+ "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro "
			+ "WHERE esem.emp_ideregistro= :empresa AND liq.liq_venclasific = 'LI' and cast((uni.uni_propiedad ->> 'emp') as int) = :empresa "
			+ "ORDER BY liq.liq_nombre ASC ",nativeQuery = true)
	List<Map<String,Object>> liquidacionesByEmp(@Param("empresa") Integer empresa);
}
