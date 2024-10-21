import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());
app.post("/process-video", (req, res) => {
    // path of input video file is in body of req
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    
    if(!inputFilePath || !outputFilePath) {
        let err = "Bad Request: ";
        if(!inputFilePath) {
            err += "Missing inputFilePath. ";
        }
        if(!outputFilePath) {
            err += "Missing outputFilePath.";
        }
        res.status(400).send(err);
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // 360p
        .on("end", () => {
            res.status(500).send("Video processing finished successfully");
        })
        .on("error", (err) => {
            console.log('An error occurred: ' + err.message);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
    
});

// port may be set as an environment variable, else use 3000
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});