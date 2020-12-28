'use strict'

const Category = use('App/Models/Category')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
 
  async index ({ auth, request, response, view }) {
    // if(auth.user.function === 'adm') {
      const categories = await Category.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').orderBy('description', 'cres').fetch();
      //await equipaments.load('campus');
  
      return categories;
    // }
    // else {
    //   return response.status(403).send('Área não autorizada');
    // } 
  }

  async store ({ auth, request, response }) {
    if(auth.user.function === 'adm') {
      const data = request.only(['campus_id', 'description', 'status']);

      const category = await Category.create(data);
      await category.load('campus');

      return category;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async show ({ auth, params, request, response, view }) {
    if(auth.user.function === 'adm') {
      const category = await Category.findOrFail(params.id);
      await category.load('campus');
  
      return category;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async update ({ params, auth, request, response }) {
    if(auth.user.function === 'adm') {
      let category = await Category.findOrFail(params.id);
      const data = request.only(["campus_id", "description", "status"]);

      await category.merge(data);
      await category.save();

      return {
        status: 'categoria alterada com sucesso'
      };
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async destroy ({ params, auth, request, response }) {
   
    if(auth.user.function === 'adm') {
      let category = await Category.findOrFail(params.id);
      
      await category.merge({status: 'Inativo'});
      await category.save();

      return {
        status: 'categoria deletada com sucesso'
      };
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
    
  }

}

module.exports = CategoryController
