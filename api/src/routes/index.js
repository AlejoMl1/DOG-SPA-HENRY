const { Router } = require('express');
//import the differents routes
const dogRoutes = require('./dog')
const dogsRoutes = require('./dogs')
const temperamentRoutes = require('./temperaments')

const router = Router();
//told express to use especific routes 
router.use('/dog', dogRoutes)
router.use('/dogs', dogsRoutes)
router.use('/temperament', temperamentRoutes)

router.get('/',(req,res,next)=>{
    // res.send('prueba de home')
    try{
        throw new Error('rompo aproposito')
    }catch(error){
        next(error)
    }
})

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
