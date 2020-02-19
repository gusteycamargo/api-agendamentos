'use strict'

const Database = use('Database');
const Schedule = use('App/Models/Schedule');
const Equipament = use('App/Models/Equipament');
const Place = use('App/Models/Place');
const definePeriod = use('App/utils/definePeriod');
const defineSubPeriod = use('App/utils/defineSubPeriod');
const defineClassHour = use('App/utils/defineClassHour');

class AvailabilityController {
    async index ({ auth, request, response, view }) {

        const data = request.only(['initial', 'final', 'date']);
        const hourInitial = data.initial.split(":");
        const hourFinal = data.final.split(":");
        let period = 0, subPeriod = 0;

        period = definePeriod(hourInitial, hourFinal);
        subPeriod = defineSubPeriod(hourInitial, hourFinal);
        const { classOne, classTwo } = defineClassHour(period, subPeriod);
        
        const schedulesData = await Schedule
            .query()
            .whereRaw('(initial between ? and ?) and (final between ? and ?) and date = ?',[classOne[0], classOne[1], classTwo[0], classTwo[1], data.date])
            .with('equipaments').with('place').fetch()
            .then( (ag) => ag.toJSON());


        const allEquipaments = await Equipament.all().then( (equipaments) => equipaments.toJSON());
        const allPlaces = await Place.all().then( (places) => places.toJSON());

        const activeEquipaments = allEquipaments.filter((elem) => {
            return elem.status === 'Ativo';
        });

        const activePlaces = allPlaces.filter((elem) => {
            return elem.status === 'Ativo';
        });

        const equipamentsInUse = [];
        //OBTEM LISTA DE EQUIPAMENTOS EM USO
        for (let i = 0; i < schedulesData.length; i++) {
            for (let j = 0; j < schedulesData[i].equipaments.length; j++) {
                for (let k = 0; k < activeEquipaments.length; k++) {
                    if(schedulesData[i].equipaments[j].id === activeEquipaments[k].id) {    
                        equipamentsInUse.push(activeEquipaments[k]);
                    }  
                }           
            }
        }

        const placesInUse = [];
        //OBTEM LISTA DE SALAS EM USO
        for (let i = 0; i < schedulesData.length; i++) {
            for (let j = 0; j < activePlaces.length; j++) {
                if(schedulesData[i].place.id === activePlaces[j].id) {    
                    placesInUse.push(activePlaces[j]);
                }          
            }
        }
        const avaibilityEquipaments = activeEquipaments.filter((equipament) => {
            return !equipamentsInUse.includes(equipament);
        });

        const avaibilityPlaces = activePlaces.filter((place) => {
            return !placesInUse.includes(place);
        });

        return {
            avaibilityEquipaments,
            avaibilityPlaces
        };
    }
}

module.exports = AvailabilityController
