import React, { useEffect } from 'react'
import mongoose from "mongoose"

function Connection() {
    const connectDB = () => {
        try {
            mongoose.connect('mongodb://localhost:27071/metamask', (error, response) => {
                console.log(" db connected with : " + response.host + ':' + response.port)
            })
        } catch (error) { 
            console.log(error.message) 
        }
    }
    useEffect(()=>{
        connectDB()
    })
  return (
    <div>Connection</div>
  )
}

export default Connection