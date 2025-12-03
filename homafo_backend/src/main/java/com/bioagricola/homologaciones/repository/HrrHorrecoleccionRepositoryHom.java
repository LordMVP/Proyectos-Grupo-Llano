package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.homologaciones.entity.HrrHorrecoleccionEntity;


public interface HrrHorrecoleccionRepositoryHom extends JpaRepository<HrrHorrecoleccionEntity, Long>,JpaSpecificationExecutor<HrrHorrecoleccionEntity> {
	
	@Query(value="SELECT concat(h.hrr_dia,' ',h.hrr_horinicio,'-',h.hrr_horfin) AS horario ,rr.rut_nombre  "
			+ "FROM aseo.hrr_horrecoleccion h "
			+ "inner join public.rut_ruta rr on rr.rut_ideregistro = cast(h.microruta as integer)  "
			+ "WHERE h.rure_ideregistro= :rure "
			+ "AND h.hrr_swtact='A' "
			+ "",nativeQuery = true)
	List<Object[]> horariosRecoleccion(@Param("rure") Integer rure);

}
