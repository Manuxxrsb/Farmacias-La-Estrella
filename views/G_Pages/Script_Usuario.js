function prueba() {
    //alert("soy una alerta")
    const url = 'http://localhost:8080/usuarios'
    fetch(url)
        .then(response => response.json()) // accessing the API data as JSON
        .then(data => {

            const lista = Object.values(data)
            const p = document.querySelector('tbody.Item-Usuarios')
            var texto = []
            for (let i = 0; i < lista.length; i++) {

                texto = texto + (`<tr><td>${lista[i].Id}</td>
                        <td>${lista[i].nombre}</td>
                        <td>${lista[i].apellido}</td>
                        <td>
                            <button onclick="eliminar(${lista[i].Id})">Eliminar</button>
                        </td>
                        </tr>
                        `)
            }

            p.innerHTML = texto


        })
        .catch(error => console.error(error))
}

function eliminar(id) {
    const url = `http://localhost:8080/usuario/${id}`
    fetch(url, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            prueba()
        })
        .catch(error => console.error(error))
}