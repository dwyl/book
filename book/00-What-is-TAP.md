# TAP the Test *Anything* Protocol

## Official Description

> "*TAP, the* ***Test Anything Protocol***, *is a* ***simple text-based interface*** *between testing modules in a test harness. TAP started life as part of the test harness for Perl but now has implementations in C, C++, Python, PHP, Perl, Java,* ***JavaScript***, *and others.*" ~ from: https://testanything.org/

## *English Translation*

TAP is a standard format for automated test output that can be understood by both humans and computers.

## Sample TAP Output

```sh
1..3
ok 1 - Input file opened
not ok 2 - First line of the input valid
ok 3 - Read the rest of the file
```

This TAP output tells us that 3 tests were run.  
Tap numbers tests as it finds them in your file(s).



## Background Reading

+ TAP Home: https://testanything.org/
+ TAP Producers: http://testanything.org/producers.html
(list of modules you can use to write/run your tests)
+ TAPE (Node.js Module): https://www.npmjs.com/package/tape
+ https://ci.testling.com/guide/tape
+ TAP History: http://testanything.org/history.html
+ TAP Specification: http://testanything.org/tap-specification.html
(*remarkably simple and clear*)
+ Custom Libraries: https://ci.testling.com/guide/custom_libraries
+ Wikipedia article: http://en.wikipedia.org/wiki/Test_Anything_Protocol
(not very insightful. the website has all the info)
QUnit TAP Producer: https://github.com/twada/qunit-tap
