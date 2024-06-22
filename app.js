
 const { render } = require('ejs');
 var express = require('express');
 var path = require('path');
 var fs = require('fs');
 var session = require('express-session') 
var cookieParser = require('cookie-parser');
const { fstat } = require('fs');
 var app = express();
 
 
 // view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 
 app.use(express.json());
 app.use(express.urlencoded({ extended: false }));
 app.use(express.static(path.join(__dirname, 'public')));
 var LoggedIn = false;
 
 app.use(cookieParser());
app.use(session({ 
    secret: '11', 
    resave: true,
    saveUninitialized: true,
})) ;
 

 /*app.get('/',function(req,res){
 
   res.redirect('login',{error:""})
 }); */
 
 
 app.get('/',function(req,res){
 
   res.render('login',{alert:""})
   LoggedIn = false;   // whenever a user returns to login page ,he is no long logged in and needs to login again
 }); 
 
 
 app.post('/',function(req,res){
 
  user = req.body.username;
  pass = req.body.password;
  req.session.username = user;
  req.session.password = pass;
   var x = req.body.username;
   var y = req.body.password;

   async function login(){
 
     var {MongoClient} = require('mongodb');
     var uri  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client  = new MongoClient(uri , {useNewUrlParser: true, useUnifiedTopology: true});
     await client.connect();
     var User = {username: x , password: y};
     const existUsername = await client.db('sample_restaurants').collection('thirdCollection').findOne({ username: x});
 
     if (existUsername){
        if(existUsername.password == y){
           LoggedIn = true;
 
           currentUser = x;
           checking1(res);
        }
        else{
             wrongPassword(res); 
        }
     }
     else{
          notexist(res);
     }
   }
 
   function wrongPassword(res){

     res.render('login',{alert: "Incorrect Password"});
     
   }
   function notexist(res)
   {
     res.render('login',{alert: "User is not registered"});
   
   }
   
 function checking1(res){
 
   if(LoggedIn == true){
   res.redirect('home')
 }}
 
   login().catch(console.error);
 }); 
 
 
 app.get('/registration' , function(req,res){
    res.render('registration' , {alert: ""})
 
 });
 
 
 function checking(res){
 
   if(LoggedIn == true){
   res.redirect('home')
 }
 
 
 }
 
  app.post('/register' , function(req,res){
    user = req.body.username;
    pass = req.body.password;
    req.session.username = user;
    req.session.password = pass;
     var x = req.body.username;
     var y = req.body.password;
    async function insert(){
     var {MongoClient} = require('mongodb');
     var uri  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client  = new MongoClient(uri , {useNewUrlParser: true, useUnifiedTopology: true});
     await client.connect();
     var User = {username: x , password: y};
     const existUsername = await client.db('sample_restaurants').collection('thirdCollection').findOne({ username: x});
     if (existUsername ) {
       console.log('username taken');
       res.render('registration',{alert: "There exists a user with this username, Please choose another one"});;
 
     }
     else{
     LoggedIn = true;
     currentUser = x;
     await client.db('sample_restaurants').collection('thirdCollection').insertOne(User);}
     client.close();
     checking(res);
 }
 insert().catch(console.error);
 }); 
 
 app.get('/home' , function(req,res){
   if (LoggedIn == true){
   res.render('home')}
   else{
       res.redirect('/')
 
   }
 })

 
 
 
 
 app.get('/phones', function(req,res){
   if (LoggedIn == true){
    res.render('phones')}
    else{
     res.redirect('/')
 
 }
 
 
 
 });
 
 app.get('/books', function(req,res){
   if (LoggedIn == true){
   res.render('books')}
 
   else{
     res.redirect('/')
 
 }
 
 });
 
 app.get('/sports', function(req,res){
   if (LoggedIn == true){
   res.render('sports')}
 
   else{
     res.redirect('/')
 
 }
 
 });
 
 
 app.get('/cart', function(req,res){
   if (LoggedIn == true){
    async function getCartData(){
      var {MongoClient} = require('mongodb');
      var uri2 = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
      var client2 = new MongoClient(uri2 , {useNewUrlParser: true, useUnifiedTopology: true});
      await client2.connect();
      var show = [];
      const boxingitem = await client2.db('sample_restaurants').collection('Cart').findOne({ username: req.session.username, Item:'Boxing'});
      const galaxyitem = await client2.db('sample_restaurants').collection('Cart').findOne({ username: req.session.username, Item:'Galaxy'});
      const iphoneitem = await client2.db('sample_restaurants').collection('Cart').findOne({ username: req.session.username, Item:'Iphone'});
      const leavesitem = await client2.db('sample_restaurants').collection('Cart').findOne({ username: req.session.username, Item:'Leaves'});
      const sunitem = await client2.db('sample_restaurants').collection('Cart').findOne({ username: req.session.username, Item:'Sun'});
      const tennisitem = await client2.db('sample_restaurants').collection('Cart').findOne({ username: req.session.username, Item:'Tennis'});
      if(boxingitem){
    
        show.push({
          name :'boxing bag',
          url : '/boxing',
          image :'boxing.jpg' 
        });
      }
    
      if(galaxyitem){
    
        show.push(  { name : 'galaxy s21 ultra',
        url : '/galaxy',
        image : 'galaxy.jpg'
      });
      }
    
    
      if(iphoneitem){
        show.push(  { name : 'iPhone 13 pro', 
        url : '/iphone',
        image : 'iphone.jpg'
      });
    
      }
    
      if(leavesitem){
       show.push(  { name : 'leaves of grass', 
       url : '/leaves',
       image :'leaves.jpg'
     });
    
      }
      if(sunitem){
        show.push(  {name :'the sun and her flowers', 
        url : '/sun',
        image :'sun.jpg'
        });
    
    }
    
    if(tennisitem){
      show.push({ name : 'tennis racket', 
      url : '/tennis',
      image :'tennis.jpg'
      });
    }
    
    res.render('cart',{cartres:show});
    
     }

     getCartData().catch(console.error);
   }
 
   else{
     res.redirect('/')
 
 }
 });
 
 
 app.get('/galaxy', function(req,res){
   if (LoggedIn == true){
   res.render('galaxy',{alert: ""})}
 
   else{
     res.redirect('/')
 
 }
 
 });
 
 app.post('/addGalaxy', function(req,res){
 
   async function addGalaxy(){
     var {MongoClient} = require('mongodb');
     var uri1  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client1  = new MongoClient(uri1 , {useNewUrlParser: true, useUnifiedTopology: true});
     await client1.connect();
     var add = 'Galaxy';
     var adding = {username: req.session.username , Item: add};
     const existItem = await client1.db('sample_restaurants').collection('Cart').findOne(adding);
     if(existItem){
       res.render('galaxy',{alert:"Item is already in Cart"})
     }
     else{
     await client1.db('sample_restaurants').collection('Cart').insertOne(adding);
     console.log('successful');
   }}
   addGalaxy().catch(console.error);
  
 
 });
 
 
 app.get('/iphone', function(req,res){
   if (LoggedIn == true){
   res.render('iphone',{alert: ""})}
 
   else{
     res.redirect('/')
 
 }
 
 });



 
 app.post('/addIphone', function(req,res){
 
   async function addIphone(){
     var {MongoClient} = require('mongodb');
     var uri1  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client1  = new MongoClient(uri1 , {useNewUrlParser: true, useUnifiedTopology: true});
     await client1.connect();
     var add = 'Iphone';
     var adding = {username: req.session.username , Item: add};
     const existItem = await client1.db('sample_restaurants').collection('Cart').findOne(adding);
     if(existItem){
       res.render('iphone',{alert: "Item is already in Cart"})
     }
     else{
     await client1.db('sample_restaurants').collection('Cart').insertOne(adding);
     console.log('successful');
   }}
   addIphone().catch(console.error);
  
 
 });
 
 
 
 app.get('/leaves', function(req,res){
 
   if (LoggedIn == true){
    res.render('leaves',{alert: ""})}
 
    else{
     res.redirect('/')
 
 }
 
 });
 
 app.post('/addLeaves', function(req,res){
 
   async function addLeaves(){
     var {MongoClient} = require('mongodb');
     var uri1  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client1  = new MongoClient(uri1 , {useNewUrlParser: true, useUnifiedTopology: true});
     await client1.connect();
     var add = 'Leaves';
     var adding = {username: req.session.username , Item: add};
     const existItem = await client1.db('sample_restaurants').collection('Cart').findOne(adding);
     if(existItem){
       res.render('leaves',{alert:"Item is already in Cart"})
       }
     else{
     await client1.db('sample_restaurants').collection('Cart').insertOne(adding);
     console.log('successful');
   }}
   addLeaves().catch(console.error);
  
 
 });
 
 
 app.get('/sun', function(req,res){
   if (LoggedIn == true){
   res.render('sun',{alert: ""})}
 
   else{
     res.redirect('/')
 
 }
 
 });
 
 app.post('/addSun', function(req,res){
 
   async function addSun(){
     var {MongoClient} = require('mongodb');
     var uri1  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client1  = new MongoClient(uri1 , {useNewUrlParser: true, useUnifiedTopology: true});
     await client1.connect();
     var add = 'Sun';
     var adding = {username: req.session.username , Item: add};
     const existItem = await client1.db('sample_restaurants').collection('Cart').findOne(adding);
     if(existItem){
       res.render('sun',{alert: "Item is already in Cart"})
     }
     else{
     await client1.db('sample_restaurants').collection('Cart').insertOne(adding);
     console.log('successful');
   }}
   addSun().catch(console.error);
  
 
 });

 
 
 app.get('/boxing', function(req,res){
   if (LoggedIn == true){
   res.render('boxing',{alert: ""})}
 
   else{
     res.redirect('/')
 
 }
 
 });
 
 app.post('/addBoxing', function(req,res){
 
   async function addBoxing(){
     var {MongoClient} = require('mongodb');
     var uri1  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client1  = new MongoClient(uri1 , {useNewUrlParser: true, useUnifiedTopology: true});
     await client1.connect();
     var add = 'Boxing';
     var adding = {username: req.session.username , Item: add};
     const existItem = await client1.db('sample_restaurants').collection('Cart').findOne(adding);
     if(existItem){
       res.render('boxing',{alert: "Item is already in Cart"})
     }
     else{
     await client1.db('sample_restaurants').collection('Cart').insertOne(adding);
     console.log('successful');
   }}
   addBoxing().catch(console.error);
  
 
 });
 
 
 app.get('/tennis', function(req,res){
   if (LoggedIn == true){
   res.render('tennis',{alert: ""})}
 
   else{
     res.redirect('/')
 
 }
 
 });
 
 app.post('/addTennis', function(req,res){
 
   async function addTennis(){
     var {MongoClient} = require('mongodb');
     var uri1  = "mongodb+srv://admin:admin@cluster0.ueosr.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
     var client1  = new MongoClient(uri1 , {useNewUrlParser: true, useUnifiedTopology: true});
     await client1.connect();
     var add = 'Tennis';
     var adding = {username: req.session.username, Item: add};
     const existItem = await client1.db('sample_restaurants').collection('Cart').findOne(adding);
     if(existItem){
       res.render('tennis',{alert: "Item is already in Cart"})
     }
     else{
     await client1.db('sample_restaurants').collection('Cart').insertOne(adding);
     console.log('successful');
   }}
   addTennis().catch(console.error);
  
 
 });

 app.get('/search',function(req,res){
  if(LoggedIn == true){
    res.render('searchresults',{searchres: "" })
  }
  else{
    res.redirect('/')
  }

 });


 function substring(t, input) {
  return t.filter(function(obj) {
    return Object.keys(obj).some(function(key) {
      return obj[key].includes(input);
    })
  });
}


 app.post('/search',function(req,res){
  if (LoggedIn == true){
  req.session.Search= req.body.Search;
  var search2 = req.session.Search.toLowerCase();
  var items =[ {
    name :'boxing bag',
    url : '/boxing',
    image :'boxing.jpg' 
  }, 
  { name : 'galaxy s21 ultra',
    url : '/galaxy',
    image : 'galaxy.jpg'
  },
  { name : 'iPhone 13 pro', 
    url : '/iphone',
    image : 'iphone.jpg'
  },
  { name : 'leaves of grass', 
    url : '/leaves',
    image :'leaves.jpg'
  },
  { name : 'tennis racket', 
  url : '/tennis',
  image :'tennis.jpg'
  },
  {name :'the sun and her flowers', 
  url : '/sun',
  image :'sun.jpg'
  }
];
  var result = substring(items,search2);
  if(result.length==0){
    res.status(200).send("Item is not found, please return to the previous page");
  }
  else if(search2 == "" || search2 == " "){
    res.status(200).send("Item is not found, please return to the previous page");

  }
  else{
  res.render('searchresults', {searchres: result});
}}

else{
  res.redirect('/')


}});


 
 if(process.env.PORT){
   app.listen(process.env.PORT, function() {console.log('Server started')});

 }

 else{
  app.listen(3000, function() {console.log('Server started on port 3000')});
 }
  
 
 