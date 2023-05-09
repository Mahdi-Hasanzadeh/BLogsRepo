# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

#if you are deploying to a custom domain
#echo 'www.example.com' > CNAME

git init
git checkout -B amin
git add -A
git commit -m 'deploy'

#if you are deploying to https://<USERNAME>.github.io
#git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

#if you are deploying to https://<USERNAME>.github.io/<REPO>
#git push -f git@github.com:Mahdi-Hasanzadeh/Blogs.git main:gh-pages

cd-