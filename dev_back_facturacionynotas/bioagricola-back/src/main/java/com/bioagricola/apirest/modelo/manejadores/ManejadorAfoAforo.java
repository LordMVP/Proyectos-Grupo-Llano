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


}
