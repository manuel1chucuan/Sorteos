# Modificaciones y fixes

Lista viva de ajustes detectados durante pruebas de la app.

## Pendientes

- Revisar experiencia visual de la ruleta en pantallas grandes y chicas.
- Mejorar la lectura de nombres cuando hay muchos participantes.
- Agregar confirmacion antes de borrar historial o limpiar participantes.
- Agregar opcion para exportar/importar historial.
- Agregar modo de pantalla completa para eventos.

## Fixes aplicados

### 2026-05-21 - Transparencias restauradas en movil

Cambio:

Se restauraron las transparencias que se habian vuelto opacas en movil para tapar contenido durante las pruebas de layout fijo.

Detalles:

- Ruleta fija vuelve a usar fondo translucido.
- Pestañas fijas vuelven a usar fondo translucido con blur.
- Botones de pestañas recuperan transparencia.
- Boton flotante de participantes recupera transparencia.
- Se conserva la estructura de contenedores fijos/absolutos que evita que el contenido se encime.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Modal sin boton interno y transicion en tres puntos

Cambio:

En movil se retiro el boton interno de cerrar del modal de participantes porque se encimaba con otros controles. El cierre queda por toque fuera del modal usando el backdrop.

Detalles:

- Se elimino el boton `x` del modal.
- El modal se cierra tocando el fondo semitransparente.
- Los botones compactos `...` ahora tienen transicion, hover, sombra y presion.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Modal movil para participantes

Problema:

El cajon de participantes podia quedar visualmente detras del panel de reglas porque seguia viviendo dentro del contenedor inferior de la vista `Ruleta`.

Solucion:

- El panel de participantes en movil ahora se comporta como modal fijo.
- Se agrego un backdrop semitransparente.
- El modal queda por encima de la ruleta, las pestañas y el panel de reglas.
- Se puede cerrar con la `x` del modal o tocando el backdrop.
- Se conserva el boton flotante de engranaje para abrirlo.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Cajon flotante de participantes movil

Cambio:

En movil, el panel de participantes queda oculto por defecto en la vista `Ruleta` y se abre desde un boton flotante con engranaje.

Detalles:

- Se agrego un boton flotante para abrir opciones de participantes.
- Al abrir el panel, el boton flotante se oculta.
- El panel aparece con transicion de altura, opacidad y desplazamiento.
- Se agrego un boton interno para cerrar el panel y volver al engranaje.
- Al cambiar a otra pestaña, el panel se cierra automaticamente.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Contenedores fijos para vistas secundarias movil

Cambio:

En movil, las vistas `Metricas`, `Historial` y `Mas sorteos` ahora usan un contenedor fijo debajo de las pestañas.

Detalles:

- El contenedor empieza justo debajo de la navegacion fija.
- El scroll ocurre dentro de ese contenedor, no en el body.
- El comportamiento queda alineado con la vista `Ruleta`, pero sin reservar espacio para la ruleta.
- Las pestañas permanecen fijas arriba en todas las vistas.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Texto central de ruleta mas pequeno en movil

Cambio:

En movil se redujo la fuente del texto central de la ruleta para que nombres cortos o partidos en varias lineas no se vean apretados dentro del circulo.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Contenedor inferior con scroll local en Ruleta movil

Cambio:

En movil, cuando la pestaña `Ruleta` esta activa, la zona inferior debajo de la ruleta fija funciona como contenedor propio de scroll.

Detalles:

- El body deja de hacer scroll mientras `Ruleta` esta activa en movil.
- `.workspace` se convierte en el divisor fijo inferior, desde debajo de la ruleta hasta el final de la pantalla.
- Participantes y reglas quedan como contenido relativo dentro de ese divisor.
- La ruleta y las pestañas siguen fijas arriba.
- En otras pestañas se mantiene el comportamiento movil normal.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Panel de ruleta solo en vista Ruleta movil

Problema:

En movil, al cambiar a `Metricas`, `Historial` o `Mas sorteos`, el panel de participantes/controles de ruleta seguia visible arriba del contenido.

Solucion:

- En movil, el panel `.participants-panel` se oculta cuando la vista activa no es `Ruleta`.
- La navegacion principal permanece fija arriba.
- Desktop conserva su layout actual.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Tabs moviles fijas entre vistas

Problema:

Al cambiar de `Ruleta` a `Metricas`, `Historial` o `Mas sorteos`, la ruleta se ocultaba correctamente, pero tambien desaparecian las pestañas porque la barra fija movil estaba dentro de la vista de ruleta.

Cambio:

- La barra principal de pestañas vuelve a mostrarse en layouts compactos.
- En movil, esa barra principal queda fija arriba con fondo opaco.
- La barra duplicada que estaba dentro de la ruleta se oculta para evitar que desaparezca al cambiar de vista.
- El espacio reservado para la ruleta fija solo se aplica cuando `Ruleta` esta activa; las demas vistas suben debajo de las pestañas.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Tabs arriba de ruleta fija y fondos opacos

Cambio:

En movil, las pestañas fijas ahora estan arriba de la ruleta fija.

Detalles:

- Tabs moviles pasan a `top: 8px`.
- Ruleta fija baja a `top: 44px`.
- Tabs y ruleta usan fondos opacos para tapar el contenido que pasa detras al hacer scroll.
- Los botones de tabs moviles tambien usan fondo solido.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Compensacion correcta para ruleta fija movil

Problema:

Al fijar la ruleta y las tabs en la parte superior movil, el contenido quedaba por detras y aparecia un hueco grande porque el padding se habia aplicado al `wheel-layout`.

Solucion:

- Se quito el padding superior de `wheel-layout`.
- Se movio la compensacion a `workspace`, para que todo el contenido movil empiece debajo de la ruleta fija.
- Se ajustaron tambien los breakpoints de 390px y 340px.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Ruleta y tabs fijos en viewport movil

Cambio:

En movil, la ruleta y las pestañas inferiores ahora quedan fijas en la parte superior de la pantalla y no se desplazan con el scroll.

Detalles:

- `.wheel-wrap` usa `position: fixed`.
- `.mobile-wheel-tabs` usa `position: fixed` debajo de la ruleta.
- Se agrego padding superior al layout para que el contenido no quede oculto detras de la ruleta fija.
- Se agregaron ajustes para pantallas menores a 390px y 340px.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Ruleta fija arriba y tabs debajo en movil

Cambio:

En movil se agrego una navegacion propia debajo de la ruleta y se oculto la navegacion superior.

Detalles:

- Desktop conserva las pestañas arriba.
- Movil muestra las pestañas debajo de la ruleta.
- La ruleta usa posicion sticky arriba para mantenerse visible durante el scroll.
- Se agrego una segunda barra de tabs solo para movil.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Lista movil de 3 visibles y contorno de ruleta

Cambio:

La lista de participantes en movil ahora muestra aproximadamente 3 filas visibles antes de hacer scroll local.

Detalles:

- Altura maxima reducida.
- Se retiro el borde/sombra inferior de la lista.
- Se reforzo el borde inferior del contenedor de ruleta en movil.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Eliminar subrayado en movil

Cambio:

En movil, el boton de remover participante ya no se muestra como `x`; ahora se muestra como texto subrayado:

```text
Eliminar
```

Desktop conserva la `x`.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Lista movil compacta de 4 visibles

Cambio:

La lista de participantes en movil se compacto para mostrar aproximadamente 4 participantes visibles y luego usar scroll local.

Detalles:

- Filas mas bajas.
- Menor separacion entre filas.
- Boton `x` mas pequeno.
- Padding inferior reducido.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Boton movil con tres puntos

Cambio:

Los botones compactos de desplegar/contraer en movil ya no usan flecha. Ahora muestran solo:

```text
...
```

El estado accesible sigue cambiando con `aria-label`.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Flecha movil superior centrada

Cambio:

La flecha para desplegar carga masiva de participantes ahora queda mas arriba y centrada en el panel superior movil.

Detalles:

- Boton mas pequeno.
- Posicion absoluta centrada.
- Icono centrado vertical y horizontalmente.
- Estado active mantiene el centrado.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Mostrar mas con flecha movil

Cambio:

En movil, los botones `Mostrar mas` / `Mostrar menos` ahora se muestran como flechas compactas.

Detalles:

- Cerrado: flecha hacia abajo.
- Abierto: flecha hacia arriba.
- Se conserva `aria-label` para accesibilidad.
- El boton ocupa menos espacio y queda centrado.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Tabs moviles en una sola fila

Cambio:

Las pestañas de navegacion en movil ahora quedan en una sola fila de 4 columnas compactas.

Detalles:

- 4 columnas en vez de 2.
- Menor altura.
- Menor padding.
- Tipografia mas pequena.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Compactacion superior movil

Cambio:

Se redujo el espacio que ocupan los controles superiores en movil para que se alcance a ver al menos hasta los botones de navegacion/ruleta.

Detalles:

- Header mas compacto.
- Pestañas mas pequeñas.
- Botones e inputs ligeramente mas bajos.
- Menos margenes verticales.
- Lista de participantes con altura inicial mas corta.
- Filas de participantes y botones `x` mas compactos.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Mobile compacto con Mostrar mas

Cambio:

Se rediseño la parte superior y los controles de movil para reducir espacio ocupado sin cambiar funcionamiento.

Detalles:

- En movil se oculta por defecto el textarea grande para pegar/cargar participantes.
- Se agrego `Mostrar mas` para desplegar la carga masiva.
- `Mezclar` queda como accion compacta junto a `Limpiar`.
- La configuracion avanzada de sorteo se oculta por defecto en movil.
- Se agrego otro `Mostrar mas` para desplegar modo, N ganador y rapidez.
- Se mantienen visibles las acciones importantes: participantes actuales, agregar nombre, evitar repetidos, iniciar y reiniciar.
- Desktop conserva el layout actual.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Diseno movil dedicado

Cambio:

Se mantiene el layout desktop actual y se agrego una experiencia movil separada mediante media queries.

Detalles:

- Layout movil en una columna.
- Tabs sticky arriba, con 4 columnas en tablet y 2 columnas en movil.
- Paneles compactos con padding reducido.
- Controles mas grandes y comodos para touch.
- Ruleta cuadrada y proporcional al ancho del dispositivo.
- Centro y puntero de ruleta ajustados para pantallas chicas.
- Listas con scroll local y alturas maximas para no crecer indefinidamente.
- Scroll global solo en movil/tablet.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Scroll movil por secciones

Problema:

En desktop se habia eliminado el scroll global para que cada panel usara scroll interno. En movil eso impedia acceder a las secciones inferiores porque la pantalla queda apilada verticalmente.

Solucion:

- En desktop se conserva la regla de no scroll global.
- En tablet/movil se habilita scroll vertical global.
- El scroll movil usa `scroll-snap-type: y proximity` para sentirse por secciones sin ser rigido.
- Los paneles principales usan `scroll-snap-align: start`.
- Las listas largas mantienen scroll local con altura maxima para no crecer indefinidamente.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Bloqueo de controles durante sorteo

Cambio:

Mientras la ruleta esta girando se deshabilitan los controles de la pagina para evitar cambios a mitad del sorteo.

Excepciones:

- `Reiniciar` sigue habilitado para cancelar/restaurar.
- `Rapidez` sigue habilitado.

Al terminar el sorteo o presionar `Reiniciar`, todos los controles vuelven a habilitarse.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Ganador unico arriba y centrado de X

Problema:

En eliminacion, el ganador unico podia quedar visualmente abajo porque la transformacion de rotacion anterior seguia aplicada al canvas. Las `x` de remover participante tambien se veian descentradas verticalmente.

Solucion:

- Al quedar un solo ganador, se fuerza la rotacion visual del canvas a `0deg`.
- Se fuerza reflow para cortar la transicion anterior.
- El boton de remover usa `display: grid` y `place-items: center`.
- Se fijo `line-height: 1` y `padding: 0` en la `x`.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Separacion inferior en listas con scroll

Problema:

El ultimo elemento de las listas quedaba demasiado pegado al borde inferior, especialmente donde esta la `x` de eliminar y en la lista de rondas.

Solucion:

- Se agrego padding inferior a `participants-list` y `rounds-list`.
- Se agrego `scroll-padding-bottom` para que el ultimo item tenga espacio al hacer scroll.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Sin scroll global y ganador de eliminacion arriba

Problema:

Las listas podian crecer y empujar el layout, generando scroll global. En eliminacion, cuando quedaba un solo ganador, su nombre podia quedar en un lado de la ruleta en vez de arriba bajo la flecha.

Solucion:

- `html`, `body`, `app-shell` y `workspace` quedan fijados al alto de la ventana.
- Se desactiva el scroll global.
- Las listas usan scroll interno dentro de su propio divisor.
- Panel izquierdo, area central y panel derecho usan `min-height: 0` donde hace falta para que CSS Grid/Flex permita scroll local.
- Al quedar un solo ganador por eliminacion, la ruleta se alinea a `0deg` para que el nombre quede arriba bajo la flecha.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Listas usan espacio libre y eliminacion gana sin vuelta extra

Cambios:

- La lista de participantes ahora crece para usar el espacio libre del panel izquierdo.
- La lista de rondas ahora crece para usar el espacio libre del panel derecho.
- En modo eliminacion, cuando quedan 2 participantes y uno es eliminado, el restante gana inmediatamente.
- Se evita la vuelta extra al ganador final.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Reiniciar cancela sorteo en curso

Problema:

Durante el modo eliminacion, al presionar `Reiniciar` la interfaz se restauraba visualmente, pero la secuencia async del sorteo seguia viva y continuaba eliminando participantes despues del reset.

Solucion:

- Se agrego `drawRunId` como token de cancelacion.
- Cada sorteo incrementa el token al iniciar.
- `Reiniciar` incrementa el token para invalidar cualquier sorteo en curso.
- `spinTo` y los ciclos de rondas verifican el token antes de continuar.
- `Reiniciar` vuelve a habilitar el boton `Iniciar` y marca `spinning = false`.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Reiniciar reincorpora participantes en eliminacion

Problema:

Despues de un sorteo en modo eliminacion, el boton `Reiniciar` limpiaba la sesion pero la ruleta seguia mostrando solo el estado final o el ganador.

Solucion:

- `Reiniciar` ahora redibuja la ruleta con todos los participantes actuales.
- Limpia las rondas visibles.
- Reinicia la posicion visual de la ruleta.
- Quita el estilo de ganador del panel.
- Restablece el centro a `Listo`.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Alineacion inferior de paneles principales

Problema:

El panel izquierdo bajaba mas que el panel de la ruleta y el panel derecho, rompiendo la linea inferior del layout.

Solucion:

- Se separaron las alturas porque el panel izquierdo no tiene pestañas arriba y el centro/derecha si.
- El panel izquierdo usa:

```css
calc(100vh - var(--page-panel-offset))
```

- El layout central usa:

```css
calc(100vh - var(--wheel-panel-offset))
```

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Tercer tema fabrica y boton Iniciar por tema

Cambio:

Se agrego un tercer tema visual tipo fabrica de juguetes de terror, con una imagen original generada para el fondo:

```text
assets/factory-bg.png
```

Detalles:

- El selector de tema ahora rota entre claro, oscuro y fabrica.
- Tema fabrica usa colores rojo, azul y amarillo industrial.
- El boton `Iniciar` ahora tiene colores explicitos por tema para evitar estilos cruzados.
- Premio en tema claro: arcoiris mas intenso.
- Premio en tema oscuro: noche estrellada/nebulosa.
- Premio en tema fabrica: segmento con rayos y dos manos estilizadas roja/azul dibujadas en canvas.

Nota:

La imagen de fabrica es original y evita logos/personajes reconocibles.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Ajuste de translucidez

Cambio:

Se aumento la translucidez de paneles, tabs, contenedor de ruleta, tarjetas internas y listas para que el fondo global tenga mas presencia.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Fondos globales y paneles translucidos

Cambio:

Los fondos generados dejaron de estar solo atras de la ruleta y ahora viven en el `body`.

Uso:

- Tema claro: bosque colorido como fondo global.
- Tema oscuro: galaxia como fondo global.
- Paneles principales con translucidez y blur suave.
- Items internos, tabs, tarjetas, resultado y rondas con fondos semitransparentes.
- El contenedor de la ruleta queda translucido para integrarse mejor con el fondo global.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Fondos por tema y contorno del boton Iniciar

Cambio:

Se agregaron dos assets generados para el panel de la ruleta:

```text
assets/forest-bg.png
assets/galaxy-bg.png
```

Uso:

- Tema claro: bosque colorido como fondo del contenedor de la ruleta.
- Tema oscuro: galaxia como fondo del contenedor de la ruleta.
- Se agrego una capa de color encima para que la ruleta siga siendo legible.
- El boton `Iniciar` ahora tiene contorno y sombra interna para sentirse mas definido.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Limpiar premio al reiniciar y quitar animacion extra

Problema:

Despues de ganar, al iniciar otro sorteo la ruleta empezaba a girar manteniendo el segmento ganador con color arcoiris/nebulosa. Ademas el efecto animado de ganador se sentia demasiado llamativo.

Solucion:

- Al iniciar un sorteo nuevo, la ruleta se redibuja con colores normales antes de girar.
- Cada giro tambien limpia el color de premio antes de animar.
- Se quitaron las animaciones extra del texto ganador y del aura de la ruleta.
- El premio queda como estilo estatico fuerte.
- Tema claro: premio arcoiris mas intenso.
- Tema oscuro: premio tipo noche estrellada con nebulosa dentro del segmento.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Paletas por tema, contraste de letras y premio brillante

Problema:

El segmento ganador se pintaba amarillo plano y no se sentia como premio. Ademas, algunos nombres podian perder legibilidad dependiendo del color del segmento.

Solucion:

- Tema claro: segmentos con colores pastel.
- Tema oscuro: segmentos con colores mas profundos.
- Segmento ganador: gradiente brillante en tema claro.
- Segmento ganador: gradiente tipo nebulosa en tema oscuro.
- Textos de la ruleta: se calcula contraste por color de segmento.
- Si el segmento es claro, el texto va negro con contorno blanco.
- Si el segmento es oscuro, el texto va blanco con contorno negro.
- Al revelar ganador, el panel dispara efecto arcoiris en tema claro y nebulosa/estrellas en tema oscuro.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Sensacion de interaccion y ganador luminoso

Problema:

Los controles se sentian planos al interactuar con ellos. Hover, click y focus no daban suficiente respuesta visual. El ganador tambien necesitaba una revelacion mas expresiva.

Solucion:

- Se agregaron transiciones a botones, inputs, selects, textarea, tarjetas y filas.
- Los botones ahora responden con hover, sombra, color y presion al hacer click.
- Los inputs y selects resaltan mejor al enfocar o pasar el mouse.
- Las filas de participantes tienen movimiento sutil al pasar el mouse.
- El ganador usa una animacion tipo arcoiris con brillo cuando se revela.
- Se agrego soporte para `prefers-reduced-motion`.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Distribucion de tabs y simetria de paneles

Problema:

Las pestanas quedaban agrupadas hacia la izquierda dejando espacio muerto, y el panel de configuracion no tenia la misma presencia visual que el panel de la ruleta.

Solucion:

- Las pestanas ahora usan una grilla de 4 columnas iguales.
- El area principal usa columnas con ancho minimo mas estable.
- El panel de ruleta y el panel de reglas se estiran a la misma altura base.
- En movil, las pestanas pasan a 2 columnas para evitar texto comprimido.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```

### 2026-05-21 - Alineacion de flecha con ganador

Problema:

La app podia mostrar un ganador correcto en el panel, pero la flecha visual quedaba apuntando a otro nombre en la ruleta.

Ejemplo observado:

```text
Panel: cris
Flecha: jazmin
```

Causa:

El calculo de giro agregaba el angulo objetivo completo en cada tirada sin compensar la rotacion actual acumulada. Despues de uno o mas giros, la posicion visual podia desfasarse del resultado real.

Solucion:

- Se agrego normalizacion de grados.
- Se calcula el angulo final deseado para el nombre ganador.
- Se calcula solo el delta necesario desde la rotacion actual.
- Se mantienen vueltas extra para que la animacion siga sintiendose como ruleta.
- Al cambiar la lista de participantes se reinicia la posicion visual de la ruleta para evitar estados viejos.

Estado:

```text
Aplicado localmente.
Pendiente de validar visualmente antes de subir Docker al servidor.
```
