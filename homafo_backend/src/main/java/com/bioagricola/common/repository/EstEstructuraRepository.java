package com.bioagricola.common.repository;

import com.bioagricola.common.entity.EstEstructura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface EstEstructuraRepository  extends JpaRepository<EstEstructura, Long>,JpaSpecificationExecutor<EstEstructura> {
	
	@Query(value = "select ss from EstEstructura ss inner join EsemEstempresa ess on ss.estIderegistro = ess.estIderegistro.estIderegistro " +
            "where ess.empIderegistro = :empId and ss.claIderegistro.claIderegistro = :claId and ss.estValida='N' ")
    List<EstEstructura> findByEmpIdAndClaId(@Param("empId") Long empId, @Param("claId") Long claId);
}
