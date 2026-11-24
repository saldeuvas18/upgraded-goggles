# La Cosecha — pedidos fáciles

Aplicación web sencilla en español para mostrar productos y existencias, armar pedidos, solicitar reservas para retirar, coordinar el pago por WhatsApp, imprimir un ticket y hacer una búsqueda por voz cuando el navegador lo permite.

## Ejecutar

No requiere instalar paquetes, servidor, base de datos ni claves API.

1. Descarga o clona este repositorio.
2. Abre `index.html` en un navegador moderno. Para micrófono y algunas funciones del navegador, usa una dirección HTTPS; también funciona con `localhost`.
3. En **Mi tienda**, cambia el nombre, agrega tu WhatsApp con código de país (solo números), define instrucciones o un enlace seguro de pago y ajusta el inventario.
4. Comparte la página con tus clientes.

También se puede publicar gratis como sitio estático con GitHub Pages: en el repositorio, ve a **Settings → Pages**, elige **Deploy from a branch**, selecciona `feat/ventas-reservas-voz` y la carpeta `/ (root)`, y guarda. GitHub publicará la dirección del sitio cuando termine el despliegue.

## Cómo funciona

- El cliente filtra productos, ve existencias, agrega cantidades y prepara el pedido.
- El pedido se abre como mensaje de WhatsApp para que el vendedor lo confirme.
- Puede solicitar una reserva para retirar en una fecha, imprimir un ticket no fiscal y seguir un enlace de pago configurado por el vendedor.
- En **Mi tienda** se pueden editar existencias, añadir productos, exportar/importar el respaldo JSON y configurar los datos de contacto.
- La búsqueda por voz usa Web Speech API si el navegador lo admite; no es necesaria para usar la app.

## Importante antes de vender

Esta es una primera versión estática: la configuración e inventario se guardan en el `localStorage` del navegador donde se editan. **No se sincronizan entre el vendedor y los clientes ni entre dispositivos**, por lo que las cantidades que ve cada cliente no son inventario central en tiempo real. El pedido no se confirma automáticamente y la app no procesa pagos ni guarda datos de tarjetas. Confirma existencias, reserva y pago directamente con el cliente. Para disponibilidad compartida y reservas confiables se necesita añadir un backend y una base de datos; para cobros automáticos, integrar un proveedor de pago en el servidor.

No publiques claves privadas, contraseñas, tokens ni datos bancarios sensibles. Usa únicamente enlaces oficiales de pago y verifica los pagos en la plataforma del proveedor.

## Respaldo

En **Mi tienda → Exportar respaldo** descarga el inventario y configuración del navegador actual. Guarda el archivo en un lugar seguro. Importarlo reemplaza la configuración actual del navegador.
