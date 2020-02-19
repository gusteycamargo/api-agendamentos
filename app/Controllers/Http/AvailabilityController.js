'use strict'

const Database = use('Database');
const Schedule = use('App/Models/Schedule');

class AvailabilityController {
    async index ({ auth, request, response, view }) {

        const data = request.only(['initial', 'final', 'date']);
        const hourInitial = data.initial.split(":");
        const hourFinal = data.final.split(":");
        //const data1 = Database.raw('select * from schedules where (initial between ? and ?) and (final between ? and ?) and date = ?', ["17:00:00", "19:00:00", "19:00:00", "23:00:00", data.date]);
        // const userdata = await Database
        //     .table('schedules')
        //     .whereRaw('(initial between ? and ?) and (final between ? and ?) and date = ?',['20:00:00', '21:00:00', '20:00:00', '23:00:00', data.date]);
        // return userdata;


        const userdata = await Schedule
            .query()
            .whereRaw('(initial between ? and ?) and (final between ? and ?) and date = ?',['17:00:00', '19:00:00', '19:00:00', '23:00:00', data.date]).with('equipaments').fetch();
        //userdata.load('equipaments');
        return userdata;



        //const obj = JSON.parse(data);
        //console.log(obj);
        //const initialHour = data.initial.getHour();
        //console.log(JSON.parse(data));

        // if ((horaInicio >= 8 && horaInicio <= 12) && (horaFim >= 8 && horaFim <= 12)) {
        //     horario = 1;
        // } else if ((horaInicio >= 13 && horaInicio <= 17) && (horaFim >= 13 && horaFim <= 19)) {
        //     horario = 2;
        // } else if ((horaInicio >= 17 && horaInicio <= 22) && (horaFim >= 19 && horaFim <= 22)) {
        //     horario = 3;
        // }

        //     const username = 'gustaacamargo';
        //     const horaInicio = "19:00:00";
        //     const horaI = 
        //     const data = Database.raw('call verificarAgendamentoDia (horaInicio Time, horaI Time, horaFim Time, horaF Time, dataP date)', [username]);
        //     return data;
            //AQUI TRAZER OS DADOS DA SALA E CRIAR OUTRO CONTROLLER PARA O EQUIPAMENTO, OU RETORNAR AS DUAS LISTAS JUNTAS
            //COLOCAR OS DOIS ARRAYS DENTRO DE UM OBJETO
            // {
            //     equipaments: [array de equipamentos],
            //     places: [array de salas],
            // }
        
    }
}

module.exports = AvailabilityController
