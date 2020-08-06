const express = require('express');

const router = express.Router();

const database = require('../config/db').database;

router.get('/',(req,res)=>{
   database.table('categories')
   .getAll()
   .then(data =>{
      if(data.length > 0)
           res.status(200).json(data);
      else
        res.status(401).json({'error':'no gategoiers found'});
}).catch(error =>{
    console.log(error);
});
});

module.exports = router;