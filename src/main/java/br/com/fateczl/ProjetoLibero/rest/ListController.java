package br.com.fateczl.ProjetoLibero.rest;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("list")
public class ListController {

    @GetMapping
    public List<String> getList() {
        return List.of("Enem 2022", "Medicina", "Probabilidade", "Economia", "Concurso Banco do Brasil");
    }

}