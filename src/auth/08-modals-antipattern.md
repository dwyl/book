# Modals Are An Experience _Antipattern_

"_An **antipattern** is just like a pattern, except that instead of a solution it gives something that looks superficially like a solution, but **isn't one**._"
~ Linda Rising - The Patterns Handbook
[wikipedia.org/wiki/Anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern#:~:text=An%20antipattern%20is%20just%20like,%2C%20but%20isn't%20one.)

9 times out of 10 
when designers/egineers 
employ a `modal` in an App.
they are doing so inappropriately
and inadvertently making 
the experience/interface _worse_
for the `person`.

`Phoenix 1.7` added the new 
[`modal`](https://github.com/dwyl/auth/blob/90086a83c6968573f7d4c72b3882a247ac30112d/lib/auth_web/components/core_components.ex#L48) 
component.
We _wish_ the had not done it
because it will _inevitably_ be misused.
Naive devs who mean well 
but haven't studied UX,
will use a `modal`
when a basic `<div>`
would be considerably better.

## Quick Example

After executing the `mix phx.gen.auth` command
and then running the project with:

```sh
mix phx.server
```

The following 2 links 
are added to the header 
of home page: 
<img width="1159" alt="phoenix-homepage-with-register-login-links" src="https://user-images.githubusercontent.com/194400/223761934-73e848c8-4ccd-44b3-ae8c-9376cd10fafb.png">

The code that creates these links is: [`/lib/auth_web/components/layouts/root.html.heex#L15-L55`](https://github.com/dwyl/auth/blob/90086a83c6968573f7d4c72b3882a247ac30112d/lib/auth_web/components/layouts/root.html.heex#L15-L55)

Clicking on the `register` link we navigate to: http://localhost:4000/people/register
<img width="771" alt="image" src="https://user-images.githubusercontent.com/194400/223764612-8cdae223-49f3-43ae-9e24-c22a4e2caada.png">

Here we can enter an `Email` and `Password` to and click on the `Create an account` button:
<img width="771" alt="phoenix-auth-register-account" src="https://user-images.githubusercontent.com/194400/223766668-b0dcab60-be53-480e-9e4d-d1795ae57bdb.png">

This redirects us back to the homepage `http://localhost:4000/` and we see the following `modal`:
<img width="801" alt="phoenix-auth-register-success-modal" src="https://user-images.githubusercontent.com/194400/223767398-b1ac4510-a941-4d23-a748-1da6946cdd41.png">

The person viewing this screen 
has to _manually_ dismiss
the `modal` in order to see 
the content that is _relevant_ to them: 

![phoenix-auth-email-in-header](https://user-images.githubusercontent.com/194400/223803237-55458f41-1456-4981-b531-3fdafb6b74ba.png)

Inspecting the `DOM` of the page in our browser:
<img width="1297" alt="image" src="https://user-images.githubusercontent.com/194400/223771234-b839c8fe-feb9-481c-ba66-40dabba374fc.png">

We see that the `<div id="flash"` 
has the following `HTML`: 

```html
<div id="flash" phx-mounted="[[&quot;show&quot;,{&quot;display&quot;:null,&quot;time&quot;:200,&quot;to&quot;:&quot;#flash&quot;,&quot;transition&quot;:[[&quot;transition-all&quot;,&quot;transform&quot;,&quot;ease-out&quot;,&quot;duration-300&quot;],[&quot;opacity-0&quot;,&quot;translate-y-4&quot;,&quot;sm:translate-y-0&quot;,&quot;sm:scale-95&quot;],[&quot;opacity-100&quot;,&quot;translate-y-0&quot;,&quot;sm:scale-100&quot;]]}]]" phx-click="[[&quot;push&quot;,{&quot;event&quot;:&quot;lv:clear-flash&quot;,&quot;value&quot;:{&quot;key&quot;:&quot;info&quot;}}],[&quot;hide&quot;,{&quot;time&quot;:200,&quot;to&quot;:&quot;#flash&quot;,&quot;transition&quot;:[[&quot;transition-all&quot;,&quot;transform&quot;,&quot;ease-in&quot;,&quot;duration-200&quot;],[&quot;opacity-100&quot;,&quot;translate-y-0&quot;,&quot;sm:scale-100&quot;],[&quot;opacity-0&quot;,&quot;translate-y-4&quot;,&quot;sm:translate-y-0&quot;,&quot;sm:scale-95&quot;]]}]]" role="alert" class="fixed hidden top-2 right-2 w-80 sm:w-96 z-50 rounded-lg p-3 shadow-md shadow-zinc-900/5 ring-1 bg-emerald-50 text-emerald-800 ring-emerald-500 fill-cyan-900" style="display: block;">
  <p class="flex items-center gap-1.5 text-[0.8125rem] font-semibold leading-6">
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path>
    </svg>
    Success!
  </p>
  <p class="mt-2 text-[0.8125rem] leading-5">Person created successfully.</p>
  <button type="button" class="group absolute top-2 right-1 p-2" aria-label="close">
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-5 w-5 stroke-current opacity-40 group-hover:opacity-70" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd"></path>
    </svg>
  </button>
</div>
```

This is a _lot_ of code 
just to inform the `person`
that the successfully registered.

We _know_ there's a _much_ better way.
We will be _demonstrating_ it 
in the next few pages.

For now, we're just going to 
remove the line:

```html
<.flash_group flash={@flash} />
```
From the file:
[`/lib/auth_web/components/layouts/app.html.heex#L40`](https://github.com/dwyl/auth/blob/90086a83c6968573f7d4c72b3882a247ac30112d/lib/auth_web/components/layouts/app.html.heex#L40)

To remove all `flash` modals.

And just like magic,
the tests that were failing previously,
because the `modal` (noise)
was covering the `email` address,
now pass: 

```sh
mix test 

Compiling 2 files (.ex)
The database for Auth.Repo has already been created

19:08:47.892 [info] Migrations already up
..........................................................
.........................................................
Finished in 0.5 seconds (0.3s async, 0.1s sync)
115 tests, 0 failures
```

With all tests passing,
we can _finally_ get on 
with building `Auth`! 