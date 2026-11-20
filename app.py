"""TaskManager - Sistema web para la gestion de tareas de TechSolutions."""
import logging
import os
import sqlite3
import time

from flask import Flask, g, jsonify, render_template, request

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)
logger = logging.getLogger("taskmanager")
VERSION = "1.0.0"
INICIO = time.time()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ESTADOS = ("Pendiente", "En proceso", "Terminada")
PRIORIDADES = ("Alta", "Media", "Baja")

ESQUEMA = """
CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL DEFAULT '',
    prioridad TEXT NOT NULL DEFAULT 'Media',
    estado TEXT NOT NULL DEFAULT 'Pendiente',
    creada_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizada_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def get_db():
    """Devuelve la conexion a SQLite de la peticion actual."""
    from flask import current_app

    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(_error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db(app):
    """Crea la tabla de tareas si todavia no existe."""
    with app.app_context():
        db = get_db()
        db.executescript(ESQUEMA)
        db.commit()


def fila_a_dict(fila):
    return {clave: fila[clave] for clave in fila.keys()}


def obtener_tarea(tarea_id):
    fila = get_db().execute("SELECT * FROM tareas WHERE id = ?", (tarea_id,)).fetchone()
    return fila_a_dict(fila) if fila else None


def validar_tarea(datos):
    """Valida los datos de una tarea. Devuelve (datos_limpios, error)."""
    if not isinstance(datos, dict):
        return None, "El cuerpo de la peticion debe ser JSON."

    nombre = str(datos.get("nombre") or "").strip()
    if not nombre:
        return None, "El nombre de la tarea es obligatorio."
    if len(nombre) > 120:
        return None, "El nombre no puede superar 120 caracteres."

    descripcion = str(datos.get("descripcion") or "").strip()
    prioridad = datos.get("prioridad") or "Media"
    if prioridad not in PRIORIDADES:
        return None, f"Prioridad no valida. Use: {', '.join(PRIORIDADES)}."

    return {"nombre": nombre, "descripcion": descripcion, "prioridad": prioridad}, None


def create_app(config=None):
    app = Flask(__name__)
    app.config["DATABASE"] = os.environ.get(
        "DATABASE_PATH", os.path.join(BASE_DIR, "instance", "taskmanager.db")
    )
    if config:
        app.config.update(config)

    carpeta_db = os.path.dirname(app.config["DATABASE"])
    if carpeta_db:
        os.makedirs(carpeta_db, exist_ok=True)

    app.teardown_appcontext(close_db)
    init_db(app)

    # Monitoreo: tiempo de respuesta y registro de cada peticion
    @app.before_request
    def iniciar_cronometro():
        g.inicio = time.perf_counter()

    @app.after_request
    def registrar_peticion(respuesta):
        if "inicio" in g:
            duracion_ms = (time.perf_counter() - g.inicio) * 1000
            respuesta.headers["X-Response-Time"] = f"{duracion_ms:.1f}ms"
            if not request.path.startswith("/static"):
                logger.info(
                    "%s %s -> %s (%.1f ms)",
                    request.method, request.path, respuesta.status_code, duracion_ms,
                )
        return respuesta

    @app.errorhandler(500)
    def error_interno(error):
        logger.exception("Error interno: %s", error)
        return jsonify({"error": "Error interno del servidor."}), 500

    @app.get("/health")
    def health():
        """Endpoint de monitoreo: disponibilidad de la app y de la base de datos."""
        try:
            total = get_db().execute("SELECT COUNT(*) FROM tareas").fetchone()[0]
            return jsonify({
                "estado": "ok",
                "base_de_datos": "ok",
                "tareas": total,
                "version": VERSION,
                "activo_desde_segundos": int(time.time() - INICIO),
            })
        except sqlite3.Error as error:
            logger.error("Fallo en la base de datos: %s", error)
            return jsonify({"estado": "error", "base_de_datos": str(error)}), 503

    @app.route("/")
    def index():
        return render_template("index.html")

    # RF02 - Consultar tareas
    @app.get("/api/tareas")
    def listar_tareas():
        filas = get_db().execute(
            """SELECT * FROM tareas
               ORDER BY CASE prioridad WHEN 'Alta' THEN 0 WHEN 'Media' THEN 1 ELSE 2 END,
                        id DESC"""
        ).fetchall()
        return jsonify([fila_a_dict(f) for f in filas])

    @app.get("/api/tareas/<int:tarea_id>")
    def ver_tarea(tarea_id):
        tarea = obtener_tarea(tarea_id)
        if tarea is None:
            return jsonify({"error": "Tarea no encontrada."}), 404
        return jsonify(tarea)

    # RF01 - Registrar tareas
    @app.post("/api/tareas")
    def crear_tarea():
        datos, error = validar_tarea(request.get_json(silent=True))
        if error:
            return jsonify({"error": error}), 400
        db = get_db()
        cursor = db.execute(
            "INSERT INTO tareas (nombre, descripcion, prioridad) VALUES (?, ?, ?)",
            (datos["nombre"], datos["descripcion"], datos["prioridad"]),
        )
        db.commit()
        return jsonify(obtener_tarea(cursor.lastrowid)), 201

    # RF03 - Editar tareas
    @app.put("/api/tareas/<int:tarea_id>")
    def editar_tarea(tarea_id):
        if obtener_tarea(tarea_id) is None:
            return jsonify({"error": "Tarea no encontrada."}), 404
        datos, error = validar_tarea(request.get_json(silent=True))
        if error:
            return jsonify({"error": error}), 400
        db = get_db()
        db.execute(
            """UPDATE tareas
               SET nombre = ?, descripcion = ?, prioridad = ?,
                   actualizada_en = CURRENT_TIMESTAMP
               WHERE id = ?""",
            (datos["nombre"], datos["descripcion"], datos["prioridad"], tarea_id),
        )
        db.commit()
        return jsonify(obtener_tarea(tarea_id))

    # RF05 - Cambiar estado
    @app.patch("/api/tareas/<int:tarea_id>/estado")
    def cambiar_estado(tarea_id):
        if obtener_tarea(tarea_id) is None:
            return jsonify({"error": "Tarea no encontrada."}), 404
        datos = request.get_json(silent=True) or {}
        estado = datos.get("estado")
        if estado not in ESTADOS:
            return jsonify({"error": f"Estado no valido. Use: {', '.join(ESTADOS)}."}), 400
        db = get_db()
        db.execute(
            "UPDATE tareas SET estado = ?, actualizada_en = CURRENT_TIMESTAMP WHERE id = ?",
            (estado, tarea_id),
        )
        db.commit()
        return jsonify(obtener_tarea(tarea_id))

    # RF04 - Eliminar tareas
    @app.delete("/api/tareas/<int:tarea_id>")
    def eliminar_tarea(tarea_id):
        if obtener_tarea(tarea_id) is None:
            return jsonify({"error": "Tarea no encontrada."}), 404
        db = get_db()
        db.execute("DELETE FROM tareas WHERE id = ?", (tarea_id,))
        db.commit()
        return jsonify({"mensaje": "Tarea eliminada correctamente."})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
