const asyncHandler = (asynFunc)=> async (req,res,next)=>{
    try {
        return await asynFunc(req,res,next)
    } catch (error) {
        res.status(error.code||400).json({
            success:false,
            message:error.message
        })
    }
}
export { asyncHandler }