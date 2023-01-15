export default ()=> (req,res,next)=>{
    if(req.headers['content-type']=="text/plain"){
        console.log('[our middleware]')
        req.on('data',data=>{
            req.body = data.toString()
            next()
        })
    }
    next()
}