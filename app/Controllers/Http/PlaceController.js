'use strict'

const Place = use('App/Models/Place');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with places
 */
class PlaceController {
  /**
   * Show a list of all places.
   * GET places
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth, request, response, view }) {
    if(auth.user.function === 'adm') {
      const places = await Place.query().whereRaw("campus_id = ?", [auth.user.campus_id]).orderBy('name', 'cres').with('campus').fetch();
      //await equipaments.load('campus');
  
      return places;
    }
    else {
      return response.status(403).send('Área não autorizada');
    } 
  }

  async store ({ auth, request, response }) {
    if(auth.user.function === 'adm') {
      const data = request.only(['campus_id', 'name', 'capacity', 'status']);
      try {
        const place = await Place.create(data);
        await place.load('campus');
  
        return place;
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao salvar a sala, verifique se o nome já não está sendo utilizado' });
      }
        
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async show ({ auth, params, request, response, view }) {
    if(auth.user.function === 'adm') {
      const place = await Place.findOrFail(params.id);
      await place.load('campus');
  
      return place;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async update ({ params, auth, request, response }) {
    if(auth.user.function === 'adm') {
      try {
        let place = await Place.findOrFail(params.id);
        const data = request.only(["campus_id", "name", 'capacity', "status"]);
  
        await place.merge(data);
        await place.save();
  
        return {
          status: 'ok'
        };
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao editar a sala, verifique se o nome já não está sendo utilizado' });
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async destroy ({ params, auth, request, response }) {
   
    if(auth.user.function === 'adm') {
      let place = await Place.findOrFail(params.id);
      
      await place.merge({status: 'Inativo'});
      await place.save();

      return {
        status: 'ok'
      };
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
    
  }
}

module.exports = PlaceController
