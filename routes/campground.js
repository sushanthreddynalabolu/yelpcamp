const express=require('express');
const app=express();
app.use(express.urlencoded({extended:true}))
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground')
const campground=require('../controllers/campgrounds')
const multer=require('multer')
const {storage}=require('../cloudinary/index')
const upload=multer({storage})
 
const {isloggedIn,isAuthor,validateCampground}=require('../middleware');
 
router.route('/')
.get(catchAsync(campground.index))
.post(isloggedIn, upload.array('image'),validateCampground, catchAsync(campground.createCampground)); 
 


router.get('/new',isloggedIn,campground.renderNewForm);
 
 router.get('/:id',catchAsync(campground.showCampground));
 router.put('/:id',isloggedIn,isAuthor,upload.array('image'), validateCampground,catchAsync(campground.updateCampground));
router.delete('/:id',isloggedIn,isAuthor,catchAsync(campground.deleteCampground));
router.get('/:id/edit',isloggedIn, isAuthor, catchAsync(campground.editCampground))
 
 
module.exports=router;