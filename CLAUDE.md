# CLAUDE.md — Acción Vecinal Vélez (web)

Guía de trabajo para el repo `aban2`. Léela entera antes de tocar nada.

---

## 1. Contexto

La **Plataforma #Abandonados** pasa a llamarse **ACCIÓN VECINAL VÉLEZ**. El sitio actual
es un borrador estático publicado en `https://abandonados.focoves.workers.dev/`
(Cloudflare Workers Assets). Hay dominio propio nuevo: **accionvecinalvelez.com**,
registrado en Hostinger y vacío.

**La urgencia real no es el rename: es publicar la guía de la Tasa de Basuras.**
Hay un plazo legal de un mes por vecino y cada semana de retraso son vecinos que
pierden el derecho a la devolución. El rename es lo mínimo imprescindible para que
esa página no salga con la marca vieja.

El sitio es un draft y se asume como tal. La migración a Astro / CMS headless queda
fuera de alcance y se retoma después.

---

## 2. Decisiones cerradas (no reabrir sin motivo)

| Tema | Decisión |
|---|---|
| Branch de trabajo | `main-accion` |
| Repo | Sigue llamándose `aban2`. No se renombra. |
| Hosting de producción | **Hostinger**, por los bloqueos de IP de LaLiga sobre Cloudflare |
| Dominio | `accionvecinalvelez.com`, DNS en Hostinger |
| Worker | Se mantiene. El estado actual debe quedar recuperable (ver §5) |
| Alcance del rename | Solo web. `index.html` y `nosotros/` a fondo; el resto, mínimo |
| Google Fonts | Se queda (no es prioritario autoalojarlo), pero hay que desbloquearlo en el CSP |
| Página de la tasa | Adaptada a ámbito municipal + ficheros descargables propios |
| Estatutos, registro y CIF | Pendientes a unos meses. **No escribir CIF ni domicilio social todavía.** |
| Tiempo verbal de la federación | «Nos estamos constituyendo como Federación», hasta que haya inscripción |
| Carta de pago y formulario de Lucía | **No se publican.** Para ilustraciones, capturas de AVEOtorre |

---

## 3. Reglas de trabajo

1. **No tocar `main`.** Todo va a `main-accion`.
2. **Antes de crear el branch, etiquetar el estado actual** para poder volver al worker
   tal y como está hoy (§5).
3. Commits pequeños y con mensaje descriptivo. Nada de un commit gigante.
4. **No inventar datos legales.** Fechas, números de liquidación, artículos y plazos se
   copian de las fuentes citadas en §9 o se dejan marcados como `[CONFIRMAR]`.
5. **No prometer lo que no hay**: no poner CIF, ni número de registro, ni formularios que
   no envíen nada.
6. La marca "Abandonados" **no desaparece del sitio**: pasa a ser el origen histórico que se
   cuenta en la home y en `nosotros/`. Nada de `sed` global sobre la palabra.
7. El dominio viejo (`abandonados.focoves.workers.dev`) **sí** se reemplaza en bloque.

---

## 4. Inventario del repo (estado al abrir el branch)

```
index.html              171 líneas   home
nosotros/index.html     172 líneas
actuaciones/index.html    8 líneas   (minificado, 1 actuación + cronología)
contacto/index.html       6 líneas   (minificado, formulario de demo)
404.html
assets/css/styles.css   833 líneas
assets/js/main.js        68 líneas
assets/img/             19 ficheros  (nombres abandonados_*, logo-abandonados*)
assets/icons/           10 ficheros  (abandonados_favicon*, abandonados_icon*)
_headers                 CSP + cabeceras (SOLO funciona en Cloudflare)
wrangler.jsonc           name: "abandonados", assets.directory "./"
robots.txt, sitemap.xml
```

Ocurrencias de la marca: `index.html` 15, `nosotros/` 17, `actuaciones/` 4,
`contacto/` 4, `404.html` 5, `sitemap.xml` 4, `robots.txt` 1. CSS y JS: ninguna.

`assets/img/logo-abandonados.svg` es **solo el icono**, sin texto. Sirve como marca
provisional. Los wordmark con "#ABANDONADOS" son `logo-abandonados0.svg` y
`logo-abandonados-source.svg`, y no los usa ninguna página.

---

## 5. Fase 0 — Preservar el estado actual y abrir el branch

```bash
git checkout main
git pull
git tag -a worker-abandonados -m "Estado del worker antes del rename"
git push origin worker-abandonados
git checkout -b main-accion
git push -u origin main-accion
```

Para restaurar el worker tal y como está hoy, en cualquier momento:

```bash
git checkout worker-abandonados
npx wrangler deploy
```

Anotar en el README que ese tag existe y para qué sirve.

---

## 6. Fase 1 — Dominio y marca (mínimo indispensable)

### 6.1 Dominio, global en todos los HTML + sitemap + robots

Reemplazo literal en `index.html`, `nosotros/index.html`, `actuaciones/index.html`,
`contacto/index.html`, `404.html`, `sitemap.xml`, `robots.txt`:

```
https://abandonados.focoves.workers.dev  →  https://accionvecinalvelez.com
```

Afecta a `canonical`, `og:url` y `og:image` de las cuatro páginas.

### 6.2 Correcciones sueltas del mismo barrido

- `contacto/index.html`: `og:image` termina en `.jpag`. Debe ser
  `logo_abandonados_750_blancow.jpg`.
- `_headers`: el CSP lleva `style-src 'self'` y no tiene `font-src`, así que **la
  hoja de Google Fonts está bloqueada y la tipografía Inter no carga en ninguna
  página**. Sustituir por:

```
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

### 6.3 Marca visible

- `<span class="brand-name">` del header: `Abandonados` → `Acción Vecinal Vélez`
  (en las cuatro páginas).
- `<span class="brand-name">` del footer: `Plataforma Abandonados` →
  `Acción Vecinal Vélez`.
- Línea pequeña del footer: `Borrador web · Plataforma #Abandonados · Vélez-Málaga` →
  `Acción Vecinal Vélez · Federación de asociaciones vecinales · Vélez-Málaga`.
- `aria-label="Abandonados, inicio"` → `"Acción Vecinal Vélez, inicio"`.
- `<title>` y `<meta name="description">` de las cuatro páginas.
- `og:title` y `og:description`.
- **Los ficheros de imagen e iconos NO se renombran en esta fase.** Van a pendientes.

### 6.4 Home (`index.html`): bloque del cambio de nombre

Va inmediatamente después del hero, antes de "Otra forma de hacer municipio".
Texto aprobado (revisado: `personalidad jurídica`, no "personería"; corregida la errata
de "haces mover"; eliminada la duplicación red/federación):

> **De #Abandonados a Acción Vecinal**
>
> Nacimos como la Plataforma Abandonados porque así nos sentíamos, y gracias a esa
> rabia nos unimos.
>
> Ahora ya no estamos solos. Somos una Federación de Asociaciones Vecinales con
> personalidad jurídica, que se organiza, actúa y ejerce de interlocutor ante el
> Gobierno Local.
>
> Dejamos de ser "los abandonados" para convertirnos en Acción Vecinal: vigilamos,
> proponemos y hacemos mover a Vélez.

**Ojo con el tiempo verbal.** Mientras los estatutos no estén inscritos, "Somos una
Federación con personalidad jurídica" es un pasito por delante de la realidad. Usar la
versión de arriba solo cuando esté registrada; hasta entonces sustituir esa frase por:
"Nos estamos constituyendo como Federación de Asociaciones Vecinales". Preguntar antes
de publicar.

### 6.5 Home: resto de ajustes mínimos

- `h1`: "Abandonados, la voz de las asociaciones vecinales" → "Acción Vecinal Vélez, la voz
  de las asociaciones vecinales".
- Párrafo `fs-l`: "#Abandonados actúa como espacio de coordinación" → "Acción Vecinal
  actúa como espacio de coordinación".
- Bloque `.numbers`: el dato "14 asociaciones adheridas" hay que revisar contra la lista
  real de la federación. Si no está confirmada, dejar 14 y anotarlo en pendientes.
- `hero-badge` "En movimiento desde 2023": se mantiene, refuerza la continuidad.

### 6.6 `nosotros/index.html`

Misma operación de marca, y adaptar la sección de historia para que cuente la secuencia
2023 → #Abandonados → 2026 → Acción Vecinal Vélez. El manifiesto de 2023 sigue siendo el
punto de partida y se mantiene tal cual.

### 6.7 `actuaciones/` y `contacto/`

Solo dominio, marca del header/footer y metadatos. Nada más. Están minificados en una
línea, así que los cambios son quirúrgicos. La cronología de `actuaciones/` gana una
entrada nueva al final de la fase 2.

---

## 7. Fase 2 — Página de la tasa (**prioridad máxima**)

Ruta: **`/actuaciones/tasa-basuras/index.html`**

### 7.1 Ficheros propios

Crear `assets/docs/` y alojar ahí copias propias. **No enlazar a
`aveotorre.com/wp-content/`**: si AVEOtorre reorganiza su WordPress, se rompen los
enlaces de la página con más tráfico.

```
assets/docs/recurso-tasa-basuras-formulario.pdf
assets/docs/anexo-alegaciones-tasa-residuos.docx
```

**Estado de los ficheros (resuelto):**

1. **El bueno es el Formulario3.** La única diferencia con el 2 está en el campo
   `ALEGACIONES`: el 2 remite en bloque al Anexo I, el 3 lleva el escrito estructurado en
   cuatro alegaciones con la cita de la STSJ Madrid 196/2026. Los otros 72 campos son
   idénticos.
2. **El `Nº de expediente` precargado (`17412026026358`) era de un caso concreto**, el
   mismo de la carta de pago de ejemplo. Viajaba junto a `NUCLEOS: TORRE DEL MAR`,
   `LUGAR: Torre del Mar (Vélez-Málaga)` y `MES: septiembre`: los cuatro son residuo del
   formulario relleno del que se hizo la plantilla. Los cuatro campos van vacíos.
3. **`FECRESOLUCION`** pasa de `NO consta enDoc` a `No consta en el documento`.
4. **El anexo DOCX** pasa a v6: el domicilio del encabezamiento y la localidad de la firma
   quedan como variables (`[NÚCLEO O LOCALIDAD]`, `[LOCALIDAD]`).
5. **La numeración de la Ordenanza está confirmada**: es la **n.º 33** del Ayuntamiento de
   Vélez-Málaga, residuos domésticos en viviendas, publicada en el BOPMA de 3 de diciembre
   de 2025. La **n.º 34** regula los inmuebles de actividades económicas, y este modelo no
   sirve para esas liquidaciones. La nota interna «CONFIRMAR NUMERACIÓN» se ha eliminado
   del documento, porque acababa presentándose con ella dentro.
6. El anexo conserva una primera página con «(ELIMINAR ESTA PÁGINA ANTES DE FIRMAR)».
   La guía lo advierte, pero hay que contar con que alguien la presentará igual.

### 7.2 Estructura de la página

1. **Caja de plazo, arriba del todo, muy visible.** Es lo que más se pierde en la versión
   original, que lo lleva a media página.
   > Tienes **UN MES desde la notificación** para presentar el recurso. Si pagas y no
   > recurres, no te devolverán nada aunque la ordenanza acabe anulada.
2. Qué es la tasa y de dónde sale (Directiva UE 2018/851 → Ley 7/2022 → ordenanza
   municipal, BOPMA nº 231 de 3 de diciembre de 2025).
3. Por qué el cálculo de Vélez-Málaga es discutible: parte fija de 62,66 € más tramos por
   valor catastral, superficie y coeficiente de eficiencia territorial, ninguno ligado a
   los residuos que genera realmente una vivienda.
4. Por qué hay que recurrir aunque parezca poco dinero: STS de 19/12/2011 (rec. 2884/2010,
   ordenanza del IBI de León) y el precedente del TSJ de Madrid de marzo de 2026.
5. **Cómo actuar, en cuatro pasos**: conseguir la carta de pago y pagar → rellenar el
   formulario → reunir la documentación → presentar (presencial u online).
6. Qué pasa después: 2 meses para el contencioso si desestiman expresamente, 6 si hay
   silencio. Vía colectiva y pleito testigo.
7. Anexo de reducciones.
8. Anexo político: qué obliga realmente Bruselas y cómo lo hacen otros países.

### 7.3 Adaptación al ámbito municipal

- Todas las referencias a Torre del Mar y al Sup.T-12 pasan a Vélez-Málaga y sus núcleos.
- Donde AVEOtorre dice "AVEOtorre puede coordinar y aportar el trabajo documental",
  poner Acción Vecinal Vélez **solo si la federación va a asumir esa coordinación**.
  Preguntar. Si no, mantener el crédito a AVEOtorre.
- **Acreditar la fuente**: la guía y los modelos son trabajo de AVEOtorre. Un párrafo al
  pie con enlace a `https://aveotorre.com/recurso-tasa-basuras/`. Es correcto y además os
  cuesta cero.

### 7.4 Aviso legal de la página (obligatorio)

Caja al final, antes del pie:

> Esta guía es información de interés vecinal, no asesoramiento jurídico. Cada persona
> presenta el recurso en su propio nombre y bajo su responsabilidad. Acción Vecinal Vélez
> no actúa como representante de los recurrentes ni garantiza el resultado del recurso.
> Si tu caso tiene particularidades, consulta con un profesional.

### 7.4.b Aviso sobre la preferencia de notificación

El formulario oficial trae preseleccionada la casilla «Medios Electrónicos», y el propio
documento advierte de que esa elección será efectiva **para todos** los procedimientos con
el Patronato, no solo para este recurso. Un vecino sin certificado digital que firme sin
leerlo pasa a recibir por vía electrónica todas sus notificaciones tributarias futuras.

La página lleva una caja destacada recomendando marcar «Soporte Papel» a quien no use
habitualmente Cl@ve o certificado digital.

### 7.4.c Datos personales

**La carta de pago y el formulario cumplimentado que sirvieron de referencia no se
publican, en ningún formato.** Llevan nombre, DNI, dos direcciones, teléfono, correo,
referencia catastral, código de barras, QR de pago y un CSV de `ovt.prpmalaga.es` que
probablemente permite recuperar el documento completo a quien lo teclee.

Para las ilustraciones de la guía se usan las capturas ya publicadas por AVEOtorre.
**Revisar igualmente `formulario-datos.png` de aveotorre.com** por si arrastra datos reales.

### 7.5 Enganches con el resto del sitio

- **Home**: la sección "Última actuación" ya existe. Sustituir el contenido del Consejo
  Social por la tasa de basuras, con el plazo visible en el `.tag` y botón a la página
  nueva. El bloque del Consejo Social permanece en `/actuaciones/`.
- **`/actuaciones/`**: añadir la tasa como primer `article.feature` y una entrada nueva en
  la cronología.
- **`sitemap.xml`**: añadir la URL nueva.
- Imagen de cabecera: hace falta una propia. Si no hay, reutilizar una del repo y anotarlo.

---

## 8. Fase 3 — Despliegue en Hostinger

### 8.1 `.htaccess`

`_headers` **no funciona en Hostinger** (LiteSpeed/Apache). Crear `.htaccess` en la raíz
con las mismas cabeceras del CSP corregido de §6.2, más:

- Forzado de HTTPS
- `ErrorDocument 404 /404.html`
- Cacheo largo de `assets/` y corto de los HTML

`_headers` y `wrangler.jsonc` se quedan en el repo para el worker. Sí, son dos sitios donde
mantener el CSP. Va a pendientes.

### 8.2 Despliegue

Opción preferente: GitHub Action con FTP a Hostinger, disparada por push a `main-accion`.
Alternativa: despliegue por Git desde hPanel.

Excluir del subido: `.git/`, `.github/`, `_docs/`, `README.md`, `wrangler.jsonc`,
`_headers`, `CLAUDE.md`.

Credenciales FTP en **GitHub Secrets**, nunca en el repo.

### 8.3 Checklist antes de dar el dominio por bueno

- [ ] SSL activo y HTTPS forzado
- [ ] Las cuatro páginas + la de la tasa cargan sin 404 en assets
- [ ] La tipografía Inter carga de verdad (mirar la pestaña Network, no fiarse)
- [ ] PDF y DOCX se descargan desde el dominio propio
- [ ] `canonical` correcto en las cinco páginas
- [ ] Miniatura de WhatsApp y Facebook correcta (probar con un enlace real)
- [ ] `sitemap.xml` y `robots.txt` apuntan al dominio nuevo
- [ ] 404 devuelve la página propia
- [ ] Probado en móvil

### 8.4 Worker

Una vez el dominio esté sirviendo, desplegar `main-accion` también al worker para que no
queden dos versiones contradictorias. El tag `worker-abandonados` permite volver atrás.
Un redirect 301 del worker al dominio sería lo ideal, pero Workers Assets por sí solo no
redirige: necesita un script. Va a pendientes.

---

## 9. Datos de referencia

**Plazos**
- Recurso de reposición: **1 mes** desde la notificación o desde que se pide la carta de pago
- Si desestiman expresamente: **2 meses** para el contencioso-administrativo
- Si hay silencio: se entiende desestimado al mes, y hay **6 meses** para el contencioso

**Cuantía**: parte fija 62,66 € + tramos por valor catastral, superficie y eficiencia territorial

**Enlaces**
- Carta de pago: Patronato, 951 95 70 00 (opción 3) o `https://ovt.prpmalaga.es/`
- Presentación online: `https://ovt.prpmalaga.es/295553/DMALAGA/nueva-solicitud` →
  "Instancia General Tributaria"
- Oficinas: `https://portal.prpmalaga.es/8132/directorio-oficinas`
- Recursos del Patronato: `https://portal.prpmalaga.es/8993/recurso-de-reposicion`
- Reducciones: `https://portal.prpmalaga.es/10752/tasas-tarifa-especial-reducida`
- Fuente original: `https://aveotorre.com/recurso-tasa-basuras/`

**Texto para la caja de "Solicitud" en la presentación online**
> Interpongo RECURSO DE REPOSICIÓN contra la liquidación nº 2026xxxxxxxxxxxxxxxxxxxxx,
> Tasa de Residuos Domésticos, ejercicio 2026, del Ayto. de Vélez-Málaga, solicitando su
> anulación y la devolución de ingresos indebidos con intereses. Se adjuntan documentos.

---

## 10. Pendientes

Lo que se deja conscientemente sin hacer. Revisar cuando pase la urgencia de la tasa.

### Bloqueantes de la fase 2 — resueltos
- [x] Formulario bueno: el 3
- [x] Nº de expediente precargado: era individual, vaciado
- [x] "TORRE DEL MAR", "LUGAR" y "MES" vaciados
- [x] Ordenanza fiscal: confirmada la n.º 33 (BOPMA 3-12-2025)
- [x] Anexo DOCX v6 con localidad y domicilio genéricos

### Avisos a terceros
- [ ] Avisar a AVEOtorre: en su página, el anexo DOCX enlaza a la v5 en un sitio y a la v4
      en otro. Hay gente descargando la versión vieja.
- [ ] Avisar a AVEOtorre del `Nº de expediente` precargado en su Formulario3 publicado
- [ ] Revisar si la captura `formulario-datos.png` de aveotorre.com lleva datos reales
- [ ] Ofrecerles el Formulario4 depurado y el anexo v6

### Identidad y contenido
- [ ] Logo definitivo de Acción Vecinal Vélez. El icono actual vale de provisional
- [ ] Renombrar los 29 ficheros de `assets/img` e `assets/icons` (`abandonados_*`)
- [ ] Favicon y iconos de la app con la marca nueva
- [ ] Confirmar la lista real de asociaciones federadas y el número de la home
- [ ] Imagen propia para la página de la tasa (ahora reutiliza `pleno-velez-malaga.jpg`)
- [ ] CIF, número de registro y domicilio social en el footer, cuando existan
- [ ] Revisar el tiempo verbal de "Somos una Federación" tras la inscripción

### Deuda técnica
- [ ] El formulario de contacto es una maqueta y no envía nada. El botón "Apúntate" de la
      home lleva ahí. O se conecta a algo real o se cambia por un correo
- [ ] No hay página de aviso legal ni de política de privacidad. Obligatorias en cuanto
      haya un formulario que recoja datos de verdad
- [ ] El CSP vive duplicado en `_headers` y `.htaccess`
- [ ] Redirect 301 del worker al dominio propio (requiere script, no basta Assets)
- [ ] Autoalojar Inter: quita la dependencia externa y resuelve el asunto RGPD de las
      fuentes de Google
- [ ] `actuaciones/` y `contacto/` están minificados en una línea, incómodos de editar
- [ ] Sin analítica. Decidir si interesa y con qué (algo sin cookies)
- [ ] Migración a Astro o CMS headless. Resuelve de una vez los `canonical` cableados a
      mano, el layout duplicado en cada HTML y el poder publicar actuaciones sin tocar
      código

---

## 11. Estado actual

Hechas las fases 0, 1 y 2 en el branch `main-accion`, en dos commits:

1. `Rename a Accion Vecinal Velez` — dominio, marca, metadatos, CSP
2. `Pagina 'Reclama la Tasa de la Basura'` — la guía, los modelos y sus enganches

Pendiente: fase 3 (`.htaccess`, despliegue en Hostinger, checklist) y el worker al día.

---

## 12. Orden de ejecución recomendado

1. ~~Tag + branch (§5)~~
2. ~~Dominio global + correcciones del CSP y el `og:image` (§6.1, §6.2)~~
3. ~~Bloqueantes del PDF y el DOCX (§7.1)~~
4. ~~Marca en las cuatro páginas (§6.3)~~
5. ~~Página de la tasa (§7)~~
6. ~~Home: bloque del cambio de nombre + "Últimas acciones" (§6.4, §7.5)~~
7. ~~`nosotros/` (§6.6)~~
8. `.htaccess` + despliegue + checklist (§8) ← siguiente
9. Worker al día (§8.4)
