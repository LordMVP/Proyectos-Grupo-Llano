<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of FinanciacionModel
 *
 * @author hrey
 */
class NotasAutomaticasModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Consulta tipos de documentos que se les puede realizar la nota
     * @param int $parametros array información de los filtros
     * @return array Información de tipos de documentos
     */
    public function getTiposDocumentos($parametros) {
        $complemento = '';
        $complementoFactura = '';
        if (!empty($parametros['idsuscripcion'])) {
            $complementoFactura = '  INNER JOIN fac_factura fac ON fac.uni_tipdocument = tido.uni_tipdocument  ';
            $complemento = ' AND fac.dsus_ideregistr =:idsuscripcion  AND fac.fac_idepadre is null  ';
        }
         $sql = "SELECT DISTINCT
                        tido.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento
                FROM								
		tido_tipdocumen tido
		INNER JOIN esem_estempresa esem ON esem.est_ideregistro = tido.est_tipdocument
		INNER JOIN prun_prgunidad prun on prun.uni_ideregistro = tido.uni_tipdocument
		INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                ". $complementoFactura ."
                WHERE
                prun.prg_ideregistro = :idprograma
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa " . $complemento;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los documentos de la tabla temporal según el idtipodocumento
     * @param int $idusuario id del usuario logueado
     * @param int $idTipoDocumento 
     * @return array Información de documentos
     */
    public function getDocumentos($parametros) {
        $complemento = '';
        if (isset($parametros['idsuscripcion']) && !empty($parametros['idsuscripcion'])) {
            $complemento = ' AND fac.dsus_ideregistr=:idsuscripcion ';
        }
        $sql = "SELECT DISTINCT
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN prun_prgunidad prun ON fac.uni_documento = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON doc.est_documento = esem.est_ideregistro
                WHERE
                prun.prg_ideregistro = :idprograma
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa
                AND fac.uni_tipdocument = :idtipodocumento
                AND fac.fac_idepadre is null $complemento ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta tipos de suscripción que existen en una empresa
     * @param int $parametros información del perfil que va a proceder a realizar la transacción.
     * @return array Información de los tipos de suscripción
     */
    public function getTipoUso($parametros) {
        $sql = "SELECT DISTINCT
                  uni.uni_ideregistro idtipousosuscripcion,
                  uni.uni_nombre1 tipousosuscripcion 
                FROM  uni_unidad uni INNER JOIN est_estructura est ON uni.est_ideregistro=est.est_ideregistro
                  INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro
                  INNER JOIN lius_liquso lius ON lius.uni_tipusosuscr=uni.uni_ideregistro
                  INNER JOIN cili_cicliquida cili ON cili.uni_liquidacion=lius.uni_liquidacion
                  INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=uni.uni_ideregistro
                  INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                WHERE esem.emp_ideregistro=:idempresa AND prun.prg_ideregistro=:idprograma AND uspu.usu_ideregistro=:idusuario";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las liquidaciones de una empresa
     * @param array $parametros id de la empresa logueada
     * @return array Información de las liquidaciones
     */
    public function getLiquidacion($parametros) {
        $complemento = '';
        if (!empty($parametros['idsuscripcion'])) {
            $complemento = ' AND fac.dsus_ideregistr =:idsuscripcion ';
        }
        $sql = "    SELECT DISTINCT fac.uni_liquidacion idliquidacion, liq_nombre liquidacion, liq.liq_venclasific tipoliquidacion 
                    FROM fac_factura fac 
                      INNER JOIN liq_liquidacion liq ON fac.uni_liquidacion = liq.uni_liquidacion
                      INNER JOIN esem_estempresa esem ON esem.est_ideregistro=liq.est_liquidacion
                      INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=liq.uni_liquidacion
                      INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr  
                    WHERE  esem.emp_ideregistro= :idempresa
                           AND fac.uni_documento =:iddocumento 
                           AND fac.uni_tipdocument = :idtipodocumento
                           AND prun.prg_ideregistro= :idprograma
                           AND uspu.usu_ideregistro= :idusuario $complemento";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las facturas según unos criterios y son guardados en una tabla temporal
     * y finalmente se consulta toda la información guardada en dicha tabla
     * @param array $parametros - idusuario logueado, idempresa logueada, tipo de nota, 
     * idsuscripcion o idciclo, idtipouso, idmunicipio, idbarrio y cantidad de meses a consultar
     * @return array Información de las facturas de la tabla temporal creada
     * @throws MyException
     */
    public function getFacturas($parametros) {
        $parametros['numeroprocesos'] = NUMERO_HILOS_NOTAS_AUTOMATICAS_DIRECTA;
        $complemento = '';
        $inner = '';
        $idUsuario = $parametros['idusuario'];
        $idEmpresa = $parametros['idempresa'];
        $meses = $parametros['meses'];
        $anio = $parametros['anio'];
        if ($parametros['tipo'] === 'S') {
            $complemento = ' AND dsus.dsus_ideregistr =:idsuscripcion ';
            $complemento .= " AND fac.uni_tipdocument=:idtipodocumento  
                              AND fac.uni_documento=:iddocumento 
                              AND fac.uni_liquidacion=:idliquidacion ";
        } else {
            $complemento = " AND fac.uni_tipusosuscr=:idtipouso AND fac.cic_ideregistro=:idciclo 
                AND fac.uni_tipdocument=:idtipodocumento  AND fac.uni_documento=:iddocumento AND fac.uni_liquidacion=:idliquidacion ";
            if (!empty($parametros['idmunicipio']) || !empty($parametros['idbarrio'])) {
                $inner = 'INNER JOIN pro_propiedad pro on dsus.pro_ideregistro = pro.pro_ideregistro';
                if (!empty($parametros['idmunicipio'])) {
                    $complemento .= ' AND pro.uni_municipio=:idmunicipio';
                }
                if (!empty($parametros['idbarrio'])) {
                    $complemento .= ' AND pro.uni_barrio=:idbarrio';
                }
            }
        }
        //La únicas facturas que se pueden generar notas son las de estado activa.
        //Crea la tabla temporal según el usuario logueado
        $sql = "INSERT INTO temp_directa_consulta(
                SELECT  fac.fac_ideregistro idfactura,fac.fac_numero numero, 
                        fac.ter_ideregistro idtercero, fac.uni_liquidacion idliquidacion,
                        fac.fac_fecvence fechavencimiento,dsus.dsus_ideregistr idsuscripcion,
                        dsus.dsus_pcodigo codigoanterior,tsu.tsu_nombre tiposuscripcion,
                        fac.cic_ideregistro idciclo,fac.per_ideregistro idperiodo,cic.cic_nombre ciclo,
                        cic.cic_anoactual cicloanio,
                        fac.uni_documento iddocumento, fac.uni_tipdocument idtipodocumento,
                        per.per_nombre periodo, cic.cic_nombre ||' '|| per.per_nombre cicloperiodo,
                        fac.fac_sdoreal saldo, fac.fac_vlrreal valortotal,
                        (fac.fac_vlrreal-fac.fac_sdoreal) valorpagado,fac.fac_version as version,
                        (row_number() OVER () % :numeroprocesos) as proceso,0::boolean filtro,0::smallint procesado,
                        '-'::character varying mensaje,
                        $idUsuario::bigint usu_ideregistro
                FROM 
                   fac_factura fac INNER JOIN  dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                   INNER JOIN tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=dsus.uni_tipsuscripc
                   INNER JOIN cic_ciclo cic ON fac.cic_ideregistro=cic.cic_ideregistro
                   INNER JOIN per_periodo per ON fac.per_ideregistro=per.per_ideregistro
                   INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio=dsus.uni_municipio
                    $inner
                WHERE EXTRACT (MONTH FROM fac.fac_fecha::date) = $meses AND EXTRACT (YEAR FROM fac.fac_fecha::date) = $anio
                   AND fac.fac_idepadre IS NULL AND dsus.emp_ideregistro=$idEmpresa AND fac.fac_estado in ('A','F') 
                   AND uspr.prg_ideregistro = :idprograma AND uspr.usu_ideregistro=:idusuario  $complemento 
                )
                ";
        $result = $this->executeQuery($sql, $parametros);
        if (empty($result)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        //Consulta todos los registros de la tabla temporal creada
        $sqlSelect = "SELECT * FROM temp_directa_consulta where usu_ideregistro=$idUsuario";
        return $this->executeQuery($sqlSelect);
    }

    /**
     * Consultas los conceptos del detalle de una factura
     * @param int $idfactura id de factura a consultar
     * @return array Información de conceptos (detalles de factura)
     */
    public function getDetalleFactura($idfactura) {
        $parametros['idfactura'] = $idfactura;
        $complemento = ' WHERE  fac.fac_ideregistro=:idfactura and dfac.dfac_vlrreal>0 ';
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta conceptos relacionados de una liquidación pero dependiendo el tipo 
     * de nota consulta solo los principales o no
     * @param array $parametros 
     * @param char $tipo Tipo de nota que se ejecutará
     * @return array Información de conceptos
     */
    public function getConcepto($parametros, $tipo) {
        $complemento = '';
        if ($tipo == 'C') {
            //$complemento = " AND con.con_tipcalculo='V' ";
        }
        if ($tipo == 'D') {
            $complemento = " AND con.con_operacion='S' ";
        }
        if ($parametros['tipoliquidacion'] == 'LI') {
            return $this->getConceptosLiquidacion($complemento, $parametros);
        }
        $sql = "(SELECT
                  con.uni_concepto idconcepto,
                  con.con_nombre concepto
                FROM
                 con_concepto con
                INNER JOIN coli_conliquida coli ON coli.uni_concepto = con.uni_concepto
                INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=con.uni_concepto
                INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro=con.est_concepto
                WHERE
                 coli.uni_liquidacion =:idliquidacion AND 
                 esem.emp_ideregistro=:idempresa 
                 AND prun.prg_ideregistro=:idprograma
                 AND uspu.usu_ideregistro=:idusuario $complemento )
                UNION
                (SELECT
                  core.uni_conrelacion idconcepto,
                  con.con_nombre concepto
                FROM
                coli_conliquida coli
                INNER JOIN core_conrelacio core ON coli.uni_concepto=core.uni_concepto
                INNER JOIN con_concepto con ON core.uni_conrelacion=con.uni_concepto
                INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=con.uni_concepto
                INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro=con.est_concepto
                WHERE
                 coli.uni_liquidacion =:idliquidacion AND 
                 esem.emp_ideregistro=:idempresa 
                 AND prun.prg_ideregistro=:idprograma
                 AND uspu.usu_ideregistro=:idusuario $complemento ) ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosLiquidacion($complemento, $parametros) {
        $sql = 'SELECT
                        con.uni_concepto idconcepto,
                        con.con_nombre concepto
                FROM
                 con_concepto con
                INNER JOIN coli_conliquida coli ON coli.uni_concepto = con.uni_concepto
                INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=con.uni_concepto
                INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro=con.est_concepto
                WHERE
                 coli.uni_liquidacion =:idliquidacion AND 
                 esem.emp_ideregistro=:idempresa 
                 AND prun.prg_ideregistro=:idprograma
                 AND uspu.usu_ideregistro=:idusuario ' . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta conceptos con coincidencia de las facturas que están en la tabla temporal
     * según su documento y tipodocumento
     * @param array $parametros Trae información del usuario logueado, idtipodocumento,
     * iddocumento y string 'concepto' a comparar
     * @return array - Información de conceptos
     */
    public function getConceptoAutocomplete($parametros) {
        $idUsuario = $parametros['usuario'];
        $sql = "SELECT DISTINCT con.uni_concepto idconcepto,con.con_nombre concepto
                FROM dfac_detfactura dfac INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                     inner join fac_factura fac on dfac.fac_ideregistro=fac.fac_ideregistro 
                     INNER JOIN temp_directa_consulta tmp ON tmp.idfactura = dfac.fac_ideregistro
                WHERE tmp.usu_ideregistro = $idUsuario ";
        return $this->genericoModel->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las facturas que estén en la tabla temporal de facturas creada por usuario 
     * logueado que tengan algún tipo documento y documento específico
     * @param int $usuario id del usuario logueado
     * @param string $doc cadena separada por comas con id's de documentos
     * @param type $tipodoc cadena separada por comas con id's de tipodocumentos
     * @param type $concepto cadena separada por comas con id's de conceptos
     * @return array - Información de las facturas
     */
    public function getFacturaConFiltro($idUsuario, array $listaConcepto) {
        $this->executeQuery("update temp_directa_consulta set filtro=FALSE WHERE usu_ideregistro=$idUsuario");
        $complemento = " usu_ideregistro=$idUsuario ";
        $complemento .= 'AND dfac.dfac_idepadre is null AND ( ';
        foreach ($listaConcepto as $concepto) {
            $complemento .= ' ( ';
            $complemento .= '  dfac.uni_concepto = ' . $concepto['idconcepto'];
            $complemento .= '  AND dfac.dfac_vlrreal >= ' . $concepto['valor'];
            $complemento .= ' ) ';
            $complemento .= ' OR ';
        }
        $complemento .= ' (1<1)  ';
        $complemento .= ' ) ';
        $sql = "INSERT INTO temp_directa_consulta (
                SELECT DISTINCT idfactura, numero, idtercero, idliquidacion, fechavencimiento, 
                       idsuscripcion, codigoanterior, tiposuscripcion, idciclo, idperiodo, 
                       ciclo, cicloanio, iddocumento, idtipodocumento, periodo, cicloperiodo, 
                       saldo, valortotal, valorpagado, version, proceso, true,$idUsuario::bigint
                FROM 
                  temp_directa_consulta tbl INNER JOIN dfac_detfactura dfac ON tbl.idfactura = dfac.fac_ideregistro
                WHERE $complemento)";
        $this->executeQuery($sql);
        $this->eliminar("temp_directa_consulta", "filtro=FALSE AND usu_ideregistro=$idUsuario");
        $sql = "SELECT * FROM temp_directa_consulta tbl WHERE usu_ideregistro=$idUsuario";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarPorFacturaTemporal($idfactura, $idUsuario) {
        $sql = "SELECT  * FROM temp_directa_consulta tbl WHERE tbl.idfactura = $idfactura AND tbl.usu_ideregistro = $idUsuario ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            return null;
        }
        return $respuesta[0];
    }

    public function eliminarTablasTemporal($idUsuario) {
        try {
            $sqlDrop = "DELETE FROM temp_directa_factura WHERE usu_ideregistro=$idUsuario";
            $this->executeQuery($sqlDrop);
            $sqlDrop = "DELETE FROM temp_directa_detalle WHERE usu_ideregistro=$idUsuario";
            $this->executeQuery($sqlDrop);
            $this->inicializarFacturas($idUsuario);
        } catch (\Exception $e) {
            
        }
    }

    public function consultarConceptoFactura($idfactura, $idconcepto) {
        $parametros = array();
        $parametros['idfactura'] = $idfactura;
        $parametros['idconcepto'] = $idconcepto;
        $sql = "SELECT
                            dfac_ideregistr iddetallefactura,
                            dfac_cantidad cantidad,
                            dfac_vlrunitari valorunitario,
                            dfac_vlrtotal valortotal,
                            dfac_vlrreal valorreal,
                            dfac_sdoreal saldo,
                            dfac.fac_ideregistro idfactura,
                            uni_concepto idconcepto
                    FROM
                            fac_factura fac
                    INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                    WHERE
                            dfac.dfac_sdoreal > 0
                    AND dfac.dfac_idepadre IS NULL
                    AND dfac.fac_ideregistro  =:idfactura AND dfac.uni_concepto =:idconcepto ";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            return null;
        }
        return $respuesta[0];
    }

    /** Inserta un nuevo detalle de factura en una tabla temporal
     * @param array $detalleFactura detalle de la factura
     * @return int identificador del detalle generado
     */
    public function insertarDetalleFacturaNotaModel($detalleFactura, $usuario) {
        $parametros['dfac_estado'] = 'A';
        $parametros['idtemp'] = $detalleFactura['idtemp'];
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['dfac_cantidad'] = $detalleFactura['cantidad'];
        $parametros['dfac_vlrunitari'] = $detalleFactura['valorunitario'];
        $parametros['dfac_vlrtotal'] = $detalleFactura['valortotal'];
        $parametros['dfac_vlrreal'] = $detalleFactura['valorreal'];
        $parametros['dfac_sdoreal'] = $detalleFactura['saldo'];
        $parametros['fac_ideregistro'] = $detalleFactura['idfactura'];
        $parametros['uni_concepto'] = $detalleFactura['idconcepto'];
        $parametros['dfac_idepadre'] = $detalleFactura['iddetallefactura'];
        $parametros['usu_ideregistro'] = $usuario;
        return $this->insertar($parametros, "temp_detfactura_$usuario", null);
    }

    public function insertarFacturaModel($factura, $usuario) {
        $idanterior = $this->consultarId($usuario);
        $idtemp = empty($idanterior) ? 1 : $idanterior[0]['idtemp'] + 1;
        $parametros['idtemp'] = $idtemp;
        $parametros['fac_metgenera'] = $factura['met_genera'];
        $parametros['fac_estado'] = $factura['estado'];
        $parametros['fac_fecha'] = $factura['fecha'];
        $parametros['fac_idepadre'] = $factura['idpadre'];
        $parametros['fac_fecaprobada'] = $factura['fechaaprobada'];
        $parametros['fac_fecvence'] = $factura['fechavencimiento'];
        $parametros['emp_ideregistro'] = $factura['idempresa'];
        $parametros['sus_ideregistro'] = $factura['idsuscriptor'];
        $parametros['dsus_ideregistr'] = $factura['idsuscripcion'];
        $parametros['uni_tipsuscripc'] = $factura['idtiposuscripcion'];
        $parametros['uni_tipusosuscr'] = $factura['idtipousosuscripcion'];
        $parametros['uni_liquidacion'] = $factura['idliquidacion'];
        $parametros['ter_ideregistro'] = $factura['idtercero'];
        $parametros['cic_ideregistro'] = $factura['idciclo'];
        $parametros['per_ideregistro'] = $factura['idperiodo'];
        $parametros['uni_documento'] = $factura['iddocumento'];
        $parametros['uni_tipdocument'] = $factura['idtipodocumento'];
        $parametros['cic_ano'] = $factura['cicloanio'];
        $parametros['fac_sdoreal'] = $factura['saldo'];
        $parametros['fac_ideorigen'] = $factura['idorigen'];
        $parametros['fac_version'] = $factura['version'];
        //$parametros['fac_vlrreal'] = 0;
        $this->insertar($parametros, "temp_factura_$usuario", null);
        return $idtemp;
    }

    public function consultarId($idUsuario) {
        $sql = "SELECT row_number() over() idtemp FROM temp_directa_factura WHERE usu_ideregistro = $idUsuario  ORDER BY i DESC LIMIT 1";
        return $this->executeQuery($sql);
    }

    public function actualizarValorFactura($valor, $idtemp, $usuario) {
        $sql = "UPDATE temp_factura_$usuario
               SET fac_vlrreal = $valor
               WHERE
                    idtemp = $idtemp";

        return $this->executeQuery($sql);
    }

    public function eliminarTablas($idUsuario) {
        //verifica la tabla temporal si es que existe
        $sql = "select count(*) cantidad from pg_tables where tablename IN('temp_directa_consulta','temp_directa_factura','temp_directa_detalle')";
        $resultado = $this->executeQuery($sql)[0]['cantidad'];
        if ($resultado < 3) {
            $sqltc = "DROP TABLE IF EXISTS temp_directa_consulta ";
            $this->executeQuery($sqltc);
            $sqltf = "DROP TABLE IF EXISTS temp_directa_factura ";
            $this->executeQuery($sqltf);
            $sqltd = "DROP TABLE IF EXISTS temp_directa_detalle ";
            $this->executeQuery($sqltd);
            $sqlts = "DROP SEQUENCE IF EXISTS sq_temp_directa_factura";
            $this->executeQuery($sqlts);
            $sqlDrop = "CREATE TABLE temp_directa_consulta AS (
                        SELECT  fac.fac_ideregistro idfactura,fac.fac_numero numero, 
                           fac.ter_ideregistro idtercero, fac.uni_liquidacion idliquidacion,
                           fac.fac_fecvence fechavencimiento,dsus.dsus_ideregistr idsuscripcion,
                           dsus.dsus_pcodigo codigoanterior,tsu.tsu_nombre tiposuscripcion,
                           fac.cic_ideregistro idciclo,fac.per_ideregistro idperiodo,cic.cic_nombre ciclo,
                           cic.cic_anoactual cicloanio,
                           fac.uni_documento iddocumento, fac.uni_tipdocument idtipodocumento,
                           per.per_nombre periodo, cic.cic_nombre ||' '|| per.per_nombre cicloperiodo,
                           fac.fac_sdoreal saldo, fac.fac_vlrreal valortotal,
                           (fac.fac_vlrreal-fac.fac_sdoreal) valorpagado,fac.fac_version as version,
                           0::bigint as proceso,0::boolean filtro,0::smallint procesado,
                           '-'::character varying mensaje,
                           0::bigint usu_ideregistro
                        FROM 
                           fac_factura fac INNER JOIN  dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                           INNER JOIN tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=dsus.uni_tipsuscripc
                           INNER JOIN cic_ciclo cic ON fac.cic_ideregistro=cic.cic_ideregistro
                           INNER JOIN per_periodo per ON fac.per_ideregistro=per.per_ideregistro
                           INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio=dsus.uni_municipio
                        LIMIT 0) ";
            $this->executeQuery($sqlDrop);
            $sql = "CREATE  SEQUENCE sq_temp_directa_factura";
            $this->executeQuery($sql);
            $sql = "CREATE TABLE temp_directa_factura AS(
                    SELECT 
                      0::bigint idtempfactura, *,0::integer proceso,''::character varying as operacion
                    FROM fac_factura LIMIT 0)";
            $this->executeQuery($sql);
            $sql = "CREATE TABLE temp_directa_detalle AS
                  SELECT *,1::boolean as existe,''::character varying as operacion,0::bigint idtempfactura 
                  FROM dfac_detfactura LIMIT 0;";
            $this->executeQuery($sql);
        }

        $sql = "DELETE FROM temp_directa_consulta WHERE usu_ideregistro = $idUsuario";
        $this->executeQuery($sql);

        $sql = "DELETE FROM temp_directa_factura WHERE usu_ideregistro = $idUsuario";
        $this->executeQuery($sql);

        $sql = "DELETE FROM temp_directa_detalle WHERE usu_ideregistro = $idUsuario";
        $this->executeQuery($sql);
    }

    public function getConceptosAfectados($idfactura, $idUsuario) {
        $parametros['idfactura'] = $idfactura;
        $sql = "SELECT *,saldoconcepto+notacredito+notadebito saldoconceptofinal FROM (SELECT DISTINCT
                  dfac.dfac_ideregistr iddetallefactura,
                  dfac.fac_ideregistro idfactura,
                  fac.fac_numero numerofactura,
                  dfac.uni_concepto idconcepto,
                  con.con_nombre concepto,
                  round(dfac.dfac_vlrreal, 7) valorinicial,
                  (dfac.dfac_vlrreal - dfac.dfac_sdoreal) valorpagado,
                  dfac.dfac_sdoreal saldoconcepto,
                  (SELECT
                    COALESCE (SUM(tp.dfac_vlrreal), 0)
                   FROM
                    temp_directa_detalle tp
                   WHERE
                    tp.dfac_ideregistr = tmp.dfac_ideregistr AND tp.usu_ideregistro=tmp.usu_ideregistro
                    AND tp.operacion = 'NC' 
                   ) notacredito,
                   (
                    SELECT
                     COALESCE (SUM(tp.dfac_vlrreal), 0)
                    FROM
                     temp_directa_detalle tp
                    WHERE
                     tp.dfac_ideregistr = tmp.dfac_ideregistr AND tp.usu_ideregistro=tmp.usu_ideregistro
                     AND tp.operacion = 'ND'
                    ) notadebito,
                   (
                    SELECT
                     COALESCE (SUM(tp.dfac_vlrtotal), 0)
                    FROM
                     temp_directa_detalle tp
                    WHERE
                     tp.dfac_ideregistr = tmp.dfac_ideregistr AND tp.usu_ideregistro=tmp.usu_ideregistro
                    AND tp.operacion IN ('NS','SD','SC', 'SE')
                    ) notasaldo
                FROM
                   temp_directa_detalle tmp
                   INNER JOIN dfac_detfactura dfac ON tmp.dfac_ideregistr = dfac.dfac_ideregistr
                   INNER JOIN fac_factura fac ON fac.fac_ideregistro = dfac.fac_ideregistro
                   INNER JOIN con_concepto con ON con.uni_concepto=dfac.uni_concepto
                WHERE
                        dfac.fac_ideregistro = abs(:idfactura) AND tmp.usu_ideregistro =$idUsuario ) AS detalle 
                UNION
                SELECT
                 tmp.dfac_ideregistr iddetallefactura,
                 tmp.fac_ideregistro idfactura,
                 fac.fac_numero numerofactura,
                 tmp.uni_concepto idconcepto,
                 con.con_nombre concepto,
                 0 valorinicial,
                 0 valorpagado,
                 0 saldoconcepto,
                 0 notacredito,
                 round(tmp.dfac_vlrreal, 7) notadebito,
                 0 notasaldo,
                 round(tmp.dfac_vlrreal, 7) saldoconceptofinal
                FROM
                 temp_directa_detalle tmp
                 INNER JOIN fac_factura fac ON tmp.fac_ideregistro = fac.fac_ideregistro
                 INNER JOIN con_concepto con ON con.uni_concepto = tmp.uni_concepto
                WHERE
                 existe = FALSE AND fac.fac_ideregistro = ABS(:idfactura) AND tmp.usu_ideregistro=$idUsuario";
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosAfectadosExportar($idUsuario) {
        $sql = "SELECT DISTINCT
                  dfac.dfac_ideregistr iddetallefactura,
                  dfac.fac_ideregistro idfactura,
                  fac.fac_numero numerofactura,
                  dfac.uni_concepto idconcepto,
                  con.con_nombre concepto,
                  round(dfac.dfac_vlrreal, 7) valorinicial,
                  dfac.dfac_sdoreal saldoconcepto,
                  (dfac.dfac_vlrreal - dfac.dfac_sdoreal) valorpagado,
                  round(tmp.dfac_vlrreal, 7) valornota,
                  round(dfac.dfac_vlrreal, 7) + round(tmp.dfac_vlrreal, 7) resultado,
                  COALESCE(tmp.operacion,'-') operacion
                FROM
                  temp_directa_detalle tmp
                  RIGHT JOIN dfac_detfactura dfac ON tmp.dfac_ideregistr = dfac.dfac_ideregistr
                  INNER JOIN con_concepto con ON con.uni_concepto=dfac.uni_concepto
                  INNER JOIN fac_factura fac ON fac.fac_ideregistro=dfac.fac_ideregistro 
                  INNER JOIN temp_directa_detalle tmpf ON abs(tmpf.fac_ideregistro)=fac.fac_ideregistro
                WHERE
                 tmp.usu_ideregistro=$idUsuario
                ORDER BY dfac.fac_ideregistro ";
        return $this->executeQuery($sql);
    }

    public function marcarFacturas($facturas, $idUsuario, $procesado, $mensaje) {
        $sql = " update temp_directa_consulta set procesado=$procesado,mensaje='$mensaje' where idfactura in ($facturas) AND usu_ideregistro=$idUsuario ";
        $this->executeQuery($sql);
    }

    public function inicializarFacturas($idUsuario) {
        $sql = " update temp_directa_consulta set procesado=0,mensaje='-' WHERE usu_ideregistro =$idUsuario ";
        $this->executeQuery($sql);
    }

    public function getFacturasHilo($idHilo, $idUsuario) {
        $sql = "select idfactura from temp_directa_consulta tmp where  tmp.procesado=1 AND tmp.proceso=$idHilo AND tmp.usu_ideregistro = $idUsuario  limit 500 ";
        return $this->executeQuery($sql);
    }

    public function getConceptosOriginales($idUsuario) {
        $sql = "SELECT DISTINCT
                  dfac.dfac_ideregistr iddetallefactura,
                  dfac.fac_ideregistro idfactura,
                  fac.fac_numero numerofactura,
                  dfac.uni_concepto idconcepto,
                  con.con_nombre concepto,
                  dfac.dfac_cantidad cantidad,
                  dfac.dfac_vlrunitari valorunitario,
                  dfac.dfac_vlrtotal valortotal,
                  (dfac.dfac_vlrreal - dfac.dfac_sdoreal) valorpagado,
                  dfac.dfac_sdoreal saldo
                FROM
                  dfac_detfactura dfac INNER JOIN fac_factura fac ON dfac.fac_ideregistro=fac.fac_ideregistro
                  INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto
                  INNER JOIN temp_directa_factura  tmp ON abs(tmp.fac_ideregistro)=fac.fac_ideregistro 
                WHERE
                  tmp.usu_ideregistro=$idUsuario
                ORDER BY dfac.fac_ideregistro ";
        return $this->executeQuery($sql);
    }

    public function getFacturaNotas($idUsuario) {
        $sql = "select * from temp_directa_factura WHERE fac_estado='A' AND usu_ideregistro=$idUsuario ORDER BY fac_ideregistro,idtempfactura,fac_version limit 1000";
        return $this->executeQuery($sql);
    }

    public function getDetallesFacturaNotas($idUsuario, $idNota, $idFacturaTemporal) {
        $sql = "select * from temp_directa_detalle WHERE fac_ideregistro=$idNota and idtempfactura=$idFacturaTemporal AND usu_ideregistro=$idUsuario ";
        return $this->executeQuery($sql);
    }

    public function crearFactura($infoNota) {
        $factura['fac_metgenera'] = 'P';
        $factura['fac_estado'] = $infoNota['fac_estado'];
        $factura['fac_fecha'] = 'now()';
        $factura['fac_fecaprobada'] = 'now()';
        $factura['fac_fecvence'] = 'now()';
        $factura['fac_idepadre'] = abs($infoNota['fac_ideregistro']);
        $factura['fac_ideorigen'] = abs($infoNota['fac_ideregistro']);
        $factura['emp_ideregistro'] = $infoNota['emp_ideregistro'];
        $factura['sus_ideregistro'] = $infoNota['sus_ideregistro'];
        $factura['dsus_ideregistr'] = $infoNota['dsus_ideregistr'];
        $factura['uni_tipsuscripc'] = $infoNota['uni_tipsuscripc'];
        $factura['uni_tipusosuscr'] = $infoNota['uni_tipusosuscr'];
        $factura['uni_liquidacion'] = $infoNota['uni_liquidacion'];
        $factura['ter_ideregistro'] = $infoNota['ter_ideregistro'];
        $factura['cic_ideregistro'] = $infoNota['cic_ideregistro'];
        $factura['per_ideregistro'] = $infoNota['per_ideregistro'];
        $factura['uni_documento'] = $infoNota['uni_documento'];
        $factura['uni_tipdocument'] = $infoNota['uni_tipdocument'];
        $factura['cic_ano'] = $infoNota['cic_ano'];
        $factura['hliq_ideregistr'] = 0;
        $factura['fac_sdoreal'] = $infoNota['fac_sdoreal'];
        $factura['uni_tiptercero'] = $infoNota['uni_tiptercero'];
        $factura['fac_fecsuspens'] = 'now()';
        $factura['fac_vlrreal'] = $infoNota['fac_vlrreal'];
        $factura['usu_ideregistro'] = $infoNota['usu_ideregistro'];
        $idNota = $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
        $factura['fac_ideregistro'] = $idNota;
        return $factura;
    }

    public function crearDetalleFactura($infoDetalle) {
        $detalle['dfac_estado'] = 'A';
        $detalle['dfac_ideorigen'] = $infoDetalle['dfac_ideorigen'];
        $detalle['dfac_cantidad'] = $infoDetalle['dfac_cantidad'];
        $detalle['dfac_vlrunitari'] = $infoDetalle['dfac_vlrunitari'];
        $detalle['dfac_vlrtotal'] = $infoDetalle['dfac_vlrtotal'];
        $detalle['dfac_vlrreal'] = $infoDetalle['dfac_vlrreal'];
        $detalle['dfac_sdoreal'] = $infoDetalle['dfac_sdoreal'];
        $detalle['fac_ideregistro'] = $infoDetalle['fac_ideregistro'];
        $detalle['uni_concepto'] = $infoDetalle['uni_concepto'];
        $detalle['dfac_idepadre'] = $infoDetalle['dfac_idepadre'];
        $detalle['dfac_version'] = 1;
        $detalle['usu_ideregistro'] = $infoDetalle['usu_ideregistro'];
        $detalle['dfac_ideregistr'] = $this->insertar($detalle, 'dfac_detfactura', 'sq_dfac_ideregistr');
        return $detalle;
    }

    public function getIdTemporal($idUsuario) {
        $sql = "select nextval('sq_temp_directa_factura') id";
        return $this->executeQuery($sql)[0]['id'];
    }

    public function actualizarFacturaTemporal($idTempFactura, $idUsuario, $estado = 'P') {
        $parametros['idtempfactura'] = $idTempFactura;
        $parametros['fac_estado'] = $estado;
        $this->actualizar($parametros, "temp_directa_factura", "idtempfactura=:idtempfactura AND usu_ideregistro=$idUsuario");
    }

    public function reiniciarFacturaTemporal($idUsuario, $estado = 'P') {
        $parametros['fac_estado'] = $estado;
        $this->actualizar($parametros, "temp_directa_factura", "usu_ideregistro=$idUsuario");
    }

    public function insertarNota(array $infoFacturaTemporal, array $parametros) {
        $data['not_fecha'] = "now()";
        $data['cic_ano'] = $infoFacturaTemporal['cic_ano'];
        $data['not_comentario'] = $parametros['comentario'];
        $data['uni_motnota'] = $parametros['idmotivo'];
        $data['dsus_ideregistr'] = $infoFacturaTemporal['dsus_ideregistr'];
        $data['cic_ideregistro'] = $infoFacturaTemporal['cic_ideregistro'];
        $data['per_ideregistro'] = $infoFacturaTemporal['per_ideregistro'];
        $data['emp_ideregistro'] = $infoFacturaTemporal['emp_ideregistro'];
        $data['usu_ideregistro'] = $infoFacturaTemporal['usu_ideregistro'];
        $data['est_motnota'] = ESTRUCTURA_NOTA;
        return $this->insertar($data, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Obtiene el listado de todos los motivos
     * @return listado de motivos
     * @throws MyException
     */
    public function obtenerMotivos($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'SELECT
                        UNI_MOTNOTA idmotivo,
                        MONO_NOMBRE nombre
                FROM
                        MONO_MOTNOTA mono
                INNER JOIN esem_estempresa esem ON mono.est_motnota = esem.est_ideregistro
                WHERE
                        esem.emp_ideregistro =:idempresa
                ORDER BY nombre        ';
        return $this->executeQuery($sql, $parametros);
    }

    public function asignarNotaFactura(array $detalleFacturaNota, $idNota, $idFacturaOriginal) {
        $parametros['not_ideregistro'] = $idNota;
        $parametros['fac_ideregistro'] = $detalleFacturaNota['fac_ideregistro'];
        $parametros['dfac_ideregistr'] = $detalleFacturaNota['dfac_ideregistr'];
        $parametros['fac_ideorigen'] = $idFacturaOriginal;
        $parametros['dfac_ideorigen'] = $detalleFacturaNota['dfac_ideorigen'];
        $parametros['usu_ideregistro'] = $detalleFacturaNota['usu_ideregistro'];
        $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    public function crearRecaudo(array $infoRecaudo) {
        $recaudo['rec_fecha'] = "now()";
        $recaudo['rec_estado'] = 'A';
        $recaudo['rec_vlrcambio'] = 0;
        $recaudo['rec_vlrajuste'] = 0;
        $recaudo['uni_medpago'] = 0;
        $recaudo['cnre_ideregistr'] = 0;
        $recaudo['rec_fecpago'] = "now()";
        $recaudo['csg_ideregistro'] = 0;
        $recaudo['rec_vlrpagado'] = $infoRecaudo['valorpagado'];
        $recaudo['rec_vlrreal'] = $infoRecaudo['valorpagado'];
        $recaudo['emp_ideregistro'] = $infoRecaudo['idempresa'];
        $recaudo['sus_ideregistro'] = $infoRecaudo['idsuscriptor'];
        $recaudo['ter_ideregistro'] = $infoRecaudo['idtercero'];
        $recaudo['uni_documento'] = $infoRecaudo['iddocumento'];
        $recaudo['uni_municipio'] = $infoRecaudo['idsucursal'];
        $recaudo['usu_ideregistro'] = $infoRecaudo['idusuario'];
        return $this->insertar($recaudo, 'rec_recaudo', 'sq_rec_ideregistro');
    }

    public function actualizarSaldo($idUsuario, $idTempFactura) {
        $sql = "UPDATE temp_directa_factura
                SET fac_vlrreal = (select sum(tmp.dfac_vlrreal) FROM temp_directa_detalle tmp where tmp.idtempfactura=$idTempFactura AND usu_ideregistro=$idUsuario ),
                 fac_sdoreal = (select sum(tmp.dfac_sdoreal) FROM temp_directa_detalle tmp where tmp.idtempfactura=$idTempFactura AND usu_ideregistro=$idUsuario )
                WHERE
                idtempfactura = $idTempFactura AND usu_ideregistro =$idUsuario";
        $this->executeQuery($sql);
    }

    public function getErroresNotas($idUsuario) {
        $sql = "select idfactura,mensaje from temp_directa_consulta where procesado= '-1' AND usu_ideregistro=$idUsuario";
        return $this->executeQuery($sql);
    }

    public function getLiquidacionSuscripcion($idLiquidacion) {
        $sql = "select liq.uni_liquidacion idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento
                from  liq_liquidacion liq 
                where liq.uni_liquidacion=$idLiquidacion ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('No se encontró la liquidación', -1);
        }
        return $resultado[0];
    }

    public function validarInformacionTemporal($idUsuario) {
        try {
            $sql = "select * from temp_directa_consulta where usu_ideregistro = $idUsuario ";
            $resultado = $this->executeQuery($sql);
        } catch (\Exception $exc) {
            
        }
        if (!empty($resultado)) {
            throw new MyException('Error, Hay trabajo pendiente por terminar, '
            . 'verifique que no tenga abierto el programa en otra pestaña y/o equipo,'
            . ' si está seguro que no tiene trabajo pendiente, presione el botón de cancelar, éste eliminará las notas en trámite', -1);
        }
    }

    /**
     * Se realiza ajuste para mostrar los conceptos que son informativos 
     * de acuerdo a la liquidación y concepto principal 
     * @param array $parametros (idconcepto,idprograma,idusuario,idliquidacion,idsconceptosvinculados,idempresa)
     */
    public function consultarConceptosRelacionados(array $parametros) {

        $idsConceptosVinculados = $parametros['idsconceptosvinculados'];
        $sql = "SELECT
			DISTINCT
			concore.uni_concepto idconcepto,
			concore.con_nombre   concepto
		FROM con_concepto con
			INNER JOIN esem_estempresa esem ON con.est_concepto = esem.est_ideregistro
			INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro = con.uni_concepto
			INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
			INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
			inner JOIN core_conrelacio core on con.uni_concepto = core.uni_concepto
			inner JOIN con_concepto concore on concore.uni_concepto = core.uni_conrelacion
		WHERE  concore.con_operacion = 'I'
					AND esem.emp_ideregistro = :idempresa
					AND coli.uni_liquidacion = :idliquidacion
					AND uspu.usu_ideregistro = :idusuario
					AND con.uni_concepto = :idconcepto
					AND prun.prg_ideregistro = :idprograma
					UNION
		SELECT
			DISTINCT
			concore.uni_concepto idconcepto,
			concore.con_nombre   concepto
		FROM con_concepto con
			INNER JOIN esem_estempresa esem ON con.est_concepto = esem.est_ideregistro
			INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro = con.uni_concepto
			INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
			INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
			inner JOIN core_conrelacio core on con.uni_concepto = core.uni_concepto
			inner JOIN con_concepto concore on concore.uni_concepto = core.uni_conrelacion
		WHERE  concore.con_operacion = 'I'
					AND esem.emp_ideregistro = :idempresa
					AND coli.uni_liquidacion = :idliquidacionfactura
					AND uspu.usu_ideregistro = :idusuario
					AND con.uni_concepto = :idconcepto
					AND prun.prg_ideregistro = :idprograma";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontraron conceptos relacionados', 0);
        }
        return $resultado;
    }

    public function consultarInfoConcepto($idConcepto) {
        $sql = "SELECT con.con_operacion operacion,con.*
                FROM con_concepto con
                WHERE con.uni_concepto=$idConcepto";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }
    
     /**
     * Consulta tipos de documentos que se les puede realizar la nota
     * @param int $parametros array información de los filtros
     * @return array Información de tipos de documentos
     */
    public function getPermisoComboContabilizacion($parametros) {         
        
        $sql = "select uni.uni_ideregistro idunidad 
                from uspu_usuprgunid uspu
                INNER JOIN prun_prgunidad prun on prun.prun_ideregistr = uspu.prun_ideregistr 
                INNER JOIN uni_unidad uni on uni.uni_ideregistro = prun.uni_ideregistro
                INNER JOIN est_estructura est on est.est_ideregistro = uni.est_ideregistro
                INNER JOIN esem_estempresa esem on esem.est_ideregistro = est.est_ideregistro
                where uspu.usu_ideregistro = :idusuario and est.est_ideregistro = :idestructura
                and prun.prg_ideregistro = :idprograma and esem.emp_ideregistro = :idempresa " ;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    public function getEstratoFacturaSuscripcion($idfactura){
        $parametros['idfactura'] = $idfactura;
        $parametros['idconcepto'] = 44;
        $sql = "select dsus.pro_catestrato estrato_suscripcion, dfac.dfac_vlrtotal estrato_factura
                from dsus_detsuscrip   dsus 
                inner join fac_factura fac on fac.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN dfac_detfactura  dfac on dfac.fac_ideregistro = fac.fac_ideregistro
                where fac.fac_ideregistro = :idfactura and dfac.uni_concepto = :idconcepto";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }
    
    public function actualizaVlrDetalleNewFactura($idFactura){
        $parametros["idfactura"]= $idFactura;
        $sql = "UPDATE dfac_detfactura dfac 
                SET dfac_vlrtotal = (case WHEN dfacnew.dfac_vlrtotal >0  THEN dfacnew.dfac_vlrtotal else dfacnew.dfac_vlrreal  end ) , 
		dfac_vlrunitari = (case WHEN dfacnew.dfac_vlrtotal >0  THEN dfacnew.dfac_vlrtotal else dfacnew.dfac_vlrreal  end ) 
                FROM dfac_detfactura dfacnew 
                WHERE  dfac.dfac_ideregistr = dfacnew.dfac_ideregistr  and 
                dfac.fac_ideregistro = :idfactura";
        $resultado = $this->executeQuery($sql,$parametros);
        if(empty($resultado)){
            throw new MyException('Error, No se actualizo la Nueva Factura', -1);
        }
        return $resultado;
    }

}
