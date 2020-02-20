'use strict'

const Schedule = use('App/Models/Schedule');
const availableEquipaments = use('App/utils/availableEquipaments');
const availablePlaces = use('App/utils/availablePlaces');
const schedulesFiltered = use('App/utils/schedulesFiltered');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with schedules
 */
class ScheduleController {

  async index ({ request, auth, response, view }) {
    let schedules = [];
    
    if(auth.user.function === 'adm') {
      schedules = await Schedule.query().with('place')
        .with('requesting_user')
        .with('registration_user')
        .with('equipaments')
        .with('category')
        .with('course')
        .with('campus')
        .fetch();
    }
    else {
      schedules = await Schedule.query().whereRaw('requesting_user_id = ?', [auth.user.id]).with('place')
        .with('requesting_user')
        .with('registration_user')
        .with('equipaments')
        .with('category')
        .with('course')
        .with('campus')
        .fetch();
    }

    return schedules;
  }

  async store ({ request, response }) {
    const { equipaments, ...data } = request.only([
      'place_id', 
      'category_id', 
      'course_id', 
      'registration_user_id', 
      'requesting_user_id', 
      'campus_id', 
      'comments',
      'date',
      'initial',
      'final',
      'equipaments'
    ]);

    const hourInitial = data.initial.split(":");
    const hourFinal = data.final.split(":");
    
    const schedulesData = await schedulesFiltered(data.date, hourInitial, hourFinal);
    const avaibilityEquipaments = await availableEquipaments(schedulesData);
    const avaibilityPlaces = await availablePlaces(schedulesData);

    const equipamentsVerify = avaibilityEquipaments.filter((equipament) => {
      return equipaments.includes(equipament.id);
    });

    const placeVerify = avaibilityPlaces.filter((place) => {
      return data.place_id === place.id;
    });

    if(placeVerify.length === 0) {
      return {
        "error": "entrada inválida"
      }
    }

    if(equipaments.length !== 0) {
      if(equipamentsVerify.length === equipaments.length) {
        const schedule = await Schedule.create(data);
  
        if(equipaments) {
          await schedule.equipaments().attach(equipaments);
          await schedule.load('equipaments');
  
          return schedule;
        }
      }
      else {
        return {
          "error": "entrada inválida"
        }
      }
    }
    else {
      const schedule = await Schedule.create(data);
      return schedule;
    }
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = ScheduleController
