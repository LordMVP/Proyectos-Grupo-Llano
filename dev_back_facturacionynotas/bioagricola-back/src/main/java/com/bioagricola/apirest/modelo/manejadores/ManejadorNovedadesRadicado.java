package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.NovedadesRadicado;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad ParParametro.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorNovedadesRadicado
		extends ManejadorCrud<NovedadesRadicado, String>, IManejadorCrud<NovedadesRadicado, Integer> {

	/**
	 * Método de consulta de parámetros del codigo de la novedad
	 * */
	@Query("select nov.novedadradicadoCod, " 
			+ "nov.novedadradicadoNom " 
			+ "from NovedadesRadicado nov "
			+ "inner join Empresas e on e.empresaCod = nov.novedadradicadoCodemp "
			+ " where e.empresaSevemp = :idEmpresa "
			+ "and nov.novedadradicadoCoddepemp = '04' "
			+ "and nov.novedadradicadoSwtact is true "
			+ "and nov.novedadradicadoSwtrep is false "
			+ "order by nov.novedadradicadoNom")
	List<Object[]> consultaParametros(@Param("idEmpresa") int idEmpresa);
	
}
