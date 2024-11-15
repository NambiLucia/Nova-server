const multer =require('multer')

//set up storage for uploaded documents
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'upload-docs\docs');
    },

    filename:(req,file,cb) =>{
        cb(null,Date.now() + '-' + file.originalname)

    }
});

//create multer instance

exports.upload = multer({
    storage:storage
})