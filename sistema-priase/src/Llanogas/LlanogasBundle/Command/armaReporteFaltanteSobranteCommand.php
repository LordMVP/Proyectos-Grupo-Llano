<?php

namespace Llanogas\LlanogasBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Llanogas\LlanogasBundle\Models\ReporteFaltanteSobranteModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * @author oabaquero
 */
class armaReporteFaltanteSobranteCommand extends ContainerAwareCommand {

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $Conexion;
    private $reporteFaltanteSobrante;
    private $genericoModel;

    protected function configure() {
        $this
                ->setName('Llanogas:achagua:armaReporteFaltanteSobrante')
                ->setDescription('Crea una tabla temporal para la generación del reporte ')
                ->addArgument('empresa', InputArgument::REQUIRED, 'Codigo Seven Empresa a Procesar ');
        $this->Conexion = ConexionBD::getConexion();
        $this->reporteFaltanteSobrante = new ReporteFaltanteSobranteModel($this->Conexion);
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $idempresa = $input->getArgument('empresa');
        print_r("\n  idempresa: " . $idempresa);
        $ano = date("Y", time());
        $mes = date("n", time()) - 2;
        if($mes == -1){
$mes = 11; $ano = $ano - 1;}

        $meses = array('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre');
        $mesNombre = $meses[$mes];
        print_r("\n Nombre del Mes  ");
        print_r($mesNombre);
        
        if ($mes < 10) {
            $mes = '0' . $mes;
        }
        
        $fechaFinal= date('Y-m-d',time());
        print_r("\n Fecha Final ");
        print_r($fechaFinal);
        
        $fecha = new \DateTime();
        $fechaMesAnterior = mktime(0, 0, 0, date("m") - 1, date("d"), date("Y"));
        $fecha->setTimestamp($fechaMesAnterior);
        $fechaInicial = $fecha->format('Y-m-d');
        print_r("\n Fecha Inicial ");
        print_r($fechaInicial);
        if ($idempresa == 322) {
            $empresa = "llano";
            $nitEmpresa = "8000212729";
        }
        if ($idempresa == 319) {
            $empresa = "cusiana";
            $nitEmpresa = "8002186822";
        }
        print_r("\n Empresa ");
        print_r($empresa);
        $tabla = 'ajuste' . $mesNombre . $empresa . $ano . '_opt';
         print_r("\n Nombre de la tabla  :  ");
        print_r($tabla);
        
        $tablaExiste = $this->reporteFaltanteSobrante->existeTabla($tabla);
        if($mes == 0){
            $mes = 12;
            $ano = $ano - 1 ;
        }
        $facemiper = $ano . $mes;
        print_r("\n Ano Mes de factura emitida \n");
        print_r($facemiper);
        print_r("\n Existe la tabla  \n");
        print_r($tablaExiste);
        if ($tablaExiste == 0) {
            print_r("\n---se inicia armado de Reporte ---");
            $this->armaReporte($idempresa, $tabla, $facemiper, $fechaInicial, $fechaFinal, $empresa, $nitEmpresa);
        }
        else{
            $parametros['asunto'] = $empresa . ',  Generé Reporte Faltante Sobrante ';
            $this->EnviarNotificaciones($parametros,$idempresa);
        }
         
        $this->Conexion->close();
    }

    private function armaReporte($idempresa, $tabla, $facemiper, $fechaInicial, $fechaFinal,$empresa, $nitEmpresa) {
        try {
            $this->Conexion->beginTransaction();
            print_r("\n===> Inicia Armado de Reporte \t");
                $this->reporteFaltanteSobrante->eliminarTablasTemporales($idempresa);
            $this->Conexion->commit();
            $this->Conexion->beginTransaction();
                $this->reporteFaltanteSobrante->crearTablaTemporalFactura($idempresa, $fechaInicial, $fechaFinal);
            $this->Conexion->commit();
            $this->Conexion->beginTransaction();
                $this->reporteFaltanteSobrante->crearTablaTemporalDetalleFactura($idempresa);
            $this->Conexion->commit();
            $this->Conexion->beginTransaction();
                $this->reporteFaltanteSobrante->crearTablaTemporalConsumos($idempresa, $facemiper, $nitEmpresa);
            $this->Conexion->commit();
            $this->Conexion->beginTransaction();
                $this->reporteFaltanteSobrante->crearTablaArmaReporte($idempresa, $tabla);
                print_r("\n==== >Ok Fin proceso Reporte < ==== \t");            
            $this->Conexion->commit();
            $parametros['asunto'] = $empresa . ',  Generé Reporte Faltante Sobrante ';
            $this->EnviarNotificaciones($parametros,$idempresa);
        } catch (\Exception $ex) {
            $this->Conexion->rollBack();
            print_r("\nERROR >Error Armando Reporte "  . $ex);
        }
    }
    
    private function EnviarNotificaciones($Datos,$idempresa) {
        print_r("Envia correos ==> ");
        $parametros['datos'] = "";
        $this->genericoModel = new GenericoModel($this->Conexion);
// Create the Mailer using your created Transport
        $getParametroMail = "CORREO_REPORTE_FALTANTE_SOBRANTE";
        $resultado = $this->genericoModel->getDestinatariosCorreos($idempresa, $getParametroMail);
        print_r($resultado) ;
        $message = \Swift_Message::newInstance()
                ->setSubject($Datos['asunto'])
                ->setFrom('noresponder@noresponder.com')
                ->setBody(
                $this->getContainer()->get('templating')->render(
                        'LlanogasLlanogasBundle:Mail:NotificacionReporteMensual.html.twig',$parametros
                ), 'text/html'
        );
        foreach ($resultado as $registro) {
            $message->addTo($registro['destinatarios']) ; 

        }
        $this->getContainer()->get('swiftmailer.mailer.prisma')->send($message);
    }

}
