# Plataforma #Abandonados — borrador web

Sitio estático multipágina preparado para Cloudflare Pages.

## Desarrollo local

Puede abrirse directamente `index.html`, aunque para conservar las rutas absolutas se recomienda un servidor local:

```bash
python -m http.server 8080
```

Después: `http://localhost:8080`

## Publicación

Subir el contenido del repositorio a GitHub y conectar ese repositorio a Cloudflare Pages. No necesita comando de compilación. Directorio de salida: `/`.

## Estructura

- `index.html`
- `nosotros/`
- `actuaciones/`
- `contacto/`
- `assets/`
- `_headers`, `robots.txt`, `sitemap.xml`, `404.html`

El formulario de contacto es solo una maqueta y no envía información.
