# Proyecto Sorteos

Documento inicial de funcionamiento, arquitectura y opciones de implementacion para una aplicacion 100% frontend de sorteos.

## Objetivo

Crear una aplicacion web para realizar sorteos visuales usando una ruleta. El usuario podra ingresar cualquier cantidad de nombres, configurar como se elige el ganador, iniciar el sorteo y guardar estadisticas locales sobre ganadores, perdedores y participaciones.

La primera version sera solo de ruleta, pero la interfaz debe estar preparada para futuras modalidades de sorteo.

## Alcance de la primera version

La aplicacion debe permitir:

- Agregar N cantidad de nombres.
- Editar nombres antes del sorteo.
- Eliminar nombres individuales.
- Limpiar toda la lista.
- Guardar automaticamente la lista de nombres en el navegador.
- Configurar la regla de ganador.
- Iniciar la ruleta con animacion.
- Mostrar ganador final.
- Guardar historial de sorteos.
- Mostrar metricas acumuladas.
- Mostrar futuras apps de sorteo como bloqueadas con mensaje: "Mas sorteos proximamente".

## Flujo principal

1. El usuario entra a la app.
2. La app carga nombres guardados previamente desde `localStorage`.
3. El usuario agrega, edita o elimina participantes.
4. El usuario configura el modo de sorteo.
5. El usuario presiona `Iniciar`.
6. La ruleta anima los nombres.
7. La app determina el ganador segun la regla configurada.
8. Se muestra el resultado.
9. Se guarda el sorteo en el historial local.
10. Se actualizan las metricas.

## Modos de sorteo

### Gana el primero

La ruleta gira y el primer resultado seleccionado es el ganador.

Uso:

- Sorteos rapidos.
- Rifas simples.
- Elegir una persona de una lista.

### Gana el N resultado

El usuario configura que gane el resultado numero N.

Ejemplos:

- "Gana el 5to que salga".
- "Gana el 6to que salga".
- "Gana el 10mo que salga".

Funcionamiento:

1. La ruleta va sacando resultados.
2. Cada salida se muestra como ronda.
3. Los primeros N - 1 resultados no ganan.
4. El resultado numero N es el ganador.

Esto agrega emocion porque los primeros resultados generan tension sin definir al ganador inmediatamente.

### Modo eliminacion

La ruleta va eliminando participantes hasta que quede uno.

Funcionamiento:

1. La ruleta selecciona un participante.
2. Ese participante queda eliminado.
3. Se actualiza la ruleta sin ese nombre.
4. Se repite hasta que quede un unico participante.
5. El ultimo participante es el ganador.

Opciones:

- Eliminacion lenta.
- Eliminacion rapida.
- Pausa entre eliminados.
- Mostrar lista de eliminados.

## Configuraciones

### Rapidez del sorteo

Control tipo slider o selector:

- Lento: mas suspenso.
- Medio: equilibrio.
- Rapido: sorteo agil.
- Turbo: casi instantaneo, pero manteniendo animacion minima.

Internamente afecta:

- Duracion del giro.
- Tiempo entre rondas.
- Velocidad de desaceleracion.
- Pausa antes de revelar ganador.

### Nivel de emocion

Control que define cuantos efectos visuales se activan.

Opciones propuestas:

- Simple: giro limpio, resultado directo.
- Emocion: sonidos opcionales, pausas dramaticas, resaltado de nombres.
- Show: confeti, cuenta regresiva, zoom al ganador, historial visible.

En la primera version se puede implementar sin audio para evitar molestias. El audio puede quedar como opcion futura.

### Regla de repeticion

Define que pasa con los ganadores anteriores.

Opciones:

- Permitir que una persona gane varias veces.
- Evitar ganadores repetidos durante la sesion.
- Evitar ganadores repetidos en todo el historial guardado.

### Semilla aleatoria opcional

Opcion futura. Permite reproducir un sorteo si se usa la misma lista y la misma semilla.

No es necesaria para la primera version, pero puede ser util si se quiere transparencia.

## Animacion de ruleta

Hay tres caminos posibles:

### Opcion A: CSS puro

Usar HTML + CSS para construir la ruleta con segmentos y animar rotacion.

Ventajas:

- No requiere librerias pesadas.
- Carga rapido.
- Facil de servir como sitio estatico.
- Buena para una primera version.

Desventajas:

- Segmentos muy numerosos pueden ser dificiles de leer.
- Calcular colores, angulos y textos requiere cuidado.
- Textos en ruletas grandes pueden saturarse.

### Opcion B: Canvas 2D

Dibujar la ruleta en un canvas.

Ventajas:

- Mejor control visual.
- Ideal para muchos participantes.
- Animacion mas fluida.
- Facil dibujar segmentos, textos, flecha y efectos.

Desventajas:

- Requiere mas logica manual.
- Menos accesible si no se complementa con HTML.
- Hay que cuidar resolucion en pantallas retina.

### Opcion C: SVG

Generar segmentos de ruleta con SVG.

Ventajas:

- Visual nitido.
- Cada segmento puede ser interactivo.
- Buen equilibrio entre CSS y canvas.

Desventajas:

- Mas complejo que CSS puro.
- Con muchos nombres puede volverse pesado.

## Recomendacion visual

Para este proyecto recomiendo usar **Canvas 2D para la ruleta** y HTML/CSS para la interfaz.

Motivo:

- La ruleta es el centro de la app.
- Canvas da libertad para animacion fluida.
- Permite manejar muchas personas sin romper el layout.
- Podemos dibujar nombres, colores, marcador, efectos de giro y resaltado final.

La interfaz alrededor de la ruleta debe ser HTML normal: inputs, botones, panel de configuracion, historial y metricas.

## Persistencia local

Como sera 100% frontend, no se usara base de datos al inicio.

Se recomienda usar `localStorage`.

Datos a guardar:

```json
{
  "participants": ["Ana", "Luis", "Carlos"],
  "settings": {
    "mode": "first",
    "winnerIndex": 1,
    "speed": "medium",
    "emotion": "normal",
    "avoidRepeatedWinners": false
  },
  "history": [],
  "stats": {}
}
```

### Cookies vs localStorage

Recomendacion: **localStorage**.

Motivos:

- No necesitamos mandar datos al servidor.
- Permite guardar mas informacion que cookies.
- Es mas simple para historial y metricas.
- Es ideal para una app estatica.

Las cookies solo tendrian sentido si el servidor necesitara leer datos, y aqui no es necesario.

## Historial

Cada sorteo debe guardar:

- Fecha y hora.
- Modo usado.
- Lista de participantes.
- Ganador.
- Eliminados, si aplica.
- Numero de ronda ganadora.
- Duracion aproximada.

Ejemplo:

```json
{
  "id": "2026-05-21T03:20:00.000Z",
  "mode": "nth",
  "winnerIndex": 5,
  "participantsCount": 20,
  "winner": "Ana",
  "drawnNames": ["Luis", "Marta", "Pedro", "Sofia", "Ana"]
}
```

## Metricas

Metricas recomendadas:

- Total de sorteos realizados.
- Persona con mas victorias.
- Persona con mas participaciones.
- Persona con mas eliminaciones.
- Personas que nunca han ganado.
- Porcentaje de victoria por participante.
- Ultimos ganadores.
- Racha actual de una persona sin ganar.

### Modelo de metricas

Las metricas pueden calcularse desde el historial en vez de guardarse como datos separados.

Ventaja:

- Evita inconsistencias.
- Si cambia la forma de calcular, se recalcula desde historial.

## Pantallas propuestas

### Ruleta

Pantalla principal.

Contenido:

- Ruleta grande.
- Lista de participantes.
- Boton iniciar.
- Configuraciones principales.
- Resultado actual.
- Rondas/eliminados si aplica.

### Historial

Listado de sorteos anteriores.

Contenido:

- Fecha.
- Ganador.
- Modo.
- Cantidad de participantes.
- Detalle expandible.

### Metricas

Dashboard simple.

Contenido:

- Ranking de ganadores.
- Ranking de participaciones.
- Ranking de eliminados.
- Personas sin ganar.
- Total de sorteos.

### Mas sorteos

Vista de tarjetas para futuras apps:

- Sorteo por tombola.
- Dados.
- Cartas.
- Carrera aleatoria.
- Numeros.
- Equipos aleatorios.

Al dar clic en cualquiera:

```text
Mas sorteos proximamente
```

## Stack recomendado

### No recomiendo Laravel

Laravel es excelente para backend, paneles y bases de datos, pero aqui seria demasiado para una app 100% frontend.

No necesitamos:

- PHP.
- Base de datos.
- Servidor backend.
- Autenticacion.
- Rutas de API.

### No recomiendo Angular para esta primera version

Angular sirve para aplicaciones grandes de empresa, pero para este proyecto inicial seria mas pesado de lo necesario.

Desventajas aqui:

- Mas estructura inicial.
- Mas archivos.
- Curva mayor.
- Menos rapido para prototipar.

### HTML, CSS y JS puro

Es viable.

Ventajas:

- Muy simple.
- Cero dependencias.
- Facil de servir en cualquier lado.

Desventajas:

- Si crece a varias apps, historial, metricas y configuraciones, el codigo puede volverse desordenado.
- Manejar estado y componentes manualmente puede complicarse.

### Recomendacion final: React + Vite + TypeScript

Recomiendo iniciar con:

```text
Vite + React + TypeScript
```

Motivos:

- Sigue siendo 100% frontend.
- Se compila a archivos estaticos.
- Es facil de servir con Nginx, Caddy o Docker.
- React facilita dividir en componentes:
  - `WheelCanvas`
  - `ParticipantsPanel`
  - `DrawSettings`
  - `HistoryView`
  - `StatsView`
  - `ComingSoonCards`
- TypeScript ayuda a que modos, historial y metricas no se vuelvan confusos.
- Vite es rapido y ligero para desarrollo.

## Como levantarlo en el servidor

La app final se puede levantar de dos formas.

### Opcion recomendada: Docker + Nginx

Flujo:

1. Construir la app:

```bash
npm run build
```

2. Servir la carpeta `dist` con Nginx dentro de Docker.

Ventajas:

- Limpio.
- Facil de reiniciar.
- Facil de mover.
- Encaja con la idea de correr servicios en contenedores.

### Opcion simple: Nginx instalado normal

Instalar Nginx en Ubuntu y copiar `dist` a:

```text
/var/www/sorteos
```

Ventajas:

- Muy simple.
- Buen rendimiento.

Desventajas:

- Ensucia mas el host.
- Menos portable que Docker.

### Opcion temporal: servidor de desarrollo

Para probar:

```bash
npm run dev -- --host 0.0.0.0
```

No recomendado para produccion.

## Estructura sugerida del proyecto

```text
sorteos/
├─ README.md
├─ package.json
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ components/
│  │  ├─ WheelCanvas.tsx
│  │  ├─ ParticipantsPanel.tsx
│  │  ├─ DrawSettings.tsx
│  │  ├─ ResultPanel.tsx
│  │  ├─ HistoryPanel.tsx
│  │  ├─ StatsPanel.tsx
│  │  └─ ComingSoonCard.tsx
│  ├─ lib/
│  │  ├─ drawEngine.ts
│  │  ├─ storage.ts
│  │  ├─ stats.ts
│  │  └─ random.ts
│  ├─ styles/
│  │  └─ app.css
│  └─ types/
│     └─ draw.ts
├─ Dockerfile
└─ nginx.conf
```

## Motor de sorteo

El sorteo no debe depender solo de la animacion.

Regla importante:

- Primero se calcula el resultado real.
- Luego la animacion representa ese resultado.

Esto evita que errores visuales cambien el ganador.

### Funciones principales

```text
runFirstWinner(participants)
runNthWinner(participants, n)
runElimination(participants)
```

Cada funcion devuelve un resultado estructurado:

```json
{
  "winner": "Ana",
  "drawnNames": ["Luis", "Pedro", "Ana"],
  "eliminated": [],
  "rounds": 3
}
```

## Reglas de validacion

- No permitir iniciar con menos de 2 participantes.
- No permitir nombres vacios.
- Trimear espacios al inicio y final.
- Opcional: evitar nombres duplicados.
- Si el modo es "gana el N", N debe ser menor o igual al numero de participantes si no se permiten repeticiones.
- Si se permiten repeticiones, N puede ser mayor.

## Ideas extra para la ruleta

- Boton para importar nombres pegando una lista separada por saltos de linea.
- Boton para mezclar lista.
- Boton para duplicar participante si alguien tiene mas oportunidades.
- Peso por participante: una persona puede tener mas probabilidad.
- Tema visual claro/oscuro.
- Confeti al ganador.
- Exportar historial en JSON.
- Reiniciar estadisticas.
- Modo pantalla completa para eventos.
- Nombre del sorteo, por ejemplo: "Rifa de mayo".
- Compartir resultado como texto.

## Decision implementada

Se implemento la primera version con:

```text
HTML + CSS + JavaScript puro + Canvas 2D + localStorage
```

Servida en el servidor con:

```text
Docker + Nginx
```

Motivo:

- Es mas ligero que Angular o React para la primera version.
- No necesita backend.
- No necesita Node.js en produccion.
- Nginx sirve los archivos estaticos desde Docker.
- La app sigue siendo facil de mover y publicar con Cloudflare.

## Archivos creados

```text
sorteos/
├─ index.html
├─ styles.css
├─ app.js
├─ Dockerfile
├─ docker-compose.yml
├─ nginx.conf
└─ README.md
```

## Ejecucion con Docker

Desde la carpeta `sorteos`:

```bash
docker compose up -d --build
```

La app queda disponible en:

```text
http://localhost:8081
```

En el servidor:

```text
http://192.168.100.242:8081
```

El puerto `8081` se eligio porque el puerto `8080` esta usado por el endpoint temporal de prueba.

## Pruebas locales sin Docker

Mientras se ajusta la app, no hace falta reconstruir Docker en cada cambio.

Opcion rapida:

```text
Abrir C:\Dev\sorteos\index.html en el navegador
```

Opcion recomendada para probar como sitio web:

```powershell
cd C:\Dev\sorteos
python -m http.server 5173 --bind 127.0.0.1
```

Luego abrir:

```text
http://127.0.0.1:5173/
```

Deja esa terminal abierta mientras pruebas. Cuando termines, presiona `Ctrl+C`.

Cuando los cambios ya se vean bien localmente, se vuelve a desplegar en el servidor con:

```bash
cd /home/manuelchucuan/sorteos
docker compose up -d --build
```

## Cloudflare Tunnel

Para exponer la app sin abrir puertos con Totalplay, se recomienda usar Cloudflare Tunnel.

Destino local del tunnel:

```text
http://localhost:8081
```

Ejemplo de hostname publico:

```text
sorteos.tudominio.com -> http://localhost:8081
```

Flujo recomendado:

1. Tener un dominio agregado a Cloudflare.
2. Instalar `cloudflared` en el servidor.
3. Crear un tunnel.
4. Configurar un Public Hostname:

```text
Subdomain: sorteos
Domain: tudominio.com
Service: http://localhost:8081
```

5. Dejar `cloudflared` como servicio del sistema.

Mientras no haya dominio configurado en Cloudflare, se puede probar con una URL temporal de `trycloudflare`, pero esa URL no es bonita ni ideal para produccion.
