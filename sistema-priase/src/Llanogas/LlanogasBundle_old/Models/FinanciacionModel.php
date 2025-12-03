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
class FinanciacionModel extends AuditoriaServices {

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
     * Filtro de las suscripciones
     * @param int $documento cédula del suscriptor.
     * @param string $codanterior código anterior
     * @param int $suscripcion identificador de la suscripción.
     * @return type
     */
    public function filtrarSuscripcionesReestructurar($documento = "", $codanterior = "", $suscripcion = "") {
        $complementoSql = NULL;
        if (!empty($documento)) {
            $complementoSql .= " AND ter.ter_documento = :numdocumento ";
            $parametros["numdocumento"] = $documento;
        }
        if (!empty($codanterior)) {
            $complementoSql .= " AND dsus.dsus_pcodigo = :codanterior ";
            $parametros["codanterior"] = $codanterior;
        }
        if (!empty($suscripcion)) {
            $complementoSql .= " AND dsus.dsus_ideregistr = :idsuscripcion ";
            $parametros["idsuscripcion"] = $suscripcion;
        }
        $sql = "   SELECT DISTINCT
                            dsus.dsus_ideregistr idsuscripcion,
                            ter.ter_ideregistro idtercero,
                            ter.ter_documento documento,
                            ter.ter_nomcompleto nombre,
                            dsus.dsus_pcodigo codanterior,
                            dsus.dsus_estado estado,
                            dsus.uni_tipsuscripc idtiposuscripcion,
                            tsu.tsu_nombre tiposuscripcion,
                            pro.pro_direccion direccion,
                            dsus.sus_ideregistro idsuscriptor
                    FROM
                            sus_suscripcion sus
                    INNER JOIN ter_tercero ter ON sus.ter_ideregistro = ter.ter_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON sus.sus_ideregistro = dsus.sus_ideregistro
                    INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                    INNER JOIN fin_financiacio fin ON dsus.dsus_ideregistr = fin.dsus_ideregistr
                    INNER JOIN tsu_tipsuscripc tsu ON dsus.uni_tipsuscripc = tsu.uni_tipsuscripc
                    WHERE
                            dsus.dsus_estado = 'A'
                    AND fin.fin_estado IN ('A', 'R')
                    AND fin_sdocapital > 0  $complementoSql  ";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        return $resultado;
    }

    public function consultarFacturasVencidas($idsuscripcion) {
        $sql = "SELECT
                    fac.fac_fecha fecha,
                    fac.fac_ideregistro idfactura,
                    fac.fac_numero numerofactura,
                    fac_sdoreal saldofactura,
                    fac.fac_fecvence fechavencimiento
            FROM
                    fac_factura fac
            WHERE
                    fac_idepadre IS NULL
            AND fac_estado not in  ('E', 'P')
            AND fac_sdoreal > 0
            AND fac_fecvence :: DATE < now() :: DATE
            AND dsus_ideregistr =$idsuscripcion;";
        return $this->executeQuery($sql);
    }

    public function consultarAmortizaciones($idsuscripcion) {
        $sql = "SELECT
                    (
                            (SELECT
                                    COUNT (amfi.*) 
                            FROM
                                    amfi_amofinanci amfi
                            WHERE
                                    amfi.dsus_ideregistr = $idsuscripcion
                            AND amfi.amfi_estado = 'R'
                            AND EXTRACT (YEAR FROM(amfi.amfi_fecha)) = EXTRACT (YEAR FROM now())) + 
            (SELECT
                                    COUNT (amfi1.*)
                            FROM
                                    amfi_amofinanci amfi1
                            WHERE
                                    amfi1.amfi_estado = 'R'
                            AND amfi1.dsus_ideregistr = $idsuscripcion
                            AND EXTRACT (YEAR FROM(amfi1.amfi_fecha)) < EXTRACT (YEAR FROM now())
                            AND amfi1.fin_ideregistro IN (
                                    SELECT
                                            fin_ideregistro
                                    FROM
                                            amfi_amofinanci amfi
                                    WHERE
                                            amfi.dsus_ideregistr = $idsuscripcion
                                    AND EXTRACT (YEAR FROM(amfi.amfi_fecha)) = EXTRACT (YEAR FROM now())
                                    ORDER BY
                                            amfi_ideregistr ASC
                                    LIMIT 1
                            ))
                    ) as reestructuraciones";
        $resultado = $this->executeQuery($sql);
        if(!empty($resultado)){
            return $resultado[0]['reestructuraciones'];
        }
        return 0;
    }

    /**
     * Consulta las financiaciones que tienen una suscripción.
     * @param int $idSuscripcion identificador de la financiación.
     * @return array detalles de la financiación.
     */
    public function consultarTablaFinanciacion($idempresa, $idSuscripcion, $idTipoDocumento = null, $idDocumento = null, $validarCuotas = null) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $idempresa;
        $complemento = '';
        if (!empty($idTipoDocumento)) {
            $complemento .= 'AND amfi.uni_tipdocument=:idtipodocumento ';
            $parametros['idtipodocumento'] = $idTipoDocumento;
        }
        if (!empty($idDocumento)) {
            $complemento .= ' AND amfi.uni_documento=:iddocumento';
            $parametros['iddocumento'] = $idDocumento;
        }
        if(empty($validarCuotas)){
            $complemento .= ' AND amfi.amfi_cuoamortiz > 0';            
        }
        $sql = "  SELECT
                        fin.fin_ideregistro idfinanciacion,
                        amfi.amfi_ideregistr idamortizacionfinanciacion,
                        amfi.amfi_numcuotas numerocuotas,
                        amfi.amfi_cuoamortiz cuotasamortizadas,
                        amfi.uni_liquidacion idliquidacion,
                        amfi.uni_documento iddocumento,
                        amfi.uni_tipdocument idtipodocumento,
                        tido.tido_maxcuofinancia maximoplazo,
                        liq.liq_nombre liquidacion,
                        liq.liq_tipcuota tipocuota,
                        (
                                amfi.amfi_numcuotas - amfi.amfi_cuoamortiz
                        ) cuotaspendientes,
                        fin.fin_sdocapital saldocapital,
                        fin_version AS VERSION
                FROM
                        fin_financiacio fin
                INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro = amfi.fin_ideregistro
                INNER JOIN liq_liquidacion liq ON amfi.uni_liquidacion = liq.uni_liquidacion
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                WHERE
                        fin.fin_estado IN ('A', 'R')
                AND amfi.amfi_estado = 'A'
                AND fin.fin_sdocapital > 0
                AND fin.emp_ideregistro =:idempresa 
                AND fin.dsus_ideregistr =:idsuscripcion $complemento";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los conceptos asignados a una financiación.
     * @param int $idRegistro identificador de la financiación.
     * @return array listado de los conceptos
     */
    public function consultarConceptos($idRegistro) {
        $sql = "    SELECT
                            dfin.uni_concepto idconcepto,
                            uni.uni_nombre1 nombre
                    FROM
                            fin_financiacio fin
                    INNER JOIN dfin_detfinanci dfin ON fin.fin_ideregistro = dfin.fin_ideregistro
                    INNER JOIN uni_unidad uni ON dfin.uni_concepto = uni.uni_ideregistro
                    WHERE
                            fin.fin_ideregistro = $idRegistro
                    AND uni_concepto NOT IN (
                            SELECT
                                 core.uni_conrelacion
                            FROM
                                 fin_financiacio fin
                            INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro = amfi.fin_ideregistro
                            INNER JOIN coli_conliquida coli ON coli.uni_liquidacion = amfi.uni_liquidacion
                            INNER JOIN core_conrelacio core ON coli.uni_liquidacion = core.uni_liquidacion
                            WHERE fin.fin_ideregistro = $idRegistro
                    )";
        $this->setSql($sql);
        $resultado = $this->execute();
        return $resultado;
    }

    /**
     * Consulta las liquidaciones de las financiaciones
     * @return array Listado de las financiaciones
     */
    public function consultarLiquidacionFinanciacionModel($idtipodocumento = null, $empresa) {
        $parametros['idempresa'] = $empresa;
        $complemento = '';
        if (!empty($idtipodocumento)) {
            $parametros['idtipodocumento'] = $idtipodocumento;
            $complemento .= " and liq.uni_tipdocument =:idtipodocumento";
        }
        $sql = "    SELECT
                            liq.uni_liquidacion idliquidacion,
                            liq.liq_nombre liquidacion,
                            liq.liq_tipcuota tipocuota,
                            tido.tido_maxcuofinancia maximoplazo,
                            tido.tido_maxcuounifica maximoplazou,
                            tido.tido_maxcuoabonok maximodocumento
                    FROM
                            liq_liquidacion liq
                    INNER JOIN esem_estempresa esem on liq.est_liquidacion = esem.est_ideregistro 
                    INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                    WHERE
                            liq.liq_venclasific = 'FI' AND esem.emp_ideregistro =:idempresa" . $complemento;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No hay liquidaciones disponibles', 0);
        }
        return $respuesta;
    }

    /**
     * Actualiza la amortización.
     * @param array $amortizacionFinanciacion información de la amortización.
     * @return int Número de filas afectadas.
     * @throws MyException No se pudo modificar la amortización
     */
    public function actualizarAmortizacionFinanciacion($amortizacionFinanciacion) {
        $parametros['amfi_ideregistr'] = $amortizacionFinanciacion['idamortizacionfinanciacion'];
        $parametros['amfi_estado'] = 'R';
        $resultado = $this->actualizar($parametros, 'amfi_amofinanci', 'amfi_ideregistr= :amfi_ideregistr');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la amortización');
        }
        return $resultado;
    }

    /**
     * Consulta la información de la amortización
     * @param int $idamortizacion identificador de la amortización.
     * @return Array  listado de amortizacion disponibles
     * @throws MyException Error consultando el detalle de la amortización
     */
    public function obtenerAmortizacionFinanciacion($idamortizacion) {
        $parametros["idamortizacion"] = $idamortizacion;
        $sql = '  SELECT amfi_ideregistr id, amfi_estado estado, 
                    amfi_numcuotas numerocuotas, amfi_cuoamortiz cuotasamortizadas, 
                    amfi_fecha fecha, fin_ideregistro idfinanciacion, 
                    uni_liquidacion idliquidacion, uni_documento iddocumento, 
                    uni_tipdocument idtipodocumento, dsus_ideregistr idsuscripcion, 
                    emp_ideregistro idempresa
                  FROM 
                    amfi_amofinanci
                  WHERE 
                   amfi_ideregistr= :idamortizacion ';

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error consultando el detalle de la amortización');
        }
        return $resultado[0];
    }

    /**
     * Genera un nuevo registro de las amortizaciones
     * @param array $financiacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function insertarAmortizacionFinanciacion($financiacion) {
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['amfi_estado'] = $financiacion['estado'];
        $parametros['amfi_cuoamortiz'] = $financiacion['cuotasamortizadas'];
        $parametros['amfi_fecha'] = 'now()';
        $parametros['amfi_numcuotas'] = $financiacion['numerocuotas'];
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['uni_liquidacion'] = $financiacion['idliquidacion'];
        $parametros['uni_documento'] = $financiacion['iddocumento'];
        $parametros['uni_tipdocument'] = $financiacion['idtipodocumento'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'amfi_amofinanci', 'sq_amfi_ideregistr');
    }

    /**
     * Genera la reestructuración de las financiaciones selecciondas
     * @param array $listaReestructuracion Detalle de las financiaciones a reestructurar.
     * @throws MyException Error al guardar
     */
    public function guardarReestructuracionFinanciacion($listaReestructuracion, $idusuario, $idempresa) {
        $this->conexion->beginTransaction();
        try {
            foreach ($listaReestructuracion as $reestructuracion) {
                $documentoTipoDocumento = $this->genericoModel->consultarDocumentosTiposPorLiquidacion($reestructuracion['idliquidacion']);
                $amortizacionFinanciacion = $this->obtenerAmortizacionFinanciacion($reestructuracion['idamortizacionfinanciacion']);
                $this->actualizarAmortizacionFinanciacion($reestructuracion);
                $cuotasAmortizadas = $amortizacionFinanciacion['cuotasamortizadas'];
                $financiacion['cuotasamortizadas'] = $cuotasAmortizadas;
                $financiacion['numerocuotas'] = $cuotasAmortizadas + $reestructuracion['numerocuotasareestructurar'];
                $financiacion['idfinanciacion'] = $amortizacionFinanciacion['idfinanciacion'];
                $financiacion['idliquidacion'] = $reestructuracion['idliquidacion'];
                $financiacion['iddocumento'] = $documentoTipoDocumento['iddocumento'];
                $financiacion['idtipodocumento'] = $documentoTipoDocumento['idtipodocumento'];
                $financiacion['idsuscripcion'] = $amortizacionFinanciacion['idsuscripcion'];
                $financiacion['idempresa'] = $idempresa;
                $financiacion['estado'] = 'A';
                $financiacion['idusuario'] = $idusuario;
                $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($amortizacionFinanciacion['idsuscripcion']);
                $financiacion['idciclo'] = $cicloperiodo['idciclo'];
                $financiacion['idperiodo'] = $cicloperiodo['idperiodo'];
                $financiacion['cicloanio'] = $cicloperiodo['cicloanio'];
                $this->insertarAmortizacionFinanciacion($financiacion);
            }
            $this->conexion->commit();
        } catch (Exception $e) {
            $this->conexion->rollBack();
            throw

            new MyException($e->getMessage());
        }
    }

}
