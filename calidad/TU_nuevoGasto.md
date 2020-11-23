## Ingresar nuevo gasto

| Test | Acción | Resultado esperado |
| ------ | ------ | ------ |
| Ingreso descripción y monto en blanco | click en botón Guardar | input pierde foco y no hay cambios |
| Ingreso descripción en blanco y monto cero | click en botón Guardar | input pierde foco y no hay cambios |
| Ingreso descripción y monto en cero | click en botón Guardar | input pierde foco y no hay cambios |
| Ingreso descripción y monto mayor a cero | click en botón Guardar | el contenido de los inputs se limpia y los datos son agregados a la base de datos, si la descripción coincide con alguno de los filtros, el monto debe ser añadido al total junto con su conversión a pesos; de no coincidir con algún filtro, el monto y su descripción será agregada a la base de datos pero no tendrá visualización inmediata. |
