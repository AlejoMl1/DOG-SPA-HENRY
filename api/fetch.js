import fetch from "node-fetch";
// const fetch = require("node-fetch");
// npm install node-fetch
fetch('https://api.thedogapi.com/v1/breeds')
    .then(r => r.json())
    .then((data) => {
    if(data ){
        let breeds = [];
        data.map(element => breeds.push(
            {
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
        ))

       breeds.forEach(element => {
        if(element.temperament != undefined) {
            element.temperament= element.temperament.split(',');
        }
        
       })
       console.log(breeds.length);
    } else {
        alert("Something went wrong loading the breeds in fecth");
    }
    });
