'use strict'

const Campus = use('App/Models/Campus');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with campuses
 */
class CampusController {

  async index ({ request, response, auth }) {
    if(auth.user.function === 'adm') {
      const campus = await Campus.query().orderBy('city', 'cres').fetch();

      return campus;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async store ({ request, response, auth }) {
    if(auth.user.function === 'adm') {
      try {
        const data = request.only(['city', 'adress', 'status']);

        const campus = await Campus.create(data);
    
        return campus;
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao salvar o campus, verifique se a cidade já não está cadastrada' });
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
    
  }

  async show ({ params, request, response, auth }) {
    if(auth.user.function === 'adm') {
      const campus = await Campus.findOrFail(params.id);

      return campus;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async update ({ params, request, response, auth }) {
    if(auth.user.function === 'adm') {
      try {
        const campus = await Campus.findOrFail(params.id);
        const data = request.only(["city", "adress", "status"]);

        await campus.merge(data);
        await campus.save();

        return campus;
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao editar o campus, verifique se a cidade já não está cadastrada' });
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async destroy ({ params, request, response, auth }) {
    if(auth.user.function === 'adm') {
      const campus = await Campus.findOrFail(params.id);

      await campus.merge({ status: 'Inativo'});
      await campus.save();

      return campus;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }
}

module.exports = CampusController
