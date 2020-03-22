'use strict'

const retrieveDataCategoryReport = use('App/utils/retrieveDataCategoryReport');
const retrieveDataCourseReport = use('App/utils/retrieveDataCourseReport');
const retrieveDataEquipamentReport = use('App/utils/retrieveDataEquipamentReport');
const retrieveDataPlaceReport = use('App/utils/retrieveDataPlaceReport');
const retrieveDataUserReport = use('App/utils/retrieveDataUserReport');

class ReportController {
    async index ({ auth, request, response, view }) {
        if(auth.user.function === 'adm') {
            const data = request.headers();

            let dataReturn;
            if(data.type_chart === 'category'){
                dataReturn = retrieveDataCategoryReport(data, auth);
            }
            else if(data.type_chart === 'course'){
                dataReturn = retrieveDataCourseReport(data, auth);
            }
            else if(data.type_chart === 'equipament'){
                dataReturn = retrieveDataEquipamentReport(data, auth);
            }
            else if(data.type_chart === 'place'){
                dataReturn = retrieveDataPlaceReport(data, auth);
            }
            else if(data.type_chart === 'requesting_user'){
                dataReturn = retrieveDataUserReport(data, auth);
            }

            return dataReturn;
        }
        else {
            return response.status(403).send('Área não autorizada');
        } 
        
        // const schedulesData = await schedulesFiltered(data.date_a, hourInitial, hourFinal, data.status);

        // if(schedulesData.error) {
        //     return response.status(418).send('Horário inválido');
        // }

        // const avaibilityEquipaments = await availableEquipaments(schedulesData, auth);
        // const avaibilityPlaces = await availablePlaces(schedulesData, auth);

        // return {
        //     avaibilityEquipaments,
        //     avaibilityPlaces
        // };
    }
}

module.exports = ReportController
