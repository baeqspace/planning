import express from 'express'
import cors from 'cors'
import fs from 'fs'
import {v4 as uuid4} from 'uuid'
import path from 'path'

const app = express()

app.use(express.json())
app.use(cors({
    origin: ['https://baeqspace.ru']
}))

app.post('/requestJSON', (req,res)=>{
    const body = req.body
    const name = uuid4() + '.json'
    fs.writeFileSync(name, JSON.stringify(body))
    res.json({type: 'success', name})
})

app.get('/download/:name', (req,res)=>{
    const name = req.params.name
    res.download(path.join(path.resolve(), name), ()=>{
        fs.unlinkSync(path.join(path.resolve(), name))
    })
})

app.listen(3000, ()=>{ 
    console.log('listening to port 3000')
})