# Telegram bot API

Телеграм бот для отправления сообщений пользователям и получения обратной связи о встречах.

## Usage

```
const bot = require('./telegramBot.js');

bot.notify('ban', user);
```

### bot.notify(notifyType, user, [event])

* notifyType <String>
* user <Object>
* event <Object>

notifyType cases:
* 'ban' - присылает сообщение о бане
* 'remind' - присылает напоминание о встрече (необходимо передать третьим агрументом объект event)
* default - просто отправит сообщение пользователю с текстом аргумента