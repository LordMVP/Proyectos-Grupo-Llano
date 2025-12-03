import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table-6';

const TablaDevolucionAjustes = ({
  classContainerTable = '',
  nameContainerTable = 'Tabla',
  nameColumn,
  dataTablaCalculos,
}) => {
  const [valoresTabla, setValoresTabla] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  useEffect(() => {
    if (dataTablaCalculos.length > 0) {
      const valoresIniciales = filterArrayType(dataTablaCalculos, 'TA_INICIAL');
      const valoresAjustados = filterArrayType(dataTablaCalculos, "TA_AJUSTADO");
      const valoresLiquidador = filterArrayType(dataTablaCalculos, nameColumn);

      const valoresTabla = mapField(nameColumn, valoresAjustados, valoresIniciales, valoresLiquidador);
      if (valoresTabla['aplicadoE1']) {
        const resultados = [
          { 
            estrato: "Estrato Uno",
            taAplicado: valoresTabla['aplicadoE1'],
            taAjustado: valoresTabla['ajustadoE1'],
            ajuste: valoresTabla['ajusteE1'],
            porcentajeSubCont: '-' + valoresAjustados['c-FCSE1'],
            valorSubCont: valoresTabla['valorSubContE1'],
            valorAplicar: valoresTabla['valorE1']
          },
          {
            estrato: "Estrato Dos",
            taAplicado: valoresTabla['aplicadoE2'],
            taAjustado: valoresTabla['ajustadoE2'],
            ajuste: valoresTabla['ajusteE2'],
            porcentajeSubCont: '-' + valoresAjustados['c-FCSE2'],
            valorSubCont: valoresTabla['valorSubContE2'],
            valorAplicar: valoresTabla['valorE2']
          },
          {
            estrato: "Estrato Tres",
            taAplicado: valoresTabla['aplicadoE3'],
            taAjustado: valoresTabla['ajustadoE3'],
            ajuste: valoresTabla['ajusteE3'],
            porcentajeSubCont: valoresAjustados['c-FCSE3'],
            valorSubCont: valoresTabla['valorSubContE3'],
            valorAplicar: valoresTabla['valorE3']
          },
          {
            estrato: "Estrato Cuatro",
            taAplicado: valoresTabla['aplicadoE4'],
            taAjustado: valoresTabla['ajustadoE4'],
            ajuste: valoresTabla['ajusteE4'],
            porcentajeSubCont: valoresAjustados['c-FCSE4'],
            valorSubCont: valoresTabla['valorSubContE4'],
            valorAplicar: valoresTabla['valorE4']
          },
          {
            estrato: "Estrato Cinco",
            taAplicado: valoresTabla['aplicadoE5'],
            taAjustado: valoresTabla['ajustadoE5'],
            ajuste: valoresTabla['ajusteE5'],
            porcentajeSubCont: valoresAjustados['c-FCSE5'],
            valorSubCont: valoresTabla['valorSubContE5'],
            valorAplicar: valoresTabla['valorE5']
          },
          {
            estrato: "Estrato Seis",
            taAplicado: valoresTabla['aplicadoE6'],
            taAjustado: valoresTabla['ajustadoE6'],
            ajuste: valoresTabla['ajusteE6'],
            porcentajeSubCont: valoresAjustados['c-FCSE6'],
            valorSubCont: valoresTabla['valorSubContE6'],
            valorAplicar: valoresTabla['valorE6']
          },
          {
            estrato: "PP1",
            taAplicado: valoresTabla['aplicadoPP1'],
            taAjustado: valoresTabla['ajustadoPP1'],
            ajuste: valoresTabla['ajustePP1'],
            porcentajeSubCont: valoresAjustados['c-FCSPP1'],
            valorSubCont: valoresTabla['valorSubContPP1'],
            valorAplicar: valoresTabla['valorPP1']
          },
          {
            estrato: "PP2",
            taAplicado: valoresTabla['aplicadoPP2'],
            taAjustado: valoresTabla['ajustadoPP2'],
            ajuste: valoresTabla['ajustePP2'],
            porcentajeSubCont: valoresAjustados['c-FCSPP2'],
            valorSubCont: valoresTabla['valorSubContPP2'],
            valorAplicar: valoresTabla['valorPP2']
          },
          {
            estrato: "PP3",
            taAplicado: valoresTabla['aplicadoPP2'],
            taAjustado: valoresTabla['ajustadoPP2'],
            ajuste: valoresTabla['ajustePP2'],
            porcentajeSubCont: valoresAjustados['c-FCSPPC'],
            valorSubCont: valoresTabla['valorSubContPP2'],
            valorAplicar: valoresTabla['valorPP2']
          },
          {
            estrato: "PP4",
            taAplicado: valoresTabla['aplicadoPP2'],
            taAjustado: valoresTabla['ajustadoPP2'],
            ajuste: valoresTabla['ajustePP2'],
            porcentajeSubCont: valoresAjustados['c-FCSPPC'],
            valorSubCont: valoresTabla['valorSubContPP2'],
            valorAplicar: valoresTabla['valorPP2']
          },
        ];
        setValoresTabla(resultados);
        setMostrarTabla(true);
      }
    }
    
  }, []);

  const filterArrayType = (array, key) => {
    const initialValue = {};
    const filterArray = array.filter((x) => x.segmento === key);
    filterArray.forEach((element) => {
      initialValue[element.conAlias] = element.valor;
    });
    return initialValue;
  };

  const mapField = (nameLiquidador, dataAjustado, dataInicial, dataLiquidador) => {
    let columnsRows = {};
    switch (nameLiquidador) {
      case 'TC ENERGIA':
        columnsRows['aplicadoE1'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoE2'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoE3'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoE4'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoE5'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoE6'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-CCSEM'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-CCSEM'];
        
        columnsRows['ajustadoE1'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-CCSEM'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-CCSEM'];

        columnsRows['ajusteE1'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajusteE2'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajusteE3'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajusteE4'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajusteE5'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajusteE6'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajustePP1'] = dataLiquidador['ms_ENERGIA'];
        columnsRows['ajustePP2'] = dataLiquidador['ms_ENERGIA'];

        columnsRows['valorSubContE1'] = dataLiquidador['ms_ENEE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms_ENEE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms_ENEE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms_ENEE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms_ENEE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms_ENEE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms_ENEPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms_ENEPP1'];

        columnsRows['valorE1'] = dataLiquidador['ms_ENDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms_ENDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms_ENDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms_ENDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms_ENDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms_ENDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms_ENDVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms_ENDVPP1'];
        break;
      case 'TC GAS':
        columnsRows['aplicadoE1'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoE2'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoE3'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoE4'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoE5'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoE6'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-CCSAM'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-CCSAM'];
          
        columnsRows['ajustadoE1'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-CCSAM'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-CCSAM'];
  
        columnsRows['ajusteE1'] = dataLiquidador['ms-GAS'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-GAS'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-GAS'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-GAS'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-GAS'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-GAS'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-GAS'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-GAS'];
  
        columnsRows['valorSubContE1'] = dataLiquidador['ms-GASE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-GASE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-GASE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms_GASE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms_GASE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms_GASE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms_GASPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms_GASPP2'];
  
        columnsRows['valorE1'] = dataLiquidador['ms-GSDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-GSDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-GSDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-GSDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-GSDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-GSDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-GSDVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-GSDVPP2'];
        break;
      case 'TLU':
        columnsRows['aplicadoE1'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoE2'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoE3'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoE4'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoE5'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoE6'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-CLUS'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-CLUS'];
            
        columnsRows['ajustadoE1'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-CLUS'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-CLUS'];
    
        columnsRows['ajusteE1'] = dataLiquidador['ms-TLU'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-TLU'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-TLU'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-TLU'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-TLU'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-TLU'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-TLU'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-TLU'];
    
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TLUE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TLUE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TLUE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TLUE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TLUE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TLUE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TLUPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TLUPP2'];
    
        columnsRows['valorE1'] = dataLiquidador['ms-TLDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TLDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TLDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TLDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TLDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TLDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TLDVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TLDVPP2'];
        break;
      case 'TBL':
        columnsRows['aplicadoE1'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TBL'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TBL'];
              
        columnsRows['ajustadoE1'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TBL'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TBL'];
      
        columnsRows['ajusteE1'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-TTBL'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-TTBL'];
      
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TBLE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TBLE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TBLE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TBLE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TBLE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TBLE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TBLPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TBLPP2'];
      
        columnsRows['valorE1'] = dataLiquidador['ms-TBDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TBDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TBDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TBDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TBDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TBDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TBDVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TBDVPP2'];
        break;
      case 'TRT':
        columnsRows['aplicadoE1'] = dataInicial['ms-TRTE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TRTE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TRTE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TRTE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TRTE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TRTE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TRTPP'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TRTPP'];
                
        columnsRows['ajustadoE1'] = dataAjustado['ms-TRTE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TRTE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TRTE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TRTE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TRTE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TRTE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TRTPP'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TRTPP'];
        
        columnsRows['ajusteE1'] = dataLiquidador['ms-CTRTE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-CTRTE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-CTRTE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-CTRTE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-CTRTE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-CTRTE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-CTRTPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-CTRTPP'];
        
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TRTSE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TRTSE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TRTSE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TRTSE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TRTSE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TRTSE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TRTSPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TRTSPP2'];
        
        columnsRows['valorE1'] = dataLiquidador['ms-TRDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TRDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TRDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TRDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TRDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TRDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TRDVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TRDVPP2'];
        break;
      case 'TDF':
        columnsRows['aplicadoE1'] = dataInicial['ms-TDFE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TDFE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TDFE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TDFE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TDFE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TDFE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TDFPP'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TDFPP'];
                  
        columnsRows['ajustadoE1'] = dataAjustado['ms-TDFE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TDFE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TDFE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TDFE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TDFE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TDFE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TDFPP'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TDFPP'];
          
        columnsRows['ajusteE1'] = dataLiquidador['ms-LTDFE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-LTDFE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-LTDFE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-LTDFE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-LTDFE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-LTDFE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-LTDFPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-LTDFPP'];
          
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TDFSE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TDFSE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TDFSE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TDFSE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TDFSE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TDFSE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TDFSPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TDFSPP2'];
          
        columnsRows['valorE1'] = dataLiquidador['ms-TDFVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TDFVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TDFVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TDFVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TDFVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TDFVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TDFVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TDFVPP2'];
        break;
      case 'TTL':
        columnsRows['aplicadoE1'] = dataInicial['ms-TTLE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TTLE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TTLE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TTLE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TTLE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TTLE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TTLPP'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TTLPP'];
                    
        columnsRows['ajustadoE1'] = dataAjustado['ms-TTLE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TTLE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TTLE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TTLE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TTLE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TTLE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TTLPP'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TTLPP'];
            
        columnsRows['ajusteE1'] = dataLiquidador['ms-LTTLE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-LTTLE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-LTTLE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-LTTLE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-LTTLE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-LTTLE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-LTTLPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-LTTLPP'];
            
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TTLSE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TTLSE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TTLSE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TTLSE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TTLSE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TTLSE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TTLSPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TTLSPP2'];
            
        columnsRows['valorE1'] = dataLiquidador['ms-TTLVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TTLVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TTLVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TTLVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TTLVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TTLVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TTLVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TTLVPP2'];
        break;
      case 'TA':
        columnsRows['aplicadoE1'] = dataInicial['ms-ta'];
        columnsRows['aplicadoE2'] = dataInicial['ms-ta'];
        columnsRows['aplicadoE3'] = dataInicial['ms-ta'];
        columnsRows['aplicadoE4'] = dataInicial['ms-ta'];
        columnsRows['aplicadoE5'] = dataInicial['ms-ta'];
        columnsRows['aplicadoE6'] = dataInicial['ms-ta'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-ta'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-ta'];
                      
        columnsRows['ajustadoE1'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-ta'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-ta'];
              
        columnsRows['ajusteE1'] = dataLiquidador['ms-LTA'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-LTA'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-LTA'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-LTA'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-LTA'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-LTA'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-LTA'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-LTA'];
              
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TAE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TAE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TAE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TAE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TAE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TAE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TAPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TAPP2'];
              
        columnsRows['valorE1'] = dataLiquidador['ms-TADVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TADVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TADVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TADVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TADVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TADVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TADVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TADVPP2'];
        break;
      case 'TFE':
        columnsRows['aplicadoE1'] = dataInicial['ms-TSEE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TSEE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TSEE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TSEE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TSEE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TSEE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TSEFPPO'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TSEFPPO'];
                      
        columnsRows['ajustadoE1'] = dataAjustado['ms-TSEE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TSEE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TSEE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TSEE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TSEE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TSEE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TSEFPPO'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TSEFPPO'];
              
        columnsRows['ajusteE1'] = dataLiquidador['ms-TFEE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-TFEE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-TFEE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-TFEE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-TFEE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-TFEE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-TFEPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-TFEPP'];
              
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TFESE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TFESE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TFESE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TFESE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TFESE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TFESE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TFESPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TFESPP2'];
              
        columnsRows['valorE1'] = dataLiquidador['ms-TFEVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TFEVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TFEVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TFEVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TFEVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TFEVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TFEVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TFEVPP2'];
        break;
      case 'TTA':
        columnsRows['aplicadoE1'] = dataInicial['ms-TSAE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TSAE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TSAE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TSAE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TSAE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TSAE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TSAPPC'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TSAPPC'];
                        
        columnsRows['ajustadoE1'] = dataAjustado['ms-TSAE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TSAE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TSAE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TSAE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TSAE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TSAE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TSAPPC'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TSAPPC'];
                
        columnsRows['ajusteE1'] = dataLiquidador['ms-TTAE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-TTAE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-TTAE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-TTAE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-TTAE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-TTAE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-TTAPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-TTAPP'];
                
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TTASE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TTASE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TTASE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TTASE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TTASE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TTASE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TTASPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TTASPP2'];
                
        columnsRows['valorE1'] = dataLiquidador['ms-TTAVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TTAVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TTAVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TTAVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TTAVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TTAVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TTAVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TTAVPP2'];
        break;
      case 'TA-DINC':
        columnsRows['aplicadoE1'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TAMD'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TAMD'];
                        
        columnsRows['ajustadoE1'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TAMD'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TAMD'];
                
        columnsRows['ajusteE1'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-LTAD'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-LTAD'];
                
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TADE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TADE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TADE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TADE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TADE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TADE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TADPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TADPP2'];
                
        columnsRows['valorE1'] = dataLiquidador['ms-TDDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TDDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TDDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TDDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TDDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TDDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TDDVPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TDDVPP2'];
        break;
      case 'TFE-DINC':
        columnsRows['aplicadoE1'] = dataInicial['ms-TSEDE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TSEDE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TSEDE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TSEDE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TSEDE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TSEDE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TSEFPPO'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TSEFPPO'];
                        
        columnsRows['ajustadoE1'] = dataAjustado['ms-TSEDE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TSEDE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TSEDE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TSEDE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TSEDE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TSEDE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TSEFPPO'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TSEFPPO'];
                
        columnsRows['ajusteE1'] = dataLiquidador['ms-TFEDE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-TFEDE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-TFEDE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-TFEDE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-TFEDE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-TFEDE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-TFEDPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-TFEDPP'];
                
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TFEDSE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TFEDSE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TFEDSE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TFEDSE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TFEDSE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TFEDSE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TFEDPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TFEDPP2'];
                
        columnsRows['valorE1'] = dataLiquidador['ms-TFEDVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TFEDVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TFEDVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TFEDVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TFEDVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TFEDVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TFEAPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TFEAPP2'];
        break;
      case 'TTA-DINC':
        columnsRows['aplicadoE1'] = dataInicial['ms-TSADE1'];
        columnsRows['aplicadoE2'] = dataInicial['ms-TSADE2'];
        columnsRows['aplicadoE3'] = dataInicial['ms-TSADE3'];
        columnsRows['aplicadoE4'] = dataInicial['ms-TSADE4'];
        columnsRows['aplicadoE5'] = dataInicial['ms-TSADE5'];
        columnsRows['aplicadoE6'] = dataInicial['ms-TSADE6'];
        columnsRows['aplicadoPP1'] = dataInicial['ms-TSADPPC'];
        columnsRows['aplicadoPP2'] = dataInicial['ms-TSADPPC'];
                          
        columnsRows['ajustadoE1'] = dataAjustado['ms-TSADE1'];
        columnsRows['ajustadoE2'] = dataAjustado['ms-TSADE2'];
        columnsRows['ajustadoE3'] = dataAjustado['ms-TSADE3'];
        columnsRows['ajustadoE4'] = dataAjustado['ms-TSADE4'];
        columnsRows['ajustadoE5'] = dataAjustado['ms-TSADE5'];
        columnsRows['ajustadoE6'] = dataAjustado['ms-TSADE6'];
        columnsRows['ajustadoPP1'] = dataAjustado['ms-TSADPPC'];
        columnsRows['ajustadoPP2'] = dataAjustado['ms-TSADPPC'];
                  
        columnsRows['ajusteE1'] = dataLiquidador['ms-TTADE1'];
        columnsRows['ajusteE2'] = dataLiquidador['ms-TTADE2'];
        columnsRows['ajusteE3'] = dataLiquidador['ms-TTADE3'];
        columnsRows['ajusteE4'] = dataLiquidador['ms-TTADE4'];
        columnsRows['ajusteE5'] = dataLiquidador['ms-TTADE5'];
        columnsRows['ajusteE6'] = dataLiquidador['ms-TTADE6'];
        columnsRows['ajustePP1'] = dataLiquidador['ms-TTADPP'];
        columnsRows['ajustePP2'] = dataLiquidador['ms-TTADPP'];
                  
        columnsRows['valorSubContE1'] = dataLiquidador['ms-TTADSE1'];
        columnsRows['valorSubContE2'] = dataLiquidador['ms-TTADSE2'];
        columnsRows['valorSubContE3'] = dataLiquidador['ms-TTADSE3'];
        columnsRows['valorSubContE4'] = dataLiquidador['ms-TTADSE4'];
        columnsRows['valorSubContE5'] = dataLiquidador['ms-TTADSE5'];
        columnsRows['valorSubContE6'] = dataLiquidador['ms-TTADSE6'];
        columnsRows['valorSubContPP1'] = dataLiquidador['ms-TTADPP1'];
        columnsRows['valorSubContPP2'] = dataLiquidador['ms-TTADPP2'];
                  
        columnsRows['valorE1'] = dataLiquidador['ms-TTADVE1'];
        columnsRows['valorE2'] = dataLiquidador['ms-TTADVE2'];
        columnsRows['valorE3'] = dataLiquidador['ms-TTADVE3'];
        columnsRows['valorE4'] = dataLiquidador['ms-TTADVE4'];
        columnsRows['valorE5'] = dataLiquidador['ms-TTADVE5'];
        columnsRows['valorE6'] = dataLiquidador['ms-TTADVE6'];
        columnsRows['valorPP1'] = dataLiquidador['ms-TTAAPP1'];
        columnsRows['valorPP2'] = dataLiquidador['ms-TTAAPP2'];
      break;
    }

    return columnsRows;
  };

  const checkValues = (dataAjustada, dataInicial) => {
    const dataCompare = ['ms-CCSEM', 'ms-CCSAM', 'ms-CLUS', 'ms-TBL', 'ms-TRTE1', 'ms-TRTE2', 'ms-TRTE3', 'ms-TRTE4', 'ms-TRTE5', 'ms-TRTE6',
                         'ms-TRTPP', 'ms-TDFE1', 'ms-TDFE2', 'ms-TDFE3', 'ms-TDFE4', 'ms-TDFE5', 'ms-TDFE6', 'ms-TDFPP', 'ms-TTLE1', 'ms-TTLE2',
                         'ms-TTLE3', 'ms-TTLE4', 'ms-TTLE5', 'ms-TTLE6', 'ms-TTLPP', 'ms-TA', 'ms-TAMD'];
                         
    let valoresDiferentes = false;
    setMostrarTabla(false);
                         
    dataCompare.forEach(element => {
      const valueAjustado = Object.entries(dataAjustada).find(
        (x) => x[0] === element
      )[1];
      const valueInicial = Object.entries(dataInicial).find(
        (x) => x[0] === element
      )[1];

      if (valueAjustado !== valueInicial) {
        setMostrarTabla(true);
        valoresDiferentes = true;
      }
    });

    return valoresDiferentes;
  }

  const columnsTable = [
    {
      Header: "Estrato",
      accessor: "estrato",
    },
    {
      Header: nameColumn + " Aplicado",
      accessor: "taAplicado",
    },
    {
      Header: nameColumn + " Ajustado",
      accessor: "taAjustado",
    },
    {
      Header: "Ajuste",
      accessor: "ajuste",
    },
    {
      Header: "% SUB/CONT",
      accessor: "porcentajeSubCont",
    },
    {
      Header: "SUB/CONT",
      accessor: "valorSubCont",
    },
    {
      Header: "Valor Aplicar",
      accessor: "valorAplicar",
    },
  ];

  return (
    <div>
      {valoresTabla && mostrarTabla && (
        <div className={classContainerTable}>
          <div className="m-3">{nameContainerTable}</div>

          <ReactTable
            columns={columnsTable}
            data={valoresTabla}
            showPaginationBottom={false}
            defaultPageSize={10}
          />
        </div>
      )}
    </div>
  );
};

export default TablaDevolucionAjustes;
