import React from 'react';

export const columnasTablaCuentas = (listener) => {
  return [
    {
      Header: 'Cuentas',
      columns: [
        {
          Header: 'Seleccionar',
          Cell: (props) => {
            return (<label><input type="checkbox" checked={props.original.seleccionado} onChange={(evento) => listener(props, evento)} /> {(props.index + 1)}</label>)
          }
        },
        {
          Header: 'Dirección',
          accessor: 'direccion'
        },
        {
          Header: 'Barrio',
          accessor: 'barrio'
        },
        {
          Header: 'Suscriptor',
          accessor: 'codSuscriptor'
        },
        {
          Header: 'Nombre',
          accessor: 'nombrecliente'
        },
        {
          Header: 'Telefono',
          accessor: 'telefono'
        },
        {
          Header: 'Csc Ruta',
          accessor: 'secRuta'
        },
        {
          Header: 'Actividad',
          accessor: 'actividad'
        },
      ]
    }
  ];
};

export const columnasTablaRutas = (listener) => {
  return [
    {
      Header: 'Rutas',
      columns: [
        {
          Header: 'Municipio',
          accessor: 'municipio'
        },
        {
          Header: 'Sector',
          accessor: 'sector'
        },
        {
          Header: 'Ruta',
          accessor: 'ruta'
        },
        {
          Header: 'Total',
          accessor: 'cantidad'
        },
        {
          Header: 'Acción',
          Cell: (props) => {
            return (<button className='btn btn-primary' onClick={() => listener(props)}><i className='fa fa-fw fa-eye'></i> Ver</button>)
          }
        },
      ]
    }
  ];
};
