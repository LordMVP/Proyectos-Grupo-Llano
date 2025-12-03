export const prepairDataSelect = (arrayList, labelString, valueString) => {
    let resultList = []
    for (let i = 0; i < arrayList.length; i++) {
        let temporal = {}
        temporal.label = arrayList[i][labelString]
        temporal.value = arrayList[i][valueString]
        resultList.push(temporal)
    }  
    return  resultList;    
}

export const prepairDataSelectState = (arrayList, labelString, valueString, stateValue) => {
    let resultList = []
    for (let i = 0; i < arrayList.length; i++) {
        let temporal = {}
        temporal.label = arrayList[i][labelString]
        temporal.value = arrayList[i][valueString]
        temporal.state = arrayList[i][stateValue]
        resultList.push(temporal)
    }  
    return  resultList;    
}

export const prepairId = (arrayList) => {
    let resultList = []
    for(let i = 0; i < arrayList.length; i++){
        resultList.push(arrayList[i].value)
    }
    return resultList;
}

export const prepairIdParam = (param) => {
    let result = param.value
    return result;
}

export const prepairStateParam = (param) => {
    let result = param.state
    return result;
}