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
router.use('/temperament', temperamentRoutes)

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


router.get('/dogs',async (req,res)=>{
    const name = req.query.name   
    let allDogsName = await getAllDogs()
    if(name){
        let nameMatch = await allDogsName.filter(element =>{
            // return element.name.toLowerCase()=== name.toLowerCase()
            return element.name.toLowerCase().includes(name.toLowerCase()) 
        }
        )
        console.log(nameMatch.length);
        if (nameMatch.length){
            res.status(200).send(nameMatch)
        }else{
            console.log(nameMatch);
            res.status(404).send(`That breed doesnt exist,breed= ${name}`)
        }
        
    }else{
        res.status(200).send(allDogsName)
    }
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
