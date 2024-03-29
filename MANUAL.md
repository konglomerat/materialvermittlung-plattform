# How to use

This document explains the basic mechanisms of the platform and how to setup
your environment for administration purposes.


### Platform Mechanisms

Materialvermittlung works around four entities: `Organization`, `User`,
`Location` and `Material`. Their functions and usage are explained below.

#### Organization

`Organizations` are the place where `Users` are assigned to. They are also the central point where
contact information and imprints are stored. Every `User` is part of a `Organization`.

#### User

`Users` are the individual accounts which can add and manage a
`Material` offered by their `Organization`. `Users` with the role of `organization admin` can
add other `Users` to their `Organization` as well as `Storages`.

#### Storage

`Storages` are the places where `Materials` are stored and available for pickup. They consist
of an address, an optional note, as well as the flag to the public or private.

#### Material

Last but not least, `Material` is the essential part of the platform. A `Material` consists of
images, a title, the available amount (in pieces, kilos or meters), its origin, size, a description
and other optional properties. `Materials` are assigned to a `Storage` where they can be picked up.  
A `Material` can be a draft, active, completed or reserved.


### Initial setup

You can watch this video (in German) which shows the administration process or follow
the text below.

https://user-images.githubusercontent.com/22657579/175914405-fa3768f5-5de0-4da9-b9e2-db882ad296a3.mp4

First, you'll need to add an `Organization`. Login with your admin account and click
the link "Zur Administration" or open `yourdomain.org/admin`. You'll see the administration UI
with the four entitites in the sidebar. 

![](/docs/00-tutorial-admin-page.png)

Head to "Organisationen". Here you will later be able
to manage all `Organizations`. 

![](/docs/01-tutorial-organization-page.png)

Click the button "Organisation erstellen" in the top right,
give your `Organization` a fitting name and add optional imprint information as well as contact
addresses. You can either save or save and add another `Organization` by clicking "Erstellen"
or "Erstellen und weiteres Element hinzufügen".

![](/docs/02-tutorial-new-organization.png)

Now you'll want at least one `User` in your `Organization`. The process of adding `Users` is
identical to adding `Organizations` with the additional option to give the `User` the role of
system admin or organization admin. Administrators will be able to manage `Users` and `Storages`
of their `Organization`.

After having added your `Organization` and `User(s)`, you'll also need a `Storage`. This again
follows the same process as before at the "Lagerorte" page.

Congrats! You're now ready to add some materials to your platform.

### Adding Material

Follow this video (in German) or the steps below:

https://user-images.githubusercontent.com/22657579/175923481-e0268c6a-cc75-493f-97d4-e64693baeb85.mp4

Every user is capable of adding `Material`. Once you log in, you'll see a plus symbol next to
the main menu. Give your 'Material' a title and add some images and click 'Entwurf anlegen'.

![](/docs/03-add-material.png)

The `Material` is now saved as draft. You can now navigate through the tabs
"Eigenschaften" (Properties), "Fotos" (Photos), "Abholung / Kontakt" (Pickup / Contact) to
fill in more information such as how many pieces, kilos or meters of the `Material`
are available, its origin, size and its `Storage` location. The yellow exclamation marks indicate
where you still need to add information.

![](/docs/04-describe-material.png)

Once you've added all required information, your `Material` will be ready to be published!
Head to "Aktivieren", accept the T&C, add an optional time frame of availability and hit
"Jetzt aktivieren". The `Material` is now live and visible on the frontpage of the
Materialvermittlung.

![](/docs/05-publish-material.png)




### Managing Material

When pieces of your `Material` have been picked up, or you've got additional pieces by now,
you can change the available amount. In the main menu you'll find "Unser Materialangebot"
(Our Material offers). Head to the tab of active ("Aktiv") `Materials`.

![](/docs/06-manage-material.png)

Next,find the `Material` you want to edit and click the "Materialflüsse" (material flows) icon. In the opened window
you can add outflows ("Abgänge"), e.g. picked up pieces, as well as inflows ("Zugänge"), e.g.
additional pieces. By clicking on the flag icon, you can mark a 'Material' as completed.

![](/docs/07-add-flow-material.png)
