'use strict'

const { test, trait, before, after } = use('Test/Suite')('Course')
const Course = use('App/Models/Course')
const Campus = use('App/Models/Campus')
const User = use('App/Models/User')

trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

let user
let campus 

before(async () => {
  campus = await Campus.create({
    city: 'Paranaguá',
    adress: 'R. Comendador Correia Júnior, 117 - Centro, Paranaguá - PR, 83203-560',
    status: 'Ativo'
  })

  user = await User.create({
    campus_id: campus.id,
    username: "gustavo.camargo",
    email: "camargo25.gustavo@gmail.com",
    password: "senha123",
    fullname: "Gustavo Galdino de Camargo",
    function: "adm",
    status: "Ativo"
  })
})

after(async () => {
  await user.delete()
  await campus.delete()
})

test('create course', async ({ client }) => {
  const response = await client.post('/courses')
  .send({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })
})

test('list all courses that belong to the same campus as the logged in user', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  await Course.create({
    campus_id: sao_paulo.id,
    name: 'Física',
    status: 'Ativo'
  })

  const response = await client.get('/courses')
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      campus_id: campus.id,
      name: 'TADS',
      status: 'Ativo'
    }
  ])
})

test('show one course', async ({ client }) => {
  const course = await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  const response = await client.get(`/courses/${course.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })
})

test('update course', async ({ client }) => {
  const course = await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  const response = await client.put(`/courses/${course.id}`)
  .send({
    name: "Análise e desenvolvimento de sistemas"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'ok'
  })
})

test('delete course', async ({ client }) => {
  const course = await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  const response = await client.delete(`/courses/${course.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'ok'
  })
})

test('restore course', async ({ client }) => {
  const course = await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  const response = await client.post(`/courses/restore/${course.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'ok'
  })
})

test('update course with description of another course already registered', async ({ client }) => {
  const course_one = await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  await Course.create({
    campus_id: campus.id,
    name: 'Análise e desenvolvimento de sistemas',
    status: 'Ativo'
  })

  const response = await client.put(`/courses/${course_one.id}`)
  .send({
    description: "Análise e desenvolvimento de sistemas"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(400)
  response.assertError({
    error: 'Ocorreu um erro ao editar o curso, verifique se o nome já não está sendo utilizado'
  })
})