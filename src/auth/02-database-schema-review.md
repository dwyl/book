# Database Schema Review

If you prefer to start with a blank slate,
feel free to skip this page.

Final snapshot of diagram: 

<img width="1163" alt="image" src="https://user-images.githubusercontent.com/194400/218710979-1331f056-01db-40dc-8b31-fad0d47565fa.png">

Without much knowledge of database schemas, 
if you just pay _close_ attention, 
you'll see that that the **`person_id`** relationship  (**`foreign key`**)
is not correctly defined on 3 tables: **`apikeys`**, **`apps`** and **`roles`**.

<img width="1176" alt="auth-erd-person_id-fk-incomplete" 
  src="https://user-images.githubusercontent.com/194400/218711765-51d6c582-7465-444f-8c75-bcbe3f03c13d.png">

This has caused me/us no end of pain while trying to add new features ... 
[auth/pull/231](https://github.com/dwyl/auth/pull/231#issuecomment-1345762532)

So, in _addition_ to _dramatically_ simplifying the database schema, 
I will make sure that all the `Ecto` relationships are well-defined 
so that we don't run into annoying constraint errors in the future.

If we _start_ by deleting the tables that we don't _need_, we _immediately_ simplify the ERD:

<img width="1285" alt="image" 
  src="https://user-images.githubusercontent.com/194400/218715031-91969a04-4f56-4da3-bf25-d3ae2945f25d.png">

If we manually edit the diagram to include the `person_id` links (foreign keys): 

<img width="1274" alt="auth-erd-tables-removed-person_id-edited" 
  src="https://user-images.githubusercontent.com/194400/218716741-ae49971f-98b5-46b8-9493-fcd8a815f6cd.png">

It becomes clearer what data "belongs" to a `person`. 
But we can immediately spot something that incomplete/incorrect:
***who*** does a `group` "belong" to? 🤷‍♂️ 

Obviously it's "unfair" to pick holes in a feature that is incomplete.
But it's "broken" and we (I) need to learn from it. 💭 