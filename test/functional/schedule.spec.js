'use strict'

const { test, trait, before, after } = use('Test/Suite')('Schedule')
const Schedule = use('App/Models/Schedule')
const Place = use('App/Models/Place')
const Category = use('App/Models/Category')
const Course = use('App/Models/Course')
const Campus = use('App/Models/Campus')
const User = use('App/Models/User')

trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

let user
let campus 
let place 
let category 
let course 

before(async () => {
  campus = await Campus.create({
    city: 'Paranaguá',
    adress: 'R. Comendador Correia Júnior, 117 - Centro, Paranaguá - PR, 83203-560',
    status: 'Ativo'
  })

  course = await Course.create({
    campus_id: campus.id,
    name: 'TADS',
    status: 'Ativo'
  })

  category = await Category.create({
    campus_id: campus.id,
    description: '1º ano',
    status: 'Ativo'
  })

  place = await Place.create({
    campus_id: campus.id,
    name: 'Sala 1',
    capacity: 30,
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

test('create schedule without equipaments', async ({ client }) => {
  const response = await client.post('/schedules')
  .send({
    campus_id: campus.id,
    place_id: place.id,
    category_id: category.id,
    course_id: course.id,
    registration_user_id: user.id,
    requesting_user_id: user.id,
    comments: 'Levar cabo HDMI',
    initial: '19:00',
    final: '20:50',
    date: '2021-03-20',
    equipaments: [],
    status: 'Confirmado'
  })
  .loginVia(user, 'jwt')
  .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    comments: 'Levar cabo HDMI',
    initial: '19:00',
    final: '20:50',
    date: '2021-03-20',
    status: 'Confirmado'
  })
})
