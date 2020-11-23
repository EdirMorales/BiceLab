# BiceLab - Test de programador

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

He creado esta web, para poder tener una visión simple y rápida de los gastos que he realizado en compras internacionales (en dólares) para tiendas especificas como AMAZON, ALIEXPRESS u otras. La intención NO es administrar los gastos de mi presupuesto mensual, si no, supervisar los montos de manera rápida, para detectar cobros indebidos sin tener que revisar transacción por transacción. 

El IDE utilizado para el desarrollo es NodeJs y el lenguaje Javascript.

# Instalación

### Firebase
La aplicación utiliza la nube GCP con las herramientas de Firebase como back. Para levantar la web es necesario contar con el servicio de Firebase en plan "Blaze", las instrucciones para crear una instancia de Firebase se pueden encontrar [acá][link3]. Se debe instalar el CLI (NodeJS) para luego inicializar firebase incluyendo la opción de hosting.
### Datos de prueba
Para esta aplicación creé datos de prueba basados en mis compras en dolares. Para poder subir estos datos a Firebase (Firestore), utilicé una hoja de cálculo en google drive con una secuencia de comandos que se encuentra [acá][link4]. Los datos utilizados se encuentran [acá][link5]

# Control de calidad

### Pruebas de funcionales

Los test unitarios para cada funcionalidad están detallados en cada uno de los archivos indicados a continuación.

| Funcionalidad | Test unitarios |
| ------ | ------ |
| Ingresar nuevo filtro | [calidad/TU_nuevoFiltro.md][link1] |
| Ingresar nuevo gasto | [calidad/TU_nuevoGasto.md][link2] |

[//]: # (LINKS README)
[link1]: <https://github.com/EdirMorales/BiceLab/tree/master/calidad/TU_nuevoFiltro.md>
[link2]: <https://github.com/EdirMorales/BiceLab/tree/master/calidad/TU_nuevoGasto.md>
[link3]: <https://firebase.google.com/docs/web/setup?hl=es-419#node.js-apps>
[link4]: <https://github.com/EdirMorales/BiceLab/blob/master/datos/toFirestore.gs>
[link5]: <https://github.com/EdirMorales/BiceLab/blob/master/datos/compras.xlsx>
