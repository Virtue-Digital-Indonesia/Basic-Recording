const express = require('express')
const app = express()
const port = 3000
const RecordManager = require('./recordManager')
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.post('/recorder/v1/start', (req, res, next) => {
    let { body } = req;
    let { appid, channel, key } = body;
    if (!appid) {
        throw new Error("appid is mandatory");
    }
    if (!channel) {
        throw new Error("channel is mandatory");
    }

    RecordManager.start(key, appid, channel).then(recorder => {
        //start recorder success
        res.status(200).json({
            success: true,
            sid: recorder.sid
        });
    }).catch((e) => {
        //start recorder failed
        next(e);
    });
})

app.post('/recorder/v1/stop', (req, res, next) => {
    let { body } = req;
    let { sid } = body;
    if (!sid) {
        throw new Error("sid is mandatory");
    }

    RecordManager.stop(sid);
    res.status(200).json({
        success: true
    });
})

app.get('/recorder/v1/download', (req, res, next) => {
    let sid = req.query.sid;
    if (!sid) {
        throw new Error("sid is mandatory");
    }

    let recorderInfo = RecordManager.fetchInfo(sid);
    let videos = recorderInfo.filename;

    if (recorderInfo.status == "Recording") {
        throw new Error("sid is recording");
    }

    if (videos <= 0) {
        throw new Error("no video found with sid");
    }

    res.download(
        videos[0], 
        sid + ".mp4", // Remember to include file extension
        (err) => {
            if (err) {
                res.send({
                    error : err,
                    msg   : "Problem downloading the file"
                })
            }
    });
})

app.use( (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        err: err.message || 'generic error'
    })
})

app.listen(port)