// Logica del cliente de TaskManager
const API = "/api/tareas";
const ESTADOS = ["Pendiente", "En proceso", "Terminada"];

const formTarea = document.getElementById("form-tarea");
const lista = document.getElementById("lista-tareas");
const sinTareas = document.getElementById("sin-tareas");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");
const filtroEstado = document.getElementById("filtro-estado");
const filtroPrioridad = document.getElementById("filtro-prioridad");
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
  li.className = `tarea prioridad-${tarea.prioridad.toLowerCase()} estado-${tarea.estado.toLowerCase().replace(" ", "-")}`;
  li.dataset.id = tarea.id;
  li.innerHTML = `
    <div class="tarea-cabecera">
      <h3>${escaparHTML(tarea.nombre)}</h3>
      <span class="etiqueta etiqueta-${tarea.prioridad.toLowerCase()}">${escaparHTML(tarea.prioridad)}</span>
    </div>
    ${tarea.descripcion ? `<p>${escaparHTML(tarea.descripcion)}</p>` : ""}
    <div class="tarea-acciones">
      <select class="selector-estado" data-accion="estado" aria-label="Estado de la tarea">
        ${ESTADOS.map((e) => `<option value="${e}" ${e === tarea.estado ? "selected" : ""}>${e}</option>`).join("")}
      </select>
      <button type="button" class="btn btn-secundario" data-accion="editar">Editar</button>
      <button type="button" class="btn btn-peligro" data-accion="eliminar">Eliminar</button>
    </div>
  `;
  return li;
}

function renderizar() {
  const visibles = tareas.filter(
    (t) =>
      (!filtroEstado.value || t.estado === filtroEstado.value) &&
      (!filtroPrioridad.value || t.prioridad === filtroPrioridad.value)
  );
  lista.innerHTML = "";
  visibles.forEach((t) => lista.appendChild(crearElementoTarea(t)));
  sinTareas.textContent = tareas.length
    ? "No hay tareas que coincidan con los filtros."
    : "Todavía no hay tareas registradas.";
  sinTareas.classList.toggle("oculto", visibles.length > 0);
  contador.textContent = `${visibles.length} de ${tareas.length} ${tareas.length === 1 ? "tarea" : "tareas"}`;
}

filtroEstado.addEventListener("change", renderizar);
filtroPrioridad.addEventListener("change", renderizar);

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

// RF05 - Cambiar estado
lista.addEventListener("change", async (evento) => {
  const selector = evento.target.closest("select[data-accion='estado']");
  if (!selector) return;
  const id = Number(selector.closest(".tarea").dataset.id);
  try {
    await peticion(`${API}/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado: selector.value }),
    });
    mostrarMensaje(`Estado cambiado a "${selector.value}".`);
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

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

// RF05 - Cambiar estado
lista.addEventListener("change", async (evento) => {
  const selector = evento.target.closest("select[data-accion='estado']");
  if (!selector) return;
  const id = Number(selector.closest(".tarea").dataset.id);
  try {
    await peticion(`${API}/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado: selector.value }),
    });
    mostrarMensaje(`Estado cambiado a "${selector.value}".`);
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.closest(".tarea").dataset.id);
  if (boton.dataset.accion === "editar") abrirEdicion(id);
  if (boton.dataset.accion === "eliminar") eliminarTarea(id);
});

cargarTareas();
