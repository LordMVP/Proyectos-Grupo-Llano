package com.bioagricola.homologaciones.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.homologaciones.entity.RureRutrecoleccion;

public interface RureRutrecoleccionRepository extends JpaRepository<RureRutrecoleccion, Long>,JpaSpecificationExecutor<RureRutrecoleccion> {
	
	public static String esquemaAseo = "aseo";

	Optional<RureRutrecoleccion> findByRutIdemacruta_rutIderegistroAndRureSwtact(Long rutIderegistro,String rureSwtact);
	
	@Query(value="SELECT\n" + 
			"rure.rure_ideregistro as rureIde,\n" + 
			"rut.rut_ideregistro as ide,\n" + 
			"rut.rut_nombre as ruta,\n" + 
			"Cast(rure.rut_microruta as varchar) \n" + 
			"FROM "+esquemaAseo+".rure_rutrecoleccion rure\n" + 
			"INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rure.rut_idemacruta\n" + 
			"WHERE rure.rure_swtact='A'",nativeQuery = true)
	List<Object[]> macrorutasGeneral();
	
	@Query(value="SELECT\n" + 
			"rure.rure_ideregistro\n" + 
			"FROM "+esquemaAseo+".rure_rutrecoleccion rure\n" + 
			"WHERE rure_swtact='A'\n" + 
			"AND rut_idemacruta= :macroRuta \n" + 
			"ORDER BY rure.rure_ideregistro DESC\n" + 
			"LIMIT 1",nativeQuery = true)
	Integer buscaRureMacroRuta(@Param("macroRuta") Integer macroRuta);
	
	
	@Query(value=" select rutrecbar.rure_ideregistro, rutrecbar.rut_ideregistro "
			+ "FROM  aseo.rrba_rutarecoleccionbarrido rutrecbar  "
			+ "INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rutrecbar.rut_ideregistro  "
			+ "and rut.uni_tiporuta = :uniClaseRuta "
			+ "WHERE rutrecbar.dsus_ideregistr= :dsus  "
			+ "AND rutrecbar.rutrecbar_swtact='A' ORDER BY rutrecbar.rrba_ideregistro DESC LIMIT 1	",nativeQuery = true)
	List<Object []> buscarRutreRure(@Param("dsus") Integer dsus, @Param("uniClaseRuta") Integer uniClaseRuta);

	@Query(value="select rr2.rure_ideregistro as rureIde,  \n"
			+ "rr3.rut_ideregistro as ide, rr3.rut_nombre as ruta, \n"
			+ "Cast(rr2.rut_microruta as varchar) \n"
			+ "from aseo.rrba_rutarecoleccionbarrido rr  \n"
			+ "inner join aseo.rure_rutrecoleccion rr2 on  \n"
			+ "rr2.rut_idemacruta  = rr.rut_idemacroruta and rr2.rure_swtact = 'A' \n"
			+ "inner join rut_ruta rr3 on  \n"
			+ "rr3.rut_ideregistro = rr2.rut_idemacruta  \n"
			+ "where rr.dsus_ideregistr = :dsus ",nativeQuery = true)
	List<Object[]> macrorutasSuscripcion(@Param("dsus") Long dsus);
	
	@Query(value= "select rr.*\n" +
			"from public.muba_munbarrio mm\n" +
			"         inner join aseo.dmuba_detamuba dm on dm.muba_ideregistro = mm.muba_ideregistr\n" +
			"         cross join lateral jsonb_array_elements(cast(dm.dmuba_rutas as jsonb)) as elemento\n" +
			"         INNER JOIN aseo.rure_rutrecoleccion rr\n" +
			"                    ON rr.rure_swtact = :swtact\n" +
			"         JOIN LATERAL jsonb_array_elements(cast(rr.rut_microruta as jsonb)) AS microruta_elemento\n" +
			"              ON microruta_elemento ->> 'microRuta' = elemento ->> 'rutIderegistro'\n" +
			"--  join rut_ruta rt on rt.rut_ideregistro = rr.rut_idemacruta  and rt.rut_codigo is not null and rt.rut_codigo::integer < 10\n" +
			"where mm.uni_barrio = :barrio\n" +
			"order by rr.rure_ideregistro asc\n" +
			"limit 1; ",nativeQuery = true)
	List<RureRutrecoleccion> findRureEntityByBarrioAndEstado(@Param("barrio") Long barrio,@Param("swtact") String swtact);
	
	
	
}
