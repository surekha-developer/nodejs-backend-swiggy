const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

    const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    // Unique filename: original name + timestamp
    // const uniqueSuffix = Date.now() + path.extname(file.originalname);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});


const addFirm = async(req,res) => {
  try {
      const{firmName, area, category, region, offer} = req.body;

    const image = req.file? req.file.filename:undefined;



    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message:"Vendor not found"})
    }

    const firm = new Firm({
        firmName, area, category, region, offer, image, vendor: vendor._id
    })
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(200).json({message:"firm added successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json("internal server error")
  }
}

const deleteFirmById = async(req,res) => {
    try {
        const firmId = req.params.firmId;
        const deleteProduct = await Firm.findByIdAndDelete(FirmId);

        if(!deleteProduct){
            return res.status(404).json({error:"No Product found"})
        }
     } catch (error) {
         console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {addFirm: [upload.single('image'), addFirm],deleteFirmById}