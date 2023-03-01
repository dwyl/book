# Create The New `Auth` Phoenix Project

In an empty working directory,
using the 
[`mix phx.new`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.New.html)
generator,
create a new `Phoenix` project
called "auth":

```sh
mix phx.new auth
```

That will create a bunch of files.
Most of them are "boilerplate" code 
for configuring the `Phoenix` project
and a load of `components`.
We will use some of them and `delete`
the rest. 


## Run the `Phoenix` App

Once the dependencies are installed,
run the following command in your terminal: 

```sh
mix setup
```

Once everything is setup,
run the `Phoenix` app 
with the command:

```sh
mix phx.server
```

Open your web browser to: 
`http://localhost:4000`

You should see something similar to the following: 

![default-phoenix-homepage](https://user-images.githubusercontent.com/194400/221915847-cfd297f0-52ab-46f2-8e0a-bd58abad971a.png)

## Run the Tests

Just to confirm everything is working,
run the tests with the following command:

```sh
mix test
```

You should see output similar to the following:

```sh
Compiling 4 files (.ex)
Generated auth app
.....
Finished in 0.1 seconds (0.05s async, 0.05s sync)
5 tests, 0 failures

Randomized with seed 50114
```

With that out of the way,
let's build!