package br.com.fateczl.ProjetoLibero.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainControler {

    @GetMapping("")
    public String index(Model model) { 
        return "index";
    }

}