# Despliegue — TaskManager

## Plataforma: Render

Se eligió **Render** porque es compatible con Python/Flask, se conecta directamente con GitHub y tiene un plan gratuito.

| Configuración | Valor |
|---|---|
| Tipo de servicio | Web Service |
| Repositorio | `raulhernandez-dev/TaskManager-DevOps` (rama `main`) |
| Comando de instalación | `pip install -r requirements.txt` |
| Comando de inicio | `gunicorn app:app` |
| Variables de entorno | `PYTHON_VERSION=3.12.7`, `DATABASE_PATH=/tmp/taskmanager.db` |
| Health check | `/health` |
| Despliegue automático | `autoDeployTrigger: checksPass` (solo si GitHub Actions pasa) |
| URL pública | <https://taskmanager-devops-d46k.onrender.com> |

La configuración completa está en [`render.yaml`](../render.yaml) (Blueprint).

## Pasos realizados

1. Iniciar sesión en <https://render.com> con la cuenta de GitHub.
2. **New → Blueprint**, seleccionar el repositorio `TaskManager-DevOps` y nombrar el Blueprint `taskmanager-devops`.
3. Render leyó `render.yaml` y creó el servicio web `taskmanager-devops`.
4. **Deploy Blueprint**: la instalación y el arranque con gunicorn terminaron en ~30 s (19/11/2026, 21:12).
5. Render asignó la URL pública <https://taskmanager-devops-d46k.onrender.com>.

Registro del despliegue (logs de Render):

```text
==> Running 'gunicorn app:app'
[INFO] Starting gunicorn 23.0.0
[INFO] Listening at: http://0.0.0.0:10000
INFO taskmanager: GET /health -> 200 (1.1 ms)
==> Your service is live 🎉
==> Available at your primary URL https://taskmanager-devops-d46k.onrender.com
```

## Despliegue continuo

1. Cada push a `main` ejecuta las pruebas en GitHub Actions (`ci.yml` y `deploy.yml`).
2. Render está configurado con `autoDeployTrigger: checksPass`: **solo publica la nueva versión si todas las verificaciones de GitHub pasan**. Si una prueba falla, la versión anterior sigue en línea.
3. `deploy.yml` verifica después que `/health` responda.
4. Opcionalmente se puede usar un *Deploy Hook* de Render guardado como secreto `RENDER_DEPLOY_HOOK`.

## Consideraciones

- En el plan gratuito, Render suspende el servicio tras 15 minutos sin uso; la primera petición después tarda ~50 s en responder.
- El disco del plan gratuito es temporal: la base SQLite se reinicia cuando el servicio se redespliega o se suspende. Para producción se propone una base de datos persistente (ver [mejoras](mejoras.md)).

## Verificación

Verificación realizada el 19/11/2026 sobre la URL pública:

| Verificación | Resultado |
|---|---|
| La URL es accesible | ✅ `/health` → `{"estado":"ok","base_de_datos":"ok"}` |
| La página principal carga | ✅ |
| Se pueden registrar tareas | ✅ 3 tareas registradas con prioridad Alta, Media y Baja |
| Validación de nombre vacío | ✅ "El nombre de la tarea es obligatorio." |
| Se pueden editar tareas | ✅ nombre y prioridad actualizados (Baja → Alta) |
| Se pueden eliminar tareas | ✅ el listado pasó de 3 a 2 tareas |
| Los estados se actualizan | ✅ Pendiente → En proceso y Pendiente → Terminada |
