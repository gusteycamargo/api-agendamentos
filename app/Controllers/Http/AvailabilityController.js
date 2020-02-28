'use strict'

const availableEquipaments = use('App/utils/availableEquipaments');
const availablePlaces = use('App/utils/availablePlaces');
const schedulesFiltered = use('App/utils/schedulesFiltered');

class AvailabilityController {
    async index ({ request }) {
        const data = request.headers();
        const hourInitial = data.initial.split(":");
        const hourFinal = data.final.split(":");
        
        const schedulesData = await schedulesFiltered(data.date_a, hourInitial, hourFinal);
        const avaibilityEquipaments = await availableEquipaments(schedulesData);
        const avaibilityPlaces = await availablePlaces(schedulesData);

        return {
            avaibilityEquipaments,
            avaibilityPlaces
        };
    }
}

module.exports = AvailabilityController
