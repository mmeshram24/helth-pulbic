module.exports = (res,status,data,errors,message) =>{
res.status(status).json({status,data,errors,message});
}