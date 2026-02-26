@echo off
echo Adding environment variables to Vercel...

echo.
echo Adding DB_TYPE...
echo postgres | vercel env add DB_TYPE production

echo.
echo Adding DB_HOST...
echo aws-1-ap-northeast-2.pooler.supabase.com | vercel env add DB_HOST production

echo.
echo Adding DB_PORT...
echo 6543 | vercel env add DB_PORT production

echo.
echo Adding DB_NAME...
echo postgres | vercel env add DB_NAME production

echo.
echo Adding DB_USER...
echo postgres | vercel env add DB_USER production

echo.
echo Adding DB_PASSWORD...
echo uHzPV7WLRRQoBfvs | vercel env add DB_PASSWORD production

echo.
echo Adding NODE_ENV...
echo production | vercel env add NODE_ENV production

echo.
echo All environment variables added!
echo Now deploying to Vercel...
echo.

vercel --prod

pause
