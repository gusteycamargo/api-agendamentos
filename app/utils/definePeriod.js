module.exports = function definePeriod(hourInitial, hourFinal) {
    let period = 0;

    if ((hourInitial[0] >= 8 && hourInitial[0] <= 12) && (hourFinal[0] >= 8 && hourFinal[0] <= 12)) {
        period = 1;
    } else if ((hourInitial[0] >= 13 && hourInitial[0] <= 17) && (hourFinal[0] >= 13 && hourFinal[0] <= 19)) {
        period = 2;
    } else if ((hourInitial[0] >= 17 && hourInitial[0] <= 22) && (hourFinal[0] >= 19 && hourFinal[0] <= 22)) {
        period = 3;
    }

    return period;
}