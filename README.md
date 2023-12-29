# AcidiLabs Pharma IMS - V1
# Basic CRUD 
------------------------------------------------------------------
# HOW TO RUN

## cd api-server (backend) > `npm i`
## cd public-client (frontend) > `npm i --legacy-peer-deps`
## cd resources-server (backend) > `npm i`

## `npm start` for each destination 
------------------------------------------------------------------
# HOW TO DEPLOY TO RENDER AND VERCEL

#  ----- BACKEND -----
## Login to render.com > Go to Dashboard > Create New Web Service > Build and deploy from a Git Repository >
## Connect Repository > Provide Name > Set Region > Choose Branch > Type in the Root Directory (./api-server) >
## Make sure Runtime is set to "Node" > Build Command to "npm install" > Start Command to "npm start" > 
## Select instance type > Set Environment Variables to (NAME_OF_VARIABLE : "VALUE") and (JWT_SECRET : "VALUE") > 
## Create Web Service 

#  ----- FRONTEND -----
## Login to vercel.com > Go to Dashboard > Add New Project > Import from Git Repository >
## Set Project Name > Set Root Directory (./public-client) > Set Build Command to "react-scripts build" >
## Install Command to "npm install --legacy-peer-deps" > Click Deploy

# After Deploying both Front-End and Backend

# ----- Configure Cross Origin Resource Sharing (CORS) -----
## >> Backend: api-server > config > cors.config.js
## add your frontend's domain to whitelist (found on Vercel Dashboard on deployments)

## >> Frontend: public-client > src > config > config.js
## >> add your backend's domain to whitelist (can be found on Render Dashboard on deployments)

------------------------------------------------------------------
### Default Credentials
### username: admin
### password: 123456
