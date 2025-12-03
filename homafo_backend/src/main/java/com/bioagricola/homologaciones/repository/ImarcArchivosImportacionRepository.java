package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;


public interface ImarcArchivosImportacionRepository extends JpaRepository<ImarcArchivosImportacion,Long>
{
	public static String esquemaAseo = "aseo";
	
	@Query(value = "SELECT\n" + 
			"impar.impar_ideregistro,\n" + 
			"impar.impar_columna_interna,\n" + 
			"impar.impar_columna_externa,\n" + 
			"impar.impar_tabla_interna,\n" + 
			"impar.impar_tipo_dato,\n" + 
			"impar.impar_obligatorio,\n" + 
			"impar.impar_homologa,\n" + 
			"imarc_ideregistro,\n" +
			"impar.impar_tabla_referencia,\n" + 
			"impar.impar_columna_referencia,\n" + 
			"impar.impar_encabezado\n" + 
			"FROM "+esquemaAseo+".impar_parametros_importacion impar\n" + 
			"WHERE imarc_ideregistro= :imarcId ",nativeQuery = true)
	List<Object[]> InformacionArchivo(@Param("imarcId") Integer imarcId);
	
	
	@Query(value = "SELECT\n" + 
			"dimpa.dimpa_ideregistro,\n" + 
			"dimpa.impar_ideregistro,\n" + 
			"dimpa.dimpa_valor_externo,\n" + 
			"dimpa.dimpa_valor_interno,\n" +
			"dimpa.dimpa_valor_interno_nombre\n" + 
			"FROM "+esquemaAseo+".dimpa_deta_importparam dimpa\n" + 
			"WHERE dimpa.impar_ideregistro= :imparId ",nativeQuery = true)
	List<Object[]> InformacionArchivoDetalle(@Param("imparId") Integer imparId);
	
	@Query(value="SELECT\n" + 
			"dsus.dsus_pcodigo as codigo,\n" + 
			"uni1.uni_nombre1 as ubicacion,\n" + 
			"dsus.pro_catestrato as estrato,\n" + 
			"proy.proyecto_nom as proyecto,\n" + 
			"ter.ter_nomcompleto as tercero,\n" + 
			"ter.ter_documento as identificacion,\n" + 
			"pro.pro_direccion as direccion,\n" + 
			"cic.cic_nombre as ciclo,\n" + 
			"uni2.uni_nombre1 as tipoUso,\n" + 
			"pro.pro_idepropieda as contador,\n" + 
			"pro.pro_numcatastral as catastral,\n" + 
			"to_char(dsus.dsus_fecinicio,'DD-MM-YYYY')\n" + 
			"FROM dsus_detsuscrip dsus\n" + 
			"INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro\n" + 
			"LEFT JOIN uni_unidad uni1 ON uni1.uni_ideregistro=pro.uni_tipovivienda\n" + 
			"LEFT JOIN uni_unidad uni2 ON uni2.uni_ideregistro=dsus.uni_tipusosuscr\n" + 
			"INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio\n" + 
			"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro\n" + 
			"INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro\n" + 
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro\n" + 
			"WHERE dsus.dsus_fecinicio BETWEEN :fecha1 AND :fecha2 AND cic.cic_ideregistro= :ciclo \n" + 
			"AND sus.cnre_ideregistr IN (0)", nativeQuery = true)
	List<Object[]> InformacionLLanogas(@Param("fecha1") String fecha1, @Param("fecha2") String fecha2 , @Param("ciclo") Integer ciclo);
	
	@Query(value="SELECT i.imarcIderegistro, i.imarcNombreArchivo, i.imarcTipoArchivo,i.imarcTipoProceso FROM ImarcArchivosImportacion i WHERE i.imarcEstado = 'A'")
	List<Object[]> tiposArchivos();
	
	@Query(value="SELECT\n" + 
			"imarc_nombre_archivo,imarc_tipo_archivo, imarc_ideregistro,imarc_tipo_proceso,imarc_estado \n" + 
			"FROM aseo.imarc_archivos_importacion\n" + 
			"WHERE imarc_ideregistro= :imarc", nativeQuery = true)
	List<Object[]> buscarImarc(@Param("imarc") Integer imarc);
	
	@Query(value="SELECT\n" + 
			"imcol_nombre,\n" + 
			"imcol_descripcion,\n" + 
			"imcol_tipo_dato,\n" + 
			"imcol_obligatorio,\n" + 
			"imcol_validador,\n" + 
			"imcol_tipo_resolucion,\n" + 
			"Cast(imcol_json as VARCHAR),\n" +
			"imcol_ideregistro\n" + 
			"FROM aseo.imcol_importar_columna \n" + 
			"WHERE imarc_ideregistro= :imarc", nativeQuery = true)
	List<Object[]> buscarImcol(@Param("imarc") Integer imarc);
	
	@Query(value="SELECT\n" + 
			"imins_tabla,imins_orden,Cast(imins_json as VARCHAR),imins_ideregistro\n" + 
			"FROM aseo.imins_importar_inserts \n" + 
			"WHERE imarc_ideregistro= :imarc", nativeQuery = true)
	List<Object[]> buscarimins(@Param("imarc") Integer imarc);
	
	@Query(value="SELECT\n" + 
			"dimins_column_name,\n" + 
			"Cast(dimins_json as VARCHAR),\n" + 
			"dimins_tipo_resolucion,\n" + 
			"dimins_tipo_dato,\n" + 
			"dimins_validador,\n" + 
			"dimins_obligatorio,\n" + 
			"dimins_longitud, \n" +
			"dimins_ideregistro,\n" +
			"dimins_editable,\n" +
			"dimins_sugerido,\n" +
			"Cast(dimins_json_sugerido as VARCHAR) \n" +
			"FROM aseo.dimins_dimportar_inserts\n" + 
			"WHERE imins_ideregistro= :imins", nativeQuery = true)
	List<Object[]> buscardimins(@Param("imins") Integer imins);
	
	@Query(value="SELECT i FROM ImarcArchivosImportacion i WHERE i.imarcIderegistro= :id")
	ImarcArchivosImportacion buscarIdImarc(@Param("id") Long id);
	

}
