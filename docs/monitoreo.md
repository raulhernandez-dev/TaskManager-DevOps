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
| 19/11/2026 21:12 | ⚠️ Arranque en frío | 503 → 200 | ~14 s en despertar | 0 | Primera petición tras el despliegue; ver incidencia #35 |
| 19/11/2026 21:13 | ✅ Disponible | 200 | 0.5 ms (servidor, `X-Response-Time`) | 3 → 2 | Prueba funcional completa CP01–CP07 en producción |
| 19/11/2026 21:15 | ✅ Disponible | 200 | ≈1.5 s (medido desde GitHub Actions) | 2 | Ejecución manual de `monitor.yml` |

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
| #35 La aplicación responde 503 al despertar | 19/11/2026 | Disponibilidad | El plan gratuito de Render suspende el servicio sin uso; la primera petición recibe 503 mientras arranca | Santiago Luna | Tiempo de espera de 90 s en `monitor.yml`; documentado; plan sin suspensión propuesto para v2.0 |
| #30 La prioridad no se guarda al editar | 19/11/2026 | Edición de tareas | Detectado por CI antes de publicar | Raúl Hernández | Corregido en #31 |

**Riesgo identificado:** el disco del plan gratuito es temporal, por lo que la base SQLite se reinicia en cada redespliegue. Se planea migrar a una base de datos persistente en la v2.0.
