import * as React from "react";
import { Table } from "react-bootstrap";
import { Pagination, Button } from "react-bootstrap";

interface IProps {
  datos: any[];
  editar: (value: any) => void;
  encabezado: string[];
  validacion: string;
  //titulo:string,
  //accionBoton:()=>void,
  //estilo?:string
  //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
  //datos:[]
}

class TableBasica extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: "",
      paginador: [],
    };
    //this.accionBoton=this.accionBoton.bind(this);
    this.getLLaves = this.getLLaves.bind(this);
    this.getEncabezado = this.getEncabezado.bind(this);
    this.getDatosFila = this.getDatosFila.bind(this);
    this.paginationValores = this.paginationValores.bind(this);
  }

  componentDidMount() {
    this.paginationValores();
    //this.getLista();
    //console.log(this.props.datos);
  }

  paginationValores() {
    for (let number = 1; number <= 5; number++) {
      this.state.paginador.push(
        <Pagination.Item key={number} active={number === 2}>
          {number}
        </Pagination.Item>
      );
    }
  }

  getLLaves() {
    //console.log(this.props.datos);
  }

  getEncabezado() {
    var tmp = this.props.encabezado;
    var keys = tmp;
    return keys.map((key: string) => {
      return (
        <th className="text-center" key={key}>
          {key}
        </th>
      );
    });
  }

  getDatosFila() {
    let tmp = this.props.validacion;
    var items = this.props.datos;
    var keys = this.props.encabezado;
    return items.map((row: any, index: number) => {
      if (row[tmp] >= 0) {
        return (
          <tr key={index}>
            <RenderRow key={index} data={row} keys={keys} />
            <td className="text-center">
              <Button variant="danger" onClick={this.seleccion.bind(this, row)}>
                -
              </Button>
            </td>
          </tr>
        );
      } else {
        return null;
      }
    });
  }

  seleccion(e: any) {
    this.props.editar(e);
  }

  render() {
    return (
      <div className="form-group">
        <Table striped bordered hover>
          <thead>
            <tr>
              {this.getEncabezado()}
              <th className="text-center">Editar</th>
            </tr>
          </thead>
          <tbody>{this.getDatosFila()}</tbody>
        </Table>
      </div>
    );
  }
}

const RenderRow = (props: any) => {
  return props.keys.map((key: any) => {
    return (
      <td className="text-center" key={props.data[key]}>
        {props.data[key]}
      </td>
    );
  });
};

export default TableBasica;
