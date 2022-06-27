@fixtures
Feature:
  We check if the organization queries and mutations are configured correctly,
  especially concerning privacy and security issues.

  Scenario: Not all fields of an Organization should be accessible through the api
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "Organization" with only the allowed fields:
      | id       |
      | _id      |
      | name     |
      | storages |
      | imprint  |
