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
