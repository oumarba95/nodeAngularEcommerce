const express = require('express');
let router = express.Router();
let database = require('../config/db').database;

router.get('/',function(req,res){
    let page = (req.query.page !== undefined && req.query.page != 0 ) ? req.query.page : 1;
    let limit = (req.query.limit !== undefined && req.query.limit != 0 ) ? req.query.limit : 10;
    let startValue;
    let endValue;

    if( page > 0){
        startValue = (page * limit) - limit;
        endValue = page * limit;
    }else{
        startValue = 0;
        endValue = 10;
    }

    database.table('products as p')
         .join([{
             table:'categories as c',
             on: 'c.id = p.cat_id'
         }])
         .withFields(['c.title as category',
           'p.title as name',
           'p.description',
           'p.price',
           'p.quantity',
           'p.image',
           'p.id'
        ])
      //  .slice(startValue,endValue)
        .sort({id:.1})
        .getAll()
        .then(prods =>{
            if(prods.length > 0){
                res.status(200).json({
                    products: prods
                });
            }else{
                res.status(404).json({'message':'no products found'});
            }
        })
        .catch(err => console.log(err))

});

router.get('/:id',function(req,res){
   let prodId = req.params.id;

   database.table('products as p')
      .join([{
          table:'categories as c',
          on:'p.cat_id = c.id'
      }])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.description',
        'p.quantity',
        'p.image',
        'p.images',
        'p.id'
    ])
    .filter({'p.id':prodId})
    .get()
    .then(prod => {
        if(prod){
            res.status(200).json(prod);
        }else{
            res.status(404).json({'message':'product not found'});
        }
    })
    .catch(err => console.log(err));
});
router.get('/category/:catName',function(req,res){
    let page = (req.query.page !== undefined && req.query.page != 0 ) ? req.query.page : 1;
    let limit = (req.query.limit !== undefined && req.query.limit != 0 ) ? req.query.limit : 10;
    let startValue;
    let endValue;

    if( page > 0){
        startValue = (page * limit) - limit;
        endValue = page * limit;
    }else{
        startValue = 0;
        endValue = 10;
    }
    const cat_title = req.params.catName;
    database.table('products as p')
         .join([{
             table:'categories as c',
             on: `c.id = p.cat_id where c.title LIKE '%${cat_title}%'`
         }])
         .withFields(['c.title as category',
           'p.title as name',
           'p.price',
           'p.description',
           'p.quantity',
           'p.image',
           'p.id'
        ])
        .slice(startValue,endValue)
        .sort({id:.1})
        .getAll()
        .then(prods =>{
            if(prods.length > 0){
                res.status(200).json({
                    length:prods.length,
                    products: prods
                });
            }else{
                res.status(404).json({'message':`no products found with category ${cat_title}`});
            }
        })
        .catch(err => console.log(err))

});
module.exports = router