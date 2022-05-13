package br.com.fateczl.ProjetoLibero.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("listaassuntos")
public class ListaAssuntosController {
	
	@Autowired
	AssuntoDao aDao;

	@GetMapping
    public List<Assunto> getListAssunto() {
		List<Assunto> listaAssuntos = new ArrayList<Assunto>();
        String erro = "";
		try {
			listaAssuntos = aDao.listaAssuntos();
			//System.out.println(listaAssuntos);
		} catch (ClassNotFoundException | SQLException e) {
			erro = e.getMessage();
		} 
		return listaAssuntos;
    }
}


