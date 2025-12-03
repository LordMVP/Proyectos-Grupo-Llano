export const validarLista = (listaSuscripSeleccionadas) => {
  let listaReplace = [];
  listaSuscripSeleccionadas.forEach((item) => {
    item = item.replace("select-", "");
    listaReplace.push(item);
  });
  return listaReplace;
};

export const differentsValues = (arrayList, property) => {
  let lastProperty = "nothing";
  let resultList = [];
  for (let i = 0; i < arrayList.length; i++) {
    if (lastProperty === "nothing") {
      resultList.push(arrayList[i][property]);
    } else {
      if (lastProperty != arrayList[i][property]) {
        resultList.push(arrayList[i][property]);
      }
    }
    lastProperty = arrayList[i][property];
  }
  return resultList;
};
