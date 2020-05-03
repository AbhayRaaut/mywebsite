"user strict";
var express = require('express');
var app = express();
var developernamedefault = "Abhay Raut";
var developercountrydefault = "Nepal";
var bodyParser = require('body-parser');
var path = require('path');
var nodemailer = require("nodemailer")
var fs = require("fs")

//create handlebars with default layout
var handlebars = require('express-handlebars')
.create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT || 5000);
app.use(express.static(path.resolve(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
    res.render('home',{
        layout:'main',
        developername : developernamedefault,
        developercountry : developercountrydefault
    });
});

app.post('/contact',function(req,res){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'personalwebsitear@gmail.com',
          pass: '***************'
        }
      });
      
      var mailOptions = {
        from: 'personalwebsitear@gmail.com',
        to: 'abhayraut712@gmail.com',
        subject: req.body.subject,
        text: 'Hey! I am '+req.body.name+'.\n'+req.body.message+'\nMy gmail id is: '+req.body.email
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            app.use(function(req,res){
                res.status(404);
                res.render('404');
            });
            
        }else{
           res.render('contact'); 
        }
      });
        // console.log(req.body.name);  //prints all the form contents to console log we can use this data to store in data base
        // res.render('contact');
    });

    app.get('/cv', function (req, res) {
        function fileExist(fullpath) {
            try {
                return fs.statSync(fullpath).isFile();
            } catch (e) {
                return false;
            }
         }
        
        
        var name = 'Abhay_Raut_CV.pdf';
        var filePath = path.join(__dirname,name);
        res.download(filePath, name);
    });

//need declare handle error http here (after get post put actions etc)
//404 not found
app.use(function(req,res){
    res.status(404);
    res.render('404');
});
//500 server error
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'),function(){
    console.log('express started on http://localhost:'+app.get('port'));
})