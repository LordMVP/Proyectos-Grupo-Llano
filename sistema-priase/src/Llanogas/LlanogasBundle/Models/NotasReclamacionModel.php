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
class NotasReclamacionModel extends AuditoriaServices {

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
     * 
     * Elimina la informacion de las tablas temporales o las crea si estas no existen
     * @param type $idUsuario
     * @return (Void)
     */
    public function eliminarTablas($idUsuario) {
        //verifica la tabla temporal si es que existe
        $sql = "select count(*) cantidad from pg_tables where tablename IN('temp_reclamacion_consulta','temp_reclamacion_factura','temp_reclamacion_detalle')";
        $resultado = $this->executeQuery($sql)[0]['cantidad'];
        if ($resultado < 3) {
            $sqltc="DROP TABLE IF EXISTS temp_reclamacion_consulta ";
            $this->executeQuery($sqltc);
            $sqltf="DROP TABLE IF EXISTS temp_reclamacion_factura ";
            $this->executeQuery($sqltf);
            $sqltd="DROP TABLE IF EXISTS temp_reclamacion_detalle ";
            $this->executeQuery($sqltd);
            $sqlts="DROP SEQUENCE IF EXISTS sq_temp_reclamacion_factura";
            $this->executeQuery($sqlts);
            $sqlDrop = "CREATE TABLE temp_reclamacion_consulta AS (
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
            $sql="CREATE  SEQUENCE sq_temp_reclamacion_factura";
            $this->executeQuery($sql);
            $sql="CREATE TABLE temp_reclamacion_factura AS(
                    SELECT 
                      0::bigint idtempfactura, *,0::integer proceso,''::character varying as operacion
                    FROM fac_factura LIMIT 0)";
            $this->executeQuery($sql);
            $sql="CREATE TABLE temp_reclamacion_detalle AS
                  SELECT *,1::boolean as existe,''::character varying as operacion,0::bigint idtempfactura 
                  FROM dfac_detfactura LIMIT 0;";
            $this->executeQuery($sql);
        }

        $sql = "DELETE FROM temp_reclamacion_consulta WHERE usu_ideregistro = $idUsuario";
        $this->executeQuery($sql);

        $sql = "DELETE FROM temp_reclamacion_factura WHERE usu_ideregistro = $idUsuario";
        $this->executeQuery($sql);

        $sql = "DELETE FROM temp_reclamacion_detalle WHERE usu_ideregistro = $idUsuario";
        $this->executeQuery($sql);
    }
    /**
     * Consulta las facturas según unos criterios y son guardados en una tabla temporal
     * y finalmente se consulta toda la información guardada en dicha tabla
     * @param array $parametros - idusuario logueado, idempresa logueada, tipo de nota, 
     * idsuscripcion o idciclo, idtipouso, idmunicipio, idbarrio y cantidad de meses a consultar
     * @return array Información de las facturas de la tabla temporal creada
     * @throws MyException
     */
    public function getNotasReclamacion($parametros) {
        $parametros['numeroprocesos'] = NUMERO_HILOS_NOTAS_RECLAMACION ;
        $complemento = '';
        $inner = '';
        $idUsuario = $parametros['idusuario'];
        $idEmpresa = $parametros['idempresa'];      
        
//        -- Se consultan las notas en reclmacion que son las facturas en estado "R"

        $sql = "INSERT INTO temp_reclamacion_consulta(
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
                WHERE dsus.emp_ideregistro=$idEmpresa AND fac.fac_estado='R' 
                    AND  dsus.dsus_ideregistr =:idsuscripcion AND uspr.prg_ideregistro =:idprograma 
                    AND uspr.usu_ideregistro=:idusuario  $complemento )";
        $result = $this->executeQuery($sql, $parametros);
        if (empty($result)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        
        //Consulta todos los registros de la tabla temporal creada
        $sqlSelect = "SELECT * FROM temp_reclamacion_consulta where usu_ideregistro=$idUsuario";
        return $this->executeQuery($sqlSelect);
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
                     INNER JOIN temp_reclamacion_consulta tmp ON tmp.idfactura = dfac.fac_ideregistro
                WHERE tmp.usu_ideregistro = $idUsuario ";
        return $this->genericoModel->executeQuery($sql, $parametros);
    }    
    
    /**
     * Consulta las Notas en Reclamacion que estén en la tabla temporal de Notas en Reclamacion creada por 
     * usuario logueado 
     * @param int $usuario id del usuario logueado
     * @param type $concepto cadena separada por comas con id's de conceptos
     * @return array - Información de las facturas
     */
    public function getNotasRConFiltro($idUsuario, array $listaConcepto) {
       $this->executeQuery("update temp_reclamacion_consulta set filtro=FALSE WHERE usu_ideregistro=$idUsuario");
        $complemento = " AND ( ";
        foreach ($listaConcepto as $concepto) {
            $complemento .= " ( dfac.uni_concepto = ".$concepto['idconcepto']. " AND dfac.dfac_vlrreal <= ".$concepto['valor']
                    ." ) OR " ;
        }
        $complemento .= " (1<1) ) ";
        $sql = "INSERT INTO temp_reclamacion_consulta ( SELECT DISTINCT idfactura, numero, idtercero, idliquidacion, "
                ."fechavencimiento, idsuscripcion, codigoanterior, tiposuscripcion, idciclo, idperiodo, ciclo, cicloanio,"
                ."iddocumento, idtipodocumento, periodo, cicloperiodo,saldo, valortotal, valorpagado, version,  proceso, "
                . "true , 0 , 'NotasR Filtro', $idUsuario::bigint "
                . "FROM temp_reclamacion_consulta tbl INNER JOIN dfac_detfactura dfac "
                . "ON tbl.idfactura = dfac.fac_ideregistro WHERE  tbl.usu_ideregistro=$idUsuario  $complemento )";
        $this->executeQuery($sql);
        $this->eliminar("temp_reclamacion_consulta", "filtro=FALSE AND usu_ideregistro = $idUsuario");
        $sql = "SELECT * FROM temp_reclamacion_consulta tbl WHERE usu_ideregistro = $idUsuario";
        $resultado = $this->executeQuery($sql);
         return $resultado;
    }
    
    /**
     * Consultas los conceptos del detalle de una factura
     * @param int $idfactura id de factura a consultar
     * @return array Información de conceptos (detalles de factura)
     */
    public function getDetalleNotaR($idfactura) {
        $parametros['idfactura'] = $idfactura;
        $complemento = ' WHERE  fac.fac_ideregistro=:idfactura and dfac.dfac_vlrreal < 0 ';
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }
    
    public function eliminarTablasTemporal($idUsuario) {
        try {
            $sqlDrop = "DELETE FROM temp_reclamacion_factura WHERE usu_ideregistro=$idUsuario";
            $this->executeQuery($sqlDrop);
            $sqlDrop = "DELETE FROM temp_reclamacion_detalle WHERE usu_ideregistro=$idUsuario";
            $this->executeQuery($sqlDrop);
            $this->inicializarFacturas($idUsuario);
        } catch (\Exception $e) {
            
        }
    }
    public function consultarPorNotaRTemporal($idfactura, $idUsuario) {
        $sql = "SELECT  * FROM temp_reclamacion_consulta tbl WHERE tbl.idfactura = $idfactura AND tbl.usu_ideregistro = $idUsuario ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            return null;
        }
        return $respuesta[0];
    }
    public function getNotasRProcesadas($idUsuario) {
        $sql = "select idfactura from temp_reclamacion_consulta tmp where  tmp.procesado=1 AND tmp.usu_ideregistro = $idUsuario ";
        return $this->executeQuery($sql);
    }
    public function marcarNotasR($facturas, $idUsuario, $procesado, $mensaje) {
        $sql = " update temp_reclamacion_consulta set procesado=$procesado,mensaje='$mensaje' where idfactura in ($facturas) AND usu_ideregistro=$idUsuario ";
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
                    COALESCE (SUM(tp.dfac_vlrtotal), 0)
                   FROM
                    temp_reclamacion_detalle tp
                   WHERE
                    tp.dfac_ideregistr = tmp.dfac_ideregistr AND tp.usu_ideregistro=tmp.usu_ideregistro
                    AND tp.operacion = 'UC' 
                   ) notacredito,
                   (
                    SELECT
                     COALESCE (SUM(tp.dfac_vlrreal), 0)
                    FROM
                     temp_reclamacion_detalle tp
                    WHERE
                     tp.dfac_ideregistr = tmp.dfac_ideregistr AND tp.usu_ideregistro=tmp.usu_ideregistro
                     AND tp.operacion = 'UD'
                    ) notadebito,
                   (
                    SELECT
                     COALESCE (SUM(tp.dfac_vlrtotal), 0)
                    FROM
                     temp_reclamacion_detalle tp
                    WHERE
                     tp.dfac_ideregistr = tmp.dfac_ideregistr AND tp.usu_ideregistro=tmp.usu_ideregistro
                    AND tp.operacion = 'NS'
                    ) notasaldo
                FROM
                   temp_reclamacion_detalle tmp
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
                 temp_reclamacion_detalle tmp
                 INNER JOIN fac_factura fac ON tmp.fac_ideregistro = fac.fac_ideregistro
                 INNER JOIN con_concepto con ON con.uni_concepto = tmp.uni_concepto
                WHERE
                 existe = FALSE AND fac.fac_ideregistro = ABS(:idfactura) AND tmp.usu_ideregistro=$idUsuario";
        return $this->executeQuery($sql, $parametros);
    }
    public function reiniciarFacturaTemporal($idUsuario, $estado = 'P') {
        $parametros['fac_estado'] = $estado;
        $this->actualizar($parametros, "temp_reclamacion_factura", "usu_ideregistro=$idUsuario");
    }    
    public function getFacturaNotas($idUsuario) {
        $sql = "select * from temp_reclamacion_factura WHERE fac_estado='A' AND usu_ideregistro=$idUsuario ORDER BY fac_ideregistro,idtempfactura,fac_version limit 1000";
        return $this->executeQuery($sql);
    }
    public function getDetallesFacturaNotas($idUsuario, $idNota, $idFacturaTemporal) {
        $sql = "select * from temp_reclamacion_detalle WHERE fac_ideregistro=$idNota and idtempfactura=$idFacturaTemporal AND usu_ideregistro=$idUsuario ";
        return $this->executeQuery($sql);
    }
    public function crearFactura($infoNota) {
        $factura['fac_metgenera'] = 'P';
        $factura['fac_estado'] = $infoNota['fac_estado'];
        $factura['fac_fecha'] = 'now()';
        $factura['fac_fecaprobada'] = 'now()';
        $factura['fac_fecvence'] = 'now()';
        $factura['fac_idepadre'] = abs($infoNota['fac_idepadre']);
        $factura['fac_ideorigen'] = abs($infoNota['fac_idepadre']);
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
    public function insertarNota($infoFacturaTemporal, array $parametros) {
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
    public function asignarNotaFactura($detalleFacturaNota, $idNota, $idFacturaOriginal) {
        $parametros['not_ideregistro'] = $idNota;
        $parametros['fac_ideregistro'] = $detalleFacturaNota['fac_ideregistro'];
        $parametros['dfac_ideregistr'] = $detalleFacturaNota['dfac_ideregistr'];
        $parametros['fac_ideorigen'] = $idFacturaOriginal;
        $parametros['dfac_ideorigen'] = $detalleFacturaNota['dfac_ideorigen'];
        $parametros['usu_ideregistro'] = $detalleFacturaNota['usu_ideregistro'];
        $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }
    public function actualizarFacturaTemporal($idTempFactura, $idUsuario, $estado = 'P') {
        $parametros['idtempfactura'] = $idTempFactura;
        $parametros['fac_estado'] = $estado;
        $this->actualizar($parametros, "temp_directa_factura", "idtempfactura=:idtempfactura AND usu_ideregistro=$idUsuario");
    }
    
    public function actualizarEstadoFactura($idfactura ) {
        $sql = "UPDATE fac_factura SET fac_estado = 'A'
               WHERE fac_ideregistro = $idfactura";
        return $this->executeQuery($sql);
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
    public function inicializarFacturas($idUsuario) {
        $sql = " update temp_directa_consulta set procesado=0,mensaje='-' WHERE usu_ideregistro =$idUsuario ";
        $this->executeQuery($sql);
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

    public function getIdTemporal($idUsuario) {
        $sql = "select nextval('sq_temp_reclamacion_factura') id";
        return $this->executeQuery($sql)[0]['id'];
    }


    public function actualizarSaldo($idUsuario, $idTempFactura) {
        $sql = "UPDATE temp_reclamacion_factura
                SET fac_vlrreal = (select sum(tmp.dfac_vlrreal) FROM temp_reclamacion_detalle tmp where tmp.idtempfactura=$idTempFactura AND usu_ideregistro=$idUsuario ),
                 fac_sdoreal = (select sum(tmp.dfac_sdoreal) FROM temp_reclamacion_detalle tmp where tmp.idtempfactura=$idTempFactura AND usu_ideregistro=$idUsuario )
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
    
     public function getConceptos($idFactura) {
        $complemento = 'where fac.fac_ideregistro=:idfactura  and dfac.dfac_vlrreal < 0';
        $parametros['idfactura'] = $idFactura;
        return $this->getConceptosInformacion($complemento, $parametros);
    }
    
    public function getConceptosInformacion($complemento, array $parametros) {
        if (empty($complemento)) {
            throw new MyException('Debe tener un complemento la selección de datos');
        }
        $sql = ' SELECT con_operacion operacion ,dfac.dfac_ideregistr iddetallefactura,dfac.dfac_estado estado,dfac.dfac_ideorigen iddetalleorigen,dfac.
                 dfac_cantidad cantidad,dfac.dfac_vlrunitari valorunitario,dfac.dfac_vlrtotal valortotal,
                 dfac.dfac_vlrreal valor,dfac.dfac_vlrreal valorreal,dfac.dfac_sdoreal saldo,dfac.fac_ideregistro idfactura,
                 dfac.uni_concepto idconcepto,dfac.damo_ideregistr iddetalleamortizacion,
                 dfac.dfac_idepadre iddetallepade,dfac.dfac_idepadre iddetallepadre,
                 dfac.dfin_ideregistr iddetallefinanciacion,dfac.dfac_version as version,
                 con.con_nombre concepto,
                 round((dfac.dfac_vlrreal-dfac.dfac_sdoreal),7) valorpagado
                FROM dfac_detfactura dfac INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                     inner join fac_factura fac on dfac.fac_ideregistro=fac.fac_ideregistro ' . $complemento;


        return $this->executeQuery($sql, $parametros);
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
