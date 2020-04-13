'use strict'

const Database = use('Database');
const Schedule = use('App/Models/Schedule');
const Mail = use('Mail');
const availableEquipaments = use('App/utils/availableEquipaments');
const availablePlaces = use('App/utils/availablePlaces');
const schedulesFiltered = use('App/utils/schedulesFiltered');
const retrieveDataToEmailConfirmation = use('App/utils/retrieveDataToEmailConfirmation');

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

  async store ({ request, response, auth }) {
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
      'equipaments',
      'status'
    ]);

    const hourInitial = data.initial.split(":");
    const hourFinal = data.final.split(":");
    
    const schedulesData = await schedulesFiltered(data.date, hourInitial, hourFinal, data.status);
    const avaibilityEquipaments = await availableEquipaments(schedulesData, auth);
    const avaibilityPlaces = await availablePlaces(schedulesData, auth);

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

          const { user, place, course, category, equipamentsName, date, addressee } = await retrieveDataToEmailConfirmation(equipaments, schedule);
          
          await Mail.send('emails.confirmationSchedule', { schedule, date, user, equipamentsName, place, course, category }, (message) => {
            message
                .from('donotreplyagendamento@unespar.edu.br')
                .to(addressee.email)
                .subject('Confirmação de agendamento')
          });

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
      const { user, place, course, category, equipamentsName, date, addressee } = await retrieveDataToEmailConfirmation(equipaments, schedule);

      await Mail.send('emails.confirmationSchedule', { schedule, date, user, equipamentsName, place, course, category }, (message) => {
        message
            .from('donotreplyagendamento@unespar.edu.br')
            .to(addressee.email)
            .subject('Confirmação de agendamento')
      });

      return schedule;
    }
  }

  async show ({ params, request, response, view }) {
    const schedule = await Schedule.findOrFail(params.id);
    await schedule.load('place')
    await schedule.load('requesting_user')
    await schedule.load('registration_user')
    await schedule.load('equipaments')
    await schedule.load('category')
    await schedule.load('course')
    await schedule.load('campus');
                  
    //const users = await Database.select('id', 'username', 'email', 'fullname', 'function', 'status').from('users').query().with('campus').fetch();
    //await equipaments.load('campus');

    return schedule;
  }

  async update ({ params, request, response , auth }) {
    
    const equipamentsInSchdeule = await Database.select('equipament_id').from('equipament_schedule').where('schedule_id', params.id)    
    
    const schedule = await Schedule.findOrFail(params.id);
    
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
      'equipaments',
      'status'
    ]);

    const hourInitial = data.initial.split(":");
    const hourFinal = data.final.split(":");
    
    const schedulesData = await schedulesFiltered(data.date, hourInitial, hourFinal, data.status);
    const avaibilityEquipaments = await availableEquipaments(schedulesData, auth);
    const avaibilityPlaces = await availablePlaces(schedulesData, auth);

    const equipamentsVerify = avaibilityEquipaments.filter((equipament) => {
      return equipaments.includes(equipament.id);
    });

    const placeVerify = avaibilityPlaces.filter((place) => {
      return data.place_id === place.id;
    });

    if(placeVerify.length === 0) {      
      if(schedule.place_id !== data.place_id){
        return {
          "error": "entrada inválida"
        }
      }
    }

    if(equipaments.length !== 0) {
      if(equipamentsVerify.length === equipaments.length || ((equipaments.length === equipamentsInSchdeule.length) || (equipaments.length < equipamentsInSchdeule.length))) {
        await schedule.merge(data);
        await schedule.save();

  
        if(equipaments) {
          await schedule.equipaments().sync(equipaments)
          //await schedule.equipaments().attach(equipaments);

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
      await schedule.merge(data);
      await schedule.save();
      await schedule.equipaments().sync(equipaments);
      //const schedule = await Schedule.create(data);
      return schedule;
    }
  }

  async destroy ({ params, request, response }) {
    const schedule = await Schedule.findOrFail(params.id);

    await schedule.merge({ status: 'Cancelado' });
    await schedule.save();

    return schedule;
  }
}

module.exports = ScheduleController
