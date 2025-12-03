import React, {useEffect} from 'react';
import { Tab } from 'appfuture-react';
import { TablaTASinDinc, TablaTAConDinc, TablaPorcentajeAsociaciones,TablaPorcentajePromedios } from './components'

const Tabs = ({listadoHistoricoRecalculo, 
              numeroActualizacion, 
              listaRecalculoSinDinc, 
              listaRecalculoConDinc,
              listaParticipacion,
              listaPorcentajesPromedios
            }) => {
                
  return (
    <div className='mt-5'>
      <Tab>
        <TablaTASinDinc 
          listadoHistoricoRecalculo={listadoHistoricoRecalculo} 
          numeroActualizacion={numeroActualizacion}
          listaRecalculo={listaRecalculoSinDinc}
          label="TA Sin Dinc"
        />
        <TablaTAConDinc
          listadoHistoricoRecalculo={listadoHistoricoRecalculo} 
          numeroActualizacion={numeroActualizacion}
          listaRecalculo={listaRecalculoConDinc}
          label="TA Con Dinc"
        />
        <TablaPorcentajeAsociaciones
          listaParticipacion={listaParticipacion}
          label="Porcentajes Asociaciones"
        />
        <TablaPorcentajePromedios
        listaPorcentajesPromedios={listaPorcentajesPromedios}
        label ="Porcentajes QA y CSS"
        />
      </Tab>
    </div>
  )
}

export default Tabs