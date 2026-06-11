<?php

 class Vaga{
    public int $id;
    public int $empresaId;
    public string $titulo;
    public string $descricao;
    public string $area;
    public string $requisitos;
    public float $cargaHoraria;
    public string $modalidade;
    public string $status;
    public ?string $createdAt;

    public function __construct(int $id, int $empresaId, string $titulo, string $descricao, string $area, string $requisitos, float $cargaHoraria, string $modalidade, string $status, ?string $createdAt){
        $this->id = $id;
        $this->empresaId = $empresaId;
        $this->titulo = $titulo;
        $this->descricao = $descricao;
        $this->area = $area;
        $this->requisitos = $requisitos;
        $this->cargaHoraria = $cargaHoraria;
        $this->modalidade = $modalidade;
        $this->status = $status;
        $this->createdAt = $createdAt;

    }
    }
?>