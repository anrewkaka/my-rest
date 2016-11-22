var hat = require("hat");

module.exports = function(app) {
    app.post('/token', function(request, response) {
        console.log(request);
        response.send(request.body.user_name + "_" + hat());
    });
};