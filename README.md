
# Bokkapro Frontend

Bokkapro Frontend is a web application developed with Angular that serves as an interface for managing business operations, invoicing, users, reports, and other administrative modules. It is designed to integrate with backend services and streamline the management of internal company processes.

## Tecnologías utilizadas

- **Framework principal:** Angular 10+
- **Lenguajes:** TypeScript, HTML, SCSS
- **Librerías principales:**
	- Angular Material
	- PrimeNG
	- Bootstrap 4
	- RxJS
	- ApexCharts
	- ngx-translate
	- Quill
	- Otros: moment, highlight.js, ng-bootstrap, etc.

## Instalación

1. **Clona el repositorio:**
	 ```sh
	 git clone <URL_DEL_REPOSITORIO>
	 cd bokkapro_frontend
	 ```

2. **Instala las dependencias:**
	 ```sh
	 npm install
	 ```

3. **Variables de entorno:**
	 - Por defecto, la configuración de entornos está en `src/environments/environment.ts` y `src/environments/environment.prod.ts`.
	 - Modifica estos archivos si necesitas personalizar endpoints o claves.

## Ejecución del proyecto

### Servidor de desarrollo

```sh
npm start
```
Accede a la aplicación en [http://localhost:4200](http://localhost:4200).

### Docker (opcional)

Si deseas ejecutar el proyecto en un contenedor Docker:

```sh
docker-compose up
```

## Ejemplo de uso

```sh
ng generate component example-component
```
Esto genera un nuevo componente Angular en el proyecto.

## Pruebas

- **Unitarias:**  
	Ejecuta las pruebas unitarias con Karma:
	```sh
	npm test
	```
- **End-to-End:**  
	Ejecuta las pruebas E2E con Protractor:
	```sh
	npm run e2e
	```

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

## Créditos / Autor

- Desarrollado por el equipo de Bokkapro.
- Contacto principal: bemonio
- Basado en Angular CLI y librerías de la comunidad.
