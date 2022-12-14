export default async function ajax(props) {

    let {method,url,jwt,body} = props;

    const options = {
        method: method,
        headers: {
            "Content-type":"application/json",
            "authorization": jwt
        },
        body: JSON.stringify(body)
    }

    try{

        const res = await fetch(url, options);
        const json = await res.json();
        if (!res.ok) throw {status:res.status}
        return json
    } 
    catch(err){
        alertError(err);
    }
}

function alertError(err) {
    if (err.status === 400) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Contraseña incorrecta',
        })
    } else if(err.status === 404){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario no existe',
        })
    } else if(err.status === 500){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error del servidor',
        })
    }
}