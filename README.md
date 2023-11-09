# Pantausuara

### Requirement
- Install [Node.js](https://nodejs.org/en/) 16 or above
- Install `Yarn` (`npm install --global yarn`) ^1.22.xx

<br/>

### How to run this project
- Clone the project:
```
git clone https://github.com/Sam7Man/pantausuara.git
```

<br/>

- Install dependencies
Make sure you are in the root project (same path with package.json):
```
npm install
```
or
```
yarn install
```

<br/>

- Run this command to create `.env` file :
```
cp .env.example .env
```
or create new `.env` file by running this command:
```
touch .env
```

<br/>

Adjust your `.env` file:
```
# GENERATE_SOURCEMAP=false

VITE_API_URL=API_URL_HERE_WITHOUT_QUOTATION_MARKS //example: http://temp-api.com
VITE_PASSWORD_KEY=VERY_LONG_CHARS
```

- Run the project in your localhost (default port :3030)
```
yarn dev
```


### You can customize the port as desired by editing the `vite.config.js` file.