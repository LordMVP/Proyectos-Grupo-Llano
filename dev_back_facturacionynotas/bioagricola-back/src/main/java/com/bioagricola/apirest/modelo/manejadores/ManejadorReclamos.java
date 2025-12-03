package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.Reclamos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad Empresas.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorReclamos extends ManejadorCrud<Reclamos, String>, IManejadorCrud<Reclamos, String> {

	/**
	 * Método encargado de realizar la consulta de validación de si existe la PQR,
	 * por medio de el número de pqr y empresa en sesión
	 */
	@Query("select rec.reclamoFecsol as FECHA_SOLICITUD, " + "rec.reclamoNumpqr as RADICADO, "
			+ "sol.solicitudNom as SOLICITUD_PETICION_RECLAMO_ESTIPOSERVICIO, "
			+ "tipate.tipatencionDes as TIPO_ATENCION, " + "tipsol.solicitudNom as TIPO_SOLICITUD_SECCION, "
			+ "ser.servicioNom as ACTVIDAD_A_REALIZAR_ESSERVICIO, " + "rec.reclamoObssol as OBSERVACIONES,  "
			+ "rec.reclamoSwtdes as DESCARTADO, " + "tt.terDocumento as DOCUMENTO_TERCERO, "
			+ "tt.terNomcompleto as NOMBRE_TERCERO, " + "dd.dsusIderegistr as ID_SUSCRIPCION, "
			+ "rec.reclamoTipate as TIPO_RECLAMO, " + "rec.reclamoTipnot as TIPO_NOTA " + "from Reclamos rec "
			+ "inner join Solicitudes tipsol on tipsol.solicitudCod=rec.reclamoTipsol and tipsol.solicitudCodemp=rec.reclamoCodemp "
			+ "inner join Solicitudes sol on sol.solicitudCod=rec.reclamoCodrec and sol.solicitudCodemp=rec.reclamoCodemp "
			+ "inner join Servicios ser on ser.servicioCod=rec.reclamoEst and ser.servicioCodemp=rec.reclamoCodemp "
			+ "inner join TipAtenciones tipate on tipate.tipatencionCod=rec.reclamoTipate and tipate.tipatencionCodemp=rec.reclamoCodemp "
			+ "inner join TipAtenciones tipnot on tipnot.tipatencionCod=rec.reclamoTipnot and tipnot.tipatencionCodemp=rec.reclamoCodemp "
			+ "inner join DsusDetsuscrip dd on dd.dsusPcodigo  = rec.reclamoCodsus  "
			+ "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
			+ "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro  "
			+ "where rec.reclamoNumpqr= :numeroPqr " + "AND dd.empIderegistro = :idEmpresa ")
	public List<Object[]> validarPqr(@Param("numeroPqr") String numeroPqr, @Param("idEmpresa") int idEmpresa);

	@Query("select rec.reclamoFecsol as FECHA_SOLICITUD, " + "rec.reclamoNumpqr as RADICADO, "
			+ "sol.solicitudNom as SOLICITUD_PETICION_RECLAMO_ESTIPOSERVICIO, "
			+ "tipate.tipatencionDes as TIPO_ATENCION, " + "tipsol.solicitudNom as TIPO_SOLICITUD_SECCION, "
			+ "ser.servicioNom as ACTVIDAD_A_REALIZAR_ESSERVICIO, " + "rec.reclamoObssol as OBSERVACIONES,  "
			+ "rec.reclamoSwtdes as DESCARTADO, " + "tt.terDocumento as DOCUMENTO_TERCERO, "
			+ "tt.terNomcompleto as NOMBRE_TERCERO, " + "dd.dsusIderegistr as ID_SUSCRIPCION, "
			+ "rec.reclamoTipate as TIPO_RECLAMO, " + "rec.reclamoTipnot as TIPO_NOTA " + "from Reclamos rec "
			+ "inner join Solicitudes tipsol on tipsol.solicitudCod=rec.reclamoTipsol and tipsol.solicitudCodemp=rec.reclamoCodemp "
			+ "inner join Solicitudes sol on sol.solicitudCod=rec.reclamoCodrec and sol.solicitudCodemp=rec.reclamoCodemp "
			+ "inner join Servicios ser on ser.servicioCod=rec.reclamoEst and ser.servicioCodemp=rec.reclamoCodemp "
			+ "inner join TipAtenciones tipate on tipate.tipatencionCod=rec.reclamoTipate and tipate.tipatencionCodemp=rec.reclamoCodemp "
			+ "inner join TipAtenciones tipnot on tipnot.tipatencionCod=rec.reclamoTipnot and tipnot.tipatencionCodemp=rec.reclamoCodemp "
			+ "inner join DsusDetsuscrip dd on dd.dsusPcodigo  = rec.reclamoCodsus  "
			+ "inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "
			+ "inner join Empresas e2 on e2.empresaSevemp = dd.empIderegistro  "
			+ "where rec.reclamoNumpqr= :numeroPqr " + "AND dd.empIderegistro = :idEmpresa "
			+ "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) "
			+ "AND (:nombreTercero is null OR lower(tt.terNomcompleto) LIKE %:nombreTercero% )"
			+ "AND (:terceroDocumento is null OR tt.terDocumento = :terceroDocumento) ")
	public List<Object[]> consultaPqr(@Param("numeroPqr") String numeroPqr, @Param("idSuscripcion") Long idSuscripcion,
			@Param("nombreTercero") String nombreTercero, @Param("terceroDocumento") String terceroDocumento,
			@Param("idEmpresa") int idEmpresa);

	@Query("select rec " + "from Reclamos rec " + "inner join Empresas e2 on e2.empresaCod = rec.reclamoCodemp  "
			+ "inner join DsusDetsuscrip dd on dd.dsusPcodigo  = rec.reclamoCodsus  "
			+ "where e2.empresaSevemp = :idEmpresa " + "AND (:numeroPqr is null OR rec.reclamoNumpqr= :numeroPqr) "
			+ "AND (:idSuscripcion is null OR dd.dsusIderegistr =:idSuscripcion) ")
	public Reclamos consultaPqrUnica(@Param("numeroPqr") String numeroPqr, @Param("idSuscripcion") Long idSuscripcion,
			@Param("idEmpresa") int idEmpresa);

	@Modifying
	@Query(value = "update reclamos r  " + "set reclamo_obssol = :observacion,  " + "reclamo_tipnot = :tipoNota  "
			+ "where r.reclamo_numpqr= :numeroPqr   " + "and r.reclamo_codsus in  "
			+ "( select dd.dsus_pcodigo from dsus_detsuscrip dd  " + "where dd.dsus_ideregistr = :idSuscripcion )  "
			+ "and r.reclamo_codemp in  " + "( select e.empresa_cod from empresas e "
			+ "where e.empresa_sevemp = :idEmpresa )", nativeQuery = true)
	@Transactional
	public void modificarPqrUnica(@Param("numeroPqr") String numeroPqr, @Param("idSuscripcion") Long idSuscripcion,
			@Param("idEmpresa") int idEmpresa, @Param("observacion") String observacion,
			@Param("tipoNota") String tipoNota);

	@Modifying
	@Query(value = "select  nr.novedadradicado_cod , " + "nr.novedadradicado_nom , " + "NOW() visitasol_fecvis ,"
			+ "s.servicio_cod visitasol_est , " + ":observaciones visitasol_obs , " + "dd.dsus_pcodigo visitacodsus , "
			+ "( case (nr.novedadradicado_swtfavusu)  when true then :parparametroafavorusuario " + "else "
			+ "case (nr.novedadradicado_swtfavemp)  when true then :parparametroafavorempresa " + "else "
			+ ":parparametroafavorna " + "end " + "end " + ") visitasol_Fav , "
			+ "reclamo_numpqr visitasol_numpqr , " + "dd.dsus_pcodigo  visitasol_codsus , "
			+ "rec.reclamo_codemp visitasol_codemp ,  " + "rec.reclamo_codemp visitasol_empcon ,  "
			+ "true vistaol_swtapl , " + "nr.novedadradicado_cod visitasol_codrep , "
			+ "(select usuario_nit from usuarios where usu_ideregistro = :idusuariosesion) visitasol_usugra, "
			+ ":parparametroestadigitacion visitasol_estdig " + "from reclamos rec "
			+ "inner join dsus_detsuscrip dd on dd.dsus_pcodigo  = rec.reclamo_codsus  "
			+ "inner join empresas emp on emp.empresa_cod = rec.reclamo_codemp and emp.empresa_sevemp = dd.emp_ideregistro  "
			+ "inner join solicitudes s2 on s2.solicitud_cod = rec.reclamo_codrec and s2.solicitud_codemp = rec.reclamo_codemp "
			+ "inner join novedades_radicado nr on nr.novedadradicado_gru = s2.solicitud_gru and nr.novedadradicado_codemp  = s2.solicitud_codemp and nr.novedadradicado_swtrep is true and nr.novedadradicado_swtact  is true  "
			+ "inner join servicios_agenda sa  on sa.serage_codage  = rec.reclamo_codage  and sa.serage_codemp  = rec.reclamo_codemp and sa.serage_swtact is true  "
			+ "inner join servicios s on s.servicio_cod  =sa.serage_codser and s.servicio_codemp  = sa.serage_codemp  "
			+ "where  " + "dd.emp_ideregistro  =:idempresasesion  "
			+ "and s.servicio_nom  in (:parparametronombreetapa )  "
			+ "and nr.novedadradicado_nom  in (:parparametronombrenovedad)  "
			+ "and dd.dsus_ideregistr  = :idsuscripcion  " + "and rec.reclamo_numpqr  = :numeropqr  "
			+ "and sa.serage_coddepemp = :parparametropqrsdependenciaservicio  "
			+ "and s.servicio_niv = :parparametropqrsnivelservicio", nativeQuery = true)
	@Transactional
	public List<Object[]> accedeData(@Param("observaciones") String observaciones,
			@Param("parparametroafavorusuario") String parparametroafavorusuario,
			@Param("parparametroafavorempresa") String parparametroafavorempresa,
			@Param("parparametroafavorna") String parparametroafavorna,
			@Param("idusuariosesion") Integer idusuariosesion,
			@Param("parparametroestadigitacion") String parparametroestadigitacion,
			@Param("idempresasesion") Integer idempresasesion,
			@Param("parparametronombreetapa") String parparametronombreetapa,
			@Param("parparametronombrenovedad") String[] parparametronombrenovedad,
			@Param("idsuscripcion") Integer idsuscripcion, @Param("numeropqr") String numeropqr,
			@Param("parparametropqrsdependenciaservicio") String parparametropqrsdependenciaservicio,
			@Param("parparametropqrsnivelservicio") Integer parparametropqrsnivelservicio);

}
