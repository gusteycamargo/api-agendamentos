'use strict'

const { test, trait, before, after } = use('Test/Suite')('Category')
const Category = use('App/Models/Category')
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

test('create category', async ({ client }) => {
  const response = await client.post('/categories')
  .send({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })
})

test('list all categories that belong to the same campus as the logged in user', async ({ client }) => {
  const sao_paulo = await Campus.create({
    city: 'São Paulo',
    adress: 'Avenida paulista',
    status: 'Ativo'
  })

  await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })

  await Category.create({
    campus_id: sao_paulo.id,
    description: '1º ano SÂO PAULO',
    status: 'Ativo'
  })

  const response = await client.get('/categories')
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      campus_id: campus.id,
      description: '1º ano',
      status: 'Ativo'
    }
  ])
})

test('show one category', async ({ client }) => {
  const category = await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })

  const response = await client.get(`/categories/${category.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })
})

test('update category', async ({ client }) => {
  const category = await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })

  const response = await client.put(`/categories/${category.id}`)
  .send({
    description: "2º ano"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    campus_id: campus.id,
    description: '2º ano',
    status: 'Ativo'
  })
})

test('delete category', async ({ client }) => {
  const category = await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })

  const response = await client.delete(`/categories/${category.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'categoria deletada com sucesso'
  })
})

test('restore category', async ({ client }) => {
  const category = await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Inativo'
  })

  const response = await client.post(`/categories/restore/${category.id}`)
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 'categoria restaurada com sucesso'
  })
})

test('update category with description of another category already registered', async ({ client }) => {
  const category_one = await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })

  await Category.create({
    campus_id: campus.id,
    description: '2º ano',
    status: 'Ativo'
  })

  const response = await client.put(`/categories/${category_one.id}`)
  .send({
    description: "2º ano"
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(400)
  response.assertError({
    error: 'Ocorreu um erro ao editar o ano, verifique se a descrição já não está sendo utilizada'
  })
})