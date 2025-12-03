package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
public class Usuarios {
	@Id
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name = "usuario_nit")
	private String usuarioNit;
	
	@Column(name = "usuario_nom")
	private String usuarioNom;
	
	@Column(name = "usuario_codcar")
	private String usuarioCodcar;
	
	@Column(name = "usuario_codper")
	private String usuarioCodper;
	
	@Column(name = "usuario_pas")
	private String usuarioPas;
	
	@Column(name = "usuario_codemp")
	private String usuarioCodemp;
	
	@Column(name = "usuario_coddepemp")
	private String usuarioCoddepemp;
	
	@Column(name = "usuario_swtact")
	private Boolean usuarioSwtact;
	
	@Column(name = "usuario_mail")
	private String usuarioMail;
	
	@Column(name = "usuario_swtcar")
	private Boolean usuarioSwtcar;
	
	@Column(name = "usuario_swtper")
	private Boolean usuarioSwtper;
	
	@Column(name = "usuario_codpro")
	private String usuarioCodpro;
	
	@Column(name = "usu_topfinancia")
	private Long usuTopfinancia;
	
	@Column(name = "usu_modrecexterno")
	private String usuModrecexterno;
	
	@Column(name = "usu_finvencido")
	private String usuFinvencido;
	
	@Column(name = "usu_login")
	private String usuLogin;	
	
}
