'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table
        .integer('campus_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('campuses')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable()
      table.string('password', 60).notNullable()
      table.string('fullname', 260).notNullable()
      table.string('function', 60).notNullable()
      table.string('status', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
