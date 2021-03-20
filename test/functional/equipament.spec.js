'use strict'

const { test, trait, before, after } = use('Test/Suite')('Equipament')
const Equipament = use('App/Models/Equipament')
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

test('create equipament', async ({ client }) => {
  const response = await client.post('/equipaments')
  .send({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })
})

test('list all equipaments that belong to the same campus as the logged in user', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })

  await Equipament.create({
    campus_id: sao_paulo.id,
    name: 'Projetor 2',
    brand: 'Benq',
    equityNumber: "1234",
    status: 'Ativo'
  })

  const response = await client.get('/equipaments')
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      campus_id: campus.id,
      name: 'Projetor 1',
      brand: 'Benq',
      equityNumber: "123",
      status: 'Ativo'
    }
  ])
})

test('show one equipament', async ({ client }) => {
  const equipament = await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })

  const response = await client.get(`/equipaments/${equipament.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })
})

test('update equipament', async ({ client }) => {
  const equipament = await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })

  const response = await client.put(`/equipaments/${equipament.id}`)
  .send({
    name: "Projetor 2",
    equityNumber: "123"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    name: 'Projetor 2',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })
})

test('delete equipament', async ({ client }) => {
  const equipament = await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })

  const response = await client.delete(`/equipaments/${equipament.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'equipamento deletado com sucesso'
  })
})

test('restore equipament', async ({ client }) => {
  const equipament = await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Inativo'
  })

  const response = await client.post(`/equipaments/restore/${equipament.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'equipamento restaurado com sucesso'
  })
})

test('update equipament with equity number of another equipament already registered', async ({ client }) => {
  const equipament_one = await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 1',
    brand: 'Benq',
    equityNumber: "123",
    status: 'Ativo'
  })

  await Equipament.create({
    campus_id: campus.id,
    name: 'Projetor 2',
    brand: 'Benq',
    equityNumber: "1234",
    status: 'Ativo'
  })

  const response = await client.put(`/equipaments/${equipament_one.id}`)
  .send({
    equityNumber: "1234"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(400)
  response.assertError({
    error: 'Inserção inválida, verifique se o número de patrimônio já não está cadastrado'
  })
})