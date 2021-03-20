'use strict'

const { test, trait, before, after } = use('Test/Suite')('Campus')
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

test('create campus', async ({ client }) => {
  const response = await client.post('/campuses')
  .send({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })
})

test('list all campus', async ({ client }) => {
  await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  const response = await client.get('/campuses')
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      city: 'Paranaguá',
      adress: 'R. Comendador Correia Júnior, 117 - Centro, Paranaguá - PR, 83203-560',
      status: 'Ativo'
    },
    {
      city: 'São Paulo',
      adress: 'Avenida paulista',
      status: 'Ativo'
    }
  ])
})

test('show one campus', async ({ client }) => {
  const response = await client.get(`/campuses/${campus.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    city: 'Paranaguá',
    adress: 'R. Comendador Correia Júnior, 117 - Centro, Paranaguá - PR, 83203-560',
    status: 'Ativo'
  })
})

test('update campus', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  const response = await client.put(`/campuses/${sao_paulo.id}`)
  .send({
    adress: "Rua 25 de março"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    city: 'São Paulo',
    adress: 'Rua 25 de março',
    status: 'Ativo'
  })
})

test('delete campus', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  const response = await client.delete(`/campuses/${sao_paulo.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Inativo'
  })
})

test('restore campus', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Inativo'
  })

  const response = await client.post(`/campuses/restore/${sao_paulo.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })
})