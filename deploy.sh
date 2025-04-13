#!/usr/bin/env sh

# en cas d'erreur
set -e

# build
npm run build

# aller dans le dossier de build
cd dist

# placer un .nojekyll pour contourner le processus Jekyll
touch .nojekyll

# si vous déployez vers un domaine personnalisé
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# si vous déployez vers https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# si vous déployez vers https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Saloquin/Pomodoro_vue.git main:gh-pages

cd -