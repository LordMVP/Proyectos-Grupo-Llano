package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.PaenParametrosentradanota;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorPaenParametrosentradanota
		extends ManejadorCrud<PaenParametrosentradanota, Integer>, IManejadorCrud<PaenParametrosentradanota, Integer> {

	@Query("select paen from PaenParametrosentradanota paen " + "where paen.prgIderegistro =:tipoNota "
			+ "and paen.empIderegistro =:idEmpresa " + "and paen.uniConcepto =:uniConeptoAforoExtraOrdinario "
			+ "and paen.usuIderegistro =:idUsuario " + "order by paen.paenIderegistro desc")
	public PaenParametrosentradanota consultaPaen(@Param("tipoNota") Long tipoNota, @Param("idEmpresa") int idEmpresa,
			@Param("uniConeptoAforoExtraOrdinario") Long uniConeptoAforoExtraOrdinario, @Param("idUsuario") Long idUsuario);

}
