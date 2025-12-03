import axios from 'axios'
import {authAxios} from './serversAxios'
import RUTAS_API from '../../data/rutasApi'

export function GetAforosHistoricosMain(data) {
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.HISTORICOS.CONSULTAR_HISTORICOS,
        method: 'GET',
        params:data,
        headers: { 'Content-Type': 'application/json' }

    })
        .then(x => x.data.data)

}
export function GetAforosHistoricosById(idAforo) {
    return authAxios({        
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.HISTORICOS.HISTORICOS_BY_ID_AFORO + idAforo,
        method: 'GET',                        
    })
        .then(x => x.data)
}

export function GetHistoricoDetalleVisitasByIdAforo(idAforo) {
    return authAxios({        
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.HISTORICOS.HIST_DETALLE_VISITAS_BY_ID_AFORO +'?numAforo='+idAforo,
        method: 'GET',                        
    })
        .then(x => x.data)
}


export function GetHistoricoAforoConsolidado(idAforo,afoPadre) {
    return authAxios({        
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.HISTORICOS.HIST_CONSOLIDADOS +'?numAforo='+idAforo+
        '&numAforoPadre='+afoPadre,
        method: 'GET'
    })
        .then(x => x.data)
}