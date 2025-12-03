package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.CicCiclo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad CicCiclo.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorCicCiclo extends ManejadorCrud<CicCiclo,Integer>,IManejadorCrud<CicCiclo,Integer>{
	
	/**
	 * Método de consulta de ciclos según la empresa en sesión
	 * */
	@Query("select cc from CicCiclo cc "
			+ " inner join CiemCicempresa cc2 on cc2.cicCiclo.cicIderegistro = cc.cicIderegistro "
			+ " where cc2.empresa.empresaSevemp = :idEmpresa "
			+ " and cc.cicEstado <> 'E'")
	List<CicCiclo> consultarCiclos(@Param("idEmpresa") int idEmpresa);
	   
	
	@Query(value =	"SELECT "
			+ "                    cic.cic_ideregistro idciclo,"
			+ "                    cic.cic_nombre ciclo,"
			+ "                    per.per_ideregistro idperiodo,"
			+ "                    per.per_nombre periodo,"
			+ "                    cic.cic_anoactual cicloanio,"
			+ "                    per.per_fecvence fechavencimiento,"
			+ "                    per.per_fecsuspens fechasuspension"
			+ "                FROM"
			+ "                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro"
			+ "                WHERE"
			+ "                    per.per_estado = 'A' and cic.cic_ideregistro=:idciclo", nativeQuery = true)
	public Object getCicloPeriodoId(Integer idciclo);
	
}

