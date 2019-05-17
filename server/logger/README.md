# Логи

Все логи ведутся в папку server/log в файл вида %DATE%-results.log
А в development окружении также в консоль.

## Usage

```
const logger = require('./server/logger');

logger.error('Error message!');
```

## Уровни логов

* Error
