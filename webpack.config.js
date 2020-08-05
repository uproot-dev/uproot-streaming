const webpack = require('webpack');

module.exports = {
    resolve: {
        alias: {
            videojs: 'video.js',
            WaveSurfer: 'wavesurfer.js',
            RecordRTC: 'recordrtc'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify("4711"),
            videojs: 'video.js/dist/video.cjs.js',
            RecordRTC: 'recordrtc'
        })
    ]
}
