# ![](https://drive.google.com/uc?id=10INx5_pkhMcYRdx_OO4rXNXxcsvPtBYq) NodeJs - passport
> ##### 理論請自行找，網路上有很多相關的文章，這邊只關注於範例實作的部分.

<br>

<!--ts-->
## 目錄
* [簡介](#簡介)
* [使用套件](#使用套件)
* [操作說明](#操作說明)
* [切換範例](#切換範例)
* [延伸項目](#延伸項目)
* [參考資料](#參考資料)
* [備註](#備註)
<!--te-->

---
<br>

## 簡介
Passport 是一個 Node.js 的身份驗證中間件，可以快速且簡單地為應用程式添加身份驗證功能。<br>
它支持多種身份驗證策略，包括本地驗證、OAuth、OpenID 等，同時也支持自定義身份驗證策略。<br>
> 這次的實作，我們會搭配passport-local進行本地驗證來進行.
<br>

***使用Passport的簡易流程:***<br>
當使用passport.authenticate()進行第一次驗證的時候，<br>
則會跑到passport.use(new LocalStrategy((username, password, done)方法進行驗證. <br>
根據驗證的結果決定要怎麼使用Done來回傳結果.<br>
- 成功 - done(null, user); 將user這個資料傳下去.<br>
- 失敗 - done(null, false, { error_message}); 第二個欄位設定false並且回傳錯誤訊息. <br>

當第一次驗證成功後，則會跑到 passport.serializeUser((user:User, done) 將資料存在session中.<br>
當第二次驗證成功後，則會跑到 passport.deserializeUser((id, done) 將存在session中的資料直接拿出來使用.<br>
最後再回到 passport.authenticate() 根據其設定的failureRedirect來導向失敗的網頁，或著成功的網頁. <br>

<br>

實作範例:
- [Example1](https://github.com/RC-Dev-Tech/nodejs-passport/blob/main/src/examples/example1.ts) - passport + expres + express-session
- [Example2](https://github.com/RC-Dev-Tech/nodejs-passport/blob/main/src/examples/example2.ts) - passport + expres + express-session + bcrypt

---
<br>

## 使用套件.
- express
- express-flash
- express-session
- passport
- passport-local
- bcrypt

---
<br>

## 操作說明.
#### 1. 安裝套件[^1]
> npm install --save
#### 2. 編譯 & 運行
> npm run start

---
<br>

## 切換範例
> 編輯在app.json中的"exsample_mode"，填入的數字代表第幾個範例.

---
<br>

## 延伸項目
* [NodeJs 系列實作](https://github.com/RC-Dev-Tech/nodejs-index) <br>

---
<br>

## 參考資料
* [npmjs - passport](https://www.npmjs.com/package/passport) <br>
* [Github - passport](https://github.com/jaredhanson/passport) <br>
* [透過 Passport.js 實作驗證機制](https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E7%AD%86%E8%A8%98-%E9%80%8F%E9%81%8E-passport-js-%E5%AF%A6%E4%BD%9C%E9%A9%97%E8%AD%89%E6%A9%9F%E5%88%B6-11cf478f421e) <br>
* [使用Passport.js進行會員驗證](https://ithelp.ithome.com.tw/articles/10241907) <br>

---
<!--ts-->
#### [目錄 ↩](#目錄)
<!--te-->
---
## 備註：
[^1]: 在這個範例中我們需要安裝部分套件，指令如下：<br>
`npm install express --save` <br>
`npm install express-flash --save` <br>
`npm install express-session --save` <br>
`npm install passport --save` <br>
`npm install passport-local --save` <br>
`npm install bcrypt --save` <br>
因為這些套件已經有被安裝並整合在package.json中，所以這邊直接下**npm install --save**的指令就好