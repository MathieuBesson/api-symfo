<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;
use App\Filter\OrSearchFilter;

/**
 * @ApiResource(
 *  collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE"},
 *  subresourceOperations={
 *      "invoices_get_subresource"={"path"="/customers/{id}/invoices"}
 *  },
 *  normalizationContext={
 *      "groups"={"customers_read"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *      "firstName":"partial",
 *      "lastName":"partial",
 *      "company":"partial",
 *      "email":"partial"
 * })
 *  attributes={
 *      "pagination_enabled"=true,
 *      "pagination_items_per_page"=10,
 *      "order": {"sentAt":"desc"}
 *  },
 * @ApiFilter(
 *     OrSearchFilter::class, properties={
 *         "or_firstName_lastName_company_email"={
 *                 "firstName":"ipartial",
 *                 "lastName":"ipartial",
 *                 "company":"ipartial",
 *                 "email":"ipartial"
 *              }
 *     }
 * )
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers_read","invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=300)
     * @Groups({"customers_read","invoices_read"})
     * @Assert\NotBlank(message="Le prénom du customer est obligatoire")
     * @Assert\Length(min=3, minMessage="Le prénom doit faire entre 3 et 255 caractères", max=255, maxMessage="Le prénom doit faire entre 3 et 255 caractères")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=300)
     * @Groups({"customers_read","invoices_read"})
     * @Assert\NotBlank(message="Le nom de famille du customer est obligatoire")
     * @Assert\Length(min=3, minMessage="Le nom de famille doit faire entre 3 et 255 caractères", max=255, maxMessage="Le nom de famille doit faire entre 3 et 255 caractères")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=300)
     * @Groups({"customers_read","invoices_read"})
     * @Assert\NotBlank(message="L'adresse email du customer est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit être valide")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=300)
     * @Groups({"customers_read","invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource()
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read"})
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $currentUser;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Get total customer amount 
     * @Groups({"customers_read"})
     * @return void
     */
    public function getTotalAmount()
    {
        $totalAmount = 0;
        foreach ($this->getInvoices() as $invoice) {
            $totalAmount += $invoice->getAmount();
        }
        return $totalAmount;
    }


    /**
     * Get total customer unpaid amount 
     * @Groups({"customers_read"})
     * @return void
     */
    public function getTotalUnpaidAmount()
    {
        $totalUnpaidAmount = 0;
        foreach ($this->getInvoices() as $invoice) {
            $totalUnpaidAmount += ($invoice->getStatus() === 'PAID' || $invoice->getStatus() === 'CANCELLED') ? 0 : $invoice->getAmount();
        }
        return $totalUnpaidAmount;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getCurrentUser(): ?User
    {
        return $this->currentUser;
    }

    public function setCurrentUser(?User $currentUser): self
    {
        $this->currentUser = $currentUser;

        return $this;
    }
}
