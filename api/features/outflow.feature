@fixtures
Feature:
  We check if the outflow queries and mutations are configured correctly,
  especially concerning privacy and security issues.

  ######### Introspection #########

  Scenario: Outflow create mutation input fields are NOT restricted in the schema but in the custom resolver
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "createOutflowInput" with only the allowed input fields:
      | material              |
      | comment               |
      | reservingOrganization |
      | quantity              |
      | clientMutationId      |


  Scenario: Outflow update mutation input fields are NOT restricted in the schema but in the  resolver
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "updateOutflowInput" with only the allowed input fields:
      | id                    |
      | material              |
      | comment               |
      | reservingOrganization |
      | quantity              |
      | clientMutationId      |

  Scenario: Outflow fields are restricted to the absolute minimum for delete mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "customDeleteOutflowInput" with only the allowed input fields:
      | id               |
      | clientMutationId |

  Scenario: Outflow fields are restricted to the absolute minimum for queries
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "OutflowItem" with only the allowed fields:
      | id                    |
      | _id                   |
      | createdOn             |
      | material              |
      | comment               |
      | reservingOrganization |
      | quantity              |
      | pickedUpAt            |
      | reservationApprovedAt |

  ######### Query #########

  Scenario: Querying outflows for a materials
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       |            |
      | orgA.mat1.outflow1       | orgA.mat1     |                            |            |

    When I send the following GraphQL request:
    """
      {
        materials {
          edges {
            node {
              outflows {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    """
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.mat1.reservationByB | false         |
      | orgA.mat1.outflow1       | false         |

    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.mat1.reservationByB | true          |
      | orgA.mat1.outflow1       | true          |

    When I am logged in for user alias "orgB.user"
    And I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.mat1.reservationByB | true          |
      | orgA.mat1.outflow1       | false         |

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
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response data for "createOutflow" should not be null

  Scenario: I should only be able to create an Outflow for another organisation
  if it is a reservation for my organization

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
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I send the following GraphQL request:
    """
      mutation {
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            reservingOrganization: "ALIAS_IRI(orgA)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I send the following GraphQL request:
    """
      mutation {
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            reservingOrganization: "ALIAS_IRI(orgB)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the GraphQL response data for "createOutflow" should not be null

  Scenario: I should not be able to create an Outflow when providing restricted fields

    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |

    When I am logged in for user alias "orgA.user"
    When I send the following GraphQL request:
    """
      mutation {
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            reservingOrganization: "ALIAS_IRI(orgB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."
    When I am logged in for user alias "orgB.user"
    When I send the following GraphQL request:
    """
      mutation {
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            reservingOrganization: "ALIAS_IRI(orgB)",
            comment: "NOT ALLOWED TO SET"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

  ######### Update #########

  Scenario: I should only be able to update an Outflow when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias       | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.outflow1 | orgA.mat1     |                            |            |

    When I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.outflow1)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.outflow1"

    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response data for "updateOutflow" should not be null

  Scenario: I should only be able to update an Outflow for another organisation if it is a reservation
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.outflow1       | orgA.mat1     |                            |            |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       |            |

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.outflow1)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.outflow1"
    And I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the GraphQL response data for "updateOutflow" should not be null

  Scenario: I should not be able to update an Outflow when providing restricted fields
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.outflow1       | orgA.mat1     |                            |            |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       |            |

    When I am logged in for user alias "orgA.user"
    When I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.outflow1)",
            reservingOrganization: "ALIAS_IRI(orgB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."
    When I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)",
            reservingOrganization: "ALIAS_IRI(orgB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I am logged in for user alias "orgB.user"
    When I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)",
            reservingOrganization: "ALIAS_IRI(orgB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."
    When I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)",
            comment: "NOT ALLOWED"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

  ######### Delete #########

  Scenario: I should only be able to delete an Outflow when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias       | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.outflow1 | orgA.mat1     |                            |            |

    When I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.outflow1)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.outflow1"

    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response data for "customDeleteOutflow" should not be null

  Scenario: I should only be able to delete an Outflow for another organisation if it is a reservation
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.outflow1       | orgA.mat1     |                            |            |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       |            |

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.outflow1)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL item not found error message for "orgA.mat1.outflow1"
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the GraphQL response data for "customDeleteOutflow" should not be null

  Scenario: I should NOT be able to delete an Outflow if the quantity was already picked up
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.outflow1       | orgA.mat1     |                            | true       |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       | true       |

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.outflow1)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

  ######### Approve Reservation #########

  Scenario: I should only be able to approve a reservation for an outflow of my organization
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.noReservation  | orgA.mat1     |                            |            |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       |            |

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        approveReservationOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.noReservation)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I send the following GraphQL request:
    """
      mutation {
        approveReservationOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.mat1.reservationByB | true          |

    When I am logged in for user alias "orgB.user"
    And I send the last GraphQL request again
    Then the response should be a GraphQL error debug message "Access Denied."

    ######### Pickup of Reservation #########

  Scenario: I should only be able to mark a reservation as picked up for an outflow of my organization
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias             | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.noReservation  | orgA.mat1     |                            |            |
      | orgA.mat1.reservationByB | orgA.mat1     | orgB                       |            |

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        pickedUpReservationOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.noReservation)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error debug message "Access Denied."

    When I send the following GraphQL request:
    """
      mutation {
        pickedUpReservationOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.reservationByB)",
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.mat1.reservationByB | true          |

    When I am logged in for user alias "orgB.user"
    And I send the last GraphQL request again
    Then the response should be a GraphQL error debug message "Access Denied."


