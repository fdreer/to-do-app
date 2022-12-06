// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

let token = localStorage.getItem('jwt');
if(!token) {
  location.replace('index.html');
}
console.log(token);

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  // Cuando se carga la ventana del navegador se crean las variables y se ejecutan las funciones:
  const btnCerrarSesion = document.querySelector('#closeApp');
  const formCrearTarea = document.querySelector('.nueva-tarea');
  const $tareasPendientes = document.querySelector('.tareas-pendientes');
  const $tareasTerminadas = document.querySelector('.tareas-terminadas');
  obtenerNombreUsuario();
  consultarTareas();
  

  btnCerrarSesion.addEventListener('click', function () {
   
    localStorage.removeItem('jwt');
    location.replace('signup.html');
  });

  async function obtenerNombreUsuario() {
   
    const nombreUsuario = document.querySelector('.user-info p');

    const options = {
      method: 'GET',
      headers: {
        "Content-type": "application/json",
        authorization: token
      },
    } 

    try {
      
      const res = await fetch('http://todo-api.ctd.academy:3000/v1/users/getMe', options);
      const json = await res.json();
  
      nombreUsuario.textContent = json.firstName;
    } catch (err) {
      console.log(err);
    }
  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  async function consultarTareas() {
    
    const options = {
      method: 'GET',
      headers: {
        "Content-type": "application/json",
        authorization: token
      },
    } 

    try {
      
      const res = await fetch('http://todo-api.ctd.academy:3000/v1/tasks', options);
      const json = await res.json();

      console.log(json);
      renderizarTareas(json);
  
    } catch (err) {
      console.log(err);
    }
  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (e) {
    
    e.preventDefault();
    const inputNuevaTarea = document.querySelector('#nuevaTarea').value;

    crearNuevaTarea(inputNuevaTarea);
    // renderizarTareaSync(inputNuevaTarea);
  });

  async function crearNuevaTarea(description) {
    const options = {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        authorization: token
      },
      body: JSON.stringify({
        "description": description,
        "completed": false
      })
    } 

    try {
      
      const res = await fetch('http://todo-api.ctd.academy:3000/v1/tasks', options);
      const json = await res.json();

      // console.log(json);
      renderizarTareaSync(description);
    } catch (err) {
      console.log(err);
    }

  }


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    const tareasPendientes = listado.filter(tarea => tarea.completed === false);
    const tareasCompletadas = listado.filter(tarea => tarea.completed === true);

    // console.log(tareasPendientes);
    // console.log(tareasCompletadas);

    tareasPendientes.forEach(tarea => {

      const fecha = new Date(tarea.createdAt).toLocaleString();
      document.querySelector('.tareas-pendientes').innerHTML += //html        
                `   <li class="tarea" id="${tarea.id}">
                      <button type="button" title="Completar tarea" class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
                      <div class="descripcion">
                        <p class="nombre">${tarea.description}</p>
                        <p class="timestamp">${fecha}</p>
                      </div>
                    </li>`
    })

    document.querySelector('#cantidad-finalizadas').textContent = tareasCompletadas.length;
    tareasCompletadas.forEach(tarea => {
      document.querySelector('.tareas-terminadas').innerHTML += //html
      `   <li class="tarea" id="${tarea.id}">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button type="button" title="Cambiar estado" class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button type="button" title="Eliminar tarea" class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>`
    })

    
  };

  function renderizarTareaSync(description) {

    const fecha = new Date().toLocaleString();

    document.querySelector('.tareas-pendientes').innerHTML += //html
    `   <li class="tarea">
          <button type="button" title="Completar tarea" class="change" id=""><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
            <p class="nombre">${description}</p>
            <p class="timestamp">${fecha}</p>
          </div>
        </li>`
  }

  $tareasPendientes.addEventListener('click', (e)=>{

    if (e.target.matches('.change')) {
      console.log('Funciona');
      botonesCambioEstado(e.target);
    }
  })

  $tareasTerminadas.addEventListener('click',(e)=>{
    
    if (e.target.matches('.change')) {
      console.log('Funciona');
      botonesCambioEstado(e.target);
    }
  })


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  async function botonesCambioEstado(boton) {
    
    let body;
    if(boton.classList.contains('incompleta')){
      // cambiar completed = false
      body = {"completed" : false};
    }else{
      // cambiar completed = true
      body = {"completed" : true};
    }

    const options = {
      method: "PUT",
      headers: {
        "Content-type":"application/json",
        authorization: token
      },
      body: JSON.stringify(body)
    }

    const res = await fetch(`http://todo-api.ctd.academy:3000/v1/tasks/${boton.id}`, options);
  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
   
    

    

  };

});