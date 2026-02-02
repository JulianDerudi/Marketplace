# Marketplace – Proyecto JavaScript Vanilla

Este proyecto corresponde al **trabajo práctico final de la unidad de JavaScript** del curso de **Programación Full Stack**.

Se trata de un **Marketplace web** desarrollado íntegramente con **JavaScript puro**, donde se implementa un catálogo de productos, un carrito de compras y manejo de stock, incorporando **persistencia de estado mediante LocalStorage**.

🔗 **Deploy:**  
https://julianderudi.github.io/Marketplace/

---

## 🎯 Objetivo del Proyecto

El objetivo principal fue aplicar los conceptos fundamentales de **JavaScript** para construir una aplicación funcional de frontend, poniendo foco en:

- Manipulación dinámica del DOM
- Lógica de negocio del lado del cliente
- Manejo de eventos
- Gestión de estado de la aplicación
- Persistencia de datos sin backend
- Estructuración clara del código

---

## 🛠️ Tecnologías Utilizadas

- **JavaScript (ES6+)**
- **HTML5**
- **CSS3**
- **LocalStorage**
- **Git & GitHub**
- **GitHub Pages** (deploy)

---

## 🧱 Estructura del Proyecto

El proyecto está compuesto únicamente por tres archivos principales y un recurso visual:

Marketplace/
├── index.html
├── styles.css
├── app.js
└── maqueta.png


---

## 🖥️ Estructura HTML

La estructura del `index.html` es simple y semántica, con dos contenedores principales:

- **Catálogo de productos**
- **Carrito de compras**

Ambos se renderizan dinámicamente desde JavaScript.

<main class="app-container">
  <div class="catalog-container" id="catalog-container"></div>
  <div class="cart-products-container" id="cart-products-container"></div>
</main>


## 🎨 Estilos y Diseño

El diseño está implementado en styles.css utilizando:
* Flexbox para layout
* Variables CSS (:root) para manejo de colores
* Separación visual clara entre catálogo y carrito
* Diseño responsivo
* Posicionamiento sticky para el carrito

El archivo maqueta.png sirve como referencia visual del diseño esperado.

## 📦 Funcionalidades Principales

* Renderizado dinámico del catálogo de productos
* Agregado de productos al carrito
* Incremento y decremento de cantidades
* Control y actualización de stock
* Eliminación de productos del carrito
* Vaciado del carrito
* Simulación de checkout
* Actualización automática de la interfaz

## 🔄 Manejo de Estado

La aplicación maneja dos estados principales:
* Catálogo de productos (con stock)
* Carrito de compras

Ambos estados se gestionan completamente desde JavaScript y se reflejan dinámicamente en el DOM.

## 💾 Persistencia con LocalStorage

El proyecto implementa persistencia de estado utilizando LocalStorage, permitiendo que la información se conserve al recargar la página o cerrar el navegador.

Se persiste:
* Estado del carrito
* Estado del catálogo con stock actualizado

Funcionamiento:
* Al iniciar la aplicación, el estado se hidrata desde LocalStorage si existe
* Cada modificación del carrito o del stock actualiza automáticamente el almacenamiento local
* Si no hay datos persistidos, se inicializa el estado desde la API simulada

Esto permite simular el comportamiento de una aplicación real sin necesidad de backend.

## ▶️ Ejecución del Proyecto

Ejecutar localmente
1. Clonar el repositorio:

git clone https://github.com/JulianDerudi/Marketplace.git

2. Abrir el archivo index.html en el navegador.

No requiere servidor ni instalación de dependencias.

## 📚 Aprendizajes Clave

* JavaScript aplicado a proyectos reales
* Manipulación del DOM sin frameworks
* Gestión de estado del lado del cliente
* Persistencia con LocalStorage
* Separación de responsabilidades
* Desarrollo y deploy de una aplicación frontend completa

## 🚀 Posibles Mejoras Futuras

* Integración con backend (Node.js + API REST)
* Persistencia en base de datos real
* Autenticación de usuarios
* Mejoras de UI/UX
* Uso de frameworks frontend

## 👤 Autor

Julián Derudi
📌 Portafolio: https://julianderudi.github.io/Portafolio/
🔗 LinkedIn: https://www.linkedin.com/in/julian-derudi-730ba8343/

📎 Proyecto realizado con fines educativos como parte del proceso de formación en desarrollo Full Stack.
