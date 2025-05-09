# Tecnicatura Superior en Desarrollo web y Aplicaciones Digitales

- Equipo: Bookster
- Proyecto: Libroteka
- Cohorte: 2023

Dependencies: 
- Node: "^18"
- Angular: "^17"
- Python: "^3.8"
- Django: "^4.2"
- SQLITE3: Incluido en Django

Puntos claves:
- Formulario IEEE830: [Link](https://github.com/ISPC-Bookster/Libroteka/wiki/Formulario-IEEE830)
- Ceremonias - Scrum: [Link](https://github.com/ISPC-Bookster/Libroteka/wiki/Scrum:-Registro-de-ceremonias)
- Historias de Usuario: [Link](https://github.com/ISPC-Bookster/Libroteka/wiki/Historias-de-Usuario)
- Milestones: [Link](https://github.com/ISPC-Bookster/Libroteka/milestones)


## Credenciales Django Admin
- user:
- password: 

## Librerías
- FrontEnd: fortawesome, nodemailer, bootstrap, rxjs, smtpjs, tslib, zone.js
- BackEnd: django, djangorestframework, django-cors-headers, Pillow, jsonfield, mysqlclient

## Correr localmente
<table>
<tr>
<th> FrontEnd </th>
<td>
Clone the project

```bash
  git clone https://github.com/ISPC-TSDW/libroteka-frontend.git

``` 

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
</td>
</tr>
</table>
<table>
<tr>
<th> BackEnd </th>
<td>
Clone the project

```bash
  git clone https://github.com/ISPC-TSDW/libroteka-backend.git
``` 

Go to the project directory

```bash
  cd Backend/Libroteka
```

Activate Virtual environment & install Libraries

```bash
.\backendLibroteka-env\bin\activate # Windows users
source backendLibroteka-env/bin/activate # Linux users

```
```bash
 cd Libroteka/Backend/Libroteka
```
```bash
  pip install -r requirements.txt
```

Start the server

```bash
  python manage.py runserver
```
</td>
</tr>
</table>

<table>
<tr>
<th> Docker <br> (Optional) </th>
<td>
Clone the project

```bash
  git clone https://github.com/LibrotekaISPC2023/Libroteka.git
``` 

Go to the project directory

```bash
  cd Frontend
```

Install dependencies

```bash
  npm install
```

Go back and Start the Docker Compose

```bash
  cd ..
```
```bash
  sudo docker compose up --build
```
</td>
</tr>
</table>
<table>

