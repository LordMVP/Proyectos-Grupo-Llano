package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

@Entity
@Table(name="usuarios")
@NamedQuery(name = "Usuarios.findAll", query = "SELECT p FROM Usuarios p")
public class Usuarios implements Serializable{
private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_USUARIOS_PK = "usuarioNit";
	public static final String ENTIDAD_USUARIOS_USUARIO_NOM = "usuarioNom";
	public static final String ENTIDAD_USUARIOS_USUARIO_CODCAR = "usuarioCodcar";
	public static final String ENTIDAD_USUARIOS_USUARIO_CODPER = "usuarioCodper";
	public static final String ENTIDAD_USUARIOS_USUARIO_PAS = "usuarioPas";
	public static final String ENTIDAD_USUARIOS_USUARIO_CODEMP = "usuarioCodemp";
	public static final String ENTIDAD_USUARIOS_USUARIO_CODDEPEMP = "usuarioCoddepemp";
	public static final String ENTIDAD_USUARIOS_USUARIO_SWTACT = "usuarioSwtact";
	public static final String ENTIDAD_USUARIOS_USUARIO_MAIL = "usuarioMail";
	public static final String ENTIDAD_USUARIOS_USUARIO_SWTCAR = "usuarioSwtcar";
	public static final String ENTIDAD_USUARIOS_USUARIO_SWTPER = "usuarioSwtper";
	public static final String ENTIDAD_USUARIOS_USUARIO_CODPRO = "usuarioCodpro";
	public static final String ENTIDAD_USUARIOS_USU_TOPFINANCIA = "usuTopfinancia";
	public static final String ENTIDAD_USUARIOS_USU_MODRECEXTERNO = "usuModrecexterno";
	public static final String ENTIDAD_USUARIOS_USU_IDREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_USUARIOS_USU_FINVENCIDO = "usuFinvencido";
	public static final String ENTIDAD_USUARIOS_USU_LOGIN = "usuLogin";
	private static final String[] ATRIBUTOS_ENTIDAD_USUARIOS
     = {ENTIDAD_USUARIOS_PK,ENTIDAD_USUARIOS_USUARIO_NOM,ENTIDAD_USUARIOS_USUARIO_CODCAR,ENTIDAD_USUARIOS_USUARIO_CODPER,ENTIDAD_USUARIOS_USUARIO_PAS,
    		 ENTIDAD_USUARIOS_USUARIO_CODEMP,ENTIDAD_USUARIOS_USUARIO_CODDEPEMP,ENTIDAD_USUARIOS_USUARIO_SWTACT,ENTIDAD_USUARIOS_USUARIO_MAIL,ENTIDAD_USUARIOS_USUARIO_SWTCAR,
    		 ENTIDAD_USUARIOS_USUARIO_SWTPER,ENTIDAD_USUARIOS_USUARIO_CODPRO,ENTIDAD_USUARIOS_USU_TOPFINANCIA,ENTIDAD_USUARIOS_USU_MODRECEXTERNO,ENTIDAD_USUARIOS_USU_IDREGISTRO,
    		 ENTIDAD_USUARIOS_USU_FINVENCIDO,ENTIDAD_USUARIOS_USU_LOGIN};
	
	@Id
    @Column(name="usuario_nit")
	@Size(min=0, max= 12)
	private String usuarioNit;
	
	@Column(name="usuario_nom")
	@Size(min=0, max= 60)
	private String usuarioNom;
	
	@Column(name="usuario_codcar")
	@Size(min=0, max= 3)
	private String usuarioCodcar;
	
	@Column(name="usuario_codper")
	@Size(min=0, max= 4)
	private String usuarioCodper;
	
	@Column(name="usuario_pas")
	@Size(min=0, max= 40)
	private String usuarioPas;
	
	@Column(name="usuario_codemp")
	@Size(min=0, max= 12)
	private String usuarioCodemp;
	
	@Column(name="usuario_coddepemp")
	@Size(min=0, max= 3)
	private String usuarioCoddepemp;
	
	@Column(name="usuario_swtact")
	@Size(min=0, max= 1)
	private Boolean usuarioSwtact;
	
	@Column(name="usuario_mail")
	@Size(min=0, max= 50)
	private String usuarioMail;
	
	@Column(name="usuario_swtcar")
	@Size(min=0, max= 1)
	private Boolean usuarioSwtcar;
	
	@Column(name="usuario_swtper")
	@Size(min=0, max= 1)
	private Boolean usuarioSwtper;
	
	@Column(name="usuario_codpro")
	@Size(min=0, max= 2)
	private String usuarioCodpro;
	
	@Column(name="usu_topfinancia")
	private BigDecimal usuTopfinancia;
	
	@Column(name="usu_modrecexterno")
	@Size(min=0, max= 1)
	private String usuModrecexterno;
	
	@Column(name="usu_ideregistro")
	@PodamExclude
	private Integer usuIderegistro;
	
	@Column(name="usu_finvencido")
	@Size(min=0, max= 1)
	private String usuFinvencido;
	
	@Column(name="usu_login")
	@Size(min=0, max= 20)
	private String usuLogin;
	
	@ManyToOne
	@JoinColumn(name="usuario_codemp", referencedColumnName="empresa_cod", insertable = false, updatable = false)
	@PodamExclude
    private Empresas empresasEmpresasCodfkUsuariosCodemp;
	
	@OneToMany(mappedBy="accAccesoUsuIderegistroFkey1")
	@PodamExclude
    private List<AccAcceso> fkAccAcceso;
	
	
	
	public Usuarios() {
		
	}

	/**
	 * geters y setters
	 * @return
	 */

	public String getUsuarioNit() {
		return usuarioNit;
	}

	public void setUsuarioNit(String usuarioNit) {
		this.usuarioNit = usuarioNit;
	}

	public String getUsuarioNom() {
		return usuarioNom;
	}

	public void setUsuarioNom(String usuarioNom) {
		this.usuarioNom = usuarioNom;
	}

	public String getUsuarioCodcar() {
		return usuarioCodcar;
	}

	public void setUsuarioCodcar(String usuarioCodcar) {
		this.usuarioCodcar = usuarioCodcar;
	}

	public String getUsuarioCodper() {
		return usuarioCodper;
	}

	public void setUsuarioCodper(String usuarioCodper) {
		this.usuarioCodper = usuarioCodper;
	}

	public String getUsuarioPas() {
		return usuarioPas;
	}

	public void setUsuarioPas(String usuarioPas) {
		this.usuarioPas = usuarioPas;
	}

	public String getUsuarioCodemp() {
		return usuarioCodemp;
	}

	public void setUsuarioCodemp(String usuarioCodemp) {
		this.usuarioCodemp = usuarioCodemp;
	}

	public String getUsuarioCoddepemp() {
		return usuarioCoddepemp;
	}

	public void setUsuarioCoddepemp(String usuarioCoddepemp) {
		this.usuarioCoddepemp = usuarioCoddepemp;
	}

	public Boolean getUsuarioSwtact() {
		return usuarioSwtact;
	}

	public void setUsuarioSwtact(Boolean usuarioSwtact) {
		this.usuarioSwtact = usuarioSwtact;
	}

	public String getUsuarioMail() {
		return usuarioMail;
	}

	public void setUsuarioMail(String usuarioMail) {
		this.usuarioMail = usuarioMail;
	}

	public Boolean getUsuarioSwtcar() {
		return usuarioSwtcar;
	}

	public void setUsuarioSwtcar(Boolean usuarioSwtcar) {
		this.usuarioSwtcar = usuarioSwtcar;
	}

	public Boolean getUsuarioSwtper() {
		return usuarioSwtper;
	}

	public void setUsuarioSwtper(Boolean usuarioSwtper) {
		this.usuarioSwtper = usuarioSwtper;
	}

	public String getUsuarioCodpro() {
		return usuarioCodpro;
	}

	public void setUsuarioCodpro(String usuarioCodpro) {
		this.usuarioCodpro = usuarioCodpro;
	}

	public BigDecimal getUsuTopfinancia() {
		return usuTopfinancia;
	}

	public void setUsuTopfinancia(BigDecimal usuTopfinancia) {
		this.usuTopfinancia = usuTopfinancia;
	}

	public String getUsuModrecexterno() {
		return usuModrecexterno;
	}

	public void setUsuModrecexterno(String usuModrecexterno) {
		this.usuModrecexterno = usuModrecexterno;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public String getUsuFinvencido() {
		return usuFinvencido;
	}

	public void setUsuFinvencido(String usuFinvencido) {
		this.usuFinvencido = usuFinvencido;
	}

	public String getUsuLogin() {
		return usuLogin;
	}

	public void setUsuLogin(String usuLogin) {
		this.usuLogin = usuLogin;
	}
	
	
	public Empresas getEmpresasEmpresasCodfkUsuariosCodemp() {
		return empresasEmpresasCodfkUsuariosCodemp;
	}

	public void setEmpresasEmpresasCodfkUsuariosCodemp(Empresas empresasEmpresasCodfkUsuariosCodemp) {
		this.empresasEmpresasCodfkUsuariosCodemp = empresasEmpresasCodfkUsuariosCodemp;
	}

	public List<AccAcceso> getFkAccAcceso() {
		return fkAccAcceso;
	}

	public void setFkAccAcceso(List<AccAcceso> fkAccAcceso) {
		this.fkAccAcceso = fkAccAcceso;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_USUARIOS) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    

	public static String[] getAtributosEntidadDfacDetfactura() {
		return ATRIBUTOS_ENTIDAD_USUARIOS;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((usuFinvencido == null) ? 0 : usuFinvencido.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		result = prime * result + ((usuLogin == null) ? 0 : usuLogin.hashCode());
		result = prime * result + ((usuModrecexterno == null) ? 0 : usuModrecexterno.hashCode());
		result = prime * result + ((usuTopfinancia == null) ? 0 : usuTopfinancia.hashCode());
		result = prime * result + ((usuarioCodcar == null) ? 0 : usuarioCodcar.hashCode());
		result = prime * result + ((usuarioCoddepemp == null) ? 0 : usuarioCoddepemp.hashCode());
		result = prime * result + ((usuarioCodemp == null) ? 0 : usuarioCodemp.hashCode());
		result = prime * result + ((usuarioCodper == null) ? 0 : usuarioCodper.hashCode());
		result = prime * result + ((usuarioCodpro == null) ? 0 : usuarioCodpro.hashCode());
		result = prime * result + ((usuarioMail == null) ? 0 : usuarioMail.hashCode());
		result = prime * result + ((usuarioNit == null) ? 0 : usuarioNit.hashCode());
		result = prime * result + ((usuarioNom == null) ? 0 : usuarioNom.hashCode());
		result = prime * result + ((usuarioPas == null) ? 0 : usuarioPas.hashCode());
		result = prime * result + ((usuarioSwtact == null) ? 0 : usuarioSwtact.hashCode());
		result = prime * result + ((usuarioSwtcar == null) ? 0 : usuarioSwtcar.hashCode());
		result = prime * result + ((usuarioSwtper == null) ? 0 : usuarioSwtper.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Usuarios other = (Usuarios) obj;
		if (usuFinvencido == null) {
			if (other.usuFinvencido != null)
				return false;
		} else if (!usuFinvencido.equals(other.usuFinvencido))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		if (usuLogin == null) {
			if (other.usuLogin != null)
				return false;
		} else if (!usuLogin.equals(other.usuLogin))
			return false;
		if (usuModrecexterno == null) {
			if (other.usuModrecexterno != null)
				return false;
		} else if (!usuModrecexterno.equals(other.usuModrecexterno))
			return false;
		if (usuTopfinancia == null) {
			if (other.usuTopfinancia != null)
				return false;
		} else if (!usuTopfinancia.equals(other.usuTopfinancia))
			return false;
		if (usuarioCodcar == null) {
			if (other.usuarioCodcar != null)
				return false;
		} else if (!usuarioCodcar.equals(other.usuarioCodcar))
			return false;
		if (usuarioCoddepemp == null) {
			if (other.usuarioCoddepemp != null)
				return false;
		} else if (!usuarioCoddepemp.equals(other.usuarioCoddepemp))
			return false;
		if (usuarioCodemp == null) {
			if (other.usuarioCodemp != null)
				return false;
		} else if (!usuarioCodemp.equals(other.usuarioCodemp))
			return false;
		if (usuarioCodper == null) {
			if (other.usuarioCodper != null)
				return false;
		} else if (!usuarioCodper.equals(other.usuarioCodper))
			return false;
		if (usuarioCodpro == null) {
			if (other.usuarioCodpro != null)
				return false;
		} else if (!usuarioCodpro.equals(other.usuarioCodpro))
			return false;
		if (usuarioMail == null) {
			if (other.usuarioMail != null)
				return false;
		} else if (!usuarioMail.equals(other.usuarioMail))
			return false;
		if (usuarioNit == null) {
			if (other.usuarioNit != null)
				return false;
		} else if (!usuarioNit.equals(other.usuarioNit))
			return false;
		if (usuarioNom == null) {
			if (other.usuarioNom != null)
				return false;
		} else if (!usuarioNom.equals(other.usuarioNom))
			return false;
		if (usuarioPas == null) {
			if (other.usuarioPas != null)
				return false;
		} else if (!usuarioPas.equals(other.usuarioPas))
			return false;
		if (usuarioSwtact == null) {
			if (other.usuarioSwtact != null)
				return false;
		} else if (!usuarioSwtact.equals(other.usuarioSwtact))
			return false;
		if (usuarioSwtcar == null) {
			if (other.usuarioSwtcar != null)
				return false;
		} else if (!usuarioSwtcar.equals(other.usuarioSwtcar))
			return false;
		if (usuarioSwtper == null) {
			if (other.usuarioSwtper != null)
				return false;
		} else if (!usuarioSwtper.equals(other.usuarioSwtper))
			return false;
		return true;
	}
	
	
	

}
