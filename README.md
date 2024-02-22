
# ffmpeg-mp4box

Live stream webcodec decoder sample using ffmpeg and [mp4box](https://github.com/gpac/mp4box.js).

The frontend sample is a stripped down version of the [webcodec sample](https://w3c.github.io/webcodecs/samples/video-decode-display/)

The backend uses ffmpeg to stream from either mp4 file or h264 rtsp stream and pipe the frame data to websocket.

Stream target is set in .env, either a local file or rtsp url is expected.
