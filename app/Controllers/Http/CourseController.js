'use strict'

const Course = use('App/Models/Course');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with courses
 */
class CourseController {
  /**
   * Show a list of all courses.
   * GET courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth, request, response, view }) {
    // if(auth.user.function === 'adm') {
      const courses = await Course.query().whereRaw("campus_id = ?", [auth.user.campus_id]).orderBy('name', 'cres').with('campus').fetch();
      //await equipaments.load('campus');
  
      return courses;
    // }
    // else {
    //   return response.status(403).send('Área não autorizada');
    // } 
  }

  async store ({ auth, request, response }) {
    if(auth.user.function === 'adm') {
      try {
        const data = request.only(['campus_id', 'name', 'status']);
        const verify = await Course.findBy({ campus_id: auth.user.campus_id, name: data.name });
        if(!verify) {
          const course = await Course.create(data);
          await course.load('campus');
    
          return course;
        }
        else {
          return response.status(400).send({ error: 'Ocorreu um erro ao salvar o curso, verifique se o nome já não está sendo utilizado' });
        }
      }
      catch(e) {
        console.log(e);
        return response.status(400).send({ error: 'Ocorreu um erro ao salvar o curso, verifique se o nome já não está sendo utilizado' });
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async show ({ auth, params, request, response, view }) {
    if(auth.user.function === 'adm') {
      const course = await Course.findOrFail(params.id);
      await course.load('campus');
  
      return course;
    }
    else {
      return response.status(403).send('Área não autorizada');
    }  
  }

  async update ({ params, auth, request, response }) {
    if(auth.user.function === 'adm') {
      try {
        let course = await Course.findOrFail(params.id);
        const data = request.only(["campus_id", "name", "status"]);
        const verify = await Course.findBy({ campus_id: auth.user.campus_id, name: data.name });
        if(!verify || course.name === data.name) {    
          await course.merge(data);
          await course.save();
    
          return {
            status: 'ok'
          }
        }
        else {
          return response.status(400).send({ error: 'Ocorreu um erro ao editar o curso, verifique se o nome já não está sendo utilizado' });
        }
      }
      catch(e) {
        return response.status(400).send({ error: 'Ocorreu um erro ao editar o curso, verifique se o nome já não está sendo utilizado' });
      }
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
  }

  async destroy ({ params, auth, request, response }) {
   
    if(auth.user.function === 'adm') {
      let course = await Course.findOrFail(params.id);
      
      await course.merge({status: 'Inativo'});
      await course.save();

      return {
        status: 'ok'
      };
    }
    else {
      return response.status(403).send('Área não autorizada');
    }
    
  }
}

module.exports = CourseController
