def test_registro_tarea():
    tarea = {
        "nombre": "Realizar actividad DevOps",
        "estado": "Pendiente",
    }
    assert tarea["nombre"] == "Realizar actividad DevOps"
    assert tarea["estado"] == "Pendiente"


def test_pagina_principal_carga(client):
    respuesta = client.get("/")
    assert respuesta.status_code == 200
    assert b"TaskManager" in respuesta.data


def crear(client, **datos):
    base = {"nombre": "Elaborar documentación", "descripcion": "Manual de usuario", "prioridad": "Alta"}
    base.update(datos)
    return client.post("/api/tareas", json=base)


# CP01 - Registrar una tarea
def test_registrar_tarea_correctamente(client):
    respuesta = crear(client)
    assert respuesta.status_code == 201
    tarea = respuesta.get_json()
    assert tarea["id"] == 1
    assert tarea["nombre"] == "Elaborar documentación"
    assert tarea["descripcion"] == "Manual de usuario"
    assert tarea["estado"] == "Pendiente"


# CP02 - Registrar una tarea sin nombre
def test_registrar_tarea_sin_nombre_muestra_validacion(client):
    respuesta = crear(client, nombre="   ")
    assert respuesta.status_code == 400
    assert "obligatorio" in respuesta.get_json()["error"]


def test_registrar_tarea_sin_descripcion(client):
    respuesta = client.post("/api/tareas", json={"nombre": "Tarea sin descripción"})
    assert respuesta.status_code == 201
    assert respuesta.get_json()["descripcion"] == ""
    assert respuesta.get_json()["prioridad"] == "Media"


def test_registrar_tarea_sin_json(client):
    respuesta = client.post("/api/tareas", data="texto", content_type="text/plain")
    assert respuesta.status_code == 400


# CP03 - Consultar tareas
def test_consultar_tareas(client):
    crear(client, nombre="Tarea 1", prioridad="Baja")
    crear(client, nombre="Tarea 2", prioridad="Alta")
    respuesta = client.get("/api/tareas")
    assert respuesta.status_code == 200
    tareas = respuesta.get_json()
    assert len(tareas) == 2
    # Las tareas de prioridad alta aparecen primero
    assert tareas[0]["nombre"] == "Tarea 2"


def test_consultar_tarea_inexistente(client):
    assert client.get("/api/tareas/99").status_code == 404


# CP04 - Editar una tarea
def test_editar_tarea(client):
    crear(client)
    respuesta = client.put(
        "/api/tareas/1",
        json={"nombre": "Documentación final", "descripcion": "Versión 2", "prioridad": "Baja"},
    )
    assert respuesta.status_code == 200
    tarea = client.get("/api/tareas/1").get_json()
    assert tarea["nombre"] == "Documentación final"
    assert tarea["descripcion"] == "Versión 2"
    assert tarea["prioridad"] == "Baja"


def test_editar_tarea_sin_nombre(client):
    crear(client)
    respuesta = client.put("/api/tareas/1", json={"nombre": ""})
    assert respuesta.status_code == 400


def test_editar_tarea_inexistente(client):
    assert client.put("/api/tareas/50", json={"nombre": "X"}).status_code == 404


# CP05 - Eliminar una tarea
def test_eliminar_tarea(client):
    crear(client)
    respuesta = client.delete("/api/tareas/1")
    assert respuesta.status_code == 200
    assert client.get("/api/tareas").get_json() == []


def test_eliminar_tarea_inexistente(client):
    assert client.delete("/api/tareas/7").status_code == 404


# CP06 - Cambiar estado
def test_cambiar_estado(client):
    crear(client)
    for estado in ("En proceso", "Terminada", "Pendiente"):
        respuesta = client.patch("/api/tareas/1/estado", json={"estado": estado})
        assert respuesta.status_code == 200
        assert client.get("/api/tareas/1").get_json()["estado"] == estado


def test_cambiar_estado_invalido(client):
    crear(client)
    respuesta = client.patch("/api/tareas/1/estado", json={"estado": "Cancelada"})
    assert respuesta.status_code == 400


# CP07 - Seleccionar prioridad
def test_seleccionar_prioridad(client):
    for prioridad in ("Alta", "Media", "Baja"):
        tarea = crear(client, prioridad=prioridad).get_json()
        assert tarea["prioridad"] == prioridad


def test_prioridad_invalida(client):
    respuesta = crear(client, prioridad="Urgente")
    assert respuesta.status_code == 400


# Monitoreo
def test_health(client):
    crear(client)
    respuesta = client.get("/health")
    assert respuesta.status_code == 200
    datos = respuesta.get_json()
    assert datos["estado"] == "ok"
    assert datos["tareas"] == 1
    assert "X-Response-Time" in respuesta.headers
