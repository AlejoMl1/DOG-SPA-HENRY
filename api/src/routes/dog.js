const { Router } = require('express');
const router = Router();

router.get('/',(req,res)=>{
    res.send('route dog')
})

router.get('/otrodog',(req,res)=>{
    res.send('otro dog dog')
})


module.exports = router;