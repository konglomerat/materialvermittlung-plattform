@fixtures
Feature:
  We check if the material queries and mutations are configured correctly,
  especially concerning privacy and security issues.

  ###### Introspection ######

  Scenario: Material fields are restricted to the absolute minimum for create mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "createMaterialInput" with only the allowed input fields:
      | title                       |
      | description                 |
      | quantityUnit                |
      | dimensions                  |
      | color                       |
      | publishAt                   |
      | visibleUntil                |
      | isDraft                     |
      | isFinished                  |
      | disallowPartialReservations |
      | storage                     |
      | clientMutationId            |

  Scenario: Material fields are restricted to the absolute minimum for update mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "updateMaterialInput" with only the allowed input fields:
      | id                          |
      | title                       |
      | description                 |
      | quantityUnit                |
      | dimensions                  |
      | color                       |
      | publishAt                   |
      | visibleUntil                |
      | isDraft                     |
      | isFinished                  |
      | disallowPartialReservations |
      | storage                     |
      | acceptTermsAndConditions    |
      | clientMutationId            |

  Scenario: Material fields are restricted to the absolute minimum for queries
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "Material" with only the allowed fields:
      | id                          |
      | _id                         |
      | title                       |
      | description                 |
      | quantityUnit                |
      | dimensions                  |
      | color                       |
      | images                      |
      | updatedAt                   |
      | publishAt                   |
      | visibleUntil                |
      | isDraft                     |
      | storage                     |
      | organization                |
      | inflows                     |
      | outflows                    |
      | isFinished                  |
      | disallowPartialReservations |
      # calculated field
      | isNew                       |
      | validationResults           |
      | inflowQuantity              |
      | outflowQuantity             |
      | pickedUpQuantity            |
      | reservedQuantity            |
      | availableQuantity           |
      | readableQuantityUnit        |
      | isVisible                   |

  ###### Query ######

  Scenario: Querying a material collection
    Given I have an organization with alias "orgA"
    And I have a public storage with alias "orgA.publicStore" for the organization "orgA"
    And I have a private storage with alias "orgA.privateStore" for the organization "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a public storage with alias "orgB.publicStore" for the organization "orgB"
    And I have a private storage with alias "orgB.privateStore" for the organization "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias            | organizationAlias | createdByAlias | storageAlias      | unit | isDraft | publishAt  | visibleUntil |
      | orgA.publicMat1          | orgA              | orgA.user      | orgA.publicStore  |      | false   | before now |              |
      | orgA.publicMat2          | orgA              | orgA.user      | orgA.publicStore  |      | false   | before now |              |
      | orgA.invisiblePublicMat1 | orgA              | orgA.user      | orgA.publicStore  |      | false   | before now | before now   |
      | orgA.invisiblePublicMat2 | orgA              | orgA.user      | orgA.publicStore  |      | false   | after now  |              |
      | orgA.visiblePrivateMat1  | orgA              | orgA.user      | orgA.privateStore |      | false   | before now |              |
      | orgA.draftMat1           | orgA              | orgA.user      |                   |      | true    |            |              |

      | orgB.publicMat1          | orgB              | orgB.user      | orgB.publicStore  |      | false   | before now |              |
      | orgB.publicMat2          | orgB              | orgB.user      | orgB.publicStore  |      | false   | before now |              |
      | orgB.invisiblePublicMat1 | orgB              | orgB.user      | orgB.publicStore  |      | false   | before now | before now   |
      | orgB.invisiblePublicMat2 | orgB              | orgB.user      | orgB.publicStore  |      | false   | after now  |              |
      | orgB.visiblePrivateMat1  | orgB              | orgB.user      | orgB.privateStore |      | false   | before now |              |
      | orgB.draftMat1           | orgB              | orgB.user      |                   |      | true    |            |              |

    When I send the following GraphQL request:
    """
      {
        materials {
          edges {
            node {
              id
            }
          }
        }
      }
    """

    And the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.publicMat1          | true          |
      | orgA.publicMat2          | true          |
      | orgA.invisiblePublicMat1 | false         |
      | orgA.invisiblePublicMat2 | false         |
      | orgA.visiblePrivateMat1  | false         |
      | orgA.draftMat1           | false         |

      | orgB.publicMat1          | true          |
      | orgB.publicMat2          | true          |
      | orgB.invisiblePublicMat1 | false         |
      | orgB.invisiblePublicMat2 | false         |
      | orgB.visiblePrivateMat1  | false         |
      | orgB.draftMat1           | false         |


    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey                 | shouldContain |
      | orgA.publicMat1          | true          |
      | orgA.publicMat2          | true          |
      | orgA.invisiblePublicMat1 | true          |
      | orgA.invisiblePublicMat2 | true          |
      | orgA.visiblePrivateMat1  | true          |
      | orgA.draftMat1           | true          |

      | orgB.publicMat1          | true          |
      | orgB.publicMat2          | true          |
      | orgB.invisiblePublicMat1 | false         |
      | orgB.invisiblePublicMat2 | false         |
      | orgB.visiblePrivateMat1  | true          |
      | orgB.draftMat1           | false         |

  Scenario: Querying a material item
    Given I have an organization with alias "orgA"
    And I have a public storage with alias "orgA.publicStore" for the organization "orgA"
    And I have a private storage with alias "orgA.privateStore" for the organization "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And I have a public storage with alias "orgB.publicStore" for the organization "orgB"
    And I have a private storage with alias "orgB.privateStore" for the organization "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias    | organizationAlias | createdByAlias | storageAlias      | unit | isDraft | publishAt  | visibleUntil |
      | orgA.publicMat1  | orgA              | orgA.user      | orgA.publicStore  |      | false   | before now |              |
      | orgA.privateMat1 | orgA              | orgA.user      | orgA.privateStore |      | false   | before now |              |

    When I send the following GraphQL request:
    """
      {
        material(id: "ALIAS_IRI(orgA.publicMat1)") {
          id
        }
      }
    """
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey        | shouldContain |
      | orgA.publicMat1 | true          |

    When I am not logged in
    Then I send the following GraphQL request:
    """
      {
        material(id: "ALIAS_IRI(orgA.privateMat1)") {
          id
        }
      }
    """
    Then the response should be a GraphQL error message "Access Denied."
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey         | shouldContain |
      | orgA.privateMat1 | true          |

  ###### Create ######

  Scenario: I should not be able to create a Material when not logged in
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    When I send the following GraphQL request:
    """
      mutation {
        createMaterial(input: {
            title: "Title",
            quantityUnit: "unit"
        }){
            material {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error message "Access Denied."

  Scenario: I should not be able to create a Material when logged in as an user with no organization
    And I have a user with alias "admin" and role "ROLE_ADMIN"
    When I send the following GraphQL request:
    """
      mutation {
        createMaterial(input: {
            title: "Title",
            quantityUnit: "unit"
        }){
            material {
              id
            }
        }
      }
     """
    Then the response should be a GraphQL error message "Access Denied."

  Scenario: I should only be able to create a Material for my Organisation when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        createMaterial(input: {
            title: "",
            quantityUnit: "unit"
        }){
            material {
              id
              organization {
                id
              }
            }
        }
      }
     """
    Then the GraphQL response data for "createMaterial" should not be null
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey | shouldContain |
      | orgA     | true          |

  ###### Update ######

  Scenario: I should not be able to update a Material when not logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"
    And I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt | visibleUntil |
      | mat1          | orgA              | orgA.user      |              |      |         |           |              |
    When I send the following GraphQL request:
    """
      mutation {
        updateMaterial(input: {
          id: "ALIAS_IRI(mat1)"
        }){
          clientMutationId
        }
      }
    """
    Then the response should be a GraphQL item not found error message for "mat1"

  Scenario: I should only be able to update a Material for my Organisation when logged in
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    And I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt | visibleUntil |
      | orgB.mat      | orgB              | orgB.user      |              |      | true    |           |              |

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        updateMaterial(input: {
          id: "ALIAS_IRI(orgB.mat)",
          title: "NEW"
        }){
          material {
            id
          }
        }
      }
    """
    Then the response should be a GraphQL item not found error message for "orgB.mat"

    When I am logged in for user alias "orgB.user"
    When I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey | shouldContain |
      | orgB.mat | true          |


  Scenario: I should only be able to update a Material that is already published if I accepted the terms and conditions
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    And I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat      | orgA              | orgA.user      |              |      | false   | before now |              |

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        updateMaterial(input: {
          id: "ALIAS_IRI(orgA.mat)",
          title: "NEW"
        }){
          material {
            id
          }
        }
      }
    """
    Then the response should be a GraphQL error debug message "Access Denied."
    When I send the following GraphQL request:
    """
      mutation {
        updateMaterial(input: {
          id: "ALIAS_IRI(orgA.mat)",
          title: "NEW",
          acceptTermsAndConditions: true
        }){
          material {
            id
          }
        }
      }
    """
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey | shouldContain |
      | orgA.mat | true          |
