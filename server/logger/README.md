# Логи

Все логи уровня error ведутся в папку server/log в файл вида %DATE%-results.log
А в development окружении также в консоль.

Логи уровня info записываются в коллекцию logs

# Уровни логов

## Error

```
const logger = require('./server/logger');

logger.error('Error message!');
```

## Info

### info(userId, type, payload)

* userId - _ObjectId_
* type - свойство объекта logTypes (default: 'unknown_type')
* payload - _Object_ - сохраняется в поле payload в виде JSON объекта

logTypes:
* userNotification
* userSubscription
* userBan

```
const logger = require('./server/logger');

const { logTypes } = logger;

logger.info(id, logTypes.userNotification, { eventId, message });
```



