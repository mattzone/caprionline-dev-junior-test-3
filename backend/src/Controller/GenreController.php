<?php

namespace App\Controller;

use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GenreController extends AbstractController
{
    public function __construct(
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/genres', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $genres = $this->genreRepository->findAll();
        $data = $this->serializer->serialize($genres, "json");

        return new JsonResponse($data, json: true);
    }
}
