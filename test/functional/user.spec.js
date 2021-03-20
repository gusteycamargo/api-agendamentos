'use strict'

const { test, trait, before, after } = use('Test/Suite')('User')
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

test('create user', async ({ client }) => {
  const response = await client.post('/users')
  .send({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })
})

test('list all users that belong to the same campus as the logged in user', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  await User.create({
    campus_id: sao_paulo.id,
    username: 'galdino.gustavo',
    email: 'galdino.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  const response = await client.get('/users')
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      campus_id: campus.id,
      username: 'camargo.gustavo',
      email: 'camargo.gustavo@gmail.com',
      fullname: 'Gustavo Galdino de Camargo',
      function: 'adm',
      status: 'Ativo'
    }
  ])
})

test('show one user', async ({ client }) => {
  const usr = await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  const response = await client.get(`/users/${usr.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })
})

test('update user', async ({ client }) => {
  const usr = await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  const response = await client.put(`/users/${usr.id}`)
  .send({
    fullname: "Gustavo de Camargo",
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    fullname: 'Gustavo de Camargo',
    function: 'adm',
    status: 'Ativo'
  })
})

test('delete user', async ({ client }) => {
  const usr = await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  const response = await client.delete(`/users/${usr.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Inativo'
  })
})

test('restore user', async ({ client }) => {
  const usr = await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Inativo'
  })

  const response = await client.post(`/users/restore/${usr.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })
})

test('update user with username of another user already registered', async ({ client }) => {
  const usr = await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  const response = await client.put(`/users/${usr.id}`)
  .send({
    username: "gustavo.camargo"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(400)
  response.assertError({
    error: 'Ocorreu um erro ao editar o usuário, verifique se o nome de usuário ou e-mail já não está sendo utilizado'
  })
})

test('update user with email of another user already registered', async ({ client }) => {
  const usr = await User.create({
    campus_id: campus.id,
    username: 'camargo.gustavo',
    email: 'camargo.gustavo@gmail.com',
    password: 'senha123',
    fullname: 'Gustavo Galdino de Camargo',
    function: 'adm',
    status: 'Ativo'
  })

  const response = await client.put(`/users/${usr.id}`)
  .send({
    email: "camargo25.gustavo@gmail.com"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(400)
  response.assertError({
    error: 'Ocorreu um erro ao editar o usuário, verifique se o nome de usuário ou e-mail já não está sendo utilizado'
  })
})