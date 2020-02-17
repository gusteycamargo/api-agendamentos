'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {
    campus() {
        return this.belongsTo('App/Models/Campus');
    }
}

module.exports = Course
