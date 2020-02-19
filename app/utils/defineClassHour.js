module.exports = function definePeriod(period, subPeriod) {
    let ret = {}; 
    let classOne = [], classTwo = [];

    if(period == 1) {
        if(subPeriod == 1) {
            classOne = ['08:00:00', '09:00:00'];
            classTwo = ['10:00:00', '12:00:00'];
        }
        else if(subPeriod == 2) {
            classOne = ['08:00:00', '10:00:00'];
            classTwo = ['10:00:00', '12:00:00'];
        }
        else if(subPeriod == 3) {
            classOne = ['09:00:00', '10:00:00'];
            classTwo = ['11:00:00', '12:00:00'];
        }
        
    }
    else if(period == 2) {
        if(subPeriod == 1) {
            classOne = ['12:00:00', '14:00:00'];
            classTwo = ['13:00:00', '19:00:00'];
        }
        else if(subPeriod == 2) {
            classOne = ['12:00:00', '17:00:00'];
            classTwo = ['15:00:00', '19:00:00'];
        }
        else if(subPeriod == 3) {
            classOne = ['15:00:00', '17:00:00'];
            classTwo = ['16:00:00', '19:00:00'];
        }
        
    }
    else if(period == 3) {
        if(subPeriod == 1) {
            classOne = ['17:00:00', '19:00:00'];
            classTwo = ['19:00:00', '23:00:00'];
        }
        else if(subPeriod == 2) {
            classOne = ['17:00:00', '21:00:00'];
            classTwo = ['20:00:00', '23:00:00'];
        }
        else if(subPeriod == 3) {
            classOne = ['17:00:00', '21:00:00'];
            classTwo = ['21:00:00', '23:00:00'];
        }
    }   

    return {
        classOne,
        classTwo
    };
}