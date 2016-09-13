imap-to-facebook
================

A funny bot to send mails from an imap inbox to a Facebook group in french

# Use

Need these environment variables :

```
IMAP_SERVER
IMAP_USER
IMAP_PASSWORD
BUFFER_ACCESS_TOKEN
BUFFER_PROFILE
DEST_MAILS          # comma-separated list of emails to allow in the TO: field
```

```
npm install
heroku local # start
```

# Dev

```
gulp # run eslint and tests on change
```
