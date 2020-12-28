module.exports = async function retrieveDataCategoryReport(data, auth) {
    const Database = use('Database');
    const Category = use('App/Models/Category');

    const categories = await Category.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').fetch().then( (categories) => categories.toJSON());
    
    let dataReturn = [['Cursos', 'Quantidade de vezes utilizada']];
            
    for (const category of categories) {
        const response = await Database.select().from('schedules').whereRaw('(date between ? and ?) and category_id = ? and status like ?', [data.date_a, data.date_b, category.id, 'Confirmado']).count();
        dataReturn.push([category.description, response[0]['count(*)']]);
    }

    return dataReturn;
}