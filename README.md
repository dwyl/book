learn-mocha [WORK IN PROGRESS . . . *DONT READ* THIS *YET*!! :-]
===========

*Quick Guide* to **mocha.js** **T**est **D**riven **D**evelopment (TDD) / 
**B**ehaviour **D**riven **D**evelopment (BDD) in **node.js**

![Cowboy Coder](https://raw.github.com/nelsonic/learn-mocha/master/images/cowboy-coder.png "Cowboy Coder")

We all know *Cowboy Coders*. (*If you don't, its you!*) 

The "*I just get things done*" developer who writes "*quick fixes*" and 
maintains "*I don't have time to write tests*" or 
"*Writing tests for my code takes longer*" ... **Utter Nonsense**!

Code without tests is like a *building without a foundation*! 

![Building Collapse](https://raw.github.com/nelsonic/learn-mocha/master/images/building-collapse-940x627.jpg "Building Collapse")

Its only a matter of *time* before it all comes crashing down ...


Is Test Driven Development (TDD) a *silver bullet* for *all* my software
development woes? *Short answer*: **No**. 
There is a *lot* more that goes into writing *great* software than 
*just* having tests. But *without tests* reliability is *impossible*.


#### What is Mocha?

Mocha is a **JavaScript test framework** running on **node.js** 
*and* the **browser**.

![Mocha Logo](https://raw.github.com/nelsonic/learn-mocha/master/images/mocha-logo.png "Mocha Logo")

Made by [TJ Holowaychuk](https://twitter.com/tjholowaychuk) creator of 
[Express](https://github.com/visionmedia/express) (*by far* the *most popular* 
node.js web framework), Mocha is TJ's answer to the problem of testing JavaScript.

- Site: http://visionmedia.github.io/mocha/
- Code: https://github.com/visionmedia/mocha

#### Why Mocha?

- *Fast*. (300+ tests run in under a second)
- Get started in 5 minutes (*read on...*)
- Exceptionally **elegant** tests (*especially when written in CoffeeScript*)

At last count there were 83 testing frameworks *listed* on the node.js 
modules page: https://github.com/joyent/node/wiki/modules#wiki-testing 
this is *both* a problem (*too much choice* can be
*overwhelming*) and good thing (diversity means new ideas and innovative 
solutions can flourish).

There's no hard+fast rule for "*which testing framework is the best one*?"

Over the past 3 years I've tried: 
[Cucumber](https://github.com/cucumber/cucumber-js),
[Expresso](https://github.com/visionmedia/expresso)
[Jasmine](https://github.com/mhevery/jasmine-node), 
[Mocha](http://visionmedia.github.io/mocha/), 
[Nodeunit](https://github.com/caolan/nodeunit), 
[Should](https://github.com/visionmedia/should.js), and
[Vows](https://github.com/cloudhead/vows)

My criteria is simple: 

- Simplicity 
- Maturity ()
- Automatic Test Running when File Changes (using 
[Watchr](https://github.com/bevry/watchr)/[Grunt](http://gruntjs.com/))
- Easy to Trouble-shoot (Plenty of *Answered* Questions on 
[stackoverflow](http://stackoverflow.com/questions/tagged/mocha?sort=frequent&pageSize=15))


### Lets go!

#### Installation



### Notes

#### Other Mocha Tutorials/Background

- DailyJS Mocha: http://dailyjs.com/2011/12/08/mocha/
- Azat's Mocha Tutorial: http://webapplog.com/test-driven-development-in-node-js-with-mocha/
- NetTuts: http://net.tutsplus.com/tutorials/javascript-ajax/better-coffeescript-testing-with-mocha/
- Code Coverage: http://stackoverflow.com/questions/16633246/code-coverage-with-mocha


#### Further Reading

- Cost of Testing (Testing takes "*twice as long*" = Myth): http://googletesting.blogspot.co.uk/2009/10/cost-of-testing.html
- Estimating Testing Effort: http://stackoverflow.com/questions/1595346/estimating-of-testing-effort-as-a-percentage-of-development-time
- Technical Debt (Bad Code): http://jessewarden.com/2010/07/agile-chronicles-12-technical-debt.html
- Agile = an excuse for cowboys? Discussion: http://programmers.stackexchange.com/questions/11188/is-the-agile-approach-too-much-of-a-convenient-excuse-for-cowboys
    