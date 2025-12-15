package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.DocDocumento;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad DocDocumento.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorDocDocumento extends ManejadorCrud<DocDocumento,Integer>,IManejadorCrud<DocDocumento,Integer>{

	/**
	 * Método de consulta de documentos según la empresa en sesión
	 * */
	@Query(value = "select dd.uni_documento , uu.uni_nombre1 from doc_documento dd "
			+ "inner join (select distinct uni_documento from liq_liquidacion ll) as liquidaciones on liquidaciones.uni_documento = dd.uni_documento "
			+ "inner join uni_unidad uu on uu.uni_ideregistro = dd.uni_documento "
			+ "inner join esem_estempresa ee on ee.est_ideregistro = uu.est_ideregistro "
			+ "where ee.emp_ideregistro = :idEmpresa"
			, nativeQuery = true)
	public List<Object[]> consultaDocumentos(int idEmpresa);
	
	@Query(value="SELECT nn.uni_documento  FROM nudo_numdocumen nn \n"
			+ "INNER JOIN donu_dotinumdocumento dd on \n"
			+ "dd.nudo_ideregistro = nn.nudo_ideregistro and dd.donu_tipo LIKE %:tipo% \n"
			+ "WHERE nn.uni_tipdocument =:tipoDocumento ",nativeQuery = true)
	public Integer consultaDocumentoTipo(@Param("tipo")String tipo,@Param("tipoDocumento") Integer tipoDocumento);
        
        @Query(value="select distinct dd.nudo_ideregistro \n" +
            "from donu_dotinumdocumento dd \n" +
            "inner join nudo_numdocumen nn on \n" +
            "nn.emp_ideregistro =:empresa and nn.uni_documento =:documento and nn.uni_tipdocument =:tipoDocumento  \n" +
            "where dd.nudo_ideregistro = nn.nudo_ideregistro ",nativeQuery = true)
        public Integer obtenerNumeroDocumento(@Param("empresa") Integer empresa,@Param("documento")Integer documento,@Param("tipoDocumento")Integer tipoDocumento);
	
}

