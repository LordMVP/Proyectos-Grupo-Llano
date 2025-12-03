package com.bioagricola.apirest.modelo.manejadores;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.CosuConsuscrip;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad CosuConsuscrip.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorCosuConsuscrip
		extends ManejadorCrud<CosuConsuscrip, Integer>, IManejadorCrud<CosuConsuscrip, Integer> {

	/**
	 * Método encargado de consultar si existe un registro en cosu_consuscrip con
	 * los valores dados
	 * 
	 * @param dsusIderegistr
	 * @param uniLiquidacion
	 * @param uniConcepto
	 * @return
	 */
	@Query("select cc from CosuConsuscrip cc " + " where cc.dsusDetsuscrip.dsusIderegistr = :dsusIderegistr "
			+ " and cc.uniLiquidacion = :uniLiquidacion " + " and cc.uniConcepto = :uniConcepto")
	public CosuConsuscrip validarCosuConsuscrip(@Param("dsusIderegistr") Long dsusIderegistr,
			@Param("uniLiquidacion") Integer uniLiquidacion, @Param("uniConcepto") Integer uniConcepto);

	@Query("select distinct cc from CosuConsuscrip cc "
			+ "inner join DsusDetsuscrip dd on dd.dsusIderegistr = cc.dsusIderegistr "
			+ "where cc.uniConcepto =:indicadorCalidad "
			+ "and cc.empIderegistro =:idEmpresa "
			+ "and :fechaActual between cc.cosuFecinicio and cc.cosuFecfinal and cc.cosuEstado = 'A' ")
	public List<CosuConsuscrip> consultaSuscripReclamacionComercial(@Param("indicadorCalidad") Integer indicadorCalidad,
			@Param("idEmpresa") int idEmpresa, @Param("fechaActual") Timestamp fechaActual);
}
