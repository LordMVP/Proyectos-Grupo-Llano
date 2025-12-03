import _ from "lodash";
import React from "react";
import PARAMETROS from "../../data/constantes";
import EffectivePersmisions from "../../models/dto/EffectivePermission";
import PermisoProgramaDto from "../../models/dto/PermisoProgramaDto";
//import PermisoProgramaDto from '../../models/dto/PermisoProgramaDto';
export default class UtilsFunction {
  static verificarPermiso(permissions: any, permission: any) {
    const find = _.find(permissions, { codigoPermiso: permission });
    return find !== undefined;
  }

  static getEffectivePermissions(
    permissions: PermisoProgramaDto[],
    programa: string
  ) {
    const effective = _.get(PARAMETROS.PERMISOS_PROGRAMA, programa);
    //console.log("Permisos buscados:;;;;;;;",programa);
    //console.log('que permisos metodo ',permissions);
    //console.log(effective);
    const effectivePermission: EffectivePersmisions = {
      EDIT: false,
      VIEW: false,
      CREATE: false,
      SAVE: false,
      DELETE: false,
      QUERY: false,
    };
    _.mapKeys(effective, function (value, key) {
      const find = _.find(permissions, { codigoPermiso: value });
      _.set(effectivePermission, key, find !== undefined);
    });
    return effectivePermission;
  }

  static formatDate(fecha: string | Date) {
    if (fecha !== undefined) {
      const date = new Date(fecha);
      return date.toISOString().split("T")[0];
    }
    return "";
  }

  static renderOptionsList<T>(list: T[], id: string, label: string) {
    const options = list.map((item) => {
      return React.createElement(
        "option",
        { value: _.get(item, id) },
        _.get(item, label)
      );
    });
    return options;
  }
}
