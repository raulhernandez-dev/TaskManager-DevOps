# Propuestas de mejora — TaskManager v2.0

| # | Mejora | Justificación | Prioridad | Responsable |
|---|---|---|---|---|
| 1 | Autenticación de usuarios | Cada empleado vería y gestionaría sus propias tareas; hoy cualquiera con la URL puede modificarlas | Alta | Raúl Hernández |
| 2 | Asignar responsable y fecha límite a cada tarea | La empresa necesita saber quién hace qué y para cuándo | Alta | Santiago Luna |
| 3 | Base de datos persistente (PostgreSQL en Render) | El disco gratuito borra la base SQLite al redesplegar | Alta | Santiago Luna |
| 4 | Búsqueda por texto | Encontrar tareas rápido cuando el listado crece | Media | Raúl Hernández |
| 5 | Notificaciones de tareas próximas a vencer | Evitar tareas olvidadas | Media | Santiago Luna |
| 6 | Reportes de productividad (tareas terminadas por semana) | Dar seguimiento al desempeño | Baja | Raúl Hernández |

## Planeación de la versión 2.0

| Sprint | Contenido | Fase DevOps |
|---|---|---|
| 1 | Historias de usuario e Issues de las mejoras 1–3; tablero actualizado | Plan |
| 2 | Migración a PostgreSQL y autenticación | Code / Build |
| 3 | Responsable, fecha límite y búsqueda; pruebas nuevas | Code / Test |
| 4 | Release `v2.0.0`, despliegue y monitoreo | Release / Deploy / Monitor |
