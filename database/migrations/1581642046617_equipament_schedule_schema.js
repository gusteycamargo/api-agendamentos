'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleEquipamentSchema extends Schema {
  up () {
    this.create('equipament_schedule', (table) => {
      table.increments()
      table
        .integer('schedule_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('schedules')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('equipament_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('equipaments')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('equipament_schedule')
  }
}

module.exports = ScheduleEquipamentSchema
