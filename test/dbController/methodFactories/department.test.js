/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const config = require('../../../server/config/config');
const connectDatabase = require('../../../server/lib/connectDatabase');
const ClassController = require('../../../server/database/dbController');
// const collectionConfig = require('./collection');

const controller = new ClassController();
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};
connectDatabase();

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('Get all Departments', done => {
    function cb(controllerDepartments, mongoDepartmentsCount) {
      testData.departmentId = controllerDepartments[0]['_id'];

      expect(controllerDepartments).toHaveLength(mongoDepartmentsCount);
      done();
    }
    MongoClient.connect(
      config.database,
      (err, client) => {
        client
          .db('demoproject')
          .collection('demo_departments')
          .find({})
          .count((error, mongoDepartmentsCount) => {
            client.close();
            controller.getAllDepartments().then(controllerDepartments => {
              cb(controllerDepartments, mongoDepartmentsCount);
            });
          });
      }
    );
  });

  test('GET Department by _id', done => {
    function cb(department) {
      expect(department).toHaveProperty('description');
      done();
    }

    controller.getDepartmentById(testData.departmentId).then(department => {
      cb(department);
    });
  });

  test('POST new Department', done => {
    const newDepartmentParams = {
      title: 'New Department',
      description: 'Just another Department'
    };

    function cb(newDepartment) {
      expect(newDepartment.description).toMatch(
        newDepartmentParams.description
      );

      //  Send mongodb driver's query for deleting test Department
      MongoClient.connect(
        config.database,
        (err, client) => {
          client
            .db('demoproject')
            .collection('demo_departments')
            .deleteOne({ _id: newDepartment['_id'] }, () => {
              client.close();
              done();
            });
        }
      );
    }

    controller.postNewDepartment(newDepartmentParams).then(newDepartment => {
      cb(newDepartment);
    });
  });
});
