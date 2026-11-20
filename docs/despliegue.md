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

La configuración completa está en [`render.yaml`](../render.yaml) (Blueprint).

## Pasos

1. Crear una cuenta en <https://render.com> e iniciar sesión con GitHub.
2. **New → Blueprint** y seleccionar el repositorio `TaskManager-DevOps` (Render lee `render.yaml`).
3. Presionar **Apply / Deploy** y esperar a que termine.
4. Copiar la URL pública (`https://taskmanager-devops-xxxx.onrender.com`).
5. En Render → Settings → **Deploy Hook**, copiar la URL y guardarla en GitHub → Settings → Secrets and variables → Actions → **Secrets** como `RENDER_DEPLOY_HOOK`.
6. En la misma pantalla, pestaña **Variables**, crear `APP_URL` con la URL pública (la usa el workflow de monitoreo).

## Despliegue continuo

El workflow [`deploy.yml`](../.github/workflows/deploy.yml) se ejecuta en cada push a `main`:

1. Ejecuta todas las pruebas.
2. Solo si pasan, llama al Deploy Hook de Render, que publica la nueva versión.

## Consideraciones

- En el plan gratuito, Render suspende el servicio tras 15 minutos sin uso; la primera petición después tarda ~50 s en responder.
- El disco del plan gratuito es temporal: la base SQLite se reinicia cuando el servicio se redespliega o se suspende. Para producción se propone una base de datos persistente (ver [mejoras](mejoras.md)).

## Verificación

| Verificación | Resultado |
|---|---|
| La URL es accesible | _pendiente de captura_ |
| La página principal carga | _pendiente de captura_ |
| Se pueden registrar tareas | _pendiente de captura_ |
| Se pueden editar tareas | _pendiente de captura_ |
| Se pueden eliminar tareas | _pendiente de captura_ |
| Los estados se actualizan | _pendiente de captura_ |
