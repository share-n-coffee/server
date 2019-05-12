const TelegramBot = require('node-telegram-bot-api');
const  bot = new TelegramBot('800384154:AAEx13ODIk5JkqBXT-DRDwe1SlUyARu78wo', { polling: true});
const fs = require('fs')
const request = require('request');
const fetch = require('node-fetch')
const events = [{
  place : 'Интернациональная 25а',
  layout: [53.904273, 27.558306],
  description: 'Какой-то бар',
  meetingDate: '13/05/2019'
},
  {
      place : 'Свободы 4',
      layout: [53.904205, 27.555305],
      description: 'Бар',
      meetingDate: '13/07/2019'
  },
  {
      place : 'Раковская 29',
      layout: [53.904978, 27.546629],
      description: 'Пралеска',
      meetingDate: '22/05/2019'
  }

];
console.log('Bot started')

bot.onText(/\/start/, (msg)=>{
  const html = `Здравствуйте, <strong>${msg.from.first_name}</strong>!
Вас приветствует бот "Random cofee" 😉
=========================================`


  let chatID = msg.chat.id


bot.sendMessage(chatID, html,{parse_mode: 'HTML'})
.then(()=>{
bot.sendPhoto(chatID, fs.readFileSync(__dirname + '/cofee.jpg'))
})
.then( ()=>{
setTimeout( function(){

    bot.sendMessage(chatID, 'Выберите действие!', {
        reply_markup:{
  inline_keyboard:[
      [
         {text: 'Посмотреть мои события 😋',
         callback_data: 'События'}]
  ]
 }
    })
},3000)
}

)
})

//async-awayt  1) через фетч будет
//const events = awaitfetch('/article/fetch/user.json'))

bot.on('callback_query', query=>{
  let chatID = query.message.chat.id

  if (query.data === 'События') {

    async function getEvent(chatID){
      const event = await  fetch("https://forge-development.herokuapp.com/api/users/", {userTelegramId:chatID});
      const data =  event.json()

      return data
    }
    getEvent(chatID).then((data)=>{  console.log('event',data)})



    bot.sendMessage(chatID, 'Ниже приведены мероприятия, в которых Вы участвуете',{
      reply_markup: {
        inline_keyboard: [events.map( (event) =>{
          return {text:event.place, callback_data: event.description}
        })]
      }
    })
  }

})

bot.on('callback_query', query=>{
  let chatID = query.message.chat.id

  for (let i=0; i<events.length; i++) {
    const html = `Хэй!😉 Встреча назначена на <b>${events[i].meetingDate}</b> по адресу <b>${events[i].place}</b>
        в заведении <b>${events[i].description}</b> 😎
    Не опаздывай!`
    if (query.data==events[i].description){
      bot.sendMessage(chatID , html, {parse_mode:'HTML'}).then(()=>{
        bot.sendLocation(chatID,events[i].layout[0],events[i].layout[1])
      }).then(()=>{
        bot.sendMessage(chatID , `<a href="https://otvet.imgsmail.ru/download/8953950_7cf8b9e6cd7580a231e5ec3ed65071ab.jpg"> а вот вам ссылочка на заведение</a>`, {parse_mode:'HTML', disable_web_page_preview:true})

      })
    }
  }
})

const notes = [];
bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
  var userId = msg.from.id;
  var text = match[1];
  var time = match[2];

  notes.push({ 'uid': userId, 'time': time, 'text': text });

  bot.sendMessage(userId, 'Отлично! Я напомню во сколько встреча! :)');
});

setInterval(function(){
  for (var i = 0; i < notes.length; i++){
    var curDate = new Date().getHours() + ':' + new Date().getMinutes();
    if ( notes[i]['time'] == curDate ) {
      bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
      notes.splice(i,1);
    }
  }
},1000);


bot.onText(/^\/place_order/, function (msg, match) {
  const option = {
    "parse_mode": "Markdown",
    "reply_markup": {
      "one_time_keyboard": true,
      "keyboard": [[{
        text: "My phone number",
        request_contact: true
      }], ["Cancel"]]
    }
  };
  bot.sendMessage(msg.chat.id, "Как мы можем связаться с вами?", option).then(() => {
    bot.on("message", (msg) => {
       console.log(msg)
      if(msg.contact.phone_number){
        bot.sendMessage(msg.chat.id, "Ваг номер принят.за вами выехали")
      }

    })
  })
  //   .then(()=>{
  //   bot.on('message', (msg)=>{
  //     let option = {
  //       "parse_mode": "Markdown",
  //       "reply_markup": {
  //         "one_time_keyboard": true,
  //         "keyboard": [[{
  //           text: "My location",
  //           request_location: true
  //         }], ["Cancel"]]
  //       }
  //     };
  //     bot.sendMessage(msg.chat.id, `Где вы сейчас находитесь?`, option)
  //   })
  //
  // }).then(()=>{
  //   bot.sendMessage(msg.chat.id, `Спасибо! черный воронок за вами выехал`)})
})
