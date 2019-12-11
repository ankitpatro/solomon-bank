var app = require('express').Router();
var bodyparser = require('body-parser')
var multer = require('multer');
var upload = multer({
    dest: 'images/movies/'
});
var Movie = require('../model/movie');
var Ssn= require('../model/ssn');

app.post('/', upload.single('poster'), function(req, res) {
    var movie = new Movie({
        title: req.body.title,
        release_date: req.body.release_date,
        poster: req.file,
        director: req.body.director,
        runtime: req.body.runtime,
        plot: req.body.plot,
        actors: req.body.actors
    });
    movie.save(function(err, data) {
        if (err) {
            res.send({
                status: false,
                error: err
            });
        } else {
            res.send({
                status: true,
                data: data
            });
        }

    });
});

app.post('/ssn', upload.single('photo'), function(req, res) {
    var ssno = new Ssn({
        email: req.body.email,
        name: req.body.name,
        photo: req.file,
        motherMaidenName: req.body.motherMaidenName,
        fathersName: req.body.fathersName,
        address: req.body.address,
        maritalStatus: req.body.maritalStatus,
        dob: req.body.dob,
        mobileNumber: req.body.mobileNumber,
        ssn: req.body.ssn
  });
  ssno.save(function(err, data) {
        if (err) {
            res.send({
                status: false,
                error: err
            });
        } else {
            res.send({
                status: true,
                data: data
            });
        }

    });
});

app.post('/ssnValidate', upload.single('photo'), function(req, res) {

  Ssn.findOne({  ssn: req.body.ssn }, function(err, data) {
    if (data && data.photo) { 
        res.header('content-type', data.photo && data.photo.mimetype);
        //res.sendFile(global.rootPath + '/' + data.photo.path);
        res.send(data);
    } else {
        res.send(err);
    }
})
})

app.post('/userRegistrationSucc', function(req, res) {
   
      Ssn.findOne({ssn: req.body.ssn }, function(err, data) {
        if (data) {
            var id = req.body._id 
            var ssno = new Ssn({
                email: req.body.email,
                name: req.body.name,
                photo: req.file,
                motherMaidenName: req.body.motherMaidenName,
                fathersName: req.body.fathersName,
                address: req.body.address,
                maritalStatus: req.body.maritalStatus,
                dob: req.body.dob,
                mobileNumber: req.body.mobileNumber,
                ssn: req.body.ssn,
                customer:{nameOnCard: req.body.nameOnCard}
          });
          Ssn.findOneAndUpdate({_id: id }, { $set:{ email : req.body.email,customer:{nameOnCard: req.body.nameOnCard}} }, {new:true}, function(err, d) {
            if (err) {
                res.send({
                    status: false,
                    error: err
                });
            } else {
                res.send({
                    status: true,
                    data: d
                });
            }
    
        });
    
            // res.header('content-type', data.photo && data.photo.mimetype);
            // //res.sendFile(global.rootPath + '/' + data.photo.path);
            // res.send(data);
        } else {
            res.send(err);
        }
    })
    
//   ssno.save(function(err, data) {
//         if (err) {
//             res.send({
//                 status: false,
//                 error: err
//             });
//         } else {
//             res.send({
//                 status: true,
//                 data: data
//             });
//         }

//     });
});


app.get('/all', function(req, res) {
    Movie.find({}, function(err, data) {
        if (err) {
            res.send({
                status: false,
                error: err
            });
        } else {
            res.send({
                status: true,
                movies: data
            });
        }
    })
});
app.delete('/:id', function(req, res) {
    Movie.remove({ _id: req.params.id }, function(err, data) {
        if (err) {
            res.send({
                status: false,
                error: err
            });
        } else {
            res.send({
                status: true,
                movies: data
            });
        }
    });
});
app.get('/img/:id', function(req, res) {
    Movie.findOne({ _id: req.params.id }, function(err, data) {
        if (data && data.poster) { 
            res.header('content-type', data.poster && data.poster.mimetype);
            res.sendFile(global.rootPath + '/' + data.poster.path);
        } else {
            res.send(err);
        }
    })
})
app.get('/:id', function(req, res){
    Movie.findOne({_id: req.params.id}, function(err, data){
        if(err){
            res.send({
                status: false,
                error: err
            });
        } else {
            res.send({
                status: true,
                actors: data
            });
        }
    })
});

app.post('/edit/:id', upload.single('poster'), function(req, res) {
    if(!req.body.title)
    {
        res.send({
            msg:"ghdhgfsjsh"
        })
        console.log("something hurrrrrrrrr")
    }
       else{ //var _id = req.body._id;
        var movie = {
        title: req.body.title,
        release_date: req.body.release_date,
        poster: req.file,
        director: req.body.director,
        runtime: req.body.runtime,
        plot: req.body.plot,
        actors: req.body.actors
    }
    
    Movie.findOneAndUpdate({_id : req.params.id }, {$set: movie}, { new: true }, function(err, data) {
        if (err) {
            res.send({
                status: false,
                error: err
            });
        } else {
            res.send({
                status: true,
                data: data,
                msg: "updated"
            });
        }

    });
     }
        
});


module.exports = app;