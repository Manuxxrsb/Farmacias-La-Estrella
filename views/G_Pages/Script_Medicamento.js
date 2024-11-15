document.addEventListener('DOMContentLoaded', (event) => {
    GetInformacion();
});

//----------------- VARIABLES DE ENTORNO --------------------------------
let CategoriasList;
let medicamentosList;
let Listadeproveedores;

function GetInformacion() {

    fetch('http://localhost:8080/categorias')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            CategoriasList = Object.values(data);
            GetMedicamentos();
            agregaopcionescategoria(CategoriasList);
        })
        .catch(error => console.error(error));

}

function GetMedicamentos(){
    fetch('http://localhost:8080/medicamentos')
    .then(response => response.json()) // Acceder a los datos de la API como JSON
    .then(data => {
        medicamentosList = Object.values(data); // Guardar la lista de medicamentos en medicamentosList
        console.log(medicamentosList);
        ObtenerProveedores();
    })
    .catch(error => console.error(error));
}

function ObtenerProveedores(){
    fetch('http://localhost:8080/proveedores')
    .then(response => response.json())    
    .then(data =>{
        Listadeproveedores = Object.values(data);
        console.log(Listadeproveedores);
        displayMedicamentos(medicamentosList);
    })
    .catch(error => console.log(error));
}

//---------------------------------------------------------------------------

function displayMedicamentos(listaMedicamentos) {

    let p = document.querySelector('tbody.Item-Medicamento');
    let texto = ''; // Información que entrega el JSON
    for (let i = 0; i < listaMedicamentos.length; i++) {
    //console.log(proveedor);
        texto += `<tr class="Item-Medicamento">
                        <td>${listaMedicamentos[i].ID}</td>
                        <td>${listaMedicamentos[i].nombre}</td>
                        <td>${listaMedicamentos[i].marca}</td>
                        <td>${listaMedicamentos[i].descripcion}</td>
                        <td>${listaMedicamentos[i].numerolote}</td>
                        <td>${listaMedicamentos[i].fechafabric}</td>
                        <td>${listaMedicamentos[i].fechavence}</td>
                        <td>${listaMedicamentos[i].stock}</td>
                        <td>${listaMedicamentos[i].categoria_id}</td>
                        <td>${listaMedicamentos[i].ProveedorID}</td>
                        <td>${listaMedicamentos[i].bioequivalente}</td> 
                        <td>${listaMedicamentos[i].precio}</td>	
                        <td>
                            <button onclick="eliminarMedicamento(${listaMedicamentos[i].ID})">Eliminar</button>
                            <button onclick="editarMedicamento(${listaMedicamentos[i].ID})">Editar</button>
                        </td>
                </tr>`;
    }
    p.innerHTML = texto;

    agregaopcionesProveedor(Listadeproveedores);
}

//----- Funcion para Filtrar medicamentos-------------------
function filterMedicamentos() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase(); // Convertir a minúsculas para comparación
    const filteredMedicamentos = medicamentosList.filter(medicamento => {
        return (
            medicamento.nombre.toLowerCase().includes(filter) ||
            medicamento.marca.toLowerCase().includes(filter) ||
            medicamento.descripcion.toLowerCase().includes(filter) ||
            medicamento.numerolote.toLowerCase().includes(filter) ||
            medicamento.fechafabric.toLowerCase().includes(filter) ||
            medicamento.fechavence.toLowerCase().includes(filter) ||
            medicamento.stock.toString().includes(filter) ||
            medicamento.CategoriaID.toString().includes(filter) ||
            medicamento.bioequivalente.toString().includes(filter) ||
            medicamento.ProveedorID.toString().includes(filter) ||
            medicamento.precio.toString().includes(filter)

        );
    });

    displayMedicamentos(filteredMedicamentos); // Mostrar los medicamentos filtrados
}
//---------- BOTONES -----
function eliminarMedicamento(id) { //hacer que en vez de eliminar se pitee el stock pero mantenga la informacion
    fetch(`http://localhost:8080/medicamentos/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert('Medicamento eliminado con éxito.');
                GetInformacion(); // Volver a cargar la lista de medicamentos
            } else {
                alert('Error al eliminar el medicamento.');
            }
        })
        .catch(error => console.error('Error:', error));
}

//FUNCION QUE ASIGNA LOS VALORES DE UN MEDICAMENTO A LOS CAMPOS DEL FORMULARIO DE EDICION
function editarMedicamento(id) {

    const medicamento = medicamentosList.find(m => m.ID === id);
    if (medicamento) {
        document.getElementById('editId').value = medicamento.ID;
        document.getElementById('editNombre').value = medicamento.nombre;
        document.getElementById('editMarca').value = medicamento.marca;
        document.getElementById('editDescripcion').value = medicamento.descripcion;
        document.getElementById('editNumerolote').value = medicamento.numerolote;
        document.getElementById('editFechafabric').value = medicamento.fechafabric;
        document.getElementById('editFechavence').value = medicamento.fechavence;
        document.getElementById('editStock').value = medicamento.stock;
        document.getElementById('editPrecio').value = medicamento.precio;
        document.getElementById('editCategoria').value = medicamento.categoria_id; // Asegúrate de que esto funcione
        document.getElementById('editProveedor').value = medicamento.ProveedorID;
        document.getElementById('editModal').style.display = 'block';
    }
}

//---------------------

function cerrarModal() {
    document.getElementById('editModal').style.display = 'none';
}

//---------------- FORMULARIO DE EDICION DE MEDICAMENTO -----------------

function agregaopcionescategoria(Categorias) {
    let p = document.getElementById('editCategoria');
    let opciones = '';
    for (let i = 0; i < Categorias.length; i++) {
        opciones += `<option value="${Categorias[i].ID}">${Categorias[i].nombre}</option>`;
    }
    p.innerHTML = opciones;
}

function agregaopcionesProveedor(proveedores){
    let p= document.getElementById('editProveedor');
    let opciones = '';
    for(let i=0; i < proveedores.length; i++){
        opciones += `<option value="${proveedores[i].ID}">${proveedores[i].nombre}</option>`
    }
    p.innerHTML = opciones;
}

document.getElementById('editForm').addEventListener('submit', actualizarMedicamento);

function actualizarMedicamento(event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;
    const medicamentoActualizado = {
        nombre: document.getElementById('editNombre').value,
        marca: document.getElementById('editMarca').value,
        descripcion: document.getElementById('editDescripcion').value,
        numerolote: document.getElementById('editNumerolote').value,
        fechafabric: document.getElementById('editFechafabric').value,
        fechavence: document.getElementById('editFechavence').value,
        stock: document.getElementById('editStock').value,
        bioequivalente: document.getElementById('editBioequivalente').value,
        categoriaId: parseInt(document.getElementById('editCategoria').value),
        precio: document.getElementById('editPrecio').value,
        proveedorID: parseInt(document.getElementById('editProveedor').value),
    };

    console.log(medicamentoActualizado);

    fetch(`http://localhost:8080/medicamentos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicamentoActualizado)
    })
        .then(response => {
            if (response.ok) {
                alert('Medicamento actualizado con éxito.');
                cerrarModal();
                GetInformacion();
            } else {
                alert('Error al actualizar el medicamento.');
            }
        })
        .catch(error => console.error('Error:', error));
}