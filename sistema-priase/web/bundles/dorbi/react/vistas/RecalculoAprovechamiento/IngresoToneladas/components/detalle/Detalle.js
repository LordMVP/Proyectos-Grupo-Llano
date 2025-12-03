import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';

const Detalle = ({ limpiarDetalle, setBanderaLDetalle, comboSeleccionado }) => {
	const [valorToneladas, setValorToneladas] = useState("");
	const [observacion, setObservacion] = useState("");

	useEffect(() => {
		if (limpiarDetalle) {
			setValorToneladas("");
			setObservacion("");
			setBanderaLDetalle(false);
		}
	}, [limpiarDetalle])


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

	const valuesTable = [
		{ 'actualizacion': '1', 'toneladas': '0', 'observacion': 'No reporta en el momento', 'fcertificado': '12/01/2022' },
	];


	return (
		<div>
			{comboSeleccionado ?
				<div>
					<ReactTable
						columns={columnsTable}
						data={valuesTable}
						defaultPageSize={2}
					/>

					<div className='form-group text-center'>
						<label>Valor</label>
						<input
							className="form-control" id="valor" placeholder="valor" type="text"
							value={valorToneladas} onChange={(e) => { setValorToneladas(e.target.value) }} />
					</div>
					<div className='form-group text-center'>
						<label>Observación</label>
						<textarea className="form-control" id="observacion" placeholder="observación" type="text"
							value={observacion} onChange={(e) => { setObservacion(e.target.value) }}></textarea>
					</div>
				</div> : null
			}
		</div>
	);
};

export default Detalle;