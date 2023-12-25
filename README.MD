## Turn App Documentation

---

#### Schema Auth

<details>
 <summary>
 <code>POST</code> <code><b>/</b></code> <code>api/auth/register</code></summary>

##### Parameters

> | name     | type     | data type | description              |
> | -------- | -------- | --------- | ------------------------ |
> | email    | required | string    | Unique email to register |
> | password | required | string    | 6-25 length password     |

##### Responses

> | http code | content-type       | response                                                 |
> | --------- | ------------------ | -------------------------------------------------------- |
> | `201`     | `application/json` | `{"code":"422","content":"Usuario creado exitosamente"}` |
> | `422`     | `application/json` | `{"code":"422","message":"Unproccesable data"}`          |
> | `500`     | `application/json` | `{"code":"500","message":"Unkonown server error"}`       |

##### Example cURL

> ```javascript
> `axios({
>   method: 'post',
>   url: '/api/auth/register',
>   data: {"email": 'email@example.com',"password": 'password1234'}});`;
> ```

</details>
