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
        response.cookie('token', token, {
          httpOnly: true,
          sameSite: 'Lax'
        })
        return token;
      }
      
    }

    async destroy({ response }) {
      response.clearCookie('token')

      return response.status(200).send('logout ok');
    }
}

module.exports = SessionController
