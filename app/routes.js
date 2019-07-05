var Token = require('./models/token');
var User = require('./models/user');


module.exports = function(app, passport) {
	


  app.get('/api/test', function(req, res) {
    return res.json({message: 'Connected Successfully!'});
  });

  app.post('/api/signup', function(req, res) {
    passport.authenticate('local-signup', function(err, user, info) {

       
        if (err) {  
          return next(err); 
        }

        if (!user) {  
          return res.json({
            'status' : 'error',
            'message' : info.message
          }); 
        }
        else {  

          
          var token = Math.round((Math.pow(36, 32 + 1) - Math.random() * Math.pow(36, 32))).toString(36).slice(1);

          Token.create({
            user_id: user.id,
            token: token,
          }, function(err, tokenRes) {
            if (err)
                res.send(err);

            return res.json({
              'status' : 'success',
              'userid' : user.id,
              'token' : token,
            });
          });
        }
      })(req, res);
  });

  app.post('/api/login', function(req, res) {
  	passport.authenticate('local-login', function(err, user, info) {

        if (err) {  
          return next(err); 
        }

        if (!user) {  
          return res.json({
            'status' : 'error',
            'message' : info.message
          }); 
        }
        else {  


          var token = Math.round((Math.pow(36, 32 + 1) - Math.random() * Math.pow(36, 32))).toString(36).slice(1);

          Token.create({
            user_id: user.id,
            token: token,
          }, function(err, tokenRes) {
            if (err)
                res.send(err);

            return res.json({
              'status' : 'success',
              'userid' : user.id,
              'token' : token,
            });
          });
        }
      })(req, res);
  });

  app.post('/api/checklogin', function(req, res) {

      if (!req.param('user_id') || !req.param('token')) {
          
          return res.json({ status: 'error'});
      }

      Token.find({
        user_id: req.param('user_id'),
        token: req.param('token'),
      }, function(err, tokenRes) {
        if (err)
            return res.json(err);

        if (!tokenRes || tokenRes.length <= 0) {
            return res.json({ status: 'error'});
        }

        return res.json({ status: 'success'});
      });
  });
};

function isLoggedIn(req, res, next) {

   
    if (req.body.user_id && req.body.token) {
        Token.find({
          user_id: req.body.user_id,
          token: req.body.token,
        }, function(err, tokenRes) {
          if (err)
              res.send({ status: 'error', message: "why aren't you logged in?"});

        
          if (!tokenRes) {
              res.send({ status: 'error', message: "why aren't you logged in?"});
          }

       
          return next();
        });
    }
    else {
      res.send({ status: 'error', message: "why aren't you logged in?"});
    }
}