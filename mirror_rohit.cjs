const Jimp = require('jimp');
async function main() {
    try {
        const image = await Jimp.read('public/Rohit.png');
        image.flip(true, false).write('public/Rohit.png');
        console.log('Rohit mirrored successfully!');
    } catch (err) {
        console.error('Error flipping image:', err);
    }
}
main();
