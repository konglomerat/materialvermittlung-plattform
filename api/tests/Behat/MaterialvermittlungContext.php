<?php

declare(strict_types=1);

namespace App\Tests\Behat;

use App\Command\AnonymizationCommand;
use App\Entity\Inflow;
use App\Entity\Material;
use App\Entity\MediaObject;
use App\Entity\Organization;
use App\Entity\Outflow;
use App\Entity\Storage;
use App\Entity\User;
use App\Enum\MaterialUnitEnum;
use App\Repository\UserRepository;
use App\Service\MailService;
use App\Service\TestMailService;
use Behat\Behat\Context\Context;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\Behat\Tester\Exception\PendingException;
use Exception;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Mime\Address;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\JWTUserToken;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Security;
use Webmozart\Assert\Assert;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * This context class contains the definitions of the steps used by the demo
 * feature file. Learn how to get started with Behat and BDD on Behat's website.
 *
 * @see http://behat.org/en/latest/quick_start.html
 */
final class MaterialvermittlungContext implements Context {
    use DatabaseFixtureContextTrait;

    const ORGANIZATION_IRI_PATH = "organizations/";
    const MATERIAL_IRI_PATH = "materials/";
    const MEDIA_OBJECT_IRI_PATH = "media_objects/";
    const OUTFLOW_IRI_PATH = "outflows/";
    const INFLOW_IRI_PATH = "inflows/";
    const STORAGE_IRI_PATH = "storages/";

    const PASSWORD = "password";

    const MAIL_DOMAIN = "example.org";

    private RouterInterface $router;
    protected KernelInterface $kernel;
    private Security $security;
    private UserRepository $userRepository;

    /**
     * @var HttpClient
     */
    private $client;

    /**
     * @var Request
     */
    private $lastRequest;

    /**
     * @var Response
     */
    private $lastResponse;

    /**
     * @var array
     */
    private $exceptions;

    /**
     * @var EntityIdAliases
     */
    private $entityIdAliases;

    /**
     * @var TestMailService
     */
    private $testMailService;

    /**
     * @param RouterInterface $router
     * @param EntityManagerInterface $entityManager
     * @param KernelInterface $kernel
     */
    public function __construct(
        RouterInterface $router,
        EntityManagerInterface $entityManager,
        KernelInterface $kernel,
        Security $security,
        UserRepository $userRepository,
        MailService $mailService
    ) {
        $this->entityIdAliases = new EntityIdAliases($entityManager);
        $this->router = $router;
        $this->entityManager = $entityManager;
        $this->kernel = $kernel;
        $this->security = $security;
        $this->userRepository = $userRepository;
        $this->testMailService = $mailService;
        $this->exceptions = [];
    }

    /**
     * @BeforeScenario
     */
    public function beforeScenario(BeforeScenarioScope $scope) {
        // REBOOT KERNEL
        // as we disabled the service for rebooting (see services_test.yaml) we do boot here.
        $this->kernel->boot();

        // Reset Aliases
        $this->entityIdAliases->reset();

        // Logout
        $this->iAmNotLoggedIn();

        // Resetting Others
        $this->lastResponse = null;
        $this->lastRequest = null;
        $this->exceptions = [];

        $this->testMailService->reset();
    }

    ########### Authentication ###########

    /**
     * @When /^I am logged in for user alias "([^"]*)"$/
     */
    public function iAmLoggedInForUserAlias($userAlias) {
        $this->iAmNotLoggedIn();
        $user = $this->entityIdAliases->findUserByAlias($userAlias, true);

        /* @var $tokenStorage TokenStorageInterface */
        $tokenStorage = $this->kernel->getContainer()->get('security.token_storage');
        // we nee a JWTToken here to match our guard, configured in the security.yaml
        $token = new JWTUserToken($user->getRoles(), $user);
        $tokenStorage->setToken($token);
    }

    /**
     * @Given I am not logged in
     */
    public function iAmNotLoggedIn() {
        /* @var $tokenStorage TokenStorageInterface */
        $tokenStorage = $this->kernel->getContainer()->get('security.token_storage');
        $tokenStorage->setToken(null);
    }

    ########### Create Entities ###########

    /**
     * @Given /^I have a user with alias "([^"]*)" and role "([^"]*)"$/
     */
    public function iHaveAUserWithAliasAndRole(string $userAlias, string $role) {
        $user = $this->entityIdAliases->findUserByAlias($userAlias);

        if (!$user) {
            $user = new User();
            $user->setEmail($userAlias . "@" . self::MAIL_DOMAIN);
            $user->setPassword(self::PASSWORD);
            $user->setRoles([$role]);
            $this->entityIdAliases->persistAndAddIdAlias($user, $userAlias, "");
        }
    }

    /**
     * @Given /^the user "([^"]*)" is member of organization "([^"]*)"$/
     */
    public function theUserIsMemberOfOrganization($userAlias, $organizationAlias) {
        $user = $this->entityIdAliases->findUserByAlias($userAlias);
        $organization = $this->entityIdAliases->findOrganizationByAlias($organizationAlias);

        if ($user && $organization) {
            $user->setOrganization($organization);
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } else {
            if (!$user) {
                throw new \Exception("Make sure to create a user '$userAlias' before using this step!");
            }
            if (!$organization) {
                throw new \Exception("Make sure to create an organization '$organizationAlias' before using this step!");
            }
        }
    }

    /**
     * @Given /^I have an organization with alias "([^"]*)"$/
     */
    public function iHaveAnOrganizationWithAlias(string $alias) {
        $organization = $this->entityIdAliases->findOrganizationByAlias($alias);
        if (!$organization) {
            $organization = new Organization();
            $organization->setName("");
            $this->entityIdAliases->persistAndAddIdAlias($organization, $alias, self::ORGANIZATION_IRI_PATH);
        }
    }

    /**
     * @Given /^the organization "([^"]*)" wants to send notification mails to "([^"]*)"$/
     */
    public function theOrganizationWantsToSendNotificationMailsTo(string $alias, string $email) {
        $organization = $this->entityIdAliases->findOrganizationByAlias($alias);
        $organization->addNotificationMailAddress(strtolower($email));
    }

    /**
     * @Given /^I have a public storage with alias "([^"]*)" for the organization "([^"]*)"$/
     */
    public function iHaveAPublicStorageWithIdForTheOrganization(string $storageAlias, string $organizationAlias) {
        $this->createStorage($storageAlias, $organizationAlias, true);
    }

    /**
     * @Given /^I have a private storage with alias "([^"]*)" for the organization "([^"]*)"$/
     */
    public function iHaveAPrivateStorageWithIdForTheOrganization(string $storageAlias, string $organizationAlias) {
        $this->createStorage($storageAlias, $organizationAlias, false);
    }

    private function createStorage(string $storageAlias, string $organizationAlias, bool $isPublic) {
        $organization = $this->entityIdAliases->findOrganizationByAlias($organizationAlias);
        $storage = $this->entityIdAliases->findStorageByAlias($storageAlias);

        if (!$storage) {
            $storage = new Storage();
            $storage->setTitle("");
            $storage->setOrganization($organization);
            $storage->setIsPublic($isPublic);
            $this->entityIdAliases->persistAndAddIdAlias($storage, $storageAlias, self::STORAGE_IRI_PATH);
        }
    }

    /**
     * @Given /^I have the following materials:$/
     */
    public function iHaveTheFollowingMaterials(TableNode $table) {
        foreach ($table->getHash() as $row) {
            $materialAlias = $row["materialAlias"];
            $organizationAlias = $row["organizationAlias"];
            $storageAlias = $row["storageAlias"];
            $createdByAlias = $row["createdByAlias"];
            $unit = $row["unit"] ? $row["unit"] : MaterialUnitEnum::STUECK;

            MaterialUnitEnum::checkIfValueIsAllowed($unit);

            $material = $this->entityIdAliases->findMaterialByAlias($materialAlias);

            $organization = $this->entityIdAliases->findOrganizationByAlias($organizationAlias);
            Assert::notNull($organization, "Failed to create Organization. Organization with alias '$organizationAlias' null");

            $createdByUser = $this->entityIdAliases->findUserByAlias($createdByAlias);
            Assert::notNull($createdByUser, "Failed to create User. User with alias '$createdByAlias' null");

            $storage = $this->entityIdAliases->findStorageByAlias($storageAlias);
            if ($storageAlias) {
                Assert::notNull($storage, "Failed to create Material. Storage with alias '$storageAlias' null");
            }

            if (!$material) {
                $material = new Material();
                // IMPORTANT: Order matters here!!!
                $createdByUser->addMaterial($material);
                $material->setTitle("");
                $material->setQuantityUnit($unit);
                $material->setOrganization($organization);
                $material->setCreatedBy($createdByUser);
                $material->setStorage($storage);
                $material->setIsDraft($row["isDraft"] === "true" ? true : false);

                switch ($row["publishAt"]) {
                    case "before now":
                        $material->setPublishAt((new \DateTime())->sub(new \DateInterval('P10D')));
                        break;
                    case "after now":
                        $material->setPublishAt((new \DateTime())->add(new \DateInterval('P5D')));
                        break;
                    case "two years ago":
                        $material->setPublishAt((new \DateTime())->sub(new \DateInterval('P24M')));
                }

                switch ($row["visibleUntil"]) {
                    case "before now":
                        $material->setVisibleUntil((new \DateTime())->sub(new \DateInterval('P5D')));
                        break;
                    case "after now":
                        $material->setVisibleUntil((new \DateTime())->add(new \DateInterval('P10D')));
                        break;
                    case "two years ago":
                        $material->setVisibleUntil((new \DateTime())->sub(new \DateInterval('P20M')));
                }

                if (isset($row['isFinished']) && $row['isFinished'] === "true") {
                    $material->setIsFinished(true);
                }

                $material->setUpdatedAt($material->getPublishAt());
                $this->entityIdAliases->persistAndAddIdAlias($material, $materialAlias, self::MATERIAL_IRI_PATH);
            }
        }
    }

    /**
     * @Given /^I have the following outflows:$/
     */
    public function iHaveTheFollowingOutflows(TableNode $table) {
        foreach ($table->getHash() as $row) {
            $outflowAlias = $row["outflowAlias"];
            $materialAlias = $row["materialAlias"];
            $reservingOrganizationAlias = $row["reservingOrganizationAlias"];

            $outflow = $this->entityIdAliases->findOutflowByAlias($outflowAlias);

            $material = $this->entityIdAliases->findMaterialByAlias($materialAlias);
            Assert::notNull($material, "Failed to create Outflow. Material with alias '$materialAlias' null");

            $reservingOrganization = $this->entityIdAliases->findOrganizationByAlias($reservingOrganizationAlias);
            if ($reservingOrganizationAlias) {
                Assert::notNull($reservingOrganization, "Failed to create Organization. Organization with alias '$reservingOrganization' null");
            }

            if (!$outflow) {
                $outflow = new Outflow();
                // IMPORTANT: Order matters here!!!
                $material->addOutflow($outflow);
                $outflow->setQuantity(10);
                $outflow->setPickedUpAt($row["pickedUpAt"] === "true" ? new \DateTime() : null);
                $outflow->setReservingOrganization($reservingOrganization);
                $this->entityIdAliases->persistAndAddIdAlias($outflow, $outflowAlias, self::OUTFLOW_IRI_PATH);
            }
        }
    }

    /**
     * @Given /^I have the following inflows:$/
     */
    public function iHaveTheFollowingInflows(TableNode $table) {
        foreach ($table->getHash() as $row) {
            $inflowAlias = $row["inflowAlias"];
            $materialAlias = $row["materialAlias"];
            $inflow = $this->entityIdAliases->findMaterialByAlias($inflowAlias);
            $material = $this->entityIdAliases->findMaterialByAlias($materialAlias);
            Assert::notNull($material, "Failed to create Inflow. Material with alias '$materialAlias' null");

            if (!$inflow) {
                $inflow = new Inflow();
                // IMPORTANT: Order matters here!!!
                $material->addInflow($inflow);
                $inflow->setQuantity(10);
                $this->entityIdAliases->persistAndAddIdAlias($inflow, $inflowAlias, self::INFLOW_IRI_PATH);
            }
        }
    }

    /**
     * @When /^I run the command "([^"]*)"$/
     */
    public function iRunTheCommand(string $commandName) {
        // IMPORTANT: or some reason we cannot call the command directly as this will close the entityManager
        // in this context breaking all steps after this one.
        AnonymizationCommand::anonymize($this->entityManager);
    }

    /**
     * @When /^I delete the following users:$/
     */
    public function iDeleteTheFollowingUsers(TableNode $table) {
        foreach ($table->getHash() as $row) {
            $userAlias = $row["userAlias"];
            $user = $this->entityIdAliases->findUserByAlias($userAlias);
            try {
                $this->entityManager->remove($user);
                $this->entityManager->flush();
            } catch (Exception $exception) {
                array_push($this->exceptions, $exception);
            }
        }
    }

    /**
     * @When /^I delete the following storages:$/
     */
    public function iDeleteTheFollowingStorages(TableNode $table) {
        foreach ($table->getHash() as $row) {
            $storageAlias = $row["storageAlias"];
            $storage = $this->entityIdAliases->findStorageByAlias($storageAlias, true);
            try {
                $this->entityManager->remove($storage);
                $this->entityManager->flush();
            } catch (Exception $exception) {
                array_push($this->exceptions, $exception);
            }
        }
    }

    /**
     * @When /^I delete the following organizations:$/
     */
    public function iDeleteTheFollowingOrganizations(TableNode $table) {
        foreach ($table->getHash() as $row) {
            $organizationAlias = $row["organizationAlias"];
            $organization = $this->entityIdAliases->findOrganizationByAlias($organizationAlias);
            try {
                $this->entityManager->remove($organization);
                $this->entityManager->flush();
            } catch (Exception $exception) {
                array_push($this->exceptions, $exception);
            }
        }
    }

    /**
     * @Then I expect no exceptions to be thrown
     */
    public function iExpectNoExceptionsToBeThrown() {
        Assert::eq(sizeof($this->exceptions), 0);
    }

    /**
     * @Then I expect some exceptions to be thrown
     */
    public function iExpectSomeExceptionsToBeThrown() {
        Assert::notEq(sizeof($this->exceptions), 0);
    }

    ########### Requests and Responses ###########

    /**
     * @Then /^the GraphQL response data for "([^"]*)" should not be null$/
     */
    public function theGraphQLResponseDataForShouldNotBeNull(string $dataName) {
        $content = $content = $this->getLastResponseContentAsArray();
        $actualDataForName = $content["data"][$dataName];
        Assert::notNull($actualDataForName);
    }

    /**
     * @When /^I send the following GraphQL request:$/
     */
    public function ISendTheFollowingGraphqlRequest(PyStringNode $requestBody) {
        $request = Request::create('/graphql', Request::METHOD_GET, [
            "query" => $this->entityIdAliases->replaceAllAliasIrisInString($requestBody->getRaw())
        ]);
        $this->handleRequest($request);
    }


    /**
     * @When /^I send the last GraphQL request again$/
     */
    public function ISendTheLastGraphqlRequestAgain() {
        $this->handleRequest($this->lastRequest);
    }

    private function handleRequest(Request $request) {
        $this->lastRequest = $request;
        $response = $this->kernel->handle($request);
        $this->lastResponse = $response;
    }


    /**
     * @Then /^the response should be a GraphQL error message "([^"]*)"$/
     */
    public function theResponseShouldBeAGraphQLErrorMessage($expectedMessage, string $field = "message") {
        $content = $this->getLastResponseContentAsArray();

        Assert::keyExists($content, "errors", "Response was expected to contain the key 'errors'!");
        $actualMessage = $content["errors"][0][$field];
        Assert::eq($actualMessage, $expectedMessage);
    }

    /**
     * @Then /^the response should be a GraphQL error debug message "([^"]*)"$/
     */
    public function theResponseShouldBeAGraphQLErrorDebugMessage($expectedMessage, string $field = "debugMessage") {
        $content = $this->getLastResponseContentAsArray();

        Assert::keyExists($content, "errors", "Response was expected to contain the key 'errors'!");
        Assert::true(isset($content["errors"][0][$field]), "First error schould contain field '$field'!");
        $actualMessage = $content["errors"][0][$field];
        Assert::eq($actualMessage, $expectedMessage);
    }


    /**
     * @Then /^the response should be a GraphQL item not found error message for "([^"]*)"$/
     */
    public function theResponseShouldBeAGraphQLItemNotFoundErrorMessageFor($alias) {
        $iri = $this->entityIdAliases->getIriForIdAlias($alias);
        Assert::notNull($iri, "Iri was null for alias '$alias'");
        $this->theResponseShouldBeAGraphQLErrorMessage('Item "' . $iri . '" not found.');
    }

    /**
     * @Then /^the response should be a GraphQL item not found error debug message for "([^"]*)"$/
     */
    public function theResponseShouldBeAGraphQLItemNotFoundErrorDebugMessageFor($alias) {
        $iri = $this->entityIdAliases->getIriForIdAlias($alias);
        Assert::notNull($iri, "Iri was null for alias '$alias'");
        $this->theResponseShouldBeAGraphQLErrorMessage('Item not found for "' . $iri . '".', "debugMessage");
    }

    private function getLastResponseContentAsArray(): array {
        return json_decode($this->lastResponse->getContent(), true);
    }

    ########### Introspection ###########

    /**
     * @When /^I use GraphQL introspection to load query, mutation and entity types of the schema$/
     */
    public function iUseGraphQLIntrospectionToLoadPartsOfTheSchema() {
        $queryString = "
            {
              __schema {
                queryType {
                  fields {
                    name
                  }
                }
                mutationType {
                  fields {
                    name
                  }
                }
                types {
                  name
                  fields {
                    name
                  }
                  inputFields {
                    name
                  }
                }
              }
            }
        ";

        $this->ISendTheFollowingGraphqlRequest(new PyStringNode([$queryString], 0));
    }

    /**
     * @Then /^the schema should only contain the allowed queries:$/
     */
    public function theResponseShouldOnlyContainTheAllowedQueries(TableNode $table) {
        $content = $this->getLastResponseContentAsArray();
        $actualQueryNames = array_map(function ($field) {
            return $field["name"];
        }, $content["data"]["__schema"]["queryType"]["fields"]);

        $expectedQueryNames = $table->getColumn(0);

        Assert::allInArray($actualQueryNames, $expectedQueryNames);
    }

    /**
     * @Then /^the schema should only contain the allowed mutations:$/
     */
    public function theResponseShouldOnlyContainTheAllowedMutations(TableNode $table) {
        $content = $this->getLastResponseContentAsArray();

        $actualQueryNames = array_map(function ($field) {
            return $field["name"];
        }, $content["data"]["__schema"]["mutationType"]["fields"]);

        $expectedQueryNames = $table->getColumn(0);

        Assert::allInArray($actualQueryNames, $expectedQueryNames);
    }

    /**
     * @Then /^the schema should contain a type "([^"]*)" with only the allowed fields:$/
     */
    public function theResponseShouldContainATypeWithOnlyTheAllowedFields($name, TableNode $table) {
        $this->theResponseContainsTypeWithAllowedFields($name, $table, "fields");
    }

    /**
     * @Then /^the schema should contain a type "([^"]*)" with only the allowed input fields:$/
     */
    public function theResponseShouldContainATypeWithOnlyTheAllowedInputFields($name, TableNode $table) {
        $this->theResponseContainsTypeWithAllowedFields($name, $table, "inputFields");
    }

    private function theResponseContainsTypeWithAllowedFields($name, TableNode $table, $fieldsKey) {
        $content = $this->getLastResponseContentAsArray();
        $types = $content["data"]["__schema"]["types"];

        $type = null;

        foreach ($types as $currentType) {
            if ($currentType["name"] === $name) {
                $type = $currentType;
                break;
            }
        }

        Assert::notNull($type, "Response should contain GraphQL type '$name'");
        Assert::true(array_key_exists($fieldsKey, $type), "GraphQL type '$name' should contain '$fieldsKey'");

        $actualFieldNames = array_map(function ($field) {
            return $field["name"];
        }, $type[$fieldsKey]);
        $expectedFieldNames = $table->getColumn(0);

        $missingInActual = implode(", ", array_diff($expectedFieldNames, $actualFieldNames));
        Assert::isEmpty($missingInActual, "The following fields are missing in response: $missingInActual");
        $notExpectedInActual = implode(", ", array_diff($actualFieldNames, $expectedFieldNames));
        Assert::isEmpty($notExpectedInActual, "The following fields were not expected in response: $notExpectedInActual");
    }


    /**
     * @Then /^the schema should not contain a type "([^"]*)"$/
     */
    public function theSchemaShouldNotContainAType($typeName) {
        $content = $this->getLastResponseContentAsArray();
        $typeNames = array_map(function ($type) {
            return $type["name"];
        }, $content["data"]["__schema"]["types"]);

        Assert::true(!in_array($typeName, $typeNames));
    }


    ########### Iris ###########

    /**
     * @Then /^the GraphQL response should or should not contain the following iris:$/
     */
    public function theGraphQLResponseShouldOrShouldNotContainTheFollowingIris(TableNode $table) {
        $rows = $table->getHash();
        $iris = array_map(function (array $row) {
            $alias = $row["aliasKey"];
            $should = $row["shouldContain"] === "true";
            return [
                "iri" => $this->entityIdAliases->getIriForIdAlias($alias, true),
                "aliasKey" => $alias,
                "shouldContain" => $should,
            ];
        }, $rows);

        $responseAsString = json_encode(json_decode($this->lastResponse->getContent(), true), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_LINE_TERMINATORS);

        foreach ($iris as $iriItem) {
            $iri = $iriItem["iri"];
            $alias = $iriItem["aliasKey"];
            $shouldContain = $iriItem["shouldContain"];
            if ($shouldContain) {
                Assert::contains($responseAsString, $iri, "Response should contain iri '$iri' for alias '$alias' ");
            } else {
                Assert::notContains($responseAsString, $iri, "Response should not contain iri '$iri' for alias '$alias' ");
            }
        }
    }

    /**
     * @Then /^Then the GraphQL response should or should not contain the following content:$/
     */
    public function theGraphQLResponseShouldOrShouldNotContainTheFollowingContent(TableNode $table) {
        $rows = $table->getHash();

        $responseAsString = json_encode(json_decode($this->lastResponse->getContent(), true), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_LINE_TERMINATORS);

        foreach ($rows as $row) {
            $content = $row["content"];
            $shouldContain = $row["shouldContain"] === "true";
            if ($shouldContain) {
                Assert::contains($responseAsString, $content, "Response should contain content '$content'");
            } else {
                Assert::notContains($responseAsString, $content, "Response should not contain iri '$content'");
            }
        }
    }

    ########### Debug ###########

    /**
     * @Given /^I debug the aliases$/
     */
    public function iDebugTheAliases() {
        echo json_encode($this->entityIdAliases->getAliases());
    }

    /**
     * @Then /^I debug the last response$/
     */
    public function iDebugTheLastResponse() {
        echo $this->lastResponse;
    }

    /**
     * @Then /^I debug the last response content$/
     */
    public function iDebugTheLastResponseContent() {
        echo json_encode(json_decode($this->lastResponse->getContent(), true), JSON_PRETTY_PRINT);
    }

    /**
     * @Then I debug the exceptions
     */
    public function iDebugTheExceptions() {
        foreach ($this->exceptions as $exception) {
            echo $exception->getMessage();
        }
    }

    private function mailsAsArrayOfString(array $mails): array {
        return array_map(function (TemplatedEmail $email) {
            /** @var $toAddress Address */
            $toAddress = $email->getTo()[0];
            $subject = $email->getSubject();
            $recipient = $toAddress->getAddress();
            return "{subject: $subject, recipient: $recipient}";
        }, $mails);
    }

    /**
     * @Then /^I debug the last send mails$/
     */
    public function iDebugTheLastSendMails() {
        if(sizeof($this->testMailService->getLastMails())> 0) {
            echo(implode("\n",$this->mailsAsArrayOfString($this->testMailService->getLastMails())));
        } else {
            echo "NO MAILS";
        }

    }

    /**
     * @When /^I reset the last send mails$/
     */
    public function iResetTheLastSendMails() {
        $this->testMailService->reset();
    }

    /**
     * @Then /^the following individual mails were sent:$/
     */
    public function theFollowingIndividualMailsWereSent(TableNode $table) {
        $sendMails = array_map(function($mail){
            // We send each mail individually to prevent leaking of mail-addresses
            Assert::true(
                sizeof($mail->getTo()) === 1,
                "A send email should only have exactly one mail-address as a receiver! This is important for privacy!!!"
            );
            return [
                "subject" => $mail -> getSubject(),
                "recipient" => $mail->getTo()[0]->getAddress(),
                "wasMatched" => false
            ];
        }, $this->testMailService->getLastMails());

        $rows = array_map(function ($row){
            return array_merge($row, ["hasCorrespondingMail" => false]);
        },$table->getHash());

        foreach ($rows as &$row) {
            $textInSubject = $row["textInSubject"];
            $expectedRecipientAddress = strtolower(trim($row["to"]));

            foreach ($sendMails as &$mail) {
                if(!$mail["wasMatched"]) {
                    $actualRecipientAddress = $mail["recipient"];
                    $subjectMatches = strpos($mail["subject"], $textInSubject) !== false;
                    $recipientMatches = $actualRecipientAddress === $expectedRecipientAddress;

                    if($subjectMatches && $recipientMatches){
                        $mail["wasMatched"] = true;
                        $row["hasCorrespondingMail"] = true;
                        break;
                    }
                }
            }
        }

        $additionalMails = array_filter($sendMails, function($mail){
            return  !$mail["wasMatched"];
        });
        $additionalMailMessage = json_encode($additionalMails, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);

        $rowsWithNoCorrespondingMail = array_filter($rows, function($row){
            return  !$row["hasCorrespondingMail"];
        });
        $rowsWithNoCorrespondingMailMessage = json_encode($rowsWithNoCorrespondingMail, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);

        Assert::true(sizeof($additionalMails) === 0, "Expected no additional mails to be send but got\n $additionalMailMessage\n");
        Assert::true(sizeof($rowsWithNoCorrespondingMail) === 0, "Expected all mails to be sent but got unsent ones \n $rowsWithNoCorrespondingMailMessage");
    }

    /**
     * @When /^I send "([^"]*)" real mails$/
     */
    public function iSendMails(int $amount) {
        echo $amount;

        for ($i = 0; $i < $amount; $i++) {
            $email = (new TemplatedEmail())
                ->from("bar@foo.de")
                ->to("foo$i@bar.de")
                ->subject("$i")
                ->text("DUMMY MAIL $i");
            $this->testMailService->sendMail($email);
        }
    }

    /**
     * @Given /^The user "([^"]*)" uploaded a MediaObject "([^"]*)" for Material "([^"]*)"$/
     */
    public function iHaveUploadedAMediaObjectForMaterial($userAlias, $mediaObjectAlias, $materialAlias) {
        $user = $this->entityIdAliases->findUserByAlias($userAlias);
        $material = $this->entityIdAliases->findMaterialByAlias($materialAlias);

        $mediaObject = new MediaObject();
        // IMPORTANT: Order matters here!!!
        $material->addImage($mediaObject);
        $mediaObject->setUploadedBy($user);
        $this->entityIdAliases->persistAndAddIdAlias($mediaObject, $mediaObjectAlias, self::MEDIA_OBJECT_IRI_PATH);
    }
}
