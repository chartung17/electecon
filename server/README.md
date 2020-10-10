#### Running the server: 
1. `cd` into `server` directory, and install dependencies: `npm i`
2. Create `.env` file in `server` folder and specify the following environment variables:

        # server/.env 
        
        HOST=                        # e.g. localhost, 127.0.0.1
        PORT=                        # default 5000
        DB_HOST=                     # e.g. db-endpoint.us-east-1.rds.amazonaws.com
        DB_PORT=                     # default 3306
        DB_USER=                     # username to log into MySQL
        DB_PASSWORD=                 # password to log into MySQL
        DB_DEFAULT_DATABASE=         # e.g. election
        DB_MAX_CONNECTIONS=          # e.g. 10

3. Then from inside the `server` folder, run `nodemon start`.
