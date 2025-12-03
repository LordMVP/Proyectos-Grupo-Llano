package com.bioagricola.apirest.modelo.manejadores;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.DrecDetrecaudo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad DrecDetrecaudo.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorDrecDetrecaudo extends ManejadorCrud<DrecDetrecaudo,Long>,IManejadorCrud<DrecDetrecaudo,Long>{
	
	@Query("select SUM(dd.drecVlrtotal) from DrecDetrecaudo dd "+
	"join DfacDetfactura dd2 on dd2.dfacIderegistr = dd.dfacIderegistr "+
	"where dd.facIderegistro = :facIderegistro "+
	"and dd2.uniConcepto = :uniConcepto")
	BigDecimal facturadoTotal (@Param("facIderegistro")Long facIderegistro, @Param("uniConcepto") Integer uniConcepto);
	

    // protected region Use esta region para su implementacion del manejador on begin 
    
    // protected region Use esta region para su implementacion del manejador end        
}

