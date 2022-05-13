package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Roadmap;

public interface IRoadmapDao {

	List<Roadmap> listaRoadmaps() throws SQLException, ClassNotFoundException;

	String insertRoadmap(Roadmap r) throws SQLException;

	String updateRoadmap(Roadmap r) throws SQLException;

	String deleteRoadmap(Roadmap r) throws SQLException;

}
