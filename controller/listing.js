const Listing = require("../models/listing.js");
module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({}); 
    res.render("listing/index.ejs",{allListing});
    // console.log(allListing)
}
module.exports.newFormRender = (req,res)=>{
    
    res.render("listing/new.ejs")
}
module.exports.show =async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
      }
    }).populate("owner");
    if(!listing){
        req.flash("error","requested listing is not exist")
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listing/show.ejs",{listing})

}
module.exports.create = async (req,res,next)=>{
    // let (title,description,price,location,country) = req.body;
        let filename = req.file.filename;
        let url = req.file.path;
        
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename}
        await newListing.save();
        req.flash("success","New Listing is Created")
        res.redirect("/listings");
};
module.exports.edit = async (req,res)=>{
    let {id} =req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","requested listing is not exist")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/uploads","/uploads/w_300")
    res.render("listing/edit.ejs",{listing,originalImageUrl})
};
module.exports.update =async (req,res)=>{
    
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let filename = req.file.filename;
        let url = req.file.path;
        listing.image ={url,filename}
        await listing.save()
    }
    
    
    req.flash("success","Listing updated")
    res.redirect(`/listings/${id}`);

}
module.exports.delete =async(req,res)=>{
    let {id} =req.params;
    const deletedList =await Listing.findByIdAndDelete(id);
    console.log(deletedList)
    req.flash("success"," Listing is Deleted")
    res.redirect("/listings")
}