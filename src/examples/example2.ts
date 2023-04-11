import * as express from "express";
import flash = require('express-flash');
import * as session from "express-session";
import * as passport from "passport";
import * as passport_local from "passport-local";
import * as bcrypt from "bcrypt";
import { Config } from "../config";

interface User {
  id: number;
  username: string;
  password: string;
}

export class Example2 {
    run() {
      const httpconf = Config.getInstance().get()["portal"];
      const port : number = httpconf ["port"];
      const app = express();
      const LocalStrategy = passport_local.Strategy

      // 設定中介軟體.
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false
      }));
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(flash());

      // 建立一個使用者資料庫.
      const users: User[] = [];
      // 這邊設置這個旗標的原因是因為，如果當第一次登入成功後
      var isPasswordValid:boolean = false;

      // 設定 Passport 使用 LocalStrategy.
      passport.use(new LocalStrategy(async (username, password, done) => {
        console.log(`username:${username}, password:${password}}`);
          try {
            const user: User = users.find(u => u.username === username);
            if (!user) {
              // 如果驗證失敗，回傳錯誤訊息 (資料庫找不到使用者).
              return done(null, false, { message: 'not find user on db.' });
            }

            // 解碼並比對驗證使用者密碼.
            isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(`isPasswordValid: ${isPasswordValid}`);
            if (!isPasswordValid) {
              // 如果驗證失敗，回傳錯誤訊息 (使用者名稱或密碼不正確).
              return done(null, false, { message: 'Incorrect username or password' });
            }

            // 如果驗證成功，回傳使用者資訊.
            return done(null, user);

          } catch (error) {
            return done(error);
          }
        }
      ));

      // 序列化使用者資訊，以便存到 session 中.
      passport.serializeUser(async (user:User, done) => {
        if(isPasswordValid) {
          console.log(`serializeUser =>`, user);
          done(null, user.id);
        }
      });

      // 反序列化使用者資訊，以便從 session 中取出.
      passport.deserializeUser(async (id, done) => {
        if(isPasswordValid) {
          console.log(`deserializeUser => id (${id})`);
          const user = users.find(u => u.id === id);
          console.log(user);
          done(null, user);
        } else {
          done(null, false);
        }
      });

      // 首頁: http://localhost:3000/
      app.get('/', (req, res) => {
        if (req.isAuthenticated()) {
          res.send('Hello ' + (req.user as User).username + '!');
        } else {
          const errorMsg = req.flash('error')[0];
          console.log(errorMsg);

          if (errorMsg) {
            res.send(errorMsg);
          } else {
            return res.send('Please login first');
          }
        }
      });

      // 註冊帳號: http://localhost:3000/register
      app.post('/register', async (req, res) => {
        try {
          // 從請求中取得帳號和密碼.
          const username = req.body.username;
          const password = req.body.password;
      
          // 檢查帳號是否已被註冊.
          var user: User = null;
          user = users.find(user => user.username === username);
          if (user) {
              return res.status(409).send('User already exists');
          }
      
          // 將密碼轉換成雜湊值.
          const hashedPassword:string = await bcrypt.hash(password, 10);
      
          // 儲存使用者資料到資料庫中.
          users.push({id:1, username: username, password: hashedPassword});
          console.log(`register =>`, users);

          res.status(201).send('User registered successfully');
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });

      // 登入頁: http://localhost:3000/login 
      app.post('/login', passport.authenticate('local', {
         failureRedirect: '/',
         failureFlash: true
         }), (req, res) => {
        console.log(`req.isAuthenticated(${req.isAuthenticated()})`);
        res.redirect('/profile');
      });

      // 登入頁: http://localhost:3000/loout 
      app.get('/logout', (req, res, next) => {
        req.logout(function(err) {
          if (err) { return next(err); }
          // 登出成功後的處理
          const errorMsg = req.flash('error')[0];
          console.log(errorMsg);

          if (errorMsg) {
            res.send(errorMsg);
          } else {
            return res.send('Please login first');
          }
        });
      });

      // 使用者資訊頁: http://localhost:3000/profile
      app.get('/profile', (req, res) => {
        const user = req.user as User;
        if (!user) {
          return res.send('Please login first');
        }

        res.send(`Welcome, ${user.username}`);
      });

      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    }
}