if(process.env.NODE_ENV == "production"){
    module.exports = {mongoUri: "mongodb+srv://haroldo:lucasgay123@blogappcluster-ukfsf.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoUri: "mongodb://localhost/blogapp"}
}