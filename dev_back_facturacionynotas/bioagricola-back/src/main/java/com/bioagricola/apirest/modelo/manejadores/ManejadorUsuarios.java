package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.Usuarios;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

@Service
public interface ManejadorUsuarios extends ManejadorCrud<Usuarios, String>, IManejadorCrud<Usuarios, String> {

    @Query(value = "select u.usuario_pas from usuarios u where u.usu_ideregistro = :usuIderegistro", nativeQuery = true)
    String getUsuarioPass(@Param("usuIderegistro") Integer usuIderegistro);

    @Query(value = "select u.usu_login from usuarios u where u.usu_ideregistro = :usuIderegistro", nativeQuery = true)
    String getUsuarioLogin(@Param("usuIderegistro") Integer usuIderegistro);
}
