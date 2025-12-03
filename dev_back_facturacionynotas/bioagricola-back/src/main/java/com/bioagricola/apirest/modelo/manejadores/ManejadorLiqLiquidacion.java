package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.LiqLiquidacion;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad LiqLiquidacion.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorLiqLiquidacion
		extends ManejadorCrud<LiqLiquidacion, Integer>, IManejadorCrud<LiqLiquidacion, Integer> {

	@Query(value = "select liq.uni_liquidacion idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento,"
			+ "                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as timestamp) fechasuspension ,"
			+ "                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as timestamp) fechavencimiento"
			+ "                from  liq_liquidacion liq "
			+ "                where liq.uni_liquidacion=:idLiquidacion", nativeQuery = true)
	public Object getLiquidacionSuscripcion(Integer idLiquidacion);
	
	@Query(value = "select ll.uni_liquidacion ,ll.liq_nombre, ll.uni_documento ,dd.doc_nombre , ll.uni_tipdocument , tt.tido_nombre, "+
			" cc2.uni_concepto , cc2.con_nombre from liq_liquidacion ll " +
			" inner join uni_unidad uu on uu.uni_ideregistro  = ll.uni_liquidacion " +
			" inner join doc_documento dd on dd.uni_documento = ll.uni_documento " +
			" inner join tido_tipdocumen tt on tt.uni_tipdocument = ll.uni_tipdocument " +
			" inner join esem_estempresa ee on ee.est_ideregistro = uu.est_ideregistro " +
			" inner join coli_conliquida cc on cc.uni_liquidacion = ll.uni_liquidacion " +
			" inner join con_concepto cc2 on cc2.uni_concepto = cc.uni_concepto " +
			" where ee.emp_ideregistro = :idEmpresa and ll.liq_estado ='A' and " +
			" ll.liq_venclasific  in :clasificaciones " +
			" and (cc2.con_propiedad -> 'aprovechamiento' = 'true' or cc2.con_propiedad -> 'incentivo_aprovechamiento' = 'true')", nativeQuery = true)
	public List<Object[]> getLiquidacionParamLiq(@Param ("clasificaciones") List<String> clasificaciones,
			@Param ("idEmpresa") Integer idEmpresa);



}
