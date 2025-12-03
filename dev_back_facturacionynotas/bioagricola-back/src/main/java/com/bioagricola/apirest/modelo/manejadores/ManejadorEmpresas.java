package com.bioagricola.apirest.modelo.manejadores;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.Empresas;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionAgrupamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionFiltro;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionOrdenamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad Empresas.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorEmpresas extends ManejadorCrud<Empresas, String>, IManejadorCrud<Empresas, String> {

	@Query(value = "select acc.acc_ideregistro idacceso," + " acc.usu_ideregistro idusuario,"
			+ " usu.usuario_nit cedula," + " usu.usuario_nom usuario," + " acc.emp_ideregistro idempresa,"
			+ " emp.empresa_nom empresa," + " acc.pfi_ideregistro idperfil"
			+ " from  acc_acceso acc  inner join usuarios usu on  acc.usu_ideregistro=usu.usu_ideregistro"
			+ " inner join empresas emp on acc.emp_ideregistro=emp.empresa_sevemp"
			+ " where acc.acc_ideregistro=:idacceso", nativeQuery = true)
	public Object getInfoSesion(Integer idacceso);

	@Query(" select DISTINCT e.empresaCod," + "  e.empresaNom," + " dd.empIderegistro" + " from DicnDisconven dd"
			+ " inner join Empresas e on e.empresaSevemp = dd.empIderegistro" + " where dd.cnreIderegistr in "
			+ " (select dd.cnreIderegistr" + " from DicnDisconven dd"
			+ " inner join Empresas e on e.empresaSevemp = dd.empIderegistro"
			+ " where (:empresaId is null OR dd.empIderegistro =:empresaId) )")
	public List<Object[]> consultaHomologadas(@Param("empresaId") Integer empresaId);
	
	@Query(" select e.empresaCod" + " from Empresas e"
			+ " where e.empresaSevemp = :empresaId ")			
	public String codEmpresa(@Param("empresaId") Integer empresaId);

	@Query(" select e from Empresas e where e.empresaSevemp = :empresaId ")
	Optional<Empresas> findByEmpresaId(@Param("empresaId") Integer empresaId);


	public List<Object> consultarLista(Collection<InformacionFiltro> filtros,
			Collection<InformacionOrdenamiento> infoOrdenamiento, InformacionAgrupamiento infoAgrupamiento);

}
