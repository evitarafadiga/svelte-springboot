package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Vertice;

public interface IVerticeAssuntoDao {

	String deleteVerticeAssunto(Vertice v) throws SQLException;

	String updateVerticeAssunto(Vertice v) throws SQLException;

	String insertVerticeAssunto(Vertice v) throws SQLException;

	List<Vertice> listaVerticeAssunto() throws SQLException, ClassNotFoundException;

}
