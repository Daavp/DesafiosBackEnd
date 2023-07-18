const checkUserAuthviews = (req,res,next)=>{
    if(req.user){
        next()
    } else{
        res.send('<div> Debes estar autenticado para revisar esta pagina, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')
    }
}
export {checkUserAuthviews}