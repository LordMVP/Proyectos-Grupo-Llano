import React, { useState } from "react";
import { Accordion, Card } from "react-bootstrap";
//common
import ModalDataInfo from "../../utils/ModalDataInfo";
//inner components
import InformacionBasica from "./content/InformacionBasica/InformacionBasica";
import FormSuscription from "./content/FormSuscription/FormSuscription";
import FormHomologation from "./content/FormHomologation/FormHomologation";
//interfaces
type Props = {};
/**
 *
 * @param props
 * @returns {component}
 */
export default function NuevaSuscripcion(props: Props) {
  //props
  const {} = props;
  //const
  const titles: string[] = [
    "Información Básica",
    "Información Suscripción",
    "Información Homologación",
  ];
  const nameSeccions: string[] = ["third", "suscripcion", "homologacion"];
  //states
  const [third, setThird] = useState<null | string | number>(null);
  const handleAsingIdThird = (data: null | string | number) => setThird(data);
  const [select, setSelect] = useState<string>("");
  const [propertyData, setPropertyData] = useState<null | any>(null);
  const [modalAlert, setModalAlert] = useState<boolean>(false);
  const [currentSuscription, setCurrentSuscription] = useState<any | null>(
    null
  );

  //methods
  const handleSelect = (e: any) => {
    setSelect(e ? e : "");

    if (e === nameSeccions[1] && third === null) {
      setModalAlert(true);
    }
  };
  const handleChangeSeccion = (data: string) => setSelect(data);
  const handleCloseModal = () => setModalAlert(false);

  const handleAsingProperty = (data: any) => setPropertyData(data);
  const handleAsingSuscription = (data: any | null) =>
    setCurrentSuscription(data);
  console.log(currentSuscription);
  //renders
  return (
    <>
      <ModalDataInfo
        show={modalAlert}
        onHide={handleCloseModal}
        title="Alerta"
        variant="warning"
      >
        <p>
          No se a seleccionado un tercero por favor asigne uno para continuar
          con el proceso
        </p>
      </ModalDataInfo>
      <div className="w-100">
        <div className="w-100 ">
          <Accordion onSelect={handleSelect} activeKey={select}>
            {/*seccion 1 nuevo tercero */}
            <Accordion.Toggle
              as={Card.Header}
              className="w-100 btn text-left"
              eventKey={nameSeccions[0]}
            >
              {titles[0]}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={nameSeccions[0]}>
              <InformacionBasica
                handleAsingIdThird={handleAsingIdThird}
                handleAsingProperty={handleAsingProperty}
                handleChangeSeccion={handleChangeSeccion}
              />
            </Accordion.Collapse>
            {/*seccion 2 nuevo componente */}
            <Accordion.Toggle
              as={Card.Header}
              className="w-100 btn text-left"
              eventKey={nameSeccions[1]}
            >
              {titles[1]}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={nameSeccions[1]}>
              <FormSuscription
                third={third}
                propertyData={propertyData}
                select={select}
                handleAsingProperty={handleAsingProperty}
                handleAsingSuscription={handleAsingSuscription}
              />
            </Accordion.Collapse>
            {/*seccion 2 nuevo componente */}
            {currentSuscription && (
              <>
                <Accordion.Toggle
                  as={Card.Header}
                  className="w-100 btn text-left"
                  eventKey={nameSeccions[2]}
                >
                  {titles[2] +
                    " - suscripción seleccionada " +
                    currentSuscription?.dsusIderegistr}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={nameSeccions[2]}>
                  <FormHomologation
                    currentSuscription={currentSuscription}
                    isActive={nameSeccions[2] === select}
                  />
                </Accordion.Collapse>
              </>
            )}
          </Accordion>
        </div>
      </div>
    </>
  );
}
