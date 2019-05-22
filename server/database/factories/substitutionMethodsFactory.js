const SubstitutionSchema = require('../models/substitution');
const isString = require('../../utilities/isString');

function substitutionMethodsFactory(substitutionModelName) {
  if (!isString(substitutionModelName)) {
    throw new TypeError('substitutionModelName should be a String');
  }

  const Substitutions = SubstitutionSchema(substitutionModelName);

  const createEvent = id => {
    return Substitutions.create({ eventId: id });
  };

  const removeEvent = id => {
    return Substitutions.deleteOne({ eventId: id });
  };

  const getAllEvents = () => {
    return Substitutions.find({}).exec();
  };
  return { createEvent, removeEvent, getAllEvents };
}

module.exports = substitutionMethodsFactory;
