module.exports = async function availableEquipaments(schedulesData, auth) {
    const Equipament = use('App/Models/Equipament');
    const allEquipaments = await Equipament.query().whereRaw("campus_id = ?", [auth.user.campus_id]).fetch().then( (equipaments) => equipaments.toJSON());

    const activeEquipaments = allEquipaments.filter((elem) => {
        return elem.status === 'Ativo';
    });

    const equipamentsInUse = [];
    //OBTEM LISTA DE EQUIPAMENTOS EM USO
    for (let i = 0; i < schedulesData.length; i++) {
        for (let j = 0; j < schedulesData[i].equipaments.length; j++) {
            for (let k = 0; k < activeEquipaments.length; k++) {
                if(schedulesData[i].equipaments[j].id === activeEquipaments[k].id) {    
                    equipamentsInUse.push(activeEquipaments[k]);
                }  
            }           
        }
    }

    const avaibilityEquipaments = activeEquipaments.filter((equipament) => {
        return !equipamentsInUse.includes(equipament);
    });

    return avaibilityEquipaments;
}