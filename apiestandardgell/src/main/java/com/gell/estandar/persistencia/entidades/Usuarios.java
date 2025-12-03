package com.gell.estandar.persistencia.entidades;

import com.gell.estandar.persistencia.abstracto.Entidad;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.io.Serializable;

/**
 *
 * @author hrey
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Usuarios extends Entidad implements Serializable {

  private String usuarioNit;
  private String usuarioNom;
  private String usuarioCodcar;
  private String usuarioCodper;
  private String usuarioPas;
  private Empresas usuarioCodemp;
  private String usuarioCoddepemp;
  private Boolean usuarioSwtact;
  private String usuarioMail;
  private Boolean usuarioSwtcar;
  private Boolean usuarioSwtper;
  private String usuarioCodpro;
  private Double usuTopfinancia;
  private String usuModrecexterno;
  private Integer usuIderegistro;
  private String usuFinvencido;
  private String usuLogin;

  public Usuarios()
  {
  }

  // <editor-fold defaultstate="collapsed" desc="GET-SET">
  public String getUsuarioNit()
  {
    return usuarioNit;
  }

  public Usuarios setUsuarioNit(String usuarioNit)
  {
    this.usuarioNit = usuarioNit;
    return this;
  }

  public String getUsuarioNom()
  {
    return usuarioNom;
  }

  public Usuarios setUsuarioNom(String usuarioNom)
  {
    this.usuarioNom = usuarioNom;
    return this;
  }

  public String getUsuarioCodcar()
  {
    return usuarioCodcar;
  }

  public Usuarios setUsuarioCodcar(String usuarioCodcar)
  {
    this.usuarioCodcar = usuarioCodcar;
    return this;
  }

  public String getUsuarioCodper()
  {
    return usuarioCodper;
  }

  public Usuarios setUsuarioCodper(String usuarioCodper)
  {
    this.usuarioCodper = usuarioCodper;
    return this;
  }

  public String getUsuarioPas()
  {
    return usuarioPas;
  }

  public Usuarios setUsuarioPas(String usuarioPas)
  {
    this.usuarioPas = usuarioPas;
    return this;
  }

  public Empresas getUsuarioCodemp()
  {
    return usuarioCodemp;
  }

  public Usuarios setUsuarioCodemp(Empresas usuarioCodemp)
  {
    this.usuarioCodemp = usuarioCodemp;
    return this;
  }

  public String getUsuarioCoddepemp()
  {
    return usuarioCoddepemp;
  }

  public Usuarios setUsuarioCoddepemp(String usuarioCoddepemp)
  {
    this.usuarioCoddepemp = usuarioCoddepemp;
    return this;
  }

  public Boolean getUsuarioSwtact()
  {
    return usuarioSwtact;
  }

  public Usuarios setUsuarioSwtact(Boolean usuarioSwtact)
  {
    this.usuarioSwtact = usuarioSwtact;
    return this;
  }

  public String getUsuarioMail()
  {
    return usuarioMail;
  }

  public Usuarios setUsuarioMail(String usuarioMail)
  {
    this.usuarioMail = usuarioMail;
    return this;
  }

  public Boolean getUsuarioSwtcar()
  {
    return usuarioSwtcar;
  }

  public Usuarios setUsuarioSwtcar(Boolean usuarioSwtcar)
  {
    this.usuarioSwtcar = usuarioSwtcar;
    return this;
  }

  public Boolean getUsuarioSwtper()
  {
    return usuarioSwtper;
  }

  public Usuarios setUsuarioSwtper(Boolean usuarioSwtper)
  {
    this.usuarioSwtper = usuarioSwtper;
    return this;
  }

  public String getUsuarioCodpro()
  {
    return usuarioCodpro;
  }

  public Usuarios setUsuarioCodpro(String usuarioCodpro)
  {
    this.usuarioCodpro = usuarioCodpro;
    return this;
  }

  public Double getUsuTopfinancia()
  {
    return usuTopfinancia;
  }

  public Usuarios setUsuTopfinancia(Double usuTopfinancia)
  {
    this.usuTopfinancia = usuTopfinancia;
    return this;
  }

  public String getUsuModrecexterno()
  {
    return usuModrecexterno;
  }

  public Usuarios setUsuModrecexterno(String usuModrecexterno)
  {
    this.usuModrecexterno = usuModrecexterno;
    return this;
  }

  public Integer getUsuIderegistro()
  {
    return usuIderegistro;
  }

  public Usuarios setUsuIderegistro(Integer usuIderegistro)
  {
    this.usuIderegistro = usuIderegistro;
    return this;
  }

  public String getUsuFinvencido()
  {
    return usuFinvencido;
  }

  public Usuarios setUsuFinvencido(String usuFinvencido)
  {
    this.usuFinvencido = usuFinvencido;
    return this;
  }

  public String getUsuLogin()
  {
    return usuLogin;
  }

  public Usuarios setUsuLogin(String usuLogin)
  {
    this.usuLogin = usuLogin;
    return this;
  }

  // </editor-fold>
  @Override
  public Usuarios validar()
          throws AplicacionExcepcion
  {
    return this;
  }
}
