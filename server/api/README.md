# Random Coffee API documentation

> This page contains information about Random Coffee API usage

#

## GET INFO ABOUT USER
```properties
GET /api/users/{user_telegram_ID}
```

### RESPONSE CLASS (STATUS 200)

> При успешном обновлении данных возвращается объект с данными пользователя

```json
{
  "id_telegram": "541419431",
  "avatar": "https://randomuser.me/api/portraits/men/16.jpg",
  "first_name": "hugh",
  "last_name": "gonzales",
  "username": "smallmeercat345",
  "department": "DevOps",
  "isBanned": false,
  "events": [],
  "birthday": "1965-07-24T00:48:01Z",
  "gender": "male",
  "created": "2019-05-07T12:26:19.895Z",
  "logs": {
    "acceptedEvents": [],
    "visitedEvents": [],
    "bans": []
  },
  "admin": {
    "isAdmin": false,
    "password": null
  }
}
```

#

## GET INFO ABOUT EVENT
```properties
GET /api/events/{event_id}
```

### RESPONSE CLASS (STATUS 200)
```json
{
  "_id": "5cd17bb3892885c8f3000509",
  "id": 1,
  "title": "Kaya University",
  "description": "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
  "location": "7.1854773, 1.9979411",
  "type": "amet",
  "created": "2019-05-07T14:31:15.569Z"
}
```

#


## SET USER DEPARTMENT

> При первом входе пользователя в аккаунт, отправляем запрос с выбранным отделом

```properties
POST /api/users/{user_telegram_ID}/{department_id}
```

### RESPONSE CLASS (STATUS 200)
```json
{
  "id_telegram": "541419431",
  "avatar": "https://randomuser.me/api/portraits/men/16.jpg",
  "first_name": "hugh",
  "last_name": "gonzales",
  "username": "smallmeercat345",
  "department": "Software",
  "isBanned": false,
  "events": [],
  "birthday": "1965-07-24T00:48:01Z",
  "gender": "male",
  "created": "2019-05-07T12:26:19.895Z",
  "logs": {
    "acceptedEvents": [],
    "visitedEvents": [],
    "bans": []
  },
  "admin": {
    "isAdmin": false,
    "password": null
  }
}
```
#


## LOGIN ADMIN

> При входе админа в аккаунт отправляем логин и пароль, а также добавляем header к запросу:

```properties
POST /api/auth/admin
{
    "Content-Type": "application/json"
},
{
	"username":"sadtiger481",
	"password":"tiger"
}
```

### RESPONSE (STATUS 200)

> При успешной аутентификации возвращается токен:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWNkMTc1YWM0NGMyOWY2YmM3ZGJjMGExIn0sImlhdCI6MTU1NzI3NzUyMSwiZXhwIjoxNTU3MjgxMTIxfQ.g2LVARhT6k36XzUej0A6jNolneSjj3yq6lWW7IRNgzw"
}
```
#


## GET ADMIN INFO AND RIGHTS

> После получения токена добавляем его в header к запросу для получения информации админа: 

```properties
GET /api/auth/admin
{
  "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWNkMTc1YWM0NGMyOWY2YmM3ZGJjMGExIn0sImlhdCI6MTU1NzI3NzUyMSwiZXhwIjoxNTU3MjgxMTIxfQ.g2LVARhT6k36XzUej0A6jNolneSjj3yq6lWW7IRNgzw"
}
```

### RESPONSE CLASS (STATUS 200)

> Возвращается информация админа, на данный момент запрашиваемый токен действует 1 час 

```json
{
    "logs": {
        "acceptedEvents": [],
        "visitedEvents": [],
        "bans": []
    },
    "admin": {
        "isAdmin": true
    },
    "isBanned": false,
    "events": [],
    "birthday": "1980-09-22T14:56:30.000Z",
    "gender": "female",
    "_id": "5cd175ac44c29f6bc7dbc0a1",
    "id_telegram": "541419433",
    "avatar": "https://randomuser.me/api/portraits/women/28.jpg",
    "first_name": "leslie",
    "last_name": "rivera",
    "username": "sadtiger481",
    "created": "2019-05-07T12:10:12.609Z"
}
```