module.exports = async function retrieveDataUserReport(data, auth) {
    const Database = use('Database');
    const User = use('App/Models/User');

    const users = await User.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').fetch().then( (users) => users.toJSON());
    
    let dataReturn = [['Solicitante', 'Quantidade de vezes utilizada']];
            
    for (const user of users) {
        const response = await Database.select().from('schedules').whereRaw('(date between ? and ?) and requesting_user_id = ? and status like ?', [data.date_a, data.date_b, user.id, 'Confirmado']).count();
        dataReturn.push([user.fullname, response[0]['count(*)']]);
    }

    return dataReturn;
}