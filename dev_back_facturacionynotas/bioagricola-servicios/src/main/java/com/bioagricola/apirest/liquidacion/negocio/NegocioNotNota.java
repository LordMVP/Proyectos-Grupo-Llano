package com.bioagricola.apirest.liquidacion.negocio;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.NotNotaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestNotNotaDTO;
import com.bioagricola.apirest.modelo.entidades.DsusDetsuscrip;
import com.bioagricola.apirest.modelo.entidades.EsemEstempresa;
import com.bioagricola.apirest.modelo.entidades.EsemEstempresaPK;
import com.bioagricola.apirest.modelo.entidades.NotNota;
import com.bioagricola.apirest.modelo.entidades.PerPeriodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorEsemEstempresa;
import com.bioagricola.apirest.modelo.manejadores.ManejadorNotNota;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPerPeriodo;

@Service
public class NegocioNotNota extends NegocioAbstracto<NotNota, NotNotaDTO> {

	@Autowired
	private ManejadorNotNota manejadorNotNota;

	@Autowired
	private ManejadorEsemEstempresa manejadorEsemEstempresa;

	@Autowired
	private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;

	@Autowired
	private ManejadorPerPeriodo manejadorPerPeriodo;

	/**
	 * Método encargado de agregar un nuevo registro a la tabla NotNota y Nofa
	 */
	public NotNotaDTO agregarNota(RequestNotNotaDTO nuevaNota) {

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		List<Object[]> baseParaNota = manejadorDsusDetsuscrip.baseParaNota(idEmpresa, nuevaNota.getDsusIdregistr(),
				nuevaNota.getUniMotnota());

		EsemEstempresa empresaData = new EsemEstempresa();
		EsemEstempresaPK empresaDataPK = new EsemEstempresaPK();

		DsusDetsuscrip dsusDetTable;

		PerPeriodo perperiodoTable = new PerPeriodo();

		NotNota notNotaNew = new NotNota();

		for (Object[] object : baseParaNota) {
			empresaDataPK.setEmpIderegistro((Integer) object[3]);
			empresaDataPK.setEstIderegistro((Integer) object[5]);
			notNotaNew.setCicAno((Short) object[2]);
			notNotaNew.setUsuIderegistro((Integer) object[6]);
			Optional<PerPeriodo> value = manejadorPerPeriodo.findById((Integer) object[1]);
			if (value.isPresent()) {
				perperiodoTable = value.get();
			}
		}

		Optional<DsusDetsuscrip> value = manejadorDsusDetsuscrip.findById(nuevaNota.getDsusIdregistr());
		if (value.isPresent()) {
			dsusDetTable = value.get();
			notNotaNew.setDsusDetsuscrip(dsusDetTable);
		}
		empresaData.setId(empresaDataPK);

		Optional<EsemEstempresa> value2 = manejadorEsemEstempresa.findById(empresaDataPK);
		if (value2.isPresent()) {
			empresaData = value2.get();

		}
		notNotaNew.setEsemEstempresa(empresaData);
		notNotaNew.setNotFecha(Timestamp.valueOf(nuevaNota.getFecha()));
		notNotaNew.setNotComentario(nuevaNota.getObservacion());
		notNotaNew.setUniMotnota(nuevaNota.getUniMotnota());
		notNotaNew.setPerPeriodo(perperiodoTable);

		manejadorNotNota.save(notNotaNew);

		return 	 convertirEntidadADao(notNotaNew);
	}

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return NotNota.contieneAtributo(nombreAtributo);
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected NotNotaDTO instanciarDAO() {
		return new NotNotaDTO();
	}

}
