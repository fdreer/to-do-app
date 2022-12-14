import ajax from "./helpers/ajax.js";
import API from "./helpers/API.js";

const token = localStorage.getItem('jwt');
if (!token) {
    location.replace('index.html');
}

window.addEventListener('load', ()=> {

    const btnCerrarSesion = document.querySelector('#closeApp');
    const nombreUsuario = document.querySelector('#nombre-usuario');
    const cantidadFinalizadas = document.querySelector('#cantidad-finalizadas');
    const form = document.querySelector('.nueva-tarea');
    const $tareasPendientes = document.querySelector('.tareas-pendientes');
    const $tareasFinalizadas = document.querySelector('.tareas-terminadas');
    
    btnCerrarSesion.addEventListener('click',cerrarSesion);
    form.addEventListener('submit', (e)=>{
        const inputNuevaTarea = document.querySelector('#nuevaTarea').value;
        e.preventDefault();
        crearTarea(inputNuevaTarea);
        form.reset();
    });

    $tareasPendientes.addEventListener('click',(e)=>{
        if (e.target.matches('.change')) {
            actualizarTarea(e.target);
        }
    })

    $tareasFinalizadas.addEventListener('click',(e)=>{
        if (e.target.matches('.change')) {
            actualizarTarea(e.target);
        }
    })

    $tareasFinalizadas.addEventListener('click',(e)=>{
        if (e.target.matches('.borrar')) {
            eliminarTarea(e.target);
        }
    })

    pintarNombreUsuario();
    renderizarTareas();


    function cerrarSesion() {

        Swal.fire({
            title: 'Estas seguro de cerrar sesion?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire(
                // 'Sesion Cerrada!',
                // 'Your file has been deleted.',
                // 'success'
                // )
                localStorage.clear();
                location.replace('index.html');        
            }
        })

    }

    async function obtenerUsuario() {
        
        const json = await ajax({
            method: 'GET',
            url: API.getMe,
            jwt: token,
            // cbSuccess: (json)=>{
            //     pintarNombreUsuario(json);
            // }
        })
        return json;
    }

    async function pintarNombreUsuario() {
        const {firstName} = await obtenerUsuario();
        nombreUsuario.textContent = firstName;
    }

    async function obtenerTareas() {
        
        const json = await ajax({
            method: 'GET',
            url: API.tasks,
            jwt: token,
        })
        // console.log(json);
        return json;
    }

    // Renderizado de TODAS las tareas (utilizado cuando se inicia sesion o se recarga la pagina)
    async function renderizarTareas() {
        const json = await obtenerTareas();

        cantidadFinalizadas.textContent = json.filter(tarea => tarea.completed).length;

        $tareasPendientes.innerHTML = '';
        $tareasFinalizadas.innerHTML = '';

        json.forEach(task => {
            renderizarTarea(task);
        });
    }

    function renderizarTarea({completed, createdAt, description, id}) {
        if (completed) {

            $tareasFinalizadas.innerHTML += // html
            `<li class="tarea">
              <div class="hecha">
                <i class="fa-regular fa-circle-check"></i>
              </div>
              <div class="descripcion">
                <p class="nombre">${description}</p>
                <div class="cambios-estados">
                  <button type="button" title="Cambiar estado" class="change incompleta" id="${id}" ><i class="fa-solid fa-rotate-left"></i></button>
                  <button type="button" title="Eliminar tarea" class="borrar" id="${id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
            </li>`
        } else {

            const fecha =  new Date(createdAt).toLocaleString();
            $tareasPendientes.innerHTML +=  // html
            `<li class="tarea">
              <button type="button" title="Completar tarea" class="change" id="${id}"><i class="fa-regular fa-circle"></i></button>
              <div class="descripcion">
                <p class="nombre">${description}</p>
                <p class="timestamp">${fecha}</p>
              </div>
            </li>`;
        }
    }

    // // Crea una tarea (POST) y renderiza la misma
    async function crearTarea(tarea) {
        
        const json = await ajax({
            method: 'POST',
            url: API.tasks,
            jwt: token,
            body: {
                description: tarea,
                completed: false
            }
        })
        // console.log(json);
        renderizarTarea(json);
    }

    async function actualizarTarea(target) {

        let data;
        let clase; 
        if(target.classList.contains('incompleta')){
          data = {"completed" : false}
          clase = false
        } else{
          data = {"completed" : true}
          clase = true
        }
    
        await ajax({
            method:"PUT",
            url: `${API.taskId}/${target.id}`,
            jwt: token,
            body: data
        })
        // console.log(json);
        renderizarTareas();
    }

    async function eliminarTarea(target) {

        await ajax({
            method:"DELETE",
            url: `${API.taskId}/${target.id}`,
            jwt: token,
        })
        renderizarTareas();
    }
})