<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\JasperBridge;

/**
 * Description of AdminReports
 *
 * @author jpsierra
 */
class AdminReports {

    //put your code here
    private $kernel;

    public function __construct($kernel) {
        $this->kernel = $kernel;
    }

    public function getReports() {
        $reports = json_decode(file_get_contents($this->kernel->locateResource('@ReportesBundle/Resources/config/reports.json')), true);
        return $reports;
    }

    public function getReportsJson() {
        return file_get_contents($this->kernel->locateResource('@ReportesBundle/Resources/config/reports.json'));
    }

    public function findReport($name) {
        $reports = $this->getReports();
        foreach ($reports['reports'] as $report) {
            if ($report['name'] == $name) {
                return $report;
            }
        }
        return null;
    }

    public function valideReportParameters($report, $parameters) {
        $parametersValues = array();
        foreach ($report['parameters'] as $parameter) {
            $value = $this->valideParameter($parameter, $parameters);
            //echo $parameter['name'] . " = " . $value;
            if ($parameter['required'] && $value == null) {
                return null;
            } else {
                $parametersValues[$parameter['name']] = $value;
            }
        }
        return $parametersValues;
    }

    private function valideParameter($parameter, $parameters) {
        foreach ($parameters as $key => $value) {
            if (isset($parameter['alias']) && $parameter['alias'] == $key) {
                return $this->valideParameterType($parameter, $value);
            }
        }

        return null;
    }

    private function valideParameterType($parameter, $value) {
        switch ($parameter['type']) {
            case "DATE":
                if (date_parse($value) != null) {
                    return $value;
                } else {
                    return null;
                }
                break;
            case "INT":
                if (is_numeric($value)) {
                    return intval($value);
                } else {
                    return null;
                }
                break;
            case "STR":
                return $value;
        }
        return null;
    }

}
