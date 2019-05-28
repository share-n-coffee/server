const mongoose = require('mongoose');
const DepartmentSchema = require('../models/department');
const isNull = require('../../utilities/isNull');

function departmentMethodsFactory(departmentModelName) {
  if (isNull(departmentModelName)) {
    return {};
  }
  const Departments = DepartmentSchema(departmentModelName);

  const findDepartments = req =>
    Departments.find(req.query, req.fields, {
      ...req.sorting,
      ...req.pagination
    });

  const findOneDepartment = (query, fields = null) =>
    Departments.findOne(query, fields).exec();

  const countDepartments = () => Departments.find({}).count();

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

  const updateDepartment = (departmentId, newProps) => {
    return Departments.findOneAndUpdate(
      { _id: departmentId },
      { $set: newProps },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  return {
    getDepartmentById,
    getAllDepartments,
    postNewDepartment,
    updateDepartment,
    findDepartments,
    findOneDepartment,
    countDepartments
  };
}

module.exports = departmentMethodsFactory;
