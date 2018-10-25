const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);//C:\ranvir\Projects\NodeProjects\node-chat-app\public

const port = process.env.PORT || 3000;
var app = express();
app.use(express.static(publicPath));

var listener = app.listen(port,() =>{
  console.log(`Server is up and listening on port ${port}`);
});
