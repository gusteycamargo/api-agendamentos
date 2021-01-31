'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CourseSchema extends Schema {
  up () {
    this.create('courses', (table) => {
      table.increments()
      table
        .integer('campus_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('campuses')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CourseSchema
