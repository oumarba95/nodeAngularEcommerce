const mysqli = require('mysqli');

let conn = new mysqli({
    host:'localhost',
    post:3306,
    user:'root',
    passwd:'',
    db:'megashop'
});

let db = conn.emit(false,'');

module.exports = {
    database:db
}