const asyncHandler = (asynFunc)=> async (req,res,next)=>{
    try {
        await asynFunc(req,res,next)
    } catch (error) {
        res.status(err.code||400).json({
            success:false,
            message:err.message
        })
    }
}
export {asyncHandler}