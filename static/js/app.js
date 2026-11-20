// Logica del cliente de TaskManager
const API = "/api/tareas";

const formTarea = document.getElementById("form-tarea");
const lista = document.getElementById("lista-tareas");
const sinTareas = document.getElementById("sin-tareas");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

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
    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

cargarTareas();
