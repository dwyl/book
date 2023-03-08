# Notes on Naming Conventions

The words we use matter.
To some people they matter _more_ 
than the _message_ we are trying to convey.
For some, if you speak or write
a word that offends them (or _anyone_ else),
what you have to say is no longer relevant.

There are _many_ words we avoid using
in polite company such as 
[profanity](https://en.wikipedia.org/wiki/Profanity)
and others we attempt to eliminate completely such as 
[pejorative](https://en.wikipedia.org/wiki/Pejorative) terms
or 
[ethnic slurs](https://en.wikipedia.org/wiki/List_of_ethnic_slurs).


## ~~User~~ -> `Person`

The word "**user**" is pervasive in computing:

> "_A **`user`** is a **`person`** 
> who utilizes a computer or network service._"
> ~ https://en.wikipedia.org/wiki/User_(computing)#Terminology

![wikipedia-user-computer](https://user-images.githubusercontent.com/194400/223142338-11395ebc-2506-4114-895e-2051dcf8031f.png)

Right there in the _definition_
they clarify that a "user" is a "person" ...
so why not just call them a `person`? 

The fact that the term "**user**" is widely used
doesn't make it _right_; 
it's just the `default` word
many people have become accustomed to.

Mega tech companies like Apple, Microsoft, Google and Facebook
regularly use the word "user" or "users"
to describe the **`people`** that use their products and services.

## Personalization?

Consider the word **`personalization`**.
"_**Personalization** consists of tailoring 
a service or a product 
to accommodate specific individuals, 
sometimes tied to groups or segments of individuals_."
~ [wikipedia.org/wiki/Personalization](https://en.wikipedia.org/wiki/Personalization)

The word isn't "userization",
because the interface for the "user" is always the same; generic.
Whereas the interface that is personalized 
to an individual person is _just_ for them.

We will be doing a _lot_ of **`personalization`**
in our `App`
and building tools that allow `people`
to personalize their _own_ experience. 

## Complete Clarity

We avoid using the word "***user***"
in the `auth` system and our `App`
because we consider it reductive
and distances the `people` creating the `code`
from the `people` _using_ the product.

Instead we refer to `people` using the `App`
as `people` because it helps us 
to _think_ of them as **_real_ `people`**.

We cannot _force_ anyone `else`
to stop using the word "user".
It will still be the `default` for many companies.
Especially the company who 
treat their "users" as the `product`.

## The Product `Facebook` Sells is _You_

[![facebook-users-for-sale](https://user-images.githubusercontent.com/194400/223942613-bbc5ea60-2ff4-4751-9dad-11e151ca5248.png)](https://slate.com/technology/2018/04/are-you-really-facebooks-product-the-history-of-a-dangerous-idea.html)

> "_You may think Facebook is the product 
> and you’re the client, 
> but that’s not entirely true. 
> There’s a reason tech companies 
> call us **users** and not customers. 
> It’s because we’re just people 
> who come and use the interface. 
> The **product** `Facebook` sells is **`you`**. 
> The advertisers are the customers. 
> That goes for all tech companies 
> that make most of their money from ads._"
> ~ [Ben Wolford](https://github.com/dwyl/learn-react/issues/23#issuecomment-1461358970)

## `DAUs`, `MAUs` 

[`Facebook`](https://github.com/dwyl/learn-react/issues/23#issuecomment-406784935)
will continue referring to `people` as "users"
and more specifically 
"[**DAUs**](https://en.wikipedia.org/wiki/Active_users)" 
(_Daily_ Active Users)
and 
"[**MAUs**](https://github.com/dwyl/learn-react/issues/23#issuecomment-1458429682)"
(_Monthly_ Active Users).
They don't _want_ to think about the 
`people` whose lives they are 
[wasting](https://github.com/dwyl/home/issues/29)
and in many cases
[destroying](https://github.com/dwyl/learn-react/issues/23#issuecomment-1350769626).

We want to do the _exact_ opposite 
of `Facebook` with our `App`;
we want to **help `people` _save_ time**!
So we are using the word "people"
and avoiding "users" wherever we can.

## Not Just `Facebook`

Facebook is just the most obvious
and _egregious_ example.
All the top tech companies
harvest your personal data 
and sell it to advertisers.
[`Apple`](https://www.wired.co.uk/article/apple-is-an-ad-company-now), 
[`Amazon`](https://www.ben-evans.com/benedictevans/2023/3/6/ways-to-think-about-amazon-advertising), 
[`Disney`](https://www.reuters.com/business/media-telecom/disney-secures-9-billion-upfront-ad-sales-2022-07-18/),
[`Google`](https://www.statista.com/statistics/266249/advertising-revenue-of-google/), 
[`Microsoft`](https://en.wikipedia.org/wiki/Microsoft_Advertising), 
[`NetFlix`](https://www.statista.com/statistics/1361989/netflix-ad-revenue),
[`Twitter`](https://www.businessofapps.com/data/twitter-statistics/),
[`Uber`](https://www.reuters.com/technology/uber-looks-boost-digital-ad-revenue-with-new-advertising-division-2022-10-19/) 
are all in the `advertising` business
whether you realize it or not.
They are all "attention merchants".

> "_Simply put, the U-words have their origin in a more sanguine, naïve era. 
As terms, I find them unethical and outdated, 
and so I have doubts they can usher in 
the kind of improvements to technology we desperately need._"
~ [Adam Lefton](https://medium.com/s/user-friendly/why-im-done-saying-user-user-experience-and-ux-in-2019-4fdfc6b7de23)

![iamnotauser](https://user-images.githubusercontent.com/194400/223168289-b44149c8-56da-4348-8561-4f9904007f72.png)


## Recommended Reading

+ Words Matter. Talk About People: 
Not Customers, Not Consumers, Not Users:
[jnd.org/words_matter_talk_about_people_not_customers_not_consumers_not_users](https://jnd.org/words_matter_talk_about_people_not_customers_not_consumers_not_users)
+ Refuse to Call People ‘Users’:
[medium.com/s/user-friendly/why-im-done-saying-user-user-experience-and-ux-in-2019-4fdfc6b7de23](https://medium.com/s/user-friendly/why-im-done-saying-user-user-experience-and-ux-in-2019-4fdfc6b7de23)
+ Is Your Life Really Yours? 
  How ‘The Attention Merchants’ Got Inside Our Heads:
[bigthink.com/high-culture/tim-wu-on-the-attention-merchants-2](https://bigthink.com/high-culture/tim-wu-on-the-attention-merchants-2/)
+ The words you choose within your app 
are an essential part of its experience:
[developer.apple.com/design/human-interface-guidelines/foundations/writing](https://developer.apple.com/design/human-interface-guidelines/foundations/writing)

> **Note**: **`Apple**`** while a proponent
> of carefully selecting words,
> often refer to the `people` 
> that buy and use 
> their products and services
> as "users". 
> This is a legacy of their _age_ as a company -
> they have been around since 
> [1976](https://en.wikipedia.org/wiki/Apple_Inc) -
> and their _scale_;
> they have more than 
> [**2 billion active devices**](https://www.macrumors.com/2023/02/02/apple-two-billion-active-devices).
> At that scale it's about numbers and "users"
> not individual `people`. 
> There are many great `people` at `Apple`
> who understand that words matter. 
> If the company was started today perhaps
> they would think twice about the "users" word.
> But sadly, even Apple are now in the advertising
> business:
> [wired.co.uk/article/apple-is-an-ad-company-now](https://www.wired.co.uk/article/apple-is-an-ad-company-now)
> So they aren't likely to update 
> the word they use to describe us.