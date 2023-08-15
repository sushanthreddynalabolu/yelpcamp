const Campground=require('../models/campground')
const mbxGeoCoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeoCoding({accessToken:mapBoxToken})
const {cloudinary}=require('../cloudinary')
module.exports.index=async (req,res)=>{
    const campground=await Campground.find({})
    res.render('index',{campground})
}
module.exports.renderNewForm=(req,res)=>{
    res.render('new')
}
module.exports.createCampground=async (req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
   
    const campground=new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry
    campground.images= req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.author=req.user._id;
    await campground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campground/${campground._id}`)
}
module.exports.showCampground=async(req,res)=>{
    const {id}=req.params
    const campground=await Campground.findById(id).populate({path:'reviews',
    populate:{
        path:'author'
    }
}).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect('/campground')
    }
    res.render('show',{campground})
}
module.exports.editCampground=async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect('/campground')
    }
    res.render('edit',{campground})

}
module.exports.updateCampground=async (req,res)=>{
    const {id}=req.params;
    
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        }
    await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    console.log(campground)
    }
    await campground.save()

    req.flash('success','Successfully updated campground')
    res.redirect(`/campground/${id}`)
    }
    module.exports.deleteCampground=async (req,res)=>{
        const {id}=req.params
        await Campground.findByIdAndDelete(id);
        req.flash('success','Successfully Deleted Campground')
        res.redirect('/campground')
    }