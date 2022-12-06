window.addEventListener('load', function () {
    const form = document.querySelector('form');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            email: inputEmail.value, 
            password: inputPassword.value
        }

        realizarLogin(data);
    })


    async function realizarLogin(datos) {

        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(datos)
        }

        try {
            
            const res = await fetch('http://todo-api.ctd.academy:3000/v1/users/login', options)
            const json = await res.json();

            // console.log(res);
            // console.log(json);

            if (!res.ok) throw {
                status: res.status,
                statusText: res.statusText
            }

            if(json.jwt){
                localStorage.setItem('jwt', json.jwt);
                location.replace('mis-tareas.html');
            }


        } catch (err) {
            console.log(err);
        }
    }
});