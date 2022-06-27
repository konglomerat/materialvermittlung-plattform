<?php
/*
 * Copyright (c) 2022 Sandstorm Media GmbH
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

namespace App\DataFixtures;

use App\Entity\Inflow;
use App\Entity\Material;
use App\Entity\MediaObject;
use App\Entity\Organization;
use App\Entity\Outflow;
use App\Entity\Storage;
use App\Entity\User;
use App\Enum\MaterialFlowCommentsEnum;
use App\Enum\MaterialUnitEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class OrganizationFixtures extends Fixture
{
    const DRAFT = "draft";
    const ACTIVE = "active";
    const FINISHED = "finished";

    private $passwordEncoder;

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        $materialVermittlung = new Organization();
        $materialVermittlung->setName("Materialvermittlung");
        $materialVermittlung->addNotificationMailAddress("mat@materialvermittlung.org");
        $materialVermittlung->setImprint($faker->sentence(20));

        $fooCompany = new Organization();
        $fooCompany->setName("Foo Company");
        $fooCompany->addNotificationMailAddress("bar@fooCompany.de");
        $fooCompany->setImprint($faker->sentence(20));

        $konglomerat = new Organization();
        $konglomerat->setName("Konglomerat");
        $konglomerat->addNotificationMailAddress("konglo@konglo.de");

        $this->createOrganization($manager, "Materialvermittlung", "Mat", $materialVermittlung, $fooCompany, true);
        $this->createOrganization($manager, "Konglomerat", "Konglo", $konglomerat, $fooCompany, true);
        $this->createOrganization($manager, "Foo Company", "Foo", $fooCompany, $materialVermittlung);
    }

    private function createOrganization($manager, string $storageName, string $userName, Organization $organization, Organization $otherOrganization, bool $storageIsPublic = false) {
        $faker = Factory::create();
        $imageNames = array_diff(scandir(__DIR__ . "/images"), array('..', '.'));

        $simpleUser = new User();
        $simpleUser->setName($userName . " User");
        $simpleUser->setEmail(strtolower($userName) . ".user@example.org");
        $simpleUser->setPassword($this->passwordEncoder->encodePassword($simpleUser,'password'));
        $simpleUser->setOrganization($organization);
        $simpleUser->setHasAcceptedTerms($faker->dateTime());

        $adminUser = new User();
        $adminUser->setName($userName . " Admin");
        $adminUser->setEmail(strtolower($userName) . ".admin@example.org");
        $adminUser->setRoles(["ROLE_ORG_ADMIN"]);
        $adminUser->setPassword($this->passwordEncoder->encodePassword($adminUser,'password'));
        $adminUser->setOrganization($organization);
        $adminUser->setHasAcceptedTerms($faker->dateTime());

        $hasToAcceptTermsUser = new User();
        $hasToAcceptTermsUser->setName($userName . " Terms User");
        $hasToAcceptTermsUser->setEmail(strtolower($userName) . ".terms@example.org");
        $hasToAcceptTermsUser->setPassword($this->passwordEncoder->encodePassword($simpleUser,'password'));
        $hasToAcceptTermsUser->setOrganization($organization);

        $storage = new Storage();
        $storage->setTitle($storageName . " Lager");
        $storage->setAddressStreet($faker->streetName . " " . $faker->buildingNumber);
        $storage->setAddressPostalCode($faker->postcode);
        $storage->setAddressCity($faker->city);
        $storage->setContact("Wir sind telefonisch erreichbar Montags und Dienstags 10:00 - 12:00 \n Tel.: $faker->phoneNumber \n\n Oder gerne via E-Mail: $faker->companyEmail");
        $storage->setNotes($faker->sentence(20));
        $storage->setIsPublic($storageIsPublic);

        $organization->addStorage($storage);

        $manager->persist($organization);
        $manager->persist($simpleUser);
        $manager->persist($adminUser);
        $manager->persist($hasToAcceptTermsUser);
        $manager->persist($storage);

        for($mat = 0; $mat < 80; $mat++) {
            // repeating same elements to shift probabilities
            $status = $faker->randomElement([
                self::DRAFT,
                self::ACTIVE,
                self::ACTIVE,
                self::ACTIVE,
                self::ACTIVE,
                self::ACTIVE,
                self::ACTIVE,
                self::FINISHED,
                self::FINISHED,
                self::FINISHED,
            ]);

            $material = new Material();
            // TODO: this should not be needed as we assign a storage
            $material->setOrganization($organization);
            $material->setStorage($storage);
            $material->setCreatedBy($simpleUser);

            $publishAt = $faker->dateTimeBetween(
                (new \DateTime())->sub(new \DateInterval("P8M")),
                (new \DateTime())->add(new \DateInterval("P8M"))
            );

            if($publishAt > new \DateTime()) {
                $createdAt = (new \DateTime())->sub(new \DateInterval("P". $faker->numberBetween(3, 8)."M"));
                $updatedAt = (new \DateTime())->sub(new \DateInterval("P". $faker->numberBetween(0, 2)."M"));
            } else {
                $createdAt = (clone $publishAt)->sub(new \DateInterval("P". $faker->numberBetween(3, 8)."M"));
                $updatedAt = (clone $publishAt)->sub(new \DateInterval("P". $faker->numberBetween(0, 2)."M"));
            }

            // IMPORTANT: make sure to clone the date, otherwise dates will be the same
            $visibleUntil = (clone $publishAt)->add(new \DateInterval("P". $faker->numberBetween(1, 20)."D"));

            if($status === self::DRAFT) {
                $material->setIsDraft(true);
                $material->setIsFinished(false);
                $material->setPublishAt(null);
                $material->setVisibleUntil(null);
                $material->setDescription($faker->boolean() ? $faker->sentence(20) : "");
                $material->setQuantityUnit(MaterialUnitEnum::STUECK);
            }

            $supportedUnits = [MaterialUnitEnum::STUECK, MaterialUnitEnum::KILOGRAMM, MaterialUnitEnum::METER];

            if($status === self::ACTIVE) {
                $material->setIsDraft(false);
                $material->setIsFinished(false);
                $material->setPublishAt($publishAt);
                // some end some don't
                $material->setVisibleUntil($faker->boolean ? $visibleUntil : null);
                $material->setDescription($faker->sentence(20));
                $material->setQuantityUnit($faker->randomElement($supportedUnits));
            }

            if($status === self::FINISHED) {
                $material->setIsDraft(false);
                $material->setIsFinished(true);
                $material->setPublishAt($publishAt);
                $material->setVisibleUntil($visibleUntil);
                $material->setDescription($faker->sentence(20));
                $material->setQuantityUnit($faker->randomElement($supportedUnits));
            }

            $material->setCreatedAt($createdAt);
            $material->setUpdatedAt($updatedAt);
            $material->setTitle($faker->catchPhrase);
            $material->setDisallowPartialReservations($faker->boolean);

            $material->setColor($faker->boolean ? $faker->safeColorName : "");

            // Images
            for($img = 0; $img < $faker->numberBetween(2, 4); $img++) {
                $imageName = $faker->randomElement($imageNames);
                $source = __DIR__ . "/images/" . $imageName;
                $dest = __DIR__ . "/tmp/" . $imageName;
                copy($source, $dest);

                $file = new UploadedFile(
                    $dest,
                    $imageName,
                    'image/jpeg',
                    null,
                    true
                );

                $mediaObject = new MediaObject();
                $mediaObject->file = $file;
                $material->addImage($mediaObject);
                $manager->persist($material);
                $manager->persist($mediaObject);
            }

            $inflowRemainingAmount = 0;

            // Inflows
            if($status !== self::DRAFT) {
                for($inf = 0; $inf < ($status !== self::DRAFT ? 1 : $faker->numberBetween(1, 4)); $inf++) {
                    $quantity = $faker->randomFloat(Material::QUANTITY_PRECISION,100, 2400);
                    $inflowRemainingAmount += $quantity;
                    $inflow = new Inflow();
                    $inflow->setMaterial($material);
                    $inflow->setQuantity($quantity);
                    $inflow->setCreatedOn($createdAt);
                    $inflow->setComment($status === self::DRAFT ?
                        null :
                        $faker->randomElement(MaterialFlowCommentsEnum::INFLOW_ALL)
                    );
                    $manager->persist($material);
                    $manager->persist($inflow);
                }
            } else {
                // If draft we create an initial inflow
                $inflow = new Inflow();
                $inflow->setMaterial($material);
                $inflow->setQuantity(0);
                $inflow->setCreatedOn($createdAt);
                $manager->persist($material);
                $manager->persist($inflow);
            }

            // Outflows
            if($status !== self::DRAFT) {
                $otherOrganizationAlreadyMadeReservation = false;
                for($outf = 0; $outf < $faker->numberBetween(2, 10); $outf++) {
                    $quantity = $faker->randomFloat(Material::QUANTITY_PRECISION,10, 120);
                    $isReservation = $faker->randomElement([false, false, false, true ]);
                    $wasPickedUp = $faker->boolean();

                    if($inflowRemainingAmount > 0){
                        $outflow = new Outflow();
                        $outflow->setMaterial($material);
                        // increase the chance of creating material with no quantity left
                        $outflow->setQuantity($inflowRemainingAmount >= $quantity ? $quantity : $inflowRemainingAmount );
                        $outflow->setCreatedOn($createdAt);

                        if($isReservation) {
                            if(!$otherOrganizationAlreadyMadeReservation){
                                // we only want to create one reservation per organization and material
                                $otherOrganizationAlreadyMadeReservation = true;
                                $outflow->setReservingOrganization($otherOrganization);
                                $manager->persist($otherOrganization);
                            }
                            $outflow->setReservationApprovedAt($faker->boolean() ? new \DateTime() : null);
                            if($wasPickedUp) {
                                $outflow->setReservationApprovedAt(new \DateTime());
                                // reservation can be picked up later
                                $outflow->setPickedUpAt($createdAt);
                                $outflow->setComment(Outflow::COMMENT_PICKUP_WITH_RESERVATION);
                            }
                        } else {
                            // directly added outflows will always have a date
                            // the date will be set when the outflow is created
                            $outflow->setPickedUpAt($createdAt);
                            $outflow->setComment($faker->randomElement(MaterialFlowCommentsEnum::OUTFLOW_ALL));
                        }

                        $manager->persist($material);
                        $manager->persist($outflow);

                        $inflowRemainingAmount -= $quantity;
                    } else {
                        // should not create more outflows that quantity
                        // of inflows allows
                        break;
                    }
                }
            }
        }

        $manager->flush();
    }

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }
}
