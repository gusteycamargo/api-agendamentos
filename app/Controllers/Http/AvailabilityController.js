'use strict'

const availableEquipaments = use('App/utils/availableEquipaments');
const availablePlaces = use('App/utils/availablePlaces');
const schedulesFiltered = use('App/utils/schedulesFiltered');

class AvailabilityController {
    async index ({ request, response, auth }) {
        const data = request.headers();
        const hourInitial = data.initial.split(":");
        const hourFinal = data.final.split(":");
        
        const schedulesData = await schedulesFiltered(data.date_a, hourInitial, hourFinal, data.status);

        if(schedulesData.error) {
            return response.status(418).send('Horário inválido');
        }

        const avaibilityEquipaments = await availableEquipaments(schedulesData, auth);
        const avaibilityPlaces = await availablePlaces(schedulesData, auth);

        return {
            avaibilityEquipaments,
            avaibilityPlaces
        };
    }
}

module.exports = AvailabilityController
