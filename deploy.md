# Instructions for Safely Deploying Passage Master

1. In root folder: find/replace localhost:8081 -> passagemaster.com
2. In pm-app/src/app/main.ts comment out lines 5 and 6 (enabling prod mode)
3. Go to the pm-app folder and run `ionic build browser`.
4. Go to the root folder and commit any changes to git.
5. Run `git push heroku master`.
6. Wait a bit, then test it in the browser [here](http://passagemaster.com).
7. You're done!!