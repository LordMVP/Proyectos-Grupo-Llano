package com.bioagricola.aforos.repository;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.HDetalleConceptoVisitaAforo;
import com.bioagricola.aforos.entity.HafoAforos;
import com.bioagricola.aforos.entity.dto.HistoricosAforoDTO;

@Repository
@Transactional
public interface HAforoRepository  extends CrudRepository<HafoAforos,Long>,JpaSpecificationExecutor<HafoAforos>{
	
	/*
	 * consulta el historico  aforos y detalle de aforos segun id de aforo
	 */
	@Query(value="select distinct hafo.hafo_ideregistro as idAforo,\n"
	+ "hafo.hafo_estado as estado,\n"
	+ "hafo.hafo_fechainicio as vigenciaDesde,\n"
	+ "hafo.hafo_fechafinvegencia as vigenciaHasta,\n"
	+ "hafo.hafo_fechafinaforo as vigenciaFinal,\n"
	+ "hafo.hafo_fecha as fechaCreacion,\n"
	+ "hafo.hafo_fechaactualizacion as fechaActualizacion,\n"
	+ "hafo.hafo_observaciones as observaciones,\n"
	+ "uniTipoAforo.uni_nombre1 as tipoAforo,\n"
	+ "hafo.hmafv_factor as factor,\n"
	+ "ter_aforador.ter_nomcompleto as tecnicoAforador,\n"
	+ "hafo.hafo_numpqr as numpqr,\n"
	+ "uniClaseSuscripcion.uni_nombre1 as claseSuscripcion,\n"
	+ "hafo.hafo_frecuenciarecoleccion as frecuenciaRecoleccion,\n"
	+ "hafo.hafo_cantidadfrecuenciarecoleccion as cantidadFrecuenciaRecoleccion,\n"
	+ "hafo.hafo_ideafopadre as aforoPadre,\n"
	+ "hdafo.dsus_ideregistr as idSuscriptor,\n"
	+ "dsus.dsus_estado as estadoSuscriptor, \n"
	+ "dsus.dsus_pcodigo as codigoSuscriptor,\n"
	+ "ter.ter_nomcompleto as nombreSuscriptor,\n"
	+ "pro.pro_direccion  as direccion,\n"
	+ "ba.barrio_nom as barrio,\n"
	+ "hdafo.hdafo_multiusuporcentaje as porcentaje,\n"
	+ "unidadact.uni_nombre1 as actividad, \n"
	+ "info.iasus_nombreestablecimiento as nombreEstablecimiento,\n"
	+ "info.iasus_referenciacomercial as referenciaComercial, \n"
	+ "hdafo.hafo_numpqr as numpqrSuscriptor,\n"
	+ "hmulti.hafom_distribucion as tipoDistribucion, \n"
	+ "hdafo.tafna_calculado as tafna, \n"
	+ "uu2.uni_nombre1 as tipoUsoSuscriptor, \n"
	+ "hmulti.hafom_descripcion as hafomDescripcion, \n"
	+ "hmulti.codigo_base as codigoBase \n"
	+ "from aseo.hafo_aforos hafo \n"
	+ "inner join aseo.hdafo_detaforo hdafo on hdafo.hafo_ideregistro = hafo.hafo_ideregistro \n" 
	+ "inner join dsus_detsuscrip dsus 	  on dsus.dsus_ideregistr   = hdafo.dsus_ideregistr \n" 
	+ "inner join ter_tercero ter 	on ter.ter_ideregistro  = dsus.ter_ideregistro \n"
	+ "inner join pro_propiedad pro on pro.pro_ideregistro 	= dsus.pro_ideregistro \n" 
	+ "inner join barrios ba 		on ba.barrio_ideregistro	      = dsus.uni_barrio \n" 
	+ "left join aseo.iasus_inforadicionalsuscripcion info on info.dsus_ideregistr=dsus.dsus_ideregistr \n"
	+ "inner join uni_unidad uniClaseSuscripcion on uniClaseSuscripcion.uni_ideregistro = hafo.uni_clasesuscripcionaforo \n"	
	+ "inner join uni_unidad unidadAct on unidadAct.uni_ideregistro = dsus.uni_actsuscripc \n"
	+ "inner join uni_unidad uu2 on uu2.uni_ideregistro = dsus.uni_tipusosuscr \n"
	+ "inner join ter_tercero ter_aforador on ter_aforador.ter_ideregistro = hafo.ter_aforador \n"
	+ "left join uni_unidad uniTipoAforo on unitipoaforo.uni_ideregistro = hafo.uni_tipoaforo \n"
	+ "left join aseo.hafom_afomultiusuario hmulti on hmulti.afo_ideregistro = hafo.hafo_ideregistro \n"
	+ "where hafo.hafo_ideregistro = :idAforo", nativeQuery = true)	
	List<HistoricosAforoDTO> getHistoricoByIdAforo(@Param("idAforo") Long idAforo);

	
	@Query(value="select hdcva.* from aseo.hdcva_historicodetalleconceptovisitasaforo hdcva \n" + 
			"inner join aseo.hdmaf_detallemaestrovisitas hdmaf on hdmaf.hdmaf_ideregistro=hdcva.hdmaf_ideregistro \n" + 
			"where hdmaf.hmafv_ideregistro=:idMaestro ",nativeQuery=true)
	public List<HDetalleConceptoVisitaAforo> findDetallesConceptosByMaaestro(@Param("idMaestro")Long idMaestro);
	
	@Query(value="SELECT\n" + 
			"hafo.*\n" + 
			"FROM aseo.hafo_aforos hafo\n" + 
			"WHERE hafo.hafo_ideregistro=:idHaforo",nativeQuery=true)
	public HafoAforos buscarAforo(@Param("idHaforo")Long idHaforo);
	
	@Query(value="SELECT \n"+
			"hafo.*\n" +
			"FROM aseo.hafo_aforos hafo \n"+
			"WHERE hafo.hafo_estado=:estado",nativeQuery=true)
	public Optional<List<HafoAforos>>findByHafo_estado(@Param("estado")String estado);
		
}

