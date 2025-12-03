<?php

namespace Externo\FinanciacionesBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of SeguridadModels
 *
 * @author god
 */
class VentaExternoModel extends AuditoriaServices {

    /**
     * Información del usuario que está en el sistema
     * @var array (
     *              idacceso,idusuario,cedula,
     *              usuario,idempresa,empresa,
     *              idperfil
     *            )
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Connection 
     */
    public function __construct(&$conexion, array $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consutla todas las empresas dependiendo del usuario y empresa 
     * con la que ingresó al sistema
     * @return array información del tercero que está clasificado con la firma instaladora
     */
    public function consultarFirmasInstaladoras() {
        $sql = "SELECT
                    DISTINCT
                    emprcontrato.ter_idegenerico idfirmainstaladora,
                    emprcontrato.empresa_nom     nombrefirma
                  FROM empresas empfinancia
                    INNER JOIN gestion_contratos gcon ON gcon.gestioncontrato_codemp = empfinancia.empresa_cod
                    INNER JOIN empresas emprcontrato ON emprcontrato.empresa_cod = gcon.gestioncontrato_empcon
                    INNER JOIN clte_clatercero clte ON clte.ter_ideregistro = emprcontrato.ter_idegenerico
                    INNER JOIN cofi_comfirmains cofi ON cofi.ter_ideregistro = emprcontrato.ter_idegenerico
                  WHERE
                    empfinancia.empresa_sevemp = :idempresasesion
                    and now() :: date BETWEEN gcon.gestioncontrato_fecvigini AND gcon.gestioncontrato_fecvigfin
                    AND clte.uni_clatercero = :clasefirma
                    and cofi.cofi_nitempleado = (select usu.usuario_nit from usuarios usu where usu.usu_ideregistro=:idusuario)";
        $parametros['clasefirma'] = CLASE_EMPRESAS_INSTALADORA_PROVEEDOR;
        $parametros['idempresasesion'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarTodasLasFirmasInstaladoras() {
        $sql = "SELECT
                    DISTINCT
                    emprcontrato.ter_idegenerico idfirmainstaladora,
                    emprcontrato.empresa_nom     nombrefirma
                  FROM empresas empfinancia
                    INNER JOIN gestion_contratos gcon ON gcon.gestioncontrato_codemp = empfinancia.empresa_cod
                    INNER JOIN empresas emprcontrato ON emprcontrato.empresa_cod = gcon.gestioncontrato_empcon
                    INNER JOIN clte_clatercero clte ON clte.ter_ideregistro = emprcontrato.ter_idegenerico
                    INNER JOIN cofi_comfirmains cofi ON cofi.ter_ideregistro = emprcontrato.ter_idegenerico
                  WHERE
                    now() :: date BETWEEN gcon.gestioncontrato_fecvigini AND gcon.gestioncontrato_fecvigfin
                    AND clte.uni_clatercero = :clasefirma
                    ";
        $parametros['clasefirma'] = CLASE_EMPRESAS_INSTALADORA_PROVEEDOR;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los documentos de una suscripción 
     * @param int $idSuscripcion identificador de la suscripción
     * @return array Lista de los tipos de documentos que se visualizan en
     * la interfaz de venta-financiacion externo 
     */
    public function consultarTiposDocumentos($idSuscripcion, $idFirmaInstaladora) {
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idfirmainstaladora'] = $idFirmaInstaladora;
        $parametros['idprograma'] = PROGRAMA_FINANCIACION_EXTERNA;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                    DISTINCT
                    doti.uni_tipdocument idtipodocumento,
                    uni.uni_nombre1 nombretipodocumento
                FROM doti_doctipo doti 
                    INNER JOIN liq_liquidacion liq ON liq.uni_tipdocument = doti.uni_tipdocument
                    INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro = doti.uni_tipdocument
                    INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
                    INNER JOIN uni_unidad uni ON uni.uni_ideregistro = doti.uni_tipdocument
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                    INNER JOIN dsus_detsuscrip dsusempfactura ON dsusempfactura.dsus_ideregistr= :idsuscripcion
                    INNER JOIN (SELECT distinct financia.dsus_ideregistr,financia.sus_ideregistro  
                    from dsus_detsuscrip financia 
                    where financia.emp_ideregistro = :idempresa 
                    ) as dsusfinancia on dsusfinancia.sus_ideregistro=dsusempfactura.sus_ideregistro
                    INNER JOIN limu_liqmunicipio limu ON limu.uni_liquidacion = liq.uni_liquidacion
                    INNER JOIN lius_liquso lius ON lius.uni_liquidacion = liq.uni_liquidacion
                    INNER JOIN dsus_detsuscrip dsusempfinancia ON dsusempfinancia.uni_municipio = limu.uni_municipio 
                     AND dsusempfinancia.uni_tipusosuscr = lius.uni_tipusosuscr 
                    AND dsusempfinancia.dsus_ideregistr=dsusfinancia.dsus_ideregistr
                    INNER JOIN lies_liqespecial lies on lies.uni_liquidacion=liq.uni_liquidacion 
                    and lies.ter_ideregistro = :idfirmainstaladora
                WHERE liq.liq_venclasific in ('CM') 
                    AND uspu.usu_ideregistro = :idusuario
                    AND prun.prg_ideregistro = :idprograma
                    AND esem.emp_ideregistro = :idempresa ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todos los documentos dependiendo del tipo de documento
     * @param array $parametros (idtipodocumento) Identificador del tipo de documento
     * @return array Lista de documentos 
     */
    public function consultarDocumentos($parametros) {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idprograma'] = PROGRAMA_FINANCIACION_EXTERNA;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idtipodocumento'] = $parametros['idtipodocumento'];
        $sql = "select 
                  distinct  doc.uni_documento iddocumento,doc.doc_nombre documento
                from doc_documento doc
                  inner join prun_prgunidad prun on prun.uni_ideregistro=doc.uni_documento
                  inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                  inner join esem_estempresa esem on esem.est_ideregistro=doc.est_documento
                  inner join doti_doctipo doti on doc.uni_documento=doti.uni_documento
                where  doc.doc_tipo in ('CM') and uspu.usu_ideregistro=:idusuario 
                  and prun.prg_ideregistro=:idprograma and esem.emp_ideregistro=:idempresa 
                  and doti.uni_tipdocument=:idtipodocumento ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consultar las liquidaciones asociadas a los tipos de documentos y
     * documentos 
     * @param array $parametros (idsuscripcion,idtipodocumento,iddocumento) 
     * @return array Lista de parámetros 
     */
    public function consultarLiquidaciones($parametros) {
        $parametros['idtipodocumento'] = $parametros['idtipodocumento'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idsuscripcion'] = $parametros['idsuscripcion'];
        $parametros['iddocumento'] = $parametros['iddocumento'];
        $parametros['numeroventa'] = isset($parametros['numeroventa']) ? $parametros['numeroventa'] : -1;
        $sql = "SELECT
                    liq.uni_liquidacion idliquidacion,
                    liq.liq_nombre      liquidacion
                  FROM liq_liquidacion liq
                    inner join esem_estempresa esem on liq.est_liquidacion = esem.est_ideregistro
                    INNER JOIN limu_liqmunicipio limu ON liq.uni_liquidacion = limu.uni_liquidacion
                  WHERE
                    liq.liq_estado = 'A'
                    and liq.uni_tipdocument = :idtipodocumento
                    and now() :: date between liq.liq_inivigencia and
                    (
                      case when liq.liq_finvigencia is null
                        then now() :: date
                      else liq.liq_finvigencia end
                    )
                    AND liq.liq_venclasific in ('CM')
                    AND limu.uni_municipio = (SELECT dsus.uni_municipio
                                              FROM dsus_detsuscrip dsus
                                              WHERE dsus.dsus_ideregistr = :idsuscripcion)
                    AND esem.emp_ideregistro = :idempresa
                    AND liq.uni_documento = :iddocumento
                    AND (
                          case when liq.liq_ctrventas = 'N'
                            THEN (
                              SELECT count(*)
                              FROM ven_venta ven
                                INNER JOIN veli_venliquidac veli on veli.ven_ideregistro = ven.ven_ideregistro
                              WHERE ven.dsus_ideregistr = :idsuscripcion
                                    AND veli.uni_liquidacion = liq.uni_liquidacion
                                    AND ven.ven_estado <> 'E' AND ven.ven_ideregistro <> :numeroventa
                            )
                          else 0 end
                        ) = 0
                  ORDER BY liq.uni_liquidacion ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los conceptos dependiendo de las 
     * liquidaciones seleccionadas 
     * @param string $liquidaciones
     * @param int $idPrograma identificador del programa de financiaciones 
     * @return array Lista de las 
     */
    public function consultarConceptos($liquidaciones) {
        $idPrograma = PROGRAMA_FINANCIACION_EXTERNA;
        $sql = "SELECT DISTINCT
                                con.uni_concepto idconcepto,
                                replace(con.con_nombre,'\"','') concepto,
                                con.con_tipregistro tiporegistro,
                                con.con_valor valor,
                                con.con_valor valorunitario,
                                con.con_tipcalculo tipocalculo,
                                con.con_financiable financiable,
                                con.con_valnulo eliminar,
                                con.con_metajuste metodo,
                                con.con_precision as precision,
                                CASE
                        WHEN (
                                con.prg_ideregistro = $idPrograma
                                AND con.con_tipcalculo = 'V'
                                AND con.con_tipregistro <> 'U'
                        ) THEN
                                'S'
                        WHEN (
                                con.prg_ideregistro = $idPrograma
                                AND con.con_tipcalculo = 'V'
                                AND con.con_tipregistro = 'U'
                                AND con.con_valor IS NULL
                        ) THEN
                                'S'
                        ELSE
                                'N'
                        END editable,
                         (
                                SELECT
                                        ccoli.uni_liquidacion
                                FROM
                                        coli_conliquida ccoli
                                WHERE
                                        ccoli.uni_concepto = con.uni_concepto AND ccoli.uni_liquidacion in ($liquidaciones)
                                ORDER BY ccoli.uni_liquidacion
                                LIMIT 1
                        ) idliquidacion
                        FROM
                                con_concepto con
                        INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
                        WHERE
                                coli.uni_liquidacion IN ($liquidaciones)
                        AND con.con_estado = 'A'
                        AND (
                                CASE
                                WHEN con.con_finvigencia IS NULL THEN
                                        con.con_finvigencia IS NULL
                                ELSE
                                        con.con_finvigencia >= now() :: DATE
                                END
                        )
                        ORDER BY
                                idliquidacion,concepto";

        return $this->executeQuery($sql);
    }

    /**
     * Método encargado de registrar la venta
     * @param array $venta
     * @return int identificación de la venta 
     */
    public function insertarVenta($venta) {
        $idTerceroUsuario = $this->consultarTerceroUsuario($venta['idusuario']);
        $parametros['ven_estado'] = 'P';
        $parametros['ven_tipo'] = 'C';
        $parametros['ven_cuoinicial'] = 0;
        $parametros['ven_metpago'] = 'F';
        $parametros['ven_observacion'] = 'Financiación externa';
        $this->setCampo($venta, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($venta, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($venta, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($venta, $parametros, 'idcompetenciafirma', 'cofi_ideregistr');
        $this->setCampo($venta, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($venta, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($venta, $parametros, 'valorventa', 'ven_vlrreal');
        $this->setCampo($venta, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($venta, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($venta, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($venta, $parametros, 'idorganismoinspeccion', 'ter_ideorginspeccion');
        $parametros['ter_ideregistro'] = $idTerceroUsuario;
        if (!empty($venta['numeroventa'])) {
            /**
             * El estadp de la venta debe estar en estado 'P' para poderse modificar
             * Si no se encuentra en ese estado se lanza un error
             */
            $this->consultarEstadoVentaPendiente($venta['numeroventa']);
            $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro=' . $venta['numeroventa']);
            return $venta['numeroventa'];
        }
        $parametros['ven_fecha'] = 'now()';
        $idVenta = $this->insertar($parametros, 'ven_venta', 'sq_ven_ideregistro');
        $this->actualizarNumeroVenta($idVenta);
        return $idVenta;
    }

    /**
     * Actualiza el número de financiación en la venta 
     * @param type $infoVenta información de la venta (idventafinanciacion,idventa)
     */
    public function actualizarVenta($infoVenta) {
        $info['fin_numero'] = $infoVenta['idventafinanciacion'];
        $info['ven_ideregistro'] = $infoVenta['idventa'];
        $this->actualizar($info, 'ven_venta', 'ven_ideregistro = :ven_ideregistro');
    }

    /**
     * Consulta el identificador del tercero asociado a ese tercero
     * @param type $idUsuario indentificador de la tabla de usuarios
     * @return array
     * @throws MyException Si no se encuentra el tercero asociado a esa suscripción
     */
    private function consultarTerceroUsuario($idUsuario) {
        $sql = 'SELECT ter.ter_ideregistro
                FROM usuarios usu 
                    INNER JOIN ter_tercero ter ON usu.usuario_nit = ter.ter_documento
                WHERE usu.usu_ideregistro = :idusuario';
        $resultado = $this->executeQuery($sql, ['idusuario' => $idUsuario]);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el tercero del usuario', -1);
        }
        return $resultado[0]['ter_ideregistro'];
    }

    /**
     * Modifica el número de ventas
     * @param type $idVenta identificador de la venta 
     * @return type Número de filas afectadas 
     */
    public function actualizarNumeroVenta($idVenta) {
        $parametros['ven_ideregistro'] = $idVenta;
        $parametros['ven_numero'] = $idVenta;
        return $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro=:ven_ideregistro');
    }

    /**
     * Inserta los detalles de cada venta 
     * @param array $detalleVenta información del detalle de la venta 
     * @return identificador de cada detalle
     */
    public function insertarDetalleVenta(array $detalleVenta) {
        $parametros = array();
        $parametros['usu_ideregistro'] = $this->sesion['idusuario'];
        $this->setCampo($detalleVenta, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($detalleVenta, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($detalleVenta, $parametros, 'cantidad', 'dven_cantidad');
        $this->setCampo($detalleVenta, $parametros, 'valorunitario', 'dven_vlrunitario');
        $this->setCampo($detalleVenta, $parametros, 'valortotal', 'dven_vlrtotal');
        $this->setCampo($detalleVenta, $parametros, 'valorreal', 'dven_vlrreal');
        $this->setCampo($detalleVenta, $parametros, 'editable', 'dven_editable');
        $this->setCampo($detalleVenta, $parametros, 'idliquidacion', 'uni_liquidacion');
        return $this->insertar($parametros, 'dven_detventa', 'sq_dven_ideregistr');
    }

    /**
     * Registra las liquidaciones que se seleccionaron en la venta 
     * @param int $idLiquidacion
     * @param int $idVenta
     * @return int identificador de la tabla de venta liquidación
     */
    public function insertarLiquidacion($idLiquidacion, $idVenta) {
        $parametros['uni_liquidacion'] = $idLiquidacion;
        $parametros['ven_ideregistro'] = $idVenta;
        $parametros['usu_ideregistro'] = $this->sesion['idusuario'];
        return $this->insertar($parametros, 'veli_venliquidac', 'sq_veli_ideregistr');
    }

    /**
     * Se asocia el archivo a la vena
     * @param int $idArchivo
     * @param int $idVenta
     */
    public function actualizarArchivo($idArchivo, $idVenta) {
        $parametros['adve_ideregistr'] = $idArchivo;
        $parametros['ven_ideregistro'] = $idVenta;
        return $this->actualizar($parametros, 'adve_adjventa', 'adve_ideregistr=:adve_ideregistr');
    }

    /**
     * Edita la fecha de nacimiento del tercero 
     * @param array $infoSuscripcion
     */
    public function editarSuscripcion(array $infoSuscripcion) {
        $sql = 'UPDATE ter_tercero
                SET ter_fecnacimiento = :fechanacimiento
                FROM (
                       SELECT ter_ideregistro idtercero
                       FROM dsus_detsuscrip
                       WHERE dsus_ideregistr = :idsuscripcion
                     ) as info
                WHERE info.idtercero=ter_ideregistro AND ter_fecnacimiento IS NULL';
        return $this->executeQuery($sql, $infoSuscripcion);
    }

    /**
     * Inserta en la tabla vecn_venconvenio
     * @param int $idSuscripcion
     * @param int $idVenta
     */
    public function insertarConvenio($idSuscripcion, $idVenta) {
        $sql = "INSERT INTO vecn_venconvenio (
                              ven_ideregistro,
                              emp_ideregistro,
                              dsus_ideregistr,
                              sus_ideregistro,
                              cnre_ideregistr)
                SELECT
                  :idventa,
                  dsus.emp_ideregistro,
                  dsus.dsus_ideregistr,
                  dsus.sus_ideregistro,
                  ss.cnre_ideregistr
                FROM dsus_detsuscrip dsus
                  INNER JOIN sus_suscripcion ss on dsus.sus_ideregistro = ss.sus_ideregistro
                WHERE dsus.dsus_ideregistr = :idsuscricion";
        return $this->executeQuery($sql, array('idsuscricion' => $idSuscripcion, 'idventa' => $idVenta));
    }

    /**
     * Inserta en la tabla de adjuntos 
     * @param array $infoArchivo
     */
    public function insertarArchivo($infoArchivo) {
        $info['adve_tiparchivo'] = 'pdf';
        $info['adve_ruta'] = $infoArchivo['ruta'];
        $info['adve_nomarchivo'] = $infoArchivo['nombrearchivo'];
        $info['usu_ideregistro'] = $this->sesion['idusuario'];
        return $this->insertar($info, 'adve_adjventa', 'sq_adve_ideregistr');
    }

    public function eliminarArchivos($idVenta, $listaArchivos) {
        return $this->eliminar('adve_adjventa', " ven_ideregistro = $idVenta AND adve_ideregistr NOT IN ($listaArchivos)");
    }

    /**
     * Método que realiza la búsqueda de las ventas 
     * @param array $parametros
     * @return array Lista de ventas que coinciden con los criterios 
     */
    public function consultarVenta($parametros) {
        $condicion = " 1=1 ";
        if (!empty($parametros['idsuscripcion'])) {
            $condicion .= " AND dsus.dsus_ideregistr = :idsuscripcion ";
        }
        if (!empty($parametros['numeroventa'])) {
            $condicion .= " AND ven.ven_ideregistro = :numeroventa ";
        }
        if (!empty($parametros['idfirmainstaladora'])) {
            $condicion .= " AND cofi.ter_ideregistro = :idfirmainstaladora ";
        }
        if (!empty($parametros['codigoanterior'])) {
            $condicion .= " AND dsus.dsus_pcodigo = :codigoanterior ";
        }

        $sql = "SELECT
                ter.ter_ideregistro  idtercero,
                ter.ter_nomcompleto  nombretercero,
                dsus.dsus_ideregistr idsuscripcion,
                dsus.emp_ideregistro idempresaservicio,
                emp.empresa_nom      nombreempresaservicio,
                ven.ven_vlrreal      valorventa,
                ven.ven_estado       estado,
                ven.ven_ideregistro  numeroventa
              FROM ven_venta ven
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ven.dsus_ideregistr
                INNER JOIN empresas emp ON emp.empresa_sevemp = dsus.emp_ideregistro
                INNER JOIN cofi_comfirmains cofi on ven.cofi_ideregistr = cofi.cofi_ideregistr
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
              WHERE
                dsus.emp_ideregistro = :idempresaservicio 
                AND ven.ven_tipo = 'C' 
                AND   $condicion";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información del encabezado de una venta
     * @param int $numeroVenta identificador de la venta 
     * @return array
     * @throws MyException
     */
    public function consultarEncabezadoVenta($numeroVenta) {
        $sql = "SELECT
                  ven.dsus_ideregistr      idsuscripcion,
                  ven.ter_ideorginspeccion idorganismoinspeccion,
                  ven.ven_vlrreal          valorventa,
                  ven.uni_documento        iddocumento,
                  ven.uni_tipdocument      idtipodocumento,
                  ven.cofi_ideregistr      idcompetenciafirma,
                  ven.ven_ideregistro      numeroventa
                FROM ven_venta ven
                WHERE ven.ven_tipo = 'C'
                      AND ven.ven_ideregistro = :numeroventa";
        $resultado = $this->executeQuery($sql, ['numeroventa' => $numeroVenta]);
        if (empty($resultado)) {
            throw new MyException('No se encontró la información de la venta');
        }
        return $resultado[0];
    }

    /**
     * Consulta todas las ventas asociadas a la liquidación
     * @param int $numeroVenta identificador de la venta 
     * @return array
     * @throws MyException
     */
    public function consultarLiquidacionesVenta($numeroVenta) {
        $sql = "SELECT veli.uni_liquidacion idliquidacion
                FROM veli_venliquidac veli
                WHERE veli.ven_ideregistro = :numeroventa";
        $resultado = $this->executeQuery($sql, ['numeroventa' => $numeroVenta]);
        //se valida si se obtiene información 
        if (empty($resultado)) {
            throw new MyException('No se encontró las liquidaciones de la venta');
        }
        $listaLiquidaciones = [];
        foreach ($resultado as $registro) {
            $listaLiquidaciones[] = $registro['idliquidacion'];
        }
        return $listaLiquidaciones;
    }

    /**
     * Consulta todos los detalles 
     * @param type $numeroVenta
     * @return array Lista de los detalles 
     */
    public function consultarDetalleVenta($numeroVenta) {
        $sql = "SELECT
                  dven.uni_concepto        idconcepto,
                  'S' seleccionado,
                  dven.dven_editable       editable,
                  dven.dven_vlrunitario    valorunitario,
                  dven.dven_vlrtotal       valortotal,
                  dven.dven_vlrreal        valorreal,
                  dven.dven_cantidad       cantidad,
                  'N'                      eliminado
                FROM dven_detventa dven
                WHERE dven.ven_ideregistro = :numeroventa";
        return $this->executeQuery($sql, ['numeroventa' => $numeroVenta]);
    }

    /**
     * Consulta los archivos asociados a una venta 
     * @param int $numeroVenta Identificador de la venta
     * @return array Lista de la información de los archivos 
     */
    public function consultarAdjuntosVenta($numeroVenta) {
        $sql = "SELECT
                  adve.adve_ideregistr idarchivo,
                  adve.adve_nomarchivo nombrearchivo,
                  adve.adve_ruta       ruta
                FROM adve_adjventa adve
                WHERE adve.ven_ideregistro = :numeroventa";
        return $this->executeQuery($sql, ['numeroventa' => $numeroVenta]);
    }

    private function consultarCreditoVenta($idVenta) {
        $sql = "SELECT cre_ideregistro idcredito FROM vecr_vencredito WHERE ven_ideregistro = :idVenta";
        $resultado = $this->executeQuery($sql, [
            'idVenta' => $idVenta
        ]);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la información de la venta ', -1);
        }
        return $resultado[0]['idcredito'];
    }

    public function inicializarVenta($idVenta) {
        $idCredito = $this->consultarCreditoVenta($idVenta);
        $this->eliminar('vecr_vencredito', 'cre_ideregistro=' . $idCredito);
        $this->eliminar('crsc_crescore', 'cre_ideregistro=' . $idCredito);
        $this->eliminar('crib_creinfbasica', 'cre_ideregistro=' . $idCredito);
        $this->eliminar('crre_crereferencia', 'cre_ideregistro=' . $idCredito);
        $this->eliminar('cre_credito', 'cre_ideregistro=' . $idCredito);
        $this->eliminar('dvfi_detvenfinancia', 'ven_ideregistro=' . $idVenta);
        $this->eliminar('vfi_venfinanciacio', 'ven_ideregistro=' . $idVenta);
        $this->eliminar('vecn_venconvenio', 'ven_ideregistro=' . $idVenta);
        $this->eliminar('veli_venliquidac', 'ven_ideregistro=' . $idVenta);
        $this->eliminar('dven_detventa', 'ven_ideregistro=' . $idVenta);
    }

    public function consultarTercero($documento) {
        $sql = "SELECT ter_ideregistro idtercero FROM ter_tercero WHERE ter_documento = :documento";
        $resutlado = $this->executeQuery($sql, ['documento' => $documento]);
        if (empty($resutlado)) {
            return null;
        }

        return $resutlado[0]['idtercero'];
    }

    /**
     * Se realizan los cambios de registrar solicitante
     * @param type $info
     * @param type $idTercero
     * @return type
     */
    public function insertarSolicitante($info, $idTercero = null) {
        $tercero['ter_documento'] = $info['documento'];
        $tercero['ter_nombre'] = $info['ter_nombre'];
        $tercero['ter_apellido'] = $info['ter_apellido'];
        $tercero['ter_nomcompleto'] = $info['ter_nombre'] . ' ' . $info['ter_apellido'];
        $tercero['ter_sexo'] = $info['sexo'];
        $tercero['ter_telcelular'] = $info['telefonocelular'];
        $tercero['ter_telfijo'] = $info['ter_telfijo'];
        $tercero['ter_correo'] = $info['ter_correo'];
        $tercero['usu_ideregistro'] = $this->sesion['idusuario'];
        $tercero['ciudad_cod'] = $info['ciudad_cod'];
        $tercero['ter_fecnacimiento'] = $info['ter_fecnacimiento'];
        $tercero['uni_tipidentifica'] = $info['uni_tipidentifica'];
        $tercero['est_tiptercero'] = 5;
        $tercero['uni_tiptercero'] = 17;
        //Se verifica si el tercero se va a crear o a actualizar
        if (empty($idTercero)) {
            return $this->insertar($tercero, 'ter_tercero', 'sq_ter_ideregistro');
        }
        //Se actualiza únicamente el correo y la fecha de nacimiento
        $tercero = array();
        $tercero['ter_correo'] = $info['ter_correo'];
        $tercero['ter_fecnacimiento'] = $info['ter_fecnacimiento'];
        $tercero['ter_ideregistro'] = $idTercero;
        $this->actualizarSinUsuario($tercero, 'ter_tercero', 'ter_ideregistro = :ter_ideregistro');
        return $idTercero;
    }

    public function consultarFirmaInstaladora($idVenta) {
        $sql = "SELECT
                    DISTINCT
                    emprcontrato.ter_idegenerico idfirmainstaladora,
                    ven.cofi_ideregistr          idcompetenciafirma,
                    ven.ter_ideorginspeccion     idorganismoinspeccion
                  FROM empresas empfinancia
                    INNER JOIN gestion_contratos gcon ON gcon.gestioncontrato_codemp = empfinancia.empresa_cod
                    INNER JOIN empresas emprcontrato ON emprcontrato.empresa_cod = gcon.gestioncontrato_empcon
                    INNER JOIN clte_clatercero clte ON clte.ter_ideregistro = emprcontrato.ter_idegenerico
                    INNER JOIN cofi_comfirmains cofi ON cofi.ter_ideregistro = emprcontrato.ter_idegenerico
                    INNER JOIN ven_venta ven on cofi.cofi_ideregistr = ven.cofi_ideregistr
                  WHERE ven.ven_ideregistro = :idventa";
        $resultado = $this->executeQuery($sql, ['idventa' => $idVenta]);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la firma instaldora ', -1);
        }
        return $resultado[0];
    }

    public function consultarEmpresaFinancia($idVenta) {
        $sql = "SELECT emp.empresa_sevemp idempresafinancia
                FROM ter_tercero ter
                  INNER JOIN empresas emp ON ter.ter_ideregistro = emp.ter_idegenerico
                  INNER JOIN vfi_venfinanciacio vfi ON vfi.ter_ideentfinan = ter.ter_ideregistro
                WHERE vfi.ven_ideregistro = :idventa";

        $resultado = $this->executeQuery($sql, ['idventa' => $idVenta]);
        if (empty($resultado)) {
            throw new MyException('No se encontró información de la empresa que financia');
        }
        return $resultado[0]['idempresafinancia'];
    }

    public function consultarEstadoVentaPendiente($idVenta) {
        $sql = "SELECT ven_ideregistro
                FROM ven_venta
                WHERE ven_estado = 'P' AND ven_ideregistro = $idVenta";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('La venta ha cambiado de estado ', -1);
        }
    }

}
