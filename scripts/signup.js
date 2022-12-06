window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
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

        // console.log(validaciones.firstNameVerification);
        // console.log(validaciones.lastNameVerification);
        // console.log(validaciones.emailVerification);
        // console.log(validaciones.passwordVerification);


        if (validaciones) {
            realizarRegister(data);
            console.log('Se registra');
        } else{
            console.log('Rellenar todos los campos');
        }

        
    });

    async function realizarRegister(data) {

        const options = {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(data),
        }

        try {

            const res = await fetch('http://todo-api.ctd.academy:3000/v1/users', options);
            const json = await res.json();

            console.log(res);
            console.log(json);
            console.log(json.jwt);
            if( json.jwt){
                localStorage.setItem('jwt', json.jwt);
                location.replace('mis-tareas.html');
            }
        } catch (err) {
            console.log(err);
        }
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

        // const dataVerification = {
        //     firstNameVerification: validarNombreApellido(firstName),
        //     lastNameVerification: validarNombreApellido(lastName),
        //     emailVerification: validarEmail(email),
        //     passwordVerification: validarPassword(password)
        // }


        return validarNombreApellido(firstName) && validarNombreApellido(lastName) && validarEmail(email) && validarPassword(password);
    }
});