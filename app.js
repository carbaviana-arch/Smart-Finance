// Cargar datos iniciales o recuperar del almacenamiento local del navegador
let ingresosTotales = parseFloat(localStorage.getItem("ingresos_totales")) || 2800.00;

let pagosData = JSON.parse(localStorage.getItem("pagos_data")) || [
    { pago: "ALQUILER", prioridad: "Alta", monto: 852.00, propietario: "Casa", estado: "Por Pagar", fecha: "2026-06-05" },
    { pago: "Comedor Sebas", prioridad: "Media", monto: 93.00, propietario: "Sebas", estado: "Por Pagar", fecha: "2026-06-05" },
    { pago: "Ingles Sebas", prioridad: "Media", monto: 50.00, propietario: "Sebas", estado: "Por Pagar", fecha: "2026-06-01" },
    { pago: "Algoritmics / Torres", prioridad: "Media", monto: 69.70, propietario: "Sebas", estado: "Por Pagar", fecha: "2026-06-06" },
    { pago: "Jazztel", prioridad: "Alta", monto: 134.00, propietario: "Casa", estado: "Por Pagar", fecha: "2026-06-12" },
    { pago: "Aerotermia", prioridad: "Alta", monto: 85.00, propietario: "Casa", estado: "Por Pagar", fecha: "2026-06-25" },
    { pago: "Electricidad", prioridad: "Alta", monto: 60.00, propietario: "Casa", estado: "Por Pagar", fecha: "2026-06-01" },
    { pago: "Ingles Daysol", prioridad: "Media", monto: 0.00, propietario: "Daysol", estado: "Por Pagar", fecha: "2026-06-12" },
    { pago: "Tarjeta Transporte Fran", prioridad: "Baja", monto: 29.00, propietario: "Daysol", estado: "Por Pagar", fecha: "2026-06-01" },
    { pago: "TDC Open", prioridad: "Alta", monto: 35.00, propietario: "Francisco", estado: "Pagado", fecha: "2026-05-31" },
    { pago: "Visa Go (Ordenador)", prioridad: "Alta", monto: 50.00, propietario: "Francisco", estado: "Pagado", fecha: "2026-06-01" },
    { pago: "Apartado Comida", prioridad: "Alta", monto: 350.00, propietario: "Casa", estado: "Pagado", fecha: "2026-06-01" },
    { pago: "Netflix", prioridad: "Media", monto: 13.90, propietario: "Casa", estado: "Pagado", fecha: "2026-06-01" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderApp();
    checkProximosVencimientos();
});

// Guardar en LocalStorage
function persistirDatos() {
    localStorage.setItem("pagos_data", JSON.stringify(pagosData));
    localStorage.setItem("ingresos_totales", ingresosTotales.toString());
}

function renderApp() {
    const listContainer = document.getElementById("payments-list");
    let totalPagado = 0;
    let totalPendiente = 0;
    let pendientesCount = 0;

    listContainer.innerHTML = "";

    pagosData.forEach((item, index) => {
        const monto = parseFloat(item.monto) || 0;
        
        // Sumatorios Generales de Estados
        if (item.estado === "Pagado") {
            totalPagado += monto;
        } else {
            totalPendiente += monto;
            pendientesCount++;
        }

        const dateObj = new Date(item.fecha);
        const fechaFormateada = item.fecha ? `${dateObj.getDate()}/${dateObj.getMonth() + 1}` : '-';

        const itemHtml = `
            <div class="list-item" onclick="openModal(${index})">
                <div class="item-left">
                    <h4>${item.pago}</h4>
                    <p class="item-sub">${item.propietario} • Vence: ${fechaFormateada} • <span style="color:var(--ios-blue)" onclick="event.stopPropagation(); toggleEstadoRapido(${index});">🔄 Alternar</span></p>
                </div>
                <div class="item-right">
                    <p class="item-amount">${monto.toFixed(2)}€</p>
                    <p class="item-sub" style="color: ${item.estado === 'Pagado' ? 'var(--ios-green)' : 'var(--ios-red)'}">
                        ${item.estado}
                    </p>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML("beforeend", itemHtml);
    });

    // Calcular montos globales
    const totalGastosPresupuestados = totalPagado + totalPendiente;

    // Inyectar en Interfaz (Widgets)
    document.getElementById("total-income").innerHTML = `${ingresosTotales.toFixed(2)}€ <span style="font-size:10px;color:var(--ios-gray)">✏️</span>`;
    document.getElementById("total-paid").innerText = `${totalPagado.toFixed(2)}€`;
    document.getElementById("total-pending").innerText = `${totalPendiente.toFixed(2)}€`;
    document.getElementById("total-balance").innerText = `${(ingresosTotales - totalGastosPresupuestados).toFixed(2)}€`;
    document.getElementById("pending-count").innerText = `${pendientesCount} pendientes`;
}

// Cambiar estado rápido sin abrir modal desde el link azul
function toggleEstadoRapido(index) {
    pagosData[index].estado = pagosData[index].estado === "Pagado" ? "Por Pagar" : "Pagado";
    persistirDatos();
    renderApp();
}

// Editar Ingresos de forma directa
function editIncome() {
    const nuevoIngreso = prompt("Modificar monto de Ingresos Mensuales:", ingresosTotales);
    if (nuevoIngreso !== null && !isNaN(nuevoIngreso)) {
        ingresosTotales = parseFloat(nuevoIngreso);
        persistirDatos();
        renderApp();
    }
}

// Lógica del Formulario Deslizante (Modal)
function openModal(index = null) {
    const modal = document.getElementById("ios-modal");
    const form = document.getElementById("payment-form");
    const deleteBtn = document.getElementById("btn-delete");
    
    form.reset();
    
    if (index !== null) {
        // Modo Edición
        document.getElementById("modal-title").innerText = "Editar Gasto";
        document.getElementById("edit-index").value = index;
        deleteBtn.style.display = "block";
        
        const item = pagosData[index];
        document.getElementById("form-pago").value = item.pago;
        document.getElementById("form-monto").value = item.monto;
        document.getElementById("form-propietario").value = item.propietario;
        document.getElementById("form-prioridad").value = item.prioridad;
        document.getElementById("form-fecha").value = item.fecha;
        document.getElementById("form-estado").value = item.estado;
    } else {
        // Modo Crear
        document.getElementById("modal-title").innerText = "Nuevo Gasto";
        document.getElementById("edit-index").value = "";
        deleteBtn.style.display = "none";
        document.getElementById("form-fecha").value = new Date().toISOString().split('T')[0];
    }
    
    modal.classList.add("open");
}

function closeModal() {
    document.getElementById("ios-modal").classList.remove("open");
}

function savePayment() {
    const pagoInput = document.getElementById("form-pago").value.trim();
    const montoInput = parseFloat(document.getElementById("form-monto").value);
    const fechaInput = document.getElementById("form-fecha").value;

    if (!pagoInput || isNaN(montoInput) || !fechaInput) {
        alert("Por favor, rellena los campos obligatorios.");
        return;
    }

    const nuevoGasto = {
        pago: pagoInput,
        prioridad: document.getElementById("form-prioridad").value,
        monto: montoInput,
        propietario: document.getElementById("form-propietario").value,
        estado: document.getElementById("form-estado").value,
        fecha: fechaInput
    };

    const editIndex = document.getElementById("edit-index").value;

    if (editIndex !== "") {
        // Actualizar existente
        pagosData[editIndex] = nuevoGasto;
    } else {
        // Insertar nuevo
        pagosData.push(nuevoGasto);
    }

    persistirDatos();
    renderApp();
    closeModal();
}

function deletePayment() {
    const editIndex = document.getElementById("edit-index").value;
    if (editIndex !== "" && confirm("¿Seguro que deseas eliminar este gasto?")) {
        pagosData.splice(editIndex, 1);
        persistirDatos();
        renderApp();
        closeModal();
    }
}

// Alertas del centro de notificaciones
function checkProximosVencimientos() {
    const hoy = new Date();
    pagosData.forEach(item => {
        if (item.estado === "Por Pagar") {
            const fechaVencimiento = new Date(item.fecha);
            const diferenciaTiempo = fechaVencimiento - hoy;
            const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

            if (diasRestantes <= 10) {
                let mensaje = `Vence en ${diasRestantes} días (${item.monto.toFixed(2)}€)`;
                if (diasRestantes === 0) mensaje = `¡Vence HOY! (${item.monto.toFixed(2)}€)`;
                if (diasRestantes < 0) mensaje = `⚠️ GASTO VENCIDO hace ${Math.abs(diasRestantes)} días`;

                showIosNotification(item.pago, mensaje);
            }
        }
    });
}

function showIosNotification(title, message) {
    const container = document.getElementById("notification-center");
    const notif = document.createElement("div");
    notif.className = "ios-notification";
    notif.innerHTML = `
        <div class="notif-header"><span>FINANZAS CORE</span><span>ahora</span></div>
        <strong>${title}</strong>
        <p style="font-size: 13px; margin-top:2px; color: var(--ios-text-secondary);">${message}</p>
    `;
    container.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 6000);
}

function requestWebNotifications() {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Finanzas Core", { body: "Centro de alertas activo" });
        }
    });
}