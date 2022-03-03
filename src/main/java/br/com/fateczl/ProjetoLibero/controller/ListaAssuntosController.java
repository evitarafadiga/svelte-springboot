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

@Controller
public class ListaAssuntosController {
	
	@Autowired
	AssuntoDao aDao;
	
	@RequestMapping (name = "listaassuntos", value = "/listaassuntos", method = RequestMethod.GET)
	public ModelAndView init(ModelMap model) {
		List<Assunto> listaAssuntos = new ArrayList<Assunto>();
		
		String erro = "";
		try {
			listaAssuntos = aDao.listaAssuntos();
			
		} catch (ClassNotFoundException | SQLException e) {
			erro = e.getMessage();
		} finally {
			model.addAttribute("listaAssuntos", listaAssuntos);
			model.addAttribute("erro", erro);
		}
		
		return new ModelAndView("listaassuntos");
	}
	
	@RequestMapping (name = "listaassuntos", value = "/listaassuntos", method = RequestMethod.POST)
	public ModelAndView op(ModelMap model) {
		return new ModelAndView("listaassuntos");
	}
}
