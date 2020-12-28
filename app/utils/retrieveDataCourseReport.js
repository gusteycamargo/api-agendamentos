module.exports = async function retrieveDataCourseReport(data, auth) {
    const Database = use('Database');
    const Course = use('App/Models/Course');

    const courses = await Course.query().whereRaw("campus_id = ?", [auth.user.campus_id]).with('campus').fetch().then( (courses) => courses.toJSON());
    
    let dataReturn = [['Cursos', 'Quantidade de vezes utilizada']];
            
    for (const course of courses) {
        const response = await Database.select().from('schedules').whereRaw('(date between ? and ?) and course_id = ? and status like ?', [data.date_a, data.date_b, course.id, 'Confirmado']).count();
        dataReturn.push([course.name, response[0]['count(*)']]);
    }

    return dataReturn;
}