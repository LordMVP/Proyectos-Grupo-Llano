package com.bioagricola.homologaciones.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.dto.BarrioInfoDTO;
import com.bioagricola.common.entity.Barrios;

public interface BarriosRepository extends JpaRepository<Barrios,Long>,JpaSpecificationExecutor<Barrios>{

	@Query(value = "SELECT\n" + 
			"b.barrio_nom,\n" +	
			"b.barrio_ideregistro,\n" + 
			"mm.muba_sector, \n"+
			"ss.sec_nombre \n"+
			"FROM barrios b\n" + 
			"left join muba_munbarrio mm on mm.uni_barrio = b.barrio_ideregistro \n"+
			"left join aseo.sec_sector ss on ss.sec_ideregistro = mm.muba_sector \n"+
			"WHERE b.barrio_codpro= :codigo\n" +
			"AND b.barrio_codemp= '8220002689' \n" + 
			"ORDER BY b.barrio_nom ASC",nativeQuery = true)
	List<Object[]> listaBarrios(@Param("codigo") String codigo );
	
	@Query(value = "SELECT\n" + 
			"barrio_nom,\n" +	
			"barrio_ideregistro\n" + 
			"FROM barrios\n" + 
			"WHERE barrio_codpro= :codigo and barrio_codemp= :codemp\n" + 
			"ORDER BY barrio_nom ASC",nativeQuery = true)
	List<Object[]> listaBarrioCodemp(@Param("codigo") String codigo,@Param("codemp") String codemp);
	
	@Query(value = "SELECT\n" + 
			"barrio_cod,\n" + 
			"barrio_nom,\n" + 
			"barrio_codpro,\n" + 
			"barrio_codemp,\n" + 
			"barrio_swtter,\n" + 
			"barrio_llacom,\n" + 
			"barrio_ideregistro,\n" + 
			"barrio_factor,\n" + 
			"barrio_porins,\n" + 
			"barrio_frerec,\n" + 
			"barrio_horrec,\n" + 
			"barrio_sectec\n" + 
			"FROM barrios\n" + 
			"WHERE barrio_codpro= :codigo\n" + 
			"ORDER BY barrio_nom ASC",nativeQuery = true)
	List<Object[]> listaBarrios2(@Param("codigo") String codigo );
	
	@Query(value = "SELECT\n" + 
			"mbcd.mbcd_ideregistr,\n" + 
			"uni.uni_nombre1 as nombre\n" + 
			"FROM mbcd_munbardirec mbcd\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=mbcd.uni_ideregistro\n" + 
			"INNER JOIN muba_munbarrio muba ON muba.muba_ideregistr=mbcd.muba_ideregistr\n" + 
			"WHERE muba.uni_barrio= :barrio\n" + 
			"AND muba.uni_municipio= :municipio\n" + 
			"ORDER BY uni.uni_nombre1 ASC",nativeQuery = true)
	List<Object[]> complementoPropiedad(@Param("municipio") Integer municipio , @Param("barrio") Integer barrio);
	
	@Query(value = "select ba.*\r\n" + 
			"from muba_munbarrio muba inner join barrios ba on ba.barrio_ideregistro=muba.uni_barrio\r\n" + 
			"where muba.uni_municipio=:municipio order by ba.barrio_nom",nativeQuery = true)
	List<Barrios> findBarriosByMunicipio(@Param("municipio") Long municipio );
	
	@Query(value = "select ba.* \r\n"
			+ "			from barrios ba 			\r\n"
			+ "			inner join muba_munbarrio muba on muba.uni_barrio = ba.barrio_ideregistro \r\n"
			+ "			and muba.uni_municipio =:municipio  \r\n"
			+ "			where ba.barrio_ideregistro =:barrio  order by ba.barrio_nom",nativeQuery = true)
	List<Barrios> findBarriosByMunicipioAndBarrio(@Param("municipio") Long municipio,@Param("barrio") Long barrio );

	@Query(value = "SELECT DISTINCT  \n" +
					"barrios.barrio_ideregistro AS barrioIderegistro,\n"+
					"barrios.barrio_nom AS barrioNom\n"+
					"FROM aseo.dmuba_detamuba\n"+
					"LEFT JOIN jsonb_array_elements(dmuba_rutas) with ordinality arr(item, position) on true\n"+
					"INNER JOIN muba_munbarrio ON muba_munbarrio.muba_ideregistr = dmuba_detamuba.muba_ideregistro\n"+
					"INNER JOIN barrios ON barrios.barrio_ideregistro = muba_munbarrio.uni_barrio\n"+
					"WHERE item->>'rutIderegistro' = :ruta",nativeQuery=true)
	List<BarrioInfoDTO> findBarriosByMicroRuta(String ruta);

	@Query(value="select b.barrio_ideregistro llave, b.barrio_nom valor  " +
			"from barrios b  " +
			"inner join empresas e on b.barrio_codemp = e.empresa_cod  " +
			"where e.empresa_sevemp=:sevemp order by valor asc ", nativeQuery = true)
	List<Map<Integer, String>> findBarriosBySevemp(@Param("sevemp") Integer sevemp );

	@Query(value="select b.barrio_nom from barrios b where b.barrio_ideregistro=:idbarrio", nativeQuery = true)
	String findNombreById(@Param("idbarrio") Long idbarrio);
	
	@Query(value="update barrios set barrio_zona_riesgo = :zonaRiesgo where barrio_ideregistro =:idbarrio returning barrio_ideregistro", nativeQuery = true)
	Integer updateBarrioZona(@Param("zonaRiesgo") Boolean zonaRiesgo,@Param("idbarrio") Integer idbarrio);
	
	@Query(value="select b.barrio_zona_riesgo  from barrios b where b.barrio_ideregistro = :idbarrio",nativeQuery=true)
	boolean findBarrioZonabyBarrioIderegistro(Integer idbarrio);
}
