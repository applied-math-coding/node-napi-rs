# node-napi-rs

This small repo presents a sample application for using napi-rs from within Node.js.<br>

It contains:<br>
1. An express REST-api that delegates computation requests to a Node.js extension built with napi-rs.<br>
2. A client for the browser that requests computations on a list of random generated data, that is, computation of longest increasing sequences.<br>
3. A SSE connection that inform the client when result as ready.<br>
4. A Postgres database that stores all results.<br><br>

The build process together with all napi-rs backed code is located within 'algorithms'.<br>
The entire build-process is documented within the Dockerfile.<br><br>

To run the application one can use docker-compose (see the related file).<br>
> docker-compose up<br><br>

Then, point the browser to<br>
http://localhost:3000/index.html

<br><br>
Since this is a sample app, the .env file together with all password is put into the repo as well.


