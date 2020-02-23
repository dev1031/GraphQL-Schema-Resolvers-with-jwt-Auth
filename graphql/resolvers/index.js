const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('./../../models/post');
const User = require('./../../models/user');

const posts =postIds =>{
    return Post.find({_id : {$in :postIds }})
    .then((posts)=>{
        return posts.map((post)=>{
            return {...post._doc,
                creator : user.bind(this,post.creator )
            }
        })
    })
    .catch(error=>{
        throw new Error(error)
    })
}

const user = userId=>{
   return User.findById(userId)
    .then((user)=>{
        return { ...user._doc, 
            _id : user.id ,
            createdPosts : posts.bind(this,user._doc.createdPosts)
        }
    })
    .catch((error)=>{
        throw new Error( error )
    })
}

module.exports = {
    posts : ()=>{
        return Post.find()
            .then((posts)=>{
                return posts.map(post=>{
                    return { ...post._doc,
                        creator : user.bind(this , post._doc.creator)
                    }
                })
            })
    },

    createPost : (args , req)=>{
       if(!req.isAuth){
           throw new Error('Unauthenticated!')
        }
        var post = new Post({
            title : args.postInput.title,
            description : args.postInput.description,
            creator : req.userId
        })
        return post.save()
        .then((result)=>{
             createdPost = { ...result._doc,
                creator: user.bind(this , result._doc.creator)
            }
            return User.findById(req.userId)
        })
        .then( user=>{
            if(!user){
                throw new Error('User not exist')
            }
            user.createdPosts.push(post);
            return user.save();
        })
        .then(()=>{
            return createdPost
        })
        .catch((error)=>{
            console.log(error)
            throw error
        })
    },

    createUser :(args)=>{
        return User.findOne({ email: args.userInput.email})
        .then((user)=>{
            if(user){
                throw new Error('User Already Exist, Try Something New')
            }
            return bcrypt.hash(args.userInput.password , 12)
        })
        .then((hashedPassword)=>{
            const user = new User({
                email : args.userInput.email,
                password: hashedPassword
            });
            return user.save()
           })
        .then((result)=>{
            return { ...result._doc , password: null}
        })
        .catch((error)=>{
            console.log(error)
            throw error
        })
    },

    login : async ({email , password}) =>{
        const user = await  User.findOne({email : email});
        if(!user){
            throw new Error('User does not exist');
        }
        const isEqual =  await  bcrypt.compare(password , user.password);
        if(!isEqual){
            throw new Error('Password is incorrect');           
        }
       const token = jwt.sign({userId : user.id , email : user.email}, 'JWT_SECRET_KEY' , {expiresIn :'1h'});
       return {userId :user.id , token : token, tokenExpiration: 1 }
}
}