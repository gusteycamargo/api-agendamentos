module.exports = async function availablePlaces(schedulesData) {
    const Place = use('App/Models/Place');
    const allPlaces = await Place.all().then( (places) => places.toJSON());

    const activePlaces = allPlaces.filter((elem) => {
        return elem.status === 'Ativo';
    });

    const placesInUse = [];
    //OBTEM LISTA DE SALAS EM USO
    for (let i = 0; i < schedulesData.length; i++) {
        for (let j = 0; j < activePlaces.length; j++) {
            if(schedulesData[i].place.id === activePlaces[j].id) {    
                placesInUse.push(activePlaces[j]);
            }          
        }
    }

    const avaibilityPlaces = activePlaces.filter((place) => {
        return !placesInUse.includes(place);
    });

    return avaibilityPlaces;
}