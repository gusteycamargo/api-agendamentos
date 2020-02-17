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
    if(auth.user.function === 'adm') {
      const courses = await Course.query().with('campus').fetch();
      //await equipaments.load('campus');
  
      return courses;
    }
    else {
      return response.status(403).send('Área não autorizada');
    } 
  }

  async store ({ auth, request, response }) {
    if(auth.user.function === 'adm') {
      const data = request.only(['campus_id', 'name', 'status']);

      const course = await Course.create(data);
      await course.load('campus');

      return course;
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
      let course = await Course.findOrFail(params.id);
      const data = request.only(["campus_id", "name", "status"]);

      await course.merge(data);
      await course.save();

      return {
        status: 'ok'
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
