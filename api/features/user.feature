@fixtures
Feature:
  We check that no user information is available through the api

  Scenario: The type User should not be present for any query or mutation
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should not contain a type "User"
