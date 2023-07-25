export class SessionsController{
    static registerStrategy(req,res){
        res.send('<div> Registro completado con exito, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')
    };
    static registerStrategyFailure(req,res){
        res.send('<div>Error al registrar con los datos ingresados, <a href="/signup">Intente nuevamente</a></div>')
    };
    static loginStrategy(req,res){
        return res.redirect("/products?page=1");
    };
    static loginStrategyFailure(req,res){
        res.send('<div>Hubo un error al iniciar sesión, <a href="/signup">Intente nuevamente</a></div>')
    };
    static logoutStrategy(req,res){
            req.logOut(error=>{
                if(error){//elimina req.user y limpia session actual
                    return res.send('No se pudo cerrar sesión <a href:"/profile"> ir al perfil </a>');
                } else{
                    req.session.destroy(err=>{//Elimina session de la BD
                        if(err) return res.send('No se pudo cerrar sesión <a href:"/profile"> ir al perfil </a>');
                        res.redirect("/")
                    });
                }
            })
    };
}