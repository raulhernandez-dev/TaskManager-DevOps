"""TaskManager - Sistema web para la gestion de tareas de TechSolutions."""
import os
import sqlite3

from flask import Flask, g, render_template

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

    @app.route("/")
    def index():
        return render_template("index.html")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
