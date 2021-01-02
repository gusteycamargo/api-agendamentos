'use strict'

const User = use('App/Models/User');

class SessionController {
    async create ({ request, auth, response }) { 
      const { username, password } = request.all();
      const user = await User.findByOrFail('username', username);

      if(user.status === 'Inativo') {
        return response.status(401).send('Usuário inexistente');
      }
      else {
        const token = await auth.attempt(username, password);
        return token;
      }
      
    }
}

module.exports = SessionController
