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

    function realizarLogin(data) {

        // const res = await fetchPost({body:data, direccion:'users/login'});
        ajax({
            method:'POST',
            url: API.loginUser,
            cbSuccess:(res)=>{

                if (res.jwt) {
                    localStorage.setItem('jwt', res.jwt);
                    location.replace('mis-tareas.html');
                }
            },
            body: data
        })
    }
})