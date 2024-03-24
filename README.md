## Dokku + Let's Encrypt + Parse Server သွင်းနည်း

**၁) အောက်ပါ Command များကို ရိုက်ပြီး၊ ဤ [Link](https://dokku.com/docs/getting-started/installation/#installing-the-latest-stable-version) တွင် ဖော်ပြထားသည့်အတိုင်း Dokku ကို သွင်းပါ။**

```sh
sudo apt update
sudo apt upgrade -y
sudo reboot
```

**၂) App အသစ်ဖန်တီးရန် အောက်ပါ Command ကို ရိုက်ပါ။**

```sh
dokku apps:create parse-server-boilerplate
```

**၃) MongoDB သွင်းရန် အောက်ပါ Command ကို ရိုက်ပါ။**

```sh
sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo
```

**၄) MongoDB Database အသစ် ဖန်တီးပြီး၊ App ဖြင့် ချိတ်ဆက်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
dokku mongo:create parse-server-boilerplate-database
dokku mongo:link parse-server-boilerplate-database parse-server-boilerplate
```

**၅) Environment Variable များ သတ်မှတ်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
dokku config:set parse-server-boilerplate APP_ID=your_app_id MASTER_KEY=your_master_key
```

**၆) Deploy လုပ်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
git remote add dokku dokku@10.0.0.2:parse-server-boilerplate
git push dokku main
```

**၇) App နှင့် Domain ချိတ်ဆက်ရန် အောက်ပါ Command ကို ရိုက်ပြီး၊ သက်ဆိုင်ရာ A Record များအား သင့် Server ၏ Public IP သို့ ညွှန်ပြပါ။**

```sh
dokku domains:add parse-server-boilerplate parseserverboilerplate.com www.parseserverboilerplate.com
```

**၈) Let's Encrypt သွင်းရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku letsencrypt:cron-job --add
```

**၉) Let's Encrypt နှင့် App ချိတ်ဆက်ရန် အောက်ပါ Command များကို ရိုက်ပါ။**

```sh
dokku letsencrypt:set parse-server-boilerplate email admin@parseserverboilerplate.com
dokku letsencrypt:enable parse-server-boilerplate
```

---

ရေးသားသူ - [ကျော်စွာသွင်](https://www.facebook.com/profile.php?id=100005753280868)
