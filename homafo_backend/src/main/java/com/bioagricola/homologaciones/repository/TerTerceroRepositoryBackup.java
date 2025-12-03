package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.TerTercero;

public interface TerTerceroRepositoryBackup  extends JpaRepository<TerTercero,Long>
{
	@Query(value = "SELECT\n" + 
			"ter.ter_ideregistro,\n" + 
			"ter.ter_documento,\n" + 
			"ter.ter_nomcompleto\n" + 
			"FROM ter_tercero ter\n" + 
			"INNER JOIN est_estructura est ON est.est_ideregistro=ter.est_tiptercero\n" + 
			"WHERE ter.uni_tiptercero= :unidad",nativeQuery = true)
	List<Object[]> tercerosTipo(@Param("unidad") Integer unidad );
	
	@Query(value = "select ter_ideregistro,ter_nomcompleto from ter_tercero where ter_nomcompleto ilike '%' || :nombre ||'%' limit 100",nativeQuery = true)
	List<Object[]> buscarTerceroNombre(@Param("nombre") String nombre);


}
