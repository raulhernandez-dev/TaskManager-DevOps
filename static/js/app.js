// Logica del cliente de TaskManager
const API = "/api/tareas";

const formTarea = document.getElementById("form-tarea");
const lista = document.getElementById("lista-tareas");
const sinTareas = document.getElementById("sin-tareas");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");
const dialogoEditar = document.getElementById("dialogo-editar");
const formEditar = document.getElementById("form-editar");

let tareas = [];
let temporizadorMensaje;

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("error", esError);
  mensaje.classList.add("visible");
  clearTimeout(temporizadorMensaje);
  temporizadorMensaje = setTimeout(() => mensaje.classList.remove("visible"), 2800);
}

async function peticion(url, opciones = {}) {
  const respuesta = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const datos = respuesta.status === 204 ? null : await respuesta.json();
  if (!respuesta.ok) {
    throw new Error((datos && datos.error) || "Ocurrió un error inesperado.");
  }
  return datos;
}

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function crearElementoTarea(tarea) {
  const li = document.createElement("li");
  li.className = "tarea";
  li.dataset.id = tarea.id;
  li.innerHTML = `
    <h3>${escaparHTML(tarea.nombre)}</h3>
    ${tarea.descripcion ? `<p>${escaparHTML(tarea.descripcion)}</p>` : ""}
    <small>Prioridad: ${escaparHTML(tarea.prioridad)} · Estado: ${escaparHTML(tarea.estado)}</small>
    <div class="tarea-acciones">
      <button type="button" class="btn btn-secundario" data-accion="editar">Editar</button>
      <button type="button" class="btn btn-peligro" data-accion="eliminar">Eliminar</button>
    </div>
  `;
  return li;
}

function renderizar() {
  lista.innerHTML = "";
  tareas.forEach((t) => lista.appendChild(crearElementoTarea(t)));
  sinTareas.classList.toggle("oculto", tareas.length > 0);
  contador.textContent = `${tareas.length} ${tareas.length === 1 ? "tarea" : "tareas"}`;
}

// RF02 - Consultar tareas
async function cargarTareas() {
  try {
    tareas = await peticion(API);
    renderizar();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
}

// RF01 - Registrar tareas
formTarea.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const campoNombre = formTarea.nombre;
  const nombre = campoNombre.value.trim();

  campoNombre.classList.toggle("invalido", !nombre);
  if (!nombre) {
    mostrarMensaje("El nombre de la tarea es obligatorio.", true);
    campoNombre.focus();
    return;
  }

  try {
    await peticion(API, {
      method: "POST",
      body: JSON.stringify({
        nombre,
        descripcion: formTarea.descripcion.value,
        prioridad: formTarea.prioridad.value,
      }),
    });
    formTarea.reset();
    mostrarMensaje("Tarea registrada correctamente.");
    await // RF03 - Editar tareas
function abrirEdicion(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;
  formEditar.id.value = tarea.id;
  formEditar.nombre.value = tarea.nombre;
  formEditar.descripcion.value = tarea.descripcion;
  formEditar.prioridad.value = tarea.prioridad;
  formEditar.nombre.classList.remove("invalido");
  dialogoEditar.showModal();
}

formEditar.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const nombre = formEditar.nombre.value.trim();
  formEditar.nombre.classList.toggle("invalido", !nombre);
  if (!nombre) {
    mostrarMensaje("El nombre de la tarea es obligatorio.", true);
    return;
  }
  try {
    await peticion(`${API}/${formEditar.id.value}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre,
        descripcion: formEditar.descripcion.value,
        prioridad: formEditar.prioridad.value,
      }),
    });
    dialogoEditar.close();
    mostrarMensaje("Tarea actualizada correctamente.");
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

document.getElementById("cancelar-edicion").addEventListener("click", () => dialogoEditar.close());

// RF04 - Eliminar tareas
async function eliminarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea || !confirm(`¿Eliminar la tarea "${tarea.nombre}"?`)) return;
  try {
    await peticion(`${API}/${id}`, { method: "DELETE" });
    mostrarMensaje("Tarea eliminada correctamente.");
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
}

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.closest(".tarea").dataset.id);
  if (boton.dataset.accion === "editar") abrirEdicion(id);
  if (boton.dataset.accion === "eliminar") eliminarTarea(id);
});

cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

// RF03 - Editar tareas
function abrirEdicion(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;
  formEditar.id.value = tarea.id;
  formEditar.nombre.value = tarea.nombre;
  formEditar.descripcion.value = tarea.descripcion;
  formEditar.prioridad.value = tarea.prioridad;
  formEditar.nombre.classList.remove("invalido");
  dialogoEditar.showModal();
}

formEditar.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const nombre = formEditar.nombre.value.trim();
  formEditar.nombre.classList.toggle("invalido", !nombre);
  if (!nombre) {
    mostrarMensaje("El nombre de la tarea es obligatorio.", true);
    return;
  }
  try {
    await peticion(`${API}/${formEditar.id.value}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre,
        descripcion: formEditar.descripcion.value,
        prioridad: formEditar.prioridad.value,
      }),
    });
    dialogoEditar.close();
    mostrarMensaje("Tarea actualizada correctamente.");
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

document.getElementById("cancelar-edicion").addEventListener("click", () => dialogoEditar.close());

// RF04 - Eliminar tareas
async function eliminarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea || !confirm(`¿Eliminar la tarea "${tarea.nombre}"?`)) return;
  try {
    await peticion(`${API}/${id}`, { method: "DELETE" });
    mostrarMensaje("Tarea eliminada correctamente.");
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
}

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.closest(".tarea").dataset.id);
  if (boton.dataset.accion === "editar") abrirEdicion(id);
  if (boton.dataset.accion === "eliminar") eliminarTarea(id);
});

cargarTareas();
