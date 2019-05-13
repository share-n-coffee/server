# Telegram bot API

Телеграм бот для отправки сообщений пользователям и получения обратной связи о встречах.

## Usage

```
const bot = require('./telegramBot.js');

bot.notify('ban', user);
```

### bot.notify(notifyType, user, [event])

* notifyType _String_
* user _Object_
* event _Object_

notifyType cases:
* 'ban' - отправляет сообщение о бане
* 'unban' - сообщение о прекращении бана
* 'unsubscribe' - сообщение о прекращении подписки
* 'invite' - сообщение о встрече с кнопками "принять/отказаться" (необходимо передать третьим агрументом объект event)
* 'remind' - напоминание о встрече (необходимо передать третьим агрументом объект event)
* default - просто отправит сообщение пользователю с текстом аргумента