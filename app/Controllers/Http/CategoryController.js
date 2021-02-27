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
    const categories = await Category.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').orderBy('description', 'cres').fetch();
    //await equipaments.load('campus');

    return categories;
  }

  async store ({ auth, request, response }) {
    if(auth.user.function === 'adm') {
      try {
        const data = request.only(['campus_id', 'description', 'status']);
        const verify = await Category.findBy({ campus_id: auth.user.campus_id, description: data.description });
        if(!verify) {
          const category = await Category.create(data);
          await category.load('campus');
  
          return category;
        }
        else {
          return response.status(400).send({ error: 'Ocorreu um erro ao salvar o ano, verifique se a descrição já não está sendo utilizada' });
        }
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao salvar o ano, verifique se a descrição já não está sendo utilizada' });
      }
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
      try {
        let category = await Category.findOrFail(params.id);
        const data = request.only(["campus_id", "description", "status"]);
        const verify = await Category.findBy({ campus_id: auth.user.campus_id, description: data.description });
        if(!verify || category.description === data.description) {
          await category.merge(data);
          await category.save();
  
          return {
            status: 'categoria alterada com sucesso'
          }
        }
        else {
          return response.status(400).send({ error: 'Ocorreu um erro ao editar o ano, verifique se a descrição já não está sendo utilizada' });
        }
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao editar o ano, verifique se a descrição já não está sendo utilizada' });
      }
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
