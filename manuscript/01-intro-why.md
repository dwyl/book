# Why?[^startwithwhy]

> "*For* ***every complex problem*** *there is an* ***answer*** *that is* ***clear, simple, and wrong***" ~ [H. L. Mencken](http://en.wikiquote.org/wiki/H._L._Mencken)

Not testing your software has been demonstrated to be a recipe for failure.

There are *so many* reasons to test your software "*product*" we could write a book just on *why testing is essential*; here are the top ~~5~~ 8 reasons:

## 1. Tranquillity

![Do you ever feel like your project/codebase is brittle?](images/01-eggs-frying-pan-stress.png)

This is the *first* (*reason to test*) because its the *answer* to the question:
"***what's in it for me?***" (_people who are **sceptical about testing
inevitably ask**_).  

Working in a place without tests is stressful because you never know what is going  to "*break*" next. It can feel like your application is stuck together with *duck tape* and changing one thing will break another. If this sounds like a project you have worked on, get ready for a better life!


The ***peace of mind*** you get from *knowing* your project/product works
*consistently* means you can have a life instead of constantly worrying
about if something *else* has broken since the last "*patch*".

![Would you prefer to feel relaxed about your code?](images/01-the-beach-view.jpg)

Imagine being able to leave your work behind and relax knowing
that all tests are passing and everything works as expected.

## 2. Reliable

When was the last time your team delivered a milestone 100% on time?

If you have worked in a company/organisation where work does not get delivered on time, people dodge responsibility and are quick to blame others when things go wrong, I feel your pain (*been there, it isn't fun*).

![Does your team always deliver on time?](images/01-alarm-clock-late.jpg)

There is another (*better*) way. When tests are written *before* the "solution" is implemented, everyone can see *exactly* what the new functionality is *meant* to do.

![How often do people on your team feel like this?](images/01-crowd-surfing.jpg)





## 3. Cost (*Saving*)

The *intial* cost of writing (*automated*) tests may *appear* higher, but *urge* you to think of the investment in writing tests *first* as plotting your destination on a map before you set off.

You *could* just jump straight in/on your vehicle and get going without reading a map (*and hope to get there*) or take the extra few seconds to carefully input the destination into a GPS (*with turn-by-turn directions*)


## 4. Repeatable

> "*It was working on my machine this morning...*"

How many times have you heard this?

http://en.wikipedia.org/wiki/Repeatability


## 5. Predictable

How do you know the code you wrote a week/month/year ago is *still working* as expected?
How can we be sure that a dependency we have included *always* works as advertised?

## 6. Lean


http://blog.rewardgateway.com/7-usability-barriers-obstructing-employee-engagement-avoid/


## 8. Innovation

Having a reliable codebase means you can innovate faster without fear of breaking existing functionality.


## 9. Happiness

![Amelia's Sad Face](images/01-amelia-sad-face.jpg)

When a site/app does *not* function as expected (*or worse, it "fails"*)
when people attempt to use it, it frustrates them (*and they often leave for good*).
If you have a way of *automatically testing* (*checking*) everything works as per the "*user stories*" ensuring a *seamless* "*journey*" you instantly know if it's usable or not.

Apps which are thoroughly tested tend to have fewer bugs and are thus far more user-friendly; this translates directly into happiness.

![Amelia's Happy Day](images/01-amelia-happy-day.jpg)

Make the people using your product/project happy by (_extensively_) _**testing before releasing**_ it to them!

## 12 *More* Reasons to Practice TDD

If you or anyone on your team is *still* skeptical, peruse this list of
***reasons why TDD is a better way to code***:

1. Writing tests first requires careful consideration of what is required from the code and encourages _**minimalist solutions**_.

10. Forces people to write small modules/methods that focus on one thing - _**do (only) one thing really well**_.

2. _**Immediate feedback**_ - know the code *works as expected* (*because it makes the test pass*) and see when you introduce a breaking change or regression (*because your test for that piece of code will fail*) Identify the error/problem quickly - when you spot an error/issue/bug, create a "_regression test_" which checks
for the _specific_ issue on all future test runs and releases (_so the issue does not come back like a game of **whack-a-mole**_)

3. The tests *are* the _**detailed specification**_, as you break down components of your app into the smallest pieces your test descriptions detail the precise functionality of that "*unit*".

4. _**Reduced**_ (_often eliminate_) _**[Rework](https://en.wikipedia.org/wiki/Software_inspection#Rework)**_ - changing existing functionality or fixing things that _were_ working, but get "_broken_" when a new feature is added.

5. _**Less debugging**_ - less time scratching heads wondering "_why isn't it working...?_" (_see immediately which test is failing and fix it_)

8. Facilitates _**design evolution and adaptability**_ as the understanding of the problem you are solving matures.

9. Forces _**radical simplification**_ of the code, you will only write code in response to the requirements of the tests and when the test passes you stop work on that module/method; no "_this might be useful later (pre-emptive/speculative coding)_"

14. The resulting Unit Tests act as _**documentation**_ for the code. Since the acceptence criteria are written as test descriptions, others can view the tests as usage examples of how the code is intended to work.

15. Shorten the development Time-to-Market - you may not see the benefit for a 2 week micro-project, but anything more than a _basic_ website or involving a _team_ you will reap real rewards from TDD.

16. Increased ***programmer productivity***

19. ***Fewer bugs*** - while its *not possible to totally eliminate all bugs*, having tests (*especially when you have exhaustive coverage*)

Addapted from Apium's 20 benefits of TDD: http://apiumtech.com/blog/20-benefits-of-test-driven-development/ Thanks to @sarahabimay @foundersandcoders for sharing this!


[^startwithwhy]: See: http://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action
