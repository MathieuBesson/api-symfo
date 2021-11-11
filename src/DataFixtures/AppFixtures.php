<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{

    private $userPasswordHasher; 

    /**
     * Password encoder 
     *
     * @param UserPasswordHasherInterface $encoder
     */
    public function __construct(UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userPasswordHasher = $userPasswordHasher; 
    }

    public function load(ObjectManager $manager): void
    {

        $faker = Factory::create('fr_FR');
        
        for ($u = 0; $u <= 10; $u++) {
            $user = new User();
            $user->setEmail($faker->email)
            ->setFirstName($faker->firstName)
            ->setLastName($faker->lastName)
            ->setPassword( $this->userPasswordHasher->hashPassword($user, 'password'));
            
            $manager->persist($user);
            
            for ($i = 0; $i <= mt_rand(5, 20); $i++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setCompany($faker->company)
                    ->setCurrentUser($user); 
    
                $manager->persist($customer);
    
                for ($j = 0; $j <= mt_rand(3, 10); $j++) {
                    $invoice =  new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 month'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setChrono($i +1);
    
                    $manager->persist($invoice);
                }
            }
        }


        $manager->flush();
    }
}
