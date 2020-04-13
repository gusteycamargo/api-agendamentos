module.exports = async function retrieveDataToEmailConfirmation(equipaments, schedule) {
    const User = use('App/Models/User');
    const Equipament = use('App/Models/Equipament');
    const Place = use('App/Models/Place');
    const Course = use('App/Models/Course');
    const Category = use('App/Models/Category');
    const formatDate = use('App/utils/formatDate');

    const user = await User.findOrFail(schedule.registration_user_id);
    const place = await Place.findOrFail(schedule.place_id);
    const course = await Course.findOrFail(schedule.course_id);
    const category = await Category.findOrFail(schedule.category_id);
    const date = formatDate(schedule.date);
    const equipamentsName = [];

    for (const equipament of equipaments) {            
      let equip = await Equipament.findOrFail(equipament);
      equipamentsName.push(" "+equip.name);
    }

    return { user, place, course, category, equipamentsName, date };
}