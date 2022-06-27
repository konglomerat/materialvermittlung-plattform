@fixtures
Feature:
  We check if the media object queries and mutations are configured correctly,
  especially concerning privacy and security issues.

  ######### Introspection #########

  Scenario: MediaObject fields are restricted to the absolute minimum for create mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "uploadMediaObjectInput" with only the allowed input fields:
      | file             |
      | materialId       |
      | sortIndex        |
      | clientMutationId |

  Scenario: MediaObject fields are restricted to the absolute minimum for update mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "updateMediaObjectInput" with only the allowed input fields:
      | id               |
      | sortIndex        |
      | clientMutationId |

  Scenario: MediaObject fields are restricted to the absolute minimum for delete mutations
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "deleteMediaObjectInput" with only the allowed input fields:
      | id               |
      | clientMutationId |


  Scenario: MediaObject fields are restricted to the absolute minimum for queries
    When I use GraphQL introspection to load query, mutation and entity types of the schema
    Then the schema should contain a type "MediaObject" with only the allowed fields:
      | id           |
      | detailsUrl   |
      | previewUrl   |
      | thumbnailUrl |
      | sortIndex    |

  ######### Upload #########

  Scenario: I should only be able to create a MediaObject for a material of my organization
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    And I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |

    # IMPORTANT: "file" is not required so we can write test for the file upload more easily
    # without implementing a real upload. We focus on testing access restrictions!
    When I send the following GraphQL request:
      """
        mutation {
          uploadMediaObject(input:{materialId: "ALIAS_IRI(orgA.mat1)"}){
            mediaObject {
              id
            }
          }
        }
      """
    Then the response should be a GraphQL error debug message "Access Denied."
    When I am logged in for user alias "orgB.user"
    And I send the last GraphQL request again
    Then the response should be a GraphQL error debug message "Access Denied."
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the response should be a GraphQL error debug message "File is required for an Upload."


  ######### Update #########

  Scenario: I should only be able to update a MediaObject for a material of my organization
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    And I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |

    And The user "orgA.user" uploaded a MediaObject "orgA.mat1.image" for Material "orgA.mat1"

    When I send the following GraphQL request:
      """
        mutation {
          updateMediaObject(input: {id: "ALIAS_IRI(orgA.mat1.image)", sortIndex:2}){
            mediaObject {
              id
            }
          }
        }
      """
    Then the response should be a GraphQL error message "Access Denied."
    When I am logged in for user alias "orgB.user"
    And I send the last GraphQL request again
    Then the response should be a GraphQL error message "Access Denied."
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey        | shouldContain |
      | orgA.mat1.image | true          |

  ######### Delete #########

  Scenario: I should only be able to delete a MediaObject for a material of my organization
    Given I have an organization with alias "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    And I have an organization with alias "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |

    And The user "orgA.user" uploaded a MediaObject "orgA.mat1.image" for Material "orgA.mat1"

    When I send the following GraphQL request:
      """
        mutation {
          deleteMediaObject(input: {id: "ALIAS_IRI(orgA.mat1.image)"}){
            mediaObject {
              id
            }
          }
        }
      """
    Then the response should be a GraphQL error message "Access Denied."
    When I am logged in for user alias "orgB.user"
    And I send the last GraphQL request again
    Then the response should be a GraphQL error message "Access Denied."
    When I am logged in for user alias "orgA.user"
    And I send the last GraphQL request again
    Then the GraphQL response should or should not contain the following iris:
      | aliasKey        | shouldContain |
      | orgA.mat1.image | true          |
