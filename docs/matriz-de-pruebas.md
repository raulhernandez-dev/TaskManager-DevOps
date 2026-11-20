# Matriz de casos de prueba — TaskManager

Cada caso se ejecutó de forma **automática** (Pytest en GitHub Actions) y de forma **manual** (funcional) en el navegador.

| ID | Prueba | Pasos | Resultado esperado | Prueba automática | Resultado |
|---|---|---|---|---|---|
| CP01 | Registrar una tarea | Nueva tarea → nombre "Elaborar documentación", descripción, prioridad Alta → Guardar | La tarea se guarda correctamente y aparece en el listado con mensaje de confirmación | `test_registrar_tarea_correctamente` | ✅ Aprobada |
| CP02 | Registrar una tarea sin nombre | Dejar el nombre vacío → Guardar | El sistema muestra una validación y no guarda | `test_registrar_tarea_sin_nombre_muestra_validacion` | ✅ Aprobada |
| CP03 | Consultar tareas | Abrir el sistema con varias tareas registradas | Se muestra el listado ordenado por prioridad | `test_consultar_tareas` | ✅ Aprobada |
| CP04 | Editar una tarea | Editar → cambiar nombre, descripción y prioridad → Guardar cambios | Se actualiza la información | `test_editar_tarea` | ❌ Falló (prioridad no se guardaba) → ✅ Aprobada tras la corrección |
| CP05 | Eliminar una tarea | Eliminar → Aceptar confirmación | La tarea desaparece del listado | `test_eliminar_tarea` | ✅ Aprobada |
| CP06 | Cambiar estado | Cambiar el selector a "En proceso" y luego a "Terminada" | Se actualiza el estado | `test_cambiar_estado` | ✅ Aprobada |
| CP07 | Seleccionar prioridad | Registrar tareas con Alta, Media y Baja | Se guarda la prioridad elegida | `test_seleccionar_prioridad` | ✅ Aprobada |
| CP08 | Registrar sin descripción | Registrar solo con nombre | Se guarda con descripción vacía y prioridad Media | `test_registrar_tarea_sin_descripcion` | ✅ Aprobada |
| CP09 | Valores no válidos | Enviar estado "Cancelada" o prioridad "Urgente" a la API | El sistema responde 400 con mensaje de error | `test_cambiar_estado_invalido`, `test_prioridad_invalida` | ✅ Aprobada |
| CP10 | Tarea inexistente | Consultar, editar o eliminar un id que no existe | El sistema responde 404 | `test_*_inexistente` | ✅ Aprobada |
| CP11 | Monitoreo | Consultar `/health` | Responde `estado: ok` y el encabezado `X-Response-Time` | `test_health` | ✅ Aprobada |

## Prueba funcional detallada — CP01

1. Abrir el sistema.
2. En el panel "Nueva tarea" escribir el nombre: *Elaborar documentación*.
3. Agregar una descripción.
4. Seleccionar prioridad *Alta*.
5. Presionar "Guardar tarea".
6. Verificar que aparece el mensaje "Tarea registrada correctamente" y la tarea en el listado con la etiqueta roja *Alta*.

## Errores detectados

| Issue | Error | Detectado por | Corrección |
|---|---|---|---|
| Error al editar: la prioridad no se guarda | Al editar una tarea, el cambio de prioridad no se guardaba (la sentencia `UPDATE` no incluía la columna `prioridad`) | CP04 / `test_editar_tarea` en GitHub Actions | Rama `fix/editar-prioridad` y su Pull Request; nueva ejecución de Actions en verde |
