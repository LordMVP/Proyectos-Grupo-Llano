package com.bioagricola.apirest.modelo.manejadores;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.ColiConliquidaApro;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorColiConliquidaApro
		extends ManejadorCrud<ColiConliquidaApro, Integer>, IManejadorCrud<ColiConliquidaApro, Integer>{

	@Query("SELECT p FROM ColiConliquidaApro p WHERE "+
			" p.uniLiquidacion = :uniLiquidacion AND p.uniConcepto = :uniConcepto AND p.coliEstado = :coliEstado")
	ColiConliquidaApro getParamConcepLiqui(
			@Param("uniLiquidacion") Integer uniLiquidacion, @Param("uniConcepto") Integer uniConcepto,
			@Param("coliEstado") String coliEstado);


	@Query("SELECT cca.coliAprovIderegistro , cca.terIderegistro ,tt.terNomcompleto, cca.uniConcepto , cc.conNombre ," +
			"cca.uniLiquidacion , ll.liqNombre ,cca.uniDocumento, dd.docNombre, cca.uniTipdocument,  tt2.tidoNombre, cca.uniPorcentaje , "+
			"cca.fechaCreacion, c.ciudadNom, cca.proyectoLlacom  " +
			"from ColiConliquidaApro cca " +
			"left join TerTercero tt on tt.terIderegistro = cca.terIderegistro " +
			"inner join DocDocumento dd on dd.uniDocumento = cca.uniDocumento " +
			"inner join TidoTipdocumen tt2 on tt2.uniTipdocument = cca.uniTipdocument " +
			"inner join ConConcepto cc on cc.uniConcepto = cca.uniConcepto " +
			"inner join LiqLiquidacion ll on ll.uniLiquidacion = cca.uniLiquidacion "+
			"left join Proyectos p on p.proyectoLlacom = cca.proyectoLlacom " +
			"left join Ciudades c on c.ciudadCod = p.proyectoCodciu " +
			"WHERE (:search IS NULL or tt.terNomcompleto like %:search% or cc.conNombre like %:search% or ll.liqNombre like %:search% or "+
			"dd.docNombre like %:search% or tt2.tidoNombre like %:search% or c.ciudadNom like %:search% or cast(cca.uniPorcentaje as text) like %:search% ) " +
			"AND cca.coliEstado = :coliEstado and cca.terIderegistro is null ORDER BY cca.fechaCreacion DESC ")
	Optional<Page<Object>> getConceptosLiquidacionAprov(@Param("search") String search, @Param("coliEstado") String coliEstado, Pageable page);

	@Query("SELECT cca.coliAprovIderegistro , "
			+ "cca.terIderegistro ,"
			+ "tt.terNomcompleto,"
			+ " cca.uniConcepto ,"
			+ " cc.conNombre ," +
			"cca.uniLiquidacion , "
			+ "ll.liqNombre ,"
			+ "cca.uniDocumento,"
			+ " dd.docNombre, "
			+ "cca.uniTipdocument,  "
			+ "tt2.tidoNombre, "
			+ "cca.uniPorcentaje, "
			+ "cca.fechaCreacion, "
			+ "c.ciudadNom , cca.proyectoLlacom " + 
			"from ColiConliquidaApro cca " +
			"left join TerTercero tt on tt.terIderegistro = cca.terIderegistro " +
			"inner join DocDocumento dd on dd.uniDocumento = cca.uniDocumento " +
			"inner join TidoTipdocumen tt2 on tt2.uniTipdocument = cca.uniTipdocument " +
			"inner join ConConcepto cc on cc.uniConcepto = cca.uniConcepto " +
			"inner join LiqLiquidacion ll on ll.uniLiquidacion = cca.uniLiquidacion "+
			"left join Proyectos p on p.proyectoLlacom = cca.proyectoLlacom " +
			"left join Ciudades c on c.ciudadCod = p.proyectoCodciu " +
			"WHERE (:search IS NULL or tt.terNomcompleto like %:search% or cc.conNombre like %:search% or ll.liqNombre like %:search% or "+
			"dd.docNombre like %:search% or tt2.tidoNombre like %:search% or c.ciudadNom like %:search% or cast(cca.uniPorcentaje as text) like %:search% ) " +
			"AND cca.coliEstado = :coliEstado and cca.terIderegistro is not null ORDER BY cca.fechaCreacion DESC ")
	Optional<Page<Object>> getConceptosLiquidacionIAprov(@Param("search") String search, @Param("coliEstado") String coliEstado, Pageable page);

	@Query("SELECT uniPorcentaje from ColiConliquidaApro WHERE uniConcepto = :uniConcepto")
	BigDecimal findByUniConcepto(@Param ("uniConcepto") Integer uniConcepto);

}
