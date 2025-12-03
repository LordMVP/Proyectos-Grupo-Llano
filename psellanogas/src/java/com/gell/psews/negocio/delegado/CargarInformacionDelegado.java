/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.delegado;

import com.gell.psews.negocio.constantes.EEmpresa;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dao.ParametroDAO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.dto.pse.CorreoDTO;
import com.gell.psews.persistencia.dto.pse.DatosPSE;
import com.gell.psews.persistencia.dto.pse.EmpresaDTO;
import com.gell.psews.persistencia.dto.pse.InfoRecaudoDTO;
import com.gell.psews.persistencia.dto.pse.ProcesoDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.util.Properties;
import org.apache.commons.io.FileUtils;

/**
 *
 * @author spiwer
 */
public class CargarInformacionDelegado
{

  private ParametroDAO parametrosDAO;
  private Connection cnn;
  private Properties propiedades;
  private final int idEmpresa;

  public CargarInformacionDelegado(int idEmpresa)
  {
    try {
      this.idEmpresa = idEmpresa;
      conectar();
    } catch (PersistenciaExcepcion ex) {
      LogUtil.error(ex);
      throw new RuntimeException("No se encontró el archivo de configuración");
    }
  }

  private void conectar()
          throws PersistenciaExcepcion
  {
    cnn = ConexionBD.conectar();
    parametrosDAO = new ParametroDAO(cnn);
  }

  @SuppressWarnings("UseSpecificCatch")
  public ConfiguracionDTO cargar(String plantilla)
  {
    try {
      propiedades = parametrosDAO.consultar(idEmpresa);
      return new ConfiguracionDTO()
              .setCorreo(getCorreo(plantilla))
              .setDatosPSE(getDatosPSE())
              .setRecaudo(getInfoRecaudo())
              .setEmpresa(getEmpresa())
              .setProceso(getProceso());
    } catch (Exception ex) {
    
        LogUtil.error(ex);
      throw new RuntimeException("No se encontró la configuración para la empresa " + idEmpresa);
    
    } finally {
        ConexionBD.cerrar(cnn);
    }
  }

  private String getProperty(String propiedad)
  {
    String valor = propiedades.getProperty(propiedad);
    return valor == null ? null : valor.trim().replaceAll("\"", "");

  }

    private CorreoDTO getCorreo(String rutaPlantilla)
          throws IOException
  {
    String plantilla = FileUtils.readFileToString(new File(rutaPlantilla), "UTF-8");
    return new CorreoDTO()
            .setServidor(getProperty("mail.smtp.servidor"))
            .setStartTls(getProperty("mail.smtp.starttls.enable"))
            .setPuerto(Integer.parseInt(getProperty("mail.smtp.port")))
            .setAutenticacion(getProperty("mail.smtp.auth"))
            .setMail(getProperty("mail.email"))
            .setClave(getProperty("mail.password"))
            .setCorreoDestino(getProperty("mail.to"))
            .setCorreoDestinoCopia(getProperty("mail.cc"))
            .setAsunto(getProperty("mail.asunto"))
            .setPlantilla(plantilla);
  }

  private DatosPSE getDatosPSE()
  {
    DatosPSE datosPSE = new DatosPSE()
            .setPassword(getProperty("pse.password"))
            .setServiceCode(getProperty("pse.servicecode"))
            .setEntityURL(getProperty("pse.entityurl"))
            .setMessage(getProperty("pse.mensaje"))
            .setUrlBancosPSE(getProperty("pse.urlbancos"))
            .setTicketOfficeId(Integer.parseInt(getProperty("pse.ticketOfficeId")))
            .setIpPublica(getProperty("pse.servidor.ip.publica"))
            .setServidorPrivado(getProperty("pse.servidor.privado"))
            .setServidorPublico(getProperty("pse.servidor.publico"))
            .setTiempoProcesoPSE(Long.parseLong(getProperty("pse.proceso.tiempo")))
            .setUrlPSE(getProperty("pse.url"));
    if (idEmpresa == EEmpresa.ID_LLANOGAS || idEmpresa == EEmpresa.ID_BIOAGRICOLA) {
      datosPSE.setCodigoSegunda(getProperty("pse.codigo.llanogas.bioagricola"))
              .setCodigoPrincipal(getProperty("pse.codigo.llanogas"));
      return datosPSE;
    }
    return datosPSE.setCodigoPrincipal(getProperty("pse.codigo.cusiana"));
  }

  private EmpresaDTO getEmpresa()
  {
    EmpresaDTO empresa = new EmpresaDTO()
            .setUrlHabeasData(getProperty("url_autorizacion_habeas_data"));
    
    empresa.setUrlPoliticaHabeas(getProperty("url_politica_habeas_data"));
    
    if (idEmpresa == EEmpresa.ID_LLANOGAS || idEmpresa == EEmpresa.ID_BIOAGRICOLA) {
      return empresa.setIdEmpresaPrincipal(Integer.parseInt(getProperty("empresas.llanogas.id")))
              .setNitEmpresaPrincipal(getProperty("empresas.llanogas.nit"))
              .setIdEmpresaSegunda(Integer.parseInt(getProperty("empresas.bioagricola.id")))
              .setNitEmpresaSegunda(getProperty("empresas.bioagricola.nit"));
    }
    return empresa
            .setIdEmpresaPrincipal(Integer.parseInt(getProperty("empresas.cusiana.id")))
            .setNitEmpresaPrincipal(getProperty("empresas.cusiana.nit"));
  }

  private InfoRecaudoDTO getInfoRecaudo()
  {
    return new InfoRecaudoDTO()
            .setFormaPago(Integer.parseInt(getProperty("formapago.pse")))
            .setUsuario(Integer.parseInt(getProperty("usuario.pse")))
            .setMedio(Integer.parseInt(getProperty("mediopago.pse")))
            .setOficina(Integer.parseInt(getProperty("oficina.id")))
            .setOficinaaseo(Integer.parseInt(getProperty("oficinaaseo.id")));
  }

  private ProcesoDTO getProceso()
  {
    return new ProcesoDTO()
            .setTiempoProcesoAplicacion(Long.parseLong(getProperty("recaudo.proceso.tiempo")))
            .setTiempoProcesoPSE(Long.parseLong(getProperty("pse.proceso.tiempo")));
  }

}
