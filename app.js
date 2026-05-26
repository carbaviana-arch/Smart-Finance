// Base de datos de pagos (Extraídos de tus CSV de 2026)
const ingresosTotales = 2800.00;

const pagosData = [
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

// Inicializar Aplicación
document.addEventListener("DOMContentLoaded", () => {
    renderApp();
    checkProximosVencimientos();
});

function renderApp() {
    const listContainer = document.getElementById("payments-list");
    let totalGastos = 0;
    let pendientesCount = 0;

    listContainer.innerHTML = "";

    pagosData.forEach((item, index) => {
        totalGastos += item.monto;
        if (item.estado === "Por Pagar") pendientesCount++;

        // Formatear fecha para vista española
        const dateObj = new Date(item.fecha);
        const fechaFormateada = item.fecha ? `${dateObj.getDate()}/${dateObj.getMonth() + 1}` : '-';

        const itemHtml = `
            <div class="list-item" onclick="cambiarEstado(${index})">
                <div class="item-left">
                    <h4>${item.pago}</h4>
                    <p class="item-sub">${item.propietario} • Vence: ${fechaFormateada}</p>
                </div>
                <div class="item-right">
                    <p class="item-amount">${item.monto.toFixed(2)}€</p>
                    <p class="item-sub" style="color: ${item.estado === 'Pagado' ? 'var(--ios-green)' : 'var(--ios-red)'}">
                        ${item.estado}
                    </p>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML("beforeend", itemHtml);
    });

    // Actualizar Widgets
    document.getElementById("total-expenses").innerText = `${totalGastos.toFixed(2)}€`;
    document.getElementById("total-balance").innerText = `${(ingresosTotales - totalGastos).toFixed(2)}€`;
    document.getElementById("pending-count").innerText = `${pendientesCount} pendientes`;
}

// Alternar estado de Pago
function cambiarEstado(index) {
    pagosData[index].estado = pagosData[index].estado === "Pagado" ? "Por Pagar" : "Pagado";
    renderApp();
}

// Alertas de Vencimiento Estilo Push de iOS
function checkProximosVencimientos() {
    const hoy = new Date();
    
    pagosData.forEach(item => {
        if (item.estado === "Por Pagar") {
            const fechaVencimiento = new Date(item.fecha);
            const diferenciaTiempo = fechaVencimiento - hoy;
            const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

            // Si vence en los próximos 10 días o ya venció
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
        <div class="notif-header">
            <span>FINANZAS CORE</span>
            <span>ahora</span>
        </div>
        <strong>${title}</strong>
        <p style="font-size: 13px; margin-top:2px; color: var(--ios-text-secondary);">${message}</p>
    `;
    container.appendChild(notif);

    // Desaparece automáticamente a los 6 segundos
    setTimeout(() => { notif.remove(); }, 6000);
}

// Web Notification API Nativa (Opcional, para el botón Alertas)
function requestWebNotifications() {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Finanzas Core", { body: "¡Notificaciones nativas de iOS activadas correctamente!" });
        }
    });
}