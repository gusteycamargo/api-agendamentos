module.exports = function dateIsAtTheLimit(date) {
    const dateIndex = new Date(date);    
    const todayDate = new Date();    
    const dateLimit = new Date();
    dateLimit.setDate(todayDate.getDate()+15);

    todayDate.setDate(todayDate.getDate() - 1);
    
    if ((dateIndex.getTime() < dateLimit.getTime()) && (dateIndex.getTime() > todayDate.getTime())) {
        return true;
    }
    else {
        return false;
    }
}