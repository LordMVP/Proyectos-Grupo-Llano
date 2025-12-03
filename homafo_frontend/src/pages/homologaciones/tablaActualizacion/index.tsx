import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import Spinner from "react-loader-spinner";

import TablaActualizacionOther from './table_others';
import TablaActualizacionPunto from './table_punto';
import {
  loadParametersEdit,
  loadBarriosAseo
} from "../../../actions/tableGestion";

interface Props {
  listaUnidadesEdit: any[];
  loadListaUnidadesEditAction: () => void;
  listaBarriosAseo: any[];
  loadListaBarriosAseoAction: () => void;
}

function ContenedorTablesActualizacion(props: Props) {

  const {listaUnidadesEdit,loadListaUnidadesEditAction,listaBarriosAseo,loadListaBarriosAseoAction} = props;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    loadListaUnidadesEditAction();
  },[loadListaUnidadesEditAction]);

  useEffect(()=>{
    loadListaBarriosAseoAction();
  },[loadListaBarriosAseoAction]);

  useEffect(()=>{
    if((listaUnidadesEdit && listaUnidadesEdit.length > 0) && (listaBarriosAseo && listaBarriosAseo.length > 0)){
      setIsLoading(true);
    }
  },[listaUnidadesEdit,listaBarriosAseo])

  return (
    <>
      {isLoading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner
            type="Oval"
            color="#007bff"
            height={35}
            width={55}
            strokeWidth={30}
          />
        </div>
      ) : (
        <Container className="my-4">
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Tabla Actualización Otros</h5>
                </Card.Header>
                <Card.Body>
                  <TablaActualizacionOther />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Tabla Actualización Punto</h5>
                </Card.Header>
                <Card.Body>
                  <TablaActualizacionPunto />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

const mapStateToProps = ({tablasGestion}) => ({
  listaUnidadesEdit: tablasGestion.listaUnidadesEdit,
  listaBarriosAseo: tablasGestion.listaBarriosAseo,
})

const mapDispatchToProps = (dispatch) => ({
  loadListaUnidadesEditAction: () => dispatch(loadParametersEdit()),
  loadListaBarriosAseoAction: () => dispatch(loadBarriosAseo()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContenedorTablesActualizacion);