package com.bioagricola.apirest.modelo.manejadores;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.AfoAforo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorAfoAforo extends ManejadorCrud<AfoAforo, Integer>, IManejadorCrud<AfoAforo, Integer>,
		PagingAndSortingRepository<AfoAforo, Integer> {

	@Query(value = "select " + " dd.dsus_ideregistr , " + " afo_extraordinario.per_ideregistro , " + " (case "
			+ " apadre.uni_clasesuscripcionaforo when :uniAforoIndividual then cast(afo_extraordinario.mnaf_tafna AS numeric) "
			+ " when :uniAforoMultiusuario then (cast(afo_extraordinario.mnaf_tafna AS numeric) * (cast(dd.dafo_multiusuporcentaje AS numeric)/100 )) "
			+ " else 0 " + " end ) valor_tafna_extraordinario ,  "
			+ " cast(afo_extraordinario.mnaf_tafna AS numeric), " + " afo_extraordinario.hmaf_fecharegistro  " + "from "
			+ " aseo.afo_aforos apadre " + "inner join aseo.afo_aforos ahijo on "
			+ " ahijo.afo_ideafopadre = apadre.afo_ideregistro " + "inner join aseo.dafo_detaforo dd on "
			+ " dd.afo_ideregistro = apadre.afo_ideregistro " + "inner join dsus_detsuscrip dsus on "
			+ " dsus.dsus_ideregistr = dd.dsus_ideregistr "
			+ "inner join aseo.hmaf_histormaestroaforos afo_extraordinario on "
			+ " afo_extraordinario.afo_ideregistro = ahijo.afo_ideregistro "
			+ " and ahijo.uni_tipoaforo = :uniTipoAforoExtraOrdinario "
			+ " and apadre.uni_tipoaforo = :uniTipoAforoOrdinario " + "where "
			+ " dd.dsus_ideregistr =:idSuscripcion "
			+ " and afo_extraordinario.hmaf_fecharegistro > :fechaPqrT "
			+ " and afo_extraordinario.mhac_estado = 'A' " + " and dsus.dsus_estado = 'A' " + "order by "
			+ " afo_extraordinario.hmaf_fecharegistro desc " + "limit 1", nativeQuery = true)
	List<Object[]> consultarUltimoAforoExtraordinario(Integer uniTipoAforoOrdinario, Integer uniTipoAforoExtraOrdinario,
			Integer idSuscripcion, Timestamp fechaPqrT, Integer uniAforoIndividual, Integer uniAforoMultiusuario);
        
        
        @Query(value = "  select ff.dsus_ideregistr,ff.per_ideregistro,hd.tafna_calculado ,dd.dfac_vlrtotal,ha.hafo_fecha from public.fac_factura ff " +
" inner join public.tido_tipdocumen tt on tt.uni_tipdocument = ff.uni_tipdocument  " +
" and tt.tido_estado = 'A' " +
" inner join public.dfac_detfactura dd on dd.fac_ideregistro = ff.fac_ideregistro  " +
" and dd.uni_concepto = :uniConeptoAforoExtraOrdinario " +
" inner join aseo.hdafo_detaforo hd on hd.dsus_ideregistr = ff.dsus_ideregistr  " +
" inner join aseo.hafo_aforos ha on ha.hafo_ideregistro = hd.hafo_ideregistro  " +
" and ha.uni_tipoaforo = :uniTipoAforoExtraOrdinario " +
" where ff.dsus_ideregistr = :idSuscripcion and ff.fac_estado = 'A'  " +
" order by ff.fac_fecha desc  " +
" limit 1 ", nativeQuery = true)
	List<Object[]> consultarUltimoAforoExtraordinario( Integer uniConeptoAforoExtraOrdinario,Integer uniTipoAforoExtraOrdinario,
			Integer idSuscripcion);






}


