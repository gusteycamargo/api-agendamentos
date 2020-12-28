'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CampusSchema extends Schema {
  up () {
    this.create('campuses', (table) => {
      table.increments()
      table.string('city', 80).notNullable().unique()
      table.string('adress', 280).notNullable()
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('campuses')
  }
}

module.exports = CampusSchema
