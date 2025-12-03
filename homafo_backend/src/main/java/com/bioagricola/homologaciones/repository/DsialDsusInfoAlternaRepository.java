package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.homologaciones.entity.DsialDsusInfoAlternaEntity;

public interface DsialDsusInfoAlternaRepository extends JpaRepository<DsialDsusInfoAlternaEntity,Long>,JpaSpecificationExecutor<DsialDsusInfoAlternaEntity>
{
	@Query(value = "select dd.* from aseo.dsial_dsusinfoalterna dd "
			+ "where dd.dial_estado = :estado and dd.dsus_ideregistr = :suscripcion ", nativeQuery = true)
	List<DsialDsusInfoAlternaEntity> findEmpresaBySuscripcionAlterna(@Param("estado") String estado,@Param("suscripcion") Long suscripcion);
}
