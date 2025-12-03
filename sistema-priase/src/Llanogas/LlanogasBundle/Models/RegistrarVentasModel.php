<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class RegistrarVentasModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(Connection &$conexion) {
        $this->setConexion($conexion);
    }

    /**
     * Permite validar la secuencia en las ventas de acuerdo a la resoución de la facturación
     * @throws MyException Mensaje de salida para validar la resolución de la facturación
     */
    public function ValidarResolucionFacturacion($iddocumento, $idempresa) {

        $parametros['idtipodocumento'] = C_CONTROL_CONSECUTIVO_VENTAS_TIPDOCUMENTO;
        $parametros['idempresa'] = $idempresa;
        $sql = "SELECT
			'resolución actual ok ' mensaje,
			0 estado
                ";

        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron resultados para la resolución de facturación", -1);
        }
        if (!empty($respuesta)) {
            if ($respuesta[0]['estado'] < 0) {
                throw new MyException($respuesta[0]['mensaje'], -1);
            }
        }
        $resultado = $respuesta[0];
        if ($resultado['estado'] == null || $resultado['mensaje'] == null) {
            return null;
        }
        return $respuesta;
    }

    public function getFirmasInstaladoras($nombre) {
        $parametros['nombrefirma'] = '%' . trim(strtolower($nombre)) . '%';
        $sql = 'select  DISTINCT ter.ter_ideregistro idfirmainstaladora,
                 ter.ter_nomcompleto firmainstaladora
                from cofi_comfirmains cofi inner join ter_tercero ter on cofi.ter_ideregistro=ter.ter_ideregistro
                where lower(ter.ter_nomcompleto) like :nombrefirma  
                    and  now()::date BETWEEN cofi.cofi_inivigencia and cofi.cofi_finvigencia
                    and  now()::date BETWEEN cofi.cofi_inivigenciasic and cofi.cofi_finvigenciasic';
        return $this->executeQuery($sql, $parametros);
    }

    public function getFuncionarioFirma($idFirmaInstaladora) {
        $parametros['idfirmainstaladora'] = $idFirmaInstaladora;
        $sql = "select  cofi.cofi_ideregistr idcompetenciafirma, cofi.cofi_nitempleado cedulafuncionario,
               cofi.cofi_nomempleado ||' '|| uni.uni_nombre1 funcionario, cofi.cofi_inivigencia iniciocertificado, cofi.cofi_finvigencia fincertificado, cofi.cofi_inivigenciasic iniciosic, cofi.cofi_finvigenciasic finsic,
               cofi.uni_competencia idcompetencia, uni.uni_nombre1 competencia
              from cofi_comfirmains cofi inner join ter_tercero ter on cofi.ter_ideregistro=ter.ter_ideregistro
               inner join uni_unidad uni on cofi.uni_competencia=uni.uni_ideregistro
              where  cofi.ter_ideregistro=:idfirmainstaladora   and  now()::date BETWEEN cofi.cofi_inivigencia and cofi.cofi_finvigencia
               and  now()::date BETWEEN cofi.cofi_inivigenciasic and cofi.cofi_finvigenciasic";
        return $this->executeQuery($sql, $parametros);
    }

    public function getVentas(array $parametros) {
        $complemento = null;
        if (isset($parametros['cedula']) && !empty($parametros['cedula'])) {
            $complemento .= ' and ter.ter_documento=:cedula ';
        }
        if (isset($parametros['codigoanterior']) && !empty($parametros['codigoanterior'])) {
            $complemento .= ' and dsus.dsus_pcodigo =:codigoanterior';
        }
        if (isset($parametros['nombretercero']) && !empty($parametros['nombretercero'])) {
            $parametros["nombretercero"] = "%" . strtoupper($parametros['nombretercero']) . "%";
            $complemento .= ' and  upper(ter.ter_nomcompleto) like :nombretercero ';
        }
        if (isset($parametros['fechainicio']) && !empty($parametros['fechainicio']) && isset($parametros['fechafin']) && !empty($parametros['fechafin'])) {
            $complemento .= ' and ven.ven_fecha::date between :fechainicio::date and :fechafin::date ';
        }
        if (isset($parametros['idepropiedad']) && !empty($parametros['idepropiedad'])) {
            $complemento .= ' and pro.pro_idepropieda=:idepropiedad ';
        }
        if (isset($parametros['idsuscripcion']) && !empty($parametros['idsuscripcion'])) {
            $complemento .= ' and  dsus.dsus_ideregistr=:idsuscripcion ';
        }
        if (isset($parametros['numeroventa']) && !empty($parametros['numeroventa'])) {
            $complemento .= ' and ven.ven_numero=:numeroventa ';
        }
        if (isset($parametros['idventa']) && !empty($parametros['idventa'])) {
            $complemento .= ' and ven.ven_ideregistro=:idventa ';
        }
        if (isset($parametros['metodopago'])) {
            $complemento .= ' and ven.ven_metpago=:metodopago ';
        }
        $estado = "'P'";
        if (isset($parametros['estado'])) {
            $estado = $parametros['estado'];
        }
        $complemento .= " and ven.ven_estado in ($estado) ";
        if (empty($complemento)) {
            throw new MyException('Error, no hay parámetros de búsqueda', -1);
        }

        $sql = "SELECT
                      ven.ven_ideregistro idventa,
                      ven.ven_numero numeroventa,
                      ven.ven_fecha fecha,
                      ven.ven_estado estado,
                      ven.ven_tipo tipo,
                      ven.ven_metpago metodopago,
                      ven.ven_observacion observacion,
                      ven.ven_fecaprobada fechaaprobada,
                      ven.ven_feceliminada fechaeliminada,
                      ven.fac_ideregistro idfactura,
                      ven.emp_ideregistro idempresa,
                      ven.uni_documento iddocumento,
                      doc.doc_nombre documento,
                      ven.uni_tipdocument idtipodocumento,
                      uni.uni_nombre1 tipodocumento,
                      ven.ven_fecfacturada fechafacturada,
                      ven.dsus_ideregistr idsuscripcion,
                      ven.cofi_ideregistr idcompetenciafirma,
                      ven.ter_ideregistro idasesor,
                      ven.agenda_ideregistro idagenda,
                      per.per_nombre periodo,
                      cic.cic_nombre ciclo,
                      ven.cic_ideregistro idciclo,
                      per.per_ideregistro idperiodo,
                      ven.fin_numero idfinanciacion,
                      ven.ven_cuoinicial cuotainicial,
                      ven.ven_vlrreal valortotal,
                      ter_ideorginspeccion idorganismoinspeccion,
                      terorg.ter_nomcompleto organismodeinspeccion,
                      nudo.nudo_aplicafelectronica aplicafelec,
                      doc.doc_tipo venclasifica, tersoli.ter_ideregistro tersolicita,
                      dsus.dsus_estado estadosuscripcion,
                      ven.uni_medpagofactura mediopagofactura
              FROM
                      ven_venta ven
              INNER JOIN dsus_detsuscrip dsus ON ven.dsus_ideregistr = dsus.dsus_ideregistr
              INNER JOIN ter_tercero ter ON dsus.ter_ideregistro = ter.ter_ideregistro
              INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
              INNER JOIN doc_documento doc ON doc.uni_documento = ven.uni_documento
INNER JOIN doti_doctipo doti on doti.uni_documento=ven.uni_documento and doti.uni_tipdocument=ven.uni_tipdocument
INNER JOIN donu_dotinumdocumento donu on donu.doti_ideregistr=doti.doti_ideregistr and donu.donu_tipo='FA'
INNER JOIN nudo_numdocumen nudo on nudo.nudo_ideregistro=donu.nudo_ideregistro and nudo.nudo_estado='A' 
and nudo.emp_ideregistro=ven.emp_ideregistro
              INNER JOIN uni_unidad uni ON ven.uni_tipdocument = uni.uni_ideregistro
              INNER JOIN per_periodo per ON per.per_ideregistro = ven.per_ideregistro
              INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = ven.cic_ideregistro
              INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro = ven.uni_documento and prun.prg_ideregistro = 18
              INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
              LEFT JOIN ter_tercero terorg ON ven.ter_ideorginspeccion = terorg.ter_ideregistro
              LEFT JOIN ter_tercero tersoli ON tersoli.ter_ideregistro = ven.ter_idesolicita
              WHERE uspu.usu_ideregistro =:idusuario and ven.emp_ideregistro=:idempresa " . $complemento . " ORDER BY ven.ven_numero";
        return $this->executeQuery($sql, $parametros);
    }

    public function getFirmaInstaladoraVenta($idCompetenciaFirma) {
        $parametros['idcompetenciafirma'] = $idCompetenciaFirma;
        $sql = 'select  
                   cofi.cofi_ideregistr idcompetenciafirma, cofi.cofi_nitempleado cedulafuncionario,
                   ter.ter_ideregistro idfirmainstaladora,
                   ter.ter_nomcompleto firmainstaladora,
                   cofi.cofi_nomempleado funcionario, cofi.cofi_inivigencia iniciocertificado, 
                   cofi.cofi_finvigencia fincertificado , cofi.cofi_inivigenciasic iniciosic, 
                   cofi.cofi_finvigenciasic finsic,
                   cofi.uni_competencia idcompetencia, uni.uni_nombre1 competencia
                from cofi_comfirmains cofi inner join ter_tercero ter on cofi.ter_ideregistro=ter.ter_ideregistro
                   inner join uni_unidad uni on cofi.uni_competencia=uni.uni_ideregistro
                where cofi.cofi_ideregistr=:idcompetenciafirma';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No existe la firma instaladora con id: ' . $idCompetenciaFirma, -1);
        }
        return $resultado[0];
    }

    public function getAgenda($idAgenda) {
        $parametros['idagenda'] = $idAgenda;
        $sql = 'select 
                 age.agenda_cod codigoagenda,age.agenda_nom agenda,age.agenda_ideregistro idagenda
                from agendas age
                where age.agenda_ideregistro=:idagenda';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la agenda con id ' . $idAgenda);
        }
        return $resultado[0];
    }

    public function getLiquidaciones($idEmpresa, $idTipoDocumento, $idDocumento = null, $idMunicipio,$idSuscripcion) {
        $complemento = '';
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmunicipio'] = $idMunicipio;
        $parametros['idsuscripcion'] = $idSuscripcion;
        if (!empty($idDocumento)) {
            $complemento .= ' and liq.uni_documento = :iddocumento';
            $parametros['iddocumento'] = $idDocumento;
        }
        $sql = "select liq.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion 
              from liq_liquidacion liq 
inner join esem_estempresa esem on liq.est_liquidacion=esem.est_ideregistro
              INNER JOIN limu_liqmunicipio limu ON liq.uni_liquidacion = limu.uni_liquidacion
              where  liq.liq_estado='A'  and liq.uni_tipdocument = :idtipodocumento
	and now()::date between  liq.liq_inivigencia and 
(case when liq.liq_finvigencia is null  then now()::date else liq.liq_finvigencia  end) 
and liq.liq_venclasific in ('VE','CO','CA') AND limu.uni_municipio =:idmunicipio   and esem.emp_ideregistro=:idempresa  
and (case when liq.liq_ctrventas = 'N' 
			then (SELECT count(*) from ven_venta ven 
						inner join veli_venliquidac veli on veli.ven_ideregistro=ven.ven_ideregistro
							where ven.dsus_ideregistr=:idsuscripcion and  veli.uni_liquidacion= liq.uni_liquidacion and ven.ven_estado <> 'E' ) else 0  end) = 0
order by liq.uni_liquidacion ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getLiquidacionesEspeciales(array $parametros) {
        $sql = "select idliquidacion,liquidacion from (select  lies.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion,
                    (
                    SELECT
                            SUM (dven.dven_vlrreal)
                    FROM
                            veli_venliquidac veli
                    INNER JOIN coli_conliquida coli ON veli.uni_liquidacion = coli.uni_liquidacion
                    INNER JOIN dven_detventa dven ON dven.uni_concepto = coli.uni_concepto
                    WHERE
                            veli.uni_liquidacion = lies.uni_liquidacion
                    ) valorvendido,lies.lies_vlrlimite valorlimite
                from lies_liqespecial lies inner join liq_liquidacion liq on lies.uni_liquidacion=liq.uni_liquidacion
                     inner join esem_estempresa esem on liq.est_liquidacion=esem.est_ideregistro
                where 
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio is null and lies.pro_catestrato is null and lies.uni_tipusosuscr is null and lies.dsus_ideregistr is null) OR
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio=:idbarrio and lies.pro_catestrato is null and lies.uni_tipusosuscr is null and lies.dsus_ideregistr is null)  OR
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio=:idbarrio and lies.pro_catestrato = :estrato and lies.uni_tipusosuscr is null and lies.dsus_ideregistr is null)  OR
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio=:idbarrio and lies.pro_catestrato = :estrato and lies.uni_tipusosuscr = :idtipousosuscripcion and lies.dsus_ideregistr is null)  OR
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio is null and lies.pro_catestrato is null and lies.uni_tipusosuscr =:idtipousosuscripcion and lies.dsus_ideregistr is null)  OR 
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio is null and lies.pro_catestrato=:estrato and lies.uni_tipusosuscr =:idtipousosuscripcion and lies.dsus_ideregistr is null)  OR 
                 (lies.uni_municipio =:idmunicipio and lies.uni_barrio is null and lies.pro_catestrato=:estrato and lies.uni_tipusosuscr is null and lies.dsus_ideregistr is null)  OR 
                 (lies.uni_municipio is null and lies.uni_barrio is null and lies.pro_catestrato=:estrato and lies.uni_tipusosuscr = :idtipousosuscripcion and lies.dsus_ideregistr is null)  OR   
                 (lies.uni_municipio is null and lies.uni_barrio is null and lies.pro_catestrato is null and lies.uni_tipusosuscr = :idtipousosuscripcion and lies.dsus_ideregistr is null)  OR 
                 (lies.uni_municipio is null and lies.uni_barrio is null and lies.pro_catestrato =:estrato and lies.uni_tipusosuscr is null and lies.dsus_ideregistr is null)   OR 
                 (lies.dsus_ideregistr =:idsuscripcion)  and liq.liq_venclasific in ('VE','CO','CA') and liq.liq_estado='A'
                 and now()::date between  liq.liq_inivigencia and (case when liq.liq_finvigencia is null  then now()::date else liq.liq_finvigencia end)
                 and esem.emp_ideregistro=:idempresa) as liquidaciones where valorlimite<valorvendido";
        return $this->executeQuery($sql, $parametros);
    }

    public function getTiposDocumentos($idUsuario, $idEmpresa, $idTipoUsoSuscripcion, $idMunicipio, $idPrograma) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idprograma'] = $idPrograma;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idtipousosuscripcion'] = $idTipoUsoSuscripcion;
        $parametros['idmunicipio'] = $idMunicipio;
        $sql = "select 
                  distinct doti.uni_tipdocument idtipodocumento, uni.uni_nombre1 tipodocumento
                from doti_doctipo doti inner join doc_documento doc on doti.uni_documento=doc.uni_documento
                  inner join prun_prgunidad prun on prun.uni_ideregistro=doti.uni_tipdocument
                  inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                  inner join uni_unidad uni on uni.uni_ideregistro=doti.uni_tipdocument
                  inner join esem_estempresa esem on esem.est_ideregistro=doti.est_tipdocument
                  INNER JOIN liq_liquidacion liq on liq.uni_tipdocument=doti.uni_tipdocument
                  inner join limu_liqmunicipio limu on limu.uni_liquidacion = liq.uni_liquidacion        
                  INNER JOIN lius_liquso lius on lius.uni_liquidacion=liq.uni_liquidacion
                where  liq.liq_venclasific in ('VE','CA','CO','PV','CM') and uspu.usu_ideregistro=:idusuario 
                   and prun.prg_ideregistro=:idprograma and esem.emp_ideregistro=:idempresa 
                   and lius.uni_tipusosuscr=:idtipousosuscripcion and limu.uni_municipio=:idmunicipio";
        return $this->executeQuery($sql, $parametros);
    }

    public function getDocumentos($idUsuario, $idEmpresa, $idTipoDocumento, $tipoVenta) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idprograma'] = PROGRAMA_VENTAS;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $documentoTipo = ($tipoVenta == 'S') ? "'OS'" : "'VE','CO','CA','PV','CM'";
        $sql = "select 
                  distinct  doc.uni_documento iddocumento,doc.doc_nombre documento
                from doc_documento doc
                  inner join prun_prgunidad prun on prun.uni_ideregistro=doc.uni_documento
                  inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                  inner join esem_estempresa esem on esem.est_ideregistro=doc.est_documento
                  inner join doti_doctipo doti on doc.uni_documento=doti.uni_documento
                where  doc.doc_tipo in ($documentoTipo) and uspu.usu_ideregistro=:idusuario 
                  and prun.prg_ideregistro=:idprograma and esem.emp_ideregistro=:idempresa 
                  and doti.uni_tipdocument=:idtipodocumento ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getNumeroVenta() {
        $sql = "select nextval('sq_ven_ideregistro') numeroventa";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['numeroventa'];
    }

    public function actualizarNumeroVenta($idVenta) {
        $parametros['ven_ideregistro'] = $idVenta;
        $parametros['ven_numero'] = $idVenta;
        return $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro=:ven_ideregistro');
    }

    public function insertarVenta($venta) {
        $parametros = array();
        $parametros['ven_estado'] = 'P';
        $parametros['ven_tipo'] = 'S';
        $this->setCampo($venta, $parametros, 'mediopagofactura', 'uni_medpagofactura');
        $this->setCampo($venta, $parametros, 'metodopago', 'ven_metpago');
        $this->setCampo($venta, $parametros, 'observacion', 'ven_observacion');
        $this->setCampo($venta, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($venta, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($venta, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($venta, $parametros, 'idcompetenciafirma', 'cofi_ideregistr');
        $this->setCampo($venta, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $parametros['ter_ideregistro'] = $venta['idasesor']['idtercero'];
        $this->setCampo($venta, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($venta, $parametros, 'valorventa', 'ven_vlrreal');
        $this->setCampo($venta, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($venta, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($venta, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($venta, $parametros, 'idorganismoinspeccion', 'ter_ideorginspeccion');
        if (!empty($venta['numeroventa'])) {
            $this->setCampo($venta, $parametros, 'numeroventa', 'ven_ideregistro');
            $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro=:ven_ideregistro');
            return $venta['numeroventa'];
        }
        $this->setCampo($venta, $parametros, 'numeroventadisponible', 'ven_numero');

        $parametros['ven_fecha'] = 'now()';
        return $this->insertar($parametros, 'ven_venta', 'sq_ven_ideregistro');
    }

    public function insertarDetalleVenta(array $detalleVenta) {
        $parametros = array();
        $this->setCampo($detalleVenta, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($detalleVenta, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($detalleVenta, $parametros, 'cantidad', 'dven_cantidad');
        $this->setCampo($detalleVenta, $parametros, 'valorunitario', 'dven_vlrunitario');
        $this->setCampo($detalleVenta, $parametros, 'valortotal', 'dven_vlrtotal');
        $this->setCampo($detalleVenta, $parametros, 'valorreal', 'dven_vlrreal');
        $this->setCampo($detalleVenta, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($detalleVenta, $parametros, 'editable', 'dven_editable');
        $this->setCampo($detalleVenta, $parametros, 'idliquidacion', 'uni_liquidacion');
        return $this->insertar($parametros, 'dven_detventa', 'sq_dven_ideregistr');
    }

    public function validarEliminacionConcepto($idConcepto) {
        $parametros['idconcepto'] = $idConcepto;
        $sql = "select count(*) numero from con_concepto where uni_concepto=:idconcepto and con_valnulo='S'";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['numero'];
    }

    public function getDetalleVenta($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'select dven.ven_ideregistro idventa,
                 dven.uni_concepto idconcepto,
                 con.con_nombre concepto,
                 dven.dven_cantidad cantidad,
                 dven.dven_vlrunitario valorunitario,
                 dven.dven_vlrtotal valortotal,
                 dven.dven_vlrreal valorreal,
                 dven.usu_ideregistro idusuario,
                 dven.dven_editable editable,
                 dven.uni_liquidacion idliquidacion,
                 con.con_tipregistro tiporegistro,
                 con.con_tipcalculo tipocalculo,
                 con.con_valnulo eliminar
                from dven_detventa dven inner join con_concepto con on dven.uni_concepto=con.uni_concepto
                where dven.ven_ideregistro=:idventa order by con.con_nombre';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('La venta no tiene conceptos asociados ' . $idVenta, -1);
        }
        return $resultado;
    }

    public function getAdjuntosVenta($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'select 
                 adve.adve_ideregistr idarchivo,adve.adve_tiparchivo tipo,adve.adve_ruta ruta,
                 adve.adve_nomarchivo nombrearchivo,
                 adve.ven_ideregistro idventa
                from adve_adjventa adve where ven_ideregistro=:idventa and vfi_ideregistro is null';
        return $this->executeQuery($sql, $parametros);
    }

    public function getAdjuntosPorId($idArchivo) {
        $parametros['idarchivo'] = $idArchivo;
        $sql = "SELECT
                        adve.adve_ideregistr idarchivo,
                        adve.adve_tiparchivo tipo,
                        adve.adve_ruta ruta,
                        adve.adve_nomarchivo nombrearchivo,
                        adve.ven_ideregistro idventa,
                        concat(split_part(adve_ruta, '/', 6),'/', split_part(adve_ruta, '/', 7)) AS nombre_archivo
                FROM
                        adve_adjventa adve
                WHERE                        
                        adve_ideregistr =:idarchivo";
        $archivo = $this->executeQuery($sql, $parametros);
        if (empty($archivo)) {
            return;
        }
        return $archivo[0];
    }

    /**
     * Permite eliminar un archivo de la base de datos
     * @param int $idArchivo identificador de archivo a eliminar
     * @return int cantidad de filas afectadas
     */
    public function eliminarAdjuntosVenta($idArchivo) {
        return $this->eliminar('adve_adjventa', 'adve_ideregistr=' . $idArchivo);
    }

    public function insertarLiquidacion($idLiquidacion, $idVenta, $idUsuario) {
        $parametros['uni_liquidacion'] = $idLiquidacion;
        $parametros['ven_ideregistro'] = $idVenta;
        $parametros['usu_ideregistro'] = $idUsuario;
        return $this->insertar($parametros, 'veli_venliquidac', 'sq_veli_ideregistr');
    }

    public function actualizarArchivo($idArchivo, $idVenta) {
        $parametros['adve_ideregistr'] = $idArchivo;
        $parametros['ven_ideregistro'] = $idVenta;
        $this->actualizar($parametros, 'adve_adjventa', 'adve_ideregistr=:adve_ideregistr');
    }

    public function inicializarVenta($idVenta, $mantenerFinanciacion, $idusuario) {
        $parametros['idventa'] = $idVenta;

        $sql = "update adve_adjventa set ven_ideregistro=null  where ven_ideregistro=:idventa and vfi_ideregistro is null and usu_ideregistro=$idusuario";
        $this->executeQuery($sql, $parametros);
        $sql = 'DELETE FROM adve_adjventa adve WHERE adve.vfi_ideregistro IN (SELECT hvfi.vfi_ideregistro FROM vfi_venfinanciacio hvfi WHERE hvfi.ven_ideregistro = :idventa )';
        $this->executeQuery($sql, $parametros);
        if (!$mantenerFinanciacion) {
            $sql = ' delete from dvfi_detvenfinancia where ven_ideregistro=:idventa ';
            $this->executeQuery($sql, $parametros);
            $sql = ' delete from vfi_venfinanciacio where ven_ideregistro=:idventa ';
            $this->executeQuery($sql, $parametros);
            $sql = ' delete from veli_venliquidac where ven_ideregistro=:idventa';
            $this->executeQuery($sql, $parametros);
            $sql = ' delete from dven_detventa  where ven_ideregistro=:idventa';
            $this->executeQuery($sql, $parametros);
        }
    }

    public function getLiquidacionesVenta($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = "select  liq.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion
                from liq_liquidacion liq inner join veli_venliquidac veli on liq.uni_liquidacion=veli.uni_liquidacion
                where veli.ven_ideregistro=:idventa";
        return $this->executeQuery($sql, $parametros);
    }

    public function getDocumentoLiquidacionVenta($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'select distinct liq.uni_documento iddocumento,liq.uni_tipdocument idtipodocumento 
                from liq_liquidacion liq inner join veli_venliquidac veli on liq.uni_liquidacion=veli.uni_liquidacion
                where veli.ven_ideregistro=:idventa';
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosVentas($liquidaciones, $idPrograma) {
        $sql = "SELECT DISTINCT
                                con.uni_concepto idconcepto,
                                con.con_nombre concepto,
                                con.con_tipregistro tiporegistro,
                                con.con_valor valor,
                                con.con_valor valorunitario,
                                con.con_tipcalculo tipocalculo,
                                con.con_financiable financiable,
                                con.con_valnulo eliminar,
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
                                idliquidacion,con.con_nombre;";
        return $this->executeQuery($sql);
    }
    
    public function buscaEncabezadosHistoricoCambios($idVenta){
        $parametros['idventa'] = $idVenta;
        try{
        $sql = "(SELECT 1 tipo,
                datos.hven_ideregistr venAnterior,
                datos.ven_ideregistro ven, 
                hven.hven_ideregistr venActualizado, 
                hven.hven_fecha::DATE fecha,
                datos.hven_comentario
                FROM (	SELECT hven.hven_ideregistr,
                hven.ven_ideregistro, 
                hven.hven_comentario
                FROM hven_hisventa hven 
                WHERE hven.ven_ideregistro = :idventa    ) datos
                INNER JOIN hven_hisventa hven ON hven.hven_ideregistr = (	SELECT hvens.hven_ideregistr 
                FROM hven_hisventa hvens 
                WHERE hvens.hven_ideregistr > datos.hven_ideregistr 
                AND  	hvens.ven_ideregistro =  :idventa 
                ORDER BY hvens.hven_ideregistr 
                LIMIT 1)
                WHERE (	SELECT count(*) 
                FROM hven_hisventa hvencant 
                WHERE   hvencant.ven_ideregistro = datos.ven_ideregistro) > 1)

                UNION ALL 

                (	SELECT 2 tipo,
                hven.hven_ideregistr venanterior,
                hven.ven_ideregistro ven, 
                hven.ven_ideregistro venactualizado,
                hven.hven_fecha::DATE fecha,
                hven.hven_comentario
                FROM hven_hisventa hven 
                WHERE hven.ven_ideregistro =  :idventa
                ORDER BY hven.hven_ideregistr DESC 
                LIMIT	1 )
                ORDER BY tipo , venanterior ";
        $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $e){
            throw New MyException("Error, No se encontraron encabezados de Historicos",-1);
        }
        return $resultado;
        
    }
    
    public function buscaDetallesHistoricoCambios($tipo, $venanterior, $venactualizado){
        $parametros['venanterior'] = $venanterior;
        $parametros['venactualizado'] = $venactualizado;
        $parametros['tipo'] = $tipo;
        try{
            $sql="SELECT 		conbase.uni_concepto, 
                                        conbase.concepto, 
                                        hdvenold.dven_cantidad cantidad_ant, 
                                        hdvenold.dven_vlrunitario vlr_unitario_ant, 
                                        hdvenold.dven_vlrtotal total_ant,
                                        hdvennew.dven_cantidad cantidad_new, 
                                        hdvennew.dven_vlrunitario vlr_unitario_new, 
                                        hdvennew.dven_vlrtotal total_new,
                        hven.hven_fecha::date ||' - '|| hven.hven_comentario as comentario
                  FROM 	(	SELECT DISTINCT 
                                                                  hdven.uni_concepto, 
                                                                  con.con_nombre concepto
                                          FROM 		hdven_hisdetventa hdven 
                                          INNER JOIN	con_concepto con ON con.uni_concepto = hdven.uni_concepto
                                          WHERE 		hdven.hven_ideregistr IN (:venanterior, :venactualizado)
                                                  AND 		1 =  :tipo
                                          ORDER BY	con.con_nombre) conbase 
                  LEFT JOIN	hdven_hisdetventa hdvenold ON hdvenold.uni_concepto = conbase.uni_concepto
                          AND 	hdvenold.hven_ideregistr = :venanterior
                  LEFT JOIN hven_hisventa hven on hven.hven_ideregistr = :venanterior
                  LEFT JOIN	hdven_hisdetventa hdvennew ON hdvennew.uni_concepto = conbase.uni_concepto
                          AND 	hdvennew.hven_ideregistr = :venactualizado
                  GROUP BY	conbase.uni_concepto, 
                                          conbase.concepto, 
                                          hdvenold.dven_cantidad, 
                                          hdvenold.dven_vlrunitario,
                                          hdvenold.dven_vlrtotal,
                                          hdvennew.dven_cantidad, 
                                          hdvennew.dven_vlrunitario, 
                                          hdvennew.dven_vlrtotal,
                                          comentario
                  HAVING 		hdvenold.dven_cantidad <> hdvennew.dven_cantidad
                          OR 		hdvenold.dven_vlrtotal <> hdvennew.dven_vlrtotal
                          OR 		hdvennew.dven_cantidad IS NULL 
                          OR 		hdvenold.dven_cantidad IS NULL

                  UNION ALL 

                  SELECT 		con.uni_concepto, 
                                          con.con_nombre concepto, 
                                          hdvenold.dven_cantidad cantidad_ant, 
                                          hdvenold.dven_vlrunitario vlr_unitario_ant, 
                                          hdvenold.dven_vlrtotal total_ant,
                                          dven.dven_cantidad cantidad_new, 
                                          dven.dven_vlrunitario vlr_unitario_new, 
                                          dven.dven_vlrtotal total_new,
                        hven.hven_fecha::date ||' - '|| hven.hven_comentario as comentario
                  FROM 	(	SELECT 		hdven.uni_concepto
                                          FROM 		hdven_hisdetventa hdven 				
                                          WHERE 		hdven.hven_ideregistr = :venanterior 
                                                  AND 		2 = :tipo
                                          UNION 
                                          SELECT 		dven.uni_concepto 
                                          FROM 		dven_detventa dven 
                                          WHERE 		dven.ven_ideregistro = :venactualizado
                                                  AND 		2 = :tipo
                                          ORDER BY 	uni_concepto) conbase 
                  INNER JOIN	con_concepto con ON con.uni_concepto = conbase.uni_concepto 
                  LEFT JOIN	hdven_hisdetventa hdvenold ON hdvenold.uni_concepto = conbase.uni_concepto
                          AND 	hdvenold.hven_ideregistr =:venanterior
                  LEFT JOIN hven_hisventa hven on hven.hven_ideregistr = :venanterior
                  LEFT JOIN	dven_detventa dven ON dven.uni_concepto = conbase.uni_concepto
                          AND 	dven.ven_ideregistro = :venactualizado
                  GROUP BY	con.uni_concepto, 
                                          con.con_nombre, 
                                          hdvenold.dven_cantidad, 
                                          hdvenold.dven_vlrunitario,
                                          hdvenold.dven_vlrtotal,
                                          dven.dven_cantidad, 
                                          dven.dven_vlrunitario, 
                                          dven.dven_vlrtotal,
                                          comentario
                  HAVING 		hdvenold.dven_cantidad <> dven.dven_cantidad
                          OR 		hdvenold.dven_vlrtotal <> dven.dven_vlrtotal
                          OR 		dven.dven_cantidad IS NULL 
                          OR 		hdvenold.dven_cantidad IS NULL
                  ORDER BY 	concepto";
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException("Error, No se encontraron detalles", -1);
        }
        return $resultado;
    }

}
