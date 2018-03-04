## Dokku + Let's Encrypt + Parse Server သြင္းနည္း

**၁) ေအာက္ပါ Command မ်ားကို ႐ိုက္ၿပီး၊ ဒီ [Link](http://dokku.viewdocs.io/dokku/) တြင္ ေဖာ္ျပထားသည့္အတိုင္း Dokku ကို သြင္းပါ။**

    sudo add-apt-repository ppa:nginx/stable
    sudo apt-get update

**၂) App အသစ္ဖန္တီးရန္ ေအာက္ပါ Command ကို ႐ိုက္ပါ။**

    dokku apps:create parse-server-boilerplate

**၃) MongoDB သြင္းရန္ ေအာက္ပါ Command ကို ႐ိုက္ပါ။**

    sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo

**၄) MongoDB Database အသစ္ ဖန္တီးၿပီး၊ App ျဖင့္ ခ်ိတ္ဆက္ရန္ ေအာက္ပါ Command မ်ားကို ႐ိုက္ပါ။**

    dokku mongo:create parse-server-boilerplate-database
    dokku mongo:link parse-server-boilerplate-database parse-server-boilerplate

**၅) Environment Variable မ်ား သတ္မွတ္ရန္ ေအာက္ပါ Command မ်ားကို ႐ိုက္ပါ။**

    dokku config:set parse-server-boilerplate APP_ID=your_app_id MASTER_KEY=your_master_key SERVER_URL=https://www.parse-server-boilerplate.com/parse
    dokku config:set parse-server-boilerplate S3_BUCKET=parse-server-boilerplate AWS_ACCESS_KEY_ID=your_aws_access_key_id AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    dokku config:set parse-server-boilerplate MAILGUN_API_KEY=your_mailgun_api_key MAILGUN_DOMAIN=mg.parse-server-boilerplate.com

**၆) Deploy လုပ္ရန္ ေအာက္ပါ Command မ်ားကို ႐ိုက္ပါ။**

    git remote add dokku dokku@parse-server-boilerplate.com:parse-server-boilerplate
    git push dokku master

**၇) App ႏွင့္ Domain ခ်ိတ္ဆက္ရန္ ေအာက္ပါ Command ကို ႐ိုက္ၿပီး၊ သက္ဆိုင္ရာ A Record မ်ားအား သင့္ Server ၏ Public IP သို႔ ညႊန္ျပပါ။**

    dokku domains:add parse-server-boilerplate parse-server-boilerplate.com www.parse-server-boilerplate.com

**၈) Let's Encrypt သြင္းရန္ ေအာက္ပါ Command မ်ားကို ႐ိုက္ပါ။**

    sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
    dokku letsencrypt:cron-job --add

**၉) Let's Encrypt ႏွင့္ App ခ်ိတ္ဆက္ရန္ ေအာက္ပါ Command မ်ားကို ႐ိုက္ပါ။**

    dokku config:set --no-restart parse-server-boilerplate DOKKU_LETSENCRYPT_EMAIL=admin@parse-server-boilerplate.com
    dokku letsencrypt parse-server-boilerplate

---

ေရးသားသူ - [ေက်ာ္စြာသြင္](https://www.facebook.com/profile.php?id=100005753280868)
