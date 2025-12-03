package com.bioagricola.aforos.repository;

import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface IasusInforadicionalsuscripcionRepository  extends CrudRepository<IasusInforadicionalsuscripcion,Long>,JpaSpecificationExecutor<IasusInforadicionalsuscripcion>{
	
	@Query(value="select * from aseo.iasus_inforadicionalsuscripcion info\r\n" + 
			"inner join dsus_detsuscrip dsus on info.dsus_ideregistr=dsus.dsus_ideregistr\r\n" + 
			"where dsus.dsus_ideregistr=:idDsus",nativeQuery=true)
	List<IasusInforadicionalsuscripcion> findInfoAdicionalSuscripcion(@Param("idDsus")Long idDsus);

	@Query(value="select * from aseo.iasus_inforadicionalsuscripcion info\r\n" +
			"inner join dsus_detsuscrip dsus on info.dsus_ideregistr=dsus.dsus_ideregistr\r\n" +
			"where dsus.dsus_ideregistr = :idDsus limit 1",nativeQuery=true)
	Optional<IasusInforadicionalsuscripcion> findByIdSus(@Param("idDsus")Long idDsus);

	@Query(value = "select iasus.iasusNombreestablecimiento from IasusInforadicionalsuscripcion iasus where iasus.dsusIderegistr=:dsusIderegistro ")
	String getNombreEstablecimientoBydsus(Long dsusIderegistro);

	@Modifying
	@Query(value = "update IasusInforadicionalsuscripcion iasus set iasus.iasusNombreestablecimiento=:nombreEstablecimiento where iasus.dsusIderegistr=:dsusIderegistro")
	void updateNomEstablecimientoBydsus(String nombreEstablecimiento, Long dsusIderegistro);

	Boolean existsByDsusIderegistr( Long dsusIderegistro);

}

