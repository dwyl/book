# Practical Full-Stack JavaScript Web Application Test Driven Development

A ***practical guide*** to ***Full Stack*** ***T***est ***D***riven ***D***evelopment (TDD) for people building ***robust*** **node.js** and **web / mobile** applications in teams!

[![Build Status](https://travis-ci.org/nelsonic/practical-js-tdd.svg?branch=master)](https://travis-ci.org/nelsonic/practical-js-tdd) [![Code Climate](https://codeclimate.com/github/nelsonic/practical-js-tdd.png)](https://codeclimate.com/github/nelsonic/practical-js-tdd)
<!-- [![devDependency Status](https://david-dm.org/nelsonic/practical-js-tdd/dev-status.svg)](https://david-dm.org/nelsonic/practical-js-tdd#info=devDependencies) -->


# *Why*? [![start with why](https://img.shields.io/badge/start%20with-why%3F-brightgreen.svg?style=flat)](http://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action)

We build web software applications for *many* reasons including:

+ share information
+ connect & communicate with our friends, colleagues & communities
+ buy/sell things
+ run organisations/businesses
+ manage all aspects of our lives (calendars, task/time trackers etc)
+ have fun (online games!)

We think it make sense for the apps we build to be *reliable*.
Do you agree?  
Reliability is (*only*) achieved by testing.


# *Who*? [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/nelsonic/practical-js-tdd/issues)


Unlike _most_ other books written by *one* person, *this* book has _**many contributors**_ and as such is the [_**Wisdom of the crowd**_](https://en.wikipedia.org/wiki/Wisdom_of_the_crowd). If you spot an issue/typo in the text/code or have a better idea (e.g. a simpler explanation for a topic/concept) _please post_ an [issue](https://github.com/nelsonic/practical-js-tdd/issues) (_thanks!_)



# *What*?

## "*Stack*"?

A "stack" is the term use to describe all the components involved in a web app. The more comprehensive definition is:

>"In computing, a solution stack is a set of software subsystems or components needed to create a complete platform such that no additional software is needed to support applications. Applications are said to "run on" or "run on top of" the resulting platform.

> ... in a web application the architect defines the stack as the target operating system, web server, database, and programming language."

A Typical Stack would include:

+ Linux/Unix as the ***Server*** Operating System (OS)
+ a ***web application framework*** running on the server. Example frameworks include:
  + Ruby-on-Rails/Sinatra (Ruby),
  + Django (Python),
  + CodeIgniter/Symphony/Drupal (PHP),
  + akka (Scala/Java),
  + Express.js/Meteor.js/**Hapi.js** (JavaScript/Node.js), etc.
+ the (web app) framework connects to a ***database***. There are many databases (often referred to as "*data stores*"), the most popular are:
  + SQL-Based: MySQL, PostgreSQL, MariaDB
  + NoSQL: MongoDB, CouchDB, HBase, etc
  + Search: ElasticSearch
  + Key Value Store: Redis, LevelDB
+ Browser-based interactivity (*often referred to as the* "***Client***" *or* "***Front End***" *of the stack*).

## "*Full-Stack*" JavaScript?

The term "*Full Stack*" Developer has been around for a while.
We like [@laurencegellert](https://twitter.com/laurencegellert)'s
explanation:

> "*a Full Stack Developer is someone with* ***familiarity in each layer***, ***if not mastery in many*** *and a* ***genuine interest in all software technology***."

We *agree* with [@peteryared](https://twitter.com/peteryared) that it's *naive* to expect *anyone* to be an "*expert*" in *ever* aspect of our stack,
but we do think that by using ***JavaScript*** as the (programming) language for Server (Node.js), Client (*take your pick of framework!*) and Datastore
(*any of the NoSQL datastores which store JSON documents*).

See: http://techcrunch.com/2014/11/08/the-rise-and-fall-of-the-full-stack-developer/

### "*Front End*"?

In web development, there is ***one language*** that *all* web browsers understand: ***JavaScript***

The web browser or mobile device (displaying content in a "*web view*")
is referred to as the "*Front End"


### "Back End"?

When people refer to the "Back End" of an app they are describing the
"*Server*" component(s).

There are *many* technologies/languages/frameworks you can use to write
your server. As stated above, for *simplicity* we prefer to use JavaScript (*Node.js*) on the server to keep one programming language across the stack and allow us to re-use view code for both server-side and client-side rendering.


## Test Driven Development?

Writing tests for all aspects of your application.



## What (*Software*) Testing is *Not*...!

![Software testing is not an exam](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/00-what-testing-is-not--multiple-choice-with-broken-pencil.jpg "Software Testing is NOT an Exam!")

Some people have a natural aversion to the *idea* of testing because the *word* reminds them having to do exams in *formal education* (*especially those of us who* [***suffered***](https://www.youtube.com/watch?v=J6lyURyVz7k) *from the experience!*)

![Don't Panic!](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/00-dont-panic-unicorn.png "Don't Panic!")

***Don't Panic***! Writing tests for your Web Application is on the opposite end of the *Fun* Spectrum from multiple choice tests we all know (*and hate*!)

<br />

## No Tests? ... *We Can Fix That*!

There are a number of "*reasons*" (*excuses*!) why people/teams/organisations *still* don't test their work.  
Take your pick from the following:

- "*We don't have time to write tests, we just need to get this done Yesterday!*"
- "*Testing takes too long and means we won't deliver as many features...*"
- "*Its just a small fix, we don't need to write a test*..."
- "*I'm a developer, I don't write tests, we need to hire a tester...*"
- "*If I write a test for every bit of code, then I have to update the tests when I need to change the code, so it's twice as much work...*"

and, last but not least:

- "*That's the way we have always done it here...*"

As a comparison, [***this***](http://en.wikipedia.org/wiki/Nokia_8110) is how we ***used*** to do Mobile Phones ... How many people do you still see carrying "*The Matrix Phone*" (*which was all-the-rage in the* ***90's***!) *today*?

![Matrix Phone Nokia 8110](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/00-matrixphone.jpg "Matrix Phone Nokia 8110")

![Steve Jobs introducing iPhone in 2007](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/00-steve-jobs-introduces-iphone.jpg "Steve Jobs introducing iPhone in 2007")


We have better phones; shouldn't we also have better software development methods?

<br />

## Cowboy Coders?

![Cowboy Coder](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/cowboy-coder.png "Cowboy Coder")

We have all met a *Cowboy Coder* ... The "*I just get things done*"
developer who writes "*quick fixes*" and
exclaims: "*I don't have time to write tests*" or
"*Writing tests for my code takes longer*" and then acts *surprised* when
everything starts breaking while claiming: "*it was working this morning*" ... ***Please share this*** with them and help them see the light!


<br />

## Code Without Test === Building Without Foundation!

Code without tests is like a *building without a foundation*!

![Building Collapse](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/building-collapse-940x627.jpg "Building Collapse")

Its only a matter of *time* before it all comes crashing down ...

**Q**: *Is* Test Driven Development (TDD) a *silver bullet* for *all* my software development woes?  
**A**: **No**.
There is a *lot* more that goes into writing *great* software than
*just* having tests. But, ***without tests reliability is impossible***.


<br />

## *Say No to Untested Software (Web/Apps)!*

The days of poor quality software are *numbered*; people who continue to expect *inconsistent results* to be rewarded are in for a "*surprise*"!

![They Took Er Jerbs](https://raw.github.com/nelsonic/practical-js-tdd/master/manuscript/images/they-took-our-jerbs.jpg "They Took Er Jerbs")


This book is our effort to *accelerate* the process towards ending un-tested software!
We invite *you* to be part of the ***TQM Software*** *movement* and bring all your friends/colleagues!

 <br />


# *Alpha* (Book) Preview

***The Book on Web Application Testing*** is being written one-page-per-day and published at:

> https://leanpub.com/practical-js-tdd

## The Book is Not Ready Yet, Should I Start Reading It?

The answer is: ***it depends***.
If you can handle a few typos and want to get started building better software ASAP, then start *now*! If you prefer to wait till its "ready", please star the repo, register your interest at: https://leanpub.com/practical-js-tdd


## Spreading the Word >> *Please Re-Tweet*!

[![Imgur](https://raw.githubusercontent.com/nelsonic/practical-js-tdd/master/manuscript/images/pfst-initial-tweet-with-retweets.png)](https://twitter.com/nelsonic/status/607053734502375424) *click on the image to re-tweet!* (*thanks!*)



## Release Schedule

*Each day* for the next 4 months I will be writing *at least* 1 page and pushing it to GitHub (*which triggers the book publish script on LeanPub*) so there will be fresh content *every day*! I promise to make every effort to keep the signal-to-noise ratio as good as possible!

## Contributing [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

We hope this will be a (*highly*) ***collaborative*** effort! (We don't believe in "*lone wolf*" or "*basement genius*" approach to building things... we prefer the many minds/eyes/ideas Open Source culture!)

If you want to contribute you can get started by *reading* the files in the
 /**manuscript** directory. They are ordered numerically by chapter. e.g:
 manuscript/**01-intro-why.md** gives the top 7 reasons why people should be
 testing their work.

### Got Comments/Ideas/Suggestions/Issues ?

If you have any ideas, comments or suggestions, please raise and issue on GitHub: https://github.com/nelsonic/practical-js-tdd/issues


### Watching the Repo (*to receive ALL the updates!*)

If you want to receive ***ALL*** the updates, you can **Watch** this GitHub repo. note: you may get quite a few emails... but if you are interested in building great quality software, the content should be relevant to you.

## 100% Open Source

Yes, the book is 100% Open Source on GitHub for anyone to read and contribute to! We (*strongly*) believe that Education should be open and freely available to all (*not controlled or monopolised for profit*)!

![education is the most powerful weapon](https://raw.githubusercontent.com/nelsonic/practical-js-tdd/master/manuscript/images/Nelson-Mandela-Education-is-the-most-powerful-weapon-you-can-use-to-change-the-world.png)



### The Book is Open Source, Why is LeanPub Charging?

Yes, the book is (*and will always be!*) ***100% Open Source***, but LeanPub is kindly providing a way of "packaging" it up for people to read on their devices in the form of a (*[DRM-FREE](https://en.wikipedia.org/wiki/Digital_rights_management#Opposition_to_DRM)*) **PDF** (*readable on any device*) **Mobi** (*for our friends with kindle*) and **EPUB** (*for iDevices and Macs with iBooks*) they have infrastructure to pay for, so I think its fair to pay a fee for the service they provide ...

Don't worry, its not "freemium" ...

![freemium is not free](https://raw.githubusercontent.com/nelsonic/practical-js-tdd/master/manuscript/images/00-freemium-not-really.jpg)

We are posting every word open on github, so if you don't *want or need* the Kindle or iBooks version, just read it online for *free*.

## Proceeds of Sale >> *South African Technology School*

***ALL*** the proceeds (*after LeanPub fees*) from the sale of this book will go into the #[**dwyl**](https://github.com/dwyl/) fund for the ***South African Technology School***
we plan to *build* in **2016** in our quest to create (*well-paid +remote*) Tech Jobs in Africa!

[![BBC Video of School in Africa](https://raw.githubusercontent.com/nelsonic/practical-js-tdd/master/manuscript/images/bbc-school-video-screenshot.png)](http://www.bbc.co.uk/education/clips/zjh4d2p "BBC Video of School in South Africa")

If after watching [*this video*](http://www.bbc.co.uk/education/clips/zjh4d2p) you aren't inspired to get involved,
please let us know what *does* make you tick and we can donate the proceeds of your copy of the book to a different charity.


## Low on Cash?

![No Money?](https://raw.githubusercontent.com/nelsonic/practical-js-tdd/master/manuscript/images/00-empty-pockets-no-money.jpg)

If you are a student and/or low on cash (*we've all been there*!) but still want to learn how to build great quality software, please [***personal-message me***](https://twitter.com/nelsonic)

## Preview Link


https://leanpub.com/the-practical-book-on-full-stack-javascript-web-application-test-driven-development/preview/links


## History (*[tl;dr](https://en.wiktionary.org/wiki/TL;DR)*)

[I](https://github.com/nelsonic) started writing tutorials on Test Driven Development (TDD) out of *frustration* when (_some individuals in_) my *then* team *complained* that "_testing is 'hard' and takes too long..._". It seemed *logical* to publish the tutorials/guides on GitHub (_as opposed to a company wiki or Google Docs_) so that others could benefit from the learning and submit ideas for improvement, updates or corrections in the form of GitHub issues or pull requests.

A few (*hundred*) GitHub stars (_and encouraging feedback messages_) later, we created a GitHub Community dedicated
to curate coding tutorials: https://github.com/docdis
(_which now has **many active members**_)

All coding examples for this book are released as self-contained tutorials so you can *selectively learn* a *specific* tool/technique/technology and share *just* that one byte of learning with your team.
