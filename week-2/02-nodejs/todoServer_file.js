/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
  const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require("fs");
  
  const app = express();
  
  app.use(bodyParser.json());

  // 1) GET /todos
  app.get('/todos',(req,res)=>{
    fs.readFile('./todos.json',"utf-8",(err,data)=>{
        res.status(200).json(JSON.parse(data));         //Parse the string(bcoz of utf-8) to 
    })
  })

  // 2) GET /todos/:id
  app.get('/todos/:id', (req,res)=>{
    fs.readFile('./todos.json',"utf-8",(err,data)=>{
        const todos = JSON.parse(data);

        let req_todo = todos.filter((obj)=>{
            if(obj.id === parseInt(req.params.id)) return true;
            else false;
          })
          //.find can also be used instead of .filter
      
          if(req_todo.length == 0){
            res.status(404).send();
          }
          else{
            res.status(200).json(req_todo[0]);
          }
    })
  })

    // 3) POST /todos
    app.post('/todos', (req,res)=>{
        fs.readFile('./todos.json',"utf-8",(err,data)=>{
            let todos = JSON.parse(data);

            const newId = Math.floor(Math.random() * 100);
            const newTodo = {
            id: newId,
            title: req.body.title,
            description:req.body.description
            }
            todos = [...todos, newTodo];

            fs.writeFile('./todos.json',JSON.stringify(todos),(err)=>{
                res.status(201).json({id : newId});
            })
        })
        // let todos = await fs.readFile('./todos.json',"utf-8");
        // todos = JSON.parse(todos);

        // const newId = Math.floor(Math.random() * 100);
        // const newTodo = {
        // id: newId,
        // title: req.body.title,
        // description:req.body.description
        // }
        // todos = [...todos, newTodo];

        // await fs.writeFile('./todos.json',JSON.stringify(todos));
        // res.status(201).json({id:newId});
    })

    // 4) PUT /todos/:id
    app.put('/todos/:id',(req,res)=>{
        fs.readFile('./todos.json',"utf-8",(err,data)=>{
            let todos = JSON.parse(data);

            const todo = todos.find((obj)=>{
                return obj.id === parseInt(req.params.id);
              })
          
              if(!todo) {
                res.status(404).send();
              }
              else{
                todo.title = req.body.title;
                todo.description = req.body.description;
              }

              fs.writeFile('./todos.json',JSON.stringify(todos),(err)=>{
                res.status(200).json(todo);
            })
        })
      })

  // 5) DELETE /todos/:id
  app.delete('/todos/:id',(req,res)=>{
    fs.readFile('./todos.json',"utf-8",(err,data)=>{
        let todos = JSON.parse(data);

        const index = todos.findIndex((obj)=>{
            return obj.id === parseInt(req.params.id);
          })
      
          if(index == -1)
          {
            res.status(404).send();
          }
          else{
            todos.splice(index,1);
          }
          fs.writeFile('./todos.json',JSON.stringify(todos),(err)=>{
            res.status(200).send();
        })
    })
  })

    // 6) Give error for any other route
    app.use((req, res, next) => {
        res.status(404).send('Inexistent route accessed');
    });

    module.exports = app;
