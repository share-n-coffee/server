const SubstitutionSchema = require('../models/substitution');
const isString = require('../../utilities/isString');

function substitutionMethodsFactory(substitutionModelName) {
  if (!isString(substitutionModelName)) {
    throw new TypeError('substitutionModelName should be a String');
  }

  const Substitutions = SubstitutionSchema(substitutionModelName);

  const addEventForSubstitution = id => {
    return Substitutions.create({ eventId: id });
  };

  const removeSubstitutedEvent = id => {
    return Substitutions.deleteOne({ eventId: id });
  };

  const getAllEventsForSubstitution = () => {
    return Substitutions.find({})
      .lean()
      .exec();
  };

  return {
    addEventForSubstitution,
    removeSubstitutedEvent,
    getAllEventsForSubstitution
  };
}

module.exports = substitutionMethodsFactory;
