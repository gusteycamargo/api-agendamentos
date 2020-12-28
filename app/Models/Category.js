'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Hash = use('Hash');

class Category extends Model {
    campus() {
        return this.belongsTo('App/Models/Campus');
    }
    schedule() {
        return this.hasOne('App/Models/Schedule');
    }
}

module.exports = Category
