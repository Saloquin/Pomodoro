@echo off
echo === Build du projet ===
npm run build

echo === Ajout du dossier dist à Git ===
git add dist -f

echo === Commit des changements ===
git commit -m "adding dist"

echo === Push vers gh-pages via subtree ===
git subtree push --prefix dist origin gh-pages

echo === Déploiement terminé ===
pause
