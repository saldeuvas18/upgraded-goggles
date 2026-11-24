# Bolsas & Vasos — catálogo y pedidos

Aplicación web en español para vender bolsas para dama y caballero, vasos de diferentes medidas, vasos térmicos y accesorios. Funciona como sitio estático, permite preparar pedidos por WhatsApp y se puede instalar como aplicación web en navegadores compatibles.

## Abrir y comenzar a usar

1. Abre `index.html` para probar la tienda en tu computadora o teléfono. Para instalarla en el teléfono y usar las funciones sin conexión, publícala primero por HTTPS.
2. En la parte superior pulsa **Mi tienda**.
3. Configura el nombre del negocio y el WhatsApp con código de país (solo números, por ejemplo `521...`). Añade instrucciones de pago y ajusta precios y existencias de ejemplo.
4. Usa **＋ Agregar** para incorporar tus productos reales, modelos, colores, capacidades y fotos/emojis. Los precios y el inventario de inicio son ejemplos editables.
5. Exporta un respaldo y guárdalo. Comparte con tus clientes la dirección pública de la tienda.

La tienda ya inicia con bolsas para dama y caballero, cangurera, vasos de varias medidas, vaso térmico, termo y monedero. No hay productos de verdura.

## Publicar gratis con GitHub Pages

En el repositorio, ve a **Settings → Pages**, elige **Deploy from a branch**, selecciona `feat/ventas-reservas-voz` y la carpeta `/(root)`, y guarda. Cuando Pages publique el sitio, comparte la URL HTTPS que GitHub muestre. No publiques en una rama o carpeta que incluya secretos.

La app se puede añadir a la pantalla de inicio desde el menú del navegador. La instalación y el modo sin conexión requieren una URL HTTPS; el sitio de GitHub Pages proporciona HTTPS.

## Pedidos y pagos

- El cliente filtra el catálogo, elige cantidades y puede pedir entrega/coordinar o solicitar reserva para retirar en una fecha.
- Al enviar el pedido, se prepara un mensaje para el WhatsApp que configuraste. El cliente y el vendedor coordinan entrega y pago directamente.
- Opcionalmente puedes poner un enlace seguro HTTPS de cobro de tu proveedor. Se abre el enlace que configures; **esta app no cobra ni confirma pagos automáticamente**.
- La reserva que pide el cliente es una solicitud: espera confirmación del vendedor. El inventario mostrado no se sincroniza entre distintos teléfonos.
- No introduzcas datos de tarjeta, contraseñas, tokens ni claves bancarias en la aplicación o en mensajes.

## Límite importante de esta versión

Esta edición es una app estática de inicio rápido. Sus productos, precios, pedidos y configuración se guardan localmente en el navegador; los cambios de “Mi tienda” no se sincronizan automáticamente con los teléfonos de los clientes ni con otros dispositivos. Para empezar sin backend, publica el catálogo con tus datos y recibe pedidos por WhatsApp. Para existencias y pedidos compartidos en tiempo real, pagos automáticos, reservas con expiración o administración desde varios teléfonos se necesita añadir un servidor y una base de datos.

Los valores iniciales son solo ejemplos: sustituye precio y stock por los datos reales antes de compartir la tienda.
