## Dokku + Let's Encrypt + Parse Server သွင်းနည်း

**၁) အောက်ပါ Command များကို ရိုက်ပြီး၊ ဤ [Link](http://dokku.viewdocs.io/dokku/) တွင် ဖော်ပြထားသည့်အတိုင်း Dokku ကို သွင်းပါ။**

```sh
$ sudo add-apt-repository ppa:nginx/stable
$ sudo apt-get update
```

**၂) App အသစ်ဖန်တီးရန် အောက်ပါ Command ကို ရိုက်ပါ။**

```sh
$ dokku apps:create parse-server-boilerplate
```

**၃) MongoDB သွင်းရန် အောက်ပါ Command ကို ရိုက်ပါ။**

```sh
$ sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo
```

**၄) MongoDB Database အသစ် ဖန်တီးပြီး၊ App ဖြင့် ချိတ်ဆက်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
$ dokku mongo:create parse-server-boilerplate-database
$ dokku mongo:link parse-server-boilerplate-database parse-server-boilerplate
```

**၅) Environment Variable များ သတ်မှတ်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
$ dokku config:set parse-server-boilerplate APP_ID=your_app_id MASTER_KEY=your_master_key SERVER_URL=https://www.parse-server-boilerplate.com/parse
$ dokku config:set parse-server-boilerplate S3_BUCKET=parse-server-boilerplate AWS_ACCESS_KEY_ID=your_aws_access_key_id AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
$ dokku config:set parse-server-boilerplate MAILGUN_API_KEY=your_mailgun_api_key MAILGUN_DOMAIN=mg.parse-server-boilerplate.com
```

**၆) Deploy လုပ်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
$ git remote add dokku dokku@parse-server-boilerplate.com:parse-server-boilerplate
$ git push dokku master
```

**၇) App နှင့် Domain ချိတ်ဆက်ရန် အောက်ပါ Command ကို ရိုက်ပြီး၊ သက်ဆိုင်ရာ A Record များအား သင့် Server ၏ Public IP သို့ ညွှန်ပြပါ။**

```sh
$ dokku domains:add parse-server-boilerplate parse-server-boilerplate.com www.parse-server-boilerplate.com
```

**၈) Let's Encrypt သွင်းရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
$ sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
$ dokku letsencrypt:cron-job --add
```

**၉) Let's Encrypt နှင့် App ချိတ်ဆက်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
$ dokku config:set --no-restart parse-server-boilerplate DOKKU_LETSENCRYPT_EMAIL=admin@parse-server-boilerplate.com
$ dokku letsencrypt parse-server-boilerplate
```

---

ရေးသားသူ - [ကျော်စွာသွင်](https://www.facebook.com/profile.php?id=100005753280868)
