const express = require('express');
 
let router = express.Router();
let database = require('../config/db').database;

router.get('/',function(req,res){
   database.table('orders_details as od')
      .join([
          {
             table:'orders as o',
             on:'o.id = od.order_id'
          },
          {
              table:'products as p',
              on:'od.product_id = p.id'
          },
          {
              table:'users as u',
              on:'o.user_id = u.id'
          }
    ])
    .withFields([
        'o.id',
        'p.title as name',
        'p.description',
        'p.price',
        'u.username'
    ])
    .sort({'o.id':1})
    .getAll()
    .then(orders =>{
        if(orders.length >0){
            res.status(200).json({
                length:orders.length,
                orders:orders
            });
        }else{
            res.status(404).json({'message':'no order found'});
        }
    }).catch( err => console.log(err));
});
router.get('/:id',(req,res) => {
        const orderId = req.params.id;
        database.table('orders_details as od')
           .join([
               {
                  table:'orders as o',
                  on:'o.id = od.order_id'
               },
               {
                   table:'products as p',
                   on:'od.product_id = p.id'
               },
               {
                   table:'users as u',
                   on:'o.user_id = u.id'
               }
         ])
         .withFields([
             'o.id',
             'p.title as name',
             'od.quantity',
             'p.image',
             'p.description',
             'p.price',
             'u.username'
         ])
         .filter({'o.id':orderId})
         .sort({'o.id':1})
         .getAll()
         .then(orders =>{
             if(orders.length >0){
                 res.status(200).json({
                     length:orders.length,
                     orders:orders
                 });
             }else{
                 res.status(404).json({'message':`no order found with id ${orderId}`});
             }
         }).catch( err => console.log(err));
     });
     
router.post('/payment',(req,res)=>{
        setTimeout(()=>{
            res.status(200).json({'success':true});
        },100)
    });
router.post('/new',(req,res) =>{
    let {userId,products} = req.body;
    
    if(userId != 0 && userId > 0 && !isNaN(userId)){

        database.table('orders')
        .insert({
            user_id:userId
        })
        .then((newOrderId) => {
             if(newOrderId > 0){
             products.forEach(async p => {
                  let data = await database.table('products').filter({id:p.id}).withFields(['quantity']).get();

                  if(data.quantity > 0){
                      data.quantity = data.quantity - p.incart;
                      if(data.quantity < 0)
                           data.quantity = 0;
                  }else{
                      data.quantity = 0;
                  }
                  console.log(data);
                  database.table('orders_details')
                       .insert({
                           order_id:newOrderId,
                           product_id:p.id,
                           quantity:p.incart
                       }).then((newId) =>{
                             database.table('products').filter({id:p.id})
                             .update({
                                 quantity: data.quantity
                             }).then(()=>{
                                res.status(200).json({'order_id':newOrderId,'success':true,'message':'order added successfully','product':[
                                    { id:p.id,numIncart:p.incart}
                                ]});
                             }).catch((err)=> console.log(err));
                       }).catch((err) => console.log(err));
             });
            }else{
                res.status(500).json({'error':'cant not process new order'});
            }
        }).catch((error) => console.log(error));
    }
})



module.exports = router;