import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
//import actions redux
import { loadBuscarTerceros } from "../../../../../actions/suscripcionTercero";
//import interfaces
import {
  formDataSearchInterface,
  dataResultSearchInterface,
} from "../../interfaces";
//import const inner
import { initialFormDataSearch } from "../../initialsValues";
//import components
import FormSearchThird from "./FormSearhThird";
import TableResultSearch from "./TableResultSearch";
import FormInformationThird from "./FormInformationThird";
import PaginationTable from "./PaginationTable";
//methods generales
import { validNumberNotSimbol } from "../../methods";
//import interfaces
import { formDataThird } from "../../interfaces";
//interfaces
type PropsType = {
  resultTercero: any;
  tipos_indentificacion: any[];
  buscarTerceros: (data: { pag: number; body: any }) => void;
  handleAsingIdThird: (data: null | string | number) => void;
  handleAsingProperty: (data: any) => void;
  handleChangeSeccion: (data: string) => void;
};
export const InformacionBasica = (props: PropsType) => {
  //props
  const {
    resultTercero,
    tipos_indentificacion,
    buscarTerceros,
    handleAsingIdThird,
    handleAsingProperty,
    handleChangeSeccion,
  } = props;
  //const
  const namesTabs: string[] = ["search", "create"];
  const titles: string[] = ["Buscar Tercero", "Nuevo Tercero"];

  //states
  const [nameTab, setNameTab] = useState<string>(namesTabs[1]);
  const [formData, setFormData] = useState<formDataSearchInterface>(
    initialFormDataSearch
  );
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [dataResult, setDataResult] = useState<
    dataResultSearchInterface[] | []
  >([]);

  const [numPage, setNumPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seletThird, setSeletThird] = useState<formDataThird | null>(null);
  const [isClear, setIsClear] = useState<boolean>(false);
  //methods
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "nameThird") {
      setFormData({ ...formData, [name]: value });
    } else {
      if (validNumberNotSimbol(value))
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleChangeFormCreate = (formDataT: formDataThird) => {
    const tempName = `${formDataT.terNombre} ${formDataT.terApellido}`;
    setFormData({
      ...formData,
      nameThird: tempName === " " ? "" : tempName,
      docThird: formDataT.terDocumento,
    });
  };
  const handleSubmitSearch = () => {
    setNumPage(0);

    setDataResult([]);
    setIsShowResult(true);

    buscarTerceros({
      pag: 0,
      body: {
        tipodoc: null,
        numdoc: formData.docThird === "" ? null : formData.docThird,
        nombre: formData.nameThird === "" ? null : formData.nameThird.trim(),
        suscripcion:
          formData.idSuscription === "" ? null : formData.idSuscription,
        codigoanterior: formData.code === "" ? null : formData.code,
      },
    });
  };
  const handleSubmitNameSearch = () => {
    setNumPage(0);
    setFormData((prev) => ({
      ...prev,
      docThird: "",
      idSuscription: "",
      code: "",
    }));
    setDataResult([]);
    setIsShowResult(true);

    buscarTerceros({
      pag: 0,
      body: {
        tipodoc: null,
        numdoc: null,
        nombre: formData.nameThird === "" ? null : formData.nameThird.trim(),
        suscripcion: null,
        codigoanterior: null,
      },
    });
  };
  const handleSelectThird = (third: any) => {
    console.log(third);
    setSeletThird(third);

    handleAsingIdThird(`${third.terIderegistro}`);
    setNameTab(namesTabs[1]);
  };
  const handleChangeTab = (key: string | null) => {
    if (key) setNameTab(key);
  };
  const handleSearchFromFormName = () => {
    setNameTab(namesTabs[0]);
    setNumPage(0);

    setDataResult([]);
    setIsShowResult(true);
    buscarTerceros({
      pag: 0,
      body: {
        tipodoc: null,
        numdoc: null,
        nombre: formData.nameThird === "" ? null : formData.nameThird.trim(),
      },
    });
  };
  const handleSearchFromFormDoc = () => {
    setNameTab(namesTabs[0]);
    setNumPage(0);

    setDataResult([]);
    setIsShowResult(true);
    buscarTerceros({
      pag: 0,
      body: {
        tipodoc: null,
        numdoc: formData.docThird === "" ? null : formData.docThird,
        nombre: null,
      },
    });
  };
  const searchNameTypeId = (id: number) =>
    tipos_indentificacion.find((item) => item.uniIderegistro === id)
      ?.uniNombre1;

  const handleClearInputs = () => {
    setFormData({ ...initialFormDataSearch });
    setIsClear(true);
  };

  const ComponentLoad = () => (
    <div className="w-100 d-flex justify-content-center">
      <Loader type="ThreeDots" color="#007bff" height="100" width="100" />
    </div>
  );

  //effects
  useEffect(() => {
    if (nameTab === namesTabs[1]) {
      setFormData(initialFormDataSearch);
      setDataResult([]);
      setIsShowResult(false);
      setSeletThird(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameTab]);
  useEffect(() => {
    if (resultTercero) {
      const { content } = resultTercero;

      if (Array.isArray(content) && content.length === 0) {
        setIsShowResult(false);
        setDataResult([]);
        setIsLoading(false);

        toast.error("No se encontraron resultados");
      }

      if (Array.isArray(content) && content.length > 0) {
        let arrResult: dataResultSearchInterface[] | [] = [];

        arrResult = content?.map((item) => ({
          typeDocument: searchNameTypeId(item?.uniTipidentifica),
          document: item?.terDocumento,
          name: item?.terNomcompleto,
        }));
        if (isLoading) {
          setIsLoading(false);
        }
        setDataResult(arrResult);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultTercero]);
  useEffect(() => {
    if (resultTercero) {
      buscarTerceros({
        pag: numPage,
        body: {
          tipodoc: null,
          numdoc: formData.docThird === "" ? null : formData.docThird,
          nombre: formData.nameThird === "" ? null : formData.nameThird,
        },
      });
      setIsLoading(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPage]);

  return (
    <Tabs activeKey={nameTab} onSelect={handleChangeTab} className="my-3">
      <Tab eventKey={namesTabs[0]} title={titles[0]}>
        <FormSearchThird
          formData={formData}
          onClear={handleClearInputs}
          handleChange={handleChange}
          search={handleSubmitSearch}
          searchName={handleSubmitNameSearch}
        />
        {isShowResult ? (
          dataResult.length > 0 ? (
            <>
              {!isLoading ? (
                <TableResultSearch
                  data={dataResult}
                  action={handleSelectThird}
                  result={resultTercero.content}
                />
              ) : (
                <ComponentLoad />
              )}

              {resultTercero && (
                <PaginationTable
                  numPage={resultTercero.totalPages}
                  first={resultTercero.first}
                  last={resultTercero.last}
                  onClick={setNumPage}
                  numPageCurrent={numPage}
                  isLoading={isLoading}
                />
              )}
            </>
          ) : (
            <ComponentLoad />
          )
        ) : null}
      </Tab>
      <Tab eventKey={namesTabs[1]} title={titles[1]}>
        <FormInformationThird
          search={handleSearchFromFormName}
          searchDoc={handleSearchFromFormDoc}
          handleChangeFormCreate={handleChangeFormCreate}
          seletThird={seletThird}
          handleAsingIdThird={handleAsingIdThird}
          handleAsingProperty={handleAsingProperty}
          handleChangeSeccion={handleChangeSeccion}
          onClearGeneric={() => setIsClear((p) => !p)}
          isClear={isClear}
        />
      </Tab>
    </Tabs>
  );
};
const mapStateToProps = (state) => ({
  resultTercero: state.suscripcionTerceroReducer.resultSearch,
  tipos_indentificacion: state.suscripcionReducer.tipos_indentificacion,
});

const mapDispatchToProps = (dispatch) => ({
  buscarTerceros: (data) => dispatch(loadBuscarTerceros(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InformacionBasica);
