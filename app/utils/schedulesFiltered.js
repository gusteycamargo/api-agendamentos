module.exports = async function schedulesFiltered(date, hourInitial, hourFinal) {
    const Schedule = use('App/Models/Schedule');
    const definePeriod = use('App/utils/definePeriod');
    const defineSubPeriod = use('App/utils/defineSubPeriod');
    const defineClassHour = use('App/utils/defineClassHour');
    
    period = definePeriod(hourInitial, hourFinal);
    subPeriod = defineSubPeriod(hourInitial, hourFinal);
    const { classOne, classTwo } = defineClassHour(period, subPeriod);
    
    const schedulesData = await Schedule
        .query()
        .whereRaw('(initial between ? and ?) and (final between ? and ?) and date = ?',[classOne[0], classOne[1], classTwo[0], classTwo[1], date])
        .with('equipaments').with('place').fetch()
        .then( (ag) => ag.toJSON());

    return schedulesData;
}