import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';

const tablaHistorico = ({ comboSeleccionado, listaHistoricoToneladas }) => {
	const [tablaHistorico, setTablaHistorico] = useState(null);

	useEffect(() => {
		if (listaHistoricoToneladas != null && listaHistoricoToneladas.length > 0) {
			mapearHistorialToneladas(listaHistoricoToneladas);
		} else {
			setTablaHistorico(null);
		}
	}, [listaHistoricoToneladas]);


	const mapearHistorialToneladas = (listaHistorico) => {
		const lista = [];
		listaHistorico.map((item, index) => {
			const elemento = {
				actualizacion: item.numeroActualizacion || 0,
				toneladas: item.valorToneladas,
				observacion: item.observacion,
				fcertificado: item.fechaCertificacion,
			};
			lista.push(elemento);
		});
		lista.sort((a, b) => (a.actualizacion > b.actualizacion) ? 1 : -1);
		setTablaHistorico(lista);
	};


	const columnsTable = [
		{
			Header: "N. ACTUALIZACIÓN",
			accessor: "actualizacion",
		},
		{
			Header: "TONELADAS",
			accessor: "toneladas",
		},
		{
			Header: "OBSERVACIÓN",
			accessor: "observacion",
		},
		{
			Header: "FECHA CERTIFICADO",
			accessor: "fcertificado",
		},
	];
	
	return (
		<div>
			{comboSeleccionado && tablaHistorico ?
				<div className='mt-5 mb-5'>
					<ReactTable
						columns={columnsTable}
						data={tablaHistorico}
						defaultPageSize={tablaHistorico ? tablaHistorico.length > 10 
														? 10 : tablaHistorico.length 
														: 2}
					/>
				</div> : null
			}
		</div>
	)
}

export default tablaHistorico;