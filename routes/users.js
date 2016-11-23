var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

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
        var password = req.body.password;
        var lastName = req.body.last_name;
        var fistName = req.body.fist_name;
        //insert user to Monogo
        mongoose.model('user').create({
                user_name : userName,
                password : password,
                last_name : lastName,
                fist_name : firstName,
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
                    res.send('success');
                }
        });
    });

module.exports = router;