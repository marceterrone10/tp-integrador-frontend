// Variables globales
let nombreAlumno = document.querySelector(".nombreAlumnos");
const productosContainer = document.querySelector(".productos-container");
let productos = []; // Inicializo la variable productos como un array vacío
let carrito = []; // Inicializo el carrito como un array vacío
const carritoContainer = document.querySelector(".productos-carrito");
let acumuladorTotal = document.querySelector(".precio-total"); // Contenedor del total del carrito
const btnVaciar = document.querySelector(".btn-vaciar"); // Botón para vaciar el carrito
const barraBusqueda = document.querySelector(".barra-busqueda"); // Barra de búsqueda para filtrar productos
const btnCategoria = document.querySelectorAll(".btn-categoria"); // Botón para filtrar por categoría. querySelectorAll devuelve una lista con todos los elementos que coinciden con .btn-categoria en este caso



/* Funcion para imprimir nombre de alumnos en header */
function imprimirDatosAlumnos(){
    let detallesAlumno = "";
    let alumnos = [
        { nombre: "Marcelo", apellido: "Terrone" },
        { nombre: "Fabricio", apellido: "Quiroga" }
    ];
    detallesAlumno += `${alumnos[0].nombre} ${alumnos[0].apellido} y ${alumnos[1].nombre} ${alumnos[1].apellido}`;

    nombreAlumno.innerHTML = detallesAlumno; // Inyecta el nombre de los alumnos en el contenedor del header
    console.log(detallesAlumno); // Imprime en consola el nombre de los alumnos

}

/* Funcion para renderizar productos */

document.addEventListener('DOMContentLoaded', () => {
    //let productos = []; // Inicializo la variable productos como un array vacío
    const productosContainer = document.querySelector('.productos-container');
    async function fetchProductos(url) {
        let response = await fetch(url); // Espera a que la respuesta sea recibida
        let data = await response.json(); // Convierto respuesta a JSON para poder trabajar
        //console.log(data); // muestro la data en consola
        productos = data.payload; // Asigno la data a la variable productos

        renderizarProductos(productos);
    };

    function renderizarProductos(array) {
        productosContainer.innerHTML = ""; // Limpio el contenedor de productos antes de renderizar

        array.forEach(producto => {  // data.payload para acceder a los productos
            productosContainer.innerHTML += `
                <div class="producto-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                    <h3>${producto.nombre}</h3>
                    <h4> ${producto.marca} </h2>
                    <p>Precio: $${producto.precio}</p>
                    <button class="btn-agregar-carrito" data-id="${producto.id}" onclick="agregarProducto(${producto.id})">Agregar al carrito</button>
                </div>
            `;
        });
    }

    window.agregarProducto = function(productoId) { // window para que la función sea global y pueda ser llamada desde el HTML
        let productoSeleccionado = productos.find(prod => prod.id === productoId);
        let itemCarrito = carrito.find(prod => prod.id === productoId); // Verifica si el producto ya está en el carrito

        if (itemCarrito) {
            itemCarrito.cantidad += 1;
        } else {
            productoSeleccionado.cantidad = 1;
            carrito.push(productoSeleccionado); // Si no está en el carrito, lo agrega
        };

        console.log(carrito);
        mostrarCarrito(carrito); // Muestra el carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito)); // JSON.stringify para que convierta el array a un string y pueda guardarlo en localStorage
    };

    window.eliminarProducto = function(productoId) {
        const index = carrito.findIndex(prod => prod.id === productoId); // Encuentra el índice del producto a eliminar
        carrito.splice(index, 1); // Elimina el producto del carrito
        console.log(carrito);
        mostrarCarrito(carrito); // Muestra el carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualiza el localStorage
    };


    // Funcion para mostrar carrito
    function mostrarCarrito(array){
        let carritoHTML = ""; // Inicializo el contenedor del carrito vacío
        let acumulador = 0; // Inicializo el acumulador para el total del carrito
        
        for (let i = 0; i < array.length; i++) {
            carritoHTML += `
                <div class="producto-carrito">
                    <img src="${array[i].imagen}" alt="${array[i].nombre}" class="producto-imagen">
                    <h3>${array[i].nombre}</h3>
                    <h4> ${array[i].marca} </h4>
                    <p>Precio: $${array[i].precio}</p>
                    <div class="botones-carrito">
                        <button class="btn-mas" data-id="${array[i].id}"> + </button>
                        <button class="btn-menos" data-id="${array[i].id}"> - </button>
                    </div>
                    <button class="btn-eliminar" onclick="eliminarProducto(${array[i].id})">Eliminar</button>
                    <div class="cantidad-producto"> 
                        <span>Cantidad: </span>
                        <span class="cantidad">${array[i].cantidad || 1}</span> 
                    </div>
                </div>
            `; // data-id para identificar el producto en los botones de cantidad
            acumulador += parseFloat(array[i].precio) * (array[i].cantidad || 1); // Acumula el precio de cada producto en el carrito
            // estaba en string, lo parseo a float para poder sumar correctamente
        }
        carritoContainer.innerHTML = carritoHTML; // Inyecto el HTML generado en el contenedor del carrito
        acumuladorTotal.innerHTML = `$${acumulador}`; // Actualizo el total del carrito

        agregarEventosCantidad(); // Llama a la función para agregar eventos a los botones de cantidad
    };

    // Evento para vaciar el carrito
    btnVaciar.addEventListener("click", () => {
        carrito.length = 0; // Vacía el carrito asignando un array vacío
        mostrarCarrito(carrito); // Muestra el carrito vacío
        localStorage.removeItem('carrito'); // Elimina el carrito del localStorage
        console.log("Carrito vaciado");
    });

    // Evento para filtrar productos por nombre
    barraBusqueda.addEventListener("keyup", () => {
        let valorInput = barraBusqueda.value; // Obtiene el valor de la barra de búsqueda
        let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valorInput.toLowerCase()));

        renderizarProductos(productosFiltrados); // Renderiza los productos filtrados
    });

    // Evento para filtrar productos por categoria
    btnCategoria.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const categoriaSeleccionada = e.target.textContent.trim(); // Obtiene el texto del botón de categoría seleccionado

            if (categoriaSeleccionada === "Todos"){
                renderizarProductos(productos); // Si es "Todos", muestra todos los productos
            } else {
                const productosFiltrados = productos.filter(producto => producto.categoria === categoriaSeleccionada);
                renderizarProductos(productosFiltrados); // Renderiza los productos filtrados por categoría
            };
        });
    });

    // Eventos de botones de cantidad 

    function agregarEventosCantidad() {
    document.querySelectorAll(".btn-mas").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id); //obtenemos el id del producto desde el data-id del botón, lo parseamos a int porque viene como string
            // Buscamos el producto en el carrito
            const producto = carrito.find(p => p.id === id);
            producto.cantidad += 1;
            mostrarCarrito(carrito);
            localStorage.setItem('carrito', JSON.stringify(carrito));
        });
    });

    document.querySelectorAll(".btn-menos").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            const producto = carrito.find(p => p.id === id);
            if (producto.cantidad > 1) {
                producto.cantidad -= 1;
            } else {
                // Si la cantidad llega a 0, lo eliminás directamente
                carrito = carrito.filter(p => p.id !== id);
            }
            mostrarCarrito(carrito);
            localStorage.setItem('carrito', JSON.stringify(carrito));
        });
    });
    }


    fetchProductos('http://localhost:3000/productos');
    mostrarCarrito(carrito);
});



function init() {
    imprimirDatosAlumnos(); 

    let carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
    console.log(carritoGuardado); // Muestra el carrito guardado en consola para verificar
    if (carritoGuardado) {
        carrito = carritoGuardado; // Si hay un carrito guardado, lo asigno a la variable carrito
        mostrarCarrito(carrito); // Muestra el carrito guardado al cargar la página
    }
};


init();