var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    crypto = require('crypto'),
    hat = require('hat');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.route('/')
    //GET all users
    .get(function(req, res, next) {
        //retrieve all user from Monogo
        mongoose.model('user').find({}, function (err, users) {
              if (err) {
                  return console.error(err);
              } else {
                  res.send(users);
              }     
        });
    })

    //POST user
    .post(function(req, res){
        var userName = req.body.user_name;
        var lastName = req.body.last_name;
        var firstName = req.body.first_name;
        var token = hat();

        //encode password
        var md5sum = crypto.createHash('md5');
        md5sum.update(token + req.body.password);
        var password = md5sum.digest('hex');

        //insert user to Monogo
        mongoose.model('user').create({
                user_name : userName,
                password : password,
                token : token,
                last_name : lastName,
                first_name : firstName,
                created_date : new Date(),
                created_user : 'admin',
                updated_date : new Date(),
                updated_user : 'admin'
            }, function (err, user) {
                if (err) {
                    return console.error(err);
                } else {
                    //User has been created
                    console.log('POST creating new user: ' + user);
                    res.format({
                        json: function(){
                            res.json({
                                message : 'this is your access token, please keep it private',
                                token : token
                            });
                        }
                    });
                }
        });
    });

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('user').findById(id, function (err, user) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
    //Delete user by ObjectId
    .delete(function(req, res){
        console.log(req.id);
        //delete user
        mongoose.model('user').findById(req.id, function (err, user) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                user.remove(function (err, user) {
                    if (err) {
                        return console.error(err);
                    } else {
                        //Returning success messages saying it was deleted
                        console.log('DELETE removing ID: ' + user._id);
                        res.send('delete success');
                    }
                });
            }
        });
    });

module.exports = router;