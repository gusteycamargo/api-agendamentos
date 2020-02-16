'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Schedule extends Model {
    equipaments() {
        return this.belongsToMany('App/Models/Equipament');
    }
}

module.exports = Schedule
