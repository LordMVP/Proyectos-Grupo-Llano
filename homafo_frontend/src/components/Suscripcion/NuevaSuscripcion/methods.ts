import {
  formDataThird,
  formDataThirdDef,
  formDataProperty,
  formDataPropertyDef,
  formDataPropertyResultSearch,
  formDataSuscriptionInterface,
  formDataHomologacionInterface,
  formDataHomologacionOldInterface,
} from "./interfaces";
import {
  initialDataFormThirdDef,
  initialDataFormThird,
  initialFormDataPropertyDef,
  initialFormDataProperty,
  initialDataFormSuscriptionFuc,
  initialDataHomologacionFuc,
  initialDataHomologacionOldFuc,
} from "./initialsValues";
import { toast } from "react-toastify";
import moment from "moment";
// metodo que valida que el string ingresado sea un numero sin ningun simbolo
export function validNumberNotSimbol(number: string): boolean {
  if (number.length === 0) return true;
  const regex = /^[0-9]+$/;
  if (regex.test(number)) return true;
  return false;
}
// metodo que valida que el string ingresado sea un numero con con el tamaño de un numero celular
export function isNumberCellPhone(number: string): boolean {
  if (number.length === 0) return true;
  if (!validNumberNotSimbol(number)) return false;
  if (number.length === 10) return true;
  return false;
}
//metodo que valide que le string ingresado sea un correo electronico
export function isEmail(email: string): boolean {
  if (email === "") return false;
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email)) return true;
  return false;
}

export function reOrderTablePages<T>(data: T[], numPages: number): T[][] {
  let infoData: T[][] = [];
  let arrayTemp: T[] = [];

  let num = 0;
  /**
   * Este for lo que hace es dividir el array en un array bidimenciona
   * la primera dimencion se vuelve la pagina
   * y la segunda un dato en concreto
   * ejemplo => var arrayBi = [[1,2,3] , [4,5,6]]
   * console.log(arrayBi[0]) => [1,2,3]
   * console.log(arrayBi[0][0]) => 1
   */
  for (let i = 0; i < data.length; i++) {
    arrayTemp.push(data[i]);
    if ((i + 1) % numPages === 0 && data.length > numPages) {
      if (arrayTemp.length !== 0) {
        infoData[num] = arrayTemp;
        arrayTemp = [];
        num++;
      }
    }
    if (i + 1 === data.length && data.length < numPages + 1) {
      if (arrayTemp.length !== 0) {
        infoData[num] = arrayTemp;
        arrayTemp = [];
        num++;
      }
    }
    if ((i + 1) % numPages !== 0 && i === data.length - 1) {
      if (arrayTemp.length !== 0) {
        infoData[num] = arrayTemp;
        arrayTemp = [];
        num++;
      }
    }
  }
  return infoData;
}

// metodo que valide los datos para crear un tercero enten correctos
export function isValidForm(
  form: formDataThird,
  classification: number[],
  emails: string[],
  numPhones: { type: string; number: string }[]
): {
  valid: boolean;
  form: formDataThirdDef;
} {
  let cloneForm: formDataThirdDef = { ...initialDataFormThirdDef };
  let valid = true;
  if (form.terIderegistro) {
    cloneForm.terIderegistro = null;
  }
  if (form.terDocumento !== "") {
    cloneForm.terDocumento = form.terDocumento;
  } else {
    toast.error("El campo Documento es obligatorio");
    valid = false;
  }
  if (form.terDigverificacion && form.terDigverificacion !== "") {
    cloneForm.terDigverificacion = form.terDigverificacion;
  }
  if (form.terNombre !== "") {
    cloneForm.terNombre = form.terNombre;
  } else {
    toast.error("El campo Nombre es obligatorio");
    valid = false;
  }
  if (form.terApellido !== "") {
    cloneForm.terApellido = form.terApellido;
  } else {
    toast.error("El campo Apellido es obligatorio");
    valid = false;
  }
  if (form.terSexo !== "") {
    cloneForm.terSexo = form.terSexo;
  } else {
    toast.error("El campo Sexo es obligatorio");
    valid = false;
  }
  if (form.uniTiptercero !== null) {
    cloneForm.uniTiptercero = form.uniTiptercero;
  } else {
    toast.error("El campo Naturaleza es obligatorio");
    valid = false;
  }
  if (form.ciudadCod !== "") {
    cloneForm.ciudadCod = form.ciudadCod;
  } else {
    toast.error("El campo Ciudad es obligatorio");
    valid = false;
  }
  if (form.terDocexpedicion !== "") {
    cloneForm.terDocexpedicion = form.terDocexpedicion;
  } else {
    // toast.error("El campo Fecha de expedición es obligatorio");
    //  valid = false;
  }
  if (form.uniTipidentifica !== null) {
    cloneForm.uniTipidentifica = form.uniTipidentifica;
  } else {
    toast.error("El campo Tipo de identificación es obligatorio");
    valid = false;
  }
  if (form.terFecnacimiento !== null) {
    cloneForm.terFecnacimiento = form.terFecnacimiento;
  } else {
    toast.error("El campo Fecha de nacimiento es obligatorio");
    valid = false;
  }
  if (form.terInfoadicional) {
    cloneForm.terInfoadicional = form.terInfoadicional;
  }
  if (classification && classification.length > 0) {
    cloneForm.claterceros = classification.map((it) => ({
      uniClatercero: Number(it),
    }));
  }
  /* else {
    toast.error("El campo Clasificación es obligatorio");
    valid = false;
  }*/

  if (emails && emails.length > 0) {
    cloneForm.contactosTercero = emails.map((it) => ({
      uniUnidadId: 6660, 
      contValor: it,
    }));
  } else {
    //toast.error("El campo Email es obligatorio");
    //valid = false;
  }
  if (numPhones && numPhones.length > 0) {
    let tempContactosTercero: { uniUnidadId: number; contValor: string }[] =
      numPhones.map((it) => ({
        uniUnidadId: Number(it.type),
        contValor: it.number,
      }));
    cloneForm.contactosTercero = [
      ...cloneForm.contactosTercero,
      ...tempContactosTercero,
    ];
  } else {
    // toast.error("El campo Teléfono es obligatorio");
    // valid = false;
  }
  return {
    valid,
    form: cloneForm,
  };
}
// metodo que reordena los datos para editar un tercero
export function reorderForm(
  form: any,
  units: any[]
): {
  cloneForm: formDataThird;
  classification: number[];
  emails: string[];
  numPhones: { type: string; number: string }[];
} {
  const result: {
    cloneForm: formDataThird;
    classification: number[];
    emails: string[];
    numPhones: { type: string; number: string }[];
  } = {
    cloneForm: { ...initialDataFormThird },
    classification: [],
    emails: [],
    numPhones: [],
  };

  const idEmail = units?.filter(
    (it) => it.nombre === "Correo electronico Contacto"
  )[0]?.id;

  if (form.terIderegistro) {
    result.cloneForm.terIderegistro = form.terIderegistro;
  }
  if (form.terDigverificacion && form.terDigverificacion !== "") {
    result.cloneForm.terDigverificacion = form.terDigverificacion;
  }
  if (form.terDocumento !== "") {
    result.cloneForm.terDocumento = form.terDocumento;
  }
  if (form.terDigverificacion && form.terDigverificacion !== "") {
    result.cloneForm.terDigverificacion = form.terDigverificacion;
  }
  if (form.terNombre !== "") {
    result.cloneForm.terNombre = form.terNombre;
  }
  if (form.terApellido !== "") {
    result.cloneForm.terApellido = form.terApellido;
  }
  if (form.terSexo !== "") {
    result.cloneForm.terSexo = form.terSexo;
  }
  if (form.uniTiptercero !== null) {
    result.cloneForm.uniTiptercero = form.uniTiptercero;
  }
  if (form.ciudadCod !== "") {
    result.cloneForm.ciudadCod = form.ciudadCod;
  }
  if (form.ciudadNombre !== "") {
    result.cloneForm.ciudadNombre = form.ciudadNombre;
  }
  if (form.terDocexpedicion !== "") {
    result.cloneForm.terDocexpedicion = form.terDocexpedicion;
  }
  if (form.uniTipidentifica !== null) {
    result.cloneForm.uniTipidentifica = form.uniTipidentifica;
  }
  if (form.terFecnacimiento !== null) {
    result.cloneForm.terFecnacimiento = form.terFecnacimiento;
  }
  if (form.terInfoadicional) {
    result.cloneForm.terInfoadicional = form.terInfoadicional;
  }

  if (form.claterceros && form.claterceros.length > 0) {
    result.classification = form.claterceros.map((it) =>
      Number(it.uniClatercero)
    );
  }
  if (form.contactosTercero && form.contactosTercero.length > 0) {
    result.emails = form.contactosTercero
      .filter((it: any) => Number(it.uniUnidadId) === Number(idEmail))
      .map((it: any) => it.contValor);
  }

  if (form.contactosTercero && form.contactosTercero.length > 0) {
    result.numPhones = form.contactosTercero
      .filter((it: any) => Number(it.uniUnidadId) !== Number(idEmail))
      .map((it: any) => ({
        type: it.uniUnidadId.toString(),
        number: it.contValor,
      }));
  }

  return result;
}

export function isValidFormProperty(
  formThird: formDataThird,
  formProperty: formDataProperty,
  clasification: {
    uniIderegistro: string;
    uniNombre1: string;
  }[]
): {
  // clasification: any[]
  valid: boolean;
  cloneForm: formDataPropertyDef;
} {
  let listMjs: string[] = [
    "Se debe crear o usar un tercero para la creación de la propiedad", //0
    "Seleccione un municipio", //1
    "Seleccione un barrio", //2
    "El campo Dirección es obligatorio", //3
    "El numero catastral es obligatorio", //4
    "El numero catastral tiene que tener 15 caracteres", //5
    "El numero catastral nacional es obligatorio", //6
    "El numero catastral nacional tiene que tener 30 caracteres", //7
    "La unidad de indicación es obligatoria", //8
    "La unidad de indicación tiene que estar en el rango de 0 a 9", //9
    "La ubicación es obligatoria", //10
    "tipo de propiedad es obligatorio", //11
    "El sector no es valido por favor valide la dirección en el mapa", //12
    "La session no es valida por favor valide la dirección en el mapa", //13
    "La manzana no es valida por favor valide la dirección en el mapa", //14
    "La latitud no es valiada por favor valide la dirección en el mapa", //15
    "La longitud no es valida por favor valide la dirección en el mapa", //16
    "Por favor ingrese una o mas clasificaciónes para la propiedad / vivienda", //17
    "Por favor ingrese una matricula inmobiliaria", //18
    "Defina el nivel de riesgo a la seguridad de la propiedad", //19
  ];

  let valid: boolean = true;
  const cloneInitValues: formDataPropertyDef = {
    ...initialFormDataPropertyDef,
  };

  if (formThird.terIderegistro !== null) {
    cloneInitValues.terIderegistro = Number(formThird.terIderegistro);
  } else {
    valid = false;
    toast.error(listMjs[0]);
  }

  if (formProperty.uniMunicipio !== 0) {
    cloneInitValues.uniMunicipio = Number(formProperty.uniMunicipio);
  } else {
    valid = false;
    toast.error(listMjs[1]);
  }
  if (formProperty.uniBarrio !== 0) {
    cloneInitValues.uniBarrio = Number(formProperty.uniBarrio);
  } else {
    valid = false;
    toast.error(listMjs[2]);
  }
  if (formProperty.uniCmpdireccion !== 0) {
    cloneInitValues.uniCmpdireccion = Number(formProperty.uniCmpdireccion);
  }

  if (formProperty.proDireccion !== "") {
    cloneInitValues.proDireccion = formProperty.proDireccion;
  } else {
    valid = false;
    toast.error(listMjs[3]);
  }

  if (formProperty.proDireccion !== "") {
    cloneInitValues.proDireccion = formProperty.proDireccion;
  } else {
    valid = false;
    toast.error(listMjs[3]);
  }

  if (formProperty.proNumcatastral === "") {
    //  valid = false;
    //  toast.error(listMjs[4]);
  } else if (
    formProperty.proNumcatastral !== "" &&
    `${formProperty.proNumcatastral}`.length !== 15
  ) {
    valid = false;
    toast.error(listMjs[5]);
  } else if (
    formProperty.proNumcatastral !== "" &&
    `${formProperty.proNumcatastral}`.length === 15
  ) {
    cloneInitValues.proNumcatastral = `${formProperty.proNumcatastral}`;
  }

  if (formProperty.proNumcatastralnacional === "") {
    //  valid = false;
    //  toast.error(listMjs[6]);
  } else if (
    formProperty.proNumcatastralnacional !== "" &&
    `${formProperty.proNumcatastralnacional}`.length !== 30
  ) {
    // valid = false;
    //  toast.error(listMjs[7]);
    cloneInitValues.proNumcatastralnacional = `${formProperty.proNumcatastralnacional}`;
  } else if (
    formProperty.proNumcatastralnacional !== "" &&
    `${formProperty.proNumcatastralnacional}`.length === 30
  ) {
    cloneInitValues.proNumcatastralnacional = `${formProperty.proNumcatastralnacional}`;
  }

  if (formProperty.proDigitos === "") {
    valid = false;
    toast.error(listMjs[8]);
  } else if (formProperty.proDigitos < 0 && formProperty.proDigitos > 9) {
    valid = false;
    toast.error(listMjs[9]);
  } else if (
    formProperty.proDigitos !== "" &&
    formProperty.proDigitos >= 0 &&
    formProperty.proDigitos <= 9
  ) {
    cloneInitValues.proDigitos = Number(formProperty.proDigitos);
  }

  if (formProperty.proZona !== "") {
    cloneInitValues.proZona = formProperty.proZona;
  } else {
    valid = false;
    toast.error(listMjs[10]);
  }
  if (formProperty.uniTippropieda !== 0) {
    cloneInitValues.uniTippropieda = formProperty.uniTippropieda;
  } else {
    valid = false;
    toast.error(listMjs[11]);
  }
  if (formProperty.mubaSector !== 0) {
    cloneInitValues.mubaSector = formProperty.mubaSector;
  } else {
    //  valid = false;
    toast.warn(listMjs[12]);
  }

  if (formProperty.proSeccion !== 0) {
    cloneInitValues.proSeccion = formProperty.proSeccion;
  } else {
    //  valid = false;
    toast.warn(listMjs[13]);
  }

  if (formProperty.proManzana !== 0) {
    cloneInitValues.proManzana = formProperty.proManzana;
  } else {
    //  valid = false;
    toast.warn(listMjs[14]);
  }
  if (formProperty.proGpsaltitud !== "") {
    cloneInitValues.proGpsaltitud = formProperty.proGpsaltitud;
  }

  if (formProperty.proGpslatitud !== "") {
    cloneInitValues.proGpslatitud = `${formProperty.proGpslatitud}`;
  } else {
    valid = false;
    toast.error(listMjs[15]);
  }
  if (formProperty.proGpslongitud !== "") {
    cloneInitValues.proGpslongitud = `${formProperty.proGpslongitud}`;
  } else {
    valid = false;
    toast.error(listMjs[16]);
  }

  if (clasification.length > 0) {
    cloneInitValues.clasificacionViviendaDTOS = clasification;
  } else {
    // valid = false;
    //  toast.error(listMjs[17]);
  }
  if (formProperty.proNummatriculainmobiliaria !== "") {
    cloneInitValues.proNummatriculainmobiliaria =
      formProperty.proNummatriculainmobiliaria;
  } else {
    //  valid = false;
    //  toast.error(listMjs[18]);
  }

  if (formProperty.proAltriesgo !== "") {
    cloneInitValues.proAltriesgo = formProperty.proAltriesgo;
  } else {
    valid = false;
    toast.error(listMjs[19]);
  }

  return {
    valid,
    cloneForm: cloneInitValues,
  };
}

export function reorderProperty(dataProperty: formDataPropertyResultSearch): {
  formProperty: formDataProperty;
  clasification: string[];
} {
  let listClassification: string[] = [];
  let cloneDataProperty: formDataProperty = { ...initialFormDataProperty };
  for (const key in cloneDataProperty) {
    if (dataProperty[key] !== cloneDataProperty[key]) {
      cloneDataProperty[key] = dataProperty[key];
    }
  }
  if (Array.isArray(dataProperty.uniClasificacionvivienda)) {
    dataProperty.uniClasificacionvivienda.forEach((item) => {
      if (item.uni_ideregistro && typeof item.uni_ideregistro === "string") {
        listClassification.push(item.uni_ideregistro);
      }
    });
  }
  return {
    formProperty: cloneDataProperty,
    clasification: listClassification,
  };
}
export function reorderPropertyClone(
  dataProperty: formDataPropertyResultSearch,
  isFather: boolean
): formDataPropertyDef {
  let cloneDataProperty: formDataPropertyDef = {
    ...initialFormDataPropertyDef,
  };
  for (const key in cloneDataProperty) {
    if (dataProperty[key] !== cloneDataProperty[key]) {
      cloneDataProperty[key] = dataProperty[key];
    }
  }
  if (Array.isArray(dataProperty.uniClasificacionvivienda)) {
    cloneDataProperty.clasificacionViviendaDTOS =
      dataProperty.uniClasificacionvivienda.map((item) => ({
        uniIderegistro: item.uni_ideregistro,
        uniNombre1: item.uni_nombre1,
      }));
  }
  if (isFather)
    cloneDataProperty.proIdpadre = Number(dataProperty.proIderegistro);

  return cloneDataProperty;
}

export function isValidFormSuscripcion(
  fromRaw: formDataSuscriptionInterface,
  listConcepts: any[]
): {
  valid: boolean;
  form: formDataSuscriptionInterface;
} {
  let isValid = true;
  let cloneForm: formDataSuscriptionInterface = {
    ...initialDataFormSuscriptionFuc(),
  };
  const listMsj: string[] = [
    "No ha seleccionado un tercero", // 0
    "No ha seleccionado una propiedad", // 1
    "No se ha asignado una actividad Comercial", // 2
    "No ha seleccionado un tipo de suscripcion", //3
    "No ha seleccionado un ciclo", //4
    "No ha seleccionado un tipo de uso de la suscripcion", //5
    "No ha seleccionado una liquidacion", //6
    "No ha seleccionado un estrato", //7
    "No ha seleccionado un estado", // 8
    "No ha asignado el factor", // 9
    "No se ha asignado una empresa", // 10
    "Ingrese una referencia comercial", // 11
    "No ha seleccionado una microruta", // 12
    "No ha seleccionado una macroruta", // 13
    "No ha seleccionado una ruta", // 14
    "No ha seleccionado un ruta en aprovechamiento", //15
  ];

  if (fromRaw.dsusIderegistr) {
    cloneForm.dsusIderegistr = fromRaw.dsusIderegistr;
  }
  if (fromRaw.susIderegistro) {
    cloneForm.susIderegistro = fromRaw.susIderegistro;
  }

  if (fromRaw.terIderegistro !== 0) {
    cloneForm.terIderegistro = fromRaw.terIderegistro;
  } else {
    isValid = false;
    toast.error(listMsj[0]);
  }

  if (fromRaw.proIderegistro !== 0) {
    cloneForm.proIderegistro = fromRaw.proIderegistro;
  } else {
    isValid = false;
    toast.error(listMsj[1]);
  }

  if (fromRaw.uniTipsuscripc !== 0) {
    cloneForm.uniTipsuscripc = fromRaw.uniTipsuscripc;
  }
  if (fromRaw.uniActsuscripc !== 0) {
    cloneForm.uniActsuscripc = fromRaw.uniActsuscripc;
  } else {
    isValid = false;
    toast.error(listMsj[3]);
  }
  if (fromRaw.cicIderegistro !== 0) {
    cloneForm.cicIderegistro = fromRaw.cicIderegistro;
  } else {
    isValid = false;
    toast.error(listMsj[4]);
  }
  if (fromRaw.uniTipusosuscr !== 0) {
    cloneForm.uniTipusosuscr = fromRaw.uniTipusosuscr;
  } else {
    isValid = false;
    toast.error(listMsj[5]);
  }
  if (fromRaw.uniLiquidacion !== 0) {
    cloneForm.uniLiquidacion = fromRaw.uniLiquidacion;
  } else {
    isValid = false;
    toast.error(listMsj[6]);
  }
  if (fromRaw.proCatestrato !== 0) {
    cloneForm.proCatestrato = fromRaw.proCatestrato;
  } else {
    isValid = false;
    toast.error(listMsj[7]);
  }

  if (fromRaw.dsusEstado !== "") {
    cloneForm.dsusEstado = fromRaw.dsusEstado;
  } else {
    isValid = false;
    toast.error(listMsj[8]);
  }
  if (fromRaw.dsusFecinicio !== "") {
    cloneForm.dsusFecinicio = moment(fromRaw.dsusFecinicio).format(
      "YYYY-MM-DD"
    );
  }
  if (fromRaw.dsusDescripcion !== "") {
    cloneForm.dsusDescripcion = fromRaw.dsusDescripcion;
  }

  if (fromRaw.dsusIniestado !== "") {
    cloneForm.dsusIniestado = moment(fromRaw.dsusIniestado).format(
      "YYYY-MM-DD"
    );
  }

  if (fromRaw.dsusFinestado !== "") {
    cloneForm.dsusFinestado = moment(fromRaw.dsusFinestado).format(
      "YYYY-MM-DD"
    );
  }

  if (fromRaw.dsusFactor !== 0) {
    cloneForm.dsusFactor = fromRaw.dsusFactor;
  }

  if (fromRaw.inforadicionalsuscripcionDTO.iasusIderegistro !== null) {
    cloneForm.inforadicionalsuscripcionDTO.iasusIderegistro =
      fromRaw.inforadicionalsuscripcionDTO.iasusIderegistro;
  }

  if (fromRaw.inforadicionalsuscripcionDTO.iasusReferenciacomercial !== "") {
    cloneForm.inforadicionalsuscripcionDTO.iasusReferenciacomercial =
      fromRaw.inforadicionalsuscripcionDTO.iasusReferenciacomercial;
  } else {
    // isValid = false;
    //  toast.error(listMsj[11]);
  }

  if (fromRaw.recoleccionBarridoDTO.rrbaIdRegistro !== null) {
    cloneForm.recoleccionBarridoDTO.rrbaIdRegistro =
      fromRaw.recoleccionBarridoDTO.rrbaIdRegistro;
  }
  if (fromRaw.recoleccionBarridoDTO.rrbaIdRegistroBar !== null) {
    cloneForm.recoleccionBarridoDTO.rrbaIdRegistroBar =
      fromRaw.recoleccionBarridoDTO.rrbaIdRegistroBar;
  }
  if (fromRaw.recoleccionBarridoDTO.rutIderegistro !== 0) {
    cloneForm.recoleccionBarridoDTO.rutIderegistro =
      fromRaw.recoleccionBarridoDTO.rutIderegistro;
  } else {
    isValid = false;
    toast.error(listMsj[12]);
  }

  if (fromRaw.recoleccionBarridoDTO.rutIdMacroRuta !== 0) {
    cloneForm.recoleccionBarridoDTO.rutIdMacroRuta =
      fromRaw.recoleccionBarridoDTO.rutIdMacroRuta;
  } else {
    isValid = false;
    toast.error(listMsj[13]);
  }

  if (fromRaw.recoleccionBarridoDTO.rutIderegistroBar !== 0) {
    cloneForm.recoleccionBarridoDTO.rutIderegistroBar =
      fromRaw.recoleccionBarridoDTO.rutIderegistroBar;
  } else {
    isValid = false;
    toast.error(listMsj[14]);
  }
  if (fromRaw.rutaAprovechamientoDTO.rutaPrIdRegistro !== null) {
    cloneForm.rutaAprovechamientoDTO.rutaPrIdRegistro =
      fromRaw.rutaAprovechamientoDTO.rutaPrIdRegistro;
  }
  // Validación de aprovechamiento: si se selecciona incentivo, aforado, ruta o asociación, todos son obligatorios
  const tieneIncentivo = fromRaw.rutaAprovechamientoDTO.incentivo;
  const tieneAforado = fromRaw.rutaAprovechamientoDTO.aforado;
  const tieneRuta = fromRaw.rutaAprovechamientoDTO.rutIderegistro && fromRaw.rutaAprovechamientoDTO.rutIderegistro !== 0;
  const tieneAsociacion = fromRaw.rutaAprovechamientoDTO.terAprovechamiento && fromRaw.rutaAprovechamientoDTO.terAprovechamiento !== 0;

  if (tieneIncentivo || tieneAforado || tieneRuta || tieneAsociacion) {
    // Si se marcó alguno, validar que estén ambos (ruta y asociación)
    if (!tieneRuta) {
      isValid = false;
      toast.error("Debe seleccionar una Ruta de Aprovechamiento");
    } else {
      cloneForm.rutaAprovechamientoDTO.rutIderegistro =
        fromRaw.rutaAprovechamientoDTO.rutIderegistro;
    }

    if (!tieneAsociacion) {
      isValid = false;
      toast.error("Debe seleccionar una Empresa de Aprovechamiento");
    } else {
      cloneForm.rutaAprovechamientoDTO.terAprovechamiento =
        fromRaw.rutaAprovechamientoDTO.terAprovechamiento;
    }
  } else {
    // Si no se seleccionó nada, permitir valores null
    cloneForm.rutaAprovechamientoDTO.rutIderegistro = null;
    cloneForm.rutaAprovechamientoDTO.terAprovechamiento = null;
  }

  cloneForm.rutaAprovechamientoDTO.aforado =
    fromRaw.rutaAprovechamientoDTO.aforado;
  cloneForm.rutaAprovechamientoDTO.incentivo =
    fromRaw.rutaAprovechamientoDTO.incentivo;

  if (fromRaw.rutaAprovechamientoDTO.terIderegistro !== 0) {
    cloneForm.rutaAprovechamientoDTO.terIderegistro =
      fromRaw.rutaAprovechamientoDTO.terIderegistro;
  }
  if (listConcepts && Array.isArray(listConcepts)) {
    cloneForm.conceptos = listConcepts.map((it) => ({
      cosuIdregistr: it.cosuIdregistr || null,
      uniConcepto: Number(it.uniConcepto),
      fecInicio: moment(it.fecInicio).format("YYYY-MM-DD"),
      fecFinal: moment(it.fecFinal).format("YYYY-MM-DD"),
    }));
  }

  return { valid: isValid, form: cloneForm };
}

export function reorderFormSuscripcion(
  data: any,
  arrayStratos: any[],
  setListStratos: (list: any[]) => void
): {
  formRaw: formDataSuscriptionInterface;
  listConcepts: any[];
} {
  const cloneForm: formDataSuscriptionInterface = {
    ...initialDataFormSuscriptionFuc(),
  };
  console.log(data);

  let concepts: any[] = [];

  if (data.dsusIderegistr) {
    cloneForm.dsusIderegistr = data.dsusIderegistr;
  }
  if (data.uniTipusosuscr) {
    cloneForm.uniTipusosuscr = data.uniTipusosuscr;
    const newArraList = filtarEstratos(
      arrayStratos,
      Number(data.uniTipusosuscr)
    );
    setListStratos([...newArraList]);
  }
  if (data.proCatestrato) {
    cloneForm.proCatestrato = data.proCatestrato;
  }
  if (data.dsusIderegistr) {
    cloneForm.dsusIderegistr = data.dsusIderegistr;
  }
  if (data?.susSuscripcion?.susIderegistro) {
    cloneForm.susIderegistro = data?.susSuscripcion?.susIderegistro;
  }
  if (data?.perIderegistro) {
    cloneForm.perIderegistro = data?.perIderegistro;
  }
  if (data?.empIderegistro) {
    cloneForm.empIderegistro = data?.empIderegistro;
  }
  if (data?.terIderegistro?.terIderegistro) {
    cloneForm.terIderegistro = data?.terIderegistro?.terIderegistro;
  }
  if (data?.proIderegistro) {
    cloneForm.proIderegistro = data?.proIderegistro;
  }
  if (data?.dsusPcodigo) {
    cloneForm.dsusPcodigo = data?.dsusPcodigo;
  }
  if (data?.uniTipsuscripc) {
    cloneForm.uniTipsuscripc = data?.uniTipsuscripc;
  }

  if (data?.uniActsuscripc) {
    cloneForm.uniActsuscripc = data?.uniActsuscripc;
  }

  if (data?.uniActsuscripc) {
    cloneForm.uniActsuscripc = data?.uniActsuscripc;
  }
  if (data?.cicIderegistro) {
    cloneForm.cicIderegistro = data?.cicIderegistro;
  }

  if (data?.cicIderegistro) {
    cloneForm.cicIderegistro = data?.cicIderegistro;
  }

  if (data?.uniLiquidacion) {
    cloneForm.uniLiquidacion = data?.uniLiquidacion;
  }

  if (data?.proCatestrato) {
    cloneForm.proCatestrato = data?.proCatestrato;
  }

  if (data?.dsusEstado) {
    cloneForm.dsusEstado = data?.dsusEstado;
  }

  if (data?.dsusFecinicio) {
    cloneForm.dsusFecinicio = `${new Date(Number(data.dsusFecinicio))}`;
  }
  if (data?.dsusDescripcion) {
    cloneForm.dsusDescripcion = data?.dsusDescripcion;
  }
  if (data?.dsusIniestado) {
    cloneForm.dsusIniestado = `${new Date(Number(data.dsusIniestado))}`;
  }

  if (data?.dsusFinestado) {
    cloneForm.dsusFinestado = `${new Date(Number(data.dsusFinestado))}`;
  }

  if (data?.dsusFactor) {
    cloneForm.dsusFactor = data?.dsusFactor;
  }

  if (data?.inforadicionalsuscripcion?.iasusIderegistro) {
    cloneForm.inforadicionalsuscripcionDTO.iasusIderegistro =
      data?.inforadicionalsuscripcion?.iasusIderegistro;
  }

  if (data?.inforadicionalsuscripcion?.iasusCobrojuridico) {
    cloneForm.inforadicionalsuscripcionDTO.iasusCobrojuridico =
      data?.inforadicionalsuscripcion?.iasusCobrojuridico;
  }

  if (data?.inforadicionalsuscripcion?.iasusPagapeaje) {
    cloneForm.inforadicionalsuscripcionDTO.iasusPagapeaje =
      data?.inforadicionalsuscripcion?.iasusPagapeaje;
  }

  if (data?.inforadicionalsuscripcion?.iasusReferenciacomercial) {
    cloneForm.inforadicionalsuscripcionDTO.iasusReferenciacomercial =
      data?.inforadicionalsuscripcion?.iasusReferenciacomercial;
  }

  if (data?.rutaRecoleccionBarrido?.rrbaIdRegistro) {
    cloneForm.recoleccionBarridoDTO.rrbaIdRegistro =
      data?.rutaRecoleccionBarrido?.rrbaIdRegistro;
  }

  if (data?.rutaRecoleccionBarrido?.rutIderegistro) {
    cloneForm.recoleccionBarridoDTO.rutIderegistro =
      data?.rutaRecoleccionBarrido?.rutIderegistro;
  }

  if (data?.rutaRecoleccionBarrido?.rutIdMacroRuta) {
    cloneForm.recoleccionBarridoDTO.rutIdMacroRuta =
      data?.rutaRecoleccionBarrido?.rutIdMacroRuta;
  }

  if (data?.rutaRecoleccionBarrido?.rutIderegistroBar) {
    cloneForm.recoleccionBarridoDTO.rutIderegistroBar =
      data?.rutaRecoleccionBarrido?.rutIderegistroBar;
  }

  if (data?.rutaRecoleccionBarrido?.rrbaIdRegistroBar) {
    cloneForm.recoleccionBarridoDTO.rrbaIdRegistroBar =
      data?.rutaRecoleccionBarrido?.rrbaIdRegistroBar;
  }

  if (data?.rutaRecoleccionBarrido?.rutEstadoBar) {
    cloneForm.recoleccionBarridoDTO.rutEstadoBar =
      data?.rutaRecoleccionBarrido?.rutEstadoBar;
  }
  if (data?.rutaRecoleccionBarrido?.rutEstado) {
    cloneForm.recoleccionBarridoDTO.rutEstado =
      data?.rutaRecoleccionBarrido?.rutEstado;
  }

  if (data?.rutaAprovechamiento?.rutaPrIdRegistro) {
    cloneForm.rutaAprovechamientoDTO.rutaPrIdRegistro =
      data?.rutaAprovechamiento?.rutaPrIdRegistro;
  }

  if (data?.rutaAprovechamiento?.terAprovechamiento) {
    cloneForm.rutaAprovechamientoDTO.terAprovechamiento =
      data?.rutaAprovechamiento?.terAprovechamiento;
  }

  if (data?.rutaAprovechamiento?.rutIderegistro) {
    cloneForm.rutaAprovechamientoDTO.rutIderegistro =
      data?.rutaAprovechamiento?.rutIderegistro;
  }

  if (data?.rutaAprovechamiento?.terIderegistro) {
    cloneForm.rutaAprovechamientoDTO.terIderegistro =
      data?.rutaAprovechamiento?.terIderegistro;
  }

  if (data?.rutaAprovechamiento?.incentivo) {
    cloneForm.rutaAprovechamientoDTO.incentivo =
      data?.rutaAprovechamiento?.incentivo;
  }

  if (data?.rutaAprovechamiento?.aforado) {
    cloneForm.rutaAprovechamientoDTO.aforado =
      data?.rutaAprovechamiento?.aforado;
  }
  if (data?.rutaAprovechamiento?.rutEstado) {
    cloneForm.rutaAprovechamientoDTO.rutEstado =
      data?.rutaAprovechamiento?.rutEstado;
  }
  if (data.empAlternasId && Array.isArray(data.empAlternasId)) {
    cloneForm.empAlternasId = data.empAlternasId.map((value) => Number(value));
  }
  if (data.conceptos && Array.isArray(data.conceptos)) {
    concepts = data.conceptos.map((it) => ({
      cosuIdregistr: it.cosuIdregistr,
      uniConcepto: it.uniConcepto,
      fecInicio: `${new Date(Number(it.fecInicio))}`,
      fecFinal: `${new Date(Number(it.fecFinal))}`,
    }));
  }

  return { formRaw: cloneForm, listConcepts: concepts };
}

export function validFormHomologacion(
  data: any,
  per_ideregistro: number,
  medidor: string
): formDataHomologacionInterface {
  const cloneForm: formDataHomologacionInterface = {
    ...initialDataHomologacionFuc(),
  };
  console.log(data);
  console.log(per_ideregistro);
  console.log(medidor);

  if (data.susIderegistro) {
    cloneForm.susIderegistro = data.susIderegistro;
  }
  if (per_ideregistro) {
    cloneForm.perIderegistro = per_ideregistro;
  }
  if (data.dsusIderegistr) {
    cloneForm.dsusIderegistr = data.dsusIderegistr;
  }

  if (data.cnreIderegistr) {
    cloneForm.cnreIderegistr = data.cnreIderegistr;
  }

  if (medidor) {
    cloneForm.detalles = [
      {
        dghoIderegistr: null,
        ghomIderegistr: null,
        dsusIderegistr: data.dsusIderegistr,

        dsusPcodigo: data.dsusPcodigo,
        dghoConsumo: data.consumos,
        dghoObservaciones: "",
        dghoNumeromedidor: medidor,
        susIderegistroHomologa: null,
        susIderegistroHomologados: null,
      },
    ];
  }
  return cloneForm;
}

export function validFormHomologacionOld(
  current: any,
  suscripcion: formDataSuscriptionInterface,
  idEmpresa: number
): formDataHomologacionOldInterface {
  const cloneForm: formDataHomologacionOldInterface = {
    ...initialDataHomologacionOldFuc(),
    nuevoTercero: Number(current?.terIderegistro),
    empresaHomologa: Number(suscripcion?.empIderegistro),
    periodoHomologa: Number(suscripcion?.perIderegistro),
    dsusHomologa: Number(suscripcion?.dsusIderegistr),
    dsusHomologador: Number(current?.dsusIderegistr),
    empresaHomologador: Number(idEmpresa),
    pcodigoHomologador: current.dsusPcodigo,
    suscripcion1: suscripcion.susIderegistro,
    suscripcion2: current.susIderegistro,
    consumo: JSON.stringify(current.consumos),
    medidor: current.proIdepropieda,
    deshomologacion: current.isDeshomologacion,
  };
  if (current?.convenios[0]) {
    cloneForm.nuevoConvenio = current?.convenios[0].cnre_ideregistr;
    cloneForm.nombreNuevoConvenio = current?.convenios[0].cnre_nombre;
  }

  return cloneForm;
}
export function validFormsHomologacionSearch(
  current: any,
  search: any
): boolean {
  if (
    `${search.idsus}` === `${current.dsusIderegistr}` ||
    `${search.pcodigo}` === `${current.dsusPcodigo}` ||
    `${search.medidor}` === `${current.proIderegistro}`
  )
    return true;

  return false;
}

export function filtarEstratos(
  arrayRaw: {
    code: number;
    nombre: string;
  }[],
  code: number | string
): {
  code: number;
  nombre: string;
}[] {
  let list: {
    code: number;
    nombre: string;
  }[] = [];

  const realCode = Number(code);

  if (realCode === 270) {
    arrayRaw.forEach((data: { code: number; nombre: string }) => {
      if (data.code > 0 && data.code < 7) {
        list.push({
          code: data.code,
          nombre: data.nombre,
        });
      }
    });
    return list;
  }
  if (realCode === 271) {
    arrayRaw.forEach((data: { code: number; nombre: string }) => {
      if (data.code === 8 || data.code === 9) {
        list.push({
          code: data.code,
          nombre: data.nombre,
        });
      }
    });
    return list;
  }
  if (realCode === 273 || realCode === 274) {
    arrayRaw.forEach((data: { code: number; nombre: string }) => {
      if (data.code === 7) {
        list.push({
          code: data.code,
          nombre: data.nombre,
        });
      }
    });
    return list;
  }
  return arrayRaw;
}
