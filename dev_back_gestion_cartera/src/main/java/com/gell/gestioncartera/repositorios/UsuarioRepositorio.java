package com.gell.gestioncartera.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.Usuario;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para usuarios
 */
@Repository
@Transactional
public interface UsuarioRepositorio  extends CrudRepository<Usuario, Long> {
	
	@Query(value = "select distinct U.usu_ideregistro , u.usuario_nom  from usuarios u\r\n"
			+ "inner join usem_usuempresa uu on uu.usu_ideregistro = u.usu_ideregistro\r\n"
			+ "inner join oppf_opcperfil oo on oo.pfi_ideregistro = uu.pfi_ideregistro\r\n"
			+ "inner join opc_opcion oo2 on oo2.opc_ideregistro = oo.opc_ideregistro\r\n"
			+ "where uu.emp_ideregistro  =:idEmpresa and\r\n"
			+ "oo2.prg_ideregistro in (:rango) order by u.usuario_nom", nativeQuery = true)
	Iterable<Usuario> findUsuarios(@Param("idEmpresa") Long idEmpresa, @Param("rango") List<Long> rango);
}
