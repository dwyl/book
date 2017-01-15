# 100% Test Coverage? Why? What? How?

**Q**: What does it *mean* to have 100% test coverage?  
**A**: It means all the code in your project has been run/tested
at least once during your automated tests.

**Q**: Why does it *matter* to have 100% test coverage?  
**A**: If there is code in your project that you are not testing,
how do you know it's good? If you are not (*automatically*) checking
that everything still works as expected each time you add a new feature,
how can you be *confident* that everything still runs as expected?


**Most people** who are new to automated testing or have not *made* time
to learn TDD **don't realize** that ***testing is easy*** and having 100% test coverage is a bi-product of good discipline from the *start* of a project.

***By definition***, if you are writing tests ***first***
you will ***only write*** the code required ***to past the test***(*s*)

Achieving 100% test coverage is only an issue for a project that
has not been written with good discipline from the start.

We will cover strategies for how to [***retrofit***](http://en.wikipedia.org/wiki/Patch_(computing))
an existing project with tests later; lets focus on learning a few fundamentals first.
