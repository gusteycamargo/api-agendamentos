'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Schedule extends Model {
    static get hidden () {
        return ['place_id', 
                'category_id', 
                'course_id',
                'campus_id',
                'registration_user_id',
                'requesting_user_id']
    }
    
    equipaments() {
        return this.belongsToMany('App/Models/Equipament');
    }
    place() {
        return this.belongsTo('App/Models/Place');
    }
    category() {
        return this.belongsTo('App/Models/Category');
    }
    course() {
        return this.belongsTo('App/Models/Course');
    }
    campus() {
        return this.belongsTo('App/Models/Campus');
    }
    requesting_user() {
        return this.belongsTo('App/Models/User', 'requesting_user_id', 'id');
    }
    registration_user() {
        return this.belongsTo('App/Models/User', 'registration_user_id', 'id');
    }
}

module.exports = Schedule
