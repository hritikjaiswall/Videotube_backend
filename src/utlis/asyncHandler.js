const asyncHandler = (requestHandling) => (res,req,next) => {
    Promise.resolve(requestHandling(req, res, next)).catch((err) => next(err))
}

export {asyncHandler}