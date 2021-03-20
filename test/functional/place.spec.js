'use strict'

const { test, trait, before, after } = use('Test/Suite')('Place')
const Place = use('App/Models/Place')
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

test('create place', async ({ client }) => {
  const response = await client.post('/places')
  .send({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })
})

test('list all places that belong to the same campus as the logged in user', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  await Place.create({
    campus_id: sao_paulo.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })

  await Place.create({
    campus_id: campus.id,
    name: 'Sala 2',
    capacity: 30,
    status: 'Ativo'
  })

  const response = await client.get('/places')
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      campus_id: campus.id,
      name: 'Sala 2',
      capacity: 30,
      status: 'Ativo'
    }
  ])
})

test('show one place', async ({ client }) => {
  const place = await Place.create({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })

  const response = await client.get(`/places/${place.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })
})

test('update place', async ({ client }) => {
  const place = await Place.create({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })

  const response = await client.put(`/places/${place.id}`)
  .send({
    name: "Sala 2",
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'Sala 2',
    capacity: 30,
    status: 'Ativo'
  })
})

test('delete place', async ({ client }) => {
  const place = await Place.create({
    campus_id: campus.id,
    name: 'Sala 2',
    capacity: 30,
    status: 'Ativo'
  })

  const response = await client.delete(`/places/${place.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'ok'
  })
})

test('restore place', async ({ client }) => {
  const place = await Place.create({
    campus_id: campus.id,
    name: 'Sala 2',
    capacity: 30,
    status: 'Inativo'
  })

  const response = await client.post(`/places/restore/${place.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'ok'
  })
})

test('update place with name of another place already registered', async ({ client }) => {
  const place_one = await Place.create({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
    status: 'Ativo'
  })

  await Place.create({
    campus_id: campus.id,
    name: 'Sala 2',
    capacity: 30,
    status: 'Ativo'
  })

  const response = await client.put(`/places/${place_one.id}`)
  .send({
    name: "Sala 2"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(400)
  response.assertError({
    error: 'Ocorreu um erro ao editar a sala, verifique se o nome já não está sendo utilizado'
  })
})