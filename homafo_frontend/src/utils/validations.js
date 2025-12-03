

  export function isFactorValid(factor) {
    if (!factor || factor.match(/^\d{1,}(\.\d{0,4})?$/)) {
      console.log("factor true:",factor)
      return true
    }
    
    console.log("factor else:",factor)
    return false
}