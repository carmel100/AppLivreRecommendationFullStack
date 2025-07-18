
 const mongoose = require('mongoose')

 const bcrypt = require('bcrypt')

   const userSchema = mongoose.Schema({
   nom : {type : 'String' , required :true },
   prenom : {type : 'String', required : true},
   email :  {type: 'String' , required : true , unique : true} ,
   motdepasse : {type : 'String',  required : true},
    resetToken:{type : 'String'},
  resetTokenExpires: {type : 'String'},
   })

userSchema.pre('save', async function (next) {
  if (!this.isModified('motdepasse')) return next();
  this.motdepasse = await bcrypt.hash(this.motdepasse, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);