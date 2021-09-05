## Useful tutorials for heroku deployment  
- https://www.bezkoder.com/deploy-node-js-app-heroku-cleardb-mysql/#Deploy_the_app_to_Heroku
- https://lo-victoria.com/build-a-mysql-nodejs-crud-app-4-deploying-to-heroku-finale

## Useful heroku commands  
    - git push heroku main
    - heroku run bash - opens a bash shell on deployed remote
        - subsequent shell can be used to run npm scripts on the remote
    

## Useful Mysql commands  

    -Opening a mysql shell from terminal to run local scripts on remote heroku db
        1: heroku config -> get CLEARDB_DATABASE_URL or JAWSDB_URL
        using the returned database config details, run the schema.sql sql script
        2:mysql --host=us-cdbr-east.cleardb.com --user=xxxx --password=xxxx --reconnect heroku_xxxxxx < schema.sql
        -https://stackoverflow.com/questions/30907583/how-to-create-a-mysql-schema-when-deploying-with-heroku-express-server

    - SHOW GRANTS
        Shows the access rights granted to the user
        returns: GRANT USAGE ON *.* TO '<<lsdj234>>'@'%' IDENTIFIED BY PASSWORD '*asfe4545235' WITH     MAX_QUERIES_PER_HOUR 3600 MAX_USER_CONNECTIONS 10 |
            | GRANT ALL PRIVILEGES ON `heroku_ljl4455lkj`.* TO '<<lsdj234>>'@'%' 


## Helpful Tips  
    - Heroku deployments using clearDB:infinite create a default database and set it to be used. You can't create your own database, nor can you delete a database so don't bother running a schema script that resets the database
    - Sequelize auto_increment appears to increment the id in a non typical way for a heroku instance compared to a local instance (unknown reason) so instead of id:1,2,3,4,5 you are auto assigned id values of id:5, 15, 25, 35, 45 etc. Note this strange pattern for any seeding you do as the id's need to match these 5 multiple id's for any foreign keys. i.e

        {
            "content":"I love full stack",
            "post_id":1,
            "user_id":3
        },

    maps to  

        {
        "content":"I love full stack",
        "post_id":5,
        "user_id":15
    },

    since post_id and user_id are refering to fields that are auto_generated and as such follow the above mentioned pattern for heroku seeding

## Initial remote deployment process  
1: Confirm start script and node engine in package.json  

    "scripts":{
        "start":"node server.js"
    },
    "engines":{
        "node": "16.6.1"
    }
2: Create a procfile for heroku to know what to run on web startup  

    Procfile -> web:node server.js
3: Create the new heroku app with a unique name  

    ->heroku create fonyx-tech-blog
4: Push repo to heroku app  

    ->git push heroku main
5: Create a mysql instance inside the deployment using cleardb:ignite
    Note that you will need a credit-card verified profile to add this addon despite it being free  

    ->heroku addons:create cleardb:ignite
6: Get the database_url and details from teh heroku configured environment  

    ->heroku config | findstr CLEARDB_DATABASE_URL
    mysql://<user>:<password>@<host>/<database>?reconnect=true -<
7: either set the parameters user, password, host, database into the environment as 4 parameters   
    
    ->heroku config:set DB_USER=<user>
    ->heroku config:set DB_PASSWORD=<password>
    ->heroku config:set DB_HOST=<host>
    ->heroku config:set DB=<database>
or add a new parameter for the 'JAWSDB_URL' referred to in the connection file as an environment variable

    ->heroku config:set JAWSDB_URL=mysql://<user>:<password>@<host>/<database>?reconnect=true
I also set the 'CLEARDB_DATABASE_URL' to the same string if I do this second method

    ->heroku config:set CLEARDB_DATABASE_URL=mysql://<user>:<password>@<host>/<database>?reconnect=true

8: Run the heroku seeds (modified for the 5 factor auto_increment **ahem** quirk)

    ->heroku run bash
    ->npm run seed-heroku


