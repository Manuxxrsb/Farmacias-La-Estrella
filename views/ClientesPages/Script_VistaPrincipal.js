
const boleta = {
    Usuario : "",
    email: "",
    Medicamentos:[]
};

document.addEventListener('DOMContentLoaded', (event) => {
    ObtenerMedicamentos();
    let galleta = document.cookie.split(",");
    nombreUsuario(galleta[1],galleta[2]);
});


function Adquirir(ID){
    fetch(`http://localhost:8080/medicamento/${ID}`)
    .then(data => data.json())
    .then(data => {
        let medicamento = data;
        let valor = prompt(`Ingrese la cantidad que llevaras (stock actual: ${medicamento.stock}) ` );
        console.log("valor del promp");
        console.log(valor);

        if(valor > medicamento.stock || valor == 0 || valor === null || valor.trim() === "" || contieneCaracteresEspeciales(valor) != false){
            alert(`Por favor ingresa un valor Valido menor o igual que ${medicamento.stock}`);
            Adquirir(ID);
        }else{
            let precio = medicamento.precio;
            medicamento.stock = valor;
            medicamento.precio = (precio * valor);
            boleta.Medicamentos.push(medicamento);
            alert("Medicamento agregado correctamente");
        }
    })
    .catch(error => console.log(error));  
    console.log("Boleta actualizada");
    console.log(boleta);
}

function contieneCaracteresEspeciales(valor) {
    const regex = /[!@#$%^&*(),.?":{};_=+/'¿°|<>-]/;
    return regex.test(valor);
}

function nombreUsuario(nombre,email){
    boleta.Usuario = nombre;
    boleta.email = email;
    let p = document.querySelector("div.saludo");
    if (p !== null) {
        p.innerHTML = `<h1 class="title-home">Bienvenido, ${nombre}</h1>`;
    } else {
        console.error("Elemento 'div.saludo' no encontrado");
    }
}

function ObtenerMedicamentos(){
    fetch('http://localhost:8080/medicamentos')
    .then(response => response.json())
    .then(data => {
        const medicamentosContainer = document.getElementById('medicamentos');
        const row = document.createElement('div');
        row.classList.add('row');
        medicamentosContainer.appendChild(row);
    data.forEach(medicamento => {
        if(medicamento.stock >0){
            const card = document.createElement('div');
            card.classList.add('card', 'col-md-3');
            card.innerHTML = `
                <img class="card-img-top" src="/views/ClientesPages/img/medicamento.png" alt="${medicamento.nombre}">
                <div class="card-body">
                    <h2 class="card-title">${medicamento.nombre}</h5>
                    <h6 class="card-text">${medicamento.marca}</h6>
                    <h6>${medicamento.descripcion}</h6> <h5> $${medicamento.precio}</h5>
                    <button class="btn btn-primary" onclick="Adquirir(${medicamento.ID})">Adquirir</button>
                </div>
            `;
            row.appendChild(card);
        }
    });
    })
    .catch(error => console.error(error));
}

function Carrito(){
    let infoBoleta = `|||   Carrito de Compra   ||| \n\n Usuario: ${boleta.Usuario}\n Email: ${boleta.email}\n Medicamentos | [Cantidad] | $ Precio`;
    let Subtotal = 0;

    boleta.Medicamentos.forEach(medicamento => {
        infoBoleta += `\n- ${medicamento.nombre} \t ${medicamento.stock} \t $${(medicamento.precio)}`;
        Subtotal += medicamento.precio;
    });
    infoBoleta += `\n\nSubtotal: $${Subtotal}`;
    alert(infoBoleta);
}

function Imprimir(){
    let infoBoleta = `|||   Farmacias La Estrella   ||| \n||    BOLETA  ||\n\nUsuario: ${boleta.Usuario}\nEmail: ${boleta.email}\nMedicamentos | [ Cantidad ] | $ Valor`;
    let Subtotal = 0;
    boleta.Medicamentos.forEach(medicamento => {
        infoBoleta += `\n- ${medicamento.nombre} \t [${medicamento.stock}] \t $${medicamento.precio}`;
        Subtotal += medicamento.precio;
    });
    infoBoleta += `\n\nSubtotal: $${Subtotal}`;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text( `${infoBoleta}` , 25 ,25);
    doc.save("documento.pdf");
}
