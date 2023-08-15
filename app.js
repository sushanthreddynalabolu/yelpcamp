if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}
const express=require('express')
const app=express();
const ejsMate=require('ejs-mate')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash')
const path=require('path') 
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override')
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');

 

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
const mongoose=require('mongoose')
app.set('view engine','ejs')
app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(mongoSanitize())
const dbUrl= process.env.DB_URL || 'mongodb://0.0.0.0:27017/yelp-camps'
// const dbUrl= "mongodb+srv://sushanthreddynalabolu:3EomrHSb6cHjWUCN@cluster0.uo2cblb.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(dbUrl).then(()=>console.log('mongoose is connected')).catch(err=>console.log(err))
const userRoutes=require('./routes/user')
const campgroundRoutes=require('./routes/campground')
const reviews=require('./routes/reviews')

// const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error",function (e){
    console.log("session store error",e)
})

const sessionConfig={
    store,
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})
app.use('/',userRoutes)
app.use('/campground',campgroundRoutes)
app.use('/campground/:id/reviews',reviews)
 
app.get('/', (req, res) => {
    res.render('home')
});

 
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500,}= err;
    if(!err.message) err.message='oh no something went wrong'
    res.status(statusCode).render('error',{err})
})
 
const port= process.env.PORT || 5000
app.listen(port,()=>{
    console.log("the server is running at 5000")
})
