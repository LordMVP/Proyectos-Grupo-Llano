<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Symfony\Component\Console\Input\InputInterface;
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
class CompactaDetallesFinanciacionesCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $generoModel;
    

    protected function configure() {
        $this
                ->setName('Llanogas:achagua:compactadetallesfinanciaciones')
                ->setDescription('compacta detalles financiaciones')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ');
        $this->Conexion = ConexionBD::getConexion();
        print_r("Iniciando conexion");
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $parametros = array();
        $this->genericoModel = new GenericoModel($this->Conexion);
        print_r("Iniciando consulta a la funcion ");
        $empresa = $input->getArgument('empresa');
        $respuesta = $this->genericoModel->compactadetallesfinanciaciones($empresa);
        print_r("Respuesta desde la funcion \n ");
        print_r($respuesta);
        $parametros['idempresa'] = $empresa;
        $parametros['asunto'] = 'Financiaciones Compactadas';
        $parametros['registros'] = $respuesta;
        print_r("Envocamos el metodo de enviar email ");
        if (!empty($respuesta)) {
            $this->EnviarNotificacion($parametros);
        }
        $this->Conexion->close();
    }

    private function EnviarNotificacion($Datos) {
        $parametros['datos'] = $Datos['registros'];
// Create the Mailer using your created Transport
       $resultado = $this->genericoModel->getDestinatariosCorreoFinanciaciones($Datos['idempresa']);
        print_r($resultado) ;
        $message = \Swift_Message::newInstance()
                ->setSubject($Datos['asunto'])
                ->setFrom('noresponder@noresponder.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Cartera:CompactaFinanciaciones.html.twig', $parametros
                ), 'text/html'
        );
        foreach ($resultado as $registro) {
            $message->addTo($registro['destinatarios']) ; 

        }
        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }
}
