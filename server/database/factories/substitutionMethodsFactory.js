const SubstitutionSchema = require('../models/substitution');
const isNull = require('../../utilities/isNull');

function substitutionMethodsFactory(substitutionModelName) {
  if (isNull(substitutionModelName)) {
    return {};
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
