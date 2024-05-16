# Proyecto Checkin Scan

Este es un proyecto Node.js. Utiliza Docker Compose para ejecutar dos contenedores: uno para Node.js y otro para MariaDB. Se crean las tablas automaticamente y se genera un usuario para poder logearse y generar un JWT y consumir la api de productos:

Método POST: https://checkin-scan.latamhosting.net/api/auth/login
```bash
{
  "email": "api@host.com",
  "password": "123456"
}
```

Puedes ver una demo en línea del proyecto y su documentación [aquí](https://checkin-scan.latamhosting.net/api-docs/). 


## Pasos para ejecutar el proyecto

Tener en cuenta que este proyecto utiliza los puertos 3000 y 3306, si es su entorno local están siendo utilizados por otra aplicación recuerde cambiarlos antes de iniciar el proyecto desde el archivo docker-compose.yaml.

1. Clona el repositorio:

```bash
git clone https://github.com/mdampuero/checkin-scan
```
2. Ingresa al directorio del proyecto:

```bash
cd checkin-scan
```
3. Ejecuta el script start.sh:

```bash
./start.sh
```
4. Comprueba la URL:

http://localhost:3000/api-docs/
