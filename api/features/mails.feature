@fixtures
Feature:
  We check if mail are send correctly
  Scenario: Send mails for reservation process
    Given I have an organization with alias "orgA"
    And the organization "orgA" wants to send notification mails to "orgA.1@bar.de"
    And the organization "orgA" wants to send notification mails to "orgA.2@bar.de"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"

    Given I have an organization with alias "orgB"
    And the organization "orgB" wants to send notification mails to "orgB.1@bar.de"
    And the organization "orgB" wants to send notification mails to "orgB.2@bar.de"
    And the organization "orgB" wants to send notification mails to "orgB.3@bar.de"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    Given I have the following materials:
      | materialAlias | organizationAlias | createdByAlias | storageAlias | unit | isDraft | publishAt  | visibleUntil |
      | orgA.mat1     | orgA              | orgA.user      |              |      | false   | before now |              |
    And I have the following outflows:
      | outflowAlias                   | materialAlias | reservingOrganizationAlias | pickedUpAt |
      | orgA.mat1.firstReservationByB  | orgA.mat1     | orgB                       |            |
      | orgA.mat1.secondReservationByB | orgA.mat1     | orgB                       |            |

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        createOutflow(input: {
            material: "ALIAS_IRI(orgA.mat1)",
            reservingOrganization: "ALIAS_IRI(orgB)"
            quantity: 10
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the following individual mails were sent:
      | textInSubject        | to            |
      | Deine Reservierung   | orgB.1@bar.de |
      | Deine Reservierung   | orgB.2@bar.de |
      | Deine Reservierung   | orgB.3@bar.de |
      | Reservierungsanfrage | orgA.1@bar.de |
      | Reservierungsanfrage | orgA.2@bar.de |
    Then I reset the last send mails

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        approveReservationOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.firstReservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the following individual mails were sent:
      | textInSubject            | to            |
      | Reservierungsbestätigung | orgB.1@bar.de |
      | Reservierungsbestätigung | orgB.2@bar.de |
      | Reservierungsbestätigung | orgB.3@bar.de |
    Then I reset the last send mails

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        updateOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.firstReservationByB)",
            quantity: 111
        }){
            outflow {
              id
            }
        }
      }
     """
    And I debug the last send mails
    Then the following individual mails were sent:
      | textInSubject               | to            |
      | Reservierungsänderung       | orgA.1@bar.de |
      | Reservierungsänderung       | orgA.2@bar.de |
      | Deine Reservierungsänderung | orgB.1@bar.de |
      | Deine Reservierungsänderung | orgB.2@bar.de |
      | Deine Reservierungsänderung | orgB.3@bar.de |
    Then I reset the last send mails

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        approveReservationOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.firstReservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the following individual mails were sent:
      | textInSubject            | to            |
      | Reservierungsbestätigung | orgB.1@bar.de |
      | Reservierungsbestätigung | orgB.2@bar.de |
      | Reservierungsbestätigung | orgB.3@bar.de |
    Then I reset the last send mails

    When I am logged in for user alias "orgB.user"
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.firstReservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then I debug the last send mails

    Then the following individual mails were sent:
      | textInSubject                     | to            |
      | Reservierung wurde zurückgenommen | orgA.1@bar.de |
      | Reservierung wurde zurückgenommen | orgA.2@bar.de |
    Then I reset the last send mails

    When I am logged in for user alias "orgA.user"
    And I send the following GraphQL request:
    """
      mutation {
        customDeleteOutflow(input: {
            id: "ALIAS_IRI(orgA.mat1.secondReservationByB)"
        }){
            outflow {
              id
            }
        }
      }
     """
    Then the following individual mails were sent:
      | textInSubject                      | to            |
      | Deine Reservierung wurde abgelehnt | orgB.1@bar.de |
      | Deine Reservierung wurde abgelehnt | orgB.2@bar.de |
      | Deine Reservierung wurde abgelehnt | orgB.3@bar.de |
    Then I reset the last send mails

  # DEV ONLY: mailhog must be running, active the chaos monkey named jim for mailhog
  # Scenario: Sending real mails should not throw an exception
  #   When I send "100" real mails
