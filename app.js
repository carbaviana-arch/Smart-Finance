// ─── DATOS INICIALES ────────────────────────────────────────────────────
let ingresosTotales = parseFloat(localStorage.getItem("ingresos_totales")) || 2800.00;

let pagosData = JSON.parse(localStorage.getItem("pagos_data")) || [
    { pago: "ALQUILER",             prioridad: "Alta",  monto: 852.00, propietario: "Casa",      cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-05" },
    { pago: "Comedor Sebas",        prioridad: "Media", monto: 93.00,  propietario: "Sebas",     cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-05" },
    { pago: "Ingles Sebas",         prioridad: "Media", monto: 50.00,  propietario: "Sebas",     cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-01" },
    { pago: "Algoritmics / Torres", prioridad: "Media", monto: 69.70,  propietario: "Sebas",     cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-06" },
    { pago: "Jazztel",              prioridad: "Alta",  monto: 134.00, propietario: "Casa",      cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-12" },
    { pago: "Aerotermia",           prioridad: "Alta",  monto: 85.00,  propietario: "Casa",      cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-25" },
    { pago: "Electricidad",         prioridad: "Alta",  monto: 60.00,  propietario: "Casa",      cuenta: "Conjunta", estado: "Por Pagar", fecha: "2026-06-01" },
    { pago: "Ingles Daysol",        prioridad: "Media", monto: 0.00,   propietario: "Daysol",    cuenta: "Day",      estado: "Por Pagar", fecha: "2026-06-12" },
    { pago: "Tarjeta Transporte",   prioridad: "Baja",  monto: 29.00,  propietario: "Daysol",    cuenta: "Day",      estado: "Por Pagar", fecha: "2026-06-01" },
    { pago: "TDC Open",             prioridad: "Alta",  monto: 35.00,  propietario: "Francisco", cuenta: "Fran",     estado: "Pagado",    fecha: "2026-05-31" },
    { pago: "Visa Go (Ordenador)",  prioridad: "Alta",  monto: 50.00,  propietario: "Francisco", cuenta: "Fran",     estado: "Pagado",    fecha: "2026-06-01" },
    { pago: "Apartado Comida",      prioridad: "Alta",  monto: 350.00, propietario: "Casa",      cuenta: "Conjunta", estado: "Pagado",    fecha: "2026-06-01" },
    { pago: "Netflix",              prioridad: "Media", monto: 13.90,  propietario: "Casa",      cuenta: "Conjunta", estado: "Pagado",    fecha: "2026-06-01" }
];

// ─── UTILIDADES DE FECHA ─────────────────────────────────────────────────
/**
 * Parsea "YYYY-MM-DD" como fecha LOCAL (evita el bug UTC del constructor Date).
 */
function parseFechaLocal(str) {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
}

/**
 * Días entre hoy (a medianoche) y la fecha de vencimiento.
 * Negativo = ya venció.
 */
function diasHastaVencimiento(fechaStr) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = parseFechaLocal(fechaStr);
    if (!fecha) return Infinity;
    return Math.round((fecha - hoy) / 86400000);
}

function formatearFecha(fechaStr) {
    const f = parseFechaLocal(fechaStr);
    if (!f) return "-";
    return `${f.getDate()}/${f.getMonth() + 1}`;
}

// ─── PERSISTENCIA ────────────────────────────────────────────────────────
function persistirDatos() {
    localStorage.setItem("pagos_data", JSON.stringify(pagosData));
    localStorage.setItem("ingresos_totales", ingresosTotales.toString());
}

// ─── ORDENACIÓN ──────────────────────────────────────────────────────────
/**
 * Ordena: vencidos → hoy → próximos pendientes → pagados.
 * Dentro de cada grupo, por fecha ascendente.
 */
function ordenarPagos(lista) {
    return [...lista].sort((a, b) => {
        const pagadoA = a.estado === "Pagado";
        const pagadoB = b.estado === "Pagado";
        if (pagadoA !== pagadoB) return pagadoA ? 1 : -1;
        const diasA = diasHastaVencimiento(a.fecha);
        const diasB = diasHastaVencimiento(b.fecha);
        return diasA - diasB;
    });
}

// ─── RENDER PRINCIPAL ─────────────────────────────────────────────────────
function renderApp() {
    // Actualizar fecha en header
    const ahora = new Date();
    const opciones = { weekday: "long", day: "numeric", month: "long" };
    document.getElementById("header-date").textContent =
        ahora.toLocaleDateString("es-ES", opciones);

    const listContainer = document.getElementById("payments-list");
    let totalPagado = 0;
    let totalPendiente = 0;
    let pendientesCount = 0;

    listContainer.innerHTML = "";

    const listaOrdenada = ordenarPagos(pagosData);

    // Mantener un mapa índice-ordenado → índice-original para edición
    listaOrdenada.forEach((item) => {
        const indexOriginal = pagosData.indexOf(item);
        const monto = parseFloat(item.monto) || 0;

        if (item.estado === "Pagado") {
            totalPagado += monto;
        } else {
            totalPendiente += monto;
            pendientesCount++;
        }

        const dias = diasHastaVencimiento(item.fecha);
        const fechaStr = formatearFecha(item.fecha);

        // Indicador de urgencia
        let urgenciaBadge = "";
        if (item.estado !== "Pagado") {
            if (dias < 0)       urgenciaBadge = `<span class="urgencia vencido">VENCIDO</span>`;
            else if (dias === 0) urgenciaBadge = `<span class="urgencia hoy">HOY</span>`;
            else if (dias <= 3)  urgenciaBadge = `<span class="urgencia urgente">${dias}d</span>`;
            else if (dias <= 10) urgenciaBadge = `<span class="urgencia proximo">${dias}d</span>`;
        }

        // Dot de prioridad
        const prioridadClass = {
            "Alta": "prio-alta",
            "Media": "prio-media",
            "Baja": "prio-baja"
        }[item.prioridad] || "";

        const itemHtml = `
            <div class="list-item ${item.estado === 'Pagado' ? 'item-pagado' : ''}" onclick="openModal(${indexOriginal})">
                <div class="item-left">
                    <div class="item-title-row">
                        <span class="prio-dot ${prioridadClass}"></span>
                        <h4>${item.pago}</h4>
                        ${urgenciaBadge}
                    </div>
                    <p class="item-sub">
                        ${item.propietario} • ${item.cuenta || "—"} • Vence: ${fechaStr}
                        &nbsp;<span class="link-alternar" onclick="event.stopPropagation(); toggleEstadoRapido(${indexOriginal});">🔄</span>
                    </p>
                </div>
                <div class="item-right">
                    <p class="item-amount">${monto.toFixed(2)}€</p>
                    <p class="item-sub estado-text" style="color: ${item.estado === 'Pagado' ? 'var(--ios-green)' : 'var(--ios-red)'}">
                        ${item.estado}
                    </p>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML("beforeend", itemHtml);
    });

    const totalGastos = totalPagado + totalPendiente;
    const sobrante = ingresosTotales - totalGastos;

    document.getElementById("total-income").innerHTML =
        `${formatMonto(ingresosTotales)} <span style="font-size:10px;color:var(--ios-gray)">✏️</span>`;
    document.getElementById("total-paid").innerText    = formatMonto(totalPagado);
    document.getElementById("total-pending").innerText = formatMonto(totalPendiente);

    const balanceEl = document.getElementById("total-balance");
    balanceEl.innerText = formatMonto(sobrante);
    balanceEl.style.color = sobrante >= 0 ? "var(--ios-green)" : "var(--ios-red)";

    document.getElementById("pending-count").innerText = `${pendientesCount} pendientes`;

    // Actualizar badge de alertas
    actualizarBadgeAlertas();
}

function formatMonto(n) {
    return n.toFixed(2).replace(".", ",") + "€";
}

// ─── TOGGLE RÁPIDO ───────────────────────────────────────────────────────
function toggleEstadoRapido(index) {
    pagosData[index].estado = pagosData[index].estado === "Pagado" ? "Por Pagar" : "Pagado";
    persistirDatos();
    renderApp();
}

// ─── EDITAR INGRESOS ─────────────────────────────────────────────────────
function editIncome() {
    const nuevoIngreso = prompt("Modificar monto de Ingresos Mensuales:", ingresosTotales.toFixed(2));
    if (nuevoIngreso !== null && nuevoIngreso.trim() !== "" && !isNaN(nuevoIngreso)) {
        ingresosTotales = parseFloat(nuevoIngreso);
        persistirDatos();
        renderApp();
    }
}

// ─── MODAL FORMULARIO ────────────────────────────────────────────────────
function openModal(index = null) {
    const modal   = document.getElementById("ios-modal");
    const form    = document.getElementById("payment-form");
    const deleteBtn = document.getElementById("btn-delete");

    form.reset();

    if (index !== null) {
        document.getElementById("modal-title").innerText = "Editar Gasto";
        document.getElementById("edit-index").value = index;
        deleteBtn.style.display = "block";

        const item = pagosData[index];
        document.getElementById("form-pago").value        = item.pago;
        document.getElementById("form-monto").value       = item.monto;
        document.getElementById("form-propietario").value = item.propietario;
        document.getElementById("form-cuenta").value      = item.cuenta || "Conjunta";
        document.getElementById("form-prioridad").value   = item.prioridad;
        document.getElementById("form-fecha").value       = item.fecha;
        document.getElementById("form-estado").value      = item.estado;
    } else {
        document.getElementById("modal-title").innerText  = "Nuevo Gasto";
        document.getElementById("edit-index").value       = "";
        deleteBtn.style.display = "none";
        document.getElementById("form-fecha").value =
            new Date().toISOString().split("T")[0];
    }

    modal.classList.add("open");
}

function closeModal() {
    document.getElementById("ios-modal").classList.remove("open");
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById("ios-modal")) closeModal();
}

function savePayment() {
    const pagoInput  = document.getElementById("form-pago").value.trim();
    const montoInput = parseFloat(document.getElementById("form-monto").value);
    const fechaInput = document.getElementById("form-fecha").value;

    if (!pagoInput || isNaN(montoInput) || montoInput < 0 || !fechaInput) {
        showIosNotification("Error", "Rellena los campos obligatorios correctamente.", "error");
        return;
    }

    const nuevoGasto = {
        pago:        pagoInput,
        prioridad:   document.getElementById("form-prioridad").value,
        monto:       montoInput,
        propietario: document.getElementById("form-propietario").value,
        cuenta:      document.getElementById("form-cuenta").value,
        estado:      document.getElementById("form-estado").value,
        fecha:       fechaInput
    };

    const editIndex = document.getElementById("edit-index").value;

    if (editIndex !== "") {
        pagosData[parseInt(editIndex)] = nuevoGasto;
    } else {
        pagosData.push(nuevoGasto);
    }

    persistirDatos();
    renderApp();
    closeModal();
}

function deletePayment() {
    const editIndex = document.getElementById("edit-index").value;
    if (editIndex !== "" && confirm("¿Seguro que deseas eliminar este gasto?")) {
        pagosData.splice(parseInt(editIndex), 1);
        persistirDatos();
        renderApp();
        closeModal();
    }
}

// ─── MODAL DE ALERTAS ────────────────────────────────────────────────────
function openAlertsModal() {
    renderAlertsList();
    document.getElementById("alerts-modal").classList.add("open");
}

function closeAlertsModal() {
    document.getElementById("alerts-modal").classList.remove("open");
}

function handleAlertsOverlayClick(e) {
    if (e.target === document.getElementById("alerts-modal")) closeAlertsModal();
}

function renderAlertsList() {
    const container = document.getElementById("alerts-list");
    const emptyMsg  = document.getElementById("alerts-empty");
    container.innerHTML = "";

    const alertas = pagosData.filter(item => {
        if (item.estado === "Pagado") return false;
        return diasHastaVencimiento(item.fecha) <= 10;
    }).sort((a, b) => diasHastaVencimiento(a.fecha) - diasHastaVencimiento(b.fecha));

    if (alertas.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
    emptyMsg.style.display = "none";

    alertas.forEach(item => {
        const dias = diasHastaVencimiento(item.fecha);
        let labelClass = "proximo";
        let labelText;

        if (dias < 0) {
            labelClass = "vencido";
            labelText  = `Venció hace ${Math.abs(dias)} día${Math.abs(dias) !== 1 ? "s" : ""}`;
        } else if (dias === 0) {
            labelClass = "hoy";
            labelText  = "Vence HOY";
        } else {
            labelText  = `Vence en ${dias} día${dias !== 1 ? "s" : ""}`;
        }

        container.insertAdjacentHTML("beforeend", `
            <div class="alert-item">
                <div class="alert-info">
                    <strong>${item.pago}</strong>
                    <span class="alert-sub">${item.propietario} • ${formatearFecha(item.fecha)}</span>
                </div>
                <div class="alert-right">
                    <span class="urgencia ${labelClass}">${labelText}</span>
                    <span class="alert-monto">${parseFloat(item.monto).toFixed(2)}€</span>
                </div>
            </div>
        `);
    });
}

function actualizarBadgeAlertas() {
    const badge = document.getElementById("alerts-badge");
    const count = pagosData.filter(item => {
        if (item.estado === "Pagado") return false;
        return diasHastaVencimiento(item.fecha) <= 10;
    }).length;

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }
}

// ─── NOTIFICACIONES DEL SISTEMA (Web Notifications API) ─────────────────
function requestWebNotifications() {
    if (!("Notification" in window)) {
        showIosNotification("Sin soporte", "Tu navegador no admite notificaciones del sistema.", "error");
        return;
    }

    if (Notification.permission === "granted") {
        dispararNotificacionesSistema();
        showIosNotification("Notificaciones", "Alertas del sistema activadas ✅", "success");
        return;
    }

    if (Notification.permission === "denied") {
        showIosNotification("Bloqueadas", "Activa los permisos en ajustes del navegador.", "error");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            dispararNotificacionesSistema();
            showIosNotification("¡Listo!", "Recibirás alertas de vencimientos 🔔", "success");
        } else {
            showIosNotification("Sin permiso", "No se han concedido permisos de notificación.", "error");
        }
    });
}

/**
 * Lanza una notificación del sistema por cada pago pendiente próximo o vencido.
 */
function dispararNotificacionesSistema() {
    const pendientes = pagosData.filter(item => {
        if (item.estado === "Pagado") return false;
        return diasHastaVencimiento(item.fecha) <= 10;
    });

    if (pendientes.length === 0) {
        new Notification("Finanzas Core ✅", { body: "Sin pagos próximos a vencer.", icon: "" });
        return;
    }

    pendientes.forEach(item => {
        const dias = diasHastaVencimiento(item.fecha);
        let body;
        if (dias < 0)       body = `⚠️ VENCIDO hace ${Math.abs(dias)} día(s) — ${item.monto.toFixed(2)}€`;
        else if (dias === 0) body = `🔴 Vence HOY — ${item.monto.toFixed(2)}€`;
        else                 body = `🟡 Vence en ${dias} día(s) — ${item.monto.toFixed(2)}€`;

        // Pequeño delay escalonado para no apilar todo a la vez
        setTimeout(() => {
            new Notification(`Finanzas Core · ${item.pago}`, { body, tag: item.pago });
        }, pendientes.indexOf(item) * 800);
    });
}

// ─── NOTIFICACIONES IN-APP ───────────────────────────────────────────────
/**
 * Muestra un toast in-app.
 * @param {string} title
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 */
function showIosNotification(title, message, type = "info") {
    const container = document.getElementById("notification-center");
    const notif = document.createElement("div");
    notif.className = `ios-notification notif-${type}`;
    notif.innerHTML = `
        <div class="notif-header">
            <span>FINANZAS CORE</span>
            <span>ahora</span>
        </div>
        <strong>${title}</strong>
        <p style="font-size:13px; margin-top:2px; color:var(--ios-text-secondary);">${message}</p>
    `;
    container.appendChild(notif);
    setTimeout(() => notif.classList.add("notif-hide"), 4500);
    setTimeout(() => notif.remove(), 5000);
}

/**
 * Al cargar, muestra toasts in-app para pagos próximos/vencidos.
 */
function checkProximosVencimientos() {
    const alertas = pagosData
        .filter(item => item.estado !== "Pagado" && diasHastaVencimiento(item.fecha) <= 5)
        .sort((a, b) => diasHastaVencimiento(a.fecha) - diasHastaVencimiento(b.fecha));

    alertas.forEach((item, i) => {
        const dias = diasHastaVencimiento(item.fecha);
        let mensaje, tipo;

        if (dias < 0) {
            mensaje = `⚠️ Venció hace ${Math.abs(dias)} día(s) · ${item.monto.toFixed(2)}€`;
            tipo = "error";
        } else if (dias === 0) {
            mensaje = `🔴 ¡Vence HOY! · ${item.monto.toFixed(2)}€`;
            tipo = "error";
        } else {
            mensaje = `Vence en ${dias} día(s) · ${item.monto.toFixed(2)}€`;
            tipo = "info";
        }

        setTimeout(() => showIosNotification(item.pago, mensaje, tipo), i * 700);
    });
}

// ─── TABS ────────────────────────────────────────────────────────────────
function switchTab(tab, el) {
    document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
}

// ─── INIT ────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    renderApp();
    checkProximosVencimientos();
});
