var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST;
    gpio = require('pi-gpio');

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
router.param('pin', function(req, res, next, pin) {
    req.pin = pin;
    next();
});

router.param('value', function(req, res, next, value) {
    req.value = value;
    next();
});

router.route('/:pin')
    .get(function(req, res){
        var pin = req.pin;
        console.log('get ' + pin);

        res.status(200);
        res.send('Pin ' + pin + ' : ' + gpio.read(pin));
    });

router.route('/:pin/close')
    .get(function(req, res){
        var pin = req.pin;
        console.log('close ' + pin);
        gpio.close(pin);

        res.status(200);
        res.send('ok');
    });

router.route('/:pin/open')
    .get(function(req, res){
        var pin = req.pin;
        console.log('open ' + pin);
        gpio.open(pin, 'out');

        res.status(200);
        res.send('ok');
    });

router.route('/:pin/:value')
    .get(function(req, res){
        var pin = req.pin;
        var value = req.value;
        console.log(pin + ' => ' + value);
 
        gpio.open(pin, "output", function(err) { 
            gpio.write(pin, value, function() { 
                gpio.close(pin); 
            });
        });

        res.status(200);
        res.send('ok');
    });

module.exports = router;