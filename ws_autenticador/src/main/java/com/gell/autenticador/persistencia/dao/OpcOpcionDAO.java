package com.gell.autenticador.persistencia.dao;

import com.gell.autenticador.persistencia.dao.crud.OpcOpcionCRUD;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import com.gell.estandar.persistencia.entidades.PrgPrograma;
import javax.sql.DataSource;

import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import java.sql.ResultSet;
import java.util.List;
import java.util.Map;

public class OpcOpcionDAO extends OpcOpcionCRUD {

  public OpcOpcionDAO(DataSource datasource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(datasource, auditoria);
  }

  /**
   * Construye el menú con las opciones del usuario y la empresa que están en
   * sesión
   *
   * @return @throws PersistenciaExcepcion Error al consultar
   */
  public List<OpcOpcion> consultarMenu()
          throws PersistenciaExcepcion
  {
    parametros.put("idusuario", auditoria.getIdUsuario());
    parametros.put("idempresa", auditoria.getIdEmpresa());
    StringBuilder sql = new StringBuilder();
    sql.append("WITH RECURSIVE programas AS ( ")
            .append("   (SELECT ")
            .append("      opc.*, ")
            .append("      prg.* ")
            .append("    FROM ")
            .append("      opc_opcion opc ")
            .append("      INNER JOIN oppf_opcperfil oppf ON opc.opc_ideregistro = oppf.opc_ideregistro ")
            .append("      INNER JOIN pfi_perfil pfi ON pfi.pfi_ideregistro = oppf.pfi_ideregistro ")
            .append("      INNER JOIN usem_usuempresa usem ON usem.pfi_ideregistro = pfi.pfi_ideregistro ")
            .append("      INNER JOIN prg_programa prg ON opc.prg_ideregistro = prg.prg_ideregistro ")
            .append("    WHERE ")
            .append("      usem.usu_ideregistro = :idusuario AND ")
            .append("      usem.emp_ideregistro = :idempresa ")
            .append("    ORDER BY opc_idepadre NULLS FIRST, opc.opc_ideregistro) ")
            .append("   UNION ")
            .append("   (SELECT ")
            .append("      opcs.*, ")
            .append("      prg.* ")
            .append("    FROM opc_opcion opcs ")
            .append("      INNER JOIN programas ON opcs.opc_ideregistro = programas.opc_idepadre ")
            .append("      LEFT JOIN prg_programa prg ON opcs.prg_ideregistro = prg.prg_ideregistro ")
            .append("    ORDER BY opcs.opc_ideregistro ")
            .append("   ) ")
            .append(" ) ")
            .append(" SELECT * ")
            .append(" FROM programas ")
            .append(" ORDER BY opc_idepadre NULLS FIRST, opc_ideregistro");

    return ejecutarConsulta(sql, parametros,
            (ResultSet rs, Map<String, Integer> columns) -> {
              OpcOpcion opcion = getOpcOpcion(rs);
              PrgPrograma programa = PrgProgramaDAO.getPrgPrograma(rs);
              opcion.setPrgIderegistro(programa);
              return opcion;
            });
  }
}
