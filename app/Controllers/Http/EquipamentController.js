'use strict'

const Equipament = use('App/Models/Equipament');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with equipaments
 */
class EquipamentController {

  async index ({ auth, request, response, view }) {
    if(auth.user.function === 'adm') {
      const equipaments = await Equipament.query().with('campus').fetch();
      //await equipaments.load('campus');
  
      return equipaments;
    }
    else {
      return response.status(403).send('Área não autorizada');
    } 
  }

  async store ({ auth, request, response }) {
    if(auth.user.function === 'adm') {
      const data = request.only(['campus_id', 'equityNumber', 'brand', 'name', 'status']);

      try {
        const equipament = await Equipament.create(data);
        await equipament.load('campus');
  
        return equipament;
      }
      catch (error) {
        return {
          error: 'Inserção inválida'
        }
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async show ({ auth, params, request, response, view }) {
    if(auth.user.function === 'adm') {
      try {
        const equipament = await Equipament.findOrFail(params.id);
        await equipament.load('campus');
    
        return equipament;
      }
      catch (error) {
        return {
          error: 'equipamento não encontrado'
        };
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async update ({ params, auth, request, response }) {
    if(auth.user.function === 'adm') {
      let equipament = await Equipament.findOrFail(params.id);
      const data = request.only(["campus_id", "equityNumber", "brand", "name", "status"]);

      await equipament.merge(data);
      await equipament.save();

      return {
        status: 'equipamento alterado com sucesso'
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async destroy ({ params, auth, request, response }) {
   
    if(auth.user.function === 'adm') {
      let equipament = await Equipament.findOrFail(params.id);
      
      await equipament.merge({status: 'Inativo'});
      await equipament.save();

      return {
        status: 'equipamento deletado com sucesso'
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
    
  }
}

module.exports = EquipamentController
