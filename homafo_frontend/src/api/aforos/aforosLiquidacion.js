import axios from 'axios'
import {authAxios} from './serversAxios'
import RUTAS_API from '../../data/rutasApi'

export function GetConsultarliquidacionesAforos(data) {
    console.log("data to search:", data)
      return authAxios({
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.LIQUIDACION.CONSULTAR_AFORO,   
  
         method: 'POST',
         data

     })
        .then(x => x.data)

}
export function GetReporteLiquidacion(data) {
    console.log("data for report:", data)
      return authAxios({
        // http://190.14.232.146:8081/aforos/api/aforo/informacionGeneral/16
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.LIQUIDACION.GENERAR_REPORTE,  
  
         //method: 'GET',
         method:'POST',
         data

     })
        .then(x => x.data)

}
export function GetPreLiquidar(data) {
    console.log("data fro preliquidar:", data)
      return authAxios({

        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.LIQUIDACION.PRELIQUIDAR,
        
         method:'POST',
         data

     })
        .then(x => x.data)

}
export function PostLiquidar(data) {
    console.log("data for preliquidar:", data)
      return authAxios({

        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.LIQUIDACION.LIQUIDAR,
        
         method:'POST',
         data

     })
        .then(x => x.data)

}