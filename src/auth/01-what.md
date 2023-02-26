# What Are We Building?

We are building a **_complete_ authentication system 
that _anyone_ can use
to protect the personal data 
of the `people` using an `App`.

While we are starting from scratch 
with zero code,
we aren't working in a vacuum 
or blinkered/blindfolded.
We have build `auth`
before in `PHP`, `Python`
[`JavaScript/TypeScript`](https://github.com/dwyl/hapi-auth-jwt2)
and most recently 
`Elixir`
and have _used_
and _studied_
several `auth` systems.
This is an 
[otaku](https://en.wiktionary.org/wiki/otaku)
for us;
an obsession
not just a side-project.
If you feel that the `UI/UX` 
of authentication is one 
of the most important aspects
of building any App,
please read on. 


## Starting Point?

As noted above,
we are starting from scratch
so there is zero "baggage" or "legacy",
but we are _informed_ by our previous iteration of `auth`. 

Let's start by picking holes in our previous design.

> **Note**: the objective of analysing our _own_ code/design
is not "criticism",
it's _reflection_, _learning_ and _continuous improvement_. 


### _Old_ Databse Entity Relational Diagram (ERD)

This is the ERD of the _old_ version of `auth`:

<img width="1177" alt="image" src="https://user-images.githubusercontent.com/194400/218709796-0ef83fd1-7e20-4c95-8817-76598ca0f1f7.png">

If this diagram looks "complicated" to you right now,
don't worry, we _agree_! 
We're only sharing it here as a _reference_.
It is not the "goal" to recreate this.
Rather, our objective is to _simplify_ it
and remove any tables that we don't _need_.
For example: 
we will remove the 
`tags`, `status`, `roles`
tables from the database
and instead define these exclusively in code.
The reasoning is simple:
this data does not change very often.
So having it in `Postgres` and forcing
a join for every query that requires the data
is immensely resource-wasteful.

Yes, the database purists would say:
"all data should be in the database".
And "old us" would _agree_ with that
[dogma](https://en.wikipedia.org/wiki/Dogma).
But what we've discovered in _practice_,
is that we can define _metadata_
in code and _significantly_ 
improve both reasoning about the entity relationships
and query performance.
