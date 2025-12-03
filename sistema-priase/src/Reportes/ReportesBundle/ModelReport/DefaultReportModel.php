<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DefaultReportModel
 *
 * @author jpsierra
 */

namespace Reportes\ReportesBundle\ModelReport;

class DefaultReportModel {
    //put your code here
    protected $reportName;
    protected $reportFileName;
    protected $reportParams;
    
    public function __construct() {
        
    }
    
    public function validateParams($params){
        
    }
}
