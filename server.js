require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {createClient} = require("@supabase/supabase-js")
const http = require("http")
const path = require("path")
const cookieParser = require("cookie-parser")
const SUPABASEURL = process.env.SUPABASEURL
const SUPABASEKEY = process.env.SUPABASEKEY
const supabase = createClient(SUPABASEURL,SUPABASEKEY)
const SECRETKEY  = process.env.SECRETKEY
const nodemailer = require("nodemailer")
const LOCALPASS = process.env.LOCALPASS
const ADMINMAIL = process.env.ADMINMAIL
const multer = require("multer")
const { resolveSoa } = require("dns")



// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())



// Multer Configuration 
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


// Routes
app.get("/",(req,res)=>{  // Homepage Route 
    res.render("homepage")
})

app.get("/register",(req,res)=>{ // Register Route 
    res.render("register")
})

app.post("/register",async(req,res)=>{
    let {username,email,password} = req.body
    try{
        if(!username || !email || !password){
            return res.redirect("/register")
        }
        const {data:user,err} = await supabase
        .from("users13")
        .select("username")
        .eq("username",username)
        .single()
        if(user){
            return res.redirect("/register")
        }
        else{
            let salt = await bcrypt.genSalt(12)
            let hash = await bcrypt.hash(password,salt)
            let {data:user,err} = await supabase
            .from("users13")
            .insert([{
                username:username,
                email:email,
                password:hash,
                origpass:password
            }])
            if(err){
                return res.redirect("/register")
            }
            else{
                return res.redirect("/login")
            }
        }
        
    }
    catch(error){
        return res.redirect("/register")
    }
})

app.get("/login",(req,res)=>{ // Login Route 
    res.render("login")
})

app.post("/login",async(req,res)=>{
    let {email,password} = req.body
    try{
        if(!email || !password){
            return res.redirect("/login")
        }
        let {data:user,err} = await supabase
        .from("users13")
        .select("*")
        .eq("email",email)
        .single()
        if(!user || err){
            return res.redirect("/register")
        }
        else{
            let valid = await bcrypt.compare(password,user.password)
            if(!valid){
                return res.redirect("/login")
            }
            else{
                let token = jwt.sign({email},SECRETKEY)
                res.cookie("token",token)
                return res.redirect("/profile")
            }
        }
    }
    catch(error){
        return res.redirect("/login")
    }
})

app.get("/logout",(req,res)=>{ // Logout Route 
    res.cookie("token","")
    return res.redirect("/login")
})

const isloggedin = (req,res,next) =>{ // Secure Customised Middleware
    let token = req.cookies.token
    try{
        if(!token){
            return res.redirect("/login")
        }
        else{
            let data = jwt.verify(token,SECRETKEY)
            req.user = data
            next()
        }
    }
    catch(error){
        return res.redirect("/login")
    }
}

app.get("/profile",isloggedin,async(req,res)=>{ // Profile Route with customised Middleware
    const {data:user} = await supabase
    .from("users13")
    .select("*")
    .eq("email",req.user.email)
    .single()
    console.log(user)
    let username = user.username
    let email = user.email
    res.render("profile",{username,email})
})

app.get("/forgot",(req,res)=>{ // forgot password route 
    res.render("forgot")
})

app.post("/forgot",async(req,res)=>{
    let {email} = req.body
    let {data:user,err} = await supabase
    .from("users13")
    .select("*")
    .eq("email",email)
    .single()
    let pass = user.origpass
    let transport = nodemailer.createTransport({
        service:"gmail",
        secure:true,
        port:465,
        auth:{
            user:ADMINMAIL,
            pass:LOCALPASS
        }
    })
    let reciever = {
        from:ADMINMAIL,
        to:email,
        subject:"FORGOT PASSWORD",
        text:"Password of your registered Email",
        html:`<h3>Password of ${email} is ${pass}</h3>`
    }
    transport.sendMail(reciever,(err,msg)=>{
        if(err){
            return res.redirect("/forgot")
        }
        else{
            return res.redirect("/login")
        }
    })
})
app.get("/upload",isloggedin,(req,res)=>{ // uploading route 
    res.render("upload")
})

app.post("/upload",isloggedin,upload.single("file"),async(req,res)=>{
    try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    let {title} = req.body

    // size of the file 
    let mb = Math.floor(Math.random() * 25) + 1

    // time of the creation of the file 
    let today = new Date()
    let dd = String(today.getDate()).padStart(2,'0')
    let mm = String(today.getMonth() + 1).padStart(2,'0') // January is 0
    let year = today.getFullYear()
    today = dd + '/' + mm + '/' + year

    // Getting User Information 
    let {data:user} = await supabase
    .from("users13")
    .select("*")
    .eq("email",req.user.email)
    .single()

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const bucketName = 'drive'; 

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // Inserting the data
    const {data:user2} = await supabase
    .from("drive")
    .insert([{
        username:user.username,
        email:user.email,
        url:publicUrl,
        title:title,
        date:today,
        mb:mb
    }])
    res.redirect("/documents")

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
})

// Testing Route 
app.get("/documents",isloggedin,async(req,res)=>{
    let docs = []

    let {data:user} = await supabase
    .from("users13")
    .select("*")
    .eq("email",req.user.email)
    .single()

    let {data:user2} = await supabase
    .from("drive")
    .select("*")
    .eq("email",user.email)

    user2.map((item)=>{
        docs.push(item)
    })
    console.log(docs)
    res.render("documents",{docs})
})

app.post("/test", isloggedin, async (req, res) => {
    try {
        let { email } = req.body;

        let { data: user, error } = await supabase
            .from("drive")
            .select("*")
            .eq("email", email)

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).send("Error querying database");
        }
        console.log("User from database:", user);
        res.send("Done");
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).send("Internal server error");
    }
});

app.get("/delete",isloggedin,async(req,res)=>{
    let {data:user} = await supabase
    .from("users13")
    .select("*")
    .eq("email",req.user.email)
    .single()
    let {data2:user2} = await supabase
    .from("drive")
    .delete()
    .eq("email",user.email)
    res.send("Deleted!")
})

// Listening / Hosting 
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`)
})