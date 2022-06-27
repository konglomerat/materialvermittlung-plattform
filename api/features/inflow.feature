@fixtures
Feature:
  We check if the inflow queries and mutations are configured correctly,
  especially concerning privacy and security issues.

  ######### Introspection #########

  Scenario: Inflow fields are restricted to the absolute minimum for create mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "createInflowInput" with only the allowed input fields:
      | material         |
      | comment          |
      | quantity         |
      | clientMutationId |

  Scenario: Inflow fields are restricted to the absolute minimum for update mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "updateInflowInput" with only the allowed input fields:
      | id               |
      | material         |
      | comment          |
      | quantity         |
      | clientMutationId |

  Scenario: Inflow fields are restricted to the absolute minimum for delete mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "deleteInflowInput" with only the allowed input fields:
      | id               |
      | clientMutationId |


  Scenario: Inflow fields are restricted to the absolute minimum for queries
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "InflowItem" with only the allowed fields:
      | id        |
      | _id       |
      | createdOn |
      | material  |
      | comment   |
      | quantity  |

  ######### Query #########

  Scenario:
  We autogenerate a first inflow when creating a material. This inflow will be used to store the initial quantity of the material.
  A material should always have one inflow. I also have to be logged in to see inflows.

    Given I have an organization with alias "orgA"
    And I have a public storage with alias "orgA.publicStore" for the organization "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias     | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      | orgA.publicStore |      | false   | before now |              |

    And I send the following GraphQL request:
    """
      {
        materials {
          edges {
            node {
              inflows {
                edges {
                  node {
                    id
                    quantity
                    comment
                  }
                }
              }
            }
          }
        }
      }
    """
    Then Then the GraphQL response should or should not contain the following content:
      | content   | shouldContain |
      | inflows/1 | false         |
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then Then the GraphQL response should or should not contain the following content:
      | content   | shouldContain |
      | inflows/1 | true          |

  ######### Create #########

  Scenario: I should only be able to create an Outflow when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |


    When I send the following GraphQL request:
    """
      mutation {
        createInflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            quantity: 10
        }){
            inflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error debug message for "orgA.mat1"
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response data for "createInflow" should not be null

  Scenario: I should not be able to create an Inflow for another organisation
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        createInflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            quantity: 10
        }){
            inflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error message "Access Denied."

  ######### Update #########

  Scenario: I should only be able to update an Inflow when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |        | false   | before now |              |

    And I have the following inflows:
      | inflowAlias       | materialAlias |
      | orgA.mat1.inflow1 | orgA.mat1     |

    When I send the following GraphQL request:
    """
      mutation {
        updateInflow(input: {
            id: "ALIAS_IRI(orgA.mat1.inflow1)",
            quantity: 10
        }){
            inflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.inflow1"
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response data for "updateInflow" should not be null

  Scenario: I should not be able to update an Inflow for another organisation
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |        | false   | before now |              |
    And I have the following inflows:
      | inflowAlias       | materialAlias |
      | orgA.mat1.inflow1 | orgA.mat1     |

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        updateInflow(input: {
            id: "ALIAS_IRI(orgA.mat1.inflow1)",
            quantity: 10
        }){
            inflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.inflow1"

  ######### Delete #########

  Scenario: I should only be able to delete an Inflow when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |        | false   | before now |              |

    And I have the following inflows:
      | inflowAlias       | materialAlias |
      | orgA.mat1.inflow1 | orgA.mat1     |

    When I send the following GraphQL request:
    """
      mutation {
        deleteInflow(input: {
            id: "ALIAS_IRI(orgA.mat1.inflow1)"
        }){
            inflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.inflow1"
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response data for "deleteInflow" should not be null

  Scenario: I should not be able to delete an Inflow for another organisation
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |        | false   | before now |              |
    And I have the following inflows:
      | inflowAlias       | materialAlias |
      | orgA.mat1.inflow1 | orgA.mat1     |

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        deleteInflow(input: {
            id: "ALIAS_IRI(orgA.mat1.inflow1)"
        }){
            inflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.inflow1"
