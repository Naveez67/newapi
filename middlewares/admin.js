function admin(req,res,next){
  if(req.user.role!="admin")
  {
    console.log(req.user.role)
   return res.status(403).send("not allowed");
  }
    
   next();
}
module.exports = admin; 