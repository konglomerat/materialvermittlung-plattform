# Architecture

[[_TOC_]]

This project is based on Symfony with Api-Platform to provide an API for a React application.

## Concepts

* The graphql API 
  * The graphql API is generated automatically based on the models in `api/src/Entity`. We have to make sure no data is leaked when changing a model. This is why we use BDD tests (see `api/features`) to e.g. use introspection on the graphql endpoint to detect any changes to the API. If a property is added the tests will fail und the developer has to check if this change was intended or not.
  * The overall visibility of properties of an entity is configured using annotations inside the entity. We use a `normalization_context` group and `denormalization_context` group to configure, which properties should be visible in a query and a mutation. More steps are required to secure the API.
  * Mutations should only be allowed for users with an account and if the parameters are valid. E.g. a user should only be able to create/update/delete a material for his/her own organization. This is why we decided to use custom mutations and mutation resolvers (see `api/src/Resolver`). This provides more flexibility when restricting the API.
  * We do not use custom resolvers for item and especially collection queries as we would lose much functionality provided by ApiPlatform out of the box. E.g. sorting, filtering, search and pagination. We use Doctrine extensions (see `api/src/Doctrine`) as a low level approach to restrict access to the model. E.g. material drafts should only be visible to users of the organisation the material belongs to. For this we modify the actual DQL query to the database
  * Sometimes we use voters to restrict item queries or mutations. Seen annotations in Entities and `api/src/Security.Voter`. We only use Voters for mutations that do not have a custom Resolver. If a custom resolver is needed for a mutation, the voter should be removed as all security issues will directly be handled by the Resolver.
* The model allows to keep all materials and associated in and outflows after deleting users, organization or storages. This is why we need nullable references. A Command can be used to clean up data (remove references) older than 12 months for data privacy reasons.
* We use MJML to create nicely designed mails. We limit the amount of templates by providing placeholders in the mail template. Only one template is needed. see `api/templates/emails`
* We used Antd as a React library to provide basic UI components.
* The model for Material was refactored multiple times, this is what we learned
  * As we later want to see how material flows through the application we need separate models Inflow and Outflows referenced by the material. This data can also be used for research later.
  * A material should be in a clearly defined state. It can be a draft, active or finished. This also helps the user when working with the UI.
  * We do not show material in a different status based on the current date and time but based on explicitly set boolean properties. E.g. we used to have a state "visible" for material that did not exceed the `visibleUntil` date. For the user this did not work at all because material was changing a status magically. It was hard to find material in the UI.
* Some properties of the model should be set automatically. E.g. `updatedAt` should not be set by the API but an ORM listener -> see `api/src/ORM`. This remove clutter from the API. For dates you will not have problems converting the timezone.
