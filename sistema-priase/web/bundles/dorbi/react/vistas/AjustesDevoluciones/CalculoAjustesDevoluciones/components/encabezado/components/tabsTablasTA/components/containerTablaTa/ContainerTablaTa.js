import React from 'react';
import TablaTarifas from '../tablaTarifas/TablaTarifas';

const ContainerTablaTa = ({classContainerTable = '', namelastColumn = '', dataTablaCalculos}) => {
  return (
    <div className='mt-6'>
      {
        classContainerTable === 'TaSinDinc' &&
        <div>
          <TablaTarifas
            classContainerTable={`${classContainerTable}-tarifasIniciales`}
            nameContainerTable = 'Tarifas Iniciales'
            typeTable = 'TA_INICIAL'
            namelastColumn={namelastColumn}
            dataTablaCalculos={dataTablaCalculos}
          />
          <TablaTarifas
            classContainerTable={`${classContainerTable}-tarifasAjustadas`}
            nameContainerTable='Tarifas ajustadas'
            typeTable = 'TA_AJUSTADO'
            namelastColumn={namelastColumn}
            dataTablaCalculos={dataTablaCalculos}
          />
        </div>
        
      }
      {
        classContainerTable === 'TaConDinc' &&
        <div>
          <TablaTarifas
            classContainerTable={`${classContainerTable}-tarifasIniciales`}
            nameContainerTable = 'Tarifas Iniciales'
            typeTable = 'TA_INICIAL'
            namelastColumn={namelastColumn}
            dataTablaCalculos={dataTablaCalculos}
          />
          <TablaTarifas
            classContainerTable={`${classContainerTable}-tarifasAjustadas`}
            nameContainerTable='Tarifas ajustadas'
            typeTable = 'TA_AJUSTADO'
            namelastColumn={namelastColumn}
            dataTablaCalculos={dataTablaCalculos}
          />
        </div>
      }
    </div>
  )
}

export default ContainerTablaTa;