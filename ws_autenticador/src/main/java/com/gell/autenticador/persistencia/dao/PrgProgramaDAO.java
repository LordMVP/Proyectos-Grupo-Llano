package com.gell.autenticador.persistencia.dao;

import com.gell.autenticador.persistencia.dao.crud.PrgProgramaCRUD;
import javax.sql.DataSource;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;

public class PrgProgramaDAO extends PrgProgramaCRUD {

  public PrgProgramaDAO(DataSource datasource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(datasource, auditoria);
  }

}
