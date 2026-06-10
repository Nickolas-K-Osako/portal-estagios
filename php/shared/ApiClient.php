<?php

class ApiClient{

    private string $baseUrl = 'http://localhost:8080';  

    public function get(string $endpoint): array{
        $json = file_get_contents($this->baseUrl . $endpoint);
        if ($json === false) return [];
        return json_decode($json, true);
    }

    public function post(string $endpoint, array $dados): array {
        $options = [
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => json_encode($dados)

            ]
        ];
        $context = stream_context_create($options);
        $json = file_get_contents($this->baseUrl . $endpoint, false, $context);
        if ($json === false) return [];
        return json_decode($json, true);

    }

    public function patch(string $endpoint, array $dados): array{
        $options = [
            'http' => [
                'method' => 'PATCH',
                'header' => 'Content-Type: aplication/json',
                'content' => json_encode($dados)
            ]
        ];
        $context = stream_context_create($options);
        $json = file_get_contents($this->baseUrl . $endpoint, false, $context);
        if ($json === false) return[]; 
        return json_decode($json, true);
    }

    public function delete(string $endpoint, array $dados): bool{
        $options = [
            'http' => [
                'method' => 'DELETE',
            ]
        ];
        $context = stream_context_create($options);
        $json = file_get_contents($this->baseUrl . $endpoint, false, $context);
        if ($json === false) return false; 
        return true;
    }
}
