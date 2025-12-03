export const opcionesAmbito = [
    { id: 'Proceso', texto: 'Proceso' },
    { id: 'Actividad', texto: 'Actividad' },
    { id: 'Municipio', texto: 'Municipio' },
    { id: 'Contratista', texto: 'Contratista' },
    { id: 'Unidad Responsable', texto: 'Unidad Responsable' },
    { id: 'Genérica', texto: 'Genérica' },
]

export const opcionesAmbitoValor = [
    { id: 'Valor 1', texto: 'Valor 1' },
    { id: 'Valor 2', texto: 'Valor 2' },
    { id: 'Valor 3', texto: 'Valor 3' },
]

export const opcionesUnidadTiempo = [
    { id: 'Periodo activo', texto: 'Periodo activo' },
    { id: 'Mes', texto: 'Mes' },
    { id: 'Semana', texto: 'Semana' },
    { id: 'Día', texto: 'Día' },
    { id: 'Hora', texto: 'Hora' },
]

export const opcionesTipo = [
    { id: 'Valor', texto: 'Valor' },
    { id: 'Función SQL', texto: 'Función SQL' },
    { id: 'Función PHP', texto: 'Función PHP' },
    { id: 'Fórmula', texto: 'Fórmula' },
]

export const opcionesTipoValor = [
    { id: 'TipoValor 1', texto: 'TipoValor 1' },
    { id: 'TipoValor 2', texto: 'TipoValor 2' },
    { id: 'TipoValor 3', texto: 'TipoValor 3' },
]

export const opcionesOrigenDatos = [
    { id: 'Parámetros', texto: 'Parámetros' },
    { id: 'Reglas', texto: 'Reglas' },
    { id: 'Proceso', texto: 'Proceso' },
]

export const opcionesTipoSalida = [
    { id: 'Valor Único', texto: 'Valor Único' },
    { id: 'Valor Múltiple', texto: 'Valor Múltiple' },
    { id: 'No aplica', texto: 'No aplica' },
]

export const opcionesTipoFlujo = [
    { id: 'Entrada', texto: 'Entrada' },
    { id: 'Salida', texto: 'Salida' },
]

export const opcionesTipoDato = [
    { id: 'Boolean', texto: 'Boolean' },
    { id: 'Integer', texto: 'Integer' },
    { id: 'String', texto: 'String' },
]

export const initialState = {
    codigoUnidad: '',
    descripcion: '',
    ambito: '',
    ambitoValor: '',
    unidadTiempo: '',
    tipo: '',
    tipoValor: '',
    valor: '',
    desde: '',
    hasta: '',
    origenDatos: 'Parámetros',
    tipoSalida: 'Valor Único',
    requerido: false,
    tipoFlujo: 'Entrada',
    flujoDescripcion: '',
    flujoValor: '',
    flujoReferencia: '',
    entradas: [],
    salidas: [],
    isLoading: false,
    isModalActive: false,
    editDetails: {
        type: '',
        index: '',
    },
    ambitoResults: [],
    tipoResults: [],
    isSearching: false,
    mode: 'CREATING',
    dataToEdit: {},
}
