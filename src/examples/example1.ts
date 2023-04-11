import * as express from "express";
import flash = require('express-flash');
import * as session from "express-session";
import * as passport from "passport";
import * as passport_local from "passport-local";
import { Config } from "../config";

interface User {
  id: number;
  username: string;
  password: string;
}

export class Example1 {
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
      const users: User[] = [
        { id: 1, username: 'ricky', password: '1234' }
      ];

      // 設定 Passport 使用 LocalStrategy.
      passport.use(new LocalStrategy((username, password, done) => {
        console.log(`username:${username}, password:${password}}`);
        const user: User = users.find(u => u.username === username && u.password === password);
        if (user) {
          // 如果驗證成功，回傳使用者資訊.
          return done(null, user);
        } else {
          // 如果驗證失敗，回傳錯誤訊息.
          return done(null, false, { message: 'Incorrect username or password' });
        }
      }));

      // 序列化使用者資訊，以便存到 session 中.
      passport.serializeUser((user:User, done) => {
        console.log(`serializeUser =>`, user);
        done(null, user.id);
      });

      // 反序列化使用者資訊，以便從 session 中取出.
      passport.deserializeUser((id, done) => {
        console.log(`deserializeUser => id (${id})`);
        const user = users.find(u => u.id === id);
        done(null, user);
      });

      // 首頁: http://localhost:3000/
      app.get('/', (req, res) => {
        if (req.isAuthenticated()) {
          res.send('Hello ' + (req.user as User).username + '!');
        } else {
          const errorMsg = req.flash('error')[0];
          console.log(errorMsg);
          res.send(errorMsg);
        }
      });

      // 登入頁: http://localhost:3000/login  
      app.post('/login', passport.authenticate('local', {
         failureRedirect: '/',
         failureFlash: true
         }), (req, res) => {
        res.redirect('/');
      });

      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    }
}