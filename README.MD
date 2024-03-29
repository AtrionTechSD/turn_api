## Turn App Documentation

---

### Get Started

---

#### Api URL

`/api/`

<details>
<summary>
<code>Query parameters</code>
</summary>
Los siguientes parámetros de consulta pueden usarse para filtar los datos a la hora de hacer peticiones en la api, cuando aplique.

- `order`: Ordena los datos de acuerdo al campo que se especifique. Ejemplo: `/users/?order=name`.
- `desc?`: Cuando se usa `order`, indica si los datos se van a ordernar de forma descendente. Ejemplo: `/users/?order=name&desc=true`
- `perpage`: Indica cuántos registros debe traer la consulta para paginación. _Requiere el parámetro `page`_. Ejemplo: `/users/?perpage=10`
- `page`: Indica la página que debe cargar cuando se usa `perpage`. _Requiere el parámetro `perpage`_. Ejemplo: `/users/?perpage=10&page=2`
- `include`: Indica cuáles relaciones deben cargarse al consultar datos. Ejemplo: `/users/?include=image`.
  - Pueden indicarse varias relaciones separadas por coma. Ejemplo: `/users/?include=image,auth`
  - Pueden anidarse relaciones a través de puntos. Ejemplo: `/?include=auth.role`
- `limit`: Limita la cantidad de registros a consultar. _Su uso suprime la paginación_. Ejemplo `/users/?limit=5`
- `fields`: Indica cuáles campos de una tabla debe devolver la consulta. _Los campos se separan por coma_. Ejemplo: `/users/?fields=name,lastname`.
- `withtrashed`: Indica si la consulta debe incluir elementos eliminados (softdeletes). Ejemplo: `/users/?withtrashed=true`.
- `filter`: Permite filtrar la consulta por campos específicos. _Debe ser un array_. Ejemplo: `/users/?filter[]=name:John&filter[]=lastname:Doe
  - Luego del parámetro, se indica el par campo-valor separados por dos puntos.
  - Las consultas con varios filtros aplican el operador `Y`. Es decir, buscará coincidencias estrictas.
- `search`: Permite buscar el término ingresado en todas las columnas de una tabla que sean filtrables. _Es case insensitive_ . Ejemplo: `/users/?search=jhon`.

</details>

<details>
<summary>
<code>Authentication</code>
</summary>
Para iniciar sesión, el usuario debe enviar su email y contraseña. Si las credenciales son correctas, la API retornará los datos del usuario y un token JWT en el cuerpo de la respuesta. Además, se incluirá el accessToken y el refreshToken en la cookie, para que no sea necesario enviarlos en cada petición.

#### Cuerpo de la Petición

```json
{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

#### Cuerpo de la Respuestas

```json
{
  "auth": {
    ...data,
    user: {..data}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

</details>

### Schema Auth

<details>
 <summary>
 <code>POST</code>  <code>/api/auth/register</code></summary>

##### Parameters

> | name     | type     | data type | description              |
> | -------- | -------- | --------- | ------------------------ |
> | email    | required | string    | Unique email to register |
> | password | required | string    | 6-25 length password     |

##### Responses

> | http code | content-type     | response                                                 |
> | --------- | ---------------- | -------------------------------------------------------- |
> | `201`     | application/json | `{"code":"422","content":"Usuario creado exitosamente"}` |
> | `422`     | application/json | `{"code":"422","message":"Unproccesable data"}`          |
> | `500`     | application/json | `{"code":"500","message":"Unkonown server error"}`       |

##### Example Axios

> ```javascript
> axios({
>   method: "post",
>   url: "/api/auth/register",
>   data: { email: "email@example.com", password: "password1234" },
> });
> ```

</details>

<details>
<summary><code>POST </code> <code>/api/auth/login</code> </summary>
##### Parameters

> | name     | type     | data type | description              |
> | -------- | -------- | --------- | ------------------------ |
> | email    | required | string    | Unique email to register |
> | password | required | string    | 6-25 length password     |

##### Responses

> | http code | content-type     | response                                           |
> | --------- | ---------------- | -------------------------------------------------- |
> | `200`     | application/json | `{"code":"200","content": auth: object}`           |
> | `422`     | application/json | `{"code":"422","message":"Unproccesable data"}`    |
> | `500`     | application/json | `{"code":"500","message":"Unkonown server error"}` |

##### Example Axios

> ```javascript
> axios({
>   method: "post",
>   url: "/api/auth/login",
>   data: { email: "email@example.com", password: "password1234" },
> });
> ```

</details>
<details>

<summary><code>POST </code> <code>/api/auth/logout</code> </summary>

##### Headers

> | name          | type     | data type    | description           |
> | ------------- | -------- | ------------ | --------------------- |
> | Authorization | required | Bearer Token | Token provided by api |

##### Parameters

> NONE

##### Responses

> | http code | content-type     | response                                                  |
> | --------- | ---------------- | --------------------------------------------------------- |
> | `200`     | application/json | `{"code":"200","content": "Sesión cerrada exitosamente"}` |
> | `500`     | application/json | `{"code":"500","message":"Unkonown server error"}`        |

##### Example Axios

> ```javascript
> axios({
>   method: "post",
>   headers: {Authorization: `Bearer ${token}`}
>   url: "/api/auth/logout",
> });
> ```

</details>
<details>

<summary><code>POST </code> <code>/api/auth/logout/all</code> </summary>

##### Headers

> | name          | type     | data type    | description           |
> | ------------- | -------- | ------------ | --------------------- |
> | Authorization | required | Bearer Token | Token provided by api |

##### Parameters

> NONE

##### Responses

> | http code | content-type     | response                                                        |
> | --------- | ---------------- | --------------------------------------------------------------- |
> | `200`     | application/json | `{"code":"200","content": "Se han cerrado todas las sesiones"}` |
> | `500`     | application/json | `{"code":"500","message":"Unkonown server error"}`              |

##### Example Axios

> ```javascript
> axios({
>   method: "post",
>   headers: {Authorization: `Bearer ${token}`}
>   url: "/api/auth/logout/all",
> });
> ```

</details>

---

### Schema User

### Manage User

<details>

<summary><code>POST </code> <code>/api/users</code> </summary>

##### Headers

> | name          | type     | data type    | description           |
> | ------------- | -------- | ------------ | --------------------- |
> | Authorization | required | Bearer Token | Token provided by api |

##### Parameters

> | name     | type     | data type | description              |
> | -------- | -------- | --------- | ------------------------ |
> | name     | required | string    | First name for user      |
> | lastname | required | string    | Last name for user       |
> | phone    | required | string    | Phone number             |
> | address  | required | string    | Complete address details |

##### Responses

> | http code | content-type     | response                                           |
> | --------- | ---------------- | -------------------------------------------------- |
> | `201`     | application/json | `{"code":"201","content": newUser (object)}`       |
> | `422`     | application/json | `{"code":"422","content": "Unproccesable data"}`   |
> | `500`     | application/json | `{"code":"500","message":"Unkonown server error"}` |

##### Example Axios

> ```javascript
> axios({
>   method: "post",
>   headers: {Authorization: `Bearer ${token}`}
>   url: "/api/auth/logout/all",
>   data: {
>        name: "John",
>        lastname: "Doe",
>        phone:"(809) 765-4321",
>        address: "2310 Fifth Avenue, Bronx, New York"
>        }
> });
> ```

</details>

#### Profile

<details>

<summary>
<code>POST </code> <code>/api/profile</code>
</summary>

##### Headers

> | name          | type     | data type    | description           |
> | ------------- | -------- | ------------ | --------------------- |
> | Authorization | required | Bearer Token | Token provided by api |

##### Parameters

> | name         | type     | data type | description              |
> | ------------ | -------- | --------- | ------------------------ |
> | name         | required | string    | First name for user      |
> | lastname     | required | string    | Last name for user       |
> | email        | required | string    | Suggest same auth        |
> | phone        | required | string    | Phone number             |
> | address      | required | string    | Complete address details |
> | institute_id | required | number    | Complete address details |

##### Responses

> | http code | content-type     | response                                              |
> | --------- | ---------------- | ----------------------------------------------------- |
> | `201`     | application/json | `{"code":"201","content": newProfile(User) (object)}` |
> | `422`     | application/json | `{"code":"422","content": "Unproccesable data"}`      |
> | `500`     | application/json | `{"code":"500","message":"Unkonown server error"}`    |

##### Example Axios

> ```javascript
> axios({
>   method: "post",
>   headers: {Authorization: `Bearer ${token}`}
>   url: "/api/auth/logout/all",
>   data: {
>        name: "John",
>        lastname: "Doe",
>        phone:"(809) 765-4321",
>        address: "2310 Fifth Avenue, Bronx, New York"
>        }
> });
> ```

</details>
