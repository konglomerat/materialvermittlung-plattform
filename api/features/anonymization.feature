@fixtures
Feature:
  We check if the anonymizing the database works correctly, especially regarding materials and outflows,

  Scenario: Anonymizing materials
    Given I have an organization with alias "orgA"
    And I have a public storage with alias "orgA.store" for the organization "orgA"
    And I have a private storage with alias "orgA.anonymizedStore" for the organization "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"
    And I have a user with alias "orgA.unusedUser" and role "ROLE_USER"
    And the user "orgA.unusedUser" is member of organization "orgA"

    And I have an organization with alias "orgB"
    And I have a private storage with alias "orgB.store" for the organization "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias       | organizationAlias | createdByAlias | storageAlias         | unit | isDraft | publishAt     | visibleUntil  | isFinished |
      | orgA.mat1           | orgA              | orgA.user      | orgA.store           |      | false   | before now    |               | true       |
      | orgA.mat2           | orgA              | orgA.user      | orgA.store           |      | false   | before now    |               | false      |
      | orgA.mat3           | orgA              | orgA.user      | orgA.store           |      | true    | before now    |               | false      |
      | orgA.mat4           | orgA              | orgA.user      | orgA.store           |      | false   | two years ago | two years ago | false      |
      | orgA.mat5           | orgA              | orgA.user      | orgA.store           |      | false   | before now    | before now    | true       |
      | orgA.anonymizedMat1 | orgA              | orgA.user      | orgA.anonymizedStore |      | false   | two years ago | two years ago | true       |
      | orgA.anonymizedMat2 | orgA              | orgA.user      | orgA.anonymizedStore |      | false   | two years ago | two years ago | true       |

    And I have the following outflows:
      | outflowAlias                        | materialAlias       | reservingOrganizationAlias | pickedUpAt |
      | orgA.anonymizedMat1.reservationByB  | orgA.anonymizedMat1 | orgB                       |            |
      | orgA.anonymizedMat2.reservationByB1 | orgA.anonymizedMat1 | orgB                       |            |
      | orgA.anonymizedMat2.reservationByB2 | orgA.anonymizedMat1 | orgB                       |            |

    And The user "orgA.user" uploaded a MediaObject "orgA.anonymizedMat1.image1" for Material "orgA.anonymizedMat1"
    And The user "orgA.user" uploaded a MediaObject "orgA.anonymizedMat1.image2" for Material "orgA.anonymizedMat1"

    When I run the command "app:anonymize"

    # If we can remove users, storages and organizations then they have successfully been detached
    # from materials, inflows and outflows.

    And I delete the following users:
      | userAlias       |
      | orgA.user       |
      | orgA.unusedUser |
      | orgB.user       |

    And I delete the following storages:
      | storageAlias         |
      | orgA.anonymizedStore |
      | orgB.store           |

    And I delete the following organizations:
      | organizationAlias |
      | orgB              |

    Then I expect no exceptions to be thrown


  Scenario: Deleting unanonymized entities leads to exceptions
    Given I have an organization with alias "orgA"
    And I have a public storage with alias "orgA.store" for the organization "orgA"
    And I have a private storage with alias "orgA.anonymizedStore" for the organization "orgA"
    And I have a user with alias "orgA.user" and role "ROLE_USER"
    And the user "orgA.user" is member of organization "orgA"
    And I have a user with alias "orgA.unusedUser" and role "ROLE_USER"
    And the user "orgA.unusedUser" is member of organization "orgA"

    And I have an organization with alias "orgB"
    And I have a private storage with alias "orgB.store" for the organization "orgB"
    And I have a user with alias "orgB.user" and role "ROLE_USER"
    And the user "orgB.user" is member of organization "orgB"

    And I have the following materials:
      | materialAlias       | organizationAlias | createdByAlias | storageAlias         | unit | isDraft | publishAt     | visibleUntil  | isFinished |
      | orgA.mat1           | orgA              | orgA.user      | orgA.store           |      | false   | before now    |               | true       |
      | orgA.mat2           | orgA              | orgA.user      | orgA.store           |      | false   | before now    |               | false      |
      | orgA.mat3           | orgA              | orgA.user      | orgA.store           |      | true    | before now    |               | false      |
      | orgA.mat4           | orgA              | orgA.user      | orgA.store           |      | false   | two years ago | two years ago | false      |
      | orgA.mat5           | orgA              | orgA.user      | orgA.store           |      | false   | before now    | before now    | true       |
      | orgA.anonymizedMat1 | orgA              | orgA.user      | orgA.anonymizedStore |      | false   | two years ago | two years ago | true       |
      | orgA.anonymizedMat2 | orgA              | orgA.user      | orgA.anonymizedStore |      | false   | two years ago | two years ago | true       |

    And I have the following outflows:
      | outflowAlias                        | materialAlias       | reservingOrganizationAlias | pickedUpAt |
      | orgA.anonymizedMat1.reservationByB  | orgA.anonymizedMat1 | orgB                       |            |
      | orgA.anonymizedMat2.reservationByB1 | orgA.anonymizedMat1 | orgB                       |            |
      | orgA.anonymizedMat2.reservationByB2 | orgA.anonymizedMat1 | orgB                       |            |

    And The user "orgA.user" uploaded a MediaObject "orgA.anonymizedMat1.image1" for Material "orgA.anonymizedMat1"
    And The user "orgA.user" uploaded a MediaObject "orgA.anonymizedMat1.image2" for Material "orgA.anonymizedMat1"

    When I run the command "app:anonymize"

    And I delete the following storages:
      | storageAlias |
      | orgA.store   |

    And I delete the following organizations:
      | organizationAlias |
      | orgA              |

    Then I expect some exceptions to be thrown
