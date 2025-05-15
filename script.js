const productos = [
  { id: 1, nombre: "Mug blanco", precio: 15000, imagen: "https://morapersonalizados.com/cdn/shop/files/18.png?v=1726596586", categoria: "personalizados" },
  { id: 2, nombre: "Camiseta", precio: 35000, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNOG9jGIiHPB0KIY7NZ-Ezsx8vf-MPHXvucQ&s", categoria: "ropa" },
  { id: 3, nombre: "Hoodie", precio: 80000, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLbvfRglDUtOV9sIVZ9bEyM_uHNgE7SqtSGw&s", categoria: "ropa" },
  { id: 4, nombre: "Gorra", precio: 20000, imagen: "https://http2.mlstatic.com/D_NQ_NP_697663-MCO48028699298_102021-O.webp", categoria: "accesorios" },
  { id: 5, nombre: "Termo", precio: 30000, imagen: "https://http2.mlstatic.com/D_NQ_NP_749486-MCO45344747913_032021-O.webp", categoria: "accesorios" },
  { id: 6, nombre: "Cases", precio: 35000, imagen: "https://morapersonalizados.com/cdn/shop/files/Portadas_Mora_4_1200x.png?v=1726781258", categoria: "personalizados" },
  { id: 7, nombre: "DTF", precio: 15000, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRccvfhp9ckk4WpSLQlWGMYhub6ENm1DOcvtg&s", categoria: "personalizados" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadProductos = document.getElementById("cantidad-productos");
const categoriaSelect = document.getElementById("categoria");

function mostrarProductos(filtro = "todos") {
  contenedorProductos.innerHTML = "";
  const productosFiltrados = filtro === "todos" ? productos : productos.filter(p => p.categoria === filtro);

  productosFiltrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toLocaleString()}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function filtrarCategoria() {
  mostrarProductos(categoriaSelect.value);
}

function agregarAlCarrito(id) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad++;
  } else {
    const nuevoProducto = productos.find(p => p.id === id);
    carrito.push({ ...nuevoProducto, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
  });

  totalCarrito.textContent = total.toLocaleString();
  cantidadProductos.textContent = cantidadTotal;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
  if (confirm("¿Deseas vaciar el carrito?")) {
    carrito = [];
    actualizarCarrito();
  }
}

paypal.Buttons({
  createOrder: function(data, actions) {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2)
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert("Gracias por tu compra, " + details.payer.name.given_name);
      carrito = [];
      actualizarCarrito();
    });
  }
}).render("#paypal-button-container");

mostrarProductos();
actualizarCarrito();
