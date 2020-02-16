'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class Equipament extends Model {
    schedules() {
        return this.belongsToMany('App/Models/Schedule');
    }
    campus() {
        return this.belongsTo('App/Models/Campus');
    }
}

module.exports = Equipament
