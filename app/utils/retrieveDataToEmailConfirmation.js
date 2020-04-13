module.exports = async function retrieveDataToEmailConfirmation(equipaments, schedule) {
    const User = use('App/Models/User');
    const Equipament = use('App/Models/Equipament');
    const Place = use('App/Models/Place');
    const Course = use('App/Models/Course');
    const Category = use('App/Models/Category');
    const formatDate = use('App/utils/formatDate');

    const addressee = await User.findOrFail(schedule.requesting_user_id);
    const user = await User.findOrFail(schedule.registration_user_id);
    const place = await Place.findOrFail(schedule.place_id);
    const course = await Course.findOrFail(schedule.course_id);
    const category = await Category.findOrFail(schedule.category_id);
    const date = formatDate(schedule.date);
    let equipamentsName = [];
    
    if(equipaments.length > 0) {
      for (const equipament of equipaments) {            
        let equip = await Equipament.findOrFail(equipament);
        equipamentsName.push(" "+equip.name);
      }
    }
    else {
      equipamentsName = "Sem equipamentos";
    }

    return { user, place, course, category, equipamentsName, date, addressee };
}