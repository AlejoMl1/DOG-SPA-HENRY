const { Router } = require('express');

const router = Router();

router.get('/',(req,res)=>{
    res.send('route dogs')
})

// GET /dogs?name="...":
// Obtener un listado de las razas de perro que contengan la palabra ingresada como query parameter
// Si no existe ninguna raza de perro mostrar un mensaje adecuado



module.exports = router;