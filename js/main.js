const productosOutput = document.getElementById("productosOutput");
const txtOwner = document.getElementById("txtOwner");
const selectoProd = document.getElementById("selectoProd");
const toDeliver = document.getElementById("toDeliver");

const userPatt = new RegExp("^[a-zA-Z0-9_-]{3,15}$");

let menu;
let noPedido = 100;

//Carga el contenido del menú a la barra de selección
function loadMenu(){
    fetch("./assets/productos.json")
    .then(resp => resp.json())
    .then(resp => {
        menu=resp;
        selectoProd.innerHTML = "";
        resp.forEach(insertMenu);
    })
    .catch(err => console.error("error: "+err.message()));
}//loadMenu()

//Generar el menú de selección
function insertMenu(prod){
    selectoProd.insertAdjacentHTML("beforeend",`
        <option value="${prod.id}">${prod.nombre}: $${prod.precio}</option>
        `);
}//insertMenu()

function tiempoPreparacion() {
    return Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
}//tiempoPreparacion()

function handleClick(event){
    event.preventDefault();
    for(let producto of menu){
        if(producto.id===selectoProd.value)
            insertPedido(producto);
    }   
}//handleClick()

function validarPedido(){
    let isValid = true;

    if(!userPatt.test(txtOwner.value.trim()))
        isValid = false;
    

    return isValid;
}

function limpiarForm(){
    txtOwner.value="";
    txtOwner.focus();
}//limpiarForm


function insertPedido(prod){

    if(!validarPedido()){//Validación de los campos
        Swal.fire({
            title: 'Error!',
            text: 'Ingresa tu nombre',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return;
    }

    const timeorder = tiempoPreparacion();
    
    productosOutput.insertAdjacentHTML("beforeend",`
        <li class="list-group-item" id="orderNo${noPedido++}">
            <div class="card d-flex flex-row w-100">
                <img src="${prod.imagen}" class="card-img-top w-50 " alt="${prod.nombre}" referrerpolicy="no-referrer">
                <div class="card-body w-75 d-flex flex-column justify-content-center align-items-center">
                    <h5 class="card-title">Pedido de: ${txtOwner.value}</h5>
                    <p class="card-text">${prod.nombre} - $${prod.precio} - ${(timeorder/1000).toFixed(1)} segundos ${toDeliver.checked?"para llevar":""} </p>
                    <!-- Button trigger modal -->
                    
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">En proceso</span>
                    </div>
                </div>
            </div>

        </li>
        `);

    const spinner = document.getElementById(`orderNo${noPedido-1}`).getElementsByClassName("spinner-border").item(0);
    setTimeout(()=>{orderComplete(spinner)},timeorder);
    limpiarForm();
}

function orderComplete(spinner){
    spinner.outerHTML = `
    <button type="button" class="btn btn-primary" onclick="recogerPedido(event);">
        Recoger
    </button>
    `;    
}

function recogerPedido(event){
    event.preventDefault();

    Swal.fire({
        title: "Gracias por su preferencia!",
        text: "Vuelva pronto",
        icon: "success"
    });
    event.target.closest("li.list-group-item").remove();
    
}//recogerPedido

//Listeners
document.addEventListener("DOMContentLoaded",loadMenu);


