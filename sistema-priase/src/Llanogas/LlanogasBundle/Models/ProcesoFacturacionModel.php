<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Consultas genericas del sistema.
 *
 * @author json
 */
class ProcesoFacturacionModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function vaciarTablaProceso($idEmpresa) {
        $sql = "DROP TABLE IF EXISTS proceso_facturacion_$idEmpresa";
        $this->executeQuery($sql);
    }

    public function vaciarTablaProcesoSuscripcion($idEmpresa, $idSuscripcion) {
        try {
            $sql = "DELETE FROM proceso_facturacion_$idEmpresa WHERE idsuscripcion IN ($idSuscripcion)";
            $this->executeQuery($sql);
        } catch (\Exception $e) {
            
        }
    }

    public function cargarSuscripciones($idCiclo, $numeroProcesos, $idEmpresa, $idUsuario) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idusuario'] = $idUsuario;
        $parametros['numeroprocesos'] = $numeroProcesos;
        $sql = "create table proceso_facturacion_$idEmpresa as 
                  select dsus_ideregistr idsuscripcion,
                         dsus.uni_liquidacion idliquidacion, dsus.cic_ideregistro idciclo, 
                         (row_number() OVER () % :numeroprocesos) as proceso, CAST( 'P' AS character varying )estado,
                         CAST( ' - ' AS character varying ) mensaje,:idusuario::bigint usu_ideregistro
                   from dsus_detsuscrip dsus 
                   where dsus.cic_ideregistro=:idciclo and dsus.dsus_estado='A' and dsus.emp_ideregistro=:idempresa ";
        $load = $this->executeQuery($sql, $parametros);
        $sqlIndxSuscripcion = "CREATE INDEX ix_prcfac_idsuscripcion_$idEmpresa ON public.proceso_facturacion_$idEmpresa USING btree (idsuscripcion)";
        $this->executeQuery($sqlIndxSuscripcion);     
        $sqlIndxProceso = "CREATE INDEX ix_prcfac_proceso_$idEmpresa ON public.proceso_facturacion_$idEmpresa USING btree (proceso)";
        $this->executeQuery($sqlIndxProceso);     
        $sqlIndxEstado = "CREATE INDEX ix_prcfac_estado_$idEmpresa ON public.proceso_facturacion_$idEmpresa USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);     
        $sqlIndxIdLiquidacion = "CREATE INDEX ix_prcfac_idliquidacion_$idEmpresa ON public.proceso_facturacion_$idEmpresa USING btree (idliquidacion)";
        $this->executeQuery($sqlIndxIdLiquidacion);     
        $sqlIndxIdCiclo = "CREATE INDEX ix_prcfac_idciclo_$idEmpresa ON public.proceso_facturacion_$idEmpresa USING btree (idciclo)";
        $this->executeQuery($sqlIndxIdCiclo);     
        return $load;
    }

    public function cargarSuscripcion($idSuscripcion, $idUsuario, $idEmpresa) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['numeroprocesos'] = 1;
        $sql = "create table proceso_facturacion_$idEmpresa as 
                  select dsus_ideregistr idsuscripcion,
                         dsus.uni_liquidacion idliquidacion, dsus.cic_ideregistro idciclo, 
                         (row_number() OVER () % :numeroprocesos) as proceso, CAST( 'P' AS character varying )estado,
                         CAST( ' - ' AS character varying ) mensaje,:idusuario::bigint usu_ideregistro
                   from dsus_detsuscrip dsus 
                   where dsus.dsus_ideregistr in ($idSuscripcion)";
        return $this->executeQuery($sql, $parametros);
    }

    public function contarRegistrosProcesar($idEmpresa) {
        $sql = "select count(*) numero from proceso_facturacion_$idEmpresa";
        return $this->executeQuery($sql)[0]['numero'];
    }
    public function getSuscripcionesTemporales($idEmpresa) {
        $sql = "select * from proceso_facturacion_$idEmpresa";
        return $this->executeQuery($sql);
    }

    public function getSuscripcionPorProceso($idProceso, $idEmpresa) {
        $parametros['idproceso'] = $idProceso;
        $sql = "select idsuscripcion,idliquidacion,idciclo,
                        dsus.emp_ideregistro idempresa,dsus.sus_ideregistro idsuscriptor,
                        dsus.uni_tipsuscripc idtiposuscripcion, dsus.uni_tipusosuscr idtipousosuscripcion,
                        dsus.ter_ideregistro idtercero, ter.uni_tiptercero idtipotercero
                from  proceso_facturacion_$idEmpresa pfac inner join dsus_detsuscrip dsus on pfac.idsuscripcion=dsus.dsus_ideregistr
                       inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                where proceso=:idproceso and estado='P' order by idliquidacion limit 500 ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getSuscripcionPorId($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select dsus.dsus_ideregistr idsuscripcion, dsus.uni_liquidacion idliquidacion,dsus.cic_ideregistro idciclo,
                        dsus.emp_ideregistro idempresa,dsus.sus_ideregistro idsuscriptor,
                        dsus.uni_tipsuscripc idtiposuscripcion, dsus.uni_tipusosuscr idtipousosuscripcion,
                        dsus.ter_ideregistro idtercero, ter.uni_tiptercero idtipotercero
                from  dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                where dsus.dsus_ideregistr=:idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la suscripción', -1);
        }
        return $resultado[0];
    }

    public function getConceptosLiquidacion($idLiquidacion) {
        return $this->genericoModel->getConceptosLiquidacion($idLiquidacion);
    }

    public function getLiquidaciones($idProceso, $idEmpresa) {
        $parametros['idproceso'] = $idProceso;
        $sql = "select distinct idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento
                from  proceso_facturacion_$idEmpresa pfac inner join  liq_liquidacion liq on pfac.idliquidacion=liq.uni_liquidacion
                where proceso=:idproceso order by idliquidacion";
        return $this->executeQuery($sql, $parametros);
    }

    public function getLiquidacion($idLiquidacion) {
        return $this->genericoModel->getLiquidacionID($idLiquidacion);
    }

    public function getFechasFacturaVencida($idSuscripcion, $idTipoDocumento, $idDocumento) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $parametros['iddocumento'] = $idDocumento;
        $sql = 'select 
                   fac.fac_ideregistro idfactura,fac.fac_fecsuspens fechasuspension, fac.fac_fecvence fechavencimiento 
              from fac_factura fac 
              where fac.dsus_ideregistr=:idsuscripcion and fac.uni_tipdocument=:idtipodocumento and fac.uni_documento=:iddocumento
              and fac.fac_sdoreal>0 order by fac.fac_ideregistro limit 1';
        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturaCicloPeriodoActual(&$infoFactura) {
        $parametros['idsuscripcion'] = $infoFactura['suscripcion']['idsuscripcion'];
        $parametros['iddocumento'] = $infoFactura['liquidacion']['iddocumento'];
        $parametros['idtipodocumento'] = $infoFactura['liquidacion']['idtipodocumento'];
        $parametros['idciclo'] = $infoFactura['cicloperiodo']['idciclo'];
        $parametros['idperiodo'] = $infoFactura['cicloperiodo']['idperiodo'];
        $parametros['cicloanio'] = $infoFactura['cicloperiodo']['cicloanio'];
        $sql = "select fac.fac_ideregistro idfactura
              from fac_factura fac 
              where fac.dsus_ideregistr=:idsuscripcion and fac.uni_documento=:iddocumento 
                  and fac.uni_tipdocument=:idtipodocumento and fac.cic_ideregistro=:idciclo 
                  and fac.per_ideregistro=:idperiodo AND fac.cic_ano=:cicloanio AND fac.fac_estado  IN ('A','G') AND fac.fac_ideorigen is null";
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarRegistroProceso($idSuscripcion, $estado, $mensaje, $idEmpresa) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['mensaje'] = $mensaje;
        $parametros['estado'] = $estado;
        $this->actualizar($parametros, "proceso_facturacion_$idEmpresa", 'idsuscripcion=:idsuscripcion');
    }

    public function actualizarRegistroMasivo($idProceso, $estado, $mensaje, $idEmpresa) {
        $parametros['proceso'] = $idProceso;
        $parametros['mensaje'] = $mensaje;
        $parametros['estado'] = $estado;
        $this->actualizar($parametros, "proceso_facturacion_$idEmpresa", 'proceso=:proceso');
    }

    public function getSuscripciones($idSuscripcion = null, $cedula = null, $codigoAnterior = null) {
        $complemento = '';
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['cedula'] = $cedula;
        $parametros['codigoanterior'] = $codigoAnterior;
        if (!empty($idSuscripcion)) {
            $complemento .=' and dsus.dsus_ideregistr=:idsuscripcion ';
        }
        if (!empty($cedula)) {
            $complemento .=' and ter.ter_documento=:cedula ';
        }
        if (!empty($codigoAnterior)) {
            $complemento .=' and dsus.dsus_pcodigo=:codigoanterior ';
        }
        $sql = "select 
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.dsus_pcodigo codigoanterior,
                    dsus.dsus_fecinicio fechainicio,
                    dsus.dsus_descripcion descripcion,
                    dsus.uni_tipsuscripc idtiposuscripcion,
                    uni.uni_nombre1 tiposuscripcion,
                    rut.rut_ideregistro idruta,rut.rut_nombre ruta,
                    cic.cic_ideregistro idciclo,cic.cic_nombre ciclo,
                    uni1.uni_ideregistro idtipousosuscripcion, uni1.uni_nombre1 tipousosuscripcion,
                    dsus.pro_catestrato estrato, dsus.dsus_estado estado, dsus.dsus_factor factorcorreccion,
                    ter.ter_ideregistro idtercero, ter.ter_nomcompleto nombretercero, ter.ter_documento cedula,
                    dsus.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion
                from dsus_detsuscrip dsus inner join uni_unidad uni on dsus.uni_tipsuscripc=uni.uni_ideregistro
                    inner join rusu_rutsuscrip rusu on rusu.dsus_ideregistr=dsus.dsus_ideregistr
                    inner join rut_ruta rut on rusu.rut_ideregistro=rut.rut_ideregistro
                    inner join cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
                    inner join uni_unidad uni1 on uni1.uni_ideregistro=dsus.uni_tipusosuscr
                    inner join ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                    inner join liq_liquidacion liq on liq.uni_liquidacion=dsus.uni_liquidacion
                where dsus.dsus_estado <> 'E' $complemento";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarFacturasGeneradas($idCiclo, $idEmpresa) {
        $sql = "select 
                   fac.emp_ideregistro idempresa, fac.uni_documento iddocumento,
                   fac.uni_tipdocument idtipodocumento, fac.fac_ideregistro idfactura,
                   fac.dsus_ideregistr idsuscripcion
                from fac_factura fac INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr 
                where fac.fac_estado='G' AND fac.emp_ideregistro=$idEmpresa AND dsus.cic_ideregistro=$idCiclo ";
        return $this->executeQuery($sql);
    }

    public function consultarFacturasGeneradasSuscripcion($idsuscripcion, $idEmpresa) {
        $sql = "select 
                   fac.emp_ideregistro idempresa, fac.uni_documento iddocumento,
                   fac.uni_tipdocument idtipodocumento, fac.fac_ideregistro idfactura,
                   fac.dsus_ideregistr idsuscripcion
                from fac_factura fac INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr 
                where fac.fac_estado='G' AND fac.emp_ideregistro=$idEmpresa AND dsus.dsus_ideregistr IN ($idsuscripcion) ";
        return $this->executeQuery($sql);
    }

    public function getResultado($idEmpresa, $idCiclo) {
        try {
            $sql = "SELECT
                      idsuscripcion,idliquidacion,liq.liq_nombre liquidacion,
                      mensaje
                    FROM
                      proceso_facturacion_$idEmpresa pf INNER JOIN liq_liquidacion liq ON pf.idliquidacion=liq.uni_liquidacion
                    WHERE estado IN ('F','N') --AND idciclo=$idCiclo ";
            return $this->executeQuery($sql);
        } catch (\Exception $e) {
            //throw new MyException('No existe la tabla proceso_facturacion', -1);
        }
    }

    public function getSatisfactorios($idEmpresa, $idCiclo) {
        try {
            $sql = "SELECT
                      pro.proyecto_nom municipio,dsus.uni_tipusosuscr idtipouso,uni.uni_nombre1 tipouso,round(SUM(fac.fac_vlrreal),2) valortotal,
                      count(*) numerousuarios
                    FROM
                      proceso_facturacion_$idEmpresa pf INNER JOIN liq_liquidacion liq ON pf.idliquidacion=liq.uni_liquidacion
                      INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=pf.idsuscripcion
                      INNER JOIN proyectos pro ON pro.proyecto_ideregistro=dsus.uni_municipio
                      INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr
                      INNER JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                    WHERE pf.estado='G' AND fac.fac_estado='G' --AND fac.cic_ideregistro=$idCiclo 
                    AND fac.emp_ideregistro=$idEmpresa
                    GROUP BY pro.proyecto_nom,dsus.uni_tipusosuscr,uni.uni_nombre1
                    order by uni.uni_nombre1,pro.proyecto_nom";
            return $this->executeQuery($sql);
        } catch (\Exception $e) {
            // throw new MyException('No existe la tabla proceso_facturacion', -1);
        }
    }

    public function getValorFactura($idFactura) {
        $sql = "SELECT
                  SUM (dfac.dfac_vlrreal) valor
                FROM
                  dfac_detfactura dfac
                WHERE
                  dfac.fac_ideregistro = $idFactura";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error al actualizar el saldo de la factura', -1);
        }
        return $resultado[0]['valor'];
    }

    private function auditoriaEliminarCiclo($idCiclo) {
        $infoAnterior['cic_ideregistro'] = $idCiclo;
        $parametros['usu_ideregistro'] = $_SESSION['idusuario'];
        $parametros['acc_ideregistro'] = $_SESSION['idacceso'];
        $parametros['aud_opecrud'] = 'DELETE';
        $parametros['aud_fecha'] = 'now()';
        $parametros['aud_campo'] = -1;
        $parametros['aud_tabla'] = 'fac_factura';
        $parametros['aud_infanterior'] = json_encode($infoAnterior);
        $this->insertar($parametros, 'aud_auditoria', 'sq_aud_ideregistro');
    }

    public function eliminarLiquidacion($idCiclo) {
        $this->auditoriaEliminarCiclo($idCiclo);
        $sql = "update fac_factura set fac_estado = 'E',fac_sdoreal=-1,fac_vlrreal=-1 where fac_numero IS NULL AND fac_estado='G' AND cic_ideregistro=$idCiclo  ";
        $this->executeQuery($sql);
    }

    public function eliminarLiquidacionSuscripcion($idSuscripcion) {
        $this->auditoriaEliminarSuscripcion($idSuscripcion);
        $sql = "update fac_factura set fac_estado = 'E',fac_sdoreal=-1,fac_vlrreal=-1 where fac_numero IS NULL AND fac_estado='G' AND dsus_ideregistr IN ($idSuscripcion)";
        $this->executeQuery($sql);
    }

    private function auditoriaEliminarSuscripcion($idSuscripcion) {
        $infoAnterior['dsus_ideregistr'] = $idSuscripcion;
        $parametros['usu_ideregistro'] = $_SESSION['idusuario'];
        $parametros['acc_ideregistro'] = $_SESSION['idacceso'];
        $parametros['aud_opecrud'] = 'DELETE';
        $parametros['aud_fecha'] = 'now()';
        $parametros['aud_campo'] = -1;
        $parametros['aud_tabla'] = 'fac_factura';
        $parametros['aud_infanterior'] = json_encode($infoAnterior);
        $this->insertar($parametros, 'aud_auditoria', 'sq_aud_ideregistro');
    }

    public function consultarFacturasConSaldo($idSuscripcion, $idciclo) {
        $sql = "SELECT
                  fac.fac_ideregistro idfactura,
                  fac.cic_ideregistro idciclo,
                  fac.per_ideregistro idperiodo,
                  fac.cic_ano cicloanio,
                  fac.emp_ideregistro idempresa,
                  fac.fac_sdoreal saldo,
                  (
                   CASE WHEN fac.fac_fecvence::date < now()::date THEN
                   'M'::character varying 
                   ELSE
                   'C'::character varying 
                   END
                  ) As tipo
                FROM
                  fac_factura fac
                WHERE
                  fac.fac_sdoreal > 0 AND fac.fac_estado='A'
                AND fac.dsus_ideregistr = $idSuscripcion AND fac.fac_idepadre IS NULL
                AND fac.per_ideregistro <= (SELECT per1.per_ideregistro FROM per_periodo per1 WHERE per1.cic_ideregistro = fac.cic_ideregistro AND per_estado = 'A')";
        return $this->executeQuery($sql);
    }

    public function insertarFacturaCartera(&$factura) {
        $registro['faca_fecha'] = 'now()';
        $registro['faca_estado'] = 'X';
        $registro['dsus_ideregistr'] = $factura['idsuscripcion'];
        $registro['fac_ideregistro'] = $factura['idfactura'];
        $registro['cic_ideregistro'] = $factura['idciclo'];
        $registro['per_ideregistro'] = $factura['idperiodo'];
        $registro['cic_ano'] = $factura['cicloanio'];
        $registro['usu_ideregistro'] = $factura['idusuario'];
        $registro['emp_ideregistro'] = $factura['idempresa'];
        $registro['faca_sdoreal'] = $factura['saldo'];
        $registro['faca_tipo'] = $factura['tipo'];
        $idFacturaCartera = $this->insertar($registro, 'faca_faccartera', 'sq_faca_ideregistr');
        $factura['idfacturacartera'] = $idFacturaCartera;
    }

    public function insertarDetallesSuma($factura) {
        $idFacturaCartera = $factura['idfacturacartera'];
        $idUsuario = $factura['idusuario'];
        $idFactura = $factura['idfactura'];
        $sql = "INSERT INTO dfcs_detcarsuma (SELECT
                nextval('sq_dfcs_ideregistr'),
                'A',
                $idFacturaCartera::bigint,
                dfac.fac_ideregistro,
                dfac.dfac_ideregistr,
                dfac.dfac_cantidad,
                dfac.dfac_vlrunitari,
                dfac.dfac_vlrtotal,
                dfac.dfac_vlrreal,
                dfac.dfac_sdoreal,
                dfac.uni_concepto,
                $idUsuario::BIGINT
              FROM
                      dfac_detfactura dfac 
                      INNER JOIN fac_factura fac ON fac.fac_ideregistro = dfac.fac_ideregistro
                      INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto
              WHERE
                con.con_operacion='S' AND  dfac.fac_ideregistro = $idFactura
                AND fac.fac_idepadre is null AND dfac.dfac_sdoreal>0 )";
        $this->executeQuery($sql);
    }

    public function insertarDetallesInformativos($factura) {
        $idFacturaCartera = $factura['idfacturacartera'];
        $idUsuario = $factura['idusuario'];
        $idFactura = $factura['idfactura'];
        $sql = "INSERT INTO dfci_detcarinforma (SELECT
                nextval('sq_dfci_ideregistr'),
                'A',
                $idFacturaCartera::bigint,
                dfac.fac_ideregistro,
                dfac.dfac_ideregistr,
                dfac.dfac_cantidad,
                dfac.dfac_vlrunitari,
                dfac.dfac_vlrtotal,
                dfac.dfac_vlrreal,
                dfac.dfac_sdoreal,
                dfac.uni_concepto,
                $idUsuario::BIGINT
              FROM
                      dfac_detfactura dfac INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto
              WHERE
                      con.con_operacion='I' AND  dfac.fac_ideregistro = $idFactura
                AND dfac.dfac_idepadre is null)";
        $this->executeQuery($sql);
    }

    public function actualizarEstadoFacturaCartera($estado, $idSuscripcion) {
        $sqlFaca = "update faca_faccartera set faca_estado ='$estado' where faca_estado='X' AND dsus_ideregistr=$idSuscripcion ";
        $this->executeQuery($sqlFaca);
    }

    public function eliminarFacturaCarteraSuscripcion($idSuscripcion) {
        $sqlFaca = "update faca_faccartera set faca_estado ='E' where faca_estado='X' AND dsus_ideregistr IN ($idSuscripcion) RETURNING faca_ideregistr";
        $resultado = $this->executeQuery($sqlFaca);
    }

    public function eliminarFacturaCartera($idCiclo) {
        $sqlFaca = "update faca_faccartera set faca_estado ='E' where faca_estado='X' AND cic_ideregistro=$idCiclo ";
        $resultado = $this->executeQuery($sqlFaca);
    }

    public function procesarFacturasCartera($idSuscripcion) {
        $sqlFaca = "update faca_faccartera set faca_estado ='P' where faca_estado='A' AND dsus_ideregistr=$idSuscripcion";
        $this->executeQuery($sqlFaca);
    }

    public function eliminarFacturaFisica() {
        $parametros['cantidad_registros'] = CANTIDAD_REGISTROS_ELMINAR_BD;
        $sql = " select count(*)  from   eliminaFacturasBD( :cantidad_registros) ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getFechasRuta($idSuscripcion) {
        return $this->genericoModel->getFechasRuta($idSuscripcion);
    }
    
    public function getEstadoControlProcesoEliminarFacturas(){
        
        $sql="select count(*) cantidad from cpr_ctrproceso   where cpr_estado ='A' and prg_ideregistro = 0";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];        
    }
    
    public function actualizarInicioControlProcesoEliminarFacturas(){
        $sql = "update cpr_ctrproceso  set cpr_estado ='A' , cpr_fecinicio = now()  where cpr_estado ='I' and prg_ideregistro = 0;";
        $this->executeQuery($sql);
    }
    
    public function actualizarFinalizacionControlProcesoEliminarFacturas(){
        $sql = "update cpr_ctrproceso  set cpr_estado ='I' , cpr_fecfinal = now()  where  prg_ideregistro = 0;";
        $this->executeQuery($sql);
    }
    public function depurarDetallesFacturas() {
        $parametros['cantidad_registros'] = 1000000;
        $sql = " select count(*) from public.depuraciondetallefacturasbd(:cantidad_registros) ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    } 


    public function getReportePreLiquidacionModel($ciclo,$fechainicial,$fechafinal){
        $parametros['ciclo'] = $ciclo;
        $parametros['fechainicial']=$fechainicial;
	$parametros['fechafinal']=$fechafinal;
        $sql="SELECT 
        now ()::date fecgeneracion, 
        dsus.dsus_ideregistr idsus,
        dsus.dsus_pcodigo pcodigo,
        unitu.uni_nombre1 uso,
        dsus.pro_catestrato estrato,
        liq.liq_nombre liquidacion,
        
        CASE  WHEN cosdinc.dsus_ideregistr is not null THEN 'Si' ELSE null end as dinc, 
        CASE  WHEN cosvip.dsus_ideregistr is not null THEN 'Si' ELSE null end as vip, 
        CASE  WHEN cosexe.dsus_ideregistr is not null THEN 'Si' ELSE null end as exento, 
        CASE  WHEN cosicbf.dsus_ideregistr is not null THEN 'Si' ELSE null end as icbf, 
        CASE  WHEN cosdesh.dsus_ideregistr is not null THEN 'Si' ELSE null end as deshabitado, 
        CASE  WHEN cospta.dsus_ideregistr is not null THEN 'Si' ELSE null end as pta_pta, 
        CASE     WHEN dsus.pro_catestrato = 7  then 'Si' else null end as oficial,
        CASE  WHEN cosafo.dsus_ideregistr is not null THEN 'Si' ELSE null end as aforado,
        (SELECT hdafo.tafna_calculado
        from aseo.hdafo_detaforo hdafo
        inner join aseo.hafo_aforos hafo on hafo.hafo_ideregistro = hdafo.hafo_ideregistro
        where hdafo.dsus_ideregistr = dsus.dsus_ideregistr
        order by hdafo.hdafo_ideregistro desc limit 1) as tafna, 
        fac.fac_sdoreal::integer saldofac
        
         
        from dsus_detsuscrip dsus
        
        
        inner join fac_factura fac on fac.dsus_ideregistr = dsus.dsus_ideregistr
        inner join liq_liquidacion liq on liq.uni_liquidacion = dsus.uni_liquidacion
        inner join uni_unidad unitu on unitu.uni_ideregistro = dsus.uni_tipusosuscr
        left join cosu_consuscrip cosdinc on cosdinc.dsus_ideregistr = dsus.dsus_ideregistr and cosdinc.uni_concepto = 5259
        left join cosu_consuscrip cospta on cospta.dsus_ideregistr = dsus.dsus_ideregistr and cospta.uni_concepto = 5263
        left join cosu_consuscrip cosdesh on cosdesh.dsus_ideregistr = dsus.dsus_ideregistr and cosdesh.uni_concepto = 5261
        left join cosu_consuscrip cosafo on cosafo.dsus_ideregistr = dsus.dsus_ideregistr and cosafo.uni_concepto = 5262 
        left join cosu_consuscrip cosvip on cosvip.dsus_ideregistr = dsus.dsus_ideregistr and cosvip.uni_concepto = 2715 
        left join cosu_consuscrip cosexe on cosexe.dsus_ideregistr = dsus.dsus_ideregistr and cosexe.uni_concepto = 3560
        left join cosu_consuscrip cosicbf on cosicbf.dsus_ideregistr = dsus.dsus_ideregistr and cosicbf.uni_concepto = 3561 
        
        where dsus.emp_ideregistro = 317 
        and  fac.fac_fecha::date between :fechainicial and :fechafinal and fac.fac_estado = 'G' and fac.uni_documento = 24
        and fac.cic_ideregistro = :ciclo";

        $resultado=$this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
}
