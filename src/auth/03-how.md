# How To Build `Auth` From First Principals

For the past 2 iterations,
we have use the `Phoenix` Web Application framework
to build our `Auth` system.
The reasons for this choice
are outlined in:
[dwyl/**technology-stack**#**phoenix**](https://github.com/dwyl/technology-stack#phoenix)
so won't be repeat it here.
`Phoenix` is a "batteries included" framework
that includes _many_ features out-of-the-box.

Our **`Auth` system** is a **standalone `Phoenix` instance**
that has its' own **_separate_ database**.
This is a very _deliberate_ choice.
We want to enforce a _complete_ 
[**separation of concerns**](https://en.wikipedia.org/wiki/Separation_of_concerns)
between `Auth` 
and the `App` that _uses_ `Auth`.

@TODO: insert diagram illustrating relationship between `Auth` and `App`.



Beyond the security benefits 
of separating `Auth` 
the practical rationale is simple:
the code for building an `Auth` system 
is 
[`~3kloc`](https://en.wiktionary.org/wiki/KLOC#Noun)
see: 
[wikipedia.org/Source_lines_of_code](https://en.wikipedia.org/wiki/Source_lines_of_code)
If we include all the `Auth` code in our main `App`
it adds to the **complexity** of the `App`
and thus increase the time 
it takes someone to
[grok](https://en.wikipedia.org/wiki/Grok).
The longer it takes people to _understand_ the `App` code 
the less likely they are to _contribute_ to the `App`.

> **Note**: we are _not_ suggesting 
that people should not _also_ 
`try` to understand what `Auth` is doing. 
On the contrary we want as many people as possible 
to understand all aspects of our stack.
However we acknowledge that `Auth`
and "People Management" 
is not the most _interesting_ part of the stack.
It's akin to the "plumbing" in your home.
Absolutely necessary 
and needs to function _flawlessly_.
But not something you _actively_ think about
unless there's something that isn't working as expected ... 