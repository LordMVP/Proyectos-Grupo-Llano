<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Llanogas\LlanogasBundle\Utiles\Array2XML;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Generarción de notificaciones Mail 
 *
 * @author lmrubio
 */
class NotificacionesMailCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $genericoDelegado;
    private $generoModel;

    /**
     * Empresa: Id de empresa con la cual se va a realizar el seguimiento
     * Proceso: Campo filtro para condicionar los datos que se deben validar para el seguimiento 
     */
    protected function configure() {
        $this
                ->setName('Llanogas:achagua:notificacionesmail')
                ->setDescription('permite generar notificaciones por email')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ')
                ->addArgument('proceso', InputArgument::REQUIRED, 'Proceso que desea ser validado');

        $this->Conexion = ConexionBD::getConexion();
        /*
         * Se debe ajustar la instanciacion de los parametros de referencia de los metodos que se consumen del delegado , 
         * porque genera conflicto si se pasan parametos por referencias desde Comandos de Symfony , por lo cual se comentarea la siguiente linea 
         */
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        try {

            $fecha = (new \DateTime());
            print_r("\n Inicia Proceso :");
            print_r($fecha->format("d-m-Y h:i:s"));

            $empresa = $input->getArgument('empresa');
            $proceso = $input->getArgument('proceso');
            if ($proceso = 'fes') {
                $this->ConsultaAvanceFes($empresa);
            }
            if ($proceso = 'felec') {
                $this->ConsultaConsecutivoDIAN($empresa);
            }
        } catch (\Exception $ex) {
            print_r("\n Error Generando Notificaciones:" . $ex->getMessage());
        }
    }

    private function ConsultaAvanceFes($empresa) {
        $this->genericoDelegado = new GenericoDelegado($this->Conexion);
        $this->genericoModel = new GenericoModel($this->Conexion);
        $infoEmpresa = $this->genericoModel->getEmpresa($empresa);
        $resultado = $this->genericoModel->consultaRegistrosFesPendientes($empresa);

        print_r($infoEmpresa);
        print_r($resultado);
        if (!empty($resultado)) {
            $totalpendiente = 0;
            foreach ($resultado as $registro) {
                $totalpendiente = $totalpendiente + $registro['facturaspendientes'];
            }
            $parametros['asunto'] ='[' . $infoEmpresa['nombre'] . '] FES Notificación Seguimiento-> FacturasPendientes :' . $totalpendiente;
            $parametros['facturaspendientes'] = $resultado;
            $this->EnviarNotificaciones($parametros,$empresa);
        }
    }

    private function EnviarNotificaciones($Datos,$empresa) {
        $parametros['datos'] = $Datos['facturaspendientes'];
// Create the Mailer using your created Transport
        $getParametroMail = "CORREO_NOTIFICACION_FES";
        $resultado = $this->genericoModel->getDestinatariosCorreos($empresa, $getParametroMail);
        print_r($resultado) ;
        $message = \Swift_Message::newInstance()
                ->setSubject($Datos['asunto'])
                ->setFrom('noresponder@noresponder.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Mail:FesSeguimientoSincronizacion.html.twig', $parametros
                ), 'text/html'
        );
        foreach ($resultado as $registro) {
            $message->addTo($registro['destinatarios']) ; 

        }
        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }
    
    private function ConsultaConsecutivoDIAN($empresa) {
        $this->genericoDelegado = new GenericoDelegado($this->Conexion);
        $this->genericoModel = new GenericoModel($this->Conexion);
        $infoEmpresa = "";
        $infoEmpresa = $this->genericoModel->getEmpresa($empresa);
        $resultado = $this->genericoModel->getConsecutivoDIAN($empresa);

        print_r($infoEmpresa);
        print_r("Resultado Consecutivos ==>  ");
        print_r($resultado);
        if (!empty($resultado)) {
            $totalpendiente = 0;
            foreach ($resultado as $registro) {

                $parametros['asunto'] = '[' . $infoEmpresa['nombre'] . '] información de consecutivos y fechas de la DIAN para factura Electronica a Vencer :';
                $parametros['consecutivos'] = $resultado;
                $this->EnviarNotificacionesFelec($parametros, $empresa);
            }
        }
    }

    private function EnviarNotificacionesFelec($consecutivos, $empresa) {
        print_r($consecutivos);
        $parametros = $consecutivos;
// Create the Mailer using your created Transport
        $resultado = $this->genericoModel->getDestinatariosFacturaElectronica($empresa, $consecutivos['consecutivos'][0]['idenudo']);
        print_r($resultado);
        print_r($parametros);
        $message = \Swift_Message::newInstance()
                ->setSubject($consecutivos['asunto'])
                ->setFrom('noresponder@noresponder.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Mail:NotificacionDIAN.html.twig', $parametros
                ), 'text/html'
        );
        foreach ($resultado as $registro) {
            $message->addTo($registro['destinatarios']);
        }


        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }

}
