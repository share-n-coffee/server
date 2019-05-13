const userMethodsFactory = require('./factories/userMethodsFactory');
const eventMethodsFactory = require('./factories/eventMethodsFactory');
const departmentMethodsFactory = require('./factories/departmentMethodsFactory');

function DBController(user, event, department) {
  let userModel;
  let eventModel;
  let departmentModel;
  if (arguments.length === 0) {
    userModel = 'demo_user';
    eventModel = 'demo_event';
    departmentModel = 'demo_department';
  } else {
    userModel = user;
    eventModel = event;
    departmentModel = department;
  }
  console.log('user, event, dep ', userModel, eventModel, departmentModel);
  Object.assign(
    this,
    userMethodsFactory(userModel),
    eventMethodsFactory(eventModel),
    departmentMethodsFactory(departmentModel)
  );
}

module.exports = DBController;
