'use strict'

const Campus = use('App/Models/Campus');

class UserLoggedController {
    async index ({ request, auth, response }) { 
            const user = await auth.getUser();
            const campus = await Campus.findOrFail(user.campus_id);

            const data = {
                user,
                campus
            }
            return data;

    }
}

module.exports = UserLoggedController
