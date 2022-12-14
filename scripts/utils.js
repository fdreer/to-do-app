/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
    
}

function normalizarTexto(texto) {
    
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    
}

function normalizarEmail(email) {
    
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    
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
