/* eslint-disable prettier/prettier */
const express = require('express');
const connectDatabase = require('../../server/lib/connectDatabase');
const ClassDBController = require('../database/dbController');

const app = express();
const port = 9000;

const events = [
  {
    _id: '5cd6f6c381371d297acb2fe0',
    active: true,
    title: 'Furnitech',
    description:
      'Irure tempor qui tempor id mollit aliquip pariatur est nisi. Exercitation consequat eiusmod non Lorem nisi. Pariatur aute excepteur laborum cupidatat sint fugiat. Reprehenderit do laborum Lorem tempor dolore. Dolore eiusmod qui duis enim ut ex.',
    location: ['53.886666', '27.53039'],
    address: '594 Neptune Court, Rehrersburg, Tennessee',
    options: {
      cyclic: true,
      regularity: 3,
      nextDates: []
    },
    created: 1558161349720
  },
  {
    _id: '5cd6f6c381371d297acb2fe1',
    active: true,
    title: 'Hyplex',
    description:
      'Cupidatat nostrud adipisicing irure eiusmod exercitation commodo officia minim do. Elit minim sunt voluptate duis esse ex velit. Sunt laboris dolor occaecat est aliqua nostrud aliquip excepteur tempor exercitation. Minim et exercitation anim eiusmod consequat excepteur. Est mollit commodo incididunt eu consectetur cillum ad.',
    location: ['53.914824', '27.526582'],
    address: '573 Kaufman Place, Coaldale, Arizona',
    options: {
      cyclic: true,
      regularity: 2,
      nextDates: []
    },
    created: 1558161349721
  },
  {
    _id: '5cd6f6c381371d297acb2fe2',
    active: true,
    title: 'Syntac',
    description:
      'Consequat dolore qui consectetur non. Amet tempor ea magna nisi laborum. Irure duis sunt laborum veniam excepteur ut reprehenderit officia enim esse incididunt veniam sunt anim. Nostrud et amet occaecat sit aute amet aliquip sunt. Amet proident pariatur excepteur aute ea labore sit ex consectetur irure.',
    location: ['53.846522', '27.618272'],
    address: '904 Trucklemans Lane, Marne, West Virginia',
    options: {
      cyclic: true,
      regularity: 1,
      nextDates: []
    },
    created: 1558161349722
  },
  {
    _id: '5cd6f6c381371d297acb2fe3',
    active: true,
    title: 'Netropic',
    description:
      'Officia quis id mollit eiusmod cupidatat laboris aliqua do. Qui officia labore ullamco incididunt aute elit adipisicing. Enim consequat nisi aliqua nisi dolor incididunt Lorem id tempor velit nisi. Deserunt elit anim duis ipsum. Proident ea sunt et proident reprehenderit. Dolore dolor quis cupidatat culpa enim aliqua consectetur occaecat exercitation nulla ea. Mollit reprehenderit duis qui cillum dolore do dolor ex fugiat consectetur cillum culpa anim.',
    location: ['53.908021', '27.59636'],
    address: '769 Lawrence Avenue, Bison, Northern Mariana Islands',
    options: {
      cyclic: true,
      regularity: 6,
      nextDates: []
    },
    created: 1558161349722
  },
  {
    _id: '5cd6f6c381371d297acb2fe4',
    active: true,
    title: 'Sarasonic',
    description:
      'Reprehenderit nisi ut reprehenderit nostrud fugiat pariatur exercitation consectetur mollit. Pariatur tempor commodo id cupidatat fugiat reprehenderit officia cupidatat laboris. Deserunt enim nulla aliqua esse excepteur aute. Ex ad aute laboris anim amet pariatur consequat eiusmod veniam id eu amet Lorem. Fugiat labore cillum enim est dolore eiusmod ad mollit.',
    location: ['53.838538', '27.589558'],
    address: '318 Cumberland Walk, Delwood, Utah',
    options: {
      cyclic: true,
      regularity: 6,
      nextDates: []
    },
    created: 1558161349722
  }
];

function generateUpcomingEvents(period = 'month') {
  const periodDays =
    period === 'month'
      ? new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
      : 7;

  const endTime = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0
  ).getTime();
  const startTime = endTime - periodDays * 24 * 60 * 60;
  console.log('generate');

  return {
    123: []
  };
}

// module.exports = generateUpcomingEvents;

connectDatabase();
app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);

  const DBController = new ClassDBController('event');
  DBController.getAllEvents()
    .then(eventss => {
      console.log(eventss);
      console.log(generateUpcomingEvents());
    })
    .catch(error => console.log(error));
});
