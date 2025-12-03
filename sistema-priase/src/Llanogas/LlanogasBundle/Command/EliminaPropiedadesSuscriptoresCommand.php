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
 * Elimina las Propiedades y suscriptores  
 *
 * @author oaBaquero
 */
class EliminaPropiedadesSuscriptoresCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;

    protected function configure() {
        $this
            ->setName('Llanogas:achagua:eliminapropiedadessuscriptores')
            ->setDescription('Elimina las Propiedades y Suscriptores');
        $this->Conexion = ConexionBD::getConexion();
        print_r("Iniciando conexion");      
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $parametros = array();
        $genericoModel = new \Llanogas\LlanogasBundle\Models\GenericoModel($this->Conexion);
        print_r("Iniciando consulta a la funcion ");
        $respuesta = $genericoModel->eliminaPropiedadesSuscriptor();
        print_r($respuesta);
        print_r("Respuesta desde la funcion \n ".$respuesta);
         $parametros['asunto'] = 'Propiedades Eliminadas';
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
                ->addTo('lsramirez@grupodellano.com') 
                ->addTo('lmrestrepo@grupodellano.com')
                ->addTo('serosero@grupodellano.com')
                ->addTo('oabaquero@grupodellano.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Ventas:elimina_propiedades_suscriptor.html.twig', $parametros
                ), 'text/html'
        );
        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }


}
