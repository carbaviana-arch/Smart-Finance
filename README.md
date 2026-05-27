# Smart-Finance · Finanzas Core

Aplicación web minimalista y optimizada para móviles diseñada para el control y la gestión de gastos mensuales.

## 🚀 Características

- **Interfaz iOS:** Look & feel limpio simulando el ecosistema Apple.
- **Notificaciones del sistema:** Solicita permiso y lanza alertas nativas del navegador para pagos próximos y vencidos (funciona en Android Chrome y Safari iOS 16.4+ sobre HTTPS).
- **Toasts in-app:** Alertas visuales al cargar la app para pagos que vencen en los próximos 5 días.
- **Modal de Alertas:** Pantalla dedicada con todos los pagos próximos o vencidos, accesible desde la tab “Alertas” con badge numérico.
- **Ordenación automática:** La lista prioriza vencidos → urgentes → pendientes → pagados.
- **Indicadores de urgencia:** Badges VENCIDO / HOY / días restantes directamente en cada ítem.
- **Dot de prioridad:** Punto de color (rojo/naranja/gris) según prioridad Alta/Media/Baja.
- **Interacción directa:** Toca cualquier gasto para editarlo, o el icono 🔄 para alternar el estado sin abrir el formulario.
- **Sobrante en color:** Verde si hay margen positivo, rojo si hay déficit.

## 🔔 Notificaciones — Limitaciones importantes

|Plataforma                      |Soporte                                |
|--------------------------------|---------------------------------------|
|Android (Chrome)                |✅ Funciona sobre HTTPS                 |
|iOS (Safari 16.4+, PWA)         |✅ Solo si se añade a pantalla de inicio|
|iOS (Safari, navegador normal)  |❌ No admitido por Apple                |
|Escritorio (Chrome/Edge/Firefox)|✅ Funciona sobre HTTPS                 |


> **Nota:** Las notificaciones solo se disparan mientras la app está abierta en el navegador. Para alertas automáticas en segundo plano se necesitaría un Service Worker + Push API (requiere backend).

## 🛠️ Despliegue en GitHub Pages

1. Sube los 4 archivos (`index.html`, `app.js`, `style.css`, `README.md`) a un repositorio público.
1. Ve a **Settings → Pages** del repositorio.
1. En *Build and deployment*, selecciona la rama `main` y la carpeta `/root`. Haz clic en **Save**.
1. En unos minutos la app estará disponible en `https://tu-usuario.github.io/tu-repositorio/`
1. Accede siempre por **HTTPS** para que las notificaciones funcionen.