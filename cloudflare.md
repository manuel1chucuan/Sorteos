# Cloudflare Tunnel

## Estado actual

La app puede exponerse con Cloudflare de dos formas.

Quick Tunnel activo:

```text
https://slow-quarterly-males-addition.trycloudflare.com
```

Contenedor:

```text
sorteos-cloudflare
```

## Opcion temporal: Quick Tunnel

No requiere dominio ni token.

```bash
docker run -d \
  --name sorteos-cloudflare \
  --network host \
  --restart unless-stopped \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate --url http://localhost:8081
```

La URL publica aparece en los logs:

```bash
docker logs sorteos-cloudflare
```

Limitacion:

```text
La URL trycloudflare.com puede cambiar si se recrea el tunnel.
```

## Opcion permanente: dominio en Cloudflare

Requiere un dominio agregado a Cloudflare y un tunnel configurado desde Zero Trust.

Destino local recomendado:

```text
http://localhost:8081
```

Public hostname sugerido:

```text
sorteos.tudominio.com
```
