import ajax from "./helpers/ajax.js";
import API from "./helpers/API.js"

window.addEventListener('load', function () {

    const form = document.querySelector('form');
    const inputNombre = document.querySelector('#inputNombre');
    const inputApellido = document.querySelector('#inputApellido');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const inputPasswordRepetida = document.querySelector('#inputPasswordRepetida');

    function obtenerDatosFormSignup() {
        
        const data = {
            firstName: inputNombre.value.trim(),
            lastName: inputApellido.value.trim(),
            email: inputEmail.value.trim(),
            password: inputPassword.value,
        }
        return data;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = obtenerDatosFormSignup();
        const validaciones = validacionDeInputs(data);

        if (validaciones) {
            realizarRegister(data);
            console.log('Se registra');
        } else{
            console.log('Rellenar todos los campos');
        }   
    });

    function realizarRegister(data) {

        // const usuarioCreado = await fetchPost(data, 'users');
        ajax({
            method:"POST",
            url: API.createUser,
            cbSuccess: (res)=>{

                if(res.jwt){
                    localStorage.setItem('jwt', res.jwt);
                    location.replace('mis-tareas.html');
                }
            },
            body: data
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                           VALIDACIONES DE CAMPOS                           */
    /* -------------------------------------------------------------------------- */

    form.addEventListener('input', (e)=>{
        

        if (e.target.matches('[type=text]')) {
            
            const field = e.target;
            const fieldValue = e.target.value;
            pintarErrores(field, validarNombreApellido(fieldValue));
        }

        if (e.target.matches('#inputPasswordRepetida')) {
            
            const field = e.target;
            const fieldValue = e.target.value;
            pintarErrores(field, inputPassword.value === inputPasswordRepetida.value || inputPasswordRepetida.value === '');
        }

    })

    function pintarErrores(input, validacion) {

        !validacion ? input.classList.add('error') : input.classList.remove('error');
    }

    function validarNombreApellido(nombreValue) {

        const regex = new RegExp("^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$");
        return regex.test(nombreValue);
    }

    function validarEmail(emailValue) {

        const regex = new RegExp("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$");
        return regex.test(emailValue);
    }

    function validarPassword(passwordValue) {
        
        const passwordRepetida = inputPasswordRepetida.value;
        return passwordValue === passwordRepetida;
    }

    function validacionDeInputs(data) {
        
        const {firstName, lastName, email, password} = data;
        return validarNombreApellido(firstName) && validarNombreApellido(lastName) && validarEmail(email) && validarPassword(password);
    }
});