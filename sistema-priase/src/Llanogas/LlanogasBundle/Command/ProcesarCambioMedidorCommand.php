<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\CambioMedidorModel;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Procesar Cambios de Medidor Registrados en Tecsoft 
 *
 * @author lmrubio
 */
class ProcesarCambioMedidorCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $cambioMedidor;
    private $Programa_Genera_Informacion_FES;
    private $Cantidad_Registros_Procesar;
    private $Codigo_Anomalia;

    protected function configure() {

        $this
                ->setName('Llanogas:interfazTecsoft:procesarcambiomedidor')
                ->setDescription('Valida registros de Cambios de medidor en Tecsoft y aplica dichos cambios en Reingenieria ')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ')
                ->addArgument('codigoprograma', InputArgument::REQUIRED, 'Codigo de Programa para Validar Ejecución');
        $this->Conexion = ConexionBD::getConexion();
        $this->cambioMedidor = new CambioMedidorModel($this->Conexion);
        /*
         *  Referencia del programa que se tiene como referencia para que se tomen los cambios de medidor 
         *  que se hayan ejecutado antes de la fecha de inicio de ejecución dentro del ciclo periodo activo del usuario al que 
         *  se le hizo el cambio de medidor 
         */

        /*
         * Cantidad de registros a procesar en cada Proceso que se inicia 
         */
        $this->Cantidad_Registros_Procesar = 1000;
        /*
         * Codigo Anomalia con la cual se inserta el detalle del nuevo encabezado de lectura 
         */
        $this->Codigo_Anomalia = 267;
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $parametros = array();
        $parametros['programa'] = $input->getArgument('codigoprograma');
        $parametros['empresa'] = $input->getArgument('empresa');
        $parametros['registros'] = $this->Cantidad_Registros_Procesar;
        $cambios_medidor = array();
        $cambios_medidor = $this->cambioMedidor->consultarCambioMedidor($parametros);

        if (empty($cambios_medidor)) {
            print_r("No hay cambios de medidor para procesar ");
            return;
        }

        print_r(" Existen Cambios de Medidor , se inicia el proceso ");
        $this->procesarCambiosMedidor($cambios_medidor);
        $this->Conexion->close();
    }

    private function procesarCambiosMedidor(array $CambiosMedidor) {
        foreach ($CambiosMedidor as $registro) {
            try {
                $this->Conexion->beginTransaction();
                //Actualizar Estado de Registro Actual de Encabezado de lecturas 
                $this->cambioMedidor->actualizarEncabezadoActualLectura($registro);
                $encabezado = array();
                //Inserta encabezado lectura Nuevo Medidor
                $encabezado = $this->insertarEncabezadoLecturas($registro);
                $encabezado['lecturaanterior'] = $registro['lec_medidor_anterior'];
                $encabezado['terceroejecuta'] = $registro['usuario_graba'];
                //Inserta detalle lectura Nuevo Medidor
                $this->insertarDetalleLecturas($encabezado);
                //Actualizar Propiedad 
                $proidregistro = $registro['proideregistro'];
                $datospropiedad = array();
                $datospropiedad['idpropiedad'] = $registro['num_medidor_nuevo'];
                $datospropiedad['digitos'] = $registro['digitos'];
                $this->cambioMedidor->actualizaPropiedad($proidregistro, $datospropiedad);
                $registro['idnuevoencabezado'] = $encabezado['idnuevoencabezado'];
                $this->cambioMedidor->actualizarMedidorTecsoft($registro);
                print_r("OK OK OK OK OK OK OK OK OK  >Proceso Exitoso < ==== \t");
                print_r("==== >Fin proceso Registro < ==== \t");
                $this->Conexion->commit();
            } catch (\Exception $ex) {
                $this->Conexion->rollBack();
                print_r("ERROR ERROR ERROR ERROR ERROR  >Error Procesando Registro: < ====\t" . $ex->getMessage());
                print_r($registro);
                print_r("==== >Fin proceso Registro < ==== \t");
            }
        }
    }

    private function insertarEncabezadoLecturas($registro) {

        $encabezado = array();
        $encabezado['lec_estado'] = 'A';
        $encabezado['lec_fecha'] = $registro['fecha_visita'];
        $encabezado['lec_fecaprobac'] = $registro['fecha_grabacion'];
        $encabezado['lec_fecprocesad'] = 'now()';
        $encabezado['lec_anterior'] = $registro['lec_medidor_nuevo'];
        $encabezado['lec_consumo'] = $registro['consumo'];
        $encabezado['lec_conpromedio'] = $registro['promedio'];
        $encabezado['lec_observacion'] = "Nuev Medidor#:" . $registro['num_medidor_nuevo'] . " Lectura:" . $registro['lec_medidor_nuevo'] . " Digitos:" . $registro['digitos'];
        $encabezado['dsus_ideregistr'] = $registro['idsuscripcion'];
        $encabezado['pro_ideregistro'] = $registro['proideregistro'];
        $encabezado['cic_ideregistro'] = $registro['ciclo'];
        $encabezado['per_ideregistro'] = $registro['periodo'];
        $encabezado['cic_ano'] = $registro['ano'];
        $encabezado['emp_ideregistro'] = $registro['empresa'];
        $encabezado['uni_tipsuscripc'] = $registro['idtipsuscripcion'];
        $encabezado['uni_tipusosuscr'] = $registro['idtipouso'];
        $encabezado['pro_idepropiedad'] = $registro['num_medidor_nuevo'];
        $encabezado['pro_digitos'] = $registro['digitos'];
        $encabezado['lec_desviacion'] = $registro['desviacion'];
        $encabezado['dsus_factor'] = $registro['factor'];
        $encabezado['usu_ideregistro'] = $registro['idusuario'];
        print_r("PASO 2 : Insertando Encabezado Parametros : \t");
        print_r($encabezado);
        $encabezado['idnuevoencabezado'] = $this->cambioMedidor->insertarEncabezadoLecturas($encabezado);
        return $encabezado;
    }

    private function insertarDetalleLecturas($parametrosEncabezado) {
        $parametros = array();
        $parametros['dlec_estado'] = 'E';
        $parametros['dlec_fecha'] = 'now()';
        $parametros['dlec_fecprogram'] = 'now()';
        $parametros['dlec_fecaprobac'] = 'now()';
        $parametros['dlec_fecejecuta'] = 'now()';
        $parametros['dlec_observacio'] = ' Detalle Cambio Medidor Proceso';
        $parametros['ter_ideejecuta'] = $parametrosEncabezado['terceroejecuta'];
        $parametros['lec_ideregistro'] = $parametrosEncabezado['idnuevoencabezado'];
        $parametros['lec_anterior'] = $parametrosEncabezado['lecturaanterior'];
        $parametros['uni_anolectura'] = $this->Codigo_Anomalia;
        $parametros['emp_ideregistro'] = $parametrosEncabezado['emp_ideregistro'];
        $parametros['dlec_realizada'] = 'S';
        $parametros['usu_ideregistro'] = $parametrosEncabezado['usu_ideregistro'];
        print_r("PASO 3: Insertar Nuevo Detalle lecturas\t");
        print_r($parametros);
        $this->cambioMedidor->insertarDetalleLecturas($parametros);
    }

}
