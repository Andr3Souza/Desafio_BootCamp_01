const express = require("express");
const cors = require("cors");

const { uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next){
   const {id} = request.params;

   if(!isUuid(id)){
     return response.status(400).json({error: 'Invalid Id'});
   }

   return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repositorie = {id:uuid(), title, url, techs, likes:0}

  repositories.push(repositorie);

  return response.status(200).json(repositorie);
});

app.put("/repositories/:id",validateRepositorieId, (request, response) => {
  const {id} = request.params;
  const { title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error:'Id not found'});
  }
  
  repositories[repositorieIndex].title = title;
  repositories[repositorieIndex].url = url;
  repositories[repositorieIndex].techs = techs;

  return response.status(200).json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id",validateRepositorieId, (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error:'Id not found'});
  }else{
    repositories.splice(repositorieIndex, 1);
    return response.status(204).send();
  }


});

app.post("/repositories/:id/like",validateRepositorieId, (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error:'Id not found'});
  }

  repositories[repositorieIndex].likes ++;

  return response.status(200).json(repositories[repositorieIndex]);

});

module.exports = app;
