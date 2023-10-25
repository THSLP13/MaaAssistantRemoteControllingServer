# MaaRemoteControllingServer
A backend and frontend server for MAA(MaaAssistantArknights) remote controlling feature  
一个为了MAA的远程控制功能编写的前后端  

[ Original Project | 源工程 ](https://github.com/MaaAssistantArknights/MaaAssistantArknights)  

文档仓促写成，有误还请指正. 
Document wrote in hurry,raise issues if there is any wrong. 

Based on NodeJS 20 | 基于NodeJS 20 

## Usage 使用方法  
Clone the repository  
Edit maaBackend.js  
Change "**Your**" to fit your conditions.  
`var privateKey  = fs.readFileSync('./cert/Your.key', 'utf8');`  
`var certificate = fs.readFileSync('./cert/Your.crt', 'utf8');`  
Then use your Node to launch this JS file.The server should start then.  
You may change the PORT and SSLPORT to other values.But remember maa only use HTTPS.  

## Help me!
I'm not good at writing JS and HTML.  
Yet this project only spend me 6 hour.  
Any support to me is further needed.  

## About me
Nope...
