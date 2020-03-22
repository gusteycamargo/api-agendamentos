module.exports = async function retrieveDataPlaceReport(data, auth) {
    const Database = use('Database');
    const Place = use('App/Models/Place');

    const places = await Place.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').fetch().then( (places) => places.toJSON());
    
    let dataReturn = [['Sala', 'Quantidade de vezes utilizada']];
            
    for (const place of places) {
        const response = await Database.select().from('schedules').whereRaw('(date between ? and ?) and place_id = ? and status like ?', [data.date_a, data.date_b, place.id, 'Confirmado']).count();
        dataReturn.push([place.name, response[0]['count(*)']]);
    }

    return dataReturn;
}