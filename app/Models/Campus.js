'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class Campus extends Model {
    category () {
        return this.hasOne('App/Models/Category');
    }
    equipament () {
        return this.hasOne('App/Models/Equipament')
    }
    user () {
        return this.hasOne('App/Models/User')
    }
}

module.exports = Campus
