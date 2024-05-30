import passport from "passport";

class UserController { // consultado por el router

    async register(req, res, next) {
        passport.authenticate("register", { failureRedirect: "/failedregister" }, (error, user) => {
            if (error) { 
                return next(error); 
            }

            if (!user) { 
                return res.redirect("/failedregister"); 
            }

            req.logIn(user, (error) => {
                if (error) { 
                    return next(error); 
                }

                req.session.user = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    age: user.age,
                    email: user.email,
                    cart: user.cart, // cart asignado al user al registrarse
                    role: user.role
                };
                req.session.login = true;
                res.redirect("/products");
            });
        })(req, res, next);
    }

}

export default UserController;