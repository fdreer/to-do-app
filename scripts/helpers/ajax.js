export default async function ajax(props) {

    let {method,url,jwt,cbSuccess,body} = props;

    const options = {
        method: method,
        headers: {
            "Content-type":"application/json",
            "authorization": jwt
        },
        body: JSON.stringify(body)
    }

    const res = await fetch(url, options);
    const json = await res.json();

    cbSuccess(json);
}