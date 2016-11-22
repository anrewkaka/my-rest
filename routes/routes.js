module.exports = function(app) {
    app.get("/token", function(request, response) {
        response.send("tinhte.vn");
    });
};