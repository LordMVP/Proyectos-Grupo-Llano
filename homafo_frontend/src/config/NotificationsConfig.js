export const user_regisaforado_success = {
  title: 'Registro de Usuarios Aforados ',
  message: 'Se ha guardado con Exito.',
  position: 'tc',
  autoDismiss: 5,
};
export const user_regisaforado_error = {
  title: 'Registro de Usuarios Aforados ',
  message: 'Se ha producido un error al guardar.',
  position: 'tc',
  autoDismiss: 5,
};

export const createuser_error = (message = 'Error de servidor al añadir usuario') => {

  return {
    title: 'Error al añadir usuario',
    message: message,
    position: 'tc',
    autoDismiss: 5,
  }
};

export const simple_success = (message = 'Acción realizada con éxito') => {

  return {
    title: 'Éxito',
    message: message,
    position: 'tc',
    autoDismiss: 8,
  }
};

export const style = {
  NotificationItem: {
    DefaultStyle: {
      margin: '0',
      textAlign: 'center'
    },

    success: {
      color: '#676866'
    }
  }
};

export function create_error_validate_intents(numIntents) {
  return {
    title: 'Debe completar las preguntas.',
    message: `Debe completar las ${numIntents} preguntas para poder realizar la solicitud`,
    position: 'tc',
    autoDismiss: 5
  }
};
