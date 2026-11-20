# TaskManager-DevOps

Sistema web para la gestión de tareas de la empresa **TechSolutions**, desarrollado aplicando las fases del ciclo de vida DevOps con GitHub (Projects, Issues, Actions y Releases).

![CI](https://github.com/raulhernandez-dev/TaskManager-DevOps/actions/workflows/ci.yml/badge.svg)
![Despliegue](https://github.com/raulhernandez-dev/TaskManager-DevOps/actions/workflows/deploy.yml/badge.svg)

| | |
|---|---|
| 🌐 Aplicación publicada | <https://taskmanager-devops-d46k.onrender.com> |
| 📋 Tablero (GitHub Projects) | <https://github.com/users/raulhernandez-dev/projects/3> |
| 🏷️ Versión estable | [v1.0.0](https://github.com/raulhernandez-dev/TaskManager-DevOps/releases/tag/v1.0.0) |

## Equipo

| Integrante | Usuario GitHub | Rol |
|---|---|---|
| Raúl Hernández Hernández | [@raulhernandez-dev](https://github.com/raulhernandez-dev) | Product Owner · Desarrollador backend · Monitoreo |
| Santiago Luna Cuautle | [@SantiagoLC12](https://github.com/SantiagoLC12) | Desarrollador frontend · Ingeniero DevOps / QA |

## Funcionalidades

| Código | Funcionalidad | Estado |
|---|---|---|
| RF01 | Registrar tareas (nombre, descripción, prioridad) | ✅ |
| RF02 | Consultar tareas (ordenadas por prioridad, con filtros) | ✅ |
| RF03 | Editar tareas | ✅ |
| RF04 | Eliminar tareas (con confirmación) | ✅ |
| RF05 | Cambiar estado: Pendiente, En proceso, Terminada | ✅ |
| RF06 | Asignar prioridad: Alta, Media, Baja | ✅ |

## Tecnologías

- **Frontend:** HTML, CSS y JavaScript
- **Backend:** Python 3.12 con Flask
- **Base de datos:** SQLite
- **Pruebas:** Pytest
- **CI/CD:** GitHub Actions
- **Despliegue:** Render (gunicorn)

## Estructura

```text
TaskManager-DevOps/
├── app.py                  # Aplicación Flask y API REST
├── requirements.txt
├── render.yaml             # Configuración de despliegue en Render
├── templates/index.html
├── static/
│   ├── css/style.css
│   └── js/app.js
├── tests/
│   ├── conftest.py
│   └── test_app.py         # Pruebas unitarias (CP01–CP07 y monitoreo)
├── docs/                   # Historias de usuario, pruebas, monitoreo y mejoras
└── .github/workflows/
    ├── ci.yml              # Integración continua
    ├── cd.yml              # Entrega continua (artefacto del release)
    ├── deploy.yml          # Pruebas + verificación del despliegue en Render
    └── monitor.yml         # Monitoreo programado
```

## Ejecutar en local

```bash
git clone https://github.com/raulhernandez-dev/TaskManager-DevOps.git
cd TaskManager-DevOps
python -m venv .venv
# Windows: .venv\Scripts\activate   |   Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Abrir <http://127.0.0.1:5000>.

## Pruebas

```bash
pytest -v
```

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tareas` | Lista las tareas |
| GET | `/api/tareas/<id>` | Consulta una tarea |
| POST | `/api/tareas` | Registra una tarea `{nombre, descripcion, prioridad}` |
| PUT | `/api/tareas/<id>` | Edita una tarea |
| PATCH | `/api/tareas/<id>/estado` | Cambia el estado `{estado}` |
| DELETE | `/api/tareas/<id>` | Elimina una tarea |
| GET | `/health` | Estado de la aplicación y la base de datos |

## Flujo de trabajo (Git)

1. Cada funcionalidad se desarrolla en su propia rama (`feature/...`, `fix/...`, `ci/...`).
2. Se abre un Pull Request hacia `main` y lo revisa el otro integrante.
3. GitHub Actions ejecuta las pruebas en cada Pull Request.
4. Solo se combina cuando las pruebas pasan.

## Documentación

- [Historias de usuario](docs/historias-de-usuario.md)
- [Matriz de casos de prueba](docs/matriz-de-pruebas.md)
- [Despliegue](docs/despliegue.md)
- [Monitoreo e incidencias](docs/monitoreo.md)
- [Propuestas de mejora (v2.0)](docs/mejoras.md)
