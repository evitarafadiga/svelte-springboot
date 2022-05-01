package br.com.fateczl.ProjetoLibero.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

@RestController
@RequestMapping("listaassuntos")
public class AssuntoController {
	
	@Autowired
	AssuntoDao aDao;
	
	@PostMapping(path = "listaassuntos")
	public Assunto op(@RequestBody Assunto assuntos) {
		
		List<Assunto> listaAssuntos = new ArrayList<Assunto>();
		int cod = assuntos.getId();
		String cmd = "";
		
		return assuntos;
	}
	
}
