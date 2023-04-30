# Markdown Blog using nodeJS
### Important Packages used:
  1. **[Showdown](https://github.com/showdownjs/showdown/wiki)** for the markdown part. 
  2. **Multer** for saving articles thumbnails in mongoDB as Base64.
  3. **Jsonwebtoken**(JWT) for user Authentication.
  
### How Does it work:
  - Explore all Articles and Authors profiles without an account.
  - Creating an account will give you the ability to write articles.
  - You can create articles with either plain text or even better a **markdown syntax** or html code.
    > Some HTML tags gets filterd automatically for security reasons.
  - Articles can be deleted or modified.
