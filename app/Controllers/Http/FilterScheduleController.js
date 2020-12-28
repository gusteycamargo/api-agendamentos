'use strict'
const Schedule = use('App/Models/Schedule');

class FilterScheduleController {
    async index ({ request, auth, response, view }) {
        const data = request.headers();
        let schedules = [], periodHour = [];
        
        if(data.period === 'Manha') {
            periodHour = {
                initial1: '08:00:00',
                initial2: '12:00:00',
                final1: '09:00:00',
                final2: '12:59:59',
            }
        }
        else if(data.period === 'Tarde') {
            periodHour = {
                initial1: '13:00:00',
                initial2: '18:00:00',
                final1: '14:00:00',
                final2: '23:00:00',
            }
        }
        else if(data.period === 'Noite') {
            periodHour = {
                initial1: '17:00:00',
                initial2: '22:00:00',
                final1: '18:00:00',
                final2: '23:30:00'
            }
        }
        else if(data.period === ''){
            periodHour = {
                initial1: '08:00:00',
                initial2: '22:00:00',
                final1: '09:00:00',
                final2: '23:30:00'
            }
        }

        if(auth.user.function === 'adm') {
          schedules = await Schedule.query()
            .whereRaw('date = ? and (initial between ? and ?) and (final between ? and ?) and campus_id = ?', 
                [data.date_a, periodHour.initial1, periodHour.initial2, periodHour.final1, periodHour.final2, auth.user.campus_id])
            .orderBy('initial', 'cres')
            .with('place')
            .with('requesting_user')
            .with('registration_user')
            .with('equipaments')
            .with('category')
            .with('course')
            .with('campus')
            .fetch();
        }
        else {
          schedules = await Schedule.query().whereRaw('(requesting_user_id = ?) and date = ? and (initial between ? and ?) and (final between ? and ?)', 
                [auth.user.id, data.date_a, periodHour.initial1, periodHour.initial2, periodHour.final1, periodHour.final2])
            .orderBy('initial', 'cres')
            .with('place')
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
}

module.exports = FilterScheduleController
