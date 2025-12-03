class Headers {

  static auth() {
    const token = localStorage.getItem('jdzlToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
    // 'X-Frame-Options': `ALLOW FROM ${process.env.componente_oia}`

  }

}

export default Headers