// import fetch from "node-fetch";
// const fetch = require("node-fetch")
const axios = require ('axios');
const { Router } = require('express');
//import the differents routes
const dogRoutes = require('./dog')
const dogsRoutes = require('./dogs')
const temperamentRoutes = require('./temperaments')
const {Dogs,Temperaments} = require ('../db')

const router = Router();
//told express to use especific routes 
router.use('/dog', dogRoutes)
// router.use('/dogs', dogsRoutes)
// router.use('/temperament', temperamentRoutes)

router.get('/',async (req,res,next)=>{
    let allDogs = await getAllDogs();
    res.status(200).send(allDogs)
    // res.send('prueba de home')
    // try{
    //     throw new Error('rompo aproposito')
    // }catch(error){
    //     next(error)
    // }
})


const getApiInfo = async () =>{
    const apiUrl= await axios.get('https://api.thedogapi.com/v1/breeds')
    const apiInfo = await apiUrl.data.map(element => {
        return {
            id: element.id,
            name: element.name,
            temperament: element.temperament,
            life_span: element.life_span,
            height : element.height.metric,
            weight : element.weight.metric,
            image : {
                id: element.image.id,
                width: element.image.width,
                height: element.image.height,
                url: element.image.url
            }
        }
    })
    // console.log(apiInfo);
    return apiInfo;
}

const getDbInfo = async()=>{
    return await Dogs.findAll({
        include:{
            model: Temperaments,
            attributes:['name'],
            through:{
                attributes:[ ],
            },
        }
    })
}

const getAllDogs = async ()=>{
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
}

router.get('/dogs/:id',async (req,res)=>{
    const id = req.params.id;
    //this is the same
    // const {id} =req.params;
    // console.log(id);
    if(id){

        const allDogs = await getAllDogs();
        var requestDog = await allDogs.filter(element => {
            // console.log(element.id);
            return element.id == id
        });
        requestDog?
        res.status(200).send(requestDog):
        res.status(404).send('There is not Dog with that id')

    }

    

});

router.get('/dogs',async (req,res)=>{
    const name = req.query.name   
    let allDogsName = await getAllDogs()
    if(name){
        let nameMatch = await allDogsName.filter(element =>{

            // return element.name.toLowerCase()=== name.toLowerCase()
            return element.name.toLowerCase().includes(name.toLowerCase()) 
        }
        )
        // console.log(nameMatch.length);
        if (nameMatch.length){
            res.status(200).send(nameMatch)
        }else{
            console.log(nameMatch);
            res.status(404).send(`${name} not found!`)
        }
        
    }else{
        res.status(200).send(allDogsName)
    }
})


router.get('/temperament',async (req,res)=>{
    let allDogs = await getAllDogs()
    let all_temperaments =[];
    allDogs.forEach(element => {
        //*transform the string into an array
        
        if (element.temperament !== undefined && element.temperament.length>0  ){
            var individual_temperament = element.temperament.split(', ');
            if (individual_temperament.length>0){
                // console.log(individual_temperament);
                individual_temperament.forEach(temp =>{
                    if (all_temperaments.indexOf(temp)<0){
                        all_temperaments.push(temp)
                    }
                })
            }
            
        }
    });
    if (all_temperaments.length>0){
        all_temperaments.forEach(element => {
            // console.log(element);
            Temperaments.findOrCreate({
                 where:{name:element}
            })
        });
        
    }
    //return the data that is save in the DB
    const allTemperamentsDB = await Temperaments.findAll();
    res.status(200).send(allTemperamentsDB)
}
)

// Nombre
// Altura (Diferenciar entre altura mínima y máxima)
// Peso (Diferenciar entre peso mínimo y máximo)
// Años de vida
router.post('/dog',async (req,res)=>{
    const { name,minHeight,maxHeight,minWeight,maxWeight,life_span,image_url,temperament} = req.body;
    
    let heightPost = minHeight +'-'+maxHeight;
    console.log(minHeight);
    console.log(heightPost);
    let weightPost = minWeight + maxWeight;
    let dogCreated = await Dogs.create({
        name,
        height: heightPost,
        weight: weightPost,
        life_span ,
        image_url
    })
    //return all the temperaments that match with the ones the post give us
    let temperamentsDB = await Temperaments.findAll({
        where: {name:temperament}
    })
    
    dogCreated.addTemperaments(temperamentsDB)
    res.send('New Dog created')

})


    // fetch('https://api.thedogapi.com/v1/breeds')
    // .then(r => r.json())
    // .then((data) => {
    // if(data ){
    //     let breeds = [];
    //     data.map(element => breeds.push(
    //         {
    //             id: element.id,
    //             name: element.name,
    //             temperament: element.temperament,
    //             life_span: element.life_span,
    //             height : element.height.metric,
    //             weight : element.weight.metric,
    //             image : {
    //                 id: element.image.id,
    //                 width: element.image.width,
    //                 height: element.image.height,
    //                 url: element.image.url
    //             }
    //         }
    //     ))

    // breeds.forEach(element => {
    //     if(element.temperament != undefined) {
    //         element.temperament= element.temperament.split(',');
    //     }
        
    // })
    // console.log(breeds.length);
    // } else {
    //     alert("Something went wrong loading the breeds in fecth");
    // }
    // });


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
