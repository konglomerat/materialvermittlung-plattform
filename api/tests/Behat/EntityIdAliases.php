<?php


namespace App\Tests\Behat;


use App\Entity\Inflow;
use App\Entity\Material;
use App\Entity\Organization;
use App\Entity\Outflow;
use App\Entity\Storage;
use App\Entity\User;
use App\Repository\InflowRepository;
use App\Repository\MaterialRepository;
use App\Repository\OrganizationRepository;
use App\Repository\OutflowRepository;
use App\Repository\StorageRepository;
use App\Repository\UserRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Webmozart\Assert\Assert;

class EntityIdAliases {

    private array $aliases = [];


    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var OrganizationRepository
     */
    private $organizationRepository;

    /**
     * @var StorageRepository
     */
    private $storageRepository;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var MaterialRepository
     */
    private $materialRepository;

    /**
     * @var InflowRepository
     */
    private $inflowRepository;

    /**
     * @var OutflowRepository
     */
    private $outflowRepository;

    public function __construct(EntityManagerInterface $entityManager) {
        $this->entityManager = $entityManager;
        $this->organizationRepository = $entityManager->getRepository(Organization::class);
        $this->storageRepository = $entityManager->getRepository(Storage::class);
        $this->userRepository = $entityManager->getRepository(User::class);
        $this->materialRepository = $entityManager->getRepository(Material::class);
        $this->inflowRepository = $entityManager->getRepository(Inflow::class);
        $this->outflowRepository = $entityManager->getRepository(Outflow::class);
    }

    public function reset() {
        $this->aliases = [];
    }

    public function getAliases() {
        return $this->aliases;
    }

    private function getAlias(string $aliasKey): ?array {
        if(key_exists($aliasKey, $this->aliases)) {
            return $this->aliases[$aliasKey];
        } else {
            return null;
        }
    }

    public function getIdForAlias(string $aliasKey): ?int {
        $alias = $this->getAlias($aliasKey);
        if($alias) {
            return $alias["id"];
        } else {
            return null;
        }
    }

    public function getIriForIdAlias(string $aliasKey, bool $failIfNotExists = false): ?string {
        $alias = $this->getAlias($aliasKey);
        if($alias) {
            return $alias["iri"];
        } else {
            if($failIfNotExists) {
                throw new \Exception("No alias found for '$aliasKey'");
            }
            return null;
        }
    }

    public function findMaterialByAlias(string $aliasKey, bool $assertExists = false): ?Material {
        $id = $this->getIdForAlias($aliasKey);
        $entity = $id ? $this->materialRepository->find($id) : null;
        if($assertExists) {
            $this->assertEntityExists($aliasKey, $id, $entity, "Material");
        }
        return $entity;
    }

    public function findInflowByAlias(string $aliasKey, bool $assertExists = false): ?Inflow {
        $id = $this->getIdForAlias($aliasKey);
        $entity = $id ? $this->inflowRepository->find($id) : null;
        if($assertExists) {
            $this->assertEntityExists($aliasKey, $id, $entity, "Inflow");
        }
        return $entity;
    }

    public function findOrganizationByAlias(string $aliasKey, bool $assertExists = false): ?Organization {
        $id = $this->getIdForAlias($aliasKey);
        $entity = $id ? $this->organizationRepository->find($id) : null;
        if($assertExists) {
            $this->assertEntityExists($aliasKey, $id, $entity, "Organization");
        }
        return $entity;
    }

    public function findUserByAlias(string $aliasKey, bool $assertExists = false): ?User {
        $id = $this->getIdForAlias($aliasKey);
        $entity = $id ? $this->userRepository->find($id) : null;
        if($assertExists) {
            $this->assertEntityExists($aliasKey, $id, $entity, "User");
        }
        return $entity;
    }

    public function findStorageByAlias(string $aliasKey, bool $assertExists = false): ?Storage {
        $id = $this->getIdForAlias($aliasKey);
        $entity = $id ? $this->storageRepository->find($id) : null;
        if($assertExists) {
            $this->assertEntityExists($aliasKey, $id, $entity, "Storage");
        }
        return $entity;
    }

    public function findOutflowByAlias(string $aliasKey, bool $assertExists = false): ?Outflow {
        $id = $this->getIdForAlias($aliasKey);
        $entity = $id ? $this->outflowRepository->find($id) : null;
        if($assertExists) {
            $this->assertEntityExists($aliasKey, $id, $entity, "Outflow");
        }
        return $entity;
    }

    public function persistAndAddIdAlias(object $entity, string $aliasKey, string $iriPath){
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
        $id = $entity->getId();
        $this->aliases[$aliasKey] = [
            "id" => $id,
            "iri" => $iriPath . $id
        ];
    }

    public function replaceAllAliasIrisInString(string $string): string {
        foreach($this->aliases as $aliasKey => $alias){
            $string = str_replace('ALIAS_IRI('.$aliasKey.')', $alias["iri"], $string);
        }
        return $string;
    }

    private function assertEntityExists($aliasKey, $id, $entity, $entityName){
        Assert::notNull($id, "No $entityName id found for alias '$aliasKey'!");
        Assert::notNull($entity, "No $entityName found for alias '$aliasKey'!");
    }
}
