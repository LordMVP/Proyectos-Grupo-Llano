package com.bioagricola.common.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.FacturaMarcadaG;

public interface FacturaMarcadaGRepository extends JpaRepository<FacturaMarcadaG, Long>{
	

	@Query(value="select fg.* from aseo.fmg_facturacioncarterag fg \n"
			+ "where fg.dsus_ideregistr = :dsus",nativeQuery=true)
	List<FacturaMarcadaG> listaFacturaMarcadaG (@Param("dsus") Long dsus);
}
