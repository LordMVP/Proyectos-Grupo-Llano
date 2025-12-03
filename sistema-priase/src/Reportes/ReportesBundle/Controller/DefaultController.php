<?php

namespace Reportes\ReportesBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Jaspersoft\Client\Client;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller {

    /**
     * @Route("/pruebas")
     * @Method({"GET"})
     */
    public function indexAction() {
        //$base = $this->get("admin.reportes");
        //$reports = $base->getReports();
        //$base->valideReport("arqueo_caja",null);
        $sqlBuilder = new \Reportes\ReportesBundle\JasperBridge\SQLDynamicQuery();
        $column=array("operation"=>"SUM","name"=>"prueba","condition"=>"dfac.uni_concepto = 266","action"=>"dfac.dfac_vlrtotal");
        $column2=array("operation"=>"AVG","name"=>"prueba","condition"=>"dfac.uni_concepto = 266","action"=>"dfac.dfac_vlrtotal");
        $columns = array($column,$column2);        
        echo $sqlBuilder->buildQuery($columns)[1];        
        return new Response("hola", 200,array('Content-Type' => 'application/json'));
    }
    
    public function test(){
        $base = $this->get("reportes.base");
        $params['PR_STR_USUARIO'] = $base->usuario;
        $params['PR_STR_TITULO_REPORTE']="Listado para emitir lecturas de ".$content['tercero_nombre'];
        $params['PR_STR_TITULO_EMPRESA']=$base->empresaNombre;
        $params['PR_INT_SUSCRIPTOR']=$content['suscriptor_id'];
        $report = $base->getReportObject("listado_suscripciones_pre_lectura.jrxml",$params);
    }



    public function generarReporteAction($codigoProyecto,$medioPago,$fechaConsulta) {
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $c = new Client("http://localhost:8080/jasperserver", "jasperadmin", "jasperadmin");
        $controls = array(
            'PR_USUARIO' => array($idUsuario),
            'PR_CODIGO_PROYECTO' => array($codigoProyecto),
            'PR_FECHA_CONSULTA' => array($fechaConsulta),
            'PR_MEDIO_PAGO' => array($medioPago)            
        );
        $report = $c->reportService()->runReport('/reports/arqueo_caja', 'pdf', null, null, $controls);
       return new Response($report, 200,array('Content-Type' => 'application/pdf'));        
    }
    
    /**
     * @Route("/reporter")
     * @Method({"GET"})
     * @Template("ReportesBundle:Default:reporter.html.twig")
     */
    
    public function reporter(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }


    /**
     * @Route("/excel")
     * @Method({"GET"})
     */
    public function reportExcel(){
        $base = $this->get("reportes.base");
        $test = new \Reportes\ReportesBundle\ModelReport\ExcelTestReport();
        $factModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        //$datos = $factModel->prueba();
        
        $groups[]=array("column"=>"proyecto_nombre","headerTitle"=>"Proyecto <%proyecto_nombre%>","footerTitle"=>"Totales Proyecto <%proyecto_nombre%>","headerPrint"=>false);
        $groups[]=array("column"=>"tipo_uso_nombre","headerTitle"=>"Tipo de uso <%tipo_uso_nombre%>","footerTitle"=>"Totales Tipo uso <%tipo_uso_nombre%>");
                
        $columns[2]=array("name"=>"tercero_nombre_completo","label"=>"Tercero Nombre","width"=>"auto");
        $columns[3]=array("name"=>"lectura_actual","label"=>"Lectura Actual");
        $columns[4]=array("name"=>"lectura_anterior","label"=>"Lectura anterior");
        $columns[5]=array("name"=>"mts_consumo","label"=>"Mts. Consumo");
        $columns[6]=array("name"=>"consumo_cobrar","label"=>"Consumo a cobrar");
        $columns[7]=array("name"=>"concepto_valor_consumo_gas","label"=>"Tarifa Basica","function"=>"SUM");
        $columns[8]=array("name"=>"concepto_tarifa_basica","label"=>"Valor consumo gas","function"=>"SUM");
        
        $builder = new \Reportes\ReportesBundle\ModelReport\FacturacionBuildModel();
        $builder->init();
        $sql =$builder->buildSQL();
        echo $sql;
        $datos = $factModel->ejecutarSQL($sql);
        $test->fillReport($datos,$columns,$groups);
        $test->build();
        
        $respuesta['hola']="4";
        return Util::construyeRespuesta($respuesta);
    }

}
