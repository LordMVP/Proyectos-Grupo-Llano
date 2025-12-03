import ImportProcessResponse from "./ImportProcessResponseDTO";

interface ImportTabProps  {
    handlerComplete: (nextStep) => void,
    info?: ImportProcessResponse,
    pimpId?:number,
    data?:any

}

export default ImportTabProps;