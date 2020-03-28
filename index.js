if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const STRTPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const  stripePublickey = process.env.STRIPE_PUBLIC_KEY;


//console.log(STRTPE_PUPLIC_KEY , STRTPE_SECRET_KEY);

const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const stripe = require('stripe')(STRTPE_SECRET_KEY)


app.use(express.static('views'));
app.set('view engine','ejs')



app.get('/store',(req,res)=>{

    fs.readFile('items.json',(erro,data)=>{
if(erro){
res.status(500).end()

}else{

res.render('store',{
  stripePublickey : stripePublickey,
    items: JSON.parse(data)
})



}


    })



});



app.post('/purchase',(req,res)=>{

fs.readFile('items.json',(erro,data)=>{

const itemsJson = JSON.parse(data)
const itemsArray = itemsJson.music.concat(itemsJson.merch)
let total = 0;
req.body.items.forEach(item => {
    const itemsJson = itemsArray.find((i)=>{

return i.id == item.id

    })
total = total + itemsJson.price * item.quantity
});
stripe.charges.create({

    amount:total,
    source:res.body.stripeTokenId,
    currency:'usd'
}).then(()=>{

console.log("ok charges");
res.json({message : "ok items"})


}).catch(()=>{

console.log('charges fail');
res.status(500).end()


})

})


})

app.listen(3000);