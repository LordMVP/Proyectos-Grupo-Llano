package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.TidoTipdocumen;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad TidoTipdocumen.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorTidoTipdocumen extends ManejadorCrud<TidoTipdocumen,Integer>,IManejadorCrud<TidoTipdocumen,Integer>{

	/**
	 * Método de consulta de tipos de documento según la empresa en sesión y el documento seleccionado
	 * */
	@Query(value = "select tt.uni_tipdocument , uu.uni_nombre1 from tido_tipdocumen tt "
			+ "inner join (select distinct uni_tipdocument from liq_liquidacion ll where uni_documento= :uniDocumento) as liquidaciones on liquidaciones.uni_tipdocument = tt.uni_tipdocument "
			+ "inner join uni_unidad uu on uu.uni_ideregistro = tt.uni_tipdocument "
			+ "inner join esem_estempresa ee on ee.est_ideregistro = uu.est_ideregistro "
			+ "where ee.emp_ideregistro = :idEmpresa "
			, nativeQuery = true)
	public List<Object[]> consultaTiposDocumento(Integer uniDocumento, int idEmpresa);
    
}

