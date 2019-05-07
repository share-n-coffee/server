# Random Coffee API documentation

> Demoproject app built with the express along with mongodb for data storage, passport for authentication.

#

## GET INFO ABOUT USER
```properties
GET /api/users/{user_telegram_ID}
```

### RESPONSE CLASS (STATUS 200)
```json
{
  "id_telegram": "541419431",
  "avatar": "https://randomuser.me/api/portraits/men/16.jpg",
  "first_name": "hugh",
  "last_name": "gonzales",
  "username": "smallmeercat345",
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
