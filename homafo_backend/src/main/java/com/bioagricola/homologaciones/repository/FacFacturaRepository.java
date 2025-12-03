package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.FacFactura;

public interface FacFacturaRepository extends JpaRepository<FacFactura,Long>
{
	@Query(value = "SELECT\n" + 
			"CASE WHEN SUM(fac_sdoreal) IS NULL THEN 0 ELSE SUM(fac_sdoreal) END\n" + 
			"FROM fac_factura \n" + 
			"WHERE fac_estado = 'A'\n" + 
			"AND fac_sdoreal > 0\n" + 
			"AND dsus_ideregistr = :dsus\n" + 
			"AND emp_ideregistro = :empresa \n" + 
			"AND fac_fecvence < now()\n" + 
			"AND uni_documento = 24",nativeQuery = true)
	List<Object[]> saldoFacturas(@Param("dsus") Integer dsus,@Param("empresa") Integer empresa);
	
	
	@Query(value=" select ff.*,pp.per_estado from fac_factura ff \n"
			+ "inner join per_periodo pp on \n"
			+ "pp.per_ideregistro = ff.per_ideregistro \n" //and pp.per_estado <> 'A'
			+ "where \n"
			+ "ff.dsus_ideregistr  = :dsus and ff.emp_ideregistro = :empresa  and ff.fac_estado not in ('E','G') and ff.fac_idepadre is null	and ff.fac_sdoreal > 0 ",nativeQuery=true)
	List<Object[]> facFacturaActualDsusAndEmpresa (@Param("dsus") Integer dsus,@Param("empresa") Integer empresa);

}
