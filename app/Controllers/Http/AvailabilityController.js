'use strict'

const availableEquipaments = use('App/utils/availableEquipaments');
const availablePlaces = use('App/utils/availablePlaces');
const schedulesFiltered = use('App/utils/schedulesFiltered');
const dateIsAtTheLimit = use('App/utils/dateIsAtTheLimit');

class AvailabilityController {
    async index ({ request, response, auth }) {
        const data = request.headers();
        const hourInitial = data.initial.split(":");
        const hourFinal = data.final.split(":");                

        if(dateIsAtTheLimit(data.date_a) || auth.user.function === 'adm') {            
            const schedulesData = await schedulesFiltered(data.date_a, hourInitial, hourFinal, data.status);

            if(schedulesData.error) {
                return response.status(418).send({ error: "Os horários inseridos são inválidos" });
            }

            const avaibilityEquipaments = await availableEquipaments(schedulesData, auth);
            const avaibilityPlaces = await availablePlaces(schedulesData, auth);

            return {
                avaibilityEquipaments,
                avaibilityPlaces
            };
        }
        else {            
            return response.status(400).send({ error: "A data inserida não está dentro dos 15 dias limite" });
        }
    }
}

module.exports = AvailabilityController
