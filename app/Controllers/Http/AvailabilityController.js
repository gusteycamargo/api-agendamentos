'use strict'

const availableEquipaments = use('App/utils/availableEquipaments');
const availablePlaces = use('App/utils/availablePlaces');
const schedulesFiltered = use('App/utils/schedulesFiltered');

class AvailabilityController {
    async index ({ request, response }) {
        const data = request.headers();
        const hourInitial = data.initial.split(":");
        const hourFinal = data.final.split(":");
        
        const schedulesData = await schedulesFiltered(data.date_a, hourInitial, hourFinal);

        if(schedulesData.error) {
            return response.status(418).send('Horário inválido');
        }

        const avaibilityEquipaments = await availableEquipaments(schedulesData);
        const avaibilityPlaces = await availablePlaces(schedulesData);

        return {
            avaibilityEquipaments,
            avaibilityPlaces
        };
    }
}

module.exports = AvailabilityController
