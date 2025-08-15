import Listing from '../models/listing.model.js'

export const createListing = async (req, res ,next) => {
    try {
        console.log("on backend", req.body);
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = Listing.findById(req.params.id);
    if(!listing){
        return res.status(404).json({message: "Listing not found"});
    }
    if(req.user._id !== listing.userRef){
        return res.status(403).json({message: "You do not have permission to delete this"});
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("listing has been deleted");
    } catch (error) {
        next(error);
    }
}