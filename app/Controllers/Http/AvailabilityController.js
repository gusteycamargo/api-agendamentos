'use strict'

const Database = use('Database');

class AvailabilityController {
    async index ({ auth, request, response, view }) {
            const username = 'gustaacamargo';
            const data = Database.raw('call selecionarPorNomeDeUsuario (?)', [username]);
            return data;
            //AQUI TRAZER OS DADOS DA SALA E CRIAR OUTRO CONTROLLER PARA O EQUIPAMENTO, OU RETORNAR AS DUAS LISTAS JUNTAS
            //COLOCAR OS DOIS ARRAYS DENTRO DE UM OBJETO
            // {
            //     equipaments: [array de equipamentos],
            //     places: [array de salas],
            // }
        
    }
}

module.exports = AvailabilityController
