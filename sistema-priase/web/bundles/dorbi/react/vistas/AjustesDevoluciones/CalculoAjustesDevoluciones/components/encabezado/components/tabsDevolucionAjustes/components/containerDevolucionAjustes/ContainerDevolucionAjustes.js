import React, { useState, useEffect } from 'react';
import TablaDevolucionAjustes from '../tablaDevolucionAjustes/TablaDevolucionAjustes';

const ContainerTablaTa = ({classContainerTable = '', namelastColumn = '', dataTablaCalculos}) => {
  const [liquidadores, setLiquidadores] = useState([]);
  const devolucionesTabla = []

  useEffect(() => {
    if (!liquidadores.length > 0) {
      setLiquidadores(mapGroups(dataTablaCalculos));
    }
    
  }, []);

  const mapGroups = (datosCalculados) => {
    let groupData;

    const distinctSegmento = [...new Set(datosCalculados.map(element => element.segmento))];
    groupData = distinctSegmento.filter(x => x !== 'TA_AJUSTADO').filter(x => x !== 'TA_INICIAL');
    return groupData ? groupData : null;
  }

  liquidadores.forEach((data) => {
    devolucionesTabla.push(
      <div>
        <TablaDevolucionAjustes
          classContainerTable={`${classContainerTable}-${data}`}
          nameContainerTable = {data}
          nameColumn={data}
          dataTablaCalculos={dataTablaCalculos}
        />
      </div>
    )
  })

  return (
    <div className='mt-2'>
      {devolucionesTabla}
    </div>
  )
}

export default ContainerTablaTa;