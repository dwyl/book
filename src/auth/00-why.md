# Why _Custom_ Build Auth?

After a couple of decades of writing code
and _studying_ 30+ CMS/Frameworks 
& Enterprise Auth providers
we concluded 
that all the Authentication/Authorization
systems are still **_way_ too complex**
and required **_far_ too many steps**.

Rather than lock ourselves into 
something complex and then 
be stuck with slow/no progress,
we decided to build something from scratch
that would allow us to **move _much_ faster**
in the _long_ run.

We have documented _all_ the steps taken
in creating our `auth` system.
The code is well tested and maintained
so _anyone_ can read how it all works.

## The Best Way to _Understand_ Something is to _Build_ It!

We _encourage_ anyone interested
in _understanding_ 
how things work behind the scenes
to read through the `auth` chapters.
We've attempted to include _all_ the steps
we took so that anyone can grok it.

However we know this is not the most _exciting_ 
part of the application stack. 
If you prefer to skip the `auth` section entirely,
you can just _use_ it 
and treat it as a "service" that "Just Works<sup>TM</sup>"
and only refer to specific parts when needed.

## Why _Re-build_ `Auth`?

We learned a _lot_ from building our `first` version
of `auth` in `Elixir`.
Our "Version 1" has been working in production for several years
and thousands of people have used it successfully.
The UI/UX for the "end-user" is fine;
it's _fast_ and already does what we need.
We aren't going to change what the `person` _using_ `auth`
see very much in the next iteration.
What is **_not_ fine** is the _maintainability_ 
and thus _extensibility_ of the project.
We recently saw this when we tried 
to add a `new` feature to `auth`,
but we saw `Ecto` constraint errors.  