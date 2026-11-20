# Historias de usuario — TaskManager

## HU01 · Registrar tareas (RF01)
**Como** usuario del sistema, **quiero** registrar nuevas tareas **para** organizar mis actividades.

Criterios de aceptación:
- El sistema debe permitir ingresar el nombre de la tarea.
- El sistema debe permitir agregar una descripción.
- El sistema debe permitir seleccionar una prioridad.
- El sistema debe guardar la tarea.
- El sistema debe mostrar un mensaje de confirmación.
- Si el nombre está vacío, el sistema debe mostrar una validación y no guardar.

## HU02 · Consultar tareas (RF02)
**Como** usuario, **quiero** ver todas las tareas registradas **para** saber qué actividades hay pendientes y terminadas.

Criterios de aceptación:
- El sistema debe mostrar el listado de tareas con nombre, descripción, prioridad y estado.
- Las tareas de prioridad alta deben aparecer primero.
- Debe mostrarse el total de tareas.
- Debe poder filtrarse el listado por estado y por prioridad.
- Si no hay tareas, debe mostrarse un mensaje indicándolo.

## HU03 · Editar tareas (RF03)
**Como** usuario, **quiero** modificar la información de una tarea **para** corregir o actualizar sus datos.

Criterios de aceptación:
- Debe existir un botón "Editar" en cada tarea.
- Se deben poder modificar el nombre, la descripción y la prioridad.
- El nombre no puede quedar vacío.
- Los cambios deben reflejarse en el listado.
- El sistema debe mostrar un mensaje de confirmación.

## HU04 · Eliminar tareas (RF04)
**Como** usuario, **quiero** eliminar tareas **para** quitar actividades que ya no son necesarias o se duplicaron.

Criterios de aceptación:
- Debe existir un botón "Eliminar" en cada tarea.
- El sistema debe pedir confirmación antes de eliminar.
- La tarea debe desaparecer del listado.
- El sistema debe mostrar un mensaje de confirmación.

## HU05 · Cambiar estado de tareas (RF05)
**Como** usuario, **quiero** cambiar el estado de una tarea **para** conocer su progreso.

Criterios de aceptación:
- Debe permitir seleccionar pendiente.
- Debe permitir seleccionar en proceso.
- Debe permitir seleccionar terminada.
- El cambio debe reflejarse en el listado de tareas.
- Toda tarea nueva inicia en estado "Pendiente".

## HU06 · Asignar prioridad (RF06)
**Como** usuario, **quiero** clasificar las tareas por prioridad **para** atender primero las más importantes.

Criterios de aceptación:
- Debe permitir elegir Alta, Media o Baja al registrar y al editar.
- La prioridad por defecto es Media.
- Cada tarea debe mostrar su prioridad con un color distinto.
- El sistema debe rechazar prioridades no válidas.

## HU07 · Pruebas automáticas (DevOps)
**Como** equipo de desarrollo, **queremos** que las pruebas se ejecuten automáticamente en cada cambio **para** detectar errores antes de integrarlos a `main`.

Criterios de aceptación:
- Cada push y Pull Request a `main` ejecuta GitHub Actions.
- Si una prueba falla, el flujo se marca en rojo.

## HU08 · Despliegue y monitoreo (DevOps)
**Como** empresa, **queremos** que el sistema esté publicado y monitoreado **para** que los empleados lo usen y se detecten fallas.

Criterios de aceptación:
- La aplicación tiene una URL pública.
- Existe un endpoint `/health` que reporta el estado.
- Las fallas detectadas se registran como Issues.
