package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Roadmap;

public interface IRoadmapDao {

	List<Roadmap> listaRoadmaps() throws SQLException, ClassNotFoundException;

}
