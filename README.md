# Mis finanzas

Dashboard interactivo para controlar tus finanzas personales. Es una web de **un solo archivo** (`index.html`), sin servidor, sin instalación y sin cuentas: abre el archivo o publícalo en GitHub Pages y funciona.

Estética oscura en negro, gris y naranja, con paneles, rankings y gráficos de evolución anual. En el móvil tiene aspecto de app de iOS: barra superior translúcida con el mes, títulos grandes y navegación inferior con tres pestañas (Resumen, Movimientos y Más).

## Qué puedes hacer

- **Registrar movimientos** en cuatro secciones:
  - **Ingresos fijos**: se repiten cada mes desde el mes en que los das de alta (nómina, alquileres…).
  - **Ingresos eventuales**: solo cuentan en el mes en que los registras.
  - **Gastos fijos**: se repiten cada mes (hipoteca, recibos, cuotas…).
  - **Gastos extraordinarios**: solo cuentan en su mes (imprevistos).
- **Ver el estado del mes** en el panel superior: balance, ingresos, gastos y porcentaje de ahorro.
- **Navegar por meses** con las flechas de la cabecera o pulsando una columna de los gráficos.
- **Consultar el dashboard**:
  - TOP 10 de gastos y de ingresos del mes (barras horizontales).
  - Evolución anual de ingresos frente a gastos (columnas y línea).
  - Evolución anual del balance mensual y acumulado.
  - Reparto entre fijos y eventuales/extraordinarios (gráficos de anillo).
- **Exportar informes** en PDF o CSV, del mes seleccionado o del año completo.
- **Hacer copias de seguridad** y restaurarlas en otro dispositivo.

> Los ingresos y gastos fijos se proyectan a los meses posteriores a su alta, por lo que los gráficos anuales incluyen meses futuros.

## Uso en local

1. Descarga o clona el repositorio.
2. Abre `index.html` en tu navegador.

No necesita instalar nada ni usa recursos externos: la tipografía es la del sistema (San Francisco en iPhone).

## Despliegue en GitHub Pages

1. Sube `index.html` (y este `README.md`) a la raíz de tu repositorio.
2. Ve a **Settings → Pages**.
3. En **Source** elige **Deploy from a branch**, selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
4. Tras un minuto o dos, la app estará disponible en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Dónde se guardan los datos

Todo se guarda en el **`localStorage` de tu navegador**, es decir, en el propio dispositivo. Los datos **no se envían a ningún servidor ni se suben al repositorio**.

Esto implica:

- Los datos pertenecen a **ese navegador, en ese dispositivo y en esa dirección web**. Si cambias de móvil, de navegador o de URL, empezarás en blanco.
- Si borras los datos del sitio desde los ajustes del navegador, se pierden.
- En modo privado, el navegador puede no permitir guardar. La app lo avisa en el pie de la página.
- Si abres la app en varias pestañas, los cambios se sincronizan entre ellas.

Por eso conviene hacer una **copia de seguridad** de vez en cuando.

## Copias de seguridad

En el pie de la página:

- **Copia de seguridad**: descarga un archivo `finanzas-AAAA-MM.json` con todos los movimientos.
- **Restaurar copia**: carga un JSON exportado antes. Pide confirmación porque **reemplaza** los datos actuales; si el archivo no es válido, no toca nada.

Formato del JSON (una lista de movimientos):

```json
[
  { "id": "lq3x9k2a", "tipo": "ingreso", "fijo": true,  "name": "Nómina",   "amount": 1800, "month": "2026-10" },
  { "id": "lq3xa7bc", "tipo": "gasto",   "fijo": false, "name": "Reparación coche", "amount": 240.5, "month": "2026-10" }
]
```

| Campo    | Significado |
|----------|-------------|
| `tipo`   | `ingreso` o `gasto`. |
| `fijo`   | `true` si se repite cada mes; `false` si es eventual o extraordinario. |
| `month`  | Mes en formato `AAAA-MM`. En un fijo es el mes de alta; en uno eventual, el mes en que ocurrió. |
| `amount` | Importe en euros. |
| `name`   | Concepto. |
| `id`     | Identificador interno generado por la app. |

## Informes

Elige el alcance en el selector del pie (**mes seleccionado** o **año completo**) y pulsa el botón del formato:

- **Informe CSV**: se abre directamente en Excel o Google Sheets (separador `;`, decimales con coma y tildes correctas).
  - Mes: una fila por movimiento, con totales al final.
  - Año: resumen de los 12 meses con ingresos y gastos desglosados, y balance.
- **Informe PDF**: abre la ventana de impresión del navegador con una versión limpia del informe. Elige **Guardar como PDF** como destino. Incluye el cuadro resumen y las tablas con sus subtotales.

## Instalar en el iPhone como una app

Con la web publicada en GitHub Pages:

1. Ábrela en **Safari**.
2. Pulsa **Compartir** y elige **Añadir a pantalla de inicio**.
3. Si aparece **Abrir como app web**, déjalo activado, y pulsa **Añadir**.

Se abrirá a pantalla completa, con su icono y sin barras del navegador.

Ten en cuenta:

- La app instalada tiene su **propio almacenamiento**, separado del de Safari. Si ya tenías datos, haz antes una **Copia de seguridad** en Safari e impórtala con **Restaurar copia** dentro de la app instalada.
- iOS no aplica a las apps de la pantalla de inicio el borrado automático de datos de Safari tras días sin uso.
- En el móvil, **Copia de seguridad** y **Informe CSV** abren la hoja de compartir: elige **Guardar en Archivos**.
- El **Informe PDF** usa la impresión del navegador, que puede no funcionar en la app instalada. Si falla, ábrelo desde Safari.

## Estructura del repositorio

```
├── index.html            # toda la aplicación (HTML, CSS y JavaScript)
├── apple-touch-icon.png  # icono para la pantalla de inicio del iPhone
└── README.md
```

## Tecnología

HTML, CSS y JavaScript sin dependencias ni proceso de compilación. Los gráficos son SVG dibujados con JavaScript.

## Limitaciones conocidas

- Sin sincronización entre dispositivos: usa la copia de seguridad para trasladar los datos.
- Moneda fija en euros.
- No hay edición de movimientos: para corregir uno, elimínalo y vuelve a añadirlo.
- El PDF depende del diálogo de impresión del navegador.
