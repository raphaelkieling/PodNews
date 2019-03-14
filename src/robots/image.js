const GoogleImages = require('google-images');
const request      = require('request');
const path         = require('path');
const fs           = require('fs');
const Jimp         = require('jimp');

class Images{
    constructor({ fileManager }){
        this.fileManager = fileManager;
        this.googleImages = null;
    }

    init(){
        this.googleImages = new GoogleImages(process.env.GOOGLE_IMAGES_CSE_KEY, process.env.GOOGLE_KEY);
    }

    getFirstImageResponse(searchTerm){
        return this.googleImages.search(searchTerm).then(response => response[0]);
    }

    downloadImage(url){
        return new Promise((resolve , reject)=>{
            let imagePath = path.resolve(this.fileManager.getPathTemp(), 'thumb.png');

            request.head(url, function(err, res, body){
                request(url).pipe(fs.createWriteStream(imagePath)).on('close', ()=> resolve(imagePath));
            });
        })
    }

    async resizeImage(imagePath){
        this.loader.text = `🖼  Image resized`;

        await Jimp
            .read(imagePath)
            .then(image=>{
                image
                .resize(Jimp.AUTO, 256)
                .write(imagePath);
            })
            .catch(console.log)
    }

    async getImage({ searchTerm }){
        let googleImage = await this.getFirstImageResponse(searchTerm);
        let imagePath = await this.downloadImage(googleImage.url);
        let imageResizePath = await this.resizeImage(imagePath);
    }
}

module.exports = Images;