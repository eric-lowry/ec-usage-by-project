const isAuth = require('./isAuth');
const createError = require('http-errors');

//
// hasRole('admin') - middleware to protect a route to users with a specific role
//
function hasRole(roleName) {
    return [isAuth,(req,res,next)=>{
      if (!req.authorization.roles.find(role => role === roleName)) {
        throw createError(403); // forbidden
      }
      next();
    }]
  }
  
module.exports = hasRole;
