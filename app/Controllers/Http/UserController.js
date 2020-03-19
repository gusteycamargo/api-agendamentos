'use strict'

const User = use('App/Models/User');
const Database = use('Database')

class UserController {

  async index ({ auth, request, response, view }) {
    // if(auth.user.function === 'adm') {
      const users = await User.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').fetch();
      //const users = await Database.select('id', 'username', 'email', 'fullname', 'function', 'status').from('users').query().with('campus').fetch();
      //await equipaments.load('campus');
  
      return users;
    // }
    // else {
    //   return response.status(403).send('Área não autorizada');
    // } 
  }

  async store ({ request }) {
    const data = request.only(["campus_id", "username", "email", "password", "fullname", "function", "status"]);    
    const user = await User.create(data);

    return user;
  }

  async show ({ auth, params, response, view }) {
    if(auth.user.function === 'adm') {
      const user = await User.findOrFail(params.id);
      await user.load('campus');
      //const users = await Database.select('id', 'username', 'email', 'fullname', 'function', 'status').from('users').query().with('campus').fetch();
      //await equipaments.load('campus');
  
      return user;
    }
    else {
      return response.status(403).send('Área não autorizada');
    } 
  }

  async update ({ auth, params, response, request }) {
    if(auth.user.function === 'adm') {
      const user = await User.findOrFail(params.id);
      const data = request.only(['username', 'email', 'fullname', 'function', 'status']);

      await user.merge(data);
      await user.save();
      //const users = await Database.select('id', 'username', 'email', 'fullname', 'function', 'status').from('users').query().with('campus').fetch();
      //await equipaments.load('campus');
  
      return user;
    }
    else {
      return response.status(403).send('Área não autorizada');
    } 
  }

  async destroy ({ auth, params, response, request }) {
    if(auth.user.function === 'adm') {
      const user = await User.findOrFail(params.id);

      await user.merge({ status: 'Inativo' });
      await user.save();
      //const users = await Database.select('id', 'username', 'email', 'fullname', 'function', 'status').from('users').query().with('campus').fetch();
      //await equipaments.load('campus');
  
      return user;
    }
    else {
      return response.status(403).send('Área não autorizada');
    } 
  }

}

module.exports = UserController
