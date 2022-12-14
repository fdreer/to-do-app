import ajax from "./helpers/ajax.js";
import API from "./helpers/API.js"

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

        // console.log(e.target.id);
        if (e.target.matches('.change')) {
            actualizarTarea(e.target);
            // obtenerCantidadTareas();
        }
    })

    $tareasFinalizadas.addEventListener('click',(e)=>{

        // console.log(e.target.id);
        if (e.target.matches('.change')) {
            actualizarTarea(e.target);
            // obtenerCantidadTareas();
        }
    })    


    obtenerUsuario();
    obtenerCantidadTareas();

    function cerrarSesion() {
        localStorage.clear();
        location.replace('index.html');
    }

    function obtenerUsuario() {
        
        ajax({
            method: 'GET',
            url: API.getMe,
            jwt: token,
            cbSuccess: (json)=>{
                // console.log(json);
                pintarNombreUsuario(json);
                // return json
            }
        })
    }

    function pintarNombreUsuario({firstName}) {
        nombreUsuario.textContent = firstName;
    }

    function obtenerCantidadTareas() {
        
        ajax({
            method: 'GET',
            url: API.tasks,
            jwt: token,
            cbSuccess: (json)=>{
                // console.log(json);
                cantidadFinalizadas.textContent = json.filter(tarea => tarea.completed).length;
                renderizarTareas(json);
            }
        })
    }

    // Crea una tarea (POST) y renderiza la misma
    function crearTarea(tarea) {
        
        ajax({
            method: 'POST',
            url: API.tasks,
            jwt: token,
            cbSuccess: (json)=>{
                console.log(json);
                // Renderizar la tarea creada
                renderizarTareaPendiente(json);
            },
            body: {
                description: tarea,
                completed: false
            }
        })
    }

    // Renderizado de TODAS las tareas (utilizado cuando se inicia sesion o se recarga la pagina)
    function renderizarTareas(listado) {

        $tareasPendientes.innerHTML = '';
        $tareasFinalizadas.innerHTML = '';
    
        
        const tareaPendientes = listado.filter(tarea => !tarea.completed);
        const tareaFinalizadas = listado.filter(tarea => tarea.completed);

        tareaPendientes.forEach(task => {
            renderizarTareaPendiente(task);
        });

        tareaFinalizadas.forEach(task => {
            renderizarTareaFinalizada(task);
        })
    
    }

    function renderizarTareaPendiente(task) {
        const fecha =  new Date(task.createdAt).toLocaleString();
        $tareasPendientes.innerHTML +=  // html
        `<li class="tarea">
          <button type="button" title="Completar tarea" class="change" id="${task.id}"><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
            <p class="nombre">${task.description}</p>
            <p class="timestamp">${fecha}</p>
          </div>
        </li>`;
    }

    function renderizarTareaFinalizada(task) {
            // const fecha =  new Date( task.createdAt).toLocaleString();
            $tareasFinalizadas.innerHTML += // html
            `<li class="tarea">
              <div class="hecha">
                <i class="fa-regular fa-circle-check"></i>
              </div>
              <div class="descripcion">
                <p class="nombre">${task.description}</p>
                <div class="cambios-estados">
                  <button type="button" title="Cambiar estado" class="change incompleta" id="${task.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                  <button type="button" title="Eliminar tarea" class="borrar" id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
            </li>`
    }

    function actualizarTarea(target) {

        let data;
        let clase; 
        if(target.classList.contains('incompleta')){
          data = {"completed" : false}
          clase = false
        } else{
          data = {"completed" : true}
          clase = true
        }
    
        ajax({
            method:"PUT",
            url: `${API.taskId}/${target.id}`,
            jwt: token,
            cbSuccess:()=>{
                // Renderizar tarea
                // console.log('Funciona');
                target.parentNode.innerHTML = '';
                if (clase) {
                    ajax({
                        method:"GET",
                        url: `${API.taskId}/${target.id}`,
                        jwt: token,
                        cbSuccess:(json)=>{
                            renderizarTareaFinalizada(json);
                        }
                    });
                } else{
                    ajax({
                        method:"GET",
                        url: `${API.taskId}/${target.id}`,
                        jwt: token,
                        cbSuccess:(json)=>{
                            renderizarTareaPendiente(json);
                        }
                    });
                }
            },
            body: data
        })
    }

    function eliminarTarea(params) {
        
    }
})