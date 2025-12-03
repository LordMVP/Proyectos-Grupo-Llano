package com.bioagricola.hya.repository;

import com.bioagricola.hya.entity.TmpActSuscripcion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * Clase repositorio de la entidad TmpActSuscripcion
 * @author cperez@progracol.com
 */
@Repository
public interface TmpActSuscripcionRepository extends JpaRepository<TmpActSuscripcion,Long> {

    @Query("select t from TmpActSuscripcion t where t.actsusEstado = :estado and t.actsusTipo in ('Actualizacion','Independencia') ")
    Page<TmpActSuscripcion> listarPendientesTableOthers(@Param("estado") Character estado, Pageable pageable);

    @Query("select t from TmpActSuscripcion t where t.actsusEstado = :estado and t.dsusIderegistro = :dsus_ideregistro and t.actsusTipo in ('Actualizacion','Independencia') ")
    Page<TmpActSuscripcion> listarPendientesSuscripcion(@Param("estado") Character estado, @Param("dsus_ideregistro") Long dsusIderegistro, Pageable pageable);

    @Query("select t from TmpActSuscripcion t where t.actsusEstado = :estado and t.actsusTipo = 'Punto' ")
    Page<TmpActSuscripcion> listarPendientesTablePunto(@Param("estado") Character estado, Pageable pageable);
    
    @Query("select t from TmpActSuscripcion t where t.actsusEstado = :estado and t.dsusIderegistro = :dsus_ideregistro and t.actsusTipo in ('Actualizacion','Independencia','Punto') ")
    Page<TmpActSuscripcion> listarSincronizadosSuscripcion(@Param("estado") Character estado, @Param("dsus_ideregistro") Long dsusIderegistro, Pageable pageable);
    
    @Query(value = "WITH estratos AS (\n" +
            "    SELECT cast(uu.uni_codigo1 as int) idestrato, uu.uni_nombre1 nombre\n" +
            "    FROM est_estructura ee\n" +
            "             INNER JOIN esem_estempresa ee2 ON ee2.est_ideregistro = ee.est_ideregistro\n" +
            "             INNER JOIN uni_unidad uu ON uu.est_ideregistro = ee.est_ideregistro\n" +
            "    WHERE ee2.emp_ideregistro = :idempresa\n" +
            "      AND ee.cla_ideregistro = :idclaseEstratos234\n" +
            ")\n" +
            "\n" +
            "SELECT dsus.dsus_ideregistr                                                                 ID_SUSCRIPCION,\n" +
            "       dsus.dsus_pcodigo                                                                    COD_BIOAGRICOLA,\n" +
            "       homologacionactual.empresa_aliashomaseo                                              FACTURACION,\n" +
            "       dsus.dsus_fecinicio                                                                  FECHA_ENCUESTA,\n" +
            "       0                                                                                    CUADRILLA,\n" +
            "       ter.ter_nomcompleto                                                                  NOMBRE_SUSCRIPTOR,\n" +
            "       ter.ter_documento                                                                    NUMERO_DOCUMENTO,\n" +
            "       ter.ter_telfijo || '/' || ter.ter_telcelular                                         TELEFONO,\n" +
            "       ter.ter_correo                                                                       CORREO_ELECTRONICO,\n" +
            "       pro.pro_direccion                                                                    DIRECCION,\n" +
            "       bar.barrio_nom                                                                       BARRIO,\n" +
            "       info.iasus_nombreestablecimiento                                                     NOMBRE_ESTABLECIMIENTO,\n" +
            "       (SELECT nombre FROM estratos WHERE idestrato = pro_catestrato)                       ESTRATO,\n" +
            "       tipouso.uni_nombre1                                                                  USO_PREDIO ,\n" +
            "       tipoactividad.uni_nombre1                                                            TIPO_ACTIVIDAD,\n" +
            "       pro.pro_numcatastralnacional                                                         CATASTRAL,\n" +
            "       pro.pro_numcatastral                                                                 CATASTRAL_ANTERIOR,\n" +
            "       0                                                                                    NUM_PISOS,\n" +
            "       (CASE\n" +
            "            WHEN (SELECT count(*)\n" +
            "                  FROM cosu_consuscrip\n" +
            "                  WHERE dsus_ideregistr = dsus.dsus_ideregistr\n" +
            "                    AND uni_concepto = 5261\n" +
            "                    AND cast(cosu_fecfinal as date) >= cast(now() as date)) > 0 THEN 'SI'\n" +
            "            ELSE 'NO' END)                                                                  DESOCUPADO,\n" +
            "       (CASE\n" +
            "            WHEN (SELECT count(*)\n" +
            "                  FROM cosu_consuscrip\n" +
            "                  WHERE dsus_ideregistr = dsus.dsus_ideregistr\n" +
            "                    AND uni_concepto = 5262\n" +
            "                    AND cast(cosu_fecfinal as date) >= cast(now() as date)) > 0 THEN 'SI'\n" +
            "            ELSE 'NO' END)                                                                  AFORADO,\n" +
            "       '?'                                                                                  DESCUENTO_PAP,\n" +
            "       (CASE WHEN infohomologacionenergia.dsus_pcodigo IS NOT NULL THEN 'SI' ELSE 'NO' END) SERVICIO_ENERGIA,\n" +
            "       infohomologacionenergia.dsus_pcodigo                                                 CODIGO_EMSA,\n" +
            "       infohomologacionenergia.dgho_numeromedidor                                           MED_ENERGIA_ANTERIOR,\n" +
            "       0                                                                                    MED_ENERGIA,\n" +
            "       (CASE WHEN infohomologaciongas.dsus_pcodigo IS NOT NULL THEN 'SI' ELSE 'NO' END)     SERVICIO_GAS,\n" +
            "       infohomologaciongas.dsus_pcodigo                                                     CODIGO_LLANOGAS,\n" +
            "       infohomologaciongas.dgho_numeromedidor                                               MED_GAS,\n" +
            "       ''                                                                                   MARCA_MED_GAS,\n" +
            "       novedades.gact_observaciones                                                         OBSERVACION,\n" +
            "       novedades.reclamo_numpqr                                                             PQRS_RADICADO\n" +
            "\n" +
            "FROM dsus_detsuscrip dsus\n" +
            "         INNER JOIN uni_unidad tipouso ON\n" +
            "    tipouso.uni_ideregistro = dsus.uni_tipusosuscr\n" +
            "         INNER JOIN uni_unidad tipoactividad ON\n" +
            "    tipoactividad.uni_ideregistro = dsus.uni_actsuscripc\n" +
            "\n" +
            "         INNER JOIN sus_suscripcion sus ON\n" +
            "    sus.sus_ideregistro = dsus.sus_ideregistro\n" +
            "         INNER JOIN LATERAL (\n" +
            "    SELECT emp.empresa_aliashomaseo\n" +
            "    FROM empresas emp\n" +
            "             INNER JOIN dicn_disconven dicn ON\n" +
            "        dicn.cnre_ideregistr = sus.cnre_ideregistr\n" +
            "    WHERE dicn.dicn_empfactura = 'S'\n" +
            "    LIMIT 1\n" +
            "    ) homologacionactual ON\n" +
            "    TRUE\n" +
            "         INNER JOIN ter_tercero ter ON\n" +
            "    ter.ter_ideregistro = dsus.ter_ideregistro\n" +
            "         INNER JOIN pro_propiedad pro ON\n" +
            "    pro.pro_ideregistro = dsus.pro_ideregistro\n" +
            "         INNER JOIN barrios bar ON\n" +
            "    bar.barrio_ideregistro = pro.uni_barrio\n" +
            "         LEFT JOIN LATERAL (\n" +
            "    SELECT det.dgho_numeromedidor,\n" +
            "           det.dsus_pcodigo\n" +
            "    FROM aseo.ghom_gestionhomologa ghom\n" +
            "             INNER JOIN aseo.dgho_detallegestionhomologa det ON\n" +
            "        det.ghom_ideregistr = ghom.ghom_ideregistr\n" +
            "    WHERE det.emp_ideregistro = 322\n" +
            "      AND ghom.dsus_ideregistr = dsus.dsus_ideregistr\n" +
            "    ORDER BY GHOM.ghom_fechaactualiza DESC\n" +
            "    LIMIT 1\n" +
            "    ) infohomologaciongas ON TRUE\n" +
            "         LEFT JOIN LATERAL (\n" +
            "    SELECT det.dgho_numeromedidor,\n" +
            "           det.dsus_pcodigo\n" +
            "    FROM aseo.ghom_gestionhomologa ghom\n" +
            "             INNER JOIN aseo.dgho_detallegestionhomologa det ON\n" +
            "        det.ghom_ideregistr = ghom.ghom_ideregistr\n" +
            "    WHERE det.emp_ideregistro = 299\n" +
            "      AND ghom.dsus_ideregistr = dsus.dsus_ideregistr\n" +
            "    ORDER BY GHOM.ghom_fechaactualiza DESC\n" +
            "    LIMIT 1\n" +
            "    ) infohomologacionenergia ON TRUE\n" +
            "         LEFT JOIN aseo.iasus_inforadicionalsuscripcion info ON\n" +
            "    info.dsus_ideregistr = dsus.dsus_ideregistr\n" +
            "         LEFT JOIN LATERAL (\n" +
            "    SELECT gact.gact_observaciones, gact.reclamo_numpqr\n" +
            "    FROM aseo.gact_gestion_actualizacion gact\n" +
            "    WHERE gact.dsus_ideregistro = dsus.dsus_ideregistr\n" +
            "    ORDER BY gact_ideregistro DESC\n" +
            "    LIMIT 1\n" +
            "    ) novedades ON TRUE\n" +
            "\n" +
            "WHERE dsus.emp_ideregistro = :idempresa\n" +
            "  AND dsus.dsus_estado <> 'E' limit 80" , nativeQuery = true)
    List<Map<String,Object>> getSubscriptionsUpdateArcgis(@Param("idempresa") Integer idempresa, @Param("idclaseEstratos234") Integer idclaseEstratos234);
}
