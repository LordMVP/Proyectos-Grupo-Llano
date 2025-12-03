<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
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
class ActualizaSuscripcionConstructoraCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;

    protected function configure() {

        $this
                ->setName('Llanogas:achagua:actualizasuscripcionconstructora')
                ->setDescription('Hace validacion de los dias que tiene para salir a facturar una vez certificado')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ');
        $this->Conexion = ConexionBD::getConexion();
        print_r("Iniciando conexion");
      //  $this->cambioMedidor = new CambioMedidorModel($this->Conexion);
        /*
         *  Referencia del programa que se tiene como referencia para que se tomen los cambios de medidor 
         *  que se hayan ejecutado antes de la fecha de inicio de ejecución dentro del ciclo periodo activo del usuario al que 
         *  se le hizo el cambio de medidor 
         */
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $parametros = array();
        $idempresa = $input->getArgument('empresa');
        print_r("la empresa que inicio --> ".$idempresa);
        $genericoModel = new \Llanogas\LlanogasBundle\Models\GenericoModel($this->Conexion);
        print_r("Iniciando consulta a la funcion ");
        $respuesta = $genericoModel->actualizaEstadoXdiasConstructoraDsus($idempresa);
        print_r($respuesta);
        print_r("Respuesta desde la funcion \n ".$respuesta);
         $parametros['asunto'] = 'Suscripciones que se Activaron para Facturar';
         $parametros['registros'] = $respuesta ;
         print_r("Envocamos el metodo de enviar email ");
         if(!empty($respuesta)){
            $this->EnviarNotificacionVentas($parametros);
         }
        $this->Conexion->close();
    }
    
    
    private function EnviarNotificacionVentas($Datos) {
        $parametros['datos'] = $Datos['registros'];
// Create the Mailer using your created Transport
        $message = \Swift_Message::newInstance()
                ->setSubject($Datos['asunto'])
                ->setFrom('noresponder@noresponder.com')               
                ->addTo('mlflorez@grupodellano.com')
                ->addTo('lsramirez@grupodellano.com')
            //    ->addTo('lacalderon@grupodellano.com')
                ->addTo('kjquintero@grupodellano.com')               
                ->addTo('serosero@grupodellano.com')
                ->addTo('oabaquero@grupodellano.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Ventas:actualiza_suscripcion_constructora.html.twig', $parametros
                ), 'text/html'
        );
        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }


}
