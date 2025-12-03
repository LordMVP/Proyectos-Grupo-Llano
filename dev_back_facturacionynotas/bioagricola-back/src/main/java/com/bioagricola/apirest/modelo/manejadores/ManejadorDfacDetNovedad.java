package com.bioagricola.apirest.modelo.manejadores;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.DfacDetnovedad;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad DfacDetfactura.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorDfacDetNovedad extends ManejadorCrud<DfacDetnovedad,Long>,IManejadorCrud<DfacDetnovedad,Long>{
	
	@Modifying
	@Query(value = "delete from dfac_detnovedad where fac_ideregistro = :idfactura and emp_ideregistro = :idEmpresa and usu_ideregistro = :idUsuario and tipo_nota = :tipoNota", nativeQuery = true)
	@Transactional
	void eliminarRegistroTMP(int idEmpresa, int idUsuario, Integer tipoNota, Long idfactura);
	
	@Modifying
	@Query(value = "delete from dfac_detnovedad where emp_ideregistro = :idEmpresa and usu_ideregistro = :idUsuario and tipo_nota = :tipoNota", nativeQuery = true)
	@Transactional
	void eliminarRegistroTMPBuscar(int idEmpresa, int idUsuario, Integer tipoNota);
}

