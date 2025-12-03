package com.bioagricola.common.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.common.entity.Usuarios;

@Repository
public interface UsuariosRepository  extends JpaRepository<Usuarios, Long> {


	@Query(value = "SELECT u.usuIderegistro, u.usuarioNom FROM Usuarios u")
	List<Object[]> listaUsuarios();

	@Query(value = "SELECT u.usuIderegistro, u.usuarioNom ,md5(u.usuarioPas), u.usuLogin ,u.usuarioPas FROM Usuarios u WHERE u.usuIderegistro = :idUsuario")
	List<Object[]> datosReportes(@Param("idUsuario") Long idUsuario);

	@Query(value = "SELECT u.usuLogin,u.usuarioPas FROM Usuarios u WHERE u.usuIderegistro = :idUsuario")
	List<String[]> extraerDatosLogin(@Param("idUsuario") Long idUsuario);

	@Query(value = "SELECT\n" +
			"usu.usu_ideregistro,\n" +
			"usu.usuario_nom\n" +
			"FROM ter_tercero ter\n" +
			"INNER JOIN usuarios usu ON usu.usuario_nit=ter.ter_documento\n" +
			"WHERE ter.ter_ideregistro = :terIderegistro AND usu.usu_ideregistro = :idUsuario",nativeQuery = true)
	List<Object[]> terceroUsuario(@Param("idUsuario") Long idUsuario, @Param("terIderegistro") Long terIderegistro);

	/**
	 * Consulta de usuario por email y estado activo
	 * @param email email de usuario
	 * @return usuario
	 */
	@Query(value = "select u from Usuarios u where u.usuarioMail = :email and u.usuarioSwtact=true")
	Optional<Usuarios> findByEmail(@Param("email") String email);

}
