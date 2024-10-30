# YAY  |  Haz de tu barrio un Hogar
## Introduction

<img align="right" alt="GIF" src="https://i.ibb.co/9ZXQWRY/logoYAY.png" width="50%" height="50%" style="vertical-align:middle"/>


- _¿Qué es YAY?_ Plataforma web con eventos locales para mayores de 60 años.
- _¿Objetivo?_ YAY busca una mejora en la calidad de vida de este colectivo.
- _¿Por qué?_ La plataforma ofrece una solución accesible para combatir la soledad del grupo objetivo.
- _¿Cómo?_ A través de eventos en su zona que conectan a los usuarios con su comunidad local sin necesidad de grandes desplazamientos.

YAY busca un cambio en la vida de las personas mayores de 60 que facilite la creación de nuevas amistades, sin la necesidad de desplazarse largas distancias. Los usuarios pueden conocer a personas con intereses similares en su barrio, participando en los eventos creados por nuestros partners.

Con un enfoque no romántico y un diseño accesible, queremos ayudar a combatir la soledad y mejorar la calidad de vida de este sector de la sociedad. Además, ¿qué mejor momento para romper el hielo que haciendo algo que te gusta?


<img align="left" src="https://i.ibb.co/VVdhpnr/Captura-de-Pantalla-2024-10-29-a-las-14-08-45.png" alt="landing" width="31%" style="vertical-align:middle"/><img align="center" alt="landing2" src="https://i.ibb.co/64jQT6j/Captura-de-Pantalla-2024-10-29-a-las-14-08-57.png" width="31%" style="vertical-align:middle"/><img align="right" alt="landing3" src="https://i.ibb.co/VJxmdH0/Captura-de-Pantalla-2024-10-29-a-las-14-09-29.png" width="31%" style="vertical-align:middle"/>

## Tech
#### Backend
- _Python_ - Backend programming language
- _Flask_ - Python backend
- _SQLAlchemy_ - ORM para manejar bases de datos en Flask
#### Frontend
- _React_ - Frontend framework in JavaScript
- _Flux_ - Architecture pattern for data management in React
- _Context API_ - React store for global state management
- _JavaScript_ - Language for the frontend alongside React
- _HTML_ - Frontend structure
- _CSS_ - Frontend styles
#### Deployment
- _render.com_ - Hosting and deployment platform
- _Aiven_ - Service for databases in the cloud
- _PostgreSQL with pgAdmin_ - Database used in Aiven


## Installation

> If you use Github Codespaces (recommended) or Gitpod this template will already come with Python, Node and the Posgres Database installed. If you are working locally make sure to install Python 3.10, Node 

It is recomended to install the backend first, make sure you have Python 3.8, Pipenv and a database engine (Posgress recomended)

1. Install the python packages: `$ pipenv install`
2. Create a .env file based on the .env.example: `$ cp .env.example .env`
3. Install your database engine and create your database, depending on your database you have to create a DATABASE_URL variable with one of the possible values, make sure you replace the valudes with your database information:

| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgress | postgres://username:password@localhost:5432/example |

4. Migrate the migrations: `$ pipenv run migrate` (skip if you have not made changes to the models on the `./src/api/models.py`)
5. Run the migrations: `$ pipenv run upgrade`
6. Run the application: `$ pipenv run start`

> Note: Codespaces users can connect to psql by typing: `psql -h localhost -U gitpod example`

### Undo a migration

You are also able to undo a migration by running

```sh
$ pipenv run downgrade
```


### Front-End Manual Installation:

-   Make sure you are using node version 14+ and that you have already successfully installed and runned the backend.

1. Install the packages: `$ npm install`
2. Start coding! start the webpack dev server `$ npm run start`

## Development

<img src="https://github.com/user-attachments/assets/5bf22aae-eecf-4f77-8163-01429c2a2865" alt="pc" style="vertical-align:middle; margin:2px; opacity:0.75; height:22px"> All suggestions and contributions are welcome.

<img src="https://github.com/user-attachments/assets/da7fe0b2-10b7-441c-8f68-7ddd2d31ada9" alt="star" style="vertical-align:middle; margin:2px; opacity:0.75; height:20px"> &nbsp; If you liked what you saw, give me a star. 

<img src="https://github.com/user-attachments/assets/cfbf1a7e-fe7c-4a41-bc3d-1b095838a332" alt="speak" style="vertical-align:middle; margin:2px; opacity:0.75; height:20px"> &nbsp; If you want to work with me, feel free to ping me on [LinkedIn](https://www.linkedin.com/in/davinia-p-delgado).

