var express = require('express');
var path = require('path');
const { title } = require('process');
var fs = require('fs');
const { Session } = require('inspector'); // idk what this is for
const PORT = process.env.PORT;

var session = require('express-session');
const alert = require('alert');
const bodyParser =require("body-parser");
//const cookieParser =require("cookie-parser");

//const popups = require('popups'); // not needed
const app = express();
var MongoClient = require('mongodb').MongoClient;
var MongoURL = 'mongodb://127.0.0.1:27017/';
var client = new MongoClient(MongoURL);
var database = client.db("myDB");
var collection = database.collection("myCollection");
//collection.insertOne({username:'admin' , password: 'admin' , wantToGoList : []});





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({secret : 'mysecret' , resave : false , saveUninitialized : false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
//app.use(cookieParser())

// ---------------------------------LOGIN------------------------------------------//
app.get('/', function(req,res){
  res.redirect('login')
});
/*
app.post('/user',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session)
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  }
  else{
      res.send('Invalid username or password');
  }
})
*/

app.get('/login', function(req,res){
  req.session.context = null;
  res.render('login' ,{error2: ' '})
});

app.post('/login', async(req,res) =>{
  const{username , password} = req.body;
  if(username=="admin" && password=="admin"){
    req.session.context = req.body.username;
    res.render("home");
  }else{
    const currUser = await collection.findOne({ username: `${username}`});
  if(currUser){
    console.log(username);
    console.log(`${username}`);
    console.log(password);
    console.log(currUser.password);
    if(password === currUser.password){
      req.session.context = req.body.username;
      res.render("home");
    }else{
    console.log("WRONG password!");
    alert(username + " WRONG Password!");
    res.render('login' , {error2 :'WRONG Password!'} )
    }
}
if(!username){
  alert("Username and Password Cannot Be Empty!");
  res.render('login');
}
else if (!currUser){
alert("WRONG UserName and Password!");
res.render('login',{error2: 'WRONG UserName and Password!'})
}
  }
});
//----------------------------REGISTERATION----------------------------//

app.get('/registration', function(req,res){
  res.render('registration' ,{error: ' '})
});

app.post('/register', async(req,res) => {
  const{username , password} = req.body;
  if(!username){
    alert("Username and Password Cannot Be Empty!");
    res.render('registration',{error: 'Username and Password Cannot Be Empty!'})
  }
  if(!await collection.findOne({ username: `${username}`})){
  collection.insertOne({username:username , password: password , wantToGoList : []});
  //wanttogo.insertOne({username:username , trip : "Annapurna Circuit"});
    res.redirect('login')
  }
  else{
    alert("USERNAME ALREADY EXIST!");
    res.render('registration',{error: 'USERNAME ALREADY EXIST!'})
    console.log("already exist");
  }
});



//--------------------------------------GETONLY----------------------------------------------//
//--------------------------------------GETONLY----------------------------------------------//



app.get('/home', function(req,res){
  if(req.session.context){
  res.render('home')
  }
  else{
    res.redirect('/')
  }
 });



app.get('/hiking', function(req,res){
  
  if(req.session.context){
    res.render('hiking')
    }
    else{
      res.redirect('/')
    }

});


app.get('/cities', function(req,res){

  if(req.session.context){
    res.render('cities')
    }
    else{
      res.redirect('/')
    } 
});


app.get('/islands', function(req,res){
  if(req.session.context){
    res.render('islands')
    }
    else{
      res.redirect('/')
    } });

app.get('/wanttogo',async function(req,res){
  if(req.session.context){
    const user = await collection.findOne({ username: `${req.session.context}`});
     console.log(user);
     const wanttogolist = user.wantToGoList;

    res.render('wanttogo',{wantlist:wanttogolist})
    }
    else{
      res.redirect('/')
    }});
  
//---------------------------------ANNAPURNA-----------------------------------------------------------//
//---------------------------------ANNAPURNA-----------------------------------------------------------//


app.get('/annapurna', function(req,res){
  if(req.session.context){
    res.render('annapurna')
    }
    else{
      res.redirect('/')

    }
  });
app.post('/annapurna' , function(req,res){
  const client = new MongoClient("mongodb://0.0.0.0:27017");

  async function aaa(){
    try {
      console.log(req.session.context)
  await client.connect();
  await client.db("myDB").command({ ping: 1 });
      console.log("Connected successfully to server");
  console.log(req.session.context);
  const user = await collection.findOne({ username: `${req.session.context}`});
 // const user =  await client.db('myDB').collection('myCollection').findOne({name: "hamza"});
  console.log(user);
  const wanttogolist = user.wantToGoList;
  var x = false;
  for(var i = 0 ; i < wanttogolist.length ; i++){
    if(wanttogolist[i] == "Annapurna Circuit"){
       x = true;
       alert("ALREADY IN YOUR LIST");
       break; }
  }
  if(!x){
    wanttogolist.push("Annapurna Circuit")
    console.log("successfully installed")
    collection.updateOne({username:`${req.session.context}` }, {$set : {wantToGoList:wanttogolist}});
  }
    }
    finally {await client.close()};
}; 
aaa().catch(console.dir);
});


//------------------------------------------BALI--------------------------------------------//
//------------------------------------------BALI--------------------------------------------//


app.get('/bali', function(req,res){
  if(req.session.context){
    res.render('bali')
    }
    else{
      res.redirect('/')

    }});



app.post('/bali' , function(req,res){
  const client = new MongoClient("mongodb://0.0.0.0:27017");

  async function aaa(){
    try {
      console.log(req.session.context)
  await client.connect();
  await client.db("myDB").command({ ping: 1 });
      console.log("Connected successfully to server");
  console.log(req.session.context);
  const user = await collection.findOne({ username: `${req.session.context}`});
 // const user =  await client.db('myDB').collection('myCollection').findOne({name: "hamza"});
  console.log(user);
  const wanttogolist = user.wantToGoList;
  var x = false;
  for(var i = 0 ; i < wanttogolist.length ; i++){
    if(wanttogolist[i] == "Bali Island"){
       x = true;
       alert("ALREADY IN YOUR LIST");
       break; }
  }
  if(!x){
    wanttogolist.push("Bali Island")
    console.log("successfully installed")
    collection.updateOne({username:`${req.session.context}` }, {$set : {wantToGoList:wanttogolist}});
  }
    }
    finally {await client.close()};
}; 
aaa().catch(console.dir);
});


//-----------------------------------ROME------------------------//



app.get('/rome', function(req,res){
  if(req.session.context){
    res.render('rome')
    }
    else{
      res.redirect('/')

    }});



app.post('/rome' , function(req,res){
  const client = new MongoClient("mongodb://0.0.0.0:27017");

  async function aaa(){
    try {
      console.log(req.session.context)
  await client.connect();
  await client.db("myDB").command({ ping: 1 });
      console.log("Connected successfully to server");
  console.log(req.session.context);
  const user = await collection.findOne({ username: `${req.session.context}`});
 // const user =  await client.db('myDB').collection('myCollection').findOne({name: "hamza"});
  console.log(user);
  const wanttogolist = user.wantToGoList;
  var x = false;
  for(var i = 0 ; i < wanttogolist.length ; i++){
    if(wanttogolist[i] == "Rome"){
       x = true;
       alert("ALREADY IN YOUR LIST");
       break; }
  }
  if(!x){
    wanttogolist.push("Rome")
    console.log("successfully installed")
    collection.updateOne({username:`${req.session.context}` }, {$set : {wantToGoList:wanttogolist}});
  }
    }
    finally {await client.close()};
}; 
aaa().catch(console.dir);
});


//---------------------------------------------INCA--------------/

app.get('/inca', function(req,res){
  if(req.session.context){
    res.render('inca')
    }
    else{
      res.redirect('/')

    }});



app.post('/inca' , function(req,res){
  const client = new MongoClient("mongodb://0.0.0.0:27017");

  async function aaa(){
    try {
      console.log(req.session.context)
  await client.connect();
  await client.db("myDB").command({ ping: 1 });
      console.log("Connected successfully to server");
  console.log(req.session.context);
  const user = await collection.findOne({ username: `${req.session.context}`});
 // const user =  await client.db('myDB').collection('myCollection').findOne({name: "hamza"});
  console.log(user);
  const wanttogolist = user.wantToGoList;
  var x = false;
  for(var i = 0 ; i < wanttogolist.length ; i++){
    if(wanttogolist[i] == "Inca Trail to Machu Picchu"){
       x = true;
       alert("ALREADY IN YOUR LIST");
       break; }
  }
  if(!x){
    wanttogolist.push("Inca Trail to Machu Picchu")
    console.log("successfully installed")
    collection.updateOne({username:`${req.session.context}` }, {$set : {wantToGoList:wanttogolist}});
  }
    }
    finally {await client.close()};
}; 
aaa().catch(console.dir);
});


//-------------------------------PARIS---------------------------//




app.get('/paris', function(req,res){
  if(req.session.context){
    res.render('paris')
    }
    else{
      res.redirect('/')

    }});



app.post('/paris' , function(req,res){
  const client = new MongoClient("mongodb://0.0.0.0:27017");

  async function aaa(){
    try {
      console.log(req.session.context)
  await client.connect();
  await client.db("myDB").command({ ping: 1 });
      console.log("Connected successfully to server");
  console.log(req.session.context);
  const user = await collection.findOne({ username: `${req.session.context}`});
 // const user =  await client.db('myDB').collection('myCollection').findOne({name: "hamza"});
  const wanttogolist = user.wantToGoList;
  var x = false;
  for(var i = 0 ; i < wanttogolist.length ; i++){
    if(wanttogolist[i] == "Paris"){
       x = true;
       alert("ALREADY IN YOUR LIST");
       console.log(user);
       break; }
  }
  if(!x){
    wanttogolist.push("Paris")
    console.log("successfully installed")
    collection.updateOne({username:`${req.session.context}` }, {$set : {wantToGoList:wanttogolist}});
    console.log(user);
  }
    }
    finally {await client.close()};
}; 
aaa().catch(console.dir);
});



//------------------------------------SANTORINI-----------------------//





app.get('/santorini', function(req,res){
  if(req.session.context){
    res.render('santorini')
    }
    else{
      res.redirect('/')

    }});



app.post('/santorini' , function(req,res){
  const client = new MongoClient("mongodb://0.0.0.0:27017");

  async function aaa(){
    try {
      console.log(req.session.context)
  await client.connect();
  await client.db("myDB").command({ ping: 1 });
      console.log("Connected successfully to server");
  console.log(req.session.context);
  const user = await collection.findOne({ username: `${req.session.context}`});
 // const user =  await client.db('myDB').collection('myCollection').findOne({name: "hamza"});
  console.log(user);
  const wanttogolist = user.wantToGoList;
  var x = false;
  for(var i = 0 ; i < wanttogolist.length ; i++){
    if(wanttogolist[i] == "Santorini Island"){
       x = true;
       alert("ALREADY IN YOUR LIST");
       break; }
  }
  if(!x){
    wanttogolist.push("Santorini Island")
    console.log("successfully installed")
    collection.updateOne({username:`${req.session.context}` }, {$set : {wantToGoList:wanttogolist}});
  }
    }
    finally {await client.close()};
}; 
aaa().catch(console.dir);
});

//-----------------------------------SEARCH------------------------//

//post request for searsh bar
app.post('/search', function(req,res){
  var input = req.body.Search.toLowerCase();
  const arr = [];
  if("Annapurna Circuit".toLowerCase().includes(input)){
      arr.push("annapurna");
  }
  if("Bali Island".toLowerCase().includes(input)){
      arr.push("bali");
  }
  if("Inca Trail to Machu Picchu".toLowerCase().includes(input)){
      arr.push("inca");
  }
  if("Paris".toLowerCase().includes(input)){
      arr.push("paris");
  }
  if("Rome".toLowerCase().includes(input)){
      arr.push("rome");
  }
  if("Santorini Island".toLowerCase().includes(input)){
      arr.push("santorini");
  }
  console.log(input);
  console.log(arr);
  res.render('searchresults',{arrfinal:arr});
});


//-----------------------------------FUNCTIONS------------------------//


async function additem(wanted , req, res){
var currentUser = await wanttogo.find({username: req.session.context});
var sd = currentUser.toArray();
var x = false;
for(var i = 0 ; i < currentUser.length ; i++){
  if(sd[i] == wanted){
     x = true;
     alert("Already MAWGODAH");
     break;  
  }
}
if(!x){
  console.log("hahakakkjdlinc")
  wanttogo.insertOne({username:req.session.context , trip : wanted});
}

}


if(PORT) {
  app.listen(process.env.PORT, function() {console.log(`server started on port ${PORT}`)});
}else {
  app.listen(3000, function(){console.log('server started on port 3000')});
}