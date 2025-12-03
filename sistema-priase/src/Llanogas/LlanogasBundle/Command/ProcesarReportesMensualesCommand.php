<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Llanogas\LlanogasBundle\Models\ReportesMensualesModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\BrowserKit\Response;

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Procesar Reportes Mensuales 
 * 
 * Deterioro
 * Facturado Vs Recaudado Financiado
 * Facturado Vs Recaudado No Financiado
 *
 * @author maramirez
 */

class ProcesarReportesMensualesCommand extends ContainerAwareCommand {
    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $reportesMensuales;

    protected function configure() {
        $this
                ->setName('Llanogas:achagua:procesarReportesMensuales')
                ->setDescription('consolida la informacion de los reportes y los inserta en la tabla temp_reportes_periodicos')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ');
        $this->Conexion = ConexionBD::getConexion();
        $this->reportesMensuales = new ReportesMensualesModel($this->Conexion);
    }

    
    protected function execute(InputInterface $input, OutputInterface $output) {
        $empresa = $input->getArgument('empresa');

        //Generación Reporte Deterioro
        print_r("Empresa: ".$empresa);
        $reporte_mensual1=$this->reportesMensuales->consultarReporte($empresa, "DETERIORO CARTERA");
        if(empty($reporte_mensual1)){
            print_r("\n---Inicia Generacion Reporte Deterioro---");
            $this->procesarReporte($empresa, "DETERIORO CARTERA");
        }
        else{
            print_r("\n---Reporte Deterioro ya existe para el mes en curso---");

             //ENVIA CORREO YA CREADO
             $parametros = array(
                'asunto'=>date('Y-m-d H:i').' - Generación de reportes mensual DETERIORO CARTERA',
                'datos'=>'Generación de reporte DETERIORO CARTERA ya existe para el mes en curso.'
            );
            $this->EnviarNotificaciones($parametros,$empresa);
        }



        //Generación Reporte Facturado Vs Recaudado Financiado
        $reporte_mensual2=$this->reportesMensuales->consultarReporte($empresa, "FACTURADO VS RECAUDADO FINANCIADO");
        if(empty($reporte_mensual2)){
            print_r("\n---Inicia Generacion Reporte Facturado Vs Recaudado Financiado---");
            $this->procesarReporte($empresa, "FACTURADO VS RECAUDADO FINANCIADO");
        }else{
            print_r("\n---Reporte Facturado Vs Recaudado Financiado ya existe para el mes en curso---");

            
             //ENVIA CORREO YA CREADO
             $parametros = array(
                'asunto'=>date('Y-m-d H:i').' - Generación de reportes mensual FACTURADO VS RECAUDADO FINANCIADO',
                'datos'=>'Generación de reporte FACTURADO VS RECAUDADO FINANCIADO ya existe para el mes en curso.'
            );
            $this->EnviarNotificaciones($parametros,$empresa);
        }

        //Generación Reporte Facturado Vs Recaudado No Financiado
        $reporte_mensual3=$this->reportesMensuales->consultarReporte($empresa, "FACTURADO VS RECAUDADO NO FINANCIADO");
        if(empty($reporte_mensual3)){
            print_r("\n---Inicia Generacion Reporte Facturado Vs Recaudado No Financiado---");
            $this->procesarReporte($empresa, "FACTURADO VS RECAUDADO NO FINANCIADO");
        }
        else{
            print_r("\n---Reporte Facturado Vs Recaudado No Financiado ya existe para el mes en curso---");

            
             //ENVIA CORREO YA CREADO
             $parametros = array(
                'asunto'=>date('Y-m-d H:i').' - Generación de reportes mensual FACTURADO VS RECAUDADO NO FINANCIADO',
                'datos'=>'Generación de reporte FACTURADO VS RECAUDADO NO FINANCIADO ya existe para el mes en curso.'
            );
            $this->EnviarNotificaciones($parametros,$empresa);
        }

        $this->Conexion->close();
    }
    
    private function procesarReporte ($empresa, $nombreReporte){
        

        try {
            $this->Conexion->beginTransaction();
            $this->reportesMensuales->insertarReporte($empresa, $nombreReporte);
            print_r("\n==== >Ok Fin proceso Reporte".$nombreReporte." < ==== \t");
            $this->Conexion->commit();
            
            //ENVIA CORREO OK
            $parametros = array(
                'asunto'=>date('Y-m-d H:i').' - Generación de reportes mensual '.$nombreReporte,
                'datos'=>'Generación de reporte '.$nombreReporte.' exitoso para el mes en curso.'
            );
            $this->EnviarNotificaciones($parametros,$empresa);

        } catch (\Exception $ex) {
            $this->Conexion->rollBack();
            print_r("\nERROR >Error Procesando Registro: ".$nombreReporte."< ====\t" . $ex->getMessage());
            
            //ENVIA CORREO ERROR
            $parametros = array(
                'asunto'=>date('Y-m-d H:i').' - PROBLEMA Generación de reportes mensual '.$nombreReporte,
                'datos'=> "ERROR >Error Procesando Registro: ".$nombreReporte."< ==== " . $ex->getMessage()." ==== >"
            );
            $this->EnviarNotificacionesError($parametros,$empresa);
        }
    }

    private function EnviarNotificaciones($Datos,$idempresa) {
        $empresaNom=array('322'=>'Llanogas','319'=>'Cusianagas');

        print_r("Envia correos ==> ");
        $parametros['datos'] = $Datos['datos'];
        $this->genericoModel = new GenericoModel($this->Conexion);
        // Create the Mailer using your created Transport
        $getParametroMail = "CORREO_REPORTE_MENSUAL";
        $resultado = $this->genericoModel->getDestinatariosCorreos($idempresa, $getParametroMail);
        print_r($resultado) ;
        $message = \Swift_Message::newInstance()
                ->setSubject($empresaNom[$idempresa].'- '.$Datos['asunto'])
                ->setFrom('noresponder@noresponder.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Mail:NotificacionReporteMensual_FactvsRec.html.twig',$parametros
                ), 'text/html'
        );
        foreach ($resultado as $registro) {
            $message->addTo($registro['destinatarios']) ; 
        }
        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }

    private function EnviarNotificacionesError($Datos,$idempresa) {
        $empresaNom=array('322'=>'Llanogas','319'=>'Cusianagas');

        print_r("\n==== >execute Mail Error< ==== \t");
       $this->genericoModel = new GenericoModel($this->Conexion);
        // Create the Mailer using your created Transport
        $getParametroMail = "CORREO_REPORTE_ERROR";
        $parametros['datos'] = $Datos['datos'];
        $resultado = $this->genericoModel->getDestinatariosCorreos($idempresa, $getParametroMail);
        print_r($resultado) ;
        $message = \Swift_Message::newInstance()
                ->setSubject($empresaNom[$idempresa].'- '.$Datos['asunto'])
                ->setFrom('noresponder@noresponder.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Mail:NotificacionError.html.twig',$parametros
                ), 'text/html'
        );
        foreach ($resultado as $registro) {
            $message->addTo($registro['destinatarios']) ; 
        }

        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }
}
