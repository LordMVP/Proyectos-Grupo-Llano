package com.gell.autenticador.persistencia.dao;

import com.gell.autenticador.persistencia.dao.crud.AccAccesoCRUD;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import javax.sql.DataSource;

public class AccAccesoDAO extends AccAccesoCRUD {

  public AccAccesoDAO(DataSource datasource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(datasource, auditoria);
  }

}
