module.exports = function definePeriod(hourInitial, hourFinal) {
    let subPeriod = 0;

    if (((hourInitial[0] >= 17) && (hourInitial[0] <= 19) && (hourFinal[0] >= 19) && (hourFinal[0] <= 20))
            || ((hourInitial[0] >= 12) && (hourInitial[0] <= 14) && (hourFinal[0] >= 13) && (hourFinal[0] <= 15))
            || ((hourInitial[0] >= 8) && (hourInitial[0] <= 9) && (hourFinal[0] >= 10) && (hourFinal[0] <= 11))) {
        subPeriod = 1;
    }
    else if ((hourInitial[0] >= 17) && (hourInitial[0] <= 19) && (hourFinal[0] >= 21) && (hourFinal[0] <= 22)
            || ((hourInitial[0] >= 12) && (hourInitial[0] <= 14) && (hourFinal[0] >= 16) && (hourFinal[0] <= 19))
            || ((hourInitial[0] >= 8) && (hourInitial[0] <= 9) && (hourFinal[0] >= 11) && (hourFinal[0] <= 12))) {

        subPeriod = 2;

    }
    else if ((hourInitial[0] >= 20) && (hourInitial[0] <= 21) && (hourFinal[0] >= 21) && (hourFinal[0] <= 22)
            || ((hourInitial[0] >= 15) && (hourInitial[0] <= 17) && (hourFinal[0] >= 15) && (hourFinal[0] <= 19))
            || ((hourInitial[0] >= 9) && (hourInitial[0] <= 10) && (hourFinal[0] >= 10) && (hourFinal[0] <= 12))) {
        subPeriod = 3;
    }

    return subPeriod;
}