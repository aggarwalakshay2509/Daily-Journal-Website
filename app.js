const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const PORT=3000

mongoose.connect("<enter mongoDB atlas URI>")

const homeContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo nemo, vero qui quam hic dignissimos alias et sint sapiente quos nesciunt ad cum blanditiis eveniet, unde aut voluptates molestias quaerat similique repellendus ut est soluta? Reprehenderit repudiandae ipsum doloribus cupiditate veniam ducimus cum excepturi. Voluptas impedit asperiores autem sapiente minima, doloremque."
const aboutContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia neque sapiente maxime atque repellendus. Alias, inventore voluptates vero voluptatum voluptatem temporibus ducimus aliquam impedit neque labore, eveniet nisi atque dignissimos, voluptas dolor quod minus earum corrupti. Autem velit officia ab necessitatibus molestiae aut! Ex rem perferendis ullam doloribus, ipsum aliquid."
const contactContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore sit accusamus quibusdam possimus repellendus commodi veritatis sunt laborum dolorem est quaerat dolores perferendis, necessitatibus explicabo, cumque provident. Dolorem libero facere sit hic exercitationem minus modi, sunt officia fugit accusamus quas iusto, nulla alias id. Fugit modi blanditiis ea iure placeat!"

const postSchema=new mongoose.Schema({
    postTitle:String,
    postContent:String
})
const Post=mongoose.model("post",postSchema)

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine','ejs')

app.get("/",async function(req,res){
    let posts=await Post.find({});
    res.render('home',{homeContent:homeContent,posts:posts})
})
app.get("/about",function(req,res){
    res.render('about',{aboutContent:aboutContent})
})
app.get("/contact",function(req,res){
    res.render('contact',{contactContent:contactContent})
})
app.get("/compose",function(req,res){
    res.render('compose')
})
app.get("/posts/:postID",async function(req,res){
    const reqID=req.params.postID;
    const strPost=await Post.findOne({_id:reqID}).exec();
    res.render('post',{post:strPost});
})


app.post("/compose",async function(req,res){
    const postTitle=req.body.newPostTitle;
    const postContent=req.body.newPostContent;
    let post=new Post({
        postTitle:postTitle,
        postContent:postContent
    })
    await post.save()
    res.redirect("/")
})

app.post("/post",async function(req,res){
    const reqID=req.body.deleteBtn;
    await Post.deleteOne({_id:reqID})
    res.redirect("/")
})


app.listen(PORT,function(){
    console.log("Server started at port 3000...")
})
