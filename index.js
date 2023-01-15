import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import dbconfig from './client/dbconfig.js'
import { saveFile } from './util.js'



const app = express()

// body parser
app.use(express.json())
app.use(express.static('client'))
app.use(fileUpload({}))


// upload video
app.post("/upload",async (req,res)=>{

   const title = req.body.title
   const file = req.files?.video

   if(!(title && file)) return res.redirect('/failed.html')
    /**
     * video binary
     * title
     */
    console.log({title,file})

    const id = Date.now()
    const ext = file.mimetype.split('/')[1]

    // upload the file
    await saveFile(id,ext,file.data)

    // save the info to db
    const db = await dbconfig()
    const coll = db.collection('videos')
    const saved = await coll.insertOne({
        title,
        file: `${id}.${ext}`
    })

    if(saved.insertedId) res.redirect('/thank-you.html')
    else res.status(500).end('something went wrong!')
})


// list all videos
app.get("/all",(req,res)=>{
})

// stream video
app.get('/stream/:file',(req,res)=>{

})

// delete video
app.delete("/:id",(req,res)=>{

})

app.use((req,res)=>{
    res.redirect('/404.html')
})
https://prod.liveshare.vsengsaas.visualstudio.com/join?3B6FADB0698EE4F9E88D4590A5133C9D2728

app.listen(5000,()=>{
    console.log('listening on port 5000')
})

