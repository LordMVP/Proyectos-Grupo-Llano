import React from 'react'
import PropTypes from 'prop-types'

import ReCaptcha from 'react-recaptcha'

/* Es necesario importar el script de google e incorporalo en el index.html */

function Captcha (props) {
  return (
    <ReCaptcha
      size="invisible"
      ref={props.ref}
      verifyCallback={props.verificado}
      sitekey={props.key || "6Lf823MUAAAAACAv-_HLgDVsTTh4MEuYsD8rzF3v"}/>
  )
}

Captcha.propTypes = {
  ref: PropTypes.func,
  verificado: PropTypes.func,
  key: PropTypes.string
}

export default Captcha