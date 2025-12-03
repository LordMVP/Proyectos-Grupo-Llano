import React from 'react';
import { ContainerDevolucionAjustes } from './components'

const TabsDevolucionAjustes = ({ dataTablaCalculos }) => {
    return (
        <div className='mt-5 group-section'>
            <label className='legend-section'>DEVOLUCION O AJUSTES</label>
            <ContainerDevolucionAjustes
                label="DEVOLUCION O AJUSTES"
                dataTablaCalculos={dataTablaCalculos}
            />
        </div>
    )
}

export default TabsDevolucionAjustes;