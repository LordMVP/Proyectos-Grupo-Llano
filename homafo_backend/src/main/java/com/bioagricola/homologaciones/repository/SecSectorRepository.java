package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.SecSector;

public interface SecSectorRepository extends JpaRepository<SecSector,Long>,JpaSpecificationExecutor<SecSector>
{
	public static String esquemaAseo = "aseo";
	
	@Query(value = "SELECT\n" + 
			"sec_ideregistro,\n" + 
			"sec_nombre,\n" + 
			"sec_codigo1,\n" + 
			"emp_ideregistro,\n" + 
			"sec_estado\n" + 
			"FROM "+esquemaAseo+".sec_sector\n" + 
			"WHERE emp_ideregistro= :empresa\n" + 
			"AND sec_estado= :estado ORDER BY sec_codigo1 ASC",nativeQuery = true)
	List<Object[]> listaSectores(@Param("empresa") Integer empresa , @Param("estado") String estado);

}
