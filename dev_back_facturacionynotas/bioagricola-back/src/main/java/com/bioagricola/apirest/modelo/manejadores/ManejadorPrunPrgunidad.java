package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.PrunPrgunidad;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ParParametro.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorPrunPrgunidad extends ManejadorCrud<PrunPrgunidad,Long>,IManejadorCrud<PrunPrgunidad,Long>{

	/**
	 * Método de consulta de parámetros según la empresa en sesión
	 * */
	@Query("select pp from ParParametro pp "
			+ " where pp.empIderegistro = :idEmpresa ")
	PrunPrgunidad consultaParametrosAccion(@Param("idEmpresa") int idEmpresa);

	/**
	 * Método de consulta de la relación de un usuario, una unidad y un programa
	 * para conocer si tiene privilegios de administrador en opciones específicas en
	 * la interfaz de usuario asociada al programa
	 * 
	 * @param idUsuario
	 * @param idUnidadDxD
	 * @param idPrograma
	 * @return
	 */
	@Query("select pp from PrunPrgunidad pp "
			+ "where pp.prgIderegistro = :idPrograma "
			+ "and pp.uniUnidad.uniIderegistro = :idUnidadDxD "
			+ "and pp.usuIderegistro = :idUsuario")
	PrunPrgunidad consultaRelacion(@Param("idUsuario") int idUsuario, @Param("idUnidadDxD") Integer idUnidadDxD, @Param("idPrograma") Integer idPrograma);

	@Query(value = "select " +
			"    count(*) " +
			"from " +
			"    prun_prgunidad pp " +
			"inner join uspu_usuprgunid uu on " +
			"    uu.prun_ideregistr = pp.prun_ideregistr " +
			"inner join uni_unidad uu2 on " +
			"    uu2.uni_ideregistro = pp.uni_ideregistro " +
			"inner join esem_estempresa ee on " +
			"    ee.est_ideregistro = uu2.est_ideregistro " +
			"where " +
			"    ee.emp_ideregistro = :idEmpresaSesion " +
			"    and pp.prg_ideregistro = :idPrograma " +
			"    and uu2.usu_ideregistro = :idusuariosesion " +
			"    and uu2.uni_ideregistro = :par_parametro_unidad_edicion_parametrizacion_concepto", nativeQuery = true)
	Integer hasPermissions(@Param("idEmpresaSesion") Integer idEmpresaSesion,
						   @Param("idPrograma") Integer idPrograma,
						   @Param("idusuariosesion") Integer idusuariosesion,
						   @Param("par_parametro_unidad_edicion_parametrizacion_concepto") Integer unidad_edicion_parametrizacion_concepto);
	
	@Query("select count(*) from PrunPrgunidad pp " + 
			"inner join UspuUsuprgunid uu on uu.prunIderegistr = pp.prunIderegistr " + 
			"inner join UniUnidad uu2 on uu2.uniIderegistro = pp.uniIderegistro " + 
			"inner join EsemEstempresa ee on ee.id.estIderegistro = uu2.estIderegistro " + 
			"where ee.id.empIderegistro = :empIderegistro and pp.prgIderegistro = :prgIderegistro " + 
			"and uu2.usuIderegistro = :usuIderegistro and uu2.uniIderegistro = :uniIderegistro")
	Integer consultaPermisos(@Param("empIderegistro") Integer empIderegistro, @Param("prgIderegistro") Integer prgIderegistro,
			@Param("usuIderegistro") Integer usuIderegistro, @Param("uniIderegistro")Integer uniIderegistro);
	
	
}
