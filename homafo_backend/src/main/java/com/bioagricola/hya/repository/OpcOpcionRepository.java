package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.OpcOpcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Clase repositorio de la entidad OpcOpcion
 * @author cperez@progracol.com
 */
@Repository
public interface OpcOpcionRepository extends JpaRepository<OpcOpcion,Integer> {

    /**
     * Consulta opciones por id de programa, empresa y id de usuario
     * @param idusuario id de usuario
     * @param idprograma id de programa
     * @param idempresa id de empresa
     * @return listado de opciones
     */
    @Query(value = "select opc.opc_ideregistro opcIderegistro, " +
            "       opc.opc_nombre opcNombre, " +
            "       opc.opc_descripcion opcDescripcion, " +
            "       opc.prg_ideregistro prgIderegistro, " +
            "       opc.usu_ideregistro usuIderegistro " +
            "from oppf_opcperfil oppf " +
            "inner join opc_opcion opc on oppf.opc_ideregistro = opc.opc_ideregistro and oppf.prg_ideregistro = opc.prg_ideregistro " +
            "inner join pfi_perfil pfi on oppf.pfi_ideregistro = pfi.pfi_ideregistro " +
            "inner join usem_usuempresa uu on pfi.pfi_ideregistro = uu.pfi_ideregistro " +
            "inner join usuarios u on uu.usu_ideregistro = u.usu_ideregistro " +
            "where opc.prg_ideregistro=:idprograma and uu.emp_ideregistro=:idempresa and u.usu_ideregistro=:idusuario",nativeQuery = true)
    List<Map<String,Object>> findMenuByUsuAndPrg(@Param("idusuario")Integer idusuario, @Param("idprograma")Integer idprograma, @Param("idempresa")Integer idempresa);
}
