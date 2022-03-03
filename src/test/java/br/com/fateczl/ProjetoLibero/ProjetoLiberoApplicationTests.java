package br.com.fateczl.ProjetoLibero;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;
import br.com.fateczl.ProjetoLibero.persistence.RoadmapDao;
import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.model.Roadmap;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ProjetoLiberoApplicationTests {
	
	@Autowired
	AssuntoDao aDao;
	
	@Autowired
	RoadmapDao rDao;
	
	@Test
	public void contextLoads() {
		
		List<Assunto> listaAssuntos = new ArrayList<Assunto>();
		List<Roadmap> listaRoadmaps = new ArrayList<Roadmap>();
		
		try {
			
			listaAssuntos = aDao.listaAssuntos();
			listaRoadmaps = rDao.listaRoadmaps();
			
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			System.out.println(listaAssuntos.toString());
			System.out.println(listaRoadmaps.toString());
			
		}
	}

}
