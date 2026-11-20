# Operación y monitoreo — TaskManager

## Mecanismos de monitoreo

| Qué se monitorea | Cómo |
|---|---|
| Disponibilidad | Endpoint `GET /health` + health check de Render + workflow [`monitor.yml`](../.github/workflows/monitor.yml) cada 6 horas |
| Tiempo de respuesta | Encabezado `X-Response-Time` en cada respuesta, registro en los logs y tiempo medido por `monitor.yml` (resumen de la ejecución) |
| Errores | Logs de la aplicación en Render (nivel `ERROR`), respuestas 500 en formato JSON |
| Almacenamiento | `/health` consulta la base SQLite y reporta el número de tareas |
| Funcionalidades | Pruebas automáticas en cada cambio y verificación manual de CP01–CP07 sobre la URL pública |

Si `monitor.yml` detecta que la aplicación no responde, **crea automáticamente un Issue** con la etiqueta `incidencia`.

## Registro de monitoreo

| Fecha | Disponibilidad | Código HTTP `/health` | Tiempo de respuesta | Tareas en BD | Observaciones |
|---|---|---|---|---|---|
| _AAAA-MM-DD_ | | | | | |
| _AAAA-MM-DD_ | | | | | |
| _AAAA-MM-DD_ | | | | | |

## Registro de incidencias

Las incidencias se documentan como **Issues** con la etiqueta `incidencia`, usando este formato:

- Fecha de detección
- Funcionalidad afectada
- Descripción del problema
- Evidencia del error
- Responsable de corregirlo
- Solución aplicada

| Issue | Fecha | Funcionalidad | Problema | Responsable | Solución |
|---|---|---|---|---|---|
| Lentitud en la primera carga | _fecha_ | Todas | La primera petición tarda ~50 s porque Render suspende el servicio gratuito | Santiago Luna | Documentado; se propone plan pagado o ping periódico |
| Las tareas se borran tras un redespliegue | _fecha_ | Almacenamiento | El disco del plan gratuito es temporal y SQLite se reinicia | Raúl Hernández | Se planea migrar a base de datos persistente en v2.0 |
