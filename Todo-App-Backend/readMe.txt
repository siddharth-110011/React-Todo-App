What does this following lines do?
const express = require('express');
const app = express();

const express = require('express');

The require('express') function loads the Express module so that you can use 
its features. The returned value is assigned to the variable express.

const app = express();

This line creates a new instance of an Express application. The express() 
function is a top-level function exported by the Express module.

The app variable now holds this Express application instance, which 
represents your web server.

You'll use this app instance to configure routes, middleware, and other 
settings for your web server.

--------------------------------------------------------

What is require('path') and why we need it?

require('path') in Node.js to access the functionality provided by the 
built-in path module. The path module is essential for working with file 
and directory paths in a platform-independent manner.

--------------------------------------------------------

What is middleware?
Middleware functions are functions that have access to the request object 
(req), the response object (res), and the next middleware function in the 
application’s request-response cycle. The next middleware function is 
commonly denoted by a variable named next.

Middleware functions can perform the following tasks:

Execute any code.
Make changes to the request and the response objects.
End the request-response cycle.
Call the next middleware function in the stack.
If the current middleware function does not end the request-response cycle, 
it must call next() to pass control to the next middleware function. 
Otherwise, the request will be left hanging.

An Express application can use the following types of middleware:
Application-level middleware
Router-level middleware
Error-handling middleware
Built-in middleware
Third-party middleware

--------------------------------------------------------

What is Router in express?
A router object is an isolated instance of middleware and routes. 
This means that you can use router objects to define middleware and routes 
in a modular and organized way, allowing you to group related routes together 
and encapsulate functionality.


You can think of it as a “mini-application,” capable only of performing 
middleware and routing functions. Every Express application has a built-in 
app router.

A router behaves like middleware itself, so you can use it as an argument to 
app.use() or as the argument to another router’s use() method.

The top-level express object has a Router() method that creates a new router 
object.

Once you’ve created a router object, you can add middleware and HTTP method 
routes (such as get, put, post, and so on) to it just like an application.

--------------------------------------------------------
We are using multipleStatements: true property in mysql.createPool() so that 
we can pass multiple query to sql server while calling pool.query().

--------------------------------------------------------

Below is the resultset we get when we issue the query for retrieving the 
output parameter after calling a stored procedure.
[
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: '',
    serverStatus: 16394,
    warningStatus: 0,
    changedRows: 0
  },
  [ { added_todo_id: 103 } ]
]

--------------------------------------------------------

While generating todo_id for a user trying to add todo we use  
locking or rows mechanism provided by FOR UPDATE.

In SQL, FOR UPDATE is a locking clause used in a SELECT statement to lock 
the selected rows for update within a transaction. It is commonly used in 
scenarios where you want to prevent other transactions from modifying the 
selected rows until the current transaction is completed.

Note: Stored functions in SQL should ideally be deterministic, meaning they 
produce the same output for the same input parameters every time they are 
called. This property ensures predictability and reliability of the 
function's behavior and is crucial for maintaining data consistency and 
integrity in the database.

That's why we did not use Stored functions for generating todo_id.

