var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST;


var gpio = require('rpi-gpio');

var MOTOR1A = 4;
var MOTOR1B = 17;

gpio.setup(MOTOR1A, gpio.DIR_OUT);
gpio.write(MOTOR1A, true);

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

// route middleware to validate :direction
router.param('direction', function(req, res, next, direction) {
    req.direction = direction;
    next();
});

router.route('/direction/:direction')
    .get(function(req, res){
        console.log(req.direction);
 
        /*if (res.direction == 'top') {
            gpio.write(4, true);
            gpio.write(17, false);
        } else if (res.direction == 'bottom') {
            gpio.write(4, false);
            gpio.write(17, true);
        }*/

        res.status(200);
        res.send('ok');
    });

module.exports = router;