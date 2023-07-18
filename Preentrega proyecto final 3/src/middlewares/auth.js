const UserAuthviews = (req,res,next)=>{
    if(req.user){
        next()
    } else{
        res.send('<div> Debes estar autenticado para revisar esta pagina, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')
    }
};
const showAuthView = (req,res,next)=>{
    if(req.user){
        res.redirect("/profile");
    } else {
        next();
    }
};
const checkRoles = (urlRoles)=>{
    return (req,res,next)=>{
        if(!urlRoles.includes(req.user.role)){
            res.send('<div> No tienes permisos <a href="/">Ir al home</a></div>')
        } else{
            next();
        }
    }
}


export {UserAuthviews, showAuthView, checkRoles}