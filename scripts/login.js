import ajax from "./helpers/ajax.js";
import API from "./helpers/API.js"

window.addEventListener('load', ()=>{

    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (e)=>{

        e.preventDefault();
        realizarLogin({email:inputEmail.value, password:inputPassword.value});
    })

    async function realizarLogin(data) {

        const json = await ajax({
            method:'POST',
            url: API.loginUser,
            body: data
        })

        if (json.jwt) {
            localStorage.setItem('jwt', json.jwt);
            location.replace('mis-tareas.html');
        }
    }
})