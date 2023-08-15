const mongoose=require('mongoose')
const Campground=require('../models/campground')
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')
mongoose.connect('mongodb://0.0.0.0:27017/yelp-camps').then(()=>console.log('mongoose is connected')).catch(err=>console.log(err))
const samp=(array)=>array[Math.floor(Math.random()*array.length)]
const seed=async ()=>{
    await Campground.deleteMany({})
for(let i=0;i<300;i++){
    randcamp= Math.floor(Math.random()*1000);
    const Price = Math.floor(Math.random() * 20) + 10;
    const campground=new Campground({
        title:`${cities[randcamp].city},${cities[randcamp].state}`,
        author:"64d83644451b2952ae69ceac",
        location:`${samp(places)} ${samp(descriptors)}`,
        description:' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore, ex! Hic accusantium error quod molestiae natus. Dolorum laudantium rem nesciunt harum dolorem nobis. Debitis consequuntur iure corrupti, est quis similique!',
        Price,
        geometry:{
          type:"Point",
          coordinates:[cities[randcamp].longitude,
        cities[randcamp].latitude]
        },
        images: [
            {
              url: 'https://res.cloudinary.com/dfyjzlykn/image/upload/v1692028407/YELPCAMP/gjoitowixac0mbli42l9.jpg',
              filename: 'YELPCAMP/bjwzorkw9orlmkvs3mpk',
            },
            {
              url: 'https://res.cloudinary.com/dfyjzlykn/image/upload/v1691923041/YELPCAMP/x5q32o380ungtgapxrtg.jpg',
              filename: 'YELPCAMP/x5q32o380ungtgapxrtg',
            }
          ],
    })
    await campground.save()
}
}
seed()
