const cloudinary = require('cloudinary').v2

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'djanehf5b',
    api_key: '951351792575259',
    api_secret: 'GSa7PdIEkTIdDlahRy9vTZoWmmU'
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SOCIAL-MEDIA',
        allowedformats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}