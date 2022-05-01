package br.com.fateczl.ProjetoLibero.controller.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fateczl.ProjetoLibero.persistence.RoadmapDao;

@RestController
@RequestMapping("roadmap")
public class RoadmapsController {
	
	@Autowired
	RoadmapDao rDao;
	
	@PostMapping
	public void insUpdDel() {
		// TODO Auto-generated method stub

	}

}
