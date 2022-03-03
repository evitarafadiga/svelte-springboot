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

import br.com.fateczl.ProjetoLibero.model.Roadmap;
import br.com.fateczl.ProjetoLibero.persistence.RoadmapDao;

@Controller
public class ListaRoadmapsController {

	@Autowired
	RoadmapDao rDao;

	@RequestMapping(name = "listaroadmaps", value = "/listaroadmaps", method = RequestMethod.GET)
	public ModelAndView init(ModelMap model) {
		List<Roadmap> listaRoadmaps = new ArrayList<Roadmap>();
		
		String erro = "";
		try {
			listaRoadmaps = rDao.listaRoadmaps();
		
		} catch (ClassNotFoundException | SQLException e) {
			erro = e.getMessage();
		} finally {
			model.addAttribute("listaRoadmaps", listaRoadmaps);
			model.addAttribute("erro", erro);
		}
	
		return new ModelAndView("listaroadmaps");
	}
	
	@RequestMapping (name = "listaroadmaps", value = "/listaroadmaps", method = RequestMethod.POST)
	public ModelAndView op(ModelMap model) {
		return new ModelAndView("listaroadmaps");
	}
}
