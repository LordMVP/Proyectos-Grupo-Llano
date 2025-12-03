package com.bioagricola.common.repository;

import com.bioagricola.common.entity.HrrHorrecoleccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface HrrHorrecoleccionRepository  extends JpaRepository<HrrHorrecoleccion,Long>,JpaSpecificationExecutor<HrrHorrecoleccion>{
	
	@Query(value="select * from aseo.hrr_horrecoleccion",nativeQuery=true)
	public List<HrrHorrecoleccion> findFrecuenciaRecoleccion();

	@Query(value="select hh from HrrHorrecoleccion hh join hh.rureRutrecoleccion rure where rure.rutIdemacruta.rutIderegistro=:macroId and hh.hrrSwtact = 'A' order by hh.hrrIderegistro ")
	List<HrrHorrecoleccion> getAllByIdMacroRoute(@Param("macroId") Long macroId);
	
}

