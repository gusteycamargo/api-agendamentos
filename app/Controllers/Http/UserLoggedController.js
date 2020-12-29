'use strict'

const Campus = use('App/Models/Campus');

class UserLoggedController {
    async index ({ request, auth, response }) { 
            const user = await auth.getUser();
            const campus = await Campus.findOrFail(user.campus_id);

            const data = {
                user: {
                    id: user.id,
                    campus_id: user.campus_id,
                    fullname: user.fullname,
                    function: user.function
                },
                campus: {
                    id: campus.id,
                    city: campus.city
                }
            }
            return data;

    }
}

module.exports = UserLoggedController
