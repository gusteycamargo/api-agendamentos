module.exports = async function retrieveDataEquipamentReport(data, auth) {
    const Database = use('Database');
    const Equipament = use('App/Models/Equipament');

    const equipaments = await Equipament.query().whereRaw("campus_id = ?", [auth.user.campus_id]).fetch().then( (equipaments) => equipaments.toJSON());
    
    let dataReturn = [['Equipamentos', 'Quantidade de vezes utilizada']];
            
    const schedules = await Database.select().from('schedules').whereRaw('(date between ? and ?) and status like ?', [data.date_a, data.date_b, 'Confirmado']);

    for (const equipament of equipaments) {
        let used = 0;
        for (const schedule of schedules) {            
            const response = await Database.select().from('equipament_schedule').whereRaw('equipament_id = ? and schedule_id = ?', [equipament.id, schedule.id]).count();
            
            used += response[0]['count(*)'];            
        }
        dataReturn.push([equipament.name, used]);
    }

    return dataReturn;
}