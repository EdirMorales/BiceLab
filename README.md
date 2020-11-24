# BiceLab - Test de programador

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

He creado esta web, con el objetivo de tener una visión simple y rápida de los gastos que he realizado en compras internacionales (en dólares) para tiendas específicas como AMAZON, ALIEXPRESS entre otras. La intención NO es administrar los gastos de mi presupuesto mensual, sino supervisar los montos de manera rápida, para detectar cobros indebidos, sin tener que revisar transacción por transacción. 

La web permite visualizar en un gráfico los montos totales diarios de los últimos días, totalizando los gastos específicos en una tabla, con la posibilidad de añadir filtros adicionales. La tabla puede ser exportada a un archivo Excel, permitiendo agregar los gastos de forma manual.

El IDE utilizado para el desarrollo, es Visual Code en conjunto con NodeJs y el lenguaje para el front es Javascript.

La web se encuentra disponible para visualización [acá][link6]


# Instalación

### Firebase
La aplicación utiliza la nube GCP con las herramientas de Firebase como back. Para levantar la web es necesario contar con el servicio de Firebase en plan "Blaze". Las instrucciones para crear una base de datos Cloud Firestore se pueden encontrar [acá][link3].

Se debe instalar [Visual Code][linkVC], [Node Js][linkNJ] y [GIT][linkGIT] para obtener una copia de este repositorio. Luego se puede continuar con la instalación de Firebase por medio de npm en la consola de VC.

```sh
$ npm install -g firebase-tools
$ firebase init
```

Durante la inicialización de Firebase, se selecciona el proyecto creado anteriormente y en las opciones se debe seleccionar Firestore y Hosing. El instalador sobrescribirá los archivos de comunicación y seguridad necesarios. En este punto ya se puede realizar un "deploy" hacia Firebase.

```sh
$ firebase deploy
```

### Datos de prueba
Para esta aplicación creé datos de prueba basados en mis compras en dólares. Para poder subir estos datos a Firebase (Firestore), utilicé una hoja de cálculo en google drive con una secuencia de comandos que se encuentra [acá][link4]. Se deben configurar los datos de autentificación para que google sheets tenga acceso a Firestore, al ejecutar el script, se solicitará la aprobación por cuenta google del usuario.

```sh
const email = "xxxxxx@bicelab-6a6da.iam.gserviceaccount.com";
const key = "-----BEGIN PRIVATE KEY-----\x5LqgVNpms\n-----END PRIVATE KEY-----\n";
const projectId = "bicelab-6a6da";
```

Se deben copiar los datos a la hoja de google con nombre "Hoja1". Al ejecutar la secuencia se creará la colección Movimientos automáticamente. Los datos de prueba utilizados se encuentran [acá][link5]. 

# Control de calidad

### Pruebas unitarias

Los test unitarios para cada funcionalidad se encuentran detallados en cada uno de los archivos indicados a continuación.

| Funcionalidad | Test unitarios |
| ------ | ------ |
| Ingresar nuevo filtro | [calidad/TU_nuevoFiltro.md][link1] |
| Ingresar nuevo gasto | [calidad/TU_nuevoGasto.md][link2] |

*no compatible con IE

[//]: # (LINKS README)
[link1]: <https://github.com/EdirMorales/BiceLab/tree/master/calidad/TU_nuevoFiltro.md>
[link2]: <https://github.com/EdirMorales/BiceLab/tree/master/calidad/TU_nuevoGasto.md>
[link3]: <https://firebase.google.com/docs/firestore/quickstart#node.js>
[link4]: <https://github.com/EdirMorales/BiceLab/blob/master/datos/toFirestore.gs>
[link5]: <https://github.com/EdirMorales/BiceLab/blob/master/datos/compras.xlsx>
[link6]: <https://bicelab-6a6da.web.app/>
[linkVC]: <https://code.visualstudio.com/download>
[linkNJ]: <https://nodejs.org/es/download/>
[linkGIT]: <https://git-scm.com/downloads>
