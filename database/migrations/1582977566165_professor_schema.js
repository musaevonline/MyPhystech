'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProfessorSchema extends Schema {
  up () {
    this.create('professors', (table) => {
      table.increments()
      table.string('name')
      table.string('surname')
      table.text('desc')
      table.timestamps()
    })
  }

  down () {
    this.drop('professors')
  }
}

module.exports = ProfessorSchema
