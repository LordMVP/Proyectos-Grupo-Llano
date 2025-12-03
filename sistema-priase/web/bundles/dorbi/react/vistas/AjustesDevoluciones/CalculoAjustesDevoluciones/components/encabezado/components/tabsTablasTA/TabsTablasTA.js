import React from 'react';
import { Tab } from 'appfuture-react';
import { ContainerTablaTa } from './components'

const TabsTablasTA = ({ dataTablaCalculos }) => {
  return (
    <div className='mt-5'>
      <Tab>
        <ContainerTablaTa 
          label="TA Sin Dinc"
          classContainerTable = 'TaSinDinc' 
          namelastColumn='TA sin Dinc'
          dataTablaCalculos={dataTablaCalculos}
        />
        <ContainerTablaTa
          label="TA Con Dinc"
          classContainerTable = 'TaConDinc' 
          namelastColumn='TA con Dinc'
          dataTablaCalculos={dataTablaCalculos}
        />
      </Tab>
    </div>
  )
}

export default TabsTablasTA;