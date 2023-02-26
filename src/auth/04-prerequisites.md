# Prerequisites

Before you start building `auth`,
ensure that you have the following on your computer:

## Latest `Elixir`

In your terminal,
run the following command:


```sh
elixir -v
```

You should see output similar to the following:

```sh
Erlang/OTP 25 [erts-13.1.4] [source] [64-bit] [smp:10:10] [ds:10:10:10] [async-threads:1] [jit] [dtrace]

Elixir 1.14.3 (compiled with Erlang/OTP 25)
```

This is the latest and greatest version 
of `Elixir` and `OTP`
at the time of writing. 

> **Note**: if you have a _later_ version,
> please consider creating a `Pull Request` 
> to update this section of the book. 

## _Latest_ `Phoenix`

Visit: 
[github.com/phoenixframework/phoenix/tags](https://github.com/phoenixframework/phoenix/tags)
to remind yourself 
of what the most recent version of `Phoenix` is.
I our case, `v1.7.0` was published 
[_yesterday_](https://phoenixframework.org/blog/phoenix-1.7-final-released). 🎉
So that's what we are using.

Confirm that you have the latest version of `Phoenix`
by running the command:

```sh
mix phx.new -v
```

You should see something similar to:

```sh
Phoenix installer v1.7.0
```

> **Note**: if the version of `Phoenix` you are using
> is more recent than this, 
> please help us to update our docs:
> 


If you don't already have 
the latest version of `Phoenix`,
run the command: 

```sh
mix archive.install hex phx_new
```


## `PostgreSQL` Server


