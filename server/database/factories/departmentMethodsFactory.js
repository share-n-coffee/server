const mongoose = require('mongoose');
const DepartmentSchema = require('../models/department');
const isNull = require('./isNull');

function departmentMethodsFactory(departmentModelName) {
  if (isNull(departmentModelName)) {
    return {};
  }
  const Departments = DepartmentSchema(departmentModelName);

  const getDepartmentById = departmentId => {
    return Departments.findOne({
      _id: mongoose.Types.ObjectId(departmentId)
    }).exec();
  };

  const getAllDepartments = () => {
    return Departments.find({}).exec();
  };

  const postNewDepartment = department => {
    const newDepartment = new Departments(department);
    return new Promise((resolve, reject) => {
      newDepartment.save((err, addedDepartment) => {
        if (err) reject(err);
        resolve(addedDepartment);
      });
    });
  };

  return {
    getDepartmentById,
    getAllDepartments,
    postNewDepartment
  };
}

module.exports = departmentMethodsFactory;
