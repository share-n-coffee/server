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
