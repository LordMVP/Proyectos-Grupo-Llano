

export const getMenu = () => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 1400);

    })
}

const data = [
    {
        "menu": 175, "descripcion": "Aforos", "ruta": "verifyOIA", "padre": 0, "tipo": 2, "hijos": [
            { "menu": 81, "descripcion": "Usuarios", "ruta": "aforos/usuarios", "padre": 175, "tipo": 2, "hijos": null },
            { "menu": 77, "descripcion": "Multiusuarios", "ruta": "aforos/multiusuarios", "padre": 175, "tipo": 2, "hijos": null },
            { "menu": 79, "descripcion": "Maestro", "ruta": "aforos/maestro", "padre": 175, "tipo": 2, "hijos": null },
            { "menu": 78, "descripcion": "Consulta", "ruta": "aforos/consulta", "padre": 175, "tipo": 2, "hijos": null },
            { "menu": 80, "descripcion": "Liquida", "ruta": "aforos/liquida", "padre": 175, "tipo": 2, "hijos": null }]
    },
    {
        "menu": 176, "descripcion": "Devoluciones", "ruta": "verifyOIA", "padre": 0, "tipo": 2, "hijos": [
            { "menu": 63, "descripcion": "Parametrizacion", "ruta": "devoluciones/parametrizacion", "padre": 176, "tipo": 2, "hijos": null },
            { "menu": 177, "descripcion": "Liquidar Interes", "ruta": "devoluciones/liquidarintereses", "padre": 176, "tipo": 2, "hijos": null },
            { "menu": 178, "descripcion": "Consulta", "ruta": "devoluciones/consulta", "padre": 176, "tipo": 2, "hijos": null },
            { "menu": 179, "descripcion": "Notas", "ruta": "devoluciones/notas", "padre": 176, "tipo": 2, "hijos": null },
            { "menu": 180, "descripcion": "Recalcular tipo interes", "ruta": "devoluciones/recalculartipointeres", "padre": 176, "tipo": 2, "hijos": null },
            { "menu": 181, "descripcion": "Abonos", "ruta": "devoluciones/abonos", "padre": 176, "tipo": 2, "hijos": null },
            { "menu": 182, "descripcion": "Directas ", "ruta": "devoluciones/directas", "padre": 176, "tipo": 2, "hijos": null },
        ]
    },
    {
        "menu": 177, "descripcion": "Aprovechamiento", "ruta": "verifyOIA", "padre": 0, "tipo": 2, "hijos": [
            { "menu": 187, "descripcion": "Liquidacion", "ruta": "aprovechamiento/liquidacion", "padre": 177, "tipo": 2, "hijos": null },
            { "menu": 188, "descripcion": "Parametrizacion", "ruta": "aprovechamiento/parametrizacion", "padre": 177, "tipo": 2, "hijos": null }
        ]

    },
    // {
    //     "menu": 178, "descripcion": "Level 1 Menu", "ruta": "verifyOIA", "padre": 0, "tipo": 2, "hijos": [
    //         { "menu": 177, "descripcion": "Level 2 Menu 1", "ruta": "devoluciones/parametrizacion", "padre": 178, "tipo": 2, "hijos": null },
    //         { "menu": 178, "descripcion": "Level 2 Menu 2", "ruta": "devoluciones/consulta", "padre": 178, "tipo": 2, "hijos": null },
    //         { "menu": 179, "descripcion": "Level 2 Menu 3", "ruta": "devoluciones/notas", "padre": 178, "tipo": 2, "hijos": null },

    //         {
    //             "menu": 183, "descripcion": "Level 2 Menu ", "ruta": "devoluciones/directas", "padre": 178, "tipo": 2, "hijos":
    //                 [
    //                     { "menu": 198, "descripcion": "Level 3 Menu 1", "ruta": "contratosOIA", "padre": 183, "tipo": 2, "hijos": null },
    //                     {
    //                         "menu": 297, "descripcion": "Level 3 Menu 2", "ruta": "consulta", "padre": 183, "tipo": 2, "hijos": [
    //                             { "menu": 178, "descripcion": "Level 4 Menu 1", "ruta": "devoluciones/consulta", "padre": 297, "tipo": 2, "hijos": null },
    //                             { "menu": 179, "descripcion": "Level 4 Menu 2", "ruta": "devoluciones/notas", "padre": 297, "tipo": 2, "hijos": null },

    //                         ]
    //                     }

    //                 ]


    //         }
    //     ]
    // },
]